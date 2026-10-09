import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { PRODUCTS, isProductId } from "@/lib/products";
import { INTAKE_FIELDS, INTAKE_PRODUCTS } from "@/lib/intake";

// Emails the intake answers to James. Only accepted for a paid deposit session.

const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 10 * 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n += 1;
  return h.n > 5;
}

const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
const clip = (v: unknown, n: number) => (Array.isArray(v) ? v.map((x) => String(x).slice(0, 60)).slice(0, 20).join(", ") : String(v ?? "").slice(0, n)).trim();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many submissions. Wait a few minutes and try again." }, { status: 429 });

  let body: { sessionId?: unknown; values?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const sessionId = String(body.sessionId ?? "");
  const values = body.values ?? {};
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return NextResponse.json({ error: "Invalid link" }, { status: 400 });

  const stripe = getStripe();
  const apiKey = process.env.RESEND_API_KEY;
  if (!stripe || !apiKey) return NextResponse.json({ error: "The form isn't connected yet. Email flu.wop@gmail.com directly." }, { status: 503 });

  let productName = "";
  try {
    const s = await stripe.checkout.sessions.retrieve(sessionId);
    const id = s.metadata?.product;
    if (s.payment_status !== "paid" || !isProductId(id) || !(INTAKE_PRODUCTS as readonly string[]).includes(id)) {
      return NextResponse.json({ error: "No paid deposit found for this link." }, { status: 403 });
    }
    productName = PRODUCTS[id].name;
  } catch {
    return NextResponse.json({ error: "No paid deposit found for this link." }, { status: 403 });
  }

  const name = clip(values.name, 100);
  const email = clip(values.email, 200);
  if (!name || !/^[^\s@<>"'&]+@[^\s@<>"'&]+\.[^\s@<>"'&]+$/.test(email)) {
    return NextResponse.json({ error: "Add your name and a valid email." }, { status: 400 });
  }

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", clip(values.phone, 40)],
    ...INTAKE_FIELDS.map((f) => [f.label, clip(values[f.id], 2000)]),
  ].filter(([, v]) => v);

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const FROM = process.env.RESEND_FROM_EMAIL ? `IN-FLU-ENTIAL LLC <${process.env.RESEND_FROM_EMAIL}>` : "IN-FLU-ENTIAL LLC <onboarding@resend.dev>";
  const sent = await resend.emails.send({
    from: FROM,
    to: process.env.BOOKING_TO_EMAIL || "flu.wop@gmail.com",
    replyTo: email,
    subject: `Project intake — ${clip(values.business, 100) || name} (${productName.replace(" — 50% Deposit", "")})`,
    html: `<div style="font-family:sans-serif;max-width:640px">
      <h2 style="font-weight:400">Project intake: ${esc(productName)}</h2>
      <table style="border-collapse:collapse;width:100%">${rows
        .map(([k, v]) => `<tr><td style="padding:8px 12px 8px 0;vertical-align:top;color:#777;font-size:12px;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0;font-size:14px">${esc(v).replace(/\n/g, "<br/>")}</td></tr>`)
        .join("")}</table>
      <p style="color:#999;font-size:11px">Stripe session ${esc(sessionId)}</p></div>`,
  });
  if (sent.error) {
    console.error("Intake email failed:", sent.error);
    return NextResponse.json({ error: "That didn't send. Try again, or email flu.wop@gmail.com." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
