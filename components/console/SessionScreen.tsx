"use client";

import { useEffect, useRef } from "react";
import { CHANNELS, LOOP_SECONDS, SESSION, type ChannelId } from "@/lib/session";
import type { MixEngine, KnobId } from "./mixEngine";
import styles from "./console.module.css";

interface Props {
  engine: MixEngine | null;
  loaded: boolean;
  playing: boolean;
  vaultOpen: boolean;
  faders: Record<ChannelId, number>;
  onToggle: () => void;
  eqChannel: ChannelId | null;
  knobs: Record<ChannelId, Record<KnobId, number>>;
}

const HEADER_W = 74;
const RULER_H = 20;

function counter(sec: number) {
  const beatLen = 60 / SESSION.bpm;
  const totalBeats = sec / beatLen;
  const bar = Math.floor(totalBeats / 4) + 1;
  const beat = (Math.floor(totalBeats) % 4) + 1;
  const ticks = Math.floor((totalBeats % 1) * 960);
  return `${String(bar).padStart(3, "0")} | ${beat} | ${String(ticks).padStart(3, "0")}`;
}

export default function SessionScreen({ engine, loaded, playing, vaultOpen, faders, onToggle, eqChannel, knobs }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const eqRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({ vaultOpen, faders, loaded });
  stateRef.current = { vaultOpen, faders, loaded };

  // Draws the static part (ruler, lane headers, regions, waveforms) to an offscreen layer.
  const paintLayer = (w: number, h: number, dpr: number) => {
    const layer = layerRef.current ?? document.createElement("canvas");
    layerRef.current = layer;
    layer.width = w * dpr;
    layer.height = h * dpr;
    const g = layer.getContext("2d")!;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = "#15140f";
    g.fillRect(0, 0, w, h);

    const tl = w - HEADER_W;
    const barW = tl / SESSION.bars;
    // ruler
    g.fillStyle = "#1e1c17";
    g.fillRect(0, 0, w, RULER_H);
    g.font = "500 10px 'DM Mono', monospace";
    g.textBaseline = "middle";
    for (let b = 0; b < SESSION.bars; b++) {
      const x = HEADER_W + b * barW;
      g.fillStyle = "#7d766a";
      g.fillText(String(b + 1), x + 4, RULER_H / 2 + 1);
      g.fillStyle = "#2c2a24";
      g.fillRect(x, RULER_H, 1, h - RULER_H);
      for (let q = 1; q < 4; q++) {
        g.fillStyle = "#211f1a";
        g.fillRect(x + (q * barW) / 4, RULER_H, 1, h - RULER_H);
      }
    }
    const laneH = (h - RULER_H) / CHANNELS.length;
    const { vaultOpen: vo, faders: fd, loaded: ld } = stateRef.current;
    CHANNELS.forEach((ch, i) => {
      const y = RULER_H + i * laneH;
      const locked = ch.id === "vault" && !vo;
      const muted = fd[ch.id] <= 0.001;
      g.fillStyle = i % 2 ? "#191813" : "#1b1a15";
      g.fillRect(0, y, HEADER_W, laneH);
      g.fillStyle = "#2c2a24";
      g.fillRect(0, y + laneH - 1, w, 1);
      g.fillStyle = locked ? "#5a564c" : "#e9e1cc";
      g.font = "500 11px 'DM Mono', monospace";
      g.fillText(ch.track, 8, y + laneH / 2 - 6);
      g.fillStyle = "#6f695d";
      g.font = "400 9px 'DM Mono', monospace";
      g.fillText(locked ? "Locked" : muted ? "Muted" : "Stereo", 8, y + laneH / 2 + 8);

      // region
      const rx = HEADER_W + 1;
      const ry = y + 3;
      const rh = laneH - 7;
      const alpha = locked ? 0.18 : muted ? 0.35 : 1;
      g.globalAlpha = alpha;
      g.fillStyle = ch.laneColor;
      g.fillRect(rx, ry, tl - 2, 11);
      g.fillStyle = "#0f0e0b";
      g.font = "500 9px 'DM Mono', monospace";
      g.fillText(`${ch.track.toLowerCase()}_${SESSION.title.replace(" ", "")}.L`, rx + 4, ry + 6);
      g.fillStyle = ch.laneColor + "33";
      g.fillRect(rx, ry + 11, tl - 2, rh - 11);
      const peaks = engine?.peaks[ch.id];
      const mid = ry + 11 + (rh - 11) / 2;
      const amp = (rh - 15) / 2;
      g.fillStyle = ch.laneColor;
      if (peaks && ld) {
        const step = (tl - 2) / peaks.length;
        for (let c = 0; c < peaks.length; c++) {
          const v = Math.max(0.02, peaks[c]) * amp;
          g.fillRect(rx + c * step, mid - v, Math.max(1, step), v * 2);
        }
      } else {
        g.fillRect(rx, mid, tl - 2, 1);
      }
      g.globalAlpha = 1;
    });
    return layer;
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    let raf = 0;
    let size = { w: 0, h: 0, dpr: 1 };
    let dirty = true;
    const ro = new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      size = { w: r.width, h: r.height, dpr };
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      dirty = true;
    });
    ro.observe(canvas);
    let lastKey = "";
    const draw = () => {
      const { w, h, dpr } = size;
      if (w > 0) {
        const s = stateRef.current;
        const key = `${s.loaded}|${s.vaultOpen}|${CHANNELS.map((c) => (s.faders[c.id] <= 0.001 ? 0 : 1)).join("")}`;
        if (dirty || key !== lastKey) {
          paintLayer(w, h, dpr);
          dirty = false;
          lastKey = key;
        }
        const g = canvas.getContext("2d")!;
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.drawImage(layerRef.current!, 0, 0);
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        const pos = engine ? engine.position() : 0;
        const x = HEADER_W + (pos / LOOP_SECONDS) * (w - HEADER_W);
        g.fillStyle = "#e9e1cc";
        g.fillRect(Math.round(x), 0, 1, h);
        g.beginPath();
        g.moveTo(x - 5, 0);
        g.lineTo(x + 5, 0);
        g.lineTo(x, 7);
        g.fill();
        if (counterRef.current) counterRef.current.textContent = counter(pos);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine]);

  // EQ plugin window
  useEffect(() => {
    if (!eqChannel || !engine || !eqRef.current) return;
    const c = eqRef.current;
    const r = c.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = r.width * dpr;
    c.height = r.height * dpr;
    const N = 160;
    const freqs = new Float32Array(N);
    for (let i = 0; i < N; i++) freqs[i] = 20 * Math.pow(1000, i / (N - 1));
    let raf = 0;
    const draw = () => {
      const g = c.getContext("2d")!;
      const w = r.width;
      const h = r.height;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = "#0d0c0a";
      g.fillRect(0, 0, w, h);
      const fx = (f: number) => (Math.log10(f / 20) / 3) * w;
      const dy = (db: number) => h / 2 - (db / 18) * (h / 2);
      g.font = "400 9px 'DM Mono', monospace";
      for (const [f, l] of [[100, "100"], [1000, "1k"], [10000, "10k"]] as const) {
        g.fillStyle = "#2a2822";
        g.fillRect(fx(f), 0, 1, h);
        g.fillStyle = "#6f695d";
        g.fillText(l, fx(f) + 3, h - 4);
      }
      for (const db of [-12, 0, 12]) {
        g.fillStyle = db === 0 ? "#3a372f" : "#211f1a";
        g.fillRect(0, dy(db), w, 1);
      }
      const resp = engine.eqResponse(eqChannel, freqs);
      const color = CHANNELS.find((x) => x.id === eqChannel)!.laneColor;
      g.beginPath();
      for (let i = 0; i < N; i++) {
        const x = (i / (N - 1)) * w;
        const y = dy(resp[i]);
        if (i) g.lineTo(x, y);
        else g.moveTo(x, y);
      }
      g.strokeStyle = color;
      g.lineWidth = 2;
      g.stroke();
      g.lineTo(w, h / 2);
      g.lineTo(0, h / 2);
      g.closePath();
      g.fillStyle = color + "2e";
      g.fill();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [eqChannel, engine]);

  const eqDef = eqChannel ? CHANNELS.find((c) => c.id === eqChannel)! : null;
  const fmt = (v: number) => {
    const db = v - 15;
    return `${db > 0 ? "+" : ""}${db.toFixed(1)}`;
  };

  return (
    <div className={styles.screen}>
      <div className={styles.screenBar}>
        <button type="button" className={styles.transport} onClick={onToggle} disabled={!loaded} aria-label={playing ? "Stop" : "Play"}>
          {playing ? <span className={styles.stopIcon} /> : <span className={styles.playIcon} />}
        </button>
        <span className={styles.counter} ref={counterRef}>
          001 | 1 | 000
        </span>
        <span className={styles.sessionName}>
          <strong>{SESSION.title}</strong>
          <span>
            {SESSION.credit} · {SESSION.bpm} BPM
          </span>
        </span>
        {SESSION.placeholder && <span className={styles.demoTag}>Demo stems</span>}
      </div>
      <div className={styles.edit}>
        <canvas ref={canvasRef} className={styles.editCanvas} aria-label="Session edit window with four tracks" />
        {!playing && (
          <button type="button" className={styles.startOverlay} onClick={onToggle} disabled={!loaded}>
            {loaded ? "Press play to start the session" : "Loading session"}
          </button>
        )}
        {eqDef && (
          <div className={styles.eqWin} aria-hidden="true">
            <div className={styles.eqHead}>
              <span>EQ · {eqDef.track}</span>
              <span className={styles.eqVals}>
                HF {fmt(knobs[eqDef.id].hf)} · MF {fmt(knobs[eqDef.id].mf)} · LF {fmt(knobs[eqDef.id].lf)}
              </span>
            </div>
            <canvas ref={eqRef} className={styles.eqCanvas} />
          </div>
        )}
      </div>
    </div>
  );
}
