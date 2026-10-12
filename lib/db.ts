// lib/db.ts
// Turso (libSQL) client for Insights events. Lazy singleton. Returns null when
// TURSO_URL isn't set, so the site keeps working before the database exists.
// Env vars:  TURSO_URL   (libsql://your-db.turso.io)
//            TURSO_TOKEN (your auth token)
import { createClient, type Client } from "@libsql/client"

declare global {
  // eslint-disable-next-line no-var
  var __tursoClient: Client | undefined
}

export function dbConfigured(): boolean {
  return Boolean(process.env.TURSO_URL)
}

export function getDB(): Client | null {
  if (!process.env.TURSO_URL) return null
  if (!global.__tursoClient) {
    global.__tursoClient = createClient({ url: process.env.TURSO_URL, authToken: process.env.TURSO_TOKEN })
  }
  return global.__tursoClient
}
