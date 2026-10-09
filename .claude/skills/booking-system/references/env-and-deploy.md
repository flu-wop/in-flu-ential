# Account setup, env vars, deploy & calendar subscription

## Pre-build account setup (walk James through these first)

1. **Turso** → turso.tech → create database `<site>-bookings` → copy `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.
2. **Resend** → resend.com → create API key → copy `RESEND_API_KEY`. (Domain verification can come later; use `onboarding@resend.dev` to start.)
3. **Stripe** → dashboard.stripe.com → copy `STRIPE_SECRET_KEY` + `STRIPE_PUBLISHABLE_KEY`. Webhook secret comes after deploy (step below).

## Vercel env vars

Add all of these in **Vercel → Project → Settings → Environment Variables**, then redeploy (env changes don't apply to existing builds):

```
TURSO_DATABASE_URL
TURSO_AUTH_TOKEN
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=owner@example.com
NEXT_PUBLIC_SITE_URL=https://thesite.com
ADMIN_PASSWORD=choose-something
```

## Stripe webhook (do this AFTER first deploy)

1. Stripe Dashboard → Developers → Webhooks → **Add endpoint**
2. URL: `https://thesite.com/api/stripe/webhook`
3. Event: `checkout.session.completed`
4. Copy the signing secret (`whsec_...`) → add as `STRIPE_WEBHOOK_SECRET` in Vercel → redeploy

## Deploy

```bash
git add .
git commit -m "feat: booking system (Turso + Stripe + Resend + ics)"
git push
```

Vercel auto-deploys. If the build fails, check `references/troubleshooting.md` — it's almost always a missing env var or a non-lazy client.

## Calendar subscription — give these to the site owner

The owner gets a `.ics` attached to every confirmation email (one-tap add). But the better setup is subscribing to the **live feed** once:

**Mac (Calendar app):**
1. File → New Calendar Subscription
2. Paste `https://thesite.com/api/calendar.ics`
3. Subscribe → name it → auto-refresh **Every Hour** → OK

**iPhone:**
Settings → Calendar → Accounts → Add Account → Other → Add Subscribed Calendar → paste the same URL.

Every new paid booking appears automatically within the refresh window. Set up once, never touched again.
