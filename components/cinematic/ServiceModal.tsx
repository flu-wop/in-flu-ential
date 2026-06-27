"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export interface ServiceData {
  id: string;
  number: string;
  label: string;
  headline: string;
  description: string;
  deliverables: string[];
  price: string;
  cta: string;
}

interface ServiceModalProps {
  service: ServiceData | null;
  onClose: () => void;
}

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  useEffect(() => {
    if (service) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [service]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {service && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#080808]/85 backdrop-blur-md cursor-pointer"
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl top-1/2 -translate-y-1/2 z-50"
          >
            <div
              className="relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #111111 0%, #0d0d0d 100%)",
                border: "1px solid rgba(212,175,119,0.2)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(212,175,119,0.1)",
              }}
            >
              {/* Gold top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: "linear-gradient(to right, transparent, #D4AF77 30%, #D4AF77 70%, transparent)",
                }}
              />

              {/* Corner ornament */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#D4AF77]/30" />
              <div className="absolute top-4 right-12 w-6 h-6 border-t border-r border-[#D4AF77]/30" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#D4AF77]/30" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#D4AF77]/30" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#A89880] hover:text-[#D4AF77] transition-colors z-10"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>

              <div className="p-8 md:p-10">
                {/* Header */}
                <div className="mb-7">
                  <span
                    className="text-[10px] tracking-[0.45em] text-[#D4AF77]/60 uppercase mb-3 block"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    {service.number} — {service.label}
                  </span>
                  <h3
                    className="text-[clamp(1.8rem,5vw,2.6rem)] font-light text-[#F5EDD8] leading-tight mb-3"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                    dangerouslySetInnerHTML={{ __html: service.headline }}
                  />
                  <p
                    className="text-[#A89880] text-sm leading-relaxed"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    {service.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#D4AF77]/10 mb-7" />

                {/* Deliverables */}
                <div className="mb-8">
                  <span
                    className="text-[9px] tracking-[0.4em] text-[#D4AF77]/50 uppercase mb-4 block"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    What&apos;s Included
                  </span>
                  <ul className="space-y-2.5">
                    {service.deliverables.map((d, i) => (
                      <motion.li
                        key={d}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.06 }}
                        className="flex items-start gap-3 text-sm text-[#A89880]"
                        style={{ fontFamily: "DM Sans, sans-serif" }}
                      >
                        <span className="text-[#D4AF77] mt-0.5 shrink-0">◆</span>
                        {d}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <span
                      className="text-[9px] tracking-[0.4em] text-[#A89880]/50 uppercase block mb-1"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      Investment
                    </span>
                    <span
                      className="text-2xl text-[#D4AF77] font-light"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {service.price}
                    </span>
                  </div>
                  <a
                    href={`/booking?service=${encodeURIComponent(service.label)}`}
                    className="flex-1 text-center py-3.5 bg-[#D4AF77] text-[#080808] text-[11px] tracking-[0.35em] uppercase hover:bg-[#E8C97A] transition-colors"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    {service.cta}
                  </a>
                </div>

                <p
                  className="text-[10px] text-[#A89880]/40 mt-3 text-center"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  Reply within one business day — always a human.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
