#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CanonicalContextResolver } from "./runtime/canonical_context_resolver.mjs";
import { JsonStateStore, ProductionWorkerRuntime } from "./runtime/worker_runtime.mjs";
import { DeterministicWallpaperDesigner, RecordingGenerationAdapter } from "./runtime/production_designer.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lora20-phase8-"));
const resolver = new CanonicalContextResolver({ root: process.cwd() });
const designer = new DeterministicWallpaperDesigner();
const sceneIntent = {
  status: "EXPLICIT",
  fields: {
    ACTIVITY: "TRAVEL", LOCATION: "CITY_STREET", ACTION: "WALKING",
    TIME: "DAY", WEATHER: "CLEAR", SOCIAL_CONTEXT: "ALONE", ENVIRONMENTAL_CUES: "URBAN_SCENERY"
  }
};

const tasks = ["IMAGE-01", "IMAGE-02", "IMAGE-03"];
const results = [];

for (const taskId of tasks) {
  const store = new JsonStateStore(path.join(dir, taskId + ".json"));
  const generator = new RecordingGenerationAdapter();
  const runtime = new ProductionWorkerRuntime({
    store, generator, designer, contextResolver: resolver, workerId: "PHASE8_WORKER"
  });
  runtime.request({
    traceRunId: "RV-PHASE8-" + taskId, module: "UNIVERSAL_WALLPAPER", productionType: "ANIME",
    outputType: "DESKTOP_WALLPAPER", batchId: "RV-PHASE8-BATCH", taskId, mode: "AUTOMATED"
  });
  runtime.claim();
  runtime.designFromRequest("Create a varied travel wallpaper for Inaria.", {
    theme: "TRAVEL", sceneIntent
  });
  runtime.authorizeAutomatedGeneration();
  const result = runtime.execute();
  results.push(result);
  assert.equal(result.taskStatus, "SUCCESS");
}

assert.equal(results.length, 3);
assert.deepEqual(results.map(r => r.taskId), tasks);
assert.ok(results.every(r => r.attemptCount === 1));
assert.ok(results.every(r => r.checkpointVersion === 1));

console.log("Runtime Verification Phase-8 batch continuation: PASS");
console.log("PASS multiple tasks use the same Worker Runtime path");
console.log("PASS each task independently reaches SUCCESS");
console.log("PASS one successful task does not corrupt the next task");
console.log("PASS task checkpoints are independently persisted");
console.log("NOTE: this validates bounded sequential batch execution, not large-scale throughput.");
