#!/usr/bin/env node

import assert from "node:assert/strict";
import { AutomaticProductionController } from "./runtime/automatic_production_controller.mjs";


class MemoryBatchStore {
  constructor(state) { this.state = JSON.parse(JSON.stringify(state)); this.sha = "batch-1"; this.writes = 0; }
  read() { return { state: JSON.parse(JSON.stringify(this.state)), sha: this.sha }; }
  compareAndSwap(expectedSha, state) {
    if (expectedSha !== this.sha) throw new Error("STALE_BATCH_SHA");
    this.state = JSON.parse(JSON.stringify(state));
    this.sha = "batch-" + (++this.writes + 1);
    return this.read();
  }
}

function makeController(outcome) {
  const tasks = [
    { taskId: "IMAGE-01", status: "QUEUED" },
    { taskId: "IMAGE-02", status: "QUEUED" }
  ];
  const calls = [];
  const initialBatchRecord = {
      batchId: "RV-PHASE18-BATCH",
      automationRunId: "RV-PHASE18-AUTO",
      module: "UNIVERSAL_WALLPAPER",
      productionType: "AUTOMATED",
      outputType: "DESKTOP_WALLPAPER",
      targetCount: 2,
      completedCount: 0,
      currentTaskId: "NONE",
      checkpointVersion: 0,
      sessionStatus: "ACTIVE"
  };
  const batchStore = new MemoryBatchStore(initialBatchRecord);
  const controller = new AutomaticProductionController({
    batchRecord: initialBatchRecord,
    batchStore,
    taskResolver: batch => tasks.find(t => t.status === "QUEUED") ?? null,
    taskDesignContext: () => ({
      theme: "TRAVEL",
      sceneIntent: {
        status: "EXPLICIT",
        fields: {
          ACTIVITY: "TRAVEL", LOCATION: "CITY_STREET", ACTION: "WALKING",
          TIME: "DAY", WEATHER: "CLEAR", SOCIAL_CONTEXT: "ALONE",
          ENVIRONMENTAL_CUES: "URBAN_SCENERY"
        }
      }
    }),
    userRequest: "Create a travel wallpaper.",
    runtimeFactory: task => {
      calls.push(task.taskId);
      return {
        request() {},
        claim() {},
        designFromRequest() {},
        authorizeAutomatedGeneration() {},
        execute() {
          if (outcome === "UNKNOWN") return { result: "UNKNOWN", taskStatus: "UNKNOWN / RECOVERY_REQUIRED" };
          return { result: "FAILED", taskStatus: "FAILED", recovery: "RETRY_READY", attemptCount: 1, maxAttempts: 3, consecutiveFailures: 1, failureReason: "TEST_FAILURE" };
        }
      };
    }
  });
  return { controller, tasks, calls };
}

// FAILED must stop the batch and must never dispatch IMAGE-02.
{
  const { controller, tasks, calls } = makeController("FAILED");
  const result = controller.start();
  assert.equal(result.action, "RETRY_READY");
  assert.equal(controller.batchRecord.sessionStatus, "RECOVERY_REQUIRED");
  assert.deepEqual(calls, ["IMAGE-01"]);
  assert.deepEqual(tasks.map(t => t.status), ["QUEUED", "QUEUED"]);
  assert.equal(controller.events.filter(e => e.type === "TASK_RESULT").length, 1);
}

// UNKNOWN must stop immediately and must never be silently retried.
{
  const { controller, calls } = makeController("UNKNOWN");
  const result = controller.start();
  assert.equal(result.action, "RECOVERY_REQUIRED");
  assert.equal(controller.batchRecord.sessionStatus, "RECOVERY_REQUIRED");
  assert.deepEqual(calls, ["IMAGE-01"]);
  assert.equal(controller.events.at(-1).reason, "RECOVERY_REQUIRED");
}

// Explicit STOP is terminal and cannot be resurrected by another start.
{
  const { controller, calls } = makeController("FAILED");
  const stopped = controller.stop("USER_STOP");
  assert.equal(stopped.action, "STOPPED");
  assert.equal(controller.batchRecord.sessionStatus, "STOPPED");
  assert.equal(controller.batchRecord.terminationStatus, "TERMINAL");
  assert.throws(() => controller.start(), /BATCH_NOT_ACTIVE/);
  assert.deepEqual(calls, []);
}

console.log("Runtime Verification Phase-18 failure/UNKNOWN/STOP safety: PASS");
console.log("PASS FAILED never auto-advances to the next task");
console.log("PASS UNKNOWN never auto-retries or advances");
console.log("PASS terminal STOPPED batch cannot restart");
