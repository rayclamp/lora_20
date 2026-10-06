# PRODUCTION_RECORD_SCHEMA.md

This document defines the **storage schema** for automated production records.

It does not create or control a Runtime, Scheduler, Worker Manager, State Machine, Retry Engine, Session Manager, or Execution Controller.

## 1. Repository Role

GitHub is the project's reference and persistence database.

ChatGPT creates and operates the production session. GitHub stores the resulting production data.

Therefore:

> **ChatGPT decides and acts; GitHub records.**

A Session or Batch is not created by GitHub. `SESSION_ID` and `BATCH_ID` are identifiers created by the active ChatGPT production session and then persisted here.

## 2. Canonical Storage Path

`PRODUCTION_RECORDS/<MODULE>/<SESSION_ID>/<BATCH_ID>/`

**MODULE determines the storage root. PRODUCTION_TYPE is recorded metadata and must never determine the storage root.**

Examples:

`PRODUCTION_RECORDS/UNIVERSAL_WALLPAPER/SESSION_x/BATCH_x/`

`PRODUCTION_RECORDS/FESTIVAL_WALLPAPER/SESSION_x/BATCH_x/`

`PRODUCTION_RECORDS/LORA_PRODUCTION/SESSION_x/BATCH_x/`

A Universal Wallpaper session with `PRODUCTION_TYPE: REALISTIC` or `PRODUCTION_TYPE: ANIME` is still stored under `PRODUCTION_RECORDS/UNIVERSAL_WALLPAPER/`.

Each automated batch normally contains the following five records:

1. `SESSION_CONTRACT.md`
2. `BATCH_RECORD.md`
3. `TASK_QUEUE.md`
4. `PROMPT_SET.md`
5. `EXECUTION_LOG.md`

The five files are persistent records, not independent controllers.

## 3. SESSION_CONTRACT.md

Purpose: preserve the fixed production contract for the Session/Batch.

Typical fields:

- SESSION_ID
- BATCH_ID
- SESSION_SCOPE
- MODULE
- PRODUCTION_TYPE
- CHARACTER
- IMAGE_COUNT
- TARGET_SUCCESS_COUNT
- OUTPUT_TYPE
- ASPECT_RATIO
- ORIENTATION
- user-specified production constraints
- design/execution boundary when applicable

The contract records what production was requested. It does not execute or enforce the request.


## 3.1 SESSION_SCOPE and Access Semantics

SESSION_SCOPE records the intended scope/context of the production record. It is descriptive persistence data, not an access-control mechanism.

The access rule is:

- Default: the active ChatGPT context operates only the Session it created.
- Explicit User authorization may identify a different SESSION_ID for reading, stopping, resuming, continuing, or otherwise operating that Session.
- A SESSION_ID alone does not grant permission.
- GitHub does not enforce Session access.

When a cross-Session operation is explicitly authorized by the User, the action should be recorded in EXECUTION_LOG.md so the historical record shows that the target Session was intentionally accessed from another ChatGPT context.

## 4. BATCH_RECORD.md

Purpose: preserve the current batch-level checkpoint.

Typical fields:

- SESSION_ID
- BATCH_ID
- MODULE
- PRODUCTION_TYPE
- IMAGE_COUNT
- TARGET_SUCCESS_COUNT
- current lifecycle/status fields
- completed count
- failed/deferred count when applicable
- generation attempt count when applicable
- current/next task identifier
- last checkpoint
- termination/completion information

Status values stored here are records of ChatGPT's production state. They are not live commands to GitHub.

## 5. TASK_QUEUE.md

Purpose: preserve the current per-task production record and intended task order.

Each task should record, as applicable:

- ORDER
- TASK_ID
- PROMPT_STATUS
- GENERATION_STATUS
- attempt information
- output/result information
- error/defer/safety information
- task-specific checkpoint information

Task order and status are persisted data. GitHub does not itself claim, lock, execute, or schedule tasks.

## 6. PROMPT_SET.md

Purpose: preserve the complete prompt set designed for the batch.

Requirements:

- All requested prompts are designed before automated generation begins.
- The complete prompt set is persisted before execution begins.
- The stored locked prompt is the execution input for its task.
- Resuming production does not silently redesign a locked prompt.
- A later revision must be explicitly recorded as a new prompt version rather than silently replacing historical execution input.

The prompt record is reference/execution-input data, not a prompt execution controller.

## 7. EXECUTION_LOG.md

Purpose: preserve append-only historical production events.

Typical event types include:

- DESIGN_COMPLETE
- PROMPT_LOCKED
- GENERATION_STARTED
- GENERATION_SUCCESS
- GENERATION_FAILED
- RETRY
- SAFETY_BLOCKED
- STOPPED
- RESUMED
- UNKNOWN
- DEFERRED
- COMPLETED

Each event should include, as applicable:

- timestamp
- event type
- SESSION_ID
- BATCH_ID
- TASK_ID when applicable
- relevant result/error information
- checkpoint reference when applicable

The log is historical evidence. It is not a command queue.

## 8. Persistence and Recovery

For automated production, ChatGPT should persist enough information that a later continuation can determine:

1. which Session/Batch the record belongs to;
2. what production contract was requested;
3. which prompts were designed and locked;
4. which tasks have recorded successful results;
5. which tasks failed, were deferred, safety-blocked, stopped, or became unknown;
6. the latest recorded checkpoint;
7. the historical events needed to understand the production state.

Recovery decisions are made by ChatGPT/internal runtime mechanisms using these records. GitHub does not perform recovery itself.

## 9. Completion

When production completes, the five records remain as historical production data.

Completion means the lifecycle is recorded as complete; it does not mean the files are deleted.

## 10. Non-Goals

This schema does NOT define:

- a GitHub scheduler;
- a GitHub task lock;
- a GitHub worker manager;
- a GitHub retry engine;
- a GitHub Session manager;
- a GitHub execution controller.

Those mechanisms, if required, are internal implementation details of ChatGPT's production operation.
