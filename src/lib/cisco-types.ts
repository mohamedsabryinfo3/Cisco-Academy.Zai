// ===================================================================
// Cisco Commands Academy — Data Model (v2)
// Type definitions for the Cisco CLI knowledge base
// Includes historical / deprecated / retired command status fields
// ===================================================================

export type Platform =
  | "IOS"
  | "IosXe"
  | "NxOs"
  | "IosXr"
  | "Catalyst"
  | "Nexus"
  | "WLC"
  | "Meraki";

export type CertLevel =
  | "Fundamentals"
  | "CCNA"
  | "CCNP-ENCOR"
  | "CCNP-ENARSI"
  | "Extended"
  | "Specialization";

export type Scope = "certification" | "extended" | "unverified";

export type VerificationState =
  | "Verified"
  | "Officially Referenced"
  | "Needs Review"
  | "Unsupported/Retired"
  | "Draft";

// New: temporal/technical status of the command itself
export type CommandStatus =
  | "Current"          // supported on the targeted platform/release
  | "Deprecated"       // documented as not recommended by Cisco
  | "Obsolete"         // support removed in the verified scope
  | "NotInCurrentExamScope" // historical exam-only, still technically supported
  | "Historical"       // documented for understanding older curricula/platforms
  | "PlatformSpecific" // only valid on a specific platform
  | "VersionLimited"   // supported only on specific versions
  | "NeedsVerification"; // insufficient info to determine status

export type CLIMode =
  | "User EXEC"
  | "Privileged EXEC"
  | "Global Configuration"
  | "Interface Configuration"
  | "Subinterface Configuration"
  | "Router Configuration"
  | "Line Configuration"
  | "VLAN Configuration"
  | "Sub-mode"
  | "Multiple";

export interface CommandParameter {
  name: string;       // e.g. "level"
  description: string; // Arabic description with English technical terms
  required: boolean;
  defaultValue?: string;
  allowedValues?: string[];
}

export interface CommandExample {
  context: string;     // Arabic context
  code: string;
  output?: string;
  outputExplanation?: string; // Arabic explanation of the output
}

export interface CommandReference {
  label: string;
  url: string;
}

export interface CiscoCommand {
  // Identity
  id: string;
  name: string;            // English command name (never translated)
  aliases?: string[];      // historical / alternate names (e.g. "write memory" => "wr")
  syntax: string;

  // Platform & version
  platforms: Platform[];
  versionRange?: string;
  cliMode: CLIMode[];
  promptShape?: string;    // e.g. "Router(config-if)#"

  // Curriculum
  certLevel: CertLevel;
  scope: Scope;
  topic: string;
  category: string;
  curriculumVersions?: string[]; // e.g. ["CCNA v1.0 (200-120)", "CCNA v2.0 (200-301)"]

  // Temporal/technical status (new in v2)
  status: CommandStatus;
  historicalNote?: string;       // Arabic — why it's deprecated/retired/historical
  modernAlternative?: string;    // English command name + brief Arabic note
  modernAlternativeCommandId?: string; // link to the modern equivalent in DB
  differencesFromAlternative?: string;  // Arabic — what changed

  // Description
  summary: string;        // Arabic, ~1-2 sentences
  description: string;    // Arabic, detailed
  parameters?: CommandParameter[];

  // Examples & verification
  examples: CommandExample[];
  verificationCommands?: string[];
  troubleshootingNotes?: string[];
  warnings?: string[];
  commonErrors?: string[];       // Arabic — typical mistakes and how to fix
  undoMethod?: string;           // Arabic — how to revert (e.g. "no <command>")

  // References & audit
  references: CommandReference[];
  verification: VerificationState;
  lastReviewed: string;          // ISO date
  relatedCommandIds?: string[];
  tags?: string[];
}

export interface TroubleshootingEntry {
  id: string;
  problem: string;
  category: string;
  symptoms: string[];
  possibleCauses: string[];
  diagnosisCommands: string[];
  resolution: string[];
  relatedCommandIds?: string[];
  verification: VerificationState;
}

export interface PlatformInfo {
  id: Platform;
  name: string;
  cliModel: string;
  description: string;
  managementInterfaces: string[];
  commonDevices: string[];
  notes: string;
}

export interface CurriculumVersion {
  cert: string;
  examCode: string;
  examTopicsVersion: string;
  publishedDate: string;
  lastVerified: string;
  sourceUrl: string;
  notes: string;
  status: "current" | "retired" | "legacy";
}

export interface TopicCoverage {
  topic: string;
  category: string;
  certLevel: CertLevel;
  totalIdentified: number;
  documented: number;
  verified: number;
  needsReview: number;
  coverageState: "reviewed" | "partial" | "not-started";
  notes?: string;
}
