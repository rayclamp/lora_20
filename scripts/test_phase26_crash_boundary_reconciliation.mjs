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
const branch = "runtime-verification/phase-3-control-runtime";
const batchPath = "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/RV-PHASE26.json";
const taskPath = "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/STATE/RV-PHASE26-IMAGE-01.json";
const batchStore = new GitHubBatchRecordStore({ client, owner: "rayclamp", repo: "lora_20", path: batchPath, branch });

const batch = {
  batchId: "RV-PHASE26-BATCH", automationRunId: "RV-PHASE26-AUTO",
  module: "UNIVERSAL_WALLPAPER", productionType: "AUTOMATED", outputType: "DESKTOP_WALLPAPER",
  targetCount: 1, completedCount: 0, currentTaskId: "NONE", checkpointVersion: 0,
  sessionStatus: "ACTIVE", stopReason: "NONE", terminationStatus: "NON_TERMINAL",
  tasks: [{ taskId: "IMAGE-01", status: "QUEUED", recoveryStatus: "NONE", attemptCount: 0 }]
};
batchStore.create(batch);

const sceneIntent = { status: "EXPLICIT", fields: {
  ACTIVITY: "TRAVEL", LOCATION: "CITY_STREET", ACTION: "WALKING",
  TIME: "DAY", WEATHER: "CLEAR", SOCIAL_CONTEXT: "ALONE", ENVIRONMENTAL_CUES: "URBAN_SCENERY"
}};

const makeRuntime = (generator, workerId) => new ProductionWorkerRuntime({
  store: new GitHubContentsStateStore({ client, owner: "rayclamp", repo: "lora_20", path: taskPath, branch }),
  generator, designer: new DeterministicWallpaperDesigner(),
  visualEvaluator: { evaluate: () => ({ result: "VISUAL_DESIGN_ADHERENCE_PASS" }) },
  workerId, leaseDurationMs: 1000
});

// Simulate a controller crash after task execution checkpoint but before Batch Record checkpoint.
const crashedRuntime = makeRuntime(new MockGenerationAdapter(["SUCCESS"]), "PHASE26-CRASHED");
crashedRuntime.request({
  traceRunId: "RV-PHASE26-TRACE", automationRunId: batch.automationRunId,
  module: batch.module, productionType: batch.productionType, outputType: batch.outputType,
  batchId: batch.batchId, taskId: "IMAGE-01", targetCount: 1, completedCount: 0, mode: "AUTOMATED"
});
crashedRuntime.claim();
crashedRuntime.designFromRequest("Create an automated travel wallpaper.", { theme: "TRAVEL", sceneIntent, aspectRatio: "16:9", modelId: "TEST-MODEL", modelVersion: "1" });
crashedRuntime.authorizeAutomatedGeneration();
const taskResult = crashedRuntime.execute();
assert.equal(taskResult.taskStatus, "SUCCESS");
assert.equal(batchStore.read().state.completedCount, 0);
assert.equal(batchStore.read().state.tasks[0].status, "QUEUED");

// A fresh controller must reconcile the already-successful authoritative task state.
// It must not generate a second image or create a second task identity.
const controller = new AutomaticProductionController({
  batchRecord: batch, batchStore,
  taskResolver: b => b.tasks.find(t => t.status === "QUEUED" || t.recoveryStatus === "RETRY_READY") ?? null,
  taskDesignContext: () => ({ theme: "TRAVEL", sceneIntent, aspectRatio: "16:9", modelId: "TEST-MODEL", modelVersion: "1" }),
  userRequest: "Create an automated travel wallpaper.",
  runtimeFactory: () => makeRuntime(new MockGenerationAdapter(["FAILED"]), "PHASE26-RESTARTED")
});

const result = controller.start();
assert.equal(result.action, "BATCH_COMPLETE");
const final = batchStore.read().state;
assert.equal(final.completedCount, 1);
assert.equal(final.tasks[0].status, "SUCCESS");
assert.equal(final.sessionStatus, "COMPLETED");

console.log("Runtime Verification Phase-26 crash-boundary task reconciliation: PASS");
console.log("PASS persisted task SUCCESS is reconciled after controller restart");
console.log("PASS stale Batch Record does not cause duplicate generation");
console.log("PASS completedCount advances exactly once");
