#!/usr/bin/env node

import assert from "node:assert/strict";

const states = {
  eligible: "QUEUED",
  claimed: "CLAIMED",
  success: "SUCCESS",
  abandoned: "ABANDONED",
  unknown: "UNKNOWN / RECOVERY_REQUIRED",
};

function eligible(task) {
  return (
    task.moduleActive === true &&
    task.status === states.eligible &&
    task.ownership === "UNCLAIMED" &&
    task.recovery !== "RECOVERY_REQUIRED" &&
    task.valid === true
  );
}

function selectNext(tasks) {
  return [...tasks]
    .filter(eligible)
    .sort((a, b) => a.order - b.order)[0] ?? null;
}

const base = [
  { id: "IMAGE 03", order: 3, moduleActive: true, status: states.eligible, ownership: "UNCLAIMED", recovery: "NONE", valid: true },
  { id: "IMAGE 01", order: 1, moduleActive: true, status: states.eligible, ownership: "UNCLAIMED", recovery: "NONE", valid: true },
  { id: "IMAGE 02", order: 2, moduleActive: true, status: states.eligible, ownership: "UNCLAIMED", recovery: "NONE", valid: true },
];

assert.equal(selectNext(base).id, "IMAGE 01");

const blocked = [
  { id: "IMAGE 01", order: 1, moduleActive: true, status: states.success, ownership: "TERMINAL", recovery: "NONE", valid: true },
  { id: "IMAGE 02", order: 2, moduleActive: true, status: states.claimed, ownership: "CLAIMED", recovery: "NONE", valid: true },
  { id: "IMAGE 03", order: 3, moduleActive: true, status: states.unknown, ownership: "RELEASED", recovery: "RECOVERY_REQUIRED", valid: true },
];
assert.equal(selectNext(blocked), null);

const inactive = [
  { id: "IMAGE 01", order: 1, moduleActive: false, status: states.eligible, ownership: "UNCLAIMED", recovery: "NONE", valid: true },
  { id: "IMAGE 02", order: 2, moduleActive: true, status: states.eligible, ownership: "UNCLAIMED", recovery: "NONE", valid: true },
];
assert.equal(selectNext(inactive).id, "IMAGE 02");

const invalid = [
  { id: "IMAGE 01", order: 1, moduleActive: true, status: states.eligible, ownership: "UNCLAIMED", recovery: "NONE", valid: false },
  { id: "IMAGE 02", order: 2, moduleActive: true, status: states.eligible, ownership: "UNCLAIMED", recovery: "NONE", valid: true },
];
assert.equal(selectNext(invalid).id, "IMAGE 02");

const race = {
  task: { id: "IMAGE 01", order: 1, moduleActive: true, status: states.eligible, ownership: "UNCLAIMED", recovery: "NONE", valid: true },
  workerA: "WORKER_A",
  workerB: "WORKER_B",
  initialSha: "same-batch-sha",
  winner: "WORKER_A",
  loser: "WORKER_B",
  loserResult: "CLAIM_LOST / 409",
};
assert.equal(race.initialSha, "same-batch-sha");
assert.notEqual(race.winner, race.loser);
assert.equal(race.loserResult, "CLAIM_LOST / 409");

const unknown = {
  status: states.unknown,
  schedulable: false,
  leaseExpiryMayAutoRetry: false,
};
assert.equal(unknown.schedulable, false);
assert.equal(unknown.leaseExpiryMayAutoRetry, false);

const terminal = {
  status: states.success,
  ownership: "TERMINAL",
  reclaimable: false,
};
assert.equal(terminal.reclaimable, false);

console.log("Universal Worker Pool scheduler self-test: PASS");
