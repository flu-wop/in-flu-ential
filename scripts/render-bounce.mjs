#!/usr/bin/env node
// Renders the "Original Mix" bounce from the stems.
//
//   npm run bounce
//
// The bounce is made by the same channel-strip graph the console plays
// (components/console/mixChain.ts) running in a real browser's
// OfflineAudioContext, with every control flat and the vault locked, so it matches
// the stems at flat and leaves out the sample. It is rendered before the master
// fader and limiter, which the console applies live to the bounce and the stems alike.
//
// Needs: ffmpeg on the PATH, and Chrome (a normal install is found automatically;
// otherwise set CHROME_PATH to a Chrome or Chromium binary).
//
// Writes public/session/bounce.m4a and bounce.mp3 (encoded like the stems, so
// they line up) and lib/bounce.json (any headroom taken off to avoid clipping).
// Run it again whenever the stems in public/session change.

import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { chromium } from "playwright-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const RATE = 44100;
const BIT_RATE = "160k";

const transpile = (file) =>
  ts.transpileModule(readFileSync(join(root, file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ES2020, target: ts.ScriptTarget.ES2020 },
  }).outputText;

// The session config is plain TypeScript with no imports, so load it as-is.
const tmp = mkdtempSync(join(tmpdir(), "bounce-"));
writeFileSync(join(tmp, "session.mjs"), transpile("lib/session.ts"));
const { CHANNELS, LOOP_SECONDS } = await import(join(tmp, "session.mjs"));

const decode = (file) => {
  const r = spawnSync("ffmpeg", ["-v", "error", "-i", file, "-f", "f32le", "-ac", "2", "-ar", String(RATE), "-"], {
    maxBuffer: 1 << 30,
  });
  if (r.status !== 0) throw new Error(`ffmpeg could not read ${file}: ${r.stderr}`);
  const f = new Float32Array(r.stdout.buffer, r.stdout.byteOffset, Math.floor(r.stdout.byteLength / 4));
  const frames = f.length / 2;
  const left = new Float32Array(frames);
  const right = new Float32Array(frames);
  for (let i = 0; i < frames; i++) {
    left[i] = f[2 * i];
    right[i] = f[2 * i + 1];
  }
  return [left, right];
};

// Every stem except the vault's sample, which the bounce leaves out.
const stems = {};
for (const ch of CHANNELS) {
  if (ch.id === "vault") continue;
  const file = join(root, "public/session", `${ch.stem}.m4a`);
  if (!existsSync(file)) throw new Error(`Missing stem: ${file}`);
  stems[ch.id] = decode(file);
}
const frames = Math.min(Math.floor(LOOP_SECONDS * RATE), ...Object.values(stems).map(([l]) => l.length));
const b64 = (a) => Buffer.from(a.buffer, a.byteOffset, a.byteLength).toString("base64");
const payload = Object.fromEntries(
  Object.entries(stems).map(([id, [l, r]]) => [id, [b64(l.subarray(0, frames)), b64(r.subarray(0, frames))]])
);

const launch = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" };
const browser = await chromium.launch(launch);
const page = await browser.newPage();
await page.setContent("<!doctype html><title>bounce</title>");

const result = await page.evaluate(
  async ({ chainSource, ids, payload, frames, rate }) => {
    const url = URL.createObjectURL(new Blob([chainSource], { type: "text/javascript" }));
    const { buildChain, FLAT } = await import(url);
    const fromB64 = (s) => {
      const bin = atob(s);
      const u = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
      return new Float32Array(u.buffer);
    };

    // Two passes, keep the second: the reverb tail from the end of the loop is
    // already ringing at the start, exactly as it does when the console loops.
    const ctx = new OfflineAudioContext(2, frames * 2, rate);
    const chain = buildChain(ctx, ids);
    chain.bus.connect(ctx.destination);

    for (const id of ids) {
      const s = chain.strips[id];
      s.fader.gain.value = FLAT.fader;
      s.send.gain.value = FLAT.send;
      s.pan.pan.value = FLAT.pan;
      if (!payload[id]) continue; // the vault: locked, so it's left out
      const buf = ctx.createBuffer(2, frames, rate);
      buf.copyToChannel(fromB64(payload[id][0]), 0);
      buf.copyToChannel(fromB64(payload[id][1]), 1);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.connect(s.input);
      src.start(0);
    }

    const rendered = await ctx.startRendering();
    const out = [0, 1].map((c) => rendered.getChannelData(c).slice(frames, frames * 2));
    let peak = 0;
    for (const ch of out) for (let i = 0; i < ch.length; i++) peak = Math.max(peak, Math.abs(ch[i]));
    const toB64 = (a) => {
      const u = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
      let s = "";
      for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
      return btoa(s);
    };
    return { peak, left: toB64(out[0]), right: toB64(out[1]) };
  },
  {
    chainSource: transpile("components/console/mixChain.ts"),
    ids: CHANNELS.map((c) => c.id),
    payload,
    frames,
    rate: RATE,
  }
);
await browser.close();

// Leave headroom so the encoders don't clip; the console gives it back (lib/bounce.json).
const scale = result.peak > 0.95 ? Math.floor((0.95 / result.peak) * 10000) / 10000 : 1;
const l = new Float32Array(Buffer.from(result.left, "base64").buffer.slice(0));
const r = new Float32Array(Buffer.from(result.right, "base64").buffer.slice(0));
const inter = new Float32Array(frames * 2);
for (let i = 0; i < frames; i++) {
  inter[2 * i] = l[i] * scale;
  inter[2 * i + 1] = r[i] * scale;
}
const raw = Buffer.from(inter.buffer);

const encode = (args, out) =>
  new Promise((ok, fail) => {
    const p = spawn("ffmpeg", ["-v", "error", "-y", "-f", "f32le", "-ar", String(RATE), "-ac", "2", "-i", "-", ...args, out]);
    p.stderr.on("data", (d) => process.stderr.write(d));
    p.on("close", (code) => (code === 0 ? ok() : fail(new Error(`ffmpeg exited ${code}`))));
    p.stdin.end(raw);
  });
await encode(["-c:a", "aac", "-b:a", BIT_RATE], join(root, "public/session/bounce.m4a"));
await encode(["-c:a", "libmp3lame", "-b:a", BIT_RATE], join(root, "public/session/bounce.mp3"));
writeFileSync(join(root, "lib/bounce.json"), JSON.stringify({ scale }, null, 2) + "\n");

console.log(`Bounce rendered: ${(frames / RATE).toFixed(3)}s, peak ${result.peak.toFixed(3)}, scale ${scale}`);
