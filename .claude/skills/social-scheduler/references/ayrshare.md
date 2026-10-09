# Ayrshare reference (social-scheduler)

Everything the poster (`scripts/post_clips.mjs`) relies on, plus the manual equivalents for debugging. Source of truth is https://www.ayrshare.com/docs — check there if a call starts failing.

## Contents
- Auth + Profile-Key (two brands)
- Plan requirements
- The three calls (upload URL → PUT → post)
- Scheduling in UTC
- Per-platform notes (YouTube, X/Twitter)
- Dry run + troubleshooting

## Auth + Profile-Key (two brands)

Every request needs the API key as a Bearer token:

```
Authorization: Bearer <AYRSHARE_API_KEY>
Content-Type: application/json
```

The API Key is on the dashboard's **API Key** page (switch to your Primary Profile first). To post as a specific brand, add that profile's key:

```
Authorization: Bearer <API_KEY>
Profile-Key: <that-profile's-key>
```

Find each Profile-Key on the dashboard's **Profile Key** page after switching to that profile (Fish Pot, BoomerHumor). The poster reads them from `AYR_PROFILE_FISHPOT` / `AYR_PROFILE_BOOMERHUMOR` and adds the header automatically per row. No Profile-Key set for an account → it posts to the Primary Profile.

## Plan requirements

- **Video posting:** Premium or Business plan. (Text/single-image work on any plan.)
- **Multiple profiles (Fish Pot + BoomerHumor as separate handles):** Business plan. Create one User Profile per brand; each yields a Profile-Key.

## The three calls

The poster does these in order. To reproduce by hand for one clip:

**1. Get a presigned upload URL** (good for files up to 5 GB; Premium/Business):

```bash
curl -s -H "Authorization: Bearer $AYRSHARE_API_KEY" \
  "https://api.ayrshare.com/api/media/uploadUrl?fileName=clip.mp4&contentType=mp4"
# -> { "uploadUrl": "...", "accessUrl": "https://.../clip.mp4", "contentType": "video/mp4" }
```

**2. PUT the bytes** to `uploadUrl` (valid 30 min, one use):

```bash
curl -s -X PUT -H "Content-Type: video/mp4" --upload-file out/fishpot/clip.mp4 "<uploadUrl>"
```

**3. Create the post** with the returned `accessUrl`:

```bash
curl -s -X POST "https://api.ayrshare.com/api/post" \
  -H "Authorization: Bearer $AYRSHARE_API_KEY" \
  -H "Profile-Key: $AYR_PROFILE_FISHPOT" \
  -H "Content-Type: application/json" \
  -d '{
    "post": "We move different.",
    "platforms": ["instagram","tiktok","youtube"],
    "mediaUrls": ["<accessUrl>"],
    "scheduleDate": "2026-06-05T23:00:00Z"
  }'
```

Small files (≤30 MB) can skip steps 1–2 and use multipart `POST /api/media/upload` (`file=@clip.mp4`), which returns a `url`. The presigned flow the poster uses handles any size, so it's the default. If a clip already lives at a public URL (e.g. an S3 bucket or one of the Vercel sites), skip uploading entirely and put that URL straight in `mediaUrls`.

## Scheduling in UTC

`scheduleDate` must be Zulu/UTC: `YYYY-MM-DDThh:mm:ssZ`, e.g. `2026-06-05T23:00:00Z`. A time in the past posts immediately. Easiest path: enter the UTC time directly in the plan (convert at https://www.utctime.net/).

To convert a New Orleans (Central) local time on macOS — note BSD `date` parses the zone from the string and `-u` prints UTC:

```bash
date -ju -f "%Y-%m-%d %H:%M %Z" "2026-06-05 18:00 CDT" +"%Y-%m-%dT%H:%M:%SZ"
# -> 2026-06-05T23:00:00Z   (CDT) ;  use CST in winter
```

Don't schedule farther out than ~90 days against an uploaded clip — uploaded media expires and the scheduled post would fail. Already-published posts are unaffected.

## Per-platform notes

- **YouTube** requires a video and a title. The poster sets `title` to the caption's first line (≤90 chars). For a distinct title, add it by hand to the `/post` body (`"title": "..."`), or split caption first-line vs body.
- **X/Twitter** — since **2026-03-31**, X requires *your own* OAuth 1.0a app credentials (Ayrshare's Bring-Your-Own-Keys change). You must link X via the BYO flow and pass the two `X-Twitter-OAuth1-*` headers on any X-bound request. The poster only warns; it doesn't add these. If you get `code: 419 / x_credentials_required`, that's the missing BYO headers. Default the clip accounts to IG/TikTok/YouTube and handle X separately.
- **Instagram/TikTok** — vertical 9:16 from `clip-pipeline` is the right shape; format rules are enforced server-side by Ayrshare.

## Dry run + troubleshooting

- `node scripts/post_clips.mjs post-plan.csv --dry-run` validates files, platforms, profile routing, and captions and prints the plan — no upload, no post, no API key needed. Always run it first.
- A row is skipped (not fatal) if its file is missing or it lists no platforms.
- Auth errors (401/403): check the API key and that the Profile-Key matches the brand you mean.
- The `/post` response includes an `id`; use it later with Ayrshare's history/analytics/delete endpoints.
