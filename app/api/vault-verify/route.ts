import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { VAULT_COOKIE, vaultToken } from "@/lib/vault-access";

// VAULT_PASSWORD is a server-only env var. There is deliberately no fallback:
// if it isn't set, the vault stays closed rather than opening to a default.
// Best-effort per-instance limiter: 5 attempts per 15 minutes per IP.
const attempts = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now();
  const a = attempts.get(ip);
  if (!a || now - a.t > 15 * 60_000) {
    attempts.set(ip, { n: 1, t: now });
    return false;
  }
  a.n += 1;
  return a.n > 5;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json({ unlocked: false, error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }
  const secret = process.env.VAULT_PASSWORD;
  const token = vaultToken();
  if (!secret || !token) {
    return NextResponse.json({ unlocked: false, error: "Vault is not configured" }, { status: 503 });
  }
  try {
    const { password } = await req.json();
    if (typeof password !== "string") {
      return NextResponse.json({ unlocked: false }, { status: 400 });
    }
    const a = Buffer.from(password);
    const b = Buffer.from(secret);
    const unlocked = a.length === b.length && timingSafeEqual(a, b);

    if (!unlocked) {
      // Small delay to slow down brute-force guessing.
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json({ unlocked: false }, { status: 401 });
    }

    const res = NextResponse.json({ unlocked: true });
    res.cookies.set(VAULT_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return res;
  } catch {
    return NextResponse.json({ unlocked: false }, { status: 400 });
  }
}
