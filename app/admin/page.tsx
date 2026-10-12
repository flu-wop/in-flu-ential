// src/app/admin/page.tsx
// Admin home. Signed-in launcher; signed-out visitors go to the login on /admin/system.
import Link from "next/link"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin-auth"

const PAGES = [
  { href: "/admin/insights", title: "Insights", desc: "Sales, visitors, top pages and the buying funnel." },
  { href: "/admin/system", title: "System", desc: "Env vars, Stripe and Resend health, last sale." },
]

export default async function AdminHome() {
  if (!(await isAdmin())) redirect("/admin/system")
  return (
    <div className="min-h-screen bg-neutral-950 px-6 sm:px-10 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl text-neutral-100 mb-1">IN-FLU-ENTIAL Admin</h1>
        <p className="text-neutral-400 text-sm mb-8">Pick a page.</p>
        <div className="grid sm:grid-cols-2 gap-5">
          {PAGES.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="bg-neutral-900 border border-neutral-800 rounded-sm p-6 hover:border-gold/50 transition-colors"
            >
              <h3 className="font-display text-xl text-gold mb-2">{p.title}</h3>
              <p className="text-neutral-400 text-sm">{p.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
