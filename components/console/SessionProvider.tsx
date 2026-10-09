"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CHANNELS, VAULT_COMBO, type ChannelId } from "@/lib/session";
import { MixEngine, KNOB_DEFAULTS, FADER_UNITY, type KnobId } from "./mixEngine";
import TransportBar from "./TransportBar";

// The session lives in the root layout, so audio and the mix survive page
// changes: start the song on the console, keep it playing while browsing.

type Knobs = Record<ChannelId, Record<KnobId, number>>;

interface SessionState {
  engine: MixEngine | null;
  loaded: boolean;
  loadError: boolean;
  playing: boolean;
  knobs: Knobs;
  faders: Record<ChannelId, number>;
  combo: number[];
  vaultOpen: boolean;
  ensureEngine: () => MixEngine;
  toggle: () => Promise<void>;
  setKnob: (ch: ChannelId, k: KnobId, v: number) => void;
  setFader: (ch: ChannelId, v: number) => void;
  setComboKnob: (i: number, v: number) => boolean; // true when this turn unlocked the vault
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

export default function SessionProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<MixEngine | null>(null);
  const loadRef = useRef<Promise<void> | null>(null);
  const [engine, setEngine] = useState<MixEngine | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [knobs, setKnobs] = useState<Knobs>(initKnobs);
  const [faders, setFaders] = useState(initFaders);
  const [combo, setCombo] = useState<number[]>([0, 0, 0]);
  const [vaultOpen, setVaultOpen] = useState(false);
  const pathname = usePathname();

  // Created on first use (the console mounting, or Play in the transport bar),
  // so subpage visitors don't download the stems unless they ask for sound.
  const ensureEngine = useCallback(() => {
    if (engineRef.current) return engineRef.current;
    const e = new MixEngine();
    CHANNELS.forEach((c) => {
      (Object.keys(KNOB_DEFAULTS) as KnobId[]).forEach((k) => e.setKnob(c.id, k, KNOB_DEFAULTS[k]));
      e.setFader(c.id, c.id === "vault" ? 0 : FADER_UNITY, 0.001);
    });
    engineRef.current = e;
    setEngine(e);
    loadRef.current = e
      .load()
      .then(() => setLoaded(true))
      .catch(() => setLoadError(true));
    return e;
  }, []);

  useEffect(() => () => engineRef.current?.dispose(), []);

  const toggle = useCallback(async () => {
    const e = ensureEngine();
    if (e.playing) {
      e.stop();
      setPlaying(false);
      return;
    }
    await loadRef.current;
    if (!e.loaded) return;
    await e.play();
    setPlaying(true);
  }, [ensureEngine]);

  const setKnob = useCallback((ch: ChannelId, k: KnobId, v: number) => {
    setKnobs((prev) => ({ ...prev, [ch]: { ...prev[ch], [k]: v } }));
    engineRef.current?.setKnob(ch, k, v);
  }, []);

  const setFader = useCallback(
    (ch: ChannelId, v: number) => {
      if (ch === "vault" && !vaultOpen) return;
      setFaders((prev) => ({ ...prev, [ch]: v }));
      engineRef.current?.setFader(ch, v);
    },
    [vaultOpen]
  );

  const setComboKnob = useCallback(
    (i: number, v: number) => {
      if (vaultOpen) return false;
      const next = combo.map((x, j) => (j === i ? v : x));
      setCombo(next);
      if (next.every((x, j) => x === VAULT_COMBO[j])) {
        setVaultOpen(true);
        setFaders((prev) => ({ ...prev, vault: FADER_UNITY }));
        engineRef.current?.setFader("vault", FADER_UNITY, 0.6);
        return true;
      }
      return false;
    },
    [combo, vaultOpen]
  );

  const showBar = pathname !== "/";

  return (
    <SessionContext.Provider
      value={{ engine, loaded, loadError, playing, knobs, faders, combo, vaultOpen, ensureEngine, toggle, setKnob, setFader, setComboKnob }}
    >
      {children}
      {showBar && <TransportBar />}
    </SessionContext.Provider>
  );
}
