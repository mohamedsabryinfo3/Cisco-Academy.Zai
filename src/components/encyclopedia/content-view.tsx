"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Check,
  ChevronLeft,
  Target,
  ListChecks,
  AlertTriangle,
  Undo2,
  Lightbulb,
  FileWarning,
  Network,
  Terminal,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { TopologyDiagram } from "./topology-diagram";
import {
  COMMANDS,
} from "@/lib/cisco-helpers";
import {
  PLATFORM_LABELS,
} from "@/lib/cisco-helpers";
import type {
  Section,
  Chapter,
  Topic,
  Task,
  FlatTask,
} from "@/lib/encyclopedia-data";
import { CommandDetailDialog } from "@/components/cisco/command-detail-dialog";
import type { CiscoCommand } from "@/lib/cisco-types";
import { toast } from "@/hooks/use-toast";

// ===================================================================
// CommandBlock — كتلة أوامر قابلة للنسخ
// ===================================================================
function CommandBlock({
  code,
  device,
  cliMode,
  title,
  description,
}: {
  code: string;
  device?: string;
  cliMode?: string;
  title: string;
  description: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      toast({ title: "تم نسخ الأوامر" });
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold shrink-0">
            <Terminal className="h-3 w-3" />
          </span>
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {device && (
            <Badge variant="secondary" className="text-[10px]">{device}</Badge>
          )}
          {cliMode && (
            <Badge variant="outline" className="text-[10px] font-mono" dir="ltr">{cliMode}</Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs shrink-0" onClick={handleCopy}>
          {copied ? <Check className="h-3.5 w-3.5 ml-1" /> : <Copy className="h-3.5 w-3.5 ml-1" />}
          نسخ
        </Button>
      </div>
      <p className="text-xs text-muted-foreground leading-5" dir="rtl">{description}</p>
      <pre className="cli-code" dir="ltr">{code}</pre>
    </div>
  );
}

// ===================================================================
// TaskView — عرض مهمة عملية كاملة
// ===================================================================
export function TaskView({ task }: { task: FlatTask }) {
  const [activeCommand, setActiveCommand] = useState<CiscoCommand | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openCommand = (id: string) => {
    const cmd = COMMANDS.find((c) => c.id === id);
    if (cmd) {
      setActiveCommand(cmd);
      setDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* مسار التنقل */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
        <span>{task.sectionTitle}</span>
        <ChevronLeft className="h-3 w-3" />
        <span>{task.chapterTitle}</span>
        <ChevronLeft className="h-3 w-3" />
        <span className="text-foreground font-medium">{task.topicTitle}</span>
      </div>

      {/* عنوان المهمة */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="text-[10px]">{task.sectionTitle}</Badge>
          {task.status === "documented" && (
            <Badge variant="outline" className="text-[10px] bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400">
              موثّق
            </Badge>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight" dir="rtl">
          {task.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5 font-mono" dir="ltr">{task.titleEn}</p>
      </div>

      {/* السؤال */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Target className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">السؤال</div>
              <p className="text-sm text-foreground/90 leading-6" dir="rtl">{task.question}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الهدف والمتطلبات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> الهدف
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/85 leading-6" dir="rtl">{task.objective}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-primary" /> المتطلبات السابقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {task.prerequisites.map((p, i) => (
                <li key={i} className="text-sm text-foreground/85 flex gap-2" dir="rtl">
                  <span className="text-muted-foreground mt-0.5">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* الطوبولوجيا */}
      {task.topology && <TopologyDiagram topology={task.topology} />}

      {/* خطة IP */}
      {task.ipPlan && task.ipPlan.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Network className="h-4 w-4 text-primary" /> خطة عناوين IP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-right py-2 px-2 font-medium">الجهاز</th>
                    <th className="text-right py-2 px-2 font-medium">الواجهة</th>
                    <th className="text-right py-2 px-2 font-medium">عنوان IP</th>
                    <th className="text-right py-2 px-2 font-medium">الشبكة</th>
                  </tr>
                </thead>
                <tbody>
                  {task.ipPlan.map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-1.5 px-2 font-medium">{row.device}</td>
                      <td className="py-1.5 px-2 font-mono" dir="ltr">{row.interface}</td>
                      <td className="py-1.5 px-2 font-mono text-primary" dir="ltr">{row.ip}</td>
                      <td className="py-1.5 px-2 font-mono text-muted-foreground" dir="ltr">{row.subnet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* خطوات التنفيذ */}
      <div>
        <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2" dir="rtl">
          <Terminal className="h-5 w-5 text-primary" />
          خطوات التنفيذ ({task.steps.length})
        </h3>
        <div className="space-y-4">
          {task.steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <CommandBlock
                  title={step.title}
                  description={step.description}
                  code={step.code}
                  device={step.device}
                  cliMode={step.cliMode}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* التحقق */}
      <div>
        <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2" dir="rtl">
          <ListChecks className="h-5 w-5 text-emerald-500" />
          أوامر التحقق ({task.verification.length})
        </h3>
        <div className="space-y-3">
          {task.verification.map((v, i) => (
            <Card key={i} className="border-emerald-500/20">
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <code className="text-sm font-mono text-foreground bg-muted/60 rounded px-2 py-1 border" dir="ltr">
                    {v.command}
                  </code>
                </div>
                <p className="text-xs text-foreground/80 leading-5 mb-1" dir="rtl">
                  <strong className="text-emerald-600 dark:text-emerald-400">ما الذي تبحث عنه:</strong> {v.whatToLookFor}
                </p>
                {v.expectedOutput && (
                  <div className="mt-2">
                    <div className="text-[10px] text-muted-foreground mb-1">المخرجات المتوقعة:</div>
                    <pre className="cli-code text-[11px]" dir="ltr">{v.expectedOutput}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* الأخطاء الشائعة */}
      {task.commonErrors.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2" dir="rtl">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            الأخطاء الشائعة ({task.commonErrors.length})
          </h3>
          <div className="space-y-2">
            {task.commonErrors.map((err, i) => (
              <Card key={i} className="border-amber-500/20">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground" dir="rtl">{err.error}</div>
                      <div className="text-xs text-muted-foreground mt-1" dir="rtl">
                        <strong>السبب:</strong> {err.cause}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5" dir="rtl">
                        <strong>الاكتشاف:</strong> <code className="font-mono text-[11px]" dir="ltr">{err.detection}</code>
                      </div>
                      <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5" dir="rtl">
                        <strong>الحل:</strong> {err.fix}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* طرق بديلة */}
      {task.alternatives && (
        <Card className="border-sky-500/20 bg-sky-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">طرق بديلة</div>
                <p className="text-sm text-foreground/85 leading-6" dir="rtl">{task.alternatives}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* التراجع */}
      {task.rollback && (
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Undo2 className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">طريقة التراجع</div>
                <p className="text-sm text-foreground/85 leading-6 font-mono" dir="ltr">{task.rollback}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* الأوامر المرتبطة */}
      {task.relatedCommandIds.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2" dir="rtl">
            <BookOpen className="h-5 w-5 text-primary" />
            الأوامر المرتبطة في الموسوعة
          </h3>
          <div className="flex flex-wrap gap-2">
            {task.relatedCommandIds
              .map((id) => COMMANDS.find((c) => c.id === id))
              .filter(Boolean)
              .map((cmd) => (
                <button
                  key={cmd!.id}
                  onClick={() => openCommand(cmd!.id)}
                  className="font-mono text-xs px-3 py-1.5 rounded-md border bg-card hover:border-primary/40 hover:bg-primary/5 transition-colors text-foreground"
                  dir="ltr"
                >
                  {cmd!.name}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* آخر مراجعة */}
      <div className="text-xs text-muted-foreground border-t pt-3" dir="rtl">
        آخر مراجعة: <span dir="ltr" className="font-mono">{task.lastReviewed}</span>
      </div>

      {/* نافذة تفاصيل الأمر */}
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
// TopicView — عرض موضوع مع مهامه
// ===================================================================
export function TopicView({
  topic,
  onSelectTask,
}: {
  topic: Topic;
  onSelectTask: (task: FlatTask) => void;
}) {
  return (
    <div className="space-y-4 pb-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight" dir="rtl">
          {topic.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5 font-mono" dir="ltr">{topic.titleEn}</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">نظرة عامة</div>
          <p className="text-sm text-foreground/90 leading-7" dir="rtl">{topic.overview}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">المفاهيم الأساسية</div>
          <ul className="space-y-2">
            {topic.keyConcepts.map((c, i) => (
              <li key={i} className="text-sm text-foreground/85 flex gap-2 leading-6" dir="rtl">
                <span className="text-primary mt-1 shrink-0">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {topic.tasks && topic.tasks.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-foreground mb-3" dir="rtl">
            المهام العملية ({topic.tasks.length})
          </h3>
          <div className="space-y-3">
            {topic.tasks.map((task) => (
              <Card
                key={task.id}
                className="hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectTask({
                  ...task,
                  sectionTitle: "",
                  chapterTitle: "",
                  topicTitle: topic.title,
                })}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-primary shrink-0" />
                        <h4 className="text-sm font-semibold text-foreground" dir="rtl">{task.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground" dir="rtl">{task.question}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="outline" className="text-[10px]">{task.steps.length} خطوات</Badge>
                        <Badge variant="outline" className="text-[10px]">{task.verification.length} تحقق</Badge>
                        {task.commonErrors.length > 0 && (
                          <Badge variant="outline" className="text-[10px]">{task.commonErrors.length} أخطاء شائعة</Badge>
                        )}
                        {task.topology && (
                          <Badge variant="outline" className="text-[10px]">طوبولوجيا</Badge>
                        )}
                      </div>
                    </div>
                    <ChevronLeft className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===================================================================
// SectionOverview — عرض قسم كامل مع فصوله ومواضيعه
// ===================================================================
export function SectionOverview({
  section,
  onSelectTopic,
}: {
  section: Section;
  onSelectTopic: (topic: Topic, section: Section, chapter: Chapter) => void;
}) {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="text-sm font-bold">{section.letter}</Badge>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight" dir="rtl">
          {section.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5 font-mono" dir="ltr">{section.titleEn}</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-foreground/90 leading-7" dir="rtl">{section.description}</p>
        </CardContent>
      </Card>

      {section.chapters.map((chapter) => (
        <div key={chapter.id}>
          <h3 className="text-base font-bold text-foreground mb-2" dir="rtl">{chapter.title}</h3>
          <p className="text-xs text-muted-foreground mb-3" dir="rtl">{chapter.description}</p>
          <div className="space-y-2">
            {chapter.topics.map((topic) => (
              <Card
                key={topic.id}
                className="hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectTopic(topic, section, chapter)}
              >
                <CardContent className="p-3 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground" dir="rtl">{topic.title}</h4>
                    <p className="text-[11px] text-muted-foreground font-mono" dir="ltr">{topic.titleEn}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {topic.tasks && topic.tasks.length > 0 && (
                      <Badge variant="outline" className="text-[10px]">{topic.tasks.length} مهام</Badge>
                    )}
                    <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
