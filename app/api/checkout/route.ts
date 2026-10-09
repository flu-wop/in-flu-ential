import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { PRODUCTS, isProductId } from "@/lib/products";

// Creates an embedded Stripe Checkout session. The amount comes from
// lib/products.ts, never from the request.

// Best-effort per-instance limiter (same approach as the inquiry route).
// Serverless instances don't share memory, so this only slows bursts.
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 10 * 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n += 1;
  return h.n > 10;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many attempts. Wait a few minutes and try again." }, { status: 429 });

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Checkout isn't connected yet." }, { status: 503 });

  let product: unknown;
  try {
    product = (await req.json())?.product;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!isProductId(product)) return NextResponse.json({ error: "Unknown product" }, { status: 400 });
  const p = PRODUCTS[product];
  if (!p.available) return NextResponse.json({ error: "That isn't available yet." }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: p.cents,
            product_data: { name: p.name, description: p.description },
          },
        },
      ],
      customer_creation: "always",
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      metadata: { product },
      return_url: `${req.nextUrl.origin}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("Checkout session error:", err);
    return NextResponse.json({ error: "Checkout couldn't start. Try again, or email flu.wop@gmail.com." }, { status: 502 });
  }
}
