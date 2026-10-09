// ── SESSION CONFIG ──────────────────────────────────────────────────────────
// The homepage console plays this session. To swap in the real stems:
//   1. Export vocal / 808 / drums / sample / bounce, same length, same start bar.
//   2. Convert each to AAC and MP3 (MP3 is the fallback for browsers without AAC):
//        ffmpeg -i vocal.wav -c:a aac -b:a 192k vocal.m4a
//        ffmpeg -i vocal.wav -c:a libmp3lame -b:a 192k vocal.mp3
//   3. Drop them in /public/session (same filenames), then set `bpm` and `bars`
//      to the section you exported and flip `placeholder` to false.

export type ChannelId = "music" | "business" | "work" | "vault";

export interface ChannelDef {
  id: ChannelId;
  name: string; // scribble-strip label
  stem: string; // file in /public/session (without extension)
  track: string; // lane name on the session screen
  laneColor: string;
  href: string; // full page this channel opens
}

export const SESSION = {
  title: "Hang Glider",
  artist: "Curren$y",
  credit: "Produced by Flu",
  bpm: 78,
  bars: 8,
  placeholder: true, // shows a "demo stems" tag on the session screen
};

export const LOOP_SECONDS = (SESSION.bars * 4 * 60) / SESSION.bpm;

export const CHANNELS: ChannelDef[] = [
  { id: "music", name: "Music", stem: "vocal", track: "Vocal", laneColor: "#4E9C8F", href: "/music" },
  { id: "business", name: "Business", stem: "808", track: "808", laneColor: "#8A6BB0", href: "/business" },
  { id: "work", name: "Work", stem: "drums", track: "Drums", laneColor: "#4C77B4", href: "/portfolio" },
  { id: "vault", name: "Vault", stem: "sample", track: "Sample", laneColor: "#D4AF77", href: "/vault" },
];

// Vault knobs A / B / C. This is a game, not security: anything shipped to the
// browser can be read. Private material stays behind the server-side password.
export const VAULT_COMBO = [24, 8, 16] as const;
