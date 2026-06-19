import "server-only";

/**
 * Real GitHub Issues ingestion via the official GitHub API.
 * Strategy (like App Store): find the top REPOS for the niche, then their most-
 * discussed OPEN issues — bugs and feature requests = direct gaps/opportunities.
 * Works without auth (rate-limited); set GITHUB_TOKEN for higher limits.
 * Best for technical / developer / open-source niches (issues are mostly English).
 */

export interface GithubIssue {
  text: string;
  author: string;
  repo: string;
  url: string;
  reactions: number;
  comments: number;
  state: string;
}

interface Repo {
  full_name: string;
}
interface Issue {
  title: string;
  body?: string;
  html_url: string;
  state: string;
  comments?: number;
  user?: { login?: string };
  reactions?: { total_count?: number };
  pull_request?: unknown;
}

function ghHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "painradar",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

export async function collectGithubIssues(
  niche: string,
  _language: string,
  signal?: AbortSignal,
): Promise<GithubIssue[]> {
  try {
    const headers = ghHeaders();

    // 1) Top repos for the niche (most stars = the real projects in this space).
    const repoRes = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(niche)}&sort=stars&order=desc&per_page=5`,
      { headers, signal },
    );
    if (!repoRes.ok) {
      console.error("[GitHub] repo search falló:", repoRes.status);
      return [];
    }
    const repos = (((await repoRes.json())?.items ?? []) as Repo[]).slice(0, 5);

    // 2) For each repo, its most-discussed OPEN issues (bugs / feature requests).
    const out: GithubIssue[] = [];
    for (const repo of repos) {
      const issuesRes = await fetch(
        `https://api.github.com/repos/${repo.full_name}/issues?state=open&sort=comments&direction=desc&per_page=6`,
        { headers, signal },
      );
      if (!issuesRes.ok) continue;
      const issues = ((await issuesRes.json()) ?? []) as Issue[];
      for (const it of issues) {
        if (it.pull_request) continue; // skip PRs (GitHub returns them as issues)
        const text = `${it.title}. ${(it.body ?? "").replace(/\s+/g, " ")}`.trim().slice(0, 400);
        if (text.length < 25) continue;
        out.push({
          text,
          author: it.user?.login ?? "—",
          repo: repo.full_name,
          url: it.html_url,
          reactions: it.reactions?.total_count ?? 0,
          comments: it.comments ?? 0,
          state: it.state,
        });
      }
    }

    // Most-discussed first; bound the prompt size.
    return out.sort((a, b) => b.comments - a.comments).slice(0, 18);
  } catch (err) {
    console.error("[GitHub] ingestion error:", err);
    return [];
  }
}
