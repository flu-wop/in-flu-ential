---
name: prospect-demo
description: >
  James Afflu's demo-before-pitching method for New Orleans client prospecting. Use this
  skill ANY time James wants to build a demo site for a prospect BEFORE sending a proposal
  or pitching in person — e.g. "build a demo for [prospect]", "make them a preview site",
  "let's show them instead of tell them", or any new prospect entering the pipeline. The
  standing rule since Aug 2026: every website prospect gets a working demo built first,
  from a FULL scan of their existing web presence (every page, not just the homepage),
  before any proposal goes out. This is the front-front of the funnel — before
  client-proposal, not instead of it.
---

# Prospect Demo Skill

James's standing prospecting method (Aug 2026): **build the demo before the pitch, every
time.** Don't describe what the new site could look like — show it, built with the
prospect's real photos, logo, and copy. He calls this "having built his own
base44/lovable" — a reusable pattern for every website prospect rather than one-off
custom work per pitch.

## Why this exists

A generic pitch competes on price and promises. A working demo built from the
prospect's actual content competes on nothing — it's just obviously better than what
they have, and they can see it before spending a dollar. This consistently outperforms
cold proposals in James's pipeline (I-tal Garden, NOLA Colonics, Reliant Recycling, Fire
on the Bayou, Bourbon Daiquiris, and others were all demo-first).

## Step 1 — Full web-presence scan (mandatory, do not skip)

The most common failure of this skill has been scanning the homepage only and then
filling the rest with placeholders while real content sat one click away. **Every
reachable page gets read before a single line of the demo is written.**

1. **Map the whole site.** Fetch `/sitemap.xml` (and `/sitemap_index.xml`,
   `/wp-sitemap.xml`, `/page-sitemap.xml` for WordPress) and `/robots.txt`. Then fetch
   the homepage and collect every internal link from the nav, footer, and body. The
   union of the sitemap and the crawled links is the page list.
2. **Read every page on the list** — about, team/crew, services, menu, pricing, gallery,
   portfolio/case studies, events, FAQ, contact, blog posts that describe real work.
   For big WordPress SEO sites with many near-duplicate landing pages, read all of the
   distinct ones and skim the duplicates for any fact not seen elsewhere.
3. **Then the off-site sources:** Linktree (`linktr.ee/<handle>`) — the most reliable
   aggregator; Google Business / Yelp / review sites via web search (hours, address,
   ratings); YouTube / Vimeo channels (video thumbnails are fetchable); press
   coverage. Facebook and Instagram block automated fetching — don't burn attempts on
   them; ask James for screenshots if they hold something essential.
4. **If a site's bot protection starts returning 403/503 mid-scan**, slow down and
   retry the remaining pages, or switch to the built-in browser. Don't stop at the
   pages that happened to load.
5. **Write a content inventory before building** — a short list, per page scanned, of
   what real content exists: names and roles, services and prices, hours, address,
   events, taglines, credentials/awards, named clients, every usable image URL. Show
   James the page count scanned and anything notable (an award, a named client, a team
   roster) in one or two lines. The demo is built from this inventory.

The live site is the source of truth for facts. Never invent names, prices, awards,
clients, or stats; anything the scan did not find is a clearly marked placeholder.

## Step 2 — Build

1. **Use the real assets from the inventory.** Never use stock photos or placeholder
   copy where real content exists. Where a photo truly doesn't exist yet, use an
   `onerror` fallback that shows "Photo Coming Soon" rather than a broken image.
2. **Pick the build format based on scope:**
   - Simple single-page rebuild → flat single-file HTML (see `flat-html-site`) —
     fastest to stand up, easiest to iterate live in front of the prospect
   - Fuller rebuild with ordering/booking → Next.js, matching the relevant stack
     (`booking-system` for appointment/order flows)
3. **Feature what they're not using.** Look for underused credibility the prospect
   already has and isn't showing off — a buried safety award (Reliant Recycling), real
   jobsite photography sitting unused, a signature brand element (gemstone-named
   membership tiers at NOLA Colonics), a Gold Addy campaign buried on an inner page
   (Fire on the Bayou). The demo should make their own strengths visible, not invent
   new positioning.
4. **Match their existing palette/identity** unless the pitch is specifically about a
   rebrand — the demo should read as "your business, done right," not "a different
   business."
5. **Respect their existing payment stack.** If they already run a POS (Clover for
   Bourbon Daiquiris, Square for Liquid Gold), the demo points at that — don't default
   to Stripe. Delivery can link out to their Uber Eats / DoorDash listing.
6. **Mock, don't wire, payment/ordering** unless the deal is closing same-session. A
   mock cart + mock success screen is enough to demonstrate the functionality without
   building infrastructure for a prospect who hasn't paid yet.
7. **Only the client's contact details on the page.** Their phone, email, address, and
   socials — never James's own number (630-344-2811) or email carried over from
   another build. Grep the finished demo for `630-344-2811` and `flu.wop` before
   pushing.

## Step 3 — Designer credit (every demo, exact format)

The footer carries the credit, and nowhere else:

- Text: **`Designed by IN-FLU-ENTIAL`** — "IN-FLU-ENTIAL" in all caps with both hyphens,
  no "LLC", no "Flu-Wop", no "James Afflu", no "Made with…".
- Link: `https://in-flu-ential.vercel.app` (switch to the real domain once it's live),
  opening in a new tab (`target="_blank" rel="noopener"`).
- Placement: a small line in the footer, styled in the site's own muted footer text.
  Never a floating or fixed badge — it covers buttons on phones.

```html
<p class="text-xs opacity-60">
  Designed by <a href="https://in-flu-ential.vercel.app" target="_blank" rel="noopener"
  class="underline-offset-2 hover:underline">IN-FLU-ENTIAL</a>
</p>
```

## Step 4 — Push

Push to its own repo (`flu-wop/<prospect-slug>`) so Vercel gives it a real shareable
URL, not a local file. Git is connected through the Claude desktop app and Claude
Code — no personal access tokens. Never put a token in a remote URL or paste one
into chat (see `git-vercel-deploy`).

## After the demo is built

Hand off to `client-proposal` for the actual pitch document — the demo is the leave-behind
or in-person show, the proposal is the money document. Case studies in the proposal
should be 2–3 picked for industry fit (not a fixed set), pulled from
`nola-client-pipeline` history: wellness/booking prospects → Epoch Skin; retail/product
prospects → A&B Supply, Jade the Gem; service/creative prospects → Fire on the Bayou, MCS.

## Output style

James wants the demo built and pushed, not narrated — deliver the live URL, then a short
note: how many pages were scanned, what real content was pulled in, and what is still a
placeholder. Don't over-explain the build process unless asked.
