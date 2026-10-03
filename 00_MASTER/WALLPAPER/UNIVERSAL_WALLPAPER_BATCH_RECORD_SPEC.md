# UNIVERSAL_WALLPAPER_BATCH_RECORD_SPEC.md

## Purpose

This is the canonical storage format for Universal Wallpaper ChatGPT-as-Worker production.

It provides the smallest persistent record needed to resume a multi-image wallpaper session without introducing a separate runtime database.

## 1. Canonical storage location

Active and resumable Universal Wallpaper batch records belong under:

`MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/<BATCH_ID>.md`

One batch uses **one record file**.

The batch record contains both:
- session state;
- ordered per-image task records.

Do not create a separate database, queue service, runtime engine, or per-worker state store for this purpose.

## 2. Record authority

The batch record is the authoritative persistent record for that Universal Wallpaper batch.

It may record:
- session identity and progress;
- task identity and design;
- prompt preview;
- generation result;
- checkpoint.

It does not override:
- `RUNTIME_STATE.md`;
- `MODULE_REGISTRY.md`;
- CORE rules;
- wallpaper rules;
- higher-level authority.

A batch record cannot activate a paused module.

## 3. Batch record minimum structure

Each batch record must contain:

```text
# Universal Wallpaper Batch: <BATCH_ID>

## SESSION
SESSION_ID:
BATCH_ID:
TARGET_COUNT:
COMPLETED_COUNT:
CURRENT_TASK_ID:
SESSION_STATUS:
STOP_REASON:
LAST_RESULT:
CHECKPOINT:

## BATCH INPUT
WALLPAPER_TYPE:
OUTPUT_TYPE:
ASPECT_RATIO:
ORIENTATION:
THEME:
SCENE:
WEATHER:
TIME:
PET_ALLOWED:
REFERENCE:

## TASKS

### IMAGE 01
TASK_ID:
IMAGE_ID:
TASK_STATUS:
DESIGN_STATUS:
DESIGN_LOCK:
OUTPUT_TYPE:
ASPECT_RATIO:
ORIENTATION:
VIEWPOINT:
SHOT_SIZE:
CHARACTER_POSITION:
POSE:
MAIN_ACTION:
HAND_ACTION:
LEG_POSITION:
HAIRSTYLE:
CLOTHING:
ACCESSORIES:
SCENE:
WEATHER:
TIME:
LIGHTING:
CAMERA_LENS:
STABILITY_CONSTRAINTS:
FINAL_EXECUTABLE_PROMPT:
NEGATIVE_STABILITY_PROMPT:
PROMPT_PREVIEW_STATUS:
GENERATION_RESULT:
RESULT_COUNT:
RESULT_REFERENCE:
CHECKPOINT_STATUS:
STOP_REASON:

### IMAGE 02
...
```

Fields may be omitted only when the field is genuinely not applicable to the selected wallpaper mode. Required integrity fields must not be omitted.

## 4. Task lifecycle

A task uses these logical states:

`NOT_STARTED → DESIGN_READY → DESIGN_LOCKED → GENERATING → SUCCESS`

Failure/recovery states:

`FAILED`, `UNKNOWN / RECOVERY_REQUIRED`, `OUTPUT_COUNT_MISMATCH`, `INVALID_IMAGE_ID`

A Worker must not skip the design/prompt-preview gate.

## 5. Design lock

`DESIGN_LOCK: YES` means the task design is frozen for generation.

After the lock:
- the Worker may not silently change the design;
- a legitimate redesign requires an explicit task update before generation;
- generation must use the locked executable prompt.

## 6. Prompt preview record

Before generation:

`PROMPT_PREVIEW_STATUS: SHOWN`

The stored `FINAL_EXECUTABLE_PROMPT` must be the same prompt shown to the user and used for generation.

If the prompt changes after preview, update the record and show the new complete prompt again before generation.

## 7. Result record

After each generation attempt, record:

- `GENERATION_RESULT`: `SUCCESS`, `FAILED`, or `UNKNOWN`;
- `RESULT_COUNT`;
- `RESULT_REFERENCE` when available;
- `CHECKPOINT_STATUS`.

Only `SUCCESS` counts toward `COMPLETED_COUNT`.

`UNKNOWN` requires recovery and stops the session.

Extra outputs never create extra IMAGE_IDs.

## 8. Checkpoint rule

A checkpoint is valid only after the corresponding task result has been recorded.

For SUCCESS:

`TASK SUCCESS → COMPLETED_COUNT update → CURRENT_TASK_ID advance → CHECKPOINT`

For FAILED:

`TASK FAILED → record failure/recovery state → CHECKPOINT`

For UNKNOWN:

`TASK UNKNOWN → RECOVERY_REQUIRED → STOP → CHECKPOINT`

Never advance to the next task before the current task has a recorded terminal result.

## 9. Resume rule

On RESUME, reread the batch record.

Use the first authoritative task that is not safely completed.

- SUCCESS → advance to the next valid task;
- NOT_STARTED / DESIGN_READY / DESIGN_LOCKED → continue the authoritative task;
- FAILED → follow the applicable retry/recovery rule;
- UNKNOWN → stop for recovery;
- OUTPUT_COUNT_MISMATCH → stop/review;
- invalid or contradictory record → stop.

Do not reconstruct task state from conversation memory when the batch record exists.

## 10. Batch completion

When every task from IMAGE 01 through IMAGE <TARGET_COUNT> has confirmed SUCCESS:

`SESSION_STATUS: COMPLETED`
`STOP_REASON: COMPLETED`

`COMPLETED_COUNT = TARGET_COUNT`

No additional image may be silently added to the batch.

## 11. Separation from platform runtime

This record is a persistent production ledger, not a runtime engine.

It does not provide:
- automatic scheduling;
- distributed locking;
- Claim/Lease/CAS;
- automatic quota discovery;
- automatic retries;
- GitHub Actions generation;
- ComfyUI execution.

Those capabilities require separate architecture and must not be inferred from this record format.

## 12. Minimality principle

**One batch = one record. One task = one image. One checkpoint = one authoritative resume point.**

The record exists only to preserve production identity, design, result, and resume state.
