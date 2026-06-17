"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import OfficeDoor from "./OfficeDoor";
import ServiceModal from "./ServiceModal";
import type { ServiceData } from "./ServiceModal";

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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const fogOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.8], [0, 0.6, 0]);
  const springBgY = useSpring(bgY, { stiffness: 40, damping: 18 });

  return (
    <>
      <section ref={ref} id="hallway" className="relative bg-[#080808]">
        {/* Hallway background strip */}
        <div className="relative overflow-hidden h-[45vw] max-h-[520px] min-h-[280px]">
          <motion.div
            style={{ y: springBgY }}
            className="absolute inset-0 will-change-transform"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('/hallway.webp')`,
                filter: "saturate(0.4) brightness(0.3) sepia(0.4)",
              }}
            />
          </motion.div>

          {/* Atmospheric fog */}
          <motion.div
            style={{
              opacity: fogOpacity,
              background:
                "radial-gradient(ellipse 100% 60% at 50% 50%, rgba(212,175,119,0.08) 0%, transparent 70%)",
            }}
            className="absolute inset-0 pointer-events-none"
          />

          {/* Vignettes */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, #080808 0%, transparent 25%, transparent 75%, #080808 100%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-3/4 pointer-events-none"
            style={{ background: "linear-gradient(to top, #080808, transparent)" }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, #080808, transparent)" }}
          />

          {/* Hallway heading overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-5"
            >
              <div className="h-px w-10 bg-[#D4AF77]/50" />
              <span
                className="text-[10px] tracking-[0.45em] text-[#D4AF77] uppercase"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                The Hallway
              </span>
              <div className="h-px w-10 bg-[#D4AF77]/50" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.2rem,7vw,5.5rem)] font-light text-[#F5EDD8] leading-tight"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Every door,
              <br />
              <em className="text-[#D4AF77]">a discipline</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.9 }}
              className="mt-4 text-[#A89880] text-sm md:text-base max-w-lg"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Walk the hall. Choose your room. Each one leads somewhere rare.
            </motion.p>
          </div>
        </div>

        {/* Doors grid */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {SERVICES.map((service, i) => (
              <OfficeDoor
                key={service.id}
                service={service}
                index={i}
                onOpen={setActiveService}
              />
            ))}
          </div>

          {/* Bottom flourish */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex items-center gap-5 justify-center mt-16"
          >
            <div className="h-px w-16 bg-[#D4AF77]/20" />
            <span
              className="text-[10px] tracking-[0.4em] text-[#A89880]/40 uppercase"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              or enter the vault
            </span>
            <div className="h-px w-16 bg-[#D4AF77]/20" />
          </motion.div>
        </div>
      </section>

      {/* Service modal */}
      <ServiceModal
        service={activeService}
        onClose={() => setActiveService(null)}
      />
    </>
  );
}
