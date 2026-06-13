import type { Citation, Opportunity, SearchFilters } from "@/shared/types/domain";
import { SOURCES } from "@/features/search/options";

/**
 * Mock opportunities for DATA-less demo / agent fallback. Bilingual: when the
 * search language is Spanish, content shows in Spanish; otherwise it shows the
 * original (English here) plus a Spanish translation. Citations use the selected
 * sources so the demo reflects the chosen places to search.
 */

interface BiText {
  en: string;
  es: string;
}

interface Template {
  title: BiText;
  summary: BiText;
  scores: { pain: number; frequency: number; marketGap: number };
  appName: string;
  pitch: BiText;
  features: BiText[];
  quotes: BiText[];
}

const TEMPLATES: Template[] = [
  {
    title: {
      en: "Existing tools are bloated and overwhelming",
      es: "Las herramientas actuales están sobrecargadas y abruman",
    },
    summary: {
      en: "Users in this space feel current apps are crammed with features they don't need, making simple tasks slow.",
      es: "Los usuarios sienten que las apps actuales están repletas de funciones que no necesitan, y eso vuelve lento lo simple.",
    },
    scores: { pain: 78, frequency: 84, marketGap: 58 },
    appName: "JustEnough",
    pitch: {
      en: "A radically simple alternative that does the one core job fast and nothing else.",
      es: "Una alternativa radicalmente simple que hace lo esencial rápido y nada más.",
    },
    features: [
      { en: "One-job focus", es: "Enfoque en una sola tarea" },
      { en: "Zero onboarding", es: "Sin configuración inicial" },
      { en: "Instant value", es: "Valor inmediato" },
    ],
    quotes: [
      {
        en: "Every app for this is so bloated now. I just want the one thing it used to do well.",
        es: "Cada app para esto está tan sobrecargada ahora. Solo quiero lo único que antes hacía bien.",
      },
      {
        en: "I spend more time fighting the interface than getting the actual task done.",
        es: "Paso más tiempo peleando con la interfaz que haciendo la tarea en sí.",
      },
    ],
  },
  {
    title: {
      en: "Pricing feels predatory and opaque",
      es: "Los precios se sienten abusivos y poco claros",
    },
    summary: {
      en: "People complain about surprise charges, aggressive upsells, and unclear what the paid tier unlocks.",
      es: "La gente se queja de cobros sorpresa, ventas agresivas y poca claridad sobre qué desbloquea el plan de pago.",
    },
    scores: { pain: 85, frequency: 74, marketGap: 52 },
    appName: "FairTier",
    pitch: {
      en: "Transparent flat pricing with every feature shown up front and no dark patterns.",
      es: "Precio plano transparente, con todas las funciones a la vista y sin trucos.",
    },
    features: [
      { en: "Flat honest pricing", es: "Precio plano y honesto" },
      { en: "No upsell nags", es: "Sin ventas insistentes" },
      { en: "Cancel anytime", es: "Cancela cuando quieras" },
    ],
    quotes: [
      {
        en: "They charged me again after I cancelled. Had to fight for a refund for weeks.",
        es: "Me cobraron otra vez tras cancelar. Tuve que pelear semanas por el reembolso.",
      },
      {
        en: "The 'free' plan is useless and the paywall hits you the second you try anything.",
        es: "El plan 'gratis' es inútil y el muro de pago aparece apenas intentas algo.",
      },
    ],
  },
  {
    title: {
      en: "No good offline / privacy-first option exists",
      es: "No existe una buena opción offline / centrada en privacidad",
    },
    summary: {
      en: "Users distrust cloud-only tools that harvest data and want something that works offline and keeps data local.",
      es: "Los usuarios desconfían de apps solo-nube que recopilan datos y quieren algo que funcione offline y guarde los datos localmente.",
    },
    scores: { pain: 72, frequency: 66, marketGap: 71 },
    appName: "LocalFirst",
    pitch: {
      en: "Works fully offline, stores data on-device, and syncs only when you choose.",
      es: "Funciona totalmente offline, guarda los datos en el dispositivo y sincroniza solo cuando tú decides.",
    },
    features: [
      { en: "Offline-first", es: "Offline primero" },
      { en: "On-device storage", es: "Datos en el dispositivo" },
      { en: "Optional encrypted sync", es: "Sync cifrado opcional" },
    ],
    quotes: [
      {
        en: "Why does a simple app need my account, my contacts, and an internet connection?",
        es: "¿Por qué una app simple necesita mi cuenta, mis contactos y conexión a internet?",
      },
    ],
  },
  {
    title: {
      en: "Onboarding is confusing and people bounce",
      es: "La primera experiencia confunde y la gente abandona",
    },
    summary: {
      en: "New users can't figure out how to get their first result quickly and abandon within minutes.",
      es: "Los usuarios nuevos no logran obtener su primer resultado rápido y abandonan en minutos.",
    },
    scores: { pain: 68, frequency: 79, marketGap: 46 },
    appName: "FirstWin",
    pitch: {
      en: "Gets a brand-new user to their first real result in under 60 seconds.",
      es: "Lleva a un usuario nuevo a su primer resultado real en menos de 60 segundos.",
    },
    features: [
      { en: "Guided first win", es: "Primer logro guiado" },
      { en: "No empty screens", es: "Sin pantallas vacías" },
      { en: "Progress checklist", es: "Checklist de progreso" },
    ],
    quotes: [
      {
        en: "I opened it, had no idea what to do, and deleted it five minutes later.",
        es: "La abrí, no tenía idea de qué hacer y la borré cinco minutos después.",
      },
    ],
  },
  {
    title: {
      en: "Customer support is slow or non-existent",
      es: "El soporte es lento o inexistente",
    },
    summary: {
      en: "Users are frustrated by unanswered tickets and bots that loop; they want fast, human, helpful support.",
      es: "Los usuarios se frustran con tickets sin respuesta y bots que dan vueltas; quieren soporte humano, rápido y útil.",
    },
    scores: { pain: 80, frequency: 69, marketGap: 54 },
    appName: "RealReply",
    pitch: {
      en: "A support layer that guarantees a useful human answer within hours, not days.",
      es: "Una capa de soporte que garantiza una respuesta humana útil en horas, no días.",
    },
    features: [
      { en: "Human-first support", es: "Soporte humano primero" },
      { en: "Honest wait times", es: "Tiempos de espera honestos" },
      { en: "Resolution tracking", es: "Seguimiento de la solución" },
    ],
    quotes: [
      {
        en: "Three weeks and still no reply. The chatbot just keeps sending me articles.",
        es: "Tres semanas y sin respuesta. El chatbot solo me manda artículos.",
      },
    ],
  },
  {
    title: { en: "Data is trapped — no easy export", es: "Tus datos quedan atrapados — sin exportación fácil" },
    summary: {
      en: "People feel locked in because they can't export their own data to switch tools or keep a backup.",
      es: "La gente se siente atrapada porque no puede exportar sus propios datos para cambiar de app o respaldar.",
    },
    scores: { pain: 74, frequency: 62, marketGap: 67 },
    appName: "FreeExport",
    pitch: {
      en: "Your data, always one tap away in open formats. Switch in, switch out, no hostages.",
      es: "Tus datos, siempre a un toque en formatos abiertos. Entra y sal sin rehenes.",
    },
    features: [
      { en: "One-tap export", es: "Exportar con un toque" },
      { en: "Open formats", es: "Formatos abiertos" },
      { en: "Full data ownership", es: "Propiedad total de tus datos" },
    ],
    quotes: [
      {
        en: "I want to leave but all my history is trapped with no way to get it out.",
        es: "Quiero irme pero todo mi historial está atrapado sin forma de sacarlo.",
      },
    ],
  },
  {
    title: { en: "Notifications are noisy and can't be tuned", es: "Las notificaciones son ruidosas y no se pueden ajustar" },
    summary: {
      en: "Apps spam users with irrelevant alerts and offer all-or-nothing controls, so people mute everything.",
      es: "Las apps saturan con alertas irrelevantes y solo ofrecen control de todo-o-nada, así que la gente silencia todo.",
    },
    scores: { pain: 64, frequency: 76, marketGap: 49 },
    appName: "QuietSmart",
    pitch: {
      en: "Granular, smart notifications that learn what you actually care about.",
      es: "Notificaciones inteligentes y granulares que aprenden lo que de verdad te importa.",
    },
    features: [
      { en: "Per-type controls", es: "Control por tipo" },
      { en: "Smart batching", es: "Agrupado inteligente" },
      { en: "Do-not-disturb that works", es: "No molestar que sí funciona" },
    ],
    quotes: [
      {
        en: "It pings me twenty times a day for nothing. I had to turn off all notifications.",
        es: "Me avisa veinte veces al día por nada. Tuve que apagar todas las notificaciones.",
      },
    ],
  },
  {
    title: { en: "Mobile experience is an afterthought", es: "La experiencia móvil es un descuido" },
    summary: {
      en: "The web tool is decent but the mobile app is buggy or missing key features, frustrating on-the-go users.",
      es: "La versión web es decente pero la app móvil tiene fallos o le faltan funciones clave, y frustra al usuario en movimiento.",
    },
    scores: { pain: 70, frequency: 72, marketGap: 57 },
    appName: "MobileFirst",
    pitch: {
      en: "A mobile-native experience that's faster and cleaner than the desktop incumbent.",
      es: "Una experiencia nativa móvil más rápida y limpia que la del escritorio dominante.",
    },
    features: [
      { en: "Native mobile UX", es: "UX móvil nativa" },
      { en: "Offline actions", es: "Acciones offline" },
      { en: "One-hand friendly", es: "Cómoda con una mano" },
    ],
    quotes: [
      {
        en: "The phone app crashes constantly and half the features just aren't there.",
        es: "La app del teléfono se cierra constantemente y la mitad de las funciones no están.",
      },
    ],
  },
  {
    title: { en: "Collaboration requires everyone to pay", es: "Colaborar exige que todos paguen" },
    summary: {
      en: "Teams can't adopt a tool because every collaborator needs a paid seat, killing low-friction sharing.",
      es: "Los equipos no pueden adoptar una app porque cada colaborador necesita una licencia de pago, lo que mata el compartir fácil.",
    },
    scores: { pain: 67, frequency: 63, marketGap: 62 },
    appName: "OpenInvite",
    pitch: {
      en: "Free collaborators, paid owners — share with anyone without a paywall in the way.",
      es: "Colaboradores gratis, dueños de pago — comparte con cualquiera sin muro de pago de por medio.",
    },
    features: [
      { en: "Free guest access", es: "Invitados gratis" },
      { en: "Frictionless sharing", es: "Compartir sin fricción" },
      { en: "Owner-only billing", es: "Cobro solo al dueño" },
    ],
    quotes: [
      {
        en: "I just want to share one thing with a friend, not buy them a whole subscription.",
        es: "Solo quiero compartir una cosa con un amigo, no comprarle una suscripción entera.",
      },
    ],
  },
  {
    title: { en: "Search inside the app is broken", es: "La búsqueda dentro de la app está rota" },
    summary: {
      en: "Users can't find their own content because in-app search is slow or returns irrelevant results.",
      es: "Los usuarios no encuentran su propio contenido porque la búsqueda interna es lenta o da resultados irrelevantes.",
    },
    scores: { pain: 69, frequency: 68, marketGap: 50 },
    appName: "FindFast",
    pitch: {
      en: "Instant, typo-tolerant search that actually finds the thing you remember.",
      es: "Búsqueda instantánea y tolerante a errores que sí encuentra lo que recuerdas.",
    },
    features: [
      { en: "Instant results", es: "Resultados instantáneos" },
      { en: "Typo tolerance", es: "Tolera errores de tipeo" },
      { en: "Search everything", es: "Busca en todo" },
    ],
    quotes: [
      {
        en: "I know the note exists but search never finds it. Useless.",
        es: "Sé que la nota existe pero la búsqueda nunca la encuentra. Inútil.",
      },
    ],
  },
  {
    title: { en: "Syncing across devices is unreliable", es: "La sincronización entre dispositivos falla" },
    summary: {
      en: "Changes don't show up on other devices, or conflicts overwrite work — users lose trust fast.",
      es: "Los cambios no aparecen en otros dispositivos, o los conflictos sobrescriben el trabajo — y se pierde la confianza rápido.",
    },
    scores: { pain: 75, frequency: 70, marketGap: 55 },
    appName: "SyncSure",
    pitch: {
      en: "Rock-solid sync with visible conflict resolution you can trust.",
      es: "Sincronización sólida con resolución de conflictos visible y confiable.",
    },
    features: [
      { en: "Reliable real-time sync", es: "Sync confiable en tiempo real" },
      { en: "Conflict history", es: "Historial de conflictos" },
      { en: "Never lose work", es: "Nunca pierdas trabajo" },
    ],
    quotes: [
      {
        en: "It overwrote an hour of work because sync got confused between my phone and laptop.",
        es: "Sobrescribió una hora de trabajo porque el sync se confundió entre mi teléfono y la laptop.",
      },
    ],
  },
  {
    title: { en: "Accessibility is ignored", es: "La accesibilidad está ignorada" },
    summary: {
      en: "People with vision, motor, or attention needs find the app unusable; basic a11y is missing.",
      es: "Personas con necesidades de visión, motoras o de atención encuentran la app inusable; falta accesibilidad básica.",
    },
    scores: { pain: 71, frequency: 58, marketGap: 69 },
    appName: "A11yReady",
    pitch: {
      en: "Designed accessible-first: large text, voice control, and full screen-reader support.",
      es: "Diseñada con accesibilidad primero: texto grande, control por voz y soporte total de lector de pantalla.",
    },
    features: [
      { en: "Screen-reader ready", es: "Compatible con lector de pantalla" },
      { en: "High-contrast mode", es: "Modo alto contraste" },
      { en: "Voice control", es: "Control por voz" },
    ],
    quotes: [
      {
        en: "The text is tiny and there's no way to make it bigger. I literally can't use it.",
        es: "El texto es diminuto y no hay forma de agrandarlo. Literalmente no puedo usarla.",
      },
    ],
  },
];

function pickSources(filters?: SearchFilters): string[] {
  const sel = filters?.sources?.length ? filters.sources : ["reddit", "youtube"];
  return sel.filter((s) => s !== "web");
}

function sourceDomain(id: string): string {
  return SOURCES.find((s) => s.id === id)?.domain ?? "example.com";
}

function buildCitations(
  niche: string,
  quotes: BiText[],
  lang: string,
  sources: string[],
  seed: number,
): Citation[] {
  const isEs = lang === "es";
  return quotes.map((q, i) => {
    const src = sources[(seed + i) % sources.length] ?? "reddit";
    const domain = sourceDomain(src);
    return {
      text: isEs ? q.es : q.en,
      textEs: isEs ? undefined : q.es,
      url: `https://${domain}/search?q=${encodeURIComponent(niche)}`,
      platform: src,
      author: src === "youtube" ? "@usuario" : "u/usuario",
      context: `${niche}`,
    };
  });
}

function composite(s: { pain: number; frequency: number; marketGap: number }): number {
  return Math.round(s.pain * 0.45 + s.frequency * 0.35 + s.marketGap * 0.2);
}

/** Produce >=10 ranked bilingual opportunities for a niche. Deterministic. */
export function mockOpportunities(niche: string, filters?: SearchFilters): Opportunity[] {
  const lang = filters?.language ?? "es";
  const isEs = lang === "es";
  const sources = pickSources(filters);
  const key = (niche || "este nicho").trim();

  const opportunities: Opportunity[] = TEMPLATES.map((t, i) => {
    const scores = t.scores;
    return {
      id: `opp_mock_${key.replace(/\s+/g, "-").toLowerCase()}_${i}`,
      lang,
      title: isEs ? t.title.es : t.title.en,
      titleEs: isEs ? undefined : t.title.es,
      problemSummary: isEs ? t.summary.es : t.summary.en,
      problemSummaryEs: isEs ? undefined : t.summary.es,
      scores,
      overall: composite(scores),
      appIdea: {
        name: t.appName,
        pitch: isEs ? t.pitch.es : t.pitch.en,
        pitchEs: isEs ? undefined : t.pitch.es,
        keyFeatures: t.features.map((f) => (isEs ? f.es : f.en)),
        keyFeaturesEs: isEs ? undefined : t.features.map((f) => f.es),
      },
      citations: buildCitations(key, t.quotes, lang, sources, i),
    };
  });

  return opportunities.sort((a, b) => b.overall - a.overall);
}

/** Quick-pick niches surfaced in the UI (kept for back-compat). */
export const SUGGESTED_NICHES = ["salud mental", "control de gastos", "apps de citas"] as const;
