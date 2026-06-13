import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AiProvider = "mock" | "claude-agent";

/**
 * Which engine powers the analysis:
 * - "claude-agent": local Claude Agent SDK using the user's own subscription (no API key)
 * - "mock": deterministic simulated data (no keys required)
 *
 * If AI_PROVIDER is not set, the agent is used automatically when a subscription
 * token (CLAUDE_CODE_OAUTH_TOKEN) is present; otherwise it falls back to demo data.
 */
export function aiProvider(): AiProvider {
  const raw = (process.env.AI_PROVIDER ?? "").trim().toLowerCase();
  if (raw === "mock") return "mock";
  if (raw === "claude-agent" || raw === "agent") return "claude-agent";
  if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return "claude-agent";
  return "mock";
}
