#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, MockGenerationAdapter, ProductionWorkerRuntime } from "./runtime/worker_runtime.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lora20-runtime-"));
const store = new JsonStateStore(path.join(dir, "runtime-state.json"));


const VALID_CONTEXT = {
  reference: { status: "NO_REFERENCE", provenance: "TEST" },
  sceneIntent: { status: "EXPLICIT", provenance: "TEST", fields: {
    ACTIVITY: "TEST_ACTIVITY", LOCATION: "TEST_LOCATION", ACTION: "TEST_ACTION", TIME: "DAY",
    WEATHER: "CLEAR", SOCIAL_CONTEXT: "ALONE", ENVIRONMENTAL_CUES: "TEST_CUES"
  }}
};

const runtime = new ProductionWorkerRuntime({
  store,
  generator: new MockGenerationAdapter(["SUCCESS"]),
  workerId: "VERIFY_WORKER_A",
  clock: (() => { let n = 1000; return () => ++n; })(),
});

let s = runtime.request({
  traceRunId: "RV-LEVEL2-GOLDEN-001",
  automationRunId: "RV-AUTO-001",
  module: "UNIVERSAL_WALLPAPER",
  productionType: "ANIME",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "RV-BATCH-001",
  taskId: "IMAGE-01",
});
assert.equal(s.taskStatus, "QUEUED");

s = runtime.claim();
assert.equal(s.ownership, "CLAIMED");

s = runtime.designAndLockPrompt("SYSTEM-GENERATED VERIFIED PROMPT — DESKTOP WALLPAPER", VALID_CONTEXT);
assert.equal(s.promptPreview, "RECORDED");
assert.ok(s.promptHash);

s = runtime.execute();
assert.equal(s.taskStatus, "SUCCESS");
assert.equal(s.recovery, "TERMINAL_SUCCESS");
assert.equal(s.attemptCount, 1);
assert.equal(s.checkpointVersion, 1);

const persisted = store.read();
assert.equal(persisted.taskStatus, "SUCCESS");
assert.ok(persisted.events.some(e => e.type === "GENERATION_EXECUTION"));
assert.ok(persisted.events.some(e => e.type === "GENERATION_RESULT"));
assert.ok(persisted.events.some(e => e.type === "CHECKPOINT"));
assert.throws(() => runtime.claim(), /CLAIM_REJECTED/);

const blockedStore = new JsonStateStore(path.join(dir, "blocked.json"));
const blocked = new ProductionWorkerRuntime({ store: blockedStore, generator: new MockGenerationAdapter() });
assert.throws(() => blocked.request({
  module: "LORA_PRODUCTION",
  productionType: "LORA",
  outputType: "NONE",
  batchId: "BLOCKED",
  taskId: "IMAGE-01",
}), /AUTOMATION_SCOPE_BLOCKED/);

const failureStore = new JsonStateStore(path.join(dir, "failure.json"));
const failureRuntime = new ProductionWorkerRuntime({
  store: failureStore,
  generator: new MockGenerationAdapter(["FORMAT_MISMATCH", "FORMAT_MISMATCH", "FORMAT_MISMATCH", "SUCCESS"]),
  workerId: "VERIFY_WORKER_B",
});
failureRuntime.request({
  traceRunId: "RV-FAIL-001",
  module: "UNIVERSAL_WALLPAPER",
  productionType: "REALISTIC",
  outputType: "PHONE_WALLPAPER",
  batchId: "RV-BATCH-FAIL",
  taskId: "IMAGE-01",
});
failureRuntime.claim();
failureRuntime.designAndLockPrompt("SYSTEM-GENERATED PROMPT", VALID_CONTEXT);
let f = failureRuntime.execute();
assert.equal(f.attemptCount, 1);
assert.equal(f.recovery, "RETRY_READY");
failureRuntime.resumeAfterFailure();
failureRuntime.claim();
failureRuntime.designAndLockPrompt("SYSTEM-GENERATED PROMPT", VALID_CONTEXT);
f = failureRuntime.execute();
assert.equal(f.attemptCount, 2);
failureRuntime.resumeAfterFailure();
failureRuntime.claim();
failureRuntime.designAndLockPrompt("SYSTEM-GENERATED PROMPT", VALID_CONTEXT);
f = failureRuntime.execute();
assert.equal(f.attemptCount, 3);
assert.equal(f.recovery, "RECOVERY_REQUIRED");
assert.throws(() => failureRuntime.resumeAfterFailure(), /RETRY_NOT_READY/);
assert.throws(() => failureRuntime.execute(), /EXECUTION_OWNERSHIP_REQUIRED/);

console.log("Production Runtime Level-2 control-plane probe: PASS");
console.log("PASS persisted state");
console.log("PASS ordered execution trace");
console.log("PASS automation scope fence");
console.log("PASS bounded retry and recovery");
console.log("PASS terminal success fencing");
console.log("NOTE: generation adapter is deterministic mock; no real image provider is invoked.");
