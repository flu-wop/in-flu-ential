"use client";

import { useEffect, useState } from "react";
import k from "@/components/studio/studio.module.css";

const SESSIONS = [
  "Website Build",
  "Campaign or Artist Rollout",
  "AI Tools for My Business",
  "Studio Session at Mid City Sound",
  "Starter Kit Help",
  "Not Sure Yet, Let's Talk",
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
    company: "", // honeypot, kept empty by real users
  });

  // Pre-select a session from the link (?service=Website%20build)
  useEffect(() => {
    const svc = new URLSearchParams(window.location.search).get("service");
    if (svc && SESSIONS.includes(svc)) setForm((f) => ({ ...f, label: svc }));
  }, []);

  const update = (key: string, v: string) => setForm((f) => ({ ...f, [key]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.project || !form.message) {
      setErrorMsg("Fill in your name, email, project and a short message, then send again.");
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
        throw new Error(data.error || "That didn't send. Try again, or email flu.wop@gmail.com.");
      }
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "That didn't send. Try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col gap-3 py-6" role="status">
        <span className={k.eyebrow}>Received</span>
        <h2 className={k.panelHeading}>Thank you, {form.name.split(" ")[0]}.</h2>
        <p className={k.panelText}>
          Your request for <strong style={{ color: "var(--gold)" }}>{form.label.toLowerCase()}</strong> is in. You&apos;ll
          hear back within one business day, from a person.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <div className={k.grid2}>
        <label className={k.field} htmlFor="bf-name">
          <span className={`${k.scribble} ${k.fieldLabel}`}>Name *</span>
          <input id="bf-name" className={k.input} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jordan Smith" autoComplete="name" />
        </label>
        <label className={k.field} htmlFor="bf-email">
          <span className={`${k.scribble} ${k.fieldLabel}`}>Email *</span>
          <input id="bf-email" type="email" className={k.input} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="jordan@studio.com" autoComplete="email" />
        </label>
      </div>
      <div className={k.grid2}>
        <label className={k.field} htmlFor="bf-session">
          <span className={`${k.scribble} ${k.fieldLabel}`}>What you need</span>
          <select id="bf-session" className={k.input} value={form.label} onChange={(e) => update("label", e.target.value)}>
            {SESSIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className={k.field} htmlFor="bf-timeline">
          <span className={`${k.scribble} ${k.fieldLabel}`}>Timeline</span>
          <select id="bf-timeline" className={k.input} value={form.timeline} onChange={(e) => update("timeline", e.target.value)}>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className={k.field} htmlFor="bf-project">
        <span className={`${k.scribble} ${k.fieldLabel}`}>Project *</span>
        <input id="bf-project" className={k.input} value={form.project} onChange={(e) => update("project", e.target.value)} placeholder="Booking site for my salon" />
      </label>
      <label className={k.field} htmlFor="bf-message">
        <span className={`${k.scribble} ${k.fieldLabel}`}>Tell me more *</span>
        <textarea id="bf-message" rows={5} className={k.input} style={{ resize: "vertical" }} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="What are you trying to build, and where are you now?" />
      </label>

      {/* Honeypot: off-screen and not tabbable */}
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, top: -9999, height: 0, width: 0, overflow: "hidden" }}>
        <label>
          Company (leave blank)
          <input tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => update("company", e.target.value)} />
        </label>
      </div>

      {status === "error" && (
        <p className="text-sm" style={{ color: "#E0846A", margin: 0 }} role="alert">
          {errorMsg}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className={k.ctaSolid} style={{ justifyContent: "center", cursor: "pointer" }}>
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
