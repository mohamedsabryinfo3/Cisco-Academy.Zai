"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useUserStore } from "@/store/user-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const userTheme = useUserStore((s) => s.theme);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={userTheme === "system"}
      forcedTheme={userTheme === "system" ? undefined : userTheme}
    >
      {children}
    </NextThemesProvider>
  );
}
