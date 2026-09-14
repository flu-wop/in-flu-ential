import { NextRequest, NextResponse } from "next/server";

// Server-only env var — never exposed to the client bundle, unlike the
// previous NEXT_PUBLIC_VAULT_PASSWORD which shipped the password in
// plaintext to every visitor's browser.
const VAULT_PASSWORD = process.env.VAULT_PASSWORD || "influential2024";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (typeof password !== "string") {
      return NextResponse.json({ unlocked: false }, { status: 400 });
    }

    const unlocked = password === VAULT_PASSWORD;

    if (!unlocked) {
      // Small delay to slow down brute-force guessing without being annoying
      // for a real attempt.
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json({ unlocked: false }, { status: 401 });
    }

    const res = NextResponse.json({ unlocked: true });
    // Session-only cookie so a refresh doesn't re-prompt during the same visit.
    res.cookies.set("vault_access", "granted", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ unlocked: false }, { status: 400 });
  }
}
