const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  LevelFormat, PageBreak } = require('/home/claude/.npm-global/lib/node_modules/docx');

const DARK = "090909", GOLD = "D4AF77", GOLD2 = "9A7830", BODY = "0A0A0A",
  LABEL = "999999", SEC = "666666", LIGHT = "F4F4F4", DIV = "CCCCCC";

const NO_B = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NO_BORDERS = { top: NO_B, bottom: NO_B, left: NO_B, right: NO_B };
const THIN = { style: BorderStyle.SINGLE, size: 4, color: DIV };

const t = (text, opts = {}) => new TextRun({ text, font: "Arial", ...opts });
const p = (children, opts = {}) => new Paragraph({ children, ...opts });

const cell = (children, w, opts = {}) => new TableCell({
  borders: NO_BORDERS, width: { size: w, type: WidthType.DXA },
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  verticalAlign: VerticalAlign.CENTER, children, ...opts });

const tbl = (widths, rows) => new Table({
  width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
  columnWidths: widths, borders: NO_BORDERS, rows });

// indent wrapper: outer table with 860 left spacer
const content = (inner) => new Table({
  width: { size: 12240, type: WidthType.DXA }, columnWidths: [860, 10520, 860],
  borders: NO_BORDERS,
  rows: [new TableRow({ children: [
    new TableCell({ borders: NO_BORDERS, width: { size: 860, type: WidthType.DXA }, children: [p([])] }),
    new TableCell({ borders: NO_BORDERS, width: { size: 10520, type: WidthType.DXA }, children: inner }),
    new TableCell({ borders: NO_BORDERS, width: { size: 860, type: WidthType.DXA }, children: [p([])] }),
  ] })] });

const sectionLabel = (text) => p(
  [t(text, { bold: true, size: 18, color: GOLD2, characterSpacing: 40 })],
  { spacing: { before: 280, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: DIV, space: 4 } } });

const spacer = (h = 120) => p([], { spacing: { after: h } });

// ── 1. Header ──
const header = tbl([6800, 5440], [new TableRow({ children: [
  cell([p([t("IN-FLU-ENTIAL LLC", { bold: true, size: 28, color: "FFFFFF", characterSpacing: 60 })],
    { spacing: { before: 360, after: 360 } })], 6800,
    { shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 0, bottom: 0, left: 860, right: 120 } }),
  cell([p([t("PROPOSAL", { bold: true, size: 60, color: GOLD })],
    { alignment: AlignmentType.RIGHT, spacing: { before: 300, after: 300 } })], 5440,
    { shading: { fill: DARK, type: ShadingType.CLEAR }, margins: { top: 0, bottom: 0, left: 120, right: 860 } }),
] })]);

// ── 2. Gold strip ──
const strip = tbl([12240], [new TableRow({ children: [
  new TableCell({ borders: NO_BORDERS, width: { size: 12240, type: WidthType.DXA },
    shading: { fill: GOLD, type: ShadingType.CLEAR },
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    children: [p([t(" ", { size: 4 })])] }) ] })]);

// ── 3. Meta row ──
const metaCell = (label, value, w, gold) => cell([
  p([t(label, { bold: true, size: 16, color: LABEL, characterSpacing: 30 })], { spacing: { after: 60 } }),
  p([t(value, { bold: true, size: 21, color: gold ? GOLD2 : BODY })]),
], w);
const meta = tbl([3507, 3507, 3506], [new TableRow({ children: [
  metaCell("PREPARED FOR", "Crescent City Ink — Mia Delacroix", 3507),
  metaCell("DATE", "June 10, 2026", 3507),
  metaCell("VALID UNTIL", "June 24, 2026", 3506, true),
] })]);

// ── 5. Scope table ──
const scopeHead = new TableRow({ children: [
  cell([p([t("DELIVERABLE", { bold: true, size: 17, color: GOLD, characterSpacing: 30 })])], 3200,
    { shading: { fill: DARK, type: ShadingType.CLEAR } }),
  cell([p([t("INCLUDES", { bold: true, size: 17, color: GOLD, characterSpacing: 30 })])], 7320,
    { shading: { fill: DARK, type: ShadingType.CLEAR } }),
] });
const dash = (text) => p([t(text, { size: 19, color: SEC })],
  { numbering: { reference: "dashes", level: 0 }, spacing: { after: 30 } });
const scopeRow = (name, items) => new TableRow({ children: [
  cell([p([t(name, { bold: true, size: 20, color: BODY })])], 3200,
    { shading: { fill: LIGHT, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.TOP }),
  cell(items.map(dash), 7320, { shading: { fill: LIGHT, type: ShadingType.CLEAR } }),
] });
const scope = tbl([3200, 7320], [
  scopeHead,
  scopeRow("Custom Site Design", ["5-page Next.js site matched to Crescent City Ink's brand", "Artist portfolio galleries with per-artist pages", "Mobile-first, fast, SEO + social preview metadata"]),
  scopeRow("Online Booking + Payments", ["Live session booking with Stripe deposit checkout", "Automated email confirmations + calendar invites", "Admin dashboard to view and manage bookings", "Discount-code support for promos"]),
  scopeRow("Launch + Handoff", ["Vercel deploy + custom domain connect", "Owner self-edit guide written for your team", "30 days of post-launch fixes included"]),
]);

// ── 6. Timeline ──
const tlRow = (phase, win) => new TableRow({ children: [
  cell([p([t(phase, { bold: true, size: 19, color: BODY })])], 4200),
  cell([p([t(win, { size: 19, color: SEC })])], 6320),
] });
const timeline = tbl([4200, 6320], [
  tlRow("Week 1", "Design + brand lock, page structure approved"),
  tlRow("Weeks 2–3", "Full build: pages, galleries, booking + payment flow"),
  tlRow("Week 4", "Content load, testing, launch on your domain"),
]);

// ── 7. Investment ──
const invLine = (label, value, opts = {}) => new TableRow({ children: [
  cell([p([])], 5060),
  cell([p([
    t(label + "   ", { size: 20, color: SEC, ...(opts.bold ? { bold: true, color: BODY } : {}) }),
    t(value, { bold: true, size: 20, color: BODY }),
  ], { alignment: AlignmentType.RIGHT })], 5460),
] });
const investment = tbl([5060, 5460], [
  invLine("Project Total", "$5,000.00"),
  invLine("Deposit to Begin (50%)", "$2,500.00", { bold: true }),
  invLine("Balance on Delivery", "$2,500.00"),
  new TableRow({ children: [
    cell([p([])], 5060),
    cell([
      p([t("DEPOSIT TO BEGIN", { bold: true, size: 16, color: LABEL, characterSpacing: 30 })],
        { alignment: AlignmentType.RIGHT, spacing: { before: 120, after: 40 } }),
      p([t("$2,500.00", { bold: true, size: 34, color: GOLD })],
        { alignment: AlignmentType.RIGHT, spacing: { after: 120 } }),
    ], 5460, { shading: { fill: DARK, type: ShadingType.CLEAR } }),
  ] }),
]);

// ── doc ──
const doc = new Document({
  numbering: { config: [
    { reference: "dashes", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2013",
      alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] },
    { reference: "steps", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
      alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 420, hanging: 300 } } } }] },
  ] },
  styles: { default: { document: { run: { font: "Arial", size: 21 } } } },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 },
      margin: { top: 0, right: 0, bottom: 720, left: 0 } } },
    children: [
      header, strip,
      content([
        spacer(60),
        meta,
        sectionLabel("PROJECT OVERVIEW"),
        p([t("Crescent City Ink is one of the most-followed tattoo studios in the Bywater, but booking still runs through DMs and walk-ins — slots go unfilled and deposits get lost in the back-and-forth. This project gives the studio a site that matches the quality of the work on the walls, with artist portfolios and live deposit-backed booking, so sessions get locked in while the team is tattooing.", { size: 20, color: SEC })], { spacing: { after: 80 } }),
        sectionLabel("SCOPE OF WORK"),
        scope,
        sectionLabel("TIMELINE"),
        timeline,
        sectionLabel("INVESTMENT"),
        investment,
      ]),
      new Paragraph({ children: [new PageBreak()] }),
      content([
        sectionLabel("WHY IN-FLU-ENTIAL"),
        p([t("IN-FLU-ENTIAL LLC is the creative and digital studio of James Afflu — New Orleans producer, builder, and operator. We design, build, and run the full digital presence for working businesses: the site, the booking and payment flow, the content, and the monthly numbers that prove it's working. Recent builds:", { size: 20, color: SEC })], { spacing: { after: 100 } }),
        dash("Epoch Skin — premium waxing studio: full site, online booking with live Stripe payment, automated confirmations"),
        dash("Jade the Gem — DJ + event curator: paid booking system, press kit, on-site merch checkout"),
        dash("Mid City Sound Studios — recording studio with session booking and payments"),
        sectionLabel("NEXT STEPS"),
        p([t("Reply to approve this scope.", { size: 20, color: BODY })], { numbering: { reference: "steps", level: 0 }, spacing: { after: 40 } }),
        p([t("Deposit invoice sent same day — Zelle, 630-344-2811.", { size: 20, color: BODY })], { numbering: { reference: "steps", level: 0 }, spacing: { after: 40 } }),
        p([t("Kickoff within 3 business days of deposit.", { size: 20, color: BODY })], { numbering: { reference: "steps", level: 0 }, spacing: { after: 200 } }),
        p([t("IN-FLU-ENTIAL LLC   |   James Afflu   |   flu.wop@gmail.com   |   630-344-2811", { size: 17, color: LABEL })],
          { alignment: AlignmentType.CENTER, spacing: { before: 200 },
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: "000000", space: 8 } } }),
      ]),
    ],
  }],
});

Packer.toBuffer(doc).then(b => {
  fs.writeFileSync('/home/claude/PRO-2026-001_CrescentCityInk.docx', b);
  console.log('written');
});
