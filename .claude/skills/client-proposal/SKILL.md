---
name: client-proposal
description: >
  Generate a professional branded client proposal as a PDF (built via docx-js, delivered as PDF only) for IN-FLU-ENTIAL LLC /
  James Afflu — the FRONT of the client funnel, before any invoice exists. Use this skill
  ANY time the user wants to pitch, quote, scope, or close a prospective client — even
  casually ("make a proposal for X", "what should I charge for this", "send them a quote",
  "scope this project", "pitch deck for a new site client", "new client wants a website,
  write it up"). Covers website builds, booking-system sites, social/clip retainers,
  marketing campaigns, and music/creative services. Output is a polished 2-page PDF
  matching the IN-FLU-ENTIAL LLC invoice brand identity (dark header, gold PROPOSAL
  stamp, gold accent strip, scope table, investment summary with dark callout box, case
  study credibility block, numbered next steps). The proposal feeds directly into the
  invoice skill once accepted. Always use this skill instead of writing ad-hoc proposal
  text or guessing prices.
---

# Client Proposal Skill — IN-FLU-ENTIAL LLC

Generates a 2-page branded proposal (built as `.docx`, delivered as **PDF only**) that closes new client work. The proposal is
the first money document a prospect sees; when accepted, the **invoice** skill generates
INV docs using the same numbers and the same visual identity.

## The funnel this skill owns

```
client-proposal  →  invoice  →  build (nextjs-ecosystem / booking-system / flat-html-site)
                                →  social-scheduler / clip-pipeline (retainers)
                                →  client-report (monthly recap)
```

## Brand Identity (identical to invoice skill)

| Token | Value |
|-------|-------|
| Dark background | `#090909` |
| Gold accent | `#D4AF77` |
| Gold (dates/valid-until) | `#9A7830` |
| Body text | `#0A0A0A` |
| Label text | `#999999` |
| Secondary text | `#666666` |
| Light bg | `#F4F4F4` |
| Divider | `#CCCCCC` |
| Font | Arial throughout |

## Brand Name — Non-Negotiable

`IN-FLU-ENTIAL LLC` is ALL CAPS everywhere on the document — header, footer,
filename. Never `In-flu-ential`. Check every instance before presenting.

## Required Inputs

Pull from conversation context first; ask James only for what's missing:

- **Prospect**: business name + contact name (+ email if known)
- **Project type**: site build / booking-system site / retainer / campaign / custom
  → read `references/pricing-packages.md` to select the package and default price
- **Client situation**: 1–3 facts about their business and what they need (drives the
  Project Overview section)
- **Proposal number**: `PRO-YYYY-NNN` (continue sequence from prior proposals if known)
- **Date** + **Valid until** (default: 14 days out)
- **Price**: start from the package default; **always confirm the final number with
  James before generating** — never send a default price silently
- **Timeline**: from package default unless James overrides

## Document Structure (top → bottom, target 2 pages)

1. **Full-bleed dark header** — `IN-FLU-ENTIAL LLC` left (white, bold, spaced),
   `PROPOSAL` right (gold, size 60, bold, ONE line)
2. **Gold accent strip** — full-width shading table immediately below header
3. **Meta row** — 3 columns: PREPARED FOR / DATE / VALID UNTIL (valid-until in gold-dark)
4. **PROJECT OVERVIEW** — section label + 2–3 sentences: their situation, the goal,
   the outcome. Written in plain confident language, no hype.
5. **SCOPE OF WORK** — table with dark header row (gold labels: Deliverable / Includes),
   one light-gray row per deliverable with dash-bullet sub-items. Pull deliverable
   language from `references/pricing-packages.md`.
6. **TIMELINE** — compact 2-column table: Phase / Window (e.g. "Week 1 — Design + brand
   lock"). 3–5 rows max.
7. **INVESTMENT** — right-aligned summary block: Project Total → Deposit to Begin
   (50%, bold) → Balance on Delivery → dark callout box with gold deposit figure.
   For retainers: Monthly Rate → First Month to Begin → callout with monthly figure
   and "month-to-month, 30-day notice" line.
8. **WHY IN-FLU-ENTIAL** — one short credibility paragraph + 2–3 case-study lines
   selected from `references/proposal-copy.md` (pick the ones closest to this
   prospect's industry).
9. **NEXT STEPS** — numbered list: (1) Reply to approve this scope, (2) Deposit invoice
   sent same day (Zelle/phone: 630-344-2811), (3) Kickoff within X business days of
   deposit.
10. **Footer** — thin black top rule, centered:
    `IN-FLU-ENTIAL LLC | James Afflu | flu.wop@gmail.com | 630-344-2811`

## Generation Steps

0. Start from `references/generator-template.js` — a verified working generator
   (Crescent City Ink sample). Swap the prospect data, scope rows, timeline, and
   numbers; keep the layout code intact. Fix the docx require path with
   `require(require('child_process').execSync('npm root -g').toString().trim() + '/docx')`
   or hardcode the output of `npm root -g`.
1. Read `references/pricing-packages.md` (select package + price + timeline) and
   `references/proposal-copy.md` (credibility copy + case studies)
2. Confirm price and scope with James if not already stated this session
3. `npm install -g docx` (if needed)
4. Write a Node.js script following the layout above and the docx rules below
5. Run it; validate: `python /mnt/skills/public/docx/scripts/office/validate.py <file>`
6. Convert + rasterize for visual check:
   ```bash
   python /mnt/skills/public/docx/scripts/office/soffice.py --headless --convert-to pdf <file>
   pdftoppm -jpeg -r 150 <pdf> <prefix>
   ```
7. View the preview — check the PROPOSAL header stays on one line, no orphaned section
   labels at a page break, callout box renders gold-on-dark
8. Deliver the **PDF only** — not the `.docx`
## Output — PDF only (standing rule)

James wants **PDF-only** deliverables from this skill. The `.docx` is an intermediate
build file: generate it, convert it to PDF, check the rendered pages, and deliver
**only the PDF**. Never send or present the `.docx` unless James explicitly asks for a
Word file in that request.

Brand values follow the unified IN-FLU-ENTIAL design system (Sept 2026): black
`#090909`, gold `#D4AF77`. Gold text sitting on a white/light background uses the
darker `#9A7830` so it stays readable; `#D4AF77` is for gold on black and for the
accent strip.


## Critical docx-js Rules (same as invoice skill)

- Page: `width: 12240, height: 15840`, margins `top: 0, right: 0, bottom: 720, left: 0`
  (header is full-bleed); interior content tables use `left: 860` indent via an outer
  10520-DXA table pattern
- **Never `\n`** — separate `Paragraph` elements only
- **Never unicode bullets** — `LevelFormat.BULLET` numbering config with `\u2013` dash
- `ShadingType.CLEAR` always (SOLID renders black)
- Tables need **dual widths**: `columnWidths` on table AND `width` on every cell, DXA only
- `PROPOSAL` header text: size 60, right column ≥ 5440 DXA so it never wraps
- Gold strip = 1-row shading table at 12240 DXA, not paragraph borders
- Section labels: gold, bold, size 18, letter-spaced, with thin bottom rule via
  paragraph border (never an empty table row)
- **PageBreak is IGNORED inside table cells.** To force page 2 at WHY IN-FLU-ENTIAL,
  split the content into TWO wrapper tables and place
  `new Paragraph({ children: [new PageBreak()] })` between them at section level
  (verified working — see `references/generator-template.js`)

## Layout widths (DXA, mirror invoice skill)

```
Header:        columnWidths [6800, 5440], both cells fill "090909"
Gold strip:    columnWidths [12240], fill "D4AF77"
Meta row:      columnWidths [3507, 3507, 3506]
Scope table:   columnWidths [3200, 7320]
Timeline:      columnWidths [4200, 6320]
Investment:    columnWidths [5060, 5460]
Footer:        columnWidths [10520]
All content tables: 10520 DXA total
```

## Revision Workflow

Field change (price, scope line, date, prospect name): targeted edit in the existing
script → re-run → re-validate → re-preview → present. Never rebuild from scratch for
a one-field change.

## After acceptance

When James says the client accepted, immediately offer to run the **invoice** skill
with the same numbers (proposal total, 50% deposit, prospect → Billed To) and the next
INV number in sequence.
