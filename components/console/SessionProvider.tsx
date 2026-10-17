"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CHANNELS, LOOP_SECONDS, STEMS_READY, VAULT_COMBO, type ChannelId } from "@/lib/session";
import { MixEngine, KNOB_DEFAULTS, FADER_UNITY, type KnobId, type MixMode } from "./mixEngine";
import TransportBar from "./TransportBar";

// The session lives in the root layout, so audio and the mix survive page
// changes: start the song on the console, keep it playing while browsing.

type Knobs = Record<ChannelId, Record<KnobId, number>>;
type Flags = Record<ChannelId, boolean>;

interface SessionState {
  engine: MixEngine | null;
  ready: boolean;
  loaded: boolean;
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
  originalOnly: boolean;
  getPosition: () => number;
  getDuration: () => number;
  registerSlot: (el: HTMLElement | null) => void;
  toggle: () => Promise<void>;
  setLoop: (on: boolean) => void;
  setKnob: (ch: ChannelId, k: KnobId, v: number) => void;
  setFader: (ch: ChannelId, v: number) => void;
  setMute: (ch: ChannelId, on: boolean) => void;
  setSolo: (ch: ChannelId, on: boolean) => void;
  setMasterMuted: (on: boolean) => void;
  engageMix: () => void;
  resetToOriginal: () => void;
  setComboKnob: (i: number, v: number) => boolean;
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

  const ensureEngine = useCallback(() => {
    if (originalOnly) {
      setReady(true);
      return;
    }
    if (engineRef.current) return;
    const e = new MixEngine();
    CHANNELS.forEach((c) => {
      (Object.keys(KNOB_DEFAULTS) as KnobId[]).forEach((k) => e.setKnob(c.id, k, KNOB_DEFAULTS[k]));
      e.setFader(c.id, c.id === "vault" ? 0 : FADER_UNITY, 0.001);
    });
    e.setMaster(masterRef.current);
    e.onEnded = () => setPlaying(false);
    engineRef.current = e;
    setEngine(e);
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

  useEffect(() => () => { engineRef.current?.dispose(); }, []);

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
  }, []);

  const setMasterMuted = useCallback((on: boolean) => {
    setMasterMutedState(on);
    engineRef.current?.setMasterMute(on);
  }, []);

  const toggle = useCallback(async () => {
    if (originalOnly) {
      setLoadError(true);
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
  }, []);

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
        engageMix();
        return true;
      }
      return false;
    },
    [combo, vaultOpen, engageMix, originalOnly]
  );

  const getPosition = useCallback(() => (originalOnly ? 0 : engineRef.current?.position() ?? 0), [originalOnly]);
  const getDuration = useCallback(() => (originalOnly ? 0 : LOOP_SECONDS), [originalOnly]);

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
        registerSlot: () => {},
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
      {showBar && <TransportBar />}
    </SessionContext.Provider>
  );
}
