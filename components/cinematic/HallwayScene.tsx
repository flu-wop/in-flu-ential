"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ServiceModal from "./ServiceModal";
import SceneBoundary from "./SceneBoundary";
import type { ServiceData } from "./ServiceModal";

const EntranceSequence = dynamic(() => import("./EntranceSequence"), { ssr: false });

// If the 3D entrance scene throws, this fires instead — guarantees the grid
// still reveals rather than staying hidden behind a dead scene forever.
function EntranceFallback({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

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
  const [activeService, setActiveService] = useState<ServiceData | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [sequenceComplete, setSequenceComplete] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 769px)");
    setIsDesktop(mq.matches);
    // Mobile never plays the entrance sequence — straight to the grid.
    if (!mq.matches) setSequenceComplete(true);
  }, []);

  return (
    <>
      <section id="hallway" className="relative bg-[#060504] py-24 md:py-32 px-6 md:px-16 overflow-hidden">
        {isDesktop && !sequenceComplete && (
          <SceneBoundary fallback={<EntranceFallback onComplete={() => setSequenceComplete(true)} />}>
            <EntranceSequence onComplete={() => setSequenceComplete(true)} />
          </SceneBoundary>
        )}

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="flex items-center gap-4 justify-center mb-5">
            <div className="h-px w-10 bg-[#D4AF77]/50" />
            <span
              className="text-[10px] tracking-[0.45em] text-[#D4AF77] uppercase"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              The Hallway
            </span>
            <div className="h-px w-10 bg-[#D4AF77]/50" />
          </div>
          <h2
            className="text-[clamp(2.2rem,7vw,5.5rem)] font-light text-[#F5EDD8] leading-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Every door,
            <br />
            <em className="text-[#D4AF77]">a discipline</em>
          </h2>
          <p
            className="mt-4 text-[#A89880] text-sm md:text-base max-w-lg mx-auto"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Tap a door to step inside.
          </p>
        </motion.div>

        {/* Door grid */}
        <motion.div
          initial={false}
          animate={{ opacity: sequenceComplete ? 1 : 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {SERVICES.map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => setActiveService(s)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={sequenceComplete ? { opacity: 1, y: 0 } : {}}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="group relative text-left p-7 md:p-8 transition-colors duration-300 hover:bg-[#D4AF77]/[0.04]"
              style={{ border: "1px solid rgba(212,175,119,0.18)" }}
            >
              <span
                className="text-[11px] tracking-[0.3em] text-[#D4AF77]/60 uppercase"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                {s.number}
              </span>
              <h3
                className="mt-3 text-xl md:text-2xl font-light text-[#F5EDD8] leading-snug"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {s.label}
              </h3>
              <p
                className="mt-2 text-xs text-[#A89880]/70"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {s.price}
              </p>
              <span
                className="absolute bottom-6 right-7 text-[#D4AF77]/40 group-hover:text-[#D4AF77] group-hover:translate-x-1 transition-all duration-300"
                aria-hidden
              >
                →
              </span>
            </motion.button>
          ))}
        </motion.div>
      </section>

      <ServiceModal service={activeService} onClose={() => setActiveService(null)} />
    </>
  );
}
