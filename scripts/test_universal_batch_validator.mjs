#!/usr/bin/env node

/**
 * Council Round 9 — Universal Wallpaper failure/recovery validator self-test.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const VALIDATOR = path.join(SCRIPT_DIR, "validate_universal_batch_records.mjs");
let failures = 0;

function fixture(overrides = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "universal-batch-validator-"));
  const batchDir = path.join(dir, "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES");
  fs.mkdirSync(batchDir, { recursive: true });

  const task = {
    taskStatus: "DESIGN_LOCKED",
    result: "NOT_STARTED",
    resultCount: 0,
    attempts: 0,
    consecutiveFailures: 0,
    recovery: "NONE",
    lastFailure: "NONE",
    sessionStatus: "ACTIVE",
    stopReason: "NONE",
    completed: 0,
    eventHistory: "CREATED",
    ownership: "UNCLAIMED",
    worker: "NONE",
    claim: "NONE",
    stateVersion: 0,
    ...overrides,
  };

  const text = `# Universal Wallpaper Batch: TEST

## SESSION
SESSION_ID: TEST
BATCH_ID: TEST
TARGET_COUNT: 1
COMPLETED_COUNT: ${task.completed}
CURRENT_TASK_ID: TASK-01
SESSION_STATUS: ${task.sessionStatus}
STOP_REASON: ${task.stopReason}
TERMINATION_STATUS: ${task.terminationStatus ?? "NONE"}
LAST_RESULT: ${task.result}
CHECKPOINT: RECORDED

## BATCH INPUT
WALLPAPER_TYPE: ANIME WALLPAPER
OUTPUT_TYPE: DESKTOP_WALLPAPER
ASPECT_RATIO: 16:9
ORIENTATION: LANDSCAPE
THEME: TEST
SCENE: TEST
WEATHER: CLEAR
TIME: DAY
PET_ALLOWED: NO
REFERENCE: TEST

## TASKS

### IMAGE 01
TASK_ID: TASK-01
IMAGE_ID: IMAGE-01
TASK_STATUS: ${task.taskStatus}
OWNERSHIP_STATUS: ${task.ownership ?? "UNCLAIMED"}
WORKER_ID: ${task.worker ?? "NONE"}
CLAIM_ID: ${task.claim ?? "NONE"}
CLAIMED_AT: NONE
LEASE_EXPIRES_AT: NONE
STATE_VERSION: ${task.stateVersion ?? 0}
DESIGN_STATUS: LOCKED
DESIGN_LOCK: YES
OUTPUT_TYPE: DESKTOP_WALLPAPER
ASPECT_RATIO: 16:9
ORIENTATION: LANDSCAPE
VIEWPOINT: FRONT
SHOT_SIZE: MEDIUM
CHARACTER_POSITION: CENTER
POSE: STABLE
MAIN_ACTION: TEST
HAND_ACTION: STABLE
LEG_POSITION: STABLE
HAIRSTYLE: TEST
CLOTHING: TEST
ACCESSORIES: NONE
SCENE: TEST
WEATHER: CLEAR
TIME: DAY
LIGHTING: TEST
CAMERA_LENS: TEST
STABILITY_CONSTRAINTS: STABLE
FINAL_EXECUTABLE_PROMPT: TEST
NEGATIVE_STABILITY_PROMPT: TEST
PROMPT_PREVIEW_STATUS: SHOWN
GENERATION_RESULT: ${task.result}
RESULT_COUNT: ${task.resultCount}
TARGET_SUCCESS_COUNT: 1
MAX_ATTEMPTS_PER_TASK: 3
RESULT_REFERENCE: TEST
GENERATION_ATTEMPT_COUNT: ${task.attempts}
CONSECUTIVE_FAILURE_COUNT: ${task.consecutiveFailures}
RECOVERY_STATUS: ${task.recovery}
LAST_FAILURE_REASON: ${task.lastFailure}
EVENT_HISTORY: ${task.eventHistory}
CHECKPOINT_STATUS: RECORDED
STOP_REASON: ${task.stopReason}
`;
  fs.writeFileSync(path.join(batchDir, "TEST.md"), text);
  return dir;
}

function run(root) {
  const r = spawnSync(process.execPath, [VALIDATOR, "--root", root], { encoding: "utf8" });
  return r.status ?? -1;
}

function expect(label, root, shouldPass) {
  const ok = (run(root) === 0) === shouldPass;
  if (ok) console.log("[PASS] " + label);
  else { console.error("[FAIL] " + label); failures++; }
}

let root = fixture();
expect("Valid NOT_STARTED record is accepted", root, true);
fs.rmSync(root, { recursive: true, force: true });

root = fixture({ result:"FAILED", resultCount:0, attempts:1, consecutiveFailures:1, recovery:"RETRY_READY", lastFailure:"GENERATION_ERROR", eventHistory:"GENERATION_FAILED attempt=1; RETRY_AUTHORIZED" });
expect("Single FAILED attempt remains retryable", root, true);
fs.rmSync(root, { recursive: true, force: true });

root = fixture({ result:"FAILED", resultCount:0, attempts:3, consecutiveFailures:3, recovery:"RECOVERY_REQUIRED", sessionStatus:"STOPPED", stopReason:"REPEATED_FAILURE", lastFailure:"GENERATION_ERROR", eventHistory:"GENERATION_FAILED attempt=1; GENERATION_FAILED attempt=2; GENERATION_FAILED attempt=3; RECOVERY_REQUIRED" });
expect("Three consecutive failures require recovery and stop", root, true);
fs.rmSync(root, { recursive: true, force: true });

root = fixture({ result:"FAILED", resultCount:0, attempts:3, consecutiveFailures:3, recovery:"RETRY_READY", sessionStatus:"ACTIVE", stopReason:"NONE" });
expect("Three consecutive failures marked retryable are rejected", root, false);
fs.rmSync(root, { recursive: true, force: true });

root = fixture({ taskStatus:"UNKNOWN / RECOVERY_REQUIRED", result:"UNKNOWN", attempts:1, consecutiveFailures:0, recovery:"RECOVERY_REQUIRED", sessionStatus:"RECOVERY_REQUIRED", stopReason:"UNKNOWN_RECOVERY_REQUIRED", eventHistory:"GENERATION_UNKNOWN attempt=1; RECOVERY_REQUIRED" });
expect("UNKNOWN requires recovery and stops", root, true);
fs.rmSync(root, { recursive: true, force: true });

root = fixture({ taskStatus:"ABANDONED", result:"FAILED", attempts:1, consecutiveFailures:1, recovery:"ABANDONED", sessionStatus:"STOPPED", stopReason:"USER_STOP", lastFailure:"USER_ABANDONED", eventHistory:"GENERATION_FAILED attempt=1; TASK_ABANDONED" });
expect("ABANDONED task is terminal and preserved", root, true);
fs.rmSync(root, { recursive: true, force: true });

root = fixture({ taskStatus:"SUCCESS", result:"SUCCESS", resultCount:1, attempts:2, consecutiveFailures:0, recovery:"TERMINAL_SUCCESS", completed:1, sessionStatus:"COMPLETED", stopReason:"COMPLETED", eventHistory:"GENERATION_FAILED attempt=1; RETRY_AUTHORIZED; GENERATION_SUCCESS attempt=2" });
expect("SUCCESS is terminal after a retry and counts once", root, true);
fs.rmSync(root, { recursive: true, force: true });

root = fixture({ taskStatus:"SUCCESS", result:"SUCCESS", resultCount:1, attempts:2, consecutiveFailures:1, recovery:"TERMINAL_SUCCESS", completed:1, sessionStatus:"COMPLETED", stopReason:"COMPLETED" });
expect("SUCCESS with non-reset consecutive failures is rejected", root, false);
fs.rmSync(root, { recursive: true, force: true });


root = fixture({ result:"NOT_STARTED", taskStatus:"DESIGN_LOCKED", ownership:"CLAIMED", worker:"worker-A", claim:"claim-A", stateVersion:1 });
expect("Claimed task with owner and claim identity is accepted", root, true);
fs.rmSync(root, { recursive: true, force: true });

root = fixture({ result:"SUCCESS", taskStatus:"SUCCESS", resultCount:1, attempts:1, recovery:"TERMINAL_SUCCESS", completed:1, sessionStatus:"COMPLETED", stopReason:"COMPLETED", ownership:"CLAIMED", worker:"worker-A", claim:"claim-A", stateVersion:2 });
expect("SUCCESS cannot remain actively claimed", root, false);
fs.rmSync(root, { recursive: true, force: true });

root = fixture({ result:"UNKNOWN", taskStatus:"UNKNOWN / RECOVERY_REQUIRED", attempts:1, recovery:"RECOVERY_REQUIRED", sessionStatus:"RECOVERY_REQUIRED", stopReason:"UNKNOWN_RECOVERY_REQUIRED", ownership:"CLAIMED", worker:"worker-A", claim:"claim-A", stateVersion:2 });
expect("UNKNOWN cannot remain actively claimed", root, false);
fs.rmSync(root, { recursive: true, force: true });

if (failures > 0) {
  console.error("\nUniversal Wallpaper failure/recovery validator self-test FAILED: " + failures + " test(s).");
  process.exit(1);
}
console.log("\nUniversal Wallpaper failure/recovery validator self-test PASSED.");
