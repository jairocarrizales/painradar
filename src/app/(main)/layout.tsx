import Link from "next/link";
import { Heart, History } from "lucide-react";
import { Logo } from "@/shared/components/logo";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b-3 border-ink bg-paper/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/historial"
              className="brutal-btn bg-white text-ink px-4 py-2 text-sm"
            >
              <History className="w-4 h-4" /> Historial
            </Link>
            <Link
              href="/favorites"
              className="brutal-btn bg-white text-ink px-4 py-2 text-sm"
            >
              <Heart className="w-4 h-4" /> Favoritos
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t-3 border-ink py-4 text-center text-sm font-medium text-ink/60">
        <Link href="/metodologia" className="underline decoration-2 underline-offset-2 hover:text-pop-pink">
          Cómo se calcula la puntuación
        </Link>
        <span className="mx-2">·</span>
        PainRadar — quejas reales entran, ideas validadas salen.
      </footer>
    </div>
  );
}
