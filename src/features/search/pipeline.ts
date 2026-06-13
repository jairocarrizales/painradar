import type { Opportunity, SearchFilters } from "@/shared/types/domain";
import { SearchFiltersSchema } from "@/shared/types/domain";
import { collectComplaints } from "@/features/ingestion/collect";
import { analyze } from "@/features/analysis/analyze";

export interface SearchResult {
  niche: string;
  filters: SearchFilters;
  opportunities: Opportunity[];
}

/**
 * Run a full on-demand search: ingest complaints, analyze + rank into
 * opportunities. Deterministic in mock mode (safe to re-run from the niche).
 */
export async function runSearch(
  niche: string,
  rawFilters?: Partial<SearchFilters>,
  signal?: AbortSignal,
): Promise<SearchResult> {
  const filters = SearchFiltersSchema.parse(rawFilters ?? {});
  const sources = await collectComplaints(niche, filters);
  const opportunities = await analyze(niche, sources, filters, signal);
  return { niche, filters, opportunities };
}
