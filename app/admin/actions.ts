"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, checkPassword, sessionToken } from "@/lib/admin-auth";

const attempts = new Map<string, { n: number; reset: number }>();

export async function loginAction(_prev: { error?: string } | undefined, form: FormData) {
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "unknown").trim();
  const now = Date.now();
  const a = attempts.get(ip);
  if (a && a.reset > now && a.n >= 8) return { error: "Too many tries. Wait a few minutes." };
  attempts.set(ip, a && a.reset > now ? { n: a.n + 1, reset: a.reset } : { n: 1, reset: now + 10 * 60_000 });

  const t = sessionToken();
  if (!t) return { error: "ADMIN_PASSWORD isn't set on this deployment yet." };
  if (!checkPassword(String(form.get("password") ?? ""))) return { error: "Wrong password." };

  (await cookies()).set(ADMIN_COOKIE, t, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin/system");
}

export async function logoutAction() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/system");
}
