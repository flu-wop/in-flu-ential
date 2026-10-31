#!/usr/bin/env node
// Uploads the private vault media to the private Blob store.
//
//   npm run vault:upload -- /path/to/vault-web
//
// The folder holds contact/*.webp, demolition/*.mp4 and (later) unreleased/*.mp3.
// Each file lands at vault/<folder>/<name> in the store and is served only
// through /api/vault-media after the vault unlocks. Needs BLOB_READ_WRITE_TOKEN
// in the environment (`vercel env pull .env.local`, then
// `node --env-file=.env.local scripts/upload-vault.mjs <folder>`). Never commit
// the token or the media.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { put } from "@vercel/blob";

const dir = process.argv[2];
if (!dir) throw new Error("Usage: npm run vault:upload -- <folder>");
if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN is not set");

const TYPES = { webp: "image/webp", jpg: "image/jpeg", mp4: "video/mp4", mp3: "audio/mpeg", m4a: "audio/mp4" };
const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

for (const file of walk(dir)) {
  const ext = file.split(".").pop().toLowerCase();
  if (!TYPES[ext] || file.split("/").pop().startsWith(".")) continue;
  const key = `vault/${relative(dir, file)}`;
  await put(key, readFileSync(file), {
    access: "private",
    contentType: TYPES[ext],
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  console.log("uploaded", key);
}
