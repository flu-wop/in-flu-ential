---
name: clip-pipeline
description: James Afflu's deterministic, multi-campaign social-clip cutting pipeline. Use this skill ANY time the task involves cutting, reframing, captioning, or batch-producing short vertical clips from longer masters — e.g. "cut me Wednesday's clips", "make the Fish Pot clips", "BoomerHumor remix off the love-my-baby master", "cut the Streetbeat drumline clips", "reframe this to 9:16", "burn the title on", "run the clip spec", "add a campaign", "turn this footage into reels/shorts/TikToks", or any mention of make_clips.sh, spec.csv, campaigns/, or the ffmpeg clip pipeline. Each campaign (Fish Pot, Streetbeat.video, ...) has its own brand voice, overlay style, hashtags, and palette. Reach for it whenever footage needs to become posted clips, even if the user just names a campaign, a master, and some timecodes. James works from the terminal on two Macs (studio Mac has brew ffmpeg; home Big Sur 11.7 needs a static ffmpeg binary), pulls masters from Vimeo, and posts via a unified scheduling API.
---

# Clip Pipeline (multi-campaign)

The job is always the same shape: take a long master, cut one or more segments, reframe each to vertical 9:16, burn a title in the campaign's style, and drop the finished clips into per-campaign / per-account folders ready to schedule. It's deterministic on purpose — the same spec produces the same clips every time, on either Mac.

## Campaigns

Each **campaign** is a client/brand with its own look and voice, defined in `campaigns/<campaign>.conf`:

- **fishpot** — Fish Pot. Polished NOLA brass/performance energy. Houses two posting accounts: `fishpot` (one considered line) and `boomerhumor` (high-volume roast of the same masters). Clean white Arial in a translucent box. This is the original look.
- **streetbeat** — Streetbeat.video. Raw, energetic, New Orleans street culture, drumming pride. Bold, gritty overlay (thick outline + shadow, not a clean box), UPPERCASE captions. Bold display font (`assets/streetbeat.ttf`, falls back to Impact).

A `.conf` sets the **render style** the script uses at cut time (`CAMPAIGN_FONT`, `CAMPAIGN_FONTCOLOR`, `CAMPAIGN_FONTSIZE`, `CAMPAIGN_TITLE_Y`, `CAMPAIGN_TITLE_STYLE` = `box`|`outline`, plus `CAMPAIGN_BOXCOLOR` or `CAMPAIGN_BORDERW`/`CAMPAIGN_BORDERCOLOR`) and the **authoring reference** (`CAMPAIGN_VOICE`, `CAMPAIGN_HASHTAGS`, `CAMPAIGN_PHRASES`) used when writing captions and handing off to the scheduler. If a campaign has no `.conf`, the script falls back to the default Fish Pot look.

**To add a campaign:** copy an existing `.conf` to `campaigns/<new>.conf`, edit the style + voice, then use that name in the `campaign` column.

## Context (assume unless told otherwise)

- **Masters** come from Vimeo: as the owner, **Download → choose Original**, save into `masters/`. Don't re-encode the master first; the pipeline cuts straight from it.
- **Two Macs, one ffmpeg gotcha:**
  - Studio Mac (newer): `ffmpeg` is on PATH via `brew install ffmpeg`.
  - Home machine (**Big Sur 11.7**): Homebrew dropped Big Sur, so use a **static ffmpeg binary** at `./bin/ffmpeg`. Setup is in `references/ffmpeg-cookbook.md`.
  - The script auto-detects: PATH `ffmpeg` first, then `./bin/ffmpeg`. Override with `FFMPEG=/path/to/ffmpeg`.
- **Output is vertical 1080×1920 (9:16)**, H.264 + AAC, `+faststart` — drops straight into the scheduler.

## The happy path

Three steps. Output these and stop.

```bash
# 1. Put the downloaded master in masters/ (Vimeo → Download → Original)
# 2. Add one row per clip to spec.csv  (see format below)
# 3. Run it
./scripts/make_clips.sh spec.csv
```

Finished clips land in `out/<campaign>/<account>/` (collapsing to `out/<campaign>/` when the account name equals the campaign). So Fish Pot lands in `out/fishpot/` and `out/fishpot/boomerhumor/`; Streetbeat lands in `out/streetbeat/`. Re-running overwrites cleanly, so iterate on captions or timecodes and just run again.

## The spec format

`spec.csv` — one row per clip. **`title` is the last column on purpose**, so commas and apostrophes in captions are safe ("Rock and Roll F'n'Lovely", "when the band hits different, fr").

```
campaign,account,master,start,end,outfile,title
fishpot,fishpot,masters/love-my-baby.mp4,14,38,fishpot_wednesday_main.mp4,We move different.
fishpot,boomerhumor,masters/love-my-baby.mp4,14,38,boomerhumor_wednesday.mp4,when the band hits different
streetbeat,streetbeat,masters/streetbeat-secondline.mp4,8,26,streetbeat_drumline_01.mp4,DRUMS HIT DIFFERENT
```

| Column     | Meaning                                                                          |
| ---------- | -------------------------------------------------------------------------------- |
| `campaign` | `fishpot` \| `streetbeat` \| … — picks `campaigns/<campaign>.conf` (style + voice) |
| `account`  | posting account; sets the `out/<campaign>/<account>/` subfolder                   |
| `master`   | path to the downloaded original, e.g. `masters/love-my-baby.mp4`                  |
| `start`    | start time in **whole seconds**                                                  |
| `end`      | end time in **whole seconds** (duration = end − start)                            |
| `outfile`  | output filename, e.g. `streetbeat_drumline_01.mp4`                                |
| `title`    | burned caption (last column; commas/apostrophes fine; leave blank for no title)   |

- Blank lines and lines beginning with `#` are ignored.
- For sub-second cuts or `HH:MM:SS` timecodes, see `references/ffmpeg-cookbook.md`.

## What the pipeline does to each clip

Cut → reframe to 9:16 with a blurred fill (keeps the whole frame visible, no cropping out performers) → burn the title in the campaign's style (clean box or gritty outline). Full filter chain, alternate reframes (hard center-crop, 4:5, 1:1), title positions, brand fonts, and loudness normalization are all in `references/ffmpeg-cookbook.md`.

## Account conventions

- **Fish Pot (`fishpot`)**: one master usually yields a small number of deliberate clips. Strong single line, on brand. This is the spec'd plan — match it exactly.
- **BoomerHumor (`boomerhumor`)**: same masters, many rows, fast turnaround. Captions are the joke/roast — vary them per row; reuse the same `start`/`end` as a Fish Pot clip but with a different `outfile` and `title`. (Posting handle may be `boomerhumor26`; that lives in the scheduler/Ayrshare profile, the cut folder key stays `boomerhumor`.)
- **Streetbeat (`streetbeat`)**: raw and high-energy. Short UPPERCASE lines pulled from the campaign phrases ("NOLA STREET BEAT", "BELOW SEA LEVEL", "DRUMS HIT DIFFERENT").

## Scheduling

Clips are produced ready to post; the actual posting goes through a unified scheduling API (Ayrshare) rather than native per-platform uploads. This skill stops at finished files in `out/`. The `social-scheduler` skill picks them up — its `post-plan.csv` references explicit file paths, so point those at the new `out/<campaign>/<account>/` locations.

## Output style

James wants exact copy-paste commands, one block, minimal prose. Given a campaign, master, and timecodes, write the `spec.csv` rows and the run command, then stop. Don't explain ffmpeg flags unless he asks — point him to the cookbook. One question at a time if a campaign, path, account, or caption is missing.

## Reference files

- `scripts/make_clips.sh` — the cutter. Reads the spec, loads the campaign `.conf`, produces the clips. Don't rewrite it from scratch; edit it if the recipe needs to change.
- `campaigns/<campaign>.conf` — per-campaign render style + brand voice/hashtags/phrases. Copy one to add a campaign.
- `assets/spec.example.csv` — copy this to `spec.csv` and fill it in.
- `references/ffmpeg-cookbook.md` — Big Sur static-ffmpeg setup, the full filter chain explained, reframe/caption variations, brand fonts, loudnorm, ffprobe checks, and Vimeo master pulls. Check here before changing the recipe.
