// Admin home — last 30 days, what needs attention, recent sales and shortcuts.
// Same layout as the other sites' admin home. Signed-out visitors see the login.
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { isAdmin } from "@/lib/admin-auth"
import { getDB } from "@/lib/db"
import { getStripe } from "@/lib/stripe"
import { checkEnvVars } from "@/lib/health-checks"
import { getInsights } from "@/lib/insights/core"
import { insightsConfig } from "@/lib/insights/config"
import type { Insights } from "@/lib/insights/types"
import { AdminPage, adminBtn } from "@/components/admin/page-frame"
import { ADMIN_SECTIONS } from "@/components/admin/sections"
import { Stat, money, longDate } from "@/components/admin/insights-ui"
import LoginForm from "./system/LoginForm"

export const dynamic = "force-dynamic"
export const metadata = { title: "Admin", robots: { index: false } }

const DESCRIPTIONS: Record<string, string> = {
  "/admin/insights": "Sales, visitors, top pages & the buying funnel",
  "/admin/system": "Env vars, Stripe and Resend health, last sale",
}

const TZ = "America/Chicago"
const localDay = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d)

function greeting() {
  const h = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: TZ }).format(new Date()))
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"
}

type Sale = { id: string; who: string; total: number; day: string }

export default async function AdminHome() {
  if (!(await isAdmin())) return <LoginForm />

  const today = localDay(new Date())

  let data: Insights | null = null
  let failed = false
  const db = getDB()
  if (db) {
    try { data = await getInsights(db, insightsConfig, 30) } catch (err) { console.error("[admin home]", err); failed = true }
  }

  // Recent sales come straight from Stripe (this site keeps no orders table).
  let sales: Sale[] = []
  const stripe = getStripe()
  if (stripe) {
    try {
      const list = await stripe.checkout.sessions.list({ limit: 25 })
      sales = list.data
        .filter((s) => s.payment_status === "paid")
        .slice(0, 6)
        .map((s) => ({
          id: s.id,
          who: s.customer_details?.name || s.customer_details?.email || "Customer",
          total: (s.amount_total ?? 0) / 100,
          day: localDay(new Date(s.created * 1000)),
        }))
    } catch (err) {
      console.error("[admin home] sales", err)
    }
  }

  const missing = checkEnvVars().filter((v) => v.required && !v.set)
  const rev = data?.sources.find((s) => s.key === "revenue")
  const count = data?.sources.find((s) => s.key === "sales")

  return (
    <AdminPage>
      <div className="mb-6 sm:mb-8">
        <p className="text-[10px] tracking-[0.26em] uppercase text-gold mb-1.5">{longDate(today)}</p>
        <h1 className="font-display text-3xl sm:text-4xl text-neutral-100 leading-tight">{greeting()}, James</h1>
      </div>

      {missing.length > 0 && (
        <p className="mb-4 text-sm text-red-300 border border-red-400/30 bg-red-400/5 px-4 py-3">
          {missing.length} required setting{missing.length === 1 ? " is" : "s are"} missing ({missing.slice(0, 3).map((m) => m.name).join(", ")}
          {missing.length > 3 ? "…" : ""}). <Link href="/admin/system" className="underline">Check System</Link>
        </p>
      )}

      <section aria-label="Last 30 days" className="mb-8">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-[11px] tracking-[0.2em] uppercase text-neutral-400">Last 30 days</h2>
          <Link href="/admin/insights" className="text-xs text-gold hover:underline inline-flex items-center gap-1">
            All insights <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {data && rev && count ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat label="Revenue" value={money(rev.total)} cur={rev.total} prev={rev.prev} />
            <Stat label="Sales" value={String(count.total)} cur={count.total} prev={count.prev} />
            <Stat label="Visitors" value={data.visitors.cur.toLocaleString("en-US")} cur={data.visitors.cur} prev={data.visitors.prev} />
            <Stat label="Page views" value={data.pageviews.cur.toLocaleString("en-US")} cur={data.pageviews.cur} prev={data.pageviews.prev} />
          </div>
        ) : (
          <p className="text-sm text-neutral-400 bg-neutral-900 border border-neutral-800 p-4">
            {failed ? "Couldn’t load numbers right now. Sections below still work." : "Numbers need a database connection (TURSO_URL). Sections below still work."}
          </p>
        )}
      </section>

      <div className="grid gap-8 lg:gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section aria-label="Recent sales">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-neutral-400">Recent sales</h2>
            <Link href="/admin/insights" className="text-xs text-gold hover:underline inline-flex items-center gap-1">
              Sales trend <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-neutral-900 border border-neutral-800">
            {sales.length === 0 ? (
              <div className="p-6 text-center">
                <p className="font-display text-xl text-neutral-100 mb-1">No sales yet</p>
                <p className="text-sm text-neutral-400">Paid checkouts show up here as they come in.</p>
              </div>
            ) : (
              <ul className="divide-y divide-neutral-800">
                {sales.map((s) => (
                  <li key={s.id} className="flex gap-4 px-4 sm:px-5 py-3.5">
                    <div className="w-16 shrink-0">
                      <p className={`text-[10px] tracking-[0.14em] uppercase ${s.day === today ? "text-gold font-medium" : "text-neutral-400"}`}>
                        {s.day === today ? "Today" : longDate(s.day).split(",")[0]}
                      </p>
                      <p className="text-sm text-neutral-100 tabular-nums whitespace-nowrap">{money(s.total)}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-neutral-100 font-medium truncate">{s.who}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{longDate(s.day)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section aria-label="Sections">
          <h2 className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 mb-3">Go to</h2>
          <div className="grid grid-cols-2 gap-3">
            {ADMIN_SECTIONS.filter((s) => s.href !== "/admin").map(({ href, label, icon: Icon }) => {
              const hero = href === "/admin/insights"
              const wide = hero || ADMIN_SECTIONS.length <= 3
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group border p-4 transition-colors min-w-0 hover:border-gold ${wide ? "col-span-2" : ""} ${hero ? "bg-gold/10 border-neutral-700" : "bg-neutral-900 border-neutral-800"}`}
                >
                  <Icon className="w-4 h-4 mb-3 text-gold" strokeWidth={1.6} aria-hidden />
                  <p className="font-display text-base leading-tight text-neutral-100">{label}</p>
                  <p className="text-xs mt-1 leading-snug text-neutral-400">{DESCRIPTIONS[href]}</p>
                </Link>
              )
            })}
          </div>
          <Link href="/" className={`${adminBtn.secondary} w-full mt-3`}>
            Open the site
          </Link>
        </section>
      </div>
    </AdminPage>
  )
}
