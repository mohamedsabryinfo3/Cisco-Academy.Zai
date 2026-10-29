import type { Metadata } from "next";
import { Cairo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

// Cairo is the primary UI font for both Arabic and Latin glyphs.
// next/font/google self-hosts it at build time, so the site does NOT
// depend on a runtime CDN — fonts are served from the same origin.
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Monospace for CLI code blocks — keeps ASCII art and command output aligned.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cisco Commands Academy — موسوعة أوامر Cisco التفاعلية",
  description:
    "موسوعة تفاعلية لأوامر Cisco CLI باللغة العربية مع الاحتفاظ بالمصطلحات التقنية الإنجليزية. تغطي أساسيات الشبكات، CCNA، CCNP Enterprise (ENCOR + ENARSI)، مع مكتبة أوامر تاريخية وملغاة، ومحرك بحث دقيق، ولوحة تدقيق حقيقية للتغطية.",
  keywords: [
    "Cisco",
    "CCNA",
    "CCNP",
    "ENCOR",
    "ENARSI",
    "IOS XE",
    "CLI",
    "شبكات",
    "أوامر",
    "مرجع",
    "عربي",
  ],
  authors: [{ name: "Cisco Commands Academy" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
