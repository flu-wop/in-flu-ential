# IN-FLU-ENTIAL LLC — Setup Guide

---

## 1. Install & Run Locally

```bash
cd influential
npm install
npm run dev
# → http://localhost:3000
```

---

## 2. Deploy to Vercel

```bash
npm install -g vercel
vercel
# Follow prompts — framework will auto-detect as Next.js
```

Or connect the GitHub repo to vercel.com for automatic deploys on push.

---

## 3. Replace Logo & Favicon

| File | Location | Notes |
|------|----------|-------|
| Logo | `/public/logo.png` | Shown in Nav — transparent PNG, ~64px tall recommended |
| Favicon | `/public/favicon.ico` | Browser tab icon |
| OG Image | `/public/og-image.jpg` | Social share preview — 1200×630px |

---

## 4. Set the Vault Password

Edit `lib/vault-items.ts`:

```ts
export const VAULT_PASSWORD = "your-new-password-here";
```

> **Production upgrade:** move to an environment variable:
> ```ts
> export const VAULT_PASSWORD = process.env.VAULT_PASSWORD ?? "fallback";
> ```
> Then add `VAULT_PASSWORD=yourpassword` to Vercel → Settings → Environment Variables.

---

## 5. Set Up Calendly

1. Create two event types at [calendly.com](https://calendly.com):
   - **15-min Discovery Call** (free)
   - **Strategy Consultation** (set price/payment there)

2. Edit `lib/booking.ts`:

```ts
export const BOOKING = {
  free: {
    label: "Free 15-Min Discovery Call",
    url: "https://calendly.com/YOUR_HANDLE/15min",  // ← paste your link
  },
  paid: {
    label: "$250/hr Strategy Consultation",
    url: "https://calendly.com/YOUR_HANDLE/strategy", // ← paste your link
  },
};
```

---

## 6. Add Items to the Private Vault

Edit `lib/vault-items.ts` — append to the `VAULT_ITEMS` array:

```ts
{
  id: "4",                          // unique string
  title: "New Pitch Deck",
  category: "Pitch Deck",           // "Pitch Deck" | "Strategy" | "Work in Progress" | "Soho House" | "Other"
  description: "Short description of the document.",
  fileUrl: "https://your-link.com", // Google Doc, Figma, Notion, PDF — or omit for no link
  date: "2025-04",
},
```

Save the file → Vercel redeploys automatically if connected to GitHub.

---

## 7. Set Up Email Capture (Formspree)

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form → copy the form ID
3. In `app/page.tsx`, replace:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```

---

## 8. Update Contact Email

Search the project for `hello@influential.llc` and replace with your real email address.

---

## File Map (quick reference)

```
app/
  page.tsx          → Home
  music/page.tsx    → Music
  business/page.tsx → Business
  portfolio/page.tsx→ Portfolio
  vault/page.tsx    → Vault (wrapper)
  booking/page.tsx  → Booking (wrapper)
  privacy/page.tsx  → Privacy Policy
  terms/page.tsx    → Terms of Service
  not-found.tsx     → 404 page
  layout.tsx        → Root layout, SEO, fonts

components/
  Nav.tsx           → Navigation
  Footer.tsx        → Footer
  VaultClient.tsx   → Vault password gate + content
  BookingClient.tsx → Calendly toggle + embeds

lib/
  fonts.ts          → Google Fonts config
  vault-items.ts    → Vault content + password ← EDIT THIS
  booking.ts        → Calendly URLs            ← EDIT THIS

public/
  logo.png          ← REPLACE
  favicon.ico       ← REPLACE
  og-image.jpg      ← ADD (1200×630)
```
