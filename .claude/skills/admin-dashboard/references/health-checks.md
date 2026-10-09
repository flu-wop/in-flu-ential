# lib/health-checks.ts

Full implementation. Import the site's existing `getDb()` / Stripe / Resend lazy-init helpers from `lib/db.ts` etc. — don't create second clients.

```ts
import { getDb } from "@/lib/db";
import Stripe from "stripe";
import { Resend } from "resend";

export type CheckResult = { status: "ok" | "warn" | "error"; detail: string };

// ---- 1. Env Var Status ----
const REQUIRED_ENV_VARS = [
  "TURSO_DATABASE_URL",
  "TURSO_AUTH_TOKEN",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "RESEND_TO_EMAIL",
  "ADMIN_PASSWORD",
  "NEXT_PUBLIC_SITE_URL",
  // add site-specific ones here, e.g. "PRINTIFY_API_KEY", "PRINTIFY_SHOP_ID"
];

export function checkEnvVars(): Record<string, CheckResult> {
  const results: Record<string, CheckResult> = {};
  for (const key of REQUIRED_ENV_VARS) {
    const present = !!process.env[key];
    results[key] = {
      status: present ? "ok" : "error",
      detail: present ? "set" : "MISSING",
    };
  }
  return results;
}

// ---- 2. Webhook Health ----
export async function checkStripe(): Promise<CheckResult> {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const endpoints = await stripe.webhookEndpoints.list({ limit: 10 });
    const site = process.env.NEXT_PUBLIC_SITE_URL || "";
    const match = endpoints.data.find((e) => e.url.includes(site.replace(/^https?:\/\//, "")));
    if (!match) return { status: "warn", detail: "No webhook endpoint found for this site's URL" };
    if (match.status !== "enabled") return { status: "error", detail: `Endpoint status: ${match.status}` };
    return { status: "ok", detail: `Enabled, listening for: ${match.enabled_events.slice(0, 3).join(", ")}` };
  } catch (err) {
    return { status: "error", detail: `Stripe API error: ${(err as Error).message}` };
  }
}

export async function checkLastBookingWebhook(): Promise<CheckResult> {
  try {
    const db = getDb();
    const result = await db.execute("SELECT created_at FROM bookings ORDER BY created_at DESC LIMIT 1");
    if (result.rows.length === 0) return { status: "warn", detail: "No bookings yet" };
    const last = new Date(result.rows[0].created_at as string);
    const hoursAgo = (Date.now() - last.getTime()) / 3_600_000;
    if (hoursAgo > 24 * 14) return { status: "warn", detail: `Last booking ${Math.round(hoursAgo / 24)} days ago` };
    return { status: "ok", detail: `Last booking ${last.toLocaleString()}` };
  } catch (err) {
    return { status: "error", detail: `DB read failed: ${(err as Error).message}` };
  }
}

export async function checkResend(): Promise<CheckResult> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const domains = await resend.domains.list();
    const fromDomain = (process.env.RESEND_FROM_EMAIL || "").split("@")[1];
    const match = domains.data?.data?.find((d: any) => d.name === fromDomain);
    if (!fromDomain || fromDomain === "resend.dev") {
      return { status: "warn", detail: "Using resend.dev fallback — real domain not verified yet" };
    }
    if (!match) return { status: "error", detail: `Domain ${fromDomain} not found in Resend account` };
    if (match.status !== "verified") return { status: "error", detail: `Domain status: ${match.status}` };
    return { status: "ok", detail: `${fromDomain} verified` };
  } catch (err) {
    return { status: "error", detail: `Resend API error: ${(err as Error).message}` };
  }
}

export async function checkTurso(): Promise<CheckResult> {
  try {
    const db = getDb();
    await db.execute("SELECT 1");
    return { status: "ok", detail: "Connected" };
  } catch (err) {
    return { status: "error", detail: `Turso connection failed: ${(err as Error).message}` };
  }
}

// ---- 3. API Usage ----
export async function checkApiUsage(): Promise<CheckResult> {
  try {
    const db = getDb();
    // self-tracked fallback table — see schema below
    const result = await db.execute(
      "SELECT provider, COUNT(*) as count FROM api_calls WHERE created_at > datetime('now', '-30 days') GROUP BY provider"
    );
    const summary = result.rows.map((r) => `${r.provider}: ${r.count}`).join(", ") || "No calls logged yet";
    return { status: "ok", detail: summary };
  } catch (err) {
    return { status: "warn", detail: "api_calls table not set up yet — usage tracking inactive" };
  }
}

// api_calls schema (add to lib/db.ts init, same pattern as bookings table):
// CREATE TABLE IF NOT EXISTS api_calls (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   provider TEXT NOT NULL,         -- 'resend' | 'stripe' | 'printify'
//   created_at TEXT DEFAULT CURRENT_TIMESTAMP
// );
// Call `db.execute("INSERT INTO api_calls (provider) VALUES (?)", [provider])`
// right after any outbound Resend/Printify call — fire-and-forget, don't await-block the real request on it.

// ---- 4. Product Sync (Printify sites only) ----
export async function checkProductSync(): Promise<CheckResult & { drifted?: string[] }> {
  try {
    const db = getDb();
    const local = await db.execute("SELECT id, name, image_url, printify_id FROM products");
    // Printify lists products per shop, paginated (limit max 50)
    const shop = process.env.PRINTIFY_SHOP_ID;
    const remote: any[] = [];
    for (let page = 1; page <= 20; page++) {
      const res = await fetch(
        `https://api.printify.com/v1/shops/${shop}/products.json?limit=50&page=${page}`,
        { headers: { Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}` } }
      );
      if (!res.ok) return { status: "error", detail: `Printify API error: ${res.status}` };
      const body = await res.json();
      remote.push(...body.data);
      if (!body.next_page_url) break;
    }

    const drifted: string[] = [];
    for (const row of local.rows) {
      const match = remote.find((p: any) => String(p.id) === String(row.printify_id));
      if (!match) { drifted.push(`${row.name}: missing from Printify`); continue; }
      if (!row.image_url) { drifted.push(`${row.name}: no image set`); continue; }
    }
    if (drifted.length === 0) return { status: "ok", detail: `${local.rows.length} products in sync` };
    return { status: "warn", detail: `${drifted.length} product(s) need attention`, drifted };
  } catch (err) {
    return { status: "error", detail: `Sync check failed: ${(err as Error).message}` };
  }
}
```
