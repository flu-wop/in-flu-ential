---
name: merch-infrastructure
description: >
  James Afflu's MCS merch infrastructure — a single Printify store serving multiple
  brands (MCS, DJM, Streetbeat, Lil Squiggle, Fire on the Bayou) with Stripe checkout and blind fulfillment.
  Use this skill ANY time the task involves adding a merch product, setting up a new
  brand's storefront, debugging checkout/fulfillment, or extending the merch system to a
  new site — e.g. "add a new MCS merch item", "set up merch for [brand]", "why didn't
  this order fulfill", or any mention of Printify, blind fulfillment, or the
  [brand:type] product naming convention. The print-on-demand provider is Printify only.
---

# Merch Infrastructure

A single centralized merch backend serving multiple brand-fronted storefronts. One
Printify store, one Stripe integration, products routed to the right brand's site by a
naming convention — not four separate merch systems.

## Stack

| Layer | Choice |
|---|---|
| Print-on-demand | **Printify** — the only provider in this system; use Printify's own API docs and dashboard |
| Payments | Stripe Checkout |
| Fulfillment | Blind — customer never sees Printify branding on packaging/paperwork |
| Commerce home | Centralized in the MCS repo (see `nextjs-ecosystem` — "Commerce is centralized here": Printify + Stripe + CartProvider + webhooks live only in the MCS repo) |

## Brands served (MVP launched with 8 products across the first 4 brands)

- **MCS** (Mid City Sound)
- **DJM** (Donald Markowitz)
- **Streetbeat**
- **Lil Squiggle**
- **Fire on the Bayou** — added Aug 2026; its site footer and About page link to `midcitysound.com/merch` ("Wear the fire"), no separate commerce on fireonthebayou.com

Brand sites don't run their own merch backend — they copy `lib/cart.ts` from MCS (shares
the `mcs_cart` localStorage key) and link out to `midcitysound.com/merch` for the actual
storefront/checkout. Adding a new brand to merch means adding it to the MCS product
catalog, not building a parallel system.

## Product naming convention

Products are parsed by a `[brand:type]` prefix so the single Printify catalog can be
filtered/routed per storefront (e.g. a Lil Squiggle product on the shared catalog is
tagged so the Lil Squiggle site only shows Lil Squiggle merch, even though it's all one
Printify store behind the scenes).

**Don't key this routing off a human-editable product title alone** — per the
`site-audit` skill's "business logic keyed off human-editable text" lesson, if the
`[brand:type]` tag lives only in a freely-renamable title, a future rename (in Printify's
dashboard, by anyone) silently breaks brand routing with no error. Prefer a stable field
(a Printify product ID → brand mapping, or a tag/metadata field not exposed to casual
editing) with the title-parsing kept only as a fallback.

## Adding a new product

1. Create the product in the Printify dashboard, following `[brand:type]` naming
2. Confirm it syncs into the site's product data (check the relevant site's product
   fetch logic — see `admin-dashboard`'s Product Sync panel if the site has one)
3. Verify pricing is server-derived at checkout, never trusted from the client (see
   `site-security` — prices live on the server, always)
4. Test one full order end-to-end (checkout → Stripe → Printify fulfillment trigger)
   before considering it live

## Fulfillment

Blind fulfillment means Printify ships without their own branding — verify this is
actually configured per-product in Printify (it's a per-product/store setting, not
automatic) before assuming every new product inherits it correctly.

## Troubleshooting an order that didn't fulfill

1. Confirm the Stripe webhook actually fired and was verified (signature + idempotency —
   see `site-security`)
2. Confirm the order was actually submitted to Printify's API after payment succeeded —
   check for a silently-swallowed error in that submission step (a bare `catch` that only
   logs is a known failure pattern, see `site-audit` — "silent failure paths")
3. Check Printify's own dashboard for the order status directly rather than trusting only
   what the site's DB says — a failure between "payment succeeded" and "Printify
   accepted the order" is exactly the kind of gap that goes unnoticed without surfacing
   it (email/notification), not just logging it

## Reference

Print-on-demand env vars are always named `PRINTIFY_API_KEY` / `PRINTIFY_SHOP_ID`. Any
other provider name in code or docs is leftover from an old note — rename it to the
Printify names and point it at Printify's API rather than assuming it's correct. One token
per storefront/brand where feasible, per `site-security`'s token isolation rule — don't
consolidate to one shared key across all four brands if it can be avoided.

## Output style

Complete files, exact paths, minimal explanation — same as the rest of James's stack.
