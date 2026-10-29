# Cisco Commands Academy

> موسوعة تفاعلية لأوامر Cisco CLI — من أساسيات الشبكات إلى CCNP Enterprise
> مع مكتبة أوامر تاريخية وملغاة، ومحرك بحث دقيق، ولوحة تدقيق حقيقية للتغطية.

Interactive Arabic Cisco CLI reference covering Networking Fundamentals, CCNA (200-301), CCNP Enterprise (ENCOR 350-401 + ENARSI 300-410), with explicit handling of historical, deprecated, and retired commands. All explanations are written in Arabic while preserving English technical terms and command syntax.

---

## المميزات الرئيسية (Key Features)

- **مكتبة أوامر موثّقة** من المراجع الرسمية لـ Cisco (IOS XE 17.x و IOS 15.x)
- **محرك بحث متعدد الرموز** يدعم: اسم الأمر، الاختصارات (aliases)، الصيغة، الموضوع، الوصف، البديل الحديث، المصطلحات العربية
- **فلاتر متقدمة**: المنصة، مستوى الشهادة، النطاق، حالة التوثيق، حالة الأمر (حالي/مُهمَل/تاريخي/ملغى)، الموضوع، التصنيف
- **حالات الأوامر التاريخية**: Current / Deprecated / Obsolete / NotInCurrentExamScope / Historical / PlatformSpecific / VersionLimited / NeedsVerification
- **صفحة أمر موحّدة** تضم: الصيغة، CLI Mode، الـ Prompt، الشرح، المعاملات، الأمثلة، المخرجات وتفسيرها، أوامر التحقق، الأخطاء الشائعة، طريقة التراجع، البديل الحديث والاختلافات، التحذيرات، المراجع، آخر مراجعة
- **مكتبة استكشاف الأخطاء**: مشكلة → أعراض → أسباب → أوامر تشخيص → خطوات حل
- **تتبع شخصي**: المفضلة، الملاحظات الخاصة، تقدّم الدراسة (محفوظة محليًا في المتصفح)
- **لوحة تدقيق حقيقية** تحسب كل الأرقام من مصدر البيانات الفعلي (لا نسب عشوائية)
- **تعريب كامل** للواجهة مع الاحتفاظ بالمصطلحات الإنجليزية
- **خط Cairo** للنصوص العربية والإنجليزية + JetBrains Mono لأوامر CLI
- **وضع داكن/فاتح/تابع للنظام**
- **متجاوب** مع الهواتف والأجهزة اللوحية وأجهزة الكمبيوتر

---

## التقنيات (Tech Stack)

- **Framework**: Next.js 16 (App Router) + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York style)
- **State Management**: Zustand (with localStorage persistence) for client state
- **Icons**: lucide-react
- **Fonts**: Cairo (Arabic + Latin) + JetBrains Mono (code) — both self-hosted via `next/font/google` at build time

**No backend, no database, no auth required** — all data lives in `src/lib/cisco-data.ts` as a typed TypeScript module; user data (favorites, notes, study progress) is persisted in the browser's localStorage.

---

## التشغيل المحلي (Local Development)

```bash
# 1. تثبيت الاعتماديات
bun install   # أو npm install / pnpm install

# 2. تشغيل خادم التطوير
bun run dev   # http://localhost:3000

# 3. فحص جودة الكود
bun run lint

# 4. بناء نسخة الإنتاج
bun run build

# 5. تشغيل نسخة الإنتاج
bun run start
```

متطلبات البيئة:
- Node.js 18+ (أو Bun 1.0+)
- نظام تشغيل: Linux / macOS / Windows

---

## بنية المشروع (Project Structure)

```
src/
├── app/
│   ├── layout.tsx          # RootLayout مع خط Cairo + ThemeProvider
│   ├── page.tsx            # الصفحة الرئيسية (النظام الوحيد القابل للمشاهدة)
│   └── globals.css         # أنماط Tailwind + متغيرات السمة
├── components/
│   ├── ui/                 # مكتبة shadcn/ui الكاملة
│   ├── cisco/
│   │   ├── command-card.tsx           # بطاقة أمر في نتائج البحث
│   │   ├── command-detail-dialog.tsx  # نافذة تفاصيل الأمر (موحّدة)
│   │   ├── views.tsx                  # كل طرق العرض الثمانية
│   │   ├── theme-toggle.tsx
│   │   └── ...
│   └── theme-provider.tsx  # مزوّد السمة (next-themes)
├── lib/
│   ├── cisco-types.ts      # أنواع TypeScript (مع CommandStatus التاريخي)
│   ├── cisco-data.ts       # مصدر المحتوى الكامل (الأوامر + Troubleshooting + المناهج)
│   ├── cisco-helpers.ts    # دوال البحث والفلترة والإحصاءات
│   └── utils.ts
├── store/
│   └── user-store.ts       # Zustand store للمفضلة والملاحظات والتقدم
└── hooks/
    └── use-toast.ts        # نظام التنبيهات

prisma/                     # Prisma schema (متوفر لكن غير مستخدم حاليًا)
public/                     # أصول ثابتة
```

---

## إضافة محتوى جديد (Adding Content)

كل المحتوى يعيش في `src/lib/cisco-data.ts`. لإضافة أمر جديد:

```typescript
{
  id: "cmd-unique-id",
  name: "command-name",                    // الاسم الإنجليزي كما هو
  aliases: ["shortcut"],                   // اختياري
  syntax: "command-name <param>",
  platforms: ["IosXe", "IOS"],
  cliMode: ["Privileged EXEC"],
  promptShape: "Router#",                  // اختياري
  certLevel: "CCNA",
  scope: "certification",
  topic: "VLANs and SVI",
  category: "Switching",
  curriculumVersions: ["CCNA v2.0 (200-301)"],

  status: "Current",                       // أو Deprecated / Obsolete / Historical
  historicalNote: "سبب الإهمال...",         // مطلوب إذا status != Current
  modernAlternative: "new-command",        // للأوامر المُهمَلة
  differencesFromAlternative: "...",       // اختياري

  summary: "ملخص عربي مختصر.",
  description: "شرح عربي تفصيلي مع الاحتفاظ بالمصطلحات الإنجليزية...",
  parameters: [
    { name: "<param>", description: "...", required: true }
  ],
  examples: [{ context: "...", code: "...", output: "...", outputExplanation: "..." }],
  verificationCommands: ["show ..."],
  troubleshootingNotes: ["..."],
  commonErrors: ["..."],
  undoMethod: "no command-name",
  warnings: ["..."],
  references: [{ label: "Cisco Official Guide", url: "https://..." }],
  verification: "Verified",                // أو Officially Referenced / Needs Review / Draft
  lastReviewed: "2026-10-29",
  relatedCommandIds: ["cmd-other"],
  tags: ["switching", "vlan"]
}
```

بعد الإضافة، تُحدَّث جميع الإحصاءات في لوحة التدقيق تلقائيًا.

---

## النشر (Deployment)

### Vercel (الأسهل)

1. ادفع المشروع إلى GitHub/GitLab
2. اربط المستودع بـ Vercel
3. إعداد النشر الافتراضي يعمل (Next.js detector)
4. لا متغيرات بيئة مطلوبة
5. انشر — سيتم بناء Next.js تلقائيًا وتشغيله

### خوادم Linux (PM2 / systemd)

```bash
# بناء الإنتاج
bun run build

# تشغيل خادم Node.js
NODE_ENV=production bun run start   # أو node .next/standalone/server.js

# أو باستخدام PM2
pm2 start "bun run start" --name cisco-academy
pm2 save && pm2 startup
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]
```

### Cloudflare Pages / Netlify

متوافق مع كلاهما — اختر إعداد Next.js الافتراضي. لا حاجة لإعداد خاص.

---

## الاختبار (Testing)

```bash
# فحص جودة الكود (ESLint + Next.js rules)
bun run lint

# فحص الأنواع (TypeScript)
bun run tsc --noEmit

# بناء الإنتاج (يتحقق من الأخطاء قبل النشر)
bun run build
```

التحقق اليدوي الموصى به بعد كل تغيير:
1. افتح الصفحة الرئيسية — يجب أن تظهر الإحصاءات الفعلية
2. ابحث في المكتبة بكلمة "ospf" — يجب أن تتغير النتائج
3. افتح تفاصيل أمر — تحقق من ظهور كل الأقسام (الصيغة، CLI Mode، المعاملات، الأمثلة، إلخ)
4. أضف أمرًا للمفضلة — تحقق من ظهوره في قسم المفضلة
5. افتح لوحة التدقيق — يجب أن تتطابق الأرقام مع عدد الأوامر فعليًا
6. بدّل الوضع الداكن/الفاتح — يجب أن يتغير المظهر فورًا

---

## سياسة المحتوى (Content Policy)

### درجات التوثيق (Verification States)

- **Verified (موثّق)**: تمت مراجعة الصيغة والسياق بالكامل باستخدام مرجع رسمي
- **Officially Referenced (مرجع رسمي)**: يوجد مرجع رسمي يدعم الأمر لكن لم تُختبر كل التفاصيل
- **Needs Review (بحاجة لمراجعة)**: معلومات ناقصة أو متعارضة تحتاج مراجعة بشرية
- **Unsupported/Retired (غير مدعوم)**: لا يدعم البيئة المستهدفة أو انتهى الدعم
- **Draft (مسودة)**: محتوى أولي — لا يُعرض كموثّق

### حالات الأوامر (Command Statuses)

- **Current**: أمر حالي تدعمه المنصة/الإصدار المحدد
- **Deprecated**: صيغة موصى بعدم استخدامها وفق مرجع موثق
- **Obsolete / Retired**: انتهى دعمها في النطاق المُتحقَّق منه
- **NotInCurrentExamScope**: خرج من المنهج الحالي لكنه لا يزال مدعومًا فنيًا
- **Historical**: موثق تاريخيًا لفهم منهج/منصة/إصدار سابق
- **PlatformSpecific / VersionLimited**: خاص بمنصة أو إصدار محدد
- **NeedsVerification**: معلوماته غير كافية لتحديد الحالة

### النطاق (Scope)

- **certification**: ضمن المنهج الرسمي المحدد
- **extended**: مرجع عملي موسّع خارج نطاق الامتحان
- **unverified**: لم يُتحقق من ارتباطه بالمنهج

> **مبدأ أساسي**: لا يُحذف أمر لمجرد أنه قديم. يُحتفظ به مع توضيح حالته التاريخية والبديل الحديث إن وُجد.

---

## المصادر الرسمية المعتمدة (Official Sources)

- Cisco Learning Network — CCNA v2 Exam Topics: https://learningnetwork.cisco.com/s/ccna-v2-exam-topics
- Cisco CCNP Enterprise: https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccnp-enterprise/index.html
- Cisco ENCOR (350-401): https://www.cisco.com/site/us/en/learn/training-certifications/exams/encor.html
- Cisco ENARSI (300-410): https://www.cisco.com/site/us/en/learn/training-certifications/exams/enarsi.html
- Cisco IOS XE 17 Command References: https://www.cisco.com/c/en/us/support/ios-nx-os-software/ios-xe-26/products-command-reference-list.html

---

## الترخيص (License)

هذا المشروع مرجع تعليمي غير رسمي ولا ينتمي إلى Cisco Systems. أسماء المنتجات والبروتوكولات والشهادات مملوكة لأصحابها. المحتوى التعليمي (الشروح العربية) مفتوح للاستخدام التعليمي.

---

## القيود المعروفة (Known Limitations)

1. **لا حسابات مستخدمين** — جميع البيانات الشخصية محفوظة محليًا في المتصفح. مسح ذاكرة المتصفح يفقدها.
2. **لا مزامنة عبر الأجهزة** — المفضلة والملاحظات لا تنتقل بين المتصفحات.
3. **التغطية غير مكتملة** — راجع لوحة التدقيق لمعرفة الموضوعات المكتملة والناقصة. المناهج الحالية (CCNA / ENCOR / ENARSI) مغطاة جزئيًا؛ تخصصات CCNP (Security/DC/SP/Wireless/Collaboration) في وضع التوسعة المستقبلية.
4. **التحقق الوثائقي فقط** — درجة "موثّق" تعني مراجعة وثائقية، وليس بالضرورة اختبارًا على جهاز فعلي.

لمواصلة التطوير، أضف أوامر جديدة إلى `src/lib/cisco-data.ts` وفق نموذج `CiscoCommand` في `cisco-types.ts`.
