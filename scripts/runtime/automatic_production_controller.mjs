#!/usr/bin/env node

import crypto from "node:crypto";

export class AutomaticProductionController {
  constructor({
    batchRecord,
    runtimeFactory,
    taskResolver,
    taskDesignContext,
    userRequest,
    clock = () => Date.now()
  }) {
    this.batchRecord = batchRecord;
    this.runtimeFactory = runtimeFactory;
    this.taskResolver = taskResolver;
    this.taskDesignContext = taskDesignContext;
    this.userRequest = userRequest;
    this.clock = clock;
    this.events = [];
  }

  start() {
    if (this.batchRecord.sessionStatus !== "ACTIVE" || this.batchRecord.terminationStatus === "TERMINAL") {
      throw new Error("BATCH_NOT_ACTIVE");
    }
    this.events.push({ type: "AUTOMATED_BATCH_STARTED", at: this.clock(), batchId: this.batchRecord.batchId });
    return this.dispatchNext();
  }

  dispatchNext() {
    if (this.batchRecord.completedCount >= this.batchRecord.targetCount) {
      this.batchRecord.sessionStatus = "COMPLETED";
      this.events.push({ type: "SESSION_TERMINATED", reason: "COMPLETED", at: this.clock() });
      return { action: "BATCH_COMPLETE" };
    }

    const task = this.taskResolver(this.batchRecord);
    if (!task) {
      this.batchRecord.sessionStatus = "RECOVERY_REQUIRED";
      this.events.push({ type: "SESSION_TERMINATED", reason: "AUTHORITATIVE_TASK_UNRESOLVED", at: this.clock() });
      return { action: "RECOVERY_REQUIRED" };
    }
    if (task.status !== "QUEUED") throw new Error("AUTHORITATIVE_TASK_NOT_QUEUED");

    const runtime = this.runtimeFactory(task);
    runtime.request({
      traceRunId: crypto.randomUUID(),
      automationRunId: this.batchRecord.automationRunId,
      module: this.batchRecord.module,
      productionType: this.batchRecord.productionType,
      outputType: this.batchRecord.outputType,
      batchId: this.batchRecord.batchId,
      taskId: task.taskId,
      // Runtime task scope is one validated output; batch scope is owned by this controller/Batch Record.
      targetCount: 1,
      completedCount: 0,
      mode: "AUTOMATED"
    });
    runtime.claim();
    runtime.designFromRequest(this.userRequest, this.taskDesignContext(task));
    runtime.authorizeAutomatedGeneration();

    const result = runtime.execute();
    this.events.push({ type: "TASK_RESULT", taskId: task.taskId, result: result.result, at: this.clock() });

    if (result.taskStatus === "SUCCESS") {
      task.status = "SUCCESS";
      this.batchRecord.completedCount++;
      this.batchRecord.currentTaskId = task.taskId;
      this.batchRecord.checkpointVersion++;
      this.events.push({ type: "CHECKPOINT", taskId: task.taskId, completedCount: this.batchRecord.completedCount, at: this.clock() });

      if (this.batchRecord.completedCount < this.batchRecord.targetCount) {
        return this.dispatchNext();
      }

      this.batchRecord.sessionStatus = "COMPLETED";
      this.events.push({ type: "SESSION_TERMINATED", reason: "COMPLETED", at: this.clock() });
      return { action: "BATCH_COMPLETE", result };
    }

    this.batchRecord.sessionStatus = "RECOVERY_REQUIRED";
    this.batchRecord.stopReason = result.result === "UNKNOWN"
      ? "UNKNOWN_RECOVERY_REQUIRED"
      : "GENERATION_FAILURE_RECOVERY_REQUIRED";
    this.events.push({ type: "SESSION_TERMINATED", reason: this.batchRecord.sessionStatus, at: this.clock() });
    return { action: "RECOVERY_REQUIRED", result };
  }
}
