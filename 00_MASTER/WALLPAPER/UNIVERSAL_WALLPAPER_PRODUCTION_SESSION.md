# UNIVERSAL_WALLPAPER_PRODUCTION_SESSION.md

## Purpose

This is the lightweight production-session contract for Universal Wallpaper when ChatGPT itself is the Production Worker.

It does **not** implement a separate runtime engine, scheduler, distributed Claim/Lease/CAS service, ComfyUI adapter, or GitHub Actions image-generation system.

GitHub remains the persistent Source of Truth. ChatGPT is the execution Worker for the current session.

## 1. Session loop

`USER COMMAND → READ GITHUB → DESIGN IMAGE N → SHOW PROMPT → GENERATE IMAGE N → RECORD RESULT → CHECKPOINT → IMAGE N+1`

One task represents one intended image generation.

## 2. Session state

The Session Contract defines the logical state; it does not create a separate runtime database. When a persistent session/task record is available, track:

- SESSION_ID
- BATCH_ID
- TARGET_COUNT
- COMPLETED_COUNT
- CURRENT_TASK_ID
- SESSION_STATUS
- STOP_REASON
- LAST_RESULT
- CHECKPOINT

Session statuses:
`NOT_STARTED`, `ACTIVE`, `PAUSED`, `STOPPED`, `COMPLETED`, `RECOVERY_REQUIRED`

Stop reasons:
`USER_STOP`, `CHATGPT_FORCED_STOP`, `QUOTA_LIMIT_REACHED`, `GENERATION_UNAVAILABLE`, `SYSTEM_ERROR`, `UNKNOWN_RECOVERY_REQUIRED`, `COMPLETED`

GitHub must not invent or predict a remaining platform quota.

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

For the current architecture, checkpoint information is authoritative only when it is written to an existing authorized GitHub task/session record. The Session Contract does not authorize inventing a new storage location or changing RUNTIME_STATE directly.

If no authorized persistent task/session record exists yet, ChatGPT may maintain the current single-image progression within the active conversation, but a RESUME after interruption cannot claim persistent recovery beyond the state actually recorded in GitHub.

## 6. Continuation

After confirmed SUCCESS:

`CHECKPOINT → NEXT VALID TASK`

The session continues until the requested target is completed, the user stops it, ChatGPT is forcibly stopped, quota/platform availability ends, generation becomes unavailable, or an execution-critical conflict occurs.

A platform interruption is a stop condition, not permission to guess remaining quota.

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
