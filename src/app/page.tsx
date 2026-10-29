"use client";

import { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Search,
  Network,
  Server,
  Boxes,
  Layers,
  Route,
  Share2,
  ArrowLeftRight,
  Stethoscope,
  ChevronLeft,
  Menu,
  X,
  Terminal,
  BookOpen,
  Target,
  ClipboardList,
  Star,
  Info,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/cisco/theme-toggle";
import { CommandDetailDialog } from "@/components/cisco/command-detail-dialog";
import {
  SectionOverview,
  TopicView,
  TaskView,
} from "@/components/encyclopedia/content-view";
import { DashboardView, LibraryView, AuditView, FavoritesView, AboutView, StudyPathView, TroubleshootingView, PlatformsView } from "@/components/cisco/views";
import {
  ENCYCLOPEDIA,
  getAllTasks,
  getEncyclopediaStats,
  type Section,
  type Chapter,
  type Topic,
  type FlatTask,
} from "@/lib/encyclopedia-data";
import { COMMANDS, filterAndScore, computeAuditStats, DEFAULT_FILTERS, type SearchFilters } from "@/lib/cisco-helpers";
import type { CiscoCommand } from "@/lib/cisco-types";
import { useUserStore } from "@/store/user-store";

// ===================================================================
// Icon resolver — يحول اسم الأيقونة إلى مكون
// ===================================================================
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Network,
  Server,
  Boxes,
  Layers,
  Route,
  Share2,
  ArrowLeftRight,
  Stethoscope,
};

type View =
  | { type: "dashboard" }
  | { type: "library" }
  | { type: "study" }
  | { type: "troubleshoot" }
  | { type: "platforms" }
  | { type: "audit" }
  | { type: "favorites" }
  | { type: "about" }
  | { type: "section"; section: Section }
  | { type: "topic"; topic: Topic; section: Section; chapter: Chapter }
  | { type: "task"; task: FlatTask };

export default function Page() {
  const [view, setView] = useState<View>({ type: "dashboard" });
  const [activeCommand, setActiveCommand] = useState<CiscoCommand | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const stats = useMemo(() => getEncyclopediaStats(), []);
  const auditStats = useMemo(() => computeAuditStats(), []);
  const favorites = useUserStore((s) => s.favorites);

  const openCommand = (cmd: CiscoCommand) => {
    setActiveCommand(cmd);
    setDialogOpen(true);
  };

  const navigate = (v: View) => {
    setView(v);
    setMobileNavOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navItems: { label: string; icon: React.ReactNode; view: View; badge?: string }[] = [
    { label: "الرئيسية", icon: <LayoutDashboard className="h-4 w-4" />, view: { type: "dashboard" } },
    { label: "مكتبة الأوامر", icon: <Search className="h-4 w-4" />, view: { type: "library" }, badge: `${COMMANDS.length}` },
    { label: "مسار المذاكرة", icon: <Target className="h-4 w-4" />, view: { type: "study" } },
    { label: "استكشاف الأعطال", icon: <Stethoscope className="h-4 w-4" />, view: { type: "troubleshoot" } },
    { label: "المنصات", icon: <Server className="h-4 w-4" />, view: { type: "platforms" } },
    { label: "لوحة التدقيق", icon: <ClipboardList className="h-4 w-4" />, view: { type: "audit" }, badge: `${stats.totalTasks + COMMANDS.length}` },
    { label: "المفضلة والملاحظات", icon: <Star className="h-4 w-4" />, view: { type: "favorites" }, badge: favorites.length > 0 ? `${favorites.length}` : undefined },
    { label: "حول والمصادر", icon: <Info className="h-4 w-4" />, view: { type: "about" } },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="flex h-14 items-center gap-3 px-4">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <NavContent
                view={view}
                navigate={navigate}
                navItems={navItems}
                stats={stats}
              />
            </SheetContent>
          </Sheet>

          <button onClick={() => navigate({ type: "dashboard" })} className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Terminal className="h-4 w-4" />
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-sm font-bold leading-tight">Cisco Academy</div>
              <div className="text-[10px] text-muted-foreground leading-tight">موسوعة الشبكات التفاعلية</div>
            </div>
          </button>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] font-mono">{COMMANDS.length} أمر</Badge>
            <Badge variant="outline" className="text-[10px]">{stats.totalTasks} مهمة</Badge>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-72 shrink-0 border-l bg-card/40 flex-col">
          <NavContent
            view={view}
            navigate={navigate}
            navItems={navItems}
            stats={stats}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <ScrollArea className="h-[calc(100vh-3.5rem)]">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
              {view.type === "dashboard" && (
                <DashboardView
                  onOpenCommand={openCommand}
                  onNavigate={(v) => {
                    const navItem = navItems.find(n => n.label === v);
                    if (navItem) navigate(navItem.view);
                  }}
                />
              )}
              {view.type === "library" && <LibraryView onOpenCommand={openCommand} />}
              {view.type === "study" && <StudyPathView onOpenCommand={openCommand} />}
              {view.type === "troubleshoot" && <TroubleshootingView onOpenCommand={openCommand} />}
              {view.type === "platforms" && <PlatformsView />}
              {view.type === "audit" && <AuditView />}
              {view.type === "favorites" && <FavoritesView onOpenCommand={openCommand} />}
              {view.type === "about" && <AboutView />}
              {view.type === "section" && (
                <SectionOverview
                  section={view.section}
                  onSelectTopic={(topic, section, chapter) => navigate({ type: "topic", topic, section, chapter })}
                />
              )}
              {view.type === "topic" && (
                <TopicView
                  topic={view.topic}
                  onSelectTask={(task) => navigate({ type: "task", task: { ...task, sectionTitle: view.section.title, chapterTitle: view.chapter.title, topicTitle: view.topic.title } })}
                />
              )}
              {view.type === "task" && <TaskView task={view.task} />}
            </div>
          </ScrollArea>
        </main>
      </div>

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

// ===================================================================
// NavContent — محتوى الشريط الجانبي
// ===================================================================
function NavContent({
  view,
  navigate,
  navItems,
  stats,
}: {
  view: View;
  navigate: (v: View) => void;
  navItems: { label: string; icon: React.ReactNode; view: View; badge?: string }[];
  stats: ReturnType<typeof getEncyclopediaStats>;
}) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isActive = (v: View): boolean => {
    if (view.type !== v.type) return false;
    if (view.type === "section" && v.type === "section") return view.section.id === v.section.id;
    return view.type === v.type;
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <nav className="p-3 space-y-1">
          {/* روابط التنقل الرئيسية */}
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.view)}
              className={
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-right " +
                (isActive(item.view)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/80 hover:bg-muted")
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="flex-1 text-right">{item.label}</span>
              {item.badge && (
                <Badge variant={isActive(item.view) ? "secondary" : "outline"} className="text-[10px] px-1.5 py-0 h-4 min-w-4">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* فاصل */}
        <div className="px-3 py-2">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-1">
            موسوعة الشبكات
          </div>
        </div>

        {/* أقسام الموسوعة الهرمية */}
        <div className="px-3 pb-3 space-y-0.5">
          {ENCYCLOPEDIA.map((section) => {
            const SectionIcon = ICONS[section.icon] || BookOpen;
            const isExpanded = expandedSections.has(section.id);
            const isSectionActive = view.type === "section" && view.section.id === section.id;
            const isTopicActive = view.type === "topic" && view.section?.id === section.id;

            return (
              <div key={section.id}>
                <button
                  onClick={() => {
                    toggleSection(section.id);
                    navigate({ type: "section", section });
                  }}
                  className={
                    "w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors text-right " +
                    (isSectionActive || isTopicActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/70 hover:bg-muted")
                  }
                >
                  <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold bg-primary/10 text-primary">
                    {section.letter}
                  </span>
                  <span className="flex-1 text-right text-[13px]">{section.title}</span>
                  <ChevronLeft className={"h-3.5 w-3.5 shrink-0 transition-transform " + (isExpanded ? "-rotate-90" : "")} />
                </button>

                {/* الفصول القابلة للطي */}
                {isExpanded && (
                  <div className="mr-5 mt-0.5 space-y-0.5 border-r border-border pr-2">
                    {section.chapters.map((chapter) => {
                      const isChapterActive = view.type === "topic" && view.chapter?.id === chapter.id;
                      return (
                        <button
                          key={chapter.id}
                          onClick={() => {
                            if (chapter.topics[0]) {
                              navigate({ type: "topic", topic: chapter.topics[0], section, chapter });
                            }
                          }}
                          className={
                            "w-full flex items-center gap-2 px-2 py-1 rounded text-[12px] transition-colors text-right " +
                            (isChapterActive
                              ? "text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50")
                          }
                        >
                          <Hash className="h-3 w-3 shrink-0 opacity-50" />
                          <span className="flex-1 text-right">{chapter.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t text-[10px] text-muted-foreground leading-5">
        <div className="mb-1">
          <span dir="ltr" className="font-mono">v3.0</span> · موسوعة احترافية
        </div>
        <div>
          {stats.totalSections} أقسام · {stats.totalChapters} فصول · {stats.totalTasks} مهام عملية
        </div>
      </div>
    </div>
  );
}
