"use client"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { logoutAction } from "@/app/admin/actions"
import { ADMIN_SECTIONS } from "./sections"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: "center", block: "nearest" })
  }, [pathname])

  return (
    <div className="admin-root min-h-screen bg-neutral-950">
      <header className="sticky top-0 z-30 bg-neutral-950 border-b border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 h-12">
            <Link href="/admin" className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-gold shrink-0" aria-hidden />
              <span className="font-display text-base text-neutral-100 truncate">IN-FLU-ENTIAL</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Admin</span>
            </Link>
            <div className="flex items-center gap-4 shrink-0">
              <Link href="/" target="_blank" className="text-xs text-neutral-400 hover:text-neutral-100">View site</Link>
              <form action={logoutAction}>
                <button className="text-xs text-neutral-400 hover:text-neutral-100">Log out</button>
              </form>
            </div>
          </div>
          <div className="relative">
            <nav aria-label="Admin sections" className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2.5 pr-8">
              {ADMIN_SECTIONS.map(({ href, icon: Icon, label }) => {
                const active = href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/")
                return (
                  <Link
                    key={href}
                    href={href}
                    ref={active ? activeRef : undefined}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs tracking-wide whitespace-nowrap shrink-0 transition-colors ${
                      active ? "bg-gold text-neutral-950 font-semibold" : "text-neutral-400 hover:text-neutral-100"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden />
                    {label}
                  </Link>
                )
              })}
            </nav>
            <div className="pointer-events-none absolute right-0 top-0 bottom-2.5 w-8 bg-gradient-to-l from-neutral-950 to-transparent sm:hidden" />
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
