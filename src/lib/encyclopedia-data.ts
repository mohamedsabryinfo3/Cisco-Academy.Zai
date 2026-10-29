// ===================================================================
// Cisco Academy — Encyclopedia Data Model
// بنية هرمية احترافية: Sections → Chapters → Topics → Tasks
// كل مهمة عملية تحتوي على خطوات تنفيذ + طوبولوجيا + أوامر + تحقق
// ===================================================================

export interface TopologyNode {
  id: string;
  label: string;
  type: "router" | "switch" | "pc" | "server" | "cloud" | "firewall";
  ip?: string;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
}

export interface TopologyLink {
  from: string;
  to: string;
  label?: string;
  type?: "ethernet" | "serial" | "wan" | "wireless";
}

export interface Topology {
  nodes: TopologyNode[];
  links: TopologyLink[];
}

export interface CommandStep {
  title: string;
  description: string;
  code: string;
  device?: string; // which device to run on
  cliMode?: string;
}

export interface VerificationStep {
  command: string;
  whatToLookFor: string;
  expectedOutput?: string;
}

export interface CommonError {
  error: string;
  cause: string;
  detection: string;
  fix: string;
}

export interface Task {
  id: string;
  title: string;
  titleEn: string;
  question: string; // "كيف أنشئ VLAN؟"
  objective: string;
  prerequisites: string[];
  topology?: Topology;
  ipPlan?: { device: string; interface: string; ip: string; subnet: string }[];
  steps: CommandStep[];
  verification: VerificationStep[];
  commonErrors: CommonError[];
  alternatives?: string;
  rollback: string;
  relatedCommandIds: string[];
  relatedTaskIds?: string[];
  status: "documented" | "partial" | "needs-review";
  lastReviewed: string;
}

export interface Topic {
  id: string;
  title: string;
  titleEn: string;
  overview: string;
  keyConcepts: string[];
  tasks?: Task[];
  relatedCommandIds: string[];
  status: "documented" | "partial" | "needs-review";
}

export interface Chapter {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  topics: Topic[];
}

export interface Section {
  id: string;
  letter: string; // A, B, C...
  title: string;
  titleEn: string;
  icon: string; // lucide icon name
  description: string;
  chapters: Chapter[];
}

// ===================================================================
// The Encyclopedia — hierarchical structure
// ===================================================================

export const ENCYCLOPEDIA: Section[] = [
  // ================================================================
  // Section A: Network Fundamentals
  // ================================================================
  {
    id: "sec-fundamentals",
    letter: "A",
    title: "أساسيات الشبكات",
    titleEn: "Network Fundamentals",
    icon: "Network",
    description: "الأسس النظرية للشبكات: نماذج OSI و TCP/IP، العنونة، تقسيم الشبكات، البروتوكولات الأساسية.",
    chapters: [
      {
        id: "ch-osi-model",
        title: "نموذج OSI و TCP/IP",
        titleEn: "OSI & TCP/IP Models",
        description: "فهم الطبقات السبع لنموذج OSI والطبقات الأربع لنموذج TCP/IP وعلاقتها بأوامر Cisco.",
        topics: [
          {
            id: "top-osi-overview",
            title: "نظرة عامة على الطبقات",
            titleEn: "Layer Overview",
            overview:
              "نموذج OSI (Open Systems Interconnection) يقسم اتصالات الشبكة إلى سبع طبقات: Physical (الفيزيائية)، Data Link (ربط البيانات)، Network (الشبكة)، Transport (النقل)، Session (الجلسة)، Presentation (العرض)، Application (التطبيق). نموذج TCP/IP يبسّطها إلى أربع طبقات: Link، Internet، Transport، Application. فهم هذه الطبقات أساسي لمعرفة أي أمر Cisco يعمل على أي طبقة ولأي غرض.",
            keyConcepts: [
              "Layer 1 — Physical: الكابلات، الإشارات الكهربائية، البتات. أمثلة: Ethernet cables, SFP, fiber.",
              "Layer 2 — Data Link: الإطارات (Frames)، عناوين MAC، ARP، VLAN، STP. أمثلة: switch, show mac-address-table.",
              "Layer 3 — Network: الحزم (Packets)، عناوين IP، التوجيه. أمثلة: router, show ip route, OSPF, BGP.",
              "Layer 4 — Transport: TCP/UDP، المنافذ، الموثوقية. أمثلة: ping, traceroute, ACL with port numbers.",
              "Layer 7 — Application: HTTP, DNS, DHCP, SSH, SNMP. أمثلة: ip domain-name, ssh, ntp server.",
            ],
            relatedCommandIds: ["cmd-show-interfaces", "cmd-show-ip-interface-brief", "cmd-show-interfaces-status"],
            status: "documented",
          },
        ],
      },
      {
        id: "ch-subnetting",
        title: "تقسيم الشبكات (Subnetting)",
        titleEn: "Subnetting & VLSM",
        description: "فهم أقنعة الشبكة، CIDR، VLSM، وحساب عدد المضيفين والشبكات الفرعية.",
        topics: [
          {
            id: "top-subnetting-basics",
            title: "أساسيات Subnetting",
            titleEn: "Subnetting Basics",
            overview:
              "Subnetting هو تقسيم شبكة كبيرة إلى شبكات فرعية أصغر لإدارة عناوين IP بكفاءة. يعتمد على قناع الشبكة (Subnet Mask) الذي يحدد أي جزء من العنوان يمثل الشبكة وأي جزء يمثل المضيف. الصيغة CIDR (مثل /24) طريقة مختصرة لكتابة القناع.",
            keyConcepts: [
              "عنوان IPv4 = 32 بت، مقسّم إلى Network Portion و Host Portion.",
              "القناع /24 = 255.255.255.0 = 256 عنوان، 254 مضيف قابل للاستخدام.",
              "القناع /30 = 255.255.255.252 = 4 عناوين، 2 مضيف — مثالي لروابط point-to-point.",
              "القناع /31 = 2 عناوين — يستخدم لروابط point-to-point (RFC 3021).",
              "القناع /32 = عنوان واحد فقط — يستخدم لـ loopback و host routes.",
              "VLSM (Variable Length Subnet Masking) يسمح بأقنعة مختلفة في نفس الشبكة لترشيد العناوين.",
            ],
            tasks: [
              {
                id: "task-subnet-vlan",
                title: "تقسيم شبكة 10.10.0.0/16 إلى VLANs",
                titleEn: "Subnet 10.10.0.0/16 into VLANs",
                question: "كيف أقسّم شبكة كبيرة إلى شبكات فرعية لكل VLAN؟",
                objective: "تقسيم 10.10.0.0/16 إلى شبكات /24 لكل VLAN (Engineering, Sales, Management).",
                prerequisites: ["فهم أساسي للقناع الشبكي", "معرفة CIDR notation"],
                ipPlan: [
                  { device: "VLAN 10 (Engineering)", interface: "SVI", ip: "10.10.10.1", subnet: "10.10.10.0/24" },
                  { device: "VLAN 20 (Sales)", interface: "SVI", ip: "10.10.20.1", subnet: "10.10.20.0/24" },
                  { device: "VLAN 99 (Management)", interface: "SVI", ip: "10.10.99.1", subnet: "10.10.99.0/24" },
                ],
                steps: [
                  {
                    title: "تحديد المتطلبات",
                    description: "3 VLANs، كل واحدة تحتاج حتى 254 مضيفًا. قناع /24 يوفر 254 مضيف — مناسب.",
                    code: "VLAN 10: 10.10.10.0/24    (256 عناوين، 254 مضيف)\nVLAN 20: 10.10.20.0/24    (256 عناوين، 254 مضيف)\nVLAN 99: 10.10.99.0/24    (256 عناوين، 254 مضيف)\nGateway: .1 لكل VLAN\nDHCP range: .10 - .250",
                  },
                  {
                    title: "إنشاء VLANs على المحول",
                    description: "ادخل Global Configuration وأنشئ كل VLAN باسم وصفي.",
                    code: "Switch(config)# vlan 10\nSwitch(config-vlan)# name Engineering\nSwitch(config-vlan)# exit\nSwitch(config)# vlan 20\nSwitch(config-vlan)# name Sales\nSwitch(config-vlan)# exit\nSwitch(config)# vlan 99\nSwitch(config-vlan)# name Management",
                    device: "Switch",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "إنشاء SVI لكل VLAN",
                    description: "كل SVI تعمل كبوابة افتراضية لمضيفي الـ VLAN.",
                    code: "Switch(config)# ip routing\nSwitch(config)# interface vlan 10\nSwitch(config-if)# ip address 10.10.10.1 255.255.255.0\nSwitch(config-if)# no shutdown\nSwitch(config-if)# exit\nSwitch(config)# interface vlan 20\nSwitch(config-if)# ip address 10.10.20.1 255.255.255.0\nSwitch(config-if)# no shutdown\nSwitch(config-if)# exit\nSwitch(config)# interface vlan 99\nSwitch(config-if)# ip address 10.10.99.1 255.255.255.0\nSwitch(config-if)# no shutdown",
                    device: "Switch",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "إسناد المنافذ إلى VLANs",
                    description: "اسند منافذ access إلى الـ VLAN المناسبة.",
                    code: "Switch(config)# interface range Gi1/0/1 - 24\nSwitch(config-if-range)# switchport mode access\nSwitch(config-if-range)# switchport access vlan 10\nSwitch(config-if-range)# spanning-tree portfast\nSwitch(config-if-range)# no shutdown",
                    device: "Switch",
                    cliMode: "Interface Configuration",
                  },
                ],
                verification: [
                  {
                    command: "show vlan brief",
                    whatToLookFor: "تأكد أن VLANs 10، 20، 99 موجودة بأسمائها وأن المنافذ مُسنَدة.",
                    expectedOutput: "10   Engineering    active    Gi1/0/1, Gi1/0/2, ...\n20   Sales          active    \n99   Management     active",
                  },
                  {
                    command: "show ip interface brief",
                    whatToLookFor: "تأكد أن Vlan10 و Vlan20 و Vlan99 في حالة up/up بعناوين IP الصحيحة.",
                    expectedOutput: "Vlan10               10.10.10.1      YES manual up    up\nVlan20               10.10.20.1      YES manual up    up\nVlan99               10.10.99.1      YES manual up    up",
                  },
                  {
                    command: "ping 10.10.10.10",
                    whatToLookFor: "إذا كان مضيف على VLAN 10 موصول، يجب أن ينجح ping.",
                  },
                ],
                commonErrors: [
                  {
                    error: "SVI في حالة down/down رغم no shutdown",
                    cause: "الـ VLAN غير موجودة أو لا يوجد منفذ نشط عليها.",
                    detection: "show interface vlan 10 — تحقق من حالة Line Protocol.",
                    fix: "تأكد أن VLAN موجودة (vlan 10) وأن منفذًا واحدًا على الأقل مُسنَد إليها وفعل (no shutdown).",
                  },
                  {
                    error: "ip routing غير مفعّل",
                    cause: "على محولات Layer 3، التوجيه معطل افتراضيًا.",
                    detection: "show ip route — إذا لم تظهر إلا المسارات المتصلة، فالتوجيه معطل.",
                    fix: "ip routing في Global Configuration.",
                  },
                ],
                alternatives:
                  "بدلًا من /24 لكل VLAN، يمكن استخدام /23 (510 مضيف) أو /25 (126 مضيف) حسب عدد المضيفين الفعلي. استخدم VLSM لترشيد العناوين عندما تختلف احتياجات كل VLAN.",
                rollback: "no interface vlan 10 + no vlan 10 + no ip routing لإلغاء كل الإعداد.",
                relatedCommandIds: ["cmd-vlan", "cmd-interface-vlan", "cmd-ip-routing", "cmd-switchport-access-vlan", "cmd-show-vlan-brief", "cmd-show-ip-interface-brief"],
                status: "documented",
                lastReviewed: "2026-10-29",
              },
            ],
            relatedCommandIds: ["cmd-vlan", "cmd-interface-vlan", "cmd-ip-routing"],
            status: "documented",
          },
        ],
      },
    ],
  },

  // ================================================================
  // Section B: Cisco Device Fundamentals
  // ================================================================
  {
    id: "sec-device-fundamentals",
    letter: "B",
    title: "أساسيات أجهزة Cisco",
    titleEn: "Cisco Device Fundamentals",
    icon: "Server",
    description: "أوضاع CLI، إدارة الإعداد، كلمات السر، SSH، إدارة الملفات، النسخ الاحتياطي والاستعادة.",
    chapters: [
      {
        id: "ch-cli-modes",
        title: "أوضاع CLI والتنقل",
        titleEn: "CLI Modes & Navigation",
        description: "فهم أوضاع EXEC المختلفة وكيفية الانتقال بينها.",
        topics: [
          {
            id: "top-cli-modes",
            title: "أوضاع CLI الأساسية",
            titleEn: "Basic CLI Modes",
            overview:
              "Cisco CLI له عدة أوضاع هرمية: User EXEC (Router>)، Privileged EXEC (Router#)، Global Configuration (Router(config)#)، وأوضاع فرعية مثل Interface Configuration (Router(config-if)#). كل وضع يقبل أوامرًا محددة. محاولة تنفيذ أمر في وضع خاطئ تنتج رسالة خطأ.",
            keyConcepts: [
              "User EXEC (Router>): أوامر عرض محدودة فقط. لا يمكن تغيير الإعداد.",
              "Privileged EXEC (Router#): كل أوامر show و debug و copy. الدخول بـ enable.",
              "Global Configuration (Router(config)#): إعدادات على مستوى الجهاز. الدخول بـ configure terminal.",
              "Interface Configuration (Router(config-if)#): إعدادات واجهة محددة. الدخول بـ interface <name>.",
              "exit يصعد مستوى واحدًا. end يعود مباشرة إلى Privileged EXEC.",
            ],
            relatedCommandIds: ["cmd-enable", "cmd-disable", "cmd-configure-terminal", "cmd-end", "cmd-exit", "cmd-show-privilege"],
            status: "documented",
          },
        ],
      },
      {
        id: "ch-config-management",
        title: "إدارة الإعداد والنسخ الاحتياطي",
        titleEn: "Configuration Management & Backup",
        description: "حفظ running-config، استعادة startup-config، الأرشفة التلقائية، والتراجع الذري.",
        topics: [
          {
            id: "top-config-save-restore",
            title: "حفظ واستعادة الإعداد",
            titleEn: "Save & Restore Configuration",
            overview:
              "running-config هو الإعداد النشط في الذاكرة (DRAM). startup-config هو الإعداد المحفوظ في NVRAM ويُحمَّل عند الإقلاع. أي تغيير يُطبَّق فورًا على running-config لكن يُفقَد عند إعادة الإقلاع ما لم يُحفَظ بـ write memory أو copy running-config startup-config.",
            keyConcepts: [
              "running-config = الإعداد النشط في DRAM (يُفقَد عند إعادة الإقلاع).",
              "startup-config = الإعداد المحفوظ في NVRAM (يبقى بعد إعادة الإقلاع).",
              "write memory = يحفظ running-config إلى NVRAM.",
              "configure replace = استبدال ذري للإعداد الحالي بملف محفوظ (للـ rollback الآمن).",
              "archive = أرشفة تلقائية للإعداد إلى خادم بعيد.",
            ],
            tasks: [
              {
                id: "task-save-backup-restore",
                title: "حفظ الإعداد وإنشاء نسخة احتياطية واستعادتها",
                titleEn: "Save, Backup & Restore Configuration",
                question: "كيف أحفظ إعداد جهاز Cisco وأنشئ نسخة احتياطية واستعدها عند الحاجة؟",
                objective: "حفظ running-config إلى NVRAM، رفعه إلى خادم TFTP/SCP، واستعادته عند الحاجة.",
                prerequisites: ["وصول Privileged EXEC", "خادم TFTP أو SCP متاح", "اتصال شبكي بالخادم"],
                steps: [
                  {
                    title: "حفظ الإعداد النشط إلى NVRAM",
                    description: "بعد أي تغيير، احفظ الإعداد ليبقى بعد إعادة الإقلاع.",
                    code: "Router# write memory\nBuilding configuration...\n[OK]",
                    device: "Router",
                    cliMode: "Privileged EXEC",
                  },
                  {
                    title: "التحقق من تطابق running-config و startup-config",
                    description: "تأكد أن التغييرات محفوظة.",
                    code: "Router# show running-config | include hostname\nRouter# show startup-config | include hostname\nRouter# show archive config differences",
                    device: "Router",
                    cliMode: "Privileged EXEC",
                  },
                  {
                    title: "نسخ احتياطي إلى خادم TFTP",
                    description: "ارفع نسخة من الإعداد إلى خادم بعيد.",
                    code: "Router# copy running-config tftp://10.10.99.50/Cairo-Edge-01-config.cfg\nAddress or name of remote host [10.10.99.50]?\nDestination filename [Cairo-Edge-01-config.cfg]?\n!!\n1234 bytes copied in 2.345 secs",
                    device: "Router",
                    cliMode: "Privileged EXEC",
                  },
                  {
                    title: "إعداد الأرشفة التلقائية",
                    description: "اجعل الجهاز يحفظ نسخة تلقائيًا عند كل save.",
                    code: 'Router(config)# archive\nRouter(config-archive)# path scp://admin@10.10.99.50/Cairo-Edge-01-config-\nRouter(config-archive)# write-memory\nRouter(config-archive)# time-period 1440\nRouter(config-archive)# maximum 50',
                    device: "Router",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "استعادة الإعداد من النسخة الاحتياطية (Rollback آمن)",
                    description: "استخدم configure replace لاستبدال ذري بدل copy (الذي جمعي فقط).",
                    code: "Router# configure replace scp://admin@10.10.99.50/Cairo-Edge-01-config--Oct-29-14-30-00 list force",
                    device: "Router",
                    cliMode: "Privileged EXEC",
                  },
                ],
                verification: [
                  {
                    command: "show startup-config",
                    whatToLookFor: "تأكد أن الإعداد المحفوظ يحتوي على آخر تغييراتك.",
                  },
                  {
                    command: "show archive",
                    whatToLookFor: "تأكد أن قائمة الأرشيف تحتوي على ملفات مؤرشفة بتواريخ حديثة.",
                  },
                  {
                    command: "show archive config differences",
                    whatToLookFor: "تأكد من عدم وجود اختلافات بين running-config وآخر أرشيف.",
                  },
                ],
                commonErrors: [
                  {
                    error: "فقدان الإعداد بعد إعادة الإقلاع",
                    cause: "نسيان write memory بعد التغييرات.",
                    detection: "show startup-config لا يحتوي على التغييرات.",
                    fix: "احفظ دائمًا بـ write memory بعد كل نافذة تغيير.",
                  },
                  {
                    error: "copy start run يدمج بدل الاستبدال",
                    cause: "copy running-config startup-config جمعي — يضيف أسطرًا لكن لا يحذف.",
                    detection: "أسطر قديمة تبقى بعد الاستعادة.",
                    fix: "استخدم configure replace للاستبدال الذري الكامل.",
                  },
                ],
                rollback: "configure replace <آخر أرشيف سليم> للاستعادة. reload لإعادة الإقلاع (إذا لم يُحفَظ التغيير بعد).",
                relatedCommandIds: ["cmd-write-memory", "cmd-copy-run-start", "cmd-show-running-config", "cmd-show-startup-config", "cmd-archive", "cmd-configure-replace", "cmd-show-archive", "cmd-write-erase", "cmd-reload"],
                status: "documented",
                lastReviewed: "2026-10-29",
              },
            ],
            relatedCommandIds: ["cmd-write-memory", "cmd-copy-run-start", "cmd-archive", "cmd-configure-replace"],
            status: "documented",
          },
        ],
      },
    ],
  },

  // ================================================================
  // Section C: Switching
  // ================================================================
  {
    id: "sec-switching",
    letter: "C",
    title: "التبديل (Switching)",
    titleEn: "Switching",
    icon: "Boxes",
    description: "VLAN، Trunk، STP، EtherChannel، Port Security، Inter-VLAN Routing، وأمن المحولات.",
    chapters: [
      {
        id: "ch-vlan-trunk",
        title: "VLAN و Trunk",
        titleEn: "VLAN & Trunking",
        description: "إنشاء VLANs، إعداد منافذ access و trunk، وتكوين Inter-VLAN Routing.",
        topics: [
          {
            id: "top-vlan-setup",
            title: "إعداد VLAN و Trunk",
            titleEn: "VLAN & Trunk Configuration",
            overview:
              "VLAN (Virtual LAN) تقسم شبكة محولة واحدة إلى شبكات منطقية متعددة على مستوى Layer 2. منافذ access تحمل VLAN واحدة، بينما منافذ trunk تحمل عدة VLANs باستخدام وسم 802.1Q. Inter-VLAN Routing يسمح بالاتصال بين VLANs مختلفة عبر موجّه أو محول Layer 3.",
            keyConcepts: [
              "Access Port: يحمل VLAN واحدة، حركة غير موسومة (untagged).",
              "Trunk Port: يحمل عدة VLANs، حركة موسومة بـ 802.1Q.",
              "Native VLAN: حركة غير موسومة على trunk — افتراضيًا VLAN 1، يُنصح بتغييرها.",
              "Allowed VLANs: قائمة VLANs المسموح لها عبور trunk — استخدمها لتقييد الحركة.",
              "SVI (Switch Virtual Interface): واجهة Layer 3 افتراضية لكل VLAN — تستخدم كبوابة.",
              "Inter-VLAN Routing: توجيه بين VLANs عبر SVIs على محول Layer 3 أو router-on-a-stick.",
            ],
            tasks: [
              {
                id: "task-inter-vlan-routing",
                title: "إعداد Inter-VLAN Routing على محول Layer 3",
                titleEn: "Configure Inter-VLAN Routing on L3 Switch",
                question: "كيف أجعل مضيفي VLAN 10 يتواصلون مع مضيفي VLAN 20؟",
                objective: "إعداد توجيه بين VLANs باستخدام SVIs على محول Catalyst Layer 3.",
                prerequisites: ["محول Layer 3 (Catalyst 9300 أو ما يعادله)", "VLANs منشأة", "منافذ access مُسنَدة"],
                topology: {
                  nodes: [
                    { id: "sw", label: "L3 Switch\n(Core-SW)", type: "switch", ip: "10.10.10.1 / 10.10.20.1", x: 50, y: 40 },
                    { id: "pc1", label: "PC1\nVLAN 10", type: "pc", ip: "10.10.10.10/24", x: 20, y: 80 },
                    { id: "pc2", label: "PC2\nVLAN 20", type: "pc", ip: "10.10.20.10/24", x: 80, y: 80 },
                  ],
                  links: [
                    { from: "sw", to: "pc1", label: "Gi1/0/1\nAccess VLAN 10" },
                    { from: "sw", to: "pc2", label: "Gi1/0/2\nAccess VLAN 20" },
                  ],
                },
                ipPlan: [
                  { device: "Core-SW", interface: "Vlan10", ip: "10.10.10.1", subnet: "10.10.10.0/24" },
                  { device: "Core-SW", interface: "Vlan20", ip: "10.10.20.1", subnet: "10.10.20.0/24" },
                  { device: "PC1", interface: "eth0", ip: "10.10.10.10", subnet: "10.10.10.0/24" },
                  { device: "PC2", interface: "eth0", ip: "10.10.20.10", subnet: "10.10.20.0/24" },
                ],
                steps: [
                  {
                    title: "تفعيل التوجيه وإنشاء VLANs",
                    description: "فعّل ip routing وأنشئ VLANs 10 و 20.",
                    code: "Switch(config)# ip routing\nSwitch(config)# vlan 10\nSwitch(config-vlan)# name Engineering\nSwitch(config-vlan)# exit\nSwitch(config)# vlan 20\nSwitch(config-vlan)# name Sales",
                    device: "Core-SW",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "إنشاء SVIs كبوابات افتراضية",
                    description: "كل SVI تعمل كبوابة افتراضية لمضيفي الـ VLAN.",
                    code: "Switch(config)# interface vlan 10\nSwitch(config-if)# ip address 10.10.10.1 255.255.255.0\nSwitch(config-if)# no shutdown\nSwitch(config-if)# exit\nSwitch(config)# interface vlan 20\nSwitch(config-if)# ip address 10.10.20.1 255.255.255.0\nSwitch(config-if)# no shutdown",
                    device: "Core-SW",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "إسناد المنافذ إلى VLANs",
                    description: "اسند منافذ access إلى VLANs المناسبة مع PortFast.",
                    code: "Switch(config)# interface Gi1/0/1\nSwitch(config-if)# switchport mode access\nSwitch(config-if)# switchport access vlan 10\nSwitch(config-if)# spanning-tree portfast\nSwitch(config-if)# no shutdown\nSwitch(config-if)# exit\nSwitch(config)# interface Gi1/0/2\nSwitch(config-if)# switchport mode access\nSwitch(config-if)# switchport access vlan 20\nSwitch(config-if)# spanning-tree portfast\nSwitch(config-if)# no shutdown",
                    device: "Core-SW",
                    cliMode: "Interface Configuration",
                  },
                  {
                    title: "ضبط البوابة الافتراضية على المضيفين",
                    description: "على PC1 ضع gateway 10.10.10.1. على PC2 ضع gateway 10.10.20.1.",
                    code: "# PC1 (Linux example)\nip addr add 10.10.10.10/24 dev eth0\nip route add default via 10.10.10.1\n\n# PC2 (Linux example)\nip addr add 10.10.20.10/24 dev eth0\nip route add default via 10.10.20.1",
                    device: "PC1 / PC2",
                  },
                ],
                verification: [
                  {
                    command: "show ip interface brief | include Vlan",
                    whatToLookFor: "Vlan10 و Vlan20 في حالة up/up بعناوين IP الصحيحة.",
                    expectedOutput: "Vlan10               10.10.10.1      YES manual up    up\nVlan20               10.10.20.1      YES manual up    up",
                  },
                  {
                    command: "show ip route connected",
                    whatToLookFor: "مسارات متصلة لـ 10.10.10.0/24 و 10.10.20.0/24.",
                    expectedOutput: "C    10.10.10.0/24 is directly connected, Vlan10\nC    10.10.20.0/24 is directly connected, Vlan20",
                  },
                  {
                    command: "ping 10.10.20.10 source 10.10.10.10",
                    whatToLookFor: "من PC1، ping إلى PC2 يجب أن ينجح — هذا يثبت أن Inter-VLAN Routing يعمل.",
                  },
                ],
                commonErrors: [
                  {
                    error: "ping بين VLANs يفشل رغم أن SVIs up/up",
                    cause: "ip routing غير مفعّل على المحول.",
                    detection: "show ip route لا يعرض مسارات متصلة.",
                    fix: "ip routing في Global Configuration.",
                  },
                  {
                    error: "SVI في حالة down/down",
                    cause: "لا يوجد منفذ نشط على الـ VLAN.",
                    detection: "show interface vlan 10 — Line Protocol down.",
                    fix: "تأكد أن منفذًا واحدًا على الأقل مُسنَد إلى VLAN 10 وفعل (no shutdown).",
                  },
                  {
                    error: "المضيف لا يصل البوابة",
                    cause: "البوابة الافتراضية على المضيف خاطئة أو غير مضبوطة.",
                    detection: "ping 10.10.10.1 من PC1 يفشل.",
                    fix: "اضبط البوابة الافتراضية على المضيف إلى عنوان SVI الصحيح.",
                  },
                ],
                alternatives:
                  "Router-on-a-Stick: بدلًا من محول Layer 3، استخدم موجّهًا بواجهة trunk فرعية (subinterfaces) لكل VLAN. أبطأ لكن أرخص. مثال: interface Gi0/0.10 + encapsulation dot1q 10 + ip address 10.10.10.1 255.255.255.0.",
                rollback: "no interface vlan 10 + no interface vlan 20 + no vlan 10 + no vlan 20 + no ip routing.",
                relatedCommandIds: ["cmd-vlan", "cmd-interface-vlan", "cmd-ip-routing", "cmd-switchport-access-vlan", "cmd-switchport-mode-trunk", "cmd-switchport-trunk-allowed-vlan", "cmd-spanning-tree-portfast", "cmd-show-vlan-brief", "cmd-show-interfaces-trunk", "cmd-show-ip-interface-brief", "cmd-show-ip-route", "cmd-ping"],
                status: "documented",
                lastReviewed: "2026-10-29",
              },
              {
                id: "task-trunk-setup",
                title: "إعداد رابط Trunk بين محولين",
                titleEn: "Configure Trunk Link Between Switches",
                question: "كيف أربط محولين بـ trunk يحمل عدة VLANs؟",
                objective: "إعداد رابط trunk 802.1Q بين محولين يحمل VLANs 10، 20، 99.",
                prerequisites: ["VLANs منشأة على كلا المحولين", "منفذ متاح على كل محول"],
                topology: {
                  nodes: [
                    { id: "sw1", label: "Switch-1\n(Core)", type: "switch", ip: "10.10.99.1", x: 25, y: 50 },
                    { id: "sw2", label: "Switch-2\n(Access)", type: "switch", ip: "10.10.99.2", x: 75, y: 50 },
                  ],
                  links: [
                    { from: "sw1", to: "sw2", label: "Gi1/0/1 ←→ Gi1/0/1\nTrunk 802.1Q" },
                  ],
                },
                ipPlan: [
                  { device: "Switch-1", interface: "Vlan99", ip: "10.10.99.1", subnet: "10.10.99.0/24" },
                  { device: "Switch-2", interface: "Vlan99", ip: "10.10.99.2", subnet: "10.10.99.0/24" },
                ],
                steps: [
                  {
                    title: "إنشاء VLANs على كلا المحولين",
                    description: "تأكد أن نفس VLANs موجودة على المحولين. استخدم VTP mode transparent لتفادي المزامنة غير المرغوبة.",
                    code: "! على المحولين\nSwitch(config)# vlan 10\nSwitch(config-vlan)# name Engineering\nSwitch(config)# vlan 20\nSwitch(config-vlan)# name Sales\nSwitch(config)# vlan 99\nSwitch(config-vlan)# name Management",
                    device: "Switch-1 & Switch-2",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "إعداد منفذ Trunk على المحول الأول",
                    description: "اجعل المنفذ trunkًا صريحًا وحدد VLANs المسموحة و native VLAN.",
                    code: "Switch-1(config)# interface Gi1/0/1\nSwitch-1(config-if)# description Uplink-to-Switch-2\nSwitch-1(config-if)# switchport trunk encapsulation dot1q\nSwitch-1(config-if)# switchport mode trunk\nSwitch-1(config-if)# switchport trunk allowed vlan 10,20,99\nSwitch-1(config-if)# switchport trunk native vlan 99\nSwitch-1(config-if)# no shutdown",
                    device: "Switch-1",
                    cliMode: "Interface Configuration",
                  },
                  {
                    title: "إعداد منفذ Trunk على المحول الثاني",
                    description: "كرّر نفس الإعداد على المحول الثاني بنفس VLANs و native VLAN.",
                    code: "Switch-2(config)# interface Gi1/0/1\nSwitch-2(config-if)# description Uplink-to-Switch-1\nSwitch-2(config-if)# switchport trunk encapsulation dot1q\nSwitch-2(config-if)# switchport mode trunk\nSwitch-2(config-if)# switchport trunk allowed vlan 10,20,99\nSwitch-2(config-if)# switchport trunk native vlan 99\nSwitch-2(config-if)# no shutdown",
                    device: "Switch-2",
                    cliMode: "Interface Configuration",
                  },
                ],
                verification: [
                  {
                    command: "show interfaces trunk",
                    whatToLookFor: "المنفذ في حالة trunking، dot1q، native VLAN 99، VLANs 10,20,99 مسموحة ونشطة.",
                    expectedOutput: "Port        Mode         Encapsulation  Status       Native vlan\nGi1/0/1     on           dot1q          trunking     99\n\nPort        Vlans allowed on trunk\nGi1/0/1     10,20,99\n\nPort        Vlans allowed and active in management domain\nGi1/0/1     10,20,99",
                  },
                  {
                    command: "show interfaces Gi1/0/1 switchport",
                    whatToLookFor: "Administrative Mode: trunk. Operational Mode: trunk. Trunking VLANs Enabled: 10,20,99.",
                  },
                  {
                    command: "ping 10.10.99.2",
                    whatToLookFor: "من Switch-1، ping إلى Switch-2 عبر VLAN 99 (Management) يجب أن ينجح.",
                  },
                ],
                commonErrors: [
                  {
                    error: "Trunk لا يعمل — الحالة notconnect",
                    cause: "الكابل غير موصول أو المنفذ معطل (shutdown).",
                    detection: "show interfaces status — الحالة notconnect أو disabled.",
                    fix: "تأكد من الكابل و no shutdown على المنفذين.",
                  },
                  {
                    error: "اختلاف Native VLAN بين الطرفين",
                    cause: "Native VLAN مختلف على كل محول — يسبب تسريب حركة غير موسومة بين VLANs.",
                    detection: "CDP يُصدر تحذير: 'Native VLAN mismatch discovered'.",
                    fix: "تأكد من تطابق switchport trunk native vlan على كلا المحولين.",
                  },
                  {
                    error: "VLAN مسموحة لكن لا تمر حركة",
                    cause: "VLAN غير موجودة على المحول أو STP يحجب المنفذ.",
                    detection: "show interfaces trunk — VLAN في 'allowed' لكن ليست في 'allowed and active'.",
                    fix: "تأكد أن VLAN موجودة (vlan <id>) على المحول. تحقق من STP بـ show spanning-tree vlan <id>.",
                  },
                ],
                alternatives:
                  "بدلًا من switchport mode trunk (صريح)، يمكن استخدام dynamic desirable / dynamic auto للتفاوض التلقائي. لكن الوضع الصريح مفضل للحتمية. على Catalyst 9000 الحديثة، dot1q هو التغليف الوحيد المدعوم فلا حاجة لـ switchport trunk encapsulation.",
                rollback: "no switchport mode trunk + no switchport trunk allowed vlan + no switchport trunk native vlan على المنفذين.",
                relatedCommandIds: ["cmd-switchport-mode-trunk", "cmd-switchport-trunk-allowed-vlan", "cmd-switchport-trunk-encapsulation", "cmd-vlan", "cmd-show-interfaces-trunk", "cmd-show-vlan-brief", "cmd-show-vtp-status", "cmd-show-spanning-tree"],
                status: "documented",
                lastReviewed: "2026-10-29",
              },
            ],
            relatedCommandIds: ["cmd-vlan", "cmd-switchport-access-vlan", "cmd-switchport-mode-trunk", "cmd-switchport-trunk-allowed-vlan", "cmd-interface-vlan", "cmd-ip-routing", "cmd-spanning-tree-portfast", "cmd-show-vlan-brief", "cmd-show-interfaces-trunk"],
            status: "documented",
          },
        ],
      },
      {
        id: "ch-stp",
        title: "Spanning Tree Protocol",
        titleEn: "STP, RSTP & MST",
        description: "منع حلقات Layer 2، انتخاب Root Bridge، PortFast، BPDU Guard، Root Guard.",
        topics: [
          {
            id: "top-stp-config",
            title: "إعداد STP و RSTP",
            titleEn: "STP & RSTP Configuration",
            overview:
              "STP (Spanning Tree Protocol) يمنع حلقات Layer 2 في الشبكات المحولة. RSTP (Rapid STP، 802.1w) نسخة أسرع بتقارب في ثوانٍ بدلًا من 50 ثانية. PVST+ يعمل لكل VLAN، MST (Multiple STP) يربط عدة VLANs بنسخة STP واحدة لتقليل عبء المعالجة. على الشبكات الحديثة استخدم Rapid-PVST+ افتراضيًا.",
            keyConcepts: [
              "Root Bridge: المحول المرجعي — يُنتخب بأقل Bridge ID (priority + MAC).",
              "Bridge Priority: افتراضيًا 32768. اضبطها لأقل لجعل المحول root (مثلًا 4096).",
              "PortFast: يتخطّى Listening/Learning على منافذ access — للمضيفين فقط.",
              "BPDU Guard: يُعطّل منفذ PortFast إذا استقبل BPDU — يحمي من وصل محول بالخطأ.",
              "Root Guard: يمنع منفذًا من أن يصبح root port — يحمي طوبولوجيا STP.",
              "Rapid-PVST+ هو الوضع الموصى به لمعظم الشبكات الحديثة.",
            ],
            tasks: [
              {
                id: "task-stp-root-bridge",
                title: "ضبط Root Bridge و PortFast و BPDU Guard",
                titleEn: "Configure Root Bridge, PortFast & BPDU Guard",
                question: "كيف أتأكد أن المحول الصحيح هو Root Bridge وأن منافذ access آمنة؟",
                objective: "جعل Core-SW الـ Root Bridge، تفعيل Rapid-PVST+، PortFast و BPDU Guard على منافذ access.",
                prerequisites: ["طوبولوجيا بمحولين أو أكثر", "روابط trunk بين المحولات"],
                steps: [
                  {
                    title: "تفعيل Rapid-PVST+ على كل المحولات",
                    description: "Rapid-PVST+ أسرع من PVST+ التقليدي (تقارب بثوانٍ بدلًا من 50 ثانية).",
                    code: "! على كل المحولات\nSwitch(config)# spanning-tree mode rapid-pvst",
                    device: "All Switches",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "جعل Core-SW الـ Root Bridge",
                    description: "اضبط priority إلى 4096 (أقل من الافتراضي 32768) لكل VLANs أو لـ VLAN محددة.",
                    code: "! على Core-SW\nCore-SW(config)# spanning-tree vlan 1-4094 priority 4096\n! أو لـ VLAN محددة:\nCore-SW(config)# spanning-tree vlan 10 root primary\nCore-SW(config)# spanning-tree vlan 20 root primary",
                    device: "Core-SW",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "جعل Access-SW الـ Secondary Root",
                    description: "اضبط priority إلى 8192 (أعلى من Primary لكن أقل من الافتراضي).",
                    code: "! على Access-SW\nAccess-SW(config)# spanning-tree vlan 1-4094 priority 8192",
                    device: "Access-SW",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "تفعيل PortFast و BPDU Guard على منافذ access",
                    description: "PortFast يتخطّى تأخير STP للمضيفين. BPDU Guard يحمي من وصل محول بالخطأ.",
                    code: "! على كل المحولات\nSwitch(config)# spanning-tree portfast bpduguard default\nSwitch(config)# interface range Gi1/0/1 - 48\nSwitch(config-if-range)# spanning-tree portfast\nSwitch(config-if-range)# spanning-tree bpduguard enable",
                    device: "All Switches",
                    cliMode: "Global Configuration + Interface",
                  },
                  {
                    title: "تفعيل استرداد err-disabled تلقائيًا",
                    description: "إذا أُغلق منفذ بسبب BPDU Guard، استعده تلقائيًا بعد 300 ثانية.",
                    code: "Switch(config)# errdisable recovery cause bpduguard\nSwitch(config)# errdisable recovery interval 300",
                    device: "All Switches",
                    cliMode: "Global Configuration",
                  },
                ],
                verification: [
                  {
                    command: "show spanning-tree vlan 10",
                    whatToLookFor: "Core-SW يعرض 'This bridge is the root'. Access-SW يعرض Core-SW كـ Root ID.",
                    expectedOutput: "Root ID    Priority    4106\n           Address     0011.2233.4455\n           This bridge is the root",
                  },
                  {
                    command: "show spanning-tree summary",
                    whatToLookFor: "Switch is in rapid-pvst mode. PortFast BPDU Guard is enabled.",
                  },
                  {
                    command: "show spanning-tree vlan 10 root",
                    whatToLookFor: "تأكد أن Root Bridge هو Core-SW (عنوان MAC المطابق).",
                  },
                ],
                commonErrors: [
                  {
                    error: "المحول الخطأ أصبح Root Bridge",
                    cause: "Bridge Priority افتراضية (32768) على كل المحولات — يُنتخب بأقل MAC.",
                    detection: "show spanning-tree root — Root Bridge غير متوقع.",
                    fix: "اضبط spanning-tree vlan <id> priority 4096 على المحول المطلوب.",
                  },
                  {
                    error: "منفذ err-disabled بسبب BPDU Guard",
                    cause: "وُصل محول أو hub على منفذ PortFast — استقبل BPDU.",
                    detection: "show interfaces status err-disabled — السبب bpduguard.",
                    fix: "أزل الجهاز المُساء وصله، ثم shutdown/no shutdown على المنفذ.",
                  },
                ],
                alternatives:
                  "MST (Multiple Spanning Tree، 802.1s) بديل للشبكات ذات مئات VLANs — يربط عدة VLANs بنسخة STP واحدة. لكنه معقّد أكثر ويحتاج تكوين متطابق على كل المحولات.",
                rollback: "no spanning-tree portfast bpduguard default + spanning-tree vlan <id> priority 32768 (الافتراضي).",
                relatedCommandIds: ["cmd-spanning-tree-mode", "cmd-spanning-tree-portfast", "cmd-spanning-tree-bpduguard", "cmd-show-spanning-tree"],
                status: "documented",
                lastReviewed: "2026-10-29",
              },
            ],
            relatedCommandIds: ["cmd-spanning-tree-mode", "cmd-spanning-tree-portfast", "cmd-spanning-tree-bpduguard", "cmd-show-spanning-tree"],
            status: "documented",
          },
        ],
      },
    ],
  },

  // ================================================================
  // Section D: VLAN & VTP Encyclopedia
  // ================================================================
  {
    id: "sec-vlan-vtp",
    letter: "D",
    title: "موسوعة VLAN و VTP",
    titleEn: "VLAN & VTP Encyclopedia",
    icon: "Layers",
    description: "دليل شامل لـ VLAN، VTP بجميع أوضاعه وإصداراته، استكشاف مشاكل المزامنة.",
    chapters: [
      {
        id: "ch-vtp",
        title: "VTP (VLAN Trunking Protocol)",
        titleEn: "VTP Complete Guide",
        description: "أوضاع VTP، الإصدارات، المزامنة، Revision Number، والمخاطر.",
        topics: [
          {
            id: "top-vtp-complete",
            title: "دليل VTP الكامل",
            titleEn: "Complete VTP Guide",
            overview:
              "VTP (VLAN Trunking Protocol) يُزامن قاعدة بيانات VLAN بين المحولات في نفس VTP Domain عبر روابط trunk. VTP يبسّط إدارة VLAN في الشبكات الكبيرة لكنه يحمل مخاطر: توصيل محول جديد بـ Revision Number أعلى يمكن أن يحذف كل VLANs على الشبكة! لهذا تُفضّل الشبكات الحديثة VTP mode transparent أو off.",
            keyConcepts: [
              "VTP Domain: يجب أن يتطابق بين المحولات لكي تتم المزامنة.",
              "VTP Mode — Server: ينشئ ويعدّل ويحذف VLANs، يُزامن مع غيره.",
              "VTP Mode — Client: يستقبل فقط، لا يمكنه إنشاء VLANs.",
              "VTP Mode — Transparent: لا يُزامن لكنه يعيد إرسال تحديثات VTP — الآمن.",
              "VTP Mode — Off: لا يُزامن ولا يعيد الإرسال (IOS 12.2+).",
              "Configuration Revision: كل تغيير يزيدها. المحول بـ revision أعلى يفرض قاعدة VLANs الخاصة به!",
              "VTP v3: أضاف حماية بكلمة سر مشفّرة، دعم Private VLAN، و MST.",
              "VTP Pruning: يمنع بث VLANs غير المستخدمة على روابط trunk.",
            ],
            tasks: [
              {
                id: "task-vtp-transparent",
                title: "إعداد VTP في الوضع الآمن (Transparent)",
                titleEn: "Configure VTP in Transparent Mode (Safe)",
                question: "كيف أُعدّ VTP بأمان لتجنب حذف VLANs بالخطأ؟",
                objective: "ضبط VTP mode transparent على كل المحولات لتفادي مخاطر Revision Number.",
                prerequisites: ["محولان أو أكثر متصلين بـ trunk", "فهم مخاطر VTP Server/Client"],
                steps: [
                  {
                    title: "ضبط VTP mode transparent على كل المحولات",
                    description: "الوضع Transparent هو الأمان — المحول لا يُزامن قاعدة VLANs لكنه يعيد إرسال تحديثات VTP للآخرين.",
                    code: "! على كل المحولات\nSwitch(config)# vtp mode transparent\nSwitch(config)# vtp domain \"\"\nSwitch(config)# no vtp password",
                    device: "All Switches",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "إنشاء VLANs محليًا على كل محول",
                    description: "في الوضع Transparent، يجب إنشاء VLANs على كل محول يدويًا.",
                    code: "Switch(config)# vlan 10\nSwitch(config-vlan)# name Engineering\nSwitch(config)# vlan 20\nSwitch(config-vlan)# name Sales\nSwitch(config)# vlan 99\nSwitch(config-vlan)# name Management",
                    device: "Each Switch",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "التحقق من الإعداد",
                    description: "تأكد أن الوضع Transparent وأن Revision منخفض.",
                    code: "Switch# show vtp status",
                    device: "Each Switch",
                    cliMode: "Privileged EXEC",
                  },
                ],
                verification: [
                  {
                    command: "show vtp status",
                    whatToLookFor: "VTP Operating Mode: Transparent. Configuration Revision: منخفض.",
                    expectedOutput: "VTP Version capable            : 1 to 3\nVTP version running            : 2\nVTP Domain Name                :\nVTP Operating Mode             : Transparent\nConfiguration Revision         : 0",
                  },
                  {
                    command: "show vlan brief",
                    whatToLookFor: "VLANs 10، 20، 99 موجودة بأسمائها.",
                  },
                ],
                commonErrors: [
                  {
                    error: "VLANs اختفت فجأة من الشبكة",
                    cause: "وُصل محول جديد بـ VTP mode server و Revision Number أعلى — أعاد كتابة قاعدة VLANs!",
                    detection: "show vtp status على كل محول — ابحث عن revision أعلى من المتوقع.",
                    fix: "ضع المحول الجديد في VTP mode transparent أولًا قبل توصيله. استعد VLANs المحذوفة يدويًا أو من نسخة احتياطية.",
                  },
                  {
                    error: "VTP لا يُزامن بين محولين",
                    cause: "اختلاف VTP Domain Name أو Password أو Version.",
                    detection: "show vtp status على المحولين — قارن Domain و Version.",
                    fix: "تأكد من تطابق VTP Domain Name و Password و Version على كل المحولات.",
                  },
                ],
                alternatives:
                  "VTP v3 مع كلمة سر مشفّرة: VTP v3 أكثر أمانًا من v1/v2 — يدعم كلمات سر مشفّرة و Private VLAN. لكنه لا يزال يحمل مخاطر Revision Number. للممارسة الفضلى الحديثة: استخدم VTP mode transparent وأنشئ VLANs يدويًا أو عبر أتمتة (Ansible/NETCONF).",
                rollback: "vtp mode server (للعودة للوضع Server — احذر!) أو أبقِ على transparent.",
                relatedCommandIds: ["cmd-vtp", "cmd-show-vtp-status", "cmd-show-vtp-counters", "cmd-show-vtp-password", "cmd-show-vtp-devices", "cmd-vlan", "cmd-show-vlan-brief"],
                status: "documented",
                lastReviewed: "2026-10-29",
              },
            ],
            relatedCommandIds: ["cmd-vtp", "cmd-show-vtp-status", "cmd-show-vtp-counters", "cmd-show-vtp-password", "cmd-show-vtp-devices", "cmd-vlan", "cmd-show-vlan-brief", "cmd-show-interfaces-trunk"],
            status: "documented",
          },
        ],
      },
    ],
  },

  // ================================================================
  // Section E: Routing
  // ================================================================
  {
    id: "sec-routing",
    letter: "E",
    title: "التوجيه (Routing)",
    titleEn: "Routing",
    icon: "Route",
    description: "التوجيه الثابت، المسار الافتراضي، المسافة الإدارية، longest-prefix match، استكشاف مشاكل التوجيه.",
    chapters: [
      {
        id: "ch-static-routing",
        title: "التوجيه الثابت",
        titleEn: "Static Routing",
        description: "إعداد مسارات ثابتة، مسارات افتراضية، ومسارات عائمة احتياطية.",
        topics: [
          {
            id: "top-static-routing",
            title: "إعداد التوجيه الثابت والمسار الافتراضي",
            titleEn: "Static Routes & Default Routes",
            overview:
              "التوجيه الثابت (Static Routing) أبسط أشكال التوجيه — مسارات تُكتب يدويًا ولا تنتهي صلاحيتها. مناسب للشبكات الطرفية (stub)، المسارات الافتراضية إلى ISP، والمسارات العائمة (floating) كاحتياطي. المسافة الإدارية لـ static = 1 (يمكن تغييرها للمسارات العائمة).",
            keyConcepts: [
              "Static Route: ip route <network> <mask> <next-hop> [admin-distance]",
              "Default Route: ip route 0.0.0.0 0.0.0.0 <next-hop> — يطابق كل شيء.",
              "Floating Static Route: static route بمسافة إدارية عالية (مثل 250) — احتياطي عند فشل الديناميكي.",
              "Administrative Distance: ثقة المصدر. Static=1, OSPF=110, EIGRP(Internal)=90, BGP(External)=20.",
              "Longest Prefix Match: المسار بأطول قناع يفوز. /32 قبل /24 قبل /16 قبل /8.",
              "Next-Hop IP vs Exit Interface: استخدم next-hop IP على Ethernet (تجنب ARP explosion).",
            ],
            tasks: [
              {
                id: "task-default-route-sla",
                title: "إعداد مسار افتراضي مع IP SLA للنسخ الاحتياطي",
                titleEn: "Default Route with IP SLA Backup",
                question: "كيف أُعد مسارًا افتراضيًا أساسيًا وآخر احتياطيًا يتفعل عند فشل الأساسي؟",
                objective: "إعداد مسار افتراضي إلى ISP-1 مع IP SLA tracking، ومسار عائم إلى ISP-2 يتفعل تلقائيًا عند فشل ISP-1.",
                prerequisites: ["موجّه بحلقتي WAN", "ISP-1 و ISP-2 متاحان", "فهم Administrative Distance"],
                topology: {
                  nodes: [
                    { id: "rtr", label: "Edge Router", type: "router", ip: "10.10.10.1", x: 50, y: 50 },
                    { id: "isp1", label: "ISP-1\n203.0.113.1", type: "cloud", ip: "203.0.113.1", x: 20, y: 20 },
                    { id: "isp2", label: "ISP-2\n198.51.100.1", type: "cloud", ip: "198.51.100.1", x: 80, y: 20 },
                  ],
                  links: [
                    { from: "rtr", to: "isp1", label: "Gi0/0/0\n203.0.113.2/30" },
                    { from: "rtr", to: "isp2", label: "Gi0/0/1\n198.51.100.2/30" },
                  ],
                },
                ipPlan: [
                  { device: "Edge Router", interface: "Gi0/0/0", ip: "203.0.113.2", subnet: "203.0.113.0/30" },
                  { device: "Edge Router", interface: "Gi0/0/1", ip: "198.51.100.2", subnet: "198.51.100.0/30" },
                  { device: "ISP-1", interface: "-", ip: "203.0.113.1", subnet: "203.0.113.0/30" },
                  { device: "ISP-2", interface: "-", ip: "198.51.100.1", subnet: "198.51.100.0/30" },
                ],
                steps: [
                  {
                    title: "إنشاء IP SLA probe",
                    description: "probe ICMP-echo إلى بوابة ISP-1 كل 5 ثوانٍ للتحقق من الوصول.",
                    code: "Router(config)# ip sla 10\nRouter(config-ip-sla)# icmp-echo 203.0.113.1 source-interface GigabitEthernet0/0/0\nRouter(config-ip-sla-echo)# frequency 5\nRouter(config-ip-sla-echo)# timeout 2000\nRouter(config-ip-sla-echo)# exit\nRouter(config)# ip sla schedule 10 life forever start-time now",
                    device: "Edge Router",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "إنشاء Track Object",
                    description: "اربط IP SLA بكائن track يصبح up/down حسب نجاح/فشل الـ probe.",
                    code: "Router(config)# track 1 ip sla 10 reachability\nRouter(config-track)# delay down 5 up 2\nRouter(config-track)# exit",
                    device: "Edge Router",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "إعداد المسار الافتراضي الأساسي مع tracking",
                    description: "المسار الافتراضي إلى ISP-1 مع track. يُزال من RIB عند فشل الـ probe.",
                    code: "Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1 track 1",
                    device: "Edge Router",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "إعداد المسار الافتراضي الاحتياطي (Floating)",
                    description: "مسار افتراضي إلى ISP-2 بمسافة إدارية 250 — يتفعل فقط عند إزالة المسار الأساسي.",
                    code: "Router(config)# ip route 0.0.0.0 0.0.0.0 198.51.100.1 250",
                    device: "Edge Router",
                    cliMode: "Global Configuration",
                  },
                ],
                verification: [
                  {
                    command: "show ip sla statistics",
                    whatToLookFor: "Number of successes > 0. Latest operation return code: OK.",
                    expectedOutput: "IPSLAs Latest Operation Statistics\n\nIPSLA operation id: 10\nLatest operation return code: OK\nLatest RTT: 2 milliseconds\nNumber of successes: 1247\nNumber of failures: 0",
                  },
                  {
                    command: "show track 1",
                    whatToLookFor: "Track 1 is Up. IP SLA 10 reachability is Reachable.",
                    expectedOutput: "Track 1\n  IP SLA 10 reachability\n  Reachability is Up\n  3 changes, last change 2w3d ago",
                  },
                  {
                    command: "show ip route 0.0.0.0",
                    whatToLookFor: "المسار الافتراضي عبر 203.0.113.1 (ISP-1) نشط. عند فشله، يظهر عبر 198.51.100.1 (ISP-2).",
                    expectedOutput: "S*   0.0.0.0/0 [1/0] via 203.0.113.1\n  [250/0] via 198.51.100.1",
                  },
                ],
                commonErrors: [
                  {
                    error: "المسار الاحتياطي لا يتفعل عند فشل ISP-1",
                    cause: "IP SLA probe فشل لكن المسار الأساسي لا يزال في RIB — نسيت track.",
                    detection: "show track — حالة Down. show ip route 0.0.0.0 — لا يزال المسار الأساسي موجودًا.",
                    fix: "تأكد أن ip route ... track 1 مُعدة. تحقق من show track.",
                  },
                  {
                    error: "IP SLA يعرض failures لكن track Up",
                    cause: "delay down لم ينقضِ بعد — تأخير مقصود لتجنب الرفرفة.",
                    detection: "show track — 'delay down 5' يعني انتظار 5 ثوانٍ قبل Down.",
                    fix: "انتظر delay period أو اضبط delay down 0 للأخذ الفوري.",
                  },
                ],
                alternatives:
                  "بدلًا من IP SLA + static routes، استخدم بروتوكول توجيه ديناميكي (OSPF/BGP) مع متعدد المسارات. BGP مع ISP-1 و ISP-2 يوفر كشف الفشل تلقائيًا وتوزيع الحمل. لكنه أعقد في الإعداد.",
                rollback: "no ip route 0.0.0.0 0.0.0.0 203.0.113.1 track 1 + no ip route 0.0.0.0 0.0.0.0 198.51.100.1 250 + no track 1 + no ip sla 10.",
                relatedCommandIds: ["cmd-ip-route-static", "cmd-ip-sla", "cmd-track", "cmd-show-ip-route", "cmd-show-ip-cef", "cmd-ping", "cmd-traceroute"],
                status: "documented",
                lastReviewed: "2026-10-29",
              },
            ],
            relatedCommandIds: ["cmd-ip-route-static", "cmd-ip-sla", "cmd-track", "cmd-show-ip-route", "cmd-show-ip-protocols", "cmd-show-ip-cef"],
            status: "documented",
          },
        ],
      },
    ],
  },

  // ================================================================
  // Section F: Dynamic Routing Protocols
  // ================================================================
  {
    id: "sec-dynamic-routing",
    letter: "F",
    title: "بروتوكولات التوجيه الديناميكي",
    titleEn: "Dynamic Routing Protocols",
    icon: "Share2",
    description: "OSPF، EIGRP، BGP، RIP — الإعداد، التجاور، التحقق، واستكشاف الأعطال.",
    chapters: [
      {
        id: "ch-ospf",
        title: "OSPF",
        titleEn: "OSPF Configuration",
        description: "OSPFv2 و OSPFv3، مناطق متعددة، DR/BDR، network types، استكشاف تجاور.",
        topics: [
          {
            id: "top-ospf-setup",
            title: "إعداد OSPF Single-Area",
            titleEn: "Configure OSPF Single-Area",
            overview:
              "OSPF (Open Shortest Path First) هو بروتوكول توجيه link-state IGP. يستخدم خوارزمية Dijkstra (SPF) لحساب أقصر مسار. مناسب للشبكات المتوسطة والكبيرة. يعمل بمناطق (areas) لتقليل عبء المعالجة. المنطقة 0 (backbone) إلزامية. كل واجهة لها cost محسوب من bandwidth. Administrative Distance = 110.",
            keyConcepts: [
              "Router ID: معرّف فريد لكل موجّه — يُضبط صراحةً أو من أعلى loopback IP.",
              "Area 0 (Backbone): منطقة الإلزامية — كل المناطق الأخرى تتصل بها.",
              "DR/BDR: على شبكات broadcast، يُنتخب Designated Router و Backup لإدارة التجاور.",
              "Cost: محسوب من bandwidth. افتراضيًا reference-bandwidth = 100M → FastEthernet = 1، GigabitEthernet = 1. اضبط auto-cost reference-bandwidth 100000 لـ 100G.",
              "Passive Interface: واجهة تُعلن شبكتها لكنها لا تُرسل/تستقبل OSPF hellos — للمضيفين.",
              "Hello Timer: 10 ثوانٍ على broadcast، 30 ثانية على NBMA. Dead Timer = 4× Hello.",
            ],
            tasks: [
              {
                id: "task-ospf-single-area",
                title: "إعداد OSPF Single-Area بين موجّهين",
                titleEn: "Configure OSPF Single-Area Between Two Routers",
                question: "كيف أُعدّ OSPF بين موجّهين ليتشاركا المسارات؟",
                objective: "إعداد OSPF process 1 في area 0 بين موجّهين، مع router-id و reference bandwidth و passive-interface.",
                prerequisites: ["موجّهان متصلان برابط /30", "عناوين IP مضبوطة على الواجهات"],
                topology: {
                  nodes: [
                    { id: "r1", label: "R1\n10.0.0.1", type: "router", ip: "10.0.0.1", x: 25, y: 50 },
                    { id: "r2", label: "R2\n10.0.0.2", type: "router", ip: "10.0.0.2", x: 75, y: 50 },
                  ],
                  links: [
                    { from: "r1", to: "r2", label: "Gi0/0/0 ←→ Gi0/0/0\n10.0.0.0/30" },
                  ],
                },
                ipPlan: [
                  { device: "R1", interface: "Gi0/0/0", ip: "10.0.0.1", subnet: "10.0.0.0/30" },
                  { device: "R1", interface: "Loopback0", ip: "1.1.1.1", subnet: "1.1.1.1/32" },
                  { device: "R2", interface: "Gi0/0/0", ip: "10.0.0.2", subnet: "10.0.0.0/30" },
                  { device: "R2", interface: "Loopback0", ip: "2.2.2.2", subnet: "2.2.2.2/32" },
                ],
                steps: [
                  {
                    title: "ضبط Loopback و IP على R1",
                    description: "Loopback يُستخدم كـ router-id مستقر.",
                    code: "R1(config)# interface Loopback0\nR1(config-if)# ip address 1.1.1.1 255.255.255.255\nR1(config-if)# exit\nR1(config)# interface GigabitEthernet0/0/0\nR1(config-if)# ip address 10.0.0.1 255.255.255.252\nR1(config-if)# no shutdown",
                    device: "R1",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "ضبط Loopback و IP على R2",
                    description: "نفس الإعداد على R2 بعنوان مختلف.",
                    code: "R2(config)# interface Loopback0\nR2(config-if)# ip address 2.2.2.2 255.255.255.255\nR2(config-if)# exit\nR2(config)# interface GigabitEthernet0/0/0\nR2(config-if)# ip address 10.0.0.2 255.255.255.252\nR2(config-if)# no shutdown",
                    device: "R2",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "إعداد OSPF على R1",
                    description: "ابدأ OSPF process 1، اضبط router-id، reference bandwidth، passive-interface default، ثم فعّل الواجهات.",
                    code: "R1(config)# router ospf 1\nR1(config-router)# router-id 1.1.1.1\nR1(config-router)# auto-cost reference-bandwidth 100000\nR1(config-router)# passive-interface default\nR1(config-router)# no passive-interface GigabitEthernet0/0/0\nR1(config-router)# network 10.0.0.0 0.0.0.3 area 0\nR1(config-router)# network 1.1.1.1 0.0.0.0 area 0",
                    device: "R1",
                    cliMode: "Router Configuration",
                  },
                  {
                    title: "إعداد OSPF على R2",
                    description: "نفس الإعداد على R2 مع router-id وعناوين مختلفة.",
                    code: "R2(config)# router ospf 1\nR2(config-router)# router-id 2.2.2.2\nR2(config-router)# auto-cost reference-bandwidth 100000\nR2(config-router)# passive-interface default\nR2(config-router)# no passive-interface GigabitEthernet0/0/0\nR2(config-router)# network 10.0.0.0 0.0.0.3 area 0\nR2(config-router)# network 2.2.2.2 0.0.0.0 area 0",
                    device: "R2",
                    cliMode: "Router Configuration",
                  },
                ],
                verification: [
                  {
                    command: "show ip ospf neighbor",
                    whatToLookFor: "R2 يظهر كجار في حالة FULL. Neighbor ID = 2.2.2.2.",
                    expectedOutput: "Neighbor ID     Pri   State           Dead Time   Address         Interface\n2.2.2.2           1    FULL/BDR        00:00:35    10.0.0.2        GigabitEthernet0/0/0",
                  },
                  {
                    command: "show ip route ospf",
                    whatToLookFor: "مسار 2.2.2.2/32 متعلّم عبر OSPF (كود O).",
                    expectedOutput: "O    2.2.2.2 [110/2] via 10.0.0.2, 00:05:12, GigabitEthernet0/0/0",
                  },
                  {
                    command: "ping 2.2.2.2 source 1.1.1.1",
                    whatToLookFor: "ping من loopback R1 إلى loopback R2 يجب أن ينجح — يثبت التوجيه end-to-end.",
                  },
                ],
                commonErrors: [
                  {
                    error: "OSPF neighbor عالق في EXSTART/EXCHANGE",
                    cause: "اختلاف MTU بين الواجهتين — OSPF يرفض تبادل DBD إذا اختلفت MTUs.",
                    detection: "show ip ospf interface — قارن MTU على الجانبين.",
                    fix: "اضبط نفس MTU على الواجهتين: mtu 1500.",
                  },
                  {
                    error: "OSPF neighbor عالق في INIT",
                    cause: "HELLO يصل لكن الجار لا يرى الرد — ACL أو NAT أو multicast محجوب.",
                    detection: "debug ip ospf hello — تأكد من وصول hellos في الاتجاهين.",
                    fix: "تأكد أن ACL على الواجهة لا يمنع البروتوكول 89 (OSPF).",
                  },
                  {
                    error: "تكرار router-id",
                    cause: "نفس router-id على موجّهين — يمنع تشكيل التجاور.",
                    detection: "show ip ospf — قارن router-id.",
                    fix: "اضبط router-id فريدًا على كل موجّه ثم clear ip ospf process.",
                  },
                ],
                alternatives:
                  "بدلًا من network statement، استخدم ip ospf 1 area 0 على مستوى الواجهة (أوضح وأقل عرضة للأخطاء). لشبكات أكبر، استخدم مناطق متعددة (Multi-Area) لتقليل عبء LSA. على IPv6 استخدم OSPFv3 (router ospfv3).",
                rollback: "no router ospf 1 على كلا الموجّهين.",
                relatedCommandIds: ["cmd-router-ospf", "cmd-network-ospf", "cmd-ip-ospf-area", "cmd-show-ip-ospf", "cmd-show-ip-ospf-neighbor", "cmd-show-ip-route", "cmd-show-ip-protocols", "cmd-ping"],
                status: "documented",
                lastReviewed: "2026-10-29",
              },
            ],
            relatedCommandIds: ["cmd-router-ospf", "cmd-network-ospf", "cmd-ip-ospf-area", "cmd-show-ip-ospf", "cmd-show-ip-ospf-neighbor", "cmd-show-ip-route", "cmd-show-ip-protocols"],
            status: "documented",
          },
        ],
      },
      {
        id: "ch-bgp",
        title: "BGP",
        titleEn: "BGP Configuration",
        description: "eBGP، iBGP، neighbors، address families، route maps، استكشاف جلسات.",
        topics: [
          {
            id: "top-bgp-setup",
            title: "إعداد eBGP إلى ISP",
            titleEn: "Configure eBGP to ISP",
            overview:
              "BGP (Border Gateway Protocol) هو بروتوكول توجيه خارجي path-vector يُستخدم بين Autonomous Systems. eBGP بين AS مختلفة، iBGP داخل نفس AS. Administrative Distance: eBGP=20, iBGP=200. BGP يستخدم TCP port 179. المسار الافتراضي TTL لـ eBGP = 1 (مباشر) — اضبط ebgp-multihop للـ loopback peering.",
            keyConcepts: [
              "AS Number: معرّف Autonomous System. يجب أن يتطابق (eBGP: مختلف، iBGP: نفس).",
              "Neighbor: يُعرَّف سكونيًا بـ neighbor <ip> remote-as <as>.",
              "Address Family: تفعيل الجار في address-family الصحيحة (ipv4 unicast).",
              "network statement: تنشئ prefix في BGP فقط إذا وُجد مسار مطابق في RIB.",
              "update-source: واجهة المصدر لجلسة TCP — إلزامي لـ iBGP loopback peering.",
              "ebgp-multihop: TTL لـ eBGP عبر loopback أو عدة قفزات.",
              "BGP States: Idle → Connect → Active → OpenSent → OpenConfirm → Established.",
            ],
            tasks: [
              {
                id: "task-ebgp-isp",
                title: "إعداد eBGP إلى ISP",
                titleEn: "Configure eBGP to ISP",
                question: "كيف أُعدّ eBGP مع ISP لإعلان شبكتي؟",
                objective: "إعداد eBGP بين موجّه المؤسسة (AS 65001) و ISP (AS 64500) وإعلان شبكة 198.51.100.0/24.",
                prerequisites: ["موجّه بحلقة WAN", "ISP يوفر AS ورقم neighbor IP", "مسار إلى شبكة الإعلان موجود في RIB"],
                topology: {
                  nodes: [
                    { id: "ent", label: "Enterprise\nAS 65001", type: "router", ip: "203.0.113.2", x: 25, y: 50 },
                    { id: "isp", label: "ISP\nAS 64500", type: "cloud", ip: "203.0.113.1", x: 75, y: 50 },
                  ],
                  links: [
                    { from: "ent", to: "isp", label: "eBGP\n203.0.113.0/30" },
                  ],
                },
                ipPlan: [
                  { device: "Enterprise", interface: "Gi0/0/0", ip: "203.0.113.2", subnet: "203.0.113.0/30" },
                  { device: "ISP", interface: "-", ip: "203.0.113.1", subnet: "203.0.113.0/30" },
                ],
                steps: [
                  {
                    title: "ضبط IP على واجهة WAN",
                    description: "تأكد أن واجهة WAN لها IP و up/up.",
                    code: "Enterprise(config)# interface GigabitEthernet0/0/0\nEnterprise(config-if)# ip address 203.0.113.2 255.255.255.252\nEnterprise(config-if)# no shutdown",
                    device: "Enterprise",
                    cliMode: "Interface Configuration",
                  },
                  {
                    title: "التأكد من وجود مسار شبكة الإعلان في RIB",
                    description: "BGP network statement تنشئ prefix فقط إذا وُجد مسار مطابق في RIB (شبكة+قناع).",
                    code: "! تأكد أن 198.51.100.0/24 موجود في RIB (connected أو static)\nEnterprise(config)# ip route 198.51.100.0 255.255.255.0 Null0\nEnterprise# show ip route 198.51.100.0",
                    device: "Enterprise",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "إعداد BGP و router-id",
                    description: "ابدأ BGP process برقم AS المحلي واضبط router-id.",
                    code: "Enterprise(config)# router bgp 65001\nEnterprise(config-router)# bgp router-id 1.1.1.1",
                    device: "Enterprise",
                    cliMode: "Router Configuration",
                  },
                  {
                    title: "تعريف جار eBGP",
                    description: "عرّف ISP كجار بـ remote-as مختلف.",
                    code: "Enterprise(config-router)# neighbor 203.0.113.1 remote-as 64500\nEnterprise(config-router)# neighbor 203.0.113.1 password 7 <encrypted-md5-secret>",
                    device: "Enterprise",
                    cliMode: "Router Configuration",
                  },
                  {
                    title: "تفعيل الجار وإعلان الشبكة في address-family",
                    description: "فعّل الجار في ipv4 unicast و أعلن شبكتك.",
                    code: "Enterprise(config-router)# address-family ipv4 unicast\nEnterprise(config-router-af)# neighbor 203.0.113.1 activate\nEnterprise(config-router-af)# network 198.51.100.0 mask 255.255.255.0\nEnterprise(config-router-af)# exit",
                    device: "Enterprise",
                    cliMode: "Router Configuration → Address Family",
                  },
                ],
                verification: [
                  {
                    command: "show bgp ipv4 unicast summary",
                    whatToLookFor: "الجار 203.0.113.1 في حالة Established (رقم في آخر عمود، وليس كلمة Idle/Active).",
                    expectedOutput: "Neighbor        V           AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd\n203.0.113.1     4        64500    1247    1243       42    0    0 2w3d     18",
                  },
                  {
                    command: "show bgp ipv4 unicast",
                    whatToLookFor: "prefix 198.51.100.0/24 موجود بحالة *> (best).",
                  },
                  {
                    command: "show ip route bgp",
                    whatToLookFor: "مسارات BGP من ISP (إذا أعلن ISP عن مسارات إليك).",
                  },
                ],
                commonErrors: [
                  {
                    error: "BGP neighbor في حالة Idle",
                    cause: "لا مسار إلى neighbor IP، أو TCP 179 محجوب بـ ACL.",
                    detection: "show ip route <neighbor-ip> — تحقق من المسار.",
                    fix: "تأكد من المسار إلى neighbor. تحقق من ACLs على منفذ TCP 179.",
                  },
                  {
                    error: "BGP neighbor في حالة Active",
                    cause: "TCP SYN أُرسل لكن لا SYN-ACK — الجار البعيد غير مُعد للرد.",
                    detection: "debug bgp ipv4 unicast updates — تحقق من محاولات TCP.",
                    fix: "تأكد أن الجار البعيد عرّفك كـ neighbor بنفس remote-as.",
                  },
                  {
                    error: "BGP Established لكن 0 prefixes",
                    cause: "الجار فوق لكن لا مسارات متبادلة — route-maps أو prefix-lists تحجب، أو network statement خاطئة.",
                    detection: "show bgp ipv4 unicast — لا prefixes. show ip route 198.51.100.0 — المسار موجود؟",
                    fix: "تأكد أن network statement تطابق مسارًا في RIB بدقة (شبكة+قناع). تحقق من route-maps/prefix-lists على الجار.",
                  },
                ],
                alternatives:
                  "لـ iBGP (داخل نفس AS): neighbor <ip> remote-as <same-as> + neighbor <ip> update-source Loopback0 (للـ loopback peering). iBGP لا يُعيد إعلان مسارات iBGP المتعلّمة إلى جيران iBGP آخرين — استخدم Route Reflectors أو Confederations لتجنب full-mesh.",
                rollback: "no router bgp 65001.",
                relatedCommandIds: ["cmd-router-bgp", "cmd-bgp-neighbor", "cmd-bgp-network", "cmd-show-bgp-summary", "cmd-show-ip-route", "cmd-show-ip-protocols", "cmd-ping"],
                status: "documented",
                lastReviewed: "2026-10-29",
              },
            ],
            relatedCommandIds: ["cmd-router-bgp", "cmd-bgp-neighbor", "cmd-bgp-network", "cmd-show-bgp-summary", "cmd-show-ip-route"],
            status: "documented",
          },
        ],
      },
    ],
  },

  // ================================================================
  // Section G: NAT & PAT
  // ================================================================
  {
    id: "sec-nat",
    letter: "G",
    title: "NAT و PAT",
    titleEn: "NAT & PAT",
    icon: "ArrowLeftRight",
    description: "Static NAT، Dynamic NAT، PAT (Overload)، Port Forwarding، استكشاف مشاكل NAT.",
    chapters: [
      {
        id: "ch-nat-pat",
        title: "إعداد NAT و PAT",
        titleEn: "NAT & PAT Configuration",
        description: "كل أنواع NAT مع topology وأوامر تحقق واستكشاف أعطال.",
        topics: [
          {
            id: "top-nat-pat",
            title: "إعداد PAT (NAT Overload)",
            titleEn: "Configure PAT (NAT Overload)",
            overview:
              "PAT (Port Address Translation)، المعروف أيضًا بـ NAT Overload، يُترجم عدة عناوين inside local إلى عنوان inside global واحد (عنوان واجهة WAN) باستخدام أرقام منافذ فريدة. هذا هو النوع الأكثر شيوعًا في المنازل والشبكات الصغيرة — يسمح لكل أجهزة الشبكة الداخلية بمشاركة عنوان IP عام واحد للوصول إلى الإنترنت.",
            keyConcepts: [
              "Inside Local: عنوان المضيف الداخلي قبل الترجمة (مثلًا 10.10.10.50).",
              "Inside Global: عنوان المضيف بعد الترجمة (مثلًا 203.0.113.2 — عنوان WAN).",
              "Outside Local: عنوان الوجهة كما يراه المضيف الداخلي (عادةً = Outside Global).",
              "Outside Global: عنوان الوجهة الحقيقي على الإنترنت.",
              "PAT (Overload): يُترجم عدة inside local إلى inside global واحد باستخدام منافذ فريدة.",
              "Static NAT: ترجمة 1:1 ثابتة — لتعريض خادم داخلية على IP عام.",
              "ip nat inside: يوسم الواجهة المواجهة للـ LAN.",
              "ip nat outside: يوسم الواجهة المواجهة للـ WAN.",
            ],
            tasks: [
              {
                id: "task-pat-overload",
                title: "إعداد PAT لشبكة داخلية للوصول إلى الإنترنت",
                titleEn: "Configure PAT for Internet Access",
                question: "كيف أجعل كل مضيفي الشبكة الداخلية يصلون للإنترنت عبر عنوان WAN واحد؟",
                objective: "إعداد PAT لترجمة شبكة 10.10.0.0/16 إلى عنوان واجهة WAN للوصول إلى الإنترنت.",
                prerequisites: ["موجّه بواجهتي LAN و WAN", "عنوان IP عام على WAN", "مسار افتراضي إلى ISP"],
                topology: {
                  nodes: [
                    { id: "rtr", label: "NAT Router", type: "router", ip: "203.0.113.2", x: 50, y: 40 },
                    { id: "lan", label: "LAN\n10.10.0.0/16", type: "switch", ip: "10.10.10.1", x: 20, y: 80 },
                    { id: "inet", label: "Internet", type: "cloud", ip: "8.8.8.8", x: 80, y: 80 },
                  ],
                  links: [
                    { from: "rtr", to: "lan", label: "Gi0/0/0\ninside" },
                    { from: "rtr", to: "inet", label: "Gi0/0/1\noutside" },
                  ],
                },
                ipPlan: [
                  { device: "NAT Router", interface: "Gi0/0/0 (inside)", ip: "10.10.10.1", subnet: "10.10.0.0/16" },
                  { device: "NAT Router", interface: "Gi0/0/1 (outside)", ip: "203.0.113.2", subnet: "203.0.113.0/30" },
                  { device: "ISP Gateway", interface: "-", ip: "203.0.113.1", subnet: "203.0.113.0/30" },
                ],
                steps: [
                  {
                    title: "ضبط IP على الواجهات",
                    description: "تأكد أن واجهتي LAN و WAN لهما IP و up/up.",
                    code: "Router(config)# interface GigabitEthernet0/0/0\nRouter(config-if)# ip address 10.10.10.1 255.255.0.0\nRouter(config-if)# no shutdown\nRouter(config-if)# exit\nRouter(config)# interface GigabitEthernet0/0/1\nRouter(config-if)# ip address 203.0.113.2 255.255.255.252\nRouter(config-if)# no shutdown",
                    device: "NAT Router",
                    cliMode: "Interface Configuration",
                  },
                  {
                    title: "وسم الواجهات inside و outside",
                    description: "NAT يحتاج لمعرفة أي واجهة داخلية وأي خارجية.",
                    code: "Router(config)# interface GigabitEthernet0/0/0\nRouter(config-if)# ip nat inside\nRouter(config-if)# exit\nRouter(config)# interface GigabitEthernet0/0/1\nRouter(config-if)# ip nat outside",
                    device: "NAT Router",
                    cliMode: "Interface Configuration",
                  },
                  {
                    title: "إنشاء ACL تحدد عناوين inside local",
                    description: "ACL تطابق شبكة LAN الداخلية.",
                    code: "Router(config)# ip access-list extended ACL-NAT-INSIDE\nRouter(config-ext-nacl)# permit ip 10.10.0.0 0.0.255.255 any\nRouter(config-ext-nacl)# exit",
                    device: "NAT Router",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "إعداد PAT (NAT Overload)",
                    description: "اربط ACL بواجهة WAN مع overload لترجمة عدة مضيفين إلى عنوان واحد.",
                    code: "Router(config)# ip nat inside source list ACL-NAT-INSIDE interface GigabitEthernet0/0/1 overload",
                    device: "NAT Router",
                    cliMode: "Global Configuration",
                  },
                  {
                    title: "إعداد المسار الافتراضي إلى ISP",
                    description: "NAT يحتاج مسارًا افتراضيًا لإرسال الحركة المُترجَمة إلى الإنترنت.",
                    code: "Router(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1",
                    device: "NAT Router",
                    cliMode: "Global Configuration",
                  },
                ],
                verification: [
                  {
                    command: "show ip nat translations",
                    whatToLookFor: "ترجمات نشطة: inside local (10.10.x.x) → inside global (203.0.113.2) مع منافذ فريدة.",
                    expectedOutput: "Pro Inside global      Inside local       Outside local      Outside global\ntcp 203.0.113.1:33456  10.10.10.50:33456  93.184.216.34:443  93.184.216.34:443\ntcp 203.0.113.1:33457  10.10.10.51:33457  93.184.216.34:80   93.184.216.34:80",
                  },
                  {
                    command: "show ip nat statistics",
                    whatToLookFor: "Inside و outside interfaces موسومة. ACL-NAT-INSIDE مرتبطة. ترجمات نشطة.",
                    expectedOutput: "Total active translations: 12 (0 static, 12 dynamic; 12 extended)\nOutside interfaces:\n  GigabitEthernet0/0/1\nInside interfaces:\n  GigabitEthernet0/0/0\nHits: 12453  Misses: 0\nNAT-ACL:\n  ip access-list extended ACL-NAT-INSIDE\n    permit ip 10.10.0.0 0.0.255.255 any",
                  },
                  {
                    command: "ping 8.8.8.8 source 10.10.10.1",
                    whatToLookFor: "ping من داخل LAN إلى 8.8.8.8 يجب أن ينجح — يثبت أن PAT يعمل.",
                  },
                ],
                commonErrors: [
                  {
                    error: "المضيفون لا يصلون الإنترنت رغم إعداد NAT",
                    cause: "نسيان ip nat inside أو ip nat outside على الواجهات.",
                    detection: "show ip nat statistics — تحقق من قائمة Inside/Outside interfaces.",
                    fix: "تأكد من وسم الواجهات الصحيحة: ip nat inside على LAN، ip nat outside على WAN.",
                  },
                  {
                    error: "NAT translations لا تظهر",
                    cause: "ACL لا تطابق شبكة LAN، أو المضيفون لا يولّدون حركة.",
                    detection: "show access-lists ACL-NAT-INSIDE — 0 matches يعني لا حركة تطابق.",
                    fix: "تأكد من صحة wildcard mask في ACL. اختبر بـ ping من مضيف فعلي.",
                  },
                  {
                    error: "ترجمات NAT عالقة لا تُحذف",
                    cause: "ترجمات TCP تبقى 24 ساعة افتراضيًا حتى بعد انتهاء الاتصال.",
                    detection: "show ip nat translations — ترجمات قديمة كثيرة.",
                    fix: "clear ip nat translation * لحذف كل الترجمات الديناميكية.",
                  },
                ],
                alternatives:
                  "Static NAT (1:1): ip nat inside source static 10.10.10.50 203.0.113.10 — لتعريض خادم داخلية على IP عام ثابت. Dynamic NAT (pool): ip nat inside source list <acl> pool <pool-name> — يوزع عناوين من pool محدود (بدون overload). Static Port Forwarding: ip nat inside source static tcp 10.10.10.50 80 203.0.113.2 80 — لتحويل منفذ محدد.",
                rollback: "no ip nat inside source list ACL-NAT-INSIDE interface GigabitEthernet0/0/1 overload + no ip nat inside + no ip nat outside + no ip access-list extended ACL-NAT-INSIDE.",
                relatedCommandIds: ["cmd-ip-nat-inside-source", "cmd-ip-nat-inside", "cmd-ip-nat-outside", "cmd-ip-access-list-extended", "cmd-ip-route-static", "cmd-show-ip-nat-translations", "cmd-ping"],
                status: "documented",
                lastReviewed: "2026-10-29",
              },
            ],
            relatedCommandIds: ["cmd-ip-nat-inside-source", "cmd-ip-nat-inside", "cmd-ip-nat-outside", "cmd-ip-access-list-extended", "cmd-show-ip-nat-translations"],
            status: "documented",
          },
        ],
      },
    ],
  },

  // ================================================================
  // Section Q: Troubleshooting Command Center
  // ================================================================
  {
    id: "sec-troubleshooting",
    letter: "Q",
    title: "مركز تشخيص الأعطال",
    titleEn: "Troubleshooting Command Center",
    icon: "Stethoscope",
    description: "تشخيص منظم حسب الأعراض: لا اتصال، VLAN لا تعمل، OSPF neighbor، BGP Idle، NAT، DHCP، SSH، وأكثر.",
    chapters: [
      {
        id: "ch-ts-connectivity",
        title: "تشخيص مشاكل الاتصال",
        titleEn: "Connectivity Troubleshooting",
        description: "منهجية تشخيص من الأعراض إلى الجذر.",
        topics: [
          {
            id: "top-ts-methodology",
            title: "منهجية التشخيص",
            titleEn: "Troubleshooting Methodology",
            overview:
              "اتبع منهجية ثابتة: (1) صف الأعراض بدقة. (2) ابدأ بأوامر قراءة فقط (show) قبل أي تغيير. (3) ضيّق النطاق من الطبقة العليا إلى السفلى (Application → Transport → Network → Data Link → Physical). (4) استخدم ping و traceroute لتحديد مكان الفشل. (5) افحص مخرجات show بعناية. (6) طبّق إصلاحًا واحدًا في كل مرة. (7) تحقق بعد كل إصلاح. (8) وثّق ما تم.",
            keyConcepts: [
              "ابدأ دائمًا بأوامر القراءة فقط (show) قبل التغيير.",
              "ping يختبر Layer 3. traceroute يحدد مكان الفشل على المسار.",
              "show interfaces يكشف أخطاء Layer 1/2 (CRC، collisions، drops).",
              "show ip route يكشف مشاكل Layer 3 (مسارات مفقودة، next-hop خاطئ).",
              "debug لgetLast resort — يستهلك CPU، استخدمه بمحدودية.",
              "طبّق إصلاحًا واحدًا في كل مرة لتعرف ما الذي حلّ المشكلة.",
            ],
            relatedCommandIds: ["cmd-ping", "cmd-traceroute", "cmd-show-interfaces", "cmd-show-ip-interface-brief", "cmd-show-ip-route", "cmd-show-interfaces-status", "cmd-show-interfaces-counters-errors", "cmd-debug", "cmd-show-debugging"],
            status: "documented",
          },
        ],
      },
    ],
  },
];

// ===================================================================
// Helper: flatten all tasks for search
// ===================================================================
export interface FlatTask extends Task {
  sectionTitle: string;
  chapterTitle: string;
  topicTitle: string;
}

export function getAllTasks(): FlatTask[] {
  const tasks: FlatTask[] = [];
  for (const section of ENCYCLOPEDIA) {
    for (const chapter of section.chapters) {
      for (const topic of chapter.topics) {
        if (topic.tasks) {
          for (const task of topic.tasks) {
            tasks.push({
              ...task,
              sectionTitle: section.title,
              chapterTitle: chapter.title,
              topicTitle: topic.title,
            });
          }
        }
      }
    }
  }
  return tasks;
}

// ===================================================================
// Helper: count coverage stats
// ===================================================================
export interface EncyclopediaStats {
  totalSections: number;
  totalChapters: number;
  totalTopics: number;
  totalTasks: number;
  documentedTasks: number;
  partialTasks: number;
  needsReviewTasks: number;
}

export function getEncyclopediaStats(): EncyclopediaStats {
  let totalChapters = 0;
  let totalTopics = 0;
  let totalTasks = 0;
  let documentedTasks = 0;
  let partialTasks = 0;
  let needsReviewTasks = 0;

  for (const section of ENCYCLOPEDIA) {
    totalChapters += section.chapters.length;
    for (const chapter of section.chapters) {
      totalTopics += chapter.topics.length;
      for (const topic of chapter.topics) {
        if (topic.tasks) {
          for (const task of topic.tasks) {
            totalTasks++;
            if (task.status === "documented") documentedTasks++;
            else if (task.status === "partial") partialTasks++;
            else needsReviewTasks++;
          }
        }
      }
    }
  }

  return {
    totalSections: ENCYCLOPEDIA.length,
    totalChapters,
    totalTopics,
    totalTasks,
    documentedTasks,
    partialTasks,
    needsReviewTasks,
  };
}
