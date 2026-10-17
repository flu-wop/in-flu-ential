"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CHANNELS, LOOP_SECONDS, ORIGINAL_YOUTUBE_ID, STEMS_READY, VAULT_COMBO, type ChannelId } from "@/lib/session";
import { MixEngine, KNOB_DEFAULTS, FADER_UNITY, type KnobId, type MixMode } from "./mixEngine";
import TransportBar from "./TransportBar";
import OriginalPlayer from "./OriginalPlayer";
import { YouTubeOriginal } from "./youtube";

// The session lives in the root layout, so audio and the mix survive page
// changes: start the song on the console, keep it playing while browsing.

type Knobs = Record<ChannelId, Record<KnobId, number>>;
type Flags = Record<ChannelId, boolean>;

interface SessionState {
  engine: MixEngine | null;
  ready: boolean; // the original mix can play
  loaded: boolean; // the stems are in, so the mix controls are live
  loadError: boolean;
  stemsError: boolean;
  playing: boolean;
  loop: boolean;
  mixMode: MixMode;
  knobs: Knobs;
  faders: Record<ChannelId, number>;
  mutes: Flags;
  solos: Flags;
  masterMuted: boolean;
  combo: number[];
  vaultOpen: boolean;
  ensureEngine: () => void;
  originalOnly: boolean; // stems are off: the original mix plays from YouTube
  getPosition: () => number; // seconds
  getDuration: () => number; // seconds
  registerSlot: (el: HTMLElement | null) => void; // where the console wants the video
  toggle: () => Promise<void>;
  setLoop: (on: boolean) => void;
  setKnob: (ch: ChannelId, k: KnobId, v: number) => void;
  setFader: (ch: ChannelId, v: number) => void;
  setMute: (ch: ChannelId, on: boolean) => void;
  setSolo: (ch: ChannelId, on: boolean) => void;
  setMasterMuted: (on: boolean) => void;
  engageMix: () => void; // a channel control was touched: play the stems
  resetToOriginal: () => void;
  setComboKnob: (i: number, v: number) => boolean; // true when this turn unlocked the vault
  master: number;
  setMaster: (v: number) => void;
}

const SessionContext = createContext<SessionState | null>(null);

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}

const initKnobs = () => Object.fromEntries(CHANNELS.map((c) => [c.id, { ...KNOB_DEFAULTS }])) as Knobs;
const initFaders = () =>
  Object.fromEntries(CHANNELS.map((c) => [c.id, c.id === "vault" ? 0 : FADER_UNITY])) as Record<ChannelId, number>;
const initFlags = () => Object.fromEntries(CHANNELS.map((c) => [c.id, false])) as Flags;

export default function SessionProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<MixEngine | null>(null);
  const readyRef = useRef<Promise<void> | null>(null);
  const [engine, setEngine] = useState<MixEngine | null>(null);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [stemsError, setStemsError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoopState] = useState(true);
  const [mixMode, setMixMode] = useState<MixMode>("original");
  const [knobs, setKnobs] = useState<Knobs>(initKnobs);
  const [faders, setFaders] = useState(initFaders);
  const [mutes, setMutes] = useState<Flags>(initFlags);
  const [solos, setSolos] = useState<Flags>(initFlags);
  const [masterMuted, setMasterMutedState] = useState(false);
  const [combo, setCombo] = useState<number[]>([0, 0, 0]);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [master, setMasterState] = useState(FADER_UNITY);
  const masterRef = useRef(FADER_UNITY);
  const pathname = usePathname();
  const originalOnly = !STEMS_READY;
  const ytRef = useRef<YouTubeOriginal | null>(null);
  const ytMountRef = useRef<HTMLDivElement | null>(null);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [ytStarted, setYtStarted] = useState(false);
  const mutedRef = useRef(false);

  // Created on first use (the console mounting, or Play in the transport bar),
  // so subpage visitors don't download the session unless they ask for sound.
  const ensureEngine = useCallback(() => {
    if (originalOnly) {
      // No stems yet: the original mix comes from YouTube. The player itself is
      // only created on the first tap, so just mark it ready.
      if (!ytRef.current) {
        ytRef.current = new YouTubeOriginal(ORIGINAL_YOUTUBE_ID, {
          onPlaying: (p) => setPlaying(p),
          onError: () => setLoadError(true),
        });
        ytRef.current.loop = true;
        setReady(true);
      }
      return;
    }
    if (engineRef.current) return;
    const e = new MixEngine();
    CHANNELS.forEach((c) => {
      (Object.keys(KNOB_DEFAULTS) as KnobId[]).forEach((k) => e.setKnob(c.id, k, KNOB_DEFAULTS[k]));
      e.setFader(c.id, c.id === "vault" ? 0 : FADER_UNITY, 0.001);
    });
    e.setMaster(masterRef.current);
    e.onEnded = () => setPlaying(false); // a play-once pass finished
    engineRef.current = e;
    setEngine(e);
    // The original mix first, so Play works as soon as it's down; the stems follow.
    readyRef.current = e
      .loadBounce()
      .then(() => {
        setReady(true);
        return e.loadStems().then(
          () => setLoaded(true),
          () => setStemsError(true)
        );
      })
      .catch(() => setLoadError(true));
  }, [originalOnly]);

  useEffect(
    () => () => {
      engineRef.current?.dispose();
      ytRef.current?.dispose();
    },
    []
  );

  // The loop runs until someone presses stop. If the phone paused audio while
  // the page was in the background, resume when it comes back.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") engineRef.current?.resumeIfNeeded();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onVisible);
    };
  }, []);

  const setMaster = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    masterRef.current = clamped;
    setMasterState(clamped);
    engineRef.current?.setMaster(clamped);
    ytRef.current?.setVolume(Math.min(1, clamped / FADER_UNITY)); // fader unity = full volume
  }, []);

  const setMasterMuted = useCallback((on: boolean) => {
    setMasterMutedState(on);
    mutedRef.current = on;
    engineRef.current?.setMasterMute(on);
    ytRef.current?.setMuted(on);
  }, []);

  const toggle = useCallback(async () => {
    if (originalOnly) {
      ensureEngine();
      const y = ytRef.current;
      const mount = ytMountRef.current;
      if (!y || !mount) return;
      if (!y.started) {
        setYtStarted(true);
        await y.start(mount, Math.min(1, masterRef.current / FADER_UNITY), mutedRef.current);
      } else {
        y.toggle();
      }
      return;
    }
    ensureEngine();
    const e = engineRef.current;
    if (!e) return;
    if (e.playing) {
      e.stop();
      setPlaying(false);
      return;
    }
    await readyRef.current;
    if (!e.ready) return;
    await e.play();
    setPlaying(true);
  }, [ensureEngine, originalOnly]);

  const setLoop = useCallback((on: boolean) => {
    setLoopState(on);
    engineRef.current?.setLoop(on);
    if (ytRef.current) ytRef.current.loop = on;
  }, []);

  // Touching any channel control (EQ, send, pan, fader, mute, solo) hands the
  // sound over from the bounce to the live stems.
  const engageMix = useCallback(() => {
    if (originalOnly) return;
    engineRef.current?.setMode("yours");
    setMixMode("yours");
  }, [originalOnly]);

  const setKnob = useCallback(
    (ch: ChannelId, k: KnobId, v: number) => {
      if (originalOnly) return;
      setKnobs((prev) => ({ ...prev, [ch]: { ...prev[ch], [k]: v } }));
      engineRef.current?.setKnob(ch, k, v);
      engageMix();
    },
    [engageMix, originalOnly]
  );

  const setFader = useCallback(
    (ch: ChannelId, v: number) => {
      if (originalOnly || (ch === "vault" && !vaultOpen)) return;
      setFaders((prev) => ({ ...prev, [ch]: v }));
      engineRef.current?.setFader(ch, v);
      engageMix();
    },
    [vaultOpen, engageMix, originalOnly]
  );

  const setMute = useCallback(
    (ch: ChannelId, on: boolean) => {
      if (originalOnly || (ch === "vault" && !vaultOpen)) return;
      setMutes((prev) => ({ ...prev, [ch]: on }));
      engineRef.current?.setMute(ch, on);
      engageMix();
    },
    [vaultOpen, engageMix, originalOnly]
  );

  const setSolo = useCallback(
    (ch: ChannelId, on: boolean) => {
      if (originalOnly || (ch === "vault" && !vaultOpen)) return;
      setSolos((prev) => ({ ...prev, [ch]: on }));
      engineRef.current?.setSolo(ch, on);
      engageMix();
    },
    [vaultOpen, engageMix, originalOnly]
  );

  // Back to the song as it was bounced: every control flat, then crossfade to
  // the bounce. The vault stays open, but its sample goes back out of the mix
  // (the bounce is made without it). Master fader, master mute and the
  // transport volume are listening controls, so they stay where they are.
  const resetToOriginal = useCallback(() => {
    const e = engineRef.current;
    setKnobs(initKnobs());
    setFaders(initFaders());
    setMutes(initFlags());
    setSolos(initFlags());
    if (e) {
      CHANNELS.forEach((c) => {
        (Object.keys(KNOB_DEFAULTS) as KnobId[]).forEach((k) => e.setKnob(c.id, k, KNOB_DEFAULTS[k]));
        e.setFader(c.id, c.id === "vault" ? 0 : FADER_UNITY);
        e.setMute(c.id, false);
        e.setSolo(c.id, false);
      });
      e.setMode("original");
    }
    setMixMode("original");
  }, []);

  const setComboKnob = useCallback(
    (i: number, v: number) => {
      if (originalOnly || vaultOpen) return false;
      const next = combo.map((x, j) => (j === i ? v : x));
      setCombo(next);
      if (next.every((x, j) => x === VAULT_COMBO[j])) {
        setVaultOpen(true);
        setFaders((prev) => ({ ...prev, vault: FADER_UNITY }));
        engineRef.current?.setFader("vault", FADER_UNITY, 0.6);
        engageMix(); // the sample isn't in the bounce, so the stems take over
        return true;
      }
      return false;
    },
    [combo, vaultOpen, engageMix, originalOnly]
  );

  const getPosition = useCallback(
    () => (originalOnly ? ytRef.current?.time() ?? 0 : engineRef.current?.position() ?? 0),
    [originalOnly]
  );
  const getDuration = useCallback(
    () => (originalOnly ? ytRef.current?.duration() || 0 : LOOP_SECONDS),
    [originalOnly]
  );

  const showBar = pathname !== "/" && !pathname?.startsWith("/admin");

  return (
    <SessionContext.Provider
      value={{
        engine,
        ready,
        loaded,
        loadError,
        stemsError,
        playing,
        loop,
        mixMode,
        knobs,
        faders,
        mutes,
        solos,
        masterMuted,
        combo,
        vaultOpen,
        ensureEngine,
        originalOnly,
        getPosition,
        getDuration,
        registerSlot: setSlot,
        toggle,
        setLoop,
        setKnob,
        setFader,
        setMute,
        setSolo,
        setMasterMuted,
        engageMix,
        resetToOriginal,
        setComboKnob,
        master,
        setMaster,
      }}
    >
      {children}
      {originalOnly && (
        <OriginalPlayer videoId={ORIGINAL_YOUTUBE_ID} slot={slot} started={ytStarted} mountRef={ytMountRef} onPlay={toggle} />
      )}
      {showBar && <TransportBar />}
    </SessionContext.Provider>
  );
}
