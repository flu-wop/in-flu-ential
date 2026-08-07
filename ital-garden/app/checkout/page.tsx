"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Section, Eyebrow, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/useCart";
import { cartSubtotal, clearCart, hasUnpricedLines } from "@/lib/cart";
import { CONTACT, SITE } from "@/lib/site-config";

const PICKUP_DAYS = ["Wednesday", "Thursday", "Friday"];
const PICKUP_TIMES = ["11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM"];

function randomOrderNumber() {
  return `IG-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function CheckoutPage() {
  const { cart, ready } = useCart();
  const subtotal = cartSubtotal(cart);
  const unpriced = hasUnpricedLines(cart);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [day, setDay] = useState(PICKUP_DAYS[0]);
  const [time, setTime] = useState(PICKUP_TIMES[0]);
  const [confirmed, setConfirmed] = useState<{ orderNumber: string; name: string; day: string; time: string } | null>(null);

  const canSubmit = name.trim().length > 0 && phone.trim().length > 0 && cart.length > 0;

  const orderNumber = useMemo(() => randomOrderNumber(), []);

  function placeOrder() {
    if (!canSubmit) return;
    setConfirmed({ orderNumber, name, day, time });
    clearCart();
  }

  if (confirmed) {
    return (
      <Section className="flex min-h-[70vh] flex-col items-center justify-center pt-16 text-center md:pt-20">
        <Eyebrow>Preview Experience</Eyebrow>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-gold" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <SectionHeading>
          Thanks, <span className="italic text-gold">{confirmed.name.split(" ")[0]}</span>.
        </SectionHeading>
        <p className="mt-4 font-mono text-sm text-turmeric">Order #{confirmed.orderNumber}</p>
        <p className="mx-auto mt-4 max-w-sm font-body text-mist">
          Pickup {confirmed.day}, {confirmed.time} at {CONTACT.addressLine1}. Chef Ra&rsquo;s team will have it
          ready and waiting.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/menu" variant="outline">
            Back to Menu
          </Button>
          <Button href="/">Home</Button>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-16 md:pt-20">
      <Eyebrow>Preview Experience</Eyebrow>
      <SectionHeading>
        Your <span className="italic text-gold">Order</span>
      </SectionHeading>

      <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          {!ready ? null : cart.length === 0 ? (
            <p className="font-body text-mist">
              Your cart is empty.{" "}
              <Link href="/menu" className="text-gold hover:text-gold-light">
                Browse the menu
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-5">
              {cart.map((line) => (
                <li key={line.id} className="flex items-center gap-4 border-b border-border/60 pb-5">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-dark">
                    {line.image && <Image src={line.image} alt={line.name} fill sizes="64px" className="object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-sm text-cream">{line.name}</p>
                    <p className="font-mono text-xs text-mist">Qty {line.quantity}</p>
                  </div>
                  <p className="font-mono text-sm text-turmeric">
                    {line.price !== null ? `$${(line.price * line.quantity).toFixed(2)}` : "TBD"}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {cart.length > 0 && (
            <div className="mt-6 flex items-baseline justify-between font-body text-base text-cream">
              <span>Subtotal</span>
              <span className="font-mono text-xl text-gold">${subtotal.toFixed(2)}</span>
            </div>
          )}
          {unpriced && cart.length > 0 && (
            <p className="mt-1 font-mono text-[11px] text-mist">
              Some items are priced &ldquo;TBD&rdquo; and aren&rsquo;t counted above.
            </p>
          )}
        </div>

        {cart.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="mb-5 font-display text-xl text-cream">Pickup Details</p>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-turmeric">Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-dark px-3 py-2.5 font-body text-sm text-cream outline-none focus:border-gold/60"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-turmeric">Phone</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-border bg-dark px-3 py-2.5 font-body text-sm text-cream outline-none focus:border-gold/60"
                  placeholder="(504) 555-0100"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-turmeric">Day</span>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full rounded-lg border border-border bg-dark px-3 py-2.5 font-body text-sm text-cream outline-none focus:border-gold/60"
                  >
                    {PICKUP_DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-turmeric">Time</span>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-lg border border-border bg-dark px-3 py-2.5 font-body text-sm text-cream outline-none focus:border-gold/60"
                  >
                    {PICKUP_TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={!canSubmit}
              className="mt-6 w-full rounded-full bg-gold-gradient px-6 py-3 font-body text-sm font-medium text-studio-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Place Order
            </button>
            <p className="mt-3 text-center font-mono text-[11px] text-mist">
              Preview experience for {SITE.name} — no payment is collected here.
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
