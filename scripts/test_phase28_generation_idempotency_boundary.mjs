#!/usr/bin/env node

import assert from "node:assert/strict";
import { GitHubContentsStateStore, ProductionWorkerRuntime, sha256 } from "./runtime/worker_runtime.mjs";

class FakeGitHubContentsClient {
  constructor() { this.items = new Map(); this.counter = 0; }
  getContents({ path }) {
    const item = this.items.get(path);
    return item ? { content: item.content, sha: item.sha } : null;
  }
  updateContents({ path, sha, content }) {
    const current = this.items.get(path);
    if (sha && (!current || current.sha !== sha)) throw new Error("STALE_SHA_REJECTED");
    if (!sha && current) throw new Error("CREATE_CONFLICT");
    const nextSha = `sha-${++this.counter}`;
    this.items.set(path, { content, sha: nextSha });
    return { content: { sha: nextSha } };
  }
}

const client = new FakeGitHubContentsClient();
const store = new GitHubContentsStateStore({
  client, owner: "rayclamp", repo: "lora_20",
  path: "runtime-tests/phase28-idempotency.json", branch: "test",
});

const calls = [];
const artifacts = new Map();
let firstCall = true;

const runtime = new ProductionWorkerRuntime({
  store,
  workerId: "PHASE28-WORKER",
  generator: {
    generate(payload) {
      calls.push(payload.generationIdempotencyKey);
      assert.equal(payload.generationAttempt, 1);

      let artifact = artifacts.get(payload.generationIdempotencyKey);
      if (!artifact) {
        artifact = { artifactId: `ARTIFACT-${artifacts.size + 1}`, format: payload.outputType, promptHash: sha256(payload.prompt) };
        artifacts.set(payload.generationIdempotencyKey, artifact);
      }

      if (firstCall) {
        firstCall = false;
        const snapshot = store.read();
        const external = structuredClone(snapshot.state);
        external.events.push({ type: "EXTERNAL_INTERVENING_EVENT" });
        external.version++;
        store.compareAndSwap(snapshot.sha, external, "test: intervening mutation");
      }

      return { result: "SUCCESS", verification: "VERIFIED", output: artifact };
    },
  },
});

runtime.request({
  traceRunId: "RV-PHASE28-TRACE",
  module: "UNIVERSAL_WALLPAPER",
  productionType: "ANIME",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "RV-PHASE28-BATCH",
  taskId: "IMAGE-01",
  mode: "AUTOMATED",
});
runtime.claim();
runtime.designAndLockPrompt("LOCKED PROMPT", {
  reference: { status: "NO_REFERENCE", provenance: "RULE_DEFAULT" },
  sceneIntent: {
    status: "EXPLICIT",
    fields: {
      ACTIVITY: "TRAVEL",
      LOCATION: "FOREST_PATH",
      ACTION: "WALKING",
      TIME: "AFTERNOON",
      WEATHER: "CLEAR",
      SOCIAL_CONTEXT: "ALONE",
      ENVIRONMENTAL_CUES: "WOODLAND_PATH",
    },
  },
});
runtime.authorizeAutomatedGeneration();

assert.throws(() => runtime.execute(), /STALE_SHA_REJECTED/);
const afterConflict = store.read().state;
assert.equal(afterConflict.attemptCount, 0);
assert.equal(afterConflict.taskStatus, "CLAIMED");

const recovered = runtime.execute();
assert.equal(recovered.result, "SUCCESS");
assert.equal(recovered.attemptCount, 1);
assert.equal(recovered.generationIdempotencyKey, calls[0]);
assert.equal(calls.length, 2);
assert.equal(calls[0], calls[1]);
assert.equal(artifacts.size, 1);

console.log("Runtime Verification Phase-28 generation idempotency boundary: PASS");
console.log("PASS deterministic task/attempt idempotency key");
console.log("PASS provider retry after execution-checkpoint CAS conflict reuses the same key");
console.log("PASS idempotent provider semantics prevent duplicate artifact identity");
