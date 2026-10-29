import type {
  CiscoCommand,
  PlatformInfo,
  TroubleshootingEntry,
  CurriculumVersion,
  TopicCoverage,
} from "./cisco-types";

// ===================================================================
// Cisco Commands Academy — Knowledge Base v2
// All command descriptions are written in Arabic while preserving
// English technical terms (CLI modes, protocol names, parameter
// names, command syntax). Historical and deprecated commands are
// retained with explicit status fields so users can find them via
// search and understand their current applicability.
//
// Sources verified for this revision:
//   - Cisco IOS XE 17.x Command Reference (Catalyst 9300 / ISR 4K)
//   - Cisco IOS 15.x Command Reference (legacy Catalyst 2960 / ISR G2)
//   - CCNA v1.0 (200-120) and v2.0 (200-301) official exam blueprints
//   - CCNP ENCOR (350-401) and ENARSI (300-410) official blueprints
// ===================================================================

export const LAST_DB_REVIEW = "2026-10-29";

// ===================================================================
// Platforms
// ===================================================================

export const PLATFORMS: PlatformInfo[] = [
  {
    id: "IOS",
    name: "Cisco IOS",
    cliModel: "IOS التقليدي أحادي النواة (Traditional monolithic IOS)",
    description:
      "نظام التشغيل IOS الكلاسيكي المستخدم في محولات Catalyst القديمة وموجّهات ISR من الجيل الأول والثاني. يعتمد على ملف إعداد واحد (running-config و startup-config)، ويُطبَّق الإعداد فورًا ويبقى في الذاكرة حتى يُحفظ بـ write memory أو copy run start.",
    managementInterfaces: ["Console", "Telnet", "SSH v2", "SNMP v2c/v3"],
    commonDevices: ["Catalyst 2960", "ISR 1900/2900/3900", "Catalyst 3560/3750"],
    notes:
      "أوامر IOS XE متوافقة في صيغتها مع IOS إلى حد بعيد. يعتمد المسار التعليمي في المنصة على IOS XE باعتباره الهدف الأساسي لأن منهج CCNA و CCNP Enterprise يفترض استخدام IOS XE على Catalyst 9000 و ISR 4000.",
  },
  {
    id: "IosXe",
    name: "Cisco IOS XE",
    cliModel: "نموذج IOSd على نواة Linux (Linux-based IOS daemon model)",
    description:
      "نظام تشغيل معياري مبني على Linux يُستخدم في محولات Catalyst 9000 وموجّهات ISR 4000 و Catalyst 8000 ومتحكمات Catalyst 9800 اللاسلكية. واجهة CLI متوافقة إلى حد كبير مع IOS لكنها تدعم أدوات تشغيل حديثة: REST API و NETCONF/RESTCONF و YANG models و gNMI إضافةً إلى إطار استضافة التطبيقات IOx.",
    managementInterfaces: ["Console", "SSH", "NETCONF", "RESTCONF", "gNMI", "SNMP v3", "REST API"],
    commonDevices: ["Catalyst 9200/9300/9400/9500", "ISR 4321/4331/4351/4431", "Catalyst 8000V", "Catalyst 9800 WLC"],
    notes:
      "المنصة الافتراضية لمنهج CCNA و CCNP Enterprise. يجب التحقق دائمًا من إصدار IOS XE (مثل 17.6 أو 17.9 أو 17.12) لأن توفّر الميزات وصيغ الأوامر يختلف بين الإصدارات.",
  },
  {
    id: "NxOs",
    name: "Cisco NX-OS",
    cliModel: "CLI معياري مع نموذج تفعيل الميزات (feature enablement model)",
    description:
      "نظام تشغيل مراكز البيانات يعمل على محولات Cisco Nexus ومحولات التخزين MDS. يستخدم نموذج ترخيص ميزات إذ يجب تفعيل الميزة بـ feature <name> قبل أن تصبح أوامرها متاحة. يدعم VDC على المنصات القديمة و VRF افتراضيًا.",
    managementInterfaces: ["Console", "SSH", "NX-API (REST)", "NETCONF", "gNMI", "SNMP v3"],
    commonDevices: ["Nexus 9000", "Nexus 7000", "Nexus 5000", "Nexus 3000", "MDS 9200/9700"],
    notes:
      "كثير من أوامر NX-OS تشبه IOS لكن سلوكها يختلف: show running-config يعرض فقط الميزات المفعّلة، والأوامر المدركة لـ VRF تتطلب كلمة VRF، وبعض الأوامر مثل router ospf تضمّن اسم العملية في الصيغة router ospf <tag>.",
  },
  {
    id: "IosXr",
    name: "Cisco IOS XR",
    cliModel: "CLI موزّع معياري بأوضاع admin/oper/config",
    description:
      "نظام تشغيل بمستوى شبكات النقل يعمل على ASR 9000 و NCS 5000/5500/6000 و IOS XRv 9000. يعتمد نموذج إعداد قائم على commit: تُجمع التغييرات في إعداد مرشح (candidate) ولا تُطبَّق إلا بعد تنفيذ commit. يدعم وضع admin للعمليات على مستوى الرف/الشاس، والإعداد لكل LR.",
    managementInterfaces: ["Console", "SSH", "NETCONF", "RESTCONF", "gNMI", "XML agent", "TACACS+"],
    commonDevices: ["ASR 9000", "ASR 9900", "NCS 5500", "NCS 540", "IOS XRv 9000"],
    notes:
      "الإعداد قائم على commit. استخدم دائمًا commit لتطبيق التغييرات و show configuration لمراجعة التغييرات المعلّقة. التراجع يستخدم rollback last أو معرّفات commit محددة من show configuration history.",
  },
  {
    id: "Catalyst",
    name: "بيئات تشغيل Catalyst",
    cliModel: "IOS XE على Catalyst 9K الحديثة، IOS على Catalyst 3K/2K القديمة",
    description:
      "تصنيف تجميعي لمنصات محولات Cisco Catalyst. تُشغَّل محولات Catalyst 9000 الحديثة بـ IOS XE. أما Catalyst 2960/3560/3750/3850 القديمة فتعمل بـ IOS (أو IOS XE مبسّط على 3850). صيغة أوامر ميزات التبديل (VLAN و trunk و STP و EtherChannel) متطابقة إلى حد بعيد بين النوعين.",
    managementInterfaces: ["Console", "SSH", "NETCONF (9k only)", "SNMP", "REST (9k only)"],
    commonDevices: ["Catalyst 9200/9300/9400/9500/9600", "Catalyst 3850/3650", "Catalyst 2960"],
    notes:
      "عند توثيق أمر Catalyst، سجّل أيضًا ما إذا كان يتطلب IOS XE 17.x أو يتوفر أيضًا في IOS 15.x.",
  },
  {
    id: "Nexus",
    name: "بيئات تشغيل Nexus",
    cliModel: "NX-OS",
    description:
      "محولات Nexus تعمل بـ NX-OS. محولات Nexus 9000 في وضع ACI تعمل بنظام تشغيل مختلف يتحكم به APIC وهي خارج نطاق مكتبة CLI المستقلة. وضع Nexus في NX-OS هو الهدف الأساسي لمراكز البيانات.",
    managementInterfaces: ["Console", "SSH", "NX-API", "NETCONF", "gNMI"],
    commonDevices: ["Nexus 9300/9500/9700", "Nexus 7700/7800", "Nexus 3400"],
    notes:
      "Nexus 9000 يمكن أن يعمل إما بـ NX-OS (مستقل) أو بـ ACI (تحكّم مركزي). فقط وضع NX-OS مشمول في مكتبة CLI هذه.",
  },
  {
    id: "WLC",
    name: "Wireless LAN Controller",
    cliModel: "AireOS CLI على 3504/5520/8540، أو IOS XE على 9800",
    description:
      "توجد عائلتان من WLC: متحكمات AireOS (2504/3504/5520/8540/vWLC) تستخدم CLI قائم على القوائم مختلف عن IOS، ومتحكمات Catalyst 9800 تعمل بـ IOS XE وتستخدم نفس CLI الخاص بـ Catalyst 9000. كلاهما موثّق عند الحاجة.",
    managementInterfaces: ["Console", "SSH", "HTTPS GUI", "NETCONF (9800 only)"],
    commonDevices: ["Catalyst 9800-40/80/CL", "3504 WLC", "5520/8540 WLC", "vWLC"],
    notes:
      "أوامر اللاسلكي على Catalyst 9800 تتبع صيغة IOS XE، بينما على AireOS تتبع نموذج config/show القائم على القوائم. يجب دائمًا وضع علامة على أوامر WLC بالمنصة الصحيحة.",
  },
  {
    id: "Meraki",
    name: "Cisco Meraki",
    cliModel: "لوحة تحكم سحابية بدون CLI تقليدي",
    description:
      "أجهزة Meraki MS/MX/MR تُدار عبر لوحة Meraki Dashboard السحابية. لا يوجد CLI على مستوى الجهاز للإعداد. تعمل Meraki Dashboard API (REST) كالبديل البرمجي وهي الواجهة الموثّقة الوحيدة للأتمتة.",
    managementInterfaces: ["Meraki Dashboard (HTTPS)", "Dashboard API v1 (REST)", "Local status page (read-only)"],
    commonDevices: ["Meraki MS (switches)", "Meraki MX (security appliances)", "Meraki MR (APs)"],
    notes:
      "Meraki مدرجة كمنصة Cisco لإكمال التغطية. تسجّلها المكتبة فقط تحت المرجع الموسّع، ولا تُعدّ جزءًا من نطاق CLI لمنهج CCNA/CCNP.",
  },
];

// ===================================================================
// Curriculum versions — current and legacy
// ===================================================================

export const CURRICULUM_VERSIONS: CurriculumVersion[] = [
  {
    cert: "CCNA",
    examCode: "200-301",
    examTopicsVersion: "v2.0 (صدر 2023-04-20)",
    publishedDate: "2023-04-20",
    lastVerified: "2026-10-29",
    sourceUrl: "https://learningnetwork.cisco.com/s/ccna-v2-exam-topics",
    status: "current",
    notes:
      "امتحان CCNA أحاديًا يغطي أساسيات الشبكات، الوصول للشبكة، اتصالية IP، خدمات IP، أساسيات الأمان، الأتمتة والقابلية للبرمجة. حلّ محل مسارات CCNA القديمة متعددة الامتحانات (ICND1/ICND2) في 2020 وتحُدّث إلى v2.0 في 2023.",
  },
  {
    cert: "CCNA (قديم)",
    examCode: "200-120 / 100-101 ICND1 + 200-101 ICND2",
    examTopicsVersion: "v1.0 (متقاعد 2016-08-20)",
    publishedDate: "2013-03-25",
    lastVerified: "2026-10-29",
    sourceUrl: "https://learningnetwork.cisco.com/s/ccna",
    status: "retired",
    notes:
      "إصدار CCNA القديم بمسارين. كان يغطي ICDN1 (أساسيات) و ICND2 (متوسط). أُحيل إلى التقاعد في 2016 واستُبدل بـ CCNA v3.0 (200-125). العديد من الأوامر لا تزال صالحة فنيًا لكنها خرجت من نطاق الامتحان الحالي. تشمل الأوامر التاريخية: frame-relay و RIPv2 (لا يزال مدعومًا لكنه ليس في المنهج الحالي).",
  },
  {
    cert: "CCNP Enterprise Core",
    examCode: "350-401 ENCOR",
    examTopicsVersion: "v1.1",
    publishedDate: "2020-02-24",
    lastVerified: "2026-10-29",
    sourceUrl: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/encor.html",
    status: "current",
    notes:
      "الامتحان الأساسي لـ CCNP Enterprise. يغطي البنية، الافتراضية، البنية التحتية (Layer 2/Layer 3، OSPF، BGP، لاسلكي)، ضمان الشبكة، الأمان، والأتمتة. يعمل أيضًا كامتحان تأهيلي لـ CCIE Enterprise Infrastructure.",
  },
  {
    cert: "CCNP Enterprise Advanced Routing",
    examCode: "300-410 ENARSI",
    examTopicsVersion: "v1.1",
    publishedDate: "2020-02-24",
    lastVerified: "2026-10-29",
    sourceUrl: "https://www.cisco.com/site/us/en/learn/training-certifications/exams/enarsi.html",
    status: "current",
    notes:
      "امتحان تخصصي لـ CCNP Enterprise يركّز على التوجيه المتقدم (OSPFv2/v3، IS-IS، BGP، إعادة توزيع المسارات)، التشخيص، والخدمات (DHCP، NAT، IPv6، MTU، الأداء). أعمق امتحان توجيه في مسار Enterprise.",
  },
  {
    cert: "CCNP Routing & Switching (قديم)",
    examCode: "300-101 ROUTE + 300-115 SWITCH + 300-135 TSHOOT",
    examTopicsVersion: "v1.0 (متقاعد 2020-02-24)",
    publishedDate: "2014-01-29",
    lastVerified: "2026-10-29",
    sourceUrl: "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/ccnp-routing-switching/index.html",
    status: "retired",
    notes:
      "مسار CCNP R&S القديم قبل دمجه في CCNP Enterprise في 2020. أوامره لا تزال مدعومة فنيًا على IOS XE. تشمل الأوامر التاريخية المرتبطة: بروتوكولات مثل RIPv2 و IS-IS التي خرجت من نطاق ENCOR/ENARSI الحالي.",
  },
];

// ===================================================================
// Command library
// ===================================================================

export const COMMANDS: CiscoCommand[] = [
  // =================================================================
  // Fundamentals — CLI modes & inspection
  // =================================================================
  {
    id: "cmd-enable",
    name: "enable",
    syntax: "enable [privilege-level]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["User EXEC"],
    promptShape: "Router> → Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "CLI Modes",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "ينقل الجلسة من وضع User EXEC (Router>) إلى وضع Privileged EXEC (Router#)، ما يتيح الوصول إلى جميع أوامر show و debug و copy والإعداد.",
    description:
      "الأمر enable هو بوابة الدخول إلى العمليات ذات الصلاحيات على أجهزة Cisco. بدون وسائط يرفع المستوى إلى privilege level 15 (الأعلى). الوسيط الاختياري privilege-level (من 0 إلى 15) يرفع المستوى إلى ذلك المستوى فقط إذا كان المستخدم مخوّلًا. عند ضبط enable secret يطلب الجهاز كلمة السر، وهي خط الدفاع الأول ضد التغييرات غير المصرّح بها. من الممارسات الفضلى تعطيل enable password (المخزّنة كنص صريح افتراضيًا) والاعتماد حصريًا على enable secret المخزّنة كـ hash (PBKDF2 أو scrypt على الإصدارات الحديثة).",
    parameters: [
      {
        name: "privilege-level",
        description: "مستوى الصلاحية المطلوب من 0 إلى 15. القيمة الافتراضية 15 (الصلاحيات الكاملة).",
        required: false,
        defaultValue: "15",
        allowedValues: ["0", "1", "2", "...", "15"],
      },
    ],
    examples: [
      {
        context: "الانتقال القياسي إلى وضع Privileged EXEC",
        code: "Router> enable\nPassword: ********\nRouter#",
      },
      {
        context: "الانتقال إلى مستوى صلاحية محدد (مستوى 5)",
        code: "Router> enable 5\nPassword: ********\nRouter#",
      },
    ],
    verificationCommands: ["show privilege"],
    troubleshootingNotes: [
      "إذا رُفض enable برسالة 'Password required but none set'، يجب على المسؤول ضبط enable secret من جلسة console.",
      "فقدان enable secret على جهاز بدون AAA يتطلب استعادة كلمة المرور عبر تسلسل break-key وقت الإقلاع — وهذا يقطع الخدمة.",
    ],
    commonErrors: [
      "نسيان ضبط enable secret واعتماد الجهاز على enable password المكشوفة كنص صريح. الحل: استخدم enable secret فقط.",
      "محاولة استخدام enable من جلسة VTTY بدون صلاحيات كافية عبر AAA. تحقق من إعداد aaa authentication login default.",
    ],
    undoMethod: "للخروج من وضع Privileged EXEC استخدم disable للعودة إلى User EXEC.",
    warnings: [
      "لا تخزّن كلمات enable secret في السكربتات أو الدردشات. استخدم AAA (TACACS+/RADIUS) مع مستويات صلاحية مسمّاة في الإنتاج.",
    ],
    references: [
      {
        label: "Cisco IOS XE Privilege Levels Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/sec_usr_cfg/configuration/xe-17/sec-usr-cfg-xe-17-book/sec-cfg-priv-level.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-configure-terminal", "cmd-enable-secret", "cmd-disable"],
    tags: ["mode-change", "security", "fundamentals"],
  },
  {
    id: "cmd-disable",
    name: "disable",
    syntax: "disable [privilege-level]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router# → Router>",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "CLI Modes",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "ينزل بالجلسة من وضع Privileged EXEC (Router#) إلى وضع User EXEC (Router>) بدون إنهاء الجلسة. عكس الأمر enable.",
    description:
      "الأمر disable يُنزل بالمستخدم من وضع Privileged EXEC إلى User EXEC دون تسجيل الخروج من الجهاز. يُستخدم عند الحاجة لتقليل الصلاحيات مؤقتًا لإجراء عمليات قراءة فقط. الوسيط الاختياري privilege-level يُنزل إلى مستوى محدد بدلًا من المستوى 1.",
    parameters: [
      {
        name: "privilege-level",
        description: "المستوى المطلوب النزول إليه. افتراضيًا 1 (User EXEC).",
        required: false,
        defaultValue: "1",
      },
    ],
    examples: [
      {
        context: "العودة إلى User EXEC من Privileged EXEC",
        code: "Router# disable\nRouter>",
      },
    ],
    verificationCommands: ["show privilege"],
    references: [
      {
        label: "Cisco IOS Configuration Fundamentals Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-enable"],
    tags: ["mode-change", "fundamentals"],
  },
  {
    id: "cmd-configure-terminal",
    name: "configure terminal",
    aliases: ["conf t"],
    syntax: "configure terminal",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router# → Router(config)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "CLI Modes",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يدخل وضع Global Configuration (Router(config)#) من Privileged EXEC. هذه هي البوابة لكل أمر إعداد على مستوى الجهاز.",
    description:
      "يُختصر بـ conf t، وهذا الأمر ينقل الجلسة من Privileged EXEC إلى Global Configuration. من هذا الوضع يمكنك إصدار أي أمر عام (hostname و banner و ip routing و AAA وغيرها) أو الدخول إلى وضع فرعي مثل Interface أو Router أو Line Configuration. على IOS XR يستخدم سير العمل المكافئ configure ثم commit، لكن configure terminal يُقبل أيضًا كاسم بديل. يُطبَّق الإعداد فورًا على IOS/IOS XE/NX-OS، لذا احفظ بـ write memory أو copy running-config startup-config قبل إعادة الإقلاع.",
    examples: [
      {
        context: "الدخول القياسي إلى Global Config",
        code: "Router# configure terminal\nEnter configuration commands, one per line. End with CNTL/Z.\nRouter(config)#",
      },
    ],
    verificationCommands: ["show running-config"],
    troubleshootingNotes: [
      "إذا أعاد configure terminal رسالة 'command authorization failed' فإن AAA يرفض المستخدم؛ تحقق من مستوى صلاحية المستخدم وملف TACACS+.",
    ],
    commonErrors: [
      "نسيان الدخول إلى configure terminal قبل محاولة إعداد أمر عالمي مثل hostname. سترى رسالة 'Invalid input detected'.",
    ],
    undoMethod: "للخروج استخدم exit أو end للعودة إلى Privileged EXEC.",
    references: [
      {
        label: "Cisco IOS Configuration Fundamentals Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-enable", "cmd-end", "cmd-exit"],
    tags: ["mode-change", "fundamentals"],
  },
  {
    id: "cmd-end",
    name: "end",
    syntax: "end",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "Interface Configuration", "Router Configuration", "Line Configuration", "Sub-mode"],
    promptShape: "Router(config-if)# → Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "CLI Modes",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يعود مباشرة إلى وضع Privileged EXEC (Router#) من أي وضع إعداد فرعي، مع تطبيق جميع التغييرات على running-config.",
    description:
      "end (أو Ctrl+Z) يخرج من جميع الأوضاع الفرعية المتراكفة في خطوة واحدة، عائدًا إلى موجه Privileged EXEC. على عكس exit الذي يصعد مستوى واحدًا فقط، يعيد end دائمًا إلى موجه Privileged EXEC الأعلى. لا يحفظ الأمر الإعداد — بل يُرحّل التغييرات فقط إلى running-config. اتبعه دائمًا بـ write memory للاستمرارية بعد إعادة الإقلاع.",
    examples: [
      {
        context: "الخروج من Interface Config مباشرة إلى Privileged EXEC",
        code: "Router(config-if)# end\nRouter#",
      },
    ],
    verificationCommands: ["show running-config"],
    commonErrors: [
      "استخدام end بدلًا من write memory ظنًا أن التغييرات حُفظت في NVRAM. هي لم تُحفظ — استخدم write memory لاحقًا.",
    ],
    undoMethod: "للتراجع عن التغييرات قبل الحفظ استخدم configure replace أو reload (إذا لم تُحفظ بعد).",
    references: [
      {
        label: "Cisco IOS Configuration Fundamentals Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-exit", "cmd-configure-terminal"],
    tags: ["mode-change", "fundamentals"],
  },
  {
    id: "cmd-exit",
    name: "exit",
    syntax: "exit",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "Interface Configuration", "Router Configuration", "Line Configuration", "Sub-mode"],
    promptShape: "Router(config-if)# → Router(config)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "CLI Modes",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يصعد مستوى واحدًا في تراتبية CLI (أو ينهي جلسة EXEC الحالية إذا كنت في Privileged/User EXEC).",
    description:
      "exit يصعد مستوى واحدًا فقط في تراتبية CLI. من Interface Configuration يعود إلى Global Configuration، ومن Global Configuration يعود إلى Privileged EXEC. ومن Privileged EXEC يُنهي جلسة المستخدم. استخدم end بدلًا منه إذا أردت تخطّي عدة مستويات دفعة واحدة.",
    examples: [
      {
        context: "الصعود من Interface Config إلى Global Config",
        code: "Router(config-if)# exit\nRouter(config)#",
      },
    ],
    references: [
      {
        label: "Cisco IOS Configuration Fundamentals Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-end", "cmd-configure-terminal"],
    tags: ["mode-change", "fundamentals"],
  },
  {
    id: "cmd-show-running-config",
    name: "show running-config",
    aliases: ["sh run"],
    syntax: "show running-config [interface <name> | all | partition]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "IOS 11.0+؛ IOS XE كافة؛ NX-OS كافة؛ IOS XR يستخدم show running-config بشكل مختلف",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Configuration Inspection",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يعرض الإعداد النشط الحالي في الذاكرة (running-config). أكثر أمر تحقق استخدامًا على أي منصة Cisco.",
    description:
      "show running-config (يُختصر sh run) يطبع الإعداد الحالي من DRAM. هو الطريقة القياسية لمعرفة ما هو مُطبَّق فعلًا — لا ما هو محفوظ. الكلمة المفتاحية interface <name> تُرشّح المخرجات لواجهة واحدة لتسريع التشخيص على الأجهزة ذات مئات الواجهات. الكلمة all تُضمّن القيم الافتراضية التي تُخفى عادةً (استخدمها باعتدال — المخرجات ضخمة). على NX-OS تعرض المخرجات فقط الميزات المفعّلة بـ feature <name>.",
    parameters: [
      {
        name: "interface <name>",
        description: "تُرشّح المخرجات لواجهة محددة مثل GigabitEthernet0/0/0.",
        required: false,
      },
      {
        name: "all",
        description: "تعرض جميع الأوامر بما فيها الافتراضية. مخرجات ضخمة جدًا — استخدم بحذر.",
        required: false,
      },
    ],
    examples: [
      {
        context: "الإعداد الكامل النشط",
        code: "Router# show running-config",
      },
      {
        context: "ترشيح المخرجات لواجهة واحدة",
        code: "Router# show running-config interface GigabitEthernet0/0/0",
        output:
          "Building configuration...\n\nCurrent configuration : 154 bytes\n!\ninterface GigabitEthernet0/0/0\n description Uplink-to-Core\n ip address 10.0.0.1 255.255.255.252\n negotiation auto\nend",
        outputExplanation:
          "تعرض المخرجات واجهة GigabitEthernet0/0/0 مع وصفها Uplink-to-Core وعنوان IP 10.0.0.1/30. الأسطر تشمل فقط الإعداد غير الافتراضي.",
      },
    ],
    verificationCommands: ["show startup-config", "show version"],
    troubleshootingNotes: [
      "إذا كان أمر متوقع مفقودًا من show running-config فقد لم يُطبَّق قط، أو رُجع عنه، أو كُتب بأمر أكثر تحديدًا (مثل no shutdown مقابل shutdown).",
      "قارن show running-config مع show startup-config لكشف التغييرات غير المحفوظة: show archive config differences يؤتمت هذه المقارنة.",
    ],
    commonErrors: [
      "الاعتقاد أن show running-config يعرض الإعداد المحفوظ. لا — يعرض only الإعداد النشط. استخدم show startup-config للمحفوظ.",
    ],
    references: [
      {
        label: "Cisco IOS show Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-startup-config", "cmd-write-memory", "cmd-show-version"],
    tags: ["inspection", "verification", "fundamentals"],
  },
  {
    id: "cmd-show-startup-config",
    name: "show startup-config",
    aliases: ["sh start"],
    syntax: "show startup-config",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Configuration Inspection",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يعرض الإعداد المحفوظ الذي سيُحمَّل عند إعادة الإقلاع. قارنه مع show running-config لكشف التغييرات غير المحفوظة.",
    description:
      "يُختصر sh start، يقرأ هذا الأمر من NVRAM (أو bootflash:/nvram_config على IOS XE) ويعرض الإعداد الذي سيُطبَّق عند إعادة الإقلاع التالية. على IOS XR المكافئ هو show configuration ونموذج commit يعني عدم وجود مقارنة مباشرة بين NVRAM و RAM؛ بدلًا من ذلك استخدم show configuration history و rollback.",
    examples: [
      {
        context: "عرض الإعداد المحفوظ",
        code: "Router# show startup-config",
      },
    ],
    verificationCommands: ["show running-config", "show boot"],
    troubleshootingNotes: [
      "رسالة '%% Non-volatile configuration memory is not present' تدل على تلف NVRAM؛ أعِد الإقلاع بإعداد سليم من TFTP/USB.",
    ],
    references: [
      {
        label: "Cisco IOS show Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-running-config", "cmd-write-memory"],
    tags: ["inspection", "verification", "fundamentals"],
  },
  {
    id: "cmd-write-memory",
    name: "write memory",
    aliases: ["wr", "write mem"],
    syntax: "write memory",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Configuration Management",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يحفظ running-config الحالي إلى NVRAM كـ startup-config جديد. مكافئ لـ copy running-config startup-config.",
    description:
      "الأمر write memory (يُختصر wr) يحفظ الإعداد النشط في الذاكرة إلى NVRAM ليبقى بعد إعادة الإقلاع. على IOS XE 17.x يكتب إلى bootflash:/nvram_config. الصيغة الأطول copy running-config startup-config متطابقة وظيفيًا وهي الصيغة المستخدمة في السكربتات ووثائق Cisco. من الممارسات الفضلى الحفظ بـ write memory بعد كل نافذة تغيير، ثم التحقق بـ show startup-config | include <pattern>.",
    examples: [
      {
        context: "حفظ الإعداد النشط إلى NVRAM",
        code: "Router# write memory\nBuilding configuration...\n[OK]",
      },
    ],
    verificationCommands: ["show startup-config", "show running-config"],
    troubleshootingNotes: [
      "إذا فشل write memory برسالة 'NVRAM full' أو 'Unable to write' فقد تكون قسم NVRAM ممتلئًا؛ احذف الملفات غير المستخدمة من flash.",
    ],
    commonErrors: [
      "نسيان write memory بعد تغيير الإعداد ثم تفاجؤ بفقدانه بعد إعادة الإقلاع.",
    ],
    undoMethod: "لا يمكن التراجع عن write memory مباشرة. استخدم configure replace بملف أرشيف سابق إن وُجد.",
    references: [
      {
        label: "Cisco IOS Configuration Fundamentals Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-startup-config", "cmd-show-running-config", "cmd-copy-run-start"],
    tags: ["save", "fundamentals", "configuration-management"],
  },
  {
    id: "cmd-write-erase",
    name: "write erase",
    aliases: ["erase startup-config", "write erase"],
    syntax: "write erase",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Configuration Management",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يمحو startup-config المحفوظ في NVRAM. يُستخدم لإعادة الجهاز إلى الإعداد الافتراضي للمصنع قبل إعادة الإقلاع. لا يحذف IOS image.",
    description:
      "write erase (المكافئ erase startup-config) يمحو ملف startup-config من NVRAM فقط. لا يؤثر في running-config النشط ولا في IOS image. بعد write erase متبوعًا بـ reload يعود الجهاز إلى وضع الإعداد الأولي (initial configuration dialog). يُستخدم عند إعادة تهيئة جهاز مستعمل أو قبل بيعه أو نقله إلى موقع جديد. احذر: لا يمكن التراجع — احفظ نسخة من الإعداد القديم أولًا بـ copy startup-config tftp:.",
    examples: [
      {
        context: "إعادة الجهاز إلى إعداد المصنع",
        code: "Router# write erase\nErasing the nvram filesystem will remove all configuration files! Continue? [confirm]\n[OK]\nErase of nvram complete\nRouter# reload",
      },
    ],
    verificationCommands: ["show startup-config"],
    commonErrors: [
      "تشغيل write erase ظنًا أنه يمحو running-config فقط. سيُحمَّل الجهاز بإعداد فارغ بعد reload.",
      "نسيان نسخ الإعداد القديم قبل write erase. احفظ نسخة بـ copy startup-config tftp://server/backup.cfg أولًا.",
    ],
    undoMethod: "لا يمكن التراجع. استعد من نسخة احتياطية بـ copy tftp://server/backup.cfg startup-config.",
    warnings: [
      "لا يمكن التراجع عن write erase. احفظ دائمًا نسخة من startup-config قبل تشغيله.",
      "write erase لا يحذف IOS image ولا vlan.dat (على Catalyst القديمة). لمحو VLAN database استخدم delete flash:vlan.dat أيضًا.",
    ],
    references: [
      {
        label: "Cisco IOS Configuration Fundamentals Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-write-memory", "cmd-reload", "cmd-copy-run-start"],
    tags: ["configuration-management", "factory-reset", "fundamentals"],
  },
  {
    id: "cmd-reload",
    name: "reload",
    syntax: "reload [{in <minutes> | at <hh:mm> | cancel}]",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Configuration Management",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُعيد إقلاع الجهاز فورًا أو مجدولًا بعد وقت محدد. استخدم reload cancel لإلغاء إعادة الإقلاع المجدولة.",
    description:
      "reload يُعيد تشغيل الجهاز. الصيغة reload in <minutes> تُجدول إعادة الإقلاع بعد عدد محدد من الدقائق — مفيدة جدًا عند إجراء تغييرات خطرة عن بُعد: إذا فقدت الوصول، سيُعيد الجهاز نفسه تلقائيًا إلى الإعداد السابق المحفوظ. الصيغة reload at <hh:mm> تُجدول لوقت محدد. استخدم reload cancel لإلغاء إعادة الإقلاع المجدولة بعد التأكد من أن التغيير يعمل.",
    parameters: [
      {
        name: "in <minutes>",
        description: "يُجدول إعادة الإقلاع بعد عدد محدد من الدقائق.",
        required: false,
      },
      {
        name: "at <hh:mm>",
        description: "يُجدول إعادة الإقلاع في وقت محدد من اليوم.",
        required: false,
      },
      {
        name: "cancel",
        description: "يُلغي إعادة الإقلاع المجدولة.",
        required: false,
      },
    ],
    examples: [
      {
        context: "إعادة الإقلاع المجدولة بعد 15 دقيقة (طريقة الإنقاذ عند العمل عن بُعد)",
        code: "Router# reload in 15\nReload scheduled in 15 minutes by admin on console\nProceed with reload? [confirm]\nRouter#",
        outputExplanation:
          "بعد التأكيد سيُعيد الجهاز الإقلاع بعد 15 دقيقة تلقائيًا. إذا فقدت الوصول بعد تغيير خطرة، سيعود الجهاز إلى الإعداد المحفوظ.",
      },
      {
        context: "إلغاء إعادة الإقلاع المجدولة بعد نجاح التغيير",
        code: "Router# reload cancel\nRouter#\n*** Reload cancelled ***",
      },
    ],
    verificationCommands: ["show reload"],
    commonErrors: [
      "نسيان reload cancel بعد نجاح التغيير فيُعاد إقلاع الجهاز دون داعٍ.",
    ],
    warnings: [
      "reload يقطع كل الخدمات. استخدم reload in <minutes> دائمًا عند العمل عن بُعد كشبكة أمان.",
    ],
    references: [
      {
        label: "Cisco IOS Configuration Fundamentals Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-write-memory", "cmd-write-erase"],
    tags: ["configuration-management", "reload", "fundamentals"],
  },
  {
    id: "cmd-show-version",
    name: "show version",
    aliases: ["sh ver"],
    syntax: "show version",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC", "User EXEC"],
    promptShape: "Router>",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "System Inspection",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يعرض معلومات العتاد وإصدار البرنامج ومدة التشغيل (uptime) وسبب آخر إعادة إقلاع و configuration register. أول أمر يُشغَّل عند فحص جهاز غير مألوف.",
    description:
      "show version (sh ver) هو أمر الجرد العام. يعرض: منصة العتاد، اسم وصيغة صورة البرنامج وإصدارها، تاريخ الترجمة، مدة تشغيل النظام (uptime)، سبب آخر إعادة إقلاع (مثل power-on أو watchdog أو saveconf)، صورة الإقلاع المُعدّة، configuration register (0x2102 عادي، 0x2142 تخطّي NVRAM)، ومستوى الترخيص. على IOS XE يعرض أيضًا الحزم البرمجية المثبتة و ROMMON النشط. التقط show version دائمًا قبل أي تغيير لتتحقق من أن المنصة لم تُعاد إقلاعها دون قصد.",
    examples: [
      {
        context: "فحص سريع للمنصة",
        code: "Router# show version | include Version|uptime|reload",
        output:
          "Cisco IOS XE Software, Version 17.06.04.\nRouter uptime is 12 weeks, 4 days, 18 hours, 27 minutes\nSystem returned to ROM by power-on",
        outputExplanation:
          "تعرض المخرجات إصدار IOS XE (17.06.04)، ومدة تشغيل الجهاز (12 أسبوعًا)، وسبب آخر إعادة إقلاع (power-on أي فصل وتوصيل الطاقة).",
      },
    ],
    verificationCommands: ["show inventory", "show platform"],
    troubleshootingNotes: [
      "سبب إعادة إقلاع غير متوقع مثل 'watchdog timeout' أو 'software-forced crash' يدل على عيب برمجي؛ التقط show platform software وافتح حالة TAC.",
      "configuration register بقيمة 0x2142 يتخطّى startup-config عند الإقلاع — سبب شائع لـ 'اختفاء' الإعداد بعد إعادة الإقلاع.",
    ],
    references: [
      {
        label: "Cisco IOS show Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-running-config", "cmd-show-inventory"],
    tags: ["inspection", "verification", "fundamentals"],
  },
  {
    id: "cmd-show-inventory",
    name: "show inventory",
    syntax: "show inventory [raw]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "IOS 12.0+؛ جميع المنصات الأخرى",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "Fundamentals",
    scope: "extended",
    topic: "System Inspection",
    category: "Fundamentals",
    status: "Current",
    summary:
      "يسرد جميع وحدات العتاد القابلة للاستبدال (FRU) مع أرقامها التسلسلية وأرقام قطعها وأوصافها. يُستخدم لتتبّع الأصول وفتح RMA.",
    description:
      "show inventory يعدّ كل مكوّن قابل للاستبدال — الشاس والخطوط ومصادر الطاقة والمراوح ووحدات SFP/SFP+ والوحدات — مع PID و VID والرقم التسلسلي. الكلمة raw تُضمّن الكيانات المخفية أو الداخلية. هذا هو الأمر القياسي لتدقيق الأصول وفتح حالات TAC/RMA.",
    examples: [
      {
        context: "الحصول على الأرقام التسلسلية لـ RMA",
        code: "Router# show inventory | include NAME:|SN:",
      },
    ],
    verificationCommands: ["show version", "show diag"],
    references: [
      {
        label: "Cisco IOS show Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-version", "cmd-show-platform"],
    tags: ["inspection", "inventory", "fundamentals"],
  },
  {
    id: "cmd-show-platform",
    name: "show platform",
    syntax: "show platform [subcommands vary by platform]",
    platforms: ["IosXe", "NxOs", "IosXr"],
    versionRange: "IOS XE 16.x+",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "Extended",
    scope: "extended",
    topic: "System Inspection",
    category: "Fundamentals",
    status: "Current",
    summary:
      "عرض عتاد خاص بالمنصة: ASICs التحويل، حالة الشاس/الخط، الحرارة، الطاقة. تختلف البنية الفرعية للأوامر اختلافًا واسعًا بين IOS XE و NX-OS و IOS XR.",
    description:
      "على IOS XE show platform هو الأصل لأوامر حالة العتاد الفرعية مثل show platform hardware و show platform software status و show platform feedq و show platform environment. على NX-OS يكشف show platform عن عدّادات ASIC ومعلومات Xbar. على IOS XR يسرد show platform جميع الرفوف والشاسات والخطوط بحالتها. هذا الأمر الأساسي لتشخيص العتاد على Catalyst 9000 و Nexus 9000.",
    examples: [
      {
        context: "IOS XE: حالة الحرارة والطاقة",
        code: "Router# show platform hardware | include TEMP|Power",
      },
      {
        context: "IOS XR: سرد جميع الخطوط وحالتها",
        code: "RP/0/RP0/CPU0:router# show platform",
      },
    ],
    verificationCommands: ["show environment", "show inventory"],
    troubleshootingNotes: [
      "على Catalyst 9000، يكشف show platform hardware fed switch active fwd-asic resource عن استغلال TCAM للـ ASIC — حاسم عند تشخيص فشل توسعة ACL/QoS.",
    ],
    references: [
      {
        label: "Catalyst 9300 Show Platform Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/mgmt/b_1712_mgmt_9300_9300l/show_platform.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-version", "cmd-show-inventory"],
    tags: ["inspection", "hardware", "platform"],
  },

  // =================================================================
  // Hostname, banners, passwords
  // =================================================================
  {
    id: "cmd-hostname",
    name: "hostname",
    syntax: "hostname <name>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Device Identity",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يضبط اسم الجهاز (hostname). يُحدَّث الموجّه فورًا ليعكس الاسم الجديد. يجب أن تتبع أسماء الأجهزة اصطلاح تسمية يرمّز للدور والموقع والتسلسل.",
    description:
      "الأمر hostname يضبط هوية الجهاز في موجّه CLI وفي بروتوكولات مثل SSH و SNMP و syslog و LLDP/CDP. يمكن أن يصل الاسم إلى 63 حرفًا على IOS XE 17.x؛ يجب أن يبدأ بحرف ولا يحتوي مسافات. من الممارسات الفضلى استخدام اصطلاح تسمية منظّم (مثل site-role-seq: Cairo-Edge-01). على IOS XR الأمر المكافئ hostname يُطبَّق داخل Global Configuration لكن يُلتزم عبر commit.",
    parameters: [
      {
        name: "<name>",
        description: "اسم الجهاز الجديد. حتى 63 حرفًا، يبدأ بحرف، بلا مسافات.",
        required: true,
      },
    ],
    examples: [
      {
        context: "ضبط اسم منظّم للموجّه",
        code: "Router(config)# hostname Cairo-Edge-01\nCairo-Edge-01(config)#",
        outputExplanation:
          "بعد تنفيذ hostname يتغيّر الموجّه فورًا من Router إلى Cairo-Edge-01 في كل أوضاع CLI.",
      },
    ],
    verificationCommands: ["show running-config | include hostname"],
    commonErrors: [
      "استخدام اسم يبدأ برقم أو يحتوي مسافات. سيُرفض الجهاز الأمر.",
    ],
    undoMethod: "no hostname <name> أو hostname <default-name> لإعادة الاسم الافتراضي (Router/Switch).",
    references: [
      {
        label: "Cisco IOS Configuration Fundamentals Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-banner-motd", "cmd-ip-domain-name"],
    tags: ["identity", "fundamentals"],
  },
  {
    id: "cmd-banner-motd",
    name: "banner motd",
    syntax: "banner motd <delimiting-char> <message> <delimiting-char>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Device Identity",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُعرّف رسالة Message-of-the-Day التي تُعرض قبل تسجيل الدخول على جلسات console و SSH و Telnet. تُستخدم لتحذيرات الوصول القانونية.",
    description:
      "رسالة MOTD تُعرض قبل موجّه كلمة السر في كل جلسة تفاعلية. تتطلب Cisco ومعظم معايير الأمان رسالة تحذّر من أن الوصول مُصرّح به/مراقَب. الحرف الفاصل (عادة # أو C) يميّز بداية ونهاية الرسالة؛ يمكن استخدام أي حرف طالما لا يظهر في متن الرسالة. الرسائل متعددة الأسطر مدعومة؛ اكتب الحرف الفاصل ثم الرسالة عبر أسطر متعددة ثم الحرف الفاصل مجددًا للالتزام.",
    examples: [
      {
        context: "رسالة قانونية قياسية",
        code: 'Router(config)# banner motd #\n********************************************\n*  Authorised access only.                  *\n*  All activity is monitored and recorded.  *\n********************************************\n#',
      },
    ],
    verificationCommands: ["show running-config | section banner"],
    warnings: [
      "لا تُضمّن كلمات مثل 'welcome' أو 'guest' في الرسالة — فقد فسّرت المحاكم هذه بأنها موافقة ضمنية لمستخدمين غير مصرّح لهم.",
    ],
    undoMethod: "no banner motd.",
    references: [
      {
        label: "Cisco IOS Configuration Fundamentals Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-hostname", "cmd-line-console"],
    tags: ["identity", "security", "fundamentals"],
  },
  {
    id: "cmd-enable-password",
    name: "enable password",
    syntax: "enable password [level <0-15>] <password>",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 10.0+؛ IOS XE كافة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Security",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Deprecated",
    historicalNote:
      "أمر تاريخي قديم. يُخزَّن نص كلمة السر بصورة واضحة (clear text) في running-config افتراضيًا، ما يجعله قابلًا للاسترجاع البسيط من نسخة إعداد. توصي Cisco بعدم استخدامه واستخدام enable secret بدلًا منه. كان مدرجًا في مناهج CCNA القديمة لأغراض الفهم التاريخي فقط، أما المنهج الحالي فينصح بـ enable secret حصرًا.",
    modernAlternative: "enable secret",
    modernAlternativeCommandId: "cmd-enable-secret",
    differencesFromAlternative:
      "enable password يُخزّن النص بصورة واضحة (clear text) أو مشفّرًا بـ Cisco Type-7 القابل للفك بسهولة. enable secret يُخزّن النص كـ hash (Type-5 MD5 قديمًا، Type-8 PBKDF2، Type-9 scrypt على الإصدارات الحديثة) لا يمكن استرجاعه. على IOS XE 17.x إذا ضُبط كلاهما يُتجاهل enable password تلقائيًا.",
    summary:
      "أمر قديم ومُهمَل يضبط كلمة سر Privileged EXEC بصيغة نص واضح. تجنّبه في الإنتاج واستخدم enable secret بدلًا منه. محفوظ في الموسوعة لأغراض الفهم التاريخي.",
    description:
      "enable password يضبط كلمة سر Privileged EXEC بصيغة نص واضح (clear text) أو بنوع تشفير ضعيف (Type-7) قابل للكسر بسهولة. هذا الأمر مُهمَل (deprecated) رسميًا وتنصح وثائق Cisco بعدم استخدامه. على IOS XE 17.x إذا ضُبط كلٌّ من enable password و enable secret فإن enable password يُتجاهل تلقائيًا. استخدم enable secret دائمًا في الإنتاج لأنه يُخزّن كلمة السر كـ hash قوي. الحالة التاريخية الوحيدة التي قد تجد فيها enable password هي أجهزة قديمة لم تُحدّث أو إعدادات منقولة من مناهج قديمة.",
    parameters: [
      {
        name: "level <0-15>",
        description: "مستوى الصلاحية الذي تنطبق عليه كلمة السر. افتراضيًا 15.",
        required: false,
        defaultValue: "15",
      },
      {
        name: "<password>",
        description: "كلمة السر بصيغة نص واضح. ستظهر في show running-config بصورة قابلة للقراءة ما لم تُفعّل service password-encryption.",
        required: true,
      },
    ],
    examples: [
      {
        context: "ضبط enable password قديم (لا تفعله في الإنتاج)",
        code: "Router(config)# enable password MyOldPassword123",
      },
    ],
    verificationCommands: ["show running-config | include enable password"],
    commonErrors: [
      "استخدام enable password ظنًا أنه آمن. ليس آمنًا — النص مكشوف في running-config.",
      "نسيان تفعيل service password-encryption فيبقى النص مكشوفًا حتى مع Type-7 الضعيف.",
    ],
    undoMethod: "no enable password [level <0-15>].",
    warnings: [
      "لا تستخدم enable password في الإنتاج. استخدم enable secret فقط. Type-7 (المُولَّد بـ service password-encryption) قابل للكسر بثوانٍ.",
    ],
    references: [
      {
        label: "Cisco IOS Security Command Reference — enable password",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/security/s1/sec-s1-cr-book/sec-s1-cr-book_chapter3.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-enable-secret", "cmd-service-password-encryption"],
    tags: ["security", "deprecated", "password", "historical"],
  },
  {
    id: "cmd-service-password-encryption",
    name: "service password-encryption",
    syntax: "service password-encryption",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Security",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُفعّل تشفير Type-7 لكلمات السر النصية (مثل enable password و line password و username password). تشفير ضعيف لكنه يمنع القراءة العرضية في running-config.",
    description:
      "service password-encryption يحوّل كلمات السر المخزّنة كنص واضح (مثل enable password وكلمات سر line) إلى صيغة Type-7. هذا التشفير ضعيف جدًا وقابل للكسر بأدوات بسيطة لكنه يمنع القراءة العرضية من قبل من يطلع على running-config. لا يؤثر على enable secret (الذي يستخدم Type-5/8/9 الأقوى). من الممارسات الفضلى تفعيله على الأجهزة القديمة التي لا تزال تستخدم enable password، لكنه ليس بديلًا عن enable secret.",
    examples: [
      {
        context: "تفعيل تشفير Type-7 لكلمات السر النصية",
        code: "Router(config)# service password-encryption",
      },
    ],
    verificationCommands: ["show running-config | include password-encryption"],
    warnings: [
      "Type-7 ليس آمنًا فعلًا — قابل للكسر بأدوات بسيطة متاحة على الإنترنت. لا تعتمد عليه لحماية كلمات السر الحساسة. استخدم enable secret (Type-8/9) بدلًا منه.",
    ],
    undoMethod: "no service password-encryption. لاحظ أن إلغاءه لا يفك تشفير كلمات السر الموجودة.",
    references: [
      {
        label: "Cisco IOS Security Command Reference — service password-encryption",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/security/s1/sec-s1-cr-book/sec-s1-cr-book_chapter3.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-enable-password", "cmd-enable-secret"],
    tags: ["security", "encryption", "fundamentals"],
  },
  {
    id: "cmd-enable-secret",
    name: "enable secret",
    syntax: "enable secret [0 | 5 | 8 | 9 | <level>] <password>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "IOS 10.0+؛ IOS XE كافة؛ NX-OS يستخدم آلية مختلفة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Security",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يضبط كلمة سر Privileged EXEC، مخزّنة كـ hash. يحلّ محل enable password المُهمَل الذي يُخزَّن كنص واضح.",
    description:
      "الأمر enable secret يضبط كلمة السر المطلوبة للدخول إلى Privileged EXEC. البادئة الرقمية الاختيارية تختار خوارزمية hash: 0 = نص واضح (لا تستخدمه)، 5 = MD5 (قديم، مُهمَل)، 8 = PBKDF2-SHA256 (موصى به)، 9 = scrypt (موصى به أيضًا، الأقوى). على IOS XE 17.x الافتراضي هو Type 8. افضل دائمًا enable secret على enable password — الأخير مخزّن كنص واضح ويمكن استرجاعه بسهولة من نسخة الإعداد. في الإنتاج فضّل AAA (TACACS+/RADIUS) على enable secret المحلي.",
    parameters: [
      {
        name: "0 | 5 | 8 | 9",
        description: "نوع hash: 0 نص واضح (ممنوع)، 5 MD5 (مُهمَل)، 8 PBKDF2 (موصى به)، 9 scrypt (الأقوى).",
        required: false,
        defaultValue: "8 على IOS XE 17.x",
      },
      {
        name: "<level>",
        description: "مستوى الصلاحية (0-15). افتراضيًا 15.",
        required: false,
      },
      {
        name: "<password>",
        description: "كلمة السر. سيُخزّن كـ hash حسب النوع المختار.",
        required: true,
      },
    ],
    examples: [
      {
        context: "ضبط enable secret بـ hash scrypt قوي",
        code: "Router(config)# enable secret 9 S$MiXeD.CaSe.9PaSsWoRd.With.Numbers",
      },
    ],
    verificationCommands: ["show running-config | include enable secret"],
    warnings: [
      "النوع 5 (MD5) مكسور ويمكن كسره في ثوانٍ — لا تستخدمه للنشرات الجديدة.",
      "فقدان enable secret على جهاز بدون AAA يتطلب استعادة كلمة المرور عبر تسلسل break عند الإقلاع، ما يقطع الخدمة.",
    ],
    undoMethod: "no enable secret [level <0-15>].",
    references: [
      {
        label: "Cisco IOS Security Command Reference — enable secret",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/security/s1/sec-s1-cr-book/sec-s1-cr-book_chapter3.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-enable", "cmd-username-secret", "cmd-enable-password"],
    tags: ["security", "fundamentals", "password"],
  },
  {
    id: "cmd-username-secret",
    name: "username <name> secret",
    syntax: "username <name> [privilege <0-15>] secret [0 | 5 | 8 | 9] <password>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "IOS 11.0+؛ جميع المنصات الأخرى",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Security",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "ينشئ حساب مستخدم محلي بكلمة سر مشفّرة (hashed) ومستوى صلاحية افتراضي اختياري. آلية المصادقة الاحتياطية عند عدم توفر خوادم AAA.",
    description:
      "username <name> secret <password> ينشئ مستخدمًا محليًا. الكلمة privilege <level> تضبط مستوى الصلاحية الذي يصل إليه المستخدم بعد تسجيل الدخول (15 = مدير كامل). بادئة نوع hash تعمل مثل enable secret: فضّل 8 (PBKDF2) أو 9 (scrypt). المستخدمون المحليون يُستخدمون لتسجيل الدخول المباشر وكاحتياطي عند ضبط AAA بـ aaa authentication login default local.",
    examples: [
      {
        context: "إنشاء مستخدم محلي بصلاحيات كاملة و hash scrypt",
        code: "Router(config)# username netadmin privilege 15 secret 9 S$Str0ng.Hash3d.Passw0rd",
      },
    ],
    verificationCommands: ["show running-config | section username"],
    warnings: [
      "كلمات سر المستخدمين المحليين ظاهرة كنص واضح على موجّه console أثناء الإعداد؛ امسح الشاشة بـ clear بعد إنشاء المستخدمين.",
    ],
    undoMethod: "no username <name>.",
    references: [
      {
        label: "Cisco IOS Security Command Reference — username",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/security/s1/sec-s1-cr-book/sec-s1-cr-book_chapter3.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-enable-secret", "cmd-line-vty", "cmd-aaa-new-model"],
    tags: ["security", "fundamentals", "user-management"],
  },
  {
    id: "cmd-line-console",
    name: "line console 0",
    syntax: "line console 0",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "Line Configuration"],
    promptShape: "Router(config)# → Router(config-line)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Management Access",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يدخل وضع Line Configuration لمنفذ console المادي (line 0). يُستخدم لضبط مهلة console وكلمة السر وإعدادات exec.",
    description:
      "console 0 هو منفذ console المادي الوحيد على معظم الأجهزة. من وضع Line Configuration تضبط مهلة الخمول (exec-timeout) وتتطلب تسجيل الدخول (login + password أو AAA) وتضبط معدل البود عند الحاجة. console هي واجهة الاستعادة — أبقِها متاحة (لا تسجّل خروج تلقائيًا عند 0 دقيقة، لكن مهلة 5-10 دقائق معقولة).",
    examples: [
      {
        context: "ضبط مهلة console لـ 10 دقائق وتطلب تسجيل دخول محلي",
        code: "Router(config)# line console 0\nRouter(config-line)# exec-timeout 10 0\nRouter(config-line)# login local",
      },
    ],
    verificationCommands: ["show running-config | section line con"],
    undoMethod: "استخدم no أمام كل إعداد. للخروج من Line Configuration استخدم exit.",
    references: [
      {
        label: "Cisco IOS Terminal Services Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/terminal/command/terminal-services-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-line-vty", "cmd-aaa-new-model", "cmd-username-secret"],
    tags: ["management-access", "fundamentals"],
  },
  {
    id: "cmd-line-vty",
    name: "line vty 0 15",
    syntax: "line vty <first> <last>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "Line Configuration"],
    promptShape: "Router(config)# → Router(config-line)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Management Access",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يدخل وضع Line Configuration للنهايات الطرفية الافتراضية (VTY) المستخدمة في SSH و Telnet. IOS XE الحديث لديه 16 خط VTY (0-15).",
    description:
      "خطوط VTY هي نهايات افتراضية تُستخدم لجلسات SSH/Telnet عن بُعد. المدى 0 15 يغطي جميع الخطوط الـ 16 على IOS XE 17.x. من وضع Line Configuration تضبط بروتوكولات النقل (transport input ssh) ومهلة الخمول (exec-timeout) والمصادقة (login local أو AAA). من الممارسات الفضلى تعطيل Telnet تمامًا (transport input ssh فقط) وطلب AAA مع TACACS+ واحتياطي محلي.",
    examples: [
      {
        context: "تقييد VTY على SSH مع احتياطي AAA",
        code: "Router(config)# line vty 0 15\nRouter(config-line)# transport input ssh\nRouter(config-line)# login authentication default\nRouter(config-line)# exec-timeout 10 0",
      },
    ],
    verificationCommands: ["show running-config | section line vty", "show users"],
    troubleshootingNotes: [
      "'% Connection refused by remote host' على SSH عادةً يعني أن جميع خطوط VTY مشغولة — تحقق بـ show users من جلسات عالقة.",
    ],
    warnings: [
      "تحقق دائمًا من transport input ssh بعد التغيير؛ إذا قلت فقط transport input telnet ssh يبقى Telnet مفعّلًا ما ينقل بيانات الاعتماد كنص واضح.",
    ],
    undoMethod: "استخدم no أمام كل إعداد.",
    references: [
      {
        label: "Cisco IOS Terminal Services Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/terminal/command/terminal-services-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-line-console", "cmd-transport-input-ssh", "cmd-aaa-new-model"],
    tags: ["management-access", "security", "fundamentals"],
  },
  {
    id: "cmd-transport-input-ssh",
    name: "transport input ssh",
    syntax: "transport input {ssh | telnet | all | none}",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "IOS 11.1+؛ جميع المنصات الأخرى",
    cliMode: ["Line Configuration"],
    promptShape: "Router(config-line)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Management Access",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يقيّد البروتوكولات المقبولة على خط (VTY أو console). transport input ssh يسمح فقط بـ SSH، ويمنع Telnet غير الآمن.",
    description:
      "الكلمة transport input تتحكم في بروتوكولات الدخول المقبولة على الخط. القيم: ssh (SSH فقط — موصى به)، telnet (Telnet فقط — لا تستخدمه)، all (الكل)، none (لا دخل). الافتراضي على IOS XE هو all وهو غير آمن. اضبط دائمًا transport input ssh صراحةً على كل خط VTY.",
    parameters: [
      {
        name: "ssh | telnet | all | none",
        description: "البروتوكولات المسموح دخولها. استخدم ssh فقط للإنتاج.",
        required: true,
        defaultValue: "all",
        allowedValues: ["ssh", "telnet", "all", "none"],
      },
    ],
    examples: [
      {
        context: "فرض SSH فقط على جميع خطوط VTY",
        code: "Router(config-line)# transport input ssh",
      },
    ],
    verificationCommands: ["show running-config | section line vty"],
    undoMethod: "no transport input أو transport input all (لا تفعله).",
    references: [
      {
        label: "Cisco IOS Terminal Services Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/terminal/command/terminal-services-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-line-vty", "cmd-ip-ssh-version-2"],
    tags: ["security", "ssh", "management-access"],
  },
  {
    id: "cmd-ip-domain-name",
    name: "ip domain-name",
    syntax: "ip domain-name <domain>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Management Access",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يضبط اسم النطاق الافتراضي للجهاز. مطلوب قبل توليد مفاتيح RSA لـ SSH ويُستخدم لتأهيل اسم الموجّه بالكامل.",
    description:
      "الأمر ip domain-name يضبط نطاق DNS الأساسي للجهاز. هذا مطلوب لتوليد مفاتيح SSH (موضوع مفتاح RSA يتضمّن <hostname>.<domain>) ويُستخدم لتأهيل اسم الموجّه بالكامل في syslog و LLDP و SNMP sysName. على IOS XE الحديث يمكنك ضبط عدة نطاقات بـ ip domain list.",
    examples: [
      {
        context: "ضبط النطاق وتوليد مفتاح RSA لـ SSH",
        code: "Router(config)# ip domain-name lab.example.com\nRouter(config)# crypto key generate rsa modulus 2048\nThe name for the keys will be: Router.lab.example.com\n...",
      },
    ],
    verificationCommands: ["show running-config | include ip domain", "show crypto key mypubkeys rsa"],
    undoMethod: "no ip domain-name <domain>.",
    references: [
      {
        label: "Cisco IOS Security Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/security/s1/sec-s1-cr-book/sec-s1-cr-book_chapter3.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-hostname", "cmd-crypto-key-generate-rsa", "cmd-ip-ssh-version-2"],
    tags: ["management-access", "ssh", "fundamentals"],
  },
  {
    id: "cmd-crypto-key-generate-rsa",
    name: "crypto key generate rsa",
    syntax: "crypto key generate rsa [general-keys | modulus <360-4096> | label <name>]",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.1+؛ IOS XE كافة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Management Access",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يولّد زوج مفاتيح RSA يُستخدم لمصادقة خادم SSH. الحد الأدنى الموصى به للـ modulus هو 2048 بت؛ و 4096 مفضّل.",
    description:
      "توليد مفاتيح RSA شرط مسبق لتفعيل SSH على IOS/IOS XE. الكلمة modulus تضبط طول المفتاح — 2048 هو الحد الأدنى المقبول للإنتاج حاليًا؛ 4096 مفضّل للأجهزة طويلة العمر. الكلمة general-keys تولّد مفتاحًا واحدًا قابلًا للتوقيع والتشفير؛ بدونها يكون المفتاح مقيّد الاستخدام. الكلمة label تسمّي المفتاح لاستخدامه مع ip ssh rsa keypair-name. على IOS XE 17.6+ يمكنك أيضًا توليد مفاتيح ECDSA بـ crypto key generate ec keysize 256 لـ SSH أقوى وأسرع.",
    parameters: [
      {
        name: "modulus <360-4096>",
        description: "طول المفتاح بالبت. 2048 كحد أدنى موصى به، 4096 مفضّل.",
        required: false,
        defaultValue: "512 (تاريخي) — استخدم 2048 أو أكبر",
      },
    ],
    examples: [
      {
        context: "توليد مفتاح RSA بطول 2048 بت",
        code: "Router(config)# crypto key generate rsa modulus 2048\nThe name for the keys will be: Router.lab.example.com\n% The key modulus size is 2048 bits\n% Generating 2048 bit RSA keys, keys will be non-exportable...\n[OK] (elapsed time was 2 seconds)",
      },
    ],
    verificationCommands: ["show crypto key mypubkeys rsa", "show ip ssh"],
    warnings: [
      "توليد مفتاح RSA جديد يُبطل جلسات SSH الحالية ويجبر العملاء على مسح إدخالات known_hosts — جدولها خلال نافذة صيانة.",
    ],
    undoMethod: "crypto key zeroize rsa [label <name>].",
    references: [
      {
        label: "Cisco IOS Security Command Reference — crypto key",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/security/s1/sec-s1-cr-book/sec-s1-cr-book_chapter3.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-ssh-version-2", "cmd-ip-domain-name"],
    tags: ["security", "ssh", "cryptography"],
  },
  {
    id: "cmd-ip-ssh-version-2",
    name: "ip ssh version 2",
    syntax: "ip ssh version 2",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.1(3)T+؛ IOS XE كافة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Management Access",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يفرض بروتوكول SSH الإصدار 2 فقط. SSH v1 به نقاط ضعف تشفيرية معروفة ويجب ألا يُفعّل في الإنتاج أبدًا.",
    description:
      "SSH v1 به عيوب بنيوية (MAC ضعيف، عدم حماية سلامة لبعض الحزم، قابلية لهجمات الإدراج) وممنوع في كل معيار أمان حديث. ip ssh version 2 يضبط الجهاز لرفض اتصالات SSH v1 تمامًا. بدون هذا الأمر يكون الجهاز افتراضيًا قابلًا للتفاوض على أي إصدار، ما يترك الباب مفتوحًا لهجمات تخفيض الإصدار (downgrade).",
    examples: [
      {
        context: "فرض SSHv2 فقط",
        code: "Router(config)# ip ssh version 2",
      },
    ],
    verificationCommands: ["show ip ssh"],
    warnings: [
      "يجب ألا يُفعّل SSH v1 أبدًا — كل أطر الامتثال (PCI-DSS، NIST 800-53، ISO 27001) تمنعه.",
    ],
    undoMethod: "no ip ssh version 2 (يعود للتفاوض على أي إصدار — لا تفعله).",
    references: [
      {
        label: "Cisco IOS Security Command Reference — ip ssh",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/security/s1/sec-s1-cr-book/sec-s1-cr-book_chapter3.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-crypto-key-generate-rsa", "cmd-line-vty", "cmd-transport-input-ssh"],
    tags: ["security", "ssh", "fundamentals"],
  },
  {
    id: "cmd-aaa-new-model",
    name: "aaa new-model",
    syntax: "aaa new-model",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "IOS 11.0+؛ جميع المنصات الأخرى",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Security",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُفعّل AAA (Authentication، Authorization، Accounting) على الجهاز. الشرط المسبق لأي تكامل TACACS+ أو RADIUS.",
    description:
      "aaa new-model يُفعّل نظام AAA الحديث، محلًا لنموذج login/enable password القديم بنهج منظّم. بمجرد التفعيل يجب تعريف قوائم method للمصادقة والتخويل والمحاسبة، وإلا قد يرفض الجهاز تسجيل الدخول (مع aaa authentication login default local يوفّر احتياطيًا محليًا). من الممارسات الفضلى تفعيل AAA، تعريف قوائم method بـ TACACS+ أولًا و local كاحتياطي، والاختبار من جلسة ثانية قبل فصل الجلسة الحالية.",
    examples: [
      {
        context: "تفعيل AAA وضبط تسجيل الدخول لاستخدام TACACS+ مع احتياطي محلي",
        code: "Router(config)# aaa new-model\nRouter(config)# tacacs server TAC-PRIMARY\nRouter(config-server-tacacs)# address ipv4 10.10.10.10\nRouter(config-server-tacacs)# key 7 <encrypted-key>\nRouter(config)# aaa authentication login default group tacacs+ local\nRouter(config)# aaa authorization exec default group tacacs+ local if-authenticated",
      },
    ],
    verificationCommands: ["show running-config | section aaa", "show aaa servers"],
    warnings: [
      "تفعيل aaa new-model دون ضبط قوائم method قد يُغلقك خارج الجهاز — اختبر دائمًا من جلسة ثانية قبل فصل الجلسة الحالية.",
    ],
    undoMethod: "no aaa new-model (يُعيد نموذج login/enable القديم).",
    references: [
      {
        label: "Cisco IOS Security Configuration Guide — AAA",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/security/s1/sec-s1-cr-book/sec-s1-cr-book_chapter3.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-username-secret", "cmd-line-vty", "cmd-line-console"],
    tags: ["security", "aaa", "fundamentals"],
  },

  // =================================================================
  // Switching — VLAN, SVI, STP
  // =================================================================
  {
    id: "cmd-interface-vlan",
    name: "interface vlan",
    syntax: "interface vlan <1-4094>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة (NX-OS يتطلب feature interface-vlan)",
    cliMode: ["Global Configuration", "Interface Configuration"],
    promptShape: "Switch(config)# → Switch(config-if)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "VLANs and SVI",
    category: "Switching",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "ينشئ أو يدخل واجهة Switch Virtual Interface (SVI) لشبكة VLAN. تُستخدم واجهات SVI لـ Layer 3 لتوجيه بين VLANs والوصول الإداري كبوابات افتراضية للمضيفين.",
    description:
      "واجهة SVI (Switch Virtual Interface) هي واجهة Layer 3 افتراضية مرتبطة بـ VLAN. تُستخدم لـ: (1) توجيه بين VLANs على محول Layer 3، (2) الوصول الإداري للمحول نفسه (VLAN الإدارة الافتراضي عادةً VLAN 1 في التصاميم القديمة أو VLAN مخصص 99/1000+ في الحديثة)، (3) كبوابة افتراضية للمضيفين على تلك VLAN. على NX-OS يجب أولًا feature interface-vlan قبل إنشاء SVI. حالة SVI مرتبطة بحالة VLAN — إذا لم يكن للـ VLAN منافذ نشطة ولا trunk يحمله، تبقى SVI معطلة.",
    parameters: [
      {
        name: "<1-4094>",
        description: "رقم VLAN. النطاق 1-4094. VLAN 1 محجوز افتراضيًا.",
        required: true,
        allowedValues: ["1-4094"],
      },
    ],
    examples: [
      {
        context: "إنشاء SVI إدارة على VLAN 99",
        code: "Switch(config)# interface vlan 99\nSwitch(config-if)# description Management-VLAN\nSwitch(config-if)# ip address 10.10.99.10 255.255.255.0\nSwitch(config-if)# no shutdown",
      },
    ],
    verificationCommands: ["show ip interface brief", "show interfaces vlan 99", "show vlan"],
    troubleshootingNotes: [
      "إذا بقيت SVI 'down/down' رغم no shutdown: (a) VLAN غير موجود (vlan 99)، (b) لا منفذ مُسنَد إلى VLAN ولا trunk يحمله، (c) على NX-OS feature interface-vlan غير مفعّل.",
      "على المحولات من نوع Layer 2 فقط (مثل Catalyst 2960 الأساسية) يمكن لواجهة SVI واحدة فقط أن تكون 'up/up' في كل مرة افتراضيًا — no ip routing مُعدّ و SVI يُستخدم فقط للإدارة.",
    ],
    undoMethod: "no interface vlan <id>.",
    references: [
      {
        label: "Catalyst 9300 Layer 3 Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/l3/b_1712_l3_9300_9300l/svis.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-vlan", "cmd-switchport-access-vlan", "cmd-show-ip-interface-brief"],
    tags: ["switching", "vlan", "svi", "ccna"],
  },
  {
    id: "cmd-vlan",
    name: "vlan",
    syntax: "vlan <1-4094> [name <name>]",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "VLAN Configuration"],
    promptShape: "Switch(config)# → Switch(config-vlan)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "VLANs and SVI",
    category: "Switching",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "ينشئ VLAN في قاعدة بيانات VLAN ويدخل وضع VLAN Configuration حيث يمكنك ضبط اسم VLAN وسمات أخرى.",
    description:
      "الأمر vlan <id> ينشئ VLAN إن لم يكن موجودًا ويدخل وضع VLAN Configuration (Switch(config-vlan)#). من هذا الوضع الفرعي يمكنك ضبط اسم وصفي بـ name <name>، ضبط ارتباطات private-VLAN، و(على بعض المنصات) ضبط MTU. VLANs 1 و 1002-1005 محجوزة (افتراضي، FDDI، Token Ring). النطاق المستخدم هو 2-1001 و 1006-4094 (موسّع). على NX-OS تُخزَّن VLANs في running config بدلًا من ملف vlan.dat منفصل.",
    parameters: [
      {
        name: "<1-4094>",
        description: "رقم VLAN. 1 افتراضي، 1002-1005 محجوزة لـ FDDI/Token Ring التاريخية.",
        required: true,
      },
      {
        name: "name <name>",
        description: "اسم وصفي للـ VLAN.",
        required: false,
      },
    ],
    examples: [
      {
        context: "إنشاء VLAN 30 باسم وصفي",
        code: "Switch(config)# vlan 30\nSwitch(config-vlan)# name Engineering",
      },
    ],
    verificationCommands: ["show vlan", "show vlan brief", "show vlan id 30"],
    troubleshootingNotes: [
      "إذا لم يعرض show vlan الـ VLAN الخاص بك، فإما لم يُنشأ قط أو حُذف بواسطة VTP في وضع client/server. تحقق دائمًا من وضع VTP (show vtp status) على الشبكات متعددة المحولات.",
    ],
    undoMethod: "no vlan <id>.",
    references: [
      {
        label: "Catalyst 9300 Layer 2 Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/l2/b_1712_l2_9300_9300l/vlans.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-switchport-access-vlan", "cmd-switchport-trunk-allowed-vlan", "cmd-interface-vlan"],
    tags: ["switching", "vlan", "ccna"],
  },
  {
    id: "cmd-switchport-access-vlan",
    name: "switchport access vlan",
    syntax: "switchport access vlan <1-4094>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration"],
    promptShape: "Switch(config-if)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "VLANs and SVI",
    category: "Switching",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُسنِد منفذ access إلى VLAN محددة. يُستخدم لمنافذ المضيفين النهائيين حيث يلزم VLAN واحدة فقط.",
    description:
      "منافذ access تحمل VLAN واحدة وتُستخدم لتوصيل المضيفين النهائيين (PC، طابعات، نقاط وصول في وضع flex). يضبط الأمر PVID (Port VLAN ID) للمنفذ لحركة الدخول؛ حركة الخروج تكون غير موسومة (untagged). ضع دائمًا switchport mode access قبل switchport access vlan ليكون دور المنفذ صريحًا. مع VTP والتفاوض الديناميكي التلقائي، ترك الوضع كافتراضي 'dynamic auto' قد يؤدي إلى تفاوض trunk غير متوقع.",
    parameters: [
      {
        name: "<1-4094>",
        description: "رقم VLAN التي سيُسنَد إليها المنفذ.",
        required: true,
      },
    ],
    examples: [
      {
        context: "ضبط منفذ مضيف نهائي على VLAN 30",
        code: "Switch(config)# interface GigabitEthernet1/0/10\nSwitch(config-if)# switchport mode access\nSwitch(config-if)# switchport access vlan 30\nSwitch(config-if)# spanning-tree portfast\nSwitch(config-if)# no shutdown",
      },
    ],
    verificationCommands: ["show interfaces <iface> switchport", "show vlan"],
    troubleshootingNotes: [
      "إذا عرض show interfaces gi1/0/10 switchport أن 'Administrative Mode: dynamic auto'، فقد يتفاوض المنفذ على trunk بشكل غير متوقع. اضبط دائمًا switchport mode access صراحةً.",
    ],
    warnings: [
      "على منفذ trunk لا تطبّق switchport access vlan بدون switchport mode access — قد ينقلب المنفذ بين الأوضاع ويفقد الحركة.",
    ],
    undoMethod: "no switchport access vlan (يعود لـ VLAN 1 الافتراضية).",
    references: [
      {
        label: "Catalyst 9300 Layer 2 Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/l2/b_1712_l2_9300_9300l/vlans.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-vlan", "cmd-switchport-trunk-allowed-vlan", "cmd-spanning-tree-portfast"],
    tags: ["switching", "vlan", "access-port", "ccna"],
  },
  {
    id: "cmd-switchport-trunk-allowed-vlan",
    name: "switchport trunk allowed vlan",
    syntax: "switchport trunk allowed vlan {<list> | add <list> | remove <list> | except <list> | all | none}",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration"],
    promptShape: "Switch(config-if)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "VLANs and SVI",
    category: "Switching",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يقيّد VLANs التي يمكنها عبور منفذ trunk. من الممارسات الفضلى سرد صريح فقط VLANs التي يجب أن تعبر الـ trunk.",
    description:
      "افتراضيًا يحمل الـ trunk جميع VLANs (1-4094). هذا نادرًا ما يُراد — يهدر النطاق الترددي، يكشف نطاقات البث، ويعقّد STP. الكلمة switchport trunk allowed vlan تقيّد الـ trunk لقائمة صريحة. استخدم add و remove لتعديل قائمة موجودة دون إعادة كتابتها. يدعم صياغة قائمة VLAN الفواصل (10,20,30) والمدى (10-30).",
    parameters: [
      {
        name: "<list>",
        description: "قائمة VLANs مفصولة بفواصل أو مدى. مثال: 10,20,30,99 أو 10-30.",
        required: true,
      },
      {
        name: "add | remove | except",
        description: "تعديل قائمة موجودة بدلًا من استبدالها.",
        required: false,
        allowedValues: ["add", "remove", "except", "all", "none"],
      },
    ],
    examples: [
      {
        context: "Trunk يحمل فقط VLANs 10 و 20 و 30 و 99",
        code: "Switch(config-if)# switchport trunk allowed vlan 10,20,30,99",
      },
      {
        context: "إضافة VLAN 40 إلى trunk موجود",
        code: "Switch(config-if)# switchport trunk allowed vlan add 40",
      },
    ],
    verificationCommands: ["show interfaces <iface> trunk", "show interfaces <iface> switchport"],
    troubleshootingNotes: [
      "إذا كان VLAN يجب أن يعبر الـ trunk لكنه مفقود، تحقق من show interfaces trunk للفرق بين 'Vlans allowed on trunk' و 'Vlans allowed and active in management domain'. القائمة الثانية تعرض فقط VLANs المسموح بها الموجودة فعلًا على المحول.",
    ],
    undoMethod: "no switchport trunk allowed vlan (يعود للسماح بكل VLANs).",
    references: [
      {
        label: "Catalyst 9300 Layer 2 Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/l2/b_1712_l2_9300_9300l/vlans.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-switchport-mode-trunk", "cmd-switchport-access-vlan"],
    tags: ["switching", "vlan", "trunk", "ccna"],
  },
  {
    id: "cmd-switchport-mode-trunk",
    name: "switchport mode trunk",
    syntax: "switchport mode trunk",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration"],
    promptShape: "Switch(config-if)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "VLANs and SVI",
    category: "Switching",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يفرض على المنفذ أن يكون trunk، يوسم الإطارات بمعرفات VLAN باستخدام تغليف 802.1Q. يُستخدم لروابط محول-إلى-محول أو محول-إلى-موجّه تحمل عدة VLANs.",
    description:
      "منافذ trunk تستخدم وسم 802.1Q (ISL مُهمَل منذ زمن طويل) لحمل عدة VLANs عبر رابط واحد. switchport mode trunk يفرض على المنفذ أن يكون trunkًا بشكل غير مشروط — مفضّل على dynamic desirable/dynamic auto للسلوك الحتمي. اقرن دائمًا بـ switchport trunk allowed vlan لتقييد VLANs التي تعبر الـ trunk، ولا تفعل PortFast أبدًا على منافذ trunk.",
    examples: [
      {
        context: "ضبط trunk بين محولين",
        code: "Switch(config)# interface GigabitEthernet1/0/1\nSwitch(config-if)# switchport trunk encapsulation dot1q\nSwitch(config-if)# switchport mode trunk\nSwitch(config-if)# switchport trunk allowed vlan 10,20,30,99",
      },
    ],
    verificationCommands: ["show interfaces <iface> trunk", "show interfaces <iface> switchport"],
    warnings: [
      "على بعض المنصات يُطلب switchport trunk encapsulation dot1q قبل switchport mode trunk لأن ISL مدعوم أيضًا. على Catalyst 9000 الحديثة dot1q فقط مدعوم والأمر ضمني.",
    ],
    undoMethod: "no switchport mode trunk (يعود للوضع الافتراضي dynamic auto).",
    references: [
      {
        label: "Catalyst 9300 Layer 2 Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/l2/b_1712_l2_9300_9300l/vlans.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-switchport-trunk-allowed-vlan", "cmd-switchport-access-vlan"],
    tags: ["switching", "vlan", "trunk", "ccna"],
  },
  {
    id: "cmd-switchport-trunk-encapsulation",
    name: "switchport trunk encapsulation",
    syntax: "switchport trunk encapsulation {dot1q | isl | negotiate}",
    platforms: ["IOS"],
    versionRange: "IOS 11.1+؛ غير مطلوب على Catalyst 9000 (dot1q فقط)",
    cliMode: ["Interface Configuration"],
    promptShape: "Switch(config-if)#",
    certLevel: "Fundamentals",
    scope: "extended",
    topic: "VLANs and SVI",
    category: "Switching",
    curriculumVersions: ["CCNA v1.0 (200-120)"],
    status: "Deprecated",
    historicalNote:
      "كان هذا الأمر مطلوبًا على Catalyst القديمة (2960/3560/3750) لاختيار تغليف trunk بين ISL (Cisco الخاص، مُهمَل) و dot1q (معيار IEEE). على Catalyst 9000 الحديثة dot1q هو الوحيد المدعوم، لذا الأمر غير مطلوب ويُتجاهل. محفوظ لأغراض الفهم التاريخي عند العمل على عتاد قديم.",
    modernAlternative: "(ضمني) — dot1q على Catalyst 9000 وكل المنصات الحديثة",
    differencesFromAlternative:
      "على Catalyst القديمة كان يجب اختيار التغليف صراحةً. على المنصات الحديثة dot1q هو الافتراضي والوحيد، فلا حاجة لهذا الأمر.",
    summary:
      "أمر تاريخي كان يُستخدم لاختيار تغليف trunk على Catalyst القديمة. غير مطلوب على Catalyst 9000 الحديثة لأن dot1q هو الوحيد المدعوم.",
    description:
      "switchport trunk encapsulation يختار بروتوكول التغليف لمنفذ trunk على Catalyst القديمة: dot1q (معيار IEEE 802.1Q، موصى به)، isl (Cisco الخاص، مُهمَل ومنتهي الدعم)، negotiate (التفاوض مع الطرف الآخر). على Catalyst 9000 وكل المنصات الحديثة dot1q هو الوحيد المدعوم، لذا هذا الأمر غير ضروري ويُتجاهل. محفوظ في الموسوعة لمن يواجه عتاد Catalyst قديمًا.",
    parameters: [
      {
        name: "dot1q | isl | negotiate",
        description: "نوع التغليف. dot1q معيار IEEE وموصى به. isl خاص بـ Cisco ومُهمَل.",
        required: true,
        allowedValues: ["dot1q", "isl", "negotiate"],
      },
    ],
    examples: [
      {
        context: "ضبط dot1q على Catalyst 2960 قديم",
        code: "Switch(config-if)# switchport trunk encapsulation dot1q\nSwitch(config-if)# switchport mode trunk",
      },
    ],
    verificationCommands: ["show interfaces <iface> trunk"],
    undoMethod: "no switchport trunk encapsulation.",
    references: [
      {
        label: "Catalyst 2960 Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst2960/software/release/12-2_55_se/command/reference/2960CR.pdf",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-switchport-mode-trunk", "cmd-switchport-trunk-allowed-vlan"],
    tags: ["switching", "vlan", "trunk", "deprecated", "historical"],
  },
  {
    id: "cmd-spanning-tree-portfast",
    name: "spanning-tree portfast",
    syntax: "spanning-tree portfast [trunk | disable]",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration"],
    promptShape: "Switch(config-if)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Spanning Tree Protocol",
    category: "Switching",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُفعّل PortFast على منفذ access، متجاوزًا حالتي Listening و Learning من STP والانتقال مباشرة إلى Forwarding. لمنافذ المضيفين النهائيين فقط — لا على trunks.",
    description:
      "PortFast يتخطّى تأخير تقارب STP البالغ 30 ثانية على منافذ access، ما يسمح للمضيفين النهائيين بالحصول على عناوين DHCP فورًا. PortFast يجب أن يُفعّل فقط على المنافذ المتصلة بالمضيفين النهائيين (PC، طابعات، نقاط وصول في وضع flex). تفعيله على منفذ trunk أو hub قد يسبب حلقات جسور أثناء التقارب. النسخة spanning-tree portfast trunk تطبّق PortFast على منافذ trunk — تُستخدم لروابط trunk إلى خوادم أحادية المنفذ أو router-on-a-stick. اقرنها بـ spanning-tree bpduguard enable لإغلاق المنفذ بالخطأ عند استقبال BPDU (يحمي من إساءة تكوين trunk-to-trunk).",
    examples: [
      {
        context: "منفذ مضيف نهائي بـ PortFast و BPDU Guard",
        code: "Switch(config-if)# spanning-tree portfast\nSwitch(config-if)# spanning-tree bpduguard enable",
      },
    ],
    verificationCommands: ["show spanning-tree interface <iface> detail", "show spanning-tree summary"],
    warnings: [
      "لا تفعل PortFast على منفذ trunk بدون bpduguard enable — رابط uplink مُساء تكوينه قد يلتف على نطاق البث كامل.",
    ],
    undoMethod: "no spanning-tree portfast.",
    references: [
      {
        label: "Catalyst 9300 STP Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/l2/b_1712_l2_9300_9300l/stp.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-spanning-tree-bpduguard", "cmd-spanning-tree-mode"],
    tags: ["switching", "stp", "portfast", "ccna"],
  },
  {
    id: "cmd-spanning-tree-bpduguard",
    name: "spanning-tree bpduguard enable",
    syntax: "spanning-tree bpduguard enable",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.1+؛ IOS XE كافة",
    cliMode: ["Interface Configuration"],
    promptShape: "Switch(config-if)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Spanning Tree Protocol",
    category: "Switching",
    curriculumVersions: ["CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُعطّل منفذًا بالخطأ (err-disable) عند استقباله BPDU. مُقرن مع PortFast على منافذ access لإغلاق فوري للـ trunks المُساء تكوينها.",
    description:
      "BPDU Guard يحمي الشبكة من حلقات الجسور العرضية. عند تفعيله على منفذ access مع PortFast، فإن أي BPDU مستقبَل (ما يدل على أن أحدهم وصل محولًا) يؤدي إلى تعطيل المنفذ بالخطأ (err-disabled). الاسترداد تلقائي إذا ضُبط errdisable recovery cause bpduguard عالميًا؛ وإلا يبقى المنفذ معطلًا حتى يسترد يدويًا بـ shutdown/no shutdown.",
    examples: [
      {
        context: "تفعيل BPDU Guard عالميًا على كل منافذ PortFast",
        code: "Switch(config)# spanning-tree portfast bpduguard default",
      },
    ],
    verificationCommands: ["show spanning-tree summary", "show interfaces status err-disabled"],
    troubleshootingNotes: [
      "إذا ذهب منفذ إلى err-disabled بسبب 'bpduguard'، تحقق مما هو متصل: عادةً مستخدم نهائي وصل محولًا صغيرًا أو hub. استعد بـ shutdown/no shutdown بعد إصلاح الطوبولوجيا.",
    ],
    undoMethod: "no spanning-tree bpduguard enable.",
    references: [
      {
        label: "Catalyst 9300 STP Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/l2/b_1712_l2_9300_9300l/stp.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-spanning-tree-portfast", "cmd-spanning-tree-mode"],
    tags: ["switching", "stp", "bpduguard", "ccna"],
  },
  {
    id: "cmd-spanning-tree-mode",
    name: "spanning-tree mode",
    syntax: "spanning-tree mode {pvst | mst | rapid-pvst}",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Switch(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Spanning Tree Protocol",
    category: "Switching",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يختار وضع Spanning Tree. Rapid-PVST هو الافتراضي الموصى به لشبكات Catalyst الحديثة؛ MST يُستخدم في تصاميم متعددة VLAN كبيرة.",
    description:
      "توجد ثلاثة أوضاع STP على IOS/IOS XE: (1) PVST+ — STP خاص بـ Cisco لكل VLAN، متوافق مع 802.1D، تقارب بطيء (~50 ثانية). (2) Rapid-PVST — RSTP لكل VLAN (802.1w)، تقارب بثوانٍ، موصى به لمعظم النشرات الحديثة. (3) MST (Multiple Spanning Tree، 802.1s) — يربط عدة VLANs بعدد صغير من نسخ STP، يُستخدم في مراكز البيانات بمئات VLANs. الافتراضي pvst على معظم Catalyst — غيّره إلى rapid-pvst كممارسة فضلى ما لم يكن لديك تصميم MST محدد.",
    parameters: [
      {
        name: "pvst | mst | rapid-pvst",
        description: "وضع STP. rapid-pvst موصى به لمعظم النشرات.",
        required: true,
        allowedValues: ["pvst", "mst", "rapid-pvst"],
      },
    ],
    examples: [
      {
        context: "تفعيل Rapid-PVST على المحول كله",
        code: "Switch(config)# spanning-tree mode rapid-pvst",
      },
    ],
    verificationCommands: ["show spanning-tree summary", "show spanning-tree vlan 1"],
    references: [
      {
        label: "Catalyst 9300 STP Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/l2/b_1712_l2_9300_9300l/stp.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-spanning-tree-portfast", "cmd-spanning-tree-bpduguard"],
    tags: ["switching", "stp", "ccna"],
  },

  // =================================================================
  // IP Routing — fundamentals + static
  // =================================================================
  {
    id: "cmd-ip-routing",
    name: "ip routing",
    syntax: "ip routing",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Switch(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "IP Routing",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُفعّل توجيه Layer 3 على محول Layer 3. مطلوب قبل أن تتمكن SVIs من توجيه الحزم بين VLANs وقبل تشغيل أي بروتوكول توجيه.",
    description:
      "على محولات Catalyst من نوع Layer 3، يكون التوجيه معطلًا افتراضيًا. الأمر ip routing يُفعّل توجيه IPv4 unicast — بدونه توجد SVIs لكنها لا تستطيع توجيه الحزم بين VLANs. بعد التفعيل، يبني المحول جدول توجيه من المسارات المتصلة (SVIs، المنافذ الموجّهة) وأي بروتوكولات توجيه مُعدّة. لتعطيل التوجيه (إعادة المحول إلى وضع Layer 2 فقط) استخدم no ip routing.",
    examples: [
      {
        context: "تفعيل توجيه بين VLANs على محول Layer 3",
        code: "Switch(config)# ip routing",
      },
    ],
    verificationCommands: ["show ip route", "show ip protocols"],
    troubleshootingNotes: [
      "إذا عرض show ip route فقط مسارات متصلة ولا مسارات متعلّمة رغم ضبط OSPF/BGP، تحقق أن ip routing مُفعّل — البروتوكولات ستبني التجاورات لكن FIB لن يُملأ.",
    ],
    commonErrors: [
      "تفعيل بروتوكول التوجيه على محول Layer 3 قبل ip routing — لن تظهر المسارات في RIB.",
    ],
    undoMethod: "no ip routing.",
    references: [
      {
        label: "Catalyst 9300 Layer 3 Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/l3/b_1712_l3_9300_9300l/svis.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-ip-route", "cmd-router-ospf", "cmd-interface-vlan"],
    tags: ["routing", "ccna", "fundamentals"],
  },
  {
    id: "cmd-show-ip-route",
    name: "show ip route",
    aliases: ["sh ip route"],
    syntax: "show ip route [{connected | static | ospf | bgp | eigrp | rip} | <network> <mask> | <network>/<prefix>]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "IP Routing",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يعرض جدول توجيه IPv4 (RIB). أهم أمر تحقق في التوجيه. يدعم ترشيحًا حسب البروتوكول أو الشبكة.",
    description:
      "show ip route (sh ip route) يطبع RIB (Routing Information Base) لـ IPv4. كل سطر يعرض شبكة وجهة، المسافة الإدارية/المتريك، البروتوكول المصدر، وواجهة/IP الـ next-hop. الكلمات المفتاحية الاختيارية تُرشّح المخرجات: show ip route ospf تعرض فقط مسارات OSPF المتعلّمة؛ show ip route 10.0.0.0 255.0.0.0 تعرض longest-prefix match لوجهة محددة. مفتاح الأكواد: C=connected، S=static، O=OSPF، B=BGP، D=EIGRP، R=RIP، L=local. على IOS XR المكافئ show route.",
    parameters: [
      {
        name: "connected | static | ospf | bgp | eigrp | rip",
        description: "ترشيح حسب البروتوكول المصدر.",
        required: false,
      },
      {
        name: "<network> <mask>",
        description: "ترشيح longest-prefix match لوجهة محددة.",
        required: false,
      },
    ],
    examples: [
      {
        context: "ترشيح مسارات OSPF فقط",
        code: "Router# show ip route ospf",
      },
      {
        context: "Longest-prefix match لـ 10.10.20.5",
        code: "Router# show ip route 10.10.20.5",
        output:
          "Routing entry for 10.10.20.0/24\n  Known via \"ospf 1\", distance 110, metric 2, type intra area\n  Last update from 10.0.0.2 on GigabitEthernet0/0/0, 00:14:22 ago\n  Routing Descriptor Blocks:\n  * 10.0.0.2, from 10.0.0.2, 00:14:22 ago, via GigabitEthernet0/0/0\n      Route metric is 2, traffic share count is 1",
        outputExplanation:
          "تعرض المخرجات أن الشبكة 10.10.20.0/24 متعلّمة عبر OSPF process 1، المسافة الإدارية 110، المتريك 2، نوعها intra-area، والـ next-hop هو 10.0.0.2 عبر GigabitEthernet0/0/0.",
      },
    ],
    verificationCommands: ["show ip protocols", "show ip cef"],
    troubleshootingNotes: [
      "إذا ظهر مسار في RIB لكن الحركة لا تُوجَّه، افحص FIB بـ show ip cef — التضارب يدل عادةً على تلف CEF، يُصلح بـ clear ip cef أو إعادة تشغيل عملية التوجيه.",
      "مسارات مفقودة رغم وجود التجاور: افحص distribution-lists وroute-maps وprefix-lists المطبّقة inbound على بروتوكول التوجيه.",
    ],
    commonErrors: [
      "البحث عن شبكة بقناع خاطئ في show ip route — استخدم الصيغة CIDR (10.0.0.0/24) أو network+mask الكاملة.",
    ],
    references: [
      {
        label: "Cisco IOS IP Routing Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute/command/ipr-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-ip-protocols", "cmd-show-ip-cef", "cmd-ip-routing"],
    tags: ["routing", "verification", "ccna"],
  },
  {
    id: "cmd-show-ip-protocols",
    name: "show ip protocols",
    syntax: "show ip protocols [summary]",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "IP Routing",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يعرض بروتوكولات توجيه IPv4 المُعدّة ومعاملاتها والشبكات التي تُعلنها. حاسم للتحقق من إعداد البروتوكول.",
    description:
      "show ip protocols يسرد كل عملية توجيه IPv4 نشطة (OSPF، EIGRP، BGP، RIP، IS-IS) مع معاملاتها الرئيسية: router-id، الشبكات، إعدادات redistribution، المسافة، عضوية المنطقة، الجيران، وأي فلاتر inbound/outbound. المخرجات هي الطريقة القياسية للتحقق من أن بروتوكول التوجيه مُعدّة بشكل صحيح ويُعيد توزيع المسارات المتوقعة.",
    examples: [
      {
        context: "التحقق من إعداد OSPF",
        code: "Router# show ip protocols",
        output:
          "*** IP Routing is NSF aware ***\n\nRouting Protocol is \"ospf 1\"\n  Outgoing update filter list for all interfaces is not set\n  Incoming update filter list for all interfaces is not set\n  Router ID 10.0.0.1\n  Number of areas in this router is 1. 1 normal 0 stub 0 nssa\n  Maximum path: 4\n  Routing for Networks:\n    10.0.0.0 0.0.0.3 area 0\n  Routing Information Sources:\n    Gateway         Distance      Last Update\n    10.0.0.2             110      00:14:22\n  Distance: (default is 110)",
      },
    ],
    verificationCommands: ["show ip route", "show ip ospf", "show ip eigrp topology"],
    references: [
      {
        label: "Cisco IOS IP Routing Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute/command/ipr-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-ip-route", "cmd-router-ospf"],
    tags: ["routing", "verification", "ccna"],
  },
  {
    id: "cmd-ip-route-static",
    name: "ip route",
    syntax: "ip route <destination-network> <subnet-mask> {<next-hop-ip> | <exit-interface>} [<admin-distance>] [permanent] [track <id>]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Static Routing",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "ينشئ مسار IPv4 ثابتًا. المسار الافتراضي يستخدم الوجهة 0.0.0.0 0.0.0.0. المسارات الثابتة لها مسافة إدارية 1 افتراضيًا.",
    description:
      "المسارات الثابتة مُعدّة يدويًا ولا تنتهي صلاحيتها أبدًا. هي أبسط أشكال التوجيه والاختيار الصحيح للشبكات الطرفية (stub)، المسارات الافتراضية إلى ISP واحد، والمسارات الثابتة العائمة (floating static routes بمسافة إدارية عالية) كاحتياطي عند فشل بروتوكول ديناميكي. يمكن تحديد الـ next-hop كعنوان IP (موصى به للشبكات متعددة الوصول) أو كواجهة خروج (مقبول للنقطة-إلى-نقطة لكن يسبب سلوك ARP غير مرغوب على الشبكات متعددة الوصول). يمكن إرفاق كائن track لإزالة المسار عندما يصبح الكائن المتتبَّع (SLA، IP SLA، حالة واجهة) معطلًا.",
    parameters: [
      {
        name: "<destination-network>",
        description: "عنوان شبكة الوجهة. 0.0.0.0 للمسار الافتراضي.",
        required: true,
      },
      {
        name: "<subnet-mask>",
        description: "قناع الشبكة الفرعية للوجهة. 0.0.0.0 للمسار الافتراضي.",
        required: true,
      },
      {
        name: "<next-hop-ip> | <exit-interface>",
        description: "next-hop IP (موصى به) أو واجهة الخروج.",
        required: true,
      },
      {
        name: "<admin-distance>",
        description: "المسافة الإدارية. الافتراضية 1. ضعها 250 لمسار عائم احتياطي.",
        required: false,
        defaultValue: "1",
      },
      {
        name: "permanent",
        description: "يُبقي المسار في RIB حتى لو أصبح next-hop غير قابل للوصول.",
        required: false,
      },
      {
        name: "track <id>",
        description: "يربط المسار بكائن track — يُزال من RIB عند تعطّل الكائن.",
        required: false,
      },
    ],
    examples: [
      {
        context: "مسار افتراضي إلى بوابة ISP",
        code: "Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1",
      },
      {
        context: "مسار ثابت عائم (احتياطي، AD 250) لمسار OSPF الأساسي",
        code: "Router(config)# ip route 10.10.0.0 255.255.0.0 10.0.0.2 250",
      },
    ],
    verificationCommands: ["show ip route static", "show ip route 0.0.0.0"],
    troubleshootingNotes: [
      "المسار الثابت إلى next-hop IP يصبح غير قابل للوصول يُزال تلقائيًا من RIB ما لم يُضبط permanent.",
      "المسار الثابت إلى واجهة خروج على شبكة متعددة الوصول (Ethernet) يُطلق ARP لكل وجهة — استخدم next-hop IP بدلًا منه.",
    ],
    commonErrors: [
      "استخدام واجهة خروج بدلًا من next-hop IP على Ethernet — يسبب ARP explosion ويُسقط أداء الموجّه.",
      "نسيان subnet mask الكامل (ليس wildcard mask).",
    ],
    undoMethod: "no ip route <network> <mask> <next-hop> [<AD>].",
    references: [
      {
        label: "Cisco IOS IP Routing Command Reference — ip route",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute/command/ipr-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-ip-route", "cmd-ip-sla", "cmd-track"],
    tags: ["routing", "static", "ccna"],
  },
  {
    id: "cmd-show-ip-cef",
    name: "show ip cef",
    syntax: "show ip cef [<network> | <interface> | detail]",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.0+؛ IOS XE كافة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "IP Routing",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary:
      "يعرض جدول FIB (Forwarding Information Base) المستخدم في التحويل الفعلي للحزم بواسطة CEF (Cisco Express Forwarding). مكمّل لـ show ip route.",
    description:
      "CEF هو آلية التحويل الافتراضية على موجّهات Cisco الحديثة. show ip cef يعرض FIB المبني من RIB — وهو ما يستخدمه محرك التحويل فعليًا. التضارب بين RIB (show ip route) و FIB (show ip cef) يدل عادةً على تلف CEF ويُصلح بـ clear ip cef أو إعادة تشغيل عملية التوجيه. للوجهة المحددة استخدم show ip cef <network> detail لرؤية next-hop وload-sharing.",
    examples: [
      {
        context: "عرض FIB لوجهة محددة",
        code: "Router# show ip cef 10.10.20.0 detail",
        output:
          "10.10.20.0/24, epoch 0, flags [att, foreign, receive]\n  dflt local adj, overlay index 1\n  via 10.0.0.2, GigabitEthernet0/0/0, 0 dependencies",
        outputExplanation:
          "تعرض المخرجات أن الشبكة 10.10.20.0/24 في FIB عبر next-hop 10.0.0.2 على GigabitEthernet0/0/0. الحقول تؤكد أن التحويل الفعلي يستخدم نفس next-hop الذي يعرضه RIB.",
      },
    ],
    verificationCommands: ["show ip route", "show adjacency"],
    troubleshootingNotes: [
      "إذا عرض show ip route مسارًا لكن show ip cef لا يعرضه، هناك تلف CEF. نفّذ clear ip cef * ثم أعد الفحص.",
    ],
    references: [
      {
        label: "Cisco IOS IP Switching Command Reference — CEF",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipswitch/command/ips-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-ip-route"],
    tags: ["routing", "cef", "verification", "enarsi"],
  },

  // =================================================================
  // OSPF — CCNA + ENARSI
  // =================================================================
  {
    id: "cmd-router-ospf",
    name: "router ospf",
    syntax: "router ospf <process-id> [vrf <vrf-name>]",
    platforms: ["IOS", "IosXe", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "Router Configuration"],
    promptShape: "Router(config)# → Router(config-router)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "OSPF",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)", "CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary:
      "ينشئ عملية OSPFv2 ويدخل وضع Router Configuration. الـ process-id محلي فقط (لا يجب أن يتطابق بين الجيران).",
    description:
      "OSPFv2 (Open Shortest Path First for IPv4) هو بروتوكول توجيه link-state IGP. الأمر router ospf <process-id> يبدأ العملية — الـ process-id محلي للجهاز ولا يجب أن يتطابق بين الجيران. يمكن تشغيل عدة عمليات OSPF على نفس الجهاز (بمعرّفات عمليات مختلفة) لكن هذا نادر. من وضع Router Configuration تضبط router-id، المناطق (areas)، إعادة التوزيع، وreference bandwidth. يُبنى التجاور لكل واجهة باستخدام network statements أو ip ospf <id> area <id> على مستوى الواجهة.",
    parameters: [
      {
        name: "<process-id>",
        description: "معرّف عملية OSPF المحلي (1-65535). لا يحتاج للمطابقة بين الجيران.",
        required: true,
        allowedValues: ["1-65535"],
      },
      {
        name: "vrf <vrf-name>",
        description: "يربط العملية بـ VRF محدد.",
        required: false,
      },
    ],
    examples: [
      {
        context: "بدء OSPF process 1، ضبط router-id، ضبط reference bandwidth",
        code: "Router(config)# router ospf 1\nRouter(config-router)# router-id 10.0.0.1\nRouter(config-router)# auto-cost reference-bandwidth 100000\nRouter(config-router)# passive-interface default\nRouter(config-router)# no passive-interface GigabitEthernet0/0/0",
      },
    ],
    verificationCommands: ["show ip ospf", "show ip ospf neighbor", "show ip ospf interface"],
    troubleshootingNotes: [
      "إذا كان الجيران عالقين في EXSTART/EXCHANGE، افحص اختلاف MTU (show ip ospf interface) — OSPF يرفض تبادل DBD إذا اختلفت MTUs.",
      "إذا تكرر router-id، لا يتشكل تجاور. اضبط router-id صراحةً؛ OSPF يفضل أعلى IP على loopback وإلا فيصطدم إذا أُعيد ترقيم loopbacks.",
    ],
    commonErrors: [
      "نسيان ضبط router-id صراحةً واعتماد الجهاز على أعلى IP — يتغير router-id عند إضافة loopback جديدة فيكسر التجاور.",
      "استخدام wildcard mask بدلًا من subnet mask في network statement.",
    ],
    undoMethod: "no router ospf <process-id>.",
    references: [
      {
        label: "Cisco IOS IP Routing: OSPF Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/configuration/17-12/iro-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-network-ospf", "cmd-ip-ospf-area", "cmd-show-ip-ospf"],
    tags: ["routing", "ospf", "ccna", "igp"],
  },
  {
    id: "cmd-network-ospf",
    name: "network (OSPF)",
    syntax: "network <ip-address> <wildcard-mask> area <area-id>",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Router Configuration"],
    promptShape: "Router(config-router)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "OSPF",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يطابق الواجهات بعنوان IP ويسندها إلى منطقة OSPF. يستخدم wildcard masks (عكس أقنعة الشبكة). الصيغة الحديثة ip ospf <id> area <id> على مستوى الواجهة مفضّلة.",
    description:
      "الأمر network الكلاسيكي تحت router ospf يطابق أي واجهة بعنوان IP يقع داخل network/wildcard، ويسند تلك الواجهات إلى المنطقة المحددة. wildcard masks هي عكس subnet masks (مثلًا /24 = 0.0.0.255). يمكن لعدة network statements مطابقة نفس الواجهة؛ الأكثر تحديدًا يفوز. الصيغة الحديثة ip ospf <process-id> area <area-id> على مستوى الواجهة مفضّلة لأنها أوضح وأقل عرضة للأخطاء.",
    parameters: [
      {
        name: "<ip-address>",
        description: "عنوان الشبكة أو الواجهة للمطابقة.",
        required: true,
      },
      {
        name: "<wildcard-mask>",
        description: "Wildcard mask (عكس subnet mask). /24 = 0.0.0.255، /30 = 0.0.0.3.",
        required: true,
      },
      {
        name: "<area-id>",
        description: "معرّف المنطقة. 0 = backbone. يمكن أن يكون رقميًا أو بصيغة IP.",
        required: true,
      },
    ],
    examples: [
      {
        context: "إسناد كل واجهات 10.x.x.x إلى area 0",
        code: "Router(config-router)# network 10.0.0.0 0.255.255.255 area 0",
      },
      {
        context: "إسناد رابط /30 محدد إلى area 0",
        code: "Router(config-router)# network 10.0.0.0 0.0.0.3 area 0",
      },
    ],
    verificationCommands: ["show ip ospf interface brief", "show ip ospf neighbor"],
    commonErrors: [
      "خلط بين wildcard mask و subnet mask — OSPF يستخدم wildcard دائمًا في network statement.",
    ],
    undoMethod: "no network <ip> <wildcard> area <area-id>.",
    references: [
      {
        label: "Cisco IOS IP Routing: OSPF Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/configuration/17-12/iro-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-ospf", "cmd-ip-ospf-area"],
    tags: ["routing", "ospf", "ccna"],
  },
  {
    id: "cmd-ip-ospf-area",
    name: "ip ospf area",
    syntax: "ip ospf <process-id> area <area-id> [secondaries none]",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.3+؛ IOS XE كافة",
    cliMode: ["Interface Configuration"],
    promptShape: "Router(config-if)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "OSPF",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary:
      "طريقة حديثة لإسناد واجهة إلى منطقة OSPF على مستوى الواجهة. مفضّلة على network statement لأنها أوضح وأقل عرضة للأخطاء.",
    description:
      "الأمر ip ospf <process-id> area <area-id> على مستوى الواجهة هو الطريقة الحديثة المفضّلة لإسناد واجهة إلى منطقة OSPF. غير ملتبس (تستطيع رؤية أي واجهة في أي منطقة في show running-config interface)، يدعم VRFs صراحةً عبر ip ospf <id> area <id> vrf <name>، ويتجنب الالتباس في wildcard masks الخاص بـ network statements. الجمع بين الطريقتين على نفس الموجّه مسموح لكن غير موصى به.",
    parameters: [
      {
        name: "<process-id>",
        description: "معرّف عملية OSPF (نفسه المستخدم في router ospf <id>).",
        required: true,
      },
      {
        name: "<area-id>",
        description: "معرّف المنطقة. 0 = backbone.",
        required: true,
      },
    ],
    examples: [
      {
        context: "إسناد loopback إلى area 0 كـ /32 (network type LOOPBACK)",
        code: "Router(config)# interface Loopback0\nRouter(config-if)# ip address 10.0.0.1 255.255.255.255\nRouter(config-if)# ip ospf 1 area 0",
      },
    ],
    verificationCommands: ["show ip ospf interface brief", "show ip ospf interface Loopback0"],
    references: [
      {
        label: "Cisco IOS IP Routing: OSPF Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/configuration/17-12/iro-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-ospf", "cmd-network-ospf"],
    tags: ["routing", "ospf", "enarsi"],
  },
  {
    id: "cmd-show-ip-ospf",
    name: "show ip ospf",
    aliases: ["sh ip ospf"],
    syntax: "show ip ospf [process-id | detail]",
    platforms: ["IOS", "IosXe", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "OSPF",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يعرض عملية OSPF: router-id، المناطق، إحصاءات SPF، وreference bandwidth. أول أمر للتحقق من إعداد OSPF الصحيح.",
    description:
      "show ip ospf يعرض معاملات عملية OSPFv2: router-id، مؤقتات SPF throttle، reference bandwidth، عدد المناطق، أنواع المناطق (normal/stub/nssa)، حالة ABR/ASBR، وإحصاءات تشغيل SPF. استخدمه لتأكيد أن router-id مضبوط كما هو مقصود وأن حدود المناطق صحيحة.",
    examples: [
      {
        context: "التحقق من router-id ومناطق OSPF process 1",
        code: "Router# show ip ospf 1",
        output:
          " Routing Process \"ospf 1\" with ID 10.0.0.1\n Start time: 00:01:23.116, Time elapsed: 2w3d\n Supports only single ToS(TOS0) routes\n Supports opaque LSA\n Supports Link-local Signaling (LLS)\n Initial SPF schedule delay 5000 msecs\n It is an area border router\n Number of areas in this router is 2. 2 normal 0 stub 0 nssa\n    Area BACKBONE(0)\n        Number of interfaces in this area is 3\n    Area 1\n        Number of interfaces in this area is 2",
        outputExplanation:
          "تعرض المخرجات أن router-id هو 10.0.0.1، الجهاز ABR (Area Border Router) بمنطقتين (backbone و area 1)، و3 واجهات في backbone و2 في area 1.",
      },
    ],
    verificationCommands: ["show ip ospf neighbor", "show ip ospf interface", "show ip ospf database"],
    references: [
      {
        label: "Cisco IOS IP Routing: OSPF Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/command/iro-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-ip-ospf-neighbor", "cmd-router-ospf"],
    tags: ["routing", "ospf", "verification", "ccna"],
  },
  {
    id: "cmd-show-ip-ospf-neighbor",
    name: "show ip ospf neighbor",
    aliases: ["sh ip ospf nei"],
    syntax: "show ip ospf neighbor [{<interface> | <neighbor-id>} | detail | all]",
    platforms: ["IOS", "IosXe", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "OSPF",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يسرد جيران OSPF بحالتهم وعنوانهم والواجهة التي يُ Reachedون منها. أمر التحقق القياسي من التجاور.",
    description:
      "show ip ospf neighbor هو فحص التجاور الأساسي لـ OSPF. كل سطر يعرض: neighbor-id (router-id)، الأولوية (لانتخاب DR/BDR)، الحالة (FULL، 2-WAY، EXSTART، EXCHANGE، LOADING، INIT، DOWN)، dead time (عدّاد لفقدان التجاور)، عنوان الجار، والواجهة المحلية. لقطاعات broadcast، فقط FULL و 2-WAY هي حالات نهائية سليمة؛ FULL مع DR/BDR يدل على تجاور سليم. العالق في INIT يدل على فشل توصيل HELLO أحادي؛ العالق في EXSTART/EXCHANGE يدل على اختلاف MTU أو مصادقة.",
    examples: [
      {
        context: "عرض كل جيران OSPF بتفصيل كامل",
        code: "Router# show ip ospf neighbor detail",
        output:
          " Neighbor 10.0.0.2, interface address 10.0.0.2\n    In the area 0 via interface GigabitEthernet0/0/0\n    Neighbor priority is 1, State is FULL, 6 state changes\n    DR is 10.0.0.1 BDR is 10.0.0.2\n    Options is 0x12 in Hello (E-bit L-bit)\n    Dead timer due in 00:00:35\n    Neighbor is up for 2w3d",
        outputExplanation:
          "الجار 10.0.0.2 في حالة FULL (تجاور مكتمل)، عبر GigabitEthernet0/0/0، DR هو 10.0.0.1 و BDR هو 10.0.0.2. Dead timer في 35 ثانية — لو لم يصل HELLO خلالها لانقطع التجاور.",
      },
    ],
    verificationCommands: ["show ip ospf", "show ip ospf interface", "show ip ospf database"],
    troubleshootingNotes: [
      "عالق في INIT: HELBO يصل لكن الجار لا يرى HELLO الخاص بنا — افحص وصول unicast/multicast، ACLs، NAT.",
      "عالق في EXSTART/EXCHANGE: اختلاف MTU أو تكرار router-id. تحقق بـ show ip ospf interface.",
      "عالق في 2-WAY على broadcast: طبيعي إذا لم يكن أي من الموجّهين DR/BDR؛ ليست مشكلة ما لم يكن التجاور متوقعًا.",
    ],
    commonErrors: [
      "تفسير 2-WAY كفشل — على broadcast segments، الموجّهات غير DR/BDR يبقون في 2-WAY ولا يتشكل بينهم FULL، وهذا طبيعي.",
    ],
    references: [
      {
        label: "Cisco IOS IP Routing: OSPF Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/command/iro-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-ip-ospf", "cmd-router-ospf"],
    tags: ["routing", "ospf", "verification", "troubleshooting", "ccna"],
  },

  // =================================================================
  // EIGRP — CCNA
  // =================================================================
  {
    id: "cmd-router-eigrp",
    name: "router eigrp",
    syntax: "router eigrp <as-number>",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "Router Configuration"],
    promptShape: "Router(config)# → Router(config-router)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "EIGRP",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "ينشئ عملية EIGRP IPv4 برقم AS محدد. رقم AS يجب أن يتطابق بين الجيران ليتشكل التجاور.",
    description:
      "EIGRP (Enhanced Interior Gateway Routing Protocol) هو بروتوكول توجيه متقدم ذو متجه مسافة (advanced distance-vector) خاص بـ Cisco. الأمر router eigrp <AS> يبدأ العملية — رقم AS مهم ويجب أن يتطابق بين الجيران. الوضع المسمّى Named EIGRP (router eigrp <name>) مفضّل على IOS XE لأنه يدعم عائلات عناوين متعددة (IPv4 + IPv6) تحت عملية واحدة وهو أسلوب الإعداد الحديث.",
    parameters: [
      {
        name: "<as-number>",
        description: "رقم Autonomous System. يجب أن يتطابق بين الجيران. النطاق 1-65535.",
        required: true,
        allowedValues: ["1-65535"],
      },
    ],
    examples: [
      {
        context: "EIGRP كلاسيكي لـ AS 100",
        code: "Router(config)# router eigrp 100\nRouter(config-router)# eigrp router-id 10.0.0.1\nRouter(config-router)# network 10.0.0.0 0.255.255.255\nRouter(config-router)# no auto-summary",
      },
      {
        context: "وضع Named EIGRP (موصى به على IOS XE)",
        code: 'Router(config)# router eigrp ENTERPRISE\nRouter(config-router)# address-family ipv4 unicast autonomous-system 100\nRouter(config-router-af)# af-interface default\nRouter(config-router-af-interface)# passive-interface\nRouter(config-router-af-interface)# exit-af-interface\nRouter(config-router-af)# topology base\nRouter(config-router-af-topology)# redistribute connected',
      },
    ],
    verificationCommands: ["show ip eigrp topology", "show ip eigrp neighbors", "show ip protocols"],
    commonErrors: [
      "نسيان no auto-summary على إصدارات IOS القديمة — يؤدي إلى تلخيص صنفي (classful) غير مرغوب.",
      "اختلاف رقم AS بين الجيران — لا يتشكل التجاور.",
    ],
    undoMethod: "no router eigrp <as-number>.",
    references: [
      {
        label: "Cisco IOS IP Routing: EIGRP Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_eigrp/configuration/17-12/ire-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-network-eigrp", "cmd-show-ip-eigrp-topology"],
    tags: ["routing", "eigrp", "ccna"],
  },
  {
    id: "cmd-network-eigrp",
    name: "network (EIGRP)",
    syntax: "network <ip-address> [<wildcard-mask>]",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Router Configuration"],
    promptShape: "Router(config-router)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "EIGRP",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُفعّل EIGRP على الواجهات التي يطابق عنوانها الـ network statement. بدون wildcard mask يُعامل الـ network كصنفي (classful).",
    description:
      "الأمر network تحت EIGRP يُفعّل البروتوكول على أي واجهة يقع IP فيها داخل الشبكة المحددة. بدون wildcard mask، الأمر صنفي (مثلًا network 10.0.0.0 يطابق كل واجهات 10.x.x.x). مع wildcard mask، المطابقة دقيقة. الأمر network أيضًا يُطلق EIGRP لإعلان subnet تلك الواجهة.",
    parameters: [
      {
        name: "<ip-address>",
        description: "عنوان الشبكة للمطابقة.",
        required: true,
      },
      {
        name: "<wildcard-mask>",
        description: "Wildcard mask اختيارية. بدونها المطابقة تكون صنفية.",
        required: false,
      },
    ],
    examples: [
      {
        context: "تفعيل EIGRP على كل واجهات 10.x.x.x",
        code: "Router(config-router)# network 10.0.0.0 0.255.255.255",
      },
    ],
    verificationCommands: ["show ip eigrp interfaces", "show ip eigrp neighbors"],
    commonErrors: [
      "نسيان wildcard mask فيتطابق الـ network صنفيًا، ما يفعل EIGRP على واجهات غير مقصودة.",
    ],
    undoMethod: "no network <ip> [<wildcard>].",
    references: [
      {
        label: "Cisco IOS IP Routing: EIGRP Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_eigrp/configuration/17-12/ire-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-eigrp", "cmd-show-ip-eigrp-topology"],
    tags: ["routing", "eigrp", "ccna"],
  },
  {
    id: "cmd-show-ip-eigrp-topology",
    name: "show ip eigrp topology",
    syntax: "show ip eigrp topology [{<ip> <mask> | <ip>/<prefix> | all-links | detail}]",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "EIGRP",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يعرض جدول طوبولوجيا EIGRP، بما يشمل المسارات الـ successor وfeasible successor. حاسم لفهم سبب وجود مسار أو غيابه في جدول التوجيه.",
    description:
      "show ip eigrp topology يعرض جدول طوبولوجيا EIGRP. كل إدخال يعرض: شبكة الوجهة، المتريك المركّب، المسافة المُبلَّغة (RD)، مسارات successor (S - في RIB) وfeasible successors (FS - احتياطي). الكلمة all-links تعرض كل المسارات المعروفة بما فيها غير القابلة للتنفيذ. المتريك المركّب محسوب من bandwidth، delay، reliability، load، وMTU — افتراضيًا فقط bandwidth وdelay يُستخدمان.",
    examples: [
      {
        context: "عرض تفصيلي لكل المسارات المعروفة",
        code: "Router# show ip eigrp topology all-links",
      },
    ],
    verificationCommands: ["show ip route eigrp", "show ip eigrp neighbors"],
    troubleshootingNotes: [
      "إذا لم يظهر مسار في RIB رغم وجوده في الطوبولوجيا، تحقق من feasibility condition — RD يجب أن تكون أقل من متريك الـ successor.",
    ],
    references: [
      {
        label: "Cisco IOS IP Routing: EIGRP Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_eigrp/command/ire-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-eigrp", "cmd-show-ip-route"],
    tags: ["routing", "eigrp", "verification", "ccna"],
  },

  // =================================================================
  // BGP — ENCOR
  // =================================================================
  {
    id: "cmd-router-bgp",
    name: "router bgp",
    syntax: "router bgp <as-number>",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "Router Configuration"],
    promptShape: "Router(config)# → Router(config-router)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "BGP",
    category: "Routing",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "ينشئ عملية BGP برقم Autonomous System محدد. رقم AS مهم ويجب أن يتطابق على طرفي جلسة iBGP (نفس AS) أو يختلف على طرفي eBGP.",
    description:
      "BGP (Border Gateway Protocol) هو بروتوكول توجيه خارجي path-vector يُستخدم للتوجيه بين النطاقات على الإنترنت وفي الشبكات المؤسسية الكبيرة. الأمر router bgp <as> يبدأ العملية. من وضع Router Configuration تضبط router-id، تعرّف الجيران، تُفعّل عائلات العناوين، وتُعدّ السياسات. IOS XE 17.x يدعم كل من ASN بصيغة 2-byte (1-64511 عام، 64512-65535 خاص) و4-byte (صيغة ASplain).",
    parameters: [
      {
        name: "<as-number>",
        description: "رقم Autonomous System المحلي. 2-byte (1-65535) أو 4-byte (1-4294967295).",
        required: true,
      },
    ],
    examples: [
      {
        context: "إعداد eBGP إلى ISP",
        code: "Router(config)# router bgp 65001\nRouter(config-router)# bgp router-id 10.0.0.1\nRouter(config-router)# neighbor 203.0.113.1 remote-as 64500\nRouter(config-router)# address-family ipv4 unicast\nRouter(config-router-af)# neighbor 203.0.113.1 activate\nRouter(config-router-af)# network 198.51.100.0 mask 255.255.255.0\nRouter(config-router-af)# exit",
      },
    ],
    verificationCommands: ["show bgp summary", "show bgp ipv4 unicast", "show bgp neighbors"],
    troubleshootingNotes: [
      "إذا عرض show bgp summary الجار في Idle، افحص: (a) الوصول إلى IP الجار، (b) TTL لـ eBGP (افتراضي 1 — زده بـ ebgp-multihop)، (c) وصول منفذ TCP 179.",
      "إذا كان الجار في Active، يحاول الجهاز تأسيس TCP — تحقق من المسار إلى الجار وأن الجهاز البعيد مُعدّ للرد.",
    ],
    commonErrors: [
      "نسيان تفعيل الجار في address-family الصحيحة — neighbor يُعرَّف عالميًا لكن يجب تفعيله في address-family.",
    ],
    undoMethod: "no router bgp <as-number>.",
    references: [
      {
        label: "Cisco IOS IP Routing: BGP Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_bgp/configuration/17-12/irg-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-bgp-neighbor", "cmd-bgp-network", "cmd-show-bgp-summary"],
    tags: ["routing", "bgp", "encor", "egp"],
  },
  {
    id: "cmd-bgp-neighbor",
    name: "neighbor (BGP)",
    syntax: "neighbor {<ip> | <group-name>} remote-as <as-number>\nneighbor <ip> update-source <interface>\nneighbor <ip> ebgp-multihop [<ttl>]\nneighbor <ip> password <secret>",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Router Configuration"],
    promptShape: "Router(config-router)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "BGP",
    category: "Routing",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "يُعرّف جار BGP. الكلمة remote-as مطلوبة؛ update-source تتحكم في واجهة IP المحلية المصدر لجلسة TCP.",
    description:
      "جيران BGP مُعرَّفون سكونيًا (statically). الكلمة remote-as تحدد AS الجار؛ إذا ساوت AS المحلي، الجلسة iBGP، وإلا eBGP. الكلمة update-source إلزامية لجلسات iBGP المصدرّة من loopback (ممارسة فضلى للتكرار). الكلمة ebgp-multihop إلزامية عندما لا يكون نظير eBGP متصلًا مباشرة (مثلًا عبر loopback). الكلمة password تُفعّل مصادقة MD5 لـ TCP، موصى بها بشدة لكل جلسات BGP.",
    parameters: [
      {
        name: "<ip> | <group-name>",
        description: "IP الجار أو اسم peer-group.",
        required: true,
      },
      {
        name: "remote-as <as-number>",
        description: "AS الجار. يجب أن يطابق الـ AS المُعدّ على الجار.",
        required: true,
      },
      {
        name: "update-source <interface>",
        description: "واجهة المصدر لجلسة TCP. مطلوبة لـ iBGP عبر loopback.",
        required: false,
      },
      {
        name: "ebgp-multihop [<ttl>]",
        description: "تسمح بـ eBGP عبر عدة قفزات (للـ loopback peering). افتراضيًا 255.",
        required: false,
      },
    ],
    examples: [
      {
        context: "iBGP peer مصدرّ من Loopback0",
        code: "Router(config-router)# neighbor 10.0.0.2 remote-as 65001\nRouter(config-router)# neighbor 10.0.0.2 update-source Loopback0\nRouter(config-router)# neighbor 10.0.0.2 password 7 <encrypted-md5-secret>",
      },
      {
        context: "eBGP multihop إلى نظير عبر loopback",
        code: "Router(config-router)# neighbor 203.0.113.2 remote-as 64500\nRouter(config-router)# neighbor 203.0.113.2 update-source Loopback0\nRouter(config-router)# neighbor 203.0.113.2 ebgp-multihop 3",
      },
    ],
    verificationCommands: ["show bgp summary", "show bgp neighbors <ip>"],
    references: [
      {
        label: "Cisco IOS IP Routing: BGP Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_bgp/configuration/17-12/irg-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-bgp", "cmd-bgp-network", "cmd-show-bgp-summary"],
    tags: ["routing", "bgp", "encor"],
  },
  {
    id: "cmd-bgp-network",
    name: "network (BGP)",
    syntax: "network <ip> mask <subnet-mask> [route-map <name>]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Router Configuration", "Sub-mode"],
    promptShape: "Router(config-router-af)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "BGP",
    category: "Routing",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "يُنشئ prefix في BGP. الشبكة AND القناع يجب أن يطابقا مسارًا موجودًا في RIB (بما في ذلك طول القناع). اختياريًا يُرشّح/يُعدّل بـ route-map.",
    description:
      "BGP network statements تُنشئ prefixes في BGP، لكن فقط إذا وُجد مسار مطابق تمامًا (شبكة + قناع) في RIB. على عكس network statement في OSPF (التي تطابق الواجهات)، BGP network statement يطابق المسارات. الكلمة mask مطلوبة حتى للشبكات الصنفية. الـ route-map الاختياري يمكنه ضبط سمات (MED، AS-path prepend، communities) عند الإنشاء.",
    parameters: [
      {
        name: "<ip>",
        description: "عنوان شبكة الوجهة. يجب أن يطابق مسارًا موجودًا في RIB بدقة.",
        required: true,
      },
      {
        name: "mask <subnet-mask>",
        description: "قناع الشبكة الفرعية. مطلوب دائمًا، حتى للشبكات الصنفية.",
        required: true,
      },
      {
        name: "route-map <name>",
        description: "route-map اختيارية لضبط سمات BGP عند الإنشاء.",
        required: false,
      },
    ],
    examples: [
      {
        context: "إنشاء 198.51.100.0/24 في BGP",
        code: "Router(config-router)# address-family ipv4 unicast\nRouter(config-router-af)# network 198.51.100.0 mask 255.255.255.0",
      },
    ],
    verificationCommands: ["show bgp ipv4 unicast", "show ip route 198.51.100.0"],
    troubleshootingNotes: [
      "إذا لم يظهر network statement في جدول BGP، فالمسار المطابق تمامًا (شبكة+قناع) مفقود من RIB. تحقق بـ show ip route 198.51.100.0 255.255.255.0.",
    ],
    commonErrors: [
      "استخدام wildcard mask بدلًا من subnet mask — BGP network يستخدم subnet mask دائمًا.",
    ],
    undoMethod: "no network <ip> mask <mask>.",
    references: [
      {
        label: "Cisco IOS IP Routing: BGP Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_bgp/command/irg-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-bgp", "cmd-bgp-neighbor"],
    tags: ["routing", "bgp", "encor"],
  },
  {
    id: "cmd-show-bgp-summary",
    name: "show bgp summary",
    aliases: ["sh bgp sum"],
    syntax: "show bgp [{ipv4 | ipv6} {unicast | multicast}] summary",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "IOS 12.0+؛ جميع المنصات الأخرى",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "BGP",
    category: "Routing",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "عرض بجدول واحد لكل جيران BGP: الحالة، prefixes المستقبَلة/المرسلة، uptime، وAS. أكثر أمر BGP تحقق فائدة.",
    description:
      "show bgp summary يطبع ملخص سطر واحد لكل جار يعرض: IP الجار، AS، إحصاءات الرسائل، إصدار الجدول، الحالة الحالية (Idle/Active/OpenSent/OpenConfirm/Established)، ومدة تشغيل الجلسة. العمود الأخير ('State/PfxRcd') يعرض عدد prefixes المستقبَلة من ذلك الجار (رقم) أو حالة الجلسة (كلمة). أي قيمة غير رقمية في العمود الأخير تعني أن الجلسة غير مُؤسَّسة. الأمر أيضًا يعرض router-id المحلي وAS المحلي وإجمالي إدخالات جدول BGP.",
    examples: [
      {
        context: "فحص سريع للحالة",
        code: "Router# show bgp ipv4 unicast summary",
        output:
          "BGP router identifier 10.0.0.1, local AS number 65001\nNeighbor        V           AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd\n203.0.113.1     4        64500    1247    1243       42    0    0 2w3d     18\n10.0.0.2        4        65001     853     851       42    0    0 4w0d     5",
        outputExplanation:
          "الجار 203.0.113.1 (eBGP، AS 64500) مُؤسَّس منذ أسبوعين و3 أيام، يستقبل 18 prefix. الجار 10.0.0.2 (iBGP، AS 65001) مُؤسَّس منذ 4 أسابيع، يستقبل 5 prefixes. كلتا الجلستين سليمتان (Established).",
      },
    ],
    verificationCommands: ["show bgp ipv4 unicast", "show bgp neighbors"],
    troubleshootingNotes: [
      "جار في Idle: جلسة TCP لم تُحاول حتى — عادةً المسار إلى النظير مفقود أو ACL يمنع المنفذ 179.",
      "جار في Active: SYN أُرسل لكن لا SYN-ACK — افحص إعداد النظير البعيد وACLs.",
      "Established مع 0 prefixes: الجار فوق لكن لا مسارات متبادلة — افحص route-maps، prefix-lists، التفعيل في address-family.",
    ],
    commonErrors: [
      "تفسير 'Active' على أنها جلسة عاملة — Active تعني يحاول TCP، لا جلسة مُؤسَّسة. Established فقط هو الناجح.",
    ],
    references: [
      {
        label: "Cisco IOS IP Routing: BGP Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_bgp/command/irg-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-bgp", "cmd-bgp-neighbor"],
    tags: ["routing", "bgp", "verification", "encor"],
  },

  // =================================================================
  // ACL — CCNA
  // =================================================================
  {
    id: "cmd-access-list-extended",
    name: "access-list (extended)",
    syntax: "access-list <100-199> {permit | deny} <protocol> <source> <source-wildcard> <destination> <destination-wildcard> [<port-operator> <port>] [log | log-input]",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Access Control",
    category: "Security",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُعرّف ACL رقمي موسّع (100-199). الممارسة الحديثة تفضّل ACLs المسمّاة (ip access-list extended <name>) للقراءة والقابلية للتحرير.",
    description:
      "ACLs الموسّعة (المرقّمة 100-199 أو 2000-2699، أو المسمّاة) تطابق على البروتوكول، IP/منفذ المصدر، IP/منفذ الوجهة، وعلمات TCP الاختيارية. تُقيَّم من الأعلى للأسفل مع deny ضمني في النهاية. ACLs الموسّعة يجب أن تُوضع قريبًا من المصدر قدر الإمكان (لأنها تطابق الوجهة، الفلترة المبكرة توفر النطاق الترددي). ACLs المسمّاة مفضّلة لأنها قابلة للتحرير سطرًا بسطر بأرقام تسلسلية.",
    parameters: [
      {
        name: "<100-199>",
        description: "رقم ACL الموسّع. النطاق 100-199 (أو 2000-2699 الموسّع).",
        required: true,
      },
      {
        name: "permit | deny",
        description: "السماح أو الرفض.",
        required: true,
        allowedValues: ["permit", "deny"],
      },
      {
        name: "<protocol>",
        description: "البروتوكول: ip، tcp، udp، icmp، إلخ.",
        required: true,
      },
    ],
    examples: [
      {
        context: "السماح بـ SSH من شبكة الإدارة فقط، رفض بقية SSH",
        code: 'ip access-list extended ACL-SSH-IN\n  permit tcp 10.10.99.0 0.0.0.255 any eq 22\n  deny   tcp any any eq 22 log\n  permit ip any any',
      },
    ],
    verificationCommands: ["show access-lists", "show ip access-lists"],
    troubleshootingNotes: [
      "عدّادات ضغط ACL تُحسب بـ show access-lists <name> — إذا كان permit بـ 0 ضغطات، القاعدة خاطئة أو الحركة لا تصل للواجهة.",
      "deny ضمني في نهاية كل ACL — إذا كانت كل permits خاطئة، كل الحركة محجوبة.",
    ],
    commonErrors: [
      "نسيان permit ip any any في النهاية فيُحجب كل شيء غير محدد صراحةً.",
      "تطبيق ACL بالاتجاه الخاطئ (in بدلًا من out).",
    ],
    undoMethod: "no access-list <number> أو no ip access-list extended <name>.",
    references: [
      {
        label: "Cisco IOS Security Command Reference — IP ACL",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/sec_data_acl/command/sec-data-acl-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-access-group", "cmd-ip-access-list-extended"],
    tags: ["security", "acl", "ccna"],
  },
  {
    id: "cmd-ip-access-list-extended",
    name: "ip access-list extended",
    syntax: "ip access-list extended <name>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(config-ext-nacl)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Access Control",
    category: "Security",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "ينشئ ACL موسّع مسمّى ويدخل وضع ACL Configuration حيث يمكن إضافة أسطر permit/d individuel بأرقام تسلسلية للتحرير السهل.",
    description:
      "ACLs المسمّاة هي الشكل الحديث المفضّل. تدعم أرقامًا تسلسلية (10، 20، 30 افتراضيًا) بحيث يمكن إدراج أو حذف الأسطر الفردية دون إعادة كتابة الـ ACL كاملًا. السطر 10 permit tcp 10.10.99.0 0.0.0.255 any eq 22 يمكن حذفه بـ no 10 وإدراج سطر جديد بين 10 و20 بـ 15 permit tcp 10.10.98.0 0.0.0.255 any eq 22. ACLs المسمّاة أيضًا أوضح في running-config.",
    parameters: [
      {
        name: "<name>",
        description: "اسم ACL موسّع (string، عادةً بـ ACL- كبادئة).",
        required: true,
      },
    ],
    examples: [
      {
        context: "ACL مسمّى بأرقام تسلسلية صريحة",
        code: 'ip access-list extended ACL-MGMT-SSH\n  10 permit tcp 10.10.99.0 0.0.0.255 any eq 22\n  20 permit tcp 10.10.98.0 0.0.0.255 any eq 22\n  30 deny   tcp any any eq 22 log\n  40 permit ip any any',
      },
    ],
    verificationCommands: ["show ip access-lists ACL-MGMT-SSH"],
    commonErrors: [
      "إدراج سطر جديد بدون رقم تسلسلي فيُوضع في النهاية بعد deny النهائي — لن يُطبَّق أبدًا.",
    ],
    undoMethod: "no ip access-list extended <name>.",
    references: [
      {
        label: "Cisco IOS Security Command Reference — IP ACL",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/sec_data_acl/command/sec-data-acl-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-access-list-extended", "cmd-ip-access-group"],
    tags: ["security", "acl", "ccna"],
  },
  {
    id: "cmd-ip-access-group",
    name: "ip access-group",
    syntax: "ip access-group <acl-name-or-number> {in | out}",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration"],
    promptShape: "Router(config-if)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Access Control",
    category: "Security",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يطبّق ACL على واجهة لترشيح حركة الدخول أو الخروج. ACL واحد لكل اتجاه لكل واجهة.",
    description:
      "الأمر ip access-group يطبّق ACL لترشيح الحركة على واجهة. الاتجاه in يرشّح الحركة الواردة للواجهة (قبل التوجيه)؛ out يرشّح الحركة المغادرة من الواجهة (بعد التوجيه). ACLs القياسية (1-99) يجب أن تُستخدم فقط في اتجاه الخروج (تطابق المصدر فقط، فالتطبيق الداخلي يهدر النطاق). ACLs الموسّعة (100-199 أو مسمّاة) يمكن استخدامها في كلا الاتجاهين.",
    parameters: [
      {
        name: "<acl-name-or-number>",
        description: "اسم أو رقم ACL مُعرَّف مسبقًا.",
        required: true,
      },
      {
        name: "in | out",
        description: "الاتجاه. in = قبل التوجيه، out = بعد التوجيه.",
        required: true,
        allowedValues: ["in", "out"],
      },
    ],
    examples: [
      {
        context: "تطبيق ACL إدارة SSH في اتجاه الدخول",
        code: "Router(config)# interface GigabitEthernet0/0/0\nRouter(config-if)# ip access-group ACL-MGMT-SSH in",
      },
    ],
    verificationCommands: ["show ip interface <iface>", "show access-lists"],
    commonErrors: [
      "تطبيق ACL على الواجهة الخطأ — الحركة يجب أن تمرّ عبر الواجهة لكي يُطبَّق ACL.",
    ],
    undoMethod: "no ip access-group <acl> {in | out}.",
    references: [
      {
        label: "Cisco IOS Security Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/sec_data_acl/command/sec-data-acl-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-access-list-extended", "cmd-ip-access-list-extended"],
    tags: ["security", "acl", "ccna"],
  },

  // =================================================================
  // NAT — CCNA
  // =================================================================
  {
    id: "cmd-ip-nat-inside-source",
    name: "ip nat inside source",
    syntax: "ip nat inside source {list <acl> interface <iface> overload | static <local-ip> <global-ip>}",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "NAT",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُعدّ PAT ديناميكي (overload) أو NAT ثابت 1:1. يتطلب واجهات موسومة بـ ip nat inside و ip nat outside.",
    description:
      "ip nat inside source list <acl> interface <iface> overload هو أكثر نشر NAT شيوعًا: يترجم عناوين inside local (المطابقة بـ ACL) إلى عنوان IP لواجهة outside المحددة، باستخدام port-address translation (overload) لمضاعفة عدة مضيفين داخلين على عنوان outside واحد. NAT الثابت (ip nat inside source static 10.10.10.10 203.0.113.10) يُستخدم لكشف مضيف inside واحد على IP عام ثابت. بعد الإعداد، يجب وسم الواجهات بـ ip nat inside (عادةً SVIs للـ LAN) و ip nat outside (واجهة WAN).",
    parameters: [
      {
        name: "list <acl>",
        description: "ACL تحدد عناوين inside local المراد ترجمتها.",
        required: true,
      },
      {
        name: "interface <iface>",
        description: "الواجهة التي يُؤخذ منها عنوان outside global.",
        required: true,
      },
      {
        name: "overload",
        description: "يفعّل PAT (Port Address Translation) لمضاعفة عدة inside على outside واحد.",
        required: false,
      },
    ],
    examples: [
      {
        context: "PAT overload لـ 10.10.0.0/16 إلى IP واجهة WAN",
        code: "Router(config)# ip access-list extended ACL-NAT-INSIDE\nRouter(config-acl)# permit ip 10.10.0.0 0.0.255.255 any\nRouter(config)# ip nat inside source list ACL-NAT-INSIDE interface GigabitEthernet0/0/0 overload\nRouter(config)# interface vlan 10\nRouter(config-if)# ip nat inside\nRouter(config)# interface GigabitEthernet0/0/0\nRouter(config-if)# ip nat outside",
      },
    ],
    verificationCommands: ["show ip nat translations", "show ip nat statistics", "clear ip nat translation *"],
    troubleshootingNotes: [
      "ترجمات NAT تبقى في الجدول لمدة التدفق (افتراضيًا 24 ساعة لـ TCP). للإزالة القسرية استخدم clear ip nat translation *.",
      "إذا لم يصل المضيفون إلى الإنترنت، تحقق من وسم inside/outside — show ip nat statistics يعرض أي الواجهات موسومة.",
    ],
    commonErrors: [
      "نسيان وسم ip nat inside/outside على الواجهات — NAT لن يعمل.",
      "نسيان overload في PAT — فقط أول مضيف يُترجم، البقية تفشل.",
    ],
    undoMethod: "no ip nat inside source list <acl> interface <iface> overload.",
    references: [
      {
        label: "Cisco IOS IP Addressing: NAT Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipaddr_nat/configuration/17-12/nat-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-nat-inside", "cmd-ip-nat-outside"],
    tags: ["nat", "services", "ccna"],
  },
  {
    id: "cmd-ip-nat-inside",
    name: "ip nat inside",
    syntax: "ip nat inside",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration"],
    promptShape: "Router(config-if)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "NAT",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يوسم واجهة كـ inside (مواجهة للشبكة المحلية). NAT يترجم الحركة الداخلة من هذه الواجهة والخارجة من واجهة outside.",
    description:
      "ip nat inside يوسم الواجهة كنهاية الشبكة الداخلية (inside). عادةً تُطبّق على SVIs أو واجهات LAN الموجهة للمضيفين الداخليين. الحركة الداخلة من واجهة inside والخارجة من واجهة outside تُترجم وفقًا لإعدادات ip nat inside source. يجب أن يكون لدى الجهاز على الأقل واجهة inside وواحة outside لكي يعمل NAT.",
    examples: [
      {
        context: "وسم SVI للـ LAN كـ inside",
        code: "Router(config)# interface vlan 10\nRouter(config-if)# ip nat inside",
      },
    ],
    verificationCommands: ["show ip nat statistics"],
    undoMethod: "no ip nat inside.",
    references: [
      {
        label: "Cisco IOS IP Addressing: NAT Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipaddr_nat/configuration/17-12/nat-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-nat-inside-source", "cmd-ip-nat-outside"],
    tags: ["nat", "services", "ccna"],
  },
  {
    id: "cmd-ip-nat-outside",
    name: "ip nat outside",
    syntax: "ip nat outside",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration"],
    promptShape: "Router(config-if)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "NAT",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يوسم واجهة كـ outside (مواجهة للإنترنت أو WAN). NAT يترجم الحركة الخارجة من هذه الواجهة والقادمة من واجهة inside.",
    description:
      "ip nat outside يوسم الواجهة كنهاية الشبكة الخارجية (outside). عادةً تُطبّق على واجهة WAN الموجهة لـ ISP أو الإنترنت. يجب أن يكون لدى الجهاز على الأقل واجهة inside وواحة outside لكي يعمل NAT.",
    examples: [
      {
        context: "وسم واجهة WAN كـ outside",
        code: "Router(config)# interface GigabitEthernet0/0/0\nRouter(config-if)# ip nat outside",
      },
    ],
    verificationCommands: ["show ip nat statistics"],
    undoMethod: "no ip nat outside.",
    references: [
      {
        label: "Cisco IOS IP Addressing: NAT Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipaddr_nat/configuration/17-12/nat-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-nat-inside-source", "cmd-ip-nat-inside"],
    tags: ["nat", "services", "ccna"],
  },

  // =================================================================
  // DHCP — CCNA
  // =================================================================
  {
    id: "cmd-ip-dhcp-pool",
    name: "ip dhcp pool",
    syntax: "ip dhcp pool <name>",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(dhcp-config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "DHCP",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "ينشئ pool خادم DHCP ويدخل وضع DHCP Pool Configuration حيث تضبط الشبكة، البوابة الافتراضية، DNS، مدة lease، والعناوين المستثناة.",
    description:
      "الأمر ip dhcp pool <name> ينشئ pool DHCP محلي. داخل الوضع الفرعي: network <ip> <mask> يحدد الشبكة المُخدَمة، default-router <ip> يضبط option 3 (البوابة)، dns-server <ip> يضبط option 6، lease <days> <hours> <minutes> يضبط مدة lease (افتراضيًا يوم واحد). العناوين للاستثناء (الخادم نفسه، البوابات، الستاتيك) تُضبط عالميًا بـ ip dhcp excluded-address <ip> قبل إنشاء pool.",
    parameters: [
      {
        name: "<name>",
        description: "اسم pool DHCP (string وصفي).",
        required: true,
      },
    ],
    examples: [
      {
        context: "pool DHCP لشبكة مستخدمي VLAN 10",
        code: "Router(config)# ip dhcp excluded-address 10.10.10.1 10.10.10.10\nRouter(config)# ip dhcp pool VLAN10-USERS\nRouter(dhcp-config)# network 10.10.10.0 255.255.255.0\nRouter(dhcp-config)# default-router 10.10.10.1\nRouter(dhcp-config)# dns-server 10.10.99.10 8.8.8.8\nRouter(dhcp-config)# lease 0 8 0",
      },
    ],
    verificationCommands: ["show ip dhcp pool", "show ip dhcp binding", "show ip dhcp server statistics"],
    troubleshootingNotes: [
      "إذا لم يحصل العملاء على عناوين، افحص: (a) show ip dhcp binding يعرض لا روابط (pool مستنفد؟)، (b) DHCPDISCOVER يصل الخادم (استخدم debug ip dhcp server packet)، (c) لـ DHCP المُرحَّل، relay agent (ip helper-address) مُعد على SVI.",
    ],
    commonErrors: [
      "نسيان ip dhcp excluded-address لعنوان البوابة — قد يُعطي الخادم العنوان لعميل فيتعارض مع البوابة.",
    ],
    undoMethod: "no ip dhcp pool <name>.",
    references: [
      {
        label: "Cisco IOS IP Addressing: DHCP Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipaddr_dhcp/configuration/17-12/dhcp-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-helper-address", "cmd-ip-dhcp-excluded-address"],
    tags: ["dhcp", "services", "ccna"],
  },
  {
    id: "cmd-ip-dhcp-excluded-address",
    name: "ip dhcp excluded-address",
    syntax: "ip dhcp excluded-address <low-ip> [<high-ip>]",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "DHCP",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يستثني عنوانًا أو مدى عناوين من pool DHCP. يُستخدم لحجز البوابات والخوادم الستاتيكية وأجهزة الشبكة.",
    description:
      "ip dhcp excluded-address يمنع خادم DHCP من تخصيص عناوين محددة. النطاق الاختياري يُستثني كل العناوين بين low و high. تُضبط عالميًا (ليس داخل pool). من الممارسات الفضلى استثناء أول 10-20 عنوانًا من كل شبكة للبوابات والمعدات الستاتيكية.",
    parameters: [
      {
        name: "<low-ip>",
        description: "أول عنوان IP للاستثناء.",
        required: true,
      },
      {
        name: "<high-ip>",
        description: "آخر عنوان IP للاستثناء (للاستثناء مدى).",
        required: false,
      },
    ],
    examples: [
      {
        context: "استثناء أول 10 عناوين للبوابات والمعدات",
        code: "Router(config)# ip dhcp excluded-address 10.10.10.1 10.10.10.10",
      },
    ],
    verificationCommands: ["show ip dhcp pool", "show running-config | include excluded"],
    undoMethod: "no ip dhcp excluded-address <low-ip> [<high-ip>].",
    references: [
      {
        label: "Cisco IOS IP Addressing: DHCP Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipaddr_dhcp/configuration/17-12/dhcp-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-dhcp-pool"],
    tags: ["dhcp", "services", "ccna"],
  },
  {
    id: "cmd-ip-helper-address",
    name: "ip helper-address",
    syntax: "ip helper-address <dhcp-server-ip>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration"],
    promptShape: "Router(config-if)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "DHCP",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُعدّ الواجهة لإعادة توجيه بث UDP (بما فيه DHCP DISCOVER) إلى خادم محدد كـ unicast. مطلوب لتصاميم خادم DHCP المركزي.",
    description:
      "عندما يرسل مضيف على شبكة فرعية DHCPDISCOVER (broadcast)، لا يغادر الشبكة المحلية دون relay agent. الأمر ip helper-address <server-ip> على SVI/الواجهة الموجّهة يحوّل البث إلى unicast ويُعيد توجيهه إلى خادم DHCP المحدد. افتراضيًا يُعيد توجيه بث UDP آخر (TFTP، DNS، Time، NetBIOS، إلخ) — استخدم no ip forward-protocol udp <port> لتعطيل بروتوكولات محددة.",
    parameters: [
      {
        name: "<dhcp-server-ip>",
        description: "عنوان IP لخادم DHCP المركزي.",
        required: true,
      },
    ],
    examples: [
      {
        context: "إعادة توجيه DHCP إلى خادم مركزي 10.10.99.20",
        code: "Router(config)# interface vlan 10\nRouter(config-if)# ip address 10.10.10.1 255.255.255.0\nRouter(config-if)# ip helper-address 10.10.99.20",
      },
    ],
    verificationCommands: ["show ip interface <iface>", "show ip forward-protocol"],
    commonErrors: [
      "نسيان ip helper-address على SVI البعيد — DHCPDISCOVER لا يصل الخادم المركزي.",
    ],
    undoMethod: "no ip helper-address <ip>.",
    references: [
      {
        label: "Cisco IOS IP Addressing: DHCP Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipaddr_dhcp/configuration/17-12/dhcp-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-dhcp-pool"],
    tags: ["dhcp", "services", "ccna", "relay"],
  },

  // =================================================================
  // CDP / LLDP — CCNA
  // =================================================================
  {
    id: "cmd-cdp-run",
    name: "cdp run",
    syntax: "cdp run",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Discovery",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُفعّل Cisco Discovery Protocol عالميًا. CDP يُعلن هوية الجهاز وقدراته إلى جيران Cisco المتصلين مباشرة كل 60 ثانية افتراضيًا.",
    description:
      "CDP (Cisco Discovery Protocol) هو بروتوكول Layer 2 خاص بـ Cisco يُعلن اسم الجهاز، IP، المنصة، القدرات، وإصدار IOS إلى أجهزة Cisco المتصلة مباشرة. المؤقتات الافتراضية: إعلان كل 60 ثانية، hold time 180 ثانية. يجب تعطيل CDP على منافذ access المواجهة للمستخدمين للأمان (no cdp enable لكل واجهة) والإبقاء عليه على روابط شبكة-إلى-شبكة للتشخيص.",
    examples: [
      {
        context: "تفعيل CDP عالميًا والتحقق من الجيران",
        code: "Router(config)# cdp run\nRouter# show cdp neighbors",
      },
    ],
    verificationCommands: ["show cdp neighbors", "show cdp neighbors detail", "show cdp interface"],
    warnings: [
      "CDP يُعلن إصدار برنامج الجهاز وعناوين IP كنص واضح. عطّله على منافذ access غير الموثوقة لمنع الاستطلاع: no cdp enable على كل واجهة مواجهة للمستخدم.",
    ],
    undoMethod: "no cdp run.",
    references: [
      {
        label: "Cisco IOS CDP Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/cdp/command/cdp-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-lldp-run", "cmd-show-cdp-neighbors"],
    tags: ["discovery", "cdp", "ccna"],
  },
  {
    id: "cmd-lldp-run",
    name: "lldp run",
    syntax: "lldp run",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "IOS 15.0+؛ IOS XE كافة؛ NX-OS كافة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Discovery",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُفعّل Link Layer Discovery Protocol (LLDP، IEEE 802.1AB) عالميًا. بديل محايد للبائع لـ CDP، إلزامي في البيئات متعددة البائعين.",
    description:
      "LLDP هو بروتوكول اكتشاف جيران معيار IEEE (802.1AB). على عكس CDP فهو محايد للبائع، فيعمل مع أجهزة غير Cisco. المؤقتات الافتراضية: إعلان كل 30 ثانية، hold time 120 ثانية. LLDP و CDP يمكن تشغيلهما معًا — show lldp neighbors و show cdp neighbors يعرضان قوائم الجيران المعنية. LLDP مطلوب في أي بيئة متعددة البائعين.",
    examples: [
      {
        context: "تفعيل LLDP وعرض الجيران",
        code: "Switch(config)# lldp run\nSwitch# show lldp neighbors",
      },
    ],
    verificationCommands: ["show lldp neighbors", "show lldp neighbors detail", "show lldp interface"],
    undoMethod: "no lldp run.",
    references: [
      {
        label: "Cisco IOS LLDP Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/cdp/command/cdp-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-cdp-run", "cmd-show-cdp-neighbors"],
    tags: ["discovery", "lldp", "ccna"],
  },
  {
    id: "cmd-show-cdp-neighbors",
    name: "show cdp neighbors",
    aliases: ["sh cdp nei"],
    syntax: "show cdp neighbors [<interface>] [detail]",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Discovery",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يسرد جيران Cisco المتصلين مباشرة بمعرّف الجهاز، الواجهة المحلية، hold time، القدرة، المنصة، ومنفذ الجار البعيد. الكلمة detail تُضيف IP وإصدار البرنامج.",
    description:
      "show cdp neighbors هو أمر اكتشاف طوبولوجيا Layer 2 القياسي. كل سطر يعرض: Device ID (hostname)، الواجهة المحلية المتصل عليها الجار، holdtime (180s افتراضيًا)، أكواد القدرة (R=router، S=switch، إلخ)، المنصة (مثل C9300-48P)، ومعرّف منفذ الجار البعيد. الكلمة detail تُضيف: عناوين IP، إصدار البرنامج، duplex، VTP domain، native VLAN — مفيد جدًا لتدقيق الأعمال وفحص الوثبة الأولى.",
    parameters: [
      {
        name: "<interface>",
        description: "ترشيح لواجهة محلية محددة.",
        required: false,
      },
      {
        name: "detail",
        description: "عرض تفصيلي يشمل IP وإصدار البرنامج.",
        required: false,
      },
    ],
    examples: [
      {
        context: "عرض تفصيلي لكل جيران CDP",
        code: "Switch# show cdp neighbors detail",
        output:
          "-------------------------\nDevice ID: Core-Switch-01\nEntry address(es): \n  IP address: 10.0.0.2\nPlatform: cisco C9500-48Y4C,  Capabilities: Router Switch IGMP\nInterface: HundredGigE1/0/1,  Port ID (outgoing port): HundredGigE1/0/2\nHoldtime : 168 sec\n\nVersion :\nCisco IOS XE Software, Version 17.06.04",
        outputExplanation:
          "الجار Core-Switch-01 على IP 10.0.0.2، منصة C9500-48Y4C، متصل على HundredGigE1/0/1 محليًا و HundredGigE1/0/2 عن بعد، hold time 168 ثانية، يشغّل IOS XE 17.06.04.",
      },
    ],
    verificationCommands: ["show cdp interface", "show lldp neighbors"],
    troubleshootingNotes: [
      "إذا عرض CDP جارًا لكن لا تستطيع ping الـ IP المُعلَن، افحص التوجيه أو ARP — CDP يثبت فقط اتصالية Layer 1-2، لا Layer 3.",
    ],
    references: [
      {
        label: "Cisco IOS CDP Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/cdp/command/cdp-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-cdp-run", "cmd-lldp-run"],
    tags: ["discovery", "verification", "ccna"],
  },

  // =================================================================
  // NTP / Syslog — CCNA
  // =================================================================
  {
    id: "cmd-ntp-server",
    name: "ntp server",
    syntax: "ntp server <ip-or-fqdn> [version <1-4>] [key <id>] [prefer] [source <interface>]",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Time & Logging",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُعدّ الجهاز لمزامنة ساعته مع خادم NTP. الكلمة prefer تضع الخادم المفضّل عند تعدد الخوادم.",
    description:
      "NTP (Network Time Protocol) يبقي ساعات الأجهزة دقيقة ضمن مللي ثانية. الوقت الدقيق حاسم لـ: ربط أحداث syslog عبر الأجهزة، التحقق من الشهادات، مصادقة Kerberos، والتحليل الجنائي. الأمر ntp server <ip> يضيف خادمًا. لمصادقة NTP مستخدمًا ntp authenticate، ntp authentication-key <id> md5 <secret>، ntp trusted-key <id>. الكلمة source <interface> تفرض IP المصدر لحزم NTP — عادةً loopback للاستقرار.",
    parameters: [
      {
        name: "<ip-or-fqdn>",
        description: "عنوان IP أو اسم المضيف لخادم NTP.",
        required: true,
      },
      {
        name: "version <1-4>",
        description: "إصدار NTP. استخدم 4 (الافتراضي والحديث).",
        required: false,
        defaultValue: "4",
      },
      {
        name: "key <id>",
        description: "معرّف مفتاح المصادقة (إن مُفعّلة).",
        required: false,
      },
      {
        name: "prefer",
        description: "يضع هذا الخادم كالمفضّل عند تعدد الخوادم.",
        required: false,
      },
      {
        name: "source <interface>",
        description: "واجهة المصدر لحزم NTP.",
        required: false,
      },
    ],
    examples: [
      {
        context: "إعداد NTP بمصادقة ومصدر loopback",
        code: "Router(config)# ntp authenticate\nRouter(config)# ntp authentication-key 1 md5 <secret>\nRouter(config)# ntp trusted-key 1\nRouter(config)# ntp server 10.10.99.20 key 1 prefer source Loopback0",
      },
    ],
    verificationCommands: ["show ntp status", "show ntp associations", "show ntp associations detail"],
    troubleshootingNotes: [
      "إذا عرض show ntp status 'Clock is unsynchronised'، افحص show ntp associations detail — قيمة 'reach' للخادم يجب أن تنمو (1، 3، 7، 17، 37، 77، 177، 377) عبر استطلاعات متتالية. reach بقيمة 0 تعني الخادم غير قابل للوصول.",
    ],
    commonErrors: [
      "نسيان source interface — NTP يستخدم IP الواجهة الخارجة افتراضيًا، وقد يتغير مع تغيير التوجيه.",
    ],
    undoMethod: "no ntp server <ip>.",
    references: [
      {
        label: "Cisco IOS NTP Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/bsm/command/bsm-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-clock-timezone", "cmd-logging-host"],
    tags: ["ntp", "services", "ccna"],
  },
  {
    id: "cmd-logging-host",
    name: "logging host",
    syntax: "logging host <ip> [transport {udp | tcp}] [port <port>] [severity <level>]",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Time & Logging",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُعدّ الجهاز لإرسال رسائل syslog إلى خادم بعيد. اقرن بـ logging trap <level> للتحكم في عتبة الخطورة.",
    description:
      "syslog هو المعيار للتسجيل المركزي على أجهزة Cisco. الأمر logging host <ip> يضيف وجهة syslog بعيدة (افتراضيًا UDP port 514). عتبة الخطورة للرسائل المُمرَّرة تُضبط بـ logging trap <level> (0=emergencies إلى 7=debugging، افتراضيًا 6=informational). خطورة التسجيل المحلي للـ buffer تُضبط بـ logging buffered <level>. ممارسة فضلى: أرسل إلى SIEM (Splunk، ELK، QRadar) واحتفظ 90 يومًا على الأقل.",
    parameters: [
      {
        name: "<ip>",
        description: "عنوان IP لخادم syslog.",
        required: true,
      },
      {
        name: "transport {udp | tcp}",
        description: "بروتوكول النقل. افتراضيًا UDP.",
        required: false,
        defaultValue: "udp",
      },
      {
        name: "port <port>",
        description: "منفذ الوجهة. افتراضيًا 514.",
        required: false,
        defaultValue: "514",
      },
      {
        name: "severity <level>",
        description: "عتبة الخطورة (0-7).",
        required: false,
        defaultValue: "6 (informational)",
      },
    ],
    examples: [
      {
        context: "إرسال سجلات خطورة informational إلى SIEM",
        code: "Router(config)# logging host 10.10.99.30\nRouter(config)# logging trap informational\nRouter(config)# logging source-interface Loopback0\nRouter(config)# logging facility local6",
      },
    ],
    verificationCommands: ["show logging", "show logging history"],
    commonErrors: [
      "نسيان logging trap informational — افتراضيًا informational لكن إن ضبطت أخفض (مثل emergencies) لن تصل رسائل التحذير.",
    ],
    undoMethod: "no logging host <ip>.",
    references: [
      {
        label: "Cisco IOS Logging Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/bsm/command/bsm-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ntp-server", "cmd-service-timestamps-log"],
    tags: ["syslog", "logging", "services", "ccna"],
  },
  {
    id: "cmd-clock-timezone",
    name: "clock timezone",
    syntax: "clock timezone <zone-name> <hours-offset> [<minutes-offset>]",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Time & Logging",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يضبط المنطقة الزمنية للجهاز. يُستخدم بالتزامن مع NTP لعرض الطوابع الزمنية بالتوقيت المحلي في syslog.",
    description:
      "clock timezone يضبط اسم المنطقة الزمنية وإزاحتها عن UTC. مثالًا: clock timezone EET 2 لتوقيت شرق أوروبا (+2 UTC). بعد ضبط NTP بمصدر UTC، تُعرض الطوابع الزمنية في syslog و show بالتوقيت المحلي. على IOS XE الحديث يُفضّل clock timezone EET 2 0 لصراحة الدقائق.",
    parameters: [
      {
        name: "<zone-name>",
        description: "اسم المنطقة الزمنية (مثل EET، UTC، PST).",
        required: true,
      },
      {
        name: "<hours-offset>",
        description: "إزاحة الساعات عن UTC (-23 إلى +23).",
        required: true,
      },
      {
        name: "<minutes-offset>",
        description: "إزاحة الدقائق الإضافية.",
        required: false,
        defaultValue: "0",
      },
    ],
    examples: [
      {
        context: "ضبط توقيت شرق أوروبا (+2 UTC)",
        code: "Router(config)# clock timezone EET 2",
      },
    ],
    verificationCommands: ["show clock detail"],
    undoMethod: "no clock timezone.",
    references: [
      {
        label: "Cisco IOS Clock Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/bsm/command/bsm-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ntp-server"],
    tags: ["time", "services", "ccna"],
  },

  // =================================================================
  // HSRP / FHRP — CCNA
  // =================================================================
  {
    id: "cmd-standby-ip",
    name: "standby ip",
    syntax: "standby <group> ip <virtual-ip>\nstandby <group> priority <0-255>\nstandby <group> preempt\nstandby <group> authentication md5 key-string <secret>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration"],
    promptShape: "Router(config-if)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "First Hop Redundancy",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُعدّ HSRP (Hot Standby Router Protocol) على واجهة، يوفر IP افتراضيًا يتنقّل بين الموجّهات لتكرار البوابة الافتراضية.",
    description:
      "HSRP (خاص بـ Cisco، RFC 2281 معلوماتي) يوفر تكرار بوابة الوثبة الأولى: موجّهان أو أكثر يتشاركان IP/MAC افتراضيًا، مع موجّه active يُوجّه الحركة وآخر standby احتياطي. إذا فشل active، يتولى standby (افتراضيًا hold time 10 ثوانٍ). الأمر standby <group> ip <virtual-ip> يعيّن IP الافتراضي المشترك بين كل الموجّهات في المجموعة. الكلمة priority (افتراضيًا 100) تحدد انتخاب active (الأعلى يفوز). الكلمة preempt تسمح لموجّه ذي أولوية أعلى باستعادة active بعد الاسترداد. VRRP (RFC 5798، معياري) يستخدم vrrp <group> ip <virtual-ip> بدلًا منه. GLBP يوفر load-balancing عبر عدة بوابات.",
    parameters: [
      {
        name: "<group>",
        description: "رقم مجموعة HSRP (0-255 لـ v1، 0-4095 لـ v2).",
        required: true,
      },
      {
        name: "<virtual-ip>",
        description: "IP الافتراضي المشترك بين كل الموجّهات في المجموعة.",
        required: true,
      },
      {
        name: "priority <0-255>",
        description: "الأولوية لانتخاب active. الأعلى يفوز. افتراضيًا 100.",
        required: false,
        defaultValue: "100",
      },
      {
        name: "preempt",
        description: "يسمح لموجّه ذي أولوية أعلى باستعادة active بعد الاسترداد.",
        required: false,
      },
    ],
    examples: [
      {
        context: "HSRP لموجّهين كبوابة افتراضية لـ VLAN 10",
        code: "Router(config)# interface vlan 10\nRouter(config-if)# ip address 10.10.10.2 255.255.255.0\nRouter(config-if)# standby 10 ip 10.10.10.1\nRouter(config-if)# standby 10 priority 110\nRouter(config-if)# standby 10 preempt\nRouter(config-if)# standby 10 authentication md5 key-string 7 <secret>",
      },
    ],
    verificationCommands: ["show standby brief", "show standby", "show standby internal"],
    troubleshootingNotes: [
      "إذا عرض show standby كلا الموجّهين في حالة 'Active'، فهما لا يريان hellos HSRP الخاص ببعضهما — افحص الاتصالية، ACLs التي تمنع UDP 1985، أو اختلاف إصدار HSRP.",
      "HSRP flapping (تغييرات active/standby متكررة) سببها عادةً توجيه غير متماثل أو CPU عالٍ. افحص عدّادات الواجهة و CPU بـ show processes cpu.",
    ],
    commonErrors: [
      "نسيان preempt — الموجّه ذو الأولوية الأعلى لا يستعيد active بعد الاسترداد.",
      "اختلاف IP الافتراضي بين الموجّهين في نفس المجموعة — لا يتشكل HSRP.",
    ],
    undoMethod: "no standby <group> ip <virtual-ip>.",
    references: [
      {
        label: "Cisco IOS HSRP Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipapp/command/ipap-i1/ipap-i1-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-track"],
    tags: ["fhrp", "hsrp", "redundancy", "ccna"],
  },

  // =================================================================
  // Port Security — CCNA
  // =================================================================
  {
    id: "cmd-switchport-port-security",
    name: "switchport port-security",
    syntax: "switchport port-security\nswitchport port-security maximum <count>\nswitchport port-security mac-address {sticky | <mac>}\nswitchport port-security violation {protect | restrict | shutdown}",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration"],
    promptShape: "Router(config-if)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Switch Security",
    category: "Security",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُفعّل port security على منفذ access، يحدّ عدد عناوين MAC ويعرّف إجراء الانتهاك. تحكم أمان Layer 2 حاسم.",
    description:
      "port security يحدّ عناوين MAC المسموح بها على منفذ access: maximum <count> يضبط الحد (افتراضيًا 1)، mac-address sticky يتعلم ديناميكيًا ويخزّن أول MAC في running-config (يبقى بعد إعادة الإقلاع إن حفظت)، mac-address <mac> يعرّف MAC ثابت مسموح. إجراء الانتهاك عند تجاوز الحد: protect يُسقط الإطارات الزائدة بصمت، restrict يُسقط ويسجّل (syslog + SNMP trap)، shutdown (افتراضيًا) يُعطّل المنفذ بالخطأ. اقرن بـ errdisable recovery cause psecure-violation للاسترداد التلقائي.",
    parameters: [
      {
        name: "maximum <count>",
        description: "أقصى عدد عناوين MAC المسموح بها. افتراضيًا 1.",
        required: false,
        defaultValue: "1",
      },
      {
        name: "mac-address sticky | <mac>",
        description: "sticky للتعلم الديناميكي، أو عنوان MAC ثابت.",
        required: false,
      },
      {
        name: "violation {protect | restrict | shutdown}",
        description: "إجراء الانتهاك. shutdown (افتراضيًا) يُعطّل المنفذ.",
        required: false,
        defaultValue: "shutdown",
        allowedValues: ["protect", "restrict", "shutdown"],
      },
    ],
    examples: [
      {
        context: "port security sticky مع shutdown عند الانتهاك",
        code: "Switch(config-if)# switchport mode access\nSwitch(config-if)# switchport port-security\nSwitch(config-if)# switchport port-security maximum 2\nSwitch(config-if)# switchport port-security mac-address sticky\nSwitch(config-if)# switchport port-security violation shutdown",
      },
    ],
    verificationCommands: ["show port-security", "show port-security interface <iface>", "show interfaces status err-disabled"],
    troubleshootingNotes: [
      "منفذ err-disabled: حدد السبب بـ show interfaces status err-disabled، أصلح الطوبولوجيا (أزل المحول غير المصرّح به)، ثم shutdown/no shutdown للاسترداد (أو اعتمد على errdisable recovery إن مُفعّل).",
    ],
    commonErrors: [
      "نسيان switchport mode access قبل switchport port-security — قد يفشل التفعيل على منفذ trunk.",
    ],
    undoMethod: "no switchport port-security + no switchport port-security maximum/mac-address/violation.",
    references: [
      {
        label: "Catalyst 9300 Port Security Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_9300l/port_security.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-spanning-tree-bpduguard"],
    tags: ["security", "switching", "port-security", "ccna"],
  },

  // =================================================================
  // IPv6 — CCNA
  // =================================================================
  {
    id: "cmd-ipv6-unicast-routing",
    name: "ipv6 unicast-routing",
    syntax: "ipv6 unicast-routing",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "IPv6",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُفعّل توجيه IPv6 unicast. مطلوب قبل أن يُوجّه الجهاز حزم IPv6 عابرة وقبل تشغيل أي بروتوكول توجيه IPv6.",
    description:
      "بدون ipv6 unicast-routing يكون للجهاز عناوين IPv6 على واجهاته لكنه لن يُوجّه حزم IPv6 عابرة — مشابه لـ ip routing لـ IPv4. بعد التفعيل، تظهر المسارات المتصلة بـ IPv6 في جدول التوجيه (show ipv6 route) ويمكن إعداد بروتوكولات توجيه IPv6 (OSPFv3، EIGRP لـ IPv6، BGP IPv6 AF، RIPng، IS-IS لـ IPv6).",
    examples: [
      {
        context: "تفعيل توجيه IPv6 وإسناد عنوان للواجهة",
        code: "Router(config)# ipv6 unicast-routing\nRouter(config)# interface GigabitEthernet0/0/0\nRouter(config-if)# ipv6 enable\nRouter(config-if)# ipv6 address 2001:db8::1/64",
      },
    ],
    verificationCommands: ["show ipv6 route", "show ipv6 interface", "show ipv6 protocols"],
    references: [
      {
        label: "Cisco IOS IPv6 Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipv6/configuration/17-12/ipv6-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ipv6-address", "cmd-show-ipv6-route"],
    tags: ["ipv6", "routing", "ccna"],
  },
  {
    id: "cmd-ipv6-address",
    name: "ipv6 address",
    syntax: "ipv6 address <ipv6-prefix>/<prefix-length> [eui-64]\nipv6 address <ipv6-prefix>/<prefix-length> [anycast]\nipv6 address {autoconfig | dhcp}",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration"],
    promptShape: "Router(config-if)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "IPv6",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُسنِد عنوان IPv6 للواجهة. يدعم: يدوي، EUI-64 (جزء المضيف مشتق من MAC)، SLAAC autoconfig، و DHCPv6.",
    description:
      "الأمر ipv6 address <prefix>/<len> يُسنِد عنوان IPv6 ثابت. الكلمة eui-64 تشتق الـ 64 بت السفلى من عنوان MAC للواجهة باستخدام إجراء EUI-64 (إدراج FFEE في الوسط وقلب بت U/L). هذا يسمح بإسناد نفس الـ prefix عبر موجّهات عديدة بمضيفين فريدين تلقائيًا. ipv6 address autoconfig يحصل على عنوان عبر SLAAC (إعداد تلقائي بلا حالة من RA). ipv6 address dhcp يحصل عبر DHCPv6. ipv6 enable وحده (بدون ipv6 address) ينشئ عنوان link-local وكافٍ لـ neighbor discovery.",
    parameters: [
      {
        name: "<ipv6-prefix>/<prefix-length>",
        description: "البادئة IPv6 والطول. مثال: 2001:db8:10::/64.",
        required: true,
      },
      {
        name: "eui-64",
        description: "يشتق جزء المضيف من MAC عبر إجراء EUI-64.",
        required: false,
      },
      {
        name: "autoconfig | dhcp",
        description: "SLAAC (autoconfig) أو DHCPv6 للحصول على عنوان.",
        required: false,
      },
    ],
    examples: [
      {
        context: "عنوان يدوي بجزء مضيف EUI-64",
        code: "Router(config-if)# ipv6 address 2001:db8:10::/64 eui-64",
      },
      {
        context: "link-local فقط مع autoconfig",
        code: "Router(config-if)# ipv6 enable\nRouter(config-if)# ipv6 address autoconfig",
      },
    ],
    verificationCommands: ["show ipv6 interface <iface>", "show ipv6 interface brief"],
    references: [
      {
        label: "Cisco IOS IPv6 Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipv6/configuration/17-12/ipv6-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ipv6-unicast-routing", "cmd-show-ipv6-route"],
    tags: ["ipv6", "interface", "ccna"],
  },
  {
    id: "cmd-show-ipv6-route",
    name: "show ipv6 route",
    aliases: ["sh ipv6 route"],
    syntax: "show ipv6 route [{connected | static | ospf | bgp | eigrp} | <network>/<prefix>]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "IPv6",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يعرض جدول توجيه IPv6. نفس بنية show ip route لكن لـ IPv6. الأكواد: C=connected، L=local، S=static، O=OSPFv3، B=BGP، D=EIGRP، R=RIPng.",
    description:
      "show ipv6 route (sh ipv6 route) هو المكافئ لـ IPv6 لـ show ip route. تنسيق المخرجات مطابق: كل سطر يعرض بادئة الوجهة، المسافة الإدارية/المتريك، البروتوكول المصدر، والـ next-hop. الكلمات الاختيارية تُرشّح المخرجات (حسب البروتوكول، بادئة واحدة). على IOS XR المكافئ show route ipv6.",
    examples: [
      {
        context: "عرض كل مسارات IPv6",
        code: "Router# show ipv6 route",
      },
      {
        context: "Longest-prefix match لـ 2001:db8:10::5",
        code: "Router# show ipv6 route 2001:db8:10::5",
      },
    ],
    verificationCommands: ["show ipv6 protocols", "show ipv6 cef"],
    references: [
      {
        label: "Cisco IOS IPv6 Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipv6/command/ipv6-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ipv6-unicast-routing", "cmd-show-ip-route"],
    tags: ["ipv6", "verification", "ccna"],
  },

  // =================================================================
  // Connectivity — ping / traceroute
  // =================================================================
  {
    id: "cmd-ping",
    name: "ping",
    syntax: "ping {<ip-or-fqdn> | ipv6 <ip-or-fqdn>} [source <iface-or-ip>] [repeat <n>] [size <bytes>] [timeout <sec>] [df-bit]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC", "User EXEC"],
    promptShape: "Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Connectivity Verification",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يرسل ICMP echo requests إلى وجهة ويعرض الردود. أكثر اختبار اتصالية Layer 3 أساسية. ping الموسّع (بدون وسائط) يقدم خيارات أكثر.",
    description:
      "ping يرسل حزم ICMP echo-request إلى وجهة وينتظر ICMP echo-reply. الصيغة الأساسية ping <ip> ترسل 5 حزم افتراضية الحجم (100 بايت). ping الموسّع (فقط ping ثم Enter) يطلب كل الخيارات: واجهة/IP المصدر (حاسم للتحقق من مسار العودة)، عدد التكرار (كبير لاختبارات الضغط)، الحجم، timeout، بت DF (لاكتشاف MTU)، والنمط. جرّب دائمًا ping بمصدر الواجهة المعنية (SVI/loopback) — الاتصالية من IP الأساسي قد تعمل بينما تفشل من SVI المواجه للمستخدم بسبب التوجيه غير المتماثل.",
    parameters: [
      {
        name: "<ip-or-fqdn>",
        description: "عنوان IP أو اسم المضيف للوجهة.",
        required: true,
      },
      {
        name: "source <iface-or-ip>",
        description: "واجهة أو IP المصدر. حاسم للتحقق من مسار العودة.",
        required: false,
      },
      {
        name: "repeat <n>",
        description: "عدد حزم ping. افتراضيًا 5.",
        required: false,
        defaultValue: "5",
      },
      {
        name: "size <bytes>",
        description: "حجم الحزمة بالبايت. افتراضيًا 100.",
        required: false,
        defaultValue: "100",
      },
      {
        name: "df-bit",
        description: "يضبط بت Don't Fragment في رأس IP — لاكتشاف MTU.",
        required: false,
      },
    ],
    examples: [
      {
        context: "ping قياسي",
        code: "Router# ping 10.0.0.2",
        output:
          "Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to 10.0.0.2, timeout is 2 seconds:\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms",
        outputExplanation:
          "5 حزم أُرسلت، 5 ردود استُقبلت (100% نجاح). الرمز ! يعني رد مستلم، . يعني timeout، U يعني unreachable، M يعني fragmentation needed. متوسط RTT 2 ms.",
      },
      {
        context: "ping موسّع بمصدر Loopback0، بت DF، حجم 1500",
        code: "Router# ping\nProtocol [ip]: \nTarget IP address: 10.0.0.2\nRepeat count [5]: 100\nDatagram size [100]: 1500\nTimeout in seconds [2]: \nExtended commands [n]: y\nSource address or interface: Loopback0\nSet DF bit in IP header? [no]: yes",
      },
    ],
    verificationCommands: ["traceroute", "show ip route"],
    troubleshootingNotes: [
      "ping بـ . (timeout) يدل على وصول لكن استجابة بطيئة — عادةً رابط مزدحم أو CPU عالٍ على الهدف.",
      "ping بـ U (unreachable) يعني موجّهًا على المسار أعاد ICMP unreachable — قد يكون ACL، مشكلة مسار، أو لا مستمع.",
      "ping بـ M (fragmentation needed but DF set) يدل على اختناق MTU — استخدم ping size 1500 df-bit لإيجاد MTU.",
    ],
    commonErrors: [
      "نسيان source interface في ping — يختبر من IP الواجهة الخارجة لا من SVI/loopback المعنية.",
    ],
    references: [
      {
        label: "Cisco IOS Master Command List",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/mcl/allmcl.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-traceroute", "cmd-show-ip-route"],
    tags: ["connectivity", "verification", "fundamentals"],
  },
  {
    id: "cmd-traceroute",
    name: "traceroute",
    syntax: "traceroute {<ip-or-fqdn> | ipv6 <ip-or-fqdn>} [source <iface-or-ip>] [numeric] [probe <n>] [ttl <min> <max>]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC", "User EXEC"],
    promptShape: "Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Connectivity Verification",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يكتشف مسار Layer 3 إلى وجهة بإرسال حزم بقيم TTL متزايدة ومراقبة ردود ICMP Time Exceeded. حاسم لتشخيص path-MTU وحلقات التوجيه.",
    description:
      "traceroute يستكشف المسار إلى وجهة بإرسال حزم بـ TTL=1 ثم TTL=2 إلخ. كل موجّه على المسار يعيد ICMP Time Exceeded، كاشفًا IP الخاص به. ثلاث probes تُرسل لكل TTL افتراضيًا. المخرجات تعرض المسار وثبة بثوبة مع RTT لكل probe. IOS يستخدم probes UDP افتراضيًا (منافذ عالية 33434+)؛ بعض الجدران النارية تمنعها. traceroute الموسّع (فقط traceroute ثم Enter) يسمح بتغيير البروتوكول، المصدر، probes، إلخ.",
    examples: [
      {
        context: "traceroute قياسي",
        code: "Router# traceroute 8.8.8.8",
        output:
          "Type escape sequence to abort.\nTracing the route to 8.8.8.8\n  1 10.0.0.2 1 msec 1 msec 1 msec\n  2 203.0.113.1 5 msec 5 msec 4 msec\n  3 72.14.215.85 12 msec *  13 msec",
        outputExplanation:
          "المسار إلى 8.8.8.8: الوثبة 1 هي 10.0.0.2 (1 ms)، الوثبة 2 هي 203.0.113.1 (5 ms)، الوثبة 3 هي 72.14.215.85 (12 ms). الرمز * يعني عدم استجابة تلك الوثبة لتلك probe.",
      },
    ],
    verificationCommands: ["ping", "show ip route"],
    troubleshootingNotes: [
      "* * * في المخرجات يعني أن تلك الوثبة لم تستجب — قد يكون rate-limiting ICMP (شائع على موجّهات ISP)، ACL يمنع، أو توجيه غير متماثل.",
      "إذا توقف traceroute عند وثبة قبل الوجهة، المشكلة بين تلك الوثبة والوثبة التالية — ركّز التشخيص هناك.",
    ],
    references: [
      {
        label: "Cisco IOS Master Command List",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/mcl/allmcl.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ping", "cmd-show-ip-route"],
    tags: ["connectivity", "verification", "fundamentals"],
  },

  // =================================================================
  // Interface inspection
  // =================================================================
  {
    id: "cmd-show-interfaces",
    name: "show interfaces",
    aliases: ["sh int"],
    syntax: "show interfaces [<interface>] [accounting | counters | description | stats | summary | trunk]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Interface Inspection",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يعرض إحصاءات واجهة مفصلة: الحالة، السرعة/duplex، معدلات الدخول/الخروج، عدّادات الأخطاء، وآخر دخل/خرج. أمر تشخيص Layer 1/2 القياسي.",
    description:
      "show interfaces (sh int) هو أعمق فحص واجهة. لكل واجهة يعرض: الحالة الفيزيائية والمنطقية، MTU، BW/DLY/reliability/load، التغليف، نوع/timeout لـ ARP، آخر دخل/خرج/timeout، output hang، آخر مسح للعدّادات، إسقاطات قائمة الدخول، إسقاطات قائمة الخروج، معدلات 5 دقائق للدخول/الخروج، packets/bytes/octets، أخطاء CRC، runts، giants، throttles، أخطاء الدخول/الخروج، collisions. الكلمة counters تعرض فقط عدّادات الأخطاء؛ trunk معلومات الـ trunk؛ description فقط الوصف المُعدّ.",
    examples: [
      {
        context: "عرض تفصيلي لواجهة واحدة",
        code: "Router# show interfaces GigabitEthernet0/0/0",
        output:
          "GigabitEthernet0/0/0 is up, line protocol is up \n  Hardware is Gigabit Ethernet, address is 0011.2233.4455 (bia 0011.2233.4455)\n  Description: Uplink-to-Core\n  Internet address is 10.0.0.1/30\n  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec,\n     reliability 255/255, txload 1/255, rxload 1/255\n  5 minute input rate 0 bits/sec, 0 packets/sec\n  5 minute output rate 0 bits/sec, 0 packets/sec\n     12345 packets input, 1234567 bytes\n     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored\n     0 watchdog, 0 multicast, 0 pause input\n     12345 packets output, 1234567 bytes, 0 underruns\n     0 output errors, 0 collisions, 0 interface resets",
        outputExplanation:
          "الواجهة up/up (فيزيائي ومنطقي سليم)، عنوان MAC 0011.2233.4455، IP 10.0.0.1/30، MTU 1500، BW 1 Gbps، 0 أخطاء دخل و0 أخطاء خرج. كل المؤشرات سليمة.",
      },
    ],
    verificationCommands: ["show ip interface brief", "show interfaces description", "show interfaces counters errors"],
    troubleshootingNotes: [
      "أخطاء CRC على الدخول تدل على مشكلة طبقة فيزيائية: كابل سيئ، SFP، أو ضوضاء. نفّذ clear counters ثم أعد الفحص بعد ساعة.",
      "collisions على واجهة full-duplex تدل على اختلاف duplex — تحقق من الجانبين بـ show interfaces <iface>.",
      "إسقاطات دخول متنامية مع إسقاطات خرج صفرية تعني عادةً أن الواجهة تستقبل أسرع مما يعالج CPU — افحص show platform hardware fed لـ ASIC drops على Catalyst 9000.",
    ],
    references: [
      {
        label: "Cisco IOS Interface Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/interface/command/ir-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-ip-interface-brief", "cmd-show-interfaces-status"],
    tags: ["inspection", "interface", "troubleshooting", "fundamentals"],
  },
  {
    id: "cmd-show-ip-interface-brief",
    name: "show ip interface brief",
    aliases: ["sh ip int br"],
    syntax: "show ip interface brief",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC", "User EXEC"],
    promptShape: "Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Interface Inspection",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "ملخص سطر-لكل-واجهة: الاسم، IP، OK؟، الطريقة، الحالة، البروتوكول. أسرع طريقة لرؤية حالة الواجهات بنظرة.",
    description:
      "show ip interface brief (sh ip int br) أكثر أوامر فحص الواجهات استخدامًا. كل سطر يعرض: اسم الواجهة، عنوان IP (أو 'unassigned')، OK? (yes/no — IP مُسنَد صحيحًا)، الطريقة (manual/NVRAM/DHCP/إلخ)، الحالة (administratively down/down/up)، البروتوكول (down/up). الحالة 'administratively down' تعني shutdown مُعدّ؛ البروتوكول down على واجهة status-up يعني مشكلة Layer 1 (كابل، SFP، رابط). لـ IPv6 استخدم show ipv6 interface brief.",
    examples: [
      {
        context: "نظرة سريعة على الواجهات",
        code: "Router# show ip interface brief",
        output:
          "Interface                  IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0/0       10.0.0.1        YES NVRAM  up                    up\nGigabitEthernet0/0/1       unassigned      YES NVRAM  administratively down down\nGigabitEthernet0/0/2       10.0.0.5        YES NVRAM  up                    up\nLoopback0                  10.0.0.1        YES NVRAM  up                    up",
        outputExplanation:
          "الواجهة Gi0/0/0 up/up على IP 10.0.0.1. الواجهة Gi0/0/1 administratively down (shutdown مُعدّ). الواجهة Gi0/0/2 up/up على IP 10.0.0.5. Loopback0 up/up.",
      },
    ],
    verificationCommands: ["show interfaces description", "show interfaces status"],
    references: [
      {
        label: "Cisco IOS Interface Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/interface/command/ir-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-interfaces", "cmd-show-interfaces-status"],
    tags: ["inspection", "interface", "fundamentals"],
  },
  {
    id: "cmd-show-interfaces-status",
    name: "show interfaces status",
    aliases: ["sh int status"],
    syntax: "show interfaces status [{<interface> | err-disabled | module <num>} | trunk]",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC", "User EXEC"],
    promptShape: "Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Interface Inspection",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "ملخص محول بأسلوب سطر-لكل-منفذ: الاسم، connected/notconnect، السرعة، duplex، VLAN. الأفضل لفحص سريع لمنافذ Layer 2 على محولات Catalyst.",
    description:
      "على محولات Catalyst، show interfaces status (sh int status) هو ملخص المنافذ القياسي. كل سطر يعرض: اسم المنفذ، الوصف، الحالة (connected/notconnect/err-disabled/إلخ)، VLAN، duplex (a-full/half)، السرعة (a-100/1000)، والنوع. الكلمة err-disabled تُرشّح للمنافذ err-disabled فقط — مفيدة جدًا لتشخيص انتهاكات port-security، BPDU guard، و UDLD. الكلمة trunk تعرض منافذ trunk مع التغليف و native VLAN.",
    examples: [
      {
        context: "إيجاد منافذ err-disabled",
        code: "Switch# show interfaces status err-disabled",
        output:
          "Port      Name               Status       Reason\nGi1/0/10  User-Port-10       err-disabled bpduguard\nGi1/0/22  User-Port-22       err-disabled psecure-violation",
        outputExplanation:
          "المنفذ Gi1/0/10 err-disabled بسبب bpduguard (BPDU وصل على منفذ PortFast). المنفذ Gi1/0/22 err-disabled بسبب psecure-violation (تجاوز حد MAC).",
      },
    ],
    verificationCommands: ["show interfaces status", "show errdisable recovery"],
    troubleshootingNotes: [
      "err-disabled بسبب 'bpduguard': محول وُصل على منفذ PortFast. أزل الجهاز ثم shutdown/no shutdown للمنفذ (أو اعتمد على errdisable recovery cause bpduguard).",
      "err-disabled بسبب 'psecure-violation': MACs أكثر من الحد المُعد قُرئت على المنفذ.",
      "err-disabled بسبب 'udld': رابط أحادي الاتجاه كُشف — استبدل الألياف/الكابل المعيب.",
    ],
    references: [
      {
        label: "Catalyst 9300 Interface Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/command/reference/b_1712_cmd_ref_9300_9300l/b_1712_cmd_ref_9300_9300l_chapter_011.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-interfaces", "cmd-show-ip-interface-brief"],
    tags: ["inspection", "interface", "fundamentals", "switching"],
  },
  {
    id: "cmd-debug",
    name: "debug",
    syntax: "debug <protocol> [<subcommand>]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "Diagnostics",
    category: "Fundamentals",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary:
      "يُفعّل مخرجات تشخيص فورية لبروتوكول أو نظام فرعي. أداة تشخيص قوية — يجب استخدامها بحذر على أجهزة الإنتاج بسبب تأثير CPU.",
    description:
      "أوامر debug تكشف الحالة الداخلية الحية للبروتوكولات والعمليات. أمثلة: debug ip icmp يعرض كل حزمة ICMP، debug ip ospf hello يعرض كل hello OSPF، debug ip bgp ipv4 unicast updates يعرض كل تحديث BGP. المخرجات تذهب إلى console (دائمًا)، إلى جلسات monitor (بـ terminal monitor)، و syslog (بـ logging debug). حدّ دائمًا debug ببروتوكول/نظام فرعي محدد وعطّله بـ undebug all (u all) فور الانتهاء. كثير من أوامر debug لها تأثير CPU وقد تُسقط جهاز إنتاج مشغول.",
    examples: [
      {
        context: "تشخيص تبادل OSPF hello",
        code: "Router# debug ip ospf hello\nRouter# terminal monitor\n... راقب المخرجات ...\nRouter# undebug all",
      },
    ],
    verificationCommands: ["show debugging"],
    warnings: [
      "لا تشغّل debug all على جهاز إنتاج — سيتعطل تحت أي حمل.",
      "حدّد دائمًا debug لأضيق بروتوكول/نظام فرعي وعطّله بـ undebug all بعد التقاط المخرجات المطلوبة.",
      "على Catalyst 9000 بـ IOS XE 17.x، فضّل debug platform للتشخيص على مستوى العتاد/ASIC بدلًا من debugs عامة.",
    ],
    undoMethod: "undebug all (u all) لتعطيل كل debugs النشطة.",
    references: [
      {
        label: "Cisco IOS Debug Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/debug/command/dbg-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-running-config"],
    tags: ["diagnostics", "troubleshooting", "enarsi"],
  },

  // =================================================================
  // EtherChannel — ENCOR
  // =================================================================
  {
    id: "cmd-channel-group",
    name: "channel-group",
    syntax: "channel-group <1-128> mode {active | passive | desirable | auto | on}",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration"],
    promptShape: "Switch(config-if)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "EtherChannel / LAG",
    category: "Switching",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "يضيف واجهة فيزيائية إلى port-channel (EtherChannel). الكلمة mode تختار LACP، PAgP، أو static.",
    description:
      "EtherChannel يجمع حتى 8 (LACP) أو 8-16 (Catalyst 9000 بمنافذ 25G+) روابط فيزيائية في port-channel منطقي واحد للتكرار وزيادة النطاق. الـ mode يحدد بروتوكول التفاوض: active/passive يستخدمان LACP (802.3ad، معياري، موصى به)، desirable/auto يستخدمان PAgP (خاص بـ Cisco، مُهمَل)، on هو static (لا تفاوض — كلا الجانبين يجب أن يكونا on). كل الواجهات الأعضاء يجب أن يكون لها إعداد متطابق (السرعة، duplex، VLAN، إعدادات trunk).",
    parameters: [
      {
        name: "<1-128>",
        description: "رقم port-channel. النطاق 1-128 على Catalyst 9000.",
        required: true,
      },
      {
        name: "mode {active | passive | desirable | auto | on}",
        description: "active/passive = LACP. desirable/auto = PAgP (مُهمَل). on = static.",
        required: true,
        allowedValues: ["active", "passive", "desirable", "auto", "on"],
      },
    ],
    examples: [
      {
        context: "port-channel بـ LACP من منفذين إلى محول علوي",
        code: "Switch(config)# interface range GigabitEthernet1/0/1-2\nSwitch(config-if-range)# channel-group 1 mode active\nSwitch(config-if-range)# no shutdown\nSwitch(config)# interface port-channel 1\nSwitch(config-if)# switchport mode trunk\nSwitch(config-if)# switchport trunk allowed vlan 10,20,30",
      },
    ],
    verificationCommands: ["show etherchannel summary", "show etherchannel 1 port-channel", "show interfaces port-channel 1"],
    troubleshootingNotes: [
      "إذا كان منفذ 'suspended' في show etherchannel summary، فالإعداد لا يطابق أعضاء القناة الحاليين. افحص السرعة، duplex، VLAN، إعداد trunk، وإعدادات STP.",
      "LACP يتطلب جانبًا واحدًا active والآخر active أو passive. جانبان passive لا يتفاوضان أبدًا.",
    ],
    commonErrors: [
      "اختلاف native VLAN أو allowed VLAN list بين الأعضاء — يُعلّق المنفذ.",
      "استخدام desirable/auto (PAgP) بدلًا من active/passive (LACP) — PAgP مُهمَل.",
    ],
    warnings: [
      "كل المنافذ في channel يجب أن يكون لها إعداد متطابق. اختلاف native VLANs أو allowed VLANs أو إعدادات STP سيُعلّق المنفذ.",
    ],
    undoMethod: "no channel-group <1-128>.",
    references: [
      {
        label: "Catalyst 9300 EtherChannel Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/l2/b_1712_l2_9300_9300l/ethernet_ch.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-interface-port-channel"],
    tags: ["switching", "etherchannel", "lacp", "encor"],
  },
  {
    id: "cmd-interface-port-channel",
    name: "interface port-channel",
    syntax: "interface port-channel <1-128>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "Interface Configuration"],
    promptShape: "Switch(config)# → Switch(config-if)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "EtherChannel / LAG",
    category: "Switching",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "يدخل وضع إعداد لواجهة port-channel المنطقية. كل الإعدادات المشتركة (VLAN، trunk، MTU، QoS) تُطبّق هنا، لا على الأعضاء الفيزيائيين.",
    description:
      "port-channel هي الواجهة المنطقية الممثلة لحزمة EtherChannel. بمجرد إنشائها (ضمنيًا عند إضافة أول عضو بـ channel-group)، يمكنك دخول وضع إعدادها لتطبيق الإعدادات المشتركة. القاعدة العامة: أي شيء مشترك بين كل المنافذ الأعضاء (VLAN، trunk، MTU، QoS trust، إعدادات STP) يُوضع على port-channel؛ أي شيء خاص برابط فيزيائي (السرعة، الوصف، عدّادات الأخطاء) يُوضع على الواجهة العضو. التغييرات على port-channel تنتشر للواجهات الأعضاء تلقائيًا.",
    parameters: [
      {
        name: "<1-128>",
        description: "رقم port-channel. يجب أن يطابق الرقم في channel-group.",
        required: true,
      },
    ],
    examples: [
      {
        context: "تطبيق إعداد trunk على القناة المنطقية",
        code: "Switch(config)# interface port-channel 1\nSwitch(config-if)# description uplink-to-core\nSwitch(config-if)# switchport mode trunk\nSwitch(config-if)# switchport trunk allowed vlan 10,20,30\nSwitch(config-if)# no shutdown",
      },
    ],
    verificationCommands: ["show interfaces port-channel 1", "show etherchannel summary"],
    references: [
      {
        label: "Catalyst 9300 EtherChannel Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/l2/b_1712_l2_9300_9300l/ethernet_ch.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-channel-group"],
    tags: ["switching", "etherchannel", "encor"],
  },

  // =================================================================
  // GRE / IPsec — ENCOR
  // =================================================================
  {
    id: "cmd-interface-tunnel-gre",
    name: "interface tunnel (GRE)",
    syntax: "interface tunnel <number>\n  tunnel mode gre {ip | ipv6}\n  tunnel source <iface-or-ip>\n  tunnel destination <ip>\n  ip address <local-tunnel-ip> <mask>",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "Interface Configuration"],
    promptShape: "Router(config)# → Router(config-if)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "Tunnels",
    category: "WAN",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "ينشئ واجهة نفق GRE (Generic Routing Enculation). GRE يغلّف حزم Layer 3 داخل IP لشبكات overlay، يُقرن عادةً بـ IPsec للتشفير.",
    description:
      "أنفاق GRE تنشئ رابط نقطة-إلى-نقطة افتراضي بين نقطتين عبر أي ناقل IP. GRE بحد ذاته لا يوفر تشفيرًا — يُقرن عادةً بـ IPsec (tunnel protection ipsec profile <name>) لتشفير الحمولة. حالات الاستخدام: VPNs موقع-إلى-موقع، نقل متعدد البروتوكولات (IPX، IPv6 عبر IPv4)، نقل multicast (IPsec وحده لا يستطيع حمل multicast). MTU على النفق يجب أن يُضبط إلى 1400 لتجنب التجزئة. keepalive بـ keepalive <sec> <retries> يكشف فشل الطرف البعيد.",
    parameters: [
      {
        name: "<number>",
        description: "رقم واجهة النفق (0-2147483647).",
        required: true,
      },
      {
        name: "tunnel source <iface-or-ip>",
        description: "واجهة أو IP المصدر للنفق.",
        required: true,
      },
      {
        name: "tunnel destination <ip>",
        description: "IP الطرف البعيد للنفق.",
        required: true,
      },
    ],
    examples: [
      {
        context: "نفق GRE موقع-إلى-موقع بين موجّهين",
        code: "Router(config)# interface Tunnel0\nRouter(config-if)# ip address 172.16.0.1 255.255.255.252\nRouter(config-if)# tunnel source GigabitEthernet0/0/0\nRouter(config-if)# tunnel destination 203.0.113.2\nRouter(config-if)# tunnel mode gre ip\nRouter(config-if)# keepalive 10 3\nRouter(config-if)# ip mtu 1400\nRouter(config-if)# ip tcp adjust-mss 1360",
      },
    ],
    verificationCommands: ["show interfaces Tunnel0", "show ip route", "ping <tunnel-destination>"],
    troubleshootingNotes: [
      "النفق يبقى 'up/up' حتى لو كانت الوجهة غير قابلة للوصول (ما لم تُعدّ keepalives). اضبط دائمًا keepalive 10 3 لتعكس الواجهة حالة الوصول الفعلية.",
      "إذا كان النفق up لكن ping يفشل: (a) تحقق من المسار التحتي إلى الوجهة، (b) افحص MTU/MSS — ICMP fragment-needed قد يُسقط بواسطة جدران نارية وسيطة.",
    ],
    commonErrors: [
      "نسيان ip mtu 1400 و ip tcp adjust-mss 1360 — حزم TCP الكبيرة تُجزّأ أو تُسقط.",
      "نسيان keepalive — النفق يبقى up حتى لو فُقد الوصول للطرف البعيد.",
    ],
    undoMethod: "no interface tunnel <number>.",
    references: [
      {
        label: "Cisco IOS Tunneling Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/interface/configuration/17-12/ir-17-12-book/ir-tunnel.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-crypto-ipsec-profile", "cmd-crypto-ikev2-policy"],
    tags: ["wan", "tunnel", "gre", "encor"],
  },
  {
    id: "cmd-crypto-ikev2-policy",
    name: "crypto ikev2 policy",
    syntax: "crypto ikev2 policy <name>\n  match address local <ip>\n  proposal <proposal-name>",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 15.1(1)T+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(config-ikev2-policy)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "VPN / IPsec",
    category: "Security",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "يُعرّف سياسة IKEv2 تربط proposal بعنوان محلي. IKEv2 هو بروتوكول تبادل المفاتيح الحديث الموصى به لـ IPsec VPNs (يحل محل IKEv1).",
    description:
      "IKEv2 هو المعيار الحالي لتبادل مفاتيح IPsec، يحل محل IKEv1 بتدفق رسائل أبسط، NAT-T مدمج، مصادقة EAP، وdead-peer detection. الأمر crypto ikev2 policy <name> ينشئ حاوية سياسة. داخلها، match address local <ip> يربطها بواجهة محددة (أو any)، وproposal <name> يشير إلى proposal مُعرَّف مسبقًا (crypto ikev2 proposal <name> مع encryption/integrity/DH group). سياسة واحدة يمكن أن تحمل عدة proposals؛ المستجيب يختار أول تطابق.",
    parameters: [
      {
        name: "<name>",
        description: "اسم سياسة IKEv2.",
        required: true,
      },
    ],
    examples: [
      {
        context: "تعريف IKEv2 proposal و policy و keyring لموقع-إلى-موقع",
        code: 'Router(config)# crypto ikev2 proposal IKEV2-PROP\nRouter(config-ikev2-proposal)# encryption aes-cbc-256\nRouter(config-ikev2-proposal)# integrity sha256\nRouter(config-ikev2-proposal)# group 14\nRouter(config)# crypto ikev2 policy IKEV2-POLICY\nRouter(config-ikev2-policy)# proposal IKEV2-PROP\nRouter(config)# crypto ikev2 keyring IKEV2-KR\nRouter(config-ikev2-keyring)# peer SPOKE-01\nRouter(config-ikev2-keyring-peer)# address 203.0.113.2\nRouter(config-ikev2-keyring-peer)# pre-shared-key 0 <secret>',
      },
    ],
    verificationCommands: ["show crypto ikev2 policy", "show crypto ikev2 proposal", "show crypto ikev2 sa"],
    references: [
      {
        label: "Cisco IOS IKEv2 Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/sec_conn_ike2/configuration/17-12/sec-conn-ike2-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-crypto-ipsec-profile", "cmd-crypto-ipsec-transform-set"],
    tags: ["vpn", "ipsec", "ikev2", "encor"],
  },
  {
    id: "cmd-crypto-ipsec-transform-set",
    name: "crypto ipsec transform-set",
    syntax: "crypto ipsec transform-set <name> {esp-aes | esp-aes 256 | esp-3des} {esp-sha256-hmac | esp-sha-hmac | esp-md5-hmac} [mode {transport | tunnel}]",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "VPN / IPsec",
    category: "Security",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "يُعرّف مجموعة بروتوكولات وخوارزميات أمان IPsec (ESP encryption + authentication) لحماية حركة data plane. يُشار إليه بـ crypto maps و IPsec profiles.",
    description:
      "transform-set يُعرّف حماية data plane لـ IPsec: خوارزمية تشفير ESP (AES-128، AES-256، 3DES — لا تستخدم DES أبدًا)، مصادقة ESP (SHA-256-HMAC مفضّل، SHA-1 مقبول، MD5 مُهمَل). الكلمة mode transport تستخدم transport mode (تشفّر الحمولة فقط، تُستخدم لأنفاق IPsec-over-GRE-less)؛ الافتراضي tunnel mode (يشفّر الحزمة كاملة، يُستخدم لموقع-إلى-موقع). يمكن عرض عدة transform-sets؛ المستجيب يختار أول تطابق.",
    parameters: [
      {
        name: "<name>",
        description: "اسم transform-set.",
        required: true,
      },
      {
        name: "esp-aes | esp-aes 256 | esp-3des",
        description: "خوارزمية التشفير. AES-256 مفضّل. لا تستخدم DES.",
        required: true,
        allowedValues: ["esp-aes", "esp-aes 256", "esp-3des"],
      },
      {
        name: "esp-sha256-hmac | esp-sha-hmac | esp-md5-hmac",
        description: "خوارزمية المصادقة. SHA-256 مفضّل.",
        required: true,
      },
      {
        name: "mode {transport | tunnel}",
        description: "transport = تشفير الحمولة فقط. tunnel (افتراضي) = تشفير الحزمة كاملة.",
        required: false,
        defaultValue: "tunnel",
      },
    ],
    examples: [
      {
        context: "transform-set حديث بـ AES-256 + SHA-256 في tunnel mode",
        code: "Router(config)# crypto ipsec transform-set TS-ESP esp-aes 256 esp-sha256-hmac\nRouter(config)# crypto ipsec transform-set TS-ESP mode tunnel",
      },
    ],
    verificationCommands: ["show crypto ipsec transform-set"],
    undoMethod: "no crypto ipsec transform-set <name>.",
    references: [
      {
        label: "Cisco IOS IPsec Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/sec_conn_vpnipsec/command/sec-vpnipsec-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-crypto-ipsec-profile", "cmd-crypto-ikev2-policy"],
    tags: ["vpn", "ipsec", "encor"],
  },
  {
    id: "cmd-crypto-ipsec-profile",
    name: "crypto ipsec profile",
    syntax: "crypto ipsec profile <name>\n  set transform-set <name>\n  set ikev2-profile <name>\n  set pfs [group14 | group19 | group21]",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.2(13)T+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(config-ipsec-profile)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "VPN / IPsec",
    category: "Security",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "يجمع transform-set و IKEv2 profile في profile قابل لإعادة الاستخدام. يُطبَّق على واجهات نفق بـ tunnel protection ipsec profile <name>.",
    description:
      "IPsec profile هو البديل الحديث لـ crypto maps عند حماية أنفاق GRE أو DMVPN. الـ profile يشير إلى transform-set (حماية data plane) و IKEv2 profile (تبادل مفاتيح control plane). set pfs group14 يفرض Perfect Forward Secrecy (مفتاح جديد لكل تبادل Quick Mode، موصى به). الـ profile يُطبَّق على واجهة نفق بـ tunnel protection ipsec profile <name>.",
    parameters: [
      {
        name: "<name>",
        description: "اسم IPsec profile.",
        required: true,
      },
    ],
    examples: [
      {
        context: "IPsec profile يُطبَّق على نفق GRE",
        code: 'Router(config)# crypto ipsec profile IPSEC-PROFILE\nRouter(config-ipsec-profile)# set transform-set TS-ESP\nRouter(config-ipsec-profile)# set ikev2-profile IKEV2-PROFILE\nRouter(config-ipsec-profile)# set pfs group14\nRouter(config)# interface Tunnel0\nRouter(config-if)# tunnel protection ipsec profile IPSEC-PROFILE',
      },
    ],
    verificationCommands: ["show crypto ipsec profile", "show crypto ipsec sa"],
    undoMethod: "no crypto ipsec profile <name>.",
    references: [
      {
        label: "Cisco IOS IPsec Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/sec_conn_vpnipsec/configuration/17-12/sec-vpnipsec-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-crypto-ikev2-policy", "cmd-crypto-ipsec-transform-set", "cmd-interface-tunnel-gre"],
    tags: ["vpn", "ipsec", "encor"],
  },

  // =================================================================
  // QoS — ENCOR
  // =================================================================
  {
    id: "cmd-class-map",
    name: "class-map",
    syntax: "class-map [match-all | match-any] <name>\n  match <condition>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة (MQC)",
    cliMode: ["Global Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(config-cmap)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "QoS",
    category: "Services",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "يُعرّف class-map باستخدام إطار MQC (Modular QoS CLI). class-map يصنّف الحركة باستخدام شروط match (ACL، DSCP، CoS، protocol، RTP port range).",
    description:
      "MQC (Modular QoS CLI) هو إطار QoS العالمي على أجهزة Cisco الحديثة. الخطوة الأولى هي class-map: يُعرّف أي حركة تنتمي لفئة عبر شرط match واحد أو أكثر. match-all (افتراضي) يتطلب تطابق كل الشروط؛ match-any يتطلب أي شرط واحد. شروط match الشائعة: match access-group name <acl>، match dscp <value>، match cos <value>، match protocol rtp audio، match precedence <value>. تُشار إليها class-maps بواسطة policy-maps.",
    parameters: [
      {
        name: "match-all | match-any",
        description: "match-all (افتراضي) يتطلب كل الشروط. match-any يتطلب أي شرط.",
        required: false,
        defaultValue: "match-all",
      },
      {
        name: "<name>",
        description: "اسم class-map.",
        required: true,
      },
    ],
    examples: [
      {
        context: "تصنيف الصوت (DSCP EF) والإشارات (DSCP CS3)",
        code: 'Router(config)# class-map match-any CM-VOICE\nRouter(config-cmap)# match dscp ef\nRouter(config)# class-map match-any CM-SIGNALING\nRouter(config-cmap)# match dscp cs3\nRouter(config-cmap)# match dscp af31',
      },
    ],
    verificationCommands: ["show class-map", "show policy-map"],
    undoMethod: "no class-map [match-all | match-any] <name>.",
    references: [
      {
        label: "Cisco IOS QoS Configuration Guide — MQC",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/qos/configuration/17-12/qos-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-policy-map", "cmd-service-policy"],
    tags: ["qos", "mqc", "encor"],
  },
  {
    id: "cmd-policy-map",
    name: "policy-map",
    syntax: "policy-map <name>\n  class <class-name>\n    <action>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(config-pmap)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "QoS",
    category: "Services",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "يُعرّف policy-map يطبّق إجراءات QoS (bandwidth، priority/LLQ، police، shape، set dscp) على فئات حركة مُعرّفة بـ class-maps.",
    description:
      "policy-map يربط class-maps بإجراءات QoS. داخل policy-map، كل كتلة class <name> تشير إلى class-map وتطبّق إجراءً واحدًا أو أكثر: priority percent <n> لـ LLQ (low-latency queue، يُستخدم للصوت)، bandwidth percent <n> لـ CBWFQ guaranteed bandwidth، police cir <bps> للشرطة، shape average <bps> للتشكيل، set dscp <value> لإعادة الوسم. كتلة class-default تطبّق إجراءات على كل الحركة غير المطابقة.",
    parameters: [
      {
        name: "<name>",
        description: "اسم policy-map.",
        required: true,
      },
    ],
    examples: [
      {
        context: "LLQ للصوت، CBWFQ للإشارات، fair-queue لكل شيء آخر",
        code: 'Router(config)# policy-map PM-EDGE-IN\nRouter(config-pmap)# class CM-VOICE\nRouter(config-pmap-c)# priority percent 30\nRouter(config-pmap-c)# class CM-SIGNALING\nRouter(config-pmap-c)# bandwidth percent 5\nRouter(config-pmap-c)# class class-default\nRouter(config-pmap-c)# fair-queue\nRouter(config-pmap-c)# random-detect dscp-based',
      },
    ],
    verificationCommands: ["show policy-map", "show policy-map interface <iface>"],
    undoMethod: "no policy-map <name>.",
    references: [
      {
        label: "Cisco IOS QoS Configuration Guide — Policy-Map",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/qos/configuration/17-12/qos-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-class-map", "cmd-service-policy"],
    tags: ["qos", "mqc", "encor"],
  },
  {
    id: "cmd-service-policy",
    name: "service-policy",
    syntax: "service-policy {input | output} <policy-map-name>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration", "Sub-mode"],
    promptShape: "Router(config-if)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "QoS",
    category: "Services",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "يطبّق policy-map على واجهة في اتجاه الدخول أو الخروج. خطوة الربط النهائية في MQC: class-map → policy-map → service-policy على الواجهة.",
    description:
      "بعد تعريف policy-map، أمر الواجهة service-policy {input | output} <name> يطبّقه. معظم تصاميم edge تطبّق policies مختلفة في كل اتجاه (input: classify/mark/police داخلة من المستخدم؛ output: queue/shape خارجة نحو المستخدم). على محولات Catalyst 9000، QoS الخروج يُطبَّق عبر service-policy output <name> على الواجهة الفيزيائية أو عبر qos-policy تحت policy-map لـ QoS هرمي. تحقق بـ show policy-map interface <iface> لرؤية عدّادات كل فئة والإسقاطات.",
    parameters: [
      {
        name: "input | output",
        description: "الاتجاه. input = قبل التوجيه. output = بعد التوجيه.",
        required: true,
        allowedValues: ["input", "output"],
      },
      {
        name: "<policy-map-name>",
        description: "اسم policy-map مُعرَّف مسبقًا.",
        required: true,
      },
    ],
    examples: [
      {
        context: "تطبيق policy QoS edge في اتجاه الدخول على منفذ access",
        code: "Router(config)# interface GigabitEthernet0/0/0\nRouter(config-if)# service-policy input PM-EDGE-IN",
      },
    ],
    verificationCommands: ["show policy-map interface <iface>", "show running-config interface <iface>"],
    undoMethod: "no service-policy {input | output} <name>.",
    references: [
      {
        label: "Cisco IOS QoS Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/qos/configuration/17-12/qos-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-class-map", "cmd-policy-map"],
    tags: ["qos", "mqc", "encor"],
  },

  // =================================================================
  // Automation — ENCOR
  // =================================================================
  {
    id: "cmd-netconf-yang",
    name: "netconf-yang",
    syntax: "netconf-yang",
    platforms: ["IosXe"],
    versionRange: "IOS XE 16.5+",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "Automation & Programmability",
    category: "Automation",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "يُفعّل بروتوكول NETCONF (RFC 6241) على المنفذ الافتراضي 830. أساس الإدارة القائمة على YANG models على IOS XE.",
    description:
      "NETCONF هو بروتوكول IETF معياري لإعداد أجهزة الشبكة، يستخدم YANG data models وترميز XML عبر SSH. تفعيل netconf-yang على IOS XE يبدأ خادم NETCONF على المنفذ 830. من منصة أتمتة (Ansible، NSO، pyATS، Python مخصص بـ ncclient) يمكنك قراءة وكتابة إعداد الجهاز كاملًا بطريقة منظمة قائمة على النماذج. RESTCONF (HTTP/HTTPS) هو البروتوكول الشقيق المُفعّل بشكل منفصل بـ restconf.",
    examples: [
      {
        context: "تفعيل NETCONF و RESTCONF للأتمتة",
        code: "Router(config)# netconf-yang\nRouter(config)# restconf",
      },
    ],
    verificationCommands: ["show netconf-yang status", "show platform software yang-manager process"],
    warnings: [
      "NETCONF/RESTCONF يعتمدان على SSH/HTTPS — تأكد أن الجهاز لديه مفاتيح RSA صالحة (crypto key generate rsa) ومستخدم AAA بصلاحية 15 قبل التفعيل.",
    ],
    undoMethod: "no netconf-yang.",
    references: [
      {
        label: "Cisco IOS XE NETCONF/YANG Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/prog/configuration/17-12/b_1712_programmability_cg/netconf_yang.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-restconf"],
    tags: ["automation", "netconf", "yang", "encor"],
  },
  {
    id: "cmd-restconf",
    name: "restconf",
    syntax: "restconf",
    platforms: ["IosXe"],
    versionRange: "IOS XE 16.5+",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "Automation & Programmability",
    category: "Automation",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "يُفعّل بروتوكول RESTCONF (RFC 8040) على HTTPS port 443. يوفر REST API لإدارة قائمة على YANG models.",
    description:
      "RESTCONF هو الشقيق HTTP(S) لـ NETCONF. يكشف YANG models عبر طرق HTTP قياسية (GET، POST، PUT، PATCH، DELETE) مع ترميز JSON أو XML. أسهل تكاملًا مع أتمتة بأسلوب الويب من NETCONF. بمجرد التفعيل، يمكنك curl -k -u admin:password https://<device>/restconf/data/native/interface للتفاعل مع الجهاز. استخدم دائمًا HTTPS (ip http secure-server) — لا تفعل RESTCONF عبر HTTP العادي في الإنتاج.",
    examples: [
      {
        context: "تفعيل HTTPS و RESTCONF",
        code: "Router(config)# ip http secure-server\nRouter(config)# restconf",
      },
      {
        context: "مثال curl لقراءة قائمة الواجهات",
        code: 'curl -k -u admin:password -H "Accept: application/yang-data+json" \\\n  https://10.10.99.10/restconf/data/native/interface',
      },
    ],
    verificationCommands: ["show restconf status", "show platform software yang-manager process"],
    undoMethod: "no restconf.",
    references: [
      {
        label: "Cisco IOS XE RESTCONF Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/prog/configuration/17-12/b_1712_programmability_cg/restconf.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-netconf-yang"],
    tags: ["automation", "restconf", "yang", "encor"],
  },

  // =================================================================
  // SNMP — CCNA
  // =================================================================
  {
    id: "cmd-snmp-server-community",
    name: "snmp-server community",
    syntax: "snmp-server community <string> [view <name>] [ro | rw] [acl]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Management & Monitoring",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُعرّف community string لـ SNMPv1/v2c لـ read أو read-write. يجب حمايته دائمًا بـ ACL. SNMPv3 هو المعيار الموصى به.",
    description:
      "SNMP community strings هي مكافئة كلمات السر لـ SNMPv1/v2c. الكلمة ro تمنح وصولًا للقراءة فقط (GET، GETNEXT، GETBULK)؛ rw تمنح قراءة-كتابة (أيضًا SET). قيّد دائمًا الوصول بـ ACL (snmp-server community <string> RO ACL-MGMT-NMS). SNMPv1/v2c يرسل community strings كنص واضح ومُهمَلة — استخدم SNMPv3 (snmp-server group، snmp-server user، snmp-server view) لأي نشر إنتاج.",
    parameters: [
      {
        name: "<string>",
        description: "community string (كلمة السر). استخدم string قوي.",
        required: true,
      },
      {
        name: "ro | rw",
        description: "ro = read only. rw = read-write.",
        required: false,
        defaultValue: "ro",
        allowedValues: ["ro", "rw"],
      },
      {
        name: "acl",
        description: "ACL لتقييد المصادر المسموح لها.",
        required: false,
      },
    ],
    examples: [
      {
        context: "community read-only محمي بـ ACL",
        code: "Router(config)# ip access-list standard ACL-NMS\nRouter(config-acl)# permit 10.10.99.20\nRouter(config-acl)# deny any log\nRouter(config)# snmp-server community Str0ngC0mmR0 RO ACL-NMS\nRouter(config)# snmp-server location Cairo-DC-01\nRouter(config)# snmp-server contact noc@example.com",
      },
    ],
    verificationCommands: ["show snmp community", "show snmp host", "show snmp"],
    warnings: [
      "SNMPv1/v2c community strings كنص واضح وقابلة للشم بسهولة. استخدم SNMPv3 مع authPriv لأي مراقبة إنتاج.",
    ],
    undoMethod: "no snmp-server community <string>.",
    references: [
      {
        label: "Cisco IOS Network Management Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/snmp/command/nm-snmp-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-snmp-server-host"],
    tags: ["snmp", "monitoring", "ccna"],
  },
  {
    id: "cmd-snmp-server-host",
    name: "snmp-server host",
    syntax: "snmp-server host <ip> [version {1 | 2c | 3 {auth | noauth | priv}}] <community-or-user>\n  snmp-server enable traps [<trap-type>]",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Management & Monitoring",
    category: "Services",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يُعرّف مستقبِل إشعارات SNMP (NMS) وبيانات الاعتماد للاستخدام. اقرن بـ snmp-server enable traps للتحكم في الإشعارات المُرسلة.",
    description:
      "بعد تعريف community أو مستخدم SNMPv3، أمر snmp-server host يخبر الجهاز أين يرسل إشعارات SNMP (traps أو informs). لـ SNMPv3، المستخدم يجب أن يكون موجودًا مسبقًا. snmp-server enable traps يتحكم في أنواع traps المُرسلة — افتراضيًا لا traps مفعّلة. traps الشائعة: snmp-server enable traps snmp authentication linkup linkdown coldstart، snmp-server enable traps ospf state-change، snmp-server enable traps bgp، snmp-server enable traps config. لـ informs (مؤكَّدة) استخدم snmp-server host <ip> informs ...",
    parameters: [
      {
        name: "<ip>",
        description: "IP خادم NMS.",
        required: true,
      },
      {
        name: "version {1 | 2c | 3 ...}",
        description: "إصدار SNMP. استخدم 3 priv للإنتاج.",
        required: false,
        defaultValue: "2c",
      },
    ],
    examples: [
      {
        context: "إرسال traps SNMPv3 authPriv إلى NMS",
        code: "Router(config)# snmp-server group GRP-ADMIN v3 priv read V-WRITE\nRouter(config)# snmp-server user USR-NOC GRP-ADMIN v3 auth sha <auth-pass> priv aes 128 <priv-pass> ACL-NMS\nRouter(config)# snmp-server host 10.10.99.20 version 3 priv USR-NOC\nRouter(config)# snmp-server enable traps snmp authentication linkup linkdown coldstart\nRouter(config)# snmp-server enable traps ospf state-change\nRouter(config)# snmp-server enable traps bgp",
      },
    ],
    verificationCommands: ["show snmp host", "show snmp user", "show snmp group"],
    undoMethod: "no snmp-server host <ip>.",
    references: [
      {
        label: "Cisco IOS Network Management Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/snmp/command/nm-snmp-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-snmp-server-community"],
    tags: ["snmp", "monitoring", "ccna"],
  },

  // =================================================================
  // Configuration management — copy / archive / replace
  // =================================================================
  {
    id: "cmd-copy-run-start",
    name: "copy running-config startup-config",
    aliases: ["cop run start"],
    syntax: "copy running-config startup-config",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "Configuration Management",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary:
      "يحفظ running-config إلى NVRAM كـ startup-config جديد. مكافئ وظيفيًا لـ write memory لكنه الصيغة المفضّلة في السكربتات ووثائق Cisco.",
    description:
      "copy running-config startup-config (يُختصر cop run start) هو الشكل الطويل لـ write memory. كلاهما ينتج نفس النتيجة: استمرار running-config الحالي في NVRAM ليبقى بعد إعادة الإقلاع. الصيغة copy مفضّلة في السكربتات ووثائق Cisco لأنها متسقة مع عمليات copy أخرى (copy run tftp:، copy run scp:، copy start run).",
    examples: [
      {
        context: "حفظ الإعداد النشط",
        code: "Router# copy running-config startup-config\nDestination filename [startup-config]? \nBuilding configuration...\n[OK]",
      },
      {
        context: "نسخ احتياطي لـ running-config إلى خادم TFTP",
        code: "Router# copy running-config tftp://10.10.99.50/Cairo-Edge-01-2026-10-29.cfg",
      },
    ],
    verificationCommands: ["show startup-config", "show running-config diff"],
    references: [
      {
        label: "Cisco IOS Configuration Fundamentals Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-write-memory", "cmd-show-running-config", "cmd-archive"],
    tags: ["save", "configuration-management", "fundamentals"],
  },
  {
    id: "cmd-archive",
    name: "archive",
    syntax: "archive\n  path {ftp:|tftp:|scp:|flash:|bootflash:}<path>\n  write-memory\n  time-period <minutes>\n  maximum <count>",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.3(7)T+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(config-archive)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "Configuration Management",
    category: "Fundamentals",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "يُعدّ الأرشفة التلقائية للإعداد إلى خادم بعيد. مع write-memory، يحفظ الجهاز لقطة عند كل تنفيذ لـ write memory، ما يوفر تاريخ rollback.",
    description:
      "ميزة archive تحفظ running-config دوريًا إلى خادم بعيد. مع write-memory مُعدّ، كل write memory يُطلق حفظ أرشيف. مع time-period <minutes>، يُؤرشف running-config على تلك الفترة بغض النظر عن الحفظ. الكلمة maximum <count> تبقي آخر N أرشيف وتدور البقية. تُستخدم لقطات archive بواسطة configure replace للـ rollback ذري إلى إعداد سليم معروف دون إعادة إقلاع.",
    parameters: [
      {
        name: "path <protocol>://<path>",
        description: "مسار الأرشفة. ftp/tftp/scp/flash/bootflash.",
        required: true,
      },
      {
        name: "write-memory",
        description: "يؤرشف عند كل write memory.",
        required: false,
      },
      {
        name: "time-period <minutes>",
        description: "يؤرشف كل N دقيقة.",
        required: false,
      },
      {
        name: "maximum <count>",
        description: "أقصى عدد أرشيفات للاحتفاظ به.",
        required: false,
      },
    ],
    examples: [
      {
        context: "أرشفة تلقائية إلى خادم SCP عند كل حفظ وكل 1440 دقيقة",
        code: "Router(config)# archive\nRouter(config-archive)# path scp://admin@10.10.99.50/Cairo-Edge-01-config-\nRouter(config-archive)# write-memory\nRouter(config-archive)# time-period 1440\nRouter(config-archive)# maximum 50",
      },
    ],
    verificationCommands: ["show archive", "show archive config differences"],
    references: [
      {
        label: "Cisco IOS Configuration Archive Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-copy-run-start", "cmd-configure-replace"],
    tags: ["configuration-management", "archive", "encor"],
  },
  {
    id: "cmd-configure-replace",
    name: "configure replace",
    syntax: "configure replace <url> [nolabel] [list] [force] [time <mm:ss>]",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.3(7)T+؛ IOS XE كافة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "Configuration Management",
    category: "Fundamentals",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary:
      "يستبدل running-config بملف إعداد محفوظ ذريًا. على عكس copy start run (الذي جمعي فقط)، configure replace يزيل الأسطر الموجودة في running لكن غير موجودة في الملف الهدف.",
    description:
      "configure replace <url> هو آلية rollback الحديثة الذرية. يحسب diff بين running-config الحالي والملف الهدف، ثم يطبّق فقط التغييرات — إضافات، تعديلات، حذوفات — في عملية ذرية واحدة. هذا يختلف جذريًا عن copy start run (الذي يضيف فقط أسطرًا من الملف المصدر لكنه لا يزيل شيئًا). حالات الاستخدام: rollback بعد نافذة تغيير فاشلة، الاستعادة إلى baseline سليم معروف، دفع إعداد مؤتمت من CI/CD. الكلمة force تتخطى تأكيد prompt؛ الكلمة list تعرض التغييرات المخططة دون تطبيق.",
    parameters: [
      {
        name: "<url>",
        description: "URL لملف الإعداد (scp:/ftp:/tftp:/flash:).",
        required: true,
      },
      {
        name: "list",
        description: "يعرض التغييرات المخططة دون تطبيق.",
        required: false,
      },
      {
        name: "force",
        description: "يتخطى تأكيد prompt.",
        required: false,
      },
    ],
    examples: [
      {
        context: "rollback إلى إعداد سليم بعد نافذة تغيير فاشلة",
        code: "Router# configure replace scp://admin@10.10.99.50/Cairo-Edge-01-config--Oct-29-14-30-00 list force",
      },
    ],
    verificationCommands: ["show archive", "show running-config"],
    references: [
      {
        label: "Cisco IOS Configuration Replace Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-archive", "cmd-copy-run-start"],
    tags: ["configuration-management", "rollback", "encor"],
  },

  // =================================================================
  // ENARSI — route-maps, prefix-lists, redistribution, PBR, IP SLA
  // =================================================================
  {
    id: "cmd-route-map",
    name: "route-map",
    syntax: "route-map <name> {permit | deny} <sequence>\n  match <condition>\n  set <action>",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(config-route-map)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "Route Policy",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary:
      "يُعرّف route-map: سلسلة مرتبة من إدخالات permit/deny، كل بشرط match اختياري وإجراء set اختياري. يُستخدم لترشيح المسارات، إعادة التوزيع، PBR، وسياسة BGP.",
    description:
      "route-maps هي أداة السياسة العالمية على موجّهات Cisco. route-map هو قائمة مسمّاة من إدخالات مرتبة (10، 20، 30 افتراضيًا لكن أي رقم يعمل). كل إدخال permit أو deny. شروط match تختار أي مسارات ينطبق عليها الإدخال (match ip address prefix-list، match ip next-hop، match metric، match tag، إلخ). إجراءات set تعدّل المسار (set metric، set local-preference، set community، set weight). إذا لم يُحدد match، الإدخال يطابق كل المسارات. إذا لم يُحدد set، الإدخال يمرر المسار دون تغيير. المسارات التي تخرج من النهاية تُرفض.",
    parameters: [
      {
        name: "<name>",
        description: "اسم route-map.",
        required: true,
      },
      {
        name: "permit | deny",
        description: "السماح أو الرفض.",
        required: true,
        allowedValues: ["permit", "deny"],
      },
      {
        name: "<sequence>",
        description: "رقم تسلسلي (10، 20، 30 افتراضيًا).",
        required: true,
        defaultValue: "10",
      },
    ],
    examples: [
      {
        context: "route-map لإعادة توزيع OSPF-to-BGP مع metric و tag",
        code: 'Router(config)# ip prefix-list PFX-INTERNAL permit 10.10.0.0/16 le 32\nRouter(config)# route-map RM-OSPF-TO-BGP permit 10\nRouter(config-route-map)# match ip address prefix-list PFX-INTERNAL\nRouter(config-route-map)# set metric 100\nRouter(config-route-map)# set tag 100\nRouter(config-route-map)# exit\nRouter(config-route-map)# route-map RM-OSPF-TO-BGP deny 100\nRouter(config-router)# router bgp 65001\nRouter(config-router-af)# redistribute ospf 1 route-map RM-OSPF-TO-BGP',
      },
    ],
    verificationCommands: ["show route-map", "show ip route", "show bgp ipv4 unicast"],
    references: [
      {
        label: "Cisco IOS IP Routing: BGP Command Reference — route-map",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_bgp/command/irg-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-prefix-list", "cmd-router-bgp"],
    tags: ["routing", "policy", "route-map", "enarsi"],
  },
  {
    id: "cmd-ip-prefix-list",
    name: "ip prefix-list",
    syntax: "ip prefix-list <name> {permit | deny} <network>/<len> [ge <min-len>] [le <max-len>]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "Route Policy",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary:
      "يُعرّف IP prefix-list: فلتر دقيق يطابق الشبكة AND طول البادئة (على عكس ACLs التي تطابق الشبكة فقط). الكلمات ge/le تسمح بمطابقة مدى.",
    description:
      "prefix-lists هي أداة ترشيح المسارات المفضّلة في توجيه Cisco الحديث لأنها تطابق كلًا من عنوان الشبكة وطول البادئة. الكلمات ge (greater-than-or-equal) و le (less-than-or-equal) تُمكّن مطابقة المدى — مثلًا permit 10.0.0.0/8 le 32 يطابق أي بادئة تبدأ بـ 10.x.x.x بطول قناع حتى /32. بدون ge/le، المطابقة دقيقة (شبكة + طول). prefix-lists لها deny ضمني في النهاية و permit 0.0.0.0/0 le 32 صريح مطلوب للسماح بكل شيء آخر.",
    parameters: [
      {
        name: "<name>",
        description: "اسم prefix-list.",
        required: true,
      },
      {
        name: "permit | deny",
        description: "السماح أو الرفض.",
        required: true,
      },
      {
        name: "<network>/<len>",
        description: "الشبكة وطول البادئة. مثال: 10.10.0.0/16.",
        required: true,
      },
      {
        name: "ge <min-len>",
        description: "أقل طول بادئة للمطابقة.",
        required: false,
      },
      {
        name: "le <max-len>",
        description: "أعلى طول بادئة للمطابقة.",
        required: false,
      },
    ],
    examples: [
      {
        context: "السماح فقط بـ /24s في 10.10.0.0/16 من جار BGP",
        code: "Router(config)# ip prefix-list PFX-VLANS seq 5 permit 10.10.0.0/16 ge 24 le 24\nRouter(config)# ip prefix-list PFX-VLANS seq 10 deny 0.0.0.0/0 le 32\nRouter(config-router)# neighbor 10.0.0.2 prefix-list PFX-VLANS in",
      },
    ],
    verificationCommands: ["show ip prefix-list", "show ip prefix-list detail"],
    commonErrors: [
      "نسيان أن prefix-list تطابق الشبكة AND طول البادئة، لا الشبكة فقط مثل ACL.",
    ],
    undoMethod: "no ip prefix-list <name>.",
    references: [
      {
        label: "Cisco IOS IP Routing: BGP Command Reference — prefix-list",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_bgp/command/irg-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-route-map", "cmd-router-bgp"],
    tags: ["routing", "policy", "prefix-list", "enarsi"],
  },
  {
    id: "cmd-redistribute",
    name: "redistribute",
    syntax: "redistribute <source-protocol> [<process-id>] [route-map <name>] [metric <metric>] [tag <tag>] [subnets]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Router Configuration"],
    promptShape: "Router(config-router)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "Route Redistribution",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary:
      "يُحقن مسارات متعلّمة من بروتوكول توجيه في آخر. قوي لكن خطير — يجب التحكم به دائمًا بـ route-map وmetric لمنع الحلقات والتوجيه دون الأمثل.",
    description:
      "redistribute ينقل المسارات بين بروتوكولات التوجيه (مثلًا OSPF إلى BGP، EIGRP إلى OSPF). نقاط حرجة: (1) اضبط seed metric دائمًا — OSPF يستخدم cost (افتراضيًا 20 لـ E1/E2، 1 لـ BGP)، EIGRP يستخدم متريك مركّب (يجب ضبط bandwidth/delay أو تظهر المسارات بمتريك لانهائي ولا تُثبّت)، BGP يستخدم MED. (2) استخدم route-map دائمًا للتحكم في أي مسارات تُعاد توزيعها. (3) على OSPF، الكلمة subnets مطلوبة لإعادة توزيع الشبكات الفرعية (ليس فقط الشبكات الصنفية). (4) تجنّب إعادة التوزيع المتبادل على عدة موجّهات دون tagging — يسبب حلقات.",
    parameters: [
      {
        name: "<source-protocol>",
        description: "البروتوكول المصدر: ospf، eigrp، bgp، rip، connected، static.",
        required: true,
      },
      {
        name: "<process-id>",
        description: "معرّف عملية البروتوكول المصدر (إن وجد).",
        required: false,
      },
      {
        name: "route-map <name>",
        description: "route-map للتحكم في المسارات المُعاد توزيعها.",
        required: false,
      },
      {
        name: "metric <metric>",
        description: "seed metric للمسارات المُعاد توزيعها.",
        required: false,
      },
      {
        name: "subnets",
        description: "مطلوب على OSPF لإعادة توزيع الشبكات الفرعية (ليس الصنفية فقط).",
        required: false,
      },
    ],
    examples: [
      {
        context: "إعادة توزيع OSPF إلى BGP بـ route-map و seed metric",
        code: 'Router(config-router)# router bgp 65001\nRouter(config-router-af)# redistribute ospf 1 route-map RM-OSPF-TO-BGP metric 100\nRouter(config)# router ospf 1\nRouter(config-router)# redistribute bgp 65001 subnets route-map RM-BGP-TO-OSPF metric 200 tag 65001',
      },
    ],
    verificationCommands: ["show ip route ospf", "show ip route bgp", "show ip protocols"],
    warnings: [
      "إعادة التوزيع المتبادل على عدة موجّهات دون route-tagging هو السبب الأول لحلقات التوجيه في الشبكات المؤسسية. علّم دائمًا المسارات المُعاد توزيعها واستخدم route-maps لرفض المسارات المعلّمة من إعادة التوزيع مجددًا.",
    ],
    commonErrors: [
      "نسيان subnets على OSPF — لا تُعاد توزيع إلا الشبكات الصنفية.",
      "نسيان seed metric على EIGRP — المسارات تظهر بمتريك لانهائي ولا تُثبّت.",
    ],
    undoMethod: "no redistribute <source-protocol> [<process-id>].",
    references: [
      {
        label: "Cisco IOS IP Routing: Protocol-Independent Command Reference",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_pi/command/irp-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-route-map", "cmd-ip-prefix-list"],
    tags: ["routing", "redistribution", "enarsi"],
  },
  {
    id: "cmd-route-map-pbr",
    name: "route-map (Policy-Based Routing)",
    syntax: "route-map <name> permit <seq>\n  match ip address <acl>\n  set ip next-hop <ip>\n  set ip default next-hop <ip>\ninterface <iface>\n  ip policy route-map <name>",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration", "Sub-mode", "Interface Configuration"],
    promptShape: "Router(config-route-map)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "Policy-Based Routing",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary:
      "Policy-Based Routing تتجاوز قرار جدول التوجيه للحركة المطابقة، تُجبرها عبر next-hop محدد. تُستخدم للتوجيه القائم على المصدر، وسم QoS، وهندسة الحركة.",
    description:
      "التوجيه العادي قائم على الوجهة — بحث FIB يستخدم فقط بادئة الوجهة. PBR يعترض الحزم المطابقة لـ ACL ويُجبرها على next-hop أو واجهة محددة، بغض النظر عن جدول التوجيه. match ip address <acl> يختار الحركة، set ip next-hop <ip> يُجبر next-hop محدد، set ip default next-hop <ip> يُطبَّق فقط إذا لم يكن لجدول التوجيه تطابق محدد. PBR يُطبَّق لكل واجهة بـ ip policy route-map <name>. حالات الاستخدام: توجيه شبكات فرعية مصدر محددة عبر ISP مختلف، توجيه حركة HTTP عبر جدار ناري، وسم حركة الصوت بـ set ip dscp ef عند الدخول. PBR يُعالَج برمجيًا على المنصات القديمة — تحقق من دعم العتاد على منصتك.",
    examples: [
      {
        context: "توجيه حركة شبكة الضيوف عبر ISP احتياطي",
        code: 'ip access-list extended ACL-GUEST\n  permit ip 10.10.50.0 0.0.0.255 any\nroute-map RM-PBR-GUEST permit 10\n  match ip address ACL-GUEST\n  set ip next-hop 203.0.114.1\ninterface GigabitEthernet0/0/0\n  ip policy route-map RM-PBR-GUEST',
      },
    ],
    verificationCommands: ["show route-map", "show ip policy", "show route-map interface <iface>"],
    references: [
      {
        label: "Cisco IOS PBR Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_pi/configuration/17-12/irp-17-12-book/irp-policy-route-map.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-route-map", "cmd-ip-access-list-extended"],
    tags: ["pbr", "routing", "policy", "enarsi"],
  },
  {
    id: "cmd-ip-sla",
    name: "ip sla",
    syntax: "ip sla <operation-number>\n  <type> ...\n  frequency <seconds>\n  timeout <milliseconds>\nip sla schedule <operation-number> life {forever | <seconds>} start-time {now | pending | after <hh:mm:ss>}",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.4+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(config-ip-sla)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "Network Assurance",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary:
      "يُعرّف probe IP SLA (ICMP echo، UDP jitter، TCP connect، إلخ) مجدول للتنفيذ دوريًا. يُستخدم مع track objects لإزالة المسارات الثابتة ديناميكيًا عند تعذّر الوصول لـ next-hop.",
    description:
      "probes IP SLA (Service Level Agreement) تقيس أداء الشبكة والوصول. النمط الأكثر شيوعًا هو probe ICMP-echo إلى next-hop لمسار ثابت، متتبَّع بكائن track. إذا فشل probe، كائن track يصبح معطلًا ويُزال المسار الثابت من RIB، ما يسمح لمسار احتياطي عائم بتولي الأمر. هذا أساس التوجيه الثابت الموثوق على IOS/IOS XE. على NX-OS الميزة المكافئة تسمى SLA / IP SLA وتستخدم صيغة مشابهة.",
    parameters: [
      {
        name: "<operation-number>",
        description: "رقم عملية IP SLA (1-2147483647).",
        required: true,
      },
      {
        name: "frequency <seconds>",
        description: "فترة التشغيل.",
        required: false,
        defaultValue: "60",
      },
      {
        name: "timeout <milliseconds>",
        description: "مهلة الانتظار للرد.",
        required: false,
        defaultValue: "5000",
      },
    ],
    examples: [
      {
        context: "probe ICMP-echo إلى بوابة ISP، كل 5 ثوانٍ، مع tracking",
        code: "Router(config)# ip sla 10\nRouter(config-ip-sla)# icmp-echo 203.0.113.1 source-interface GigabitEthernet0/0/0\nRouter(config-ip-sla-echo)# frequency 5\nRouter(config-ip-sla-echo)# timeout 2000\nRouter(config-ip-sla-echo)# exit\nRouter(config)# ip sla schedule 10 life forever start-time now\nRouter(config)# track 1 ip sla 10 reachability\nRouter(config-track)# exit\nRouter(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1 track 1",
      },
    ],
    verificationCommands: ["show ip sla statistics", "show track", "show ip route track-table"],
    troubleshootingNotes: [
      "إذا عرض show ip sla statistics 'Number of failures 0' لكن المسار المتتبَّع مفقود، تحقق من حالة كائن track بـ show track.",
    ],
    undoMethod: "no ip sla <operation-number>.",
    references: [
      {
        label: "Cisco IOS IP SLAs Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipsla/configuration/17-12/ipsla-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-route-static", "cmd-track"],
    tags: ["routing", "sla", "tracking", "enarsi"],
  },
  {
    id: "cmd-track",
    name: "track",
    syntax: "track <object-number> {ip sla <operation> reachability | interface <iface> line-protocol | ip route <network> <mask> reachability | list ...}",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.2(33)SXH+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(config-track)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "Network Assurance",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary:
      "ينشئ كائن track يراقب حالة probe IP SLA، أو بروتوكول خط واجهة، أو وجود مسار، أو قائمة boolean. يُستخدم لجعل المسارات الثابتة وقرارات Policy-Based Routing ديناميكية.",
    description:
      "كائنات track تربط بين الحالات المراقَبة (وصول IP SLA، حالة واجهة، وجود مسار) والمستهلكين (مسارات ثابتة، PBR، أولوية VRRP/HSRP). حالة الكائن (Up/Down) يحددها الشرط التحتي. track lists تجمع عدة كائنات بـ boolean AND/OR. نمط شائع: تتبّع IP SLA إلى next-hop، إرفاق track بالمسار الثابت الأساسي — عند فشل probe، يُزال المسار ويتولى احتياطي عائم.",
    parameters: [
      {
        name: "<object-number>",
        description: "رقم كائن track (1-1000).",
        required: true,
      },
      {
        name: "ip sla <operation> reachability",
        description: "يتتبّع وصول probe IP SLA.",
        required: false,
      },
      {
        name: "interface <iface> line-protocol",
        description: "يتتبّع بروتوكول خط الواجهة.",
        required: false,
      },
    ],
    examples: [
      {
        context: "تتبّع probe IP SLA وإرفاقه بمسار ثابت",
        code: "Router(config)# track 1 ip sla 10 reachability\nRouter(config-track)# delay down 5 up 2\nRouter(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1 track 1",
      },
    ],
    verificationCommands: ["show track", "show track 1"],
    references: [
      {
        label: "Cisco IOS IP SLAs and Tracking Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipsla/configuration/17-12/ipsla-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-sla", "cmd-ip-route-static"],
    tags: ["routing", "tracking", "enarsi"],
  },
  {
    id: "cmd-ip-dhcp-snooping",
    name: "ip dhcp snooping",
    syntax: "ip dhcp snooping\nip dhcp snooping vlan <vlan-list>\nip dhcp snooping trust (interface)\nip dhcp snooping limit rate <pps> (interface)",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.2+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "Interface Configuration"],
    promptShape: "Switch(config)# / Switch(config-if)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "Switch Security",
    category: "Security",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary:
      "يُفعّل DHCP snooping: ميزة أمان Layer 2 تميّز منافذ خادم DHCP الموثوقة عن منافذ العميل غير الموثوقة، تمنع خوادم DHCP المارقة.",
    description:
      "DHCP snooping يحمي الشبكة من خوادم DHCP المارقة بتصنيف المنافذ إلى موثوقة (مسموح لها إرسال DHCP offers) أو غير موثوقة (DHCP discover/request فقط مسموح). الأمر العالمي يُفعّل الميزة؛ ip dhcp snooping vlan <list> يُفعّلها على VLANs محددة. على كل محول، منافذ trunk/uplink إلى خوادم DHCP المعروفة يجب أن تُوسم trusted (ip dhcp snooping trust)؛ كل منافذ access المواجهة للمستخدم تبقى untrusted. تحديد المعدل (ip dhcp snooping limit rate <pps>) يمنع هجمات DHCP-starvation DoS. snooping أيضًا يبني binding table تُستخدم بواسطة Dynamic ARP Inspection و IP Source Guard.",
    parameters: [
      {
        name: "vlan <vlan-list>",
        description: "قائمة VLANs لتفعيل snooping عليها. مثال: 10,20,30.",
        required: false,
      },
      {
        name: "trust",
        description: "يوسم المنفذ كـ trusted (واجهة).",
        required: false,
      },
      {
        name: "limit rate <pps>",
        description: "حد معدل حزم DHCP للمنفذ (واجهة).",
        required: false,
      },
    ],
    examples: [
      {
        context: "تفعيل snooping على VLAN 10، 20، 30؛ وسم uplink إلى خادم DHCP كـ trusted",
        code: "Switch(config)# ip dhcp snooping\nSwitch(config)# ip dhcp snooping vlan 10,20,30\nSwitch(config)# interface GigabitEthernet1/0/48\nSwitch(config-if)# ip dhcp snooping trust\nSwitch(config-if)# ip dhcp snooping limit rate 100\nSwitch(config)# interface range GigabitEthernet1/0/1 - 47\nSwitch(config-if-range)# ip dhcp snooping limit rate 15",
      },
    ],
    verificationCommands: ["show ip dhcp snooping", "show ip dhcp snooping binding", "show ip dhcp snooping statistics"],
    troubleshootingNotes: [
      "إذا لم يحصل العملاء على DHCP بعد تفعيل snooping، نسيت وسم uplink نحو خادم DHCP كـ trusted. تحقق بـ show ip dhcp snooping.",
    ],
    commonErrors: [
      "نسيان ip dhcp snooping trust على uplink نحو خادم DHCP — كل عروض DHCP تُسقَط.",
    ],
    undoMethod: "no ip dhcp snooping + no ip dhcp snooping vlan <list> + no ip dhcp snooping trust (interface).",
    references: [
      {
        label: "Catalyst 9300 Security Configuration Guide — DHCP Snooping",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_9300l/dhcp_snooping.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-dhcp-pool", "cmd-ip-arp-inspection"],
    tags: ["security", "switching", "dhcp", "snooping", "enarsi"],
  },
  {
    id: "cmd-ip-arp-inspection",
    name: "ip arp inspection",
    syntax: "ip arp inspection vlan <vlan-list>\nip arp inspection validate {src-mac | dst-mac | ip} [,...]\ninterface <iface>\n  ip arp inspection trust",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.2+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "Interface Configuration"],
    promptShape: "Switch(config)# / Switch(config-if)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "Switch Security",
    category: "Security",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary:
      "Dynamic ARP Inspection (DAI) يستخدم binding table لـ DHCP snooping للتحقق من حزم ARP على منافذ access غير الموثوقة، يمنع هجمات ARP spoofing / man-in-the-middle.",
    description:
      "DAI يمنع هجمات ARP poisoning (مضيف يرسل ردود ARP مزيفة لاعتراض الحركة) بالتحقق من حزم ARP على المنافذ غير الموثوقة ضد binding table لـ DHCP snooping. على منفذ untrusted، ردود ARP تُفحص: IP و MAC المرسِل في حمولة ARP يجب أن يطابقا إدخالًا في binding table، AND MAC المصدر في رأس Ethernet يجب أن يطابق ARP sender MAC. منافذ trunk/uplink نحو محولات أخرى يجب أن تُوسم trusted. ip arp inspection validate src-mac dst-mac ip يُفعّل التحقق الثلاثي كله (موصى به).",
    parameters: [
      {
        name: "vlan <vlan-list>",
        description: "قائمة VLANs لتفعيل DAI عليها.",
        required: true,
      },
      {
        name: "validate {src-mac | dst-mac | ip}",
        description: "أنواع التحقق. استخدم الكل الثلاثة.",
        required: false,
      },
      {
        name: "trust",
        description: "يوسم المنفذ كـ trusted (واجهة).",
        required: false,
      },
    ],
    examples: [
      {
        context: "تفعيل DAI على VLANs المستخدمين مع تحقق كامل",
        code: "Switch(config)# ip arp inspection vlan 10,20,30\nSwitch(config)# ip arp inspection validate src-mac dst-mac ip\nSwitch(config)# interface GigabitEthernet1/0/48\nSwitch(config-if)# ip arp inspection trust",
      },
    ],
    verificationCommands: ["show ip arp inspection", "show ip arp inspection interfaces", "show ip arp inspection statistics"],
    troubleshootingNotes: [
      "إذا أُسقطت طلبات ARP الشرعية بعد تفعيل DAI، فـ IP المضيف لم يُتعلَّم عبر DHCP snooping (IP ثابت). إما انقل المضيف إلى DHCP أو أضف ARP ACL ثابت.",
    ],
    references: [
      {
        label: "Catalyst 9300 Security Configuration Guide — DAI",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_9300l/dai.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-dhcp-snooping"],
    tags: ["security", "switching", "arp", "enarsi"],
  },

  // =================================================================
  // Historical / Deprecated / Legacy — RIPv2, ISL, frame-relay
  // =================================================================
  {
    id: "cmd-router-rip",
    name: "router rip",
    syntax: "router rip\n  version 2\n  network <classful-network>\n  no auto-summary",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 9.0+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "Router Configuration"],
    promptShape: "Router(config)# → Router(config-router)#",
    certLevel: "Extended",
    scope: "extended",
    topic: "RIPv2 (Historical)",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120) — كان مطلوبًا", "CCNA v2.0 (200-301) — خارج النطاق"],
    status: "NotInCurrentExamScope",
    historicalNote:
      "RIPv2 (Routing Information Protocol version 2) كان جزءًا من منهج CCNA القديم (200-120) لكنه أُزيل من CCNA v2.0 (200-301) الحالي. البروتوكول لا يزال مدعومًا فنيًا على IOS/IOS XE لكنه نادر الاستخدام في الإنتاج بسبب قيوده (حد 15 قفزة، تقارب بطيء، إعلان دوري كامل للجدول). محفوظ في الموسوعة لفهم المناهج التاريخية والشبكات القديمة التي قد تواجهها.",
    modernAlternative: "OSPF أو EIGRP",
    modernAlternativeCommandId: "cmd-router-ospf",
    differencesFromAlternative:
      "RIPv2 بروتوكول distance-vector بحد 15 قفزة وتقارب بطيء (30 ثانية للتحديث). OSPF و EIGRP أسرع بكثير، يدعمان VLSM وتلخيص المسارات، وبدون حد قفزات صارم. RIPv2 يدعم VLSM (على عكس RIPv1) لكنه لا يزال يعلن الجدول كاملاً دوريًا.",
    summary:
      "بروتوكول توجيه تاريخي (RIP version 2) كان مدرجًا في منهج CCNA القديم. لا يزال مدعومًا فنيًا لكنه خارج نطاق CCNA الحالي ونادر الاستخدام في الإنتاج. محفوظ لأغراض الفهم التاريخي.",
    description:
      "RIPv2 هو بروتوكول توجيه distance-vector قياسي (RFC 2453). يدعم VLSM ومصادقة MD5 (تحسينات على RIPv1). حد أقصى 15 قفزة (16 = لا يمكن الوصول). يُعلن الجدول كاملاً كل 30 ثانية (غير فعال). تقارب بطيء (180 ثانية للـ invalid timer، 240 ثانية للـ flush timer). اليوم OSPF و EIGRP هما الخيار المفضّل لأي نشر جديد؛ RIPv2 قد تجده في شبكات قديمة جدًا أو بيئات تعليمية. الأمر version 2 يُفعّل RIPv2 (افتراضيًا يستمع الجهاز لـ v1 و v2 لكن يُرسل v1).",
    parameters: [
      {
        name: "version 2",
        description: "يُفعّل RIPv2 حصريًا (يدعم VLSM ومصادقة MD5).",
        required: false,
      },
      {
        name: "network <classful-network>",
        description: "شبكة صنفية لتفعيل RIP عليها. مثال: network 10.0.0.0.",
        required: false,
      },
      {
        name: "no auto-summary",
        description: "يعطّل التلخيص الصنفي التلقائي. مطلوب لـ VLSM.",
        required: false,
      },
    ],
    examples: [
      {
        context: "إعداد RIPv2 كلاسيكي (لا تستخدمه في نشر جديد)",
        code: "Router(config)# router rip\nRouter(config-router)# version 2\nRouter(config-router)# network 10.0.0.0\nRouter(config-router)# network 192.168.0.0\nRouter(config-router)# no auto-summary",
      },
    ],
    verificationCommands: ["show ip route rip", "show ip protocols", "show ip rip database"],
    warnings: [
      "حد 15 قفزة يجعل RIPv2 غير مناسب لأي شبكة متوسطة أو كبيرة. استخدم OSPF أو EIGRP.",
    ],
    undoMethod: "no router rip.",
    references: [
      {
        label: "Cisco IOS IP Routing: RIP Configuration Guide",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_rip/configuration/17-12/irr-17-12-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-ospf", "cmd-router-eigrp"],
    tags: ["routing", "rip", "historical", "legacy"],
  },
  {
    id: "cmd-frame-relay",
    name: "frame-relay (historical)",
    syntax: "encapsulation frame-relay [ietf | cisco]\nframe-relay interface-dlci <dlci>\nframe-relay lmi-type {cisco | ansi | q933a}",
    platforms: ["IOS"],
    versionRange: "IOS 10.0+ — مدعوم على ISR G1/G2، نادر على IOS XE الحديث",
    cliMode: ["Interface Configuration"],
    promptShape: "Router(config-if)#",
    certLevel: "Extended",
    scope: "extended",
    topic: "Legacy WAN",
    category: "WAN",
    curriculumVersions: ["CCNA v1.0 (200-120) — كان مطلوبًا", "CCNA v2.0 (200-301) — خارج النطاق"],
    status: "Obsolete",
    historicalNote:
      "Frame Relay كان بروتوكول WAN شائع في التسعينيات وأوائل الألفينيات، مدرجًا في مناهج CCNA القديمة. أُزيل من CCNA v2.0 (200-301) الحالي. الدعم الفني على IOS XE الحديث محدود جدًا والبروتوكول منتهٍ فعليًا في الإنتاج. محفوظ في الموسوعة لفهم المناهج التاريخية والشبكات القديمة جدًا.",
    modernAlternative: "MPLS، Metro Ethernet، VPN/IPsec",
    differencesFromAlternative:
      "Frame Relay كان خدمة WAN مُدارة من مزوّد، تستخدم DLCIs و LMI للإشارة. MPLS الحديث يوفر نفس فصل الحركة لكن بأداء أعلى ومرونة أكبر. Metro Ethernet يوفر Ethernet مباشر على الألياف. VPN/IPsec يوفر اتصال آمن عبر الإنترنت العام.",
    summary:
      "بروتوكول WAN تاريخي كان مدرجًا في مناهج CCNA القديمة. منتهٍ فعليًا في الإنتاج. محفوظ لأغراض الفهم التاريخي فقط.",
    description:
      "Frame Relay كان بروتوكول WAN شائعًا يستخدم خدمة مُدارة من مزوّد لإيصال عدة مواقع عبر شبكة مشتركة. يستخدم DLCIs (Data Link Connection Identifiers) لتمييز PVCs/SVCs، و LMI (Local Management Interface) للإشارة بين DCE و DTE. تم استبداله اليوم بـ MPLS، Metro Ethernet، و VPN/IPsec. الدعم على IOS XE الحديث محدود جدًا. تجده فقط في شبكات قديمة جدًا أو بيئات تعليمية.",
    parameters: [
      {
        name: "ietf | cisco",
        description: "نوع التغليف. cisco (افتراضي) خاص بـ Cisco. ietf معياري.",
        required: false,
        defaultValue: "cisco",
      },
      {
        name: "<dlci>",
        description: "معرّف DLCI المحلي (16-1007).",
        required: true,
      },
      {
        name: "lmi-type",
        description: "نوع LMI. cisco، ansi (Annex D)، q933a (ITU-T).",
        required: false,
        defaultValue: "cisco",
      },
    ],
    examples: [
      {
        context: "إعداد Frame Relay تاريخي (لا تستخدمه في نشر جديد)",
        code: "Router(config)# interface Serial0/0/0\nRouter(config-if)# encapsulation frame-relay ietf\nRouter(config-if)# frame-relay lmi-type ansi\nRouter(config-if)# frame-relay interface-dlci 100\nRouter(config-fr-dlci)# exit",
      },
    ],
    verificationCommands: ["show frame-relay pvc", "show frame-relay lmi", "show frame-relay map"],
    warnings: [
      "Frame Relay منتهٍ فعليًا في الإنتاج. لا تستخدمه في أي نشر جديد. هذه المعلومات للفهم التاريخي فقط.",
    ],
    undoMethod: "no encapsulation frame-relay.",
    references: [
      {
        label: "Cisco IOS Wide-Area Networking Command Reference (legacy)",
        url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/wan/command/wan-cr-book.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: [],
    tags: ["wan", "frame-relay", "historical", "legacy", "obsolete"],
  },
  {
    id: "cmd-vtp",
    name: "vtp",
    syntax: "vtp mode {server | client | transparent | off}\nvtp domain <domain-name>\nvtp password <password>\nvtp version {1 | 2 | 3}",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 11.0+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "VLAN Configuration"],
    promptShape: "Switch(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "VLANs and SVI",
    category: "Switching",
    curriculumVersions: ["CCNA v1.0 (200-120) — كان مفصلًا", "CCNA v2.0 (200-301) — مختصر"],
    status: "Current",
    historicalNote:
      "VTP (VLAN Trunking Protocol) كان مفصلًا في منهج CCNA القديم (200-120) بما يشمل أوضاع server/client/transparent واستكشاف أخطاء VTP. في CCNA v2.0 (200-301) الحالي، يُذكر بشكل مختصر فقط. البروتوكول لا يزال مدعومًا فنيًا على IOS/IOS XE لكن استخدام VTP v1/v2 في الإنتاج يُنصح بتجنّبه بسبب مخاطر إعادة كتابة قاعدة VLAN عن طريق الخطأ. VTP v3 أضاف حماية أفضل.",
    modernAlternative: "إعداد VLAN يدوي على كل محول (الممارسة المفضّلة)",
    differencesFromAlternative:
      "الإعداد اليدوي لـ VLANs على كل محول آمن لكنه يتطلب عملاً يدويًا أكثر. VTP يُبسّط الإدارة لكنه خطر: توصيل محول بإعداد VTP revision number أعلى يمكن أن يحذف كل VLANs على الشبكة. VTP v3 يخفف هذا الخطر لكن لا يزال معقدًا.",
    summary:
      "VTP (VLAN Trunking Protocol) يُزامن قاعدة بيانات VLAN بين محولات. كان مفصلًا في CCNA القديم لكن يُذكر باختصار في CCNA الحالي. استخدم بحذر — خطر إعادة كتابة قاعدة VLAN حقيقي.",
    description:
      "VTP يُزامن أسماء وأرقام VLAN بين محولات في نفس VTP domain عبر روابط trunk. الأوضاع: server (يعدّل ويُزامن)، client (يستقبل فقط)، transparent (لا يُزامن لكن يعيد الإرسال)، off (VTP معطل). VTP v3 أضاف دعمًا لـ Private VLANs وحماية better (password لـ server). المخاطر: توصيل محول جديد بإعداد VTP revision number أعلى من البقية يمكن أن يحذف كل VLANs على الشبكة. لذلك الممارسة الفضلى الحديثة هي وضع كل محول في VTP mode transparent أو off وإعداد VLANs يدويًا.",
    parameters: [
      {
        name: "mode",
        description: "الوضع: server، client، transparent، off. استخدم transparent/off للإنتاج.",
        required: true,
        allowedValues: ["server", "client", "transparent", "off"],
      },
      {
        name: "<domain-name>",
        description: "اسم VTP domain. يجب أن يتطابق بين المحولات.",
        required: false,
      },
      {
        name: "version {1 | 2 | 3}",
        description: "إصدار VTP. v3 يضيف حماية ودعم Private VLANs.",
        required: false,
        defaultValue: "1",
      },
    ],
    examples: [
      {
        context: "تعطيل VTP (الممارسة الفضلى الحديثة)",
        code: "Switch(config)# vtp mode transparent\nSwitch(config)# vtp domain \"\"\nSwitch(config)# no vtp password",
      },
      {
        context: "إعداد VTP v3 server (للشبكات التي تستخدم VTP)",
        code: "Switch(config)# vtp domain ENTERPRISE\nSwitch(config)# vtp version 3\nSwitch(config)# vtp mode server\nSwitch(config)# vtp password Str0ngVTPPass hidden",
      },
    ],
    verificationCommands: ["show vtp status", "show vtp password", "show vtp counters"],
    warnings: [
      "توصيل محول جديد بإعداد VTP revision number أعلى يمكن أن يحذف كل VLANs على الشبكة. ضع دائمًا المحولات الجديدة في VTP mode transparent أولًا، ثم امسح vlan.dat، ثم انضم للـ domain.",
      "تجنّب VTP v1/v2 في الإنتاج. إذا استخدمت VTP، استخدم v3 مع password.",
    ],
    troubleshootingNotes: [
      "إذا اختفت VLANs فجأة من شبكة، افحص show vtp status على كل محول — likely محولًا جديدًا أعاد كتابة قاعدة VLANات.",
    ],
    undoMethod: "no vtp mode / no vtp domain / no vtp password.",
    references: [
      {
        label: "Catalyst 9300 Layer 2 Configuration Guide — VTP",
        url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/l2/b_1712_l2_9300_9300l/vlans.html",
      },
    ],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-vlan", "cmd-switchport-access-vlan"],
    tags: ["switching", "vlan", "vtp", "ccna"],
  },
];

export const TOPIC_COVERAGE: TopicCoverage[] = [
  { topic: "CLI Modes", category: "Fundamentals", certLevel: "Fundamentals", totalIdentified: 8, documented: 5, verified: 5, needsReview: 0, coverageState: "partial" },
  { topic: "Configuration Inspection", category: "Fundamentals", certLevel: "Fundamentals", totalIdentified: 6, documented: 2, verified: 2, needsReview: 0, coverageState: "partial" },
  { topic: "Configuration Management", category: "Fundamentals", certLevel: "Fundamentals", totalIdentified: 8, documented: 4, verified: 4, needsReview: 0, coverageState: "partial" },
  { topic: "System Inspection", category: "Fundamentals", certLevel: "Fundamentals", totalIdentified: 8, documented: 3, verified: 3, needsReview: 0, coverageState: "partial" },
  { topic: "Device Identity", category: "Fundamentals", certLevel: "Fundamentals", totalIdentified: 5, documented: 2, verified: 2, needsReview: 0, coverageState: "partial" },
  { topic: "Management Access", category: "Fundamentals", certLevel: "Fundamentals", totalIdentified: 12, documented: 7, verified: 7, needsReview: 0, coverageState: "partial" },
  { topic: "Connectivity Verification", category: "Fundamentals", certLevel: "Fundamentals", totalIdentified: 6, documented: 2, verified: 2, needsReview: 0, coverageState: "partial" },
  { topic: "Interface Inspection", category: "Fundamentals", certLevel: "Fundamentals", totalIdentified: 10, documented: 3, verified: 3, needsReview: 0, coverageState: "partial" },
  { topic: "Diagnostics", category: "Fundamentals", certLevel: "Fundamentals", totalIdentified: 15, documented: 1, verified: 1, needsReview: 0, coverageState: "partial" },
  { topic: "Security", category: "Security", certLevel: "Fundamentals", totalIdentified: 15, documented: 4, verified: 4, needsReview: 0, coverageState: "partial" },
  { topic: "VLANs and SVI", category: "Switching", certLevel: "CCNA", totalIdentified: 14, documented: 5, verified: 5, needsReview: 0, coverageState: "partial" },
  { topic: "Spanning Tree Protocol", category: "Switching", certLevel: "CCNA", totalIdentified: 18, documented: 3, verified: 3, needsReview: 0, coverageState: "partial" },
  { topic: "EtherChannel / LAG", category: "Switching", certLevel: "CCNP-ENCOR", totalIdentified: 10, documented: 2, verified: 2, needsReview: 0, coverageState: "partial" },
  { topic: "Switch Security", category: "Security", certLevel: "CCNA", totalIdentified: 12, documented: 3, verified: 3, needsReview: 0, coverageState: "partial" },
  { topic: "IP Routing", category: "Routing", certLevel: "CCNA", totalIdentified: 10, documented: 4, verified: 4, needsReview: 0, coverageState: "partial" },
  { topic: "Static Routing", category: "Routing", certLevel: "CCNA", totalIdentified: 6, documented: 1, verified: 1, needsReview: 0, coverageState: "partial" },
  { topic: "OSPF", category: "Routing", certLevel: "CCNA", totalIdentified: 22, documented: 6, verified: 6, needsReview: 0, coverageState: "partial" },
  { topic: "EIGRP", category: "Routing", certLevel: "CCNA", totalIdentified: 18, documented: 3, verified: 3, needsReview: 0, coverageState: "partial" },
  { topic: "RIPv2 (Historical)", category: "Routing", certLevel: "Extended", totalIdentified: 5, documented: 1, verified: 1, needsReview: 0, coverageState: "partial" },
  { topic: "BGP", category: "Routing", certLevel: "CCNP-ENCOR", totalIdentified: 30, documented: 4, verified: 4, needsReview: 0, coverageState: "partial" },
  { topic: "Route Policy", category: "Routing", certLevel: "CCNP-ENARSI", totalIdentified: 14, documented: 2, verified: 2, needsReview: 0, coverageState: "partial" },
  { topic: "Route Redistribution", category: "Routing", certLevel: "CCNP-ENARSI", totalIdentified: 8, documented: 1, verified: 1, needsReview: 0, coverageState: "partial" },
  { topic: "Policy-Based Routing", category: "Routing", certLevel: "CCNP-ENARSI", totalIdentified: 6, documented: 1, verified: 1, needsReview: 0, coverageState: "partial" },
  { topic: "IPv6", category: "Routing", certLevel: "CCNA", totalIdentified: 16, documented: 3, verified: 3, needsReview: 0, coverageState: "partial" },
  { topic: "Network Assurance", category: "Routing", certLevel: "CCNP-ENARSI", totalIdentified: 8, documented: 2, verified: 2, needsReview: 0, coverageState: "partial" },
  { topic: "Access Control", category: "Security", certLevel: "CCNA", totalIdentified: 12, documented: 3, verified: 3, needsReview: 0, coverageState: "partial" },
  { topic: "VPN / IPsec", category: "Security", certLevel: "CCNP-ENCOR", totalIdentified: 16, documented: 3, verified: 3, needsReview: 0, coverageState: "partial" },
  { topic: "Tunnels", category: "WAN", certLevel: "CCNP-ENCOR", totalIdentified: 8, documented: 1, verified: 1, needsReview: 0, coverageState: "partial" },
  { topic: "NAT", category: "Services", certLevel: "CCNA", totalIdentified: 8, documented: 3, verified: 3, needsReview: 0, coverageState: "partial" },
  { topic: "DHCP", category: "Services", certLevel: "CCNA", totalIdentified: 10, documented: 3, verified: 3, needsReview: 0, coverageState: "partial" },
  { topic: "Discovery", category: "Services", certLevel: "CCNA", totalIdentified: 6, documented: 3, verified: 3, needsReview: 0, coverageState: "partial" },
  { topic: "Time & Logging", category: "Services", certLevel: "CCNA", totalIdentified: 10, documented: 3, verified: 3, needsReview: 0, coverageState: "partial" },
  { topic: "First Hop Redundancy", category: "Services", certLevel: "CCNA", totalIdentified: 8, documented: 1, verified: 1, needsReview: 0, coverageState: "partial" },
  { topic: "QoS", category: "Services", certLevel: "CCNP-ENCOR", totalIdentified: 16, documented: 3, verified: 3, needsReview: 0, coverageState: "partial" },
  { topic: "Management & Monitoring", category: "Services", certLevel: "CCNA", totalIdentified: 14, documented: 2, verified: 2, needsReview: 0, coverageState: "partial" },
  { topic: "Automation & Programmability", category: "Automation", certLevel: "CCNP-ENCOR", totalIdentified: 18, documented: 2, verified: 2, needsReview: 0, coverageState: "partial" },
  { topic: "CCNP Security — ASA CLI", category: "Specialization", certLevel: "Specialization", totalIdentified: 30, documented: 0, verified: 0, needsReview: 0, coverageState: "not-started" },
  { topic: "CCNP Data Center — NX-OS", category: "Specialization", certLevel: "Specialization", totalIdentified: 25, documented: 0, verified: 0, needsReview: 0, coverageState: "not-started" },
  { topic: "CCNP Service Provider — IOS XR", category: "Specialization", certLevel: "Specialization", totalIdentified: 28, documented: 0, verified: 0, needsReview: 0, coverageState: "not-started" },
  { topic: "CCNP Wireless — 9800 WLC", category: "Specialization", certLevel: "Specialization", totalIdentified: 22, documented: 0, verified: 0, needsReview: 0, coverageState: "not-started" },
  { topic: "CCNP Collaboration — CUCM/Expressway", category: "Specialization", certLevel: "Specialization", totalIdentified: 20, documented: 0, verified: 0, needsReview: 0, coverageState: "not-started" },
];

export const TROUBLESHOOTING: TroubleshootingEntry[] = [
  {
    id: "ts-no-route",
    problem: "تعذر الوصول إلى شبكة وجهة — تُسقط الحزم عند الموجّه المحلي",
    category: "Routing",
    symptoms: [
      "ping يُعيد 'Destination unreachable' أو '*' (انتهاء المهلة) فورًا",
      "traceroute يفشل عند الموجّه المحلي",
      "التطبيقات تنتهي مهلتها عند الاتصال بالوجهة",
    ],
    possibleCauses: [
      "لا يوجد مسار في RIB يطابق الوجهة (استخدم show ip route <dest>)",
      "المسار موجود لكن next-hop غير قابل للوصول (فشل التحويل التكراري)",
      "ACL يُسقط الحركة بصمت على واجهة الخروج",
      "إساءة تكوين NAT تترجم المصدر إلى عنوان غير قابل للوصول",
      "تجاور بروتوكول التوجيه معطل — لا مسارات متعلّمة",
    ],
    diagnosisCommands: [
      "show ip route <destination>",
      "show ip route",
      "show ip cef <destination>",
      "traceroute <destination>",
      "show ip protocols",
      "show ip ospf neighbor  /  show bgp summary",
    ],
    resolution: [
      "إذا لم يوجد مسار، تحقق أن بروتوكول التوجيه يعمل وأن الوجهة تُعلَن. افحص show ip protocols و show ip ospf neighbor (أو show bgp summary).",
      "إذا كان المسار موجودًا لكن next-hop غير قابل للوصول، أصلح next-hop أو استخدم مسارًا مختلفًا. استخدم show ip route لتأكيد next-hop و ping next-hop من الجهاز.",
      "إذا كان ACL هو السبب، تحقق من show access-lists لعدّادات الضغط على قواعد الرفض وعدّل وفقًا لذلك.",
      "إذا كانت NAT هي السبب، تحقق من show ip nat translations و access-list المُشار إليها بـ ip nat inside source list.",
    ],
    relatedCommandIds: ["cmd-show-running-config"],
    verification: "Verified",
  },
  {
    id: "ts-ospf-stuck-exstart",
    problem: "جار OSPF عالق في حالة EXSTART أو EXCHANGE",
    category: "Routing",
    symptoms: [
      "show ip ospf neighbor يعرض الجار في حالة EXSTART/EXCHANGE، لا ينتقل أبدًا إلى FULL",
      "مسارات OSPF لـ LSAs ذلك الجار مفقودة",
      "محاولات تبادل DBD متكررة في debug ip ospf adj",
    ],
    possibleCauses: [
      "اختلاف MTU بين الواجهتين — السبب الأكثر شيوعًا",
      "تكرار router-id بين الجارين",
      "مشكلة وصول أحادي الاتجاه (توجيه غير متماثل، ACL يُرشّح البروتوكول 89)",
      "اختلاف المصادقة (مفاتيح أو خوارزميات مختلفة)",
    ],
    diagnosisCommands: [
      "show ip ospf neighbor",
      "show ip ospf interface <iface>",
      "show ip ospf interface brief",
      "debug ip ospf adj",
      "ping <neighbor-ip> size 1500 df-bit",
    ],
    resolution: [
      "اختلاف MTU: تحقق من MTU على الجانبين بـ show ip ospf interface — يجب أن يتطابقا. اضبط بـ mtu 1500 على الواجهة.",
      "تكرار router-id: غيّر router-id لأحد الموجّهات بـ router-id <id> تحت router ospf 1، ثم clear ip ospf process.",
      "ACL يرشّح OSPF (البروتوكول 89): تحقق أنه لا ACL داخلي على الواجهة يمنع البروتوكول 89.",
      "المصادقة: تأكد أن الجانبين يستخدمان نفس message-digest key و key-id والخوارزمية. استخدم show ip ospf interface لرؤية المصادقة المُعدّة.",
    ],
    verification: "Verified",
  },
  {
    id: "ts-bgp-idle",
    problem: "جار BGP عالق في حالة Idle",
    category: "Routing",
    symptoms: [
      "show bgp summary يعرض الجار في حالة Idle",
      "لا prefixes مستقبَلة من ذلك الجار",
      "اتصال TCP port 179 لم يُنشأ قط",
    ],
    possibleCauses: [
      "لا مسار إلى IP الجار — الموجّه المحلي لا يصل للنظير",
      "ACL يمنع TCP port 179 داخليًا أو خارجيًا",
      "IP الجار أو remote-as مُساء تكوينهما",
      "للـ eBGP multihop، مفقود ebgp-multihop ولا مسار للنظير",
      "اختلاف المصادقة (BGP MD5 password مختلف)",
      "اختلاف IP المصدر — الموجّه المحلي يصدر من واجهة خاطئة",
    ],
    diagnosisCommands: [
      "show bgp summary",
      "show bgp neighbors <ip>",
      "show ip route <neighbor-ip>",
      "ping <neighbor-ip> source <iface>",
      "show access-lists",
      "debug bgp ipv4 unicast updates",
    ],
    resolution: [
      "تحقق من المسار إلى الجار بـ show ip route <neighbor-ip>. إذا كان مفقودًا، أصلح التوجيه التحتي.",
      "تحقق من ACLs على واجهة الخروج — TCP 179 يجب أن يُسمح في الاتجاهين.",
      "تحقق أن neighbor <ip> remote-as <as> يطابق رقم AS للنظير. إذا استخدمت peering عبر loopback، اضبط neighbor <ip> update-source Loopback0.",
      "لـ eBGP multihop، أضف neighbor <ip> ebgp-multihop <ttl>.",
      "إذا كانت مصادقة MD5 مُفعّلة، تأكد أن الجانبين يستخدمان نفس كلمة السر.",
      "استخدم clear bgp ipv4 unicast <ip> لإعادة المحاولة بعد إصلاح الإعداد.",
    ],
    verification: "Verified",
  },
  {
    id: "ts-vlan-not-trunking",
    problem: "حركة VLAN لا تعبر رابط trunk",
    category: "Switching",
    symptoms: [
      "مضيفون على نفس VLAN لكن على محولات مختلفة لا يتواصلون",
      "show interfaces trunk يعرض VLAN مفقود من 'Vlans allowed and active'",
      "CDP/LLDP بين المحولات سليم لكن اتصالية Layer 2 تفشل",
    ],
    possibleCauses: [
      "VLAN غير منشأة على أحد المحولات (show vlan)",
      "VLAN ليس في قائمة المسموح على الـ trunk (switchport trunk allowed vlan)",
      "الـ trunk ليس trunkًا فعلًا — الجانبان 'dynamic auto' (لا يتفاوضان أبدًا)",
      "اختلاف native VLAN — CDP سيُسجّل تحذيرًا",
      "VTP pruning أزال VLAN من الـ trunk",
    ],
    diagnosisCommands: [
      "show vlan",
      "show interfaces trunk",
      "show interfaces <iface> switchport",
      "show vtp status",
    ],
    resolution: [
      "تحقق أن VLAN موجودة على كلا المحولين بـ show vlan id <vlan>.",
      "أضف VLAN إلى قائمة المسموح على الـ trunk: switchport trunk allowed vlan add <vlan>.",
      "افرض وضع trunk على جانب واحد على الأقل: switchport mode trunk.",
      "تحقق أن native VLAN متطابقة على الجانبين: show interfaces <iface> trunk.",
      "عطّل VTP pruning أو أضف VLAN إلى قائمة pruning-eligible.",
    ],
    verification: "Verified",
  },
  {
    id: "ts-port-err-disabled",
    problem: "منفذ محول في حالة err-disabled ويرفض الإقلاع",
    category: "Switching",
    symptoms: [
      "show interfaces status يعرض المنفذ في حالة 'err-disabled'",
      "المضيف المتصل بالمنفذ لا اتصالية له",
      "shutdown/no shutdown يستعيد المنفذ لكنه يعود err-disabled خلال ثوانٍ",
    ],
    possibleCauses: [
      "BPDU Guard استقبل BPDU على منفذ PortFast access (الأكثر شيوعًا)",
      "انتهاك Port Security (تجاوز حد MAC)",
      "UDLD كشف رابطًا أحادي الاتجاه",
      "تجاوز حد معدل ARP inspection",
      "تجاوز حد معدل DHCP snooping",
      "كشف link-flap",
    ],
    diagnosisCommands: [
      "show interfaces status err-disabled",
      "show errdisable recovery",
      "show port-security",
      "show udld",
    ],
    resolution: [
      "حدد السبب من show interfaces status err-disabled (عمود 'Reason').",
      "لـ BPDU Guard: أزل الجهاز المُساء السلوك (غالبًا محول وُصل)، ثم shutdown/no shutdown للمنفذ.",
      "لـ Port Security: حدد MACs المخالفة بـ show port-security address، ثم clear port-security sticky <iface> أو shutdown/no shutdown.",
      "لـ UDLD: استبدل الألياف/الكابل المعيب، ثم udld reset لمسح حالة err-disabled.",
      "اختياريًا فعّل الاسترداد التلقائي: errdisable recovery cause <reason> و errdisable recovery interval 300.",
    ],
    verification: "Verified",
  },
  {
    id: "ts-hsrp-flapping",
    problem: "حالة HSRP active/standby تتذبذب باستمرار",
    category: "Services",
    symptoms: [
      "show standby brief يعرض الموجّه active يتغير كل بضع ثوانٍ",
      "المضيفون يفقدون اتصالية البوابة الافتراضية بشكل متقطع",
      "syslog يعرض تغييرات حالة HSRP متكررة",
    ],
    possibleCauses: [
      "hellos HSRP تُسقَط — ازدحام واجهة، CPU مشغول، أو ACL يرشّح UDP 1985",
      "كلا الموجّهين لا يرى hellos الآخر — كلاهما يصبح active في وقت واحد",
      "توجيه غير متماثل — حركة العودة تأخذ مسارًا مختلفًا وتكسر hellos",
      "اختلاف إصدار HSRP (v1 لا يتفاعل مع v2)",
      "تصادم MAC مدمج على MAC الافتراضي",
      "حلقة شبكة تسبب تكرار hello packets",
    ],
    diagnosisCommands: [
      "show standby brief",
      "show standby",
      "show processes cpu sorted",
      "show interfaces <iface> | include drops|errors",
      "debug standby events icmp",
    ],
    resolution: [
      "تحقق أن كلا الموجّهين يستطيعان ping IP واجهة الآخر. إذا لا، أصلح اتصالية L2/L3 أولًا.",
      "تحقق من CPU بـ show processes cpu sorted — CPU عالٍ يُسقط hellos HSRP.",
      "تحقق من إسقاطات الواجهة بـ show interfaces <iface> — إسقاطات داخلة تدل على ازدحام.",
      "تحقق من تطابق إصدار HSRP على كلا الموجّهين (show standby).",
      "تحقق من تطابق رقم مجموعة HSRP؛ المجموعة 0 v1 تستخدم MAC افتراضي مختلف (0000.0C07.AC00) عن v2 (0000.0C9F.F000).",
      "زد مؤقتات HSRP عند الحاجة: standby <group> timers 5 15 (hello 5s، hold 15s).",
    ],
    verification: "Verified",
  },
  {
    id: "ts-dhcp-clients-no-address",
    problem: "عملاء DHCP لا يحصلون على عناوين",
    category: "Services",
    symptoms: [
      "العملاء يعرضون عناوين 'APIPA' 169.254.x.x (Windows) أو لا IPv4",
      "show ip dhcp binding على الخادم يعرض لا روابط للشبكة الفرعية",
      "DHCPDISCOVER لا يصل الخادم (إساءة تكوين relay agent)",
    ],
    possibleCauses: [
      "خادم DHCP غير مُعَد للشبكة الفرعية (لا pool، network statement خاطئ)",
      "pool مستنفد — كل العناوين في show ip dhcp binding",
      "relay agent (ip helper-address) مفقود على SVI",
      "DHCP snooping يمنع DHCPDISCOVER على محول access",
      "ACL يرشّح منافذ UDP 67/68",
    ],
    diagnosisCommands: [
      "show ip dhcp pool",
      "show ip dhcp binding",
      "show ip dhcp server statistics",
      "show ip interface <iface>",
      "debug ip dhcp server packet",
    ],
    resolution: [
      "تحقق أن pool موجود لشبكة العملاء بـ show ip dhcp pool. إذا مفقود، أنشئ بـ ip dhcp pool <name> و network <ip> <mask>.",
      "تحقق استغلال pool بـ show ip dhcp binding — إذا كانت كل العناوين مرتبطة، زد حجم pool أو قصّر مدة lease.",
      "إذا كان الخادم بعيدًا، تحقق أن ip helper-address <server-ip> مُعد على SVI المواجه للعملاء.",
      "تحقق من show ip dhcp snooping binding و show ip dhcp snooping statistics إذا كان snooping مفعّلًا — الإسقاطات تدل على إساءة تكوين.",
      "تحقق أن ACLs تسمح بـ UDP 67 و 68 في الاتجاهين.",
    ],
    verification: "Verified",
  },
  {
    id: "ts-ssh-refused",
    problem: "تعذر SSH إلى الجهاز — رفض الاتصال أو انتهاء المهلة",
    category: "Security",
    symptoms: [
      "عميل SSH يبلّغ 'Connection refused' فورًا",
      "عميل SSH يبلّغ 'Connection timed out'",
      "Telnet يعمل لكن SSH لا",
    ],
    possibleCauses: [
      "مفاتيح RSA غير مولّدة (لم يُشغَّل crypto key generate rsa)",
      "SSH غير مفعّل (ip ssh version 2 مفقود)",
      "خطوط VTY لا تقبل SSH (transport input ssh مفقود)",
      "ACL يمنع TCP 22",
      "إساءة تكوين AAA تُغلق المستخدم",
      "اسم مستخدم/كلمة سر خاطئة",
      "IP المصدر محجوب بواسطة ACL إداري",
    ],
    diagnosisCommands: [
      "show ip ssh",
      "show crypto key mypubkeys rsa",
      "show running-config | section line vty",
      "show running-config | include access-class",
      "show users",
    ],
    resolution: [
      "تحقق أن مفاتيح RSA موجودة بـ show crypto key mypubkeys rsa. إذا فارغة، ولّدها بـ crypto key generate rsa modulus 2048.",
      "فعّل SSHv2 بـ ip ssh version 2.",
      "على خطوط VTY، اضبط transport input ssh (أو transport input telnet ssh إذا اضطررت لإبقاء Telnet، لكن لا ينبغي).",
      "تحقق من ACLs المطبّقة بـ access-class على خطوط VTY — تأكد أن IP مصدرك مسموح.",
      "تحقق أن AAA يسمح للمستخدم بـ show aaa user all وافحص debug aaa authentication لأسباب الفشل.",
    ],
    verification: "Verified",
  },
  {
    id: "ts-interface-errors",
    problem: "واجهة تعرض input errors أو CRC errors أو runts",
    category: "Switching",
    symptoms: [
      "show interfaces يعرض input errors أو CRC أو runts أو giants غير صفرية",
      "إنتاجية الرابط أقل من المتوقع",
      "أداء التطبيقات متدهور رغم أن الرابط 'up/up'",
    ],
    possibleCauses: [
      "كابل أو ألياف معيب (الأكثر شيوعًا)",
      "وحدة SFP / GBIC / transceiver معيبة",
      "اختلاف سرعة أو duplex (full-duplex على جانب، half على الآخر)",
      "تداخل كهرومغناطيسي على خطوط النحاس (خصوصًا قرب خطوط جهد عالٍ)",
      "موصل تالف / نهاية ألياف متسخة",
      "طول كابل خارج المواصفات (يتجاوز 100م للنحاس، يتجاوز مسافة OM3/OM4 للألياف)",
    ],
    diagnosisCommands: [
      "show interfaces <iface>",
      "show interfaces <iface> counters errors",
      "show interfaces <iface> detail",
      "clear counters <iface>  (ثم أعد الفحص بعد ساعة)",
    ],
    resolution: [
      "حدد نوع الخطأ من show interfaces <iface>: CRC يدل على طبقة فيزيائية (كابل/SFP)؛ runts تدل على اختلاف duplex أو إطارات أصغر من المتوقع من المنبع؛ giants تدل على اختلاف Q-in-Q أو jumbo-frame.",
      "تحقق من السرعة و duplex على الجانبين بـ show interfaces <iface> — يجب أن يتطابقا. فضّل ضبط السرعة/duplex يدويًا على روابط الألياف (التفاوض التلقائي لا يعمل دائمًا للألياف).",
      "استبدل الكابل/SFP. للألياف، نظف نهايات الموصل بكراسة تنظيف ألياف.",
      "بعد مسح العدّادات والملاحظة لساعة، لا ينبغي تكرار الأخطاء. إذا تكررت، اصعد لـ RMA العتاد.",
    ],
    verification: "Verified",
  },
  {
    id: "ts-clock-unsynchronised",
    problem: "NTP يعرض 'Clock is unsynchronised'",
    category: "Services",
    symptoms: [
      "show ntp status يبلّغ 'Clock is unsynchronised'",
      "طوابع syslog الزمنية خاطئة",
      "الشهادات المستخدمة لوقت الجهاز تفشل في التحقق",
    ],
    possibleCauses: [
      "خادم NTP غير قابل للوصول (توجيه، ACL، أو جدار ناري يمنع UDP 123)",
      "اختلاف مصادقة NTP (key-id، key-string، أو trusted-key مفقود)",
      "خادم NTP stratum-16 — الخادم نفسه غير متزامن",
      "واجهة المصدر غير قابلة للوصول من خادم NTP (فشل مسار العودة)",
      "انحراف ساعة كبير — NTP يرفض تعديل الساعة إذا تجاوز الانجراف 1000 ثانية",
    ],
    diagnosisCommands: [
      "show ntp status",
      "show ntp associations",
      "show ntp associations detail",
      "ping <ntp-server> source <source-iface>",
    ],
    resolution: [
      "افحص show ntp associations detail — قيمة 'reach' يجب أن تنمو عبر استطلاعات متتالية (1, 3, 7, 17, 37, 77, 177, 377). reach 0 يعني الخادم غير قابل للوصول.",
      "تحقق من المسار إلى خادم NTP بـ ping <server> source <iface> باستخدام واجهة المصدر المُعدّة.",
      "تحقق من مصادقة NTP: key-id و key-string و ntp trusted-key يجب أن تتطابق بين العميل والخادم.",
      "إذا كانت الساعة متأخرة بأكثر من 1000 ثانية، اضبط الوقت يدويًا بـ clock set ثم أعد تشغيل NTP: clear ntp service.",
      "إذا كانت عدة خوادم مُعدّة، علّم واحدًا كمفضّل: ntp server <ip> prefer.",
    ],
    verification: "Verified",
  },
];

export const ALL_TOPICS = Array.from(new Set(COMMANDS.map((c) => c.topic))).sort();
export const ALL_CATEGORIES = Array.from(new Set(COMMANDS.map((c) => c.category))).sort();
