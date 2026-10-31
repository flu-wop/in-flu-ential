// Prices live on the server. The client only ever sends a product ID.
export type ProductId = "website-deposit" | "social-deposit" | "starter-kit";

export const PRODUCTS: Record<ProductId, { name: string; description: string; cents: number; available: boolean }> = {
  "website-deposit": {
    name: "Website Build — 50% Deposit",
    description: "Deposit for a $6,000 website build. The $3,000 balance is due before launch.",
    cents: 300_000, // half of the $6,000 list price
    available: true,
  },
  "social-deposit": {
    name: "Social Media Marketing — 50% Deposit",
    description: "Deposit for the $10,000 social media marketing package, website included. The $5,000 balance is due before launch.",
    cents: 500_000, // half of the $10,000 list price
    available: true,
  },
  "starter-kit": {
    name: "Website Starter Kit",
    description: "Setup guide and template for launching your own site.",
    cents: 10_000, // $100, never discounted
    available: false, // flip to true once the kit exists and KIT_DOWNLOAD_URL is set in Vercel
  },
};

export const isProductId = (v: unknown): v is ProductId => typeof v === "string" && v in PRODUCTS;
