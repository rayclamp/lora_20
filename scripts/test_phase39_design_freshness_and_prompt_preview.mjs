#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CanonicalContextResolver } from "./runtime/canonical_context_resolver.mjs";
import { JsonStateStore, ProductionWorkerRuntime, sha256 } from "./runtime/worker_runtime.mjs";
import { DeterministicWallpaperDesigner } from "./runtime/production_designer.mjs";
import { AutomaticProductionController } from "./runtime/automatic_production_controller.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lora20-phase39-"));
const resolver = new CanonicalContextResolver({ root: process.cwd() });
const designer = new DeterministicWallpaperDesigner();
const sceneIntent = { status: "EXPLICIT", fields: {
  ACTIVITY: "TRAVEL", LOCATION: "CITY_STREET", ACTION: "WALKING",
  TIME: "DAY", WEATHER: "CLEAR", SOCIAL_CONTEXT: "ALONE", ENVIRONMENTAL_CUES: "URBAN_SCENERY"
} };
const order = [];
const previews = [];
const tasks = [{ taskId: "IMAGE-01", status: "QUEUED" }, { taskId: "IMAGE-02", status: "QUEUED" }];

class Generator {
  generate({ prompt, outputType }) {
    order.push("GENERATION");
    return { result: "SUCCESS", verification: "VERIFIED", output: { format: outputType, promptHash: sha256(prompt) } };
  }
}
class BatchStore {
  constructor(state) { this.state = structuredClone(state); this.sha = "batch-1"; }
  read() { return { state: structuredClone(this.state), sha: this.sha }; }
  compareAndSwap(expectedSha, state) {
    assert.equal(expectedSha, this.sha); this.state = structuredClone(state); this.sha += "-next"; return this.read();
  }
}
const batch = {
  batchId: "RV-PHASE39-BATCH", automationRunId: "RV-PHASE39-AUTO",
  module: "UNIVERSAL_WALLPAPER", productionType: "AUTOMATED", outputType: "DESKTOP_WALLPAPER",
  targetCount: 2, completedCount: 0, currentTaskId: "NONE", checkpointVersion: 0, sessionStatus: "ACTIVE"
};
const controller = new AutomaticProductionController({
  batchRecord: batch, batchStore: new BatchStore(batch),
  taskResolver: () => tasks.find(task => task.status === "QUEUED") ?? null,
  taskDesignContext: () => ({ theme: "TRAVEL", sceneIntent, designFreshness: {
    enabled: true, requiredChangedFields: ["HAIRSTYLE", "CLOTHING"], minimumChangedFields: 2
  }}),
  userRequest: "Create a varied travel wallpaper for the same person.",
  requireUserVisiblePromptPreview: true,
  promptPreviewSink: (preview) => { order.push("PREVIEW"); previews.push(preview); assert.ok(preview.prompt); assert.ok(preview.promptHash); return true; },
  runtimeFactory: (task) => new ProductionWorkerRuntime({
    store: new JsonStateStore(path.join(dir, task.taskId + ".json")),
    generator: new Generator(), designer, contextResolver: resolver, workerId: "PHASE39_WORKER",\n    visualEvaluator: { evaluate: () => ({ result: "VISUAL_DESIGN_ADHERENCE_PASS" }) }
  })
});
const result = controller.start();
assert.equal(result.action, "BATCH_COMPLETE");
assert.deepEqual(tasks.map(task => task.status), ["SUCCESS", "SUCCESS"]);
assert.equal(previews.length, 2);
assert.notEqual(previews[0].promptHash, previews[1].promptHash);
assert.notEqual(previews[0].design.presentation.HAIRSTYLE, previews[1].design.presentation.HAIRSTYLE);
assert.notEqual(previews[0].design.presentation.CLOTHING, previews[1].design.presentation.CLOTHING);
assert.deepEqual(order, ["PREVIEW", "GENERATION", "PREVIEW", "GENERATION"]);

const blockedRuntime = new ProductionWorkerRuntime({
  store: new JsonStateStore(path.join(dir, "blocked.json")), generator: new Generator(),
  designer, contextResolver: resolver, workerId: "PHASE39_BLOCKED"
});
blockedRuntime.request({ module: "UNIVERSAL_WALLPAPER", productionType: "AUTOMATED",
  outputType: "DESKTOP_WALLPAPER", batchId: "RV-PHASE39-BLOCK", taskId: "IMAGE-01", mode: "AUTOMATED" });
blockedRuntime.claim();
assert.throws(() => blockedRuntime.designAndLockPrompt("IDENTICAL PROMPT", {
  sceneIntent, reference: { status: "NO_REFERENCE", provenance: "NONE" }, userRequest: "same",
  design: { presentation: { HAIRSTYLE: "LOW_BUN", CLOTHING: "AQUA_TOP_NAVY_SKIRT" } },
  designFreshness: {
    enabled: true,
    previousDesigns: [{ taskId: "IMAGE-00", prompt: "IDENTICAL PROMPT", promptHash: sha256("IDENTICAL PROMPT"),
      design: { presentation: { HAIRSTYLE: "LOW_BUN", CLOTHING: "AQUA_TOP_NAVY_SKIRT" } } }],
    requiredChangedFields: ["HAIRSTYLE", "CLOTHING"], minimumChangedFields: 2
  }
}), /DESIGN_FRESHNESS_PROMPT_REUSE/);

console.log("Runtime Verification Phase-39 design freshness and user-visible prompt preview: PASS");
console.log("PASS exact Prompt reuse is blocked");
console.log("PASS hairstyle and clothing variation are enforced");
console.log("PASS user-visible preview is delivered before generation");
