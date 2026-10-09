// Polaroids that aren't credits: the On the Wall strip on Music (the studio and
// behind the scenes) and the Contact Sheet in the vault. Safe to import from
// client components. Add a photo with photo: "/studio/<name>.webp" (square,
// ~1000x1000); without one the card shows a placeholder. Captions stay on one
// line, and the handwritten note on the back stays short.

export interface PolaroidItem {
  id: string;
  caption: string; // one line under the photo
  note: string; // handwritten, on the back
  photo?: string;
}

export const WALL: PolaroidItem[] = [
  {
    id: "control-room",
    caption: "Control Room",
    note: "Where the mix gets decided.",
    photo: "", // "/studio/control-room.webp"
  },
  {
    id: "live-room",
    caption: "Live Room",
    note: "Where the takes happen.",
    photo: "", // "/studio/live-room.webp"
  },
  {
    id: "behind-the-glass",
    caption: "Behind the Glass",
    note: "The engineer's view.",
    photo: "", // "/studio/behind-the-glass.webp"
  },
  {
    id: "between-takes",
    caption: "Between Takes",
    note: "The part nobody posts.",
    photo: "", // "/studio/between-takes.webp"
  },
];
