"use client";

import type { PolaroidItem } from "@/lib/polaroids";
import Polaroid from "./Polaroid";
import s from "./polaroid.module.css";

// Polaroids pinned to the studio wall: a sideways strip (On the Wall) or a
// tight grid (the vault's Contact Sheet). Same card, same flip.
export default function PolaroidBoard({ items, layout = "rail" }: { items: PolaroidItem[]; layout?: "rail" | "sheet" }) {
  return (
    <div className={s.wall}>
      <ul className={layout === "sheet" ? s.sheet : s.rail}>
        {items.map((p, i) => (
          <Polaroid
            key={p.id}
            index={i}
            caption={p.caption}
            photo={p.photo}
            placeholder="Photo"
            placeholderKind="label"
            back={{ title: p.caption, text: p.note }}
          />
        ))}
      </ul>
    </div>
  );
}
