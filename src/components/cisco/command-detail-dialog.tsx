"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Terminal,
  BookOpen,
  AlertTriangle,
  ListChecks,
  ExternalLink,
  Lightbulb,
  FileWarning,
  Copy,
  Check,
  History,
  ArrowRight,
  Undo2,
} from "lucide-react";
import { useUserStore, type StudyStatus } from "@/store/user-store";
import {
  CERT_LABELS,
  SCOPE_LABELS,
  VERIFICATION_LABELS,
  VERIFICATION_COLORS,
  PLATFORM_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
} from "@/lib/cisco-helpers";
import type { CiscoCommand } from "@/lib/cisco-types";
import { BidiText, BidiParagraph, BidiListItem } from "@/components/cisco/bidi-text";
import { toast } from "@/hooks/use-toast";

interface Props {
  command: CiscoCommand | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STUDY_LABELS: Record<StudyStatus, string> = {
  "not-started": "لم أبدأ",
  learning: "قيد التعلّم",
  practiced: "تم التدريب",
  mastered: "تم الإتقان",
};

export function CommandDetailDialog({ command, open, onOpenChange }: Props) {
  const favorites = useUserStore((s) => s.favorites);
  const toggleFavorite = useUserStore((s) => s.toggleFavorite);
  const notes = useUserStore((s) => s.notes);
  const setNote = useUserStore((s) => s.setNote);
  const study = useUserStore((s) => s.study);
  const setStudyStatus = useUserStore((s) => s.setStudyStatus);
  const addRecentlyViewed = useUserStore((s) => s.addRecentlyViewed);

  // Track which command id the local note belongs to; reset when command changes.
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // When a new command opens, seed its note from the persisted store (lazily).
  // Using a derived pattern avoids setState-in-effect.
  const currentNote = command
    ? localNotes[command.id] ?? notes[command.id] ?? ""
    : "";

  const handleLocalNoteChange = (text: string) => {
    if (!command) return;
    setLocalNotes((prev) => ({ ...prev, [command.id]: text }));
  };

  // Mark recently-viewed — allowed: setState happens inside the store's action,
  // not in our effect body. We still avoid setState in our own component effect.
  useEffect(() => {
    if (command && open) {
      addRecentlyViewed(command.id);
    }
  }, [command, open, addRecentlyViewed]);

  if (!command) return null;

  const isFav = favorites.includes(command.id);
  const currentStudy = study[command.id] ?? "not-started";
  const isHistorical =
    command.status === "Deprecated" ||
    command.status === "Obsolete" ||
    command.status === "Historical" ||
    command.status === "NotInCurrentExamScope";

  const handleNoteSave = () => {
    if (command) {
      setNote(command.id, currentNote);
      toast({ title: "تم حفظ الملاحظة" });
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      toast({ title: "تم النسخ" });
      setTimeout(() => setCopiedField(null), 1500);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-card">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="font-mono text-xl text-foreground" dir="ltr">
                  {command.name}
                </DialogTitle>
                <Badge
                  variant="outline"
                  className={"text-[10px] border " + STATUS_COLORS[command.status]}
                >
                  {STATUS_LABELS[command.status]}
                </Badge>
              </div>
              {command.aliases && command.aliases.length > 0 && (
                <div className="text-[11px] text-muted-foreground mt-0.5" dir="ltr">
                  اختصارات: {command.aliases.join("، ")}
                </div>
              )}
              <DialogDescription className="mt-1 text-sm text-muted-foreground bidi-rtl" dir="rtl">
                <BidiText>{command.summary}</BidiText>
              </DialogDescription>
            </div>
            <Button
              variant={isFav ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFavorite(command.id)}
              className="shrink-0"
            >
              <Star className={isFav ? "fill-current h-4 w-4" : "h-4 w-4"} />
              {isFav ? "في المفضلة" : "إضافة"}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <Badge variant="secondary" className="text-xs">
              {CERT_LABELS[command.certLevel]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {SCOPE_LABELS[command.scope]}
            </Badge>
            <Badge
              variant="outline"
              className={"text-xs border " + VERIFICATION_COLORS[command.verification]}
            >
              {VERIFICATION_LABELS[command.verification]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {command.topic}
            </Badge>
            {command.platforms.map((p) => (
              <Badge key={p} variant="outline" className="text-xs font-mono">
                {PLATFORM_LABELS[p]}
              </Badge>
            ))}
          </div>

          {isHistorical && command.historicalNote && (
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-md">
              <div className="flex items-start gap-2">
                <History className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">
                    ملاحظة تاريخية
                  </div>
                  <p className="text-xs leading-6 text-amber-900 dark:text-amber-100 bidi-rtl" dir="rtl">
                    <BidiText>{command.historicalNote}</BidiText>
                  </p>
                  {command.modernAlternative && (
                    <p className="text-xs mt-2 text-amber-900 dark:text-amber-100 bidi-rtl" dir="rtl">
                      <strong>البديل الحديث:</strong>{" "}
                      <span dir="ltr" className="font-mono">{command.modernAlternative}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[calc(92vh-220px)]">
          <div className="px-6 py-5">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto">
                <TabsTrigger value="overview" className="text-xs">
                  <BookOpen className="h-3.5 w-3.5 ml-1" /> نظرة
                </TabsTrigger>
                <TabsTrigger value="examples" className="text-xs">
                  <Terminal className="h-3.5 w-3.5 ml-1" /> أمثلة
                </TabsTrigger>
                <TabsTrigger value="verify" className="text-xs">
                  <ListChecks className="h-3.5 w-3.5 ml-1" /> تحقق
                </TabsTrigger>
                <TabsTrigger value="trouble" className="text-xs">
                  <AlertTriangle className="h-3.5 w-3.5 ml-1" /> مشكلات
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-xs">
                  <FileWarning className="h-3.5 w-3.5 ml-1" /> ملاحظاتي
                </TabsTrigger>
              </TabsList>

              {/* Overview tab */}
              <TabsContent value="overview" className="mt-4 space-y-4 animate-fade-in-up">
                <section>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      الصيغة الرسمية
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => copyToClipboard(command.syntax, "syntax")}
                    >
                      {copiedField === "syntax" ? (
                        <Check className="h-3.5 w-3.5 ml-1" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 ml-1" />
                      )}
                      نسخ
                    </Button>
                  </div>
                  <pre className="cli-code" dir="ltr">{command.syntax}</pre>
                </section>

                <section>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    أوضاع CLI
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {command.cliMode.map((m) => (
                      <Badge key={m} variant="outline" className="text-xs">
                        {m}
                      </Badge>
                    ))}
                  </div>
                  {command.promptShape && (
                    <div className="text-xs text-muted-foreground bg-muted/40 border rounded px-2 py-1.5" dir="ltr">
                      <span className="text-muted-foreground">Prompt:</span>{" "}
                      <span className="font-mono text-foreground">{command.promptShape}</span>
                    </div>
                  )}
                </section>

                <section>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    الشرح التفصيلي
                  </h4>
                  <BidiParagraph className="text-sm leading-7 text-foreground/90">
                    {command.description}
                  </BidiParagraph>
                </section>

                {command.parameters && command.parameters.length > 0 && (
                  <section>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      المعاملات (Parameters)
                    </h4>
                    <div className="space-y-2">
                      {command.parameters.map((p, i) => (
                        <div
                          key={i}
                          className="border rounded-md p-3 bg-muted/30"
                        >
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <code className="text-sm font-mono text-foreground" dir="ltr">
                              {p.name}
                            </code>
                            {p.required ? (
                              <Badge variant="outline" className="text-[10px] bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400">
                                مطلوب
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px]">
                                اختياري
                              </Badge>
                            )}
                            {p.defaultValue && (
                              <span className="text-[10px] text-muted-foreground" dir="ltr">
                                افتراضي: <code className="font-mono">{p.defaultValue}</code>
                              </span>
                            )}
                          </div>
                          <BidiText className="text-xs leading-6 text-foreground/80">
                            {p.description}
                          </BidiText>
                          {p.allowedValues && (
                            <p className="text-[10px] text-muted-foreground mt-1" dir="ltr">
                              القيم: <code className="font-mono">{p.allowedValues.join(" | ")}</code>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {command.versionRange && (
                  <section>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      نطاق الإصدار
                    </h4>
                    <BidiText className="text-sm text-foreground/90">
                      {command.versionRange}
                    </BidiText>
                  </section>
                )}

                {command.curriculumVersions && command.curriculumVersions.length > 0 && (
                  <section>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      المناهج المرتبطة
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {command.curriculumVersions.map((v) => (
                        <Badge key={v} variant="outline" className="text-[10px]" dir="ltr">
                          {v}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}

                {command.undoMethod && (
                  <section>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Undo2 className="h-3.5 w-3.5" /> طريقة التراجع
                    </h4>
                    <div className="text-sm leading-6 text-foreground/90 bg-muted/40 border rounded-md p-3 bidi-rtl" dir="rtl">
                      <BidiText>{command.undoMethod}</BidiText>
                    </div>
                  </section>
                )}

                {command.modernAlternative && (
                  <section>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                      <ArrowRight className="h-3.5 w-3.5" /> البديل الحديث
                    </h4>
                    <div className="border rounded-md p-3 bg-sky-500/5 border-sky-500/30">
                      <code className="text-sm font-mono text-foreground" dir="ltr">
                        {command.modernAlternative}
                      </code>
                      {command.differencesFromAlternative && (
                        <div className="text-xs leading-6 text-foreground/80 mt-2 bidi-rtl" dir="rtl">
                          <BidiText>{command.differencesFromAlternative}</BidiText>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {command.warnings && command.warnings.length > 0 && (
                  <section>
                    <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> تحذيرات
                    </h4>
                    <ul className="space-y-2">
                      {command.warnings.map((w, i) => (
                        <li
                          key={i}
                          className="text-sm leading-6 bg-amber-500/10 border border-amber-500/30 rounded-md p-3 text-amber-900 dark:text-amber-100 bidi-rtl"
                          dir="rtl"
                        >
                          <BidiText>{w}</BidiText>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {command.commonErrors && command.commonErrors.length > 0 && (
                  <section>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      الأخطاء الشائعة
                    </h4>
                    <ul className="space-y-2">
                      {command.commonErrors.map((e, i) => (
                        <li
                          key={i}
                          className="text-sm leading-6 bg-muted/40 border rounded-md p-3 text-foreground/90 bidi-rtl"
                          dir="rtl"
                        >
                          <BidiText>{e}</BidiText>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Lightbulb className="h-3.5 w-3.5" /> المراجع الرسمية
                  </h4>
                  {command.references.length > 0 ? (
                    <ul className="space-y-1.5">
                      {command.references.map((r, i) => (
                        <li key={i}>
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            {r.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-md p-2">
                      لا يوجد مرجع رسمي مسجّل لهذا الأمر. السجل بحاجة لمراجعة.
                    </p>
                  )}
                </section>

                <div className="text-xs text-muted-foreground border-t pt-3 mt-4 flex items-center justify-between">
                  <span>
                    آخر مراجعة: <span dir="ltr">{command.lastReviewed}</span>
                  </span>
                  <Badge
                    variant="outline"
                    className={"text-[10px] border " + VERIFICATION_COLORS[command.verification]}
                  >
                    {VERIFICATION_LABELS[command.verification]}
                  </Badge>
                </div>
              </TabsContent>

              {/* Examples tab */}
              <TabsContent value="examples" className="mt-4 space-y-4 animate-fade-in-up">
                {command.examples.length > 0 ? (
                  command.examples.map((ex, i) => (
                    <section key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-mono">
                            {i + 1}
                          </span>
                          {ex.context}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => copyToClipboard(ex.code, `ex-${i}`)}
                        >
                          {copiedField === `ex-${i}` ? (
                            <Check className="h-3.5 w-3.5 ml-1" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 ml-1" />
                          )}
                          نسخ
                        </Button>
                      </div>
                      <pre className="cli-code" dir="ltr">{ex.code}</pre>
                      {ex.output && (
                        <>
                          <div className="text-xs text-muted-foreground mt-2 mb-1">المخرجات:</div>
                          <pre className="cli-code text-xs" dir="ltr">
                            <span className="cli-output">{ex.output}</span>
                          </pre>
                        </>
                      )}
                      {ex.outputExplanation && (
                        <div className="text-xs text-foreground/80 bg-muted/40 border rounded-md p-2 leading-6 bidi-rtl" dir="rtl">
                          <strong>تفسير:</strong>{" "}
                          <BidiText>{ex.outputExplanation}</BidiText>
                        </div>
                      )}
                    </section>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    لا توجد أمثلة مسجّلة لهذا السجل. السجل بحاجة لإكمال.
                  </p>
                )}
              </TabsContent>

              {/* Verification tab */}
              <TabsContent value="verify" className="mt-4 space-y-3 animate-fade-in-up">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  أوامر التحقق المرتبطة
                </h4>
                {command.verificationCommands && command.verificationCommands.length > 0 ? (
                  <ul className="space-y-2">
                    {command.verificationCommands.map((v, i) => (
                      <li
                        key={i}
                        className="font-mono text-sm bg-muted/60 rounded-md px-3 py-2 border flex items-center justify-between gap-2"
                        dir="ltr"
                      >
                        <span>{v}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => copyToClipboard(v, `ver-${i}`)}
                        >
                          {copiedField === `ver-${i}` ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">لا توجد أوامر تحقق مسجلة.</p>
                )}
              </TabsContent>

              {/* Troubleshooting tab */}
              <TabsContent value="trouble" className="mt-4 space-y-3 animate-fade-in-up">
                {command.troubleshootingNotes && command.troubleshootingNotes.length > 0 ? (
                  <ul className="space-y-2">
                    {command.troubleshootingNotes.map((t, i) => (
                      <li
                        key={i}
                        className="text-sm leading-6 bg-muted/40 border rounded-md p-3 text-foreground/90 bidi-rtl"
                        dir="rtl"
                      >
                        <BidiText>{t}</BidiText>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    لا توجد ملاحظات تشخيص مسجّلة. راجع قسم استكشاف الأخطاء العام.
                  </p>
                )}
              </TabsContent>

              {/* Notes tab */}
              <TabsContent value="notes" className="mt-4 space-y-4 animate-fade-in-up">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    حالة الدراسة
                  </Label>
                  <Select
                    value={currentStudy}
                    onValueChange={(v) => setStudyStatus(command.id, v as StudyStatus)}
                  >
                    <SelectTrigger className="w-full sm:w-72">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">{STUDY_LABELS["not-started"]}</SelectItem>
                      <SelectItem value="learning">{STUDY_LABELS["learning"]}</SelectItem>
                      <SelectItem value="practiced">{STUDY_LABELS["practiced"]}</SelectItem>
                      <SelectItem value="mastered">{STUDY_LABELS["mastered"]}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="note-text"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block"
                  >
                    ملاحظاتك الخاصة
                  </Label>
                  <Textarea
                    id="note-text"
                    value={currentNote}
                    onChange={(e) => handleLocalNoteChange(e.target.value)}
                    placeholder="اكتب هنا ملاحظاتك على هذا الأمر، الأمثلة التي جرّبتها، الأخطاء التي وقعت فيها وحلولها..."
                    rows={8}
                    className="resize-y font-mono text-sm"
                    dir="rtl"
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" onClick={handleNoteSave}>
                      حفظ الملاحظة
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
