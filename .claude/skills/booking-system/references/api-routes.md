# API routes

Install: `npm install stripe`

All clients use lazy init. All routes that touch Stripe/DB must be `export const runtime = "nodejs"` (not edge) and the webhook must read the **raw** body.

## `lib/stripe.ts`

```ts
import Stripe from "stripe";

let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
  return _stripe;
}
```

## `app/api/checkout/route.ts`

Builds the Checkout Session. Booking details ride along in `metadata` so the webhook can save them after payment. Discount codes are validated here, server-side only.

```ts
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

// Per-site discount map. Empty object = no codes.
const DISCOUNTS: Record<string, number> = { /* HIDDEN50: 0.5, REGULAR20: 0.2 */ };

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, service, event_date, event_time, hours = 1, location, message, base_cents, discount_code } = body;

  let amount = base_cents as number;
  const code = (discount_code || "").toUpperCase();
  if (code && DISCOUNTS[code]) amount = Math.round(amount * (1 - DISCOUNTS[code]));

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: amount,
        product_data: { name: `${service} — ${event_date}${event_time ? " " + event_time : ""}` },
      },
    }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking?canceled=1`,
    customer_email: email,
    metadata: { name, email, phone: phone || "", service, event_date, event_time: event_time || "", hours: String(hours), location: location || "", message: message || "", discount_code: code, amount_cents: String(amount) },
  });

  return NextResponse.json({ url: session.url });
}
```

## `app/api/stripe/webhook/route.ts`

The source of truth. Verifies the signature against the **raw** body, saves the row, sends the emails. Set this URL in Stripe Dashboard → Webhooks → event `checkout.session.completed`.

```ts
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getDb, initDb } from "@/lib/db";
import { sendBookingEmails } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature")!;
  const raw = await req.text(); // RAW body — do not parse before verifying

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature failed: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as any;
    const m = s.metadata || {};
    await initDb();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO bookings (name,email,phone,service,event_date,event_time,hours,location,message,discount_code,amount_cents,stripe_session_id,status)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?, 'paid')`,
      args: [m.name, m.email, m.phone, m.service, m.event_date, m.event_time, Number(m.hours || 1), m.location, m.message, m.discount_code, Number(m.amount_cents), s.id],
    });
    try { await sendBookingEmails(m); } catch (e) { console.error("email failed", e); } // never fail the webhook on email error
  }

  return NextResponse.json({ received: true });
}
```

## `app/api/calendar.ics/route.ts`

Live feed of all paid bookings. The owner subscribes once and it stays synced (see `references/env-and-deploy.md` for subscribe steps).

```ts
import { getDb, initDb } from "@/lib/db";
import { buildCalendar } from "@/lib/ical";

export const runtime = "nodejs";

export async function GET() {
  await initDb();
  const db = getDb();
  const rows = await db.execute("SELECT * FROM bookings WHERE status='paid' ORDER BY event_date");
  const ics = buildCalendar(rows.rows as any[]);
  return new Response(ics, {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'inline; filename="bookings.ics"' },
  });
}
```

## `app/admin/bookings/page.tsx`

Password-gated server component. Reads `ADMIN_PASSWORD`; gate via a `?key=` query param or a simple cookie — keep it simple, this is an internal page.

```tsx
import { getDb, initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminBookings({ searchParams }: { searchParams: { key?: string } }) {
  if (searchParams.key !== process.env.ADMIN_PASSWORD) {
    return <main style={{ padding: 40, fontFamily: "system-ui" }}>Unauthorized. Append <code>?key=YOUR_PASSWORD</code>.</main>;
  }
  await initDb();
  const db = getDb();
  const rows = (await db.execute("SELECT * FROM bookings ORDER BY created_at DESC")).rows as any[];
  return (
    <main style={{ padding: 40, fontFamily: "system-ui", color: "#F5EDD8", background: "#090909", minHeight: "100vh" }}>
      <h1 style={{ color: "#D4AF77" }}>Bookings ({rows.length})</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}>
        <thead><tr style={{ textAlign: "left", color: "#A89880" }}>
          <th>Date</th><th>Service</th><th>Name</th><th>Email</th><th>Phone</th><th>Paid</th><th>Booked</th>
        </tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderTop: "1px solid #222" }}>
              <td>{r.event_date} {r.event_time}</td><td>{r.service}</td><td>{r.name}</td>
              <td>{r.email}</td><td>{r.phone}</td><td>${(r.amount_cents / 100).toFixed(2)}</td><td>{r.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
```
