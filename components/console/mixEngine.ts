import { CHANNELS, LOOP_SECONDS, type ChannelId } from "@/lib/session";
import bounceMeta from "@/lib/bounce.json";
import { buildChain, type Chain, type Strip } from "./mixChain";

// Knob values are integers 0–30, like detents on a pot.
// EQ knobs: 15 = flat, each step = 1 dB. Send: 0 = dry. Pan: 15 = center.
export type KnobId = "hf" | "mf" | "lf" | "send" | "pan";
export const KNOB_DEFAULTS: Record<KnobId, number> = { hf: 15, mf: 15, lf: 15, send: 4, pan: 15 };
export const FADER_UNITY = 0.75;

// "original" plays the bounce; "yours" plays the stems through the live mix.
export type MixMode = "original" | "yours";

const RAMP = 0.02; // mute, solo and master mute ramp, seconds
const XFADE = 0.15; // bounce <-> stems crossfade, seconds

export function faderToGain(f: number) {
  if (f <= 0.001) return 0;
  const db = f >= FADER_UNITY ? (f - FADER_UNITY) * 24 : (f - FADER_UNITY) * 60;
  return Math.pow(10, db / 20);
}

type Flags = Record<ChannelId, boolean>;
const noFlags = () => Object.fromEntries(CHANNELS.map((c) => [c.id, false])) as Flags;

export class MixEngine {
  ctx: AudioContext;
  private master: GainNode;
  private masterGate: GainNode;
  private masterAnalyser: AnalyserNode;
  private chain: Chain;
  private stemXf: GainNode;
  private bounceXf: GainNode;
  private bounceTrim: GainNode;
  private buffers = {} as Partial<Record<ChannelId, AudioBuffer>>;
  private bounceBuf: AudioBuffer | null = null;
  private bounceSrc: AudioBufferSourceNode | null = null;
  private stemSrcs: AudioBufferSourceNode[] = [];
  private startedAt = 0;
  private offset = 0;
  private gen = 0; // bumped every time the sources are (re)started
  private loopLen = LOOP_SECONDS;
  private timeBuf = new Float32Array(1024);
  private muted = noFlags();
  private soloed = noFlags();
  mode: MixMode = "original";
  playing = false;
  ready = false; // the bounce is decoded: the session can play
  loaded = false; // the stems are decoded: the mix controls are live
  loop = true;
  onEnded: (() => void) | null = null; // a play-once pass ran out
  peaks = {} as Partial<Record<ChannelId, Float32Array>>;

  constructor() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    const ctx = this.ctx;

    // master → mute → limiter → speakers. Both the bounce and the stems enter
    // at the master, so master fader, master mute and volume work on either.
    this.master = ctx.createGain();
    this.master.gain.value = 0.9;
    this.masterGate = ctx.createGain();
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -3;
    limiter.ratio.value = 12;
    this.masterAnalyser = ctx.createAnalyser();
    this.masterAnalyser.fftSize = 1024;
    this.master.connect(this.masterGate).connect(limiter);
    limiter.connect(this.masterAnalyser);
    limiter.connect(ctx.destination);

    this.chain = buildChain(
      ctx,
      CHANNELS.map((c) => c.id)
    );
    this.stemXf = ctx.createGain();
    this.stemXf.gain.value = 0;
    this.chain.bus.connect(this.stemXf).connect(this.master);

    // The bounce is rendered from the chain before master, so it joins here.
    // `trim` undoes any headroom taken off it when it was rendered.
    this.bounceTrim = ctx.createGain();
    this.bounceTrim.gain.value = 1 / (bounceMeta.scale || 1);
    this.bounceXf = ctx.createGain();
    this.bounceXf.gain.value = 1;
    this.bounceTrim.connect(this.bounceXf).connect(this.master);

    // Phones suspend or interrupt audio (calls, screen lock, tab switches).
    // While the session is meant to be playing, pick it back up.
    ctx.onstatechange = () => {
      if (this.playing && ctx.state !== "running") ctx.resume().catch(() => {});
    };
  }

  private get strips() {
    return this.chain.strips as Record<ChannelId, Strip>;
  }

  // Smooth any param to a target, replacing whatever ramp was in flight.
  private ramp(p: AudioParam, target: number, dur: number, delay = 0) {
    const t = this.ctx.currentTime;
    const q = p as AudioParam & { cancelAndHoldAtTime?: (when: number) => AudioParam };
    if (q.cancelAndHoldAtTime) q.cancelAndHoldAtTime(t);
    else {
      p.cancelScheduledValues(t);
      p.setValueAtTime(p.value, t);
    }
    const from = t + Math.max(0, delay);
    if (from > t) p.setValueAtTime(p.value, from);
    if (dur <= 0) p.setValueAtTime(target, from);
    else p.linearRampToValueAtTime(target, from + dur);
  }

  private ext() {
    // AAC everywhere it's supported (Safari, Chrome, Edge); MP3 for the rest.
    return new Audio().canPlayType('audio/mp4; codecs="mp4a.40.2"') !== "" ? "m4a" : "mp3";
  }

  private async decode(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Missing ${url}`);
    const data = await res.arrayBuffer();
    return new Promise<AudioBuffer>((ok, fail) => this.ctx.decodeAudioData(data, ok, fail));
  }

  // Bounce first, so the song can start while the stems are still coming down.
  async loadBounce() {
    const buf = await this.decode(`/session/bounce.${this.ext()}`);
    this.bounceBuf = buf;
    this.loopLen = Math.min(LOOP_SECONDS, buf.duration);
    this.ready = true;
  }

  async loadStems() {
    const ext = this.ext();
    await Promise.all(
      CHANNELS.map(async (ch) => {
        const buf = await this.decode(`/session/${ch.stem}.${ext}`);
        this.buffers[ch.id] = buf;
        this.peaks[ch.id] = this.computePeaks(buf, 900);
      })
    );
    this.loaded = true;
    if (this.playing) {
      // Loaded mid-song: start the stems in step with the bounce, and if the
      // mix was already touched, crossfade to them from the moment they begin.
      const when = this.attachStems();
      this.applyMode(true, when - this.ctx.currentTime);
    } else this.applyMode(false);
  }

  private computePeaks(buf: AudioBuffer, cols: number) {
    const d = buf.getChannelData(0);
    const usable = Math.min(d.length, Math.floor(LOOP_SECONDS * buf.sampleRate));
    const per = Math.max(1, Math.floor(usable / cols));
    const out = new Float32Array(cols);
    let max = 0;
    for (let c = 0; c < cols; c++) {
      let p = 0;
      for (let i = c * per, end = Math.min(usable, i + per); i < end; i += 4) {
        const v = Math.abs(d[i]);
        if (v > p) p = v;
      }
      out[c] = p;
      if (p > max) max = p;
    }
    if (max > 0) for (let c = 0; c < cols; c++) out[c] /= max;
    return out;
  }

  // ── Transport ──────────────────────────────────────────────────────────────

  position() {
    if (!this.playing) return this.offset;
    const e = Math.max(0, this.ctx.currentTime - this.startedAt);
    return this.loop ? e % this.loopLen : Math.min(e, this.loopLen);
  }

  private positionAt(when: number) {
    const e = Math.max(0, when - this.startedAt);
    return this.loop ? e % this.loopLen : Math.min(e, this.loopLen);
  }

  private startSource(buf: AudioBuffer, dest: AudioNode, when: number, off: number) {
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = this.loop;
    src.loopStart = 0;
    src.loopEnd = Math.min(this.loopLen, buf.duration);
    src.connect(dest);
    src.start(when, off % src.loopEnd);
    if (!this.loop) src.stop(when + Math.max(0.001, src.loopEnd - off));
    return src;
  }

  // Bounce and stems start together at the same position; the crossfade gains
  // decide which one is heard.
  private startSources(when: number, off: number) {
    const gen = ++this.gen;
    this.bounceSrc = this.bounceBuf ? this.startSource(this.bounceBuf, this.bounceTrim, when, off) : null;
    this.stemSrcs = this.loaded
      ? CHANNELS.map((ch) => this.startSource(this.buffers[ch.id]!, this.strips[ch.id].input, when, off))
      : [];
    this.startedAt = when - off;
    const lead = this.bounceSrc ?? this.stemSrcs[0];
    if (lead)
      lead.onended = () => {
        if (gen === this.gen && !this.loop && this.playing) this.finish();
      };
  }

  private attachStems() {
    const when = this.ctx.currentTime + 0.05;
    if (this.stemSrcs.length || !this.loaded) return when;
    const off = this.positionAt(when);
    this.stemSrcs = CHANNELS.map((ch) => this.startSource(this.buffers[ch.id]!, this.strips[ch.id].input, when, off));
    return when;
  }

  private endSources(at?: number) {
    const all = [this.bounceSrc, ...this.stemSrcs];
    for (const s of all) {
      if (!s) continue;
      try {
        if (at === undefined) s.stop();
        else s.stop(at);
      } catch {}
      if (at === undefined) s.disconnect();
    }
    this.bounceSrc = null;
    this.stemSrcs = [];
  }

  async play() {
    if (!this.ready || this.playing) return;
    await this.ctx.resume();
    if (this.offset >= this.loopLen - 0.01) this.offset = 0;
    this.startSources(this.ctx.currentTime + 0.06, this.offset);
    this.playing = true;
    this.applyMode(false);
  }

  stop() {
    if (!this.playing) return;
    this.offset = this.position();
    this.gen++;
    this.endSources();
    this.playing = false;
  }

  // A play-once pass ran out: stop and go back to the start.
  private finish() {
    this.gen++;
    this.endSources();
    this.playing = false;
    this.offset = 0;
    this.onEnded?.();
  }

  setLoop(on: boolean) {
    if (on === this.loop) return;
    if (!this.playing) {
      this.loop = on;
      return;
    }
    // Re-schedule from the exact same spot, sample-accurate, with the new mode.
    const when = this.ctx.currentTime + 0.03;
    const off = this.positionAt(when);
    this.gen++;
    this.endSources(when);
    this.loop = on;
    this.startSources(when, off);
    this.applyMode(false);
  }

  // ── Bounce / stems ─────────────────────────────────────────────────────────

  private stemsAudible() {
    return this.mode === "yours" && this.loaded && (!this.playing || this.stemSrcs.length > 0);
  }

  private applyMode(smooth: boolean, delay = 0) {
    const stems = this.stemsAudible();
    const d = smooth ? XFADE : 0;
    this.ramp(this.bounceXf.gain, stems ? 0 : 1, d, delay);
    this.ramp(this.stemXf.gain, stems ? 1 : 0, d, delay);
  }

  setMode(mode: MixMode) {
    if (mode === this.mode) return;
    this.mode = mode;
    this.applyMode(this.playing);
  }

  // ── Mix controls ───────────────────────────────────────────────────────────

  setKnob(ch: ChannelId, knob: KnobId, value: number) {
    const s = this.strips[ch];
    const t = this.ctx.currentTime;
    if (knob === "send") s.send.gain.setTargetAtTime((value / 30) * 0.9, t, 0.03);
    else if (knob === "pan") s.pan.pan.setTargetAtTime((value - 15) / 15, t, 0.03);
    else s[knob].gain.setTargetAtTime(value - 15, t, 0.03);
  }

  setFader(ch: ChannelId, value: number, smooth = 0.02) {
    this.strips[ch].fader.gain.setTargetAtTime(faderToGain(value), this.ctx.currentTime, smooth);
  }

  // Solo in place: with any solo engaged, only soloed channels are heard, and the
  // silenced channels' reverb sends go quiet with them. Mute always wins.
  private applyGates() {
    const anySolo = CHANNELS.some((c) => this.soloed[c.id]);
    for (const c of CHANNELS) {
      const audible = !this.muted[c.id] && (!anySolo || this.soloed[c.id]);
      this.ramp(this.strips[c.id].gate.gain, audible ? 1 : 0, RAMP);
    }
  }

  setMute(ch: ChannelId, on: boolean) {
    this.muted[ch] = on;
    this.applyGates();
  }

  setSolo(ch: ChannelId, on: boolean) {
    this.soloed[ch] = on;
    this.applyGates();
  }

  // Master fader / transport volume, same 0–1 scale as the channel faders.
  setMaster(value: number) {
    this.master.gain.setTargetAtTime(0.9 * faderToGain(value), this.ctx.currentTime, 0.03);
  }

  setMasterMute(on: boolean) {
    this.ramp(this.masterGate.gain, on ? 0 : 1, RAMP);
  }

  resumeIfNeeded() {
    if (this.playing && this.ctx.state !== "running") this.ctx.resume().catch(() => {});
  }

  masterLevel() {
    if (!this.playing) return 0;
    this.masterAnalyser.getFloatTimeDomainData(this.timeBuf);
    let sum = 0;
    for (let i = 0; i < this.timeBuf.length; i++) sum += this.timeBuf[i] * this.timeBuf[i];
    const db = 20 * Math.log10(Math.sqrt(sum / this.timeBuf.length) + 1e-9);
    return Math.max(0, Math.min(1, (db + 50) / 50));
  }

  // Meter level 0–1 on a -48 dB to 0 dB scale.
  level(ch: ChannelId) {
    if (!this.playing) return 0;
    const a = this.strips[ch].analyser;
    a.getFloatTimeDomainData(this.timeBuf);
    let sum = 0;
    for (let i = 0; i < this.timeBuf.length; i++) sum += this.timeBuf[i] * this.timeBuf[i];
    const rms = Math.sqrt(sum / this.timeBuf.length);
    const db = 20 * Math.log10(rms + 1e-9);
    return Math.max(0, Math.min(1, (db + 50) / 50));
  }

  // Combined EQ response in dB at the given frequencies.
  eqResponse(ch: ChannelId, freqs: Float32Array<ArrayBuffer>) {
    const s = this.strips[ch];
    const mag = new Float32Array(freqs.length);
    const phase = new Float32Array(freqs.length);
    const out = new Float32Array(freqs.length);
    for (const f of [s.lf, s.mf, s.hf]) {
      f.getFrequencyResponse(freqs, mag, phase);
      for (let i = 0; i < freqs.length; i++) out[i] += 20 * Math.log10(mag[i] + 1e-9);
    }
    return out;
  }

  dispose() {
    this.stop();
    this.ctx.close().catch(() => {});
  }
}
