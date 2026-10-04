#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CanonicalContextResolver } from "./runtime/canonical_context_resolver.mjs";
import { JsonStateStore, MockGenerationAdapter, ProductionWorkerRuntime } from "./runtime/worker_runtime.mjs";

const root = process.cwd();
const resolver = new CanonicalContextResolver({ root });
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lora20-phase6-"));
const store = new JsonStateStore(path.join(dir, "state.json"));
const runtime = new ProductionWorkerRuntime({
  store,
  generator: new MockGenerationAdapter(["SUCCESS"]),
  workerId: "PHASE6_WORKER",
  contextResolver: resolver
});

runtime.request({
  traceRunId: "RV-PHASE6-001",
  module: "UNIVERSAL_WALLPAPER",
  productionType: "REALISTIC",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "RV-PHASE6-BATCH",
  taskId: "IMAGE-01"
});
runtime.claim();

const sceneIntent = {
  status: "EXPLICIT",
  fields: {
    ACTIVITY: "WALKING",
    LOCATION: "RIVERSIDE_PATH",
    ACTION: "STROLLING",
    TIME: "MORNING",
    WEATHER: "SUNNY",
    SOCIAL_CONTEXT: "ALONE",
    ENVIRONMENTAL_CUES: "SUMMER_GREENERY_AND_OPEN_SKY"
  }
};
const designed = runtime.designAndLockPrompt("PHASE6 SYSTEM PROMPT", {
  reference: { id: "explicit-reference-001", provenance: "USER_INPUT" },
  theme: "EVERYDAY_LIFE",
  sceneIntent
});
assert.equal(designed.promptPreview, "RECORDED");

const persisted = store.read();
const refEvent = persisted.events.find((e) => e.type === "REFERENCE_AUTHORITY_RESOLVED");
const sceneEvent = persisted.events.find((e) => e.type === "SCENE_INTENT_RESOLVED");
assert.equal(refEvent.status, "EXPLICIT_TASK_REFERENCE");
assert.equal(refEvent.policyPath, "MODULES/UNIVERSAL_WALLPAPER/REFERENCE_POLICY.md");
assert.equal(sceneEvent.protocolPath, "00_MASTER/WALLPAPER/SCENE_INTENT_RESOLUTION_PROTOCOL.md");
assert.equal(sceneEvent.fieldProvenance.ACTION, "USER_OR_AUTOMATION_INPUT");

runtime.execute();
assert.equal(store.read().taskStatus, "SUCCESS");

const blockedDir = fs.mkdtempSync(path.join(os.tmpdir(), "lora20-phase6-blocked-"));
const blockedStore = new JsonStateStore(path.join(blockedDir, "state.json"));
const blockedRuntime = new ProductionWorkerRuntime({
  store: blockedStore,
  generator: new MockGenerationAdapter(["SUCCESS"]),
  workerId: "PHASE6_BLOCKED",
  contextResolver: resolver
});
blockedRuntime.request({
  module: "UNIVERSAL_WALLPAPER",
  productionType: "ANIME",
  outputType: "PHONE_WALLPAPER",
  batchId: "RV-PHASE6-BLOCKED",
  taskId: "IMAGE-01"
});
blockedRuntime.claim();
assert.throws(
  () => blockedRuntime.designAndLockPrompt("BLOCKED", {
    reference: { status: "REFERENCE_BLOCKED", provenance: "TEST" },
    theme: "EVERYDAY_LIFE",
    sceneIntent
  }),
  /REFERENCE_BLOCKED/
);
assert.equal(blockedStore.read().taskStatus, "CLAIMED");

const missingDir = fs.mkdtempSync(path.join(os.tmpdir(), "lora20-phase6-missing-"));
const missingStore = new JsonStateStore(path.join(missingDir, "state.json"));
const missingRuntime = new ProductionWorkerRuntime({
  store: missingStore,
  generator: new MockGenerationAdapter(["SUCCESS"]),
  workerId: "PHASE6_MISSING",
  contextResolver: resolver
});
missingRuntime.request({
  module: "FESTIVAL_WALLPAPER",
  productionType: "ANIME",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "RV-PHASE6-MISSING",
  taskId: "IMAGE-01"
});
missingRuntime.claim();
assert.throws(
  () => missingRuntime.designAndLockPrompt("BLOCKED", {
    theme: "UNRESOLVED_THEME",
    sceneIntent: { fields: {} }
  }),
  /SCENE_INTENT_BLOCKED/
);
assert.equal(missingStore.read().taskStatus, "CLAIMED");

console.log("Canonical Context Resolver Phase-6 probe: PASS");
console.log("PASS canonical registry routing");
console.log("PASS module-owned reference policy resolution");
console.log("PASS scene-intent canonical protocol enforcement");
console.log("PASS provenance trace persistence");
console.log("PASS reference and scene blocking");
