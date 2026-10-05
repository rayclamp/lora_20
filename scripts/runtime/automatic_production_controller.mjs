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
    promptPreviewSink = null,
    requireUserVisiblePromptPreview = false,
    clock = () => Date.now()
  }) {
    this.batchRecord = batchRecord;
    this.runtimeFactory = runtimeFactory;
    this.taskResolver = taskResolver;
    this.taskDesignContext = taskDesignContext;
    this.userRequest = userRequest;
    this.batchStore = batchStore;
    this.promptPreviewSink = promptPreviewSink;
    this.requireUserVisiblePromptPreview = requireUserVisiblePromptPreview;
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
    // ACTIVE is already authoritative batch state. Do not write a redundant start checkpoint:
    // another controller may concurrently own the task, and an unnecessary write would rotate
    // the Batch Record SHA and fence the legitimate controller mid-execution.
    return this.dispatchNext();
  }

  stop(reason = "USER_STOP") {
    this.loadAuthoritativeBatch();
    this.batchRecord.sessionStatus = "STOPPED";
    this.batchRecord.stopReason = reason;
    this.batchRecord.terminationStatus = "TERMINAL";
    this.events.push({ type: "SESSION_TERMINATED", reason, at: this.clock() });
    this.checkpointBatch("production: session stopped");
    return { action: "STOPPED", reason };
  }

  reconcilePersistedTaskState(task, runtime) {
    if (!runtime?.store || typeof runtime.store.read !== "function") return null;
    const snapshot = runtime.store.read();
    if (!snapshot) return null;
    const state = snapshot.state ?? snapshot;
    if (state.batchId !== this.batchRecord.batchId || state.taskId !== task.taskId) {
      throw new Error("TASK_IDENTITY_CONFLICT");
    }

    if (state.taskStatus === "SUCCESS") {
      if (task.status === "SUCCESS") return { action: "ALREADY_RECONCILED" };
      task.status = "SUCCESS";
      task.recoveryStatus = "NONE";
      task.attemptCount = state.attemptCount ?? task.attemptCount ?? 0;
      task.consecutiveFailures = 0;
      task.lastFailureReason = "NONE";
      this.batchRecord.completedCount++;
      this.batchRecord.currentTaskId = task.taskId;
      this.batchRecord.checkpointVersion++;
      if (this.batchRecord.completedCount >= this.batchRecord.targetCount) {
        this.batchRecord.sessionStatus = "COMPLETED";
        this.batchRecord.stopReason = "NONE";
      }
      this.checkpointBatch("production: reconcile persisted task success");
      return { action: this.batchRecord.sessionStatus === "COMPLETED" ? "BATCH_COMPLETE" : "TASK_RECONCILED" };
    }

    if (state.taskStatus === "FAILED" && state.recovery === "RETRY_READY") {
      task.status = "FAILED";
      task.recoveryStatus = "RETRY_READY";
      task.attemptCount = state.attemptCount ?? task.attemptCount ?? 0;
      task.consecutiveFailures = state.consecutiveFailures ?? task.consecutiveFailures ?? 0;
      task.lastFailureReason = state.lastFailureReason ?? state.failureReason ?? "GENERATION_FAILED";
      this.batchRecord.sessionStatus = "RECOVERY_REQUIRED";
      this.batchRecord.stopReason = "RETRY_READY";
      this.batchRecord.currentTaskId = task.taskId;
      this.checkpointBatch("production: reconcile persisted retry state");
      return { action: "RETRY_READY" };
    }

    if (String(state.taskStatus).startsWith("UNKNOWN")) {
      this.batchRecord.sessionStatus = "STOPPED";
      this.batchRecord.stopReason = "UNKNOWN_RECOVERY_REQUIRED";
      this.batchRecord.terminationStatus = "TERMINAL";
      task.status = "UNKNOWN";
      task.recoveryStatus = "RECOVERY_REQUIRED";
      this.checkpointBatch("production: reconcile persisted unknown state");
      return { action: "RECOVERY_REQUIRED" };
    }

    return null;
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

    const reconciled = this.reconcilePersistedTaskState(task, runtime);
    if (reconciled) {
      if (reconciled.action === "BATCH_COMPLETE") {
        this.events.push({ type: "SESSION_TERMINATED", reason: "COMPLETED", at: this.clock() });
        return { action: "BATCH_COMPLETE" };
      }
      return reconciled;
    }

    if (!existingRuntime) {
      try {
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
          artifactPersistenceRequired: this.batchRecord.artifactPersistenceRequired === true,
          mode: "AUTOMATED"
        });
      } catch (error) {
        // A second controller may discover the same authoritative task while its task
        // state is already leased. Reuse the existing state and let Claim/CAS fence it.
        if (error?.message !== "FILE_ALREADY_EXISTS") throw error;
      }
    }
    runtime.claim();
    if (!existingRuntime) {
      const baseDesignContext = this.taskDesignContext(task) ?? {};
      const priorDesigns = Array.isArray(baseDesignContext.designFreshness?.previousDesigns)
        ? [...baseDesignContext.designFreshness.previousDesigns]
        : [];
      for (const [priorTaskId, priorRuntime] of this.runtimeByTask.entries()) {
        if (priorTaskId === task.taskId || typeof priorRuntime?.store?.read !== "function") continue;
        const priorSnapshot = priorRuntime.store.read();
        const priorState = priorSnapshot?.state ?? priorSnapshot;
        if (priorState?.design && priorState?.taskStatus === "SUCCESS") {
          priorDesigns.push({
            taskId: priorState.taskId,
            design: priorState.design,
            prompt: priorState.lockedPrompt ?? null,
            promptHash: priorState.promptHash ?? null
          });
        }
      }
      const designContext = {
        ...baseDesignContext,
        designFreshness: {
          enabled: baseDesignContext.designFreshness?.enabled ?? true,
          ...(baseDesignContext.designFreshness ?? {}),
          previousDesigns: priorDesigns
        }
      };
      runtime.designFromRequest(this.userRequest, designContext);
      const designedState = runtime.store.read()?.state ?? runtime.store.read();
      const preview = {
        batchId: this.batchRecord.batchId,
        taskId: task.taskId,
        prompt: designedState?.lockedPrompt,
        promptHash: designedState?.promptHash,
        design: designedState?.design
      };
      if (this.requireUserVisiblePromptPreview && typeof this.promptPreviewSink !== "function") {
        throw new Error("AUTOMATED_USER_VISIBLE_PROMPT_PREVIEW_SINK_REQUIRED");
      }
      if (typeof this.promptPreviewSink === "function") {
        const visible = this.promptPreviewSink(preview);
        if (visible === false) throw new Error("AUTOMATED_USER_VISIBLE_PROMPT_PREVIEW_REJECTED");
        runtime.mutateState((s) => {
          s.promptPreviewDelivery = "USER_VISIBLE";
          s.events.push({ type: "PROMPT_PREVIEW_USER_VISIBLE", at: this.clock(), promptHash: s.promptHash });
          return s;
        });
      }
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

    if (result.taskStatus === "FAILED" || result.result === "FAILED") {
      task.status = "FAILED";
      task.recoveryStatus = "TERMINAL";
      task.attemptCount = result.attemptCount;
      task.consecutiveFailures = result.consecutiveFailures;
      task.lastFailureReason = result.failureReason ?? "GENERATION_FAILED";
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
    let runtime = this.runtimeByTask.get(task.taskId);
    if (!runtime) {
      runtime = this.runtimeFactory(task);
      this.runtimeByTask.set(task.taskId, runtime);
    }
    if (typeof runtime.resumeAfterFailure !== "function") throw new Error("RETRY_RUNTIME_STATE_MISSING");
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
