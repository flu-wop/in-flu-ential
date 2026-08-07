// Client-only mock cart — no backend, no payment processing. State lives in
// localStorage so it survives a refresh, same pattern as the shared
// `mcs_cart` key used elsewhere in the ecosystem. This exists to demo an
// ordering experience; it never submits anywhere real.

export type CartLine = {
  id: string;
  name: string;
  price: number | null;
  image?: string;
  quantity: number;
};

export const CART_STORAGE_KEY = "ital_garden_cart";
export const CART_EVENT = "ital-garden-cart-updated";

function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function getCart(): CartLine[] {
  return readCart();
}

export function addToCart(item: { id: string; name: string; price: number | null; image?: string }) {
  const lines = readCart();
  const existing = lines.find((l) => l.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    lines.push({ ...item, quantity: 1 });
  }
  writeCart(lines);
}

export function setQuantity(id: string, quantity: number) {
  let lines = readCart();
  if (quantity <= 0) {
    lines = lines.filter((l) => l.id !== id);
  } else {
    const existing = lines.find((l) => l.id === id);
    if (existing) existing.quantity = quantity;
  }
  writeCart(lines);
}

export function removeFromCart(id: string) {
  writeCart(readCart().filter((l) => l.id !== id));
}

export function clearCart() {
  writeCart([]);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + (l.price ?? 0) * l.quantity, 0);
}

export function hasUnpricedLines(lines: CartLine[]): boolean {
  return lines.some((l) => l.price === null);
}
