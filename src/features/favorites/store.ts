"use client";

import { create } from "zustand";
import type { Opportunity } from "@/shared/types/domain";

interface FavoritesState {
  items: Record<string, Opportunity>;
  loaded: boolean;
  init: () => Promise<void>;
  toggle: (opp: Opportunity) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

/**
 * Favorites backed by the local SQLite store (via /api/favorites).
 * Optimistic updates with revert-on-failure. Single-user, no auth.
 */
export const useFavorites = create<FavoritesState>((set, get) => ({
  items: {},
  loaded: false,

  init: async () => {
    if (get().loaded) return;
    try {
      const res = await fetch("/api/favorites");
      const data = await res.json();
      const items: Record<string, Opportunity> = {};
      for (const o of (data.favorites ?? []) as Opportunity[]) items[o.id] = o;
      set({ items, loaded: true });
    } catch {
      set({ loaded: true });
    }
  },

  toggle: async (opp) => {
    const exists = Boolean(get().items[opp.id]);
    set((s) => {
      const next = { ...s.items };
      if (exists) delete next[opp.id];
      else next[opp.id] = opp;
      return { items: next };
    });
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunity: opp }),
      });
    } catch {
      set((s) => {
        const next = { ...s.items };
        if (exists) next[opp.id] = opp;
        else delete next[opp.id];
        return { items: next };
      });
    }
  },

  remove: async (id) => {
    const prev = get().items[id];
    set((s) => {
      const next = { ...s.items };
      delete next[id];
      return { items: next };
    });
    try {
      await fetch(`/api/favorites?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {
      if (prev) set((s) => ({ items: { ...s.items, [id]: prev } }));
    }
  },
}));
