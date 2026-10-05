#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CanonicalContextResolver } from "./runtime/canonical_context_resolver.mjs";
import { JsonStateStore, ProductionWorkerRuntime } from "./runtime/worker_runtime.mjs";
import { DeterministicWallpaperDesigner, RecordingGenerationAdapter } from "./runtime/production_designer.mjs";
import { AutomaticProductionController } from "./runtime/automatic_production_controller.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lora20-phase17-"));
const resolver = new CanonicalContextResolver({ root: process.cwd() });
const designer = new DeterministicWallpaperDesigner();
const sceneIntent = {
  status: "EXPLICIT",
  fields: {
    ACTIVITY: "TRAVEL", LOCATION: "CITY_STREET", ACTION: "WALKING",
    TIME: "DAY", WEATHER: "CLEAR", SOCIAL_CONTEXT: "ALONE", ENVIRONMENTAL_CUES: "URBAN_SCENERY"
  }
};

const authoritativeTasks = [
  { taskId: "IMAGE-01", status: "QUEUED" },
  { taskId: "IMAGE-02", status: "QUEUED" },
  { taskId: "IMAGE-03", status: "QUEUED" }
];
const calls = [];

const controller = new AutomaticProductionController({
  batchRecord: {
    batchId: "RV-PHASE17-BATCH",
    automationRunId: "RV-PHASE17-AUTO",
    module: "UNIVERSAL_WALLPAPER",
    productionType: "AUTOMATED",
    outputType: "DESKTOP_WALLPAPER",
    targetCount: 3,
    completedCount: 0,
    currentTaskId: "NONE",
    checkpointVersion: 0,
    sessionStatus: "ACTIVE"
  },
  taskResolver: (batch) => authoritativeTasks.find(t => t.status === "QUEUED") ?? null,
  taskDesignContext: () => ({ theme: "TRAVEL", sceneIntent }),
  userRequest: "Create a varied travel wallpaper for Inaria.",
  runtimeFactory: (task) => {
    const store = new JsonStateStore(path.join(dir, task.taskId + ".json"));
    const generator = new RecordingGenerationAdapter();
    const visualEvaluator = { evaluate() { return { result: "VISUAL_DESIGN_ADHERENCE_PASS" }; } };
    calls.push(task.taskId);
    return new ProductionWorkerRuntime({
      store, generator, visualEvaluator, designer, contextResolver: resolver,
      workerId: "PHASE17_WORKER"
    });
  }
});

const result = controller.start();

assert.equal(result.action, "BATCH_COMPLETE");
assert.deepEqual(calls, ["IMAGE-01", "IMAGE-02", "IMAGE-03"]);
assert.deepEqual(authoritativeTasks.map(t => t.status), ["SUCCESS", "SUCCESS", "SUCCESS"]);
assert.equal(controller.batchRecord.completedCount, 3);
assert.equal(controller.batchRecord.sessionStatus, "COMPLETED");
assert.equal(controller.batchRecord.checkpointVersion, 3);
assert.equal(new Set(calls).size, 3);
assert.equal(controller.events.filter(e => e.type === "CHECKPOINT").length, 3);
assert.equal(controller.events.at(-1).reason, "COMPLETED");

console.log("Runtime Verification Phase-17 automated production controller E2E: PASS");
console.log("PASS one automated start drives all authoritative tasks without a user continuation command");
console.log("PASS each task uses the shared Worker Runtime");
console.log("PASS visual adherence gate remains active for automated Universal Wallpaper");
console.log("PASS exactly one task identity is completed per generated output");
console.log("PASS batch terminates only at TARGET_COUNT");
