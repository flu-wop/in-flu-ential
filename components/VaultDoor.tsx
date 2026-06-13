"use client";
import { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// The combination: three numbers the dial must
// pass through in sequence (like a real vault).
// Change these to whatever you want.
// ─────────────────────────────────────────────
const COMBO = [24, 8, 16]; // right, left, right

interface Props {
  onUnlock: () => void;
  error: boolean;
  onErrorClear: () => void;
}

export default function VaultDoor({ onUnlock, error, onErrorClear }: Props) {
  // ── Dial state ──────────────────────────────
  const [rotation, setRotation]     = useState(0);      // cumulative degrees
  const [display, setDisplay]       = useState(0);      // 0–39 shown on dial
  const [step, setStep]             = useState(0);      // 0=right, 1=left, 2=right
  const [markers, setMarkers]       = useState<number[]>([]); // completed steps
  const [doorOpen, setDoorOpen]     = useState(false);
  const [boltsOut, setBoltsOut]     = useState(true);
  const [shake, setShake]           = useState(false);
  const [hint, setHint]             = useState<string>("Turn right to begin");

  const isDragging   = useRef(false);
  const lastAngle    = useRef(0);
  const totalDelta   = useRef(0);   // degrees turned in current direction
  const dialRef      = useRef<HTMLDivElement>(null);
  const centerRef    = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Directions: step 0 = right (negative delta = clockwise on screen)
  const DIRECTIONS = ["right", "left", "right"] as const;

  function getAngle(e: MouseEvent | TouchEvent) {
    const touch = "touches" in e ? e.touches[0] : e;
    const c = centerRef.current;
    return Math.atan2(touch.clientY - c.y, touch.clientX - c.x) * (180 / Math.PI);
  }

  function getCenter() {
    const el = dialRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    centerRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  const onStart = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    getCenter();
    isDragging.current  = true;
    lastAngle.current   = getAngle(e);
    totalDelta.current  = 0;
  }, []);

  const onMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging.current || doorOpen) return;
    e.preventDefault();

    const angle  = getAngle(e);
    let   delta  = angle - lastAngle.current;

    // Wrap delta to [-180, 180]
    if (delta >  180) delta -= 360;
    if (delta < -180) delta += 360;

    lastAngle.current  = angle;
    totalDelta.current += delta;

    // Update visual rotation
    setRotation(r => r + delta);

    // Update display number (0–39, dial has 40 marks)
    setDisplay(d => {
      let next = (d - delta / 9) % 40;
      if (next < 0) next += 40;
      return next;
    });

    // Check if we've turned enough in the correct direction
    const dir      = DIRECTIONS[step];
    const clockwise = totalDelta.current > 0;   // positive = clockwise on screen
    const needed   = dir === "right" ? true : false; // right = clockwise

    // Each number on dial = 9 degrees of rotation (360/40)
    const numbersTurned = Math.abs(totalDelta.current / 9);

    if (numbersTurned >= 1) {
      const movingCorrect = clockwise === needed;
      if (!movingCorrect && step > 0) {
        // Wrong direction after first step — reset
        handleWrongDirection();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, doorOpen]);

  const onEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  function handleWrongDirection() {
    setShake(true);
    setStep(0);
    setMarkers([]);
    setHint("Wrong direction — start over");
    totalDelta.current = 0;
    setTimeout(() => setShake(false), 600);
  }

  // "Submit" current number — called on double-click or button
  function submitNumber() {
    if (doorOpen) return;
    const current = Math.round(display) % 40;
    const target  = COMBO[step];

    if (Math.abs(current - target) <= 1) {
      // Correct
      const newMarkers = [...markers, target];
      setMarkers(newMarkers);
      onErrorClear();

      if (step < 2) {
        setStep(s => s + 1);
        totalDelta.current = 0;
        const nextDir = DIRECTIONS[step + 1];
        setHint(
          step === 0
            ? `✓ First number. Now turn ${nextDir}`
            : `✓ Second number. Last one — turn ${nextDir}`
        );
      } else {
        // All three correct — unlock
        setHint("✓ Combination accepted");
        setBoltsOut(false);
        setTimeout(() => setDoorOpen(true), 800);
        setTimeout(() => onUnlock(), 1800);
      }
    } else {
      // Wrong number
      setShake(true);
      setStep(0);
      setMarkers([]);
      setHint("Wrong number — start over");
      totalDelta.current = 0;
      setTimeout(() => setShake(false), 600);
    }
  }

  // Attach drag events to the dial
  useEffect(() => {
    const el = dialRef.current;
    if (!el) return;
    el.addEventListener("mousedown",  onStart as EventListener, { passive: false });
    el.addEventListener("touchstart", onStart as EventListener, { passive: false });
    window.addEventListener("mousemove",  onMove as EventListener, { passive: false });
    window.addEventListener("touchmove",  onMove as EventListener, { passive: false });
    window.addEventListener("mouseup",  onEnd);
    window.addEventListener("touchend", onEnd);
    return () => {
      el.removeEventListener("mousedown",  onStart as EventListener);
      el.removeEventListener("touchstart", onStart as EventListener);
      window.removeEventListener("mousemove",  onMove as EventListener);
      window.removeEventListener("touchmove",  onMove as EventListener);
      window.removeEventListener("mouseup",  onEnd);
      window.removeEventListener("touchend", onEnd);
    };
  }, [onStart, onMove, onEnd]);

  // Shake on external error
  useEffect(() => {
    if (error) { setShake(true); setTimeout(() => setShake(false), 600); }
  }, [error]);

  const dialNum = Math.round(((display % 40) + 40) % 40);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden">

      {/* ── Room atmosphere ───────────────────── */}
      <div className="absolute inset-0 bg-[#080808]" />

      {/* Floor perspective lines */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `
          linear-gradient(to bottom, transparent 50%, #C9A84C08 100%),
          repeating-linear-gradient(90deg, #C9A84C 0px, #C9A84C 1px, transparent 1px, transparent 80px)
        `,
        maskImage: "linear-gradient(to bottom, transparent 40%, black 100%)",
      }} />

      {/* Ceiling light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-gold/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Side wall shadows */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />

      {/* ── Vault door assembly ───────────────── */}
      <div className="relative" style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}>

        {/* Door wrapper — swings on hinge */}
        <div
          className="relative transition-transform"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "left center",
            transform: doorOpen ? "rotateY(-115deg)" : "rotateY(0deg)",
            transition: doorOpen ? "transform 1.2s cubic-bezier(0.4,0,0.2,1)" : "none",
            width: "min(380px, 88vw)",
          }}
        >
          {/* ── DOOR FACE ─────────────────────── */}
          <div
            className={`relative rounded-full border-8 flex items-center justify-center ${shake ? "animate-[shake_0.5s_ease]" : ""}`}
            style={{
              width: "min(380px, 88vw)",
              height: "min(380px, 88vw)",
              borderColor: "#2A2A2A",
              background: "radial-gradient(circle at 35% 35%, #2C2C2C 0%, #111 60%, #0A0A0A 100%)",
              boxShadow: `
                inset 0 4px 20px rgba(0,0,0,0.8),
                inset 0 -2px 8px rgba(201,168,76,0.05),
                0 0 0 4px #1a1a1a,
                0 0 0 8px #222,
                0 0 0 12px #1a1a1a,
                0 20px 60px rgba(0,0,0,0.9)
              `,
            }}
          >
            {/* Outer ring detail */}
            <div className="absolute inset-4 rounded-full border border-white/5" />
            <div className="absolute inset-8 rounded-full border border-white/3" />

            {/* ── LOCKING BOLTS ─────────────────── */}
            {[0, 90, 180, 270].map((deg) => {
              const rad    = (deg * Math.PI) / 180;
              const r      = 47; // % from center
              const x      = 50 + r * Math.cos(rad);
              const y      = 50 + r * Math.sin(rad);
              const isH    = deg === 0 || deg === 180;
              return (
                <div
                  key={deg}
                  className="absolute transition-all duration-700"
                  style={{
                    left:      `${x}%`,
                    top:       `${y}%`,
                    transform: `translate(-50%, -50%)`,
                  }}
                >
                  <div
                    className="rounded-full transition-all duration-700"
                    style={{
                      width:  isH ? (boltsOut ? 28 : 16) : 20,
                      height: isH ? 20 : (boltsOut ? 28 : 16),
                      background: boltsOut
                        ? "radial-gradient(circle at 35% 35%, #555 0%, #222 100%)"
                        : "radial-gradient(circle at 35% 35%, #C9A84C44 0%, #111 100%)",
                      boxShadow: boltsOut
                        ? "inset 0 2px 4px rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.8)"
                        : "none",
                      border: "1px solid #333",
                    }}
                  />
                </div>
              );
            })}

            {/* ── DIAL ──────────────────────────── */}
            <div
              ref={dialRef}
              className="relative rounded-full flex items-center justify-center select-none"
              style={{
                width: "52%",
                height: "52%",
                background: "radial-gradient(circle at 40% 30%, #3A3A3A 0%, #1A1A1A 60%, #111 100%)",
                boxShadow: `
                  inset 0 3px 12px rgba(0,0,0,0.9),
                  inset 0 -1px 4px rgba(255,255,255,0.04),
                  0 0 0 3px #222,
                  0 0 0 5px #2A2A2A,
                  0 4px 20px rgba(0,0,0,0.8)
                `,
                cursor: doorOpen ? "default" : "grab",
                transform: `rotate(${rotation}deg)`,
                touchAction: "none",
              }}
            >
              {/* Tick marks */}
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: i % 5 === 0 ? 2 : 1,
                    height: i % 5 === 0 ? 10 : 6,
                    background: i % 5 === 0 ? "#C9A84C" : "#444",
                    top: "4%",
                    left: "50%",
                    transformOrigin: `0 ${/* half of dial radius */ 90}px`,
                    transform: `translateX(-50%) rotate(${(i / 40) * 360}deg)`,
                    opacity: i % 5 === 0 ? 0.9 : 0.4,
                  }}
                />
              ))}

              {/* Dial knob center */}
              <div className="absolute inset-[30%] rounded-full border border-white/10"
                style={{
                  background: "radial-gradient(circle at 40% 30%, #444 0%, #1A1A1A 100%)",
                  boxShadow: "inset 0 2px 6px rgba(0,0,0,0.8), 0 1px 3px rgba(255,255,255,0.05)",
                }}
              />
            </div>

            {/* ── DIAL POINTER (fixed, outside dial) ── */}
            <div className="absolute top-[14%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
              <div className="w-0.5 h-3 bg-gold" />
              <div className="w-0 h-0"
                style={{ borderLeft:"4px solid transparent", borderRight:"4px solid transparent", borderTop:"6px solid #C9A84C" }} />
            </div>

            {/* ── Hinge detail (left side) ──────── */}
            <div className="absolute left-0 top-1/4 -translate-x-3 w-5 rounded-r-sm"
              style={{ height:"25%", background:"linear-gradient(to right, #333, #222)", border:"1px solid #444" }} />
            <div className="absolute left-0 bottom-1/4 -translate-x-3 w-5 rounded-r-sm"
              style={{ height:"25%", background:"linear-gradient(to right, #333, #222)", border:"1px solid #444" }} />
          </div>

          {/* ── DOOR SIDE (3D thickness) ──────────── */}
          <div
            className="absolute top-0 right-0 rounded-r-full"
            style={{
              width: 24,
              height: "100%",
              background: "linear-gradient(to right, #111, #1A1A1A)",
              transform: "translateX(100%) rotateY(90deg)",
              transformOrigin: "left center",
            }}
          />
        </div>

        {/* ── DOOR FRAME ──────────────────────────── */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            margin: "-16px",
            border: "16px solid",
            borderColor: "#1A1A1A",
            borderRadius: "50%",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.8)",
            zIndex: -1,
          }}
        />
      </div>

      {/* ── UI BELOW DOOR ─────────────────────────── */}
      <div className="relative z-10 mt-10 text-center max-w-xs w-full">

        {/* Combination progress */}
        <div className="flex items-center justify-center gap-3 mb-5">
          {COMBO.map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500"
                style={{
                  borderColor:     markers[i] !== undefined ? "#C9A84C" : "#333",
                  backgroundColor: markers[i] !== undefined ? "#C9A84C11" : "transparent",
                }}
              >
                {markers[i] !== undefined ? (
                  <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="font-sans text-[10px] text-mist/30">{i + 1}</span>
                )}
              </div>
              <span className="font-sans text-[9px] tracking-widest uppercase text-mist/30">
                {["Right", "Left", "Right"][i]}
              </span>
            </div>
          ))}
        </div>

        {/* Number display */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-3 border border-white/10 bg-ink-2 px-6 py-3">
            <span className="font-sans text-[10px] text-mist/40 tracking-widest uppercase">Position</span>
            <span className="font-display text-3xl text-cream font-light w-10 text-center">
              {String(dialNum).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Hint text */}
        <p className="font-sans text-[11px] text-mist/50 tracking-widest uppercase mb-5 h-4">
          {hint}
        </p>

        {/* Submit button */}
        <button
          onClick={submitNumber}
          disabled={doorOpen}
          className="w-full border border-gold/40 text-gold font-sans text-xs tracking-widest uppercase py-3.5 hover:bg-gold/10 transition-colors duration-300 disabled:opacity-30 mb-4"
        >
          Set Number
        </button>

        {/* Fallback password */}
        <details className="text-left">
          <summary className="font-sans text-[10px] text-mist/25 tracking-widest uppercase cursor-pointer hover:text-mist/40 transition-colors text-center">
            Use password instead
          </summary>
          <PasswordFallback onUnlock={onUnlock} />
        </details>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0) rotateY(0); }
          20%      { transform: translateX(-8px) rotateY(0); }
          40%      { transform: translateX(8px) rotateY(0); }
          60%      { transform: translateX(-5px) rotateY(0); }
          80%      { transform: translateX(5px) rotateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// Fallback: classic password field, tucked away
// ─────────────────────────────────────────────
import { VAULT_PASSWORD } from "@/lib/vault-items";

function PasswordFallback({ onUnlock }: { onUnlock: () => void }) {
  const [val, setVal]   = useState("");
  const [err, setErr]   = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (val === VAULT_PASSWORD) onUnlock();
    else { setErr(true); setVal(""); }
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-2">
      <input type="password" value={val}
        onChange={e => { setVal(e.target.value); setErr(false); }}
        placeholder="Password"
        className={`w-full bg-ink border px-4 py-3 text-sm text-cream placeholder:text-mist/30 font-sans focus:outline-none transition-colors text-center tracking-widest ${err ? "border-red-500/50" : "border-white/8 focus:border-gold/40"}`}
      />
      {err && <p className="font-sans text-[10px] text-red-400 text-center">Incorrect</p>}
      <button type="submit" className="w-full bg-ink border border-white/10 text-mist text-xs tracking-widest uppercase py-2.5 hover:border-gold/30 hover:text-cream transition-colors">
        Unlock
      </button>
    </form>
  );
}
