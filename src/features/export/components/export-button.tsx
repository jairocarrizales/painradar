"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import type { Opportunity } from "@/shared/types/domain";

interface ExportButtonProps {
  niche: string;
  opportunities: Opportunity[];
}

export function ExportButton({ niche, opportunities }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, opportunities }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `painradar-${niche.replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Sorry, the PDF export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading || opportunities.length === 0}
      className="brutal-btn bg-pop-violet text-ink px-4 py-2 text-sm"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
      {loading ? "Building PDF…" : "Export PDF"}
    </button>
  );
}
