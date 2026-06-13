import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AiProvider = "mock" | "claude-agent" | "openrouter";

/**
 * Which engine powers the analysis:
 * - "claude-agent": local Claude Agent SDK using the user's own subscription (no API key)
 * - "openrouter": OpenRouter API (pay-per-token)
 * - "mock": deterministic simulated data (default; no keys required)
 */
export function aiProvider(): AiProvider {
  const raw = (process.env.AI_PROVIDER ?? "").toLowerCase();
  if (raw === "claude-agent" || raw === "agent") return "claude-agent";
  if (raw === "openrouter") return "openrouter";
  // Back-compat: DATA_MODE=live + OpenRouter key implied OpenRouter.
  if ((process.env.DATA_MODE ?? "mock") === "live" && process.env.OPENROUTER_API_KEY) {
    return "openrouter";
  }
  return "mock";
}

/** Whether the app is running against simulated data. */
export function isMockMode(): boolean {
  return aiProvider() === "mock";
}
