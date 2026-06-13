import type { SearchFilters, SourceItem } from "@/shared/types/domain";
import { aiProvider } from "@/shared/lib/utils";

/**
 * Collect raw complaints for a niche from Reddit + YouTube.
 *
 * Only the "openrouter" provider needs pre-collected complaints. Mock produces
 * opportunities directly, and the Claude agent does its own web search — both
 * return an empty array here.
 */
export async function collectComplaints(
  niche: string,
  filters: SearchFilters,
): Promise<SourceItem[]> {
  if (aiProvider() !== "openrouter") return [];
  return collectLive(niche, filters);
}

async function collectLive(
  niche: string,
  filters: SearchFilters,
): Promise<SourceItem[]> {
  const items: SourceItem[] = [];

  if (filters.sources.includes("reddit")) {
    items.push(...(await collectReddit(niche, filters)));
  }
  if (filters.sources.includes("youtube")) {
    items.push(...(await collectYouTube(niche, filters)));
  }
  return items.filter((i) => i.score >= filters.minScore);
}

// ─── Reddit ───
async function collectReddit(
  niche: string,
  _filters: SearchFilters,
): Promise<SourceItem[]> {
  const id = process.env.REDDIT_CLIENT_ID;
  const secret = process.env.REDDIT_CLIENT_SECRET;
  if (!id || !secret) return [];

  // OAuth (client credentials) → search posts → map to SourceItem.
  const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": process.env.REDDIT_USER_AGENT ?? "painradar/0.1",
    },
    body: "grant_type=client_credentials",
  });
  if (!tokenRes.ok) return [];
  const { access_token } = (await tokenRes.json()) as { access_token: string };

  const q = encodeURIComponent(`${niche} (hate OR frustrating OR wish OR broken)`);
  const searchRes = await fetch(
    `https://oauth.reddit.com/search?q=${q}&limit=50&sort=relevance`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "User-Agent": process.env.REDDIT_USER_AGENT ?? "painradar/0.1",
      },
    },
  );
  if (!searchRes.ok) return [];
  const data = (await searchRes.json()) as {
    data: { children: { data: Record<string, unknown> }[] };
  };

  return data.data.children.map((c) => {
    const d = c.data;
    return {
      id: `reddit_${String(d.id)}`,
      platform: "reddit" as const,
      url: `https://www.reddit.com${String(d.permalink)}`,
      author: `u/${String(d.author)}`,
      text: `${String(d.title)} ${String(d.selftext ?? "")}`.trim().slice(0, 1000),
      score: Number(d.ups ?? 0),
      createdAt: new Date(Number(d.created_utc ?? 0) * 1000).toISOString(),
      context: `r/${String(d.subreddit)}`,
    };
  });
}

// ─── YouTube ───
async function collectYouTube(
  niche: string,
  _filters: SearchFilters,
): Promise<SourceItem[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];

  const q = encodeURIComponent(`${niche} app review problems`);
  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${q}&key=${key}`,
  );
  if (!searchRes.ok) return [];
  const search = (await searchRes.json()) as {
    items: { id: { videoId: string }; snippet: { title: string } }[];
  };

  const items: SourceItem[] = [];
  for (const v of search.items ?? []) {
    const commentsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${v.id.videoId}&maxResults=20&order=relevance&key=${key}`,
    );
    if (!commentsRes.ok) continue;
    const comments = (await commentsRes.json()) as {
      items?: {
        id: string;
        snippet: {
          topLevelComment: {
            snippet: {
              textOriginal: string;
              authorDisplayName: string;
              likeCount: number;
              publishedAt: string;
            };
          };
        };
      }[];
    };
    for (const c of comments.items ?? []) {
      const s = c.snippet.topLevelComment.snippet;
      items.push({
        id: `yt_${c.id}`,
        platform: "youtube",
        url: `https://www.youtube.com/watch?v=${v.id.videoId}&lc=${c.id}`,
        author: `@${s.authorDisplayName}`,
        text: s.textOriginal.slice(0, 1000),
        score: s.likeCount,
        createdAt: s.publishedAt,
        context: v.snippet.title,
      });
    }
  }
  return items;
}
