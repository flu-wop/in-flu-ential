// lib/insights/config.ts
// IN-FLU-ENTIAL's InsightsConfig. Sales come live from Stripe. This site has its
// own database and its own events table.
import Stripe from "stripe"
import type { DayRange, DayValue, InsightsConfig } from "./types"
import { localDay, addDays } from "./core"

const TZ = "America/Chicago"

type Paid = { date: string; cents: number }
const memo = new Map<string, { at: number; rows: Promise<Paid[]> }>()

function paidSessions(range: DayRange): Promise<Paid[]> {
  const key = `${range.start}:${range.end}`
  const hit = memo.get(key)
  if (hit && Date.now() - hit.at < 60_000) return hit.rows
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const gte = Math.floor(new Date(`${addDays(range.start, -1)}T00:00:00Z`).getTime() / 1000)
  const rows = stripe.checkout.sessions
    .list({ limit: 100, created: { gte } })
    .autoPagingToArray({ limit: 2000 })
    .then((all) =>
      all
        .filter((s) => s.payment_status === "paid")
        .map((s) => ({ date: localDay(new Date(s.created * 1000), TZ), cents: s.amount_total ?? 0 })),
    )
  memo.set(key, { at: Date.now(), rows })
  rows.catch(() => memo.delete(key))
  return rows
}

export const insightsConfig: InsightsConfig = {
  siteName: "IN-FLU-ENTIAL",
  eventsTable: "influential_site_events",
  timezone: TZ,
  eventTypes: ["page_view", "page_time", "checkout_click"],
  sources: [
    {
      key: "revenue",
      label: "Revenue",
      format: "money",
      fetch: async (r): Promise<DayValue[]> => (await paidSessions(r)).map((s) => ({ date: s.date, value: s.cents / 100 })),
    },
    {
      key: "sales",
      label: "Sales",
      format: "count",
      fetch: async (r): Promise<DayValue[]> => (await paidSessions(r)).map((s) => ({ date: s.date, value: 1 })),
    },
  ],
  funnels: [
    {
      label: "Buying a product",
      steps: [
        { label: "Visited the site", type: "page_view" },
        { label: "Opened Products", type: "page_view", path: "/products" },
        { label: "Started checkout", type: "checkout_click" },
      ],
    },
  ],
}
