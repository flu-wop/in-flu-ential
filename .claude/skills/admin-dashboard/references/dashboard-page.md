# app/api/admin/health/route.ts

```ts
import { NextRequest, NextResponse } from "next/server";
import {
  checkEnvVars, checkStripe, checkLastBookingWebhook,
  checkResend, checkTurso, checkApiUsage, checkProductSync,
} from "@/lib/health-checks";

const HAS_PRODUCTS = true; // flip to false for sites with no products table

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-admin-password");
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [envVars, stripe, lastWebhook, resend, turso, apiUsage, productSync] = await Promise.all([
    Promise.resolve(checkEnvVars()),
    checkStripe(),
    checkLastBookingWebhook(),
    checkResend(),
    checkTurso(),
    checkApiUsage(),
    HAS_PRODUCTS ? checkProductSync() : Promise.resolve(null),
  ]);

  return NextResponse.json({
    envVars,
    webhookHealth: { stripe, lastWebhook, resend, turso },
    apiUsage,
    productSync,
    checkedAt: new Date().toISOString(),
  });
}
```

# app/admin/system/page.tsx

```tsx
"use client";
import { useState, useEffect, useCallback } from "react";

type CheckResult = { status: "ok" | "warn" | "error"; detail: string };
type HealthData = {
  envVars: Record<string, CheckResult>;
  webhookHealth: { stripe: CheckResult; lastWebhook: CheckResult; resend: CheckResult; turso: CheckResult };
  apiUsage: CheckResult;
  productSync: (CheckResult & { drifted?: string[] }) | null;
  checkedAt: string;
};

const STATUS_COLOR = { ok: "#4ADE80", warn: "#FACC15", error: "#F87171" };

function Pill({ status }: { status: "ok" | "warn" | "error" }) {
  return (
    <span
      style={{
        display: "inline-block", width: 10, height: 10, borderRadius: "50%",
        background: STATUS_COLOR[status], marginRight: 8,
      }}
    />
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#111111", border: "1px solid #2a2a2a", borderRadius: 12,
      padding: 20, color: "#F5EDD8", fontFamily: "DM Sans, sans-serif",
    }}>
      <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#D4AF77", marginBottom: 12 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function SystemDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<HealthData | null>(null);
  const [error, setError] = useState("");

  const fetchHealth = useCallback(async (pw: string) => {
    const res = await fetch("/api/admin/health", { headers: { "x-admin-password": pw } });
    if (!res.ok) { setError("Wrong password or check failed"); return; }
    setData(await res.json());
    setAuthed(true);
    setError("");
  }, []);

  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => fetchHealth(password), 60_000);
    return () => clearInterval(interval);
  }, [authed, password, fetchHealth]);

  if (!authed) {
    return (
      <div style={{ padding: 40, background: "#090909", minHeight: "100vh" }}>
        <input
          type="password" placeholder="Admin password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchHealth(password)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #2a2a2a", background: "#111", color: "#F5EDD8" }}
        />
        {error && <p style={{ color: "#F87171", marginTop: 8 }}>{error}</p>}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={{ padding: 40, background: "#090909", minHeight: "100vh" }}>
      <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, color: "#F5EDD8", marginBottom: 24 }}>
        System Health
      </h1>
      <p style={{ color: "#A89880", marginBottom: 24, fontSize: 13 }}>
        Last checked {new Date(data.checkedAt).toLocaleTimeString()} — refreshes every 60s
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        <Card title="Env Vars">
          {Object.entries(data.envVars).map(([key, r]) => (
            <div key={key} style={{ marginBottom: 6, fontSize: 14 }}>
              <Pill status={r.status} /> {key} — {r.detail}
            </div>
          ))}
        </Card>

        <Card title="Webhook Health">
          {Object.entries(data.webhookHealth).map(([key, r]) => (
            <div key={key} style={{ marginBottom: 6, fontSize: 14 }}>
              <Pill status={r.status} /> {key} — {r.detail}
            </div>
          ))}
        </Card>

        <Card title="API Usage">
          <div style={{ fontSize: 14 }}><Pill status={data.apiUsage.status} /> {data.apiUsage.detail}</div>
        </Card>

        {data.productSync && (
          <Card title="Product Sync">
            <div style={{ fontSize: 14, marginBottom: 8 }}>
              <Pill status={data.productSync.status} /> {data.productSync.detail}
            </div>
            {data.productSync.drifted?.map((d) => (
              <div key={d} style={{ fontSize: 13, color: "#A89880", marginLeft: 18 }}>{d}</div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
```

Notes:
- Same `x-admin-password` header pattern as `/admin/bookings` — don't invent a cookie/session scheme for this.
- Swap the inline styles for the site's actual Tailwind classes/design tokens once you're in a real repo — this is deliberately framework-light so it's easy to paste and adapt per site.
- `HAS_PRODUCTS` flag in the API route is the single toggle that turns Product Sync on/off per site.
