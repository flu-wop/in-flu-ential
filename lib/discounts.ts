// Promo codes. They live ONLY in the server environment variable DISCOUNT_CODES
// (never in this public repo), as comma-separated CODE:PERCENT pairs, for example
//   DISCOUNT_CODES=AAA111:50,BBB222:50
// To retire a code, delete it from the variable and redeploy.
// A code applies to the website and social media deposits. It never applies to
// the starter kit.
import type { ProductId } from "@/lib/products";

const DISCOUNTABLE: ProductId[] = ["website-deposit", "social-deposit"];

export function resolveCode(raw: unknown, product: ProductId): { code: string; percent: number } | null {
  if (typeof raw !== "string" || !DISCOUNTABLE.includes(product)) return null;
  const code = raw.trim().toUpperCase();
  if (!code || code.length > 40) return null;
  for (const pair of (process.env.DISCOUNT_CODES ?? "").split(",")) {
    const [c, pct] = pair.split(":").map((x) => x.trim());
    const percent = Number(pct);
    if (c && c.toUpperCase() === code && Number.isFinite(percent) && percent > 0 && percent <= 90) {
      return { code, percent };
    }
  }
  return null;
}
