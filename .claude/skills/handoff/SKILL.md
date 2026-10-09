---
name: handoff
description: >
  Generate a client project-handoff document as a PDF (built via docx-js, delivered as PDF only) for IN-FLU-ENTIAL LLC / James Afflu.
  Use this skill ANY time James wants to hand a finished (or near-finished) site or project over
  to a client — even casually ("make a handoff doc for X", "what does she need to know",
  "give them a summary of what's on the site and what's left"). The output is a polished 2-page
  PDF with the established brand identity: dark header bar, gold "PROJECT HANDOFF"
  stamp, gold accent strip, meta row (Prepared For / Date / Prepared By), an Accounts section
  (confirmed logins shown directly, unknown ones as fill-in-by-hand blanks), a "What's On The
  Site" feature breakdown by area, and a short "What's Left To Finish" checklist. Always use this
  skill instead of generating ad-hoc handoff content — it shares the same dark/gold brand system
  as the invoice and client-proposal skills.
---

# Handoff Skill — IN-FLU-ENTIAL LLC

Generates a 2-page client-facing project handoff using the established brand style, built as `.docx` and delivered as **PDF only**.

## Output — PDF only (standing rule)

James wants **PDF-only** deliverables from this skill. The `.docx` is an intermediate
build file: generate it, convert it to PDF, check the rendered pages, and deliver
**only the PDF**. Never send or present the `.docx` unless James explicitly asks for a
Word file in that request.

Brand values follow the unified IN-FLU-ENTIAL design system (Sept 2026): black
`#090909`, gold `#D4AF77`. Gold text sitting on a white/light background uses the
darker `#9A7830` so it stays readable; `#D4AF77` is for gold on black and for the
accent strip.
Companion to the `invoice` and `client-proposal` skills — same visual system, different content shape.

## Brand Identity

Identical tokens to the `invoice` skill — reuse directly:

| Token | Value |
|-------|-------|
| Dark background | `#090909` |
| Gold accent | `#D4AF77` |
| Gold (secondary/links) | `#9A7830` |
| Body text | `#0A0A0A` |
| Label text | `#999999` |
| Secondary text | `#666666` |
| Divider | `#CCCCCC` |
| Font | Arial throughout |

## Layout (top → bottom)

**Page 1:**
1. **Full-bleed dark header** — client/company name left (bold, white, spaced), tagline beneath in gray; `PROJECT` / `HANDOFF` stamp right, gold, two lines, bold
2. **Gold accent strip** — thin gold bar immediately below header
3. **Meta row** — 3 columns: PREPARED FOR / DATE / PREPARED BY, bottom-bordered, indented to match body content (see gotcha below — do NOT use a top-level `margins` prop on the Table)
4. **Intro line** — one italic sentence in secondary gray, sets context ("The site is live and taking real bookings...")
5. **Accounts You'll Use** — section title with gold underline, then one block per account:
   - Confirmed accounts (`accountRow`): name (bold) — login email/URL (gold-dark) on one line, description below
   - Unconfirmed accounts (`accountRowBlank`): same, plus a fill-in line `Email: ______  Password: ______` for the client to complete by hand once James sends real credentials. Never invent or guess a password — leave it blank rather than fabricate one.
   - Close with a one-line italic note reminding them to keep the page safe once filled in

**Page 2** (force with `PageBreak()` — do not let it flow naturally, the accounts section length varies):
6. **What's On The Site** — section title, then sub-headed feature blocks (e.g. Shop, Booking, Confirmations, Marketing, Everything else), each a bolded gold-dark sub-title followed by 2-4 bullets. Keep bullets factual and short — this is a plain-English recap, not marketing copy.
7. **What's Left To Finish** — section title, then a short bulleted list. Keep this genuinely short; if it's long, the handoff is premature. Distinguish clearly between things that are truly outstanding vs. things that sound similar but are already done (e.g. explicitly note "OG/social preview image ≠ the favicon, which is already done" if both exist, to avoid the client conflating them).
8. **Footer** — thin top rule, centered contact line in label gray

## Required Inputs

Collect these before generating (pull from conversation context/codebase where possible):

- **Client name** (for PREPARED FOR — use whatever the site itself uses, e.g. first-name-only if that's the established branding choice)
- **Company/site name + one-line tagline** for the header
- **Date**
- **Accounts list** — for each: name, login URL, one-line purpose, and whether the login is already confirmed (real email on file) or unknown (→ blank fill-in row). Cross-check actual logged-in-as emails from screenshots/conversation before asking the user — don't ask for info you can already see.
- **Site feature breakdown** — pull from the actual codebase/routes, not from memory of what was originally scoped. Verify against live pages.
- **What's left** — audit actual current state (check recent conversation for what's been confirmed done) before listing anything; stale "still needed" items are worse than omitting them.

## Generation Steps

1. `npm install -g docx` (if not already installed) — it's usually preinstalled, try `require('docx')` first
2. Write a Node.js script following the layout above — `assets/reference-build.js` in this skill is a complete working example, copy and adapt it rather than starting from scratch
3. Run the script to produce the `.docx`
4. Validate: `python /mnt/skills/public/docx/scripts/office/validate.py <file>`
5. Convert to PDF (this PDF is the deliverable) and rasterize for visual preview:
   ```bash
   python /mnt/skills/public/docx/scripts/office/soffice.py --headless --convert-to pdf <file>
   pdftoppm -jpeg -r 120 <pdf> page
   ```
6. **Actually view both page images** — check the page count is what you expect, check the meta row and accounts section align at the same left edge as the section titles below them (this is the #1 recurring bug — see gotcha below), check nothing overflows to an unwanted 3rd page
7. Deliver the **PDF only** — not the `.docx`

## Critical docx-js Rules (handoff-specific gotchas, beyond the standard docx skill rules)

- **Table alignment bug**: `Table` does NOT support a top-level `margins: { left: N }` property — it's silently ignored. To indent a content-area table so it lines up with the 860-DXA-indented paragraphs around it, use `indent: { size: 860, type: WidthType.DXA }` on the `Table` itself instead. This bit us once already: the meta row rendered flush against the page edge while every other section was indented, and it wasn't obvious until actually viewing the rendered page.
- **Forcing page 2**: don't rely on natural pagination when the Accounts section length is variable — insert `new Paragraph({ children: [new PageBreak()] })` immediately before the "What's On The Site" section title so page 1 is always just header + meta + accounts, page 2 is always the feature/status content.
- **Fill-in-blank rows**: build these as underscored blank lines (`"Email:  ______________________________"`) inside a `TextRun` with `break: 1` to drop to a new line within the same paragraph — don't create a real form field, this is a printed/handwritten document.
- Standard `docx` gotchas (page size, dual table widths, `ShadingType.CLEAR`, no literal `\n`, etc.) all apply — see the `docx` skill for the full list, not repeated here.

## Reference Script

`assets/reference-build.js` is a complete, working, previously-validated generator (the Epoch Skin handoff). Structural snippet for orientation:

```javascript
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  LevelFormat, PageBreak } = require('docx');

// Header: columnWidths [6800, 5440], both cells shading fill "090909"
// Gold strip: columnWidths [12240], shading fill "D4AF77"
// Meta row: columnWidths [3507, 3507, 3506], indent:{size:860,type:WidthType.DXA}, bottom THIN border
// Accounts: accountRow() / accountRowBlank() helper functions, indent {left:860,right:860}
// Feature blocks: featureBlock(title, [bullets]) returns an ARRAY — spread with ...featureBlock(...) into children
// PageBreak: new Paragraph({ children: [new PageBreak()] }) before page-2 content
// Footer: columnWidths [10520]
```

## Update / Revision Workflow

If the user asks to change a specific field (client name, an account's login status, an item moving from "left to finish" to "done"):
1. Locate the value in the existing script (or regenerate from `assets/reference-build.js` if starting a new client's handoff)
2. Make a targeted edit
3. Re-run, re-validate, re-preview — **always re-view the rendered pages**, don't assume a targeted text edit didn't shift pagination or alignment
4. Present updated file
