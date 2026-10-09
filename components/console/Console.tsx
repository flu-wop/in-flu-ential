"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CHANNELS, VAULT_COMBO, type ChannelId } from "@/lib/session";
import { KNOB_DEFAULTS, type KnobId } from "./mixEngine";
import { useSession } from "./SessionProvider";
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
  const session = useSession();
  const { engine, loaded, loadError, playing, knobs, faders, combo, vaultOpen, ensureEngine, toggle } = session;
  const [selected, setSelected] = useState<ChannelId>("music");
  const [eqChannel, setEqChannel] = useState<ChannelId | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const eqTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const meterRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const levels = useRef<Record<string, number>>({});
  const masterMeterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    ensureEngine(); // loads the stems so the session screen can draw waveforms
  }, [ensureEngine]);

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
        const leds = el.children;
        for (let i = 0; i < leds.length; i++) (leds[i] as HTMLElement).classList.toggle(styles.on, i < lit);
      });
      const mEl = masterMeterRef.current;
      if (mEl) {
        const t = engine.masterLevel();
        const prev = levels.current.master ?? 0;
        const lv = t > prev ? t : prev + (t - prev) * 0.12;
        levels.current.master = lv;
        const lit = Math.round(lv * LEDS);
        for (let i = 0; i < mEl.children.length; i++) (mEl.children[i] as HTMLElement).classList.toggle(styles.on, i < lit);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [engine]);

  const showEq = (ch: ChannelId) => {
    setEqChannel(ch);
    if (eqTimer.current) clearTimeout(eqTimer.current);
    eqTimer.current = setTimeout(() => setEqChannel(null), 2600);
  };

  const setKnob = (ch: ChannelId, k: KnobId, v: number) => {
    session.setKnob(ch, k, v);
    if (k !== "send") showEq(ch);
  };

  const setFader = (ch: ChannelId, v: number) => session.setFader(ch, v);

  const setComboKnob = (i: number, v: number) => {
    if (session.setComboKnob(i, v)) setSelected("vault");
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
          <div className={`${styles.strip} ${styles.masterStrip}`}>
            <span className={styles.chnum}>Main</span>
            <div className={styles.masterTop}>
              <span>Stereo</span>
              <span>Out</span>
            </div>
            <div className={styles.faderSec}>
              <div className={styles.meter} ref={masterMeterRef} aria-hidden="true">
                {Array.from({ length: LEDS }, (_, k) => (
                  <div key={k} className={[styles.led, k >= LEDS - 2 ? styles.red : k >= LEDS - 5 ? styles.amber : ""].join(" ")} />
                ))}
              </div>
              <Fader value={session.master} label="Master" locked={false} onChange={session.setMaster} />
            </div>
            <span className={styles.masterLabel}>Master</span>
          </div>
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
