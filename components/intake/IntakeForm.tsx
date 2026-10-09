"use client";

import { useState } from "react";
import k from "@/components/studio/studio.module.css";
import { INTAKE_FIELDS } from "@/lib/intake";

type Values = Record<string, string | string[]>;

export default function IntakeForm({
  sessionId,
  pkg,
  prefill,
}: {
  sessionId: string;
  pkg: "website" | "social";
  prefill: { name: string; email: string; phone: string };
}) {
  const fields = INTAKE_FIELDS.filter((f) => !f.only || f.only === pkg);
  const [values, setValues] = useState<Values>({ name: prefill.name, email: prefill.email, phone: prefill.phone });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const set = (id: string, v: string | string[]) => setValues((p) => ({ ...p, [id]: v }));
  const toggle = (id: string, opt: string) => {
    const cur = (values[id] as string[]) ?? [];
    set(id, cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const missing = fields.filter((f) => f.required && !String(values[f.id] ?? "").trim()).map((f) => f.label);
    if (!String(values.name ?? "").trim() || !String(values.email ?? "").trim()) missing.unshift("Your Name and Email");
    if (missing.length) {
      setError(`Fill in: ${missing.join(", ")}.`);
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, values }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "That didn't send. Try again, or email flu.wop@gmail.com.");
      }
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't send. Try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col gap-3 py-4" role="status">
        <span className={k.eyebrow}>Received</span>
        <h2 className={k.panelHeading}>Thank You, {String(values.name).split(" ")[0]}.</h2>
        <p className={k.panelText}>I have everything I need to prepare. You&apos;ll hear from me within one business day to set the kickoff call.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <div className={k.grid2}>
        <label className={k.field} htmlFor="in-name">
          <span className={`${k.scribble} ${k.fieldLabel}`}>Your Name *</span>
          <input id="in-name" className={k.input} value={String(values.name ?? "")} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
        </label>
        <label className={k.field} htmlFor="in-email">
          <span className={`${k.scribble} ${k.fieldLabel}`}>Email *</span>
          <input id="in-email" type="email" className={k.input} value={String(values.email ?? "")} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
        </label>
      </div>
      <label className={k.field} htmlFor="in-phone">
        <span className={`${k.scribble} ${k.fieldLabel}`}>Phone</span>
        <input id="in-phone" type="tel" className={k.input} value={String(values.phone ?? "")} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
      </label>

      {fields.map((f) =>
        f.type === "checks" ? (
          <fieldset key={f.id} className={k.field} style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className={`${k.scribble} ${k.fieldLabel}`} style={{ marginBottom: 8 }}>
              {f.label}
            </legend>
            <div className={k.chips}>
              {f.options!.map((opt) => {
                const on = ((values[f.id] as string[]) ?? []).includes(opt);
                return (
                  <label key={opt} className={k.chip} style={{ cursor: "pointer", fontSize: 12, padding: "7px 10px", borderColor: on ? "var(--gold)" : undefined, color: on ? "var(--gold)" : undefined }}>
                    <input type="checkbox" checked={on} onChange={() => toggle(f.id, opt)} style={{ marginRight: 6, accentColor: "#d4af77" }} />
                    {opt}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ) : (
          <label key={f.id} className={k.field} htmlFor={`in-${f.id}`}>
            <span className={`${k.scribble} ${k.fieldLabel}`}>
              {f.label}
              {f.required ? " *" : ""}
            </span>
            {f.type === "textarea" ? (
              <textarea id={`in-${f.id}`} rows={3} className={k.input} style={{ resize: "vertical" }} placeholder={f.placeholder} value={String(values[f.id] ?? "")} onChange={(e) => set(f.id, e.target.value)} />
            ) : (
              <input id={`in-${f.id}`} type={f.type === "url" ? "url" : "text"} className={k.input} placeholder={f.placeholder} value={String(values[f.id] ?? "")} onChange={(e) => set(f.id, e.target.value)} />
            )}
          </label>
        )
      )}

      {status === "error" && (
        <p className="text-sm" style={{ color: "#E0846A", margin: 0 }} role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={status === "sending"} className={k.ctaSolid} style={{ justifyContent: "center", cursor: "pointer" }}>
        {status === "sending" ? "Sending…" : "Send Intake"}
      </button>
    </form>
  );
}
