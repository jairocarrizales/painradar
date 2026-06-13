import { z } from "zod";
import type { Opportunity, SearchFilters, SourceItem } from "@/shared/types/domain";
import { aiProvider } from "@/shared/lib/utils";
import { mockOpportunities } from "@/features/ingestion/mock-data";
import { analyzeWithClaudeAgent } from "./claude-agent";

/**
 * Turn a niche (+ any pre-collected complaints) into ranked opportunities.
 * - "claude-agent": local Claude agent searches the web + ranks (user's subscription)
 * - "openrouter": cluster pre-collected complaints with an LLM via OpenRouter
 * - "mock": deterministic curated/generated opportunities
 */
export async function analyze(
  niche: string,
  sources: SourceItem[],
  filters: SearchFilters,
  signal?: AbortSignal,
): Promise<Opportunity[]> {
  const provider = aiProvider();

  if (provider === "claude-agent") {
    try {
      const result = await analyzeWithClaudeAgent(niche, filters, signal);
      if (result.length > 0) return result;
      console.warn("[PainRadar] El agente devolvió 0 oportunidades; usando mock.");
    } catch (err) {
      // Genuine cancellation: propagate it (don't mask a stopped search with mock).
      if (signal?.aborted) throw err;
      console.error("[PainRadar] El agente falló, usando mock:", err);
    }
    return mockOpportunities(niche, filters);
  }

  if (provider === "openrouter" && sources.length > 0) {
    return analyzeLive(niche, sources);
  }

  return mockOpportunities(niche, filters);
}

// Composite ranking — pain weighted highest (matches the KPI priority).
function composite(s: { pain: number; frequency: number; marketGap: number }): number {
  return Math.round(s.pain * 0.45 + s.frequency * 0.35 + s.marketGap * 0.2);
}

const LlmOpportunitySchema = z.object({
  opportunities: z
    .array(
      z.object({
        title: z.string(),
        problemSummary: z.string(),
        pain: z.number().min(0).max(100),
        frequency: z.number().min(0).max(100),
        marketGap: z.number().min(0).max(100),
        appName: z.string(),
        appPitch: z.string(),
        keyFeatures: z.array(z.string()).min(2).max(4),
        citationIndexes: z.array(z.number().int()).min(1),
      }),
    )
    .min(10),
});

async function analyzeLive(niche: string, sources: SourceItem[]): Promise<Opportunity[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return mockOpportunities(niche, { language: "es" } as SearchFilters);

  const { generateObject } = await import("ai");
  const { createOpenRouter } = await import("@openrouter/ai-sdk-provider");
  const openrouter = createOpenRouter({ apiKey });

  const corpus = sources
    .map((s, i) => `[${i}] (${s.platform}, ${s.score} upvotes) ${s.text}`)
    .join("\n");

  const { object } = await generateObject({
    model: openrouter("anthropic/claude-haiku-4.5"),
    schema: LlmOpportunitySchema,
    prompt: `You are an opportunity analyst for indie app makers. Below are real user complaints about "${niche}".

Cluster them into at least 10 distinct app opportunities. For each:
- title, problemSummary, pain (0-100), frequency (0-100), marketGap (0-100)
- appName, appPitch, keyFeatures, citationIndexes (indexes of the complaints that back it)

Complaints:
${corpus}`,
  });

  return object.opportunities
    .map((o, idx): Opportunity => {
      const scores = { pain: o.pain, frequency: o.frequency, marketGap: o.marketGap };
      const citations = o.citationIndexes
        .map((i) => sources[i])
        .filter(Boolean)
        .map((s) => ({
          text: s.text,
          url: s.url,
          platform: s.platform,
          author: s.author,
          context: s.context,
        }));
      return {
        id: `opp_live_${idx}`,
        lang: "es",
        title: o.title,
        problemSummary: o.problemSummary,
        scores,
        overall: composite(scores),
        appIdea: { name: o.appName, pitch: o.appPitch, keyFeatures: o.keyFeatures },
        citations: citations.length
          ? citations
          : [
              {
                text: sources[0].text,
                url: sources[0].url,
                platform: sources[0].platform,
                author: sources[0].author,
                context: sources[0].context,
              },
            ],
      };
    })
    .sort((a, b) => b.overall - a.overall);
}
