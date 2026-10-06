# PRODUCTION_RECORD_SCHEMA.md

This document defines the storage schema for automated production records.
It does not create or control a Runtime, Scheduler, Worker Manager, State Machine, Retry Engine, Session Manager, or Execution Controller.

## 1. Repository Role
GitHub is the project's reference and persistence database.
ChatGPT creates and operates the production session. GitHub stores the resulting production data.
> ChatGPT decides and acts; GitHub records.

## 2. Canonical Storage Path
PRODUCTION_RECORDS/<MODULE>/<SESSION_ID>/<BATCH_ID>/
MODULE determines the storage root. PRODUCTION_TYPE is metadata and must never determine the storage root.

Standard records:
1. SESSION_CONTRACT.md
2. BATCH_RECORD.md
3. TASK_QUEUE.md
4. PROMPT_SET.md
5. EXECUTION_LOG.md

## 3. SESSION_CONTRACT.md
Typical fields: SESSION_ID, BATCH_ID, SESSION_SCOPE, MODULE, PRODUCTION_TYPE, CHARACTER, IMAGE_COUNT, TARGET_SUCCESS_COUNT, OUTPUT_TYPE, ASPECT_RATIO, user constraints, and design/execution boundary.
OUTPUT_TYPE identifies the target class (`DESKTOP` or `PHONE`); ASPECT_RATIO specifies the exact ratio (for example, `16:9` or `9:16`). Do not encode the ratio inside OUTPUT_TYPE (for example, `DESKTOP_16_9`) and do not add ORIENTATION as a separate control.

## 4. BATCH_RECORD.md
Record: SESSION_ID, BATCH_ID, MODULE, PRODUCTION_TYPE, IMAGE_COUNT, TARGET_SUCCESS_COUNT, BATCH_STATUS, COMPLETED_COUNT, UNVERIFIED_COUNT, FAILED_COUNT, DEFERRED_COUNT, BLOCKED_COUNT, PENDING_COUNT, ATTEMPT_COUNT, CURRENT_TASK, NEXT_TASK, CHECKPOINT, and termination/completion information. These state counts must remain separate; do not combine failed, deferred, blocked, and unverified Tasks into one ambiguous counter.
A Batch MUST NOT be complete while any required Task is unverified, blocked, failed, or unfinished.

## 5. TASK_QUEUE.md
Each Task should record, as applicable:
- ORDER
- TASK_ID
- PROMPT_ID
- PROMPT_VERSION
- PROMPT_STATUS
- TASK_STATUS
- GENERATION_STATUS
- ATTEMPT_ID / attempt count
- GENERATION_CALL_ID
- LOCKED_PROMPT_LENGTH
- GENERATION_INPUT_LENGTH
- LOCKED_PROMPT_HASH
- GENERATION_INPUT_HASH
- DELIVERY_INTEGRITY_STATUS
- RESULT_ID / output reference
- EXPECTED_OUTPUT_COUNT
- ACTUAL_OUTPUT_COUNT
- RESULT_BINDING_STATUS
- error/defer/safety information
- task-specific checkpoint information

Task status semantics:
- GENERATION_STARTED = generation attempt initiated.
- IMAGE_RESULT_RECEIVED = image result returned.
- RESULT_RECEIVED_UNVERIFIED = result exists but required provenance/delivery evidence is missing.
- EXECUTION_INTEGRITY_UNVERIFIED = actual generator delivery cannot be verified.
- EXECUTION_INTEGRITY_BLOCKED = generation is blocked by integrity failure or missing required evidence.
- GENERATION_FAILED = generation failed without a usable result.
- RESULT_COUNT_MISMATCH = the actual output count is known and does not equal the Task contract; this is not SUCCESS.
- SUCCESS = all applicable success-gate conditions passed.

IMAGE_RESULT_RECEIVED must never be treated as SUCCESS by itself.
For wallpaper production, EXPECTED_OUTPUT_COUNT = 1. If ACTUAL_OUTPUT_COUNT != 1, the Task cannot be SUCCESS. When the actual count is known, the mismatch must be explicitly recorded as RESULT_COUNT_MISMATCH rather than being hidden solely under a generic unverified-result state.

## 6. PROMPT_SET.md
All prompts are designed before generation, persisted before execution, and locked as execution input. Resume does not silently redesign a locked prompt. Revisions require a new prompt version.

## 7. EXECUTION_LOG.md
Typical events: DESIGN_COMPLETE, PROMPT_SET_LOCKED, GENERATION_STARTED, IMAGE_RESULT_RECEIVED, RESULT_VERIFIED, GENERATION_SUCCESS, GENERATION_FAILED, RETRY, EXECUTION_INTEGRITY_UNVERIFIED, EXECUTION_INTEGRITY_BLOCKED, RESULT_COUNT_MISMATCH, RESULT_BINDING_FAILED, SAFETY_BLOCKED, STOPPED, RESUMED, UNKNOWN, DEFERRED, COMPLETED.
Each event should include timestamp with timezone, EVENT_ID, event type, SESSION_ID, BATCH_ID, TASK_ID when applicable, PROMPT_ID, PROMPT_VERSION, ATTEMPT_ID, GENERATION_CALL_ID, result/error information, output count, and checkpoint reference when applicable.

## 8. Persistence and Recovery
Records must preserve enough information to determine which Session/Batch, contract, locked prompt, generation attempts, results, verification states, Task states, checkpoint, and historical events apply. All five standard batch records must be present before a Batch can resume: SESSION_CONTRACT.md, BATCH_RECORD.md, TASK_QUEUE.md, PROMPT_SET.md, and EXECUTION_LOG.md. If any required record is missing or a locked prompt cannot be read back, mark the Batch BLOCKED for record-integrity recovery; do not invent missing Task state or reconstruct a supposedly locked prompt from memory.
An unverified image result MUST NOT be silently counted as a completed Task during resume.

## 9. Completion
Completion means all required Tasks have reached valid terminal SUCCESS. A Batch is not complete merely because all requested image slots received some image output.

## 10. Execution Integrity Reference
Detailed execution requirements are defined in 00_MASTER/GENERATION_WORKER_PROTOCOL.md.
Minimum chain: TASK → LOCKED_PROMPT → GENERATION_INPUT → GENERATION_CALL → RESULT → RESULT_VERIFICATION → TASK_STATUS.
The system must prefer UNVERIFIED/BLOCKED over false SUCCESS when evidence is insufficient.

## 11. Non-Goals
This schema does not define a GitHub scheduler, task lock, worker manager, retry engine, Session manager, or execution controller. Those remain internal ChatGPT production mechanisms.