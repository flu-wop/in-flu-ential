# DESIGN.md — IN-FLU-ENTIAL LLC

This file is a **lock file**, not a moodboard. It encodes decisions already
made. Do not invent a new palette, a new 3D concept, or pull in an unrelated
template (Refero/Aura/TypeUI and similar SaaS-dashboard kits are built for a
different genre of product — they will fight this palette and this pacing).

## Colors

```
ink:   #080808
gold:  #D4AF77 (primary) / #E8C97A (light)
cream: #F5EDD8
mist:  #A89880
```

Console-only additions (components/console/console.module.css): charcoal
desk `#23221E`, knob caps red/green/blue/brown by function, LED meters
green → amber → red. Gold is reserved for what is "hot": fader caps, the
selected channel, the stop button, CTAs.

## Type

- **Display:** Cormorant Garamond
- **Body:** DM Sans
- **Labels / small caps:** DM Mono, wide letter-tracking

## The concept: the console (Oct 2026)

The homepage is a mixing console. It replaced the building/hallway concept,
which was abandoned after repeated failed 3D executions.

- **Session screen** on top: a DAW-style edit window (evokes Pro Tools,
  never copies it — no Avid logo or exact UI). Four lanes with real
  waveforms, moving playhead, an EQ window that appears while a knob turns.
- **Four channel strips are the navigation.** Music, Business, Work, Vault.
  Tapping the scribble strip (channel name) opens that channel's output
  panel, which links to the full page. Faders mix; they do not navigate.
- **The audio is real.** Each channel carries one stem of "Hang Glider"
  (Curren$y, produced by Flu): Music = vocal, Business = 808, Work = drums,
  Vault = sample. Knobs run live Web Audio EQ (HF/MF/LF), a reverb send and
  a pan. Session config lives in `lib/session.ts`; stems in `/public/session`.
  The stems are placeholder synthesized parts until James supplies the real ones.
- **Strip controls.** Every channel has Mute (red) and Solo (yellow) and a
  fader; every non-vault channel has a Pan knob in a small row under the 2x2
  EQ/Send block. Solo is solo-in-place: non-soloed channels and their reverb
  sends go silent. Mute beats solo. All changes ramp over 20 ms. Vault
  Mute/Solo stay disabled until it unlocks.
- **Master** has Mute, an Original Mix button, the fader and the meter.
- **Bounce vs stems.** The page opens on the bounce (`public/session/bounce.*`),
  a render of the stems through the same engine chain, flat, with the vault
  sample out. Bounce and stems run together at the same position and only the
  bounce is audible. Touching any EQ, send, pan, channel fader, mute or solo
  crossfades (about 150 ms) to the stems; the vault unlocking does too. Master
  fader, master mute and the transport volume do not leave the bounce. The
  bounce loads first and the stems decode in the background. Original Mix sets
  every channel control flat and crossfades back to the bounce (the vault stays
  open at fader 0; master controls are left alone).
  The bounce is pre-limiter (the limiter's makeup gain can't be baked in) and
  scaled by `lib/bounce.json`; the live path trims by 1/scale.
  **Re-render it whenever the stems or the mix chain change:** `npm run bounce`
  (needs ffmpeg and Chrome; set `CHROME_PATH` if Chrome is elsewhere). The
  script renders `components/console/mixChain.ts` in an OfflineAudioContext.
- **Master panel is the hero.** The console opens on Master: eyebrow
  "Main · Stereo Out", title, cover art, rows (Produced By, Tempo, Playing:
  Original Mix or Your Mix), the line "Press play. Touch any control to open up
  the mix.", quiet patch-in links to Music, Business and Work, and a Reset to
  Original Mix link. Tapping Master returns to it. No New Orleans on the hero,
  footer or metadata.
- **Play and Loop.** The session screen has Play and Loop buttons, and the
  transport bar has a loop toggle. Loop is on by default (brackets on the
  ruler). Off plays once, stops and returns to the start.
- **Vault** is locked until its three dials hit the combination; then the
  sample stem fades into the mix. That's a game, not security. Private
  material is behind `/vault`, which checks a signed cookie on the server
  (`lib/vault-access.ts`, `VAULT_PASSWORD` env var). Vault items live in
  `lib/vault-items.ts` and must never be imported by a client component.
  The vault's Contact Sheet photos are private: they are served by the
  server, never placed in `/public` or the repo.

## Image slots

All photos are placeholders until filled. Constants live in `lib/images.ts`
(empty string = labelled placeholder); polaroid photos in `lib/polaroids.ts`.
All files are .webp except the icon and OG.

| Slot | Path | Size |
| --- | --- | --- |
| Hang Glider cover art (Master panel, session screen, transport bar) | `/public/cover/hang-glider.webp` | 1400x1400 |
| Credits | `/public/credits/<slug>.webp` | square ~1000 |
| On The Wall (Music) | `/public/studio/<name>.webp` | square ~1000 |
| Bio | `/public/bio` | 4:5, 1200x1500 |
| Booking portrait | `/public/bio/booking.webp` | 4:5, 1200x1500 |
| Job site (AI for Contractors lane) | `/public/business/job-site.webp` | 1600x1000 |
| Work screenshots | `/public/work/<slug>.webp` | 960x600 |
| Open graph | `/public/og-image.png` | 1200x630 |
| Favicon / app icon | `app/icon.png` (placeholder mark) | 512x512 |

## Subpages: the studio kit

Every subpage is built from `components/studio` (StudioPage, ChannelHeader,
Panel, Rows, Accordion, Cta, card and form classes in studio.module.css).
Don't hand-style a page; extend the kit instead.

- **Patch bay nav** (`PatchBay.tsx`) sits at the top of every subpage: a
  cable from "Desk out" into the current page's jack. Choosing another jack
  repatches the cable, then navigates. Reduced motion skips the animation.
- **Work** lists every live site build in category accordions, with a
  screenshot in `/public/work/<slug>.webp` (960x600) and a live link.
- No pitch decks anywhere on the site, vault included.
- **Polaroids** share one flip card (`components/polaroid`): each photo
  develops the first time it scrolls into view, and tapping flips it to a
  handwritten note, with a one-line caption under the photo. Used for the
  Music credits (`PinBoard.tsx`, photos in `/public/credits`), the On The Wall
  strip on Music (studio and behind the scenes, `lib/polaroids.ts`) and the
  Contact Sheet in the vault. The bio portrait goes in `/public/bio` via
  `BIO_PHOTO`. Keep notes short so cards stay even.
- **The session persists.** `SessionProvider` in the root layout owns the
  audio engine and the mix (knobs, faders, vault), so the song keeps playing
  across pages and loops until stopped (resuming if the phone pauses audio).
  Subpages show a slim transport bar with volume; the console has a master
  fader. Stems only download once someone opens the console or presses Play.

## Pricing (Oct 2026)

All on the Business page (`/products` redirects to `/business#kit`).
Website $3,000: $1,500 to start, $1,500 before launch. Social media
marketing $5,000 with the website included, run for at least 30 days, then
an optional monthly retainer: $2,500 to start, $2,500 before launch. Two
rounds of revisions per package. AI for contractors by custom quote (inquiry
form). Website starter kit $50, sold on the page; the file is delivered by
`/api/kit`, which checks the paid Stripe session and redirects to
KIT_DOWNLOAD_URL (kept out of this public repo). Site care from $150/mo, marketing retainer
$500–1,000/mo.

Checkout is Stripe embedded checkout on the page (`/api/checkout`, prices
only in `lib/products.ts`, return page `/checkout/complete` verifies the
session server-side). Needs STRIPE_SECRET_KEY and
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in Vercel; without them the buttons open
the inquiry form. `/api/stripe-webhook` (STRIPE_WEBHOOK_SECRET, event
checkout.session.completed) emails James every payment, emails kit buyers
their download link, and emails deposit clients their intake link.
`/intake` (questions in `lib/intake.ts`) only opens for a paid deposit
session and emails the answers to James.

## Rules

- **No WebGL on the homepage.** The console is HTML, CSS and canvas 2D.
  The one 3D object on the site is the vault door on `/vault`.
- **Never build a 3D scene whose camera is driven by scroll position.**
  This was the hallway's core structural bug.
- **Avoid postprocessing (EffectComposer/Bloom/etc.)** in any Canvas scene —
  it blacks out on real iOS Safari.
- **Sound only starts from a tap.** Browsers block autoplay; iPhones on
  silent mute Web Audio, so the console shows a note on iOS.
- **Type does the luxury.** Restraint reads as expensive.
- **Title Case** for every title, label, chip and button (minor words like
  and, of, the, for stay lowercase). Body copy stays in sentence case.
- **Motion:** slow fade/slide, 0.8–1.2s, no bounce, no overshoot.
- **CTA style:** gold outline, uppercase, 11px, `0.35em` tracking.

## Working instruction

Follow this file. Do not invent a new palette or bring back the hallway.
If a change would require deviating from what's written here, stop and ask
before proceeding.
