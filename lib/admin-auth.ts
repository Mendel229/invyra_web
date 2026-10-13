import "server-only";

export const ADMIN_SESSION_COOKIE = "invyra_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12h

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Missing env: ADMIN_SESSION_SECRET");
  return secret;
}

export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

const PBKDF2_ITERATIONS = 210_000;

function toHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

async function derivePbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return toHex(bits);
}

/**
 * Hash un mot de passe au format "iterations:selHex:hashHex", à stocker
 * dans la variable d'environnement ADMIN_PASSWORD_HASH (jamais le mot de
 * passe en clair). Utilisé par scripts/hash-admin-password.mjs.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `${PBKDF2_ITERATIONS}:${toHex(salt)}:${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [iterationsRaw, saltHex, hashHex] = stored.split(":");
  const iterations = Number(iterationsRaw);
  if (!iterations || !saltHex || !hashHex) return false;
  const candidate = await derivePbkdf2(password, fromHex(saltHex), iterations);
  return constantTimeEqual(candidate, hashHex);
}

async function hmacHex(data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Jeton de session signé (HMAC), sans état côté serveur. */
export async function createAdminSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  const sig = await hmacHex(payload);
  return `${payload}.${sig}`;
}

export async function isValidAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = await hmacHex(payload);
  if (!constantTimeEqual(expected, sig)) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}
