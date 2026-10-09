// Prices live on the server. The client only ever sends a product ID.
export type ProductId = "website-deposit" | "social-deposit" | "starter-kit";

export const PRODUCTS: Record<ProductId, { name: string; description: string; cents: number; available: boolean }> = {
  "website-deposit": {
    name: "Website build — 50% deposit",
    description: "Deposit for a $3,000 website build. The $1,500 balance is due before launch.",
    cents: 150_000,
    available: true,
  },
  "social-deposit": {
    name: "Social media marketing — 50% deposit",
    description: "Deposit for the $5,000 social media marketing package, website included. The $2,500 balance is due before launch.",
    cents: 250_000,
    available: true,
  },
  "starter-kit": {
    name: "Website starter kit",
    description: "Setup guide and template for launching your own site.",
    cents: 5_000,
    available: false, // flip to true once the new kit and its download are ready
  },
};

export const isProductId = (v: unknown): v is ProductId => typeof v === "string" && v in PRODUCTS;
