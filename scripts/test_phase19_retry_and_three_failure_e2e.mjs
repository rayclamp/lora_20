#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime, MockGenerationAdapter } from "./runtime/worker_runtime.mjs";
import { DeterministicWallpaperDesigner } from "./runtime/production_designer.mjs";
import { AutomaticProductionController } from "./runtime/automatic_production_controller.mjs";

function makeE2E(outcomes) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lora20-phase19-"));
  const tasks = [{ taskId: "IMAGE-01", status: "QUEUED" }, { taskId: "IMAGE-02", status: "QUEUED" }];
  const generator = new MockGenerationAdapter(outcomes);
  const runtimes = new Map();
  const controller = new AutomaticProductionController({
    batchRecord: {
      batchId: "RV-PHASE19-BATCH", automationRunId: "RV-PHASE19-AUTO",
      module: "UNIVERSAL_WALLPAPER", productionType: "AUTOMATED",
      outputType: "DESKTOP_WALLPAPER", targetCount: 2, completedCount: 0,
      currentTaskId: "NONE", checkpointVersion: 0, sessionStatus: "ACTIVE"
    },
    taskResolver: (batch, hint) => hint?.taskId
      ? tasks.find(t => t.taskId === hint.taskId) ?? null
      : tasks.find(t => t.status === "QUEUED") ?? null,
    taskDesignContext: () => ({
      theme: "TRAVEL",
      sceneIntent: { status: "EXPLICIT", fields: {
        ACTIVITY: "TRAVEL", LOCATION: "CITY_STREET", ACTION: "WALKING",
        TIME: "DAY", WEATHER: "CLEAR", SOCIAL_CONTEXT: "ALONE", ENVIRONMENTAL_CUES: "URBAN_SCENERY"
      }}
    }),
    userRequest: "Create a travel wallpaper.",
    runtimeFactory: task => {
      const runtime = new ProductionWorkerRuntime({
        store: new JsonStateStore(path.join(dir, task.taskId + ".json")),
        generator, designer: new DeterministicWallpaperDesigner(),
        visualEvaluator: { evaluate: () => ({ result: "VISUAL_DESIGN_ADHERENCE_PASS" }) },
        workerId: "PHASE19_WORKER"
      });
      runtimes.set(task.taskId, runtime);
      return runtime;
    }
  });
  return { controller, tasks, generator, runtimes };
}

// One FAILED attempt is retryable, but retry MUST reuse IMAGE-01 and its locked task state.
{
  const { controller, tasks, generator, runtimes } = makeE2E(["FAILED", "SUCCESS", "SUCCESS"]);
  const first = controller.start();
  assert.equal(first.action, "RETRY_READY");
  assert.equal(controller.batchRecord.currentTaskId, "IMAGE-01");
  assert.equal(tasks[0].status, "FAILED");
  assert.equal(tasks[0].attemptCount, 1);
  assert.equal(generator.calls, 1);

  const second = controller.retryCurrentTask();
  assert.equal(second.action, "BATCH_COMPLETE");
  assert.deepEqual(tasks.map(t => t.status), ["SUCCESS", "SUCCESS"]);
  assert.equal(generator.calls, 3);
  assert.equal(new Set([...runtimes.keys()]).size, 2);
  assert.equal(controller.events.filter(e => e.type === "RETRY_AUTHORIZED").length, 1);

  const state = runtimes.get("IMAGE-01").requireState();
  assert.equal(state.taskId, "IMAGE-01");
  assert.equal(state.attemptCount, 2);
  assert.equal(state.consecutiveFailures, 0);
  assert.equal(state.recovery, "TERMINAL_SUCCESS");
  assert.equal(state.events.filter(e => e.type === "GENERATION_EXECUTION").length, 2);
}

// Three consecutive FAILED attempts must become terminal recovery and never reach IMAGE-02.
{
  const { controller, tasks, generator } = makeE2E(["FAILED", "FAILED", "FAILED", "SUCCESS"]);
  assert.equal(controller.start().action, "RETRY_READY");
  assert.equal(controller.retryCurrentTask().action, "RETRY_READY");
  const terminal = controller.retryCurrentTask();
  assert.equal(terminal.action, "RECOVERY_REQUIRED");
  assert.equal(controller.batchRecord.sessionStatus, "STOPPED");
  assert.equal(controller.batchRecord.terminationStatus, "TERMINAL");
  assert.equal(controller.batchRecord.stopReason, "REPEATED_FAILURE");
  assert.equal(tasks[0].status, "FAILED");
  assert.equal(tasks[1].status, "QUEUED");
  assert.equal(generator.calls, 3);
}

// Retry does not create a new task identity.
{
  const { controller, tasks } = makeE2E(["FAILED", "SUCCESS", "SUCCESS"]);
  controller.start();
  const before = tasks.map(t => t.taskId);
  controller.retryCurrentTask();
  assert.deepEqual(tasks.map(t => t.taskId), before);
}

console.log("Runtime Verification Phase-19 retry and three-failure recovery E2E: PASS");
console.log("PASS FAILED + RETRY_READY retries the same TASK_ID/IMAGE_ID");
console.log("PASS locked task state survives retry; no new design identity is created");
console.log("PASS successful retry resets consecutive failure count and completes the task");
console.log("PASS third consecutive failure reaches terminal RECOVERY_REQUIRED and never advances");
