#!/usr/bin/env node

import assert from "node:assert/strict";
import { GitHubContentsStateStore, MockGenerationAdapter, ProductionWorkerRuntime } from "./runtime/worker_runtime.mjs";

class FakeGitHubContentsClient {
  constructor() { this.items = new Map(); this.counter = 0; }
  getContents({ path }) {
    const item = this.items.get(path);
    return item ? { content: item.content, sha: item.sha } : null;
  }
  updateContents({ path, sha, content, message }) {
    const current = this.items.get(path);
    if (sha && (!current || current.sha !== sha)) throw new Error("STALE_SHA_REJECTED");
    if (!sha && current) throw new Error("CREATE_CONFLICT");
    const nextSha = `sha-${++this.counter}`;
    this.items.set(path, { content, sha: nextSha, message });
    return { content: { sha: nextSha } };
  }
}

const client = new FakeGitHubContentsClient();
const store = new GitHubContentsStateStore({
  client, owner: "rayclamp", repo: "lora_20",
  path: "runtime-tests/execution-cas.json", branch: "test",
});

let intervened = false;
const runtime = new ProductionWorkerRuntime({
  store,
  generator: {
    generate() {
      if (!intervened) {
        intervened = true;
        const snapshot = store.read();
        const external = structuredClone(snapshot.state);
        external.events.push({ type: "EXTERNAL_INTERVENING_EVENT" });
        external.version++;
        store.compareAndSwap(snapshot.sha, external, "test: intervening mutation");
      }
      return { result: "SUCCESS", verification: "VERIFIED", output: {} };
    },
  },
  workerId: "EXECUTION_OWNER",
});

runtime.request({
  traceRunId: "RV-EXEC-CAS-001",
  module: "UNIVERSAL_WALLPAPER",
  productionType: "ANIME",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "RV-EXEC-CAS-BATCH",
  taskId: "IMAGE-01",
});
runtime.claim();
runtime.designAndLockPrompt("SYSTEM-GENERATED PROMPT", {
  reference: { status: "NO_REFERENCE", provenance: "RULE_DEFAULT" },
  sceneIntent: {
    status: "RESOLVED",
    provenance: "WORKER_RESOLVED",
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
const authorization = runtime.authorizeAutomatedGeneration();
assert.equal(authorization.generationAuthorization, "AUTOMATION_EXECUTION_AUTHORIZED");
assert.equal(store.read().state.generationAuthorization, "AUTOMATION_EXECUTION_AUTHORIZED");

assert.throws(() => runtime.execute(), /STALE_SHA_REJECTED/);

const persisted = store.read();
assert.equal(persisted.state.events.at(-1).type, "EXTERNAL_INTERVENING_EVENT");
assert.equal(persisted.state.taskStatus, "CLAIMED");

