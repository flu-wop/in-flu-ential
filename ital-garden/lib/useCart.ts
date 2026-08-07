"use client";

import { useEffect, useState, useCallback } from "react";
import { CART_EVENT, CartLine, getCart } from "@/lib/cart";

/** Reactive read of the cart, kept in sync across components/tabs. No Context needed — every caller just listens for the same event. */
export function useCart() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => setCart(getCart()), []);

  useEffect(() => {
    sync();
    setReady(true);
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  return { cart, ready };
}
