"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Cylinder, Torus } from "@react-three/drei";

// NOTE: Environment preset fetches an HDRI from a CDN — Brave/mobile often
// blocks it, which kills the canvas. We light the door manually instead.
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

interface VaultDoor3DProps {
  onUnlock: () => void;
}

const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_VAULT_PASSWORD || "influential2024";

// ── Detect device tier ──────────────────────────────────────────────
function useDeviceTier() {
  const [tier, setTier] = useState<"mobile" | "desktop">("desktop");
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setTier(mq.matches ? "mobile" : "desktop");
    update();
    setReducedMotion(rm.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return { tier, reducedMotion };
}

const GOLD = "#D4AF77";
const GOLD_LT = "#E8C97A";

// ── The 3D door mesh ────────────────────────────────────────────────
function DoorMesh({
  tier,
  openProgress,
  dialSpin,
}: {
  tier: "mobile" | "desktop";
  openProgress: React.MutableRefObject<number>;
  dialSpin: React.MutableRefObject<number>;
}) {
  const doorGroup = useRef<THREE.Group>(null);
  const dial = useRef<THREE.Group>(null);
  const currentOpen = useRef(0);
  const currentSpin = useRef(0);

  // Metal looks different per tier. Desktop leans on env reflections.
  const metalProps =
    tier === "desktop"
      ? { metalness: 0.95, roughness: 0.28 }
      : { metalness: 0.6, roughness: 0.5 };

  useFrame((_, delta) => {
    // Ease door toward target open angle (hinge on left = rotate -Y)
    currentOpen.current += (openProgress.current - currentOpen.current) * Math.min(1, delta * 2.5);
    if (doorGroup.current) {
      doorGroup.current.rotation.y = -currentOpen.current * (Math.PI / 2.05);
    }
    // Ease dial toward target spin
    currentSpin.current += (dialSpin.current - currentSpin.current) * Math.min(1, delta * 6);
    if (dial.current) {
      dial.current.rotation.z = currentSpin.current;
    }
  });

  return (
    <group>
      {/* Door frame / wall opening behind door */}
      <RoundedBox args={[4.6, 6.0, 0.4]} radius={0.05} smoothness={4} position={[0, 0, -0.5]}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.9} />
      </RoundedBox>

      {/* Warm light spilling from inside the vault (behind door) */}
      <pointLight position={[0, 0, -1.2]} intensity={tier === "desktop" ? 8 : 4} color={GOLD_LT} distance={6} />

      {/* The swinging door — hinge pivot on left edge */}
      <group ref={doorGroup} position={[-2.0, 0, 0]}>
        <group position={[2.0, 0, 0]}>
          {/* Main door slab */}
          <RoundedBox args={[4.0, 5.6, 0.55]} radius={0.08} smoothness={4} castShadow>
            <meshStandardMaterial color="#1a1610" {...metalProps} />
          </RoundedBox>

          {/* Outer gold trim ring (raised border) */}
          <RoundedBox args={[3.7, 5.3, 0.62]} radius={0.06} smoothness={4} position={[0, 0, 0.02]}>
            <meshStandardMaterial color={GOLD} metalness={1} roughness={0.32} />
          </RoundedBox>

          {/* Recessed inner panel */}
          <RoundedBox args={[3.3, 4.9, 0.5]} radius={0.05} smoothness={4} position={[0, 0, 0.16]}>
            <meshStandardMaterial color="#15110b" {...metalProps} />
          </RoundedBox>

          {/* Rivets around the border */}
          {[
            [-1.6, 2.5], [1.6, 2.5], [-1.6, -2.5], [1.6, -2.5],
            [0, 2.5], [0, -2.5], [-1.6, 0], [1.6, 0],
          ].map(([x, y], i) => (
            <Cylinder key={i} args={[0.09, 0.09, 0.12, 16]} rotation={[Math.PI / 2, 0, 0]} position={[x, y, 0.32]}>
              <meshStandardMaterial color={GOLD_LT} metalness={1} roughness={0.25} />
            </Cylinder>
          ))}

          {/* ── Dial assembly (spins) ── */}
          <group ref={dial} position={[0, 0.3, 0.36]}>
            {/* Dial back plate */}
            <Cylinder args={[0.95, 0.95, 0.1, 48]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#2a2014" metalness={0.9} roughness={0.35} />
            </Cylinder>
            {/* Dial face */}
            <Cylinder args={[0.78, 0.78, 0.16, 48]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.06]}>
              <meshStandardMaterial color={GOLD} metalness={1} roughness={0.3} />
            </Cylinder>
            {/* Center jewel */}
            <Cylinder args={[0.18, 0.18, 0.22, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.12]}>
              <meshStandardMaterial color={GOLD_LT} metalness={1} roughness={0.15} emissive={GOLD} emissiveIntensity={0.3} />
            </Cylinder>
            {/* Spoke handles radiating from dial */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Cylinder
                key={i}
                args={[0.05, 0.05, 1.7, 12]}
                rotation={[0, 0, (i * Math.PI) / 3]}
                position={[0, 0, 0.04]}
              >
                <meshStandardMaterial color="#3a2e1a" metalness={0.9} roughness={0.4} />
              </Cylinder>
            ))}
          </group>

          {/* Spoke ring around dial */}
          <Torus args={[1.15, 0.06, 12, 48]} position={[0, 0.3, 0.34]}>
            <meshStandardMaterial color={GOLD} metalness={1} roughness={0.35} />
          </Torus>

          {/* Handle bar (right side) */}
          <RoundedBox args={[0.22, 1.6, 0.22]} radius={0.1} smoothness={3} position={[1.5, -1.4, 0.36]}>
            <meshStandardMaterial color={GOLD} metalness={1} roughness={0.3} />
          </RoundedBox>
        </group>
      </group>
    </group>
  );
}

// ── Lighting + scene wrapper ────────────────────────────────────────
function Scene({ tier, openProgress, dialSpin }: {
  tier: "mobile" | "desktop";
  openProgress: React.MutableRefObject<number>;
  dialSpin: React.MutableRefObject<number>;
}) {
  return (
    <>
      <ambientLight intensity={tier === "desktop" ? 0.35 : 0.6} />
      <spotLight position={[5, 6, 6]} angle={0.4} penumbra={0.8} intensity={tier === "desktop" ? 40 : 25} color={GOLD_LT} />
      <spotLight position={[-5, -3, 5]} angle={0.5} penumbra={1} intensity={12} color="#ffffff" />
      <DoorMesh tier={tier} openProgress={openProgress} dialSpin={dialSpin} />
      {/* Manual rim + key lights replace the HDRI so metal reads without any
          network fetch. Extra fills give the gold its sheen. */}
      <pointLight position={[3, 2, 4]} intensity={tier === "desktop" ? 30 : 22} color="#fff4e0" />
      <pointLight position={[-3, -1, 3]} intensity={12} color={GOLD_LT} />
      <pointLight position={[0, 3, 2]} intensity={10} color="#ffffff" />
    </>
  );
}

// ── Main exported component (3D canvas + HTML password UI) ───────────
export default function VaultDoor3D({ onUnlock }: VaultDoor3DProps) {
  const { tier, reducedMotion } = useDeviceTier();
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"idle" | "wrong" | "unlocking" | "open">("idle");
  const [webglFailed, setWebglFailed] = useState(false);
  const openProgress = useRef(0);
  const dialSpin = useRef(0);

  // Spin dial a little on each keystroke for tactile feel
  const handleInput = (val: string) => {
    setInput(val);
    dialSpin.current += 0.45;
  };

  const handleSubmit = async () => {
    if (input === CORRECT_PASSWORD) {
      setPhase("unlocking");
      // Fast combination spin
      dialSpin.current += Math.PI * 4;
      await new Promise((r) => setTimeout(r, reducedMotion ? 100 : 1100));
      // Swing the door open
      openProgress.current = 1;
      await new Promise((r) => setTimeout(r, reducedMotion ? 100 : 1700));
      setPhase("open");
      setTimeout(onUnlock, 500);
    } else {
      setPhase("wrong");
      dialSpin.current -= 0.6;
      setInput("");
      setTimeout(() => setPhase("idle"), 1200);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#060606]">
      {/* Ambient backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 120% 100% at 50% 55%, #1a1208 0%, #080808 60%, #030303 100%)" }}
      />

      {/* 3D canvas */}
      {!webglFailed && (
        <Canvas
          camera={{ position: [0, 0, 7], fov: tier === "mobile" ? 42 : 38 }}
          dpr={tier === "mobile" ? [1, 1.5] : [1, 2]}
          gl={{ antialias: tier === "desktop", powerPreference: "high-performance" }}
          onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; }}
          onError={() => setWebglFailed(true)}
          className="absolute inset-0"
        >
          <Suspense fallback={null}>
            <Scene tier={tier} openProgress={openProgress} dialSpin={dialSpin} />
          </Suspense>
        </Canvas>
      )}

      {/* Fallback if WebGL unavailable */}
      {webglFailed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[#A89880] text-sm tracking-[0.3em] uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Enter the combination below
          </p>
        </div>
      )}

      {/* Password UI overlaid at bottom */}
      <AnimatePresence>
        {phase !== "open" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center gap-4 px-6 pb-16"
          >
            <div className="text-center mb-1">
              <p className="text-[9px] tracking-[0.6em] text-[#D4AF77]/50 uppercase mb-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Private Access
              </p>
              <p className="text-2xl font-light text-[#D4AF77]/70 tracking-[0.15em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                The Vault
              </p>
            </div>

            <div className="w-full max-w-xs">
              <input
                type="password"
                value={input}
                onChange={(e) => handleInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="· · · · · · · ·"
                autoComplete="off"
                disabled={phase === "unlocking"}
                className="w-full bg-transparent text-center text-[#F5EDD8] tracking-[0.4em] text-sm outline-none placeholder:text-[#A89880]/30 pb-2"
                style={{
                  fontFamily: "DM Mono, monospace",
                  borderBottom: `1px solid ${phase === "wrong" ? "rgba(220,80,80,0.5)" : "rgba(212,175,119,0.25)"}`,
                }}
              />
            </div>

            <AnimatePresence>
              {phase === "wrong" && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] tracking-[0.3em] uppercase text-red-400/70"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  Access Denied
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={handleSubmit}
              disabled={phase === "unlocking"}
              className="mt-1 px-10 py-3 text-[10px] tracking-[0.4em] uppercase transition-all duration-300"
              style={{
                fontFamily: "DM Sans, sans-serif",
                background: phase === "unlocking" ? "rgba(212,175,119,0.3)" : "rgba(212,175,119,0.12)",
                border: "1px solid rgba(212,175,119,0.3)",
                color: "#D4AF77",
              }}
            >
              {phase === "unlocking" ? "Opening…" : "Enter"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top gold line */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-20"
        style={{ background: "linear-gradient(to right, transparent, rgba(212,175,119,0.3) 30%, rgba(212,175,119,0.3) 70%, transparent)" }}
      />
    </div>
  );
}
