---
name: booking-system
description: Complete reference for building James Afflu's standard booking + payment system on any Next.js 16 site. Use this skill ANY time a site needs appointment booking, studio/session booking, event booking, a paid reservation flow, calendar blocking, or a rent/buy paywall — e.g. "add booking to [site]", "build the booking system", "wire up Stripe checkout", "set up the studio booking", "add a calendar feed", or any task involving Turso, Resend confirmation emails, .ics calendar invites, or a /admin/bookings panel. This is the exact stack used on Epoch Skin, Jade the Gem, MCS, and Flu-Haul, so reach for it whenever payments + scheduling + email confirmations come up together, even if the user doesn't name the stack.
---

# Booking System

The standard booking + payment stack for James's Next.js sites. Build it the same way every time so it's predictable and debuggable.

## The stack (never substitute without a reason)

- **Next.js 16 App Router** (16.2.6+, Turbopack) + TypeScript + Tailwind
- **Turso** (libSQL) — one **separate database per site** (e.g. `epoch-skin-bookings`, `jade-the-gem-bookings`). Never share a DB between sites.
- **Stripe** — Checkout Sessions + a webhook for fulfillment
- **Resend** — confirmation emails with a `.ics` attachment
- **`ics`** npm package — generates the calendar invite

## The flow (memorize this)

```
Booking form  →  POST /api/checkout  →  Stripe Checkout (hosted)
     →  webhook /api/stripe/webhook (checkout.session.completed)
     →  save row to Turso  →  Resend email + .ics to client AND owner
     →  success page
Owner sees everything at /admin/bookings  +  live feed at /api/calendar.ics
```

Money is taken **before** the row is saved. The webhook is the source of truth — a booking only becomes real when Stripe confirms payment. Don't save pending rows from the form.

## Build order

Follow this sequence. Each step is small and verifiable so you never debug five things at once.

1. **Read the design system.** This site is part of James's ecosystem — read the `nextjs-ecosystem` skill first so the booking UI matches (colors `#090909`/`#111111`/`#D4AF77`/`#F5EDD8`/`#A89880`, Cormorant Garamond / DM Sans). For a flat-HTML site, the booking flow lives in its own Next.js repo, not the HTML file.
2. **DB + client.** Create `lib/db.ts` with the lazy-init pattern and the `bookings` table. See `references/db-schema.md`.
3. **Checkout route.** `app/api/checkout/route.ts` — builds the Stripe session, passes booking details in `metadata`. See `references/api-routes.md`.
4. **Webhook.** `app/api/stripe/webhook/route.ts` — verifies signature, saves the row, fires the email. See `references/api-routes.md`.
5. **Emails + .ics.** `lib/email.ts` and `lib/ical.ts`. See `references/emails-ical.md`.
6. **Calendar feed.** `app/api/calendar.ics/route.ts` — live subscribable feed of all bookings. See `references/api-routes.md`.
7. **Admin panel.** `app/admin/bookings/page.tsx` — password-gated table. See `references/api-routes.md`.
8. **Booking form** — the client-facing UI (service/date/time/contact steps). Match the site.
9. **Env vars + accounts.** Walk James through Turso/Resend/Stripe setup and the Vercel env vars. See `references/env-and-deploy.md`.

## The one principle that prevents most failures: lazy init

Every external client (Turso, Stripe, Resend) must be created **inside a function**, never at module top-level. If you do `export const db = createClient({ url: process.env.TURSO_URL! })` at the top of a file, the build crashes on Vercel because env vars aren't present at build time, and you get phantom "nothing to commit" / failed-deploy loops.

Always:

```ts
let _db: Client | null = null;
export function getDb() {
  if (_db) return _db;
  _db = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });
  return _db;
}
```

Same shape for Stripe and Resend. This single pattern fixes the majority of the build failures from past sessions.

## Env var checklist (all go in Vercel → Settings → Environment Variables)

```
TURSO_DATABASE_URL
TURSO_AUTH_TOKEN
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY        # NEXT_PUBLIC_ if used client-side
STRIPE_WEBHOOK_SECRET         # from Stripe Dashboard → Webhooks → Add endpoint
RESEND_API_KEY
RESEND_FROM_EMAIL             # onboarding@resend.dev until the domain is verified
RESEND_TO_EMAIL               # the owner (Kayla, Donny, etc.)
NEXT_PUBLIC_SITE_URL          # https://thesite.com — used in success redirect + emails
ADMIN_PASSWORD                # gate for /admin/bookings
```

If a booking or checkout "fails" with no obvious code error, it is almost always a missing env var. Check this list first. See `references/troubleshooting.md` for the full error → fix playbook.

## Discount codes

Validate **server-side only**, never in the client bundle. Each site has its own code (Epoch: none, Jade: `HIDDEN50`, Flu-Haul: `REGULAR20`). Keep a small map in the checkout route and apply the discount to `amount_cents` before creating the Stripe session.

## Prices come from the server, never the browser

The checkout route looks up every price (service, product, deposit) from a server-side
map or the database by ID. The client only sends IDs and quantities — never an amount.
A checkout that trusts a client-sent price lets anyone pay $1 for anything (MVC
Creations shipped that way and had to be flagged before real payments).

## When the client already has a booking or payment system

Not every client gets this stack. Respect what they already run:
- **Acuity** (MVC Creations) — embed their scheduler iframe; don't rebuild booking
  until the client agrees to drop it.
- **Square** (Liquid Gold) or **Clover** (Bourbon Daiquiris) — payments go through
  their POS, not Stripe.
- **Zelle off-site** (Fire on the Bayou project payments) — no on-site checkout for
  the project itself; the site's own Stripe CTA is a separate product (the consult).

## Reference files

- `references/db-schema.md` — Turso lazy-init client + `bookings`/`newsletter` table schema
- `references/api-routes.md` — checkout, webhook, calendar feed, admin panel (full code)
- `references/emails-ical.md` — Resend send + `ics` generation
- `references/env-and-deploy.md` — account setup, env vars, deploy, and the client-facing iCal subscribe instructions
- `references/troubleshooting.md` — the recurring errors and their fixes

## Output style

James prefers complete files he can drop in, with minimal explanation. Output the full file, name the exact path it goes to (`app/api/checkout/route.ts`), then commit and push (git is connected through the desktop app — no tokens); give the commands instead only from a session without git access. Don't over-explain unless a structural reason requires it.
