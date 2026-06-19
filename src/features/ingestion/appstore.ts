import "server-only";

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
