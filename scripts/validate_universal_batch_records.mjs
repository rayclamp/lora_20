#!/usr/bin/env node

/**
 * validate_universal_batch_records.mjs
 * Council Round 8 — Universal Wallpaper batch-state integrity validator.
 *
 * This validator checks persisted Universal Wallpaper batch records only.
 * It does not execute generation and does not perform visual QA.
 */

import fs from "node:fs";
import path from "node:path";

const rootArgIndex = process.argv.indexOf("--root");
const ROOT = rootArgIndex >= 0 && process.argv[rootArgIndex + 1]
  ? path.resolve(process.argv[rootArgIndex + 1])
  : process.cwd();

const BATCH_DIR = path.join(ROOT, "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES");
let failures = 0;

function fail(message) { console.error("[FAIL] " + message); failures++; }
function pass(message) { console.log("[PASS] " + message); }

if (!fs.existsSync(BATCH_DIR)) {
  fail("Universal Wallpaper canonical batch directory is missing");
} else {
  const files = fs.readdirSync(BATCH_DIR)
    .filter(name => name.endsWith(".md") && name !== "README.md");

  for (const file of files) {
    const full = path.join(BATCH_DIR, file);
    const text = fs.readFileSync(full, "utf8");
    const label = file;

    if (!/^# Universal Wallpaper Batch: .+/m.test(text)) fail(label + ": missing batch header");
    for (const field of [
      "SESSION_ID:", "BATCH_ID:", "TARGET_COUNT:", "COMPLETED_COUNT:",
      "CURRENT_TASK_ID:", "SESSION_STATUS:", "STOP_REASON:", "LAST_RESULT:", "CHECKPOINT:",
      "WALLPAPER_TYPE:", "OUTPUT_TYPE:", "ASPECT_RATIO:", "ORIENTATION:", "REFERENCE:"
    ]) {
      if (!text.includes(field)) fail(label + ": missing session/input field " + field);
    }

    const taskHeaders = [...text.matchAll(/^### IMAGE \d+/gm)];
    if (taskHeaders.length === 0) {
      fail(label + ": no task records");
      continue;
    }

    const target = Number(text.match(/TARGET_COUNT:\s*(\d+)/)?.[1]);
    const completed = Number(text.match(/COMPLETED_COUNT:\s*(\d+)/)?.[1]);
    if (!Number.isInteger(target) || target < 1) fail(label + ": invalid TARGET_COUNT");
    if (!Number.isInteger(completed) || completed < 0 || completed > target) {
      fail(label + ": invalid COMPLETED_COUNT");
    }

    const tasks = text.split(/^### IMAGE \d+\s*$/m).slice(1);
    for (const task of tasks) {
      for (const field of [
        "TASK_ID:", "IMAGE_ID:", "TASK_STATUS:", "DESIGN_STATUS:", "DESIGN_LOCK:",
        "OUTPUT_TYPE:", "ASPECT_RATIO:", "ORIENTATION:", "FINAL_EXECUTABLE_PROMPT:",
        "PROMPT_PREVIEW_STATUS:", "GENERATION_RESULT:", "RESULT_COUNT:", "CHECKPOINT_STATUS:"
      ]) {
        if (!task.includes(field)) fail(label + ": task missing " + field);
      }

      const taskStatus = task.match(/TASK_STATUS:\s*([^\n]+)/)?.[1]?.trim();
      const result = task.match(/GENERATION_RESULT:\s*([^\n]+)/)?.[1]?.trim();
      const designLock = task.match(/DESIGN_LOCK:\s*([^\n]+)/)?.[1]?.trim();
      const preview = task.match(/PROMPT_PREVIEW_STATUS:\s*([^\n]+)/)?.[1]?.trim();
      const resultCount = Number(task.match(/RESULT_COUNT:\s*(\d+)/)?.[1]);

      if (!["NOT_STARTED","DESIGN_READY","DESIGN_LOCKED","GENERATING","SUCCESS","FAILED","UNKNOWN / RECOVERY_REQUIRED","OUTPUT_COUNT_MISMATCH","INVALID_IMAGE_ID"].includes(taskStatus)) {
        fail(label + ": invalid TASK_STATUS " + taskStatus);
      }
      if (!["NOT_STARTED","SUCCESS","FAILED","UNKNOWN"].includes(result)) {
        fail(label + ": invalid GENERATION_RESULT " + result);
      }
      if (taskStatus === "DESIGN_LOCKED" || taskStatus === "GENERATING" || taskStatus === "SUCCESS") {
        if (designLock !== "YES") fail(label + ": generation-path task is not DESIGN_LOCKED");
        if (preview !== "SHOWN") fail(label + ": generation-path task lacks PROMPT_PREVIEW_STATUS: SHOWN");
      }
      if (result === "SUCCESS" && resultCount !== 1) {
        fail(label + ": SUCCESS task must have RESULT_COUNT: 1");
      }
      if (result === "UNKNOWN" && !/RECOVERY_REQUIRED|STOP_REASON:/i.test(task)) {
        fail(label + ": UNKNOWN task lacks recovery/stop evidence");
      }
    }

    const sessionStatus = text.match(/SESSION_STATUS:\s*([^\n]+)/)?.[1]?.trim();
    if (completed === target && sessionStatus !== "COMPLETED") {
      fail(label + ": completed batch does not declare SESSION_STATUS: COMPLETED");
    }
  }

  if (failures === 0) pass("Universal Wallpaper batch records: no persisted records violate the Round 8 integrity contract");
}

if (failures > 0) {
  console.error("\nUniversal Wallpaper batch validation FAILED: " + failures + " issue(s).");
  process.exit(1);
}
console.log("\nUniversal Wallpaper batch validation PASSED.");
