---
name: site-audit
description: "Full-repo bug and security audit for any of James Afflu's Next.js sites (MCS, Fire on the Bayou, Doug Belote, Epoch Skin, Jade the Gem, Flu-Haul, or any future site on the booking-system stack). Use this ANY time James asks to find bugs, audit the site, check for issues, figure out what's broken, ask if anything else is wrong, clean things up, make sure something actually works, or before showing/launching a site to a client -- even if he doesn't use the word audit. Also trigger proactively after a long debugging session on one feature area, to check whether the same class of bug exists elsewhere in the codebase. This is a methodology skill -- it doesn't fix one bug, it finds the ones nobody's looking for yet."
---

# Site Audit

The methodology that found ~15 real, live bugs in the MCS merch section in a
single session — most invisible until someone actually clicked the wrong
thing or read the actual code instead of trusting a filename or comment.
Nothing here is exotic. It's a discipline: read everything, verify against
real data, don't assume prior code is correct just because it compiles.

## Ground rules

- **Read the actual file, every time.** Don't infer behavior from a function
  name, a comment, or what a similar file usually does. `getProductsWithPrices`
  sounds like it fetches products with prices — it also silently capped the
  catalog at 24 items forever. The bug was one line away from the docstring
  that described the opposite behavior.
- **Verify against real data, not assumptions.** If a bug report says "some
  items are missing" — don't guess why. Pull the real API response (with real
  credentials, real IDs) and diff it against what the site shows. Every fix
  in the MCS session came from a real API call or a real rendered page, not
  a hunch.
- **An `any` cast or `@ts-ignore` is a confession, not a workaround.** If code
  had to cast to `any` to access a field, that's a strong signal the type
  doesn't actually exist anymore — which is exactly what happened with
  Stripe's `shipping_details` field moving to `collected_information` in an
  API update. Treat every `any` cast in the codebase as an open question, not
  settled code.
- **Full production build beats `tsc --noEmit`.** Type-checking alone missed
  nothing in this session, but it also wouldn't catch things like a
  `generateStaticParams` triggering a real network fetch at build time. Run
  the actual build with dummy env vars before calling anything verified.
- **Grep after every rename.** If a route, function, or field was ever
  renamed (`/shop` → `/merch` happened at least six separate times across
  hero links, success pages, metadata, and JSON-LD schema before it was
  fully gone) — grep the whole repo for the old name. Don't trust that one
  fix caught every reference.

## The audit checklist

Work through these in order. Each one is a category that produced a real bug
today — don't skip a category just because the first file you check looks fine.

### 1. Dead routes and stale references
```bash
grep -rn "'/OLD_PATH\|\"/OLD_PATH" src --include="*.tsx" --include="*.ts"
```
Check every `Link`, `href`, `window.location.href`, redirect URL, canonical
URL, OG URL, and JSON-LD schema URL. A route rename is never actually done
until this grep comes back empty. Also check for orphaned directories —
a route folder that exists but has no corresponding live path pointing to it
(or vice versa — a link pointing at a folder that was deleted).

### 2. Business logic keyed off human-editable text
```bash
grep -rn "\.match(/\^\\\[" src --include="*.ts"
```
If a critical piece of logic — brand, category, pricing tier, permissions —
is derived by parsing a title, filename, folder name, or tag that a
non-technical collaborator edits directly (a client renaming products in
Printify, someone renaming files in Drive), that logic *will* break the
next time someone renames something for an unrelated reason, with no error
raised. This happened twice in one project: a brand-detection regex broke
once from a formatting mismatch, then broke again — for every product this
time — when the client renamed items for cleaner customer-facing names and
had no idea a hidden prefix mattered.

The fix isn't "explain the convention harder" — conventions get forgotten.
It's to key the logic off something stable that the collaborator doesn't
touch: a database ID, a product ID, a permanent slug. Build an explicit
`id -> classification` override map that's checked first, with the
fragile text-parsing kept only as a fallback for new/unlisted items. Once
something is in the map, renaming it can't break its classification again.

### 3. External API version drift
Any call to Stripe, Printify, or another third-party API: don't assume the
field names from training data or an old integration are still current.
Web-search the API's own changelog for the exact API version pinned in the
code (`apiVersion: "..."` in the Stripe client, for example). Fields get
renamed, moved into nested objects, or deprecated on a schedule the original
code was written before. Anywhere you see a type cast to `any` to access a
field — that's the first place to check.

### 4. Silent failure paths
```bash
grep -rn "catch.*{.*console.error\|catch (err) { *}" src --include="*.ts" --include="*.tsx"
```
Every `catch` block that only logs to `console.error` and swallows the error
is a place where something can fail with nobody finding out — which is
exactly how a real customer's order went unfulfilled for who knows how long.
For anything touching money, orders, or bookings: failures should be
recorded (DB row) AND surfaced (email/notification), not just logged to a
place nobody's watching. A failure in one part of a flow (e.g. Printify
submission) should not silently kill the parts that already succeeded (e.g.
the payment, the customer's confirmation).

### 5. Hardcoded limits and truncation
```bash
grep -rn "\.slice(0,\|limit = [0-9]\|\.take([0-9]" src --include="*.ts" --include="*.tsx"
```
Any hardcoded number capping a list — pagination limits, `.slice()`,
default function parameters — ask: is this cap still correct as the
underlying data grows? A `getProductsWithPrices(limit = 24)` default was
silently hiding real, live products with zero error or warning.

### 6. Data that doesn't wrap or dedupe
Any place a list is rendered from raw API data (variants, options, tags) —
check whether it's deduplicated and whether it's sorted into a sensible
order, not just whatever order the API happens to return. Printify returns
sizes alphabetically (2XL before L), not garment-order — check any similarly
"obviously ordered" data (dates, days of week, price tiers) for the same
trap. Also check whether a list can grow unbounded (a poster with 27 sizes)
and whether the UI degrades gracefully (dropdown) instead of breaking
(hundreds of duplicate buttons).

### 7. Auth on anything reachable by URL
```bash
find src/app -iname "admin*" -o -iname "internal*" -o -iname "dashboard*"
find . -maxdepth 1 -iname "middleware.ts"
```
Any `/admin`, `/internal`, or dashboard-style route: confirm `middleware.ts`
actually protects it, not just a `// TODO: add auth` comment sitting unacted
on. If there's no middleware.ts at all, that's the finding — every such
route is public to anyone with the URL.

### 8. Env var consistency
```bash
grep -rhoE "process\.env\.[A-Z_]+" src | sort -u
```
Cross-reference this list against what's actually documented/set. A single
typo'd env var name (`NEXT_PUBLIC_SITE_URL` vs `NEXT_PUBLIC_URL`) causes
silent `undefined` fallbacks that are easy to miss because the code doesn't
error — it just quietly uses the wrong value or a hardcoded fallback domain.
Also check any "Sensitive"/hidden-value toggle in the hosting dashboard
isn't being mistaken for real secrecy — a `NEXT_PUBLIC_` variable is always
bundled into public browser JS regardless of that toggle; it only hides the
value from your own dashboard view, not from anyone visiting the site.

### 9. Dead code and accidental commits
```bash
git ls-files | grep "^\.next/\|^node_modules/"
```
Confirm build artifacts and dependencies were never accidentally committed —
check `.gitignore` actually matches what's tracked, not just what's listed.
Also worth a pass with `tsc --noEmit` reading for unused imports/exports —
these are usually harmless but often mark exactly where a refactor was left
half-finished.

## Process

1. **Clone or pull the target repo fresh.** Don't work from a stale local
   copy or assume a prior session's state is current.
2. **Read the full file tree of the feature area in question** — every file,
   not a sample. Line counts are cheap (`wc -l`); reading is the expensive
   part, but it's where the bugs actually are.
3. **Work the checklist above in order**, running the actual grep/search
   commands rather than eyeballing it. Note every hit before deciding which
   are real bugs vs. false positives.
4. **Verify every suspected bug against real data** before calling it a bug
   — a live API call, a rendered page, an actual build. Don't report a
   hypothesis as a finding.
5. **Fix in small, separately-verified commits**, not one giant diff. Each
   commit should be `tsc --noEmit` clean and pass a full `next build` before
   moving to the next fix — this session's bugs were often only found
   *because* fixing one thing (wiring up a missing prop) exposed the next
   (duplicate buttons the prop had been silently hiding).
6. **After fixing what you found, summarize what's still open** — not every
   finding needs to be fixed in the same session. A short "here's what's
   fixed, here's what's flagged but not done" list, similar to how this
   session ended, keeps the backlog honest instead of implying "audited"
   means "perfect."

## What this skill does NOT replace

- `site-security` — the rate-limiting, webhook-verification, and
  header-hardening checklist. Run both; they overlap a little (auth checks)
  but site-security is deeper on the security-specific items.
- `git-vercel-deploy` — this skill assumes you already know how to push and
  deploy; it's about finding what's wrong, not shipping the fix.
- Automated testing. Nothing here replaces real test coverage — it's a
  manual-but-systematic pass, useful for a codebase that (like James's
  sites) doesn't have a test suite yet.
