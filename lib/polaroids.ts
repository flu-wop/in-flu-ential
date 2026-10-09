// The Polaroid card shape. The Wall and the Contact Sheet are private and live
// in lib/vault-items.ts (server only); safe to import this type anywhere.
// Captions stay on one line, and the handwritten note on the back stays short.

export interface PolaroidItem {
  id: string;
  caption: string; // one line under the photo
  note: string; // handwritten, on the back
  photo?: string;
}
