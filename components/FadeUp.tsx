"use client";
import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}

export default function FadeUp({ children, className = "", delay = 0, distance = 40 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let cleanup: (() => void) | undefined;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.fromTo(ref.current!,
          { y: distance, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay,
            scrollTrigger: {
              trigger: ref.current!,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      cleanup = () => ctx.revert();
    }

    init();
    return () => cleanup?.();
  }, [delay, distance]);

  return <div ref={ref} className={className} style={{ opacity: 0 }}>{children}</div>;
}
