---
name: social-scheduler
description: James Afflu's Ayrshare posting + scheduling pipeline for his two clip accounts — Fish Pot and BoomerHumor. Use this skill ANY time the task involves posting, scheduling, or queueing finished clips to social platforms — e.g. "schedule Wednesday's clips", "post the Fish Pot reel to IG and TikTok", "queue the BoomerHumor batch", "push these to Ayrshare", "set up the posting plan", "what time should these go out", or any mention of Ayrshare, post-plan.csv, post_clips.mjs, scheduleDate, or Profile-Key. This is the back half of the clip workflow — it takes the clips that clip-pipeline produced in the per-account out/ folders and gets them posted. Reach for it whenever clips need to go live or get scheduled. James posts two distinct brands through Ayrshare (Business plan, one profile each), works from the terminal with Node, and schedules in advance.
---

# Social Scheduler (Ayrshare)

This is the back half of the clip workflow: `clip-pipeline` makes the clips in `out/<account>/`, and this skill posts or schedules them through **Ayrshare** — one API that fans out to Instagram, TikTok, YouTube, and the rest. Each brand (Fish Pot, BoomerHumor) is a separate Ayrshare profile, selected per row.

## Context (assume unless told otherwise)

- **One API, two brands.** Ayrshare posts to all platforms from a single `/post` call. Fish Pot and BoomerHumor are **separate Ayrshare profiles** (different IG/TikTok handles), each with its own **Profile-Key**. The poster routes each row to the right profile by account.
- **Plan requirement (important):** posting *video* needs Premium or Business, and running *two profiles* needs the **Business plan**. On a basic account, video posts and multi-profile both fail. If only the Primary Profile exists, leave the Profile-Key env vars unset and everything posts to that one profile.
- **Local clips need a URL.** Ayrshare fetches media from a URL, so the poster uploads each local clip first (presigned upload → public `accessUrl`) and posts that. Uploaded media is kept ~90 days — fine for near-term scheduling.
- **Times are UTC.** Ayrshare schedules in Zulu/UTC (`2026-06-05T23:00:00Z`). A past time posts immediately.
- **Node, not bash.** The poster is a Node script (matches the rest of James's stack); needs Node 18+.

## One-time setup

```bash
# from the Ayrshare dashboard:
export AYRSHARE_API_KEY="your-api-key"            # API Key page (Primary Profile)
export AYR_PROFILE_FISHPOT="fishpot-profile-key"  # Profile-Key page, Fish Pot profile
export AYR_PROFILE_BOOMERHUMOR="boomer-profile-key"
```

Put these in your shell profile (`~/.zshrc`) so they persist. Skip the two Profile-Key lines if you're still on a single profile.

## The happy path

```bash
# 1. Cut the clips first (clip-pipeline) so they're in out/<account>/
# 2. Copy post-plan.example.csv to post-plan.csv and fill in a row per post
# 3. Preview — uploads/posts NOTHING, just shows the plan:
node scripts/post_clips.mjs post-plan.csv --dry-run
# 4. Send it for real:
node scripts/post_clips.mjs post-plan.csv
```

**Always `--dry-run` first.** It validates every row (files exist, platforms set, which profile, the exact caption) without uploading or posting, so a typo can't fire a live post.

## The plan format

`post-plan.csv` — one row per post. **`caption` is the last column**, so commas, apostrophes, emoji, and hashtags are all safe.

| Column      | Meaning                                                                 |
| ----------- | ----------------------------------------------------------------------- |
| `account`   | `fishpot` or `boomerhumor` — picks the Ayrshare profile                 |
| `file`      | path to the clip, e.g. `out/fishpot/fishpot_wednesday_main.mp4`         |
| `platforms` | space-separated: `instagram tiktok youtube facebook ...`                |
| `schedule`  | UTC Zulu time (`2026-06-05T23:00:00Z`); **blank = post now**            |
| `caption`   | post text (last column; commas/emoji/hashtags fine)                     |

A row whose file is missing, or that lists no platforms, is skipped with a warning rather than killing the run.

## Account conventions

- **Fish Pot**: the deliberate plan — usually a few scheduled posts, fuller captions, the considered platforms (IG + TikTok + YouTube).
- **BoomerHumor**: high volume — many rows, punchy one-line captions, usually IG + TikTok. Reuse the same clip file across rows with different captions/times when split-testing the joke.

## Gotchas

- **X/Twitter** requires your own OAuth credentials since 2026-03-31 (Ayrshare's BYO-keys change). The poster warns if `twitter`/`x` is in a row. Setup is in `references/ayrshare.md`.
- **YouTube** needs a title; the poster uses the caption's first line. Override behavior is noted in the reference.
- **Scheduled media expiry:** uploaded clips live ~90 days, so don't schedule a post farther out than that against an uploaded file.

## Output style

James wants exact copy-paste commands, one block, minimal prose. Given clips and times, write the `post-plan.csv` rows and the two commands (dry-run, then live), and stop. Don't re-explain Ayrshare unless asked — point to the reference. One question at a time if a caption, platform, or time is missing.

## Reference files

- `scripts/post_clips.mjs` — the poster. Reads the plan, uploads each clip, creates the post/schedule. Edit it if the API flow changes.
- `assets/post-plan.example.csv` — copy to `post-plan.csv` and fill in.
- `references/ayrshare.md` — auth + Profile-Key headers, plan requirements, the upload + post + schedule endpoints, UTC time conversion, per-platform notes (YouTube title, X BYO keys), and dry-run/troubleshooting. Check here before changing the script.
