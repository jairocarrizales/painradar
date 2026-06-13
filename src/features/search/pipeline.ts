import type { Opportunity, SearchFilters } from "@/shared/types/domain";
import { SearchFiltersSchema } from "@/shared/types/domain";
import { analyze } from "@/features/analysis/analyze";

export interface SearchResult {
  niche: string;
  filters: SearchFilters;
  opportunities: Opportunity[];
}

/**
 * Run a full on-demand search: the Claude agent searches the web and ranks
 * opportunities (or mock data as fallback). Deterministic in mock mode.
 */
export async function runSearch(
  niche: string,
  rawFilters?: Partial<SearchFilters>,
  signal?: AbortSignal,
): Promise<SearchResult> {
  const filters = SearchFiltersSchema.parse(rawFilters ?? {});
  const opportunities = await analyze(niche, filters, signal);
  return { niche, filters, opportunities };
}
