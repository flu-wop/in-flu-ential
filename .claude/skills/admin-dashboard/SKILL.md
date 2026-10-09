---
name: admin-dashboard
description: James Afflu's standard system-health admin panel for any Next.js site on the booking-system stack. Use this skill ANY time a site needs an admin dashboard, system status page, or health-check panel — e.g. "add an admin dashboard to [site]", "give it the epoch skin admin page", "I want env var / webhook / API status like epoch skin", "build the admin panel", "add product sync", or any task involving a `/admin/system` or `/admin/dashboard` route. Covers four standard panels — Env Var Status, Webhook Health, API Usage, and Product Sync (conditional on the site having products) — built as one shared module so it's a drop-in, not a rebuild, across Epoch Skin, Jade the Gem, MCS, Flu-Haul, EGOFF, and any future site. Reach for this whenever James wants visibility into whether a site's integrations are actually working, even if he doesn't name the panels individually.
---

# Admin Dashboard

The standard system-health admin panel for James's Next.js sites. One shared module, four panels, built the same way every time. Lives alongside (not instead of) the per-feature admin pages like `/admin/bookings` — this is the "is everything actually working" page, not the "here's my data" page.

## Who gets this

Any site on the `booking-system` stack (Turso + Stripe + Resend) qualifies for the first three panels. **Product Sync only renders if the site has a `products` table** — don't bolt a product panel onto a site that doesn't sell products (Jade the Gem, MCS, Doug Belote, Flu-Haul have no product catalog; Epoch Skin, EGOFF, and any Printify-backed merch site do).

| Site | Env Vars | Webhook Health | API Usage | Product Sync |
|---|---|---|---|---|
| Epoch Skin | yes | yes | yes | yes (Printify) |
| Jade the Gem | yes | yes | yes | no |
| MCS | yes | yes | yes | no |
| Flu-Haul | yes | yes | yes | no |
| EGOFF Essentials | yes | yes | yes | yes (Printify) — flat-HTML site, see note below |
| Doug Belote | yes | yes | yes | no |
| MVC Creations | yes | yes | yes | yes (own Stripe + Turso shop, no print-on-demand — check Stripe prices against the `products` table instead) |
| Fire on the Bayou | yes | yes | no | no (merch lives on MCS) |

For flat-HTML sites (EGOFF) there's no Next.js API layer to host the checks in — see `references/flat-html-variant.md` for the adapted approach before building on those.

## The four panels

### 1. Env Var Status
Reads `process.env` server-side and reports **presence only** (never the value) for every var the site depends on: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_PASSWORD`, plus any site-specific ones (`PRINTIFY_API_KEY`, `PRINTIFY_SHOP_ID`, etc.). Green check / red X per var. This is the single highest-value panel — most "the site is broken" moments trace back to a missing Vercel env var, and this catches it in one glance instead of a deploy-log hunt.

### 2. Webhook Health
Pings each integration's own API to confirm the connection is alive, and separately reports the **last received event** so a silent failure (webhook registered but not firing) is visible:
- **Stripe** — `stripe.webhookEndpoints.list()` to confirm the endpoint is registered + enabled, plus timestamp of the last row written to the bookings/orders table (a stale timestamp with recent traffic = webhook is broken even though Stripe thinks it's fine).
- **Resend** — lightweight API call (e.g. `domains.list()`) to confirm the API key works and the sending domain is verified. This is the check that would have caught the Resend-domain-unverified gap across the ecosystem sooner.
- **Turso** — `SELECT 1` to confirm the DB connection is live.

### 3. API Usage
Where the provider exposes it, pull real usage/quota (Resend send count this month, Stripe recent event volume). Where it doesn't, fall back to a self-tracked counter (increment a row in Turso on each outbound call) rather than leaving the panel blank. Purpose is catching a plan-limit wall before it silently drops emails or bookings, not building a full analytics product — keep this panel simple.

### 4. Product Sync (conditional)
Only for Printify-backed sites. Shows each product's sync status between Printify and the site's own `products` table (in sync / drifted / missing image), with a manual "Sync now" button that re-pulls from the Printify API. See `merch-infrastructure` context — this reuses the isolated Printify token pattern from `site-security`.

## Build order

1. **Confirm scope for this site** using the table above — don't build Product Sync if there's no `products` table.
2. **Read `nextjs-ecosystem`** first so the panel UI matches the site's design tokens.
3. **`lib/health-checks.ts`** — one function per check (`checkEnvVars()`, `checkStripe()`, `checkResend()`, `checkTurso()`, `checkProductSync()` if applicable). Each returns `{ status: 'ok' | 'warn' | 'error', detail: string }`. See `references/health-checks.md` for full code.
4. **`app/api/admin/health/route.ts`** — runs all checks server-side, returns JSON. Password-gated the same way as `/admin/bookings` (reuse `ADMIN_PASSWORD`, don't invent a second auth scheme).
5. **`app/admin/system/page.tsx`** — client page that fetches `/api/admin/health` and renders the four panel cards. See `references/dashboard-page.md` for full code.
6. **Auto-refresh** — poll every 60s client-side; don't hammer Stripe/Resend on every render.
7. **Wire it into the existing `/admin` nav** if the site already has an `/admin/bookings` page, so both panels are reachable from one place.

## Design pattern

Same dark/gold system as the rest of the ecosystem — this is an internal tool, not client-facing, so lean toward density over polish: a 2x2 (or 2x1 for sites without Product Sync) grid of cards, each with a status pill (green/yellow/red), a one-line summary, and an expandable detail row. No page reload needed to see current state.

## Reference files

- `references/health-checks.md` — full code for `lib/health-checks.ts` (all five check functions)
- `references/dashboard-page.md` — full code for the API route and the dashboard page component
- `references/flat-html-variant.md` — adapted approach for flat-HTML sites (EGOFF) with no Next.js API layer

## Output style

Same as every other skill in James's stack: complete files he can drop in, exact file paths, minimal explanation, git push commands at the end.
