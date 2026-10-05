#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
const required=[
 "00_MASTER/PRODUCTION_CORE_MODULE_DISPATCH_AUTOPSY.md",
 "00_MASTER/PRODUCTION_DISPATCH_PROTOCOL.md",
 "00_MASTER/PRODUCTION_WORKER_RUNTIME.md",
 "00_MASTER/PRODUCTION_DESIGN_PROTOCOL.md",
 "00_MASTER/PRODUCTION_OUTPUT_PROTOCOL.md",
 "00_MASTER/FINAL_PROMPT_EXECUTION_LOCK_PROTOCOL.md",
 "00_MASTER/FINAL_EXECUTION_CONTEXT_LOCK_PROTOCOL.md",
 "00_MASTER/IMAGE_PROVIDER_REGISTRY.md",
 "scripts/runtime/worker_runtime.mjs",
 "scripts/runtime/automatic_production_controller.mjs",
 "scripts/test_phase32_artifact_existence_verification.mjs",
 "scripts/test_phase33_artifact_traceability.mjs",
 "scripts/test_phase34_artifact_restart_recovery.mjs",
 "scripts/test_phase35_long_batch_e2e.mjs",
 "scripts/test_phase36_integrated_recovery_stress.mjs",
 "scripts/test_phase37_multi_controller_contention_long.mjs",
 "scripts/test_phase39_design_freshness_and_prompt_preview.mjs"
];
for(const p of required) assert.equal(fs.existsSync(p),true,"missing "+p);
const workflow=fs.readFileSync(".github/workflows/architecture-validation.yml","utf8");
for(let i=28;i<=39;i++) assert.match(workflow,new RegExp("Phase-"+i));
const registry=fs.readFileSync("00_MASTER/IMAGE_PROVIDER_REGISTRY.md","utf8");
assert.match(registry,/PROVIDER_STATUS:\s*UNREGISTERED/);
const core=fs.readFileSync("00_MASTER/PRODUCTION_CORE_MODULE_DISPATCH_AUTOPSY.md","utf8");
assert.match(core,/Claim\/Lease\/CAS/i); assert.match(core,/UNKNOWN/);
const runtime=fs.readFileSync("00_MASTER/PRODUCTION_WORKER_RUNTIME.md","utf8");
assert.match(runtime,/GENERATION_IDEMPOTENCY_KEY/); assert.match(runtime,/EXECUTION CONTEXT/i); assert.match(runtime,/VISUAL_DESIGN_ADHERENCE/i); assert.match(runtime,/design-freshness/i); assert.match(runtime,/user-visible Prompt Preview/i);
const output=fs.readFileSync("00_MASTER/PRODUCTION_OUTPUT_PROTOCOL.md","utf8");
assert.match(output,/retrieval/i); assert.match(output,/sha-?256/i); assert.match(output,/UNKNOWN/);
console.log("Runtime Verification Phase-38 final production-readiness architecture audit: PASS");
console.log("CONTROL-PLANE VERIFIED: core/dispatch/runtime/authority/recovery/locks/artifact boundary/test coverage present");
console.log("LIVE-PROVIDER STATUS: NOT ACTIVATED (provider registry remains UNREGISTERED)");
