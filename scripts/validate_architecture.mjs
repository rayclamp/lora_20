#!/usr/bin/env node

/**
 * validate_architecture.mjs
 *
 * Architecture consistency checks for the INARIA AI STUDIO repository.
 * This validator is intentionally lightweight: it checks canonical architecture,
 * module registration, runtime state, authority references, and stale current-status
 * claims. It does not inspect image binaries or perform visual QA.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function fail(message) {
  console.error(`[FAIL] ${message}`);
  failures++;
}

function pass(message) {
  console.log(`[PASS] ${message}`);
}

let failures = 0;

const architecture = read("00_MASTER/SYSTEM_ARCHITECTURE.md");
const registry = read("00_MASTER/MODULE_REGISTRY.md");
const runtime = read("00_MASTER/RUNTIME_STATE.md");
const authority = read("00_MASTER/AUTHORITY_MATRIX.md");
const master = read("00_MASTER/MASTER_SPEC.md");
const starter = read("START_HERE.md");
const t109 = read("PRODUCTION/T109_PRODUCTION_GOAL.md");
const projectStatus = read("PROJECT_STATUS.md");

for (const required of [
  "00_MASTER/SYSTEM_ARCHITECTURE.md",
  "00_MASTER/MODULE_REGISTRY.md",
  "00_MASTER/RUNTIME_STATE.md",
  "00_MASTER/AUTHORITY_MATRIX.md",
  "00_MASTER/HISTORICAL_DATA_POLICY.md",
  "00_MASTER/MASTER_SPEC.md",
  "START_HERE.md",
]) {
  if (!fs.existsSync(path.join(ROOT, required))) fail(`Missing canonical file: ${required}`);
}
if (failures === 0) pass("All canonical architecture files exist");

for (const module of [
  "UNIVERSAL_WALLPAPER",
  "FESTIVAL_WALLPAPER",
  "LORA_PRODUCTION",
  "QA",
  "IMAGE_DELIVERY",
]) {
  if (!registry.includes(module)) fail(`Module missing from MODULE_REGISTRY: ${module}`);
}
if (failures === 0) pass("All registered platform modules are present");

for (const status of [
  "UNIVERSAL_WALLPAPER | ACTIVE",
  "FESTIVAL_WALLPAPER | ACTIVE",
  "LORA_PRODUCTION | PAUSED",
  "QA | PAUSED",
  "IMAGE_DELIVERY | PAUSED",
]) {
  if (!registry.includes(status)) fail(`Unexpected module status in registry: ${status}`);
}
if (failures === 0) pass("Module activation statuses match expected runtime architecture");

if (!runtime.includes("MODULE: FESTIVAL_WALLPAPER")) {
  fail("RUNTIME_STATE does not identify FESTIVAL_WALLPAPER as the active workflow");
} else {
  pass("RUNTIME_STATE identifies the current Festival Wallpaper workflow");
}

if (!runtime.includes("LORA_PRODUCTION: PAUSED")) {
  fail("RUNTIME_STATE does not keep LORA_PRODUCTION paused");
} else {
  pass("RUNTIME_STATE keeps LORA_PRODUCTION paused");
}

if (!t109.includes("Status: SUSPENDED") || !t109.includes("Parent module: LORA_PRODUCTION (PAUSED)")) {
  fail("T109 is not synchronized to the paused/suspended module model");
} else {
  pass("T109 is synchronized to LORA_PRODUCTION=PAUSED / Goal=SUSPENDED");
}

if (!projectStatus.includes("LEGACY POINTER — NOT A CURRENT RUNTIME AUTHORITY")) {
  fail("Root PROJECT_STATUS.md is not clearly marked as a legacy pointer");
} else {
  pass("Root PROJECT_STATUS.md is isolated as a legacy pointer");
}

if (!architecture.includes("AUTHORITY AND STATE MODEL") ||
    !architecture.includes("RUNTIME RECOVERY ENTRY POINT")) {
  fail("SYSTEM_ARCHITECTURE is missing the authority/recovery model");
} else {
  pass("SYSTEM_ARCHITECTURE contains the authority/recovery model");
}

if (!master.includes("USER INTENT") || !master.includes("SYSTEM CONSTRAINTS")) {
  fail("MASTER_SPEC is missing the Intent vs Constraints model");
} else {
  pass("MASTER_SPEC uses the Intent vs Constraints model");
}

if (!starter.includes("00_MASTER/RUNTIME_STATE.md") ||
    !starter.includes("00_MASTER/AUTHORITY_MATRIX.md")) {
  fail("START_HERE does not load canonical runtime/authority state");
} else {
  pass("START_HERE loads canonical runtime and authority state");
}

// Detect common stale platform-wide status claims in non-historical current-state files.
const stalePatterns = [
  { file: "PRODUCTION/T109_PRODUCTION_GOAL.md", pattern: "- Status: ACTIVE", reason: "T109 must be SUSPENDED" },
  { file: "PROJECT_STATUS.md", pattern: "Current active production Goal", reason: "root status must not claim a current active Goal" },
  { file: "00_MASTER/MODULE_REGISTRY.md", pattern: "only active production workflow", reason: "Festival Wallpaper is also an active module" },
];

for (const item of stalePatterns) {
  const content = read(item.file);
  if (content.includes(item.pattern)) {
    fail(`Stale status phrase in ${item.file}: "${item.pattern}" (${item.reason})`);
  } else {
    pass(`No known stale status phrase in ${item.file}`);
  }
}

if (failures > 0) {
  console.error(`\nArchitecture validation FAILED: ${failures} issue(s).`);
  process.exit(1);
}

console.log("\nArchitecture validation PASSED.");
