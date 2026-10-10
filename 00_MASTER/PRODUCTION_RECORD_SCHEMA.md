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
Record: SESSION_ID, BATCH_ID, MODULE, PRODUCTION_TYPE, IMAGE_COUNT, BATCH_STATUS, COMPLETED_COUNT, RESULT_RECORDED_COUNT, ACTUAL_IMAGE_COUNT, UNVERIFIED_COUNT, FAILED_COUNT, DEFERRED_COUNT, BLOCKED_COUNT, PENDING_COUNT, ATTEMPT_COUNT, CURRENT_TASK, NEXT_TASK, CHECKPOINT, and termination/completion information. These state counts must remain separate; do not combine failed, deferred, blocked, and unverified Tasks into one ambiguous counter. `COMPLETED_COUNT` counts SUCCESS Tasks only. `RESULT_RECORDED_COUNT` counts terminal Tasks whose image result was recorded but which did not pass the SUCCESS gate. `ACTUAL_IMAGE_COUNT` is the total number of images actually received across all Tasks, regardless of prompt-match status, provenance status, visual compliance, or Task success.
A Batch MUST NOT be complete while any required Task is unfinished or has not reached a valid terminal state. It MUST close once every required Task has reached a valid terminal outcome and the completion record is written and verified; unsuccessful outcomes do not keep the Batch open.

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
- DELIVERY_INTEGRITY_STATUS
- PROMPT_MATCH_STATUS (optional legacy/separate audit field; the Producer MUST NOT assess it and should leave it `NOT_ASSESSED` or unset)
- RESULT_ID / output reference
- EXPECTED_OUTPUT_COUNT
- ACTUAL_OUTPUT_COUNT
- RESULT_BINDING_STATUS
- error/defer/safety information
- task-specific checkpoint information
- POLICY_INTERRUPTION_COUNT
- INTERRUPTION_CLASS / INTERRUPTION_HISTORY
- PROMPT_CONSUMED
- PROMPT_STATE (`AVAILABLE`, `CONSUMED`, `RETIRED`, or `UNKNOWN`)
- GENERATION_ATTEMPT_COUNT
- PROMPT_TERMINATION_REASON

Task status semantics:
- GENERATION_STARTED = generation attempt initiated; non-terminal.
- IMAGE_RESULT_RECEIVED = an image result has arrived; event/evidence state, not necessarily a terminal Task status.
- IMAGE_RESULT_RECORDED = a confirmed image result and its actual count have been durably recorded, but production SUCCESS could not be assigned (for example, result binding is unresolved). This is terminal and is not QA PASS.
- RESULT_RECEIVED_UNVERIFIED = a result exists but required evidence/recording is not yet complete; non-terminal until the result is durably recorded or another terminal outcome is established.
- EXECUTION_INTEGRITY_UNVERIFIED = an applicable evidence field is unavailable or not exposed; this does not by itself mean Generation was forbidden. If an image was received and recorded, keep this as an evidence value and use IMAGE_RESULT_RECORDED as the terminal Task status.
- EXECUTION_INTEGRITY_BLOCKED = generation could not validly proceed because of an actual pre-generation readiness failure, such as a missing/empty prompt or wrong Task binding. Do not use this status for post-generation visual judgments or hidden-payload comparisons.
- GENERATION_FAILED = generation ended without a received image result.
- RESULT_COUNT_MISMATCH = the actual output count is known and does not equal the Task contract; this is terminal and the actual received images still count toward ACTUAL_IMAGE_COUNT.
- SUCCESS = production successfully returned and recorded the expected number of images, with the result bound to the Task. SUCCESS is a production result only and does not imply visual correctness, prompt compliance, or QA PASS.

For wallpaper production, EXPECTED_OUTPUT_COUNT = 1. Count every confirmed received image exactly once. If ACTUAL_OUTPUT_COUNT equals the Task contract and the result is bound to that Task, use `SUCCESS`; if the count differs, use `RESULT_COUNT_MISMATCH` while preserving all received images. `PROMPT_MATCH_STATUS` is not a Producer assessment and must remain `NOT_ASSESSED` or unset unless a separately authorized integrity audit owns that field. Visual compliance and image quality belong to QA; production SUCCESS is not QA PASS.

## 6. PROMPT_SET.md
All prompts are designed before generation, persisted before execution, and locked as execution input. Resume does not silently redesign a locked prompt. Revisions require a new prompt version.

The Prompt Set lock metadata is authoritative and must be internally consistent: when PROMPT_SET_STATUS = LOCKED, PROMPT_SET_LOCKED MUST = YES. A persisted locked Prompt Set with PROMPT_SET_LOCKED = NO is invalid record state and must be corrected before execution/resume.

Each executable Task must record that the current complete, non-empty Locked Prompt was read and associated with the current Task before generation. This is a current-state/readiness check, not a separate transport or frozen-input gate. If the generation interface does not expose actual payload telemetry, record DELIVERY_INTEGRITY_STATUS = NOT_EXPOSED or UNVERIFIED; this alone does not prohibit generation. The selected original Locked Prompt remains the generation instruction.

## 7. EXECUTION_LOG.md
Typical events: DESIGN_COMPLETE, PROMPT_SET_LOCKED, GENERATION_STARTED, IMAGE_RESULT_RECEIVED, IMAGE_RESULT_RECORDED, RESULT_VERIFIED, GENERATION_SUCCESS, GENERATION_FAILED, EXECUTION_INTEGRITY_UNVERIFIED, EXECUTION_INTEGRITY_BLOCKED, RESULT_COUNT_MISMATCH, RESULT_BINDING_FAILED, POLICY_BLOCKED, SAFETY_BLOCKED, INTERRUPTION_CLASSIFIED, PROMPT_SKIPPED_POLICY_LIMIT, STOPPED, RESUMED, UNKNOWN, DEFERRED, RECORD_CORRECTED, COMPLETED. RETRY events MUST NOT be used to represent a second generation call for the same locked Prompt.
Each event should include timestamp with timezone, EVENT_ID, event type, SESSION_ID, BATCH_ID, TASK_ID when applicable, PROMPT_ID, PROMPT_VERSION, ATTEMPT_ID, GENERATION_CALL_ID, result/error information, output count, interruption class/counter when applicable, prompt-consumed state, and checkpoint reference when applicable.

## 8. Persistence and Recovery
Records must preserve enough information to determine which Session/Batch, contract, locked prompt, generation attempts, results, verification states, Task states, checkpoint, and historical events apply. All five standard batch records must be present before a Batch can resume: SESSION_CONTRACT.md, BATCH_RECORD.md, TASK_QUEUE.md, PROMPT_SET.md, and EXECUTION_LOG.md. If any required record is missing or a locked prompt cannot be read back, mark the Batch BLOCKED for record-integrity recovery; do not invent missing Task state or reconstruct a supposedly locked prompt from memory.
An unverified image result MUST NOT be silently counted as a completed Task during resume.

## 9. Terminal States and Completion
A Task is terminal only when its final state is explicitly recorded as one of the following valid terminal outcomes:

- SUCCESS
- IMAGE_RESULT_RECORDED
- GENERATION_FAILED
- RESULT_COUNT_MISMATCH
- EXECUTION_INTEGRITY_BLOCKED
- BLOCKED
- DEFERRED
- PROMPT_SKIPPED_POLICY_LIMIT
- STOPPED

RESULT_RECEIVED_UNVERIFIED, EXECUTION_INTEGRITY_UNVERIFIED, GENERATION_STARTED, and other in-progress/evidence states are not terminal.

Completion means every required Task has reached a valid terminal state. A Batch MUST then be recorded as BATCH_COMPLETED and the Producer MUST stop issuing new generation calls for that Batch. A confirmed image result with the expected count and a reliable Task binding is production SUCCESS. If the result cannot be reliably bound or the count differs, record the applicable terminal result state while preserving the received-image count. Prompt-payload integrity and visual compliance are not Producer acceptance judgments and do not keep a result-bearing Task open.

Batch completion does not require every Task to be SUCCESS, and IMAGE_COUNT is the planned number of independent Tasks, not a success target. ACTUAL_IMAGE_COUNT counts all confirmed received images irrespective of whether they match their locked prompts.

## 10. Execution Integrity Reference
Detailed execution requirements are defined in 00_MASTER/GENERATION_WORKER_PROTOCOL.md.
Minimum chain: TASK → LOCKED_PROMPT_READBACK_AND_READINESS → GENERATION_CALL → IMAGE_RECEIVED_OR_NO_IMAGE → RECORD_RESULT_OR_FAILURE → TASK_STATUS.
The Producer verifies before generation that the locked Prompt is available, non-empty, and assigned to the current Task, then uses it as the generation instruction. After the call, the Producer records only observable result facts: image received or not, actual count, result reference/binding, or confirmed failure reason. The Producer MUST NOT compare hidden submitted payload against the locked Prompt or judge visual compliance. Use BLOCKED when the prompt is missing, empty, assigned to the wrong Task, or cannot be supplied as a usable generation instruction.

## 11. Non-Goals
This schema does not define a GitHub scheduler, task lock, worker manager, retry engine, Session manager, or execution controller. Those remain internal ChatGPT production mechanisms.

## 12. Prompt Consumption, Retry, and Policy Interruption Records

One locked Prompt/version may produce at most ONE confirmed image result. A Generation Call being initiated does not, by itself, consume the Prompt; any confirmed received image consumes the Prompt and is counted, regardless of prompt match or Task success.

Persist at Task level, as applicable:
- `GENERATION_ATTEMPT_COUNT`
- `POLICY_INTERRUPTION_COUNT`
- `INTERRUPTION_CLASS`
- `INTERRUPTION_HISTORY`
- `PROMPT_CONSUMED`
- `PROMPT_STATE` (`AVAILABLE`, `CONSUMED`, `RETIRED`, `UNKNOWN`)
- `PROMPT_TERMINATION_REASON`

### 12.1 Outcome and prompt-state rules

1. `PROMPT_CONSUMED = YES` and `PROMPT_STATE = RETIRED` (or `CONSUMED` only while the Task is still active, if that state is used) when an image result is confirmed received for this Task/attempt. The Prompt/version must never be called again. Count the image without making a prompt-payload or visual-compliance judgment.
2. A verified Policy/Safety interruption with confirmed no image result leaves `PROMPT_CONSUMED = NO` and the Prompt eligible for an explicitly authorized retry, provided the Task remains non-terminal and the policy-interruption limit has not been reached. Retry must use the exact same locked Prompt/version and Task binding; assign a new `ATTEMPT_ID`.
3. A confirmed generation failure with confirmed no image result leaves the Prompt unconsumed, but retry/termination follows the separate applicable error-specific rule. Do not count service/runtime errors, quota/rate limits, GitHub failures, or unknown outcomes as Policy/Safety interruptions.
4. If the outcome is unknown, set `PROMPT_CONSUMED = UNKNOWN`, `PROMPT_STATE = UNKNOWN`, and the applicable recovery-required state. Do not retry, skip, or advance until the outcome is resolved.
5. `PROMPT_STATE = RETIRED` means the Prompt is permanently forbidden from future reuse, regardless of `PROMPT_CONSUMED`. A terminal Task retires its Prompt. Retired Prompts must never be re-queued, reassigned, or used by another Task.
6. `PROMPT_CONSUMED` is tri-state: `YES` only for a confirmed received image result; `NO` only when no image result is confirmed and the outcome is known to be no-image; `UNKNOWN` when the outcome cannot be determined. A Prompt is `AVAILABLE` only when no image result was produced, the prior outcome is known, the Task is non-terminal, and no retirement condition applies. Once any image result is received, set `PROMPT_CONSUMED = YES`, count the actual output, retire the Prompt when the Task is terminal, and never reuse that Prompt/version regardless of prompt-match or visual-compliance status.

### 12.2 Policy/Safety interruption limit

Only verified Policy/Safety interruptions increment `POLICY_INTERRUPTION_COUNT`. Other error classes have separate handling and must not increment this counter.

After three consecutive verified Policy/Safety interruptions across explicitly authorized continuations, set:
- `TASK_STATUS = PROMPT_SKIPPED_POLICY_LIMIT`
- `PROMPT_TERMINATION_REASON = THREE_CONSECUTIVE_POLICY_INTERRUPTS`
- `PROMPT_CONSUMED = NO` if no image was produced
- `PROMPT_STATE = RETIRED`

The three tests must use the same locked Prompt/version and same Task binding; do not redesign or substitute the prompt between attempts. The third interruption terminates the Task and permanently retires that Prompt, even though it did not produce an image.

The Producer must not automatically retry without authorization. Image QA is evidence for the single generated image and is never a regeneration trigger.

## 13. Persistence Requirement

Automated production records must preserve durable state before the workflow advances to the next production stage.

When current GitHub data is required, connection/read verification must occur at that stage. When durable state is produced, it must be written and read back for verification.

If the required GitHub record cannot be written or verified, the Producer must stop and must not continue from memory, cache, stale context, or guessed state. If the failure cannot itself be persisted, report GITHUB_RECORDING_FAILED.


## 14. Resume Recovery Scope and Task-Local Blocking

Recovery failures must be classified by scope instead of automatically escalating every discrepancy to Batch-level BLOCKED.

- RECORD_READBACK_PENDING: a required current value has not yet been successfully read back. Retry the read/recovery procedure as appropriate; do not treat this label alone as proof of an integrity violation.
- TASK_LOCAL_RECOVERY_REQUIRED: a discrepancy or unresolved outcome affects one Task. Preserve the authoritative evidence and isolate that Task from execution until its own recovery rule is satisfied.
- BATCH_LEVEL_RECOVERY_REQUIRED: use only when a verified problem affects Batch-wide identity, contract, global Prompt Set integrity, or safe result attribution and cannot be isolated to one Task.

Rules:

1. A Task-local conflict MUST NOT automatically set the entire Batch to BLOCKED.
2. After isolating an affected Task, the Producer MAY continue with a later independent Task only after separately verifying that Task's authoritative state, current complete non-empty locked Prompt, Prompt-to-Task binding, and applicable execution prerequisites.
3. Continuing an independent Task does not resolve, pass, skip, or repair the isolated Task. Preserve it for later recovery.
4. UNKNOWN generation outcome remains non-terminal for the affected Task. Never retry or reuse its Prompt while outcome remains unknown. Do not falsely count it as completed. Independent Tasks may proceed only if they do not depend on that unresolved outcome and their own readiness checks pass.
5. Visual QA observations, including partial visual deviation from a Prompt, anatomy defects, composition issues, or aesthetic concerns, MUST NOT by themselves be classified as EXECUTION_INTEGRITY_BLOCKED. They belong to the separate QA workflow and do not trigger regeneration.
6. `EXECUTION_INTEGRITY_BLOCKED` is for a confirmed pre-generation readiness failure, such as a missing/empty Prompt or a Prompt assigned to the wrong Task. The Producer MUST NOT assess whether the submitted payload exactly matched LOCK PROMPT after generation. A separately authorized integrity audit may record such evidence outside the Producer's production judgment, but a post-generation payload comparison must not erase a received image, change its count, or by itself block independent Tasks. Lack of hidden transport telemetry or visual discrepancy alone is insufficient.
7. Missing required Batch records or an unreadable current locked Prompt must be recorded accurately. If a specific Task's Prompt cannot be read back, block that Task; escalate to Batch-level recovery only if the missing/conflicting record prevents safe identification or verification of all eligible next Tasks.
8. The Batch remains incomplete until every required Task reaches a valid terminal state and the completion record is written and verified. Task-local isolation does not mean the Batch is complete.

## 15. Multi-Worker Handoff and Dependency Semantics

The records support future multi-Worker handoff but do not themselves implement a runtime scheduler or Worker controller.

1. Task readiness is evaluated per Task from its current authoritative record, locked Prompt, Prompt-to-Task binding, and explicitly declared prerequisites.
2. A prior Worker's report is not a substitute for authoritative state, and absence of that report is not a global gate when the next Task can independently be verified.
3. Missing or contradictory data that affects one Task is TASK_LOCAL_RECOVERY_REQUIRED. A Worker may continue an independent Task only after verifying that Task's own readiness and confirming it does not depend on the unresolved Task.
4. PROMPT_MATCH_STATUS = UNVERIFIED describes evidence for the image/result associated with that Task. It does not, by itself, block an unrelated Task or prove that a downstream Task is unsafe.
5. Dependencies MUST be explicit in the applicable Session/Batch contract. Queue order, previous Worker identity, or prior Task failure does not create an implicit dependency.
6. A field is a blocking prerequisite only when the current contract explicitly requires it for the specific operation. Missing optional telemetry or nonessential narrative is not a blocking prerequisite.
7. If a required record for the assigned Task cannot be read or verified, isolate that Task and identify the exact missing prerequisite. Use BATCH_LEVEL_RECOVERY_REQUIRED only for a verified Batch-wide conflict that cannot be isolated.
8. These rules do not weaken the SUCCESS gate, permit retry of an unknown outcome, reuse a retired Prompt, or grant a recorded image automatic LoRA dataset eligibility.


## 16. Historical Record Immutability

Historical production records are experimental evidence and MUST be preserved in their original form. This applies to all modules and includes, but is not limited to, SESSION_CONTRACT.md, BATCH_RECORD.md, TASK_QUEUE.md, PROMPT_SET.md, EXECUTION_LOG.md, locked Prompt versions, task outcomes, and recorded result counts.

Rules:

1. Do not rewrite, overwrite, delete, or retroactively normalize a historical production record merely to make it conform to a newer rule, fix the appearance of an earlier decision, or reflect a later interpretation.
2. A locked Prompt Set and its prompts are immutable execution history. Any future prompt revision must be saved as a new version or a new production record; do not edit the already locked prompt that was used or intended for execution.
3. New rules apply prospectively to newly designed prompts and new production tasks. They do not silently change the rules or prompts attributed to completed or previously started tasks.
4. If a factual recording error must be corrected, preserve the original record and add a separate, timestamped correction / amendment entry that identifies the affected record and field, the original recorded value when available, the corrected value, the reason, and the evidence. Do not erase the original event or make the correction appear to have existed at the original time.
5. Historical records may be read, analyzed, counted, compared, and referenced. Analysis should be stored separately or appended as a clearly identified addendum; it must not alter the underlying original production evidence.
6. Before modifying any production-record path, determine whether it is a historical Session/Batch record or an active mutable configuration/rule file. Never treat a historical record as a live rule file.

The purpose of this rule is to preserve traceability, support before/after comparisons, and allow future evaluation of whether a rule change improved production outcomes.
