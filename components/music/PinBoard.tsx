"use client";

import Polaroid from "@/components/polaroid/Polaroid";
import s from "@/components/polaroid/polaroid.module.css";

export interface Credit {
  artist: string;
  role: string;
  description: string;
  did: string[];
  photo?: string; // e.g. "/credits/curreny.webp" (square, ~1000x1000)
}

const initials = (name: string) =>
  name
    .replace(/—.*$/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function PinBoard({ credits }: { credits: Credit[] }) {
  return (
    <div className={s.wall}>
      <ul className={s.board}>
        {credits.map((c, i) => (
          <Polaroid
            key={c.artist}
            index={i}
            caption={c.artist}
            sub={c.did.join(" + ")}
            photo={c.photo}
            placeholder={initials(c.artist)}
            back={{ title: c.artist, role: c.role, text: c.description }}
          />
        ))}
      </ul>
    </div>
  );
}
