// The original mix of "Hang Glider" plays from its official YouTube upload
// through YouTube's own embedded player (IFrame API). We never download or
// re-host the audio. This wrapper keeps the surface small: start, play/pause,
// loop, volume, position. Browser-only.

/* eslint-disable @typescript-eslint/no-explicit-any */

const STATE_ENDED = 0;
const STATE_PLAYING = 1;
const STATE_BUFFERING = 3;

let apiPromise: Promise<any> | null = null;

function loadApi(): Promise<any> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const w = window as any;
    if (w.YT?.Player) return resolve(w.YT);
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(w.YT);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    tag.onerror = () => {
      apiPromise = null;
      reject(new Error("YouTube player failed to load"));
    };
    document.head.appendChild(tag);
  });
  return apiPromise;
}

export interface OriginalCallbacks {
  onPlaying: (playing: boolean) => void;
  onError: () => void;
}

export class YouTubeOriginal {
  started = false;
  loop = true;
  private player: any = null;
  private pendingPlay = false;
  private volume = 100;
  private muted = false;

  constructor(
    private videoId: string,
    private cb: OriginalCallbacks
  ) {}

  /** Creates the player inside `mount`. Call from a tap so playback may begin. */
  async start(mount: HTMLElement, volume01: number, muted: boolean) {
    if (this.started) return;
    this.started = true;
    this.pendingPlay = true;
    this.volume = Math.round(volume01 * 100);
    this.muted = muted;
    try {
      const YT = await loadApi();
      const inner = document.createElement("div");
      mount.appendChild(inner);
      this.player = new YT.Player(inner, {
        videoId: this.videoId,
        width: "100%",
        height: "100%",
        playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => {
            this.player.setVolume(this.volume);
            if (this.muted) this.player.mute();
            if (this.pendingPlay) this.player.playVideo();
          },
          onStateChange: (e: any) => this.onState(e.data),
          onError: () => this.cb.onError(),
        },
      });
    } catch {
      this.started = false;
      this.cb.onError();
    }
  }

  private onState(state: number) {
    if (state === STATE_PLAYING || state === STATE_BUFFERING) {
      this.pendingPlay = false;
      this.cb.onPlaying(true);
    } else if (state === STATE_ENDED) {
      if (this.loop) {
        this.player.seekTo(0, true);
        this.player.playVideo();
      } else {
        this.player.seekTo(0, true);
        this.player.pauseVideo();
        this.cb.onPlaying(false);
      }
    } else {
      this.cb.onPlaying(false);
    }
  }

  get isPlaying() {
    return !!this.player?.getPlayerState && [STATE_PLAYING, STATE_BUFFERING].includes(this.player.getPlayerState());
  }

  toggle() {
    if (!this.player?.playVideo) {
      this.pendingPlay = !this.pendingPlay;
      return;
    }
    if (this.isPlaying) this.player.pauseVideo();
    else this.player.playVideo();
  }

  pause() {
    this.pendingPlay = false;
    this.player?.pauseVideo?.();
  }

  setVolume(v01: number) {
    this.volume = Math.round(v01 * 100);
    this.player?.setVolume?.(this.volume);
  }

  setMuted(on: boolean) {
    this.muted = on;
    if (!this.player?.mute) return;
    if (on) this.player.mute();
    else this.player.unMute();
  }

  time() {
    return this.player?.getCurrentTime?.() ?? 0;
  }

  duration() {
    return this.player?.getDuration?.() || 0;
  }

  dispose() {
    try {
      this.player?.destroy?.();
    } catch {
      /* already gone */
    }
    this.player = null;
  }
}
