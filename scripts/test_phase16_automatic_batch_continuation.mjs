#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CanonicalContextResolver } from "./runtime/canonical_context_resolver.mjs";
import { JsonStateStore, ProductionWorkerRuntime } from "./runtime/worker_runtime.mjs";
import { DeterministicWallpaperDesigner, RecordingGenerationAdapter } from "./runtime/production_designer.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lora20-phase16-"));
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
  { taskId: "IMAGE-01", status: "SUCCESS" },
  { taskId: "IMAGE-02", status: "QUEUED" },
  { taskId: "IMAGE-03", status: "QUEUED" }
];

const store = new JsonStateStore(path.join(dir, "IMAGE-01.json"));
const generator = new RecordingGenerationAdapter();
const visualEvaluator = { evaluate() { return { result: "VISUAL_DESIGN_ADHERENCE_PASS" }; } };
const runtime = new ProductionWorkerRuntime({
  store, generator, visualEvaluator, designer, contextResolver: resolver, workerId: "PHASE16_WORKER"
});

runtime.request({
  traceRunId: "RV-PHASE16-IMAGE-01",
  module: "UNIVERSAL_WALLPAPER",
  productionType: "AUTOMATED",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "RV-PHASE16-BATCH",
  taskId: "IMAGE-01",
  mode: "AUTOMATED",
  targetCount: 3,
  completedCount: 0
});
runtime.claim();
runtime.designFromRequest("Create a varied travel wallpaper for Inaria.", { theme: "TRAVEL", sceneIntent });
runtime.authorizeAutomatedGeneration();
const result = runtime.execute();

assert.equal(result.taskStatus, "SUCCESS");
assert.equal(result.visualAdherenceRequired, true);

const firstNext = runtime.continueAfterSuccess({
  resolveNextTask: ({ batchId, completedTaskId }) => {
    assert.equal(batchId, "RV-PHASE16-BATCH");
    assert.equal(completedTaskId, "IMAGE-01");
    return authoritativeTasks.find(t => t.status === "QUEUED") ?? null;
  }
});

assert.equal(firstNext.action, "DISPATCH_NEXT_TASK");
assert.equal(firstNext.nextTaskId, "IMAGE-02");

// The continuation resolver must use authoritative task state, not conversation order.
authoritativeTasks[1].status = "SUCCESS";
authoritativeTasks[2].status = "QUEUED";

const secondNext = runtime.continueAfterSuccess({
  resolveNextTask: () => authoritativeTasks.find(t => t.status === "QUEUED") ?? null
});
assert.equal(secondNext.nextTaskId, "IMAGE-03");

// Once no authoritative incomplete task remains, continuation terminates cleanly.
authoritativeTasks[2].status = "SUCCESS";
const complete = runtime.continueAfterSuccess({
  resolveNextTask: () => authoritativeTasks.find(t => t.status === "QUEUED") ?? null
});
assert.equal(complete.action, "BATCH_COMPLETE");

assert.throws(
  () => runtime.continueAfterSuccess({ resolveNextTask: () => null }),
  /CONTINUATION_REQUIRES_SUCCESS/
);

console.log("Runtime Verification Phase-16 automatic authoritative batch continuation: PASS");
console.log("PASS SUCCESS resolves the next authoritative incomplete task");
console.log("PASS task order is determined by authoritative state, not conversation memory");
console.log("PASS completion is terminal when no authoritative incomplete task remains");
console.log("PASS continuation cannot run from a non-SUCCESS task");
