"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ===================================================================
// User state: favorites, notes, study progress, recently viewed.
// All persisted to localStorage — no backend account required.
// ===================================================================

export type StudyStatus = "not-started" | "learning" | "practiced" | "mastered";

interface UserState {
  favorites: string[]; // command IDs
  notes: Record<string, string>; // commandId -> note text
  study: Record<string, StudyStatus>; // commandId -> status
  recentlyViewed: string[]; // command IDs, most recent first
  theme: "light" | "dark" | "system";

  toggleFavorite: (id: string) => void;
  setNote: (id: string, text: string) => void;
  setStudyStatus: (id: string, status: StudyStatus) => void;
  addRecentlyViewed: (id: string) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  resetAll: () => void;
}

const MAX_RECENT = 20;

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      favorites: [],
      notes: {},
      study: {},
      recentlyViewed: [],
      theme: "light",

      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),

      setNote: (id, text) =>
        set((s) => {
          const notes = { ...s.notes };
          if (text.trim() === "") {
            delete notes[id];
          } else {
            notes[id] = text;
          }
          return { notes };
        }),

      setStudyStatus: (id, status) =>
        set((s) => {
          const study = { ...s.study };
          if (status === "not-started") {
            delete study[id];
          } else {
            study[id] = status;
          }
          return { study };
        }),

      addRecentlyViewed: (id) =>
        set((s) => {
          const filtered = s.recentlyViewed.filter((x) => x !== id);
          return { recentlyViewed: [id, ...filtered].slice(0, MAX_RECENT) };
        }),

      setTheme: (theme) => set({ theme }),

      resetAll: () =>
        set({
          favorites: [],
          notes: {},
          study: {},
          recentlyViewed: [],
          theme: "light",
        }),
    }),
    {
      name: "cisco-academy-user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
