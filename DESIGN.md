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

## Type

- **Display:** Cormorant Garamond
- **Body:** DM Sans
- **Labels / small caps:** DM Mono, wide letter-tracking

## The one rule that matters

**One full-viewport scene at a time. No second canvas until the first is
still.** This site should feel like walking into a private building, one
room at a time — not a product demo with three effects competing for
attention.

- **The one 3D moment is the Vault door.** Everything else is HTML/type.
  Hero and Approach are pure type-driven sections. Hallway is a real HTML
  grid of six doors (each opens the existing service modal) — no 3D, no
  scroll-driven camera.
- **Never build a 3D scene whose camera is driven by scroll position
  through a tall track.** This was tried for the hallway (a scroll-scrubbed
  corridor walkthrough) and became the site's core structural bug — the
  scroll-track height and camera-travel math drifted out of sync, causing
  the section to visually stick and the page below it to go black. The
  Vault door is deliberately NOT scroll-driven: it's a single fixed-view
  Canvas that just sits and idles, with hover/click interaction only. That
  pattern is what to reuse if another 3D moment is ever added.
- **Avoid postprocessing (EffectComposer/Bloom/etc.) in Canvas scenes on
  this site.** It's a well-documented cause of a fully black canvas on
  real iOS Safari (WebGL2/float-texture support gaps). Use plain
  `meshStandardMaterial` + lights, and fake bloom/vignette with CSS overlays
  if needed.
- **Type does the luxury. 3D is one object, not the page.** Restraint reads
  as expensive; stacking effects reads as a tech demo.
- **Motion:** slow fade/slide, 0.8–1.2s duration, no bounce, no overshoot.
- **CTA style:** gold outline, uppercase, 11px, wide tracking (`0.35em`
  matches what's already in use).

## Working instruction

Follow this file. Do not invent a new palette or a new 3D hallway. If a
change would require deviating from what's written here, stop and ask
before proceeding.
