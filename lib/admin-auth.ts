import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Admin auth: one shared password (ADMIN_PASSWORD) -> signed, httpOnly cookie.
 * The cookie value is an HMAC of the password, so changing ADMIN_PASSWORD
 * signs everyone out. Always verified on the server.
 */
export const ADMIN_COOKIE = "ifl_admin";

function token(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHmac("sha256", pw).update("ifl-admin-session-v1").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  return safeEqual(
    createHmac("sha256", "cmp").update(input).digest("hex"),
    createHmac("sha256", "cmp").update(pw).digest("hex")
  );
}

export function sessionToken(): string | null {
  return token();
}

export async function isAdmin(): Promise<boolean> {
  const t = token();
  if (!t) return false;
  const c = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(c) && safeEqual(c as string, t);
}
