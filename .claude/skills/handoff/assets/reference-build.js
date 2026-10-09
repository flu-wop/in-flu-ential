const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  LevelFormat, HeadingLevel, PageBreak,
} = require("docx");
const fs = require("fs");

const NO_BORDER  = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };
const THIN       = { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" };

const DARK = "090909";
const GOLD = "D4AF77";
const GOLD_DARK = "9A7830";
const BODY = "0A0A0A";
const LABEL = "999999";
const SECONDARY = "666666";
const LIGHT_BG = "F4F4F4";

const FULL_WIDTH = 10520; // interior content width (matches invoice skill convention)

function cellNoBorder(children, opts = {}) {
  return new TableCell({
    children,
    borders: NO_BORDERS,
    verticalAlign: VerticalAlign.CENTER,
    shading: opts.shading ? { type: ShadingType.CLEAR, fill: opts.shading } : undefined,
    margins: opts.margins ?? { top: 100, bottom: 100, left: 100, right: 100 },
    width: { size: opts.width, type: WidthType.DXA },
  });
}

function bulletPara(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: opts.after ?? 80 },
    children: Array.isArray(text) ? text : [new TextRun({ text, size: opts.size ?? 20, color: opts.color ?? BODY, bold: opts.bold ?? false, font: "Arial" })],
  });
}

function sectionTitle(text) {
  return new Paragraph({
    spacing: { before: 360, after: 160 },
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: DARK, font: "Arial", characterSpacing: 20 }),
    ],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 6 } },
  });
}

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2013", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 260, hanging: 200 } } } }],
    }],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 0, right: 0, bottom: 720, left: 0 },
      },
    },
    children: [

      // ── Full-bleed dark header ──────────────────────────────────
      new Table({
        width: { size: 12240, type: WidthType.DXA },
        columnWidths: [6800, 5440],
        rows: [
          new TableRow({
            children: [
              cellNoBorder([
                new Paragraph({
                  spacing: { before: 500, after: 60 },
                  children: [new TextRun({ text: "EPOCH SKIN", bold: true, size: 30, color: "FFFFFF", font: "Arial", characterSpacing: 30 })],
                }),
                new Paragraph({
                  spacing: { after: 500 },
                  children: [new TextRun({ text: "Organic Skincare & Waxing Studio · New Orleans", size: 17, color: "AAAAAA", font: "Arial" })],
                }),
              ], { shading: DARK, width: 6800, margins: { top: 200, bottom: 200, left: 860, right: 200 } }),
              cellNoBorder([
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { before: 560 },
                  children: [new TextRun({ text: "PROJECT", bold: true, size: 34, color: GOLD, font: "Arial", characterSpacing: 20 })],
                }),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { after: 500 },
                  children: [new TextRun({ text: "HANDOFF", bold: true, size: 34, color: GOLD, font: "Arial", characterSpacing: 20 })],
                }),
              ], { shading: DARK, width: 5440, margins: { top: 200, bottom: 200, left: 200, right: 400 } }),
            ],
          }),
        ],
      }),

      // ── Gold accent strip ───────────────────────────────────────
      new Table({
        width: { size: 12240, type: WidthType.DXA },
        columnWidths: [12240],
        rows: [new TableRow({ children: [
          cellNoBorder([new Paragraph({ children: [new TextRun({ text: "", size: 2 })] })],
            { shading: GOLD, width: 12240, margins: { top: 30, bottom: 30, left: 0, right: 0 } }),
        ] })],
      }),

      // ── Meta row: prepared for / date / prepared by ─────────────
      new Table({
        width: { size: FULL_WIDTH, type: WidthType.DXA },
        columnWidths: [3507, 3507, 3506],
        indent: { size: 860, type: WidthType.DXA },
        rows: [new TableRow({ children: [
          cellNoBorder([
            new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "PREPARED FOR", bold: true, size: 16, color: LABEL, font: "Arial", characterSpacing: 15 })] }),
            new Paragraph({ children: [new TextRun({ text: "Kayla", size: 20, color: BODY, font: "Arial" })] }),
          ], { width: 3507, margins: { top: 260, bottom: 260, left: 0, right: 200 } }),
          cellNoBorder([
            new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "DATE", bold: true, size: 16, color: LABEL, font: "Arial", characterSpacing: 15 })] }),
            new Paragraph({ children: [new TextRun({ text: "July 9, 2026", size: 20, color: BODY, font: "Arial" })] }),
          ], { width: 3507, margins: { top: 260, bottom: 260, left: 200, right: 200 } }),
          cellNoBorder([
            new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "PREPARED BY", bold: true, size: 16, color: LABEL, font: "Arial", characterSpacing: 15 })] }),
            new Paragraph({ children: [new TextRun({ text: "James Afflu · In-flu-ential LLC", size: 20, color: GOLD_DARK, font: "Arial" })] }),
          ], { width: 3506, margins: { top: 260, bottom: 260, left: 200, right: 0 } }),
        ] })],
        borders: { bottom: THIN, top: NO_BORDER, left: NO_BORDER, right: NO_BORDER, insideHorizontal: NO_BORDER, insideVertical: NO_BORDER },
      }),

      // ── Intro line ───────────────────────────────────────────────
      new Paragraph({
        spacing: { before: 300, after: 100 },
        indent: { left: 860, right: 860 },
        children: [new TextRun({
          text: "The site is live and taking real bookings and orders. Here's everything you need to know to run it day to day, and the short list of what's still left to wrap up.",
          size: 20, color: SECONDARY, font: "Arial", italics: true,
        })],
      }),

      // ══════════════════════════════════════════════════════════
      // SECTION 1 — ACCOUNTS
      // ══════════════════════════════════════════════════════════
      new Paragraph({ indent: { left: 860, right: 860 }, children: [sectionTitleRun("Accounts You'll Use")] , spacing:{before:360,after:160}, border:{bottom:{style:BorderStyle.SINGLE,size:4,color:GOLD,space:6}}}),

      new Paragraph({
        indent: { left: 860, right: 860 }, spacing: { after: 140 },
        children: [new TextRun({ text: "These are yours to log into whenever you need them:", size: 19, color: SECONDARY, font: "Arial" })],
      }),

      accountRowBlank("Stripe Dashboard", "dashboard.stripe.com", "Payments, refunds, and payouts to your bank. This is where the money lives."),
      accountRowBlank("Vercel", "vercel.com", "Where the site is hosted \u2014 deploys go live from here."),
      accountRowBlank("GitHub", "github.com", "The site's code, version history, and where updates come from."),
      accountRowBlank("Turso", "turso.tech", "The database \u2014 every booking and order is stored here."),
      accountRowBlank("Squarespace", "squarespace.com", "Domain registrar \u2014 controls epoch-skin.com itself and its DNS."),
      accountRow("Resend", "fordkayla467@gmail.com", "Already set up \u2014 sends every confirmation and notification email."),
      accountRow("ImprovMX", "fordkayla467@gmail.com", "Already set up \u2014 forwards kayla@epoch-skin.com to your Gmail inbox."),
      accountRow("Admin Bookings Panel", "epoch-skin.com/admin/bookings", "Every appointment booked, in one list. Protected by a separate site password \u2014 ask James."),
      accountRow("Instagram / Facebook / TikTok", "your handles", "Linked in the site footer \u2014 whatever you post there is what visitors see."),

      new Paragraph({
        indent: { left: 860, right: 860 }, spacing: { before: 220, after: 60 },
        children: [new TextRun({ text: "James will fill in your email/password for the five accounts above marked with blanks \u2014 keep this page somewhere safe once they're in.", size: 18, color: LABEL, font: "Arial", italics: true })],
      }),

      // ══════════════════════════════════════════════════════════
      // SECTION 2 — WHAT'S ON THE SITE
      // ══════════════════════════════════════════════════════════
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({ indent: { left: 860, right: 860 }, children: [sectionTitleRun("What's On The Site")], spacing:{before:420,after:160}, border:{bottom:{style:BorderStyle.SINGLE,size:4,color:GOLD,space:6}} }),

      ...featureBlock("Shop", [
        "14 skincare products, organized by category",
        "Cart with discount codes (EPOCH10 / EPOCH20 / EPOCH30) and Louisiana sales tax calculated automatically",
        "Secure checkout through Stripe \u2014 card details never touch the site itself",
      ]),
      ...featureBlock("Booking", [
        "Body waxing, facial waxing, and organic facials \u2014 clients pick a service, date, and time",
        "Payment happens upfront through Stripe before the appointment is confirmed",
      ]),
      ...featureBlock("Confirmations (fully automatic)", [
        "Every paid booking or order sends the client a confirmation email",
        "Bookings also attach a calendar invite (.ics file) so it's one tap to add to their phone",
        "You get a copy of every confirmation too, so nothing books without you seeing it",
      ]),
      ...featureBlock("Marketing", [
        "Newsletter signup offering 20% off (code EPOCH20) on the homepage and footer",
        "Contact form with a Call Now button",
      ]),
      ...featureBlock("Everything else", [
        "About, Journal (blog), Privacy Policy, Terms of Service, Shipping & Returns \u2014 all live",
      ]),
      // ══════════════════════════════════════════════════════════
      // SECTION 3 — WHAT'S LEFT
      // ══════════════════════════════════════════════════════════
      new Paragraph({ indent: { left: 860, right: 860 }, children: [sectionTitleRun("What's Left To Finish")], spacing:{before:420,after:160}, border:{bottom:{style:BorderStyle.SINGLE,size:4,color:GOLD,space:6}} }),

      leftItem("Real photography \u2014 a hero image and a photo of you/the studio, plus a few more product/blog images"),
      leftItem("Social preview image \u2014 different from the small browser-tab icon (already done); this is the bigger image that shows up when the site is shared as a link in texts, DMs, or Slack. Not set up yet, so shared links currently show nothing"),

      // ── Footer ───────────────────────────────────────────────────
      new Paragraph({
        spacing: { before: 500 },
        indent: { left: 860, right: 860 },
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: "000000", space: 10 } },
        children: [new TextRun({ text: "", size: 2 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 },
        children: [new TextRun({ text: "Questions any time \u2014 James Afflu \u00b7 In-flu-ential LLC \u00b7 flu.wop@gmail.com", size: 17, color: LABEL, font: "Arial" })],
      }),
    ],
  }],
});

function sectionTitleRun(text) {
  return new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: DARK, font: "Arial", characterSpacing: 20 });
}

function accountRow(name, loginInfo, desc) {
  return new Paragraph({
    indent: { left: 860, right: 860 }, spacing: { after: 160 },
    children: [
      new TextRun({ text: name, bold: true, size: 20, color: BODY, font: "Arial" }),
      new TextRun({ text: "  \u2014  " + loginInfo, size: 18, color: GOLD_DARK, font: "Arial" }),
      new TextRun({ text: desc, size: 18, color: SECONDARY, font: "Arial", break: 1 }),
    ],
  });
}

function accountRowBlank(name, url, desc) {
  return new Paragraph({
    indent: { left: 860, right: 860 }, spacing: { after: 160 },
    children: [
      new TextRun({ text: name, bold: true, size: 20, color: BODY, font: "Arial" }),
      new TextRun({ text: "  \u2014  " + url, size: 18, color: GOLD_DARK, font: "Arial" }),
      new TextRun({ text: desc, size: 18, color: SECONDARY, font: "Arial", break: 1 }),
      new TextRun({ text: "Email:  ______________________________        Password:  ______________________________", size: 18, color: LABEL, font: "Arial", break: 1 }),
    ],
  });
}

function featureBlock(title, items) {
  return [
    new Paragraph({
      indent: { left: 860, right: 860 }, spacing: { before: 180, after: 60 },
      children: [new TextRun({ text: title, bold: true, size: 20, color: GOLD_DARK, font: "Arial" })],
    }),
    ...items.map((t) => new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      indent: { left: 1120, right: 860 },
      spacing: { after: 60 },
      children: [new TextRun({ text: t, size: 19, color: BODY, font: "Arial" })],
    })),
  ];
}

function leftItem(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    indent: { left: 1120, right: 860 },
    spacing: { after: 100 },
    children: [new TextRun({ text, size: 20, color: BODY, font: "Arial" })],
  });
}

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("/home/claude/handoff/Epoch-Skin-Project-Handoff.docx", buf);
  console.log("written");
});
