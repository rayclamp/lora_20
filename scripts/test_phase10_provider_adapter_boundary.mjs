#!/usr/bin/env node

import assert from "node:assert/strict";
import { ImageProviderAdapter } from "./runtime/image_provider_adapter.mjs";
import { sha256 } from "./runtime/worker_runtime.mjs";

const prompt = "SYSTEM-GENERATED EXECUTABLE IMAGE PROMPT\nA summer seaside wallpaper.";
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
  traceRunId: "RV-PHASE10"
});

assert.equal(received.prompt, prompt);
assert.equal(received.promptHash, sha256(prompt));
assert.equal(result.executedPromptHash, sha256(prompt));
assert.equal(result.output.promptHash, sha256(prompt));
assert.equal(result.output.format, "DESKTOP_WALLPAPER");
assert.equal(result.providerRequestId, "REQ-001");

assert.throws(
  () => adapter.generate({ prompt: "", outputType: "DESKTOP_WALLPAPER", taskId: "IMAGE-01", traceRunId: "RV-PHASE10" }),
  /EXECUTABLE_PROMPT_REQUIRED/
);

console.log("Runtime Verification Phase-10 provider adapter boundary: PASS");
console.log("PASS exact locked Prompt handoff contract");
console.log("PASS Prompt hash propagation");
console.log("PASS provider request/result identity");
console.log("PASS output format metadata propagation");
console.log("NOTE: transport is a deterministic test double; no live image provider is invoked.");
