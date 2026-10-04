#!/usr/bin/env node

/**
 * Council Round 8 — Universal Wallpaper batch validator self-test.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const VALIDATOR = path.join(SCRIPT_DIR, "validate_universal_batch_records.mjs");
let failures = 0;

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "universal-batch-validator-"));
  fs.mkdirSync(path.join(dir, "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES"), { recursive: true });
  fs.writeFileSync(path.join(dir, "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/TEST.md"), `# Universal Wallpaper Batch: TEST

## SESSION
SESSION_ID: TEST
BATCH_ID: TEST
TARGET_COUNT: 1
COMPLETED_COUNT: 0
CURRENT_TASK_ID: TASK-01
SESSION_STATUS: ACTIVE
STOP_REASON: NONE
LAST_RESULT: NOT_STARTED
CHECKPOINT: CREATED

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
TASK_STATUS: DESIGN_LOCKED
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
GENERATION_RESULT: NOT_STARTED
RESULT_COUNT: 0
RESULT_REFERENCE: NONE
CHECKPOINT_STATUS: READY
STOP_REASON: NONE
`);
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
expect("Valid batch record is accepted", root, true);
fs.rmSync(root, { recursive: true, force: true });

root = fixture();
const p = path.join(root, "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/TEST.md");
let s = fs.readFileSync(p, "utf8");
s = s.replace("ASPECT_RATIO: 16:9", "ASPECT_RATIO: 9:16");
fs.writeFileSync(p, s);
expect("Task format remains structurally readable", root, true);
fs.rmSync(root, { recursive: true, force: true });

root = fixture();
const p2 = path.join(root, "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/TEST.md");
let s2 = fs.readFileSync(p2, "utf8").replace("PROMPT_PREVIEW_STATUS: SHOWN", "PROMPT_PREVIEW_STATUS: NOT_SHOWN");
fs.writeFileSync(p2, s2);
expect("Generation-path task without prompt preview is rejected", root, false);
fs.rmSync(root, { recursive: true, force: true });

root = fixture();
const p3 = path.join(root, "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/TEST.md");
let s3 = fs.readFileSync(p3, "utf8").replace("GENERATION_RESULT: NOT_STARTED", "GENERATION_RESULT: SUCCESS");
s3 = s3.replace("RESULT_COUNT: 0", "RESULT_COUNT: 2");
fs.writeFileSync(p3, s3);
expect("SUCCESS with multiple outputs is rejected", root, false);
fs.rmSync(root, { recursive: true, force: true });

if (failures > 0) {
  console.error("\nUniversal Wallpaper batch validator self-test FAILED: " + failures + " test(s).");
  process.exit(1);
}
console.log("\nUniversal Wallpaper batch validator self-test PASSED.");
