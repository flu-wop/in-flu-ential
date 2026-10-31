"use client";

import { useCallback, useEffect, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import type { ProductId } from "@/lib/products";
import s from "./checkout.module.css";
import { beacon } from "@/lib/beacon";
import k from "@/components/studio/studio.module.css";

let stripePromise: Promise<Stripe | null> | null = null;
const getStripeJs = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return null;
  stripePromise ??= loadStripe(key);
  return stripePromise;
};

// Opens Stripe's embedded checkout in a panel on the page, so the visitor
// never leaves the site.
export default function CheckoutButton({ product, label, title, solid }: { product: ProductId; label: string; title: string; solid?: boolean }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  // Deposits ask for an optional promo code first; the kit goes straight to payment.
  const asksCode = product !== "starter-kit";
  const [stage, setStage] = useState<"code" | "pay">(asksCode ? "code" : "pay");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const fetchClientSecret = useCallback(async () => {
    beacon("checkout_click");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, code: code.trim() || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.clientSecret) {
      setError(data.error || "Checkout couldn't start. Try again, or email flu.wop@gmail.com.");
      throw new Error("checkout");
    }
    return data.clientSecret as string;
  }, [product, code]);

  const stripe = getStripeJs();

  return (
    <>
      <button type="button" className={solid ? k.ctaSolid : k.cta} onClick={() => { setError(""); setStage(asksCode ? "code" : "pay"); setOpen(true); }} style={{ cursor: "pointer" }}>
        {label} <span aria-hidden="true">→</span>
      </button>
      {open && (
        <div className={s.overlay} role="dialog" aria-modal="true" aria-label={`Checkout: ${title}`} onClick={() => setOpen(false)}>
          <div className={s.panel} onClick={(e) => e.stopPropagation()}>
            <div className={s.bar}>
              <span>Checkout · {title}</span>
              <button type="button" className={s.close} onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <div className={s.body}>
              {error ? (
                <>
                  <p className={s.error} role="alert">{error}</p>
                  {asksCode && (
                    <button type="button" className={k.cta} style={{ cursor: "pointer", marginTop: 16 }} onClick={() => { setError(""); setStage("code"); }}>
                      Back
                    </button>
                  )}
                </>
              ) : stage === "code" ? (
                <form
                  onSubmit={(e) => { e.preventDefault(); setStage("pay"); }}
                  style={{ display: "grid", gap: 14, maxWidth: 360, padding: "8px 0" }}
                >
                  <label style={{ fontFamily: "DM Mono, monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase" }} htmlFor="promo">
                    Promo Code (Optional)
                  </label>
                  <input
                    id="promo"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    style={{ padding: "12px 14px", background: "#0d0d0a", border: "1px solid rgba(212,175,119,0.3)", color: "#F5EDD8", fontSize: 16 }}
                  />
                  <button type="submit" className={k.ctaSolid} style={{ cursor: "pointer" }}>
                    Continue to Payment <span aria-hidden="true">→</span>
                  </button>
                </form>
              ) : stripe ? (
                <EmbeddedCheckoutProvider key={code} stripe={stripe} options={{ fetchClientSecret }}>
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              ) : (
                <p className={s.error}>Checkout isn&apos;t connected yet. Email flu.wop@gmail.com to get started.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
