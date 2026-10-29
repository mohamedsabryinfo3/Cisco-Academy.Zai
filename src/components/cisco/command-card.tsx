"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, ChevronLeft } from "lucide-react";
import { useUserStore } from "@/store/user-store";
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
import { BidiText } from "@/components/cisco/bidi-text";

interface Props {
  command: CiscoCommand;
  onOpen: () => void;
}

export function CommandCard({ command, onOpen }: Props) {
  const favorites = useUserStore((s) => s.favorites);
  const toggleFavorite = useUserStore((s) => s.toggleFavorite);
  const study = useUserStore((s) => s.study);
  const isFav = favorites.includes(command.id);
  const currentStudy = study[command.id];

  const isHistorical =
    command.status === "Deprecated" ||
    command.status === "Obsolete" ||
    command.status === "Historical" ||
    command.status === "NotInCurrentExamScope";

  return (
    <Card
      className="group relative p-4 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer animate-fade-in-up"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-mono text-base font-semibold text-foreground truncate" dir="ltr">
              {command.name}
            </h3>
            <Badge
              variant="outline"
              className={"text-[10px] px-1.5 py-0 border " + STATUS_COLORS[command.status]}
            >
              {STATUS_LABELS[command.status]}
            </Badge>
            {currentStudy && (
              <Badge
                variant="outline"
                className={
                  "text-[10px] px-1.5 py-0 " +
                  (currentStudy === "mastered"
                    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                    : currentStudy === "practiced"
                    ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30")
                }
              >
                {currentStudy === "mastered"
                  ? "تم الإتقان"
                  : currentStudy === "practiced"
                  ? "تم التدريب"
                  : "قيد التعلّم"}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2">{command.topic}</p>
          <p className="text-sm text-foreground/80 line-clamp-2 leading-6 bidi-rtl" dir="rtl">
            <BidiText>{command.summary}</BidiText>
          </p>

          {isHistorical && (
            <p className="text-[11px] mt-2 text-amber-700 dark:text-amber-400 leading-5 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-1.5 bidi-rtl" dir="rtl">
              <BidiText wrapLatin={false}>
                {command.status === "Deprecated"
                  ? "أمر مُهمَل — لا يُنصح باستخدامه في النشرات الجديدة."
                  : command.status === "Obsolete"
                  ? "أمر منتهٍ — لم يعد مدعومًا ضمن النطاق المُتحقَّق منه."
                  : command.status === "Historical"
                  ? "أمر تاريخي — محفوظ لفهم الإصدارات/المناهج السابقة."
                  : "أمر خارج المنهج الحالي — قد يبقى مدعومًا فنيًا."}
              </BidiText>
            </p>
          )}

          <div className="flex flex-wrap gap-1 mt-3">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {CERT_LABELS[command.certLevel]}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {SCOPE_LABELS[command.scope]}
            </Badge>
            <Badge
              variant="outline"
              className={"text-[10px] px-1.5 py-0 border " + VERIFICATION_COLORS[command.verification]}
            >
              {VERIFICATION_LABELS[command.verification]}
            </Badge>
            {command.platforms.slice(0, 2).map((p) => (
              <Badge
                key={p}
                variant="outline"
                className="text-[10px] px-1.5 py-0 font-mono"
              >
                {PLATFORM_LABELS[p]}
              </Badge>
            ))}
            {command.platforms.length > 2 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                +{command.platforms.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(command.id);
            }}
            aria-label="إضافة للمفضلة"
          >
            <Star
              className={
                "h-4 w-4 " +
                (isFav ? "fill-amber-400 text-amber-400" : "text-muted-foreground")
              }
            />
          </Button>
          <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Card>
  );
}
