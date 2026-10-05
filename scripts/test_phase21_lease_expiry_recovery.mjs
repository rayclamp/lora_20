#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime } from "./runtime/worker_runtime.mjs";

let now = 1000;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lora20-phase21-"));
const file = path.join(dir, "IMAGE-01.json");
const store = new JsonStateStore(file);

const makeWorker = (workerId) => new ProductionWorkerRuntime({
  store,
  workerId,
  clock: () => now,
  leaseDurationMs: 100
});

const initializer = makeWorker("INITIALIZER");
initializer.request({
  traceRunId: "RV-PHASE21",
  module: "UNIVERSAL_WALLPAPER",
  productionType: "AUTOMATED",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "RV-PHASE21-BATCH",
  taskId: "IMAGE-01",
  mode: "AUTOMATED"
});

const workerA = makeWorker("WORKER-A");
const claimed = workerA.claim();
assert.equal(claimed.ownership, "CLAIMED");
assert.equal(claimed.workerId, "WORKER-A");
assert.equal(claimed.leaseUntil, 1100);

now = 1050;
const renewed = workerA.renewLease();
assert.equal(renewed.leaseUntil, 1150);
assert.equal(renewed.workerId, "WORKER-A");

now = 1149;
assert.equal(workerA.renewLease().leaseUntil, 1249);

now = 1250;
assert.throws(() => workerA.renewLease(), /LEASE_EXPIRED/);
assert.throws(() => workerA.execute(), /LEASE_EXPIRED/);

const workerB = makeWorker("WORKER-B");
const reclaimed = workerB.claim();
assert.equal(reclaimed.ownership, "CLAIMED");
assert.equal(reclaimed.workerId, "WORKER-B");
assert.notEqual(reclaimed.claimId, claimed.claimId);
assert.equal(reclaimed.leaseUntil, 1350);

now = 1251;
assert.throws(() => workerA.execute(), /EXECUTION_OWNERSHIP_REQUIRED|LEASE_EXPIRED/);
assert.equal(workerB.requireState().workerId, "WORKER-B");

console.log("Runtime Verification Phase-21 Lease expiry and stale-worker fencing: PASS");
console.log("PASS claim creates a bounded lease");
console.log("PASS active owner can renew its lease");
console.log("PASS expired owner cannot renew or execute");
console.log("PASS another worker can reclaim an expired lease");
console.log("PASS stale worker remains fenced after reclamation");
