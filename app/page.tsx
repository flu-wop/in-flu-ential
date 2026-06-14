"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import CinematicNav from "@/components/cinematic/CinematicNav";
import HeroScene from "@/components/cinematic/HeroScene";
import ApproachScene from "@/components/cinematic/ApproachScene";
import HallwayScene from "@/components/cinematic/HallwayScene";
import VaultScene from "@/components/cinematic/VaultScene";
import CinematicFooter from "@/components/cinematic/CinematicFooter";

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-[#080808] overflow-x-hidden">
      <CinematicNav />
      <HeroScene />
      <ApproachScene />
      <HallwayScene />
      <VaultScene />
      <CinematicFooter />
    </main>
  );
}
