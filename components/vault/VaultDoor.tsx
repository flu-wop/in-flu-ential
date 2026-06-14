"use client";

import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface VaultDoorProps {
  onUnlock: () => void;
}

const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_VAULT_PASSWORD || "influential2024";

const SPOKES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export default function VaultDoor({ onUnlock }: VaultDoorProps) {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"idle" | "typing" | "wrong" | "unlocking" | "open">("idle");
  const [dialAngle, setDialAngle] = useState(0);
  const dialControls = useAnimation();
  const doorControls = useAnimation();
  const lightControls = useAnimation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Slowly rotate dial while idle
  useEffect(() => {
    if (phase === "idle" || phase === "typing") {
      dialControls.start({
        rotate: [dialAngle, dialAngle + 360],
        transition: { duration: 18, ease: "linear", repeat: Infinity },
      });
    }
  }, [phase]);

  const handleInput = (val: string) => {
    setInput(val);
    setPhase("typing");
    // Spin dial with each keystroke
    dialControls.start({
      rotate: dialAngle + val.length * 37,
      transition: { duration: 0.3, ease: "easeOut" },
    });
    setDialAngle(prev => prev + 37);
  };

  const handleSubmit = async () => {
    if (input === CORRECT_PASSWORD) {
      setPhase("unlocking");

      // Fast spin — combination found
      await dialControls.start({
        rotate: dialAngle + 720,
        transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
      });

      // Handle click sequence
      await new Promise(r => setTimeout(r, 200));

      // Door swings open
      await doorControls.start({
        rotateY: -88,
        x: "-12%",
        transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
      });

      // Light floods in
      await lightControls.start({
        opacity: 1,
        transition: { duration: 0.6 },
      });

      setPhase("open");
      setTimeout(onUnlock, 600);
    } else {
      setPhase("wrong");
      // Shake dial
      await dialControls.start({
        rotate: [dialAngle, dialAngle - 15, dialAngle + 15, dialAngle - 10, dialAngle + 10, dialAngle],
        transition: { duration: 0.5 },
      });
      setInput("");
      setTimeout(() => setPhase("idle"), 1200);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-[#060606]">

      {/* Stone wall texture background */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 120% 100% at 50% 60%, #1a1208 0%, #080808 60%, #030303 100%)",
      }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px",
      }} />

      {/* Ambient floor light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 100%, rgba(212,175,119,0.08) 0%, transparent 70%)",
      }} />

      {/* THE VAULT DOOR */}
      <motion.div
        animate={doorControls}
        style={{ transformOrigin: "left center", perspective: 1200 }}
        className="relative z-10"
      >
        {/* Door body */}
        <div
          className="relative"
          style={{
            width: "min(420px, 88vw)",
            height: "min(560px, 80vh)",
            background: "linear-gradient(160deg, #2a2318 0%, #1a1610 40%, #0f0d08 100%)",
            border: "3px solid rgba(212,175,119,0.25)",
            boxShadow: `
              inset 0 0 60px rgba(0,0,0,0.8),
              inset 0 2px 0 rgba(212,175,119,0.15),
              0 0 0 1px rgba(212,175,119,0.08),
              0 40px 120px rgba(0,0,0,0.9),
              -20px 0 80px rgba(0,0,0,0.6)
            `,
          }}
        >
          {/* Door panel insets */}
          {[
            { top: "6%", left: "6%", right: "6%", height: "28%" },
            { top: "38%", left: "6%", right: "6%", height: "28%" },
            { top: "70%", left: "6%", right: "6%", height: "24%" },
          ].map((style, i) => (
            <div key={i} className="absolute" style={{
              ...style,
              border: "1px solid rgba(212,175,119,0.08)",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)",
            }} />
          ))}

          {/* Gold rivets */}
          {[
            { top: "4%", left: "4%" }, { top: "4%", right: "4%" },
            { bottom: "4%", left: "4%" }, { bottom: "4%", right: "4%" },
            { top: "4%", left: "48%" }, { bottom: "4%", left: "48%" },
          ].map((pos, i) => (
            <div key={i} className="absolute w-3 h-3 rounded-full" style={{
              ...pos,
              background: "radial-gradient(circle at 35% 35%, #E8C97A, #6B4F1A)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)",
            }} />
          ))}

          {/* Center — dial assembly */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">

            {/* Wordmark above dial */}
            <div className="text-center mb-2">
              <p className="text-[9px] tracking-[0.6em] text-[#D4AF77]/40 uppercase mb-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Private Access
              </p>
              <p className="text-2xl font-light text-[#D4AF77]/60 tracking-[0.15em]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                The Vault
              </p>
            </div>

            {/* Dial outer ring */}
            <div className="relative" style={{ width: 160, height: 160 }}>
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full" style={{
                background: "linear-gradient(135deg, #3a2e1a 0%, #1a1408 100%)",
                border: "2px solid rgba(212,175,119,0.3)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.8), inset 0 2px 0 rgba(212,175,119,0.1), inset 0 -2px 0 rgba(0,0,0,0.5)",
              }} />

              {/* Tick marks */}
              {SPOKES.map((deg) => (
                <div key={deg} className="absolute inset-0 flex items-center justify-center" style={{ rotate: `${deg}deg` }}>
                  <div style={{
                    position: "absolute",
                    top: 6,
                    width: deg % 90 === 0 ? 3 : 1.5,
                    height: deg % 90 === 0 ? 12 : 7,
                    background: deg % 90 === 0 ? "rgba(212,175,119,0.6)" : "rgba(212,175,119,0.25)",
                    borderRadius: 1,
                  }} />
                </div>
              ))}

              {/* Spinning dial */}
              <motion.div
                animate={dialControls}
                className="absolute inset-3 rounded-full"
                style={{
                  background: "radial-gradient(circle at 40% 35%, #4a3a20, #1a1208)",
                  border: "1px solid rgba(212,175,119,0.2)",
                  boxShadow: "inset 0 4px 12px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                {/* Dial grip lines */}
                {[0, 45, 90, 135].map((deg) => (
                  <div key={deg} className="absolute inset-0 flex items-center justify-center" style={{ rotate: `${deg}deg` }}>
                    <div className="w-full h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,119,0.15) 30%, rgba(212,175,119,0.15) 70%, transparent)" }} />
                  </div>
                ))}
                {/* Center jewel */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full" style={{
                    background: "radial-gradient(circle at 30% 30%, #E8C97A, #6B4F1A)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,119,0.2)",
                  }} />
                </div>
                {/* Dial marker */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-4 rounded-full" style={{
                  background: "linear-gradient(to bottom, #E8C97A, #B8935A)",
                }} />
              </motion.div>

              {/* Indicator notch at top */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1" style={{
                width: 0, height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "10px solid rgba(212,175,119,0.6)",
              }} />
            </div>

            {/* Password input */}
            <div className="flex flex-col items-center gap-3 w-full px-10">
              <div className="relative w-full">
                <input
                  ref={inputRef}
                  type="password"
                  value={input}
                  onChange={(e) => handleInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="· · · · · · · ·"
                  autoComplete="off"
                  className="w-full bg-transparent text-center text-[#F5EDD8] tracking-[0.4em] text-sm outline-none placeholder:text-[#A89880]/30"
                  style={{
                    fontFamily: "DM Mono, monospace",
                    borderBottom: `1px solid ${phase === "wrong" ? "rgba(220,80,80,0.5)" : "rgba(212,175,119,0.2)"}`,
                    paddingBottom: 8,
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
                className="mt-1 px-8 py-2.5 text-[10px] tracking-[0.4em] uppercase transition-all duration-300"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  background: phase === "unlocking" ? "rgba(212,175,119,0.3)" : "rgba(212,175,119,0.12)",
                  border: "1px solid rgba(212,175,119,0.25)",
                  color: "#D4AF77",
                }}
              >
                {phase === "unlocking" ? "Opening..." : "Enter"}
              </button>
            </div>
          </div>

          {/* Handle bar */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4">
            <div className="w-4 h-24 rounded-full" style={{
              background: "linear-gradient(to right, #3a2e1a, #2a2010)",
              border: "1px solid rgba(212,175,119,0.2)",
              boxShadow: "4px 0 16px rgba(0,0,0,0.6)",
            }} />
          </div>

          {/* Hinge bars left */}
          {[25, 75].map((pct) => (
            <div key={pct} className="absolute left-0 -translate-x-3 w-6 h-10 rounded-sm" style={{
              top: `${pct}%`,
              transform: "translate(-60%, -50%)",
              background: "linear-gradient(to right, #1a1208, #2a2010)",
              border: "1px solid rgba(212,175,119,0.15)",
            }} />
          ))}
        </div>
      </motion.div>

      {/* Light beam that floods in when door opens */}
      <motion.div
        animate={lightControls}
        initial={{ opacity: 0 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 40% 80% at 20% 50%, rgba(212,175,119,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: "linear-gradient(to right, transparent, rgba(212,175,119,0.3) 30%, rgba(212,175,119,0.3) 70%, transparent)",
      }} />
    </div>
  );
}
