#!/usr/bin/env node

import crypto from "node:crypto";

export class AutomaticProductionController {
  constructor({
    batchRecord,
    runtimeFactory,
    taskResolver,
    taskDesignContext,
    userRequest,
    batchStore = null,
    clock = () => Date.now()
  }) {
    this.batchRecord = batchRecord;
    this.runtimeFactory = runtimeFactory;
    this.taskResolver = taskResolver;
    this.taskDesignContext = taskDesignContext;
    this.userRequest = userRequest;
    this.batchStore = batchStore;
    this.clock = clock;
    this.events = [];
    this.runtimeByTask = new Map();
  }

  loadAuthoritativeBatch() {
    if (!this.batchStore || typeof this.batchStore.read !== "function") {
      throw new Error("AUTHORITATIVE_BATCH_STORE_REQUIRED");
    }
    const current = this.batchStore.read();
    if (!current?.state) throw new Error("BATCH_RECORD_MISSING");
    this.batchRecord = current.state;
    this.batchSha = current.sha;
    return this.batchRecord;
  }

  checkpointBatch(message = "production: checkpoint batch record") {
    if (!this.batchStore || typeof this.batchStore.compareAndSwap !== "function") {
      throw new Error("AUTHORITATIVE_BATCH_STORE_REQUIRED");
    }
    const saved = this.batchStore.compareAndSwap(this.batchSha, this.batchRecord, message);
    this.batchRecord = saved.state;
    this.batchSha = saved.sha;
    return this.batchRecord;
  }

  start() {
    this.loadAuthoritativeBatch();
    if (this.batchRecord.sessionStatus !== "ACTIVE" || this.batchRecord.terminationStatus === "TERMINAL") {
      throw new Error("BATCH_NOT_ACTIVE");
    }
    this.events.push({ type: "AUTOMATED_BATCH_STARTED", at: this.clock(), batchId: this.batchRecord.batchId });
    this.checkpointBatch("production: batch started");
    return this.dispatchNext();
  }

  stop(reason = "USER_STOP") {
    this.batchRecord.sessionStatus = "STOPPED";
    this.batchRecord.stopReason = reason;
    this.batchRecord.terminationStatus = "TERMINAL";
    this.events.push({ type: "SESSION_TERMINATED", reason, at: this.clock() });
    this.checkpointBatch("production: session stopped");
    return { action: "STOPPED", reason };
  }

  dispatchNext() {
    this.loadAuthoritativeBatch();
    if (this.batchRecord.completedCount >= this.batchRecord.targetCount) {
      this.batchRecord.sessionStatus = "COMPLETED";
      this.events.push({ type: "SESSION_TERMINATED", reason: "COMPLETED", at: this.clock() });
      this.checkpointBatch("production: batch completed");
      return { action: "BATCH_COMPLETE" };
    }

    const task = this.taskResolver(this.batchRecord);
    if (!task) {
      this.batchRecord.sessionStatus = "RECOVERY_REQUIRED";
      this.events.push({ type: "SESSION_TERMINATED", reason: "AUTHORITATIVE_TASK_UNRESOLVED", at: this.clock() });
      this.checkpointBatch("production: task resolution recovery");
      return { action: "RECOVERY_REQUIRED" };
    }
    if (task.status !== "QUEUED") throw new Error("AUTHORITATIVE_TASK_NOT_QUEUED");

    const existingRuntime = this.runtimeByTask.get(task.taskId);
    const runtime = existingRuntime ?? this.runtimeFactory(task);
    this.runtimeByTask.set(task.taskId, runtime);
    if (!existingRuntime) runtime.request({
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
    if (!existingRuntime) {
      runtime.designFromRequest(this.userRequest, this.taskDesignContext(task));
      runtime.authorizeAutomatedGeneration();
    }

    const result = runtime.execute();
    this.events.push({ type: "TASK_RESULT", taskId: task.taskId, result: result.result, at: this.clock() });

    if (result.taskStatus === "SUCCESS") {
      task.status = "SUCCESS";
      this.batchRecord.completedCount++;
      this.batchRecord.currentTaskId = task.taskId;
      this.batchRecord.checkpointVersion++;
      this.events.push({ type: "CHECKPOINT", taskId: task.taskId, completedCount: this.batchRecord.completedCount, at: this.clock() });
      this.checkpointBatch("production: task success checkpoint");

      if (this.batchRecord.completedCount < this.batchRecord.targetCount) {
        return this.dispatchNext();
      }

      this.batchRecord.sessionStatus = "COMPLETED";
      this.events.push({ type: "SESSION_TERMINATED", reason: "COMPLETED", at: this.clock() });
      this.checkpointBatch("production: batch completed");
      return { action: "BATCH_COMPLETE", result };
    }

    if (result.result === "FAILED" && result.recovery === "RETRY_READY" && result.attemptCount < result.maxAttempts) {
      task.status = "FAILED";
      task.recoveryStatus = "RETRY_READY";
      task.attemptCount = result.attemptCount;
      task.consecutiveFailures = result.consecutiveFailures;
      task.lastFailureReason = result.failureReason ?? "GENERATION_FAILED";
      this.batchRecord.sessionStatus = "RECOVERY_REQUIRED";
      this.batchRecord.stopReason = "RETRY_READY";
      this.batchRecord.currentTaskId = task.taskId;
      this.events.push({ type: "RECOVERY_REQUIRED", taskId: task.taskId, reason: "RETRY_READY", attemptCount: task.attemptCount, at: this.clock() });
      this.checkpointBatch("production: retry ready checkpoint");
      return { action: "RETRY_READY", result };
    }

    this.batchRecord.sessionStatus = "STOPPED";
    this.batchRecord.stopReason = result.result === "UNKNOWN"
      ? "UNKNOWN_RECOVERY_REQUIRED"
      : "REPEATED_FAILURE";
    this.batchRecord.terminationStatus = "TERMINAL";
    this.events.push({ type: "SESSION_TERMINATED", reason: this.batchRecord.stopReason, at: this.clock() });
    this.checkpointBatch("production: recovery required checkpoint");
    return { action: "RECOVERY_REQUIRED", result };
  }

  retryCurrentTask() {
    this.loadAuthoritativeBatch();
    if (this.batchRecord.sessionStatus !== "RECOVERY_REQUIRED" || this.batchRecord.stopReason !== "RETRY_READY") {
      throw new Error("RETRY_NOT_READY");
    }
    const task = this.taskResolver(this.batchRecord, { taskId: this.batchRecord.currentTaskId, recovery: "RETRY_READY" });
    if (!task || task.taskId !== this.batchRecord.currentTaskId) throw new Error("RETRY_TASK_NOT_RESOLVED");
    if (task.recoveryStatus !== "RETRY_READY") throw new Error("RETRY_TASK_NOT_READY");
    const runtime = this.runtimeByTask.get(task.taskId);
    if (!runtime || typeof runtime.resumeAfterFailure !== "function") throw new Error("RETRY_RUNTIME_STATE_MISSING");
    runtime.resumeAfterFailure();
    task.status = "QUEUED";
    task.recoveryStatus = "NONE";
    this.events.push({ type: "RETRY_AUTHORIZED", taskId: task.taskId, attemptCount: task.attemptCount, at: this.clock() });
    this.batchRecord.sessionStatus = "ACTIVE";
    this.batchRecord.stopReason = "NONE";
    this.checkpointBatch("production: retry authorized");
    return this.dispatchNext();
  }
}
