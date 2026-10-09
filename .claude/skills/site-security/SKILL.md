---
name: site-security
description: Security hardening standard for every James Afflu Next.js site (Epoch Skin, Jade the Gem, MCS, Flu-Haul, and all future builds on the booking-system stack). Use this skill ANY time you touch an API route, Stripe checkout or webhook, Resend email endpoint, admin panel, newsletter signup, or Printify integration - and whenever James says "harden", "security", "rate limit", "lock down", "someone is spamming the form", "audit the site", or a new site is about to launch. Every new API route MUST pass the checklist in this skill before deploy. Covers the Turso-backed rate limiter, Stripe webhook verification with idempotency, server-side pricing, security headers, admin auth, Printify token isolation, privacy policy requirement, and the public-repo secrets rule.
---

# Site Security

The hardening standard. Every site on the booking-system stack ships with ALL of this. The July 2026 audit scored the portfolio 6.5/10 - this skill is what closes the gap and keeps it closed.

## The 5 rules (memorize)

1. **Prices live on the server.** The client sends a service ID, never an amount. A checkout route that trusts `amount` from the request body is a free-merchandise endpoint.
2. **Webhooks verify signatures and are idempotent.** No signature check = anyone can POST fake "paid" events. No idempotency = Stripe retries create duplicate bookings and duplicate emails.
3. **Every write endpoint is rate limited.** Checkout, newsletter signup, contact forms, admin login. Unlimited Resend endpoints = someone burns the email quota and gets the domain flagged for spam.
4. **Repos are PUBLIC (flu-wop). A secret in the repo is a leaked secret.** Env vars only, ever. If a key was EVER committed - even deleted later - it lives in git history: rotate it immediately.
5. **One token per surface.** One Printify token per storefront, one Turso DB + token per site, one Resend key per site where possible. A leak then costs one site, not four.

## Rate limiter (no new dependencies - Turso-backed)

In-memory limiters die on serverless (each invocation is a fresh instance). Use the site's existing Turso DB.

`lib/rate-limit.ts`:
```ts
import { getDb } from "./db";

// Fixed window. key = `${route}:${ip}`. Returns true if allowed.
export async function rateLimit(key: string, limit: number, windowSecs: number): Promise<boolean> {
  const db = getDb();
  const windowStart = Math.floor(Date.now() / 1000 / windowSecs) * windowSecs;
  await db.execute({
    sql: `CREATE TABLE IF NOT EXISTS rate_limits (k TEXT, w INTEGER, c INTEGER, PRIMARY KEY (k, w))`,
    args: [],
  });
  const r = await db.execute({
    sql: `INSERT INTO rate_limits (k, w, c) VALUES (?, ?, 1)
          ON CONFLICT(k, w) DO UPDATE SET c = c + 1 RETURNING c`,
    args: [key, windowStart],
  });
  return Number(r.rows[0].c) <= limit;
}

export function clientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
}
```

Usage at the top of every write route:
```ts
const ok = await rateLimit(`checkout:${clientIp(req)}`, 10, 600); // 10 per 10 min
if (!ok) return new Response("Too many requests", { status: 429 });
```

Limits per route type: checkout 10/10min, newsletter signup 5/10min, contact form 5/10min, admin login 5/15min. Occasionally purge old windows: `DELETE FROM rate_limits WHERE w < unixepoch() - 86400`.

## Server-side pricing (checkout route)

```ts
const SERVICES: Record<string, { name: string; cents: number }> = {
  "session-2hr": { name: "2-Hour Studio Session", cents: 15000 },
  // ...defined HERE, never accepted from the client
};
const svc = SERVICES[body.serviceId];
if (!svc) return new Response("Unknown service", { status: 400 });
// discounts: validate code server-side, apply to svc.cents
```

Validate the rest of the payload manually (no new deps): email matches a basic regex, strings length-capped (name 100, notes 1000), date parses and is in the future. Reject otherwise with 400.

## Stripe webhook - verification + idempotency

```ts
import Stripe from "stripe";
export async function POST(req: Request) {
  const raw = await req.text(); // RAW body - do not JSON.parse first
  const sig = req.headers.get("stripe-signature");
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    // IDEMPOTENCY: session id is UNIQUE in the bookings table
    const r = await getDb().execute({
      sql: `INSERT OR IGNORE INTO bookings (stripe_session_id, ...) VALUES (?, ...)`,
      args: [s.id /* ... */],
    });
    if (r.rowsAffected === 0) return new Response("ok (duplicate)", { status: 200 });
    // only send emails when the row was actually inserted
  }
  return new Response("ok", { status: 200 });
}
```

Schema requirement: `stripe_session_id TEXT UNIQUE` on the bookings table. Existing sites: `CREATE UNIQUE INDEX IF NOT EXISTS idx_session ON bookings(stripe_session_id)`.

## Security headers + CORS (next.config)

API routes should NOT send `Access-Control-Allow-Origin: *`. Default Next.js API routes are same-origin; if any route added a wildcard, remove it. Only add CORS headers when a named external origin genuinely needs access, and name it explicitly.

`next.config.ts` headers for every site:
```ts
async headers() {
  return [{
    source: "/(.*)",
    headers: [
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ],
  }];
}
```

## Admin panel auth

- Never pass the password as a query param (it lands in logs and browser history). POST it once, set an httpOnly cookie.
- Compare with constant time:
```ts
import { timingSafeEqual } from "crypto";
function safeEq(a: string, b: string) {
  const A = Buffer.from(a), B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}
```
- Rate limit the login route (5/15min). Cookie: `httpOnly, secure, sameSite=strict, maxAge 8h`.

## Printify / third-party token isolation

One token per storefront (Fish Pot, BoomerHumor, Streetbeat, MCS merch each get their own), each stored only in that deployment's Vercel env. Name them `PRINTIFY_TOKEN` per project - never a shared `PRINTIFY_MASTER`. If the current shared token has been in use across four sites, rotate it and issue four scoped replacements.

## Privacy policy (required on every site that stores personal data)

Every booking/newsletter site collects name, email, phone, appointment details - that requires a `/privacy` page. Generate from this inventory: what is collected (form fields), why (fulfill the booking, send confirmations), where it lives (Turso, Stripe, Resend), who it's shared with (Stripe for payment, Resend for email, Printify for fulfillment + shipping address), retention (until deletion requested), contact email for deletion requests. Link it in the footer and next to every form submit button. No legal-advice claims - it's a disclosure page; anything unusual goes to a lawyer.

## Secrets hygiene (public repos)

- `.gitignore` MUST include `.env*` before the first commit of any new repo.
- Before any push: `git log --all --full-history -p -- "*.env*" | head` and grep the diff for `sk_live`, `re_`, `TURSO`. If anything ever landed in history, rotate that key at the provider TODAY - deleting the file does not unleak it.
- Claude Code global deny rule on .env reads stays on.

## Pre-deploy checklist (run for EVERY new or modified API route)

1. Rate limited? 2. Inputs validated + length-capped? 3. Price/amount server-derived? 4. Webhook signature verified + idempotent? 5. No wildcard CORS? 6. Security headers present? 7. Secrets only in env vars, .env gitignored? 8. Admin routes cookie-gated with constant-time compare? 9. Privacy page live and linked? 10. Errors return generic messages (no stack traces or SQL in responses)?

If any answer is no, the route does not ship.
