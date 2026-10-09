---
name: invoice
description: >
  Generate a professional branded invoice as a PDF (built via docx-js, delivered as PDF only) for IN-FLU-ENTIAL LLC / James Afflu.
  Use this skill ANY time the user asks to create, make, update, or generate an invoice — even
  casually ("make me an invoice", "new invoice for X", "invoice for this job"). The output is
  always a polished single-page PDF with the established brand identity: dark header
  bar, gold INVOICE stamp, gold accent strip, spaced meta/billing sections, bulleted service
  table, right-aligned payment summary with dark callout box, two-column payment instructions +
  thank-you footer, and centered contact footer. Always use this skill instead of generating
  ad-hoc invoice code.
---

# Invoice Skill — IN-FLU-ENTIAL LLC

Generates a single-page professional invoice using the established brand style, built as `.docx` and delivered as **PDF only**.

## Output — PDF only (standing rule)

James wants **PDF-only** deliverables from this skill. The `.docx` is an intermediate
build file: generate it, convert it to PDF, check the rendered pages, and deliver
**only the PDF**. Never send or present the `.docx` unless James explicitly asks for a
Word file in that request.

Brand values follow the unified IN-FLU-ENTIAL design system (Sept 2026): black
`#090909`, gold `#D4AF77`. Gold text sitting on a white/light background uses the
darker `#9A7830` so it stays readable; `#D4AF77` is for gold on black and for the
accent strip.

## Brand Identity

| Token | Value |
|-------|-------|
| Dark background | `#090909` |
| Gold accent | `#D4AF77` |
| Gold (due date) | `#9A7830` |
| Body text | `#0A0A0A` |
| Label text | `#999999` |
| Secondary text | `#666666` |
| Light bg | `#F4F4F4` |
| Divider | `#CCCCCC` |
| Font | Arial throughout |

## Brand Name — Non-Negotiable

`IN-FLU-ENTIAL LLC` is ALL CAPS everywhere it appears on the document — header,
From field, footer, filename. Never `In-flu-ential`, never `Influential`. This
is the single most common error in past outputs — check every instance before
presenting the file.

## Layout (top → bottom)

1. **Full-bleed dark header** — company name left (`IN-FLU-ENTIAL LLC`, white, bold, spaced), `INVOICE` right (gold, size 60, bold)
2. **Gold accent strip** — 1-2pt gold bar immediately below header
3. **Meta row** — 3 columns: INVOICE NUMBER / INVOICE DATE / DUE DATE (due date in gold-dark)
4. **Billed To / From** — 2 columns split by a thin vertical rule
5. **Services table** — dark header row (gold column labels), light-gray service row with dashed bullet list of deliverables; Period column center-aligned, Amount right-aligned
6. **Payment summary** — right-aligned block: Total → Due Today (50% bold) → Remaining Balance + italic due date → dark callout box with gold `$XXX.00`
7. **Two-column bottom** — Payment Instructions left (gold phone number, memo line) | Thank-you note right (light-gray bg, gold left border)
8. **Footer** — thin black top rule, centered contact line in label gray

## Required Inputs

Collect these before generating (pull from conversation context if already stated):

- **From**: always `IN-FLU-ENTIAL LLC / James Afflu / flu.wop@gmail.com`
- **To**: client name + contact name
- **Invoice number**: e.g. `INV-2026-001`
- **Invoice date**
- **Due date** (typically 2 weeks from invoice date)
- **Service description**: title + bullet deliverables
- **Campaign/service period**: start date – end date
- **Total amount**
- **Deposit due today** (default 50%)
- **Remaining balance due date**
- Payment phone: always `630-344-2811`

## Generation Steps

1. `npm install -g docx` (if not already installed)
2. Write a Node.js script using the `docx` library following the layout above
3. Run the script to produce the `.docx`
4. Validate: `python /mnt/skills/public/docx/scripts/office/validate.py <file>`
5. Convert to PDF (this PDF is the deliverable) and rasterize for visual preview:
   ```bash
   cd <dir> && python /mnt/skills/public/docx/scripts/office/soffice.py --headless --convert-to pdf <file>
   pdftoppm -jpeg -r 150 <pdf> <prefix>
   ```
6. View the preview image — check for line-wrap issues, page overflow, alignment
7. Deliver the **PDF only** (named `INV-YYYY-NNN_<Client>_IN-FLU-ENTIAL-LLC.pdf`) — not the `.docx`

## Critical docx-js Rules

- Page size: `width: 12240, height: 15840` (US Letter), margins `top: 0, right: 0, bottom: 720, left: 0` (header is full-bleed)
- All interior content uses `left: 860` margin to simulate page padding
- **Never use `\n`** — separate `Paragraph` elements only
- **Never use unicode bullets** — use `LevelFormat.BULLET` with `numbering` config (`\u2013` dash character)
- `ShadingType.CLEAR` always (never SOLID — causes black backgrounds)
- Tables need **dual widths**: `columnWidths` array on the table AND `width` on each cell
- `WidthType.DXA` always (never PERCENTAGE — breaks in Word/Google Docs)
- The `INVOICE` text in the header must stay on **one line** — use size 60 (30pt) with the right column at 5440 DXA minimum
- After the header table, render a 1-row gold shading table (12240 DXA wide) for the accent strip — do not use paragraph borders for this

## Reference Script

See the working generator pattern from the conversation history. Key structural snippet:

```javascript
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign, LevelFormat } = require('docx');

// Reusable border objects
const NO_BORDER  = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };
const THIN       = { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" };

// Header: columnWidths [6800, 5440], both cells shading fill "090909"
// Gold strip: columnWidths [12240], shading fill "D4AF77"
// Meta row: columnWidths [3507, 3507, 3506], bottom THIN border
// Bill to/from: columnWidths [5260, 5260], left border on right cell
// Services: columnWidths [5820, 2300, 2400]
// Summary: columnWidths [5060, 5460]
// Payment+TY: columnWidths [5260, 5260]
// Footer: columnWidths [10520]
// All content tables width 10520 DXA
```

## Update / Revision Workflow

If the user asks to change a specific field (date, amount, client name, period):
1. Locate the value in the existing script
2. Make a targeted edit
3. Re-run, re-validate, re-preview
4. Re-export and present the updated PDF
