"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Filter,
  BookOpen,
  Terminal,
  Stethoscope,
  GraduationCap,
  ShieldCheck,
  Server,
  Database,
  Star,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  CircleDashed,
  FileWarning,
  Layers,
  TrendingUp,
  Info,
  ExternalLink,
  RefreshCw,
  Lightbulb,
  Cpu,
  History,
  Download,
  Upload,
} from "lucide-react";
import {
  CommandCard,
} from "@/components/cisco/command-card";
import { CommandDetailDialog } from "@/components/cisco/command-detail-dialog";
import { BidiText, BidiParagraph, BidiListItem } from "@/components/cisco/bidi-text";
import {
  COMMANDS,
  TOPIC_COVERAGE,
  TROUBLESHOOTING,
  CURRICULUM_VERSIONS,
  PLATFORMS,
  filterAndScore,
  computeAuditStats,
  getStudyStages,
  CERT_LABELS,
  SCOPE_LABELS,
  VERIFICATION_LABELS,
  VERIFICATION_COLORS,
  PLATFORM_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  DEFAULT_FILTERS,
  type SearchFilters,
} from "@/lib/cisco-helpers";
import type {
  CiscoCommand,
  Platform,
  CertLevel,
  Scope,
  VerificationState,
  CommandStatus,
} from "@/lib/cisco-types";
import { useUserStore } from "@/store/user-store";
import { toast } from "@/hooks/use-toast";

const ALL_PLATFORMS: Platform[] = [
  "IOS",
  "IosXe",
  "NxOs",
  "IosXr",
  "Catalyst",
  "Nexus",
  "WLC",
  "Meraki",
];
const ALL_CERTS: CertLevel[] = [
  "Fundamentals",
  "CCNA",
  "CCNP-ENCOR",
  "CCNP-ENARSI",
  "Extended",
  "Specialization",
];
const ALL_SCOPES: Scope[] = ["certification", "extended", "unverified"];
const ALL_VERIFS: VerificationState[] = [
  "Verified",
  "Officially Referenced",
  "Needs Review",
  "Unsupported/Retired",
  "Draft",
];
const ALL_STATUSES: CommandStatus[] = [
  "Current",
  "Deprecated",
  "Obsolete",
  "NotInCurrentExamScope",
  "Historical",
  "PlatformSpecific",
  "VersionLimited",
  "NeedsVerification",
];

// ===================================================================
// Helper: chip toggle button
// ===================================================================

function ChipToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-2.5 py-1 text-xs rounded-full border transition-colors whitespace-nowrap " +
        (active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-transparent text-muted-foreground border-border hover:bg-muted")
      }
    >
      {children}
    </button>
  );
}

// ===================================================================
// 1) Dashboard view
// ===================================================================

export function DashboardView({
  onOpenCommand,
  onNavigate,
}: {
  onOpenCommand: (cmd: CiscoCommand) => void;
  onNavigate: (view: string) => void;
}) {
  const stats = useMemo(() => computeAuditStats(), []);
  const recentlyViewed = useUserStore((s) => s.recentlyViewed);
  const favorites = useUserStore((s) => s.favorites);

  const recentCommands = recentlyViewed
    .map((id) => COMMANDS.find((c) => c.id === id))
    .filter(Boolean) as CiscoCommand[];

  const favoriteCommands = favorites
    .map((id) => COMMANDS.find((c) => c.id === id))
    .filter(Boolean) as CiscoCommand[];

  const coverageByCert = ALL_CERTS.map((level) => {
    const topicsForLevel = TOPIC_COVERAGE.filter((t) => t.certLevel === level);
    const identified = topicsForLevel.reduce((s, t) => s + t.totalIdentified, 0);
    const documented = topicsForLevel.reduce((s, t) => s + t.documented, 0);
    const cmdsForLevel = COMMANDS.filter((c) => c.certLevel === level).length;
    return { level, identified, documented, cmdsForLevel };
  });

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <Badge variant="outline" className="mb-3 text-xs">
                <span className="font-mono ml-1">v2.0</span>
                <span className="text-muted-foreground">— Professional Networking Reference</span>
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
                Cisco Commands Academy
              </h1>
              <p className="text-sm text-muted-foreground leading-7 max-w-2xl bidi-rtl" dir="rtl">
                <BidiText wrapLatin={false}>
                  {"موسوعة تفاعلية لأوامر Cisco CLI — من أساسيات الشبكات، عبر مناهج CCNA و CCNP Enterprise (ENCOR + ENARSI)، مع محرك بحث دقيق، مكتبة تشخيص أعطال، وتتبع شخصي لتقدّم الدراسة. جميع السجلات موثّقة من المراجع الرسمية لـ Cisco."}
                </BidiText>
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button size="sm" onClick={() => onNavigate("library")}>
                  <Search className="h-4 w-4 ml-1" /> ابدأ البحث
                </Button>
                <Button size="sm" variant="outline" onClick={() => onNavigate("study")}>
                  <GraduationCap className="h-4 w-4 ml-1" /> مسار المذاكرة
                </Button>
                <Button size="sm" variant="outline" onClick={() => onNavigate("troubleshoot")}>
                  <Stethoscope className="h-4 w-4 ml-1" /> استكشاف الأعطال
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <StatCard
                icon={<Terminal className="h-4 w-4" />}
                label="أوامر موثّقة"
                value={stats.totalCommands}
              />
              <StatCard
                icon={<CheckCircle2 className="h-4 w-4 text-blue-500" />}
                label="موثّقة بالكامل"
                value={stats.verified}
              />
              <StatCard
                icon={<Layers className="h-4 w-4 text-sky-500" />}
                label="موضوعات مغطاة"
                value={stats.coverage.totalTopics}
              />
              <StatCard
                icon={<Star className="h-4 w-4 text-amber-500" />}
                label="في مفضلتك"
                value={favorites.length}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coverage by certification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            تغطية المكتبة حسب المستوى
          </CardTitle>
          <CardDescription className="text-xs">
            عدد الأوامر الموثّقة فعليًا لكل مستوى شهادة، مقابل إجمالي الموضوعات المحددة في خطة التغطية.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {coverageByCert.map((row) => (
            <div key={row.level} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{CERT_LABELS[row.level]}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {row.cmdsForLevel} أمر
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground" dir="ltr">
                  {row.documented}/{row.identified} موضوع
                </span>
              </div>
              <Progress
                value={row.identified > 0 ? (row.documented / row.identified) * 100 : 0}
                className="h-1.5"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Two columns: Recent + Favorites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              شوهدت مؤخرًا
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentCommands.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                لا توجد أوامر شوهدت مؤخرًا بعد. ابدأ البحث في المكتبة.
              </p>
            ) : (
              <ul className="space-y-1">
                {recentCommands.slice(0, 8).map((cmd) => (
                  <li key={cmd.id}>
                    <button
                      onClick={() => onOpenCommand(cmd)}
                      className="w-full text-right px-2 py-2 rounded-md hover:bg-muted/60 transition-colors flex items-center justify-between"
                    >
                      <span className="font-mono text-sm" dir="ltr">{cmd.name}</span>
                      <span className="text-[10px] text-muted-foreground">{cmd.topic}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              المفضلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {favoriteCommands.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                لم تُضِف أي أوامر إلى المفضلة بعد. استخدم أيقونة النجمة على أي أمر.
              </p>
            ) : (
              <ul className="space-y-1">
                {favoriteCommands.slice(0, 8).map((cmd) => (
                  <li key={cmd.id}>
                    <button
                      onClick={() => onOpenCommand(cmd)}
                      className="w-full text-right px-2 py-2 rounded-md hover:bg-muted/60 transition-colors flex items-center justify-between"
                    >
                      <span className="font-mono text-sm" dir="ltr">{cmd.name}</span>
                      <span className="text-[10px] text-muted-foreground">{cmd.topic}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Last reviewed */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 flex items-center gap-3 text-xs text-muted-foreground">
          <Info className="h-4 w-4 shrink-0" />
          <span>
            آخر مراجعة شاملة للمحتوى: <span dir="ltr" className="font-mono">{stats.lastReviewed}</span>.
            النطاق المشمول: IOS XE 17.x كمنصة أساسية، مع تغطية محدودة لـ NX-OS و IOS XR حيثما ينطبق.
            راجع قسم <button onClick={() => onNavigate("about")} className="text-primary hover:underline">حول والمصادر</button> لتفاصيل إصدارات المناهج.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-card border rounded-lg p-3 min-w-[120px]">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

// ===================================================================
// 2) Library / Search view
// ===================================================================

export function LibraryView({ onOpenCommand }: { onOpenCommand: (cmd: CiscoCommand) => void }) {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const results = useMemo(() => filterAndScore(filters), [filters]);

  const toggleArr = <T,>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const allTopics = useMemo(
    () => Array.from(new Set(COMMANDS.map((c) => c.topic))).sort(),
    []
  );
  const allCategories = useMemo(
    () => Array.from(new Set(COMMANDS.map((c) => c.category))).sort(),
    []
  );

  const activeFilterCount =
    filters.platforms.length +
    filters.certLevels.length +
    filters.scopes.length +
    filters.verifications.length +
    filters.statuses.length +
    filters.topics.length +
    filters.categories.length;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              placeholder="ابحث باسم الأمر، الصيغة، الموضوع، أو الوصف... (مثال: ospf neighbor, vlan trunk, ssh)"
              className="pr-9 text-sm placeholder:text-xs placeholder:font-sans search-input"
              dir="rtl"
            />
          </div>
          <Button
            variant={showAdvanced ? "default" : "outline"}
            onClick={() => setShowAdvanced((v) => !v)}
            className="shrink-0"
          >
            <Filter className="h-4 w-4 ml-1" />
            فلاتر متقدمة
            {activeFilterCount > 0 && (
              <Badge className="ml-1.5 h-5 min-w-5 px-1 text-[10px]">{activeFilterCount}</Badge>
            )}
          </Button>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="shrink-0 text-muted-foreground"
            >
              مسح الكل
            </Button>
          )}
        </div>

        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t animate-fade-in-up">
            <FilterGroup label="المنصة">
              {ALL_PLATFORMS.map((p) => (
                <ChipToggle
                  key={p}
                  active={filters.platforms.includes(p)}
                  onClick={() =>
                    setFilters({ ...filters, platforms: toggleArr(filters.platforms, p) })
                  }
                >
                  {PLATFORM_LABELS[p]}
                </ChipToggle>
              ))}
            </FilterGroup>

            <FilterGroup label="مستوى الشهادة">
              {ALL_CERTS.map((c) => (
                <ChipToggle
                  key={c}
                  active={filters.certLevels.includes(c)}
                  onClick={() =>
                    setFilters({ ...filters, certLevels: toggleArr(filters.certLevels, c) })
                  }
                >
                  {CERT_LABELS[c]}
                </ChipToggle>
              ))}
            </FilterGroup>

            <FilterGroup label="النطاق">
              {ALL_SCOPES.map((s) => (
                <ChipToggle
                  key={s}
                  active={filters.scopes.includes(s)}
                  onClick={() => setFilters({ ...filters, scopes: toggleArr(filters.scopes, s) })}
                >
                  {SCOPE_LABELS[s]}
                </ChipToggle>
              ))}
            </FilterGroup>

            <FilterGroup label="حالة الأمر">
              {ALL_STATUSES.map((s) => (
                <ChipToggle
                  key={s}
                  active={filters.statuses.includes(s)}
                  onClick={() =>
                    setFilters({ ...filters, statuses: toggleArr(filters.statuses, s) })
                  }
                >
                  {STATUS_LABELS[s]}
                </ChipToggle>
              ))}
            </FilterGroup>

            <FilterGroup label="حالة التوثيق">
              {ALL_VERIFS.map((v) => (
                <ChipToggle
                  key={v}
                  active={filters.verifications.includes(v)}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      verifications: toggleArr(filters.verifications, v),
                    })
                  }
                >
                  {VERIFICATION_LABELS[v]}
                </ChipToggle>
              ))}
            </FilterGroup>

            <FilterGroup label="الموضوع">
              <Select
                value={filters.topics[0] ?? ""}
                onValueChange={(v) =>
                  setFilters({ ...filters, topics: v ? [v] : [] })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر موضوعًا" />
                </SelectTrigger>
                <SelectContent>
                  {allTopics.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterGroup>

            <FilterGroup label="التصنيف">
              <Select
                value={filters.categories[0] ?? ""}
                onValueChange={(v) =>
                  setFilters({ ...filters, categories: v ? [v] : [] })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر تصنيفًا" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterGroup>
          </div>
        )}
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{results.length}</span> نتيجة
        </p>
      </div>

      {results.length === 0 ? (
        <Card className="p-12 text-center">
          <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            لا توجد نتائج مطابقة. جرّب تعديل كلمات البحث أو تخفيف الفلاتر.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {results.map(({ command }) => (
            <CommandCard key={command.id} command={command} onOpen={() => onOpenCommand(command)} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
        {label}
      </Label>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

// ===================================================================
// 3) Study path view
// ===================================================================

export function StudyPathView({ onOpenCommand }: { onOpenCommand: (cmd: CiscoCommand) => void }) {
  const stages = useMemo(() => getStudyStages(), []);
  const study = useUserStore((s) => s.study);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            مسار المذاكرة: من الأساسيات إلى CCNP Enterprise
          </CardTitle>
          <CardDescription className="text-xs">
            خمس مراحل متدرجة — ادرس أوامر كل مرحلة بالترتيب، واستخدم خانة "حالة الدراسة" في
            صفحة كل أمر لتتبع تقدمك. النسب المئوية تحسب تلقائيًا من عدد الأوامر الموثّقة في كل مرحلة.
          </CardDescription>
        </CardHeader>
      </Card>

      {stages.map((stage, idx) => {
        const stageCommands = COMMANDS.filter((c) => c.certLevel === stage.id);
        const mastered = stageCommands.filter((c) => study[c.id] === "mastered").length;
        const practiced = stageCommands.filter(
          (c) => study[c.id] === "practiced" || study[c.id] === "mastered"
        ).length;
        const learning = stageCommands.filter((c) => study[c.id] === "learning").length;
        const progress =
          stageCommands.length > 0
            ? ((mastered * 1.0 + practiced * 0.6 + learning * 0.3) / stageCommands.length) * 100
            : 0;

        return (
          <Card key={stage.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30 pb-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                    {stage.title}
                    {stage.examCode && (
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {stage.examCode}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">{stage.arabicTitle}</CardDescription>
                </div>
                <div className="text-left shrink-0">
                  <div className="text-xs text-muted-foreground">تقدمك</div>
                  <div className="text-lg font-bold tabular-nums">{Math.round(progress)}%</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-foreground/85 leading-7 mb-4 bidi-rtl" dir="rtl">
                <BidiText>{stage.description}</BidiText>
              </p>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>التقدم الكلي للمرحلة</span>
                  <span dir="ltr" className="font-mono">
                    {mastered}/{stageCommands.length} mastered
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {stageCommands.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-md p-3">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>
                    هذه المرحلة في وضع التوسعة المستقبلية — راجع لوحة التدقيق لمعرفة الموضوعات
                    المخطط تغطيتها.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stageCommands.map((cmd) => {
                    const s = study[cmd.id];
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => onOpenCommand(cmd)}
                        className="text-right px-3 py-2 rounded-md border hover:border-primary/40 hover:bg-muted/40 transition-colors flex items-center justify-between gap-2"
                      >
                        <span className="font-mono text-sm truncate" dir="ltr">{cmd.name}</span>
                        {s ? (
                          <Badge
                            variant="outline"
                            className={
                              "text-[10px] px-1.5 py-0 shrink-0 " +
                              (s === "mastered"
                                ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                                : s === "practiced"
                                ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30"
                                : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30")
                            }
                          >
                            {s === "mastered"
                              ? "تم الإتقان"
                              : s === "practiced"
                              ? "تم التدريب"
                              : "قيد التعلّم"}
                          </Badge>
                        ) : (
                          <CircleDashed className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ===================================================================
// 4) Troubleshooting view
// ===================================================================

export function TroubleshootingView({
  onOpenCommand,
}: {
  onOpenCommand: (cmd: CiscoCommand) => void;
}) {
  const categories = useMemo(
    () => Array.from(new Set(TROUBLESHOOTING.map((t) => t.category))).sort(),
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filtered =
    selectedCategory === "all"
      ? TROUBLESHOOTING
      : TROUBLESHOOTING.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary" />
            مكتبة استكشاف الأخطاء وإصلاحها
          </CardTitle>
          <CardDescription className="text-xs">
            كل سجل يصف مشكلة واقعية، أعراضها، أسبابها المحتملة، أوامر التشخيص، وخطوات الحل.
            مرتبة حسب التصنيف لتسهيل الوصول أثناء العمل الميداني.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-wrap gap-1.5">
        <ChipToggle
          active={selectedCategory === "all"}
          onClick={() => setSelectedCategory("all")}
        >
          الكل ({TROUBLESHOOTING.length})
        </ChipToggle>
        {categories.map((c) => {
          const count = TROUBLESHOOTING.filter((t) => t.category === c).length;
          return (
            <ChipToggle
              key={c}
              active={selectedCategory === c}
              onClick={() => setSelectedCategory(c)}
            >
              {c} ({count})
            </ChipToggle>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((entry) => (
          <Card key={entry.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-semibold leading-snug bidi-rtl" dir="rtl">
                    <BidiText wrapLatin={false}>{entry.problem}</BidiText>
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px]">{entry.category}</Badge>
                    <Badge
                      variant="outline"
                      className={"text-[10px] border " + VERIFICATION_COLORS[entry.verification]}
                    >
                      {VERIFICATION_LABELS[entry.verification]}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3 text-sm">
              <TSSection title="الأعراض" items={entry.symptoms} icon={<Stethoscope className="h-3.5 w-3.5" />} />
              <TSSection title="الأسباب المحتملة" items={entry.possibleCauses} icon={<AlertCircle className="h-3.5 w-3.5" />} />
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5" /> أوامر التشخيص
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {entry.diagnosisCommands.map((c, i) => (
                    <code
                      key={i}
                      className="text-xs font-mono bg-muted/60 border rounded px-2 py-1"
                      dir="ltr"
                    >
                      {c}
                    </code>
                  ))}
                </div>
              </div>
              <TSSection title="خطوات الحل" items={entry.resolution} icon={<CheckCircle2 className="h-3.5 w-3.5" />} />

              {entry.relatedCommandIds && entry.relatedCommandIds.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> أوامر مرتبطة في المكتبة
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.relatedCommandIds
                      .map((id) => COMMANDS.find((c) => c.id === id))
                      .filter(Boolean)
                      .map((cmd) => (
                        <button
                          key={cmd!.id}
                          onClick={() => onOpenCommand(cmd!)}
                          className="font-mono text-xs px-2 py-1 rounded border hover:border-primary/40 hover:bg-muted/60 transition-colors"
                          dir="ltr"
                        >
                          {cmd!.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TSSection({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
        {icon} {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-6 text-foreground/85 bidi-rtl" dir="rtl">
            <span className="text-muted-foreground mt-1 ml-2 inline-block">•</span>
            <BidiText>{item}</BidiText>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ===================================================================
// 5) Platforms view
// ===================================================================

export function PlatformsView() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            منصات Cisco وأنظمة التشغيل
          </CardTitle>
          <CardDescription className="text-xs">
            لا تشترك جميع أجهزة Cisco في الأوامر نفسها. كل منصة لها نموذج تشغيلي مختلف قد يؤثر
            على صيغة الأمر وسلوكه. هذه الصفحة توضح نموذج الإدارة لكل منصة مشمولة.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PLATFORMS.map((p) => {
          const cmdCount = COMMANDS.filter((c) => c.platforms.includes(p.id)).length;
          return (
            <Card key={p.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-base">{p.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{p.cliModel}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {cmdCount} أمر في المكتبة
                </Badge>
              </div>
              <p className="text-sm text-foreground/85 leading-6 mb-3 bidi-rtl" dir="rtl">
                <BidiText>{p.description}</BidiText>
              </p>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-muted-foreground">واجهات الإدارة:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.managementInterfaces.map((m) => (
                      <Badge key={m} variant="secondary" className="text-[10px] font-mono">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-muted-foreground">أجهزة شائعة:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.commonDevices.map((d) => (
                      <Badge key={d} variant="outline" className="text-[10px] font-mono">
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-muted/40 border rounded-md p-2 mt-2 text-foreground/85 leading-6 bidi-rtl" dir="rtl">
                  <Lightbulb className="h-3.5 w-3.5 inline ml-1 text-amber-500" />
                  <BidiText>{p.notes}</BidiText>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ===================================================================
// 6) Audit / CMS dashboard
// ===================================================================

export function AuditView() {
  const stats = useMemo(() => computeAuditStats(), []);
  const resetAll = useUserStore((s) => s.resetAll);

  const handleReset = () => {
    if (
      typeof window !== "undefined" &&
      window.confirm("سيتم مسح جميع المفضلة والملاحظات وتقدم الدراسة. هل أنت متأكد؟")
    ) {
      resetAll();
      toast({ title: "تم مسح جميع البيانات المحلية" });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            لوحة التدقيق واكتمال المكتبة
          </CardTitle>
          <CardDescription className="text-xs">
            كل الأرقام تُحسب من مصدر المحتوى الفعلي (ملف البيانات) — لا توجد نسب تقديرية. تُحدّث
            تلقائيًا عند إضافة أو تعديل أي سجل.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          icon={<Terminal className="h-4 w-4" />}
          label="إجمالي السجلات"
          value={stats.totalCommands}
          sub="أمر موثّق"
        />
        <KpiCard
          icon={<CheckCircle2 className="h-4 w-4 text-blue-500" />}
          label="موثّق بالكامل"
          value={stats.verified}
          sub={`${Math.round((stats.verified / Math.max(stats.totalCommands, 1)) * 100)}% من الإجمالي`}
        />
        <KpiCard
          icon={<BookOpen className="h-4 w-4 text-sky-500" />}
          label="مرجع رسمي"
          value={stats.officiallyReferenced}
          sub="بانتظار اختبار التفاصيل"
        />
        <KpiCard
          icon={<FileWarning className="h-4 w-4 text-amber-500" />}
          label="بحاجة لمراجعة"
          value={stats.needsReview}
          sub="معلومات ناقصة أو متعارضة"
        />
      </div>

      {/* Status breakdown — new */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            توزيع الأوامر حسب الحالة (تاريخية / حالية / مُهمَلة)
          </CardTitle>
          <CardDescription className="text-xs">
            يفصل بين الأوامر الحالية والقديمة والملغاة. القديم محفوظ لأغراض الفهم التاريخي
            ولا يُحذف لمجرد خروجه من المنهج الحالي.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatusKpi
              label="حالي"
              count={stats.current}
              color="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
            />
            <StatusKpi
              label="مُهمَل"
              count={stats.deprecated}
              color="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
            />
            <StatusKpi
              label="تاريخي"
              count={stats.historical}
              color="bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30"
            />
            <StatusKpi
              label="بحاجة للتحقق"
              count={stats.needsVerification + stats.notInCurrentExamScope}
              color="bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30"
            />
          </div>
          {stats.byStatus.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                تفصيل كامل
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {stats.byStatus.map((s) => (
                  <Badge
                    key={s.status}
                    variant="outline"
                    className={"text-[10px] border " + STATUS_COLORS[s.status]}
                  >
                    {STATUS_LABELS[s.status]}: {s.count}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data quality — missing fields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileWarning className="h-4 w-4 text-amber-500" />
            جودة البيانات — سجلات ناقصة
          </CardTitle>
          <CardDescription className="text-xs">
            سجلات تفتقر لحقول أساسية (شرح، مثال، CLI Mode، مرجع). يجب إكمالها قبل اعتبار الموسوعة جاهزة للنشر النهائي.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatusKpi
              label="بدون مرجع"
              count={stats.missingReference}
              color="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
            />
            <StatusKpi
              label="بدون CLI Mode"
              count={stats.missingMode}
              color="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
            />
            <StatusKpi
              label="بدون مثال"
              count={stats.missingExample}
              color="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
            />
            <StatusKpi
              label="شرح ناقص"
              count={stats.missingDescription}
              color="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
            />
          </div>
        </CardContent>
      </Card>

      {/* Coverage overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            تغطية الموضوعات حسب خطة التوسعة
          </CardTitle>
          <CardDescription className="text-xs">
            نسبة الموضوعات الموثّقة مقابل الموضوعات المحددة في خطة التغطية لكل مستوى.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-muted/40 rounded-lg">
              <div className="text-2xl font-bold tabular-nums">
                {stats.coverage.totalDocumented}
              </div>
              <div className="text-xs text-muted-foreground">موضوع موثّق</div>
            </div>
            <div className="text-center p-3 bg-muted/40 rounded-lg">
              <div className="text-2xl font-bold tabular-nums">
                {stats.coverage.totalIdentified}
              </div>
              <div className="text-xs text-muted-foreground">موضوع محدد في الخطة</div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold tabular-nums text-primary">
                {Math.round(stats.coverage.documentedPercent)}%
              </div>
              <div className="text-xs text-muted-foreground">نسبة التغطية</div>
            </div>
          </div>

          <Progress value={stats.coverage.documentedPercent} className="h-2 mb-4" />

          {stats.coverage.uncoveredTopics.length > 0 && (
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-md">
              <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" /> موضوعات بدون أي تغطية موثّقة
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {stats.coverage.uncoveredTopics.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="text-[10px] bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                هذه الموضوعات مذكورة في خطة التوسعة (تخصصات CCNP) لكنها لم توثّق بعد. أرقامها
                مدرجة في الإجمالي المحدد لضمان شفافية التغطية.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* By platform */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            التوزيع حسب المنصة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.byPlatform.map((row) => (
              <div key={row.platform} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-mono">{PLATFORM_LABELS[row.platform]}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {row.count} أمر
                  </span>
                </div>
                <Progress
                  value={(row.count / Math.max(stats.totalCommands, 1)) * 100}
                  className="h-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coverage table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            جدول التغطية التفصيلي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b">
                  <th className="text-right py-2 px-2 font-medium">الموضوع</th>
                  <th className="text-right py-2 px-2 font-medium">التصنيف</th>
                  <th className="text-right py-2 px-2 font-medium">المستوى</th>
                  <th className="text-center py-2 px-2 font-medium">محدد</th>
                  <th className="text-center py-2 px-2 font-medium">موثّق</th>
                  <th className="text-center py-2 px-2 font-medium">موثّق بالكامل</th>
                  <th className="text-center py-2 px-2 font-medium">التغطية</th>
                </tr>
              </thead>
              <tbody>
                {TOPIC_COVERAGE.map((t) => {
                  const pct = t.totalIdentified > 0 ? (t.documented / t.totalIdentified) * 100 : 0;
                  return (
                    <tr key={t.topic} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2 px-2 font-medium">{t.topic}</td>
                      <td className="py-2 px-2 text-xs text-muted-foreground">{t.category}</td>
                      <td className="py-2 px-2 text-xs">
                        <Badge variant="outline" className="text-[10px]">
                          {CERT_LABELS[t.certLevel]}
                        </Badge>
                      </td>
                      <td className="py-2 px-2 text-center tabular-nums">{t.totalIdentified}</td>
                      <td className="py-2 px-2 text-center tabular-nums">{t.documented}</td>
                      <td className="py-2 px-2 text-center tabular-nums">{t.verified}</td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          <Progress value={pct} className="h-1.5 flex-1" />
                          <span className="text-[10px] text-muted-foreground tabular-nums w-10 text-left">
                            {Math.round(pct)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-rose-500/30">
        <CardHeader>
          <CardTitle className="text-base text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            إعادة الضبط المحلية
          </CardTitle>
          <CardDescription className="text-xs">
            المفضلة والملاحظات وتقدم الدراسة محفوظة محليًا في متصفحك. يمكنك مسحها جميعًا هنا.
            هذا الإجراء لا يحذف المحتوى الموثّق في المكتبة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm" onClick={handleReset}>
            مسح جميع البيانات المحلية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
    </Card>
  );
}

function StatusKpi({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className={"border rounded-md p-3 " + color}>
      <div className="text-xs font-medium mb-1">{label}</div>
      <div className="text-2xl font-bold tabular-nums">{count}</div>
    </div>
  );
}

// ===================================================================
// 7) Favorites & notes view
// ===================================================================

export function FavoritesView({
  onOpenCommand,
}: {
  onOpenCommand: (cmd: CiscoCommand) => void;
}) {
  const favorites = useUserStore((s) => s.favorites);
  const notes = useUserStore((s) => s.notes);
  const study = useUserStore((s) => s.study);
  const exportData = useUserStore((s) => s.exportData);
  const importData = useUserStore((s) => s.importData);

  const favoriteCommands = favorites
    .map((id) => COMMANDS.find((c) => c.id === id))
    .filter(Boolean) as CiscoCommand[];

  const notesCommands = Object.keys(notes)
    .map((id) => COMMANDS.find((c) => c.id === id))
    .filter(Boolean) as CiscoCommand[];

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cisco-academy-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "تم تصدير البيانات إلى ملف" });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const ok = importData(text);
      if (ok) {
        toast({ title: "تم استيراد البيانات بنجاح" });
      } else {
        toast({ title: "فشل الاستيراد — ملف غير صالح", variant: "destructive" });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            المفضلة والملاحظات
          </CardTitle>
          <CardDescription className="text-xs">
            بياناتك الشخصية محفوظة محليًا في متصفحك. للحفظ الدائم عبر الأجهزة،
            صدّر بياناتك إلى ملف واستعدها على أي جهاز.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 ml-1.5" />
              تصدير البيانات (نسخة احتياطية)
            </Button>
            <label>
              <input
                type="file"
                accept="application/json,.json"
                onChange={handleImport}
                className="hidden"
              />
              <Button size="sm" variant="outline" type="button" asChild>
                <span>
                  <Upload className="h-4 w-4 ml-1.5" />
                  استيراد البيانات
                </span>
              </Button>
            </label>
          </div>
          <div className="text-[11px] text-muted-foreground bg-muted/40 border rounded-md p-2.5 leading-5" dir="rtl">
            <strong>ملاحظة:</strong> الملاحظات والمفضلة محفوظة دائمًا في متصفحك
            (localStorage) — تبقى بعد إغلاق المتصفح وإعادة فتحه. للتأكد من عدم
            فقدانها عند مسح بيانات المتصفح أو تغيير الجهاز، استخدم زر
            «تصدير البيانات» لحفظ نسخة على جهازك، و«استيراد البيانات» لاستعادتها.
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="favorites">
        <TabsList>
          <TabsTrigger value="favorites">
            <Star className="h-3.5 w-3.5 ml-1.5" /> المفضلة ({favoriteCommands.length})
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileWarning className="h-3.5 w-3.5 ml-1.5" /> الملاحظات ({notesCommands.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites" className="mt-4">
          {favoriteCommands.length === 0 ? (
            <Card className="p-12 text-center">
              <Star className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                لم تُضِف أي أوامر إلى المفضلة بعد. استخدم أيقونة النجمة على أي أمر في المكتبة.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {favoriteCommands.map((cmd) => (
                <CommandCard key={cmd.id} command={cmd} onOpen={() => onOpenCommand(cmd)} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-4 space-y-3">
          {notesCommands.length === 0 ? (
            <Card className="p-12 text-center">
              <FileWarning className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                لا توجد ملاحظات محفوظة. افتح أي أمر واختر تبويب "ملاحظاتي" لإضافة ملاحظة.
              </p>
            </Card>
          ) : (
            notesCommands.map((cmd) => {
              const noteText = notes[cmd.id] ?? "";
              return (
                <Card key={cmd.id} className="p-4">
                  <button
                    onClick={() => onOpenCommand(cmd)}
                    className="flex items-center justify-between w-full text-right mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono text-sm font-semibold" dir="ltr">{cmd.name}</h3>
                      <Badge variant="outline" className="text-[10px]">
                        {cmd.topic}
                      </Badge>
                      {study[cmd.id] && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400"
                        >
                          {study[cmd.id] === "mastered"
                            ? "تم الإتقان"
                            : study[cmd.id] === "practiced"
                            ? "تم التدريب"
                            : "قيد التعلّم"}
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">فتح السجل ←</span>
                  </button>
                  <pre
                    className="text-xs whitespace-pre-wrap font-mono bg-muted/40 border rounded-md p-2 max-h-32 overflow-y-auto scroll-cisco"
                    dir="rtl"
                  >
                    {noteText}
                  </pre>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ===================================================================
// 8) About / Sources view
// ===================================================================

export function AboutView() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            حول المنصة والمصادر الرسمية
          </CardTitle>
          <CardDescription className="text-xs">
            منهجية التوثيق، إصدارات المناهج المشمولة، والمصادر الرسمية المعتمدة.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-foreground/90">
          <p>
            <strong className="text-foreground">Cisco Commands Academy</strong> هو مرجع عملي لأوامر
            Cisco CLI، يجمع بين الموسوعة التقنية ومحرك البحث الدقيق ودليل الاستكشاف التفاعلي. لا
            يهدف إلى استبدال وثائق Cisco الرسمية، بل إلى تنظيمها في مسار دراسي وعملي قابل للبحث.
          </p>
          <p>
            كل سجل في المكتبة يحدد: الصيغة الرسمية للأمر، أوضاع CLI الصحيحة، المنصات والإصدارات
            المدعومة، شرحًا مختصرًا ومفصلًا، مثالًا عمليًا، أوامر التحقق المرتبطة، ملاحظات التشخيص،
            المراجع الرسمية، وحالة التوثيق. لا يُعرض أي محتوى بحالة "Draft" كموثّق.
          </p>
          <p>
            النطاق المشمول حاليًا هو <strong className="text-foreground">Cisco IOS XE 17.x</strong>{" "}
            كمنصة أساسية (متوافق مع موضوعات CCNA و CCNP Enterprise)، مع تغطية محدودة لـ NX-OS و
            IOS XR حيثما تنطبق الأوامر. التوسع إلى تخصصات CCNP (Security, Data Center, Service
            Provider, Wireless, Collaboration) مخطط له لكنه غير مكتمل — انظر لوحة التدقيق لمعرفة
            حالة كل تخصص بدقة.
          </p>
        </CardContent>
      </Card>

      {/* Curriculum versions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            إصدارات المناهج المشمولة
          </CardTitle>
          <CardDescription className="text-xs">
            تم التحقق من إصدارات المناهج في التاريخ المذكور. تُحدّث هذه القائمة عند ظهور إصدارات
            رسمية جديدة.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {CURRICULUM_VERSIONS.map((cv) => (
            <div key={cv.cert} className="border rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="font-semibold text-sm">{cv.cert}</h4>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {cv.examCode}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <div>
                  إصدار موضوعات الامتحان:{" "}
                  <span dir="ltr" className="font-mono">{cv.examTopicsVersion}</span>
                </div>
                <div>
                  تاريخ النشر: <span dir="ltr" className="font-mono">{cv.publishedDate}</span>
                </div>
                <div>
                  آخر تحقق: <span dir="ltr" className="font-mono">{cv.lastVerified}</span>
                  <Badge variant="secondary" className="text-[10px] mr-2">محدّث</Badge>
                </div>
              </div>
              <p className="text-xs text-foreground/85 leading-6 mt-1 bidi-rtl" dir="rtl">
                <BidiText>{cv.notes}</BidiText>
              </p>
              <a
                href={cv.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
              >
                <ExternalLink className="h-3 w-3" /> المصدر الرسمي لـ Cisco
              </a>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Methodology */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            منهجية التوثيق ودرجات الثقة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-foreground/85 leading-7">
            لكل سجل حالة توثيق محددة، تظهر كباج ملوّن في صفحة الأمر. الفرق بين الحالات:
          </p>
          <div className="space-y-2">
            <MethRow
              label="موثّق (Verified)"
              color={VERIFICATION_COLORS["Verified"]}
              desc="تمت مراجعة الصيغة والسياق بالكامل باستخدام مرجع رسمي. لا يعني بالضرورة الاختبار على جهاز فعلي — راجع قسم التحقق العملي."
            />
            <MethRow
              label="مرجع رسمي (Officially Referenced)"
              color={VERIFICATION_COLORS["Officially Referenced"]}
              desc="يوجد مرجع رسمي يدعم الأمر، لكن لم تُختبر جميع تفاصيل المثال العملي بعد."
            />
            <MethRow
              label="بحاجة لمراجعة (Needs Review)"
              color={VERIFICATION_COLORS["Needs Review"]}
              desc="توجد معلومات غير مكتملة أو تعارضات تحتاج إلى مراجعة بشرية قبل الاعتماد."
            />
            <MethRow
              label="غير مدعوم (Unsupported/Retired)"
              color={VERIFICATION_COLORS["Unsupported/Retired"]}
              desc="لا يدعم الأمر البيئة المستهدفة أو انتهى دعم الصيغة في النطاق المحدد، وفق دليل موثق."
            />
            <MethRow
              label="مسودة (Draft)"
              color={VERIFICATION_COLORS["Draft"]}
              desc="محتوى أولي غير معتمد. لا يُعرض باعتباره موثّقًا."
            />
          </div>
          <div className="bg-muted/40 border rounded-md p-3 text-xs text-foreground/85 leading-6 mt-3">
            <strong className="text-foreground">فصل التحقق الوثائقي عن العملي:</strong> درجة "موثّق"
            تعني مراجعة وثائقية فقط. لا تُنسب درجة "موثّق" لأمر اختُبر على جهاز فعلي لمجرد توفر
            المرجع — يجب توضيح ذلك في ملاحظات التشخيص إن وُجد.
          </div>
        </CardContent>
      </Card>

      {/* Scope policy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            سياسة النطاق: المنهج مقابل المرجع الموسّع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-foreground/85 leading-7">
          <p>
            يميّز الموقع بين ثلاث فئات للنطاق:
          </p>
          <div className="space-y-2 mt-2">
            <div className="border rounded-md p-2.5">
              <Badge variant="secondary" className="text-[10px] mb-1">ضمن المنهج</Badge>
              <p className="text-xs">الأوامر والموضوعات المرتبطة مباشرة بمنهج امتحان محدد (CCNA / ENCOR / ENARSI).</p>
            </div>
            <div className="border rounded-md p-2.5">
              <Badge variant="outline" className="text-[10px] mb-1">مرجع موسّع</Badge>
              <p className="text-xs">أوامر متقدمة مفيدة للعمل الحقيقي لكنها خارج النطاق المحدد للامتحان أو لم يُتحقق من ارتباطها به.</p>
            </div>
            <div className="border rounded-md p-2.5">
              <Badge variant="outline" className="text-[10px] mb-1 bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300">لم يُتحقق</Badge>
              <p className="text-xs">انتساب الأمر لمنهج محدد قيد المراجعة — لا يُنسب لمنهج لمجرد أنه أمر Cisco.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MethRow({ label, color, desc }: { label: string; color: string; desc: string }) {
  return (
    <div className="flex items-start gap-2">
      <Badge variant="outline" className={"text-[10px] border " + color + " shrink-0"}>{label}</Badge>
      <span className="text-xs text-foreground/85 leading-6">{desc}</span>
    </div>
  );
}
