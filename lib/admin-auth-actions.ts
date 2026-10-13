"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  constantTimeEqual,
  createAdminSessionToken,
  verifyPassword,
} from "@/lib/admin-auth";

export async function loginAdminAction(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin/templates");
  const safeNext = next.startsWith("/admin") ? next : "/admin/templates";

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUsername || !expectedPasswordHash) {
    throw new Error("Missing env: ADMIN_USERNAME / ADMIN_PASSWORD_HASH");
  }

  const usernameOk = Boolean(username) && constantTimeEqual(username, expectedUsername);
  const passwordOk = Boolean(password) && (await verifyPassword(password, expectedPasswordHash));

  if (!usernameOk || !passwordOk) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(safeNext)}`);
  }

  const token = await createAdminSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect(safeNext);
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
