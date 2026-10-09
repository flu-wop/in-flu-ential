---
name: client-intake
description: >
  Generate a branded client intake questionnaire for IN-FLU-ENTIAL LLC / James Afflu —
  used once a prospect accepts, before the build starts, to collect everything needed to
  actually build the site/campaign. Use this skill ANY time James wants to formalize
  what a new client needs to provide — e.g. "build an intake form for [client]", "what do
  I need to ask them before starting", "client questionnaire", or any project moving from
  "accepted" to "starting build." Same funnel position as client-proposal/invoice/handoff
  — a PDF deliverable (never a .docx unless asked), not a live form.
---

# Client Intake Skill — IN-FLU-ENTIAL LLC

Generates a branded intake questionnaire that collects everything a build needs before
work starts, so the project doesn't stall mid-build waiting on assets or answers that
should have been gathered up front.

## Where this sits in the funnel

```
client-proposal (pitch)  →  invoice (deposit)  →  client-intake (this skill)
  →  build (nextjs-ecosystem / booking-system / flat-html-site)
  →  handoff (when finished)
```

Intake happens after the deposit is paid, before any real build work — the questionnaire
is what turns "they said yes" into "here's everything I need to actually start."

## Brand Identity (same tokens as invoice/proposal/handoff)

| Token | Value |
|-------|-------|
| Dark background | `#090909` |
| Gold accent | `#D4AF77` |
| Body text | `#0A0A0A` |
| Label text | `#999999` |
| Font | Arial throughout |

`IN-FLU-ENTIAL LLC` is ALL CAPS everywhere on the document. Never `In-flu-ential`.

## Sections to cover (adapt per project type)

1. **Business basics** — legal/DBA name, contact name, phone, email, physical address if
   relevant
2. **Brand assets** — logo (vector if available), brand colors/fonts if already
   established, existing photography/video, social handles
3. **Site content** — page-by-page: what needs to appear, any copy already written vs.
   needing to be drafted, testimonials/reviews to feature
4. **Commerce/booking specifics** (if applicable) — service/product list with prices,
   booking rules (hours, buffer times, cancellation policy), discount codes, payment
   processor preference
5. **Accounts James will need access to or create** — domain registrar, existing hosting,
   any existing Stripe/Square/booking tool being replaced
6. **Timeline constraints** — any hard launch date (event, season, press mention)
7. **Who approves what** — single decision-maker or does copy/design need sign-off from
   someone else on their team

## Document Structure

Single or 2-page document, built as `.docx` and delivered as **PDF only**, same dark/gold visual system as invoice/proposal:
1. Full-bleed dark header — `IN-FLU-ENTIAL LLC` left, `CLIENT INTAKE` right (gold)
2. Gold accent strip
3. Meta row — CLIENT / PROJECT / DATE
4. Numbered sections (per above), each with clear fill-in space or checkboxes
5. Footer — same contact line as invoice/proposal

## Generation Steps

1. Pull known info from the accepted proposal (client name, project type, scope) so
   James isn't re-asking what's already on file
2. `npm install -g docx` (if needed) — same library as invoice/proposal/handoff
3. Write the generator following the layout above; reuse the docx-js rules from the
   `invoice` skill (page size, dual table widths, ShadingType.CLEAR, no literal `\n`)
4. Validate: `python /mnt/skills/public/docx/scripts/office/validate.py <file>`
5. Convert + rasterize for visual check, same pattern as invoice/proposal
6. Convert to PDF with `soffice --headless --convert-to pdf`, render the pages and check them, then deliver the **PDF only** — not the `.docx`
## Output — PDF only (standing rule)

James wants **PDF-only** deliverables from this skill. The `.docx` is an intermediate
build file: generate it, convert it to PDF, check the rendered pages, and deliver
**only the PDF**. Never send or present the `.docx` unless James explicitly asks for a
Word file in that request.

Brand values follow the unified IN-FLU-ENTIAL design system (Sept 2026): black
`#090909`, gold `#D4AF77`. Gold text sitting on a white/light background uses the
darker `#9A7830` so it stays readable; `#D4AF77` is for gold on black and for the
accent strip.


## Output style

Complete file, minimal explanation, matching the rest of the funnel skills.
