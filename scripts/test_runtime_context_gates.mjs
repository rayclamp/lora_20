#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, MockGenerationAdapter, ProductionWorkerRuntime } from "./runtime/worker_runtime.mjs";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lora20-context-"));

const validContext = {
  reference: {
    status: "NO_REFERENCE",
    id: "NONE",
    provenance: "RULE_DEFAULT",
  },
  sceneIntent: {
    status: "RESOLVED",
    provenance: "WORKER_RESOLVED",
    fields: {
      ACTIVITY: "TRAVEL",
      LOCATION: "FOREST_PATH",
      ACTION: "WALKING",
      TIME: "AFTERNOON",
      WEATHER: "CLEAR",
      SOCIAL_CONTEXT: "ALONE",
      ENVIRONMENTAL_CUES: "WOODLAND_PATH_WITH_SOFT_DAYLIGHT",
    },
  },
};

function makeRuntime(name, generatorOutcomes = ["SUCCESS"]) {
  const store = new JsonStateStore(path.join(dir, name, "state.json"));
  const runtime = new ProductionWorkerRuntime({
    store,
    generator: new MockGenerationAdapter(generatorOutcomes),
    workerId: `CONTEXT_${name}`,
    clock: (() => { let n = 2000; return () => ++n; })(),
  });
  runtime.request({
    traceRunId: `RV-CONTEXT-${name}`,
    module: "UNIVERSAL_WALLPAPER",
    productionType: "ANIME",
    outputType: "DESKTOP_WALLPAPER",
    batchId: `RV-CONTEXT-BATCH-${name}`,
    taskId: "IMAGE-01",
  });
  runtime.claim();
  return { runtime, store };
}

{
  const { runtime, store } = makeRuntime("valid");
  const s = runtime.designAndLockPrompt("SYSTEM-GENERATED CONTEXT-VALIDATED PROMPT", validContext);
  assert.equal(s.promptPreview, "RECORDED");
  assert.ok(s.promptHash);
  const persisted = store.read();
  assert.ok(persisted.events.some(e => e.type === "REFERENCE_AUTHORITY_RESOLVED" && e.status === "NO_REFERENCE"));
  assert.ok(persisted.events.some(e => e.type === "SCENE_INTENT_RESOLVED" && e.status === "RESOLVED"));
  const result = runtime.execute();
  assert.equal(result.taskStatus, "SUCCESS");
}

{
  const { runtime } = makeRuntime("reference-blocked");
  assert.throws(
    () => runtime.designAndLockPrompt("PROMPT", {
      ...validContext,
      reference: { status: "REFERENCE_BLOCKED", provenance: "MODULE_POLICY" },
    }),
    /REFERENCE_BLOCKED/
  );
}

{
  const { runtime } = makeRuntime("scene-missing");
  assert.throws(
    () => runtime.designAndLockPrompt("PROMPT", {
      ...validContext,
      sceneIntent: { status: "MISSING", provenance: "AUTOMATION_INPUT", fields: validContext.sceneIntent.fields },
    }),
    /SCENE_INTENT_BLOCKED/
  );
}

{
  const { runtime } = makeRuntime("scene-conflict");
  assert.throws(
    () => runtime.designAndLockPrompt("PROMPT", {
      ...validContext,
      sceneIntent: { status: "CONFLICT", provenance: "AUTOMATION_INPUT", fields: validContext.sceneIntent.fields },
    }),
    /SCENE_INTENT_BLOCKED/
  );
}

{
  const { runtime } = makeRuntime("scene-incomplete");
  const incomplete = { ...validContext.sceneIntent.fields };
  delete incomplete.WEATHER;
  assert.throws(
    () => runtime.designAndLockPrompt("PROMPT", {
      ...validContext,
      sceneIntent: { status: "RESOLVED", provenance: "WORKER_RESOLVED", fields: incomplete },
    }),
    /SCENE_INTENT_INCOMPLETE/
  );
}

{
  const { runtime } = makeRuntime("reference-invalid");
  assert.throws(
    () => runtime.designAndLockPrompt("PROMPT", {
      ...validContext,
      reference: { status: "CHARACTER_NAME_INFERENCE", provenance: "FORBIDDEN" },
    }),
    /REFERENCE_STATE_INVALID/
  );
}

console.log("Worker Runtime Phase-5 canonical context gate probe: PASS");
console.log("PASS valid reference + scene-intent gate");
console.log("PASS REFERENCE_BLOCKED fence");
console.log("PASS SCENE_INTENT MISSING fence");
console.log("PASS SCENE_INTENT CONFLICT fence");
console.log("PASS incomplete scene-intent fence");
console.log("PASS invalid reference-state fence");
console.log("PASS successful execution after context validation");
console.log("NOTE: context is supplied as a structured runtime input; canonical GitHub policy resolution is not yet implemented.");
