import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Opportunity } from "@/shared/types/domain";

/**
 * Local SQLite store for the single-user, runs-on-your-machine build.
 * Persists favorites, caches expensive agent search results (so re-opening a
 * niche is instant), and doubles as the search history.
 */

function openDb(): DatabaseSync {
  const dir = process.env.PAINRADAR_DATA_DIR || join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(join(dir, "painradar.db"));
  db.exec(`
    CREATE TABLE IF NOT EXISTS favorites (
      id         TEXT PRIMARY KEY,
      data       TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS search_cache (
      key           TEXT PRIMARY KEY,
      niche         TEXT NOT NULL,
      recency       TEXT NOT NULL,
      language      TEXT NOT NULL DEFAULT 'es',
      sources       TEXT NOT NULL DEFAULT '',
      provider      TEXT NOT NULL,
      opportunities TEXT NOT NULL,
      count         INTEGER NOT NULL DEFAULT 0,
      created_at    INTEGER NOT NULL
    );
  `);
  return db;
}

const globalForDb = globalThis as unknown as { __painradarDb?: DatabaseSync };
function db(): DatabaseSync {
  if (!globalForDb.__painradarDb) globalForDb.__painradarDb = openDb();
  return globalForDb.__painradarDb;
}

// ─── Favorites ───

export function listFavorites(): Opportunity[] {
  const rows = db()
    .prepare("SELECT data FROM favorites ORDER BY created_at DESC")
    .all() as { data: string }[];
  return rows.map((r) => JSON.parse(r.data) as Opportunity);
}

export function isFavorite(id: string): boolean {
  return Boolean(db().prepare("SELECT 1 AS x FROM favorites WHERE id = ?").get(id));
}

export function toggleFavorite(opp: Opportunity): { saved: boolean } {
  if (isFavorite(opp.id)) {
    db().prepare("DELETE FROM favorites WHERE id = ?").run(opp.id);
    return { saved: false };
  }
  db()
    .prepare("INSERT INTO favorites (id, data, created_at) VALUES (?, ?, ?)")
    .run(opp.id, JSON.stringify(opp), Date.now());
  return { saved: true };
}

export function removeFavorite(id: string): void {
  db().prepare("DELETE FROM favorites WHERE id = ?").run(id);
}

// ─── Search cache + history ───

export interface CachedSearch {
  provider: string;
  opportunities: Opportunity[];
  createdAt: number;
}

export interface SearchHistoryItem {
  niche: string;
  recency: string;
  language: string;
  sources: string[];
  provider: string;
  count: number;
  createdAt: number;
}

function cacheKey(niche: string, recency: string, language: string, sources: string[]): string {
  return `${niche.trim().toLowerCase()}|${recency}|${language}|${[...sources].sort().join(",")}`;
}

export function getCachedSearch(
  niche: string,
  recency: string,
  language: string,
  sources: string[],
): CachedSearch | null {
  const row = db()
    .prepare(
      "SELECT provider, opportunities, created_at FROM search_cache WHERE key = ?",
    )
    .get(cacheKey(niche, recency, language, sources)) as
    | { provider: string; opportunities: string; created_at: number }
    | undefined;
  if (!row) return null;
  return {
    provider: row.provider,
    opportunities: JSON.parse(row.opportunities) as Opportunity[],
    createdAt: row.created_at,
  };
}

export function setCachedSearch(
  niche: string,
  recency: string,
  language: string,
  sources: string[],
  provider: string,
  opportunities: Opportunity[],
): void {
  db()
    .prepare(
      `INSERT INTO search_cache
         (key, niche, recency, language, sources, provider, opportunities, count, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         provider = excluded.provider,
         opportunities = excluded.opportunities,
         count = excluded.count,
         created_at = excluded.created_at`,
    )
    .run(
      cacheKey(niche, recency, language, sources),
      niche,
      recency,
      language,
      sources.join(","),
      provider,
      JSON.stringify(opportunities),
      opportunities.length,
      Date.now(),
    );
}

/** Recent searches (most recent first) — used for the history panel. */
export function listSearchHistory(limit = 20): SearchHistoryItem[] {
  const rows = db()
    .prepare(
      `SELECT niche, recency, language, sources, provider, count, created_at
       FROM search_cache ORDER BY created_at DESC LIMIT ?`,
    )
    .all(limit) as {
    niche: string;
    recency: string;
    language: string;
    sources: string;
    provider: string;
    count: number;
    created_at: number;
  }[];
  return rows.map((r) => ({
    niche: r.niche,
    recency: r.recency,
    language: r.language,
    sources: r.sources ? r.sources.split(",").filter(Boolean) : [],
    provider: r.provider,
    count: r.count,
    createdAt: r.created_at,
  }));
}
