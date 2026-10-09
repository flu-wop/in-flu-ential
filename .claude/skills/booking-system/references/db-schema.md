# Database — Turso lazy-init client + schema

Install: `npm install @libsql/client`

## `lib/db.ts`

Lazy init is mandatory (see SKILL.md). One client, created on first use, reused after.

```ts
import { createClient, type Client } from "@libsql/client";

let _db: Client | null = null;

export function getDb(): Client {
  if (_db) return _db;
  _db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
  return _db;
}

// Call once before first read/write (or run as a one-off). Idempotent.
export async function initDb() {
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      service TEXT NOT NULL,
      event_date TEXT NOT NULL,      -- ISO yyyy-mm-dd
      event_time TEXT,                -- e.g. "2:00 PM"
      hours INTEGER DEFAULT 1,
      location TEXT,
      message TEXT,
      discount_code TEXT,
      amount_cents INTEGER NOT NULL,
      stripe_session_id TEXT,
      status TEXT DEFAULT 'pending',  -- pending | paid | cancelled
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS newsletter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}
```

## Notes

- **One DB per site.** Name it `<site>-bookings`. Don't reuse a token across sites.
- Adjust the columns to the site. A studio/session booking uses `service`/`hours`; an event DJ booking uses `event_type`/`location`; a facial booking uses `service`/`event_time`. Keep `amount_cents`, `stripe_session_id`, `status`, `created_at` on every variant — the webhook, admin, and calendar feed all depend on them.
- **Calendar blocking** (greying out taken slots): query `SELECT event_date, event_time FROM bookings WHERE status='paid'` and disable those slots in the form. Only `paid` rows block — `pending` never exist because rows are written post-payment.
- Common past bug: a **duplicate** `export const db = createClient(...)` left at the top of the file alongside the lazy `getDb()`. Delete the top-level one — it's what caused the duplicate-client build errors. Only `getDb()` should create the client.
