// The original mix of "Hang Glider": the finished track, played straight from
// /public/session/original.mp3 until the real stems are in. A plain audio
// element, created on the first tap so the homepage downloads nothing until
// someone presses play. Browser-only.

export interface OriginalCallbacks {
  onPlaying: (playing: boolean) => void;
  onError: () => void;
}

export class OriginalAudio {
  private el: HTMLAudioElement | null = null;
  private volume = 1;
  private muted = false;
  private looping = true;

  constructor(
    private src: string,
    private cb: OriginalCallbacks
  ) {}

  private element() {
    if (this.el) return this.el;
    const el = new Audio();
    el.preload = "auto";
    el.src = this.src;
    el.loop = this.looping;
    el.volume = this.volume;
    el.muted = this.muted;
    el.addEventListener("playing", () => this.cb.onPlaying(true));
    el.addEventListener("pause", () => this.cb.onPlaying(false));
    el.addEventListener("ended", () => this.cb.onPlaying(false)); // play-once pass finished
    el.addEventListener("error", () => this.cb.onError());
    this.el = el;
    return el;
  }

  set loop(on: boolean) {
    this.looping = on;
    if (this.el) this.el.loop = on;
  }

  /** Call from a tap so the browser allows sound. */
  async toggle() {
    const el = this.element();
    if (!el.paused) {
      el.pause();
      return;
    }
    if (el.ended) el.currentTime = 0;
    try {
      await el.play();
    } catch {
      this.cb.onError();
    }
  }

  pause() {
    this.el?.pause();
  }

  setVolume(v01: number) {
    this.volume = Math.max(0, Math.min(1, v01));
    if (this.el) this.el.volume = this.volume;
  }

  setMuted(on: boolean) {
    this.muted = on;
    if (this.el) this.el.muted = on;
  }

  time() {
    return this.el?.currentTime ?? 0;
  }

  duration() {
    const d = this.el?.duration;
    return d && Number.isFinite(d) ? d : 0;
  }

  dispose() {
    if (this.el) {
      this.el.pause();
      this.el.removeAttribute("src");
      this.el.load();
    }
    this.el = null;
  }
}
