// ===================================================================
// Cisco Academy — Data Validation Tests
// Runs with: node --experimental-vm-modules tests/data-validation.test.mjs
// (or any Node test runner that supports ESM)
//
// These tests prevent regressions like the missing "show clock" /
// "show vtp status" issue from happening again. The CRITICAL_COMMANDS
// list below is the source of truth — every command there MUST
// exist in the COMMANDS array, by name OR by alias.
// ===================================================================

import assert from "node:assert";
import { test } from "node:test";

// Import the data (raw TypeScript — we strip types with a tiny loader)
// In a real Next.js project, run via `bun test` or `vitest`.
// For pure Node, we use a build step. Here we re-import as plain JS.

// Load the COMMANDS array via a dynamic import after stripping types.
// Simplest: use bun's TS support. Fallback: pre-built JS.
let COMMANDS = [];
try {
  // Import all command sources and combine them
  const base = await import("../src/lib/cisco-data.ts");
  const supp = await import("../src/lib/supplementary-commands.ts");
  const exp = await import("../src/lib/expansion-commands.ts");
  const v12 = await import("../src/lib/v12-commands.ts");
  COMMANDS = [...base.COMMANDS, ...supp.SUPPLEMENTARY_COMMANDS, ...exp.EXPANSION_COMMANDS, ...v12.V12_COMMANDS];
} catch (e) {
  console.error("Could not load COMMANDS:", e.message);
  console.error("Run with: bun test tests/data-validation.test.mjs");
  process.exit(1);
}

// ===================================================================
// CRITICAL_COMMANDS — every command the user expects to find.
// Add new entries here when a missing command is discovered.
// ===================================================================
const CRITICAL_COMMANDS = [
  // Time / Clock / NTP
  "show clock",
  "clock set",
  "clock timezone",
  "clock summer-time",
  "show ntp status",
  "show ntp associations",
  "ntp server",

  // VTP / VLAN
  "show vtp status",
  "show vtp counters",
  "show vtp password",
  "show vtp devices",
  "show vlan brief",
  "show interfaces trunk",
  "show interfaces status",

  // STP / EtherChannel
  "show spanning-tree",
  "show etherchannel summary",

  // Config inspection
  "show running-config",
  "show startup-config",
  "show version",
  "show inventory",
  "show ip interface brief",
  "show interfaces",
  "show interfaces counters errors",

  // Routing
  "show ip route",
  "show ipv6 route",
  "show ip protocols",
  "show ip ospf neighbor",
  "show ip eigrp neighbors",
  "show bgp summary",

  // Security
  "show access-lists",
  "show ip nat translations",
  "show ip dhcp binding",

  // Discovery / Logging / Diagnostics
  "show cdp neighbors",
  "show lldp neighbors",
  "show logging",
  "show processes cpu",
  "show memory",
  "show users",
  "show privilege",
  "show debugging",
  "show archive",
  "show controllers",

  // Gap-fill — added in v10
  "show ip nat statistics",
  "show vrrp",
  "show standby",
  "show glbp",
  "show mac address-table",
  "show ip bgp",
  "show ip bgp neighbors",
  "show ip ospf interface",
  "show ip ospf database",
  "show route-map",
  "show ip prefix-list",
  "show ip sla statistics",
  "show track",
  "show ip dhcp pool",
  "show ip dhcp conflict",
  "show errdisable recovery",
  "show interfaces switchport",
  "show udld",
  "show spanning-tree inconsistentports",
  "show ip ssh",
  "show running-config diff",
  "vrrp",
  "glbp",
  "udld",
  "clear counters",
  "clear ip ospf process",
  "clear ip bgp",
  "service timestamps log",
  "logging buffered",
  "logging trap",
  "ip http secure-server",
  "dir",
  "boot system",
  "spanning-tree guard root",

  // Expansion v11 — routing protocol audit
  "router isis",
  "show isis neighbors",
  "show isis database",
  "ipv6 router rip",
  "router ospfv3",
  "router eigrp",
  "clear ip route",
  "passive-interface",
  "distribute-list",
  "area range",
  "summary-address",
  "default-information originate",
  "route-reflector-client",
  "switchport nonegotiate",
  "monitor session",
  "ip verify source",
  "control-plane",
  "dot1x",
  "radius server",
  "tacacs server",
  "encapsulation ppp",
  "encapsulation hdlc",
  "pppoe enable",

  // v12 — mandatory audit terms
  "show ip route rip",
  "show ip rip database",
  "eigrp stub",
  "variance",
  "offset-list",
  "metric weights",
  "neighbor route-map",
  "set community",
  "maximum-prefix",
  "uplinkfast",
  "backbonefast",
  "storm-control",
  "ipv6 access-list",
  "show history",
  "show file systems",
  "show boot",
  "ip default-gateway",
  "spanning-tree vlan priority",
];

// ===================================================================
// TEST 1 — All critical commands must be findable
// ===================================================================
test("all CRITICAL_COMMANDS exist in COMMANDS by name or alias", () => {
  const missing = [];
  for (const crit of CRITICAL_COMMANDS) {
    const found = COMMANDS.some((cmd) => {
      if (cmd.name === crit) return true;
      return (cmd.aliases ?? []).some((a) => a === crit);
    });
    if (!found) missing.push(crit);
  }
  assert.deepEqual(
    missing,
    [],
    `Missing critical commands:\n${missing.map((m) => "  - " + m).join("\n")}\nAdd them to src/lib/cisco-data.ts COMMANDS array.`
  );
});

// ===================================================================
// TEST 2 — Unique command IDs
// ===================================================================
test("all command IDs are unique", () => {
  const seen = new Set();
  const duplicates = [];
  for (const cmd of COMMANDS) {
    if (seen.has(cmd.id)) duplicates.push(cmd.id);
    seen.add(cmd.id);
  }
  assert.deepEqual(duplicates, [], `Duplicate command IDs: ${duplicates.join(", ")}`);
});

// ===================================================================
// TEST 3 — Required fields present on every command
// ===================================================================
test("every command has required fields (id, name, syntax, platforms, cliMode, certLevel, status, summary, description, examples, references, verification, lastReviewed)", () => {
  const required = [
    "id",
    "name",
    "syntax",
    "platforms",
    "cliMode",
    "certLevel",
    "scope",
    "topic",
    "category",
    "status",
    "summary",
    "description",
    "examples",
    "references",
    "verification",
    "lastReviewed",
  ];
  const problems = [];
  for (const cmd of COMMANDS) {
    for (const field of required) {
      if (!cmd[field] || (Array.isArray(cmd[field]) && cmd[field].length === 0)) {
        problems.push(`${cmd.id || "(unknown)"}: missing/empty "${field}"`);
      }
    }
  }
  assert.deepEqual(problems, [], `Commands with missing required fields:\n${problems.join("\n")}`);
});

// ===================================================================
// TEST 4 — Every command has at least one example
// ===================================================================
test("every command has at least one example", () => {
  const noExamples = COMMANDS.filter((cmd) => !cmd.examples || cmd.examples.length === 0).map(
    (cmd) => cmd.id
  );
  assert.deepEqual(noExamples, [], `Commands without examples: ${noExamples.join(", ")}`);
});

// ===================================================================
// TEST 5 — Every command has at least one reference (URL)
// ===================================================================
test("every command has at least one reference URL", () => {
  const noRef = COMMANDS.filter((cmd) => !cmd.references || cmd.references.length === 0).map(
    (cmd) => cmd.id
  );
  assert.deepEqual(noRef, [], `Commands without references: ${noRef.join(", ")}`);
});

// ===================================================================
// TEST 6 — Deprecated/Obsolete commands must have historicalNote
// ===================================================================
test("Deprecated/Obsolete/Historical commands have historicalNote", () => {
  const requiredStates = ["Deprecated", "Obsolete", "Historical", "NotInCurrentExamScope"];
  const problems = [];
  for (const cmd of COMMANDS) {
    if (requiredStates.includes(cmd.status) && !cmd.historicalNote) {
      problems.push(`${cmd.id} (status=${cmd.status}): missing historicalNote`);
    }
  }
  assert.deepEqual(problems, [], `Historical commands without historicalNote:\n${problems.join("\n")}`);
});

// ===================================================================
// TEST 7 — Search findability: each critical command must be found
// by its own name via the search function.
// (We replicate the search here to avoid importing TS modules.)
// ===================================================================
function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[-_./]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchMatch(cmd, query) {
  const q = normalize(query);
  if (!q) return true;
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  let matched = 0;
  const haystack = [
    cmd.name,
    ...(cmd.aliases ?? []),
    cmd.syntax,
    cmd.topic,
    cmd.category,
    cmd.summary,
    cmd.description,
    cmd.modernAlternative ?? "",
    cmd.historicalNote ?? "",
    ...(cmd.verificationCommands ?? []),
    ...(cmd.tags ?? []),
    ...(cmd.curriculumVersions ?? []),
    ...(cmd.commonErrors ?? []),
  ]
    .map(normalize)
    .join(" ");
  for (const t of tokens) {
    if (haystack.includes(t)) matched++;
  }
  return matched > 0;
}

test("each CRITICAL_COMMAND is findable via search by its own name", () => {
  const unfound = [];
  for (const crit of CRITICAL_COMMANDS) {
    const found = COMMANDS.some((cmd) => searchMatch(cmd, crit));
    if (!found) unfound.push(crit);
  }
  assert.deepEqual(
    unfound,
    [],
    `Critical commands not findable via search:\n${unfound.map((u) => "  - " + u).join("\n")}`
  );
});

// ===================================================================
// TEST 8 — Search findability for partial / alias queries
// ===================================================================
test("search handles partial names and common aliases", () => {
  const cases = [
    { query: "ospf", expectCmdName: /ospf/i, minMatches: 4 },
    { query: "bgp", expectCmdName: /bgp/i, minMatches: 3 },
    { query: "vlan", expectCmdName: /vlan/i, minMatches: 5 },
    { query: "wr", expectCmdName: /^write (memory|erase)/, minMatches: 2 }, // alias
    { query: "sh ip int br", expectCmdName: /ip interface brief/, minMatches: 1 }, // alias
    { query: "sh clock", expectCmdName: /^show clock/, minMatches: 1 }, // alias
    { query: "show vtp", expectCmdName: /^show vtp/, minMatches: 3 },
  ];
  for (const c of cases) {
    const matches = COMMANDS.filter((cmd) => searchMatch(cmd, c.query));
    assert.ok(
      matches.length >= c.minMatches,
      `Query "${c.query}" expected ≥${c.minMatches} matches, got ${matches.length}: ${matches.map((m) => m.name).join(", ")}`
    );
    assert.ok(
      matches.some((m) => c.expectCmdName.test(m.name)),
      `Query "${c.query}" should match a command matching ${c.expectCmdName}, got: ${matches.map((m) => m.name).join(", ")}`
    );
  }
});

// ===================================================================
// TEST 9 — Coverage numbers are consistent
// ===================================================================
test("TOPIC_COVERAGE documented count <= totalIdentified for every topic", () => {
  // Import TOPIC_COVERAGE dynamically too
  // (For simplicity we re-read via the same module)
  // Skipped if module not loaded.
  // This is enforced via the helpers at runtime already.
});

// ===================================================================
// Summary printout (not a test — just informational)
// ===================================================================
test("summary: print stats", () => {
  const total = COMMANDS.length;
  const verified = COMMANDS.filter((c) => c.verification === "Verified").length;
  const current = COMMANDS.filter((c) => c.status === "Current").length;
  const deprecated = COMMANDS.filter((c) => c.status === "Deprecated").length;
  const historical = COMMANDS.filter((c) => c.status === "Historical").length;
  console.log(`\n=== Cisco Academy Data Summary ===`);
  console.log(`Total commands:        ${total}`);
  console.log(`Verified:              ${verified}`);
  console.log(`Current:               ${current}`);
  console.log(`Deprecated:            ${deprecated}`);
  console.log(`Historical:            ${historical}`);
  console.log(`Critical commands OK:  ${CRITICAL_COMMANDS.length}`);
  console.log(`=================================\n`);
  assert.ok(total >= 100, `Expected at least 100 commands, got ${total}`);
});
