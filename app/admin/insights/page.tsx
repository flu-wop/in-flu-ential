// src/app/admin/insights/page.tsx
// Admin insights. Server-rendered; the tab and range live in the URL
// (?tab=funnel&days=90) so refreshes and shared links keep them.
import Link from "next/link"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin-auth"
import { getDB } from "@/lib/db"
import { getInsights } from "@/lib/insights/core"
import { insightsConfig } from "@/lib/insights/config"
import { AdminPage, AdminPageHeader } from "@/components/admin/page-frame"
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
  if (!(await isAdmin())) redirect("/admin")

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

  const note = "mb-4 text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 px-4 py-3 leading-relaxed"

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Studio"
        title="Insights"
        description={data ? `${longDate(data.range.start)} – ${longDate(data.range.end)}` : "How the site is doing"}
        actions={<RangePicker days={days} />}
      />

      <div className="-mx-4 sm:mx-0 mb-6 border-b border-neutral-800">
        <nav aria-label="Insights tabs" className="flex gap-5 sm:gap-7 overflow-x-auto no-scrollbar px-4 sm:px-0">
          {TABS.map((t) => (
            <Link
              key={t.id}
              href={`/admin/insights?tab=${t.id}${keep}`}
              aria-current={tab === t.id ? "page" : undefined}
              className={`relative pb-3 pt-1 text-sm whitespace-nowrap shrink-0 transition-colors ${tab === t.id ? "text-neutral-100" : "text-neutral-400 hover:text-neutral-100"}`}
            >
              {t.label}
              {tab === t.id && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-gold" />}
            </Link>
          ))}
        </nav>
      </div>

      {!db && (
        <p className={note}>
          Insights needs a database. Add <code>TURSO_URL</code> and <code>TURSO_TOKEN</code> in Vercel, redeploy, and visitor tracking starts.
        </p>
      )}
      {failed && <p className="mb-4 text-sm text-red-300 border border-red-400/30 bg-red-400/5 px-4 py-3">Couldn&apos;t reach the database. Refresh in a moment.</p>}
      {data && !data.trackingSince && (
        <p className={note}>Visitor tracking is live. Sales are complete; visitors and page times start counting from today.</p>
      )}
      {data?.trackingSince && data.trackingSince.slice(0, 10) > data.range.start && (
        <p className={note}>Visitor numbers start {longDate(data.trackingSince.slice(0, 10))}, when tracking went live. Sales cover the full range.</p>
      )}

      {data && tab === "overview" && <Overview data={data} />}
      {data && tab === "pages" && <PagesTab data={data} />}
      {data && tab === "funnel" && <FunnelTab data={data} />}
    </AdminPage>
  )
}
