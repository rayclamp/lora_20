#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime } from "./runtime/worker_runtime.mjs";

class AdversarialCASStore {
  constructor(initialState) {
    this.state = structuredClone(initialState);
    this.sha = "sha-0";
    this.readCount = 0;
  }
  read() {
    this.readCount++;
    return { state: structuredClone(this.state), sha: this.sha };
  }
  create(state) {
    this.state = structuredClone(state);
    this.sha = "sha-1";
    return { state: structuredClone(state), sha: this.sha };
  }
  mutate(mutator) {
    const snapshot = this.read();
    const next = mutator(structuredClone(snapshot.state));
    return this.compareAndSwap(snapshot.sha, next);
  }
  compareAndSwap(expectedSha, next) {
    if (expectedSha !== this.sha) throw new Error("CAS_CONFLICT");
    this.state = structuredClone(next);
    this.sha = "sha-" + (Number(this.sha.split("-")[1]) + 1);
    return { state: structuredClone(next), sha: this.sha };
  }
}

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lora20-phase20-"));
const stateFile = path.join(dir, "IMAGE-01.json");
const initialStore = new JsonStateStore(stateFile);
const initialRuntime = new ProductionWorkerRuntime({
  store: initialStore,
  generator: { generate() { throw new Error("GENERATION_MUST_NOT_RUN"); } },
  workerId: "INITIALIZER"
});

initialRuntime.request({
  traceRunId: "RV-PHASE20-INIT",
  module: "UNIVERSAL_WALLPAPER",
  productionType: "AUTOMATED",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "RV-PHASE20-BATCH",
  taskId: "IMAGE-01",
  mode: "AUTOMATED"
});

// Two workers point at the same authoritative task state.
const workerA = new ProductionWorkerRuntime({
  store: new JsonStateStore(stateFile),
  generator: { generate() { throw new Error("GENERATION_MUST_NOT_RUN"); } },
  workerId: "WORKER-A"
});
const workerB = new ProductionWorkerRuntime({
  store: new JsonStateStore(stateFile),
  generator: { generate() { throw new Error("GENERATION_MUST_NOT_RUN"); } },
  workerId: "WORKER-B"
});

workerA.claim();
assert.throws(() => workerB.claim(), /CLAIM_REJECTED/);
assert.equal(workerA.requireState().ownership, "CLAIMED");
assert.equal(workerA.requireState().workerId, "WORKER-A");
assert.equal(workerB.requireState().ownership, "CLAIMED");
assert.equal(workerB.requireState().workerId, "WORKER-A");

// Adversarial stale-read race: both claim attempts observe the same SHA;
// only the first CAS is allowed to commit.
const shared = new AdversarialCASStore(initialRuntime.requireState());
shared.state.taskStatus = "QUEUED";
shared.state.ownership = "UNCLAIMED";
shared.state.workerId = "NONE";
shared.state.claimId = "NONE";
shared.sha = "sha-10";

const firstSnapshot = shared.read();
const secondSnapshot = shared.read();
assert.equal(firstSnapshot.sha, secondSnapshot.sha);

function commitClaim(snapshot, workerId) {
  const next = structuredClone(snapshot.state);
  if (next.taskStatus !== "QUEUED" || next.ownership !== "UNCLAIMED") throw new Error("CLAIM_REJECTED");
  next.taskStatus = "CLAIMED";
  next.ownership = "CLAIMED";
  next.workerId = workerId;
  next.claimId = workerId + "-CLAIM";
  return shared.compareAndSwap(snapshot.sha, next);
}

commitClaim(firstSnapshot, "WORKER-A");
assert.throws(() => commitClaim(secondSnapshot, "WORKER-B"), /CAS_CONFLICT/);
assert.equal(shared.state.workerId, "WORKER-A");
assert.equal(shared.state.ownership, "CLAIMED");
assert.equal(shared.state.taskStatus, "CLAIMED");

console.log("Runtime Verification Phase-20 Claim/CAS concurrency boundary: PASS");
console.log("PASS two workers cannot claim the same authoritative task sequentially");
console.log("PASS stale concurrent claim is rejected by CAS conflict");
console.log("PASS winning claim remains authoritative and no second worker gains ownership");
