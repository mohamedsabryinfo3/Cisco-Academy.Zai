import type { CiscoCommand } from "./cisco-types";

// ===================================================================
// Expansion Pack v12 — Mandatory gap-fill from master audit prompt
// Covers: RIP verification, EIGRP advanced, BGP policy, STP historical,
// IPv6 ACLs, system show commands, IGRP historical record
// ===================================================================

export const V12_COMMANDS: CiscoCommand[] = [
  // === RIP verification ===
  {
    id: "cmd-show-ip-route-rip",
    name: "show ip route rip",
    aliases: ["sh ip route rip"],
    syntax: "show ip route rip",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "Extended",
    scope: "extended",
    topic: "RIPv2 (Historical)",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120) — كان مطلوبًا"],
    status: "NotInCurrentExamScope",
    historicalNote: "show ip route rip كان أمر تحقق أساسي في منهج CCNA القديم (200-120). أُزيل من CCNA v2.0 (200-301). لا يزال مدعومًا فنيًا على IOS/IOS XE لكن RIP نادر الاستخدام في الإنتاج.",
    summary: "يعرض فقط مسارات RIP في جدول التوجيه. أمر تحقق أساسي لتشخيص RIP. تاريخي — خارج CCNA الحالي.",
    description: "show ip route rip يرشّح جدول التوجيه لعرض فقط المسارات المتعلّمة عبر RIP. كل سطر يعرض الشبكة الوجهة، المسافة الإدارية (120 لـ RIP)، المتريك (عدد القفزات)، والـ next-hop. أمر حاسم لتشخيص RIP: إذا لم تظهر مسارات RIP هنا رغم تكوين RIP، فالجيران لا يتبادلون التحديثات.",
    examples: [
      {
        context: "عرض مسارات RIP",
        code: "Router# show ip route rip",
        output: "R    10.10.20.0/24 [120/2] via 10.0.0.2, 00:00:15, GigabitEthernet0/0/0\nR    10.10.30.0/24 [120/3] via 10.0.0.2, 00:00:15, GigabitEthernet0/0/0",
        outputExplanation: "مساران متعلّمان عبر RIP: 10.10.20.0/24 بمتريك 2 قفزات، 10.10.30.0/24 بمتريك 3 قفزات. المسافة الإدارية 120 (RIP). next-hop = 10.0.0.2."
      }
    ],
    verificationCommands: ["show ip route", "show ip protocols", "show ip rip database"],
    references: [{ label: "Cisco IOS IP Routing Command Reference", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute/command/ipr-cr-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-rip", "cmd-show-ip-route"],
    tags: ["routing", "rip", "verification", "historical", "extended"],
  },
  {
    id: "cmd-show-ip-rip-database",
    name: "show ip rip database",
    aliases: ["sh ip rip database", "show rip database"],
    syntax: "show ip rip database",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.0+؛ IOS XE كافة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "Extended",
    scope: "extended",
    topic: "RIPv2 (Historical)",
    category: "Routing",
    status: "NotInCurrentExamScope",
    historicalNote: "show ip rip database يعرض قاعدة بيانات RIP الداخلية قبل تثبيت المسارات في RIB. أمر تشخيصي متقدم لـ RIP.",
    summary: "يعرض قاعدة بيانات RIP الداخلية: كل مسار RIP مع مصدره (من أي جار)، العمر، والمتريك. أعمق من show ip route rip.",
    description: "show ip rip database يعرض قاعدة بيانات RIP الداخلية — كل المسارات المستقبَلة من جيران RIP، حتى تلك التي لم تُثبَّت في RIB (مثلًا بسبب مسافة إدارية أعلى من بروتوكول آخر). كل سطر: الشبكة، next-hop، المصدر (عنوان الجار الذي أرسل التحديث)، العمر (بالثواني منذ الاستقبال)، والمتريك. أمر تشخيصي متقدم: إذا ظهر مسار هنا لكن ليس في show ip route rip، فالمسار مستقبَل لكن لم يُثبَّت (غالبًا بسبب مسافة إدارية لبروتوكول آخر أقل).",
    examples: [
      {
        context: "عرض قاعدة بيانات RIP",
        code: "Router# show ip rip database",
        output: "10.0.0.0/8    auto-summary\n10.0.0.0/30    directly connected, GigabitEthernet0/0/0\n10.10.20.0/24\n    [2] via 10.0.0.2, 00:00:15, GigabitEthernet0/0/0\n10.10.30.0/24\n    [3] via 10.0.0.2, 00:00:15, GigabitEthernet0/0/0",
        outputExplanation: "قاعدة بيانات RIP: 10.0.0.0/8 ملخّصة تلقائيًا (auto-summary). 10.0.0.0/30 متصلة مباشرة. 10.10.20.0/24 و 10.10.30.0/24 مستقبَلة من 10.0.0.2 بمتريك 2 و 3 على التوالي."
      }
    ],
    verificationCommands: ["show ip route rip", "show ip protocols"],
    references: [{ label: "Cisco IOS RIP Command Reference", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_rip/command/irr-cr-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-rip", "cmd-show-ip-route-rip"],
    tags: ["routing", "rip", "verification", "database", "extended"],
  },

  // === EIGRP advanced ===
  {
    id: "cmd-eigrp-stub",
    name: "eigrp stub",
    syntax: "eigrp stub [{connected | summary | static | redistributed | receive-only | leak-map <name>}]",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.0(7)T+؛ IOS XE كافة",
    cliMode: ["Router Configuration", "Sub-mode"],
    promptShape: "Router(config-router-af)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "EIGRP",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary: "يضبط الموجّه كـ EIGRP stub — يعلن فقط مسارات محددة (connected/summary/static/redistributed) ويمنع استعلامات EIGRP من المرور عبره. يقلل استهلاك الموارد في الشبكات الكبيرة.",
    description: "eigrp stub يحوّل الموجّه إلى stub — يعلن فقط أنواعًا محددة من المسارات ولا يُستخبَر عن مسارات بعيدة. هذا يقلل: (1) استعلامات EIGRP (query scope) التي قد تسبب stuck-in-active، (2) استهلاك CPU والذاكرة، (3) حجم تحديثات EIGRP. الكلمات تحدد ما يُعلَن: connected (المسارات المتصلة)، summary (المسارات الملخّصة)، static (المسارات الثابتة المعاد توزيعها)، redistributed (المسارات المعاد توزيعها من بروتوكولات أخرى)، receive-only (يستقبل فقط، لا يُعلن شيئًا). leak-map يسمح بتسريب مسارات محددة رغم وضع stub. استخدم stub على موجّهات الطرفية (access layer) التي لا يجب أن تعمل كـ transit.",
    parameters: [
      { name: "connected", description: "يعلن المسارات المتصلة فقط.", required: false },
      { name: "summary", description: "يعلن المسارات الملخّصة.", required: false },
      { name: "static", description: "يعلن المسارات الثابتة المعاد توزيعها.", required: false },
      { name: "redistributed", description: "يعلن المسارات المعاد توزيعها.", required: false },
      { name: "receive-only", description: "يستقبل فقط، لا يُعلن أي مسار.", required: false },
      { name: "leak-map <name>", description: "يسرّب مسارات محددة رغم وضع stub.", required: false }
    ],
    examples: [
      {
        context: "ضبط موجّه طرفي كـ EIGRP stub",
        code: "Router(config)# router eigrp 100\nRouter(config-router)# eigrp stub connected summary",
        outputExplanation: "هذا الموجّه يعلن فقط المسارات المتصلة والملخّصة. لن تُرسَل له استعلامات EIGRP عن مسارات بعيدة."
      }
    ],
    verificationCommands: ["show ip eigrp topology", "show ip eigrp neighbors detail"],
    references: [{ label: "Cisco IOS EIGRP Configuration Guide — Stub Routing", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_eigrp/configuration/17-12/ire-17-12-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-eigrp", "cmd-show-ip-eigrp-topology"],
    tags: ["routing", "eigrp", "stub", "enarsi"],
  },
  {
    id: "cmd-variance",
    name: "variance",
    syntax: "variance <multiplier>",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 10.0+؛ IOS XE كافة",
    cliMode: ["Router Configuration", "Sub-mode"],
    promptShape: "Router(config-router)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "EIGRP",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary: "يُفعّل unequal-cost load balancing في EIGRP — يسمح بتوزيع الحركة عبر مسارات بمتريك مختلف. ميزة فريدة في EIGRP.",
    description: "variance يُفعّل unequal-cost load balancing في EIGRP. افتراضيًا، EIGRP يستخدم فقط المسار الأفضل (successor) — variance = 1. variance <n> يسمح بتوزيع الحركة عبر مسارات (feasible successors) بمتريك حتى n ضعف المتريك الأفضل. مثال: variance 2 يسمح بمسارات بمتريك حتى ضعف الأفضل. توزيع الحركة يتناسب مع المتريك (المسار الأفضل يحصل على حصة أكبر). ميزة فريدة في EIGRP — OSPF و BGP يدعمان فقط equal-cost load balancing. في Named Mode، variance يُضبط داخل address-family.",
    parameters: [
      { name: "<multiplier>", description: "مضاعف المتريك (1-128). 1 = فقط المسار الأفضل.", required: true, defaultValue: "1", allowedValues: ["1-128"] }
    ],
    examples: [
      {
        context: "تفعيل unequal-cost load balancing بمضاعف 2",
        code: "Router(config)# router eigrp 100\nRouter(config-router)# variance 2",
        outputExplanation: "يسمح بتوزيع الحركة عبر مسارات بمتريك حتى ضعف المسار الأفضل."
      }
    ],
    verificationCommands: ["show ip route eigrp", "show ip eigrp topology"],
    references: [{ label: "Cisco IOS EIGRP Configuration Guide — Variance", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_eigrp/configuration/17-12/ire-17-12-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-eigrp", "cmd-show-ip-eigrp-topology"],
    tags: ["routing", "eigrp", "load-balancing", "variance", "enarsi"],
  },
  {
    id: "cmd-metric-weights",
    name: "metric weights",
    syntax: "metric weights <tos> <K1> <K2> <K3> <K4> <K5>",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 10.0+؛ IOS XE كافة",
    cliMode: ["Router Configuration"],
    promptShape: "Router(config-router)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "EIGRP",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary: "يضبط قيم K (K1-K5) التي تحدد معادلة متريك EIGRP المركّب. افتراضيًا K1=K3=1 (bandwidth + delay). تغيير القيم يجب أن يتطابق بين كل الجيران.",
    description: "metric weights يضبط قيم K التي تحدد كيفية حساب متريك EIGRP المركّب. القيم K1-K5 تتحكم في وزن كل عامل: K1 = bandwidth، K2 = load، K3 = delay، K4/K5 = reliability. الافتراضي: K1=1, K2=0, K3=1, K4=0, K5=0 → المتريك = bandwidth + delay فقط. تغيير القيم يجب أن يتطابق تمامًا بين كل جيران EIGRP — أي اختلاف يمنع تشكيل التجاور. على IOS 15.0+، wide metrics (K6) يدعم interfaces عالية السرعة (10G+) بشكل أدق. من الممارسات الفضلى: اترك القيم الافتراضية إلا إذا فهمت التأثير الكامل. اضبط auto-cost reference-bandwidth بدلًا من تغيير K values.",
    parameters: [
      { name: "<tos>", description: "Type of Service — دائمًا 0.", required: true, defaultValue: "0" },
      { name: "<K1>", description: "وزن bandwidth. افتراضي 1.", required: true, defaultValue: "1" },
      { name: "<K2>", description: "وزن load. افتراضي 0.", required: true, defaultValue: "0" },
      { name: "<K3>", description: "وزن delay. افتراضي 1.", required: true, defaultValue: "1" },
      { name: "<K4>", description: "وزن reliability (الجزء العلوي). افتراضي 0.", required: true, defaultValue: "0" },
      { name: "<K5>", description: "وزن reliability (الجزء السفلي). افتراضي 0.", required: true, defaultValue: "0" }
    ],
    examples: [
      {
        context: "عرض القيم الافتراضية",
        code: "Router(config)# router eigrp 100\nRouter(config-router)# metric weights 0 1 0 1 0 0",
        outputExplanation: "K1=1 (bandwidth)، K3=1 (delay)، الباقي 0 — الإعداد الافتراضي. لا حاجة لكتابته صراحةً."
      }
    ],
    verificationCommands: ["show ip protocols", "show ip eigrp topology"],
    warnings: [
      "تغيير K values يجب أن يتطابق بين كل الجيران — أي اختلاف يمنع تشكيل التجاور. ناقش التغيير مع فريق الشبكة بالكامل قبل التطبيق.",
    ],
    undoMethod: "no metric weights (يعود للافتراضي 0 1 0 1 0 0).",
    references: [{ label: "Cisco IOS EIGRP Configuration Guide — Metrics", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_eigrp/configuration/17-12/ire-17-12-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-eigrp", "cmd-show-ip-eigrp-topology"],
    tags: ["routing", "eigrp", "metrics", "k-values", "enarsi"],
  },
  {
    id: "cmd-offset-list",
    name: "offset-list",
    syntax: "offset-list {<acl> | <acl-name>} {in | out} <offset> [<interface>]",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 10.0+؛ IOS XE كافة",
    cliMode: ["Router Configuration"],
    promptShape: "Router(config-router)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "Route Policy",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary: "يضيف قيمة (offset) لمتريك المسارات المتعلّمة أو المُعلَنة في RIP أو EIGRP. أداة معايرة المسارات للتأثير على اختيار المسار.",
    description: "offset-list يضيف قيمة محددة (offset) لمتريك المسارات المطابِقة لـ ACL في RIP أو EIGRP. in يضيف للمسارات المستقبَلة (قبل التثبيت في RIB). out يضيف للمسارات المُعلَنة (قبل الإرسال للجيران). offset-list يُستخدم للتأثير على اختيار المسار: زيادة متريك مسار معين تجعله أقل تفضيلًا. على عكس route-map، offset-list أبسط لكن أقل مرونة — يضيف فقط قيمة ثابتة للمتريك. مدعوم في RIP (يضيف لعدد القفزات) و EIGRP (يضيف للـ composite metric). غير مدعوم في OSPF أو BGP.",
    parameters: [
      { name: "<acl>", description: "ACL رقمية أو مسمّاة تحدد المسارات المتأثرة.", required: true },
      { name: "in | out", description: "in = مستقبَلة. out = مُعلَنة.", required: true, allowedValues: ["in", "out"] },
      { name: "<offset>", description: "القيمة المضافة للمتريك.", required: true },
      { name: "<interface>", description: "تطبيق على واجهة محددة فقط.", required: false }
    ],
    examples: [
      {
        context: "زيادة متريك مسار RIP مستقبَل",
        code: "Router(config)# access-list 10 permit 10.10.50.0 0.0.0.255\nRouter(config)# router rip\nRouter(config-router)# offset-list 10 in 5 GigabitEthernet0/0/0",
        outputExplanation: "يضيف 5 قفزات لمتريك مسار 10.10.50.0/24 المستقبَل على Gi0/0/0. يجعل المسار أقل تفضيلًا."
      }
    ],
    verificationCommands: ["show ip route rip", "show ip protocols"],
    undoMethod: "no offset-list <acl> {in | out} <offset> [<interface>].",
    references: [{ label: "Cisco IOS IP Routing Command Reference", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute/command/ipr-cr-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-rip", "cmd-router-eigrp", "cmd-distribute-list"],
    tags: ["routing", "rip", "eigrp", "offset", "policy", "enarsi"],
  },

  // === BGP policy ===
  {
    id: "cmd-bgp-neighbor-route-map",
    name: "neighbor route-map",
    syntax: "neighbor <ip> route-map <name> {in | out}",
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
    summary: "يطبّق route-map على تحديثات BGP الواردة أو الصادرة لجار محدد. أداة سياسة BGP الأساسية لفلترة وتعديل سمات المسارات.",
    description: "neighbor route-map يطبّق route-map على كل تحديثات BGP من/إلى جار محدد. in يطبّق على المسارات المستقبَلة (قبل التثبيت في BGP table). out يطبّق على المسارات المُعلَنة (قبل الإرسال). route-map يمكنها: (1) فلترة المسارات (permit/deny)، (2) تعديل سمات BGP (set local-preference, set metric, set community, set weight, set as-path prepend). هذه أداة سياسة BGP الأساسية — بدونها، BGP يقبل ويعلن كل شيء. في address-family: neighbor <ip> route-map <name> {in|out} داخل af.",
    parameters: [
      { name: "<ip>", description: "عنوان جار BGP.", required: true },
      { name: "<name>", description: "اسم route-map.", required: true },
      { name: "in | out", description: "in = على المسارات المستقبَلة. out = على المسارات المُعلَنة.", required: true, allowedValues: ["in", "out"] }
    ],
    examples: [
      {
        context: "تعديل local-preference للمسارات المستقبَلة من ISP",
        code: 'Router(config)# route-map RM-ISP-IN permit 10\nRouter(config-route-map)# set local-preference 200\nRouter(config)# router bgp 65001\nRouter(config-router)# address-family ipv4 unicast\nRouter(config-router-af)# neighbor 203.0.113.1 route-map RM-ISP-IN in',
        outputExplanation: "كل المسارات المستقبَلة من ISP 203.0.113.1 تحصل على local-preference 200 — تجعلها مفضّلة على مسارات من ISPs أخرى."
      },
      {
        context: "AS-path prepend للمسارات المُعلَنة (لجعل المسار أقل تفضيلًا)",
        code: 'Router(config)# route-map RM-ISP-OUT permit 10\nRouter(config-route-map)# set as-path prepend 65001 65001 65001\nRouter(config-router-af)# neighbor 203.0.113.1 route-map RM-ISP-OUT out',
        outputExplanation: "إضافة AS 65001 ثلاث مرات لـ AS-path يجعل المسار أطول — ISP الآخر يفضّل مسارًا أقصر."
      }
    ],
    verificationCommands: ["show route-map", "show bgp ipv4 unicast", "show bgp ipv4 unicast neighbors <ip>"],
    references: [{ label: "Cisco IOS BGP Configuration Guide — Route Maps", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_bgp/configuration/17-12/irg-17-12-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-route-map", "cmd-router-bgp", "cmd-bgp-neighbor"],
    tags: ["routing", "bgp", "route-map", "policy", "encor"],
  },
  {
    id: "cmd-bgp-community",
    name: "set community",
    aliases: ["bgp community", "neighbor send-community"],
    syntax: "set community {<community> | additive | none}\nneighbor <ip> send-community",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Route-map Configuration", "Router Configuration"],
    promptShape: "Router(config-route-map)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "BGP",
    category: "Routing",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary: "يضبط BGP community attribute في route-map — يوسم المسارات بوسوم قابلة للتطابق عند جيران BGP. neighbor send-community ضروري لإرسال الوسوم.",
    description: "set community يضبط سمة BGP community في route-map. Communities وسوم (32-bit) تُرفَق بالمسارات وتنتقل عبر ASs — تسمح بتطبيق سياسات موحدة على مجموعات مسارات. Communities المعروفة: no-export (لا تُعلَن خارج AS المحلي)، no-advertise (لا تُعلَن لأي جار)، local-as (لا تُعلَن خارج local-AS)، internet (عادية). Communities المخصصة: AA:NN (AS:number). neighbor send-community ضروري لتمكين إرسال communities للجار — افتراضيًا لا تُرسَل. في route-map: set community <value> [additive] (additive يضيف للـ communities الموجودة بدل الاستبدال).",
    parameters: [
      { name: "<community>", description: "قيمة community: no-export, no-advertise, local-as, internet, أو AA:NN.", required: true },
      { name: "additive", description: "يضيف للـ communities الموجودة بدل الاستبدال.", required: false },
      { name: "none", description: "يحذف كل communities.", required: false }
    ],
    examples: [
      {
        context: "وسم مسارات بـ no-export (لا تُعلَن خارج AS المحلي)",
        code: 'Router(config)# route-map RM-NO-EXPORT permit 10\nRouter(config-route-map)# set community no-export\nRouter(config)# router bgp 65001\nRouter(config-router)# address-family ipv4 unicast\nRouter(config-router-af)# neighbor 10.0.0.2 route-map RM-NO-EXPORT out\nRouter(config-router-af)# neighbor 10.0.0.2 send-community',
        outputExplanation: "المسارات المُعلَنة لـ 10.0.0.2 موسومة بـ no-export. send-community يفعّل إرسال الوسوم. الجار لن يعيد إعلانها خارج AS."
      }
    ],
    verificationCommands: ["show bgp ipv4 unicast community", "show bgp ipv4 unicast", "show route-map"],
    references: [{ label: "Cisco IOS BGP Configuration Guide — Communities", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_bgp/configuration/17-12/irg-17-12-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-bgp-neighbor-route-map", "cmd-route-map", "cmd-router-bgp"],
    tags: ["routing", "bgp", "community", "policy", "encor"],
  },
  {
    id: "cmd-bgp-maximum-prefix",
    name: "neighbor maximum-prefix",
    aliases: ["maximum-prefix", "neighbor maximum-prefix"],
    syntax: "neighbor <ip> maximum-prefix <max> [<threshold>] [{restart <min> | warning-only}]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "IOS 11.1CC+؛ IOS XE كافة",
    cliMode: ["Router Configuration", "Sub-mode"],
    promptShape: "Router(config-router-af)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "BGP",
    category: "Routing",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary: "يحدّ عدد prefixes المستقبَلة من جار BGP. عند تجاوز العدد، يُعطّل الجلسة أو يُحذّر. حماية أساسية من BGP route leak أو DoS.",
    description: "neighbor maximum-prefix يحدّ عدد prefixes المستقبَلة من جار BGP محدد. عند بلوغ threshold (افتراضي 75% من max)، يُرسَل تحذير syslog. عند بلوغ max، يُعطّل الجلسة (default) أو فقط يُحذّر (warning-only). restart <min> يحدد متى تُعاد الجلسة تلقائيًا. أمر حماية أساسي: بدون maximum-prefix، جار يمكنه إرسال ملايين prefixes (route leak) وإغراق الذاكرة. الممارسة الفضلى: اضبط maximum-prefix على كل جار eBGP بقيمة أعلى بقليل من المتوقع (مثلًا 150% من المتوسط).",
    parameters: [
      { name: "<ip>", description: "عنوان جار BGP.", required: true },
      { name: "<max>", description: "الحد الأقصى لعدد prefixes.", required: true },
      { name: "<threshold>", description: "نسبة التحذير (1-100). افتراضي 75.", required: false, defaultValue: "75" },
      { name: "restart <min>", description: "إعادة الجلسة تلقائيًا بعد N دقيقة.", required: false },
      { name: "warning-only", description: "تحذير فقط دون تعطيل الجلسة.", required: false }
    ],
    examples: [
      {
        context: "حد 1000 prefix من جار eBGP",
        code: "Router(config-router-af)# neighbor 203.0.113.1 maximum-prefix 1000 75 restart 10",
        outputExplanation: "حد أقصى 1000 prefix. تحذير عند 75% (750 prefix). عند 1000، تُعطّل الجلسة وتُعاد بعد 10 دقائق."
      }
    ],
    verificationCommands: ["show bgp ipv4 unicast summary", "show bgp ipv4 unicast neighbors <ip>"],
    warnings: [
      "تعطيل جلسة BGP بسبب maximum-prefix يسبب انقطاعًا في التوجيه — اضبط القيمة بعناية.",
    ],
    undoMethod: "no neighbor <ip> maximum-prefix.",
    references: [{ label: "Cisco IOS BGP Configuration Guide — Maximum Prefix", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_bgp/configuration/17-12/irg-17-12-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-bgp", "cmd-bgp-neighbor", "cmd-show-bgp-summary"],
    tags: ["routing", "bgp", "security", "maximum-prefix", "encor"],
  },

  // === STP historical: UplinkFast / BackboneFast ===
  {
    id: "cmd-uplinkfast",
    name: "uplinkfast",
    syntax: "uplinkfast [{max-update-rate <pps>}]",
    platforms: ["IOS"],
    versionRange: "IOS 11.2+ — تاريخي على Catalyst القديمة (2950/3550). لا يدعمه Catalyst 9000 الحديث (RSTP يوفر نفس الوظيفة).",
    cliMode: ["Global Configuration"],
    promptShape: "Switch(config)#",
    certLevel: "Extended",
    scope: "extended",
    topic: "Spanning Tree Protocol",
    category: "Switching",
    status: "Historical",
    historicalNote: "UplinkFast ميزة Cisco تاريخية لتحسين تقارب STP على Catalyst القديمة (2950/3550). توفر استردادًا سريعًا لفشل uplink دون انتظار STP timers. على Catalyst 9000 الحديث، RSTP (802.1w) يوفر نفس الوظيفة بطريقة معيارية، لذا UplinkFast غير مدعوم ولا ضروري. محفوظ لأغراض فهم الشبكات القديمة.",
    modernAlternative: "Rapid-PVST+ (spanning-tree mode rapid-pvst)",
    differencesFromAlternative: "RSTP (802.1w) معيار IEEE يوفر استردادًا سريعًا لكل المنافذ (ليس فقط uplinks) دون ميزات Cisco الخاصة. UplinkFast يعمل فقط على منافذ blocked ويستخدم dummy multicast لتسريع تعلم MAC. RSTP يستخدام proposals/agreements بطريقة أنظف.",
    summary: "UplinkFast ميزة Cisco تاريخية لاسترداد سريع لفشل uplink في STP. غير مدعوم على Catalyst 9000 (RSTP يحل محله). محفوظ للفهم التاريخي.",
    description: "uplinkFast ميزة Cisco خاصة لتحسين تقارب STP على محولات access layer القديمة. عند فشل uplink (root port)، UplinkFast ينقل فورًا إلى منفذ blocked بديل دون انتظار max-age + forward delay (30 ثانية افتراضيًا). يقلل التقارب من 30+ ثانية إلى ~1 ثانية. يُفعّل بـ uplinkFast عالميًا — يضبط bridge priority عالية (49152) ويقلل priority لكل VLAN لمنع المحول من أن يصبح root أو transit. يولّد dummy multicast frames لتسريع تعلم MAC على المسار الجديد. غير مدعوم على Catalyst 9000 — RSTP يحل محله بطريقة معيارية.",
    examples: [
      {
        context: "تفعيل UplinkFast على Catalyst قديم",
        code: "Switch(config)# uplinkfast\nSwitch(config)# uplinkfast max-update-rate 400",
        outputExplanation: "يفعّل UplinkFast بمعدل 400 dummy multicast frame/ثانية. على Catalyst 9000، هذا الأمر غير موجود — استخدم spanning-tree mode rapid-pvst بدلًا منه."
      }
    ],
    verificationCommands: ["show spanning-tree uplinkfast"],
    undoMethod: "no uplinkfast.",
    references: [{ label: "Cisco IOS STP Configuration Guide (legacy)", url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst2950/software/release/12-1_9_ea1/configuration/guide/scg/swgstp.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-spanning-tree-mode", "cmd-spanning-tree-portfast"],
    tags: ["switching", "stp", "uplinkfast", "historical", "legacy", "extended"],
  },
  {
    id: "cmd-backbonefast",
    name: "backbonefast",
    syntax: "backbonefast",
    platforms: ["IOS"],
    versionRange: "IOS 12.0+ — تاريخي على Catalyst القديمة. لا يدعمه Catalyst 9000 (RSTP يحل محله).",
    cliMode: ["Global Configuration"],
    promptShape: "Switch(config)#",
    certLevel: "Extended",
    scope: "extended",
    topic: "Spanning Tree Protocol",
    category: "Switching",
    status: "Historical",
    historicalNote: "BackboneFast ميزة Cisco تاريخية لتسريع التقارب عند فشل غير مباشر في STP (فشل في core switch). غير مدعوم على Catalyst 9000 — RSTP يحل محله. محفوظ للفهم التاريخي.",
    modernAlternative: "Rapid-PVST+ (spanning-tree mode rapid-pvst)",
    summary: "BackboneFast ميزة Cisco تاريخية لتسريع التقارب عند فشل غير مباشر في STP. غير مدعوم على Catalyst 9000.",
    description: "BackboneFast ميزة Cisco خاصة لتسريع التقارب عند فشل غير مباشر (indirect link failure) — فشل في core switch يجعل root bridge غير قابل للوصول. بدون BackboneFast، المحول ينتظر max-age (20 ثانية) قبل إعادة حساب STP. مع BackboneFast، المحول يكتشف الفشل عبر RLQ (Root Link Query) ويعيد الحساب فورًا — يقلل التقارب من 50 ثانية إلى ~30 ثانية. يجب تفعيله على كل المحولات في الشبكة. غير مدعوم على Catalyst 9000 — RSTP يحل محله بطريقة معيارية.",
    examples: [
      {
        context: "تفعيل BackboneFast على Catalyst قديم",
        code: "Switch(config)# backbonefast",
        outputExplanation: "يفعّل BackboneFast عالميًا. على Catalyst 9000، هذا الأمر غير موجود — استخدم spanning-tree mode rapid-pvst."
      }
    ],
    verificationCommands: ["show spanning-tree backbonefast"],
    undoMethod: "no backbonefast.",
    references: [{ label: "Cisco IOS STP Configuration Guide (legacy)", url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst2950/software/release/12-1_9_ea1/configuration/guide/scg/swgstp.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-uplinkfast", "cmd-spanning-tree-mode"],
    tags: ["switching", "stp", "backbonefast", "historical", "legacy", "extended"],
  },

  // === Storm Control ===
  {
    id: "cmd-storm-control",
    name: "storm-control",
    syntax: "storm-control {broadcast | multicast | unicast} level {<percentage> | bps <bps> | pps <pps>}\nstorm-control action {shutdown | trap}",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.2(37)SG+؛ IOS XE كافة",
    cliMode: ["Interface Configuration"],
    promptShape: "Switch(config-if)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "Switch Security",
    category: "Switching",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary: "يحدّ معدل حركة broadcast/multicast/unicast على منفذ لمنع broadcast storms. أداة حماية أساسية من حلقات Layer 2 وهجمات DoS.",
    description: "storm-control يحدّ معدل أنواع محددة من الحركة على منفذ. عند تجاوز الحد المحدد، يُسقِط الحركة الزائدة (default) أو يُعطّل المنفذ (shutdown) أو يُرسل SNMP trap. أنواع الحركة: broadcast (بث عام)، multicast (بث مجموعة)، unicast (بث أحادي — عادةً لحماية من unicast flooding). الحد يُحدد بنسبة مئوية من النطاق الترددي (مثلًا 1%) أو بـ bps أو pps. storm-control حاسم لمنع broadcast storms: حلقة Layer 2 أو جهاز معطل يمكن أن يولّد فيضان broadcast يستهلك كل النطاق الترددي ويسبب تعطل الشبكة. الممارسة الفضلى: storm-control broadcast level 1 على كل منافذ access.",
    parameters: [
      { name: "broadcast | multicast | unicast", description: "نوع الحركة المراد تحديدها.", required: true, allowedValues: ["broadcast", "multicast", "unicast"] },
      { name: "level <percentage>", description: "نسبة من النطاق الترددي (0.01-100).", required: true },
      { name: "action {shutdown | trap}", description: "الإجراء عند تجاوز الحد: shutdown (يعطل المنفذ) أو trap (يرسل SNMP trap).", required: false }
    ],
    examples: [
      {
        context: "حد broadcast بـ 1% على منفذ access",
        code: "Switch(config)# interface Gi1/0/10\nSwitch(config-if)# storm-control broadcast level 1\nSwitch(config-if)# storm-control action trap",
        outputExplanation: "يحد broadcast بـ 1% من النطاق الترددي. عند التجاوز، يُسقِط الحركة الزائدة ويرسل SNMP trap."
      }
    ],
    verificationCommands: ["show storm-control", "show storm-control interface <iface>"],
    undoMethod: "no storm-control {broadcast | multicast | unicast} level.",
    references: [{ label: "Catalyst 9300 Security Configuration Guide — Storm Control", url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_9300l/storm_control.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-spanning-tree-bpduguard", "cmd-switchport-port-security"],
    tags: ["switching", "security", "storm-control", "broadcast", "encor"],
  },

  // === IPv6 ACL ===
  {
    id: "cmd-ipv6-access-list",
    name: "ipv6 access-list",
    syntax: "ipv6 access-list <name>\n  permit <proto> <source>/<plen> <dest>/<plen> [<port>] [<flags>]",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "IOS 12.2(2)T+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(config-ipv6-acl)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Access Control",
    category: "Security",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary: "ينشئ ACL مسمّى لـ IPv6. الصيغة مختلفة عن IPv4 ACLs — تستخدم prefix/length بدلًا من wildcard mask. تدعم deny/permit مع بروتوكولات ومنافذ.",
    description: "ipv6 access-list ينشئ ACL مسمّى لـ IPv6. على عكس IPv4 ACLs (التي تستخدم wildcard mask)، IPv6 ACLs تستخدم prefix/length (مثلًا 2001:db8::/64). كل سطر: permit/deny + بروتوكول + source + destination + منفذ (اختياري) + أعلام TCP (اختياري). IPv6 ACLs لها deny ضمني في النهاية (مثل IPv4) لكنها تضيف أيضًا permit icmp nd-na و permit icmp nd-ns ضمنيًا — للسماح بـ Neighbor Discovery (NDP) الذي يحل محل ARP في IPv6. IPv6 ACLs تُطبّق على الواجهة بـ ipv6 traffic-filter <name> {in|out}. لا يوجد IPv6 ACLs مرقّمة (مثل IPv4) — فقط مسمّاة.",
    parameters: [
      { name: "<name>", description: "اسم ACL.", required: true },
      { name: "<proto>", description: "البروتوكول: tcp, udp, icmp, ipv6, إلخ.", required: true },
      { name: "<source>/<plen>", description: "المصدر بصيغة prefix/length.", required: true },
      { name: "<dest>/<plen>", description: "الوجهة بصيغة prefix/length.", required: true }
    ],
    examples: [
      {
        context: "ACL IPv6 للسماح بـ SSH فقط من شبكة إدارة",
        code: "Router(config)# ipv6 access-list ACL-SSH6-IN\nRouter(config-ipv6-acl)# permit tcp 2001:db8:99::/64 any eq 22\nRouter(config-ipv6-acl)# deny tcp any any eq 22 log\nRouter(config-ipv6-acl)# permit ipv6 any any\nRouter(config)# interface GigabitEthernet0/0/0\nRouter(config-if)# ipv6 traffic-filter ACL-SSH6-IN in",
        outputExplanation: "يسمح بـ SSH من 2001:db8:99::/64 فقط. يرفض بقية SSH ويسجل. يسمح بكل ما تبقى. ND-NA و ND-NS مسموحة ضمنيًا."
      }
    ],
    verificationCommands: ["show ipv6 access-list", "show ipv6 interface <iface>"],
    commonErrors: [
      "نسيان أن IPv6 ACLs تسمح ضمنيًا بـ NDP (ND-NA, ND-NS) — لا حاجة لإضافتها يدويًا.",
      "الخلط بين wildcard mask (IPv4) و prefix/length (IPv6) — الصيغة مختلفة تمامًا.",
    ],
    undoMethod: "no ipv6 access-list <name>.",
    references: [{ label: "Cisco IOS IPv6 ACL Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipv6/configuration/17-12/ipv6-17-12-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-access-list-extended", "cmd-ip-access-group"],
    tags: ["security", "acl", "ipv6", "ccna"],
  },

  // === System show commands ===
  {
    id: "cmd-show-history",
    name: "show history",
    syntax: "show history",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC", "User EXEC"],
    promptShape: "Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "CLI Modes",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v2.0 (200-301)"],
    status: "Current",
    summary: "يعرض سجل الأوامر المنفذة في الجلسة الحالية. مفيد لمراجعة ما تم تنفيذه ولإعادة استخدام الأوامر.",
    description: "show history يعرض قائمة بالأوامر المنفذة في جلسة CLI الحالية. عدد الأوامر المخزنة يحدده terminal history size (افتراضيًا 10 على console، 20 على VTY). يمكنك التنقل في السجل بأسهم لوحة المفاتيح (↑/↓). سجل الأوامر محلي لكل جلسة — لا يُشارَك بين جلسات. مفيد لمراجعة ما تم تنفيذه أثناء التشخيص أو لإعادة استخدام أوامر سابقة دون إعادة كتابتها.",
    examples: [
      {
        context: "عرض سجل الأوامر",
        code: "Router# show history",
        output: "  enable\n  configure terminal\n  hostname Cairo-Edge-01\n  interface GigabitEthernet0/0/0\n  ip address 10.0.0.1 255.255.255.252\n  no shutdown\n  end\n  write memory\n  show running-config\n  show history",
        outputExplanation: "آخر 10 أوامر منفذة في الجلسة. استخدم ↑/↓ للتنقل وإعادة التنفيذ."
      }
    ],
    verificationCommands: ["show terminal", "terminal history size <n>"],
    references: [{ label: "Cisco IOS Configuration Fundamentals Command Reference", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-running-config", "cmd-configure-terminal"],
    tags: ["cli", "history", "fundamentals"],
  },
  {
    id: "cmd-show-file-systems",
    name: "show file systems",
    syntax: "show file systems",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "IOS 12.0+؛ IOS XE كافة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "Fundamentals",
    scope: "certification",
    topic: "File System",
    category: "Fundamentals",
    curriculumVersions: ["CCNA v2.0 (200-301)"],
    status: "Current",
    summary: "يعرض كل أنظمة الملفات المتاحة على الجهاز: flash، bootflash، nvram، usbflash، tftp. أمر أساسي قبل عمليات الملفات.",
    description: "show file systems يعرض كل أنظمة الملفات المتاحة على الجهاز مع: Size (الحجم الإجمالي)، Free (المساحة الحرة)، Type (نوع نظام الملفات)، Flags (أعلام للقراءة/الكتابة)، Prefixes (البادئات المستخدمة في الأوامر مثل flash:، bootflash:، nvram:). أمر أساسي قبل عمليات النسخ والحذف وترقية الصور — يخبرك بأين يمكنك التخزين وكم المساحة المتاحة. على IOS XE، flash: و bootflash: قد يكونان منفصلين — bootflash: يحمل صورة IOS، flash: يحمل ملفات المستخدم.",
    examples: [
      {
        context: "عرض أنظمة الملفات",
        code: "Router# show file systems",
        output: "File Systems:\n\n     Size(b)       Free(b)      Type  Flags  Prefixes\n*    3217989632    1939861504    flash  rw     flash:\n     3217989632    1939861504    bootflash rw   bootflash:\n           391552         359455    nvram  rw     nvram:\n              -              -    network rw     tftp:",
        outputExplanation: "flash: و bootflash: بحجم 3.2GB، حر 1.94GB. nvram: 391KB. tftp: متاح للنسخ الشبكي. * = نظام الملفات الافتراضي."
      }
    ],
    verificationCommands: ["dir flash:", "dir bootflash:", "dir nvram:"],
    references: [{ label: "Cisco IOS File Management Command Reference", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-dir", "cmd-boot-system"],
    tags: ["file-system", "fundamentals"],
  },
  {
    id: "cmd-show-boot",
    name: "show boot",
    aliases: ["show bootvar"],
    syntax: "show boot",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.0+؛ IOS XE كافة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "Extended",
    scope: "extended",
    topic: "File System",
    category: "Fundamentals",
    status: "Current",
    summary: "يعرض صورة IOS التي سيُحمّلها الجهاز عند الإقلاع التالي + BOOT variable + Configuration Register. أمر حاسم قبل/بعد ترقية IOS.",
    description: "show boot يعرض: BOOT path-list (صورة IOS التي سيُحمّلها عند الإقلاع، المحددة بـ boot system)، Config file (ملف الإعداد الذي سيُحمّل، عادةً startup-config في NVRAM)، Private Config file، Configuration Register (قيمة تحدد سلوك الإقلاع: 0x2102 طبيعي، 0x2142 يتخطى startup-config). أمر حاسم عند ترقية IOS: بعد ضبط boot system flash:<new-image> + write memory، تحقق بـ show boot أن الجهاز سيُحمّل الصورة الجديدة قبل reload. إذا عرض BOOT path-list فارغًا، الجهاز سيُحمّل أول صورة صالحة في flash.",
    examples: [
      {
        context: "التحقق من صورة الإقلاع قبل reload",
        code: "Router# show boot",
        output: "BOOT path-list      : flash:packages.conf\nConfig file         : flash:/startup-config\nPrivate Config file : flash:/private-config\nConfiguration Register : 0x2102",
        outputExplanation: "سيُحمّل flash:packages.conf عند الإقلاع. Config Register 0x2102 (طبيعي — يحمّل startup-config). كل الإعداد سليم لـ reload."
      }
    ],
    verificationCommands: ["dir flash:", "show version | include register"],
    warnings: [
      "تحقق دائمًا بـ show boot قبل reload بعد تغيير boot system — خطأ هنا قد يُقلع الجهاز بصورة خاطئة أو يدخله ROMmon.",
    ],
    references: [{ label: "Cisco IOS Configuration Fundamentals Command Reference", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/fundamentals/command/cf-command-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-boot-system", "cmd-dir", "cmd-show-version", "cmd-reload"],
    tags: ["file-system", "boot", "extended"],
  },
  {
    id: "cmd-ip-default-gateway",
    name: "ip default-gateway",
    syntax: "ip default-gateway <ip>",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Router(config)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "IP Routing",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary: "يضبط البوابة الافتراضية على جهاز لا يعمل كـ router (مثل محول Layer 2 بدون ip routing). الحركة الموجهة لشبكات غير مباشرة تُرسَل لهذه البوابة.",
    description: "ip default-gateway يضبط البوابة الافتراضية على جهاز لا يقوم بالتوجيه (ip routing معطل). على محول Layer 2 (مثل Catalyst 2960 بدون ip routing)، كل حركة IP من الجهاز نفسه (مثلًا SSH، SNMP، syslog) تُرسَل للبوابة الافتراضية إذا كانت الوجهة خارج الشبكة المحلية. على محول Layer 3 (مع ip routing)، استخدم ip route 0.0.0.0 0.0.0.0 بدلًا من ip default-gateway — ip default-gateway لا يُستخدَم عندما ip routing مفعّل. الممارسة الفضلى: على محول Layer 2 للإدارة، اضبط ip default-gateway إلى عنوان SVI/واجهة الموجّه الموصل بها.",
    parameters: [
      { name: "<ip>", description: "عنوان IP للبوابة الافتراضية (عادةً موجّه أو محول Layer 3).", required: true }
    ],
    examples: [
      {
        context: "ضبط البوابة الافتراضية على محول Layer 2",
        code: "Switch(config)# ip default-gateway 10.10.99.1",
        outputExplanation: "كل حركة IP من المحول (SSH, SNMP, syslog) لشبكات غير 10.10.99.0/24 تُرسَل إلى 10.10.99.1."
      }
    ],
    verificationCommands: ["show ip route", "show running-config | include default-gateway", "ping <gateway-ip>"],
    commonErrors: [
      "استخدام ip default-gateway على جهاز مع ip routing مفعّل — لا يُستخدَم. استخدم ip route 0.0.0.0 0.0.0.0 بدلًا منه.",
    ],
    undoMethod: "no ip default-gateway.",
    references: [{ label: "Cisco IOS IP Routing Command Reference", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute/command/ipr-cr-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-route-static", "cmd-ip-routing"],
    tags: ["routing", "default-gateway", "layer2", "ccna"],
  },
  {
    id: "cmd-spanning-tree-vlan-priority",
    name: "spanning-tree vlan priority",
    syntax: "spanning-tree vlan <vlan-list> priority <priority>",
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
    summary: "يضبط bridge priority لـ VLAN محددة — يؤثر على انتخاب Root Bridge. الأقل يصبح Root. القيم بخطوات 4096.",
    description: "spanning-tree vlan priority يضبط bridge priority لـ VLAN محددة. Bridge ID = Priority + MAC. في انتخاب Root Bridge، الأقل Bridge ID يفوز. Priority الافتراضية = 32768. لتقليلها (وجعل المحول Root)، اضبطها لأقل (مثلًا 4096). القيم يجب أن تكون بخطوات 4096 (0, 4096, 8192, ..., 61440). Priority الفعلية = base priority + VLAN ID (مثلًا priority 4096 على VLAN 10 = 4096+10 = 4106). spanning-tree vlan 10 root primary بديل تلقائي — يضبط priority لأقل بـ 4096 من الحالي. استخدم priority صراحةً للتحكم الدقيق.",
    parameters: [
      { name: "<vlan-list>", description: "VLAN(s) المحددة (مثلًا 10 أو 1-10,20).", required: true },
      { name: "<priority>", description: "القيمة (بخطوات 4096: 0, 4096, 8192, ..., 61440).", required: true, allowedValues: ["0", "4096", "8192", "12288", "...", "61440"] }
    ],
    examples: [
      {
        context: "جعل المحول Root Bridge لـ VLAN 10 و 20",
        code: "Switch(config)# spanning-tree vlan 10 priority 4096\nSwitch(config)# spanning-tree vlan 20 priority 4096",
        outputExplanation: "priority 4096 أقل من الافتراضي 32768 — هذا المحول سيصبح Root لـ VLAN 10 و 20 (إذا لم يوجد محول آخر بـ priority أقل)."
      }
    ],
    verificationCommands: ["show spanning-tree vlan 10", "show spanning-tree root"],
    commonErrors: [
      "استخدام قيم غير خطوات 4096 (مثلًا 5000) — يُرفَض. استخدم 0, 4096, 8192, إلخ.",
    ],
    undoMethod: "no spanning-tree vlan <vlan-list> priority (يعود لـ 32768).",
    references: [{ label: "Catalyst 9300 STP Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/l2/b_1712_l2_9300_9300l/stp.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-spanning-tree-mode", "cmd-show-spanning-tree"],
    tags: ["switching", "stp", "priority", "root-bridge", "ccna"],
  },
];
