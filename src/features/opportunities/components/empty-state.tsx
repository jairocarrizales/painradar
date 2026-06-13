import { Radar, MousePointerClick, Quote, Trophy } from "lucide-react";

const STEPS = [
  { icon: MousePointerClick, label: "Elige un nicho", desc: "Escribe un tema o explóralo en el catálogo." },
  { icon: Quote, label: "Recolectamos quejas", desc: "Reseñas reales de las fuentes que elijas." },
  { icon: Trophy, label: "Oportunidades rankeadas", desc: "Por dolor, frecuencia y hueco de mercado." },
];

export function EmptyState() {
  return (
    <div className="brutal-card p-8 text-center">
      <span className="inline-flex items-center justify-center w-16 h-16 bg-brand border-3 border-ink rounded-brutal shadow-brutal mb-4">
        <Radar className="w-8 h-8" strokeWidth={2.5} />
      </span>
      <h2 className="text-2xl font-extrabold mb-2">Lanza tu primer barrido</h2>
      <p className="font-medium text-ink/70 max-w-md mx-auto mb-8">
        Escribe un nicho arriba (o explóralo en el catálogo) y PainRadar saca a la luz los
        problemas más dolorosos y menos resueltos que la gente real está reclamando — cada
        uno, una idea de app validada.
      </p>
      <div className="grid sm:grid-cols-3 gap-4 text-left">
        {STEPS.map((s, i) => (
          <div key={s.label} className="border-3 border-ink rounded-brutal p-4 bg-paper shadow-brutal-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-pop-cyan border-3 border-ink rounded-brutal font-mono font-extrabold">
                {i + 1}
              </span>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="font-extrabold">{s.label}</p>
            <p className="text-sm font-medium text-ink/70">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
