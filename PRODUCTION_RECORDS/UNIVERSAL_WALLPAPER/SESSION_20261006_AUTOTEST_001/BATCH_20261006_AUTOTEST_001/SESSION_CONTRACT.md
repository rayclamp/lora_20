# Session Contract — SESSION_20261006_AUTOTEST_001

- SESSION_ID: SESSION_20261006_AUTOTEST_001
- BATCH_ID: BATCH_20261006_AUTOTEST_001
- SESSION_SCOPE: current production session only
- MODULE: UNIVERSAL_WALLPAPER
- PRODUCTION_TYPE: REALISTIC
- CHARACTER: INARIA
- IMAGE_COUNT: 3
- TARGET_SUCCESS_COUNT: 3
- OUTPUT_TYPE: DESKTOP
- ASPECT_RATIO: 16:9
- PET_ALLOWED: false

## Phase A — DESIGN
All three image designs must be completed and locked before execution begins.

## Phase B — EXECUTION
After user-visible Prompt Set confirmation, Worker executes TASK_001 → TASK_002 → TASK_003 in order.

## Execution Rule
Worker must execute the stored Locked Prompt for each task and must not redesign the task during execution.

## Current Test Boundary
Execution is intentionally not started. This test ends after Prompt Set persistence.
