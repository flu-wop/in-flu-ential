import { CHANNELS, LOOP_SECONDS, type ChannelId } from "@/lib/session";

// Knob values are integers 0–30, like detents on a pot.
// EQ knobs: 15 = flat, each step = 1 dB. Send: 0 = dry.
export type KnobId = "hf" | "mf" | "lf" | "send";
export const KNOB_DEFAULTS: Record<KnobId, number> = { hf: 15, mf: 15, lf: 15, send: 4 };
export const FADER_UNITY = 0.75;

export function faderToGain(f: number) {
  if (f <= 0.001) return 0;
  const db = f >= FADER_UNITY ? (f - FADER_UNITY) * 24 : (f - FADER_UNITY) * 60;
  return Math.pow(10, db / 20);
}

interface Strip {
  input: GainNode;
  lf: BiquadFilterNode;
  mf: BiquadFilterNode;
  hf: BiquadFilterNode;
  fader: GainNode;
  send: GainNode;
  analyser: AnalyserNode;
}

export class MixEngine {
  ctx: AudioContext;
  private master: GainNode;
  private strips = {} as Record<ChannelId, Strip>;
  private buffers = {} as Partial<Record<ChannelId, AudioBuffer>>;
  private sources: AudioBufferSourceNode[] = [];
  private startedAt = 0;
  private offset = 0;
  private timeBuf = new Float32Array(1024);
  playing = false;
  loaded = false;
  peaks = {} as Partial<Record<ChannelId, Float32Array>>;

  constructor() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    const ctx = this.ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.9;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -3;
    limiter.ratio.value = 12;
    this.master.connect(limiter).connect(ctx.destination);

    const verb = ctx.createConvolver();
    verb.buffer = this.makeImpulse(2.4);
    const verbReturn = ctx.createGain();
    verbReturn.gain.value = 0.7;
    verb.connect(verbReturn).connect(this.master);

    for (const ch of CHANNELS) {
      const input = ctx.createGain();
      const lf = ctx.createBiquadFilter();
      lf.type = "lowshelf";
      lf.frequency.value = 110;
      const mf = ctx.createBiquadFilter();
      mf.type = "peaking";
      mf.frequency.value = 1200;
      mf.Q.value = 0.9;
      const hf = ctx.createBiquadFilter();
      hf.type = "highshelf";
      hf.frequency.value = 7000;
      const fader = ctx.createGain();
      const send = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      input.connect(lf).connect(mf).connect(hf).connect(fader);
      fader.connect(analyser);
      fader.connect(this.master);
      fader.connect(send).connect(verb);
      this.strips[ch.id] = { input, lf, mf, hf, fader, send, analyser };
    }
  }

  private makeImpulse(seconds: number) {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    return buf;
  }

  async load() {
    // AAC everywhere it's supported (Safari, Chrome, Edge); MP3 for the rest.
    const aac = new Audio().canPlayType('audio/mp4; codecs="mp4a.40.2"') !== "";
    const ext = aac ? "m4a" : "mp3";
    await Promise.all(
      CHANNELS.map(async (ch) => {
        const res = await fetch(`/session/${ch.stem}.${ext}`);
        if (!res.ok) throw new Error(`Missing stem ${ch.stem}`);
        const data = await res.arrayBuffer();
        const buf = await new Promise<AudioBuffer>((ok, fail) => this.ctx.decodeAudioData(data, ok, fail));
        this.buffers[ch.id] = buf;
        this.peaks[ch.id] = this.computePeaks(buf, 900);
      })
    );
    this.loaded = true;
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

  position() {
    if (!this.playing) return this.offset;
    return (this.ctx.currentTime - this.startedAt) % LOOP_SECONDS;
  }

  async play() {
    if (!this.loaded || this.playing) return;
    await this.ctx.resume();
    const when = this.ctx.currentTime + 0.06;
    this.sources = CHANNELS.map((ch) => {
      const src = this.ctx.createBufferSource();
      src.buffer = this.buffers[ch.id]!;
      src.loop = true;
      src.loopStart = 0;
      src.loopEnd = Math.min(LOOP_SECONDS, src.buffer.duration);
      src.connect(this.strips[ch.id].input);
      src.start(when, this.offset % src.loopEnd);
      return src;
    });
    this.startedAt = when - this.offset;
    this.playing = true;
  }

  stop() {
    if (!this.playing) return;
    this.offset = this.position();
    this.sources.forEach((s) => {
      try {
        s.stop();
      } catch {}
      s.disconnect();
    });
    this.sources = [];
    this.playing = false;
  }

  setKnob(ch: ChannelId, knob: KnobId, value: number) {
    const s = this.strips[ch];
    const t = this.ctx.currentTime;
    if (knob === "send") s.send.gain.setTargetAtTime((value / 30) * 0.9, t, 0.03);
    else s[knob].gain.setTargetAtTime(value - 15, t, 0.03);
  }

  setFader(ch: ChannelId, value: number, smooth = 0.02) {
    this.strips[ch].fader.gain.setTargetAtTime(faderToGain(value), this.ctx.currentTime, smooth);
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
