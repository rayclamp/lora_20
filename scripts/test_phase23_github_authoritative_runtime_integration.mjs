#!/usr/bin/env node

import assert from "node:assert/strict";
import { GitHubContentsStateStore, ProductionWorkerRuntime, MockGenerationAdapter } from "./runtime/worker_runtime.mjs";
import { DeterministicWallpaperDesigner } from "./runtime/production_designer.mjs";

class FakeGitHubContentsClient {
  constructor(initial = null) { this.state = initial; this.sha = initial ? "blob-1" : null; this.writes = 0; }
  getContents() {
    if (this.state === null) return null;
    return { content: Buffer.from(JSON.stringify(this.state), "utf8").toString("base64"), sha: this.sha };
  }
  updateContents({ sha, content }) {
    if (sha === undefined) {
      if (this.state !== null) throw new Error("FILE_ALREADY_EXISTS");
    } else if (sha !== this.sha) {
      throw new Error("STALE_CONTENT_SHA");
    }
    this.state = JSON.parse(Buffer.from(content, "base64").toString("utf8"));
    this.sha = "blob-" + (++this.writes + 1);
    return { content: { sha: this.sha } };
  }
}

const branch = "runtime-verification/phase-3-control-runtime";
const client = new FakeGitHubContentsClient();
const path = "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/STATE/PHASE23.json";
const storeA = new GitHubContentsStateStore({ client, owner: "rayclamp", repo: "lora_20", path, branch });
const storeB = new GitHubContentsStateStore({ client, owner: "rayclamp", repo: "lora_20", path, branch });
const generator = new MockGenerationAdapter(["SUCCESS"]);

const workerA = new ProductionWorkerRuntime({
  store: storeA, generator, designer: new DeterministicWallpaperDesigner(),
  visualEvaluator: { evaluate: () => ({ result: "VISUAL_DESIGN_ADHERENCE_PASS" }) },
  workerId: "WORKER-A", leaseDurationMs: 100
});

const initial = workerA.request({
  traceRunId: "RV-PHASE23", automationRunId: "RV-PHASE23-AUTO",
  module: "UNIVERSAL_WALLPAPER", productionType: "AUTOMATED",
  outputType: "DESKTOP_WALLPAPER", batchId: "RV-PHASE23-BATCH",
  taskId: "IMAGE-01", mode: "AUTOMATED"
});
assert.equal(initial.taskStatus, "QUEUED");
assert.equal(client.state.taskId, "IMAGE-01");

// Two independent workers read the same GitHub-backed state; only one can claim.
const stale = storeB.read();
workerA.claim();
assert.throws(() => storeB.compareAndSwap(stale.sha, { ...stale.state, workerId: "WORKER-B" }), /STALE_CONTENT_SHA/);
assert.equal(client.state.workerId, "WORKER-A");

// A second runtime using the same authoritative state cannot claim while the lease is active.
const workerB = new ProductionWorkerRuntime({
  store: storeB, generator: new MockGenerationAdapter(["SUCCESS"]),
  workerId: "WORKER-B", leaseDurationMs: 100
});
assert.throws(() => workerB.claim(), /CLAIM_REJECTED/);

// Worker A performs the complete gated execution against the same GitHub-backed state.
const sceneIntent = {
  status: "EXPLICIT",
  fields: {
    ACTIVITY: "TRAVEL", LOCATION: "CITY_STREET", ACTION: "WALKING",
    TIME: "DAY", WEATHER: "CLEAR", SOCIAL_CONTEXT: "ALONE", ENVIRONMENTAL_CUES: "URBAN_SCENERY"
  }
};
workerA.designFromRequest("Create an automated travel wallpaper.", {
  theme: "TRAVEL",
  aspectRatio: "16:9",
  modelId: "TEST-MODEL",
  modelVersion: "1",
  sceneIntent
});
workerA.authorizeAutomatedGeneration();
const result = workerA.execute();
assert.equal(result.taskStatus, "SUCCESS");
assert.equal(client.state.recovery, "TERMINAL_SUCCESS");
assert.equal(client.state.ownership, "UNCLAIMED");
assert.equal(client.state.workerId, "NONE");
assert.equal(client.state.leaseUntil, null);
assert.equal(client.state.visualAdherenceResult, "VISUAL_DESIGN_ADHERENCE_PASS");
assert.ok(client.state.lockedPrompt);
assert.ok(client.state.executionContextHash);

// A stale snapshot remains fenced even after the task has completed.
assert.throws(
  () => storeB.compareAndSwap(stale.sha, { ...stale.state, taskStatus: "SUCCESS" }),
  /STALE_CONTENT_SHA/
);
assert.equal(client.state.taskStatus, "SUCCESS");

console.log("Runtime Verification Phase-23 GitHub-authoritative runtime integration: PASS");
console.log("PASS task creation is persisted through the GitHub Contents state store");
console.log("PASS stale snapshot cannot overwrite the authoritative state");
console.log("PASS active lease prevents a second worker from claiming the task");
console.log("PASS complete gated execution persists terminal SUCCESS to authoritative state");
console.log("PASS stale worker snapshot remains fenced after completion");
