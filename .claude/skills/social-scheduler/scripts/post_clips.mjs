#!/usr/bin/env node
// post_clips.mjs — post/schedule clips to social via Ayrshare.
//
// Usage:
//   node scripts/post_clips.mjs [post-plan.csv] [--dry-run]
//
// Reads a plan, uploads each clip to Ayrshare, and creates one post per row
// (immediate, or scheduled if a UTC time is given). Routes each account to its
// own Ayrshare brand profile via Profile-Key. Run --dry-run first to preview
// without uploading or posting anything.
//
// Env:
//   AYRSHARE_API_KEY          required (except with --dry-run)
//   AYR_PROFILE_FISHPOT       Profile-Key for the Fish Pot profile (optional)
//   AYR_PROFILE_BOOMERHUMOR   Profile-Key for the BoomerHumor profile (optional)
//   If an account has no Profile-Key set, it posts to the Primary Profile.
//
// Needs Node 18+ (global fetch). Business plan required for video + multiple
// brand profiles. Endpoint/auth details: references/ayrshare.md.

import { readFileSync, statSync } from "node:fs";
import { basename } from "node:path";

const API = "https://api.ayrshare.com/api";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run") || args.includes("--dry");
const planPath = args.find((a) => !a.startsWith("--")) || "post-plan.csv";

const API_KEY = process.env.AYRSHARE_API_KEY || "";
if (!API_KEY && !dryRun) {
  console.error("ERROR: set AYRSHARE_API_KEY (or run with --dry-run).");
  process.exit(1);
}

const PROFILE_KEYS = {
  fishpot: process.env.AYR_PROFILE_FISHPOT || "",
  boomerhumor: process.env.AYR_PROFILE_BOOMERHUMOR || "",
};

// --- CSV: caption is the LAST column, so commas/apostrophes in it are safe ---
function clean(s) {
  let v = (s ?? "").trim();
  if (v.startsWith('"') && v.endsWith('"') && v.length >= 2) {
    v = v.slice(1, -1).replace(/""/g, '"');
  }
  return v;
}

function parsePlan(text) {
  const rows = [];
  const lines = text.replace(/\r/g, "").split("\n");
  lines.forEach((line, i) => {
    if (!line.trim() || line.trim().startsWith("#")) return;
    const parts = line.split(",");
    const account = clean(parts[0]).toLowerCase();
    if (i === 0 && account === "account") return; // header
    rows.push({
      account,
      file: clean(parts[1]),
      platforms: clean(parts[2]).split(/\s+/).filter(Boolean).map((p) => p.toLowerCase()),
      schedule: clean(parts[3]),
      caption: clean(parts.slice(4).join(",")),
    });
  });
  return rows;
}

function headers(account, json = true) {
  const h = { Authorization: `Bearer ${API_KEY}` };
  if (json) h["Content-Type"] = "application/json";
  const pk = PROFILE_KEYS[account];
  if (pk) h["Profile-Key"] = pk;
  return h;
}

// Presigned upload: ask for a URL, PUT the bytes, get back a public accessUrl.
async function uploadClip(account, file) {
  const u = new URL(`${API}/media/uploadUrl`);
  u.searchParams.set("fileName", basename(file));
  u.searchParams.set("contentType", "mp4");
  const r1 = await fetch(u, { headers: headers(account, false) });
  if (!r1.ok) throw new Error(`uploadUrl ${r1.status}: ${await r1.text()}`);
  const { uploadUrl, accessUrl, contentType } = await r1.json();
  const r2 = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType || "video/mp4" },
    body: readFileSync(file),
  });
  if (!r2.ok) throw new Error(`PUT upload ${r2.status}: ${await r2.text()}`);
  return accessUrl;
}

async function createPost(account, { platforms, caption, schedule, mediaUrl }) {
  const body = { post: caption, platforms, mediaUrls: [mediaUrl] };
  if (schedule) body.scheduleDate = schedule; // must be UTC Zulu, e.g. 2026-06-05T23:00:00Z
  if (platforms.includes("youtube")) body.title = (caption.split("\n")[0] || "New clip").slice(0, 90);
  const r = await fetch(`${API}/post`, {
    method: "POST",
    headers: headers(account),
    body: JSON.stringify(body),
  });
  const json = await r.json().catch(() => ({}));
  if (!r.ok || json.status === "error") throw new Error(`post ${r.status}: ${JSON.stringify(json)}`);
  return json;
}

const plan = parsePlan(readFileSync(planPath, "utf8"));
if (!plan.length) {
  console.error(`No rows in ${planPath}`);
  process.exit(1);
}

let ok = 0;
let bad = 0;
for (const row of plan) {
  const when = row.schedule ? `@ ${row.schedule}` : "(now)";
  const tag = `${row.account}/${basename(row.file)} -> [${row.platforms.join(", ")}] ${when}`;

  try {
    statSync(row.file);
  } catch {
    console.error(`skip ${tag}: file not found: ${row.file}`);
    bad++;
    continue;
  }
  if (!row.platforms.length) {
    console.error(`skip ${tag}: no platforms listed`);
    bad++;
    continue;
  }
  if (row.platforms.includes("twitter") || row.platforms.includes("x")) {
    console.error(`warn ${tag}: X/Twitter needs your own OAuth headers since 2026-03-31 (see references/ayrshare.md)`);
  }

  if (dryRun) {
    const where = PROFILE_KEYS[row.account] ? `profile:${row.account}` : "primary profile";
    console.log(`DRY  ${tag}  [${where}]  caption="${row.caption}"`);
    ok++;
    continue;
  }

  try {
    process.stdout.write(`>> ${tag} ... `);
    const mediaUrl = await uploadClip(row.account, row.file);
    const res = await createPost(row.account, { ...row, mediaUrl });
    console.log(`done (id ${res.id || "?"})`);
    ok++;
  } catch (e) {
    console.log("FAILED");
    console.error(`   ${e.message}`);
    bad++;
  }
}

console.log(`\n${dryRun ? "Dry run" : "Done"}: ${ok} ok, ${bad} skipped/failed.`);
