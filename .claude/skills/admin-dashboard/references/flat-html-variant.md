# Flat-HTML variant (EGOFF Essentials)

EGOFF is a single `index.html` with no Next.js API layer, so there's nowhere server-side to run the health checks or hide `ADMIN_PASSWORD`/`PRINTIFY_API_KEY`. Don't fake this by calling Stripe/Printify/Resend directly from client JS — that would expose secret keys in the page source.

Two real options:

**Option A (preferred) — tiny serverless function, HTML stays flat.**
Add a single `/api/health.js` Vercel serverless function (not a full Next.js app) alongside the static `index.html`. It runs the same checks as `lib/health-checks.ts` (trimmed to whatever EGOFF actually uses: Stripe, Resend, Printify — no Turso/bookings since EGOFF has no booking system). The flat site stays flat; only the admin page (`/admin.html`) fetches from this one function. This keeps the "no build step, no framework" property for the storefront while still getting real server-side checks.

**Option B — piggyback on Epoch Skin's Next.js app.**
If EGOFF and Epoch Skin ever share infra, the health-check route could live in Epoch Skin's app and be scoped by a `?site=egoff` param with its own env var set. Only do this if James explicitly wants to consolidate — don't couple two independently-deployed sites without asking.

Default to Option A unless told otherwise. `admin.html` itself is just a static page with the same card markup as `dashboard-page.md`, minus the React/useEffect — plain `fetch()` + `setInterval()` in a `<script>` tag, matching the vanilla-JS style already used across EGOFF's checkout modal.
