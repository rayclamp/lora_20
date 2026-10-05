#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime, sha256 } from "./runtime/worker_runtime.mjs";

function context() {
  return {
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
  };
}

function makeRuntime({ adapter, generator } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "phase30-runtime-"));
  const store = new JsonStateStore(path.join(dir, "task.json"));
  const runtime = new ProductionWorkerRuntime({
    store,
    workerId: "PHASE30-WORKER",
    generator: generator ?? {
      generate({ prompt, outputType }) {
        return {
          result: "SUCCESS",
          verification: "VERIFIED",
          output: { format: outputType, promptHash: sha256(prompt), bytes: "mock-image" }
        };
      }
    },
    outputAdapter: adapter,
    artifactPersistenceRequired: true,
    visualAdherenceRequired: false
  });
  runtime.request({
    traceRunId: "RV-PHASE30-TRACE",
    module: "UNIVERSAL_WALLPAPER",
    productionType: "ANIME",
    outputType: "DESKTOP_WALLPAPER",
    batchId: "RV-PHASE30-BATCH",
    taskId: "IMAGE-01",
    mode: "AUTOMATED",
    artifactPersistenceRequired: true
  });
  runtime.claim();
  runtime.designAndLockPrompt("LOCKED PROMPT", context());
  runtime.authorizeAutomatedGeneration();
  return { runtime, store };
}

{
  let received = null;
  const { runtime, store } = makeRuntime({
    adapter: {
      persist(input) {
        received = input;
        return {
          result: "SUCCESS",
          verification: "VERIFIED",
          artifact: {
            artifactId: "ARTIFACT-01",
            uri: "storage://RV-PHASE30-BATCH/IMAGE-01.png",
            sha256: sha256("mock-image")
          }
        };
      }
    }
  });
  const result = runtime.execute();
  assert.equal(result.result, "SUCCESS");
  assert.equal(result.taskStatus, "SUCCESS");
  assert.equal(result.artifact.artifactId, "ARTIFACT-01");
  assert.equal(result.artifact.batchId, "RV-PHASE30-BATCH");
  assert.equal(result.artifact.taskId, "IMAGE-01");
  assert.equal(result.artifact.generationAttempt, 1);
  assert.equal(result.artifact.generationIdempotencyKey, result.generationIdempotencyKey);
  assert.equal(result.artifact.promptHash, result.promptHash);
  assert.equal(result.artifact.executionContextHash, result.executionContextHash);
  assert.equal(received.batchId, result.batchId);
  assert.equal(received.taskId, result.taskId);
  assert.equal(received.generationAttempt, 1);
  assert.equal(received.generationIdempotencyKey, result.generationIdempotencyKey);
  assert.equal(store.read().artifact.uri, "storage://RV-PHASE30-BATCH/IMAGE-01.png");
  console.log("PASS SUCCESS requires verified artifact persistence");
  console.log("PASS artifact is bound to batch/task/attempt/idempotency/prompt/context");
}

{
  const { runtime, store } = makeRuntime({
    adapter: {
      persist() {
        throw new Error("STORAGE_TIMEOUT_AFTER_UPLOAD");
      }
    }
  });
  const result = runtime.execute();
  assert.equal(result.result, "UNKNOWN");
  assert.equal(result.taskStatus, "UNKNOWN / RECOVERY_REQUIRED");
  assert.equal(result.recovery, "RECOVERY_REQUIRED");
  assert.equal(result.ownership, "RELEASED");
  assert.equal(result.lastFailureReason, "OUTPUT_ARTIFACT_PERSISTENCE_UNCERTAIN");
  assert.equal(store.read().taskStatus, "UNKNOWN / RECOVERY_REQUIRED");
  console.log("PASS artifact persistence uncertainty becomes UNKNOWN/RECOVERY_REQUIRED");
}

{
  const { runtime } = makeRuntime({
    adapter: {
      persist() {
        return { result: "SUCCESS", verification: "VERIFIED", artifact: { artifactId: "A", uri: "storage://A" } };
      }
    }
  });
  const result = runtime.execute();
  assert.equal(result.result, "UNKNOWN");
  assert.equal(result.lastFailureReason, "OUTPUT_ARTIFACT_RECORD_INVALID");
  assert.equal(result.taskStatus, "UNKNOWN / RECOVERY_REQUIRED");
  console.log("PASS malformed artifact record cannot produce SUCCESS");
}

console.log("Runtime Verification Phase-30 artifact verifiability/persistence boundary: PASS");
