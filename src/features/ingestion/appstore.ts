import "server-only";
import type { AppInfo, IntelReview, NicheIntel, NicheSignal } from "@/shared/types/domain";

/**
 * Real App Store ingestion via Apple's OFFICIAL public endpoints (no key):
 * - iTunes Search API → find apps for the niche in a given country store.
 * - Customer Reviews RSS feed → real reviews (with star rating) per app + country.
 * Country-precise. We keep low-star reviews (complaints) and feed them to the agent.
 */

export interface AppStoreReview {
  text: string;
  author: string;
  rating: number;
  appName: string;
  country: string;
  url: string;
}

/** Idioma → tiendas (códigos de país de App Store) a consultar. */
const COUNTRIES: Record<string, string[]> = {
  es: ["es", "mx", "ar"],
  en: ["us", "gb", "ca"],
  pt: ["br", "pt"],
  fr: ["fr", "ca", "be"],
  it: ["it", "ch"],
  de: ["de", "at", "ch"],
};

/** Países de App Store para un idioma (para mostrar/depurar). */
export function appStoreCountries(language: string): string[] {
  return COUNTRIES[language] ?? ["us"];
}

interface ItunesApp {
  trackId: number;
  trackName: string;
}

interface RssEntry {
  "im:rating"?: { label: string };
  title?: { label: string };
  content?: { label: string };
  author?: { name?: { label: string } };
}

export async function collectAppStoreComplaints(
  niche: string,
  language: string,
  signal?: AbortSignal,
): Promise<AppStoreReview[]> {
  const countries = appStoreCountries(language);
  const out: AppStoreReview[] = [];

  try {
    for (const cc of countries) {
      // 1) Buscar apps del nicho en la tienda de ese país.
      const searchUrl =
        `https://itunes.apple.com/search?term=${encodeURIComponent(niche)}` +
        `&country=${cc}&entity=software&limit=3`;
      const sr = await fetch(searchUrl, { signal });
      if (!sr.ok) continue;
      const apps = ((await sr.json())?.results ?? []) as ItunesApp[];

      for (const app of apps.slice(0, 3)) {
        if (!app.trackId) continue;
        // 2) Reseñas reales (RSS oficial), las más recientes.
        const rssUrl =
          `https://itunes.apple.com/${cc}/rss/customerreviews/page=1/id=${app.trackId}/sortby=mostrecent/json`;
        const rr = await fetch(rssUrl, { signal });
        if (!rr.ok) continue;
        const entries = (((await rr.json())?.feed?.entry ?? []) as RssEntry[]).filter(
          (e) => e["im:rating"],
        );
        for (const e of entries) {
          const rating = Number(e["im:rating"]!.label);
          if (!rating || rating > 3) continue; // solo quejas: 1-3 estrellas
          const title = e.title?.label ?? "";
          const body = e.content?.label ?? "";
          out.push({
            text: `${title}. ${body}`.replace(/\s+/g, " ").trim().slice(0, 400),
            author: e.author?.name?.label ?? "—",
            rating,
            appName: app.trackName,
            country: cc,
            url: `https://apps.apple.com/${cc}/app/id${app.trackId}?see-all=reviews`,
          });
        }
      }
    }
  } catch (err) {
    console.error("[AppStore] ingestion error:", err);
  }

  // Prioriza las peores calificaciones; limita para mantener el prompt liviano.
  return out.sort((a, b) => a.rating - b.rating).slice(0, 20);
}

// ─── Inteligencia del nicho (panel tipo AppFigures, con datos gratis de Apple) ───

interface ItunesAppFull {
  trackId: number;
  trackName: string;
  artistName?: string;
  averageUserRating?: number;
  userRatingCount?: number;
  formattedPrice?: string;
  price?: number;
  currentVersionReleaseDate?: string;
  releaseDate?: string;
  primaryGenreName?: string;
  trackViewUrl?: string;
}

const REQUEST_HINTS = [
  "wish", "would be nice", "would love", "please add", "feature request", "add support",
  "missing", "ojalá", "ojala", "sería genial", "seria genial", "falta", "deberían", "deberian",
  "me gustaría", "me gustaria", "agreguen", "añadir", "anadir", "hace falta", "no permite",
];
function isRequest(text: string): boolean {
  const t = text.toLowerCase();
  return REQUEST_HINTS.some((w) => t.includes(w));
}

function toAppInfo(a: ItunesAppFull, cc: string): AppInfo {
  const last = a.currentVersionReleaseDate ?? a.releaseDate ?? "";
  let months = 0;
  if (last) {
    const d = new Date(last).getTime();
    if (!Number.isNaN(d)) months = Math.max(0, Math.round((Date.now() - d) / (1000 * 60 * 60 * 24 * 30)));
  }
  return {
    id: a.trackId,
    name: a.trackName,
    developer: a.artistName ?? "—",
    rating: Math.round((a.averageUserRating ?? 0) * 10) / 10,
    ratingCount: a.userRatingCount ?? 0,
    price: a.price && a.price > 0 ? a.formattedPrice ?? `$${a.price}` : "Gratis",
    lastUpdate: last,
    monthsSinceUpdate: months,
    abandoned: months >= 18,
    genre: a.primaryGenreName ?? "",
    url: a.trackViewUrl ?? `https://apps.apple.com/${cc}/app/id${a.trackId}`,
  };
}

async function fetchReviews(
  cc: string,
  appId: number,
  appName: string,
  signal?: AbortSignal,
): Promise<IntelReview[]> {
  const rr = await fetch(
    `https://itunes.apple.com/${cc}/rss/customerreviews/page=1/id=${appId}/sortby=mostrecent/json`,
    { signal },
  );
  if (!rr.ok) return [];
  const entries = (((await rr.json())?.feed?.entry ?? []) as RssEntry[]).filter((e) => e["im:rating"]);
  return entries.map((e) => ({
    text: `${e.title?.label ?? ""}. ${e.content?.label ?? ""}`.replace(/\s+/g, " ").trim().slice(0, 300),
    rating: Number(e["im:rating"]!.label),
    appName,
    country: cc,
    url: `https://apps.apple.com/${cc}/app/id${appId}?see-all=reviews`,
  }));
}

export async function collectAppStoreIntel(
  niche: string,
  language: string,
  signal?: AbortSignal,
): Promise<NicheIntel | null> {
  const cc = appStoreCountries(language)[0];
  try {
    const sr = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(niche)}&country=${cc}&entity=software&limit=40`,
      { signal },
    );
    if (!sr.ok) return null;
    const raw = ((await sr.json())?.results ?? []) as ItunesAppFull[];
    const apps = raw
      .filter((a) => a.trackId && (a.userRatingCount ?? 0) > 0)
      .map((a) => toAppInfo(a, cc));
    if (!apps.length) return null;

    // Joyas: 100-300 reseñas y muy bien calificadas (>=4.5) = concepto validado, poca competencia.
    const gems = apps
      .filter((a) => a.ratingCount >= 100 && a.ratingCount <= 300 && a.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);

    // Fichas: los principales por nº de reseñas.
    const topApps = [...apps].sort((a, b) => b.ratingCount - a.ratingCount).slice(0, 6);

    // Señales de oportunidad.
    const signals: NicheSignal[] = [];
    for (const a of [...apps].sort((x, y) => y.ratingCount - x.ratingCount)) {
      if (
        a.ratingCount >= 500 &&
        a.rating > 0 &&
        a.rating <= 3.5 &&
        signals.filter((s) => s.type === "demanda").length < 3
      ) {
        signals.push({
          type: "demanda",
          appName: a.name,
          detail: `${a.ratingCount.toLocaleString("es")} reseñas pero solo ${a.rating}★ — mucha demanda, baja satisfacción`,
        });
      }
      if (a.abandoned && a.ratingCount >= 50 && signals.filter((s) => s.type === "abandonada").length < 3) {
        signals.push({
          type: "abandonada",
          appName: a.name,
          detail: `sin actualizar hace ${a.monthsSinceUpdate} meses`,
        });
      }
    }

    // Aman / odian / piden: reseñas de las apps principales.
    const loves: IntelReview[] = [];
    const hates: IntelReview[] = [];
    const requests: IntelReview[] = [];
    for (const a of topApps.slice(0, 4)) {
      const reviews = await fetchReviews(cc, a.id, a.name, signal);
      for (const r of reviews) {
        if (r.text.length < 20) continue;
        if (r.rating >= 5 && loves.length < 6) loves.push(r);
        else if (r.rating <= 2 && hates.length < 6) hates.push(r);
        if (isRequest(r.text) && requests.length < 6) requests.push(r);
      }
    }

    return { country: cc, apps: topApps, gems, signals: signals.slice(0, 6), loves, hates, requests };
  } catch (err) {
    console.error("[AppStore] intel error:", err);
    return null;
  }
}
