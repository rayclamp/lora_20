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
Typical fields: SESSION_ID, BATCH_ID, SESSION_SCOPE, MODULE, PRODUCTION_TYPE, CHARACTER, IMAGE_COUNT, OUTPUT_TYPE, user constraints, and design/execution boundary.
OUTPUT_TYPE is the combined output contract that identifies the target class and exact aspect ratio. Canonical values are `DESKTOP_16_9` and `PHONE_9_16`. Do not add a separate ASPECT_RATIO or ORIENTATION control when OUTPUT_TYPE already expresses the complete output format.

## 4. BATCH_RECORD.md
Record: SESSION_ID, BATCH_ID, MODULE, PRODUCTION_TYPE, IMAGE_COUNT, BATCH_STATUS, COMPLETED_COUNT, UNVERIFIED_COUNT, FAILED_COUNT, DEFERRED_COUNT, BLOCKED_COUNT, PENDING_COUNT, ATTEMPT_COUNT, CURRENT_TASK, NEXT_TASK, CHECKPOINT, and termination/completion information. These state counts must remain separate; do not combine failed, deferred, blocked, and unverified Tasks into one ambiguous counter.
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
- GENERATION_INPUT_FROZEN_LENGTH (optional local evidence)
- LOCKED_PROMPT_HASH
- GENERATION_INPUT_FROZEN_HASH (optional local evidence)
- EXACT_BINDING_STATUS
- DELIVERY_INTEGRITY_STATUS
- RESULT_ID / output reference
- EXPECTED_OUTPUT_COUNT
- ACTUAL_OUTPUT_COUNT
- RESULT_BINDING_STATUS
- error/defer/safety information
- task-specific checkpoint information
- POLICY_INTERRUPTION_COUNT
- INTERRUPTION_CLASS / INTERRUPTION_HISTORY
- PROMPT_CONSUMED
- PROMPT_TERMINATION_REASON

Task status semantics:
- GENERATION_STARTED = generation attempt initiated.
- IMAGE_RESULT_RECEIVED = image result returned.
- RESULT_RECEIVED_UNVERIFIED = result exists but required provenance/delivery evidence is missing.
- EXECUTION_INTEGRITY_UNVERIFIED = an applicable evidence field is unavailable or not exposed; this does not by itself mean Generation was forbidden.
- EXECUTION_INTEGRITY_BLOCKED = generation is blocked by an actual integrity failure such as prompt/input mismatch, not by the mere absence of transport telemetry.
- GENERATION_FAILED = generation failed without a usable result.
- RESULT_COUNT_MISMATCH = the actual output count is known and does not equal the Task contract; this is not SUCCESS.
- SUCCESS = all applicable success-gate conditions passed.

IMAGE_RESULT_RECEIVED must never be treated as SUCCESS by itself.
For wallpaper production, EXPECTED_OUTPUT_COUNT = 1. If ACTUAL_OUTPUT_COUNT != 1, the Task cannot be SUCCESS. When the actual count is known, the mismatch must be explicitly recorded as RESULT_COUNT_MISMATCH rather than being hidden solely under a generic unverified-result state.

## 6. PROMPT_SET.md
All prompts are designed before generation, persisted before execution, and locked as execution input. Resume does not silently redesign a locked prompt. Revisions require a new prompt version.

The Prompt Set lock metadata is authoritative and must be internally consistent: when PROMPT_SET_STATUS = LOCKED, PROMPT_SET_LOCKED MUST = YES. A persisted locked Prompt Set with PROMPT_SET_LOCKED = NO is invalid record state and must be corrected before execution/resume.

Each executable Task must record that the complete, non-empty Locked Prompt was read and associated with the current Task before generation. Record EXACT_READBACK and EXACT_BINDING_STATUS where supported. Length/hash are optional local integrity evidence, not mandatory runtime gates. If the generation interface does not expose actual payload telemetry, record DELIVERY_INTEGRITY_STATUS = NOT_EXPOSED or UNVERIFIED; this alone does not prohibit generation. The selected original Locked Prompt remains the intended generation instruction.

## 7. EXECUTION_LOG.md
Typical events: DESIGN_COMPLETE, PROMPT_SET_LOCKED, GENERATION_STARTED, IMAGE_RESULT_RECEIVED, RESULT_VERIFIED, GENERATION_SUCCESS, GENERATION_FAILED, EXECUTION_INTEGRITY_UNVERIFIED, EXECUTION_INTEGRITY_BLOCKED, RESULT_COUNT_MISMATCH, RESULT_BINDING_FAILED, POLICY_BLOCKED, SAFETY_BLOCKED, INTERRUPTION_CLASSIFIED, PROMPT_SKIPPED_POLICY_LIMIT, STOPPED, RESUMED, UNKNOWN, DEFERRED, COMPLETED. RETRY events MUST NOT be used to represent a second generation call for the same locked Prompt.
Each event should include timestamp with timezone, EVENT_ID, event type, SESSION_ID, BATCH_ID, TASK_ID when applicable, PROMPT_ID, PROMPT_VERSION, ATTEMPT_ID, GENERATION_CALL_ID, result/error information, output count, interruption class/counter when applicable, prompt-consumed state, and checkpoint reference when applicable.

## 8. Persistence and Recovery
Records must preserve enough information to determine which Session/Batch, contract, locked prompt, generation attempts, results, verification states, Task states, checkpoint, and historical events apply. All five standard batch records must be present before a Batch can resume: SESSION_CONTRACT.md, BATCH_RECORD.md, TASK_QUEUE.md, PROMPT_SET.md, and EXECUTION_LOG.md. If any required record is missing or a locked prompt cannot be read back, mark the Batch BLOCKED for record-integrity recovery; do not invent missing Task state or reconstruct a supposedly locked prompt from memory.
An unverified image result MUST NOT be silently counted as a completed Task during resume.

## 9. Completion
Completion means all required Tasks have reached valid terminal SUCCESS. A Batch is not complete merely because all requested image slots received some image output.

## 10. Execution Integrity Reference
Detailed execution requirements are defined in 00_MASTER/GENERATION_WORKER_PROTOCOL.md.
Minimum chain: TASK → LOCKED_PROMPT → EXACT_READBACK → EXACT_BINDING → GENERATION_INPUT_FROZEN → GENERATION_CALL → RESULT → RESULT_VERIFICATION → TASK_STATUS.
The system must record unavailable evidence honestly and must not claim verification that did not occur. Missing hidden payload telemetry alone does not require BLOCKED; use NOT_EXPOSED/UNVERIFIED and assess the actual result. Use BLOCKED when the prompt is missing, empty, associated with the wrong Task, or cannot be supplied as a usable generation instruction.

## 11. Non-Goals
This schema does not define a GitHub scheduler, task lock, worker manager, retry engine, Session manager, or execution controller. Those remain internal ChatGPT production mechanisms.

## 12. One-Prompt-One-Generation and Policy Interruption Records

Each locked Prompt/version may have at most ONE actual Generation Call.

Lifecycle continuation attempts before generation may be recorded, but once a Generation Call is initiated the Prompt is permanently consumed and no second Generation Call is permitted for that Prompt/version.

For Policy/Safety interruption handling, persist at Task level:
- POLICY_INTERRUPTION_COUNT
- INTERRUPTION_CLASS
- INTERRUPTION_HISTORY
- PROMPT_CONSUMED
- PROMPT_TERMINATION_REASON

Only verified Policy/Safety interruptions increment POLICY_INTERRUPTION_COUNT.

Generation service errors, quota/rate limits, GitHub failures, system/runtime errors, and unknown interruptions do not increment the Policy counter.

After three consecutive verified Policy/Safety interruptions across explicit user-authorized continuations, set:
- TASK_STATUS = PROMPT_SKIPPED_POLICY_LIMIT
- PROMPT_TERMINATION_REASON = THREE_CONSECUTIVE_POLICY_INTERRUPTS

The Producer must not automatically retry or regenerate. Image QA is recorded as evidence for the single generated image and is never a regeneration trigger.

## 13. Per-Step Persistence Requirement

Automated production records must preserve the state produced by each discrete production step before the next step begins.

At minimum, each step must have a corresponding authoritative record/event showing:
1. current GitHub access was verified;
2. required current data was read when applicable;
3. the step was executed;
4. the resulting state/data was written;
5. the write was verified.

If the required GitHub record cannot be written or verified, the Producer must stop and must not continue from memory, cache, stale context, or guessed state. If the failure cannot itself be persisted, report GITHUB_RECORDING_FAILED.
