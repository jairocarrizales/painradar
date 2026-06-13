import "server-only";
import { z } from "zod";
import type { Opportunity, SearchFilters } from "@/shared/types/domain";
import { languageLabel, languageRegions, sourcesDescription } from "@/features/search/options";

/**
 * Local-first analysis engine powered by the Claude Agent SDK.
 * Runs on the user's machine with their own Claude subscription. The agent
 * web-searches the selected sources in the chosen language/regions, ranks
 * opportunities, and (when the language isn't Spanish) translates each field
 * to Spanish. ToS-compliant for personal use only.
 */

const AgentOpportunitySchema = z.object({
  title: z.string(),
  titleEs: z.string().optional(),
  problemSummary: z.string(),
  problemSummaryEs: z.string().optional(),
  pain: z.number().min(0).max(100),
  frequency: z.number().min(0).max(100),
  marketGap: z.number().min(0).max(100),
  appName: z.string(),
  appPitch: z.string(),
  appPitchEs: z.string().optional(),
  keyFeatures: z.array(z.string()).min(1),
  keyFeaturesEs: z.array(z.string()).optional(),
  citations: z
    .array(
      z.object({
        text: z.string(),
        textEs: z.string().optional(),
        url: z.string(),
        platform: z.string().default("web"),
        author: z.string().default("—"),
        context: z.string().optional(),
      }),
    )
    .default([]),
});

const AgentOutputSchema = z.object({
  opportunities: z.array(AgentOpportunitySchema),
});

function composite(s: { pain: number; frequency: number; marketGap: number }): number {
  return Math.round(s.pain * 0.45 + s.frequency * 0.35 + s.marketGap * 0.2);
}

function safeUrl(raw: string, niche: string): string {
  try {
    const u = new URL(raw);
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
  } catch {
    /* fall through */
  }
  return `https://www.google.com/search?q=${encodeURIComponent(niche + " " + raw)}`;
}

function buildSystemPrompt(): string {
  return [
    "Eres el agente de investigación de oportunidades de PainRadar para makers de apps.",
    "Tu trabajo: encontrar quejas REALES de usuarios en las fuentes indicadas,",
    "y agruparlas en oportunidades de app concretas y validadas.",
    "Usa WebSearch y WebFetch para reunir publicaciones, comentarios y reseñas reales.",
    "Solo reporta oportunidades respaldadas por citas reales que encontraste, con URLs reales.",
    "Nunca inventes citas ni URLs. Prioriza quejas recientes y con engagement.",
    "Puntúa con honestidad: pain (qué tan frustrados), frequency (cuánta gente), marketGap (qué tan sin resolver).",
  ].join(" ");
}

function buildPrompt(niche: string, filters: SearchFilters): string {
  const lang = filters.language;
  const isEs = lang === "es";
  const langName = languageLabel(lang);
  const regions = languageRegions(lang);
  const sources = sourcesDescription(filters.sources);

  const translationRule = isEs
    ? 'El contenido ya está en español: deja vacíos los campos "*Es" (titleEs, problemSummaryEs, appPitchEs, keyFeaturesEs, textEs).'
    : `El contenido original está en ${langName}. RELLENA SIEMPRE los campos "*Es" con la traducción al ESPAÑOL de: titleEs, problemSummaryEs, appPitchEs, keyFeaturesEs y, en cada cita, textEs (traducción de la queja). Mantén el texto original en su idioma en los campos sin sufijo.`;

  return `Investiga el nicho "${niche}" para oportunidades de apps.

IDIOMA Y REGIÓN: busca en ${langName}, enfocándote en usuarios de ${regions}.
FUENTES: busca ÚNICAMENTE en estas fuentes: ${sources}. Usa sus dominios en las búsquedas.
RECENCIA preferida: ${filters.recency}.

PRESUPUESTO: haz como MUCHO 6 búsquedas web en total, luego DETENTE y sintetiza. Es válido que
varias oportunidades citen los mismos hilos. Prioriza ENTREGAR JSON VÁLIDO sobre investigar de más.

${translationRule}

Agrupa lo que encuentres en 8-10 oportunidades distintas. Para cada una: title, problemSummary
(1-2 frases), pain/frequency/marketGap (0-100), una idea de app iOS concreta (appName, appPitch,
2-4 keyFeatures) y 1-3 citations (cita real, url real, platform = una de las fuentes, autor, context).

Tras un máximo de 6 búsquedas, devuelve SOLO este objeto JSON, envuelto en un bloque \`\`\`json:

\`\`\`json
{
  "opportunities": [
    {
      "title": "...", "titleEs": "...",
      "problemSummary": "...", "problemSummaryEs": "...",
      "pain": 0, "frequency": 0, "marketGap": 0,
      "appName": "...", "appPitch": "...", "appPitchEs": "...",
      "keyFeatures": ["..."], "keyFeaturesEs": ["..."],
      "citations": [
        { "text": "...", "textEs": "...", "url": "https://...", "platform": "reddit", "author": "...", "context": "..." }
      ]
    }
  ]
}
\`\`\`

No incluyas texto fuera del bloque JSON.`;
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);
  const raw = fenced ? fenced[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return JSON.parse(raw);
}

const AGENT_TIMEOUT_MS = Number(process.env.PAINRADAR_AGENT_TIMEOUT_MS ?? 420_000);

export async function analyzeWithClaudeAgent(
  niche: string,
  filters: SearchFilters,
  externalSignal?: AbortSignal,
): Promise<Opportunity[]> {
  const { query } = await import("@anthropic-ai/claude-agent-sdk");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AGENT_TIMEOUT_MS);

  // Stop the agent when the caller (e.g. a cancelled HTTP request) aborts.
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  let finalText = "";
  let lastAssistantText = "";
  try {
    for await (const message of query({
      prompt: buildPrompt(niche, filters),
      options: {
        model: process.env.PAINRADAR_AGENT_MODEL || "sonnet",
        systemPrompt: buildSystemPrompt(),
        allowedTools: ["WebSearch", "WebFetch"],
        permissionMode: "dontAsk",
        settingSources: [],
        maxTurns: Number(process.env.PAINRADAR_AGENT_MAX_TURNS ?? 30),
        abortController: controller,
      },
    })) {
      if (message.type === "assistant") {
        const text = (message.message?.content ?? [])
          .filter((b: { type: string }) => b.type === "text")
          .map((b: { text?: string }) => b.text ?? "")
          .join("");
        if (text.includes("```json") || text.includes('"opportunities"')) {
          lastAssistantText = text;
        }
      }
      if (message.type === "result" && message.subtype === "success") {
        finalText = message.result;
      }
    }
  } finally {
    clearTimeout(timeout);
  }

  const source = finalText || lastAssistantText;
  if (!source) throw new Error("Agent returned no result");

  const parsed = AgentOutputSchema.parse(extractJson(source));
  const lang = filters.language;

  const opportunities: Opportunity[] = parsed.opportunities.map((o, i) => {
    const scores = { pain: o.pain, frequency: o.frequency, marketGap: o.marketGap };
    const citations = o.citations.map((c) => ({
      text: c.text,
      textEs: c.textEs,
      url: safeUrl(c.url, niche),
      platform: c.platform,
      author: c.author,
      context: c.context,
    }));
    return {
      id: `opp_agent_${niche.replace(/\s+/g, "-").toLowerCase()}_${i}`,
      lang,
      title: o.title,
      titleEs: o.titleEs,
      problemSummary: o.problemSummary,
      problemSummaryEs: o.problemSummaryEs,
      scores,
      overall: composite(scores),
      appIdea: {
        name: o.appName,
        pitch: o.appPitch,
        pitchEs: o.appPitchEs,
        keyFeatures: o.keyFeatures,
        keyFeaturesEs: o.keyFeaturesEs,
      },
      citations: citations.length
        ? citations
        : [
            {
              text: `Usuarios quejándose sobre ${niche}`,
              url: safeUrl(`reddit.com search ${niche}`, niche),
              platform: "web",
              author: "varios",
              context: "web search",
            },
          ],
    };
  });

  return opportunities.sort((a, b) => b.overall - a.overall);
}
