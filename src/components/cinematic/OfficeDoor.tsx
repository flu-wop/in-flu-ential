"use client";

import { motion } from "framer-motion";
import type { ServiceData } from "./ServiceModal";

interface OfficeDoorProps {
  service: ServiceData;
  index: number;
  onOpen: (service: ServiceData) => void;
}

export default function OfficeDoor({ service, index, onOpen }: OfficeDoorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: index * 0.12,
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative"
    >
      <button
        onClick={() => onOpen(service)}
        className="w-full text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF77]/50"
        aria-label={`Open ${service.label} service details`}
      >
        {/* Door frame */}
        <div
          className="relative overflow-hidden transition-all duration-700 ease-out group-hover:-translate-y-1"
          style={{
            background: "linear-gradient(160deg, #181510 0%, #111008 100%)",
            border: "1px solid rgba(212,175,119,0.15)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,119,0.08)",
          }}
        >
          {/* Door top gold accent */}
          <motion.div
            className="h-px w-0 bg-gradient-to-r from-transparent via-[#D4AF77] to-transparent"
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.5 }}
          />

          {/* Door inner panel decoration */}
          <div className="absolute top-3 left-3 right-3 bottom-3 border border-[#D4AF77]/6 pointer-events-none" />
          <div className="absolute top-5 left-5 right-5 bottom-5 border border-[#D4AF77]/4 pointer-events-none" />

          {/* Brass knob */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div
              className="w-3 h-3 rounded-full transition-all duration-500 group-hover:scale-110"
              style={{
                background: "radial-gradient(circle at 35% 35%, #E8C97A, #8B6914)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            />
          </div>

          {/* Content */}
          <div className="px-7 py-8">
            <div className="flex items-start justify-between gap-4 mb-5">
              <span
                className="text-[10px] tracking-[0.4em] text-[#D4AF77]/50 uppercase"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {service.number}
              </span>
              {/* Arrow */}
              <motion.span
                className="text-[#D4AF77]/30 text-xs"
                animate={{ x: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: index * 0.3 }}
              >
                ↗
              </motion.span>
            </div>

            <h3
              className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-light text-[#F5EDD8] leading-tight mb-3 group-hover:text-[#E8C97A] transition-colors duration-500"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {service.label}
            </h3>

            <p
              className="text-[#A89880]/70 text-xs leading-relaxed line-clamp-2"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              {service.description}
            </p>

            <div className="mt-5 pt-5 border-t border-[#D4AF77]/10 flex items-center justify-between">
              <span
                className="text-[10px] tracking-[0.3em] text-[#D4AF77]/60 uppercase"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Open Door
              </span>
              <span
                className="text-lg text-[#D4AF77]/40 font-light group-hover:text-[#D4AF77]/80 transition-colors duration-500"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {service.price}
              </span>
            </div>
          </div>

          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(212,175,119,0.04) 0%, transparent 70%)",
            }}
          />
        </div>
      </button>
    </motion.div>
  );
}
