#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { CanonicalContextResolver } from "./canonical_context_resolver.mjs";
import { assertProductionProviderEligible } from "./provider_registry_gate.mjs";

export const AUTOMATION_SCOPE = new Set(["UNIVERSAL_WALLPAPER", "FESTIVAL_WALLPAPER"]);
export const REQUIRED_SCENE_INTENT_FIELDS = [
  "ACTIVITY", "LOCATION", "ACTION", "TIME", "WEATHER",
  "SOCIAL_CONTEXT", "ENVIRONMENTAL_CUES"
];
export const REFERENCE_STATES = new Set([
  "EXPLICIT_TASK_REFERENCE", "MODULE_APPROVED_REFERENCE", "NO_REFERENCE", "REFERENCE_BLOCKED"
]);
export const SCENE_INTENT_STATES = new Set(["EXPLICIT", "RESOLVED", "MISSING", "CONFLICT", "BLOCKED"]);

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

  create(state, message = "runtime: create task state") {
    const payload = Buffer.from(JSON.stringify(state, null, 2) + "\n", "utf8").toString("base64");
    const result = this.client.updateContents({
      owner: this.owner,
      repo: this.repo,
      path: this.filePath,
      branch: this.branch,
      content: payload,
      message
    });
    return { state: clone(state), sha: result.content.sha ?? result.sha };
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
  constructor({ store, generator, designer = null, clock = () => Date.now(), workerId = "RUNTIME_WORKER", contextResolver = null, liveExecution = false, providerRegistration = null }) {
    this.store = store;
    this.generator = generator;
    this.designer = designer;
    this.liveExecution = liveExecution;
    this.providerRegistration = providerRegistration;
    this.clock = clock;
    this.workerId = workerId;
    this.contextResolver = contextResolver;
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
      promptPreview: "NOT_RECORDED",
      result: "NOT_STARTED",
      recovery: "NONE",
      mode: input.mode ?? "AUTOMATED",
      userRequest: input.userRequest ?? "NOT_PROVIDED",
      design: null,
      generationAuthorization: input.mode === "MANUAL" ? "WAITING_USER_CONFIRMATION" : "WAITING_AUTOMATION_EXECUTION",
      checkpointVersion: 0,
      events: [{ type: input.mode === "MANUAL" ? "USER_REQUEST_RECEIVED" : "AUTOMATION_REQUEST_RECEIVED", at: this.clock(), traceRunId: input.traceRunId ?? "GENERATED" }]
    };
    if (typeof this.store.create === "function") this.store.create(state, "runtime: create task state");
    else this.store.write(state);
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

  designFromRequest(userRequest, context = {}) {
    if (!this.designer || typeof this.designer.design !== "function") throw new Error("SYSTEM_DESIGNER_REQUIRED");
    const state = this.requireState();
    const canonical = this.contextResolver
      ? this.contextResolver.resolve({
          module: state.module,
          reference: context.reference,
          referenceRequired: context.referenceRequired ?? false,
          theme: context.theme ?? "",
          sceneIntent: context.sceneIntent
        })
      : context;
    const designed = this.designer.design({ userRequest, state, context: canonical });
    if (!designed || typeof designed.prompt !== "string" || !designed.prompt.trim()) throw new Error("SYSTEM_PROMPT_REQUIRED");
    return this.designAndLockPrompt(designed.prompt, { ...canonical, design: designed.design, userRequest });
  }

  designAndLockPrompt(prompt, context = {}) {
    const canonical = this.contextResolver
      ? this.contextResolver.resolve({
          module: this.requireState().module,
          reference: context.reference,
          referenceRequired: context.referenceRequired ?? false,
          theme: context.theme ?? "",
          sceneIntent: context.sceneIntent
        })
      : null;
    const effectiveContext = canonical ?? context;

    const s = this.mutateState((s) => {
      if (s.taskStatus !== "CLAIMED" || s.ownership !== "CLAIMED") throw new Error("DESIGN_REQUIRES_CLAIM");
      const referenceState = effectiveContext.reference?.status ?? "NO_REFERENCE";
      if (!REFERENCE_STATES.has(referenceState)) throw new Error("REFERENCE_STATE_INVALID");
      if (referenceState === "REFERENCE_BLOCKED") throw new Error("REFERENCE_BLOCKED");
      const sceneStatus = effectiveContext.sceneIntent?.status;
      if (!SCENE_INTENT_STATES.has(sceneStatus)) throw new Error("SCENE_INTENT_STATUS_REQUIRED");
      if (sceneStatus === "MISSING" || sceneStatus === "CONFLICT" || sceneStatus === "BLOCKED") {
        throw new Error("SCENE_INTENT_BLOCKED");
      }
      const intent = effectiveContext.sceneIntent?.fields ?? {};
      for (const field of REQUIRED_SCENE_INTENT_FIELDS) {
        if (intent[field] === undefined || intent[field] === null || intent[field] === "") {
          throw new Error("SCENE_INTENT_INCOMPLETE");
        }
      }
      s.events.push({ type: "REFERENCE_POLICY_LOADED", at: this.clock() });
      s.events.push({
        type: "REFERENCE_AUTHORITY_RESOLVED", at: this.clock(),
        status: referenceState,
        referenceId: effectiveContext.reference?.id ?? "NOT_OBSERVABLE",
        provenance: effectiveContext.reference?.provenance ?? "NOT_OBSERVABLE",
        policyPath: effectiveContext.reference?.policyPath ?? "NOT_OBSERVABLE",
        verification: effectiveContext.reference?.verification ?? "NOT_OBSERVABLE"
      });
      s.events.push({
        type: "SCENE_INTENT_RESOLVED", at: this.clock(),
        status: sceneStatus,
        provenance: effectiveContext.sceneIntent?.provenance ?? "NOT_OBSERVABLE",
        fieldProvenance: effectiveContext.sceneIntent?.fieldProvenance ?? {},
        protocolPath: effectiveContext.sceneIntent?.sceneProtocolPath ?? "NOT_OBSERVABLE",
        fields: intent
      });
      if (context.userRequest !== undefined) s.userRequest = String(context.userRequest);
      if (context.design !== undefined) s.design = clone(context.design);
      s.events.push({ type: "PRESENTATION_DESIGNED", at: this.clock() });
      s.events.push({ type: "DESIGN_VALIDATED", at: this.clock(), status: "PASS" });
      s.promptHash = sha256(prompt);
      s.lockedPrompt = prompt;
      s.promptPreview = "RECORDED";
      s.events.push({ type: "PROMPT_ASSEMBLED", at: this.clock(), promptHash: s.promptHash });
      s.promptPreview = "SHOWN";
      s.events.push({ type: "PROMPT_PREVIEW_RECORDED", at: this.clock(), promptHash: s.promptHash });
      return s;
    });
    return clone(s);
  }

  confirmManualGeneration() {
    const s = this.mutateState((s) => {
      if (s.mode !== "MANUAL") throw new Error("MANUAL_CONFIRMATION_NOT_APPLICABLE");
      if (s.promptPreview !== "SHOWN") throw new Error("PROMPT_PREVIEW_REQUIRED");
      s.generationAuthorization = "USER_CONFIRMED_GENERATION";
      s.events.push({ type: "USER_GENERATION_CONFIRMED", at: this.clock() });
      s.version++;
      return s;
    });
    return clone(s);
  }

  authorizeAutomatedGeneration() {
    const s = this.mutateState((s) => {
      if (s.mode !== "AUTOMATED") throw new Error("AUTOMATION_AUTHORIZATION_NOT_APPLICABLE");
      if (s.promptPreview !== "SHOWN") throw new Error("PROMPT_PREVIEW_REQUIRED");
      s.generationAuthorization = "AUTOMATION_EXECUTION_AUTHORIZED";
      s.events.push({ type: "AUTOMATION_EXECUTION_AUTHORIZED", at: this.clock() });
      s.version++;
      return s;
    });
    return clone(s);
  }

  execute() {
    const snapshot = this.store.read();
    const s = snapshot?.state ?? snapshot;
    if (!s) throw new Error("RUNTIME_STATE_MISSING");
    if (s.taskStatus !== "CLAIMED" || s.ownership !== "CLAIMED" || s.workerId !== this.workerId || !s.claimId) {
      throw new Error("EXECUTION_OWNERSHIP_REQUIRED");
    }
    if (!s.lockedPrompt) throw new Error("EXECUTION_NOT_READY");
    if (s.promptPreview !== "SHOWN") throw new Error("PROMPT_PREVIEW_REQUIRED");
    const authorized = s.mode === "MANUAL"
      ? s.generationAuthorization === "USER_CONFIRMED_GENERATION"
      : s.generationAuthorization === "AUTOMATION_EXECUTION_AUTHORIZED";
    if (!authorized) throw new Error("GENERATION_AUTHORIZATION_REQUIRED");
    if (s.attemptCount >= s.maxAttempts) throw new Error("MAX_ATTEMPTS_REACHED");

    const claimId = s.claimId;
    const expectedSha = snapshot?.sha;
    if (this.liveExecution) assertProductionProviderEligible(this.providerRegistration);
    const next = clone(s);
    next.events.push({ type: "GENERATION_EXECUTION", at: this.clock(), attempt: next.attemptCount + 1, claimId });
    const result = this.generator.generate({
      prompt: next.lockedPrompt,
      outputType: next.outputType,
      taskId: next.taskId,
      traceRunId: next.traceRunId
    });
    next.attemptCount++;
    next.result = result.result;
    const expectedPromptHash = sha256(next.lockedPrompt);
    const observedPromptHash = result.output?.promptHash;
    if (result.result === "SUCCESS" && observedPromptHash && observedPromptHash !== expectedPromptHash) {
      result.result = "FAILED";
      result.verification = "VERIFIED";
      result.failureReason = "EXECUTED_PROMPT_MISMATCH";
      next.result = "FAILED";
    }
    const formatMismatch = result.result === "SUCCESS" && result.output?.format && result.output.format !== next.outputType;
    if (formatMismatch) {
      result.result = "FAILED";
      result.verification = "VERIFIED";
      result.failureReason = "OUTPUT_FORMAT_MISMATCH";
      next.result = "FAILED";
    }
    next.events.push({ type: "GENERATION_RESULT", at: this.clock(), result: result.result, verification: result.verification, failureReason: result.failureReason ?? "NONE" });

    if (result.result === "SUCCESS") {
      next.taskStatus = "SUCCESS";
      next.ownership = "TERMINAL";
      next.workerId = "NONE";
      next.claimId = "NONE";
      next.recovery = "TERMINAL_SUCCESS";
      next.consecutiveFailures = 0;
    } else if (result.result === "UNKNOWN") {
      next.taskStatus = "UNKNOWN / RECOVERY_REQUIRED";
      next.ownership = "RELEASED";
      next.workerId = "NONE";
      next.claimId = "NONE";
      next.recovery = "RECOVERY_REQUIRED";
    } else {
      next.taskStatus = next.attemptCount >= next.maxAttempts ? "FAILED / RECOVERY_REQUIRED" : "FAILED";
      next.recovery = next.attemptCount >= next.maxAttempts ? "RECOVERY_REQUIRED" : "RETRY_READY";
      next.consecutiveFailures++;
      next.ownership = "RELEASED";
      next.workerId = "NONE";
      next.claimId = "NONE";
    }
    next.version++;
    next.checkpointVersion++;
    next.events.push({ type: "CHECKPOINT", at: this.clock(), checkpointVersion: next.checkpointVersion });

    if (expectedSha && typeof this.store.compareAndSwap === "function") {
      this.store.compareAndSwap(expectedSha, next, "runtime: execution checkpoint");
    } else {
      this.store.write(next);
    }
    return clone(next);
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
