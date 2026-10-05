#!/usr/bin/env node

import assert from "node:assert/strict";
import { ImageProviderAdapter } from "./runtime/image_provider_adapter.mjs";
import { sha256 } from "./runtime/worker_runtime.mjs";

const prompt = "SYSTEM-GENERATED EXECUTABLE IMAGE PROMPT\nA summer seaside wallpaper.";
const executionContext = {
  REFERENCE_AUTHORITY: "EXPLICIT_TASK_REFERENCE",
  REFERENCE_IDS: ["INARIA-36-MASTER"],
  MODEL_ID: "TEST_MODEL",
  MODEL_VERSION: "1",
  OUTPUT_TYPE: "DESKTOP_WALLPAPER",
  ASPECT_RATIO: "16:9",
  GENERATION_PARAMETERS: { steps: 20 },
  PROVIDER_PARAMETERS: { cfg: 6 }
};
let received = null;

const adapter = new ImageProviderAdapter({
  providerId: "TEST_PROVIDER",
  transport: {
    generate(payload) {
      received = payload;
      return {
        result: "SUCCESS",
        verification: "VERIFIED",
        providerRequestId: "REQ-001",
        executedPromptHash: sha256(payload.prompt),
        executedExecutionContextHash: payload.executionContextHash,
        executionContextVerification: "VERIFIED",
        output: {
          format: payload.outputType,
          promptHash: sha256(payload.prompt),
          artifactId: "TEST-ARTIFACT-001"
        }
      };
    }
  }
});

const result = adapter.generate({
  prompt,
  outputType: "DESKTOP_WALLPAPER",
  taskId: "IMAGE-01",
  traceRunId: "RV-PHASE10",
  executionContext,
  generationAttempt: 1,
  generationIdempotencyKey: "RV-PHASE10-IDEMPOTENCY-1"
});

assert.equal(received.prompt, prompt);
assert.equal(received.promptHash, sha256(prompt));
assert.equal(received.taskId, "IMAGE-01");
assert.equal(received.traceRunId, "RV-PHASE10");
assert.equal(received.generationAttempt, 1);
assert.equal(received.generationIdempotencyKey, "RV-PHASE10-IDEMPOTENCY-1");
assert.deepEqual(received.executionContext, executionContext);
assert.equal(received.executionContextHash, sha256(JSON.stringify(executionContext)));
assert.equal(result.executedPromptHash, sha256(prompt));
assert.equal(result.executedExecutionContextHash, sha256(JSON.stringify(executionContext)));
assert.equal(result.executionContextVerification, "VERIFIED");
assert.equal(result.output.promptHash, sha256(prompt));
assert.equal(result.output.format, "DESKTOP_WALLPAPER");
assert.equal(result.providerRequestId, "REQ-001");

assert.throws(
  () => adapter.generate({ prompt: "", outputType: "DESKTOP_WALLPAPER", taskId: "IMAGE-01", traceRunId: "RV-PHASE10", executionContext, generationAttempt: 1, generationIdempotencyKey: "RV-PHASE10-IDEMPOTENCY-1" }),
  /EXECUTABLE_PROMPT_REQUIRED/
);

assert.throws(
  () => adapter.generate({ prompt, outputType: "DESKTOP_WALLPAPER", taskId: "IMAGE-01", traceRunId: "RV-PHASE10", executionContext }),
  /GENERATION_ATTEMPT_REQUIRED/
);

console.log("Runtime Verification Phase-10 provider adapter boundary: PASS");
console.log("PASS exact locked Prompt handoff contract");
console.log("PASS Prompt hash propagation");
console.log("PASS provider request/result identity");
console.log("PASS output format metadata propagation");
console.log("PASS exact execution-context handoff and hash propagation");
console.log("NOTE: transport is a deterministic test double; no live image provider is invoked.");
