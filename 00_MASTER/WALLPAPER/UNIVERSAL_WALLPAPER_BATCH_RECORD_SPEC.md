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

REFERENCE_OUTFIT_POLICY:
REFERENCE_POSE_POLICY:

## TASKS

### IMAGE 01
TASK_ID:
IMAGE_ID:
TASK_STATUS:
OWNERSHIP_STATUS:
WORKER_ID:
CLAIM_ID:
CLAIMED_AT:
LEASE_EXPIRES_AT:
STATE_VERSION:
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
SHOES:
MAKEUP:
SCENE:
WEATHER:
TIME:
LIGHTING:
CAMERA_LENS:
STABILITY_CONSTRAINTS:
REFERENCE_OUTFIT_POLICY:
REFERENCE_POSE_POLICY:
DIVERSITY_ROLE:
DIVERSITY_VALIDATION_STATUS:
FINAL_EXECUTABLE_PROMPT:
NEGATIVE_STABILITY_PROMPT:
PROMPT_PREVIEW_STATUS:
GENERATION_RESULT:
RESULT_COUNT:
RESULT_REFERENCE:
GENERATION_ATTEMPT_COUNT:
CONSECUTIVE_FAILURE_COUNT:
RECOVERY_STATUS:
LAST_FAILURE_REASON:
EVENT_HISTORY:
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

`FAILED`, `UNKNOWN / RECOVERY_REQUIRED`, `OUTPUT_COUNT_MISMATCH`, `INVALID_IMAGE_ID`, `ABANDONED`

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
- `GENERATION_ATTEMPT_COUNT`;
- `CONSECUTIVE_FAILURE_COUNT`;
- `RECOVERY_STATUS`;
- `LAST_FAILURE_REASON`;
- `EVENT_HISTORY`;
- `CHECKPOINT_STATUS`.

Only `SUCCESS` counts toward `COMPLETED_COUNT`.

`UNKNOWN` requires recovery and stops the session.

Extra outputs never create extra IMAGE_IDs.

## 8. Checkpoint rule

A checkpoint is valid only after the corresponding task result has been recorded.

For SUCCESS:

`TASK SUCCESS → COMPLETED_COUNT update → CURRENT_TASK_ID advance → CHECKPOINT`

For FAILED:

`TASK FAILED → update attempt/failure counters → apply recovery rule → CHECKPOINT`

For UNKNOWN:

`TASK UNKNOWN → RECOVERY_REQUIRED → STOP → CHECKPOINT`

Never advance to the next task before the current task has a recorded terminal result.

## 9. Resume rule

On RESUME, reread the batch record.

Use the first authoritative task that is not safely completed.

- SUCCESS → advance to the next valid task;
- NOT_STARTED / DESIGN_READY / DESIGN_LOCKED → continue the authoritative task;
- FAILED + RETRY_READY → retry the same task identity;
- FAILED + RECOVERY_REQUIRED → stop until explicitly recovered;
- UNKNOWN → stop for recovery;
- ABANDONED → do not reuse the identity; create a legitimate replacement if coverage is still required;
- OUTPUT_COUNT_MISMATCH → stop/review;
- invalid or contradictory record → stop.

Do not reconstruct task state from conversation memory when the batch record exists.

## 10. Failure/recovery contract

Failure and recovery behavior is defined by `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_FAILURE_RECOVERY_PROTOCOL.md`.

A retry is another generation attempt of the same task and does not create a new `IMAGE_ID`.

Three consecutive FAILED attempts on one task require recovery and stop the session. UNKNOWN always requires recovery and stops the session. ABANDONED is terminal for that task identity and may only be replaced by a new task identity.

## 11. Batch completion

When every task from IMAGE 01 through IMAGE <TARGET_COUNT> has confirmed SUCCESS:

`SESSION_STATUS: COMPLETED`
`STOP_REASON: COMPLETED`

`COMPLETED_COUNT = TARGET_COUNT`

No additional image may be silently added to the batch.

## 12. Separation from platform runtime

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

## 13. Stop-reason evidence invariant

For any stop caused by quota, rate limiting, or generation unavailability, the batch record must preserve:

- `STOP_REASON`;
- `STOP_EVIDENCE`;
- `STOP_EVIDENCE_SOURCE`;
- `STOP_EVIDENCE_STATUS`.

`STOP_EVIDENCE_STATUS` must be one of:
- `VERIFIED` — explicit platform evidence exists;
- `NOT_VERIFIED` — no explicit platform evidence was available;
- `NOT_APPLICABLE` — stop reason is unrelated to platform availability.

A Worker MUST NOT record `QUOTA_LIMIT_REACHED`, `RATE_LIMITED`, or `GENERATION_UNAVAILABLE` as a verified stop without `STOP_EVIDENCE_STATUS: VERIFIED`.

If platform availability cannot be reliably determined, use `UNKNOWN / RECOVERY_REQUIRED` rather than inventing a quota or availability state.

## 14. Minimality principle

**One batch = one record. One task identity = one designed image target. One active owner per task. Each retry is an attempt on that same task identity. One checkpoint = one authoritative resume point.**

The record exists only to preserve production identity, design, result, and resume state.


## 14. Batch diversity fields

For multi-image batches, the batch record must preserve enough structured design data to validate presentation diversity.

Each task should explicitly record, when applicable:
- HAIRSTYLE
- CLOTHING
- ACCESSORIES
- SHOES
- MAKEUP
- DIVERSITY_ROLE

`DIVERSITY_VALIDATION_STATUS` must be recorded before DESIGN_LOCK.

A batch must not be considered design-ready when its planned variation is effectively limited to scene/background and pose while presentation variables remain materially identical across the series.

Identity consistency and presentation diversity are separate requirements:
- identity anchors remain stable;
- presentation variables are deliberately varied.

## 15. Continuation invariant

For an ACTIVE batch:

`SUCCESS + COMPLETED_COUNT < TARGET_COUNT` requires resolution of the next authoritative incomplete task.

The batch may not remain ACTIVE with a terminal SUCCESS followed by an intentionally idle current task unless a documented stop/recovery condition exists.

## 16. Actual format invariant

The task's declared `ASPECT_RATIO`, `OUTPUT_TYPE`, and `ORIENTATION` describe the required output, not proof of the actual result.

When actual output dimensions/metadata are available, they must be recorded or validated before terminal SUCCESS. A mismatch must not be silently accepted as format-compliant success.


## 17. Reference-decoupling task invariant

For REALISTIC WALLPAPER tasks using a person reference:
- `REFERENCE_OUTFIT_POLICY` must be `REPLACE` unless the user explicitly requests outfit preservation.
- `REFERENCE_POSE_POLICY` must be `IGNORE` unless the user explicitly requests pose preservation.

`REPLACE` means a complete new outfit must be designed. "Source outfit + jacket" or "source outfit + shoes" is not a valid replacement.

`IGNORE` means the source pose cannot be copied as the generated pose template. The Worker must independently design the generated pose/action.

These fields must be resolved before DESIGN_LOCK.
