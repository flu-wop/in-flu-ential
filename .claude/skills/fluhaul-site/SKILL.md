---
name: fluhaul-site
description: >
  Complete reference for building and maintaining the Flu-Haul website (fluhaul.com).
  Use this skill whenever working on anything for Flu-Haul — new pages, the hero/parallax
  section, booking/payment flow, admin auth, or any feature addition. Covers brand identity,
  services, the actual Next.js App Router stack (NOT flat HTML), Lenis/GSAP scroll effects,
  Stripe checkout, and deploy workflow. Also use when James says "work on flu-haul", "the
  moving site", or "haul site."
---

# Flu-Haul — Site Skill

**Corrected Aug 2026: this is a Next.js App Router site, not a flat-HTML build.** An
earlier version of this skill described a single-`index.html` cinematic build — that
was never what shipped. The actual repo has been Next.js since June 2026, with Lenis
smooth-scroll and GSAP ScrollTrigger parallax layered on top.

## Brand Identity

- **Business:** Flu-Haul — moving, junk removal, and courier services (New Orleans)
- **Owner:** James Afflu
- **Phone:** 630-344-2811
- **Domain:** fluhaul.com · **GitHub:** flu-wop/flu-haul
- **Deploy:** GitHub → Vercel, auto-deploy on push (git connected through the Claude desktop app — no tokens)
- **Vibe:** Confident, clean, trustworthy — not generic moving-company stock-photo energy

## Actual Stack (verified, do not revert to flat HTML)

| Layer | Choice |
|---|---|
| Framework | Next.js App Router, TypeScript |
| Styling | Tailwind CSS |
| DB | Turso (libsql) |
| Admin auth | bcryptjs + JWT (not the shared `ADMIN_PASSWORD` cookie pattern used elsewhere) |
| Payments | Stripe Checkout |
| Scheduling | Calendly embed |
| Scroll | Lenis (smooth scroll, `components/layout/LenisProvider.tsx`, wraps app in `layout.tsx`, duration 1.2s) + GSAP ScrollTrigger (parallax on Hero background orbs) |
| Deploy | GitHub → Vercel |

`package.json` includes `lenis ^1.1.14` and `gsap ^3.12.5`.

## Color Palette & Type

- **Background:** deep forest green `#0f4c2a`
- **CTA accent:** lime green
- **Font:** Inter
- This is Flu-Haul's own palette — distinct from the dark/gold ecosystem tokens in
  `nextjs-ecosystem`. Don't pull those tokens in here; Flu-Haul isn't part of that
  7-site ecosystem, it's on the booking-system stack with its own look.

## Services

- **Moving** — local residential and commercial moves
- **Junk Removal** — haul away furniture, appliances, debris
- **Courier** — same-day delivery, point-to-point

**Service area:** Chicago metro + New Orleans (confirm with James if expanding)

## Status (as of June–Aug 2026)

- Payment flow is done and working
- Header fixed: brand name now shows on all screen sizes (removed a stray `hidden sm:block`)
- Hero.tsx: `'use client'`, GSAP ScrollTrigger parallax on background orbs, an authored
  dispatch vignette card ("Booking Confirmed · Ref #FH-2841 · Driver James A. · 12 min
  away") replacing generic hero copy, risk-reversal microcopy under CTAs
- Discount code `REGULAR20` (20% off) — word-of-mouth only, intentionally not shown
  anywhere on the public site
- Gallery and Testimonials sections exist but are behind feature flags (off by default)
- A cinematic parallax visual pass was planned pending 3–5 real cinematic images — check
  with James on status before assuming it's live

## Building New Sections

Follow the existing Next.js App Router conventions already in the repo — don't introduce
a flat-HTML pattern or a different component structure. Read the actual current files
before adding to them; this skill records what's known as of the last update, not a live
mirror of the repo.

### Parallax pattern (GSAP ScrollTrigger, not vanilla scroll listeners)
Background orb/element parallax on Hero uses GSAP ScrollTrigger, consistent with the
Lenis smooth-scroll setup. New parallax sections should use the same GSAP approach
rather than a manual `scroll` event + `translateY`, so scroll timing stays in sync with
Lenis.

### Authored vignette pattern
Feature/booking sections should show a small styled card of the real system with
specific fake-but-realistic data (see the dispatch vignette above), not generic stock
copy — same standard as the rest of James's ecosystem.

## Env Vars

```
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
JWT_SECRET=...                # admin auth, not shared ADMIN_PASSWORD pattern
```

Confirm exact names against the live Vercel project before assuming — this stack diverges
from the standard `booking-system` skill env var list (no Resend/ics here; Calendly
handles scheduling instead).

## Deploy Workflow

1. `git add . && git commit -m "message"`
2. `git push origin main`
3. Vercel auto-deploys — watch the build log for Next.js/Turbopack issues (see
   `git-vercel-deploy` for the error playbook)
4. Env vars: Vercel project → Settings → Environment Variables

## Notes

- Phone 630-344-2811 should appear prominently (moving customers call)
- James replaces/edits actual `.tsx` files — this is a real Next.js repo, treat it like
  any other site in his stack, not a single-file swap
- If this skill and the live repo ever disagree, trust the repo and flag the mismatch
  back so this file gets corrected — that's exactly the drift that caused the last rewrite
