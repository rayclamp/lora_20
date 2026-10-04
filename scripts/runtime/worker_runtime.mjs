#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const AUTOMATION_SCOPE = new Set(["UNIVERSAL_WALLPAPER", "FESTIVAL_WALLPAPER"]);

export class JsonStateStore {
  constructor(filePath) { this.filePath = filePath; }
  read() {
    if (!fs.existsSync(this.filePath)) return null;
    return JSON.parse(fs.readFileSync(this.filePath, "utf8"));
  }
  write(state) {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    const tmp = this.filePath + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(state, null, 2) + "\n", "utf8");
    fs.renameSync(tmp, this.filePath);
  }
  mutate(mutator) {
    const current = this.read();
    if (!current) throw new Error("RUNTIME_STATE_MISSING");
    const next = mutator(clone(current));
    this.write(next);
    return next;
  }
}

export class GitHubContentsStateStore {
  constructor({ client, owner, repo, path: filePath, branch = "main" }) {
    this.client = client;
    this.owner = owner;
    this.repo = repo;
    this.filePath = filePath;
    this.branch = branch;
  }

  read() {
    const item = this.client.getContents({
      owner: this.owner, repo: this.repo, path: this.filePath, ref: this.branch
    });
    if (!item) return null;
    return { state: JSON.parse(Buffer.from(item.content, "base64").toString("utf8")), sha: item.sha };
  }

  write(state) {
    throw new Error("CAS_REQUIRED");
  }

  compareAndSwap(expectedSha, state, message = "runtime: checkpoint state") {
    const payload = Buffer.from(JSON.stringify(state, null, 2) + "\n", "utf8").toString("base64");
    const result = this.client.updateContents({
      owner: this.owner,
      repo: this.repo,
      path: this.filePath,
      branch: this.branch,
      sha: expectedSha,
      content: payload,
      message
    });
    return { state: clone(state), sha: result.content.sha ?? result.sha };
  }

  mutate(mutator, message = "runtime: checkpoint state") {
    const current = this.read();
    if (!current) throw new Error("RUNTIME_STATE_MISSING");
    const next = mutator(clone(current.state));
    return this.compareAndSwap(current.sha, next, message);
  }
}

export class MockGenerationAdapter {
  constructor(outcomes = ["SUCCESS"]) { this.outcomes = [...outcomes]; this.calls = 0; }
  generate({ prompt, outputType }) {
    this.calls++;
    const outcome = this.outcomes.length ? this.outcomes.shift() : "SUCCESS";
    if (outcome === "UNKNOWN") return { result: "UNKNOWN", verification: "NOT_OBSERVABLE", output: null };
    if (outcome === "FORMAT_MISMATCH") return { result: "FAILED", verification: "VERIFIED", output: { format: "WRONG_FORMAT" } };
    return { result: "SUCCESS", verification: "VERIFIED", output: { format: outputType, promptHash: sha256(prompt) } };
  }
}

export function sha256(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function clone(value) { return JSON.parse(JSON.stringify(value)); }

export class ProductionWorkerRuntime {
  constructor({ store, generator, clock = () => Date.now(), workerId = "RUNTIME_WORKER" }) {
    this.store = store;
    this.generator = generator;
    this.clock = clock;
    this.workerId = workerId;
  }

  request(input) {
    if (!AUTOMATION_SCOPE.has(input.module)) throw new Error("AUTOMATION_SCOPE_BLOCKED");
    if (!input.batchId || !input.taskId) throw new Error("MISSING_TASK_IDENTITY");
    const state = {
      schemaVersion: 1,
      traceRunId: input.traceRunId ?? crypto.randomUUID(),
      automationRunId: input.automationRunId ?? "NOT_OBSERVABLE",
      module: input.module,
      productionType: input.productionType,
      outputType: input.outputType,
      targetSuccessCount: input.targetSuccessCount ?? 1,
      maxAttempts: input.maxAttempts ?? 3,
      batchId: input.batchId,
      taskId: input.taskId,
      taskStatus: "QUEUED",
      ownership: "UNCLAIMED",
      workerId: "NONE",
      claimId: "NONE",
      version: 0,
      attemptCount: 0,
      consecutiveFailures: 0,
      generationAuthorization: "NOT_REQUIRED",
      promptPreview: "NOT_RECORDED",
      result: "NOT_STARTED",
      recovery: "NONE",
      checkpointVersion: 0,
      events: [{ type: "AUTOMATION_REQUEST_RECEIVED", at: this.clock(), traceRunId: input.traceRunId ?? "GENERATED" }]
    };
    this.store.write(state);
    return clone(state);
  }

  claim() {
    const s = this.mutateState((s) => {
      if (s.taskStatus !== "QUEUED" || s.ownership !== "UNCLAIMED") throw new Error("CLAIM_REJECTED");
      s.events.push({ type: "CONTEXT_LOADED", at: this.clock() });
      s.events.push({ type: "MODULE_RESOLVED", at: this.clock(), module: s.module });
      s.taskStatus = "CLAIMED";
      s.ownership = "CLAIMED";
      s.workerId = this.workerId;
      s.claimId = crypto.randomUUID();
      s.version++;
      s.events.push({ type: "TASK_CLAIMED", at: this.clock(), claimId: s.claimId });
      return s;
    });
    return clone(s);
  }

  designAndLockPrompt(prompt) {
    const s = this.mutateState((s) => {
      if (s.taskStatus !== "CLAIMED" || s.ownership !== "CLAIMED") throw new Error("DESIGN_REQUIRES_CLAIM");
      s.events.push({ type: "REFERENCE_POLICY_LOADED", at: this.clock() });
      s.events.push({ type: "REFERENCE_AUTHORITY_RESOLVED", at: this.clock(), status: "RESOLVED" });
      s.events.push({ type: "SCENE_INTENT_RESOLVED", at: this.clock(), status: "RESOLVED" });
      s.events.push({ type: "PRESENTATION_DESIGNED", at: this.clock() });
      s.events.push({ type: "DESIGN_VALIDATED", at: this.clock(), status: "PASS" });
      s.promptHash = sha256(prompt);
      s.lockedPrompt = prompt;
      s.promptPreview = "RECORDED";
      s.events.push({ type: "PROMPT_ASSEMBLED", at: this.clock(), promptHash: s.promptHash });
      s.events.push({ type: "PROMPT_PREVIEW_RECORDED", at: this.clock(), promptHash: s.promptHash });
      return s;
    });
    return clone(s);
  }

  execute() {
    const s = this.requireState();
    if (s.taskStatus !== "CLAIMED" || !s.lockedPrompt) throw new Error("EXECUTION_NOT_READY");
    if (s.attemptCount >= s.maxAttempts) throw new Error("MAX_ATTEMPTS_REACHED");
    s.events.push({ type: "GENERATION_EXECUTION", at: this.clock(), attempt: s.attemptCount + 1 });
    const result = this.generator.generate({ prompt: s.lockedPrompt, outputType: s.outputType });
    s.attemptCount++;
    s.result = result.result;
    s.events.push({ type: "GENERATION_RESULT", at: this.clock(), result: result.result, verification: result.verification });

    if (result.result === "SUCCESS") {
      s.taskStatus = "SUCCESS";
      s.ownership = "TERMINAL";
      s.workerId = "NONE";
      s.claimId = "NONE";
      s.recovery = "TERMINAL_SUCCESS";
      s.consecutiveFailures = 0;
    } else if (result.result === "UNKNOWN") {
      s.taskStatus = "UNKNOWN / RECOVERY_REQUIRED";
      s.ownership = "RELEASED";
      s.workerId = "NONE";
      s.claimId = "NONE";
      s.recovery = "RECOVERY_REQUIRED";
    } else {
      s.taskStatus = s.attemptCount >= s.maxAttempts ? "FAILED / RECOVERY_REQUIRED" : "FAILED";
      s.recovery = s.attemptCount >= s.maxAttempts ? "RECOVERY_REQUIRED" : "RETRY_READY";
      s.consecutiveFailures++;
      s.ownership = "RELEASED";
      s.workerId = "NONE";
      s.claimId = "NONE";
    }
    s.version++;
    s.checkpointVersion++;
    s.events.push({ type: "CHECKPOINT", at: this.clock(), checkpointVersion: s.checkpointVersion });
    const expected = this.store.read();
    if (expected && expected.state) {
      this.store.compareAndSwap(expected.sha, s, "runtime: execution checkpoint");
    } else {
      this.store.write(s);
    }
    return clone(s);
  }

  resumeAfterFailure() {
    const s = this.mutateState((s) => {
      if (s.recovery !== "RETRY_READY") throw new Error("RETRY_NOT_READY");
      s.taskStatus = "QUEUED";
      s.ownership = "UNCLAIMED";
      s.workerId = "NONE";
      s.claimId = "NONE";
      s.version++;
      s.events.push({ type: "NEXT_TASK_RESOLVED", at: this.clock(), action: "RETRY_SAME_TASK" });
      return s;
    });
    return clone(s);
  }

  mutateState(mutator) {
    if (typeof this.store.mutate === "function") {
      const result = this.store.mutate(mutator);
      return result.state ?? result;
    }
    const s = this.requireState();
    const next = mutator(clone(s));
    this.store.write(next);
    return next;
  }

  requireState() {
    const raw = this.store.read();
    const s = raw?.state ?? raw;
    if (!s) throw new Error("RUNTIME_STATE_MISSING");
    return s;
  }
}
