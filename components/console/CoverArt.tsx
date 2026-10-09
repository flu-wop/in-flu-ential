import { IMAGES } from "@/lib/images";
import s from "./cover.module.css";

// Hang Glider cover art, square. Until the real file is set in lib/images.ts it
// shows a labelled placeholder (a monogram when small).
export default function CoverArt({ size }: { size: number }) {
  const src = IMAGES.cover;
  return (
    <span className={`${s.cover} ${src ? "" : s.empty}`} style={{ width: size, height: size }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={size >= 64 ? "Hang Glider cover art" : ""} width={size} height={size} />
      ) : size >= 64 ? (
        <span className={s.label}>
          Cover Art
          <small>1400 × 1400</small>
        </span>
      ) : (
        <span className={s.mono} style={{ fontSize: Math.round(size * 0.4) }}>
          HG
        </span>
      )}
    </span>
  );
}
