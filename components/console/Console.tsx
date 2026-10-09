"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CHANNELS, VAULT_COMBO, type ChannelId } from "@/lib/session";
import { MixEngine, KNOB_DEFAULTS, FADER_UNITY, type KnobId } from "./mixEngine";
import SessionScreen from "./SessionScreen";
import { OUTPUTS } from "./outputs";
import styles from "./console.module.css";

const LEDS = 12;
const EQ_KNOBS: { id: KnobId; label: string; cap: string }[] = [
  { id: "hf", label: "HF", cap: "var(--cap-red)" },
  { id: "mf", label: "MF", cap: "var(--cap-green)" },
  { id: "lf", label: "LF", cap: "var(--cap-blue)" },
  { id: "send", label: "Send", cap: "var(--cap-brown)" },
];

type Knobs = Record<ChannelId, Record<KnobId, number>>;
const initKnobs = () =>
  Object.fromEntries(CHANNELS.map((c) => [c.id, { ...KNOB_DEFAULTS }])) as Knobs;
const initFaders = () =>
  Object.fromEntries(CHANNELS.map((c) => [c.id, c.id === "vault" ? 0 : FADER_UNITY])) as Record<ChannelId, number>;

function useDrag(onDelta: (dy: number, dx: number) => void, onStart?: () => void) {
  const last = useRef<{ x: number; y: number } | null>(null);
  return {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      last.current = { x: e.clientX, y: e.clientY };
      onStart?.();
    },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      if (!last.current) return;
      const dy = last.current.y - e.clientY;
      const dx = e.clientX - last.current.x;
      onDelta(dy, dx);
      last.current = { x: e.clientX, y: e.clientY };
    },
    onPointerUp: () => (last.current = null),
    onPointerCancel: () => (last.current = null),
  };
}

function Knob({
  value,
  label,
  cap,
  readout,
  onChange,
  onReset,
}: {
  value: number;
  label: string;
  cap: string;
  readout?: string;
  onChange: (v: number) => void;
  onReset?: () => void;
}) {
  const acc = useRef(0);
  const valRef = useRef(value);
  valRef.current = value;
  const drag = useDrag((dy, dx) => {
    acc.current += dy + dx;
    const steps = Math.trunc(acc.current / 7);
    if (steps) {
      acc.current -= steps * 7;
      onChange(Math.max(0, Math.min(30, valRef.current + steps)));
    }
  });
  return (
    <div className={styles.knobWrap}>
      <div
        className={styles.knob}
        style={{ "--cap": cap, "--a": `${-135 + (value / 30) * 270}deg` } as React.CSSProperties}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={30}
        aria-valuenow={value}
        onDoubleClick={onReset}
        onKeyDown={(e) => {
          const d = ({ ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 } as Record<string, number>)[e.key];
          if (d) {
            e.preventDefault();
            onChange(Math.max(0, Math.min(30, value + d)));
          }
        }}
        {...drag}
      />
      <span className={readout !== undefined ? styles.kval : styles.klbl}>{readout ?? label}</span>
    </div>
  );
}

function Fader({
  value,
  label,
  locked,
  onChange,
}: {
  value: number;
  label: string;
  locked: boolean;
  onChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const setFromY = (y: number) => {
    const r = trackRef.current!.getBoundingClientRect();
    onChange(Math.max(0, Math.min(1, 1 - (y - r.top - 9) / (r.height - 18))));
  };
  const active = useRef(false);
  return (
    <div
      ref={trackRef}
      className={styles.track}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        active.current = true;
        setFromY(e.clientY);
      }}
      onPointerMove={(e) => active.current && setFromY(e.clientY)}
      onPointerUp={() => (active.current = false)}
      onPointerCancel={() => (active.current = false)}
    >
      <div className={styles.ticks} aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} className={i === 2 ? styles.unity : undefined} />
        ))}
      </div>
      <div
        className={styles.cap}
        style={{ top: `calc(${(1 - value) * 100}% - ${(1 - value) * 18}px)` }}
        role="slider"
        tabIndex={0}
        aria-label={`${label} fader`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        aria-disabled={locked}
        onKeyDown={(e) => {
          const d = ({ ArrowUp: 0.05, ArrowDown: -0.05 } as Record<string, number>)[e.key];
          if (d) {
            e.preventDefault();
            onChange(Math.max(0, Math.min(1, value + d)));
          }
        }}
      />
    </div>
  );
}

export default function Console() {
  const [engine, setEngine] = useState<MixEngine | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [knobs, setKnobs] = useState<Knobs>(initKnobs);
  const [faders, setFaders] = useState(initFaders);
  const [combo, setCombo] = useState<number[]>([0, 0, 0]);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [selected, setSelected] = useState<ChannelId>("music");
  const [eqChannel, setEqChannel] = useState<ChannelId | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const eqTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const meterRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const levels = useRef<Record<string, number>>({});

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    const e = new MixEngine();
    CHANNELS.forEach((c) => {
      (Object.keys(KNOB_DEFAULTS) as KnobId[]).forEach((k) => e.setKnob(c.id, k, KNOB_DEFAULTS[k]));
      e.setFader(c.id, c.id === "vault" ? 0 : FADER_UNITY, 0.001);
    });
    setEngine(e);
    e.load()
      .then(() => setLoaded(true))
      .catch(() => setLoadError(true));
    return () => e.dispose();
  }, []);

  // Meters: written straight to the DOM each frame.
  useEffect(() => {
    if (!engine) return;
    let raf = 0;
    const tick = () => {
      CHANNELS.forEach((c) => {
        const el = meterRefs.current[c.id];
        if (!el) return;
        const target = engine.level(c.id);
        const prev = levels.current[c.id] ?? 0;
        const lv = target > prev ? target : prev + (target - prev) * 0.12;
        levels.current[c.id] = lv;
        const lit = Math.round(lv * LEDS);
        el.dataset.lit = String(lit);
        const leds = el.children;
        for (let i = 0; i < leds.length; i++) (leds[i] as HTMLElement).classList.toggle(styles.on, i < lit);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [engine]);

  const toggle = useCallback(async () => {
    if (!engine || !loaded) return;
    if (engine.playing) {
      engine.stop();
      setPlaying(false);
    } else {
      await engine.play();
      setPlaying(true);
    }
  }, [engine, loaded]);

  const showEq = (ch: ChannelId) => {
    setEqChannel(ch);
    if (eqTimer.current) clearTimeout(eqTimer.current);
    eqTimer.current = setTimeout(() => setEqChannel(null), 2600);
  };

  const setKnob = (ch: ChannelId, k: KnobId, v: number) => {
    setKnobs((prev) => ({ ...prev, [ch]: { ...prev[ch], [k]: v } }));
    engine?.setKnob(ch, k, v);
    if (k !== "send") showEq(ch);
  };

  const setFader = (ch: ChannelId, v: number) => {
    if (ch === "vault" && !vaultOpen) return;
    setFaders((prev) => ({ ...prev, [ch]: v }));
    engine?.setFader(ch, v);
  };

  const setComboKnob = (i: number, v: number) => {
    if (vaultOpen) return;
    const next = combo.map((x, j) => (j === i ? v : x));
    setCombo(next);
    if (next.every((x, j) => x === VAULT_COMBO[j])) {
      setVaultOpen(true);
      setSelected("vault");
      setFaders((prev) => ({ ...prev, vault: FADER_UNITY }));
      engine?.setFader("vault", FADER_UNITY, 0.6);
    }
  };

  const out = selected === "vault" && !vaultOpen ? OUTPUTS.vaultLocked : OUTPUTS[selected];
  const sel = CHANNELS.find((c) => c.id === selected)!;

  return (
    <div className={styles.root}>
      <SessionScreen
        engine={engine}
        loaded={loaded}
        playing={playing}
        vaultOpen={vaultOpen}
        faders={faders}
        onToggle={toggle}
        eqChannel={eqChannel}
        knobs={knobs}
      />
      {(loadError || isIOS) && (
        <p className={styles.note}>
          {loadError ? "The session audio couldn't load. Refresh to try again." : "No sound? Turn off silent mode on your iPhone."}
        </p>
      )}

      <div className={styles.desk} aria-label="Console">
        <div className={styles.strips}>
          {CHANNELS.map((c, i) => {
            const locked = c.id === "vault" && !vaultOpen;
            return (
              <div
                key={c.id}
                className={[styles.strip, selected === c.id ? styles.sel : "", locked ? styles.locked : ""].join(" ")}
              >
                <span className={styles.chnum}>0{i + 1}</span>
                <div className={styles.knobGrid}>
                  {c.id === "vault"
                    ? (["A", "B", "C"] as const).map((l, j) => (
                        <Knob
                          key={l}
                          label={`Vault dial ${l}`}
                          cap="var(--cap-brown)"
                          value={vaultOpen ? VAULT_COMBO[j] : combo[j]}
                          readout={String(vaultOpen ? VAULT_COMBO[j] : combo[j]).padStart(2, "0")}
                          onChange={(v) => setComboKnob(j, v)}
                        />
                      ))
                    : EQ_KNOBS.map((k) => (
                        <Knob
                          key={k.id}
                          label={k.label}
                          cap={k.cap}
                          value={knobs[c.id][k.id]}
                          onChange={(v) => setKnob(c.id, k.id, v)}
                          onReset={() => setKnob(c.id, k.id, KNOB_DEFAULTS[k.id])}
                        />
                      ))}
                  {c.id === "vault" && <span className={styles.lockIcon} aria-hidden="true">{vaultOpen ? "OPEN" : "LOCK"}</span>}
                </div>
                <div className={styles.faderSec}>
                  <div
                    className={styles.meter}
                    ref={(el) => {
                      meterRefs.current[c.id] = el;
                    }}
                    aria-hidden="true"
                  >
                    {Array.from({ length: LEDS }, (_, k) => (
                      <div key={k} className={[styles.led, k >= LEDS - 2 ? styles.red : k >= LEDS - 5 ? styles.amber : ""].join(" ")} />
                    ))}
                  </div>
                  <Fader value={faders[c.id]} label={c.name} locked={locked} onChange={(v) => setFader(c.id, v)} />
                </div>
                <button type="button" className={styles.scribble} onClick={() => setSelected(c.id)} aria-pressed={selected === c.id}>
                  {c.name}
                </button>
              </div>
            );
          })}
        </div>
        <p className={styles.hint}>Tap a channel name to open it. Turn the knobs and ride the faders to mix.</p>
      </div>

      <section className={styles.out} aria-live="polite">
        <span className={styles.eyebrow}>
          Channel 0{CHANNELS.indexOf(sel) + 1} · {sel.name}
        </span>
        <h2>{out.title}</h2>
        {out.body && <p>{out.body}</p>}
        {out.rows && (
          <div className={styles.rows}>
            {out.rows.map(([a, b]) => (
              <div className={styles.row} key={a}>
                <span>{a}</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}
        {out.cta && (
          <Link href={out.cta.href} className={styles.cta}>
            {out.cta.label} <span aria-hidden="true">→</span>
          </Link>
        )}
      </section>
    </div>
  );
}
