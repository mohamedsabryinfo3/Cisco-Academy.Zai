"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Search,
  GraduationCap,
  Stethoscope,
  Server,
  ClipboardList,
  Star,
  Info,
  Terminal,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/cisco/theme-toggle";
import { CommandDetailDialog } from "@/components/cisco/command-detail-dialog";
import {
  DashboardView,
  LibraryView,
  StudyPathView,
  TroubleshootingView,
  PlatformsView,
  AuditView,
  FavoritesView,
  AboutView,
} from "@/components/cisco/views";
import { useUserStore } from "@/store/user-store";
import { COMMANDS, computeAuditStats } from "@/lib/cisco-helpers";
import type { CiscoCommand } from "@/lib/cisco-types";

type ViewId =
  | "dashboard"
  | "library"
  | "study"
  | "troubleshoot"
  | "platforms"
  | "audit"
  | "favorites"
  | "about";

interface NavItem {
  id: ViewId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function Page() {
  const [view, setView] = useState<ViewId>("dashboard");
  const [activeCommand, setActiveCommand] = useState<CiscoCommand | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const favorites = useUserStore((s) => s.favorites);
  const addRecentlyViewed = useUserStore((s) => s.addRecentlyViewed);
  const stats = computeAuditStats();

  const openCommand = (cmd: CiscoCommand) => {
    setActiveCommand(cmd);
    addRecentlyViewed(cmd.id);
    setDialogOpen(true);
  };

  const navItems: NavItem[] = [
    { id: "dashboard", label: "الرئيسية", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "library", label: "المكتبة والبحث", icon: <Search className="h-4 w-4" /> },
    { id: "study", label: "مسار المذاكرة", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "troubleshoot", label: "استكشاف الأعطال", icon: <Stethoscope className="h-4 w-4" /> },
    { id: "platforms", label: "المنصات", icon: <Server className="h-4 w-4" /> },
    {
      id: "audit",
      label: "لوحة التدقيق",
      icon: <ClipboardList className="h-4 w-4" />,
      badge: `${stats.totalCommands}`,
    },
    {
      id: "favorites",
      label: "المفضلة والملاحظات",
      icon: <Star className="h-4 w-4" />,
      badge: favorites.length > 0 ? `${favorites.length}` : undefined,
    },
    { id: "about", label: "حول والمصادر", icon: <Info className="h-4 w-4" /> },
  ];

  const handleNavigate = (v: string) => {
    setView(v as ViewId);
    setMobileOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="flex h-14 items-center gap-3 px-4">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex h-full flex-col">
                <div className="h-14 border-b flex items-center px-4 gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  <span className="font-bold text-sm">Cisco Academy</span>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto scroll-cisco">
                  {navItems.map((item) => (
                    <NavButton
                      key={item.id}
                      item={item}
                      active={view === item.id}
                      onClick={() => handleNavigate(item.id)}
                    />
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <button
            onClick={() => handleNavigate("dashboard")}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Terminal className="h-4 w-4" />
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-sm font-bold leading-tight">Cisco Commands Academy</div>
              <div className="text-[10px] text-muted-foreground leading-tight">
                Professional Networking Reference
              </div>
            </div>
          </button>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] font-mono">
              {COMMANDS.length} أمر
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 ml-1.5" />
              {stats.verified} موثّق
            </Badge>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main layout: sidebar + content */}
      <div className="flex-1 flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-60 shrink-0 border-l bg-card/40 flex-col">
          <nav className="flex-1 p-3 space-y-1 sticky top-14">
            {navItems.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={view === item.id}
                onClick={() => handleNavigate(item.id)}
              />
            ))}
          </nav>
          <div className="p-3 border-t text-[10px] text-muted-foreground leading-5">
            <div className="mb-1">
              <span dir="ltr" className="font-mono">v2.0</span> · آخر تحديث{" "}
              <span dir="ltr" className="font-mono">{stats.lastReviewed}</span>
            </div>
            <div>مرجع تعليمي غير رسمي.</div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            {view === "dashboard" && (
              <DashboardView onOpenCommand={openCommand} onNavigate={handleNavigate} />
            )}
            {view === "library" && <LibraryView onOpenCommand={openCommand} />}
            {view === "study" && <StudyPathView onOpenCommand={openCommand} />}
            {view === "troubleshoot" && <TroubleshootingView onOpenCommand={openCommand} />}
            {view === "platforms" && <PlatformsView />}
            {view === "audit" && <AuditView />}
            {view === "favorites" && <FavoritesView onOpenCommand={openCommand} />}
            {view === "about" && <AboutView />}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t bg-card/40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>
            Cisco Commands Academy — مرجع عملي لأوامر Cisco CLI.
          </div>
          <div className="flex items-center gap-3">
            <span>
              النطاق: IOS XE 17.x · CCNA · CCNP ENCOR/ENARSI
            </span>
            <span className="hidden sm:inline">·</span>
            <span dir="ltr" className="font-mono">{stats.lastReviewed}</span>
          </div>
        </div>
      </footer>

      {/* Command detail dialog */}
      <CommandDetailDialog
        command={activeCommand}
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setActiveCommand(null);
        }}
      />
    </div>
  );
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-right " +
        (active
          ? "bg-primary text-primary-foreground"
          : "text-foreground/80 hover:bg-muted")
      }
    >
      <span className="shrink-0">{item.icon}</span>
      <span className="flex-1 text-right">{item.label}</span>
      {item.badge && (
        <Badge
          variant={active ? "secondary" : "outline"}
          className="text-[10px] px-1.5 py-0 h-4 min-w-4"
        >
          {item.badge}
        </Badge>
      )}
    </button>
  );
}
