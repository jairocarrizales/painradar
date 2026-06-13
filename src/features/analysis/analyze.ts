import type { Opportunity, SearchFilters } from "@/shared/types/domain";
import { analyzeWithClaudeAgent } from "./claude-agent";

/**
 * Turn a niche into ranked opportunities using the local Claude agent (the
 * user's own subscription). There is NO mock fallback: if the agent fails or
 * finds nothing, the error propagates so the UI shows a clear failure message
 * instead of fake data.
 */
export async function analyze(
  niche: string,
  filters: SearchFilters,
  signal?: AbortSignal,
): Promise<Opportunity[]> {
  const result = await analyzeWithClaudeAgent(niche, filters, signal);
  if (result.length === 0) {
    throw new Error(
      "El agente no encontró oportunidades. Intenta de nuevo, cambia el nicho o ajusta las fuentes.",
    );
  }
  return result;
}
