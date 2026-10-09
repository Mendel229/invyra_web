"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  constantTimeEqual,
  createAdminSessionToken,
} from "@/lib/admin-auth";

export async function loginAdminAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin/templates");
  const safeNext = next.startsWith("/admin") ? next : "/admin/templates";

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("Missing env: ADMIN_PASSWORD");

  if (!password || !constantTimeEqual(password, expected)) {
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
