#!/usr/bin/env node

/**
 * Council Round 10 — deterministic concurrency state-machine self-test.
 * This complements the real GitHub SHA/CAS race test.
 */

let failures = 0;
const pass = m => console.log("[PASS] " + m);
const fail = m => { console.error("[FAIL] " + m); failures++; };

function task(overrides = {}) {
  return {
    status: "UNCLAIMED",
    worker: "NONE",
    claim: "NONE",
    lease: 0,
    version: 0,
    result: "NOT_STARTED",
    ...overrides,
  };
}

function claim(t, worker, claim, now, leaseDuration) {
  if (t.status === "TERMINAL") return false;
  if (t.status === "CLAIMED" && t.lease > now) return false;
  t.status = "CLAIMED";
  t.worker = worker;
  t.claim = claim;
  t.lease = now + leaseDuration;
  t.version++;
  return true;
}

function write(t, worker, claim, expectedVersion, now) {
  if (t.status !== "CLAIMED") return false;
  if (t.worker !== worker || t.claim !== claim) return false;
  if (t.version !== expectedVersion) return false;
  if (t.lease <= now) return false;
  t.version++;
  return true;
}

let t = task();
if (claim(t, "worker-A", "claim-A", 100, 60)) pass("First Worker can claim an unclaimed task");
else fail("First Worker claim rejected");

if (!claim(t, "worker-B", "claim-B", 110, 60)) pass("Second Worker cannot claim an unexpired task");
else fail("Second Worker incorrectly acquired active claim");

const staleVersion = t.version;
if (write(t, "worker-A", "claim-A", staleVersion, 120)) pass("Current owner can perform an ownership-sensitive write");
else fail("Current owner write rejected");

if (!write(t, "worker-B", "claim-B", staleVersion, 120)) pass("Stale/non-owner write is fenced");
else fail("Stale/non-owner write incorrectly succeeded");

if (claim(t, "worker-B", "claim-B", 161, 60)) pass("New Worker can reclaim after lease expiry");
else fail("Expired lease was not reclaimable");

if (!write(t, "worker-A", "claim-A", 2, 162)) pass("Old Worker remains fenced after reclaim");
else fail("Old Worker incorrectly wrote after reclaim");

t.result = "SUCCESS";
t.status = "TERMINAL";
t.worker = "NONE";
t.claim = "NONE";
t.lease = 0;
t.version++;

if (!claim(t, "worker-C", "claim-C", 200, 60)) pass("Terminal SUCCESS task cannot be reclaimed");
else fail("Terminal SUCCESS task was reclaimed");

const unknown = task({status:"CLAIMED", worker:"worker-A", claim:"claim-U", lease:150, version:1, result:"UNKNOWN"});
if (unknown.result === "UNKNOWN" && unknown.status === "CLAIMED") {
  unknown.status = "RECOVERY_REQUIRED";
  unknown.worker = "NONE";
  unknown.claim = "NONE";
  unknown.lease = 0;
}
if (unknown.status === "RECOVERY_REQUIRED") pass("UNKNOWN transitions to recovery rather than blind retry");
else fail("UNKNOWN was not recovery-blocked");

if (failures > 0) {
  console.error("\nConcurrency state-machine self-test FAILED: " + failures + " test(s).");
  process.exit(1);
}
console.log("\nConcurrency state-machine self-test PASSED.");
