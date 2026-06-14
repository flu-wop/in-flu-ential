"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const LINKS = {
  Services: [
    { label: "Creative Direction", href: "#hallway" },
    { label: "Social & Growth", href: "#hallway" },
    { label: "Music Marketing", href: "#hallway" },
    { label: "Brand Development", href: "#hallway" },
    { label: "Executive Strategy", href: "#vault" },
  ],
  Navigate: [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Music", href: "/music" },
    { label: "Business", href: "/business" },
    { label: "The Vault", href: "/vault" },
  ],
  Contact: [
    { label: "Book a Call", href: "/booking" },
    { label: "Mid City Sound", href: "https://midcitysound.com" },
    { label: "Flu-Haul", href: "https://fluhaul.com" },
    { label: "flu.wop@gmail.com", href: "mailto:flu.wop@gmail.com" },
  ],
};

const SOCIALS = [
  { label: "X", href: "https://x.com/its_FluWop" },
  { label: "IG", href: "#" },
  { label: "TK", href: "#" },
];

export default function CinematicFooter() {
  return (
    <footer className="relative bg-[#080808] border-t border-[#D4AF77]/10">
      {/* Gold accent top */}
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(to right, transparent, rgba(212,175,119,0.25) 30%, rgba(212,175,119,0.25) 70%, transparent)",
        }}
      />

      <div className="px-8 md:px-16 lg:px-24 py-20">
        {/* Top block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <span
              className="block text-[clamp(2.5rem,8vw,5rem)] font-light leading-none text-[#F5EDD8] tracking-[0.06em]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              IN-FLU-ENTIAL
            </span>
            <span
              className="block text-[10px] tracking-[0.45em] text-[#A89880] mt-2 uppercase"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              LLC · New Orleans
            </span>
            {/* Signature line */}
            <p
              className="mt-4 text-xs text-[#A89880]/40 italic max-w-xs"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              The house where influence is made.
            </p>
          </motion.div>

          {/* CTA block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.9 }}
            className="flex flex-col items-start md:items-end gap-4"
          >
            <a
              href="/booking"
              className="inline-block px-10 py-4 text-[11px] tracking-[0.4em] uppercase text-[#080808] bg-[#D4AF77] hover:bg-[#E8C97A] transition-colors duration-300"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Start a Conversation
            </a>
            <p
              className="text-[10px] text-[#A89880]/40 tracking-[0.2em]"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Always a human. Never a template.
            </p>
          </motion.div>
        </div>

        {/* Links grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-16"
        >
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <span
                className="text-[9px] tracking-[0.4em] text-[#D4AF77]/50 uppercase block mb-5"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {category}
              </span>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-[#A89880]/60 hover:text-[#D4AF77] transition-colors duration-300"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pt-8 border-t border-[#D4AF77]/8"
        >
          <span
            className="text-[10px] text-[#A89880]/30 tracking-[0.2em]"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            © {new Date().getFullYear()} IN-FLU-ENTIAL LLC. All Rights Reserved.
          </span>

          <div className="flex items-center gap-6">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-[10px] tracking-[0.3em] text-[#A89880]/40 hover:text-[#D4AF77] transition-colors duration-300 uppercase"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
