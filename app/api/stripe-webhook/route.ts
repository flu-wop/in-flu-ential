import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { PRODUCTS, isProductId } from "@/lib/products";
import { SITE_URL } from "@/lib/site-url";

// Tells James about every payment, and emails kit buyers their download link
// so they have it even if they close the confirmation page.
// Setup: add an endpoint in Stripe for checkout.session.completed pointing at
// /api/stripe-webhook, then set STRIPE_WEBHOOK_SECRET in Vercel.

const seen = new Set<string>(); // best-effort dedupe for Stripe retries

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const raw = await req.text(); // raw body for signature verification
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, req.headers.get("stripe-signature") ?? "", secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") return NextResponse.json({ ok: true });
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid" || seen.has(session.id)) return NextResponse.json({ ok: true });
  seen.add(session.id);

  const id = session.metadata?.product;
  const product = isProductId(id) ? PRODUCTS[id] : null;
  const amount = ((session.amount_total ?? 0) / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
  const c = session.customer_details;
  const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Payment received but RESEND_API_KEY is not set; no email sent", session.id);
    return NextResponse.json({ ok: true });
  }
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const FROM = process.env.RESEND_FROM_EMAIL ? `IN-FLU-ENTIAL LLC <${process.env.RESEND_FROM_EMAIL}>` : "IN-FLU-ENTIAL LLC <onboarding@resend.dev>";
  const TO = process.env.BOOKING_TO_EMAIL || "flu.wop@gmail.com";

  const owner = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: c?.email ?? undefined,
    subject: `Payment received — ${product?.name ?? "Checkout"} (${amount})`,
    html: `<div style="font-family:sans-serif;max-width:560px">
      <h2 style="font-weight:400">${esc(product?.name ?? "Payment")} — ${esc(amount)}</h2>
      <p>${esc(c?.name)}<br/>${esc(c?.email)}<br/>${esc(c?.phone)}</p>
      <p style="color:#777;font-size:12px">Stripe session ${esc(session.id)}</p></div>`,
  });
  if (owner.error) console.error("Payment notification email failed:", owner.error);

  if (id === "starter-kit" && c?.email) {
    const link = `${SITE_URL}/api/kit?session_id=${session.id}`;
    const buyer = await resend.emails.send({
      from: FROM,
      to: c.email,
      subject: "Your website starter kit",
      html: `<div style="font-family:sans-serif;max-width:560px">
        <h2 style="font-weight:400">Thanks for buying the starter kit.</h2>
        <p><a href="${esc(link)}">Download the kit</a>. This link works any time for your purchase.</p>
        <p>Questions? Reply to this email or write to flu.wop@gmail.com.</p></div>`,
    });
    if (buyer.error) console.error("Kit email failed:", buyer.error);
  }

  return NextResponse.json({ ok: true });
}
