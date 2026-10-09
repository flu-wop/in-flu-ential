---
name: client-report
description: James Afflu's branded social-performance recap generator — the reporting back end of his client funnel. Use this skill whenever the task is summarizing or reporting how a client's social did — e.g. "build the monthly recap for [client]", "pull [client]'s Instagram/TikTok numbers", "how did [client] do last month", "make a performance report for [client]", "client report", or any mention of Ayrshare analytics, reach/impressions/engagement recaps, or a deliverable showing social results. It pulls analytics from Ayrshare per the client's profile(s) and renders a branded one-page HTML recap (IN-FLU-ENTIAL LLC design system) ready to send or print to PDF. This closes the loop after client-funnel (plan) and social-scheduler (post). Reach for it when results need to go in front of a client — NOT for posting (social-scheduler) or planning (client-funnel).
---

# Client Report

The reporting back end of the funnel: `client-funnel` plans the week, `social-scheduler` posts it, and this turns the results into a branded recap a client actually wants to see. It reads Ayrshare analytics and renders a one-page HTML report in the IN-FLU-ENTIAL LLC look, then exports a clean PDF. It never posts.

## Brand Name — Non-Negotiable

`IN-FLU-ENTIAL LLC` is ALL CAPS everywhere it appears on the report — footer, filename. Never `In-flu-ential`.

## Where this sits

- **client-funnel** — plans (`clients/<client>/`, generates post-plan.csv).
- **social-scheduler** — posts via Ayrshare (`post-plan.csv` + `post_clips.mjs`).
- **client-report** *(this skill)* — reads analytics, renders `reports/<client>/report.html`.

Auth is shared with social-scheduler: `AYRSHARE_API_KEY` + `AYR_PROFILE_<ACCOUNT>` per profile (Business plan).

## The flow

```bash
# 1. one report.conf per client + period
cp assets/report.example.conf reports/jade-the-gem/report.conf   # then edit (CLIENT, PERIOD, ACCOUNTS, PLATFORMS)

# 2. pull analytics (live) + render the recap
node scripts/client_report.mjs all reports/jade-the-gem
#    fetch -> reports/jade-the-gem/analytics.json   (raw API response, re-renderable)
#    render -> reports/jade-the-gem/report.html      (branded one-pager)

# (fetch and render can run separately: ... fetch reports/<c>   then   ... render reports/<c>)

# 3. render report.html to a clean PDF (headless, no manual print dialog)
python /mnt/skills/public/docx/scripts/office/soffice.py --headless --convert-to pdf reports/jade-the-gem/report.html
#    -> reports/jade-the-gem/report.pdf  ready to send the client

# (if soffice mishandles the HTML/CSS, fall back to a headless-Chrome print:
#  npx puppeteer print reports/jade-the-gem/report.html reports/jade-the-gem/report.pdf
#  — install puppeteer once with: npm install -g puppeteer)
```

## report.conf

`CLIENT`, `PERIOD_START`/`PERIOD_END` (YYYY-MM-DD), `ACCOUNTS` (comma-separated; each maps to `AYR_PROFILE_<ACCOUNT>`), `PLATFORMS` (space-separated). Brand colors/fonts default to the IN-FLU-ENTIAL LLC design system and are overridable. See `assets/report.example.conf`.

## What the report shows

A dark/gold one-pager: a one-line narrative, four KPI tiles (Reach, Impressions, Engagement, Followers), and a per-channel table (reach / impressions / engagement / followers / views), footed with "Prepared by IN-FLU-ENTIAL LLC". Rendered as `report.html` (no server) and then exported to `report.pdf` as the client-facing deliverable — present the PDF, not the HTML file, unless James asks for the raw HTML.

## Gotchas (see references/ayrshare-analytics.md)

- Analytics need Premium/Business; multi-profile needs Business.
- **TikTok/YouTube lag 24–48h** — run the recap a couple days after the period ends, not the morning after.
- Field names vary across platforms; the renderer reads common names defensively and falls back to 0. `analytics.json` keeps the raw response, so fixing a normalization gap is a re-`render`, not a re-fetch.

## Output style

James wants exact copy-paste commands, one block, minimal prose. Given a client and a period, write the `report.conf`, give the `all` command, then stop. Don't re-explain the API unless asked — point to the reference. One question at a time if the client, period, accounts, or platforms are missing.

## Reference files

- `scripts/client_report.mjs` — fetch (live Ayrshare) + render (branded HTML). Node 18+.
- `assets/report.example.conf` — copy to `reports/<client>/report.conf`.
- `references/ayrshare-analytics.md` — endpoints, auth, metric normalization, plan/freshness gotchas.
