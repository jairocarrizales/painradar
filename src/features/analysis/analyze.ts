import type { Opportunity, SearchFilters } from "@/shared/types/domain";
import { aiProvider } from "@/shared/lib/utils";
import { mockOpportunities } from "@/features/ingestion/mock-data";
import { analyzeWithClaudeAgent } from "./claude-agent";

/**
 * Turn a niche into ranked opportunities.
 * - "claude-agent": local Claude agent searches the web + ranks (user's subscription)
 * - "mock": deterministic curated/generated opportunities
 *
 * If the agent fails (or returns nothing), falls back to mock so the app never
 * hard-fails — unless the failure was a genuine cancellation, which is propagated.
 */
export async function analyze(
  niche: string,
  filters: SearchFilters,
  signal?: AbortSignal,
): Promise<Opportunity[]> {
  if (aiProvider() === "claude-agent") {
    try {
      const result = await analyzeWithClaudeAgent(niche, filters, signal);
      if (result.length > 0) return result;
      console.warn("[PainRadar] El agente devolvió 0 oportunidades; usando mock.");
    } catch (err) {
      if (signal?.aborted) throw err; // cancelación real: propagar, no enmascarar con mock
      console.error("[PainRadar] El agente falló, usando mock:", err);
    }
  }
  return mockOpportunities(niche, filters);
}
