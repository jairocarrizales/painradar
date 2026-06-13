/** Search configuration: languages (with target regions) and selectable sources. */

export interface LanguageOption {
  code: string;
  label: string; // Spanish label
  /** Where to look for complaints in this language (Spanish description, used in the agent prompt). */
  regions: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    code: "es",
    label: "Español",
    regions:
      "España, México, Argentina, Colombia, Chile, Perú y el resto de Latinoamérica",
  },
  {
    code: "en",
    label: "Inglés",
    regions: "Estados Unidos, Reino Unido, Canadá, Australia e Irlanda",
  },
  {
    code: "pt",
    label: "Portugués",
    regions: "Brasil y Portugal",
  },
  {
    code: "fr",
    label: "Francés",
    regions: "Francia, Canadá (Quebec), Bélgica y Suiza francófona",
  },
  {
    code: "it",
    label: "Italiano",
    regions: "Italia y Suiza italiana",
  },
  {
    code: "de",
    label: "Alemán",
    regions: "Alemania, Austria y Suiza alemana",
  },
];

export const DEFAULT_LANGUAGE = "es";

export function languageLabel(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.label ?? code;
}

export function languageRegions(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.regions ?? "";
}

export interface SourceOption {
  id: string;
  label: string;
  domain: string;
  /** Tailwind background token (without the bg- prefix) for the badge. */
  tone: string;
}

/** User-selectable places to search. */
export const SOURCES: SourceOption[] = [
  { id: "reddit", label: "Reddit", domain: "reddit.com", tone: "pop-orange" },
  { id: "youtube", label: "YouTube", domain: "youtube.com", tone: "pop-red" },
  { id: "trustpilot", label: "Trustpilot", domain: "trustpilot.com", tone: "pop-lime" },
  { id: "googleplay", label: "Google Play", domain: "play.google.com", tone: "pop-cyan" },
  { id: "appstore", label: "App Store", domain: "apps.apple.com", tone: "pop-violet" },
  { id: "g2", label: "G2", domain: "g2.com", tone: "pop-pink" },
  { id: "capterra", label: "Capterra", domain: "capterra.com", tone: "brand" },
  { id: "trustradius", label: "TrustRadius", domain: "trustradius.com", tone: "pop-lime" },
  { id: "producthunt", label: "Product Hunt", domain: "producthunt.com", tone: "pop-orange" },
  { id: "appsumo", label: "AppSumo", domain: "appsumo.com", tone: "pop-cyan" },
];

/** All source ids plus a "web" fallback for citations from elsewhere. */
export const SOURCE_IDS = [...SOURCES.map((s) => s.id), "web"] as const;

export const DEFAULT_SOURCES = ["reddit", "youtube", "trustpilot", "appstore", "googleplay"];

export function sourceLabel(id: string): string {
  if (id === "web") return "Web";
  return SOURCES.find((s) => s.id === id)?.label ?? id;
}

export function sourceTone(id: string): string {
  if (id === "web") return "white";
  return SOURCES.find((s) => s.id === id)?.tone ?? "white";
}

/** Spanish, human description of the selected sources for the agent prompt. */
export function sourcesDescription(ids: string[]): string {
  return ids
    .map((id) => {
      const s = SOURCES.find((x) => x.id === id);
      return s ? `${s.label} (${s.domain})` : id;
    })
    .join(", ");
}
