#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime } from "./runtime/worker_runtime.mjs";

const store = new JsonStateStore(
  path.join(fs.mkdtempSync(path.join(os.tmpdir(), "phase15-")), "state.json")
);

const runtime = new ProductionWorkerRuntime({
  store,
  workerId: "PHASE15_WORKER",
  generator: { generate() { throw new Error("GENERATION_SHOULD_NOT_RUN"); } }
});

const state = runtime.request({
  module: "UNIVERSAL_WALLPAPER",
  productionType: "AUTOMATED",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "PHASE15-BATCH",
  taskId: "PHASE15-TASK",
  mode: "AUTOMATED"
});

assert.equal(
  state.visualAdherenceRequired,
  true,
  "Automated Universal Wallpaper must require visual adherence by default"
);

const manualStore = new JsonStateStore(
  path.join(fs.mkdtempSync(path.join(os.tmpdir(), "phase15-manual-")), "state.json")
);
const manualRuntime = new ProductionWorkerRuntime({
  store: manualStore,
  workerId: "PHASE15_MANUAL",
  generator: { generate() { throw new Error("GENERATION_SHOULD_NOT_RUN"); } }
});
const manualState = manualRuntime.request({
  module: "UNIVERSAL_WALLPAPER",
  productionType: "MANUAL",
  outputType: "DESKTOP_WALLPAPER",
  batchId: "PHASE15-MANUAL-BATCH",
  taskId: "PHASE15-MANUAL-TASK",
  mode: "MANUAL"
});

assert.equal(
  manualState.visualAdherenceRequired,
  false,
  "Manual Universal Wallpaper compatibility default must remain false"
);

console.log("Runtime Verification Phase-15 automated Universal Wallpaper gate binding: PASS");
console.log("PASS automated Universal Wallpaper defaults to visualAdherenceRequired=true");
console.log("PASS manual compatibility path remains unchanged");
