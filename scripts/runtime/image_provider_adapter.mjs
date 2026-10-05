#!/usr/bin/env node

import { sha256 } from "./worker_runtime.mjs";

export const PROVIDER_RESULT_STATES = new Set(["SUCCESS", "FAILED", "UNKNOWN"]);

export class ImageProviderAdapter {
  constructor({ providerId, transport }) {
    if (!providerId) throw new Error("PROVIDER_ID_REQUIRED");
    if (!transport || typeof transport.generate !== "function") throw new Error("PROVIDER_TRANSPORT_REQUIRED");
    this.providerId = providerId;
    this.transport = transport;
  }

  generate({ prompt, outputType, taskId, traceRunId, executionContext = null }) {
    if (!prompt || !prompt.trim()) throw new Error("EXECUTABLE_PROMPT_REQUIRED");
    if (!executionContext || typeof executionContext !== "object") {
      throw new Error("EXECUTION_CONTEXT_REQUIRED");
    }
    const executionContextHash = sha256(JSON.stringify(executionContext));
    const result = this.transport.generate({
      prompt,
      outputType,
      taskId,
      traceRunId,
      executionContext,
      executionContextHash,
      promptHash: sha256(prompt)
    });
    if (!result || !PROVIDER_RESULT_STATES.has(result.result)) throw new Error("PROVIDER_RESULT_INVALID");
    if (result.result === "SUCCESS" && !result.output) throw new Error("PROVIDER_SUCCESS_OUTPUT_REQUIRED");
    if (result.result === "UNKNOWN" && result.verification !== "NOT_OBSERVABLE") {
      throw new Error("UNKNOWN_VERIFICATION_INVALID");
    }
    return {
      ...result,
      providerId: this.providerId,
      executedPromptHash: result.executedPromptHash ?? "NOT_OBSERVABLE",
      executedExecutionContextHash: result.executedExecutionContextHash ?? "NOT_OBSERVABLE",
      executionContextVerification: result.executionContextVerification ?? "NOT_OBSERVABLE",
      providerRequestId: result.providerRequestId ?? "NOT_OBSERVABLE"
    };
  }
}
