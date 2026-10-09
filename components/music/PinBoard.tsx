"use client";

import { useEffect, useRef, useState } from "react";
import s from "./pinboard.module.css";

export interface Credit {
  artist: string;
  role: string;
  description: string;
  did: string[];
  photo?: string; // e.g. "/credits/curreny.webp" (square, ~1000x1000)
}

// A slight, fixed tilt per card so the board looks hand-hung.
const TILTS = [-3, 2.2, -1.4, 3, -2.4, 1.6, -3.2, 2.6, -1.8, 2.8, -2.2];

const initials = (name: string) =>
  name
    .replace(/—.*$/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

function Polaroid({ c, i }: { c: Credit; i: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [developed, setDeveloped] = useState(false);
  const [flipped, setFlipped] = useState(false);

  // Develop once, the first time the photo scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setDeveloped(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDeveloped(true);
          io.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li className={s.slot} style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as React.CSSProperties}>
      <span className={s.pin} aria-hidden="true" />
      <button
        ref={ref}
        type="button"
        className={`${s.card} ${flipped ? s.flipped : ""}`}
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={`${c.artist}. ${flipped ? "Showing notes, tap to see the photo" : "Tap for notes"}`}
      >
        <span className={s.inner}>
          <span className={s.front}>
            <span className={`${s.photo} ${developed ? s.developed : ""}`}>
              {c.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.photo} alt="" loading="lazy" />
              ) : (
                <span className={s.initials}>{initials(c.artist)}</span>
              )}
            </span>
            <span className={s.caption}>{c.artist}</span>
            <span className={s.did}>{c.did.join(" + ")}</span>
          </span>
          <span className={s.back} aria-hidden={!flipped}>
            <span className={s.backName}>{c.artist}</span>
            <span className={s.backRole}>{c.role}</span>
            <span className={s.backText}>{c.description}</span>
            <span className={s.backHint}>Tap to flip back</span>
          </span>
        </span>
      </button>
    </li>
  );
}

export default function PinBoard({ credits }: { credits: Credit[] }) {
  return (
    <div className={s.wall}>
      <ul className={s.board}>
        {credits.map((c, i) => (
          <Polaroid key={c.artist} c={c} i={i} />
        ))}
      </ul>
    </div>
  );
}
