import "server-only";

/**
 * Real YouTube ingestion via the official YouTube Data API v3.
 * The agent's WebFetch can't read YouTube comments (they load with JavaScript),
 * so we fetch them here through the API and feed them to the agent as real data.
 * Needs YOUTUBE_API_KEY (free, from console.cloud.google.com). Returns [] if absent.
 */

export interface YoutubeComment {
  text: string;
  author: string;
  videoTitle: string;
  url: string;
  likeCount: number;
}

const API = "https://www.googleapis.com/youtube/v3";

/** Palabras que sugieren una queja/crítica (varios idiomas). Reduce ruido y volumen. */
const COMPLAINT_HINTS = [
  // es / general
  "problema", "falla", "no funciona", "no me deja", "no sirve", "error", "caro", "carísimo",
  "odio", "malo", "peor", "lento", "decepc", "basura", "estafa", "cancel", "cobr", "suscrip",
  "se cierra", "se traba", "bug", "ojalá", "falta", "no puedo", "no tiene", "no permite",
  // en
  "problem", "broken", "doesn't work", "doesnt work", "expensive", "hate", "worse", "slow",
  "disappoint", "useless", "scam", "charge", "subscription", "crash", "missing", "wish", "can't",
];

function looksLikeComplaint(text: string): boolean {
  const t = text.toLowerCase();
  return COMPLAINT_HINTS.some((w) => t.includes(w));
}

/** Extra search terms per language to surface review/opinion videos. */
function reviewTerms(language: string): string {
  switch (language) {
    case "es":
      return "opiniones reseña problemas";
    case "pt":
      return "análise opiniões problemas";
    case "fr":
      return "avis test problèmes";
    case "it":
      return "recensione opinioni problemi";
    case "de":
      return "test erfahrungen probleme";
    default:
      return "review honest problems complaints";
  }
}

export async function collectYoutubeComments(
  niche: string,
  language: string,
  signal?: AbortSignal,
): Promise<YoutubeComment[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];

  try {
    // 1) Find relevant videos (app reviews / opinions) about the niche.
    const q = encodeURIComponent(`${niche} app ${reviewTerms(language)}`);
    const searchUrl =
      `${API}/search?part=snippet&type=video&maxResults=6&order=relevance` +
      `&relevanceLanguage=${encodeURIComponent(language)}&q=${q}&key=${key}`;
    const searchRes = await fetch(searchUrl, { signal });
    if (!searchRes.ok) {
      console.error("[YouTube] search falló:", searchRes.status, await searchRes.text().catch(() => ""));
      return [];
    }
    const search = (await searchRes.json()) as {
      items?: { id?: { videoId?: string }; snippet?: { title?: string } }[];
    };
    const videos = (search.items ?? [])
      .map((v) => ({ id: v.id?.videoId, title: v.snippet?.title ?? "" }))
      .filter((v): v is { id: string; title: string } => Boolean(v.id));

    // 2) Pull top comments per video.
    const out: YoutubeComment[] = [];
    for (const v of videos) {
      const commentsUrl =
        `${API}/commentThreads?part=snippet&videoId=${v.id}&maxResults=20` +
        `&order=relevance&textFormat=plainText&key=${key}`;
      const cRes = await fetch(commentsUrl, { signal });
      if (!cRes.ok) continue; // comments disabled / error → skip this video
      const c = (await cRes.json()) as {
        items?: {
          id: string;
          snippet: {
            topLevelComment: {
              snippet: { textDisplay: string; authorDisplayName: string; likeCount?: number };
            };
          };
        }[];
      };
      for (const item of c.items ?? []) {
        const s = item.snippet.topLevelComment.snippet;
        const text = (s.textDisplay ?? "").trim();
        if (text.length < 20) continue; // ignore "👍", "first", etc.
        if (!looksLikeComplaint(text)) continue; // keep only complaint-like comments
        out.push({
          text: text.slice(0, 400),
          author: `@${s.authorDisplayName}`,
          videoTitle: v.title,
          url: `https://www.youtube.com/watch?v=${v.id}&lc=${item.id}`,
          likeCount: s.likeCount ?? 0,
        });
      }
    }

    // Keep the most-engaged complaint comments to bound the prompt size and stay fast.
    return out.sort((a, b) => b.likeCount - a.likeCount).slice(0, 18);
  } catch (err) {
    console.error("[YouTube] ingestion error:", err);
    return [];
  }
}
