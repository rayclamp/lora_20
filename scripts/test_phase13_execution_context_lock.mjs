#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime, sha256 } from "./runtime/worker_runtime.mjs";

function context() {
  return {
    reference: {
      status: "EXPLICIT_TASK_REFERENCE",
      id: "INARIA-36-MASTER",
      provenance: "PHASE13_TEST",
      ids: ["INARIA-36-MASTER"]
    },
    sceneIntent: {
      status: "EXPLICIT",
      fields: {
        ACTIVITY: "WALK",
        LOCATION: "PARK",
        ACTION: "WALKING",
        TIME: "DAY",
        WEATHER: "CLEAR",
        SOCIAL_CONTEXT: "ALONE",
        ENVIRONMENTAL_CUES: "TREES"
      }
    },
    modelId: "TEST_MODEL",
    modelVersion: "1",
    aspectRatio: "16:9",
    generationParameters: { steps: 20 },
    providerParameters: { cfg: 6 }
  };
}

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "phase13-runtime-"));
const store = new JsonStateStore(path.join(dir, "task.json"));
let received = null;

const runtime = new ProductionWorkerRuntime({
  store,
  workerId: "PHASE13_WORKER",
  liveExecution: false,
  generator: {
    generate(payload) {
      received = payload;
      return {
        result: "SUCCESS",
        verification: "VERIFIED",
        executionContextVerification: "VERIFIED",
        output: {
          format: payload.outputType,
          promptHash: sha256(payload.prompt)
        }
      };
    }
  }
});

runtime.request({
  module: "UNIVERSAL_WALLPAPER",
  productionType: "AUTOMATED",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "PHASE13-BATCH",
  taskId: "PHASE13-TASK",
  mode: "AUTOMATED"
});
runtime.claim();

const prompt = "LOCKED PROMPT";
runtime.designAndLockPrompt(prompt, context());
runtime.authorizeAutomatedGeneration();

let state = store.read();
assert.equal(state.executionContext.OUTPUT_TYPE, "DESKTOP_WALLPAPER");
assert.equal(state.executionContext.ASPECT_RATIO, "16:9");
assert.equal(state.executionContext.MODEL_ID, "TEST_MODEL");
assert.equal(state.executionContextHash, sha256(JSON.stringify(state.executionContext)));

const result = runtime.execute();
assert.equal(result.result, "SUCCESS");
assert.equal(result.executionContextVerification, "VERIFIED");
assert.deepEqual(received.executionContext, result.executionContext);
assert.equal(received.executionContextHash, result.executionContextHash);

const tamperStore = new JsonStateStore(path.join(dir, "tampered.json"));
const tampered = new ProductionWorkerRuntime({
  store: tamperStore,
  workerId: "PHASE13_TAMPER",
  generator: { generate() { throw new Error("GENERATION_MUST_NOT_RUN"); } }
});
tampered.request({
  module: "UNIVERSAL_WALLPAPER",
  productionType: "AUTOMATED",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "PHASE13-TAMPER-BATCH",
  taskId: "PHASE13-TAMPER-TASK",
  mode: "AUTOMATED"
});
tampered.claim();
tampered.designAndLockPrompt(prompt, context());
tampered.authorizeAutomatedGeneration();
const tamperedState = tamperStore.read();
tamperedState.executionContext.ASPECT_RATIO = "4:3";
tamperStore.write(tamperedState);
assert.throws(() => tampered.execute(), /EXECUTION_CONTEXT_LOCK_INVALID/);

console.log("Runtime Verification Phase-13 execution context lock: PASS");
console.log("PASS locked model/reference/output/aspect-ratio context");
console.log("PASS execution-context hash propagation");
console.log("PASS runtime blocks post-lock context tampering");
console.log("PASS provider boundary receives the exact locked execution context");
