#!/usr/bin/env node

import assert from "node:assert/strict";
import { GitHubContentsStateStore, ProductionWorkerRuntime } from "./runtime/worker_runtime.mjs";

class FakeGitHubContentsClient {
  constructor(initialState) { this.state = initialState; this.sha = "blob-1"; this.writes = 0; }
  getContents() { return { content: Buffer.from(JSON.stringify(this.state), "utf8").toString("base64"), sha: this.sha }; }
  updateContents({ sha, content }) {
    if (sha === undefined && this.state !== null) { const error = new Error("FILE_ALREADY_EXISTS"); error.code = "FILE_ALREADY_EXISTS"; throw error; }
    if (sha !== undefined && sha !== this.sha) { const error = new Error("STALE_CONTENT_SHA"); error.code = "STALE_CONTENT_SHA"; throw error; }
    this.state = JSON.parse(Buffer.from(content, "base64").toString("utf8"));
    this.writes++; this.sha = "blob-" + (this.writes + 1); return { content: { sha: this.sha } };
  }
}

const branch = "runtime-verification/phase-3-control-runtime";
const initial = { schemaVersion: 1, taskStatus: "QUEUED", ownership: "UNCLAIMED", version: 0, attemptCount: 0, events: [] };
const client = new FakeGitHubContentsClient(initial);
const storeA = new GitHubContentsStateStore({ client, owner: "rayclamp", repo: "lora_20", path: "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/STATE/RV-001.json", branch });
const storeB = new GitHubContentsStateStore({ client, owner: "rayclamp", repo: "lora_20", path: "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/STATE/RV-001.json", branch });
const snapshotA = storeA.read(); const snapshotB = storeB.read(); assert.equal(snapshotA.sha, snapshotB.sha);
storeA.compareAndSwap(snapshotA.sha, { ...snapshotA.state, version: 1 }, "test: worker A claim");
assert.throws(() => storeB.compareAndSwap(snapshotB.sha, { ...snapshotB.state, version: 1 }, "test: stale worker B claim"), /STALE_CONTENT_SHA/);

const runtimeA = new ProductionWorkerRuntime({ store: storeA, generator: { generate: () => ({ result: "SUCCESS", verification: "VERIFIED", output: {} }) }, workerId: "WORKER_A" });
const runtimeB = new ProductionWorkerRuntime({ store: storeB, generator: { generate: () => ({ result: "SUCCESS", verification: "VERIFIED", output: {} }) }, workerId: "WORKER_B" });
client.state = { schemaVersion: 1, traceRunId: "RV-CAS-001", automationRunId: "RV-AUTO-CAS", module: "UNIVERSAL_WALLPAPER", productionType: "ANIME", outputType: "DESKTOP_WALLPAPER", targetSuccessCount: 1, maxAttempts: 3, batchId: "RV-BATCH-CAS", taskId: "IMAGE-01", taskStatus: "QUEUED", ownership: "UNCLAIMED", workerId: "NONE", claimId: "NONE", version: 0, attemptCount: 0, consecutiveFailures: 0, generationAuthorization: "NOT_REQUIRED", promptPreview: "NOT_RECORDED", result: "NOT_STARTED", recovery: "NONE", checkpointVersion: 0, events: [] };
client.sha = "blob-runtime-1";
const claimedA = runtimeA.claim(); assert.equal(claimedA.workerId, "WORKER_A"); assert.equal(client.state.ownership, "CLAIMED");
assert.throws(() => runtimeB.claim(), /CLAIM_REJECTED/);

console.log("Production Runtime Phase-4 CAS probe: PASS");
const createClient = new FakeGitHubContentsClient(null);
const createStore = new GitHubContentsStateStore({
  client: createClient, owner: "rayclamp", repo: "lora_20",
  path: "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/STATE/RV-CREATE.json", branch
});
const createRuntime = new ProductionWorkerRuntime({
  store: createStore,
  generator: { generate: () => ({ result: "SUCCESS", verification: "VERIFIED", output: {} }) },
  workerId: "WORKER_CREATE"
});
const created = createRuntime.request({
  traceRunId: "RV-CREATE-001", module: "UNIVERSAL_WALLPAPER",
  productionType: "ANIME", outputType: "DESKTOP_WALLPAPER",
  batchId: "RV-BATCH-CREATE", taskId: "IMAGE-01"
});
assert.equal(created.taskStatus, "QUEUED");
assert.equal(createClient.state.taskId, "IMAGE-01");

console.log("PASS stale content SHA is rejected");
console.log("PASS first worker claim becomes authoritative");
console.log("PASS second worker cannot reclaim claimed task");
console.log("PASS GitHub store is write-CAS only");
console.log("NOTE: test uses a deterministic GitHub Contents API double; no remote repository is mutated.");
