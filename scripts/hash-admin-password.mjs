// Génère la valeur à mettre dans ADMIN_PASSWORD_HASH (.env.local).
// Usage : node scripts/hash-admin-password.mjs "mon-nouveau-mot-de-passe"
import { webcrypto as crypto } from "node:crypto";

const PBKDF2_ITERATIONS = 210_000;

function toHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return `${PBKDF2_ITERATIONS}:${toHex(salt)}:${toHex(new Uint8Array(bits))}`;
}

const password = process.argv[2];
if (!password) {
  console.error('Usage : node scripts/hash-admin-password.mjs "mon-mot-de-passe"');
  process.exit(1);
}

const hash = await hashPassword(password);
console.log("\nAjoute cette ligne dans invyra_web/.env.local :\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
