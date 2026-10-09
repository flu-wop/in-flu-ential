// The channel-strip signal path, shared by the live engine (mixEngine.ts) and the
// offline bounce render (scripts/render-bounce.mjs), so the bounce is made by the
// same graph that plays the stems. Keep this file free of imports: the render
// script transpiles it on its own and runs it inside a browser page.
//
//   input → LF → MF → HF → pan → fader → mute gate ─┬→ bus
//                                                    ├→ analyser (meter)
//                                                    └→ send → reverb → return → bus

export interface Strip {
  input: GainNode;
  lf: BiquadFilterNode;
  mf: BiquadFilterNode;
  hf: BiquadFilterNode;
  pan: StereoPannerNode;
  fader: GainNode;
  gate: GainNode; // mute / solo, ramped
  send: GainNode;
  analyser: AnalyserNode;
}

export interface Chain {
  strips: Record<string, Strip>;
  bus: GainNode; // the sum of every strip and the reverb return, before master
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Decaying noise, like a plate. Seeded, and defined at 44.1 kHz then resampled to
// the context rate, so the bounce (rendered at 44.1 kHz) and a phone running at
// 48 kHz get the same reverb instead of two different random rooms.
export function makeImpulse(ctx: BaseAudioContext, seconds: number) {
  const REF = 44100;
  const refLen = Math.ceil(seconds * REF) + 2;
  const rnd = mulberry32(0x5eed1e);
  const base = [new Float32Array(refLen), new Float32Array(refLen)];
  for (let c = 0; c < 2; c++) for (let i = 0; i < refLen; i++) base[c][i] = rnd() * 2 - 1;

  const rate = ctx.sampleRate;
  const len = Math.floor(rate * seconds);
  const buf = ctx.createBuffer(2, len, rate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) {
      const p = (i * REF) / rate;
      const i0 = Math.floor(p);
      const f = p - i0;
      const n = base[c][i0] * (1 - f) + base[c][i0 + 1] * f;
      d[i] = n * Math.pow(1 - i / len, 3.2);
    }
  }
  return buf;
}

export function buildChain(ctx: BaseAudioContext, ids: string[]): Chain {
  const bus = ctx.createGain();

  const verb = ctx.createConvolver();
  verb.buffer = makeImpulse(ctx, 2.4);
  const verbReturn = ctx.createGain();
  verbReturn.gain.value = 0.7;
  verb.connect(verbReturn).connect(bus);

  const strips: Record<string, Strip> = {};
  for (const id of ids) {
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
    const pan = ctx.createStereoPanner();
    const fader = ctx.createGain();
    const gate = ctx.createGain();
    const send = ctx.createGain();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;

    input.connect(lf).connect(mf).connect(hf).connect(pan).connect(fader).connect(gate);
    gate.connect(analyser);
    gate.connect(bus);
    gate.connect(send).connect(verb);
    strips[id] = { input, lf, mf, hf, pan, fader, gate, send, analyser };
  }
  return { strips, bus };
}

// Knob and fader values, so the bounce render can set the "flat" state too.
export const FLAT = { eq: 0, send: (4 / 30) * 0.9, pan: 0, fader: 1 };
