"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ===================================================================
// User state: favorites, notes, study progress, recently viewed.
//
// التخزين: localStorage (دائم على نفس المتصفح).
// للحفظ الدائم عبر الأجهزة: استخدم exportData / importData
// لتصدير كل البيانات إلى ملف JSON واستعادتها على أي جهاز.
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

  // تصدير/استيراد للحفظ الدائم عبر الأجهزة
  exportData: () => string;
  importData: (json: string) => boolean;
}

const MAX_RECENT = 20;

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
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

      // تصدير كل البيانات إلى JSON (للحفظ الدائم على ملف)
      exportData: () => {
        const s = get();
        const data = {
          version: 1,
          exportedAt: new Date().toISOString(),
          favorites: s.favorites,
          notes: s.notes,
          study: s.study,
        };
        return JSON.stringify(data, null, 2);
      },

      // استيراد البيانات من JSON (استعادة من ملف)
      importData: (json: string) => {
        try {
          const data = JSON.parse(json);
          if (typeof data !== "object" || data === null) return false;
          set({
            favorites: Array.isArray(data.favorites) ? data.favorites : [],
            notes: typeof data.notes === "object" && data.notes !== null ? data.notes : {},
            study: typeof data.study === "object" && data.study !== null ? data.study : {},
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "cisco-academy-user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
