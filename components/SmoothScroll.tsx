"use client";
import { useEffect } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: import("lenis").default;

    async function init() {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({
        duration: 1.3,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    init();
    return () => { lenis?.destroy(); };
  }, []);

  return <>{children}</>;
}
