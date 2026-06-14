"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function CinematicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const navOpacity = useTransform(scrollY, [0, 120], [0, 1]);
  const navBlur = useTransform(scrollY, [0, 120], [0, 16]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 80));
    return unsub;
  }, [scrollY]);

  const navLinks = [
    { label: "Approach", href: "#approach" },
    { label: "Services", href: "#hallway" },
    { label: "The Vault", href: "#vault" },
    { label: "Contact", href: "/booking" },
  ];

  return (
    <>
      {/* Initial top nav — visible at top */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-16"
      >
        {/* Logo */}
        <Link href="/" className="group flex flex-col leading-none">
          <span
            className="font-display text-xl tracking-[0.25em] text-[#D4AF77] uppercase"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            IN-FLU-ENTIAL
          </span>
          <span
            className="text-[10px] tracking-[0.4em] text-[#A89880] uppercase mt-0.5"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            LLC
          </span>
        </Link>

        {/* Desktop links — only show when scrolled */}
        <motion.div
          style={{ opacity: navOpacity }}
          className="hidden md:flex items-center gap-8"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[11px] tracking-[0.3em] text-[#A89880] uppercase hover:text-[#D4AF77] transition-colors duration-300"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              {link.label}
            </a>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.a
          style={{ opacity: navOpacity, fontFamily: "DM Sans, sans-serif" }}
          href="/booking"
          className="hidden md:block text-[11px] tracking-[0.3em] text-[#080808] bg-[#D4AF77] px-6 py-2.5 uppercase hover:bg-[#E8C97A] transition-colors duration-300"
        >
          Engage
        </motion.a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-px bg-[#D4AF77]"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-px bg-[#D4AF77]"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-px bg-[#D4AF77]"
          />
        </button>
      </motion.nav>

      {/* Glassmorphic scrolled nav background */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-20 z-40 pointer-events-none"
        style={{
          opacity: navOpacity,
          background:
            "linear-gradient(to bottom, rgba(8,8,8,0.85) 0%, transparent 100%)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      />

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#080808]/95 backdrop-blur-xl md:hidden"
        style={{ pointerEvents: menuOpen ? "auto" : "none" }}
      >
        {navLinks.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={
              menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ delay: i * 0.08 }}
            className="block py-4 text-3xl tracking-[0.15em] text-[#F5EDD8] uppercase hover:text-[#D4AF77] transition-colors"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {link.label}
          </motion.a>
        ))}
        <motion.a
          href="/booking"
          onClick={() => setMenuOpen(false)}
          initial={{ opacity: 0 }}
          animate={menuOpen ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 px-10 py-3 border border-[#D4AF77] text-[#D4AF77] text-sm tracking-[0.3em] uppercase"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Engage
        </motion.a>
      </motion.div>
    </>
  );
}
