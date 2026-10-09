import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

// Kit download. Only a paid Stripe session for the starter kit gets
// redirected to the file. The file itself lives outside this public repo:
// set KIT_DOWNLOAD_URL in Vercel (Vercel Blob, Dropbox or Drive link).
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id") ?? "";
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId) || sessionId.length > 200) {
    return NextResponse.json({ error: "Invalid link" }, { status: 400 });
  }
  const stripe = getStripe();
  const url = process.env.KIT_DOWNLOAD_URL;
  if (!stripe || !url) {
    return NextResponse.json({ error: "The download isn't ready yet. Email flu.wop@gmail.com and it'll be sent to you." }, { status: 503 });
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid" || session.metadata?.product !== "starter-kit") {
      return NextResponse.json({ error: "No paid kit purchase found for this link." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "No paid kit purchase found for this link." }, { status: 403 });
  }
  return NextResponse.redirect(url, 302);
}
