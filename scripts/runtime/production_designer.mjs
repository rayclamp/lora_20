#!/usr/bin/env node

import { sha256 } from "./worker_runtime.mjs";

export class DeterministicWallpaperDesigner {
  design({ userRequest, state, context }) {
    const request = String(userRequest ?? "").trim();
    if (!request) throw new Error("USER_REQUEST_REQUIRED");
    const intent = context.sceneIntent?.fields ?? {};
    const taskSeed = String(state.taskId ?? "");
    const index = [...taskSeed].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4;
    const variants = [
      { shot: "CHARACTER_DOMINANT_FULL_BODY", view: "THREE_QUARTER_FRONT", hairstyle: "LONG_STRAIGHT_LOOSE_SIDE_PART", outfit: "LIGHT_AQUA_BLOUSE_NAVY_A_LINE_SKIRT", action: "WALKING_SLOWLY", composition: "CHARACTER_DOMINANT" },
      { shot: "MEDIUM_SHOT", view: "FRONT_THREE_QUARTER", hairstyle: "HALF_UP_STYLE", outfit: "PALE_BLUE_BLOUSE_NAVY_TAILORED_TROUSERS", action: "PAUSING_AT_A_CAFE_WINDOW", composition: "CHARACTER_DOMINANT" },
      { shot: "BUST_HALF_BODY", view: "SIDE_FRONT", hairstyle: "LOW_BUN", outfit: "AQUA_KNIT_TOP_NAVY_MIDI_SKIRT", action: "LOOKING_TOWARD_STREET_SCENERY", composition: "CHARACTER_DOMINANT" },
      { shot: "ENVIRONMENTAL_FULL_BODY", view: "THREE_QUARTER_SIDE", hairstyle: "HIGH_PONYTAIL", outfit: "AQUA_LINEN_TOP_NAVY_WIDE_LEG_PANTS", action: "STROLLING_ALONG_THE_PATH", composition: "ENVIRONMENTAL" }
    ];
    const variant = variants[index];
    const design = {
      userRequest: request, module: state.module, productionType: state.productionType, outputType: state.outputType, scene: intent,
      presentation: { shot: variant.shot, view: variant.view, composition: variant.composition, HAIRSTYLE: variant.hairstyle, CLOTHING: variant.outfit, MAIN_ACTION: variant.action }
    };
    const prompt = [
      "SYSTEM-GENERATED EXECUTABLE IMAGE PROMPT",
      `TASK_ID: ${state.taskId}`,
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
      `DESIGN_VARIANT: ${variant.hairstyle} / ${variant.outfit} / ${variant.action}`,
      "COMPOSITION: character presentation selected for this task, natural body proportions, anatomically stable hands and feet",
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
