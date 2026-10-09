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
  Vault = sample. Knobs run live Web Audio EQ (HF/MF/LF) and a reverb send.
  Session config lives in `lib/session.ts`; stems in `/public/session`.
- **Vault** is locked until its three dials hit the combination; then the
  sample stem fades into the mix. That's a game, not security. Private
  material is behind `/vault`, which checks a signed cookie on the server
  (`lib/vault-access.ts`, `VAULT_PASSWORD` env var). Vault items live in
  `lib/vault-items.ts` and must never be imported by a client component.

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
- **Motion:** slow fade/slide, 0.8–1.2s, no bounce, no overshoot.
- **CTA style:** gold outline, uppercase, 11px, `0.35em` tracking.

## Working instruction

Follow this file. Do not invent a new palette or bring back the hallway.
If a change would require deviating from what's written here, stop and ask
before proceeding.
