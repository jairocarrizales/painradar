import {
  Gem,
  Star,
  TrendingDown,
  Clock,
  Heart,
  ThumbsDown,
  Lightbulb,
  Store,
  ExternalLink,
} from "lucide-react";
import type { AppInfo, IntelReview, NicheIntel } from "@/shared/types/domain";

function AppRow({ app, highlight }: { app: AppInfo; highlight?: boolean }) {
  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-between gap-2 border-3 border-ink rounded-brutal p-2.5 shadow-brutal-sm hover:-translate-y-0.5 transition-transform ${
        highlight ? "bg-pop-lime/50" : "bg-white"
      }`}
    >
      <div className="min-w-0">
        <p className="font-extrabold text-sm truncate">{app.name}</p>
        <p className="text-xs font-medium text-ink/55 truncate">
          {app.developer} · {app.price}
          {app.abandoned ? " · ⚠️ sin actualizar" : ""}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0 font-mono font-extrabold text-sm">
        <Star className="w-4 h-4 fill-brand" />
        {app.rating}
        <span className="text-ink/50 font-sans font-bold ml-1">
          ({app.ratingCount.toLocaleString("es")})
        </span>
      </div>
    </a>
  );
}

function ReviewList({ items, lang }: { items: IntelReview[]; lang: "love" | "hate" | "ask" }) {
  const tone =
    lang === "love" ? "bg-pop-lime/40" : lang === "hate" ? "bg-pop-red/30" : "bg-pop-cyan/30";
  return (
    <div className="space-y-2">
      {items.slice(0, 4).map((r, i) => (
        <a
          key={i}
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block border-2 border-ink rounded-brutal p-2 ${tone} hover:-translate-y-0.5 transition-transform`}
        >
          <p className="text-xs font-medium leading-snug">
            {r.rating}★ &ldquo;{r.text.slice(0, 120)}&rdquo;
          </p>
          <p className="text-[10px] font-bold text-ink/50 mt-1">{r.appName}</p>
        </a>
      ))}
    </div>
  );
}

export function NicheIntelPanel({ intel }: { intel: NicheIntel }) {
  const hasAny =
    intel.gems.length || intel.signals.length || intel.apps.length || intel.loves.length ||
    intel.hates.length || intel.requests.length;
  if (!hasAny) return null;

  return (
    <div className="brutal-card p-5 space-y-5">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-9 h-9 bg-pop-violet border-3 border-ink rounded-brutal shadow-brutal-sm">
          <Store className="w-5 h-5" />
        </span>
        <h3 className="font-extrabold text-lg">
          Inteligencia del nicho{" "}
          <span className="text-sm font-bold text-ink/50">· App Store {intel.country.toUpperCase()}</span>
        </h3>
      </div>

      {/* Joyas: 100-300 reseñas, muy bien calificadas */}
      {intel.gems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Gem className="w-5 h-5" />
            <h4 className="font-extrabold">Joyas del nicho</h4>
            <span className="brutal-tag bg-pop-lime text-[10px]">100-300 reseñas · ≥4.5★</span>
          </div>
          <p className="text-xs font-medium text-ink/60 mb-2">
            Concepto validado (usuarios felices) pero pequeñas/poco conocidas = oportunidad con poca competencia.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {intel.gems.map((a) => (
              <AppRow key={a.id} app={a} highlight />
            ))}
          </div>
        </div>
      )}

      {/* Señales de oportunidad */}
      {intel.signals.length > 0 && (
        <div>
          <h4 className="font-extrabold mb-2">Señales de oportunidad</h4>
          <div className="space-y-2">
            {intel.signals.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-2 border-3 border-ink rounded-brutal p-2.5 bg-pop-orange/40 shadow-brutal-sm"
              >
                {s.type === "demanda" ? (
                  <TrendingDown className="w-4 h-4 mt-0.5 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                )}
                <p className="text-sm font-medium">
                  <span className="font-extrabold">{s.appName}:</span> {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fichas de apps */}
      {intel.apps.length > 0 && (
        <div>
          <h4 className="font-extrabold mb-2">Apps del nicho</h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {intel.apps.map((a) => (
              <AppRow key={a.id} app={a} />
            ))}
          </div>
        </div>
      )}

      {/* Aman / Odian / Piden */}
      {(intel.loves.length > 0 || intel.hates.length > 0 || intel.requests.length > 0) && (
        <div className="grid md:grid-cols-3 gap-3">
          {intel.loves.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2 font-extrabold text-sm">
                <Heart className="w-4 h-4 fill-pop-pink" /> Lo que aman
              </div>
              <ReviewList items={intel.loves} lang="love" />
            </div>
          )}
          {intel.hates.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2 font-extrabold text-sm">
                <ThumbsDown className="w-4 h-4" /> Lo que odian
              </div>
              <ReviewList items={intel.hates} lang="hate" />
            </div>
          )}
          {intel.requests.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2 font-extrabold text-sm">
                <Lightbulb className="w-4 h-4" /> Lo que piden
              </div>
              <ReviewList items={intel.requests} lang="ask" />
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] font-medium text-ink/40 flex items-center gap-1">
        <ExternalLink className="w-3 h-3" /> Datos oficiales de Apple (iTunes). Toca una app o reseña
        para abrirla.
      </p>
    </div>
  );
}
