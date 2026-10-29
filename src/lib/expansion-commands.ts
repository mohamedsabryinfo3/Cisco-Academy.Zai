import type { CiscoCommand } from "./cisco-types";

// ===================================================================
// Expansion Pack v11 — Routing protocol audit gap-fill
// Covers: IGRP (historical), IS-IS, RIPng, EIGRP Named Mode,
// OSPFv3, clear ip route, distribute-list, area range,
// summary-address, default-information originate, BGP route-reflector,
// BGP confederation, passive-interface, DTP, SPAN, IP Source Guard,
// CoPP, zone-based firewall, 802.1X, RADIUS, TACACS+, PPP, HDLC, PPPoE
// ===================================================================

export const EXPANSION_COMMANDS: CiscoCommand[] = [
  // ================================================================
  // IS-IS — Integrated IS-IS
  // ================================================================
  {
    id: "cmd-router-isis",
    name: "router isis",
    syntax: "router isis [<tag>]",
    platforms: ["IOS", "IosXe", "IosXr"],
    versionRange: "IOS 10.0+؛ IOS XE كافة؛ IOS XR كافة",
    cliMode: ["Global Configuration", "Router Configuration"],
    promptShape: "Router(config)# → Router(config-router)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "IS-IS",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1", "CCNP R&S BSCI (تاريخي)"],
    status: "Current",
    summary:
      "ينشئ عملية IS-IS (Intermediate System to Intermediate System) للتبديل بين أنظمة الوسائط — بروتوكول توجيه link-state IGP محايد للبروتوكول (ISO 10589). يدعم IPv4 و IPv6 متزامنًا.",
    description:
      "IS-IS (Intermediate System to Intermediate System) هو بروتوكول توجيه link-state IGP معياري (ISO 10589/RFC 1142). على عكس OSPF الذي يعمل على IP، IS-IS يعمل على CLNP (Connectionless Network Protocol) ويحمل معلومات IP كـ 'extensions'. هذا يجعله بروتوكولًا محايدًا للشبكة — يضيف IPv6 بسهولة دون عملية منفصلة. IS-IS يستخدم مستويين: Level 1 (داخل area)، Level 2 (بين areas). Level 1-2 يجمع الوظيفتين. IS-IS شائع في شبكات مقدمي الخدمة (Service Providers) ومراكز البيانات الكبيرة. مصادقيته أقل من OSPF في شبكات المؤسسات لكنه أقوى في الشبكات الضخمة. يُدرَّس في CCNP ENARSI و CCIE SP.",
    parameters: [
      { name: "<tag>", description: "معرّف عملية IS-IS (اختياري، نص حر). محلي فقط — لا يحتاج للمطابقة بين الجيران.", required: false }
    ],
    examples: [
      {
        context: "إعداد IS-IS Level 1-2 أساسي",
        code: "Router(config)# router isis ENTERPRISE\nRouter(config-router)# net 49.0001.1921.6800.1001.00\nRouter(config-router)# is-type level-1-2\nRouter(config-router)# metric-style wide\nRouter(config-router)# exit\nRouter(config)# interface GigabitEthernet0/0/0\nRouter(config-if)# ip router isis ENTERPRISE\nRouter(config-if)# ip address 10.0.0.1 255.255.255.252\nRouter(config-if)# no shutdown",
        outputExplanation: "NET (Network Entity Title) بصيغة ISO: 49.0001 = area، 1921.6800.1001 = system ID (مشتق من loopback)، 00 = selector. is-type level-1-2 = جهاز يعمل على المستويين. metric-style wide ضروري لـ IPv6 و MPLS-TE."
      }
    ],
    verificationCommands: ["show isis neighbors", "show isis database", "show isis topology", "show ip route isis", "show clns neighbors"],
    troubleshootingNotes: [
      "تجاور IS-IS لا يتشكل: تحقق من تطابق NET area على Level 1، أو تطابقmetric-style. IS-IS لا يستخدم IP للحمل — يعمل على CLNP، ففشل IP لا يمنع تجاور IS-IS.",
      "show clns neighbors يعرض الجيران нав حتى لو لم يكن IP مُعدًا — لأن IS-IS يعمل على CLNP."
    ],
    commonErrors: [
      "نسيان ip router isis <tag> على الواجهة — IS-IS لن يُعلن الشبكة بدونها.",
      "استخدام metric-style narrow على شبكة تدعم IPv6 أو MPLS-TE — يجب wide."
    ],
    undoMethod: "no router isis <tag>.",
    references: [{ label: "Cisco IOS XE IS-IS Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/ip-routing/b-ip-routing/m_irs-ovrvw-cf.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-isis-neighbors", "cmd-show-isis-database", "cmd-show-ip-route"],
    tags: ["routing", "is-is", "isis", "link-state", "igp", "enarsi", "service-provider"],
  },
  {
    id: "cmd-show-isis-neighbors",
    name: "show isis neighbors",
    aliases: ["sh isis neigh", "show clns neighbors", "show clns is-neighbors"],
    syntax: "show isis neighbors [{detail | <interface>}]",
    platforms: ["IOS", "IosXe", "IosXr"],
    versionRange: "IOS 10.0+؛ IOS XE كافة؛ IOS XR كافة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "IS-IS",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary: "يعرض جيران IS-IS: System ID، الواجهة، النوع (L1/L2/L1-2)، الحالة (Up)، و hold time. show clns neighbors بديل قديم.",
    description:
      "show isis neighbors يعرض جدول جيران IS-IS. كل سطر: System ID (معرّف الجار)، Interface (الواجهة المحلية)، Type (L1/L2/L1-2)، State (Up)، Hold Time (عدّان تنازلي)، SNPA (عنوان Layer 2، عادةً MAC). على عكس OSPF، IS-IS ليس له حالات تجاور متعددة — Up أو Down فقط. الكلمة detail تُضيف معلومات الإصدار والمنطقة. show clns neighbors هو الأمر التاريخي الأقدم — لا يزال يعمل ويظهر جيران CLNP/IS-IS معًا.",
    examples: [
      {
        context: "عرض جيران IS-IS",
        code: "Router# show isis neighbors",
        output: "Tag ENTERPRISE:\nSystem Id       Interface   SNPA            Hold State  Type(s)\nR2              Gi0/0/0     0050.56ab.cdef  28   Up     L1L2",
        outputExplanation: "جار واحد: R2 على Gi0/0/0، SNPA (MAC) = 0050.56ab.cdef، Hold 28 ثانية، الحالة Up، النوع L1L2 (يعمل على المستويين). كل المؤشرات سليمة."
      }
    ],
    verificationCommands: ["show isis database", "show isis topology", "show ip route isis"],
    references: [{ label: "Cisco IOS IS-IS Command Reference", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_isis/command/irs-cr-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-isis", "cmd-show-isis-database"],
    tags: ["routing", "is-is", "verification", "enarsi"],
  },
  {
    id: "cmd-show-isis-database",
    name: "show isis database",
    aliases: ["sh isis database", "show isis lsp"],
    syntax: "show isis database [{detail | level-1 | level-2 | <lsp-id>}]",
    platforms: ["IOS", "IosXe", "IosXr"],
    versionRange: "IOS 10.0+؛ IOS XE كافة؛ IOS XR كافة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "IS-IS",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary: "يعرض قاعدة بيانات LSP (Link-State PDU) لـ IS-IS: كل LSP،.seq number، checksum، holdtime، و ATT/P/OL bits. مماثل لـ show ip ospf database.",
    description:
      "show isis database يعرض قاعدة بيانات LSPs (Link-State PDUs) لـ IS-IS — مكافئ show ip ospf database في OSPF. كل سطر: LSPID (معرّف الـ LSP، يشمل System ID + Pseudonode flag)، LSP Seq Num، LSP Checksum، LSP Holdtime، ATT/P/OL bits (ATT=Attached to Level 2، P=Partition Repair، OL=Overload). الكلمة detail تُضيف محتوى الـ LIP الكامل (TLVs). level-1 و level-2 تُرشّح حسب المستوى. هذا أمر تشخيصي حاسم لفهم طوبولوجيا IS-IS ولماذا مسار معين موجود أو مفقود.",
    examples: [
      {
        context: "عرض قاعدة بيانات IS-IS LSPs",
        code: "Router# show isis database",
        output: "IS-IS Level-1 Link State Database:\nLSPID                 LSP Seq Num  LSP Checksum  LSP Holdtime  ATT/P/OL\nR1.00-00            * 0x00000006   0x0AB1        1187          0/0/0\nR2.00-00              0x00000004   0x0CD3        1192          1/0/0\nR2.01-00              0x00000001   0x0EF5        1023          0/0/0\n\nIS-IS Level-2 Link State Database:\nLSPID                 LSP Seq Num  LSP Checksum  LSP Holdtime  ATT/P/OL\nR1.00-00            * 0x00000007   0x0AB2        1187          0/0/0\nR2.00-00              0x00000005   0x0CD4        1192          0/0/0",
        outputExplanation: "قاعدتا بيانات: Level-1 (3 LSPs) و Level-2 (2 LSPs). * = LSP مُنشأ محليًا. R2.01-00 = pseudonode (LSP من DIS — Designated Intermediate System). R2 Level-1 له ATT=1 (Attached to Level 2 — يشير لمنطقة Level 2)."
      }
    ],
    verificationCommands: ["show isis neighbors", "show isis topology", "show ip route isis"],
    references: [{ label: "Cisco IOS IS-IS Command Reference", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_isis/command/irs-cr-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-isis", "cmd-show-isis-neighbors"],
    tags: ["routing", "is-is", "verification", "lsp", "enarsi"],
  },

  // ================================================================
  // RIPng — RIP next generation for IPv6
  // ================================================================
  {
    id: "cmd-ipv6-router-rip",
    name: "ipv6 router rip",
    syntax: "ipv6 router rip <tag>",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.2(2)T+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "Router Configuration"],
    promptShape: "Router(config)# → Router(config-rtr)#",
    certLevel: "Extended",
    scope: "extended",
    topic: "RIPv2 (Historical)",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120) — كان مطلوبًا", "CCNA v2.0 (200-301) — خارج النطاق"],
    status: "NotInCurrentExamScope",
    historicalNote:
      "RIPng (RIP next generation، RFC 2080) هو إصدار RIP لـ IPv6. كان مدرجًا في CCNA v1.0 (200-120) لكنه أُزيل من CCNA v2.0 (200-301). لا يزال مدعومًا فنيًا على IOS/IOS XE لكنه نادر الاستخدام في الإنتاج. RIPng يستخدم multicast FF02::9 و UDP port 521 (بدلًا من 520 في RIPv2). محفوظ لأغراض الفهم التاريخي والشبكات القديمة.",
    modernAlternative: "OSPFv3 لـ IPv6",
    modernAlternativeCommandId: "cmd-router-ospfv3",
    differencesFromAlternative:
      "RIPng distance-vector بحد 15 قفزة. OSPFv3 link-state بتقارب أسرع وبدون حد قفزات. RIPng يُعلن الجدول كاملًا كل 30 ثانية (غير فعال)، OSPFv3 يُعلن فقط التغييرات.",
    summary:
      "RIPng (RIP next generation، RFC 2080) — بروتوكول توجيه distance-vector لـ IPv6. تاريخي — كان في CCNA v1.0 لكنه خارج CCNA v2.0. لا يزال مدعومًا فنيًا.",
    description:
      "RIPng (RIP next generation) هو إصدار RIP لـ IPv6، معرّف في RFC 2080. مطابق لـ RIPv2 في الآلية (distance-vector، حد 15 قفزة، تحديث كل 30 ثانية) لكنه يعمل على IPv6. يستخدم multicast FF02::9 و UDP port 521. على عكس RIPv2، RIPng لا يحتاج network statements — يُفعّل على الواجهة بـ ipv6 rip <tag> enable. RIPng كان مدرجًا في CCNA v1.0 (200-120) لكنه أُزيل من CCNA v2.0 (200-301). محفوظ لأغراض الفهم التاريخي والشبكات القديمة التي قد تواجهها.",
    parameters: [
      { name: "<tag>", description: "معرّف عملية RIPng (نص حر). محلي فقط.", required: true }
    ],
    examples: [
      {
        context: "إعداد RIPng على واجهة IPv6",
        code: "Router(config)# ipv6 unicast-routing\nRouter(config)# ipv6 router rip ENTERPRISE\nRouter(config-rtr)# exit\nRouter(config)# interface GigabitEthernet0/0/0\nRouter(config-if)# ipv6 address 2001:db8::1/64\nRouter(config-if)# ipv6 rip ENTERPRISE enable\nRouter(config-if)# no shutdown",
        outputExplanation: "ipv6 router rip ينشئ العملية. ipv6 rip <tag> enable على الواجهة تُفعّل RIPng عليها — لا حاجة لـ network statement كما في RIPv2."
      }
    ],
    verificationCommands: ["show ipv6 route rip", "show ipv6 rip", "show ipv6 rip database", "show ipv6 protocols"],
    commonErrors: [
      "نسيان ipv6 unicast-routing — RIPng لن يعمل بدون تفعيل التوجيه IPv6.",
      "الخلط بين udp port 521 (RIPng) و 520 (RIPv2) عند ضبط ACLs."
    ],
    undoMethod: "no ipv6 router rip <tag> + no ipv6 rip <tag> enable على كل واجهة.",
    references: [{ label: "Cisco IOS IPv6 Routing: RIPng Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipv6/configuration/17-12/ipv6-17-12-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-rip", "cmd-router-ospfv3", "cmd-ipv6-unicast-routing", "cmd-show-ipv6-route"],
    tags: ["routing", "rip", "ripng", "ipv6", "historical", "legacy", "extended"],
  },

  // ================================================================
  // OSPFv3 — OSPF for IPv6
  // ================================================================
  {
    id: "cmd-router-ospfv3",
    name: "router ospfv3",
    syntax: "router ospfv3 [<process-id>] [vrf <vrf-name>]",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 15.1(3)S+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "Router Configuration"],
    promptShape: "Router(config)# → Router(config-router)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "OSPF",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary:
      "ينشئ عملية OSPFv3 (OSPF for IPv6، RFC 5340). على عكس OSPFv2 الذي يعمل فقط على IPv4، OSPFv3 يدعم IPv4 و IPv6 عبر address-families. الصيغة الحديثة الموصى بها.",
    description:
      "OSPFv3 (OSPF for IPv6، RFC 5340) هو الإصدار الثالث من OSPF. على عكس OSPFv2 (الذي يعمل فقط على IPv4)، OSPFv3 يدعم كلًا من IPv4 و IPv6 عبر address-families (ospfv3 <pid> ipv4/ipv6 area). OSPFv3 يعمل على link-local (FF02::5 و FF02::6) بدلًا من multicast 224.0.0.5. يُستخدم router-id صراحةً (32-bit، بصيغة IPv4 حتى على IPv6-only). الصيغة router ospfv3 هي الصيغة الحديثة الموصى بها على IOS XE 15.1+ — الصيغة القديمة ipv6 router ospf لا تزال تعمل لكنها لا تدعم IPv4 address-family.",
    parameters: [
      { name: "<process-id>", description: "معرّف عملية OSPFv3 المحلي (1-65535).", required: true, allowedValues: ["1-65535"] },
      { name: "vrf <vrf-name>", description: "يربط العملية بـ VRF محدد.", required: false }
    ],
    examples: [
      {
        context: "إعداد OSPFv3 مع address-family IPv6",
        code: "Router(config)# router ospfv3 1\nRouter(config-router)# router-id 1.1.1.1\nRouter(config-router)# exit\nRouter(config)# interface GigabitEthernet0/0/0\nRouter(config-if)# ipv6 enable\nRouter(config-if)# ipv6 address 2001:db8::1/64\nRouter(config-if)# ospfv3 1 ipv6 area 0\nRouter(config-if)# no shutdown",
        outputExplanation: "router ospfv3 1 ينشئ العملية. ospfv3 1 ipv6 area 0 على الواجهة يُفعّل OSPFv3 لـ IPv6 في area 0. router-id 32-bit بصيغة IPv4 حتى على شبكات IPv6-only."
      },
      {
        context: "OSPFv3 مع address-family IPv4 (ميزة جديدة)",
        code: "Router(config-router)# address-family ipv4 unicast\nRouter(config-router-af)# router-id 1.1.1.1\nRouter(config-router-af)# exit\nRouter(config)# interface GigabitEthernet0/0/0\nRouter(config-if)# ospfv3 1 ipv4 area 0",
        outputExplanation: "OSPFv3 يمكنه أيضًا توجيه IPv4 عبر address-family ipv4 — ميزة تجعل OSPFv3 بديلًا كاملًا لـ OSPFv2."
      }
    ],
    verificationCommands: ["show ospfv3 neighbor", "show ospfv3 database", "show ipv6 route ospf", "show ip route ospf"],
    troubleshootingNotes: [
      "OSPFv3 يتطلب router-id صراحةً — على شبكات IPv6-only بدون loopback IPv4، لن يُنتخب router-id تلقائيًا.",
      "OSPFv3 يعمل على link-local (FE80::) — تأكد أن الواجهة لها link-local address (ipv6 enable)."
    ],
    commonErrors: [
      "نسيان router-id صراحةً — على شبكات IPv6-only، OSPFv3 لن يُنتخب router-id بدونها.",
      "استخدام الصيغة القديمة ipv6 router ospf بدلًا من router ospfv3 — الصيغة القديمة لا تدعم IPv4 address-family."
    ],
    undoMethod: "no router ospfv3 <process-id>.",
    references: [{ label: "Cisco IOS XE OSPFv3 Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/configuration/17-12/iro-17-12-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-ospf", "cmd-ipv6-unicast-routing", "cmd-show-ip-ospf", "cmd-show-ip-ospf-neighbor"],
    tags: ["routing", "ospf", "ospfv3", "ipv6", "link-state", "igp", "enarsi"],
  },

  // ================================================================
  // EIGRP Named Mode
  // ================================================================
  {
    id: "cmd-router-eigrp-named",
    name: "router eigrp (named mode)",
    syntax: "router eigrp <instance-name>\n  address-family ipv4 unicast autonomous-system <as>\n  address-family ipv6 unicast autonomous-system <as>",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 15.0(1)M+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "Router Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(config-router)# → Router(config-router-af)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "EIGRP",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary:
      "EIGRP Named Mode — الصيغة الحديثة الموصى بها لـ EIGRP. تدعم IPv4 و IPv6 تحت عملية واحدة، مع بنية هرمية أوضح (af-interface، topology base). تحل محل الصيغة الكلاسيكية router eigrp <as>.",
    description:
      "EIGRP Named Mode (router eigrp <instance-name>) هو الصيغة الحديثة الموصى بها لـ EIGRP على IOS 15.0+ و IOS XE. ميزاتها: (1) تدعم IPv4 و IPv6 تحت عملية واحدة بدلًا من عمليتين منفصلتين. (2) بنية هرمية أوضح: af-interface (إعدادات الواجهة)، topology base (إعدادات الطوبولوجيا). (3) تعريف AS داخل address-family بدلًا من اسم العملية. (4) دعم multi-topology و VRF بشكل أنظف. الصيغة الكلاسيكية (router eigrp <as>) لا تزال تعمل لكنها لا تدعم هذه الميزات. Named Mode موصى به في CCNP ENARSI.",
    parameters: [
      { name: "<instance-name>", description: "اسم عملية EIGRP (نص حر). يمكن أن يكون رقم AS للتوافق مع الصيغة الكلاسيكية.", required: true }
    ],
    examples: [
      {
        context: "إعداد EIGRP Named Mode لـ IPv4 و IPv6",
        code: 'Router(config)# router eigrp ENTERPRISE\nRouter(config-router)# address-family ipv4 unicast autonomous-system 100\nRouter(config-router-af)# network 10.0.0.0 0.255.255.255\nRouter(config-router-af)# eigrp router-id 1.1.1.1\nRouter(config-router-af)# af-interface default\nRouter(config-router-af-interface)# passive-interface\nRouter(config-router-af-interface)# exit-af-interface\nRouter(config-router-af)# exit-address-family\nRouter(config-router)# address-family ipv6 unicast autonomous-system 100\nRouter(config-router-af)# eigrp router-id 1.1.1.1\nRouter(config-router-af)# af-interface GigabitEthernet0/0/0\nRouter(config-router-af-interface)# no passive-interface',
        outputExplanation: "عملية EIGRP واحدة (ENTERPRISE) تدعم IPv4 (AS 100) و IPv6 (AS 100). af-interface default تجعل كل الواجهات passive افتراضيًا، ثم no passive-interface على واجهات محددة."
      }
    ],
    verificationCommands: ["show eigrp protocols", "show ip eigrp topology", "show ipv6 eigrp topology", "show ip eigrp neighbors"],
    commonErrors: [
      "نسيان autonomous-system <as> داخل address-family — EIGRP لن يعمل بدونها.",
      "محاولة استخدام network statement عالميًا بدلًا من داخل address-family — في Named Mode، network تُكتب داخل af."
    ],
    undoMethod: "no router eigrp <instance-name>.",
    references: [{ label: "Cisco IOS EIGRP Named Mode Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_eigrp/configuration/17-12/ire-17-12-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-eigrp", "cmd-show-ip-eigrp-neighbors", "cmd-show-ip-eigrp-topology"],
    tags: ["routing", "eigrp", "named-mode", "ipv4", "ipv6", "enarsi"],
  },

  // ================================================================
  // clear ip route
  // ================================================================
  {
    id: "cmd-clear-ip-route",
    name: "clear ip route",
    syntax: "clear ip route {* | <network> <mask> | <network>/<prefix> | ospf | eigrp | bgp | rip}",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Privileged EXEC"],
    promptShape: "Router#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "IP Routing",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary: "يحذف مسارًا أو كل المسارات من جدول التوجيه RIB — يُجبر البروتوكولات على إعادة تثبيت المسارات. أمر تشخيصي لفرض إعادة حساب المسارات.",
    description:
      "clear ip route يحذف مسارًا محددًا أو كل المسارات من RIB (Routing Information Base). عند الحذف، يُعيد بروتوكول التوجيه المصدر تثبيت المسار فورًا (إذا كان لا يزال صالحًا). clear ip route * يحذف كل المسارات المتعلّمة — استخدمه بحذر شديد لأنه يسبب انقطاعًا مؤقتًا. clear ip route <network> <mask> يحذف مسارًا محددًا فقط — أكثر أمانًا. clear ip route ospf / eigrp / bgp يحذف كل مسارات بروتوكول محدد فقط. أمر حاسم في التشخيص: إذا كان مسار قديم عالقًا في RIB رغم تغيير الطوبولوجيا، clear ip route يجبر التحديث.",
    parameters: [
      { name: "*", description: "كل المسارات — استخدم بحذر شديد!", required: false },
      { name: "<network> <mask>", description: "مسار محدد (شبكة + قناع).", required: false },
      { name: "ospf | eigrp | bgp | rip", description: "كل مسارات بروتوكول محدد.", required: false }
    ],
    examples: [
      {
        context: "حذف مسار محدد لإعادة تثبيته",
        code: "Router# clear ip route 10.10.20.0 255.255.255.0"
      },
      {
        context: "حذف كل مسارات OSPF لإعادة تثبيتها",
        code: "Router# clear ip route ospf"
      }
    ],
    verificationCommands: ["show ip route", "show ip route ospf"],
    warnings: [
      "clear ip route * يسبب انقطاعًا مؤقتًا في التوجيه — استخدمه بحذر شديد في الإنتاج. أفضل وقت: خارج ساعات الذروة.",
    ],
    undoMethod: "لا ينطبق — الأثر فوري ويُسترد تلقائيًا عند إعادة تثبيت المسارات.",
    references: [{ label: "Cisco IOS IP Routing Command Reference", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute/command/ipr-cr-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-ip-route", "cmd-show-ip-protocols"],
    tags: ["routing", "diagnostics", "clear", "enarsi"],
  },

  // ================================================================
  // passive-interface (routing protocols)
  // ================================================================
  {
    id: "cmd-passive-interface",
    name: "passive-interface",
    syntax: "passive-interface {<interface> | default}\nno passive-interface <interface>",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Router Configuration"],
    promptShape: "Router(config-router)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "IP Routing",
    category: "Routing",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)", "CCNP ENCOR/ENARSI"],
    status: "Current",
    summary: "يمنع بروتوكول التوجيه من إرسال تحديثات/HELLO على واجهة محددة — مع الإبقاء على إعلان شبكة الواجهة. أمر أمان أساسي لمنافذ access المواجهة للمضيفين.",
    description:
      "passive-interface يمنع بروتوكول التوجيه (RIP, EIGRP, OSPF, IS-IS, BGP) من إرسال تحديثات أو HELLO على واجهة محددة. مع ذلك، الواجهة لا تزال مُعلَنة في بروتوكول التوجيه (شبكتها تُضاف للإعلان). هذا أمر أمان أساسي: على منافذ access المواجهة للمضيفين، لا حاجة لإرسال HELLO/تحديثات توجيه — المضيفون لا يحتاجونها وقد يستغلها مهاجم. الصيغة default تجعل كل الواجهات passive، ثم no passive-interface على روابط التوجيه فقط — ممارسة فضلى موصى بها. في EIGRP، passive-interface يمنع HELLO تمامًا (لا يتشكل تجاور). في OSPF، يمنع HELLO لكن الشبكة تظهر في LSDB. في RIP، يمنع التحديثات لكن يستقبلها.",
    parameters: [
      { name: "<interface>", description: "واجهة محددة.", required: false },
      { name: "default", description: "يجعل كل الواجهات passive افتراضيًا — ثم استخدم no passive-interface على روابط التوجيه.", required: false }
    ],
    examples: [
      {
        context: "جعل كل الواجهات passive ثم تفعيل روابط التوجيه فقط (OSPF)",
        code: "Router(config)# router ospf 1\nRouter(config-router)# passive-interface default\nRouter(config-router)# no passive-interface GigabitEthernet0/0/0\nRouter(config-router)# no passive-interface GigabitEthernet0/0/1",
        outputExplanation: "كل الواجهات passive افتراضيًا (أمان). فقط Gi0/0/0 و Gi0/0/1 (روابط التوجيه) تُرسل HELLO. منافذ access المواجهة للمضيفين لن تُرسل OSPF."
      }
    ],
    verificationCommands: ["show ip protocols", "show ip ospf interface brief"],
    commonErrors: [
      "نسيان no passive-interface على رابط توجيه بعد passive-interface default — التجاور لن يتشكل على ذلك الرابط.",
    ],
    undoMethod: "no passive-interface <interface> أو no passive-interface default.",
    references: [{ label: "Cisco IOS IP Routing Command Reference", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute/command/ipr-cr-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-ospf", "cmd-router-eigrp", "cmd-router-rip", "cmd-router-isis"],
    tags: ["routing", "security", "passive-interface", "ccna", "encor"],
  },

  // ================================================================
  // distribute-list (route filtering)
  // ================================================================
  {
    id: "cmd-distribute-list",
    name: "distribute-list",
    syntax: "distribute-list {<acl> | prefix <prefix-list> | route-map <name>} {in | out} [<interface> | <routing-process>]",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Router Configuration"],
    promptShape: "Router(config-router)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "Route Policy",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary: "يرشّح المسارات الواردة أو الصادرة لبروتوكول توجيه باستخدام ACL أو prefix-list أو route-map. أمر فلترة أساسي في التوجيه.",
    description:
      "distribute-list يرشّح المسارات قبل تثبيتها في RIB (in) أو قبل الإعلان للجيران (out). يدعم ACL، prefix-list، أو route-map للترشيح. يُستخدم في RIP, EIGRP, OSPF (لتوجيه الترشيح بين areas أو عمليات). على عكس route-map في redistribution، distribute-list يعمل على مستوى بروتوكول التوجيه نفسه — يرشّح الحركة الداخلة أو الخارجة من/إلى العملية. في OSPF، distribute-list in يرشّح قبل التثبيت في RIB لكن لا يرشّح LSDB. distribute-list out في OSPF يعمل فقط مع redistribution، لا مع المسارات داخل المنطقة.",
    parameters: [
      { name: "<acl> | prefix <prefix-list> | route-map <name>", description: "آلية الترشيح: ACL، prefix-list، أو route-map.", required: true },
      { name: "in | out", description: "in = قبل التثبيت في RIB. out = قبل الإعلان.", required: true, allowedValues: ["in", "out"] },
      { name: "<interface> | <routing-process>", description: "ترشيح لواجهة محددة أو بروتوكول محدد (لـ redistribution).", required: false }
    ],
    examples: [
      {
        context: "منع مسار محدد من التثبيت في RIB (RIP)",
        code: "Router(config)# ip prefix-list PFX-BLOCK deny 10.10.50.0/24\nRouter(config)# ip prefix-list PFX-BLOCK permit 0.0.0.0/0 le 32\nRouter(config)# router rip\nRouter(config-router)# distribute-list prefix PFX-BLOCK in"
      },
      {
        context: "منع إعلان مسار محدد لجيران EIGRP",
        code: "Router(config)# access-list 10 deny 10.10.50.0 0.0.0.255\nRouter(config)# access-list 10 permit any\nRouter(config)# router eigrp 100\nRouter(config-router)# distribute-list 10 out GigabitEthernet0/0/0"
      }
    ],
    verificationCommands: ["show ip protocols", "show ip route", "show access-lists", "show ip prefix-list"],
    commonErrors: [
      "في OSPF، distribute-list out لا يعمل على المسارات داخل المنطقة — فقط على redistributed routes.",
      "نسيان permit 0.0.0.0/0 le 32 في نهاية prefix-list — كل المسارات ستُرفَض (deny ضمني).",
    ],
    undoMethod: "no distribute-list <acl/prefix/route-map> {in | out} [<interface>].",
    references: [{ label: "Cisco IOS IP Routing Command Reference", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute/command/ipr-cr-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-route-map", "cmd-ip-prefix-list", "cmd-ip-access-list-extended", "cmd-redistribute"],
    tags: ["routing", "filtering", "distribute-list", "policy", "enarsi"],
  },

  // ================================================================
  // OSPF area range (summarization)
  // ================================================================
  {
    id: "cmd-area-range",
    name: "area range",
    syntax: "area <area-id> range <network> <mask> [{advertise | not-advertise}] [cost <cost>]",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Router Configuration"],
    promptShape: "Router(config-router)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "OSPF",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary: "يلخّص مسارات OSPF على حدود المنطقة (ABR) — يدمج عدة شبكات فرعية في summary route واحدة قبل الإعلان لمنطقة أخرى. يقلل LSDB وحركة SPF.",
    description:
      "area range يُستخدم على ABR (Area Border Router) في OSPF لتلخيص المسارات بين المناطق. يدمج عدة شبكات فرعية داخل منطقة في summary route واحدة قبل الإعلان لمنطقة أخرى (عادةً area 0). هذا يقلل: (1) حجم LSDB في المناطق الأخرى، (2) حركة SPF re-calculation، (3) حجم جدول التوجيه. الكلمة advertise (افتراضي) تعلن الـ summary. not-advertise تمنع الإعلان (filtering). cost تضبط تكلفة الـ summary. التلخيص يعمل فقط على ABR — لا على موجّه داخل منطقة واحدة.",
    parameters: [
      { name: "<area-id>", description: "رقم المنطقة المُلخَّصة (المنطقة المصدر).", required: true },
      { name: "<network> <mask>", description: "عنوان الشبكة المُلخَّصة + القناع.", required: true },
      { name: "advertise | not-advertise", description: "advertise (افتراضي) يعلن الـ summary. not-advertise يمنعه.", required: false, defaultValue: "advertise" },
      { name: "cost <cost>", description: "تكلفة الـ summary route.", required: false }
    ],
    examples: [
      {
        context: "تلخيص شبكات area 1 في summary واحدة قبل الإعلان لـ area 0",
        code: "Router(config)# router ospf 1\nRouter(config-router)# area 1 range 10.10.0.0 255.255.0.0",
        outputExplanation: "كل شبكات 10.10.x.x داخل area 1 ستُلخَّص في 10.10.0.0/16 واحدة قبل الإعلان لـ area 0. يقلل LSDB في area 0."
      }
    ],
    verificationCommands: ["show ip ospf database summary", "show ip route ospf", "show ip ospf border-routers"],
    commonErrors: [
      "محاولة استخدام area range على موجّه غير ABR — يعمل فقط على ABR.",
      "تلخيص ضيق جدًا (مثلًا /25 بدلًا من /24) — لا يدمج شيئًا.",
    ],
    undoMethod: "no area <area-id> range <network> <mask>.",
    references: [{ label: "Cisco IOS OSPF Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/configuration/17-12/iro-17-12-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-ospf", "cmd-show-ip-ospf", "cmd-show-ip-ospf-database"],
    tags: ["routing", "ospf", "summarization", "abr", "enarsi"],
  },

  // ================================================================
  // EIGRP summary-address
  // ================================================================
  {
    id: "cmd-summary-address-eigrp",
    name: "summary-address (EIGRP)",
    aliases: ["ip summary-address eigrp", "summary-address"],
    syntax: "interface <iface>\n  ip summary-address eigrp <as> <network> <mask> [<admin-distance>]",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration"],
    promptShape: "Router(config-if)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "EIGRP",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary: "يلخّص مسارات EIGRP على مستوى الواجهة — يُعلن summary route واحدة بدلًا من عدة شبكات فرعية على ذلك الرابط. على عكس OSPF، تلخيص EIGRP على مستوى الواجهة وليس ABR.",
    description:
      "ip summary-address eigrp يُستخدم في EIGRP لتلخيص المسارات على مستوى الواجهة. على عكس OSPF (الذي يلخّص على ABR)، EIGRP يلخّص على كل واجهة — يُعلن summary route واحدة بدلًا من عدة شبكات فرعية على ذلك الرابط المحدد. عندما يُعلن الـ summary، تُنشأ تلقائيًا null route للمsummary (لمنع حلقات التوجيه). التلخيص يقلل: (1) حجم تحديثات EIGRP، (2) حجم جدول التوجيه على الجار، (3) استهلاك النطاق الترددي. لكنه يخفي تفاصيل الطوبولوجيا وقد يسبب sub-optimal routing.",
    parameters: [
      { name: "<as>", description: "رقم AS لـ EIGRP.", required: true },
      { name: "<network> <mask>", description: "عنوان الشبكة المُلخَّصة + القناع.", required: true },
      { name: "<admin-distance>", description: "مسافة إدارية للـ summary (افتراضي 5).", required: false, defaultValue: "5" }
    ],
    examples: [
      {
        context: "تلخيص شبكات EIGRP على واجهة",
        code: "Router(config)# interface GigabitEthernet0/0/0\nRouter(config-if)# ip summary-address eigrp 100 10.10.0.0 255.255.0.0",
        outputExplanation: "كل شبكات 10.10.x.x ستُعلن كـ 10.10.0.0/16 واحدة على Gi0/0/0. null route تُنشأ تلقائيًا لـ 10.10.0.0/16."
      }
    ],
    verificationCommands: ["show ip route 10.10.0.0", "show ip eigrp topology", "show ip interface <iface>"],
    commonErrors: [
      "نسيان أن التلخيص على مستوى الواجهة — يلخّص فقط على ذلك الرابط، ليس لكل الجيران.",
    ],
    undoMethod: "no ip summary-address eigrp <as> <network> <mask>.",
    references: [{ label: "Cisco IOS EIGRP Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_eigrp/configuration/17-12/ire-17-12-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-eigrp", "cmd-show-ip-eigrp-topology", "cmd-area-range"],
    tags: ["routing", "eigrp", "summarization", "enarsi"],
  },

  // ================================================================
  // default-information originate (OSPF)
  // ================================================================
  {
    id: "cmd-default-information-originate",
    name: "default-information originate",
    syntax: "default-information originate [always] [metric <metric>] [metric-type {1 | 2}] [route-map <name>]",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Router Configuration"],
    promptShape: "Router(config-router)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "OSPF",
    category: "Routing",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary: "يُعلن المسار الافتراضي (0.0.0.0/0) في OSPF — يُولّد Type 5 LSA. always يُعلن الافتراضي حتى لو لم يكن موجودًا في RIB. route-map للإعلان المشروط.",
    description:
      "default-information originate يُستخدم في OSPF لإعلان المسار الافتراضي (0.0.0.0/0) للمجاورة. يُنشئ Type 5 External LSA. بدون always، يُعلن الافتراضي فقط إذا وُجد مسار افتراضي في RIB (static أو من بروتوكول آخر). always يُعلن الافتراضي دائمًا حتى لو لم يكن في RIB — مفيد لموجّه البوابة الذي يجب أن يُعلن الافتراضي للشبكة الداخلية. route-map تُعلن الافتراضي بشكل مشروط (مثلًا فقط إذا كان مسار معين موجودًا — لـ conditional default routing). metric-type 1 يجعل تكلفة الافتراضي تُضاف لتكلفة المسار الداخلي (E1)، type 2 (افتراضي) يبقي التكلفة ثابتة (E2).",
    parameters: [
      { name: "always", description: "يُعلن الافتراضي دائمًا حتى لو لم يكن في RIB.", required: false },
      { name: "metric <metric>", description: "تكلفة الافتراضي. افتراضي 1.", required: false, defaultValue: "1" },
      { name: "metric-type {1 | 2}", description: "E1 = تكلفة تُضاف. E2 (افتراضي) = ثابتة.", required: false, defaultValue: "2" },
      { name: "route-map <name>", description: "إعلان مشروط بناءً على route-map.", required: false }
    ],
    examples: [
      {
        context: "إعلان افتراضي مشروط في OSPF (فقط إذا وُجد مسار معين)",
        code: "Router(config)# ip access-list standard ACL-HAS-DEFAULT\nRouter(config-std-nacl)# permit 0.0.0.0\nRouter(config)# route-map RM-DEFAULT-CONDITION permit 10\nRouter(config-route-map)# match ip address ACL-HAS-DEFAULT\nRouter(config)# router ospf 1\nRouter(config-router)# default-information originate route-map RM-DEFAULT-CONDITION"
      },
      {
        context: "إعلان افتراضي دائم (always)",
        code: "Router(config-router)# default-information originate always"
      }
    ],
    verificationCommands: ["show ip ospf database external", "show ip route 0.0.0.0", "show ip ospf border-routers"],
    commonErrors: [
      "استخدام default-information originate بدون always وبدون مسار افتراضي في RIB — لن يُعلن شيئًا.",
    ],
    undoMethod: "no default-information originate.",
    references: [{ label: "Cisco IOS OSPF Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/configuration/17-12/iro-17-12-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-ospf", "cmd-ip-route-static", "cmd-show-ip-ospf-database"],
    tags: ["routing", "ospf", "default-route", "enarsi"],
  },

  // ================================================================
  // BGP route-reflector-client
  // ================================================================
  {
    id: "cmd-bgp-route-reflector-client",
    name: "neighbor route-reflector-client",
    aliases: ["route-reflector-client", "route-reflector"],
    syntax: "neighbor <ip> route-reflector-client",
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
    summary: "يحوّل جار iBGP إلى route reflector client — يسمح للموجّه (Route Reflector) بإعادة إعلان مسارات iBGP المتعلّمة للعملاء. يحل مشكلة full-mesh iBGP.",
    description:
      "neighbor route-reflector-client يحوّل جار iBGP إلى route reflector client. في iBGP العادي، المسارات المتعلّمة من جار iBGP لا تُعاد إعلانها لجيران iBGP آخرين — يتطلب full-mesh (n(n-1)/2 جلسات). Route Reflector (RR) يحل هذا: RR يأخذ مسارات iBGP من client ويعيد إعلانها لعملاء آخرين. هذا يقلل الجلسات من full-mesh إلى star topology. RR و client يشكلان cluster. cluster-id يُستخدم لمنع حلقات إذا وُجد RRs متعددة. لا حاجة لتكوين خاص على client — التكوين كله على RR. في address-family: neighbor <ip> route-reflector-client داخل af ipv4 unicast.",
    parameters: [
      { name: "<ip>", description: "عنوان جار iBGP المراد تحويله إلى client.", required: true }
    ],
    examples: [
      {
        context: "إعداد Route Reflector مع 3 clients",
        code: "Router(config)# router bgp 65001\nRouter(config-router)# neighbor 10.0.0.2 remote-as 65001\nRouter(config-router)# neighbor 10.0.0.3 remote-as 65001\nRouter(config-router)# neighbor 10.0.0.4 remote-as 65001\nRouter(config-router)# address-family ipv4 unicast\nRouter(config-router-af)# neighbor 10.0.0.2 route-reflector-client\nRouter(config-router-af)# neighbor 10.0.0.3 route-reflector-client\nRouter(config-router-af)# neighbor 10.0.0.4 route-reflector-client\nRouter(config-router-af)# exit",
        outputExplanation: "10.0.0.2 و .3 و .4 هم clients. هذا الموجّه هو RR — سيعيد إعلان مسارات iBGP بينهم بدون full-mesh."
      }
    ],
    verificationCommands: ["show bgp ipv4 unicast neighbors", "show bgp ipv4 unicast"],
    commonErrors: [
      "تطبيق route-reflector-client على جار eBGP — يعمل فقط مع iBGP (نفس AS).",
    ],
    undoMethod: "no neighbor <ip> route-reflector-client.",
    references: [{ label: "Cisco IOS BGP Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_bgp/configuration/17-12/irg-17-12-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-router-bgp", "cmd-bgp-neighbor", "cmd-show-bgp-summary"],
    tags: ["routing", "bgp", "route-reflector", "ibgp", "encor"],
  },

  // ================================================================
  // DTP — Dynamic Trunking Protocol
  // ================================================================
  {
    id: "cmd-switchport-nonegotiate",
    name: "switchport nonegotiate",
    syntax: "switchport nonegotiate",
    platforms: ["IOS", "IosXe"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Interface Configuration"],
    promptShape: "Switch(config-if)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "VLANs and SVI",
    category: "Switching",
    curriculumVersions: ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"],
    status: "Current",
    summary: "يُعطّل DTP (Dynamic Trunking Protocol) على المنفذ — يمنع التفاوض التلقائي على trunk. أمر أمان أساسي: يمنع تحويل منفذ access إلى trunk عن طريق الخطأ.",
    description:
      "switchport nonegotiate يُعطّل DTP (Dynamic Trunking Protocol) على المنفذ. DTP هو بروتوكول Cisco خاص يتفاوض تلقائيًا على وضع trunk بين محولين. على منافذ access المواجهة للمستخدمين، DTP خطر — مهاجم يمكنه استغلاله لتحويل المنفذ إلى trunk والوصول لكل VLANs. switchport nonegotiate يمنع هذا تمامًا. على منافذ trunk المُعدّة صراحةً (switchport mode trunk)، لا حاجة لـ DTP — عطّله أيضًا. الممارسة الفضلى: استخدم switchport mode access + switchport nonegotiate على كل منافذ access، و switchport mode trunk + switchport nonegotiate على كل منافذ trunk.",
    examples: [
      {
        context: "تعطيل DTP على منفذ access (أمان)",
        code: "Switch(config)# interface Gi1/0/10\nSwitch(config-if)# switchport mode access\nSwitch(config-if)# switchport access vlan 10\nSwitch(config-if)# switchport nonegotiate"
      },
      {
        context: "تعطيل DTP على منفذ trunk صريح",
        code: "Switch(config-if)# switchport mode trunk\nSwitch(config-if)# switchport trunk allowed vlan 10,20,30\nSwitch(config-if)# switchport nonegotiate"
      }
    ],
    verificationCommands: ["show interfaces <iface> switchport", "show dtp interface <iface>"],
    commonErrors: [
      "نسيان switchport nonegotiate على منافذ access — يترك DTP مفعّلًا ويسمح بتفاوض trunk غير المرغوب.",
    ],
    undoMethod: "no switchport nonegotiate (يعيد تفعيل DTP).",
    references: [{ label: "Catalyst 9300 Layer 2 Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/l2/b_1712_l2_9300_9300l/vlans.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-switchport-mode-trunk", "cmd-switchport-access-vlan", "cmd-show-interfaces-switchport"],
    tags: ["switching", "dtp", "security", "ccna"],
  },

  // ================================================================
  // SPAN / RSPAN — monitor session
  // ================================================================
  {
    id: "cmd-monitor-session",
    name: "monitor session",
    syntax: "monitor session <session> source {interface <iface> | vlan <vlan>} [both | rx | tx]\nmonitor session <session> destination {interface <iface> | vlan <vlan>}",
    platforms: ["IOS", "IosXe", "NxOs"],
    versionRange: "جميع الإصدارات المدعومة",
    cliMode: ["Global Configuration"],
    promptShape: "Switch(config)#",
    certLevel: "CCNP-ENCOR",
    scope: "certification",
    topic: "Switching Fundamentals",
    category: "Switching",
    curriculumVersions: ["CCNP ENCOR (350-401) v1.1"],
    status: "Current",
    summary: "يُعدّ SPAN (Switched Port Analyzer) لمراقبة حركة منفذ/VLAN بنسخها لمنفذ تحليل (sniffer). RSPAN يسمح بالمراقبة عبر محولات. أمر تشخيص أساسي.",
    description:
      "monitor session يُعدّ SPAN (Switched Port Analyzer) — ينسخ حركة من منفذ مصدر (source) أو VLAN إلى منفذ وجهة (destination) موصول بأداة تحليل (Wireshark, NAM, IDS). SPAN محلي (على نفس المحول). RSPAN (Remote SPAN) يسمح بنسخ الحركة عبر محولات عبر VLAN مخصصة. ERSPAN (Encapsulated Remote SPAN) يغلف الحركة في GRE لإرسالها عبر Layer 3. all|rx|tx يحدد الاتجاه. SPAN لا يؤثر على الحركة الأصلية — فقط ينسخها. استخدمه لتشخيص مشاكل الأداء، الأمان، أو البروتوكولات.",
    parameters: [
      { name: "<session>", description: "رقم جلسة SPAN (1-66).", required: true },
      { name: "source", description: "المصدر: منفذ أو VLAN المراد مراقبته.", required: true },
      { name: "destination", description: "الوجهة: منفذ التحليل (sniffer).", required: true },
      { name: "both | rx | tx", description: "الاتجاه: both (افتراضي)، rx (دخول)، tx (خروج).", required: false, defaultValue: "both" }
    ],
    examples: [
      {
        context: "SPAN محلي: مراقبة حركة منفذ على منفذ تحليل",
        code: "Switch(config)# monitor session 1 source interface Gi1/0/10 both\nSwitch(config)# monitor session 1 destination interface Gi1/0/24",
        outputExplanation: "حركة Gi1/0/10 (دخول+خروج) تُنسَخ لـ Gi1/0/24 — وصِل جهاز Wireshark على Gi1/0/24."
      },
      {
        context: "RSPAN: مراقبة عبر محولين",
        code: "! على المحول الأول (المصدر)\nSw1(config)# vlan 999\nSw1(config-vlan)# name RSPAN-VLAN\nSw1(config-vlan)# remote-span\nSw1(config)# monitor session 1 source interface Gi1/0/10\nSw1(config)# monitor session 1 destination remote vlan 999\n\n! على المحول الثاني (الوجهة)\nSw2(config)# vlan 999\nSw2(config-vlan)# remote-span\nSw2(config)# monitor session 1 source remote vlan 999\nSw2(config)# monitor session 1 destination interface Gi1/0/24"
      }
    ],
    verificationCommands: ["show monitor session 1", "show monitor", "show monitor session all"],
    commonErrors: [
      "وصل الموجه الوجهة بمنفذ access عادي بدلًا من منفذ التحليل — الحركة المنسوخة لا تخرج للجهاز.",
    ],
    undoMethod: "no monitor session <session>.",
    references: [{ label: "Catalyst 9300 SPAN Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_9300l/span.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-show-interfaces", "cmd-show-interfaces-status"],
    tags: ["switching", "span", "rspan", "monitoring", "encor"],
  },

  // ================================================================
  // IP Source Guard
  // ================================================================
  {
    id: "cmd-ip-source-guard",
    name: "ip verify source",
    syntax: "ip verify source [{mac | tracking}]",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.2(14)SX+؛ IOS XE كافة",
    cliMode: ["Interface Configuration"],
    promptShape: "Switch(config-if)#",
    certLevel: "CCNP-ENARSI",
    scope: "certification",
    topic: "Switch Security",
    category: "Security",
    curriculumVersions: ["CCNP ENARSI (300-410) v1.1"],
    status: "Current",
    summary: "يُفعّل IP Source Guard — يرشّح الحركة بناءً على DHCP snooping binding table. يمنع IP spoofing على منافذ access.",
    description:
      "ip verify source يُفعّل IP Source Guard على المنفذ. IP Source Guard يرشّح الحركة الواردة بناءً على DHCP snooping binding table — يسمح فقط بالحركة من عناوين IP المُخصَّصة عبر DHCP. هذا يمنع IP spoofing: مهاجم لا يمكنه استخدام عنوان IP مزيف حتى لو كان MAC صحيحًا. الكلمة mac تُضيف فحص MAC أيضًا (يجب تطابق IP + MAC مع binding table). الكلمة tracking تتبع الحركة حتى للمصادر غير المعروفة (يسجلها بدل رفضها). IP Source Guard يتطلب DHCP snooping مُفعّل — يستخدم binding table الخاصة به.",
    parameters: [
      { name: "mac", description: "يفحص IP + MAC معًا (تطابق binding table).", required: false },
      { name: "tracking", description: "يتتبع الحركة غير المعروفة بدلًا من رفضها.", required: false }
    ],
    examples: [
      {
        context: "تفعيل IP Source Guard على منفذ access",
        code: "Switch(config)# ip dhcp snooping\nSwitch(config)# ip dhcp snooping vlan 10,20\nSwitch(config)# interface Gi1/0/10\nSwitch(config-if)# ip verify source\nSwitch(config-if)# ip verify source mac  ! للفحص المزدوج IP+MAC"
      }
    ],
    verificationCommands: ["show ip verify source", "show ip source binding", "show ip dhcp snooping binding"],
    commonErrors: [
      "تفعيل IP Source Guard بدون DHCP snooping — لن يعمل لأنه يحتاج binding table.",
    ],
    undoMethod: "no ip verify source.",
    references: [{ label: "Catalyst 9300 Security Configuration Guide — IP Source Guard", url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_9300l/ip_source_guard.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ip-dhcp-snooping", "cmd-ip-arp-inspection", "cmd-switchport-port-security"],
    tags: ["security", "switching", "ip-source-guard", "enarsi"],
  },

  // ================================================================
  // CoPP — Control Plane Policing
  // ================================================================
  {
    id: "cmd-control-plane",
    name: "control-plane (CoPP)",
    aliases: ["control-plane", "copp"],
    syntax: "control-plane\n  service-policy {input | output} <policy-map-name>",
    platforms: ["IOS", "IosXe", "NxOs", "IosXr"],
    versionRange: "IOS 12.2(18)S+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(config-cp)#",
    certLevel: "Extended",
    scope: "extended",
    topic: "Network Security",
    category: "Security",
    status: "Current",
    summary: "يُفعّل CoPP (Control Plane Policing) — يطبّق QoS policy على حركة control plane (routing protocols, management, exceptions) لحمايته من DoS attacks.",
    description:
      "control-plane يدخل وضع Control Plane Configuration، حيث تُطبّق service-policy (QoS policy-map) على حركة control plane. CoPP (Control Plane Policing) حاسم لأمان الموجّهات: يحدّ معدل حزم control plane (OSPF/EIGRP/BGP hellos, SNMP, SSH, Telnet, ICMP exceptions) لمنع DoS attacks على control plane. بدون CoPP، فيضان من حزم control plane يمكن أن يستهلك CPU بالكامل ويسبب تعطل التوجيه. أنشئ class-map تصنف حركة control plane، ثم policy-map تحدد rate-limiting، ثم طبّقها على control-plane. على NX-OS و IOS XR، CoPP مُفعّل افتراضيًا بسياسات محددة مسبقًا.",
    examples: [
      {
        context: "إعداد CoPP أساسي لحد معدل SSH و SNMP",
        code: 'Router(config)# class-map match-any CM-MGMT\nRouter(config-cmap)# match access-group name ACL-SSH\nRouter(config-cmap)# match access-group name ACL-SNMP\nRouter(config)# policy-map PM-COPP\nRouter(config-pmap)# class CM-MGMT\nRouter(config-pmap-c)# police 100000 conform-action transmit exceed-action drop\nRouter(config-pmap-c)# exit\nRouter(config-pmap)# class class-default\nRouter(config-pmap-c)# police 10000 conform-action transmit exceed-action drop\nRouter(config-pmap-c)# exit\nRouter(config)# control-plane\nRouter(config-cp)# service-policy input PM-COPP',
        outputExplanation: "حركة الإدارة (SSH + SNMP) محدودة بـ 100Kbps. كل ما تبقى محدود بـ 10Kbps. ما يفوق يُسقَط — يحمي control plane من DoS."
      }
    ],
    verificationCommands: ["show policy-map control-plane", "show policy-map control-plane input", "show class-map"],
    warnings: [
      "CoPP خطر إذا ضُبط بطريقة خاطئة — قد يحجب حركة control plane المشروعة ويسبب فقدان تجاور التوجيه. اختبر في بيئة lab أولًا.",
    ],
    undoMethod: "no control-plane (يحذف كل CoPP) أو no service-policy {input | output} <name> (يحذف policy محددة).",
    references: [{ label: "Cisco IOS Control Plane Policing Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/isg/configuration/17-12/isg-17-12-book/isg-cfg-ctrl-pln-plc.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-class-map", "cmd-policy-map", "cmd-service-policy"],
    tags: ["security", "qos", "copp", "control-plane", "extended"],
  },

  // ================================================================
  // 802.1X
  // ================================================================
  {
    id: "cmd-dot1x",
    name: "dot1x",
    syntax: "dot1x system-auth-control\naaa authentication dot1x default group radius\ndot1x port-control auto (interface)",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.1(12)c.E1+؛ IOS XE كافة",
    cliMode: ["Global Configuration", "Interface Configuration"],
    promptShape: "Switch(config)# / Switch(config-if)#",
    certLevel: "Extended",
    scope: "extended",
    topic: "Network Security",
    category: "Security",
    status: "Current",
    summary: "يُفعّل 802.1X (IEEE port-based authentication) — يتطلب مصادقة RADIUS قبل السماح بالوصول للشبكة على منفذ access. معيار NAC الأساسي.",
    description:
      "dot1x يُفعّل IEEE 802.1X port-based authentication على المحول. 802.1X يتطلب من كل جهاز يُحاول الوصول للشبكة المصادقة عبر RADIUS قبل السماح بالحركة. يتطلب 3 مكونات: (1) Supplicant (عميل على الجهاز، مثل Windows 802.1X client)، (2) Authenticator (المحول)، (3) Authentication Server (RADIUS). dot1x system-auth-control يُفعّل 802.1X عالميًا. aaa authentication dot1x default group radius يُعدّ RADIUS كمصدر المصادقة. dot1x port-control auto على الواجهة يُفعّل 802.1X (auto = يطلب مصادقة قبل السماح). 802.1X معيار NAC (Network Access Control) الأساسي في الشبكات المؤسسية.",
    examples: [
      {
        context: "إعداد 802.1X مع RADIUS",
        code: "Switch(config)# aaa new-model\nSwitch(config)# aaa authentication dot1x default group radius local\nSwitch(config)# dot1x system-auth-control\nSwitch(config)# radius server RADIUS-01\nSwitch(config-radius-server)# address ipv4 10.10.99.20\nSwitch(config-radius-server)# key 7 <encrypted-key>\nSwitch(config)# interface Gi1/0/10\nSwitch(config-if)# switchport mode access\nSwitch(config-if)# dot1x port-control auto\nSwitch(config-if)# dot1x reauthentication",
        outputExplanation: "802.1X مُفعّل عالميًا. RADIUS على 10.10.99.20. منفذ Gi1/0/10 يتطلب مصادقة (auto) قبل السماح بالحركة. reauthentication يطلب إعادة المصادقة دوريًا."
      }
    ],
    verificationCommands: ["show dot1x", "show dot1x all", "show dot1x interface <iface>", "show aaa servers"],
    commonErrors: [
      "نسيان dot1x system-auth-control عالميًا — 802.1X على الواجهة لن يعمل بدونه.",
      "عدم تكوين RADIUS server — 802.1X لا يعمل بدون RADIUS (أو TACACS+، لكن RADIUS معيار 802.1X).",
    ],
    undoMethod: "no dot1x system-auth-control + no dot1x port-control auto على كل واجهة.",
    references: [{ label: "Catalyst 9300 802.1X Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-12/configuration_guide/sec/b_1712_sec_9300_9300l/ieee_802_1x.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-aaa-new-model", "cmd-radius-server", "cmd-tacacs-server"],
    tags: ["security", "802.1x", "nac", "radius", "extended"],
  },

  // ================================================================
  // RADIUS server
  // ================================================================
  {
    id: "cmd-radius-server",
    name: "radius server",
    syntax: "radius server <name>\n  address {ipv4 <ip> | ipv6 <ipv6>} [auth-port <port>] [acct-port <port>]\n  key {0 | 7} <key>\n  retransmit <retries>\n  timeout <seconds>",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 15.0+؛ IOS XE كافة (الصيغة الحديثة radius server بدلًا من radius-server host)",
    cliMode: ["Global Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(config-radius-server)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Security",
    category: "Security",
    curriculumVersions: ["CCNA v2.0 (200-301)"],
    status: "Current",
    summary: "يُعرّف خادم RADIUS للتكامل مع AAA. RADIUS هو معيار IETF (RFC 2865) لمصادقة الشبكة — يستخدم في 802.1X و VPN و management access.",
    description:
      "radius server يُعرّف خادم RADIUS على الجهاز. RADIUS (Remote Authentication Dial-In User Service، RFC 2865) هو معيار IETF لمصادقة الشبكة — يستخدم UDP ports 1812 (auth) و 1813 (accounting). على عكس TACACS+ (الذي يشفر كل الحزمة)، RADIUS يشفر فقط كلمة السر. RADIUS مفضل لـ 802.1X و VPN و wireless. TACACS+ مفضل لإدارة الأجهزة (per-command authorization). الصيغة الحديثة radius server <name> (IOS 15.0+) أنظف من الصيغة القديمة radius-server host <ip> key <key>. يمكن تعريف عدة خوادم للمرونة.",
    parameters: [
      { name: "<name>", description: "اسم خادم RADIUS (نص حر).", required: true },
      { name: "address ipv4 <ip>", description: "عنوان IPv4 للخادم.", required: true },
      { name: "auth-port <port>", description: "منفذ المصادقة. افتراضي 1812.", required: false, defaultValue: "1812" },
      { name: "key {0 | 7} <key>", description: "المفتاح المشترك (shared secret). 0=nص واضح، 7=مشفر.", required: true },
      { name: "retransmit <retries>", description: "عدد إعادة الإرسال. افتراضي 3.", required: false, defaultValue: "3" },
      { name: "timeout <seconds>", description: "مهلة الانتظار. افتراضي 5 ثوانٍ.", required: false, defaultValue: "5" }
    ],
    examples: [
      {
        context: "إعداد خادم RADIUS لـ AAA",
        code: "Router(config)# aaa new-model\nRouter(config)# radius server RADIUS-PRIMARY\nRouter(config-radius-server)# address ipv4 10.10.99.20\nRouter(config-radius-server)# key 7 <encrypted-key>\nRouter(config-radius-server)# retransmit 2\nRouter(config-radius-server)# timeout 3\nRouter(config)# aaa authentication login default group radius local",
        outputExplanation: "خادم RADIUS على 10.10.99.20، المفتاح مشفر (Type 7)، إعادة إرسال مرتين، مهلة 3 ثوانٍ. AAA login يستخدم RADIUS أولًا، local كاحتياطي."
      }
    ],
    verificationCommands: ["show aaa servers", "show radius servers", "test aaa group radius <user> <pass> legacy"],
    commonErrors: [
      "الخلط بين المنافذ القديمة (1645/1646) والجديدة (1812/1813) — تحقق من إعداد الخادم.",
    ],
    undoMethod: "no radius server <name>.",
    references: [{ label: "Cisco IOS Security Command Reference — radius server", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/security/s1/sec-s1-cr-book/sec-s1-cr-book_chapter3.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-aaa-new-model", "cmd-tacacs-server", "cmd-dot1x"],
    tags: ["security", "aaa", "radius", "ccna"],
  },

  // ================================================================
  // TACACS+ server
  // ================================================================
  {
    id: "cmd-tacacs-server",
    name: "tacacs server",
    syntax: "tacacs server <name>\n  address ipv4 <ip>\n  key {0 | 7} <key>\n  port <port>\n  timeout <seconds>\n  single-connection",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 15.0+؛ IOS XE كافة (الصيغة الحديثة tacacs server بدلًا من tacacs-server host)",
    cliMode: ["Global Configuration", "Sub-mode"],
    promptShape: "Router(config)# → Router(config-server-tacacs)#",
    certLevel: "CCNA",
    scope: "certification",
    topic: "Security",
    category: "Security",
    curriculumVersions: ["CCNA v2.0 (200-301)"],
    status: "Current",
    summary: "يُعرّف خادم TACACS+ للتكامل مع AAA. TACACS+ خاص بـ Cisco — يشفر كل الحزمة ويدعم per-command authorization. مفضل لإدارة الأجهزة.",
    description:
      "tacacs server يُعرّف خادم TACACS+ على الجهاز. TACACS+ (Terminal Access Controller Access-Control System Plus) هو بروتوكول Cisco خاص (RFC draft). على عكس RADIUS: (1) TACACS+ يشفر كل الحزمة (ليس فقط كلمة السر). (2) يستخدم TCP port 49 (موثوق). (3) يفصل Authentication و Authorization و Accounting في 3 عمليات مستقلة. (4) يدعم per-command authorization (يمكن تقييد كل أمر على مستوى المستخدم). TACACS+ مفضل لإدارة الأجهزة (device administration) — يسمح بالتحكم الدقيق في صلاحيات كل مستخدم. RADIUS مفضل لـ 802.1X و VPN (network access). الصيغة الحديثة tacacs server <name> أنظف من tacacs-server host <ip>.",
    parameters: [
      { name: "<name>", description: "اسم خادم TACACS+ (نص حر).", required: true },
      { name: "address ipv4 <ip>", description: "عنوان IPv4 للخادم.", required: true },
      { name: "key {0 | 7} <key>", description: "المفتاح المشترك. 0=نص واضح، 7=مشفر.", required: true },
      { name: "port <port>", description: "منفذ TCP. افتراضي 49.", required: false, defaultValue: "49" },
      { name: "timeout <seconds>", description: "مهلة الانتظار. افتراضي 5.", required: false, defaultValue: "5" },
      { name: "single-connection", description: "يحافظ على اتصال TCP واحد (أكثر كفاءة).", required: false }
    ],
    examples: [
      {
        context: "إعداد خادم TACACS+ مع AAA",
        code: "Router(config)# aaa new-model\nRouter(config)# tacacs server TAC-PRIMARY\nRouter(config-server-tacacs)# address ipv4 10.10.99.30\nRouter(config-server-tacacs)# key 7 <encrypted-key>\nRouter(config-server-tacacs)# single-connection\nRouter(config)# aaa authentication login default group tacacs+ local\nRouter(config)# aaa authorization exec default group tacacs+ local\nRouter(config)# aaa accounting commands 15 default start-stop group tacacs+",
        outputExplanation: "خادم TACACS+ على 10.10.99.30. single-connection يحافظ على TCP واحد. AAA: login + exec authorization + command accounting (level 15)."
      }
    ],
    verificationCommands: ["show aaa servers", "show tacacs", "test aaa group tacacs+ <user> <pass> legacy"],
    commonErrors: [
      "نسيان aaa authorization exec — المستخدمون يسجّلون الدخول لكن لا يحصلون على shell.",
    ],
    undoMethod: "no tacacs server <name>.",
    references: [{ label: "Cisco IOS Security Command Reference — tacacs server", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/security/s1/sec-s1-cr-book/sec-s1-cr-book_chapter3.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-aaa-new-model", "cmd-radius-server"],
    tags: ["security", "aaa", "tacacs", "ccna"],
  },

  // ================================================================
  // PPP — Point-to-Point Protocol
  // ================================================================
  {
    id: "cmd-ppp",
    name: "encapsulation ppp",
    syntax: "encapsulation ppp\nppp authentication {pap | chap | ms-chap}",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 10.0+؛ IOS XE كافة",
    cliMode: ["Interface Configuration"],
    promptShape: "Router(config-if)#",
    certLevel: "Extended",
    scope: "extended",
    topic: "WAN",
    category: "WAN",
    status: "Current",
    summary: "يضبط تغليف PPP (Point-to-Point Protocol، RFC 1661) على واجهة تسلسلية. PPP يدعم المصادقة (PAP/CHAP)، تعدد البروتوكولات، واكتشاف الأخطاء. بديل لـ HDLC.",
    description:
      "encapsulation ppp يضبط تغليف PPP على واجهة تسلسلية. PPP (Point-to-Point Protocol، RFC 1661) هو بروتوكول WAN قياسي لتغليف البيانات على روابط point-to-point. ميزاته: (1) يدعم المصادقة — PAP (نص واضح، غير آمن)، CHAP (challenge-response مشفر، موصى به)، MS-CHAP (Microsoft CHAP). (2) يدعم تعدد البروتوكولات (IP, IPX, AppleTalk تاريخيًا). (3) LCP (Link Control Protocol) لإدارة الرابط. (4) NCP (Network Control Protocol) لتفاوض إعدادات الشبكة. (5) اكتشاف الأخطاء و quality monitoring. PPP بديل لـ HDLC (Cisco proprietary) — استخدم PPP عندما تحتاج مصادقة أو عند توصيل أجهزة من بائعين مختلفين. PPPoE (PPP over Ethernet) يستخدم PPP داخل إطارات Ethernet — شائع في اتصالات DSL/FTTH.",
    examples: [
      {
        context: "إعداد PPP مع مصادقة CHAP على واجهة تسلسلية",
        code: "Router(config)# username RemoteRouter password MySecretPass\nRouter(config)# interface Serial0/0/0\nRouter(config-if)# encapsulation ppp\nRouter(config-if)# ppp authentication chap\nRouter(config-if)# ip address 10.0.0.1 255.255.255.252\nRouter(config-if)# no shutdown",
        outputExplanation: "username يعرّف بيانات اعتماد الجار (اسم الجهاز البعيد + كلمة السر). ppp authentication chap يتحدى الجار بمصادقة CHAP. كلمة السر يجب أن تتطابق على الجانبين."
      }
    ],
    verificationCommands: ["show interfaces serial 0/0/0", "show ppp multilink", "debug ppp authentication", "debug ppp negotiation"],
    commonErrors: [
      "اختلاف كلمة السر بين الجانبين — مصادقة CHAP تفشل. تأكد من تطابق username (اسم الجهاز البعيد) + password.",
      "استخدام PAP (نص واضح) — غير آمن. استخدم CHAP دائمًا.",
    ],
    undoMethod: "no encapsulation ppp (يعود لـ HDLC الافتراضي) + no ppp authentication.",
    references: [{ label: "Cisco IOS WAN Configuration Guide — PPP", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/wan/configuration/wan-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-hdlc", "cmd-pppoe"],
    tags: ["wan", "ppp", "chap", "authentication", "extended"],
  },

  // ================================================================
  // HDLC — Cisco proprietary
  // ================================================================
  {
    id: "cmd-hdlc",
    name: "encapsulation hdlc",
    syntax: "encapsulation hdlc",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 10.0+؛ IOS XE كافة",
    cliMode: ["Interface Configuration"],
    promptShape: "Router(config-if)#",
    certLevel: "Extended",
    scope: "extended",
    topic: "WAN",
    category: "WAN",
    status: "Current",
    summary: "يضبط تغليف HDLC (Cisco proprietary) على واجهة تسلسلية. التغليف الافتراضي على واجهات Serial في Cisco IOS. أبسط من PPP لكن لا يدعم المصادقة.",
    description:
      "encapsulation hdlc يضبط تغليف HDLC على واجهة تسلسلية. HDLC (High-Level Data Link Control) هو التغليف الافتراضي على واجهات Serial في Cisco IOS. نسخة Cisco من HDLC هي proprietary — تضيف نوع البروتوكول (Protocol Type) و SLARP (Serial Line Address Resolution Protocol) لإدارة الرابط. HDLC أبسط من PPP: لا يدعم المصادقة (PAP/CHAP)، لا يدعم تعدد البروتوكولات بنفس الكفاءة، ولا يدعم LCP/NCP. استخدم HDLC على روابط point-to-point بين موجّهات Cisco فقط (لا توافق مع بائعين آخرين). استخدم PPP عند الحاجة لمصادقة أو توافق مع بائعين مختلفين. HDLC كان مدرجًا في CCNA القديم (WAN section) لكنه أُزيل من CCNA v2.0.",
    examples: [
      {
        context: "إعداد HDLC على واجهة تسلسلية",
        code: "Router(config)# interface Serial0/0/0\nRouter(config-if)# encapsulation hdlc\nRouter(config-if)# ip address 10.0.0.1 255.255.255.252\nRouter(config-if)# no shutdown",
        outputExplanation: "HDLC هو الافتراضي — لا حاجة لكتابته صراحةً. لكن من الممارسات الجيدة توثيقه للوضوح."
      }
    ],
    verificationCommands: ["show interfaces serial 0/0/0"],
    commonErrors: [
      "اختلاف التغليف بين الجانبين (HDLC على واحد، PPP على الآخر) — الرابط لا يعمل. تأكد من تطابق encapsulation.",
    ],
    undoMethod: "encapsulation ppp (للتبديل لـ PPP) أو اتركه افتراضيًا.",
    references: [{ label: "Cisco IOS WAN Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/wan/configuration/wan-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ppp"],
    tags: ["wan", "hdlc", "serial", "extended"],
  },

  // ================================================================
  // PPPoE — PPP over Ethernet
  // ================================================================
  {
    id: "cmd-pppoe",
    name: "pppoe enable",
    syntax: "pppoe enable group {global | <group>}\ninterface Virtual-Template <num>\n  ip address <ip> <mask>\n  ppp authentication {pap | chap}\n  ppp chap hostname <hostname>\n  ppp chap password 0 <password>",
    platforms: ["IOS", "IosXe"],
    versionRange: "IOS 12.2+؛ IOS XE كافة",
    cliMode: ["Interface Configuration", "Global Configuration"],
    promptShape: "Router(config-if)#",
    certLevel: "Extended",
    scope: "extended",
    topic: "WAN",
    category: "WAN",
    status: "Current",
    summary: "يُفعّل PPPoE (PPP over Ethernet، RFC 2516) — يغلف جلسات PPP داخل إطارات Ethernet. شائع في اتصالات DSL/FTTH من ISPs.",
    description:
      "pppoe enable يُفعّل PPPoE على واجهة. PPPoE (PPP over Ethernet) يجمع بين ميزات PPP (المصادقة، تعدد البروتوكولات) و Ethernet (الانتشار الواسع). يستخدمه ISPs لتوصيل العملاء عبر DSL/FTTH — يسمح للم ISP بمصادقة العميل (PAP/CHAP) وتخصيص عنوان IP له عبر PPP، كل ذلك فوق Ethernet. العميل (CPE) يُعدّ pppoe-client dial-pool-number، والموجّه (ISP) يُعدّ pppoe enable + Virtual-Template. جلسات PPPoE تُنشأ ديناميكيًا عند الحاجة. PPPoE يضيف 8 بايت لكل إطار (PPP overhead) — اضبط MTU لـ 1492 (بدلًا من 1500) و MSS لـ 1452 لتجنب التجزئة.",
    examples: [
      {
        context: "إعداد PPPoE client على CPE (موجّه العميل)",
        code: "Router(config)# interface Dialer0\nRouter(config-if)# ip address negotiated\nRouter(config-if)# encapsulation ppp\nRouter(config-if)# dialer pool 1\nRouter(config-if)# ppp authentication chap callin\nRouter(config-if)# ppp chap hostname customer@isp.com\nRouter(config-if)# ppp chap password 0 MySecretPass\nRouter(config-if)# ppp ipcp route default\nRouter(config)# interface GigabitEthernet0/0/0\nRouter(config-if)# pppoe-client dial-pool-number 1\nRouter(config-if)# no shutdown",
        outputExplanation: "Dialer0 واجهة افتراضية بـ IP متفاوض عليه (ip address negotiated). pppoe-client على Gi0/0/0 يربط الـ Dialer بالواجهة الفيزيائية. CHAP callin = مصادقة في اتجاه الدخول فقط."
      }
    ],
    verificationCommands: ["show pppoe session", "show interfaces Dialer0", "show ip route"],
    commonErrors: [
      "نسيان ضبط MTU 1492 و MSS 1452 — حزم TCP الكبيرة تُجزّأ أو تُسقَط.",
      "اختلاف chap hostname/password مع ISP — المصادقة تفشل.",
    ],
    undoMethod: "no pppoe-client dial-pool-number <num> + no interface Dialer0.",
    references: [{ label: "Cisco IOS PPPoE Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/wan/configuration/wan-book.html" }],
    verification: "Verified",
    lastReviewed: "2026-10-29",
    relatedCommandIds: ["cmd-ppp", "cmd-hdlc"],
    tags: ["wan", "pppoe", "dsl", "extended"],
  },
];
