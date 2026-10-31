"use client";

import type { WallClip } from "@/lib/vault-items";

// The Demolition Wall: short job-site clips, played on tap. The files are served
// by /api/vault-media, so they only load once the vault is unlocked.
export default function DemoWall({ clips }: { clips: WallClip[] }) {
  return (
    <ul
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 16,
      }}
    >
      {clips.map((c) => (
        <li key={c.id} style={{ background: "#0d0d0a", border: "1px solid rgba(212,175,119,0.12)" }}>
          <video
            src={c.src}
            controls
            playsInline
            preload="metadata"
            style={{ display: "block", width: "100%", aspectRatio: "16 / 9", background: "#080808" }}
          />
          <p
            style={{
              margin: 0,
              padding: "10px 14px",
              fontFamily: "DM Mono, monospace",
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#A89880",
            }}
          >
            {c.title}
          </p>
        </li>
      ))}
    </ul>
  );
}
