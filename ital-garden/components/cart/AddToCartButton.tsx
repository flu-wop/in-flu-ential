"use client";

import { addToCart, setQuantity } from "@/lib/cart";
import { useCart } from "@/lib/useCart";

export function AddToCartButton({
  id,
  name,
  price,
  image,
}: {
  id: string;
  name: string;
  price: number | null;
  image?: string;
}) {
  const { cart, ready } = useCart();
  const line = cart.find((l) => l.id === id);
  const quantity = line?.quantity ?? 0;

  if (!ready) {
    return <div className="h-9 w-28 shrink-0 rounded-full bg-border/40" />;
  }

  if (quantity === 0) {
    return (
      <button
        onClick={() => addToCart({ id, name, price, image })}
        className="shrink-0 rounded-full border border-gold/40 px-4 py-2 font-mono text-xs uppercase tracking-widest text-gold transition hover:border-gold hover:bg-gold/10"
      >
        Add to Cart
      </button>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-3 rounded-full border border-gold/40 bg-gold/10 px-1 py-1">
      <button
        aria-label={`Remove one ${name}`}
        onClick={() => setQuantity(id, quantity - 1)}
        className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-gold hover:bg-gold/20"
      >
        −
      </button>
      <span className="min-w-[1.25rem] text-center font-mono text-sm text-cream">{quantity}</span>
      <button
        aria-label={`Add one more ${name}`}
        onClick={() => setQuantity(id, quantity + 1)}
        className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-gold hover:bg-gold/20"
      >
        +
      </button>
    </div>
  );
}
