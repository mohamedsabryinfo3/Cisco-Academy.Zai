import {
  COMMANDS,
  TOPIC_COVERAGE,
  TROUBLESHOOTING,
  CURRICULUM_VERSIONS,
  PLATFORMS,
} from "./cisco-data";
import type {
  CiscoCommand,
  Platform,
  CertLevel,
  Scope,
  VerificationState,
  CommandStatus,
} from "./cisco-types";

// ===================================================================
// Search & filter helpers
// ===================================================================

export interface SearchFilters {
  query: string;
  platforms: Platform[];
  certLevels: CertLevel[];
  scopes: Scope[];
  verifications: VerificationState[];
  statuses: CommandStatus[];
  topics: string[];
  categories: string[];
}

export const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  platforms: [],
  certLevels: [],
  scopes: [],
  verifications: [],
  statuses: [],
  topics: [],
  categories: [],
};

const CERT_ORDER: CertLevel[] = [
  "Fundamentals",
  "CCNA",
  "CCNP-ENCOR",
  "CCNP-ENARSI",
  "Extended",
  "Specialization",
];

export const CERT_LABELS: Record<CertLevel, string> = {
  Fundamentals: "الأساسيات",
  CCNA: "CCNA",
  "CCNP-ENCOR": "CCNP ENCOR",
  "CCNP-ENARSI": "CCNP ENARSI",
  Extended: "مرجع موسّع",
  Specialization: "تخصصات CCNP",
};

export const SCOPE_LABELS: Record<Scope, string> = {
  certification: "ضمن المنهج",
  extended: "مرجع موسّع",
  unverified: "لم يُتحقق",
};

export const VERIFICATION_LABELS: Record<VerificationState, string> = {
  Verified: "موثّق",
  "Officially Referenced": "مرجع رسمي",
  "Needs Review": "بحاجة لمراجعة",
  "Unsupported/Retired": "غير مدعوم",
  Draft: "مسودة",
};

export const VERIFICATION_COLORS: Record<VerificationState, string> = {
  Verified: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  "Officially Referenced": "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  "Needs Review": "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  "Unsupported/Retired": "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
  Draft: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/30",
};

export const STATUS_LABELS: Record<CommandStatus, string> = {
  Current: "حالي",
  Deprecated: "مُهمَل",
  Obsolete: "منتهٍ",
  NotInCurrentExamScope: "خارج المنهج الحالي",
  Historical: "تاريخي",
  PlatformSpecific: "خاص بمنصة",
  VersionLimited: "محدود بإصدار",
  NeedsVerification: "بحاجة للتحقق",
};

export const STATUS_COLORS: Record<CommandStatus, string> = {
  Current: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  Deprecated: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Obsolete: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
  NotInCurrentExamScope: "bg-zinc-500/15 text-zinc-500 dark:text-zinc-400 border-zinc-500/30",
  Historical: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
  PlatformSpecific: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  VersionLimited: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
  NeedsVerification: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  IOS: "Cisco IOS",
  IosXe: "IOS XE",
  NxOs: "NX-OS",
  IosXr: "IOS XR",
  Catalyst: "Catalyst",
  Nexus: "Nexus",
  WLC: "WLC",
  Meraki: "Meraki",
};

export function certRank(c: CertLevel): number {
  return CERT_ORDER.indexOf(c);
}

// Multi-token substring scoring with alias / historical name support
export function scoreCommand(cmd: CiscoCommand, query: string): number {
  if (!query.trim()) return 1;
  const q = query.trim().toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 1;

  const name = cmd.name.toLowerCase();
  const aliases = (cmd.aliases ?? []).map((a) => a.toLowerCase());
  const syntax = cmd.syntax.toLowerCase();
  const topic = cmd.topic.toLowerCase();
  const category = cmd.category.toLowerCase();
  const summary = cmd.summary.toLowerCase();
  const description = cmd.description.toLowerCase();
  const modernAlt = (cmd.modernAlternative ?? "").toLowerCase();
  const historical = (cmd.historicalNote ?? "").toLowerCase();
  const tags = (cmd.tags ?? []).map((t) => t.toLowerCase());

  let score = 0;
  for (const t of tokens) {
    let tokenScore = 0;
    if (name === t) tokenScore += 60;
    else if (name.startsWith(t)) tokenScore += 40;
    else if (name.includes(t)) tokenScore += 25;
    // alias match (e.g. "wr" => "write memory")
    for (const a of aliases) {
      if (a === t) tokenScore += 45;
      else if (a.startsWith(t)) tokenScore += 25;
      else if (a.includes(t)) tokenScore += 12;
    }
    if (syntax.startsWith(t)) tokenScore += 20;
    else if (syntax.includes(t)) tokenScore += 10;
    if (topic.includes(t)) tokenScore += 15;
    if (category.includes(t)) tokenScore += 10;
    if (summary.includes(t)) tokenScore += 12;
    if (description.includes(t)) tokenScore += 6;
    if (modernAlt.includes(t)) tokenScore += 18;
    if (historical.includes(t)) tokenScore += 8;
    for (const tag of tags) {
      if (tag === t) tokenScore += 18;
      else if (tag.includes(t)) tokenScore += 6;
    }
    if (tokenScore === 0) return 0;
    score += tokenScore;
  }
  return score;
}

export function filterAndScore(
  filters: SearchFilters
): { command: CiscoCommand; score: number }[] {
  const results: { command: CiscoCommand; score: number }[] = [];
  for (const cmd of COMMANDS) {
    if (filters.platforms.length > 0) {
      if (!filters.platforms.some((p) => cmd.platforms.includes(p))) continue;
    }
    if (filters.certLevels.length > 0) {
      if (!filters.certLevels.includes(cmd.certLevel)) continue;
    }
    if (filters.scopes.length > 0) {
      if (!filters.scopes.includes(cmd.scope)) continue;
    }
    if (filters.verifications.length > 0) {
      if (!filters.verifications.includes(cmd.verification)) continue;
    }
    if (filters.statuses.length > 0) {
      if (!filters.statuses.includes(cmd.status)) continue;
    }
    if (filters.topics.length > 0) {
      if (!filters.topics.includes(cmd.topic)) continue;
    }
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(cmd.category)) continue;
    }
    const score = scoreCommand(cmd, filters.query);
    if (score === 0 && filters.query.trim().length > 0) continue;
    results.push({ command: cmd, score });
  }
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const ra = certRank(a.command.certLevel);
    const rb = certRank(b.command.certLevel);
    if (ra !== rb) return ra - rb;
    return a.command.name.localeCompare(b.command.name);
  });
  return results;
}

// ===================================================================
// Audit statistics (computed from real data)
// ===================================================================

export interface AuditStats {
  totalCommands: number;
  verified: number;
  officiallyReferenced: number;
  needsReview: number;
  unsupported: number;
  draft: number;
  // status breakdown
  current: number;
  deprecated: number;
  obsolete: number;
  historical: number;
  notInCurrentExamScope: number;
  needsVerification: number;
  // records with missing fields
  missingReference: number;
  missingMode: number;
  missingExample: number;
  missingDescription: number;
  byPlatform: { platform: Platform; count: number }[];
  byCert: { level: CertLevel; count: number }[];
  byScope: { scope: Scope; count: number }[];
  byStatus: { status: CommandStatus; count: number }[];
  coverage: {
    totalTopics: number;
    totalIdentified: number;
    totalDocumented: number;
    totalVerified: number;
    documentedPercent: number;
    verifiedPercent: number;
    uncoveredTopics: string[];
    partialTopics: string[];
  };
  lastReviewed: string;
}

export function computeAuditStats(): AuditStats {
  const stats: AuditStats = {
    totalCommands: COMMANDS.length,
    verified: 0,
    officiallyReferenced: 0,
    needsReview: 0,
    unsupported: 0,
    draft: 0,
    current: 0,
    deprecated: 0,
    obsolete: 0,
    historical: 0,
    notInCurrentExamScope: 0,
    needsVerification: 0,
    missingReference: 0,
    missingMode: 0,
    missingExample: 0,
    missingDescription: 0,
    byPlatform: [],
    byCert: [],
    byScope: [],
    byStatus: [],
    coverage: {
      totalTopics: 0,
      totalIdentified: 0,
      totalDocumented: 0,
      totalVerified: 0,
      documentedPercent: 0,
      verifiedPercent: 0,
      uncoveredTopics: [],
      partialTopics: [],
    },
    lastReviewed: "",
  };

  for (const cmd of COMMANDS) {
    if (cmd.verification === "Verified") stats.verified++;
    else if (cmd.verification === "Officially Referenced") stats.officiallyReferenced++;
    else if (cmd.verification === "Needs Review") stats.needsReview++;
    else if (cmd.verification === "Unsupported/Retired") stats.unsupported++;
    else if (cmd.verification === "Draft") stats.draft++;

    if (cmd.status === "Current") stats.current++;
    else if (cmd.status === "Deprecated") stats.deprecated++;
    else if (cmd.status === "Obsolete") stats.obsolete++;
    else if (cmd.status === "Historical") stats.historical++;
    else if (cmd.status === "NotInCurrentExamScope") stats.notInCurrentExamScope++;
    else if (cmd.status === "NeedsVerification") stats.needsVerification++;

    if (!cmd.references || cmd.references.length === 0) stats.missingReference++;
    if (!cmd.cliMode || cmd.cliMode.length === 0) stats.missingMode++;
    if (!cmd.examples || cmd.examples.length === 0) stats.missingExample++;
    if (!cmd.description || cmd.description.length < 50) stats.missingDescription++;
  }

  const platformCounts = new Map<Platform, number>();
  for (const cmd of COMMANDS) {
    for (const p of cmd.platforms) {
      platformCounts.set(p, (platformCounts.get(p) ?? 0) + 1);
    }
  }
  stats.byPlatform = Array.from(platformCounts.entries())
    .map(([platform, count]) => ({ platform, count }))
    .sort((a, b) => b.count - a.count);

  const certCounts = new Map<CertLevel, number>();
  for (const cmd of COMMANDS) {
    certCounts.set(cmd.certLevel, (certCounts.get(cmd.certLevel) ?? 0) + 1);
  }
  stats.byCert = CERT_ORDER.map((level) => ({
    level,
    count: certCounts.get(level) ?? 0,
  }));

  const scopeCounts = new Map<Scope, number>();
  for (const cmd of COMMANDS) {
    scopeCounts.set(cmd.scope, (scopeCounts.get(cmd.scope) ?? 0) + 1);
  }
  stats.byScope = (["certification", "extended", "unverified"] as Scope[]).map((scope) => ({
    scope,
    count: scopeCounts.get(scope) ?? 0,
  }));

  const statusCounts = new Map<CommandStatus, number>();
  for (const cmd of COMMANDS) {
    statusCounts.set(cmd.status, (statusCounts.get(cmd.status) ?? 0) + 1);
  }
  const allStatuses: CommandStatus[] = [
    "Current",
    "Deprecated",
    "Obsolete",
    "NotInCurrentExamScope",
    "Historical",
    "PlatformSpecific",
    "VersionLimited",
    "NeedsVerification",
  ];
  stats.byStatus = allStatuses
    .map((status) => ({ status, count: statusCounts.get(status) ?? 0 }))
    .filter((s) => s.count > 0);

  const totalIdentified = TOPIC_COVERAGE.reduce((s, t) => s + t.totalIdentified, 0);
  const totalDocumented = TOPIC_COVERAGE.reduce((s, t) => s + t.documented, 0);
  const totalVerified = TOPIC_COVERAGE.reduce((s, t) => s + t.verified, 0);
  stats.coverage = {
    totalTopics: TOPIC_COVERAGE.length,
    totalIdentified,
    totalDocumented,
    totalVerified,
    documentedPercent: totalIdentified > 0 ? (totalDocumented / totalIdentified) * 100 : 0,
    verifiedPercent: totalIdentified > 0 ? (totalVerified / totalIdentified) * 100 : 0,
    uncoveredTopics: TOPIC_COVERAGE.filter((t) => t.documented === 0).map((t) => t.topic),
    partialTopics: TOPIC_COVERAGE.filter((t) => t.documented > 0 && t.documented < t.totalIdentified).map((t) => t.topic),
  };

  const allDates = COMMANDS.map((c) => c.lastReviewed).sort();
  stats.lastReviewed = allDates[allDates.length - 1] ?? "";
  return stats;
}

// ===================================================================
// Study path data
// ===================================================================

export interface StudyStage {
  id: CertLevel;
  title: string;
  arabicTitle: string;
  description: string;
  examCode?: string;
  commandCount: number;
  masteredCount: number;
}

export function getStudyStages(): Omit<StudyStage, "masteredCount">[] {
  const stages: Omit<StudyStage, "masteredCount">[] = [
    {
      id: "Fundamentals",
      title: "Networking Fundamentals & Cisco CLI",
      arabicTitle: "أساسيات الشبكات و CLI الخاص بـ Cisco",
      description:
        "تأسيس المهارات اللازمة لفهم أوضاع CLI، وقراءة الإعدادات، واستخدام أدوات التحقق والتشخيص. هذا المستوى مطلوب قبل الانتقال إلى CCNA.",
      commandCount: COMMANDS.filter((c) => c.certLevel === "Fundamentals").length,
    },
    {
      id: "CCNA",
      title: "CCNA (200-301)",
      arabicTitle: "CCNA — الامتحان 200-301",
      description:
        "مكتبة أوامر منهج CCNA v2.0: تبديل Layer 2، التوجيه الثابت و OSPF و EIGRP، خدمات IP (DHCP, NAT, NTP, Syslog, SNMP)، الأمان الأساسي، HSRP، CDP/LLDP، IPv6.",
      examCode: "200-301",
      commandCount: COMMANDS.filter((c) => c.certLevel === "CCNA").length,
    },
    {
      id: "CCNP-ENCOR",
      title: "CCNP Enterprise Core — ENCOR (350-401)",
      arabicTitle: "CCNP Enterprise Core — ENCOR (350-401)",
      description:
        "تقنيات المؤسسات المتقدمة: BGP، EtherChannel، الأنفاق (GRE) و IPsec/IKEv2، QoS (MQC)، التشغيل الآلي (NETCONF/RESTCONF/YANG)، إدارة التهيئة (archive/configure replace).",
      examCode: "350-401",
      commandCount: COMMANDS.filter((c) => c.certLevel === "CCNP-ENCOR").length,
    },
    {
      id: "CCNP-ENARSI",
      title: "CCNP Enterprise Advanced Routing — ENARSI (300-410)",
      arabicTitle: "CCNP Enterprise Advanced Routing — ENARSI (300-410)",
      description:
        "توجيه متقدم: redistribution، route-maps، prefix-lists، policy-based routing، OSPF/BGP المتقدم، IP SLA/tracking، DHCP snooping و DAI، تشخيص أعمق.",
      examCode: "300-410",
      commandCount: COMMANDS.filter((c) => c.certLevel === "CCNP-ENARSI").length,
    },
    {
      id: "Specialization",
      title: "CCNP Specializations (Expansion Roadmap)",
      arabicTitle: "تخصصات CCNP (خارطة التوسعة)",
      description:
        "بنية جاهزة للتوسع إلى CCNP Security، Data Center (NX-OS)، Service Provider (IOS XR)، Wireless (9800 WLC)، Collaboration. حاليًا بدون تغطية موثّقة — أرقام التغطية الفعلية معروضة في لوحة التدقيق.",
      commandCount: COMMANDS.filter((c) => c.certLevel === "Specialization").length,
    },
  ];
  return stages;
}

export {
  COMMANDS,
  TOPIC_COVERAGE,
  TROUBLESHOOTING,
  CURRICULUM_VERSIONS,
  PLATFORMS,
};
