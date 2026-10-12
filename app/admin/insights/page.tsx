// src/app/admin/insights/page.tsx
// Admin insights. Server-rendered; the tab and range live in the URL
// (?tab=funnel&days=90) so refreshes and shared links keep them.
import Link from "next/link"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin-auth"
import { getDB } from "@/lib/db"
import { getInsights } from "@/lib/insights/core"
import { insightsConfig } from "@/lib/insights/config"
import { RangePicker } from "@/components/admin/RangePicker"
import { Overview, PagesTab, FunnelTab, longDate } from "@/components/admin/insights-ui"
import type { Insights } from "@/lib/insights/types"

export const dynamic = "force-dynamic"
export const metadata = { title: "Insights · Admin", robots: { index: false } }

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "pages", label: "Pages" },
  { id: "funnel", label: "Funnel" },
]

export default async function InsightsPage({ searchParams }: { searchParams: Promise<{ tab?: string; days?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/system")

  const sp = await searchParams
  const tab = TABS.some((t) => t.id === sp.tab) ? sp.tab! : "overview"
  const days = [7, 30, 90, 365].includes(Number(sp.days)) ? Number(sp.days) : 30

  const db = getDB()
  let data: Insights | null = null
  let failed = false
  if (db) {
    try { data = await getInsights(db, insightsConfig, days) } catch (err) { console.error("[insights]", err); failed = true }
  }

  const keep = days === 30 ? "" : `&days=${days}`

  return (
    <div className="min-h-screen bg-neutral-950 px-6 sm:px-10 py-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin" className="text-neutral-400 text-xs hover:text-gold transition-colors">&larr; Admin home</Link>
        <div className="flex items-end justify-between gap-4 flex-wrap mt-1 mb-6">
          <div>
            <h1 className="font-display text-3xl text-neutral-100">Insights</h1>
            <p className="text-neutral-400 text-xs mt-1">{data ? `${longDate(data.range.start)} – ${longDate(data.range.end)}` : "How the site is doing"}</p>
          </div>
          <RangePicker days={days} />
        </div>

        <nav className="flex gap-1 mb-6 border-b border-neutral-800" aria-label="Insights tabs">
          {TABS.map((t) => (
            <Link
              key={t.id}
              href={`/admin/insights?tab=${t.id}${keep}`}
              aria-current={tab === t.id ? "page" : undefined}
              className={`px-4 py-2 text-sm -mb-px border-b-2 ${tab === t.id ? "border-gold text-gold" : "border-transparent text-neutral-400 hover:text-neutral-100"}`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        {!db && (
          <p className="text-neutral-400 text-sm mb-4 border border-neutral-800 rounded-sm p-4">
            Insights needs a database. Add <code>TURSO_URL</code> and <code>TURSO_TOKEN</code> in Vercel, redeploy, and visitor tracking starts.
          </p>
        )}
        {failed && <p className="text-red-300 text-sm mb-4">Couldn&apos;t reach the database. Refresh in a moment.</p>}
        {data && !data.trackingSince && (
          <p className="text-neutral-400 text-sm mb-4">Visitor tracking is live. Sales are complete; visitors and page times start counting from today.</p>
        )}
        {data?.trackingSince && data.trackingSince.slice(0, 10) > data.range.start && (
          <p className="text-neutral-400 text-sm mb-4">Visitor numbers start {longDate(data.trackingSince.slice(0, 10))}, when tracking went live. Sales cover the full range.</p>
        )}

        {data && tab === "overview" && <Overview data={data} />}
        {data && tab === "pages" && <PagesTab data={data} />}
        {data && tab === "funnel" && <FunnelTab data={data} />}
      </div>
    </div>
  )
}
