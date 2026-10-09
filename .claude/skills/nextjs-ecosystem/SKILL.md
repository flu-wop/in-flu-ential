---
name: nextjs-ecosystem
description: >
  Complete reference for James Afflu's Next.js site ecosystem. Use this skill whenever
  working on ANY of these sites: Fire on the Bayou (production house that owns/houses Mid City
  Sound), Mid City Sound Studios (midcitysound.com), Donald Markowitz (donaldmarkowitz.com),
  Lil Squiggle (lilsquiggle.vercel.app / flu-wop/squiggle2), Streetbeat Documentary
  (streetbeat.video / nolastreetbeat.vercel.app), Streetbeats Platform (streetbeats.video), or
  Doug Belote (dougbelote.com), IN-FLU-ENTIAL LLC (in-flu-ential.vercel.app), or MVC Creations
  (mvc-creations.vercel.app). Also use for any new site James builds that should match this
  ecosystem — e.g. if he says "make it look like my other sites" or "use my design system."
  Always read this before writing ANY code for these projects, even casual edits. Covers shared
  design tokens, component library, stack, per-site specifics, booking system architecture,
  email/DB setup, and deployment workflow.
---

# James Afflu — Next.js Site Ecosystem

**Full site registry (verified against Vercel, Aug 15 2026 — 23 live projects):**
This skill's detailed Per-Site Reference section below covers the original 7 ecosystem
sites in depth. Every other live build is listed here so nothing falls through the
cracks — check this table first, then jump to the right skill for full detail.

| Vercel project | Site | Detail lives in |
|---|---|---|
| `in-flu-ential` | IN-FLU-ENTIAL LLC company site | Per-Site Reference #0, this skill |
| `fireonthebayou` | Fire on the Bayou | Per-Site Reference #1, this skill |
| `mcs` | Mid City Sound Studios | Per-Site Reference #2, this skill |
| `djm` | Donald Markowitz | Per-Site Reference #3, this skill |
| `lilsquiggle` | Lil Squiggle | Per-Site Reference #4, this skill |
| `streetbeat` | Streetbeat Documentary | Per-Site Reference #5, this skill |
| (streetbeats.video) | Streetbeats Platform | Per-Site Reference #6, this skill |
| `dougbelote` | Doug Belote | Per-Site Reference #7, this skill |
| `epoch-skin` | Epoch Skin | `booking-system` skill |
| `jade-the-gem-dj` | Jade the Gem | `booking-system` skill |
| `a-and-b` / `absupply` | A&B Supply & Surplus (absupply.us) | `booking-system` skill |
| `flu-haul` | Flu-Haul | `fluhaul-site` skill (own stack, not this ecosystem's tokens) |
| `egoff` | EGOFF Essentials | `flat-html-site` skill |
| `graham-hill` | Graham Hill — debut LP campaign | Per-Site Reference (MCS-adjacent, same design system) |
| `akua-method` | Akua Method (James's sister's site) | no dedicated skill yet — ask James for current spec if picked up |
| `bits` | Breaks In The Simulation (BITS) | no dedicated skill yet — pixel/glitch aesthetic, flat single-page HTML |
| `the-indiaffect-storefront` | The Indieffect | no dedicated skill yet — pro-bono testbed, not a paying client |
| `mvc` | MVC Creations (luxury press-on nails) | Per-Site Reference #8, this skill |
| `liquidgold` | Liquid Gold Skin Co. | custom commerce build on **Square** (not Stripe), admin panel for orders — no dedicated skill yet |
| `nola-colonics`, `lamaracoffee`, `italgardenola`, `reliant-recycling`, `bourbondaiquiris` | Prospect demo sites | `prospect-demo` skill — these are pre-pitch demos, not ongoing client builds |

If a project isn't in this table, it's either brand-new since this was last verified or
outside James's main Vercel team — confirm with `list_projects` before assuming it
doesn't exist.

**Scope note:** design tokens below apply everywhere across the ecosystem. Sites on the
booking-system stack (Epoch Skin, Jade, A&B, Flu-Haul) should read `booking-system` (and
`fluhaul-site` for Flu-Haul specifically) for their build detail — this file's Per-Site
Reference section doesn't duplicate that.

**Ownership hierarchy:** Fire on the Bayou (video production house) → Mid City Sound Studios (the studio it owns/houses) → the artist/brand/project sites (Donald Markowitz, Lil Squiggle, Streetbeat, Doug Belote, Gumbeaux Juice). All commerce funnels through Mid City Sound.

**Facilities are separate — never conflate them:** Mid City Sound has 3 studio rooms. Fire on the Bayou has the edit & animation bays, sound stage, grip truck, and a sound design room. Copy on either site must only claim its own facilities.

## Stack (all sites)

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.6, App Router, TypeScript, Turbopack |
| Styling | Tailwind CSS v3 + `tailwindcss-animate` |
| Animation | Framer Motion (heaviest on Fire on the Bayou) |
| DB | Turso (libsql) — **separate DB per site** |
| Email | Resend (`onboarding@resend.dev` sender for now) |
| Calendar invites | `ics` npm package |
| Payments | Stripe (Checkout + webhooks) |
| Deployment | Vercel — auto-deploy on GitHub push |
| GitHub account | flu-wop |

---

## Shared Design System

**Every site uses these exact tokens — do not deviate:**

```ts
// tailwind.config.ts colors (extend block)
colors: {
  "studio-black": "#090909",
  charcoal:       "#111111",
  dark:           "#1A1A1A",
  card:           "#1C1C1C",
  border:         "#2A2A2A",
  gold:           "#D4AF77",
  "gold-light":   "#E8C97A",
  "gold-dark":    "#B8935A",
  cream:          "#F5EDD8",
  mist:           "#A89880",
}
```

**Fonts (loaded via `@import` in `globals.css`):**
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');
```
- **Display/headings:** Cormorant Garamond
- **Body:** DM Sans
- **Mono/code:** DM Mono

**CSS custom properties (`:root` in `globals.css`):**
```css
--color-black:      #090909;
--color-charcoal:   #111111;
--color-gold:       #D4AF77;
--color-cream:      #F5EDD8;
--color-mist:       #A89880;
```

**Shared utility classes** (defined in `globals.css` `@layer utilities`):
- `text-gold-gradient` — linear gradient gold text effect
- `grain` / `vignette` — cinematic texture overlays
- `card-lift` — hover shadow on cards
- `animate-shimmer` — loading shimmer

**Accent-layer pattern:** Some sites stack a small accent palette ON TOP of the shared system (used sparingly, never as wallpaper) — Lil Squiggle's rasta layer, Streetbeats' NOLA green, Fire on the Bayou's ember/flame/bayou. The shared dark/gold base always stays intact underneath.

**globals.css import order (CRITICAL — Turbopack breaks if wrong):**
```css
@import url('...google fonts...');  /* MUST be first */
@tailwind base;
@tailwind components;
@tailwind utilities;
```
(Lil Squiggle is the exception: it loads fonts via `next/font/google` in `layout.tsx` with CSS vars `--font-cormorant` / `--font-dm-sans` instead of `@import`.)

---

## The Authored Site Standard (run on EVERY new build + every redesign)

The design system above makes sites look professional. This section makes them look
*authored*. Apply all four moves before writing any page code.

### 1. Concept lock (before any code)
Write ONE sentence: "This site should feel like ___." Not a palette — a feeling with
a metaphor behind it (e.g. Cairn security = "a quiet trail marker in fog"; MCS could
be "the room where the record gets made"). Every section's headline, image choice,
and microcopy must pass that filter. If a section's copy could appear on a competitor's
site unchanged, it fails the lock. State the concept sentence to James for approval
before building.

### 2. UI vignettes (show the product, never just describe it)
Each major feature section gets a miniature of the REAL working system rendered as a
static card — not a screenshot, a styled component with fake-but-specific data:
- Booking sites → mini confirmation card: "Brazilian Wax · Sat 2:30 PM · Confirmed ✓"
- Studio sites → mini session block: "Studio A · 8hr block · Engineer: Richie"
- Retainer/clip pitches → mini scheduled-posts queue with 3 rows and timestamps
- Merch → mini order line: "Hidden Gem Globe Tee · M · Shipped"
Specificity sells: timestamps, names, statuses. Generic placeholder text kills it.
Build these as small components in `src/components/vignettes/`.

### 3. Outcome headlines, one emphasized word
Every section H2 names the client outcome, not the feature, with exactly one
italic/gold-emphasized word: "Booked while you *sleep*", "Sessions that pay
*before* they start". Ban feature-voice headlines ("Our Services", "What We Do")
on home pages — those live only on interior nav pages if at all.

### 4. Risk-reversal microcopy under every CTA
One quiet small-text line under each primary CTA that kills the visitor's fear:
"Deposit refundable until your appointment is confirmed" · "No account needed —
checkout in under a minute" · "Reply within one business day, always a human."
Style: `text-sm text-mist`, never bold.

**Checklist before declaring a build done:** concept sentence approved · every H2 is
outcome-voiced · ≥1 vignette on the home page · every primary CTA has a reassurance
line · footer carries one on-concept signature line (like the brand's quiet motto) ·
designer credit in the footer · only the client's own contact details on the site.

### Designer credit (every client site)
One small footer line: **`Designed by IN-FLU-ENTIAL`** — all caps, both hyphens, no
"LLC" — linking to `https://in-flu-ential.vercel.app` in a new tab (switch to the real
domain once it's live). Footer only, styled as muted footer text; never a floating or
fixed badge (it covered buttons on phones on Fire on the Bayou). Not on James's own
sites (IN-FLU-ENTIAL, Flu-Haul).

### Client contact details only
Never carry James's own phone (630-344-2811 — shared by IN-FLU-ENTIAL and Flu-Haul) or
email into a client site's `site.ts`, contact page, footer, or metadata. It leaked
into Fire on the Bayou from another build once. Grep for `630-344-2811` and
`flu.wop` before every push to a client repo.

---

## Shared UI Components

These live in `src/components/ui/` and are identical across all sites:

- `Button` — variant props: `default` (gold), `outline`, `ghost`, `destructive` (Fire on the Bayou adds an `ember` variant)
- `Card`, `CardHeader`, `CardContent`, `CardFooter`
- `Badge` — variant: `default`, `secondary`, `outline`
- `Input`, `Label`, `Textarea`
- `Separator`
- `Toaster` (sonner)

Site-specific layout components in `src/components/layout/`:
- `Navbar` — sticky top, logo + links, mobile hamburger, gold underline on active
- `Footer` — site links, socials, copyright

**Root layout pattern (`src/app/layout.tsx`):**
```tsx
<html lang="en" className="dark">
  <body className="bg-studio-black text-cream antialiased">
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer />
    <Toaster />
  </body>
</html>
```

---

## Per-Site Reference

### 0. IN-FLU-ENTIAL LLC (company site)
- **Domain:** in-flu-ential.vercel.app (no custom domain yet) · **GitHub:** flu-wop/in-flu-ential · **Vercel:** `in-flu-ential`
- **Completely rebuilt Oct 2026.** The old site — 3D hallway/corridor, particle sphere,
  scroll-driven camera, GSAP scrollytelling, Calendly booking, $10K/$25K/$50K+ tiers — is
  gone. Never bring any of it back or reference it as current.
- **Read `DESIGN.md` in the repo first.** It is a lock file: palette, type, concept,
  pricing and rules. If a change would deviate from it, stop and ask.
- **Concept: the mixing console.** The homepage is an HTML/CSS/canvas-2D mixing desk —
  a DAW-style session screen on top (evokes Pro Tools, never copies it) and four channel
  strips that are the navigation: Music, Business, Work, Vault. Each channel carries a
  real stem of "Hang Glider" (Curren$y, produced by Flu) with live Web Audio EQ and a
  reverb send. `SessionProvider` in the root layout keeps the song playing across
  pages; sound only starts from a tap.
- **Subpages** are built from the studio kit in `components/studio` (StudioPage,
  ChannelHeader, Panel, Rows, Accordion, Cta) with a **patch bay** nav at the top —
  extend the kit, never hand-style a page. Music credits are a Polaroid pin board
  (`components/music/PinBoard.tsx`); Work lists every live build in category
  accordions with screenshots in `/public/work/<slug>.webp`.
- **Vault:** on the console, three dials to a combination (a game, not security). The
  `/vault` gate keeps its 3D vault door (`VaultDoor3D`, R3F) — the one 3D object on the
  site, intentionally kept; private items are
  gated server-side by a signed cookie (`lib/vault-access.ts`, `VAULT_PASSWORD`), and
  `lib/vault-items.ts` must never be imported into a client component. No pitch decks
  anywhere on the site.
- **Stack:** Next.js 16.2.6, React 19, Tailwind v3, Framer Motion, `@flu-wop/design-system`
  (first site on the shared package), Stripe embedded checkout, Resend.
- **Look:** ink `#080808`, gold `#D4AF77` / `#E8C97A`, cream `#F5EDD8`, mist `#A89880`;
  Cormorant Garamond / DM Sans / DM Mono labels. Title Case for every title, label and
  button; slow 0.8–1.2s fades, no bounce; CTAs are gold outline, uppercase, 11px,
  0.35em tracking. Type does the luxury.
- **Pricing (on `/business`):** Website $3,000 ($1,500 to start, $1,500 before launch) ·
  Social media marketing $5,000 with the website included ($2,500 + $2,500), then an
  optional monthly retainer · two revision rounds per package · AI for contractors by
  custom quote · Website Starter Kit $50 · site care from $150/mo · marketing retainer
  $500–1,000/mo.
- **Checkout:** prices only in `lib/products.ts` (client sends a product ID).
  `/api/checkout` → `/checkout/complete` verifies server-side. `/api/stripe-webhook`
  (`checkout.session.completed`) emails James every payment, sends kit buyers their
  download (`/api/kit` → `KIT_DOWNLOAD_URL`), and sends deposit clients their link to
  `/intake`, which only opens for a paid deposit session.
- **Rules carried from the hallway failure:** no WebGL on the homepage; never drive a
  3D camera from scroll position; no postprocessing (it blacks out on iOS Safari).
- **Grammy-adjacent credit:** Killer Mike's MICHAEL engineering credit stays marked for
  formalization (see `royalty-claims`).
- Every client site's "Designed by IN-FLU-ENTIAL" credit links here — update those links
  when a custom domain lands.

### 1. Fire on the Bayou
- **Client:** Jason Villemarette (also MCS co-partner). Proposal PRO-2026-009, $3,000, paid via Zelle off-site.
- **GitHub:** flu-wop/fireonthebayou · **Preview:** fireonthebayou.vercel.app · **Domain at launch:** fireonthebayou.com (currently their old WordPress site)
- **Concept:** High-end New Orleans video production house that **owns/houses Mid City Sound**. Deliberately more cinematic and elevated than MCS or streetbeat.video. Build concept is "antigravity": Lenis smooth-scroll + scroll-linked parallax + magnetic CTAs + film grain/vignette.
- **Stack:** Next.js 16.2.6 App Router (Turbopack), TypeScript, Tailwind v3, Framer Motion, Lenis, Stripe, Resend, Vercel Analytics (cookie-free, no banner)
- **Source of truth:** the live fireonthebayou.com site for facts; YouTube @firenola for all video. Never invent clients or credits.
- **Type treatment:** hero headline in the bold display font with "ON FIRE" in all caps crimson; scroll-reveal text blocks get the crimson accent on exactly ONE key phrase each.
- **Accent layer (on top of shared tokens):**
  ```
  ember:  #E2452A
  flame:  #FF7A3C
  ink:    #060605   /* deeper black base than studio-black */
  bayou:  murky green-black for alternate sections
  ```
- **Work:** real case studies only, in `projects.ts` — Aucoin Hart (Gold Addy), Home Depot "Team Depot", Red Bull "Street Kings", Rouses "Feels Like Home", Blue Plate Mayo, Blue Runner, Crystal Hot Sauce, Reily Foods, Sazerac House, Russell Athletic (feat. Mark Ingram); IV Waste in the client list. Homepage teaser leads with Aucoin Hart, Home Depot, Red Bull, Rouses. More real clients exist (LED, UNO, Louisiana Dental, CenturyLink, Evamor, Country Day, Avala Spine) but aren't pulled in yet.
- **About / Studio page:** Jason's story (Innovator of the Year **2008**), crew section styled as film credits with no photos (Jason, Kathy Hirsch, David Reece, Michael Sanchez, Louis Koerner, Simon Blake), Mid City Sound panel (gold MCS logo, links to midcitysound.com), and the "Wear the fire" merch section linking to midcitysound.com/merch. MCS and merch are NOT on the homepage.
- **Paid CTA (Stripe):** Creative Consult **$1,000** (price in `src/lib/site.ts`) and Creative Development **$7,500–10,000**. Webhook: `/api/stripe/webhook` on `checkout.session.completed`. Without `STRIPE_SECRET_KEY`, "Book a consult" falls back to the contact page.
- **Contact:** public email hello@fireonthebayou.com; notifications go to firenola@gmail.com. Socials: Instagram @fire_on_the_bayou_, YouTube @firenola, Facebook fireonthebayounola, LinkedIn — icon buttons in the footer. Footer address has no ZIP. Page-ending CTAs read just "Get in touch."
- **Env vars:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (required) · `NEXT_PUBLIC_SITE_URL`, `SITE_INDEXABLE=true` (set at launch — preview is noindex until then) · `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (recommended, domain must be verified) · `RESEND_TO_EMAIL`, `STRIPE_CONSULT_PRICE_ID` (optional)
- **Pending:** Jason's real hero reel; a photo of Jason (`/public/images/jason-villemarette.jpg`, set `site.founder.photo`); domain cutover + 301 redirects from the old WordPress URLs; Resend domain verification; rate limit on the consult form; logo left as-is (possible separate logo pitch later).

### 2. Mid City Sound Studios
- **Domain:** midcitysound.com
- **GitHub:** flu-wop/mcs · Vercel project `mcs` (flu-wops-projects)
- **Pages:** `/` home, `/studio` booking, `/mixing`, `/merch`, `/projects`, `/contact`
- **Studio rates:** $100/hr · 4hr block $360 · 8hr block $640 · discount codes `REGULAR30` (30% off) and `STUDIO10`
- **Mixing:** Two-track vocal $300 · Full mix (24 tracks) $650 · Stem mixing $950 · Dolby Atmos $850 ($595 promo)
- **Booking stack:** Turso DB `mcs-bookings`, Resend, Stripe Checkout, `ics` for calendar invites — COMPLETE
- **Booking route:** `/api/booking-checkout` (NOT `/api/checkout` — that's the merch/cart route). `/studio` POSTs to it and redirects to Stripe-hosted Checkout
- **Admin:** `/admin/bookings` — protected route, lists all bookings · **iCal feed:** `/api/calendar.ics`
- **Commerce is centralized here:** Printify + Stripe + CartProvider + webhooks live ONLY in the MCS repo. Brand sites copy `lib/cart.ts` (share the `mcs_cart` localStorage key) and link merch to `midcitysound.com/merch`
- **Stripe account:** separate **Mid City Sound LLC** account (NOT the Flu-Haul Stripe the MCP connects to). Env var for redirects is **`NEXT_PUBLIC_URL`** (NOT `NEXT_PUBLIC_SITE_URL`)
- **Engineers with booking pages:** Richie Mayfield + 5 others (Jesse and Rodja last names/bios/photos TBD; Linktree URLs for 6 engineer pages TBD)
- **Projects section:** Streetbeat, Lil Squiggle, Gumbeaux Juice cards
- **Pending:** end-to-end test booking (`4242 4242 4242 4242`); confirm webhook → `/api/webhooks/stripe` on `checkout.session.completed`; Flu/Jesse/Rodja photos + bios; Squarespace payment URLs (studio + Groove $0.99)

### 3. Donald Markowitz
- **Domain:** donaldmarkowitz.com · **GitHub:** flu-wop/djm
- **Pages:** `/` home, `/legacy` (3-chapter timeline), `/credits` (tabbed: Film & TV, Discography, Collaborations), `/stats`, `/contact`
- **Key facts (verified, do not change):**
  - Academy Award winner + Golden Globe winner (co-writer) — "(I've Had) The Time of My Life" from *Dirty Dancing* (Academy Award April 11, 1988)
  - Grammy went to the **performers** (Bill Medley & Jennifer Warnes), NOT Donald; he has a Grammy *nomination* (Bobby Rush's *Decisions*, 2014)
  - "New Orleans Since 2011" (Broadmoor); 40+ year career; NYC-born bassist (Apollo, Radio City, Cotton Club, Roseland)
  - Collaborators: Van Morrison, Taj Mahal, Art Neville, Ivan Neville, Bill Medley, James Taylor, Shawn Colvin, Nicolette Larson, **Doug Belote**, Irvin Mayfield; signed to Kobalt
  - **Do NOT credit Baha Men, Wiz Khalifa, or Curren$y**
- **Gumbeaux Juice:** Donny's annual French Quarter Festival event (Jack Daniel's Stage) — appears as a project on MCS
- **Pending:** demo audio `/public/audio/time-of-my-life-demo.mp3`; Songstats live embed (needs Donny's login); TMDB_TOKEN in Vercel must be the JWT, not a Stripe key

### 4. Lil Squiggle
- **Domain:** lilsquiggle.vercel.app
- **GitHub:** **flu-wop/squiggle2** (NOT `lilsquiggle`) — files in `src/`. Always push to squiggle2.
- **Campaign:** #DontDrinkAndDialDecades — reggae-dub chibi Lego character; tagline "One call. Every era. Same regret."
- **Eras:** 1970s rotary → 1990s flip → modern smartphone. Video asset is "Street Beat."
- **Collaborators:** Donald Markowitz + Gary Uffner (producers); track "Written by Cash Hollywood & Russ Kunkel"
- **Pages:** Home, Story (era timeline), Music, Merch (→ redirects to midcitysound.com/merch)
- **Rasta accent layer (on top of shared system):**
  ```
  --rasta-green:  #1D9E75
  --rasta-gold:   #EF9F27
  --rasta-red:    #D85A30
  --rasta-night:  #2C2C2A
  --neon-mist:    #B5D4F4
  --warm-cream:   #FAEEDA
  ```
- **Socials:** @lilsquigglemon (TikTok, YouTube, X) · @lil.squiggle (Instagram) · lilsquigglemon@gmail.com
- **Audio:** `/public/audio/dont-drink-and-dial.wav` — autoplay muted ~20% with volume slider + pause button
- **Video:** `/public/video/flip-fails-1.mp4` — silent loop

### 5. Streetbeat Documentary
- **Domains:** streetbeat.video · nolastreetbeat.vercel.app · **GitHub:** flu-wop/streetbeat
- **Film:** "Street Beat: Drumming Below Sea Level"
- **Pages:** `/` home, `/watch` (paywall), `/about`, `/contact`
- **YouTube embed:** `JgqTdAVGwUc` · **Price:** $10 (was $5) — Squarespace pay link swapped into `SQUARESPACE_URL` in `watch/page.tsx`
- **Footer:** only Doug Belote Instagram icon remains
- **Pending:** raw Squarespace pay-link URL (bypass Next.js routing conflict); Squarespace Members Area for post-purchase access; 4 drummer names for credits; About page photo

### 6. Streetbeats Platform
- **Domain:** streetbeats.video
- **Concept:** Beat marketplace (separate from the documentary)
- **Features:** Interactive beat cards, play toggle, waveform viz, like button, NOLA green accent, animated EQ bar logo, email capture
- **Pending:** 4 placeholder drummer names (will ID from photos)

### 7. Doug Belote
- **Domain:** dougbelote.com (repo likely flu-wop/dougbelote — verify)
- **Subject:** World-class New Orleans studio drummer & touring percussionist (credits: Jerry Douglas, Dr. John, Robben Ford; also a Donald Markowitz collaborator)
- **Built as a direct extension of MCS + Streetbeat** — same dark/gold system, NOLA warmth (deep reds, brass/gold). Mobile-first, premium, minimal.
- **Pages:** Home (hero + reel + booking CTA), About, Credits (filterable grid), Gear (Yamaha/Zildjian endorsements), Media (audio + video reel), Contact/Booking
- **Reel:** controlled by the `MEDIA` video item in `src/lib/data.ts` — empty `src` shows a styled "Reel coming soon" placeholder; set `src` to a YouTube ID (e.g. `"abc123XYZ"`) to switch to the embed automatically
- **Pre-wired for future booking-system integration** (same pattern as MCS)
- **Status:** starter template built with placeholder content/images; Doug to provide real text + photos


### 8. MVC Creations
- **Client:** Margie — licensed nail artist + content creator, based in **Kenner** (not New Orleans). Positioned as a luxury beauty and lifestyle brand, not just a booking site.
- **GitHub:** flu-wop/mvc · **Live:** mvc-creations.vercel.app (formerly mvc-flame.vercel.app) · Next.js / TS / Tailwind
- **Look:** matte & gloss black, ivory & white, champagne gold, brushed silver, charcoal — gold as accent only, no pink/emerald. Accent colors may change seasonally. Realistic bold-vein marble background (SVG-generated). Hero tagline "Where Beauty Meets Artistry".
- **Fonts:** The Seasons + Abramo (paid — waiting on Margie's licensed font files), Montserrat 400/700 (Google Fonts). Don't substitute lookalikes as if they were final.
- **Pages:** Home, About ("Behind the Brand" — half-moon portrait in her Acuity banner style), Services, Press-Ons, Shop, Content Creation (B2B portfolio + inquiry form, contact Cxrtes.margie@gmail.com), Portfolio (no separate Gallery link), FAQ, Contact, /privacy.
- **Patterns:** "Choose Your Experience" 5-card split; half-moon service/product cards with 3D tilt + ombré-blur reveal on tap; policies as in-page accordions; floral divider only between Business Hours and Contact in the footer (desktop/landscape); text wordmark in nav, real logo in footer. No testimonials section.
- **Booking:** Acuity iframe embed (owner 19553804, slug `mvcxcreations`) stays until a native mirrored-services booking flow is built — Margie insists on Acuity checkout for now. Deposits apply toward the service total.
- **Shop:** Stripe checkout + Turso orders (admin orders page, webhook), Shippo for shipping (not wired yet). "Custom Card Grabbers" and "Card Grabbers" stay separate items.
- **Security done:** rate limiting, idempotent Stripe webhooks, cookie-based admin login, security headers, branded `/admin/system` dashboard.
- **⚠ Before real payments:** checkout still trusts client-sent prices — move to server-side pricing (see `site-security`).
- **Pending:** licensed font files, real shop photos/prices, Shippo wiring, Content Creation form fields + portfolio, bio rewrite (deferred).

---

## Booking System Architecture

Used in MCS (complete), Epoch Skin (complete). Template for Flu-Haul, Jade DJ, and a future Doug Belote integration.

```
/app/api/
  booking-checkout/route.ts  — POST: validate → save to Turso → Stripe checkout session
  webhooks/stripe/route.ts   — Stripe webhook: on success → Resend email + iCal attachment
  calendar.ics/route.ts      — GET: serve iCal feed of all bookings
/app/admin/bookings/
  page.tsx                   — protected admin view
/lib/
  db.ts                      — Turso client (libsql)
  email.ts                   — Resend helpers
  calendar.ts                — ics generation
```

**Env vars needed per site:**
```
TURSO_DATABASE_URL=libsql://[db-name]-[handle].turso.io
TURSO_AUTH_TOKEN=...
RESEND_API_KEY=re_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_URL=https://[domain]          # MCS uses this name, not NEXT_PUBLIC_SITE_URL
```

---

## Deployment Workflow

1. `git add . && git commit -m "message"` — always commit before push
2. `git push origin main` — Vercel auto-deploys
3. Add env vars in Vercel project → Settings → Environment Variables
4. **Common git gotcha:** if branch is `master` not `main`, run: `git branch -m master main` then `git push --set-upstream origin main`

Git is connected through the Claude desktop app and Claude Code (studio Mac), so commits
and pushes can be made directly — no personal access tokens, never a token in a remote
URL or pasted into chat. When working from a session without git access, deliver
complete files plus the exact git commands instead. See the `git-vercel-deploy` skill
for the full error playbook.

---

## Common Issues & Fixes

| Problem | Fix |
|---|---|
| Turbopack CSS parse error | `@import` must be ABOVE `@tailwind` directives in globals.css |
| "src refspec main does not match" | Commit something before first push |
| "nothing to commit" | Run `git add .` first |
| Next 15.3.0 blocked by Vercel | Use Next 16.2.6 (CVE fix) |
| Vercel CLI 54.3 fails on Next 16 empty config | Add `turbopack: {}` to `next.config.ts` |
| Lil Squiggle build can't find components | Files are in `src/`, repo is `squiggle2`; `git add -f components/` if untracked |
| MCS checkout redirect breaks | Code must reference `NEXT_PUBLIC_URL`, not `NEXT_PUBLIC_SITE_URL` |

---

## Key People & Contacts

- **James Afflu** — owner/developer, flu.wop@gmail.com, 630-344-2811 (IN-FLU-ENTIAL and Flu-Haul share this number — never put it on a client site)
- **Jason Villemarette** — Fire on the Bayou owner, MCS co-partner and building owner
- **Donny Markowitz** — collaborator, DJM site subject, has Google account for MCS domain
- **Gary Uffner** — collaborator (Lil Squiggle producer)
- **Doug Belote** — drummer, dougbelote.com subject, DJM collaborator

---

## Notes on James's Workflow

- Prefers **complete file outputs** — no partial snippets
- Still building familiarity with Next.js and Git — include terminal commands explicitly
- **Preserve existing layouts** — change only what's asked, never redesign wholesale unless requested (he will correct over-rebuilds)
- Internal business data (margins, etc.) stays off public-facing pages
- Clean minimal layouts, strong visual hierarchy, generous white space
- Email currently using `onboarding@resend.dev` — switch to verified domain when DNS is sorted
