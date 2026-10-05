#!/usr/bin/env node

import assert from "node:assert/strict";
import { GitHubBatchRecordStore } from "./batch_record_store.mjs";
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
    this.counter++;
    const next = { state: JSON.parse(Buffer.from(content, "base64").toString("utf8")), sha: "blob-" + this.counter };
    this.files.set(path, next);
    return { content: { sha: next.sha } };
  }
}

const client = new FakeGitHubContentsClient();
const batchPath = "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/RV-PHASE24.json";
const taskPath = "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/STATE/RV-PHASE24-IMAGE-01.json";
const batchStore = new GitHubBatchRecordStore({ client, owner: "rayclamp", repo: "lora_20", path: batchPath, branch: "runtime-verification/phase-3-control-runtime" });

const initialBatch = {
  batchId: "RV-PHASE24-BATCH", automationRunId: "RV-PHASE24-AUTO",
  module: "UNIVERSAL_WALLPAPER", productionType: "AUTOMATED",
  outputType: "DESKTOP_WALLPAPER", targetCount: 1, completedCount: 0,
  currentTaskId: "NONE", checkpointVersion: 0, sessionStatus: "ACTIVE",
  stopReason: "NONE", terminationStatus: "NON_TERMINAL",
  tasks: [{ taskId: "IMAGE-01", status: "QUEUED", recoveryStatus: "NONE", attemptCount: 0 }]
};
batchStore.create(initialBatch);

const sceneIntent = {
  status: "EXPLICIT",
  fields: {
    ACTIVITY: "TRAVEL", LOCATION: "CITY_STREET", ACTION: "WALKING",
    TIME: "DAY", WEATHER: "CLEAR", SOCIAL_CONTEXT: "ALONE", ENVIRONMENTAL_CUES: "URBAN_SCENERY"
  }
};

function makeController(generator) {
  return new AutomaticProductionController({
    batchRecord: initialBatch,
    batchStore,
    taskResolver: batch => batch.tasks.find(t => t.status === "QUEUED" || t.recoveryStatus === "RETRY_READY") ?? null,
    taskDesignContext: () => ({
      theme: "TRAVEL", sceneIntent, aspectRatio: "16:9",
      modelId: "TEST-MODEL", modelVersion: "1"
    }),
    userRequest: "Create an automated travel wallpaper.",
    runtimeFactory: task => new ProductionWorkerRuntime({
      store: new GitHubContentsStateStore({
        client, owner: "rayclamp", repo: "lora_20", path: taskPath,
        branch: "runtime-verification/phase-3-control-runtime"
      }),
      generator,
      designer: new DeterministicWallpaperDesigner(),
      visualEvaluator: { evaluate: () => ({ result: "VISUAL_DESIGN_ADHERENCE_PASS" }) },
      workerId: "PHASE24-WORKER",
      leaseDurationMs: 1000
    })
  });
}

// Controller A fails once and persists a resumable checkpoint.
const controllerA = makeController(new MockGenerationAdapter(["FAILED"]));
const first = controllerA.start();
assert.equal(first.action, "RETRY_READY");
let persisted = batchStore.read().state;
assert.equal(persisted.sessionStatus, "RECOVERY_REQUIRED");
assert.equal(persisted.tasks[0].recoveryStatus, "RETRY_READY");
assert.equal(persisted.tasks[0].status, "FAILED");
assert.equal(persisted.checkpointVersion, 0);

// Controller B is a fresh process: it has no in-memory runtimeByTask from A.
// It reloads the authoritative batch and rehydrates the runtime/task state.
const controllerB = makeController(new MockGenerationAdapter(["SUCCESS"]));
const final = controllerB.retryCurrentTask();
assert.equal(final.action, "BATCH_COMPLETE");
persisted = batchStore.read().state;
assert.equal(persisted.sessionStatus, "COMPLETED");
assert.equal(persisted.completedCount, 1);
assert.equal(persisted.tasks[0].status, "SUCCESS");
assert.equal(persisted.tasks[0].recoveryStatus, "NONE");
assert.equal(persisted.checkpointVersion, 1);

// A stale controller snapshot cannot overwrite the authoritative completed batch.
const stale = batchStore.read();
const staleState = JSON.parse(JSON.stringify(stale.state));
const live = batchStore.mutate(state => ({ ...state, checkpointVersion: state.checkpointVersion + 1 }));
assert.throws(() => batchStore.compareAndSwap(stale.sha, staleState, "stale controller write"), /STALE_CONTENT_SHA/);
assert.equal(batchStore.read().state.checkpointVersion, live.state.checkpointVersion);

console.log("Runtime Verification Phase-24 controller authority/restart E2E: PASS");
console.log("PASS batch checkpoints persist through GitHub CAS");
console.log("PASS controller restart rehydrates runtime state for RETRY_READY");
console.log("PASS completed batch remains authoritative after restart");
console.log("PASS stale controller write is fenced by GitHub CAS");
