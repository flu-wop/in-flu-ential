import Stripe from "stripe";

let client: Stripe | null = null;

// Server only. Returns null when STRIPE_SECRET_KEY isn't set, so pages can
// fall back to the inquiry form instead of erroring.
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key);
  return client;
}

export const stripeReady = () => Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
