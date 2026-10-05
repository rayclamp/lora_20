#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime, sha256 } from "./runtime/worker_runtime.mjs";
import { AutomaticProductionController } from "./runtime/automatic_production_controller.mjs";
import { DeterministicWallpaperDesigner } from "./runtime/production_designer.mjs";

class MemoryBatchStore {
  constructor(state) { this.state = JSON.parse(JSON.stringify(state)); this.sha = "batch-1"; }
  read() { return { state: JSON.parse(JSON.stringify(this.state)), sha: this.sha }; }
  compareAndSwap(expectedSha, state) {
    if (expectedSha !== this.sha) throw new Error("STALE_BATCH_SHA");
    this.state = JSON.parse(JSON.stringify(state));
    this.sha = "batch-" + Date.now();
    return this.read();
  }
}

function makeController({ outputAdapter }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "phase31-controller-"));
  const task = { taskId: "IMAGE-01", status: "QUEUED" };
  const batch = {
    batchId: "RV-PHASE31-BATCH",
    automationRunId: "RV-PHASE31-AUTO",
    module: "UNIVERSAL_WALLPAPER",
    productionType: "AUTOMATED",
    outputType: "DESKTOP_WALLPAPER",
    targetCount: 1,
    completedCount: 0,
    artifactPersistenceRequired: true,
    currentTaskId: "NONE",
    checkpointVersion: 0,
    sessionStatus: "ACTIVE"
  };
  const batchStore = new MemoryBatchStore(batch);
  const runtime = new ProductionWorkerRuntime({
    store: new JsonStateStore(path.join(dir, "IMAGE-01.json")),
    workerId: "PHASE31-WORKER",
    designer: new DeterministicWallpaperDesigner(),
    visualEvaluator: { evaluate: () => ({ result: "VISUAL_DESIGN_ADHERENCE_PASS" }) },
    visualAdherenceRequired: false,
    outputAdapter,
    generator: {
      generate({ prompt, outputType }) {
        return { result: "SUCCESS", verification: "VERIFIED", output: { format: outputType, promptHash: sha256(prompt) } };
      }
    }
  });
  const controller = new AutomaticProductionController({
    batchRecord: batch,
    batchStore,
    taskResolver: () => task.status === "QUEUED" ? task : null,
    taskDesignContext: () => ({
      theme: "TRAVEL",
      sceneIntent: {
        status: "EXPLICIT",
        fields: {
          ACTIVITY: "TRAVEL", LOCATION: "CITY_STREET", ACTION: "WALKING",
          TIME: "DAY", WEATHER: "CLEAR", SOCIAL_CONTEXT: "ALONE", ENVIRONMENTAL_CUES: "URBAN_SCENERY"
        }
      }
    }),
    userRequest: "Create an automated travel wallpaper.",
    runtimeFactory: () => runtime
  });
  return { controller, runtime, task };
}

{
  const { controller, runtime, task } = makeController({
    outputAdapter: {
      persist() {
        return {
          result: "SUCCESS",
          verification: "VERIFIED",
          artifact: { artifactId: "A31", uri: "storage://A31", sha256: "artifact-hash", retrievalVerification: "VERIFIED" }
        };
      }
    }
  });
  const result = controller.start();
  assert.equal(result.action, "BATCH_COMPLETE");
  assert.equal(task.status, "SUCCESS");
  assert.equal(runtime.requireState().artifactPersistenceRequired, true);
  assert.equal(runtime.requireState().artifact.artifactId, "A31");
  console.log("PASS controller propagates batch artifact persistence requirement to Worker Runtime");
}

{
  const { controller, task } = makeController({ outputAdapter: null });
  const result = controller.start();
  assert.equal(result.action, "RECOVERY_REQUIRED");
  assert.equal(task.status, "QUEUED");
  assert.equal(controller.batchRecord.sessionStatus, "STOPPED");
  console.log("PASS required artifact persistence without an adapter stops safely");
}

console.log("Runtime Verification Phase-31 controller artifact persistence binding: PASS");
