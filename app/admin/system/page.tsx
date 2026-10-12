import { isAdmin } from "@/lib/admin-auth";
import { logoutAction } from "../actions";
import LoginForm from "./LoginForm";
import { checkEnvVars, checkLastSale, checkResend, checkStripe, type Check, type Status } from "@/lib/health-checks";

export const dynamic = "force-dynamic";

const DOT: Record<Status, string> = { ok: "bg-emerald-500", warn: "bg-amber-400", fail: "bg-red-500" };
const WORD: Record<Status, string> = { ok: "OK", warn: "Check", fail: "Problem" };

function Row({ c }: { c: Check }) {
  return (
    <li className="flex items-start gap-3 py-3">
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${DOT[c.status]}`} aria-hidden />
      <div className="min-w-0">
        <p className="text-sm font-medium">
          {c.label} <span className="ml-1 text-xs text-neutral-400">{WORD[c.status]}</span>
        </p>
        <p className="break-words text-sm text-neutral-400">{c.detail}</p>
      </div>
    </li>
  );
}

export default async function SystemPage() {
  if (!(await isAdmin())) return <LoginForm />;

  const [stripe, sale, resend] = await Promise.all([checkStripe(), checkLastSale(), checkResend()]);
  const env = checkEnvVars();
  const checks = [...stripe, ...resend, sale];
  const missing = env.filter((v) => v.required && !v.set).length;
  const worst: Status = checks.some((c) => c.status === "fail") || missing ? "fail" : checks.some((c) => c.status === "warn") ? "warn" : "ok";
  const groups = [...new Set(env.map((v) => v.group))];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl uppercase tracking-widest">System</h1>
          <p className="text-sm text-neutral-400">Env vars, Stripe and Resend. Refresh the page to re-check.</p>
        </div>
        <form action={logoutAction}>
          <button className="text-sm text-neutral-400 underline hover:text-neutral-100">Sign out</button>
        </form>
      </div>

      <div className="mb-6 flex items-center gap-3 rounded border border-neutral-800 bg-neutral-900 p-4">
        <span className={`h-3 w-3 rounded-full ${DOT[worst]}`} aria-hidden />
        <p className="text-sm">
          {worst === "ok" ? "Everything looks healthy." : `${checks.filter((c) => c.status !== "ok").length + missing} item(s) need attention.`}
        </p>
      </div>

      <section className="mb-6 rounded border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="mb-1 text-xs uppercase tracking-widest text-neutral-400">Integrations</h2>
        <ul className="divide-y divide-border">{checks.map((c) => <Row key={c.label} c={c} />)}</ul>
      </section>

      <section className="rounded border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-neutral-400">Environment variables</h2>
        {groups.map((g) => (
          <div key={g} className="mb-4 last:mb-0">
            <p className="mb-1 text-sm font-medium">{g}</p>
            <ul className="divide-y divide-border">
              {env.filter((v) => v.group === g).map((v) => (
                <Row
                  key={v.name}
                  c={{
                    label: v.name,
                    status: v.set ? "ok" : v.required ? "fail" : "warn",
                    detail: v.set ? "Set" : `${v.required ? "Missing" : "Not set"}${v.note ? `. ${v.note}` : ""}`,
                  }}
                />
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
