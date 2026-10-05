#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime, sha256 } from "./runtime/worker_runtime.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "phase12-runtime-"));
const store = new JsonStateStore(path.join(dir, "task.json"));
let received = null;

const registration = {
  PROVIDER_ID: "TEST_PROVIDER",
  PROVIDER_NAME: "Deterministic Test Provider",
  ADAPTER_MODULE: "scripts/runtime/image_provider_adapter.mjs",
  STATUS: "VERIFIED",
  TRANSPORT_TYPE: "TEST_DOUBLE",
  AUTHORITY_SOURCE: "PHASE12_TEST",
  CREDENTIAL_SOURCE: "NOT_REQUIRED",
  SUPPORTED_OUTPUT_TYPES: ["DESKTOP_WALLPAPER"],
  RESULT_VERIFICATION_POLICY: "TEST_VERIFIED",
  IDEMPOTENCY_SUPPORT: "REQUIRED_KEY",
  REGISTRATION_VERSION: "1"
};

const visualEvaluator = { evaluate() { return { result: "VISUAL_DESIGN_ADHERENCE_PASS" }; } };

const runtime = new ProductionWorkerRuntime({
  store,
  workerId: "PHASE12_WORKER",
  liveExecution: true,
  visualEvaluator,
  providerRegistration: registration,
  generator: {
    generate(payload) {
      received = payload;
      return {
        result: "SUCCESS",
        verification: "VERIFIED",
        output: { format: payload.outputType, promptHash: sha256(payload.prompt) }
      };
    }
  }
});

runtime.request({
  module: "UNIVERSAL_WALLPAPER",
  productionType: "MANUAL",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "PHASE12-BATCH",
  taskId: "PHASE12-TASK",
  traceRunId: "PHASE12-TRACE",
  mode: "AUTOMATED"
});
runtime.claim();

const prompt = "SYSTEM-GENERATED EXECUTABLE IMAGE PROMPT";
runtime.designAndLockPrompt(prompt, {
  reference: { status: "NO_REFERENCE" },
  sceneIntent: {
    status: "EXPLICIT",
    provenance: "PHASE12_TEST",
    fields: {
      ACTIVITY: "WALK",
      LOCATION: "PARK",
      ACTION: "WALKING",
      TIME: "DAY",
      WEATHER: "CLEAR",
      SOCIAL_CONTEXT: "ALONE",
      ENVIRONMENTAL_CUES: "TREES"
    }
  }
});
runtime.authorizeAutomatedGeneration();
const result = runtime.execute();

assert.equal(result.result, "SUCCESS");
assert.equal(received.prompt, prompt);
assert.equal(received.outputType, "DESKTOP_WALLPAPER");
assert.equal(received.taskId, "PHASE12-TASK");
assert.equal(received.traceRunId, "PHASE12-TRACE");
assert.equal(typeof received.generationIdempotencyKey, "string");
assert.equal(received.generationAttempt, 1);

const blocked = new ProductionWorkerRuntime({
  store: new JsonStateStore(path.join(dir, "blocked.json")),
  workerId: "PHASE12_BLOCKED",
  liveExecution: true,
  providerRegistration: { ...registration, STATUS: "AUTHORIZED" },
  generator: { generate() { throw new Error("PROVIDER_MUST_NOT_RUN"); } }
});
blocked.request({
  module: "UNIVERSAL_WALLPAPER",
  productionType: "MANUAL",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "PHASE12-BLOCKED",
  taskId: "PHASE12-BLOCKED-TASK",
  mode: "AUTOMATED"
});
blocked.claim();
blocked.designAndLockPrompt(prompt, {
  reference: { status: "NO_REFERENCE" },
  sceneIntent: { status: "EXPLICIT", fields: {
    ACTIVITY: "WALK", LOCATION: "PARK", ACTION: "WALKING", TIME: "DAY",
    WEATHER: "CLEAR", SOCIAL_CONTEXT: "ALONE", ENVIRONMENTAL_CUES: "TREES"
  }}
});
blocked.authorizeAutomatedGeneration();
assert.throws(() => blocked.execute(), /PROVIDER_NOT_PRODUCTION_ELIGIBLE/);

console.log("Runtime Verification Phase-12 provider activation integration: PASS");
console.log("PASS VERIFIED provider gate before live execution");
console.log("PASS taskId/traceRunId propagation to provider boundary");
console.log("PASS non-VERIFIED provider is fail-closed before transport invocation");
