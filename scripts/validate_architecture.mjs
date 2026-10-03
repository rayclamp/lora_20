#!/usr/bin/env node

/**
 * validate_architecture.mjs
 *
 * Current-system consistency validator.
 * It rejects legacy execution paths instead of preserving them.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
let failures = 0;

function fail(message) {
  console.error("[FAIL] " + message);
  failures++;
}

function pass(message) {
  console.log("[PASS] " + message);
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function read(rel) {
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
  "MODULES/LORA_PRODUCTION/MODULE.md",
  "MODULES/LORA_PRODUCTION/DATASET/DATASET_SPEC.md",
  "MODULES/LORA_PRODUCTION/PRODUCTION/GOAL.md",
  "MODULES/LORA_PRODUCTION/PRODUCTION/QUEUE.md",
  "MODULES/LORA_PRODUCTION/PRODUCTION/WORKER_PROTOCOL.md",
  "MODULES/LORA_PRODUCTION/QA/QA_SPEC.md",
];

for (const file of required) {
  if (!exists(file)) fail("Missing required current file: " + file);
}
if (failures === 0) pass("Current architecture files exist");

const registry = read("00_MASTER/MODULE_REGISTRY.md");
const runtime = read("00_MASTER/RUNTIME_STATE.md");
const architecture = read("00_MASTER/SYSTEM_ARCHITECTURE.md");
const consistency = read("00_MASTER/SYSTEM_CONSISTENCY_MATRIX.md");

for (const line of [
  "UNIVERSAL_WALLPAPER | ACTIVE",
  "FESTIVAL_WALLPAPER | ACTIVE",
  "LORA_PRODUCTION | PAUSED",
  "QA | PAUSED",
  "IMAGE_DELIVERY | PAUSED",
]) {
  if (!registry.includes(line)) fail("Module registry mismatch: " + line);
}
if (!runtime.includes("MODULE: FESTIVAL_WALLPAPER")) fail("Runtime active workflow is not Festival Wallpaper");
if (!runtime.includes("LORA_PRODUCTION | PAUSED")) fail("Runtime does not keep LoRA paused");
if (!architecture.includes("CORE → MODULE → MODULE-OWNED DATA / STATE")) fail("Architecture boundary missing");
if (!consistency.includes("Current-system-only invariant")) fail("Consistency matrix missing current-system-only invariant");

const forbiddenPaths = [
  "PRODUCTION/",
  "ACCOUNTS/",
  "TASKS/",
  "STATUS/",
  "01_CHARACTER/",
  "02_CLOTHING/",
  "03_SCENE/",
  "04_POSE_CAMERA/",
  "05_PROMPT/",
  "PROJECT_STATUS.md",
  "MASTER_IMAGE/",
  "00_MASTER/QUALITY_CONTROL.md",
  "00_MASTER/WALLPAPER_COMPOSITION.md",
];
const files = allFiles();
for (const p of forbiddenPaths) {
  if (files.some(f => f === p || f.startsWith(p))) {
    fail("Forbidden legacy path remains: " + p);
  }
}

const forbiddenTokens = [
  "T109",
  "T108",
  "ACCOUNT_01",
  "ACCOUNT_02",
  "ACCOUNT_03",
  "ACCOUNT_04",
  "ACCOUNT_05",
  "ACCOUNT_06",
  "ACCOUNT_07",
  "ACCOUNT_08",
  "PRODUCTION/IMAGE_QUEUE.md",
  "PRODUCTION/PRODUCTION_GOAL.md",
  "PROJECT_STATUS.md",
  "LORA_PRODUCTION_PROTOCOL.md",
];

for (const file of files.filter(f => f.endsWith(".md") || f.endsWith(".mjs"))) {
  const content = read(file);
  for (const token of forbiddenTokens) {
    if (content.includes(token)) fail(`Forbidden legacy token "${token}" in ${file}`);
  }
}

if (!registry.includes("MODULES/LORA_PRODUCTION/MODULE.md")) {
  fail("LoRA module is not registered to its current module root");
}

if (runtime.includes("LORA_PRODUCTION: ACTIVE")) {
  fail("Runtime attempts to activate LoRA");
}

const festivalPrompt = read("00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md");
if (!festivalPrompt.includes("USER INTENT\n   defines WHAT is requested")) fail("Festival prompt is missing the current authority wording for user intent");
if (!festivalPrompt.includes("SYSTEM / RUNTIME / MODULE AUTHORITY")) fail("Festival prompt is missing the current system/module authority layer");
if (festivalPrompt.includes("1. 使用者當前明確要求\n2. CHARACTER_REFERENCE")) fail("Festival prompt still uses the superseded precedence ordering");

if (failures > 0) {
  console.error("\nArchitecture validation FAILED: " + failures + " issue(s).");
  process.exit(1);
}

console.log("\nArchitecture validation PASSED.");
