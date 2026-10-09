---
name: motion-sites
description: >
  James Afflu's cinematic motion-site offering for IN-FLU-ENTIAL LLC — scroll-driven
  animated sites built with Higgsfield MCP + Claude Code. Use this skill ANY time the
  task involves building a scroll-driven cinematic site, generating motion assets for a
  web build, pitching the motion-site service to a client, or extending the
  R3F/Framer-Motion/Lenis pattern already used on the IN-FLU-ENTIAL LLC site to a new
  project — e.g. "build a motion site for [client]", "make this scroll-driven", "use
  Higgsfield for the hero", or "pitch the animated site package." This is a service
  offering in development, not yet a fully packaged product — expect to make judgment
  calls and confirm direction with James more than on the standardized funnel skills.
---

# Motion Sites — Cinematic Scroll-Driven Sites

James's concept for a premium service offering: scroll-driven, cinematic websites built
with generated motion assets (via Higgsfield MCP) and Claude Code, positioned as a
step above a standard site build. The IN-FLU-ENTIAL LLC company site is no longer the
example for this — it was rebuilt in Oct 2026 as an HTML/canvas mixing console after
the 3D hallway build failed repeatedly. Its lessons are the rules below.

**Hard rules (learned from the failed IN-FLU-ENTIAL 3D build):**
- Never drive a 3D camera from scroll position — that was the hallway's core bug.
- No postprocessing (EffectComposer, Bloom, SSAO) — it blacks out on real iOS Safari
  and broke builds.
- Prefer HTML/CSS/canvas 2D and video for the "cinematic" feel; reach for WebGL only for
  one contained object, never a whole scene the page depends on.

## Status: offering in development

This isn't a standardized, repeatable funnel skill yet the way `booking-system` or
`invoice` are — it's a real direction James wants to build out, but the pattern is still
being proven on his own site before it's packaged as a repeatable client offering.
Confirm scope and direction with James more than usual on these builds; don't assume a
fixed package/price the way `client-proposal`'s pricing packages work for standard
sites.

## Core stack

- **Higgsfield MCP** — generates motion assets (video/animated visual elements) to drive
  the cinematic feel
- **Claude Code** — builds the actual scroll-driven site logic
- **Underlying web stack** (proven on the IN-FLU-ENTIAL LLC build): Next.js App Router,
  React Three Fiber (R3F) for 3D elements, Framer Motion for scroll-triggered animation,
  Lenis for smooth scroll
- **Mobile fallback pattern:** desktop gets the full 3D/canvas experience; mobile gets a
  static, lighter version with no canvas (`ssr:false` dynamic import) — this pattern is
  proven on both the IN-FLU-ENTIAL LLC site and Jade the Gem, reuse it rather than
  reinventing per project

## Build approach

1. **Concept lock first** — same principle as the `nextjs-ecosystem` "Authored Site
   Standard": one sentence describing the feeling the scroll experience should create,
   not just a list of effects. A motion site with no concept behind the motion is just
   expensive decoration.
2. **Generate motion assets via Higgsfield** before building the scroll logic around
   them — don't build the scroll framework first and hope assets fit later.
3. **Build the desktop experience first** with Framer Motion/Lenis and the generated
   motion assets; magnetic cursors and panel transitions are reusable techniques.
   Use R3F only within the hard rules above.
4. **Build the mobile fallback** — static, no canvas, same visual language at lower
   fidelity. Never ship desktop-only.
5. **Real-device test.** The old IN-FLU-ENTIAL 3D build's key lesson applies directly:
   a successful Vercel deploy does not confirm WebGL actually renders on a real device —
   always verify on an actual phone/laptop, not just the build log.

## Pitching this service

When positioning motion sites to a prospect (via `client-proposal`), this is a premium
tier above a standard site build — price and scope it as such rather than folding it
into standard package pricing. Show Fire on the Bayou (Lenis + parallax + magnetic
CTAs) as the live example; build a quick demo with `prospect-demo` when the pitch needs
more.

## Output style

Because this is still an evolving offering, lean toward proposing options and confirming
direction with James rather than executing a fixed procedure — unlike the standardized
funnel/build skills, judgment matters more here than repeatability, for now.
