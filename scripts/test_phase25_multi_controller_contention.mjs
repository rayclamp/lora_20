#!/usr/bin/env node

import assert from "node:assert/strict";
import { GitHubBatchRecordStore } from "./runtime/batch_record_store.mjs";
import { GitHubContentsStateStore, ProductionWorkerRuntime, MockGenerationAdapter } from "./runtime/worker_runtime.mjs";
import { DeterministicWallpaperDesigner } from "./runtime/production_designer.mjs";
import { AutomaticProductionController } from "./runtime/automatic_production_controller.mjs";

class FakeGitHubContentsClient {
  constructor() { this.files = new Map(); this.counter = 0; }
  getContents({ path }) {
    const item = this.files.get(path);
    if (!item) return null;
    return { content: Buffer.from(JSON.stringify(item.state), "utf8").toString("base64"), sha: item.sha };
  }
  updateContents({ path, sha, content }) {
    const current = this.files.get(path);
    if (sha === undefined && current) throw new Error("FILE_ALREADY_EXISTS");
    if (sha !== undefined && (!current || current.sha !== sha)) throw new Error("STALE_CONTENT_SHA");
    const next = { state: JSON.parse(Buffer.from(content, "base64").toString("utf8")), sha: "blob-" + (++this.counter) };
    this.files.set(path, next);
    return { content: { sha: next.sha } };
  }
}

const client = new FakeGitHubContentsClient();
const batchStore = new GitHubBatchRecordStore({
  client, owner: "rayclamp", repo: "lora_20",
  path: "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/RV-PHASE25.json",
  branch: "runtime-verification/phase-3-control-runtime"
});
const taskPath = "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/STATE/RV-PHASE25-IMAGE-01.json";
const initial = {
  batchId: "RV-PHASE25-BATCH", automationRunId: "RV-PHASE25-AUTO",
  module: "UNIVERSAL_WALLPAPER", productionType: "AUTOMATED", outputType: "DESKTOP_WALLPAPER",
  targetCount: 1, completedCount: 0, currentTaskId: "NONE", checkpointVersion: 0,
  sessionStatus: "ACTIVE", stopReason: "NONE", terminationStatus: "NON_TERMINAL",
  tasks: [{ taskId: "IMAGE-01", status: "QUEUED", recoveryStatus: "NONE", attemptCount: 0 }]
};
batchStore.create(initial);

const sceneIntent = { status: "EXPLICIT", fields: {
  ACTIVITY: "TRAVEL", LOCATION: "CITY_STREET", ACTION: "WALKING",
  TIME: "DAY", WEATHER: "CLEAR", SOCIAL_CONTEXT: "ALONE", ENVIRONMENTAL_CUES: "URBAN_SCENERY"
}};

let controllerB;
const generatorA = {
  calls: 0,
  generate(context) {
    this.calls++;
    const result = controllerB.start();
    assert.equal(result.action, "RECOVERY_REQUIRED");
    return { result: "SUCCESS", output: { path: "image-01.png" }, executionContext: context };
  }
};

function makeController(generator, workerId) {
  return new AutomaticProductionController({
    batchRecord: initial, batchStore,
    taskResolver: batch => batch.tasks.find(t => t.status === "QUEUED" || t.recoveryStatus === "RETRY_READY") ?? null,
    taskDesignContext: () => ({ theme: "TRAVEL", sceneIntent, aspectRatio: "16:9", modelId: "TEST-MODEL", modelVersion: "1" }),
    userRequest: "Create an automated travel wallpaper.",
    runtimeFactory: task => new ProductionWorkerRuntime({
      store: new GitHubContentsStateStore({ client, owner: "rayclamp", repo: "lora_20", path: taskPath, branch: "runtime-verification/phase-3-control-runtime" }),
      generator, designer: new DeterministicWallpaperDesigner(),
      visualEvaluator: { evaluate: () => ({ result: "VISUAL_DESIGN_ADHERENCE_PASS" }) },
      workerId, leaseDurationMs: 1000
    })
  });
}

const controllerA = makeController(generatorA, "PHASE25-A");
controllerB = makeController(new MockGenerationAdapter(["SUCCESS"]), "PHASE25-B");

assert.throws(() => controllerA.start(), /STALE_CONTENT_SHA|CLAIM_REJECTED/);
assert.equal(generatorA.calls, 1);
const final = batchStore.read().state;
assert.notEqual(final.tasks[0].status, "SUCCESS");
assert.equal(final.completedCount, 0);

console.log("Runtime Verification Phase-25 multi-controller contention boundary: PASS");
