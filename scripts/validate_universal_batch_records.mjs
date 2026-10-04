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
        "PROMPT_PREVIEW_STATUS:", "GENERATION_RESULT:", "RESULT_COUNT:", "TARGET_SUCCESS_COUNT:", "MAX_ATTEMPTS_PER_TASK:",
        "GENERATION_ATTEMPT_COUNT:", "CONSECUTIVE_FAILURE_COUNT:", "RECOVERY_STATUS:", "LAST_FAILURE_REASON:", "EVENT_HISTORY:", "CHECKPOINT_STATUS:"
      ]) {
        if (!task.includes(field)) fail(label + ": task missing " + field);
      }

      const taskStatus = task.match(/TASK_STATUS:\s*([^\n]+)/)?.[1]?.trim();
      const result = task.match(/GENERATION_RESULT:\s*([^\n]+)/)?.[1]?.trim();
      const designLock = task.match(/DESIGN_LOCK:\s*([^\n]+)/)?.[1]?.trim();
      const preview = task.match(/PROMPT_PREVIEW_STATUS:\s*([^\n]+)/)?.[1]?.trim();
      const resultCount = Number(task.match(/RESULT_COUNT:\s*(\d+)/)?.[1]);
      const targetSuccessCount = Number(task.match(/TARGET_SUCCESS_COUNT:\s*(\d+)/)?.[1]);
      const maxAttempts = Number(task.match(/MAX_ATTEMPTS_PER_TASK:\s*(\d+)/)?.[1]);
      const attemptCount = Number(task.match(/GENERATION_ATTEMPT_COUNT:\s*(\d+)/)?.[1]);
      const consecutiveFailures = Number(task.match(/CONSECUTIVE_FAILURE_COUNT:\s*(\d+)/)?.[1]);
      const recoveryStatus = task.match(/RECOVERY_STATUS:\s*([^\n]+)/)?.[1]?.trim();

      const ownershipStatus = task.match(/OWNERSHIP_STATUS:\s*([^\n]+)/)?.[1]?.trim();
      const workerId = task.match(/WORKER_ID:\s*([^\n]+)/)?.[1]?.trim();
      const claimId = task.match(/CLAIM_ID:\s*([^\n]+)/)?.[1]?.trim();
      const stateVersion = Number(task.match(/STATE_VERSION:\s*(\d+)/)?.[1]);

      if (!["UNCLAIMED","CLAIMED","RELEASED","TERMINAL"].includes(ownershipStatus)) fail(label + ": invalid OWNERSHIP_STATUS " + ownershipStatus);
      if (!Number.isInteger(stateVersion) || stateVersion < 0) fail(label + ": invalid STATE_VERSION");
      if (ownershipStatus === "CLAIMED") {
        if (!workerId || workerId === "NONE") fail(label + ": CLAIMED task requires WORKER_ID");
        if (!claimId || claimId === "NONE") fail(label + ": CLAIMED task requires CLAIM_ID");
        if (taskStatus === "SUCCESS" || result === "SUCCESS") fail(label + ": SUCCESS cannot remain CLAIMED");
      }
      if (["UNCLAIMED","RELEASED","TERMINAL"].includes(ownershipStatus) && workerId && workerId !== "NONE") fail(label + ": non-claimed task cannot retain active WORKER_ID");
      if (ownershipStatus === "TERMINAL" && result !== "SUCCESS" && taskStatus !== "ABANDONED") fail(label + ": TERMINAL requires SUCCESS or ABANDONED");
      if (result === "UNKNOWN" && ownershipStatus === "CLAIMED") fail(label + ": UNKNOWN / RECOVERY_REQUIRED cannot remain actively claimed");


      if (!Number.isInteger(targetSuccessCount) || targetSuccessCount < 1) fail(label + ": invalid TARGET_SUCCESS_COUNT");
      if (!Number.isInteger(maxAttempts) || maxAttempts < 1) fail(label + ": invalid MAX_ATTEMPTS_PER_TASK");
      if (!Number.isInteger(attemptCount) || attemptCount < 0) fail(label + ": invalid GENERATION_ATTEMPT_COUNT");
      if (Number.isInteger(maxAttempts) && attemptCount > maxAttempts) fail(label + ": GENERATION_ATTEMPT_COUNT exceeds MAX_ATTEMPTS_PER_TASK");
      if (!Number.isInteger(consecutiveFailures) || consecutiveFailures < 0) fail(label + ": invalid CONSECUTIVE_FAILURE_COUNT");
      if (Number.isInteger(targetSuccessCount) && targetSuccessCount !== 1) fail(label + ": Universal Wallpaper TARGET_SUCCESS_COUNT must be 1");
      if (!["NONE","RETRY_READY","RECOVERY_REQUIRED","ABANDONED","TERMINAL_SUCCESS"].includes(recoveryStatus)) fail(label + ": invalid RECOVERY_STATUS " + recoveryStatus);
      if (result === "NOT_STARTED" && attemptCount !== 0) fail(label + ": NOT_STARTED task must have GENERATION_ATTEMPT_COUNT: 0");
      if (result === "SUCCESS" && recoveryStatus !== "TERMINAL_SUCCESS") fail(label + ": SUCCESS must be TERMINAL_SUCCESS");
      if (result === "SUCCESS" && taskStatus !== "SUCCESS") fail(label + ": SUCCESS result requires TASK_STATUS: SUCCESS");
      if (result === "SUCCESS" && consecutiveFailures !== 0) fail(label + ": SUCCESS must reset CONSECUTIVE_FAILURE_COUNT to 0");
      if (result === "FAILED" && attemptCount < 1) fail(label + ": FAILED requires at least one generation attempt");
      if (result === "FAILED" && consecutiveFailures < 1) fail(label + ": FAILED requires CONSECUTIVE_FAILURE_COUNT >= 1");
      if (consecutiveFailures >= 3 && result === "FAILED" && recoveryStatus !== "RECOVERY_REQUIRED") fail(label + ": 3 consecutive failures require RECOVERY_REQUIRED");
      if (taskStatus === "ABANDONED" && recoveryStatus !== "ABANDONED") fail(label + ": ABANDONED task must have RECOVERY_STATUS: ABANDONED");
      if (result === "UNKNOWN" && recoveryStatus !== "RECOVERY_REQUIRED") fail(label + ": UNKNOWN must have RECOVERY_STATUS: RECOVERY_REQUIRED");
      if (result === "FAILED" && consecutiveFailures < 3 && !["RETRY_READY","ABANDONED"].includes(recoveryStatus)) fail(label + ": FAILED under 3 consecutive attempts must be RETRY_READY unless the task is explicitly ABANDONED");
      if (recoveryStatus === "TERMINAL_SUCCESS" && result !== "SUCCESS") fail(label + ": TERMINAL_SUCCESS requires GENERATION_RESULT: SUCCESS");
      if (recoveryStatus === "ABANDONED" && taskStatus !== "ABANDONED") fail(label + ": ABANDONED recovery status requires ABANDONED task state");

      if (!["NOT_STARTED","DESIGN_READY","DESIGN_LOCKED","GENERATING","SUCCESS","FAILED","UNKNOWN / RECOVERY_REQUIRED","OUTPUT_COUNT_MISMATCH","INVALID_IMAGE_ID","ABANDONED"].includes(taskStatus)) {
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
    const terminationStatus = text.match(/TERMINATION_STATUS:\s*([^\n]+)/)?.[1]?.trim();
    const successTaskCount = tasks.filter(task => /TASK_STATUS:\s*SUCCESS\b/.test(task)).length;

    if (!["NONE","NON_TERMINAL","TERMINAL"].includes(terminationStatus)) {
      fail(label + ": invalid or missing TERMINATION_STATUS " + terminationStatus);
    }
    if (Number.isInteger(completed) && successTaskCount !== completed) {
      fail(label + ": COMPLETED_COUNT does not equal number of SUCCESS task records");
    }
    if (/STOP_REASON:\s*USER_STOP\b/.test(text) && terminationStatus !== "TERMINAL") {
      fail(label + ": explicit USER_STOP must have TERMINATION_STATUS: TERMINAL");
    }
    if (terminationStatus === "TERMINAL" && sessionStatus !== "STOPPED" && sessionStatus !== "COMPLETED") {
      fail(label + ": TERMINAL batch must be STOPPED or COMPLETED");
    }

    if (sessionStatus === "STOPPED" && /REPEATED_FAILURE/.test(text)) {
      const hasThree = /CONSECUTIVE_FAILURE_COUNT:\s*3/.test(text);
      if (!hasThree) fail(label + ": REPEATED_FAILURE stop lacks 3-consecutive-failure evidence");
    }
    if (sessionStatus === "RECOVERY_REQUIRED" && !/RECOVERY_REQUIRED/.test(text)) fail(label + ": recovery-required session lacks recovery evidence");
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
