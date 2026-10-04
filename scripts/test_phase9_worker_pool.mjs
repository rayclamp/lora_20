#!/usr/bin/env node

import assert from "node:assert/strict";
import { GitHubContentsStateStore, ProductionWorkerRuntime } from "./runtime/worker_runtime.mjs";

class FakeGitHubContentsClient {
  constructor(state) { this.state = state; this.sha = "pool-1"; this.writes = 0; }
  getContents() {
    return { content: Buffer.from(JSON.stringify(this.state), "utf8").toString("base64"), sha: this.sha };
  }
  updateContents({ sha, content }) {
    if (sha !== this.sha) throw new Error("STALE_CONTENT_SHA");
    this.state = JSON.parse(Buffer.from(content, "base64").toString("utf8"));
    this.writes++;
    this.sha = "pool-" + (this.writes + 1);
    return { content: { sha: this.sha } };
  }
}

const initial = {
  schemaVersion: 1, traceRunId: "RV-PHASE9", automationRunId: "RV-PHASE9-AUTO",
  module: "UNIVERSAL_WALLPAPER", productionType: "ANIME", outputType: "DESKTOP_WALLPAPER",
  targetSuccessCount: 1, maxAttempts: 3, batchId: "RV-PHASE9-BATCH", taskId: "IMAGE-01",
  taskStatus: "QUEUED", ownership: "UNCLAIMED", workerId: "NONE", claimId: "NONE",
  version: 0, attemptCount: 0, consecutiveFailures: 0,
  generationAuthorization: "NOT_REQUIRED", promptPreview: "NOT_RECORDED",
  result: "NOT_STARTED", recovery: "NONE", checkpointVersion: 0, events: []
};
const client = new FakeGitHubContentsClient(initial);
const storeA = new GitHubContentsStateStore({ client, owner: "rayclamp", repo: "lora_20", path: "runtime/phase9.json", branch: "test" });
const storeB = new GitHubContentsStateStore({ client, owner: "rayclamp", repo: "lora_20", path: "runtime/phase9.json", branch: "test" });

const workerA = new ProductionWorkerRuntime({
  store: storeA, workerId: "WORKER_A",
  generator: { generate: () => ({ result: "SUCCESS", verification: "VERIFIED", output: { format: "DESKTOP_WALLPAPER" } }) }
});
const workerB = new ProductionWorkerRuntime({
  store: storeB, workerId: "WORKER_B",
  generator: { generate: () => ({ result: "SUCCESS", verification: "VERIFIED", output: { format: "DESKTOP_WALLPAPER" } }) }
});

const snapshotA = storeA.read();
const snapshotB = storeB.read();
assert.equal(snapshotA.sha, snapshotB.sha);
const claimed = workerA.claim();
assert.equal(claimed.workerId, "WORKER_A");
assert.throws(() => workerB.claim(), /CLAIM_REJECTED/);

console.log("Runtime Verification Phase-9 worker-pool/CAS: PASS");
console.log("PASS two workers observe one authoritative task");
console.log("PASS first claim becomes authoritative");
console.log("PASS second worker cannot reclaim claimed work");
console.log("PASS GitHub Contents SHA remains the concurrency fence");
console.log("NOTE: this is a deterministic GitHub API double; no remote task state is mutated.");
