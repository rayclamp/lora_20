#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime, sha256 } from "./runtime/worker_runtime.mjs";

function makeRuntime(name, visualResult) {
  const store = new JsonStateStore(path.join(fs.mkdtempSync(path.join(os.tmpdir(), "phase14-")), name + ".json"));
  const runtime = new ProductionWorkerRuntime({
    store,
    workerId: "PHASE14_WORKER",
    generator: {
      generate(payload) {
        return {
          result: "SUCCESS",
          verification: "VERIFIED",
          output: { format: payload.outputType, promptHash: sha256(payload.prompt), artifactId: "ARTIFACT-001" }
        };
      }
    },
    visualEvaluator: {
      evaluate() {
        return { result: visualResult };
      }
    }
  });
  runtime.request({
    module: "UNIVERSAL_WALLPAPER",
    productionType: "AUTOMATED",
    outputType: "DESKTOP_WALLPAPER",
    batchId: "PHASE14-BATCH",
    taskId: name,
    mode: "AUTOMATED",
    visualAdherenceRequired: true
  });
  runtime.claim();
  runtime.designAndLockPrompt("LOCKED PROMPT", {
    reference: { status: "NO_REFERENCE", provenance: "PHASE14_TEST" },
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
    design: {
      OUTFIT: "LIGHT SUMMER DRESS",
      ACTION: "WALKING",
      POSE: "ONE FOOT FORWARD",
      SCENE: "PARK"
    }
  });
  runtime.authorizeAutomatedGeneration();
  return { runtime, store };
}

{
  const { runtime, store } = makeRuntime("pass", "VISUAL_DESIGN_ADHERENCE_PASS");
  const result = runtime.execute();
  assert.equal(result.result, "SUCCESS");
  assert.equal(result.taskStatus, "SUCCESS");
  assert.equal(result.visualAdherenceResult, "VISUAL_DESIGN_ADHERENCE_PASS");
}

{
  const { runtime, store } = makeRuntime("noncompliance", "VISUAL_DESIGN_NONCOMPLIANCE");
  const result = runtime.execute();
  assert.equal(result.result, "FAILED");
  assert.equal(result.taskStatus, "FAILED");
  assert.equal(result.visualAdherenceResult, "VISUAL_DESIGN_NONCOMPLIANCE");
  assert.equal(result.recovery, "RETRY_READY");
}

{
  const { runtime } = makeRuntime("unknown", "VISUAL_DESIGN_UNKNOWN");
  const result = runtime.execute();
  assert.equal(result.result, "UNKNOWN");
  assert.equal(result.taskStatus, "UNKNOWN / RECOVERY_REQUIRED");
  assert.equal(result.recovery, "RECOVERY_REQUIRED");
}

console.log("Runtime Verification Phase-14 visual design adherence gate: PASS");
console.log("PASS visual adherence PASS is required for TASK_SUCCESS");
console.log("PASS visual noncompliance becomes bounded FAILED recovery");
console.log("PASS visual unknown becomes recovery-required");
