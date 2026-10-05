#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime } from "./runtime/worker_runtime.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "phase29-runtime-"));
const store = new JsonStateStore(path.join(dir, "task.json"));

const runtime = new ProductionWorkerRuntime({
  store,
  workerId: "PHASE29-WORKER",
  generator: {
    generate() {
      throw new Error("NETWORK_TIMEOUT_AFTER_PROVIDER_ACCEPTED");
    }
  }
});

runtime.request({
  traceRunId: "RV-PHASE29-TRACE",
  module: "UNIVERSAL_WALLPAPER",
  productionType: "ANIME",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "RV-PHASE29-BATCH",
  taskId: "IMAGE-01",
  mode: "AUTOMATED"
});
runtime.claim();
runtime.designAndLockPrompt("LOCKED PROMPT", {
  reference: { status: "NO_REFERENCE", provenance: "RULE_DEFAULT" },
  sceneIntent: {
    status: "EXPLICIT",
    fields: {
      ACTIVITY: "TRAVEL",
      LOCATION: "FOREST_PATH",
      ACTION: "WALKING",
      TIME: "AFTERNOON",
      WEATHER: "CLEAR",
      SOCIAL_CONTEXT: "ALONE",
      ENVIRONMENTAL_CUES: "WOODLAND_PATH"
    }
  }
});
runtime.authorizeAutomatedGeneration();

const result = runtime.execute();
assert.equal(result.result, "UNKNOWN");
assert.equal(result.taskStatus, "UNKNOWN / RECOVERY_REQUIRED");
assert.equal(result.recovery, "RECOVERY_REQUIRED");
assert.equal(result.ownership, "RELEASED");
assert.equal(result.claimId, "NONE");
assert.equal(result.leaseUntil, null);
assert.equal(result.lastFailureReason, "PROVIDER_TRANSPORT_UNCERTAIN");
assert.equal(result.providerError, "NETWORK_TIMEOUT_AFTER_PROVIDER_ACCEPTED");
assert.equal(result.attemptCount, 1);
assert.equal(result.generationIdempotencyKey.length, 64);

const persisted = store.read();
assert.equal(persisted.result, "UNKNOWN");
assert.equal(persisted.taskStatus, "UNKNOWN / RECOVERY_REQUIRED");

console.log("Runtime Verification Phase-29 provider transport uncertainty: PASS");
console.log("PASS provider transport exception becomes explicit UNKNOWN");
console.log("PASS ownership/lease are released and recovery is required");
console.log("PASS provider uncertainty is checkpointed instead of escaping as an unrecorded crash");
