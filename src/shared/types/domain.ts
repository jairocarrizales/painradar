import { z } from "zod";

/** Where a complaint was harvested from (reddit, youtube, trustpilot, appstore, … or "web"). */
export const PlatformSchema = z.string();
export type Platform = z.infer<typeof PlatformSchema>;

// ─── Inteligencia del nicho (App Store) ───

/** Ficha de una app del nicho (datos oficiales de Apple). */
export interface AppInfo {
  id: number;
  name: string;
  developer: string;
  rating: number; // 0-5
  ratingCount: number;
  price: string; // "Gratis" o el precio formateado
  lastUpdate: string; // ISO
  monthsSinceUpdate: number;
  abandoned: boolean;
  genre: string;
  url: string;
}

/** Una reseña usada en aman/odian/piden. */
export interface IntelReview {
  text: string;
  rating: number;
  appName: string;
  country: string;
  url: string;
}

/** Señal de oportunidad detectada. */
export interface NicheSignal {
  type: "demanda" | "abandonada";
  appName: string;
  detail: string;
}

/** Panel de inteligencia del nicho. */
export interface NicheIntel {
  country: string;
  apps: AppInfo[]; // fichas (top por reseñas)
  gems: AppInfo[]; // joyas: pocas reseñas (100-300) pero muy bien calificadas
  signals: NicheSignal[];
  loves: IntelReview[];
  hates: IntelReview[];
  requests: IntelReview[];
}

/** A textual quote that backs an opportunity. `textEs` = Spanish translation (if original ≠ es). */
export const CitationSchema = z.object({
  text: z.string(),
  textEs: z.string().optional(),
  url: z.string(),
  platform: PlatformSchema,
  author: z.string().default("—"),
  context: z.string().optional(),
});
export type Citation = z.infer<typeof CitationSchema>;

/** An analyzed, ranked opportunity. `*Es` fields hold Spanish translations when original ≠ es. */
export const OpportunitySchema = z.object({
  id: z.string(),
  /** ISO code of the original content language (e.g. "en", "es"). */
  lang: z.string().default("es"),
  title: z.string(),
  titleEs: z.string().optional(),
  problemSummary: z.string(),
  problemSummaryEs: z.string().optional(),
  scores: z.object({
    pain: z.number().min(0).max(100),
    frequency: z.number().min(0).max(100),
    marketGap: z.number().min(0).max(100),
  }),
  overall: z.number().min(0).max(100),
  appIdea: z.object({
    name: z.string(),
    pitch: z.string(),
    pitchEs: z.string().optional(),
    keyFeatures: z.array(z.string()),
    keyFeaturesEs: z.array(z.string()).optional(),
  }),
  citations: z.array(CitationSchema).min(1),
});
export type Opportunity = z.infer<typeof OpportunitySchema>;

/** Filters applied to a search. */
export const SearchFiltersSchema = z.object({
  recency: z.enum(["month", "year", "all"]).default("year"),
  /** ISO code of the search language (drives target regions + translation). */
  language: z.string().default("es"),
  /** Source ids to search (see features/search/options.ts). */
  sources: z
    .array(z.string())
    .default(["reddit", "youtube", "trustpilot", "appstore", "googleplay"]),
  minScore: z.number().int().nonnegative().default(0),
});
export type SearchFilters = z.infer<typeof SearchFiltersSchema>;

/** A user-initiated, on-demand search. */
export const SearchSchema = z.object({
  id: z.string(),
  niche: z.string(),
  filters: SearchFiltersSchema,
  status: z.enum(["pending", "ingesting", "analyzing", "done", "error"]),
  createdAt: z.string(),
  opportunityCount: z.number().int().nonnegative().default(0),
});
export type Search = z.infer<typeof SearchSchema>;

/** Input accepted by the search form / API. */
export const SearchInputSchema = z.object({
  niche: z.string().min(2).max(80),
  filters: SearchFiltersSchema.optional(),
});
export type SearchInput = z.infer<typeof SearchInputSchema>;
