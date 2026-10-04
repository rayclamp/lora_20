#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CanonicalContextResolver } from "./runtime/canonical_context_resolver.mjs";
import { ProductionWorkerRuntime } from "./runtime/worker_runtime.mjs";
import { DeterministicWallpaperDesigner, RecordingGenerationAdapter } from "./runtime/production_designer.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lora20-phase7-"));
const designer = new DeterministicWallpaperDesigner();
const resolver = new CanonicalContextResolver({ root: process.cwd() });

const sceneIntent = {
  status: "EXPLICIT",
  fields: {
    ACTIVITY: "BEACH_TRAVEL", LOCATION: "SEASIDE", ACTION: "WALKING_BY_THE_WATER",
    TIME: "AFTERNOON", WEATHER: "SUNNY", SOCIAL_CONTEXT: "ALONE",
    ENVIRONMENTAL_CUES: "BLUE_SKY_SAND_AND_GENTLE_WAVES"
  }
};

const manualStore = new (await import("./runtime/worker_runtime.mjs")).JsonStateStore(path.join(dir, "manual.json"));
const manualGenerator = new RecordingGenerationAdapter();
const manual = new ProductionWorkerRuntime({
  store: manualStore, generator: manualGenerator, designer, contextResolver: resolver,
  workerId: "PHASE7_MANUAL"
});
manual.request({
  traceRunId: "RV-PHASE7-MANUAL", module: "UNIVERSAL_WALLPAPER", productionType: "ANIME",
  outputType: "DESKTOP_WALLPAPER", batchId: "RV-PHASE7-MANUAL-BATCH", taskId: "IMAGE-01", mode: "MANUAL"
});
manual.claim();
const manualDesigned = manual.designFromRequest("Create a summer seaside wallpaper for Inaria.", {
  theme: "SUMMER_TRAVEL", sceneIntent
});
assert.ok(manualDesigned.lockedPrompt);
assert.ok(manualDesigned.design);
assert.equal(manualDesigned.generationAuthorization, "WAITING_USER_CONFIRMATION");
assert.throws(() => manual.execute(), /GENERATION_AUTHORIZATION_REQUIRED/);
manual.confirmManualGeneration();
const manualResult = manual.execute();
assert.equal(manualResult.taskStatus, "SUCCESS");
assert.equal(manualGenerator.calls.length, 1);
assert.equal(manualGenerator.calls[0].prompt, manualResult.lockedPrompt);

const autoStore = new (await import("./runtime/worker_runtime.mjs")).JsonStateStore(path.join(dir, "auto.json"));
const autoGenerator = new RecordingGenerationAdapter();
const auto = new ProductionWorkerRuntime({
  store: autoStore, generator: autoGenerator, designer, contextResolver: resolver,
  workerId: "PHASE7_AUTO"
});
auto.request({
  traceRunId: "RV-PHASE7-AUTO", module: "UNIVERSAL_WALLPAPER", productionType: "REALISTIC",
  outputType: "PHONE_WALLPAPER", batchId: "RV-PHASE7-AUTO-BATCH", taskId: "IMAGE-01", mode: "AUTOMATED"
});
auto.claim();
const autoDesigned = auto.designFromRequest("Create a realistic summer seaside wallpaper for Inaria.", {
  theme: "SUMMER_TRAVEL", sceneIntent
});
assert.ok(autoDesigned.lockedPrompt);
assert.ok(autoDesigned.design);
auto.authorizeAutomatedGeneration();
const autoResult = auto.execute();
assert.equal(autoResult.taskStatus, "SUCCESS");
assert.equal(autoGenerator.calls.length, 1);
assert.equal(autoGenerator.calls[0].prompt, autoResult.lockedPrompt);

const trace = autoStore.read().events.map(e => e.type);
for (const required of [
  "CONTEXT_LOADED", "MODULE_RESOLVED", "TASK_CLAIMED", "REFERENCE_POLICY_LOADED",
  "REFERENCE_AUTHORITY_RESOLVED", "SCENE_INTENT_RESOLVED", "PRESENTATION_DESIGNED",
  "DESIGN_VALIDATED", "PROMPT_ASSEMBLED", "PROMPT_PREVIEW_RECORDED",
  "GENERATION_EXECUTION", "GENERATION_RESULT", "CHECKPOINT"
]) assert.ok(trace.includes(required), required);

console.log("Runtime Verification Phase-7 single-worker E2E: PASS");
console.log("PASS system-owned design from user request");
console.log("PASS system-owned executable prompt construction");
console.log("PASS manual preview + explicit confirmation gate");
console.log("PASS automated execution authorization");
console.log("PASS generation adapter receives the exact locked prompt");
console.log("PASS persisted end-to-end trace");
console.log("NOTE: generation adapter is a deterministic test adapter; no live provider is invoked.");
