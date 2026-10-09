# Troubleshooting — recurring errors → fixes

These are the actual errors hit across past booking builds. Check here before debugging from scratch.

## Build fails on Vercel, no obvious code error
**Cause:** a client (`createClient`, `new Stripe`, `new Resend`) is created at module top-level, so it evaluates at build time when env vars aren't present.
**Fix:** wrap every client in a lazy `getX()` function (see SKILL.md). This is the #1 cause.

## "Booking failed" / "Checkout failed" at runtime, code looks fine
**Cause:** missing env var in Vercel (most often `STRIPE_WEBHOOK_SECRET`, `TURSO_AUTH_TOKEN`, or `RESEND_API_KEY`).
**Fix:** verify every var in `references/env-and-deploy.md` is set, then **redeploy** — env changes don't apply to the current build.

## Webhook returns 400 "signature verification failed"
**Cause:** the body was parsed before verification, or the wrong signing secret.
**Fix:** read `await req.text()` (raw), pass that to `constructEvent`, and confirm `STRIPE_WEBHOOK_SECRET` matches the endpoint you created in the Stripe Dashboard (test vs live keys must match test vs live mode).

## Payment succeeds but no booking row / no email
**Cause:** webhook not registered, or registered to the wrong URL/event.
**Fix:** Stripe Dashboard → Webhooks → confirm endpoint is `https://thesite.com/api/stripe/webhook` listening for `checkout.session.completed`. Check the webhook's recent deliveries for errors.

## Duplicate Turso client / weird DB errors
**Cause:** a leftover top-level `export const db = createClient(...)` sitting above the lazy `getDb()`.
**Fix:** delete the top-level export. Only `getDb()` creates the client.

## `git status` shows nothing to commit (but you changed the file)
**Cause:** the file was edited via drag/drop and never actually saved to disk.
**Fix:** write the file via terminal (`cat > path << 'EOF' ... EOF`) or confirm the editor saved. Then `git add .`.

## Vercel keeps building the old file
**Cause:** stale build cache.
**Fix:** Vercel → Deployments → redeploy with **"Clear build cache"**, or push an empty commit (`git commit --allow-empty -m "rebuild"`).

## `node_modules` got pushed / file exceeds 100MB
**Cause:** missing or misnamed `.gitignore` (e.g. `gitignore` without the dot).
**Fix:**
```bash
echo "node_modules
.next
.env*" > .gitignore
git rm -r --cached node_modules .next
git add .gitignore && git commit -m "fix gitignore" && git push
```
If a large file is already in history, purge it with `git filter-branch` (or BFG) then force-push.

## "No Next.js version detected" on Vercel
**Cause:** wrong Root Directory — `package.json` is in a subfolder.
**Fix:** Vercel → Settings → Build & Deployment → Root Directory → set to the subfolder, or move files to repo root.

## Emails not arriving
**Cause:** unverified domain sending limits, or `RESEND_TO_EMAIL` unset.
**Fix:** keep `RESEND_FROM_EMAIL=onboarding@resend.dev` until the domain is verified in Resend; confirm `RESEND_TO_EMAIL` is set. Email failures must never crash the webhook (wrap in try/catch).
