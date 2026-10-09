---
name: flat-html-site
description: >
  Reference for building and maintaining flat single-file HTML websites in James Afflu's style.
  Use this skill whenever working on EGOFF Essentials (egoff.vercel.app) or any new site that
  should be a single index.html — no build step, no framework, no npm. Triggers include: "add
  a section to the EGOFF site", "build a site like EGOFF", "single page site", "no framework",
  "just HTML and Tailwind CDN", or any request to edit egoff.vercel.app. Covers the full stack
  (Tailwind CDN, vanilla JS, Google Fonts), the EGOFF-specific content and aesthetic, component
  patterns (photo tree, checkout modal, legal modals, product cards), file structure, and Vercel
  deploy workflow.
---

# Flat HTML Site Skill

Single-file websites: no build step, no npm, no framework. Deploy by replacing `index.html` on GitHub.

---

## Stack

| Layer | Choice |
|---|---|
| HTML | Single `index.html` in repo root |
| CSS | Tailwind CSS CDN (`<script src="https://cdn.tailwindcss.com">`) |
| JS | Vanilla JS — inline `<script>` at bottom of body |
| Fonts | Google Fonts via `<link>` in `<head>` |
| Deployment | GitHub repo → Vercel auto-deploy on push |
| Images | In repo root (family photos) or `img/` subfolder (products) |

**No:** npm, node_modules, package.json, tsconfig, next.config, build commands.

---

## EGOFF Essentials — Site Reference

**URL:** egoff.vercel.app  
**Client:** Ericka A. Goff  
**Product:** Luxury natural handmade soap  
**Tone:** Warm, spiritual, Jamaican and New Orleans roots, premium artisan

### Aesthetic
- **Primary:** Emerald green + gold
- **Background:** Deep dark emerald (`#0a2218` or similar)
- **Accent:** Gold (`#c9a848` or similar)
- **Text:** Warm white / cream
- **Fonts:** Cinzel (headings, logo) · Cormorant Garamond (body, subheadings) · Lato (utility text)

```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
```

### Page Sections (top → bottom)
1. **Hero** — logo, tagline "born from New Orleans love", CTA
2. **About / Story** — Ericka's background, PWOG mission
3. **Products** — 16-item grid with `aspect-ratio: 4/3` image containers
4. **Ancestral Tree** — three-tier CSS photo tree (see below)
5. **Contact / Order** — "Send My Order" triggers checkout modal
6. **Footer** — ToS + Privacy links (open legal modals)

### Product Cards
```html
<!-- Each product card image container -->
<div style="aspect-ratio: 4/3; overflow: hidden; background: #1a3a2a;">
  <img src="img/product-slug.jpg" alt="Product Name"
       style="width:100%; height:100%; object-fit:cover;"
       onerror="this.parentElement.innerHTML='<div style=\'display:flex;align-items:center;justify-content:center;height:100%;color:#c9a848;font-family:Lato\'>Photo Coming Soon</div>'">
</div>
```
- Product photos go in `img/` subfolder: `img/almas-grace.jpg` etc.
- 16 products total

### Ancestral Tree (three-tier CSS)
Structure: Deep Roots → Bridge Generation → The Crown (PWOG)

```html
<!-- Tree uses dark emerald bg, gold gradient horizontal connectors,
     vertical drops with dot nodes, circular portrait frames -->
<section class="ancestral-tree" style="background: #051a0f; padding: 4rem 0;">
  <!-- Tier 1: Deep Roots (2 people) -->
  <!-- Tier 2: Bridge Generation (3 people) -->
  <!-- Tier 3: The Crown — PWOG members (Ericka as Founder, others) -->
</section>
```

**Family photo filenames** (in repo root, NOT in `img/`):
```
IMG_20260419_113211632_MP.JPG  → Geraldine Goff Rollins
IMG_20260419_104316778_MP.JPG  → Alma Snowden Thomas
IMG_20260419_104809046_MP.JPG  → Hilda Smith Caliste
1000004826.JPG                 → Ruby Caliste Sumler
1000004855.JPG                 → Julia Sanchez Thomas
founder.jpg                    → Ericka A. Goff
hero-logo.jpg                  → Site logo/hero
```
PWOG Crown row members without photos show gold monogram initials — intentional.

### Checkout Modal
Triggered by "Send My Order" button. Collects:
- Customer name, email, phone
- Shipping address
- Order notes + order summary

Submits via `mailto:` (formatted order email). Shows success state after submit.

```js
function openCheckout() {
  document.getElementById('checkout-modal').style.display = 'flex';
}
function closeCheckout() {
  document.getElementById('checkout-modal').style.display = 'none';
}
// Form validation → format order → window.location = 'mailto:...'
```

### Legal Modals
Footer links open ToS and Privacy Policy modals (same pattern as checkout modal).

```html
<a href="#" onclick="openModal('tos-modal')">Terms of Service</a>
<a href="#" onclick="openModal('privacy-modal')">Privacy Policy</a>
```

---

## File Structure

```
repo-root/
├── index.html              ← entire site
├── hero-logo.jpg
├── founder.jpg
├── IMG_20260419_113211632_MP.JPG
├── IMG_20260419_104316778_MP.JPG
├── IMG_20260419_104809046_MP.JPG
├── 1000004826.JPG
├── 1000004855.JPG
└── img/
    ├── almas-grace.jpg     ← product photos (when available)
    ├── ...etc
```

**Critical rule:** Family tree photos use original device filenames, stored in repo root alongside `index.html`. Product photos go in `img/` subfolder.

---

## Deploy Workflow

1. Edit `index.html` locally (or in GitHub web editor)
2. Replace the file in the GitHub repo
3. Vercel auto-deploys — no build step, no commands needed
4. To add a product photo: drop `img/product-name.jpg` into the `img/` folder in the repo

---

## Building a New Flat HTML Site

When James asks for a new site in this style:

1. **Single file** — everything in `index.html`
2. **Tailwind CDN** in `<head>`:
   ```html
   <script src="https://cdn.tailwindcss.com"></script>
   <script>
     tailwind.config = {
       theme: { extend: { colors: { /* site palette */ } } }
     }
   </script>
   ```
3. **Google Fonts** via `<link>` — pick from: Cinzel, Cormorant Garamond, Lato (EGOFF style) or Cormorant Garamond + DM Sans (ecosystem style)
4. **Vanilla JS** at bottom of `<body>` — modals, toggles, form handling
5. **Images** — in repo root or `img/` subfolder depending on type
6. **No framework concerns** — no routing, no API routes, no server components

---

## Common Patterns

### Modal (reusable)
```html
<!-- Trigger -->
<button onclick="document.getElementById('my-modal').style.display='flex'">Open</button>

<!-- Modal -->
<div id="my-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:50; align-items:center; justify-content:center;">
  <div style="background:#0a2218; border:1px solid #c9a848; border-radius:1rem; padding:2rem; max-width:600px; width:90%; position:relative;">
    <button onclick="document.getElementById('my-modal').style.display='none'"
            style="position:absolute; top:1rem; right:1rem; color:#c9a848; font-size:1.5rem;">&times;</button>
    <!-- content -->
  </div>
</div>
```

### Mobile-first spacing
- Use responsive Tailwind: `py-14 md:py-24`, `gap-6 md:gap-10`
- Stack grids early: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Touch targets: min `44px` height on buttons/links

---

## Notes

- James replaces the whole `index.html` file when updating — keep it self-contained
- `onerror` fallbacks on all `<img>` tags — real photos may not exist yet
- Spiritual/ancestral content is intentional and meaningful — treat with care
- Emerald + gold is non-negotiable for EGOFF — don't drift to other palettes
- **Designer credit on every client site:** one small footer line reading `Designed by IN-FLU-ENTIAL` (all caps, both hyphens, no "LLC"), linking to `https://in-flu-ential.vercel.app` in a new tab until the real domain is live. Footer only — never a floating badge. Same rule as `prospect-demo`.
- **Client contact details only** — never carry James's own phone (630-344-2811) or email over from another build. Grep for them before pushing.
