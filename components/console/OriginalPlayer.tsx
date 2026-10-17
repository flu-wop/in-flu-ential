"use client";

import { useEffect, useRef } from "react";
import s from "./original.module.css";

// The visible YouTube player for the original mix. YouTube requires the embed
// to stay on screen (at least 200 x 200), so it is never hidden. It lives in
// the root layout so the song keeps playing across pages. On the console it
// sits over the Master panel's video slot; everywhere else it docks above the
// transport bar. Before the first tap it shows a poster, so the homepage
// doesn't load the player until someone presses play.
export default function OriginalPlayer({
  videoId,
  slot,
  started,
  mountRef,
  onPlay,
}: {
  videoId: string;
  slot: HTMLElement | null;
  started: boolean;
  mountRef: React.RefObject<HTMLDivElement | null>;
  onPlay: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const reset = () => {
      el.style.left = el.style.top = el.style.width = el.style.height = "";
    };
    if (!slot) {
      reset();
      return;
    }
    let raf = 0;
    const follow = () => {
      const r = slot.getBoundingClientRect();
      el.style.left = `${r.left}px`;
      el.style.top = `${r.top}px`;
      el.style.width = `${r.width}px`;
      el.style.height = `${r.height}px`;
      raf = requestAnimationFrame(follow);
    };
    follow();
    return () => {
      cancelAnimationFrame(raf);
      reset();
    };
  }, [slot]);

  const shown = !!slot || started;
  return (
    <div
      ref={hostRef}
      className={`${s.host} ${slot ? s.slotted : s.docked}`}
      hidden={!shown}
      aria-label="Hang Glider, original mix, on YouTube"
    >
      <div ref={mountRef} className={s.mount} />
      {!started && (
        <button type="button" className={s.poster} onClick={onPlay} aria-label="Play the original mix">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" />
          <span className={s.playDisc} aria-hidden="true">
            <span className={s.playTri} />
          </span>
        </button>
      )}
    </div>
  );
}
