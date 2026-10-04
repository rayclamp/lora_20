#!/usr/bin/env node

/**
 * validate_architecture.mjs
 * Council Round 5 — Architecture Enforcement Verification.
 */

import fs from "node:fs";
import path from "node:path";

const rootArgIndex = process.argv.indexOf("--root");
const ROOT = rootArgIndex >= 0 && process.argv[rootArgIndex + 1]
  ? path.resolve(process.argv[rootArgIndex + 1])
  : process.cwd();
let failures = 0;

function fail(message) { console.error("[FAIL] " + message); failures++; }
function pass(message) { console.log("[PASS] " + message); }
function exists(rel) { return fs.existsSync(path.join(ROOT, rel)); }
function read(rel) {
  if (!exists(rel)) { fail("Cannot read missing file: " + rel); return ""; }
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}
function allFiles(dir = ROOT) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...allFiles(full));
    else out.push(path.relative(ROOT, full).replaceAll(path.sep, "/"));
  }
  return out;
}
function statusFromTable(markdown, moduleName) {
  const line = markdown.split("\n").find(function(x) {
    const cells = x.split("|").map(function(v) { return v.trim(); });
    return cells[1] === moduleName;
  });
  if (!line) return null;
  const cells = line.split("|").map(function(v) { return v.trim(); });
  return cells[2] === "ACTIVE" || cells[2] === "PAUSED" ? cells[2] : null;
}
function activeWorkflow(runtimeText) {
  const moduleName = runtimeText.match(/ACTIVE_WORKFLOW:\s*\n\s*MODULE:\s*([^\n]+)/)?.[1]?.trim();
  const mode = runtimeText.match(/ACTIVE_WORKFLOW:[\s\S]*?MODE:\s*([^\n]+)/)?.[1]?.trim();
  return { moduleName, mode };
}

const required = [
  "START_HERE.md",
  "00_MASTER/SYSTEM_ARCHITECTURE.md",
  "00_MASTER/MODULE_REGISTRY.md",
  "00_MASTER/RUNTIME_STATE.md",
  "00_MASTER/AUTHORITY_MATRIX.md",
  "00_MASTER/SYSTEM_CONSISTENCY_MATRIX.md",
  "00_MASTER/CORE_RULES.md",
  "00_MASTER/DRAWING_INSTRUCTIONS.md",
  "00_MASTER/ANATOMY_STABILITY.md",
  "00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md",
  "00_MASTER/GENERATION_WORKER_PROTOCOL.md",
  "00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md",
  "00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md",
  "00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md",
  "00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md",
  "00_MASTER/WALLPAPER/WALLPAPER_TASK_INTEGRITY.md",
  "00_MASTER/QA_MODULE.md",
  "00_MASTER/QA_PROTOCOL.md",
  "00_MASTER/IMAGE_DELIVERY_MODULE.md",
  "00_MASTER/ARCHITECTURE_ENFORCEMENT_SPEC.md",
  "00_MASTER/CROSS_MODULE_BOUNDARY_SPEC.md",
  "MODULES/LORA_PRODUCTION/MODULE.md",
  "MODULES/LORA_PRODUCTION/IDENTITY/CHARACTER_REFERENCE.md",
  "MODULES/LORA_PRODUCTION/IDENTITY/STYLE_REFERENCE.md",
  "MODULES/LORA_PRODUCTION/DATASET/DATASET_SPEC.md",
  "MODULES/LORA_PRODUCTION/DATASET/CANDIDATE_RULES.md",
  "MODULES/LORA_PRODUCTION/DATASET/DATASET_DIVERSITY.md",
  "MODULES/LORA_PRODUCTION/PRODUCTION/GOAL.md",
  "MODULES/LORA_PRODUCTION/PRODUCTION/QUEUE.md",
  "MODULES/LORA_PRODUCTION/PRODUCTION/WORKER_PROTOCOL.md",
  "MODULES/LORA_PRODUCTION/PRODUCTION/RETRY_POLICY.md",
  "MODULES/LORA_PRODUCTION/QA/QA_SPEC.md",
  "MODULES/LORA_PRODUCTION/QA/QA_CHECKLIST.md",
  "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/README.md",
  "MODULES/LORA_PRODUCTION/BATCHES/README.md"
];

for (const file of required) {
  if (!exists(file)) fail("Missing required current file: " + file);
}
if (failures === 0) pass("Phase 0: required architecture files exist");

const registry = read("00_MASTER/MODULE_REGISTRY.md");
const runtime = read("00_MASTER/RUNTIME_STATE.md");
const architecture = read("00_MASTER/SYSTEM_ARCHITECTURE.md");
const authority = read("00_MASTER/AUTHORITY_MATRIX.md");
const consistency = read("00_MASTER/SYSTEM_CONSISTENCY_MATRIX.md");
const startHere = read("START_HERE.md");

const modules = ["UNIVERSAL_WALLPAPER", "FESTIVAL_WALLPAPER", "LORA_PRODUCTION", "QA", "IMAGE_DELIVERY"];
const registryStatus = Object.fromEntries(modules.map(function(m) { return [m, statusFromTable(registry, m)]; }));
const runtimeStatus = Object.fromEntries(modules.map(function(m) { return [m, statusFromTable(runtime, m)]; }));

for (const moduleName of modules) {
  if (!registryStatus[moduleName]) fail("Registry has no valid status for " + moduleName);
  if (!runtimeStatus[moduleName]) fail("Runtime has no valid status for " + moduleName);
  if (registryStatus[moduleName] !== runtimeStatus[moduleName]) {
    fail("Registry/Runtime status mismatch for " + moduleName +
      ": registry=" + registryStatus[moduleName] + ", runtime=" + runtimeStatus[moduleName]);
  }
}
if (failures === 0) pass("Phase 1: Module Registry ↔ Runtime State contract is consistent");

const workflow = activeWorkflow(runtime);
if (!workflow.moduleName) {
  fail("Runtime ACTIVE_WORKFLOW has no MODULE");
} else if (runtimeStatus[workflow.moduleName] !== "ACTIVE") {
  fail("Active workflow points to non-ACTIVE module: " + workflow.moduleName);
}
if (workflow.moduleName === "FESTIVAL_WALLPAPER" && workflow.mode !== "MANUAL_DESIGN") {
  fail("Festival active workflow mode is not MANUAL_DESIGN: " + workflow.mode);
}

const workflowContracts = {
  UNIVERSAL_WALLPAPER: ["00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md","00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_PRODUCTION_SESSION.md","00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_BATCH_RECORD_SPEC.md","MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/README.md"],
  FESTIVAL_WALLPAPER: [
    "00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md",
    "FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/CORE_FESTIVAL_INDEX.md"
  ],
  LORA_PRODUCTION: [
    "MODULES/LORA_PRODUCTION/MODULE.md",
    "MODULES/LORA_PRODUCTION/BATCHES/README.md",
    "MODULES/LORA_PRODUCTION/PRODUCTION/GOAL.md",
    "MODULES/LORA_PRODUCTION/PRODUCTION/QUEUE.md",
    "MODULES/LORA_PRODUCTION/PRODUCTION/WORKER_PROTOCOL.md"
  ],
  QA: ["00_MASTER/QA_MODULE.md", "00_MASTER/QA_PROTOCOL.md"],
  IMAGE_DELIVERY: ["00_MASTER/IMAGE_DELIVERY_MODULE.md"]
};

for (const moduleName of modules) {
  for (const contractFile of workflowContracts[moduleName]) {
    if (!exists(contractFile)) fail(moduleName + " contract file missing: " + contractFile);
  }
}
if (failures === 0) pass("Phase 2: module protocol contracts exist");

const authorityRows = Array.from(authority.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$/gm));
const authorityTargets = authorityRows
  .map(function(m) { return m[2].trim(); })
  .filter(function(v) {
    return v.startsWith("00_MASTER/") || v.startsWith("MODULES/") || v.startsWith("FESTIVAL_COSTUME_DATABASE/");
  });

for (const rawTarget of authorityTargets) {
  const targets = rawTarget.split(/\s*\+\s*/).map(function(x) {
    return x.trim().replace(/[.,]$/, "");
  });
  for (const target of targets) {
    if (target.endsWith("/")) {
      if (!allFiles().some(function(f) { return f.startsWith(target); })) {
        fail("Authority Matrix points to missing directory: " + target);
      }
    } else if (!exists(target)) {
      fail("Authority Matrix points to missing canonical path: " + target);
    }
  }
}
if (failures === 0) pass("Phase 3: Authority Matrix canonical paths resolve");

if (!architecture.includes("CORE → MODULE → MODULE-OWNED DATA / STATE")) fail("Architecture boundary missing");
if (!architecture.includes("A lower layer cannot activate or override a higher layer.")) fail("Architecture precedence invariant missing");
if (!consistency.includes("Current-system-only invariant")) fail("Consistency matrix missing current-system-only invariant");
if (!consistency.includes("Single-rule principle")) fail("Consistency matrix missing single-rule principle");
if (!startHere.includes("Conversation memory is not an execution authority.")) fail("START_HERE is missing conversation-memory authority boundary");
if (failures === 0) pass("Phase 4: authority and precedence invariants are declared");

const forbiddenPaths = [
  "PRODUCTION/", "ACCOUNTS/", "TASKS/", "STATUS/", "01_CHARACTER/", "02_CLOTHING/",
  "03_SCENE/", "04_POSE_CAMERA/", "05_PROMPT/", "PROJECT_STATUS.md", "MASTER_IMAGE/",
  "00_MASTER/QUALITY_CONTROL.md", "00_MASTER/WALLPAPER_COMPOSITION.md"
];
const files = allFiles();
const operationalFiles = files.filter(function(f) { return f !== "scripts/validate_architecture.mjs" && f !== "00_MASTER/ARCHITECTURE_ENFORCEMENT_SPEC.md"; });
for (const p of forbiddenPaths) {
  if (files.some(function(f) { return f === p || f.startsWith(p); })) {
    fail("Forbidden legacy path remains: " + p);
  }
}

const forbiddenTokens = [
  "T109", "T108", "ACCOUNT_01", "ACCOUNT_02", "ACCOUNT_03", "ACCOUNT_04",
  "ACCOUNT_05", "ACCOUNT_06", "ACCOUNT_07", "ACCOUNT_08",
  "PRODUCTION/IMAGE_QUEUE.md", "PRODUCTION/PRODUCTION_GOAL.md",
  "PROJECT_STATUS.md", "LORA_PRODUCTION_PROTOCOL.md"
];
for (const file of operationalFiles.filter(function(f) { return f.endsWith(".md") || f.endsWith(".mjs"); })) {
  const content = read(file);
  for (const token of forbiddenTokens) {
    if (content.includes(token)) fail("Forbidden legacy token \"" + token + "\" in " + file);
  }
}
if (failures === 0) pass("Phase 5: legacy path/token exclusion is clean");

const core = read("00_MASTER/CORE_RULES.md");

const coreForbidden = ["age-20", "LoRA dataset", "festival cultural data", "wallpaper-specific workflow", "account-specific authority"];
for (const token of coreForbidden) {
  if (core.toLowerCase().includes(token.toLowerCase())) {
    fail("CORE contains module-specific authority token: " + token);
  }
}

const loraModule = read("MODULES/LORA_PRODUCTION/MODULE.md");
for (const guard of ["No Goal is active", "No Queue is executable", "Do not import Wallpaper workflow"]) {
  if (!loraModule.includes(guard)) fail("LoRA isolation/activation guard missing: " + guard);
}

if (registryStatus.LORA_PRODUCTION === "PAUSED" && !runtime.includes("LORA_PRODUCTION | PAUSED")) {
  fail("Runtime does not explicitly block paused LoRA");
}
if (registryStatus.QA === "PAUSED") {
  if (!read("00_MASTER/QA_MODULE.md").includes("**PAUSED**")) fail("QA module does not declare PAUSED");
  if (!read("00_MASTER/QA_PROTOCOL.md").includes("**PAUSED**")) fail("QA protocol does not declare PAUSED");
}
if (registryStatus.IMAGE_DELIVERY === "PAUSED" &&
    !read("00_MASTER/IMAGE_DELIVERY_MODULE.md").includes("PAUSED")) {
  fail("Image Delivery module does not declare PAUSED");
}
if (registryStatus.LORA_PRODUCTION === "ACTIVE") {
  for (const p of workflowContracts.LORA_PRODUCTION) {
    const c = read(p);
    if (/not executable/i.test(c) || /\bPAUSED\b/i.test(c)) {
      fail("LoRA is ACTIVE but its execution chain still declares blocked state: " + p);
    }
  }
}
if (failures === 0) pass("Phase 6: module isolation and activation guards are consistent");

const festivalPrompt = read("00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md");
for (const token of [
  "### 1. USER INTENT",
  "### 2. SYSTEM / RUNTIME / MODULE AUTHORITY",
  "### 4. CORE HARD CONSTRAINTS",
  "### 5. CREATIVE DESIGN"
]) {
  if (!festivalPrompt.includes(token)) fail("Festival prompt missing authority layer: " + token);
}
if (festivalPrompt.includes("1. 使用者當前明確要求\n2. CHARACTER_REFERENCE")) {
  fail("Festival prompt still contains superseded precedence ordering");
}
if (failures === 0) pass("Phase 7: Festival authority wording is current");

const qaModule = read("00_MASTER/QA_MODULE.md");
const qaProtocol = read("00_MASTER/QA_PROTOCOL.md");
const qaCombined = (qaModule + "\n" + qaProtocol).toLowerCase();
const qaContractChecks = [
  ["generation-success/QA separation", /generation success.*never retroactively changed.*qa/i],
  ["SOURCE_MODULE", /source_module/i],
  ["QA_DATA_CONFLICT", /qa_data_conflict/i],
  ["QA_INPUT_INCOMPLETE", /qa_input_incomplete/i]
];
for (const [label, pattern] of qaContractChecks) {
  if (!pattern.test(qaCombined)) fail("QA contract missing: " + label);
}
if (failures === 0) pass("Phase 8: QA activation contract is structurally present");

const taskIntegrity = read("00_MASTER/WALLPAPER/WALLPAPER_TASK_INTEGRITY.md");
for (const token of [
  "DESIGN_LOCK", "IMAGE_ID LOCK", "FORMAT_LOCK", "EXPECTED_OUTPUT_COUNT",
  "OUTPUT_COUNT_MISMATCH", "INVALID_IMAGE_ID", "UNKNOWN / RECOVERY_REQUIRED"
]) {
  if (!taskIntegrity.includes(token)) fail("Wallpaper task-integrity contract missing: " + token);
}
if (failures === 0) pass("Phase 9: Wallpaper task-integrity contract is present");

const worker = read("00_MASTER/GENERATION_WORKER_PROTOCOL.md");
for (const token of [
  "claim one valid QUEUED task atomically", "verify Claim/Lease",
  "SUCCESS / FAILED / UNKNOWN", "UNKNOWN requires recovery", "do not self-QA"
]) {
  if (!worker.includes(token)) fail("Generic Worker enforcement rule missing: " + token);
}

if (failures === 0) pass("Phase 10: generic Worker execution safeguards are present");

const boundary = read("00_MASTER/CROSS_MODULE_BOUNDARY_SPEC.md");
const universalProtocol = read("00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md");
const festivalProtocol = read("00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md");
const loraProtocol = read("MODULES/LORA_PRODUCTION/MODULE.md");
const loraWorker = read("MODULES/LORA_PRODUCTION/PRODUCTION/WORKER_PROTOCOL.md");
const qaBoundary = qaModule + "\n" + qaProtocol;
const delivery = read("00_MASTER/IMAGE_DELIVERY_MODULE.md");
const genericWorker = worker;

const boundaryChecks = [
  ["boundary spec Universal isolation", /### UNIVERSAL_WALLPAPER[\s\S]*?Must not consume:[\s\S]*?LoRA identity\/reference authority[\s\S]*?(?=### FESTIVAL_WALLPAPER)/i],
  ["boundary spec Festival isolation", /### FESTIVAL_WALLPAPER[\s\S]*?Must not consume:[\s\S]*?LoRA identity\/reference authority[\s\S]*?(?=### LORA_PRODUCTION)/i],
  ["boundary spec LoRA isolation", /LORA_PRODUCTION[\s\S]*Must not consume:[\s\S]*Universal Wallpaper production state/i],
  ["boundary spec QA downstream", /QA[\s\S]*must not become a production module/i],
  ["boundary spec Delivery isolation", /IMAGE_DELIVERY[\s\S]*must not generate images/i],
  ["Universal protocol LoRA isolation", /Do not load LoRA-specific reference or production rules/i],
  ["Festival prompt LoRA isolation", /Do not import LoRA Dataset/i],
  ["LoRA module Wallpaper isolation", /Do not import Wallpaper workflow/i],
  ["LoRA worker production boundary", /Generation ends at IMAGE_CREATED[\s\S]*QA is independent/i],
  ["QA source-module boundary", /QA must select criteria from SOURCE_MODULE/i],
  ["QA production boundary", /Production Workers do not cross into QA/i],
  ["Delivery generation boundary", /Image generation is not performed here/i],
  ["Generic Worker module isolation", /Do not import another module's rules/i]
];

for (const [label, pattern] of boundaryChecks) {
  const source = label.includes("boundary spec") ? boundary :
    label.startsWith("Universal") ? universalProtocol :
    label.startsWith("Festival") ? festivalProtocol :
    label.startsWith("LoRA module") ? loraProtocol :
    label.startsWith("LoRA worker") ? loraWorker :
    label.startsWith("QA ") ? qaBoundary :
    label.startsWith("Delivery") ? delivery :
    genericWorker;
  if (!pattern.test(source)) fail("Cross-module boundary missing: " + label);
}

if (universalProtocol.includes("00_MASTER/MASTER_SPEC.md")) {
  fail("Universal Wallpaper references nonexistent canonical file: 00_MASTER/MASTER_SPEC.md");
}
if (failures === 0) pass("Phase 11: Cross-module boundary enforcement is structurally present");

const canonicalStateChecks = [
  ["UNIVERSAL_WALLPAPER", "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/README.md"],
  ["LORA_PRODUCTION", "MODULES/LORA_PRODUCTION/BATCHES/README.md"]
];
for (const [moduleName, statePath] of canonicalStateChecks) {
  if (registryStatus[moduleName] === "ACTIVE" && !exists(statePath)) fail("ACTIVE module has no canonical persistent state marker: " + moduleName);
}
if (failures === 0) pass("Phase 12: canonical persistent-state contracts are present");



if (failures > 0) {
  console.error("\nArchitecture enforcement validation FAILED: " + failures + " issue(s).");
  process.exit(1);
}
console.log("\nArchitecture enforcement validation PASSED.");
