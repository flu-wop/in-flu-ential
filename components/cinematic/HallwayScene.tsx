"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import ServiceModal from "./ServiceModal";
import SceneBoundary from "./SceneBoundary";
import type { ServiceData } from "./ServiceModal";

// Three.js corridor — client-only, never SSR
const Hallway3D = dynamic(() => import("./Hallway3D"), { ssr: false });

const SERVICES: ServiceData[] = [
  {
    id: "creative-direction",
    number: "01",
    label: "Creative Direction",
    headline: "Vision that <em class='text-[#D4AF77] not-italic'>commands</em> attention",
    description:
      "Full-scale creative direction for music, brands, and cultural entities. We shape the aesthetic universe your audience lives inside.",
    deliverables: [
      "Brand identity & visual language system",
      "Campaign concept & art direction",
      "Content rollout strategy across platforms",
      "Quarterly creative alignment sessions",
      "Style guide and reference deck",
    ],
    price: "From $5,000",
    cta: "Schedule a Discovery Call",
  },
  {
    id: "social-strategy",
    number: "02",
    label: "Social & Growth Strategy",
    headline: "Booked while you <em class='text-[#D4AF77] not-italic'>sleep</em>",
    description:
      "Data-backed social architecture built around cultural authenticity — not algorithmic tricks. Growth that compounds.",
    deliverables: [
      "Platform-specific content strategy (IG, TikTok, X, YouTube)",
      "Monthly content calendar and posting cadence",
      "Audience persona mapping",
      "Engagement growth playbook",
      "Monthly performance reporting deck",
    ],
    price: "From $2,500 / mo",
    cta: "Reserve Your Slot",
  },
  {
    id: "music-marketing",
    number: "03",
    label: "Music & Artist Marketing",
    headline: "Releases that <em class='text-[#D4AF77] not-italic'>land</em> with impact",
    description:
      "From independent releases to major label rollouts — we've worked with Curren$y, NoCap, Zaytoven, and Boosie. Now we bring that infrastructure to you.",
    deliverables: [
      "Single / album rollout strategy",
      "Press kit and media outreach",
      "Playlist pitching and DSP optimization",
      "Video content pre/during/post release plan",
      "Co-sign + collaboration brokerage",
    ],
    price: "From $3,500",
    cta: "Start the Conversation",
  },
  {
    id: "brand-development",
    number: "04",
    label: "Brand Development",
    headline: "Identity that <em class='text-[#D4AF77] not-italic'>outlasts</em> trends",
    description:
      "We build the brand architecture that makes every piece of content, collab, and campaign feel inevitable — not accidental.",
    deliverables: [
      "Full brand audit and competitive positioning",
      "Naming, taglines, and verbal identity",
      "Logo + identity system (primary, secondary, marks)",
      "Brand voice and messaging framework",
      "Audience growth roadmap — 90 days",
    ],
    price: "From $7,500",
    cta: "Get a Brand Assessment",
  },
  {
    id: "media-production",
    number: "05",
    label: "Media & Production",
    headline: "Content that makes people <em class='text-[#D4AF77] not-italic'>stop</em>",
    description:
      "Studio-level video, photography, and audio production through Mid City Sound. Engineered at the source, delivered at the standard.",
    deliverables: [
      "Studio session coordination (Mid City Sound, NOLA)",
      "Video production direction and editing",
      "Short-form vertical content production",
      "Documentary and long-form brand film",
      "Podcast and audio brand setup",
    ],
    price: "From $1,500",
    cta: "Book Studio Time",
  },
  {
    id: "executive-strategy",
    number: "06",
    label: "Executive Strategy",
    headline: "The advisor your <em class='text-[#D4AF77] not-italic'>competitors</em> don't have",
    description:
      "High-level advisory for founders, athletes, and entertainers navigating brand, business, and legacy decisions at the executive level.",
    deliverables: [
      "1-on-1 monthly strategy sessions (4 hrs/mo)",
      "Revenue stream audit and diversification map",
      "Deal review and partnership vetting",
      "Brand positioning vs. long-term legacy planning",
      "Direct access via Signal — real-time advisory",
    ],
    price: "From $12,500 / mo",
    cta: "Apply for Advisory",
  },
];

export default function HallwayScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState<ServiceData | null>(null);
  const scrollProgress = useRef(0);

  // Drive the 3D camera from scroll through this tall section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Mirror scroll MotionValue into a ref the canvas reads each frame
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollProgress.current = v;
  });

  return (
    <>
      {/* Tall scroll track — sticky canvas inside */}
      <section ref={ref} id="hallway" className="relative bg-[#060504]" style={{ height: "420vh" }}>
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
          {/* 3D corridor */}
          <SceneBoundary>
            <Hallway3D
              services={SERVICES}
              onOpen={setActiveService}
              scrollProgress={scrollProgress}
            />
          </SceneBoundary>

          {/* Heading overlay — fades as you enter the hall */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.12], [1, 0]) }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="h-px w-10 bg-[#D4AF77]/50" />
              <span className="text-[10px] tracking-[0.45em] text-[#D4AF77] uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
                The Hallway
              </span>
              <div className="h-px w-10 bg-[#D4AF77]/50" />
            </div>
            <h2 className="text-[clamp(2.2rem,7vw,5.5rem)] font-light text-[#F5EDD8] leading-tight" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Every door,
              <br />
              <em className="text-[#D4AF77]">a discipline</em>
            </h2>
            <p className="mt-4 text-[#A89880] text-sm md:text-base max-w-lg" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Scroll to walk the hall. Tap any door to step inside.
            </p>
          </motion.div>

          {/* Scroll cue — fades once moving */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]) }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="text-[9px] tracking-[0.5em] text-[#A89880]/60 uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Walk
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-[#D4AF77]/50 to-transparent" />
          </motion.div>

          {/* Door directory — accessible list, always tappable */}
          <div className="absolute bottom-6 left-0 right-0 px-4 pointer-events-auto">
            <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-2">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveService(s)}
                  className="px-3 py-1.5 text-[9px] tracking-[0.25em] uppercase transition-all duration-300 hover:bg-[#D4AF77]/15"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    border: "1px solid rgba(212,175,119,0.15)",
                    color: "#A89880",
                  }}
                >
                  {s.number} · {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ServiceModal service={activeService} onClose={() => setActiveService(null)} />
    </>
  );
}
