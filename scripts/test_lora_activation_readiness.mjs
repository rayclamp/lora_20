#!/usr/bin/env node

import fs from "node:fs";

const registry = fs.readFileSync("00_MASTER/MODULE_REGISTRY.md", "utf8");
const runtime = fs.readFileSync("00_MASTER/RUNTIME_STATE.md", "utf8");
const moduleDoc = fs.readFileSync("MODULES/LORA_PRODUCTION/MODULE.md", "utf8");
const readiness = fs.readFileSync("00_MASTER/LORA_ACTIVATION_READINESS.md", "utf8");

function assert(condition, message) {
  if (!condition) {
    console.error("[FAIL] " + message);
    process.exit(1);
  }
  console.log("[PASS] " + message);
}

assert(/\| LORA_PRODUCTION \| PAUSED \|/.test(registry), "Registry keeps LoRA PAUSED");
assert(/\| LORA_PRODUCTION \| PAUSED \| NO \|/.test(runtime), "Runtime keeps LoRA execution blocked");
assert(moduleDoc.includes("not executable until explicitly activated"), "LoRA module has explicit activation guard");
assert(readiness.includes("HOLD — LoRA Production remains PAUSED"), "Readiness gate is HOLD");
assert(readiness.includes("Make Automated Dispatch"), "Make is an explicit activation gate");
assert(readiness.includes("GitHub image-artifact output"), "GitHub artifact output is an explicit activation gate");
assert(readiness.includes("approved age-20 reference"), "Age-20 reference registration is an explicit activation gate");
assert(readiness.includes("DO NOT ACTIVATE"), "Readiness gate contains a hard activation stop");
console.log("\nLoRA activation readiness self-test PASSED.");
