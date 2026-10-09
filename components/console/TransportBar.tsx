"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CHANNELS, SESSION } from "@/lib/session";
import { useSession } from "./SessionProvider";
import s from "./transport.module.css";

// Slim transport on every subpage: keeps the session playing between pages.
export default function TransportBar() {
  const { engine, playing, loaded, loadError, toggle } = useSession();
  const meterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!engine) return;
    let raf = 0;
    const levels = CHANNELS.map(() => 0);
    const tick = () => {
      CHANNELS.forEach((c, i) => {
        const t = engine.level(c.id);
        levels[i] = t > levels[i] ? t : levels[i] + (t - levels[i]) * 0.15;
        const el = meterRefs.current[i];
        if (el) el.style.transform = `scaleY(${Math.max(0.06, levels[i])})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [engine]);

  const status = loadError ? "Audio unavailable" : playing ? "Playing" : engine && !loaded ? "Loading" : "Stopped";

  return (
    <>
      <div className={s.spacer} aria-hidden="true" />
      <div className={s.bar} role="region" aria-label="Session transport">
        <button
          type="button"
          className={s.play}
          onClick={toggle}
          aria-label={playing ? "Stop the session" : "Play the session"}
          disabled={loadError}
        >
          {playing ? <span className={s.stopIcon} /> : <span className={s.playIcon} />}
        </button>
        <div className={s.meters} aria-hidden="true">
          {CHANNELS.map((c, i) => (
            <span key={c.id} className={s.meterWell}>
              <span
                className={s.meter}
                style={{ background: c.laneColor }}
                ref={(el) => {
                  meterRefs.current[i] = el;
                }}
              />
            </span>
          ))}
        </div>
        <div className={s.info}>
          <strong>
            {SESSION.artist} — {SESSION.title}
          </strong>
          <span>
            {status} · {SESSION.credit}
          </span>
        </div>
        <Link href="/" className={s.console}>
          Console
        </Link>
      </div>
    </>
  );
}
