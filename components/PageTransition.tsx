"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname     = usePathname();
  const [phase, setPhase] = useState<"idle" | "closing" | "opening">("idle");
  const prevPath     = useRef(pathname);
  const [display, setDisplay] = useState(pathname);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    // 1. Close the door
    setPhase("closing");

    // 2. Swap content at peak of close
    setTimeout(() => {
      setDisplay(pathname);
      setPhase("opening");
    }, 380);

    // 3. Done
    setTimeout(() => setPhase("idle"), 760);
  }, [pathname]);

  return (
    <div className="relative overflow-hidden">
      {/* Content */}
      <div style={{
        opacity:   phase === "closing" ? 0 : 1,
        transform: phase === "closing" ? "scale(0.98)" : "scale(1)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}>
        {children}
      </div>

      {/* Door panel — left leaf */}
      <div
        className="fixed inset-0 z-[8000] pointer-events-none origin-left"
        style={{
          background: "linear-gradient(to right, #0A0A0A 0%, #141414 100%)",
          transformOrigin: "left center",
          transform: phase === "closing"
            ? "scaleX(1)"
            : phase === "opening"
            ? "scaleX(0)"
            : "scaleX(0)",
          transition: phase === "closing"
            ? "transform 0.35s cubic-bezier(0.4,0,1,1)"
            : "transform 0.35s cubic-bezier(0,0,0.2,1)",
          transitionDelay: phase === "opening" ? "0s" : "0s",
          clipPath: "inset(0 50% 0 0)",
        }}
      >
        {/* Gold edge line */}
        <div className="absolute right-0 inset-y-0 w-px bg-gold/20" />
        {/* IN-FLU-ENTIAL mark center */}
        <div className="absolute inset-0 flex items-center justify-end pr-8">
          {phase === "closing" && (
            <p className="font-sans text-[9px] text-gold/30 tracking-[0.4em] uppercase rotate-90 origin-right">
              IN-FLU-ENTIAL
            </p>
          )}
        </div>
      </div>

      {/* Door panel — right leaf */}
      <div
        className="fixed inset-0 z-[8000] pointer-events-none"
        style={{
          background: "linear-gradient(to left, #0A0A0A 0%, #141414 100%)",
          transformOrigin: "right center",
          transform: phase === "closing"
            ? "scaleX(1)"
            : phase === "opening"
            ? "scaleX(0)"
            : "scaleX(0)",
          transition: phase === "closing"
            ? "transform 0.35s cubic-bezier(0.4,0,1,1)"
            : "transform 0.35s cubic-bezier(0,0,0.2,1)",
          clipPath: "inset(0 0 0 50%)",
        }}
      >
        <div className="absolute left-0 inset-y-0 w-px bg-gold/20" />
      </div>
    </div>
  );
}
