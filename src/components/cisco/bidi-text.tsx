"use client";

import React from "react";

// ===================================================================
// BidiText — يعرض النص المختلط عربي/إنجليزي بشكل صحيح.
//
// المشكلة: عند خلط نص عربي (RTL) مع مصطلحات إنجليزية (LTR) في
// نفس الفقرة، كان dir="auto" يكتشف LTR من أول حرف إنجليزي
// فيجعل الفقرة تبدأ من الشمال — وهذا غير صحيح في واجهة عربية.
//
// الحل الجذري:
// 1. كل فقرة عربية تُجبَر على dir="rtl" (تبدأ من اليمين دائمًا).
// 2. كل سلسلة أحرف لاتينية متتالية تُلَفّ في <code dir="ltr">
//    مع unicode-bidi: isolate لعزلها كاملًا عن السياق العربي.
// 3. بهذا: الفقرة تبدأ من اليمين (صحيح للعربية)، والمصطلحات
//    الإنجليزية تظهر كجزر LTR معزولة داخل التدفق RTL.
// ===================================================================

// نمط يطابق السلاسل اللاتينية المتتالية
const LATIN_RUN_REGEX = /([A-Za-z][A-Za-z0-9\-_./:<>| ]*[A-Za-z0-9]|[A-Za-z])/g;

interface BidiTextProps {
  children: string;
  className?: string;
  wrapLatin?: boolean;
}

export function BidiText({
  children,
  className,
  wrapLatin = true,
}: BidiTextProps) {
  if (!children) return null;

  // إن لم نرد لفّ الأجزاء اللاتينية، نكتفي بـ dir="rtl"
  if (!wrapLatin) {
    return (
      <span dir="rtl" className={className}>
        {children}
      </span>
    );
  }

  // نقسم النص إلى أجزاء: لاتينية (تُلَفّ في <code>) وغير لاتينية (تُعرض كما هي)
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  const localRegex = new RegExp(LATIN_RUN_REGEX.source, "g");

  while ((match = localRegex.exec(children)) !== null) {
    const matchStart = match.index;
    const matchText = match[0];

    // أضف النص قبل المطابقة (عربي أو رموز)
    if (matchStart > lastIndex) {
      parts.push(
        <span key={`pre-${key++}`}>
          {children.slice(lastIndex, matchStart)}
        </span>
      );
    }

    // أضف الجزء اللاتيني ملفوفًا في <code dir="ltr">
    const trimmed = matchText.replace(/\s+$/, "");
    const trailingSpace = matchText.slice(trimmed.length);

    if (trimmed) {
      parts.push(
        <code
          key={`code-${key++}`}
          dir="ltr"
          className="inline-code"
        >
          {trimmed}
        </code>
      );
    }

    // أضف المسافات الزائدة كنص عادي
    if (trailingSpace) {
      parts.push(
        <span key={`space-${key++}`}>{trailingSpace}</span>
      );
    }

    lastIndex = matchStart + matchText.length;
  }

  // أضف ما تبقى من النص
  if (lastIndex < children.length) {
    parts.push(
      <span key={`final-${key++}`}>
        {children.slice(lastIndex)}
      </span>
    );
  }

  if (parts.length === 0) {
    return (
      <span dir="rtl" className={className}>
        {children}
      </span>
    );
  }

  return <span dir="rtl" className={className}>{parts}</span>;
}

// ===================================================================
// BidiParagraph — فقرة عربية كاملة مع dir="rtl" (تبدأ من اليمين)
// ===================================================================
interface BidiParagraphProps {
  children: string;
  className?: string;
  wrapLatin?: boolean;
}

export function BidiParagraph({
  children,
  className,
  wrapLatin = true,
}: BidiParagraphProps) {
  return (
    <p
      dir="rtl"
      className={(className ?? "") + " text-right"}
    >
      <BidiText wrapLatin={wrapLatin}>{children}</BidiText>
    </p>
  );
}
