#!/usr/bin/env node

import { sha256 } from "./worker_runtime.mjs";

export class DeterministicWallpaperDesigner {
  design({ userRequest, state, context }) {
    const request = String(userRequest ?? "").trim();
    if (!request) throw new Error("USER_REQUEST_REQUIRED");
    const intent = context.sceneIntent?.fields ?? {};
    const design = {
      userRequest: request,
      module: state.module,
      productionType: state.productionType,
      outputType: state.outputType,
      scene: intent,
      presentation: {
        shot: "CHARACTER_DOMINANT_FULL_BODY",
        view: "THREE_QUARTER_FRONT",
        composition: "CHARACTER_DOMINANT"
      }
    };
    const prompt = [
      "SYSTEM-GENERATED EXECUTABLE IMAGE PROMPT",
      `REQUEST: ${request}`,
      `MODULE: ${state.module}`,
      `PRODUCTION_TYPE: ${state.productionType}`,
      `OUTPUT_TYPE: ${state.outputType}`,
      `ACTIVITY: ${intent.ACTIVITY}`,
      `LOCATION: ${intent.LOCATION}`,
      `ACTION: ${intent.ACTION}`,
      `TIME: ${intent.TIME}`,
      `WEATHER: ${intent.WEATHER}`,
      `SOCIAL_CONTEXT: ${intent.SOCIAL_CONTEXT}`,
      `ENVIRONMENTAL_CUES: ${intent.ENVIRONMENTAL_CUES}`,
      "COMPOSITION: character-dominant, natural body proportions, anatomically stable hands and feet",
      "OUTPUT FORMAT MUST MATCH THE LOCKED OUTPUT_TYPE."
    ].join("\n");
    return { design, prompt, promptHash: sha256(prompt) };
  }
}

export class RecordingGenerationAdapter {
  constructor({ result = "SUCCESS", output = null } = {}) {
    this.result = result;
    this.output = output;
    this.calls = [];
  }

  generate({ prompt, outputType }) {
    this.calls.push({ prompt, outputType });
    if (this.result === "UNKNOWN") {
      return { result: "UNKNOWN", verification: "NOT_OBSERVABLE", output: null };
    }
    return {
      result: this.result,
      verification: "VERIFIED",
      output: this.output ?? {
        format: outputType,
        promptHash: sha256(prompt),
        artifactId: "TEST-IMAGE-001"
      }
    };
  }
}
