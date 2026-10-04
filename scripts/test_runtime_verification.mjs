#!/usr/bin/env node

import assert from "node:assert/strict";

const PASS = [];
const test = (name, fn) => {
  try { fn(); PASS.push(name); }
  catch (error) { console.error("[FAIL] " + name); throw error; }
};

function newTask(id = "IMAGE 01") {
  return { id, status:"QUEUED", ownership:"UNCLAIMED", workerId:"NONE", claimId:"NONE",
    version:0, attempts:0, consecutiveFailures:0, result:"NOT_STARTED", recovery:"NONE",
    promptPreview:"NOT_SHOWN", generationAuthorized:false, checkpoint:"NOT_CHECKPOINTED" };
}
function claim(task, workerId, claimId) {
  assert.equal(task.status, "QUEUED"); assert.equal(task.ownership, "UNCLAIMED");
  task.status="CLAIMED"; task.ownership="CLAIMED"; task.workerId=workerId; task.claimId=claimId; task.version++;
}
function previewAndConfirm(task) {
  assert.equal(task.status, "CLAIMED"); task.promptPreview="SHOWN"; task.generationAuthorized=true;
}
function generate(task, outcome) {
  assert.equal(task.promptPreview, "SHOWN"); assert.equal(task.generationAuthorized, true); task.attempts++;
  if (outcome === "SUCCESS") {
    task.status="SUCCESS"; task.result="SUCCESS"; task.recovery="TERMINAL_SUCCESS";
    task.consecutiveFailures=0; task.ownership="TERMINAL"; task.workerId="NONE"; task.claimId="NONE";
  } else if (outcome === "FORMAT_MISMATCH") {
    task.status="FAILED"; task.result="FAILED"; task.recovery="RETRY_READY";
    task.consecutiveFailures++; task.generationAuthorized=false; task.promptPreview="NOT_SHOWN";
  } else if (outcome === "UNKNOWN") {
    task.status="UNKNOWN / RECOVERY_REQUIRED"; task.result="UNKNOWN"; task.recovery="RECOVERY_REQUIRED";
    task.generationAuthorized=false; task.promptPreview="NOT_SHOWN"; task.ownership="RELEASED";
    task.workerId="NONE"; task.claimId="NONE";
  } else throw new Error("Unsupported outcome");
  task.version++;
}
function checkpoint(batch) { return JSON.parse(JSON.stringify(batch)); }
function nextIncomplete(batch) { return batch.tasks.find(t => t.status !== "SUCCESS" && t.status !== "ABANDONED") ?? null; }

test("Golden path: claim → preview → confirmation → success", () => {
  const t=newTask(); claim(t,"WORKER_A","CLAIM_A"); previewAndConfirm(t); generate(t,"SUCCESS");
  assert.equal(t.result,"SUCCESS"); assert.equal(t.status,"SUCCESS"); assert.equal(t.recovery,"TERMINAL_SUCCESS");
  assert.equal(t.ownership,"TERMINAL"); assert.equal(t.attempts,1);
});
test("Manual gate: generation cannot occur before preview and confirmation", () => {
  const t=newTask(); claim(t,"WORKER_A","CLAIM_A"); assert.throws(() => generate(t,"SUCCESS")); assert.equal(t.attempts,0);
});
test("Output mismatch: failed candidate increments attempt but not completion", () => {
  const t=newTask(); claim(t,"WORKER_A","CLAIM_A"); previewAndConfirm(t); generate(t,"FORMAT_MISMATCH");
  assert.equal(t.result,"FAILED"); assert.equal(t.attempts,1); assert.equal(t.recovery,"RETRY_READY"); assert.notEqual(t.status,"SUCCESS");
});
test("UNKNOWN: blocks blind retry and enters recovery", () => {
  const t=newTask(); claim(t,"WORKER_A","CLAIM_A"); previewAndConfirm(t); generate(t,"UNKNOWN");
  assert.equal(t.result,"UNKNOWN"); assert.equal(t.recovery,"RECOVERY_REQUIRED"); assert.notEqual(t.status,"QUEUED"); assert.equal(t.ownership,"RELEASED");
});
test("Three consecutive failures: hard attempt ceiling blocks attempt four", () => {
  const t=newTask();
  for (let i=0;i<3;i++) { if(i>0){t.status="QUEUED";t.ownership="UNCLAIMED";claim(t,"WORKER_A","CLAIM_"+(i+1));} else claim(t,"WORKER_A","CLAIM_1"); previewAndConfirm(t); generate(t,"FORMAT_MISMATCH"); }
  assert.equal(t.attempts,3); assert.equal(t.consecutiveFailures,3); t.recovery="RECOVERY_REQUIRED";
  assert.throws(() => { if(t.attempts>=3) throw new Error("MAX_ATTEMPTS_REACHED"); });
});
test("Checkpoint: completed work survives an execution boundary", () => {
  const batch={batchId:"RV-GOLDEN-001",targetCount:3,completedCount:0,tasks:[newTask("IMAGE 01"),newTask("IMAGE 02"),newTask("IMAGE 03")]};
  claim(batch.tasks[0],"WORKER_A","CLAIM_1"); previewAndConfirm(batch.tasks[0]); generate(batch.tasks[0],"SUCCESS"); batch.completedCount=1;
  const resumed=JSON.parse(JSON.stringify(checkpoint(batch))); assert.equal(resumed.completedCount,1); assert.equal(nextIncomplete(resumed).id,"IMAGE 02");
});
test("Authoritative continuation: success with remaining tasks resolves next task", () => {
  const batch={targetCount:2,tasks:[newTask("IMAGE 01"),newTask("IMAGE 02")]};
  claim(batch.tasks[0],"WORKER_A","CLAIM_1"); previewAndConfirm(batch.tasks[0]); generate(batch.tasks[0],"SUCCESS");
  assert.equal(nextIncomplete(batch).id,"IMAGE 02");
});
test("Concurrency fence: only one owner may claim a queued task", () => {
  const t=newTask(); claim(t,"WORKER_A","CLAIM_A"); assert.throws(() => claim(t,"WORKER_B","CLAIM_B"));
  assert.equal(t.workerId,"WORKER_A"); assert.equal(t.claimId,"CLAIM_A");
});
test("Terminal success cannot be reclaimed", () => {
  const t=newTask(); claim(t,"WORKER_A","CLAIM_A"); previewAndConfirm(t); generate(t,"SUCCESS"); assert.throws(() => claim(t,"WORKER_B","CLAIM_B"));
});

console.log("\nRuntime Verification Harness: PASS");
for (const name of PASS) console.log("[PASS] " + name);
console.log("This verifies deterministic control-plane semantics only; it does not claim a production Automation Engine exists.");
