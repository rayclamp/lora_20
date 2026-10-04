# UNIVERSAL_WALLPAPER_PRODUCTION_SESSION.md

## Purpose

This is the lightweight production-session contract for Universal Wallpaper when ChatGPT itself is the Production Worker.

It does **not** implement a separate runtime engine, scheduler, distributed Claim/Lease/CAS service, ComfyUI adapter, or GitHub Actions image-generation system.

GitHub remains the persistent Source of Truth. ChatGPT is the execution Worker for the current session.

## 1. Session loop

`USER COMMAND → READ GITHUB → DESIGN IMAGE N → SHOW PROMPT → GENERATE IMAGE N → RECORD RESULT → CHECKPOINT → IMAGE N+1`

One task represents one intended image generation.

## 2. Session state

The Session Contract defines the logical state; it does not create a separate runtime database. The canonical persistent record is `MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/<BATCH_ID>.md`. Track session state there.

- SESSION_ID
- BATCH_ID
- TARGET_COUNT
- COMPLETED_COUNT
- CURRENT_TASK_ID
- SESSION_STATUS
- STOP_REASON
- STOP_EVIDENCE
- STOP_EVIDENCE_SOURCE
- STOP_EVIDENCE_STATUS
- LAST_RESULT
- CHECKPOINT

Session statuses:
`NOT_STARTED`, `ACTIVE`, `PAUSED`, `STOPPED`, `COMPLETED`, `RECOVERY_REQUIRED`

Stop reasons:
`USER_STOP`, `CHATGPT_FORCED_STOP`, `QUOTA_LIMIT_REACHED`, `GENERATION_UNAVAILABLE`, `SYSTEM_ERROR`, `UNKNOWN_RECOVERY_REQUIRED`, `COMPLETED`

GitHub must not invent or predict a remaining platform quota.

A quota/rate-limit/generation-unavailable stop is valid only when explicit platform evidence exists. Worker inference or expectation is not evidence. If evidence is absent and availability is uncertain, record UNKNOWN / RECOVERY_REQUIRED rather than claiming a quota stop.

## 3. Prompt Preview Gate

Before generating each image, the Worker MUST show the complete executable prompt to the user.

Required order:

1. resolve current task;
2. design image;
3. perform stability check;
4. finalize executable prompt;
5. **show prompt to user**;
6. generate image;
7. confirm result;
8. record result;
9. checkpoint;
10. continue only when safe.

The shown prompt must be the prompt actually used for the current task.

## 4. Per-image result

Minimum logical result states:

- `NOT_STARTED`
- `SUCCESS`
- `FAILED`
- `UNKNOWN`

`SUCCESS`: preserve the candidate and mark generation complete.

`FAILED`: do not count the task as complete; follow the current retry/recovery rule.

`UNKNOWN`: record `UNKNOWN / RECOVERY_REQUIRED` and stop. Never silently regenerate an UNKNOWN result.

## 5. Checkpoint ownership

The canonical persistent record is defined by `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_BATCH_RECORD_SPEC.md` and stored at `MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/<BATCH_ID>.md`.

Checkpoint information is authoritative only when written to that authorized batch record. The Session Contract does not authorize changing `RUNTIME_STATE` directly or creating another persistence layer.

If the batch record does not yet exist, it must be created before a multi-image session claims persistent resumability. Until then, conversation memory is not a persistent recovery source.

## 6. Continuation

After confirmed SUCCESS:

`CHECKPOINT → NEXT VALID TASK`

The session continues until the requested target is completed, the user stops it, ChatGPT is forcibly stopped, quota/platform availability ends, generation becomes unavailable, or an execution-critical conflict occurs.

A platform interruption is a stop condition only when the platform explicitly reports the interruption. A Worker must not convert an inference about quota or availability into a verified stop reason.

## 7. Resume

On RESUME, ChatGPT must reread current GitHub state.

Resolve:

1. active session/batch;
2. current task;
3. last result;
4. task-integrity and format locks;
5. next safe action.

Decision:
- SUCCESS → next valid task;
- FAILED → current retry/recovery rule;
- UNKNOWN → stop for recovery;
- NOT_STARTED → continue the authoritative current task.

Do not redesign an existing task from conversation memory.

\n## 7A. Failure / recovery\n\nFailure and recovery are governed by `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_FAILURE_RECOVERY_PROTOCOL.md`.\n\n- `FAILED + RETRY_READY` → retry the same task identity and checkpoint the attempt.\n- Three consecutive FAILED attempts → `RECOVERY_REQUIRED` + `STOPPED`; no fourth automatic attempt.\n- `UNKNOWN / RECOVERY_REQUIRED` → STOP; resolve the unknown event before any retry.\n- `ABANDONED` → terminal for that identity; replacement requires a new task identity.\n- `SUCCESS` → terminal; never regenerate the completed task.\n
## 7B. Execution gates

The following are hard gates, not advisory instructions:

1. Prompt Preview must actually occur before generation.
2. The design must pass module/batch diversity validation before DESIGN_LOCK.
3. The declared output format must be preserved.
4. Actual output format must be validated when technically determinable.
5. After SUCCESS, the next authoritative task must be resolved when the batch remains incomplete.

A worker must never treat the existence of a field such as `PROMPT_PREVIEW_STATUS: SHOWN` as a substitute for performing the corresponding action.

## 8. Count integrity

`TARGET_COUNT` is a batch target, not a quota prediction.

Only confirmed SUCCESS counts as generation-complete.

Extra outputs do not create extra tasks.

**ONE TASK = ONE IMAGE DESIGN = ONE EXECUTABLE PROMPT = ONE GENERATION EVENT**

## 9. Architecture boundary

This session contract intentionally does not require:

- distributed Worker scheduling;
- server-side Claim/Lease/CAS;
- external queue services;
- automatic retry engines;
- ComfyUI runtime adapters;
- GitHub Actions image generation;
- automatic quota discovery.

These are separate future requirements and must not be reintroduced merely to support ChatGPT-as-Worker production.

## 10. Worker boundary

ChatGPT may read rules, design, show the prompt, generate, record the result, checkpoint, and continue.

ChatGPT must not activate PAUSED modules, bypass runtime state, invent missing task state, silently redesign DESIGN-LOCKED tasks, self-QA, or silently regenerate UNKNOWN results.

## 11. Core principle

**GitHub defines HOW. ChatGPT executes ONE IMAGE at a time. The checkpoint defines WHERE TO RESUME.**
