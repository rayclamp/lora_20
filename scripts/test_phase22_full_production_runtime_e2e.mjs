#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime, MockGenerationAdapter, sha256 } from "./runtime/worker_runtime.mjs";
import { DeterministicWallpaperDesigner } from "./runtime/production_designer.mjs";
import { AutomaticProductionController } from "./runtime/automatic_production_controller.mjs";

class MemoryBatchStore { constructor(state){this.state=JSON.parse(JSON.stringify(state));this.sha="batch-1";this.writes=0;} read(){return {state:JSON.parse(JSON.stringify(this.state)),sha:this.sha};} compareAndSwap(expectedSha,state){if(expectedSha!==this.sha)throw new Error("STALE_BATCH_SHA");this.state=JSON.parse(JSON.stringify(state));this.sha="batch-"+(++this.writes+1);return this.read();} }

const sceneIntent = {
  status: "EXPLICIT",
  fields: {
    ACTIVITY: "TRAVEL", LOCATION: "CITY_STREET", ACTION: "WALKING",
    TIME: "DAY", WEATHER: "CLEAR", SOCIAL_CONTEXT: "ALONE", ENVIRONMENTAL_CUES: "URBAN_SCENERY"
  }
};

function makeController(outcomes) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lora20-phase22-"));
  const tasks = [
    { taskId: "IMAGE-01", status: "QUEUED" },
    { taskId: "IMAGE-02", status: "QUEUED" },
    { taskId: "IMAGE-03", status: "QUEUED" }
  ];
  const generator = new MockGenerationAdapter(outcomes);
  const runtimes = new Map();
  const initialBatchRecord = {
    batchId: "RV-PHASE22-BATCH", automationRunId: "RV-PHASE22-AUTO",
    module: "UNIVERSAL_WALLPAPER", productionType: "AUTOMATED",
    outputType: "DESKTOP_WALLPAPER", targetCount: 3, completedCount: 0,
    currentTaskId: "NONE", checkpointVersion: 0, sessionStatus: "ACTIVE"
  };
  const batchStore = new MemoryBatchStore(initialBatchRecord);
  const controller = new AutomaticProductionController({
    batchRecord: initialBatchRecord,
    batchStore,
    taskResolver: (batch, hint) => hint?.taskId
      ? tasks.find(t => t.taskId === hint.taskId) ?? null
      : tasks.find(t => t.status === "QUEUED") ?? null,
    taskDesignContext: () => ({
      theme: "TRAVEL",
      sceneIntent,
      aspectRatio: "16:9",
      modelId: "TEST-MODEL",
      modelVersion: "1"
    }),
    userRequest: "Create an automated travel wallpaper.",
    runtimeFactory: task => {
      const runtime = new ProductionWorkerRuntime({
        store: new JsonStateStore(path.join(dir, task.taskId + ".json")),
        generator,
        designer: new DeterministicWallpaperDesigner(),
        visualEvaluator: { evaluate: () => ({ result: "VISUAL_DESIGN_ADHERENCE_PASS" }) },
        workerId: "PHASE22_WORKER",
        leaseDurationMs: 1000
      });
      runtimes.set(task.taskId, runtime);
      return runtime;
    }
  });
  return { controller, tasks, generator, runtimes, batchStore };
}

// Full happy path with one bounded FAILED recovery in the middle.
{
  const { controller, tasks, generator, runtimes } =
    makeController(["SUCCESS", "FAILED", "SUCCESS", "SUCCESS"]);
  const first = controller.start();
  assert.equal(first.action, "RETRY_READY");
  assert.equal(controller.batchRecord.completedCount, 1);
  assert.equal(tasks[0].status, "SUCCESS");
  assert.equal(tasks[1].taskId, "IMAGE-02");

  const final = controller.retryCurrentTask();
  assert.equal(final.action, "BATCH_COMPLETE");
  assert.equal(controller.batchRecord.completedCount, 3);
  assert.equal(controller.batchRecord.sessionStatus, "COMPLETED");
  assert.equal(controller.batchRecord.checkpointVersion, 3);
  assert.deepEqual(tasks.map(t => t.status), ["SUCCESS", "SUCCESS", "SUCCESS"]);
  assert.equal(generator.calls, 4);

  for (const task of tasks) {
    const state = runtimes.get(task.taskId).requireState();
    assert.equal(state.taskStatus, "SUCCESS");
    assert.equal(state.recovery, "TERMINAL_SUCCESS");
    assert.equal(state.leaseUntil, null);
    assert.ok(state.lockedPrompt);
    assert.ok(state.promptHash);
    assert.equal(state.promptHash, sha256(state.lockedPrompt));
    assert.ok(state.executionContext);
    assert.equal(state.executionContextHash, sha256(JSON.stringify(state.executionContext)));
    assert.equal(state.visualAdherenceResult, "VISUAL_DESIGN_ADHERENCE_PASS");
  }

  const retryState = runtimes.get("IMAGE-02").requireState();
  assert.equal(retryState.attemptCount, 2);
  assert.equal(retryState.events.filter(e => e.type === "GENERATION_EXECUTION").length, 2);
}

// UNKNOWN must stop the entire automated lifecycle and never advance.
{
  const { controller, tasks, generator } = makeController(["SUCCESS", "UNKNOWN", "SUCCESS"]);
  const result = controller.start();
  assert.equal(result.action, "RECOVERY_REQUIRED");
  assert.equal(controller.batchRecord.sessionStatus, "STOPPED");
  assert.equal(controller.batchRecord.terminationStatus, "TERMINAL");
  assert.equal(controller.batchRecord.stopReason, "UNKNOWN_RECOVERY_REQUIRED");
  assert.deepEqual(tasks.map(t => t.status), ["SUCCESS", "QUEUED", "QUEUED"]);
  assert.equal(generator.calls, 2);
}

console.log("Runtime Verification Phase-22 full production runtime E2E: PASS");
console.log("PASS design -> prompt lock -> execution context lock -> generation -> visual adherence -> checkpoint");
console.log("PASS automatic continuation reaches every authoritative task without a continuation command");
console.log("PASS bounded FAILED recovery retries the same task identity and then continues");
console.log("PASS successful tasks release their lease and become terminal");
console.log("PASS UNKNOWN stops the lifecycle and never advances to a later task");
