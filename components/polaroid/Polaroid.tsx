"use client";

import { useEffect, useRef, useState } from "react";
import s from "./polaroid.module.css";

// One Polaroid: develops the first time it scrolls into view, and tapping flips
// it to the handwritten note on the back. Used by the credits board, the On the
// Wall strip on Music and the vault's Contact Sheet.

export interface PolaroidProps {
  caption: string; // one line under the photo
  sub?: string; // optional small line under the caption
  photo?: string;
  placeholder: string; // shown in the photo until one is added
  placeholderKind?: "initials" | "label";
  back: { title: string; role?: string; text: string };
  index: number; // picks the card's tilt
}

// A slight, fixed tilt per card so the board looks hand-hung.
const TILTS = [-3, 2.2, -1.4, 3, -2.4, 1.6, -3.2, 2.6, -1.8, 2.8, -2.2];

export default function Polaroid({ caption, sub, photo, placeholder, placeholderKind = "initials", back, index }: PolaroidProps) {
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
    <li className={s.slot} style={{ "--tilt": `${TILTS[index % TILTS.length]}deg` } as React.CSSProperties}>
      <span className={s.pin} aria-hidden="true" />
      <button
        ref={ref}
        type="button"
        className={`${s.card} ${flipped ? s.flipped : ""}`}
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={`${caption}. ${flipped ? "Showing the note, tap to see the photo" : "Tap for the note"}`}
      >
        <span className={s.inner}>
          <span className={s.front}>
            <span className={`${s.photo} ${developed ? s.developed : ""}`}>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" loading="lazy" />
              ) : (
                <span className={placeholderKind === "label" ? s.phLabel : s.initials}>{placeholder}</span>
              )}
            </span>
            <span className={s.caption}>{caption}</span>
            {sub && <span className={s.did}>{sub}</span>}
          </span>
          <span className={s.back} aria-hidden={!flipped}>
            <span className={s.backName}>{back.title}</span>
            {back.role && <span className={s.backRole}>{back.role}</span>}
            <span className={s.backText}>{back.text}</span>
            <span className={s.backHint}>Tap to flip back</span>
          </span>
        </span>
      </button>
    </li>
  );
}
