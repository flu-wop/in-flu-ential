"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VaultGateProps {
  onUnlock: () => void;
}

export default function VaultGate({ onUnlock }: VaultGateProps) {
  const [mode, setMode] = useState<"password" | "request">("password");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error" | "requested">("idle");

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("checking");
    try {
      const res = await fetch("/api/vault-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onUnlock();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  async function handleRequestSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("checking");
    try {
      const res = await fetch("/api/booking-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: email,
          email,
          project: "Vault Access Request",
          timeline: "N/A",
          message: reason || "No reason provided.",
          label: "Vault Access Request",
        }),
      });
      if (res.ok) {
        setStatus("requested");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-6 bg-[#060606]">
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-16">
        <a href="/" className="flex flex-col leading-none group">
          <span
            className="font-display text-lg tracking-[0.25em] text-[#D4AF77]/70 uppercase group-hover:text-[#D4AF77] transition-colors"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            IN-FLU-ENTIAL
          </span>
          <span
            className="text-[9px] tracking-[0.4em] text-[#A89880]/40 uppercase mt-0.5"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            LLC
          </span>
        </a>
        <a
          href="/"
          className="text-[10px] tracking-[0.35em] text-[#A89880]/40 uppercase hover:text-[#D4AF77] transition-colors"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          ← Home
        </a>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-4 justify-center mb-8">
          <div className="h-px w-10 bg-[#D4AF77]/40" />
          <span
            className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Private Access
          </span>
          <div className="h-px w-10 bg-[#D4AF77]/40" />
        </div>

        <h1
          className="text-[clamp(2rem,5vw,3rem)] font-light text-[#F5EDD8] text-center leading-tight mb-3"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          The Vault
        </h1>
        <p
          className="text-[#A89880] text-sm text-center max-w-sm mx-auto mb-10"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Pitch decks, unreleased work, and private materials. Invitation only.
        </p>

        <AnimatePresence mode="wait">
          {mode === "password" ? (
            <motion.form
              key="password"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              onSubmit={handlePasswordSubmit}
              className="space-y-5"
            >
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Access code"
                autoFocus
                className="w-full bg-transparent border text-center text-[#F5EDD8] text-sm tracking-[0.2em] py-4 px-4 outline-none transition-colors"
                style={{
                  fontFamily: "DM Mono, monospace",
                  borderColor: status === "error" ? "rgba(220,90,70,0.5)" : "rgba(212,175,119,0.3)",
                }}
              />

              {status === "error" && (
                <p
                  className="text-center text-xs"
                  style={{ color: "#D85A46", fontFamily: "DM Sans, sans-serif" }}
                >
                  Incorrect access code.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "checking" || !password}
                className="w-full py-4 text-[11px] tracking-[0.35em] uppercase transition-colors disabled:opacity-40"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  border: "1px solid #D4AF77",
                  color: "#D4AF77",
                }}
              >
                {status === "checking" ? "Verifying…" : "Enter"}
              </button>

              <button
                type="button"
                onClick={() => setMode("request")}
                className="w-full text-center text-[10px] tracking-[0.3em] uppercase text-[#A89880]/60 hover:text-[#A89880] transition-colors pt-2"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Don&apos;t have a code? Request access
              </button>
            </motion.form>
          ) : status === "requested" ? (
            <motion.div
              key="requested"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p
                className="text-[#F5EDD8] text-sm mb-2"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Request received.
              </p>
              <p
                className="text-[#A89880]/70 text-xs"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                We&apos;ll follow up if access is granted.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="request"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              onSubmit={handleRequestSubmit}
              className="space-y-4"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full bg-transparent border text-center text-[#F5EDD8] text-sm py-4 px-4 outline-none"
                style={{ fontFamily: "DM Sans, sans-serif", borderColor: "rgba(212,175,119,0.3)" }}
              />
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="What are you looking for? (optional)"
                rows={3}
                className="w-full bg-transparent border text-center text-[#F5EDD8] text-sm py-4 px-4 outline-none resize-none"
                style={{ fontFamily: "DM Sans, sans-serif", borderColor: "rgba(212,175,119,0.3)" }}
              />

              {status === "error" && (
                <p
                  className="text-center text-xs"
                  style={{ color: "#D85A46", fontFamily: "DM Sans, sans-serif" }}
                >
                  Something went wrong. Try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "checking" || !email}
                className="w-full py-4 text-[11px] tracking-[0.35em] uppercase transition-colors disabled:opacity-40"
                style={{ fontFamily: "DM Sans, sans-serif", border: "1px solid #D4AF77", color: "#D4AF77" }}
              >
                {status === "checking" ? "Sending…" : "Request Access"}
              </button>

              <button
                type="button"
                onClick={() => setMode("password")}
                className="w-full text-center text-[10px] tracking-[0.3em] uppercase text-[#A89880]/60 hover:text-[#A89880] transition-colors pt-2"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Have a code? Enter it
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
