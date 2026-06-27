"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SESSIONS = [
  "Creative Direction",
  "Social & Growth Strategy",
  "Music & Artist Marketing",
  "Brand Development",
  "Media & Production",
  "Executive Strategy",
  "Not sure yet — let's talk",
];

const TIMELINES = ["Immediately", "Within 30 days", "1–3 months", "Just exploring"];

type Status = "idle" | "sending" | "sent" | "error";

export default function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    label: SESSIONS[0],
    project: "",
    timeline: TIMELINES[1],
    message: "",
    company: "", // honeypot — kept empty by real users
  });

  // Pre-select the session if linked from a service modal (?service=Brand%20Development)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const svc = params.get("service");
    if (svc && SESSIONS.includes(svc)) {
      setForm((f) => ({ ...f, label: svc }));
    }
  }, []);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    if (!form.name || !form.email || !form.project || !form.message) {
      setErrorMsg("Please fill in your name, email, project, and a short message.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/booking-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const fieldClass =
    "w-full bg-[#0d0d0d] border border-[#D4AF77]/15 px-4 py-3 text-[#F5EDD8] text-sm placeholder:text-[#A89880]/40 focus:border-[#D4AF77]/50 focus:outline-none transition-colors";
  const labelClass =
    "block text-[9px] tracking-[0.4em] text-[#D4AF77]/60 uppercase mb-2.5";
  const sansStyle = { fontFamily: "DM Sans, sans-serif" } as const;
  const serifStyle = { fontFamily: "Cormorant Garamond, serif" } as const;

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-20"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12 bg-[#D4AF77]/50" />
          <span className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase" style={sansStyle}>
            Received
          </span>
          <div className="h-px w-12 bg-[#D4AF77]/50" />
        </div>
        <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-light text-[#F5EDD8] mb-4" style={serifStyle}>
          Thank you, {form.name.split(" ")[0]}.
        </h2>
        <p className="text-[#A89880] text-sm max-w-md mx-auto leading-relaxed" style={sansStyle}>
          Your request for a <span className="text-[#D4AF77]">{form.label}</span> session is in.
          You&apos;ll hear back within one business day — always from a human.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-10 bg-[#D4AF77]/50" />
          <span className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase" style={sansStyle}>
            Book a Consultation
          </span>
          <div className="h-px w-10 bg-[#D4AF77]/50" />
        </div>
        <h1 className="text-[clamp(2.4rem,6vw,4rem)] font-light text-[#F5EDD8] leading-tight mb-4" style={serifStyle}>
          Let&apos;s build something
          <br />
          <em className="text-[#D4AF77]">that lasts</em>
        </h1>
        <p className="text-[#A89880] text-sm leading-relaxed max-w-md mx-auto" style={sansStyle}>
          Tell us what you&apos;re working on. Every inquiry gets a personal reply within one business day.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass} style={sansStyle}>Name</label>
            <input
              className={fieldClass}
              style={sansStyle}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className={labelClass} style={sansStyle}>Email</label>
            <input
              type="email"
              className={fieldClass}
              style={sansStyle}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@email.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass} style={sansStyle}>Session</label>
            <select
              className={fieldClass + " appearance-none cursor-pointer"}
              style={sansStyle}
              value={form.label}
              onChange={(e) => update("label", e.target.value)}
            >
              {SESSIONS.map((s) => (
                <option key={s} value={s} className="bg-[#0d0d0d]">{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} style={sansStyle}>Timeline</label>
            <select
              className={fieldClass + " appearance-none cursor-pointer"}
              style={sansStyle}
              value={form.timeline}
              onChange={(e) => update("timeline", e.target.value)}
            >
              {TIMELINES.map((t) => (
                <option key={t} value={t} className="bg-[#0d0d0d]">{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass} style={sansStyle}>Project</label>
          <input
            className={fieldClass}
            style={sansStyle}
            value={form.project}
            onChange={(e) => update("project", e.target.value)}
            placeholder="e.g. Artist rollout, brand identity, studio session"
          />
        </div>

        <div>
          <label className={labelClass} style={sansStyle}>Tell us more</label>
          <textarea
            rows={5}
            className={fieldClass + " resize-none"}
            style={sansStyle}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="What are you trying to build, and where are you now?"
          />
        </div>

        {/* Honeypot — visually hidden, off-screen, not tabbable */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
          <label>
            Company (leave blank)
            <input
              tabIndex={-1}
              autoComplete="off"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </label>
        </div>

        {status === "error" && (
          <p className="text-sm text-[#E0846A]" style={sansStyle}>{errorMsg}</p>
        )}

        <button
          onClick={submit}
          disabled={status === "sending"}
          className="w-full py-4 bg-[#D4AF77] text-[#080808] text-[11px] tracking-[0.4em] uppercase hover:bg-[#E8C97A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={sansStyle}
        >
          {status === "sending" ? "Sending…" : "Send Request"}
        </button>

        <p className="text-[10px] text-[#A89880]/40 text-center" style={sansStyle}>
          Reply within one business day — always a human.
        </p>
      </div>
    </div>
  );
}
