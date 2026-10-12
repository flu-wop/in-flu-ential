import { getStripe } from "@/lib/stripe";
import { SITE_URL } from "@/lib/site-url";

export type Status = "ok" | "warn" | "fail";
export interface Check {
  label: string;
  status: Status;
  detail: string;
}

/** Every env var this site reads. required = site is degraded without it. */
export const REQUIRED_VARS: { group: string; name: string; required: boolean; note?: string }[] = [
  { group: "Site", name: "NEXT_PUBLIC_SITE_URL", required: false, note: "Falls back to the Vercel production URL" },
  { group: "Admin", name: "ADMIN_PASSWORD", required: true },
  { group: "Vault", name: "VAULT_PASSWORD", required: true },
  { group: "Stripe", name: "STRIPE_SECRET_KEY", required: true },
  { group: "Stripe", name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", required: true },
  { group: "Stripe", name: "STRIPE_WEBHOOK_SECRET", required: true },
  { group: "Resend", name: "RESEND_API_KEY", required: true },
  { group: "Resend", name: "RESEND_FROM_EMAIL", required: true, note: "Must be on a verified Resend domain" },
  { group: "Resend", name: "BOOKING_TO_EMAIL", required: false, note: "Where booking and intake emails go" },
  { group: "Downloads", name: "KIT_DOWNLOAD_URL", required: false },
];

export function checkEnvVars() {
  return REQUIRED_VARS.map((v) => ({ ...v, set: Boolean(process.env[v.name]) }));
}

const safe = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 160);

export async function checkStripe(): Promise<Check[]> {
  const stripe = getStripe();
  if (!stripe) return [{ label: "Stripe API", status: "fail", detail: "STRIPE_SECRET_KEY is not set" }];
  const out: Check[] = [];
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  try {
    await stripe.balance.retrieve();
    out.push({
      label: "Stripe API",
      status: key.startsWith("sk_live") || key.startsWith("rk_live") ? "ok" : "warn",
      detail: key.includes("_live") ? "Connected (live mode)" : "Connected, but in TEST mode",
    });
  } catch (e) {
    return [{ label: "Stripe API", status: "fail", detail: safe(e) }];
  }
  try {
    const base = SITE_URL.replace(/\/$/, "");
    const eps = await stripe.webhookEndpoints.list({ limit: 100 });
    const mine = eps.data.find((w) => w.url.replace(/\/$/, "") === `${base}/api/stripe-webhook`);
    if (!mine) {
      out.push({ label: "Stripe webhook", status: "fail", detail: `No endpoint for ${base}/api/stripe-webhook` });
    } else if (mine.status !== "enabled") {
      out.push({ label: "Stripe webhook", status: "fail", detail: `Endpoint is ${mine.status}` });
    } else if (!mine.enabled_events.includes("checkout.session.completed") && !mine.enabled_events.includes("*")) {
      out.push({ label: "Stripe webhook", status: "fail", detail: "Missing checkout.session.completed event" });
    } else {
      out.push({ label: "Stripe webhook", status: "ok", detail: "Enabled and listening for checkout.session.completed" });
    }
  } catch (e) {
    out.push({ label: "Stripe webhook", status: "warn", detail: `Couldn't read endpoints: ${safe(e)}` });
  }
  return out;
}

export async function checkLastSale(): Promise<Check> {
  const stripe = getStripe();
  if (!stripe) return { label: "Last product sale", status: "warn", detail: "Stripe not configured" };
  try {
    const list = await stripe.checkout.sessions.list({ limit: 50 });
    const paid = list.data.find((s) => s.payment_status === "paid" && Boolean(s.metadata?.product));
    if (!paid) return { label: "Last product sale", status: "ok", detail: "No paid sales yet" };
    const when = new Date(paid.created * 1000).toLocaleString("en-US", { timeZone: "America/Chicago" });
    return { label: "Last product sale", status: "ok", detail: `${when} (Central)` };
  } catch (e) {
    return { label: "Last product sale", status: "warn", detail: safe(e) };
  }
}

export async function checkResend(): Promise<Check[]> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return [{ label: "Resend API", status: "fail", detail: "RESEND_API_KEY is not set" }];
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) {
      // Send-only keys can't list domains; the key itself is still valid.
      return [{ label: "Resend API", status: "warn", detail: "Key is send-only, so domain status can't be read. Check the Resend dashboard." }];
    }
    if (!res.ok) return [{ label: "Resend API", status: "fail", detail: `Resend returned ${res.status}` }];
    const body = (await res.json()) as { data?: { name: string; status: string }[] };
    const out: Check[] = [{ label: "Resend API", status: "ok", detail: "Key works" }];
    const from = process.env.RESEND_FROM_EMAIL ?? "";
    const m = from.match(/@([^>\s]+)/);
    if (!m) {
      out.push({ label: "Resend sender domain", status: "fail", detail: "RESEND_FROM_EMAIL is not set (falls back to onboarding@resend.dev, which only delivers to the account owner)" });
    } else {
      const d = body.data?.find((x) => x.name === m[1].toLowerCase());
      out.push(
        !d
          ? { label: "Resend sender domain", status: "fail", detail: `${m[1]} isn't added in Resend` }
          : d.status === "verified"
            ? { label: "Resend sender domain", status: "ok", detail: `${m[1]} is verified` }
            : { label: "Resend sender domain", status: "fail", detail: `${m[1]} status: ${d.status}. Finish DNS verification in Resend.` }
      );
    }
    return out;
  } catch (e) {
    return [{ label: "Resend API", status: "fail", detail: safe(e) }];
  }
}
