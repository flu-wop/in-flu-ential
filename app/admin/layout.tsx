import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Signed out: the page shows the site's own login form, no shell.
  if (!(await isAdmin())) return <div className="min-h-screen bg-neutral-950 text-neutral-100">{children}</div>;
  return <AdminShell>{children}</AdminShell>;
}
