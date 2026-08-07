"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/useCart";
import { cartCount, cartSubtotal, hasUnpricedLines, removeFromCart, setQuantity } from "@/lib/cart";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { cart } = useCart();
  const count = cartCount(cart);
  const subtotal = cartSubtotal(cart);
  const unpriced = hasUnpricedLines(cart);

  return (
    <>
      <button
        aria-label="Open cart"
        onClick={() => setOpen(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-cream/85 transition hover:text-gold"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="9" cy="20" r="1.4" />
          <circle cx="18" cy="20" r="1.4" />
          <path d="M2.5 3h2.2l2.1 12.2a1.8 1.8 0 0 0 1.8 1.5h8.8a1.8 1.8 0 0 0 1.77-1.47l1.33-7.53H6.1" />
        </svg>
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-gradient px-1 font-mono text-[10px] font-medium text-studio-black">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <button
            aria-label="Close cart"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-studio-black/70 backdrop-blur-sm"
          />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-border bg-charcoal">
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
              <p className="font-display text-xl text-cream">Your Cart</p>
              <button
                aria-label="Close cart"
                onClick={() => setOpen(false)}
                className="font-mono text-xs uppercase tracking-widest text-mist hover:text-gold"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cart.length === 0 ? (
                <p className="mt-10 text-center font-body text-sm text-mist">Your cart is empty.</p>
              ) : (
                <ul className="space-y-5">
                  {cart.map((line) => (
                    <li key={line.id} className="flex gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-dark">
                        {line.image && <Image src={line.image} alt={line.name} fill sizes="64px" className="object-cover" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-body text-sm text-cream">{line.name}</p>
                          <button
                            aria-label={`Remove ${line.name}`}
                            onClick={() => removeFromCart(line.id)}
                            className="font-mono text-[11px] text-mist hover:text-pepper"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="mt-1 font-mono text-xs text-turmeric">
                          {line.price !== null ? `$${line.price.toFixed(2)}` : "Price TBD"}
                        </p>
                        <div className="mt-2 flex items-center gap-3 rounded-full border border-border w-fit px-1 py-1">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => setQuantity(line.id, line.quantity - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full font-mono text-cream/80 hover:bg-gold/10"
                          >
                            −
                          </button>
                          <span className="min-w-[1rem] text-center font-mono text-xs text-cream">{line.quantity}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => setQuantity(line.id, line.quantity + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full font-mono text-cream/80 hover:bg-gold/10"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-border/60 px-6 py-5">
                <div className="flex items-baseline justify-between font-body text-sm text-cream/90">
                  <span>Subtotal</span>
                  <span className="font-mono text-base text-gold">${subtotal.toFixed(2)}</span>
                </div>
                {unpriced && (
                  <p className="mt-1.5 font-mono text-[11px] text-mist">
                    Some items are priced &ldquo;TBD&rdquo; and aren&rsquo;t counted above — final pricing at checkout.
                  </p>
                )}
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="mt-4 block rounded-full bg-gold-gradient px-6 py-3 text-center font-body text-sm font-medium text-studio-black transition hover:brightness-110"
                >
                  Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
