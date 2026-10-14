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

**LORA_IMAGE exception:** the Batch-level `OUTPUT_TYPE` may be `MIXED_PER_TASK` to indicate that each Task independently selects its own format. This value is valid only for `MODULE=LORA_IMAGE`; other modules retain the existing two canonical values and their current Batch-level interpretation. For every LORA_IMAGE Task, record `TASK_OUTPUT_TYPE` as exactly one of `DESKTOP_16_9` or `PHONE_9_16`. This is the only per-Task format control; do not add `ASPECT_RATIO` or `ORIENTATION`. The Task's locked prompt must be designed consistently with its recorded value.

## 4. BATCH_RECORD.md
Record: SESSION_ID, BATCH_ID, MODULE, PRODUCTION_TYPE, IMAGE_COUNT, BATCH_STATUS, COMPLETED_COUNT, RESULT_RECORDED_COUNT, ACTUAL_IMAGE_COUNT, UNVERIFIED_COUNT, FAILED_COUNT, DEFERRED_COUNT, BLOCKED_COUNT, PENDING_COUNT, ATTEMPT_COUNT, CURRENT_TASK, NEXT_TASK, CHECKPOINT, and termination/completion information. These state counts must remain separate; do not combine failed, deferred, blocked, and unverified Tasks into one ambiguous counter. `COMPLETED_COUNT` counts Tasks with at least one confirmed image result durably recorded against the Task, once per Task. `RESULT_RECORDED_COUNT` is reserved for terminal image-result records that cannot be attributed/recorded sufficiently to count as successful Task outputs; do not use it merely because multiple files were returned or QA has not occurred. `ACTUAL_IMAGE_COUNT` is the total number of individual image files actually received across all Tasks.
A Batch MUST NOT be complete while any required Task is unfinished or has not reached a valid terminal state. It MUST close once every required Task has reached a valid terminal outcome and the completion record is written and verified; unsuccessful outcomes do not keep the Batch open.

## 5. TASK_QUEUE.md
Each Task should record, as applicable:
- ORDER
- TASK_ID
- TASK_OUTPUT_TYPE (required for LORA_IMAGE; one of DESKTOP_16_9 or PHONE_9_16)
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
- EXECUTION_INTEGRITY_BLOCKED = a Task could not proceed because the complete assigned locked Prompt could not be read. Do not use this status for separate content, metadata, format, Task-binding, visual judgments, or hidden-payload comparisons.
- GENERATION_FAILED = generation ended without a received image result.
- RESULT_COUNT_MISMATCH = legacy/historical status only; do not assign it solely because actual returned-file count differs from the planned Task output.
- SUCCESS = at least one image was confirmed received and durably recorded against the Task. Each Task counts once in COMPLETED_COUNT, regardless of actual returned-file count or visual compliance. SUCCESS is a production result only and does not imply visual correctness, prompt compliance, or QA PASS.

For wallpaper production, EXPECTED_OUTPUT_COUNT = 1 as the planned output per Task. If one or more images are confirmed received and the result is durably recorded against the Task, use `SUCCESS` and count the Task once. Record every received image file in ACTUAL_OUTPUT_COUNT and ACTUAL_IMAGE_COUNT. If multiple files are returned, do not use `RESULT_COUNT_MISMATCH` solely for that reason. `PROMPT_MATCH_STATUS` must remain `NOT_ASSESSED` or unset. Visual compliance and image quality belong to separate QA; production SUCCESS is not QA PASS.

## 6. PROMPT_SET.md
For every new Batch, each Task's prompt is stored in its own file at `PROMPTS/<TASK_ID>.md` (for example, `PROMPTS/TASK_001.md`). `PROMPT_SET.md` is a manifest/index only: it maps each Task to exactly one prompt file and records prompt metadata, but MUST NOT contain full prompt bodies. Design all prompts before execution, persist and verify every per-Task file, then lock the manifest and prompt files before generation. Resume does not silently redesign a locked prompt. Revisions require a new prompt version.

The Prompt Set lock metadata is authoritative and must be internally consistent: when PROMPT_SET_STATUS = LOCKED, PROMPT_SET_LOCKED MUST = YES. A persisted locked Prompt Set with PROMPT_SET_LOCKED = NO is invalid record state and must be corrected before execution/resume.

For `MODULE=LORA_IMAGE`, include `TASK_OUTPUT_TYPE` in each Task's queue entry, prompt-file metadata, and manifest metadata. The Batch contract uses `OUTPUT_TYPE=MIXED_PER_TASK`; the per-Task field selects the requested format. Do not infer a Task's format from another Task or from a global wallpaper-style Batch format.

Each executable Task in a new Batch has one authoritative prompt file `PROMPTS/<TASK_ID>.md`, created and verified during design/lock. The file contains the locked prompt text between `BEGIN_LOCKED_PROMPT_TEXT` and `END_LOCKED_PROMPT_TEXT`; `PROMPT_SET.md` is a manifest/index and does not duplicate prompt bodies. During production, the only prompt-related pre-generation check is whether the complete locked Prompt can be read. If read succeeds, immediately submit the text inside the delimiters unchanged to the generation tool; do not recheck Task binding, metadata, format, semantics, or content. If the complete Prompt cannot be read, record the read failure and stop that Task. Never reconstruct or substitute it. Existing combined-file Batches remain legacy records and must not be silently migrated.

Record `FULL_PROMPT_READ_STATUS` and `GENERATION_INPUT_MODE` as defined in Section 17. Reading the full Prompt does not, by itself, prove that the generation interface received the exact text. For new executions, `GENERATION_INPUT_MODE` must be `FULL_LOCKED_PROMPT`; any known deviation must be recorded honestly. If the interface does not expose independent payload telemetry, record DELIVERY_INTEGRITY_STATUS = NOT_EXPOSED or UNVERIFIED as applicable; do not claim transport verification that is unavailable. Missing telemetry alone does not prohibit generation.

## 7. EXECUTION_LOG.md
Typical events: DESIGN_COMPLETE, PROMPT_SET_LOCKED, GENERATION_STARTED, IMAGE_RESULT_RECEIVED, IMAGE_RESULT_RECORDED, RESULT_VERIFIED, GENERATION_SUCCESS, GENERATION_FAILED, EXECUTION_INTEGRITY_UNVERIFIED, EXECUTION_INTEGRITY_BLOCKED, RESULT_COUNT_MISMATCH, RESULT_BINDING_FAILED, POLICY_BLOCKED, SAFETY_BLOCKED, INTERRUPTION_CLASSIFIED, PROMPT_SKIPPED_POLICY_LIMIT, STOPPED, RESUMED, UNKNOWN, DEFERRED, RECORD_CORRECTED, COMPLETED. RETRY events MUST NOT be used to represent a second generation call for the same locked Prompt.
Each event should include timestamp with timezone, EVENT_ID, event type, SESSION_ID, BATCH_ID, TASK_ID when applicable, PROMPT_ID, PROMPT_VERSION, ATTEMPT_ID, GENERATION_CALL_ID, result/error information, output count, interruption class/counter when applicable, prompt-consumed state, and checkpoint reference when applicable.

## 8. Persistence and Recovery
Records must preserve enough information to determine which Session/Batch, contract, locked prompt, generation attempts, results, verification states, Task states, checkpoint, and historical events apply. All five standard batch records must be present before a Batch can resume: SESSION_CONTRACT.md, BATCH_RECORD.md, TASK_QUEUE.md, PROMPT_SET.md (manifest/index), and EXECUTION_LOG.md. For new-format Batches, every executable Task must also have its own readable `PROMPTS/<TASK_ID>.md` file and a valid one-to-one manifest mapping. If a required record or Task prompt file is missing, or a locked prompt cannot be read back, mark the affected Task or Batch BLOCKED as appropriate for record-integrity recovery; do not invent missing Task state or reconstruct a supposedly locked prompt from memory.
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

Completion means every required Task has reached a valid terminal state. A Batch MUST then be recorded as BATCH_COMPLETED and the Producer MUST stop issuing new generation calls for that Batch. A confirmed image result that is durably recorded against its Task is production SUCCESS, regardless of how many image files the generator returned. If result attribution cannot be established, preserve the image count and use the applicable result-recording/recovery state until attribution is resolved. Prompt-payload integrity and visual compliance are not Producer acceptance judgments and do not keep a result-bearing Task open.

Batch completion does not require every Task to be SUCCESS, and IMAGE_COUNT is the planned number of independent Tasks, not a success target. ACTUAL_IMAGE_COUNT counts all confirmed received images irrespective of whether they match their locked prompts.

## 10. Execution Integrity Reference
Detailed execution requirements are defined in 00_MASTER/GENERATION_WORKER_PROTOCOL.md.
Minimum chain: TASK_SELECTION → COMPLETE_LOCKED_PROMPT_READ → IMMEDIATE_GENERATION_CALL → IMAGE_RECEIVED_OR_NO_IMAGE → RECORD_RESULT_OR_FAILURE → TASK_STATUS.
The design/lock stage owns Task mapping, metadata, and prompt validity. During production, read the complete locked Prompt from the assigned source and, if successful, call the generation tool immediately with that exact text. Do not insert another check between successful read and generation. If the complete Prompt cannot be read, record the read failure and stop that Task. After the call, record observable result facts; unavailable payload telemetry is NOT_EXPOSED/UNVERIFIED and must not be guessed. The Producer MUST NOT perform payload equality audits or judge visual compliance.

## 11. Non-Goals
This schema does not define a GitHub scheduler, task lock, worker manager, retry engine, Session manager, or execution controller. Those remain internal ChatGPT production mechanisms.

## 12. Prompt Consumption and Single-Call Retirement Records

One locked Prompt/version receives at most ONE generation call. The call itself retires that Prompt/version from further generation, regardless of whether an image is received. `PROMPT_CONSUMED` separately records whether an image was actually received.

Persist at Task level, as applicable:
- `GENERATION_ATTEMPT_COUNT`
- `POLICY_INTERRUPTION_COUNT`
- `INTERRUPTION_CLASS`
- `INTERRUPTION_HISTORY`
- `PROMPT_CONSUMED`
- `PROMPT_STATE` (`AVAILABLE`, `CONSUMED`, `RETIRED`, `UNKNOWN`)
- `PROMPT_TERMINATION_REASON`

### 12.1 Outcome and prompt-state rules

1. When a generation call is initiated, set `PROMPT_STATE = RETIRED` for further generation use; never call that Prompt/version again. Set `PROMPT_CONSUMED = YES` only when an image result is confirmed received. Count the image without making a prompt-payload or visual-compliance judgment.
2. A confirmed no-image result after the generation call does not authorize a second call. Record the observed failure and end that Task's generation attempt.
3. Service/runtime errors, quota/rate limits, GitHub failures, and policy/safety interruptions must be recorded according to the observed outcome, but none authorizes automatic or repeated generation of the same locked Prompt/version.
4. If the outcome is unknown, set `PROMPT_CONSUMED = UNKNOWN`, `PROMPT_STATE = UNKNOWN`, and the applicable recovery-required state. Do not retry, skip, or advance until the outcome is resolved.
5. `PROMPT_STATE = RETIRED` means the Prompt is permanently forbidden from future reuse, regardless of `PROMPT_CONSUMED`. Once its one generation call is initiated, retire the Prompt. Retired Prompts must never be re-queued, reassigned, or used by another Task.
6. `PROMPT_CONSUMED` is tri-state: `YES` only for a confirmed received image result; `NO` only when no image result is confirmed and the outcome is known to be no-image; `UNKNOWN` when the outcome cannot be determined. `PROMPT_STATE` is `RETIRED` after its one generation call, even when `PROMPT_CONSUMED = NO` or `UNKNOWN`. No state authorizes a second call for the same Prompt/version.

### 12.2 Policy/Safety interruption limit

Only verified Policy/Safety interruptions increment `POLICY_INTERRUPTION_COUNT`. Other error classes have separate handling and must not increment this counter.

After any generation call is initiated, the same locked Prompt/version MUST NOT be called again. This rule applies to confirmed no-image failures, service/runtime errors, quota/rate limits, policy/safety interruptions, and unknown outcomes. Record the observed result and interruption class, if known, then stop that Task's generation attempt. Legacy interruption counters and terminal labels may be preserved as historical fields, but they do not authorize another generation call. Image QA is never a regeneration trigger.

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
2. Before reading a later Task's Prompt, select that Task from the existing authoritative Session/Batch records. Once its complete locked Prompt is read, call the generation tool immediately without further prompt, metadata, binding, or format checks.
3. Continuing an independent Task does not resolve, pass, skip, or repair the isolated Task. Preserve it for later recovery.
4. UNKNOWN generation outcome remains non-terminal for the affected Task. Never retry or reuse its Prompt while outcome remains unknown. Do not falsely count it as completed. Independent Tasks may proceed only if they do not depend on that unresolved outcome and their own readiness checks pass.
5. Visual QA observations, including partial visual deviation from a Prompt, anatomy defects, composition issues, or aesthetic concerns, MUST NOT by themselves be classified as EXECUTION_INTEGRITY_BLOCKED. They belong to the separate QA workflow and do not trigger regeneration.
6. `EXECUTION_INTEGRITY_BLOCKED` is used when the complete assigned Prompt cannot be read. The Producer MUST NOT add a separate missing/empty-content, metadata, Task-binding, or format validation gate after reading. The Producer MUST NOT assess whether the submitted payload exactly matched the locked Prompt after generation. Lack of hidden transport telemetry or visual discrepancy alone is insufficient.
7. Missing required Batch records or an unreadable current locked Prompt must be recorded accurately. If a specific Task's Prompt cannot be read back, block that Task; escalate to Batch-level recovery only if the missing/conflicting record prevents safe identification or verification of all eligible next Tasks.
8. The Batch remains incomplete until every required Task reaches a valid terminal state and the completion record is written and verified. Task-local isolation does not mean the Batch is complete.

## 15. Multi-Worker Handoff and Dependency Semantics

The records support future multi-Worker handoff but do not themselves implement a runtime scheduler or Worker controller.

1. Task selection uses the existing Session/Batch records before prompt reading. During production, the only prompt-related pre-generation check is successful reading of the complete assigned locked Prompt.
2. A prior Worker's report is not a substitute for authoritative state, and absence of that report is not a global gate when the next Task can independently be verified.
3. A prompt read failure affects that Task. For an independent later Task, select it from the existing records, read its complete locked Prompt, and immediately call the generation tool if the read succeeds.
4. PROMPT_MATCH_STATUS = UNVERIFIED describes evidence for the image/result associated with that Task. It does not, by itself, block an unrelated Task or prove that a downstream Task is unsafe.
5. Dependencies MUST be explicit in the applicable Session/Batch contract. Queue order, previous Worker identity, or prior Task failure does not create an implicit dependency.
6. A field is a blocking prerequisite only when the current contract explicitly requires it for the specific operation. Missing optional telemetry or nonessential narrative is not a blocking prerequisite.
7. If a required record for the assigned Task cannot be read or verified, isolate that Task and identify the exact missing prerequisite. Use BATCH_LEVEL_RECOVERY_REQUIRED only for a verified Batch-wide conflict that cannot be isolated.
8. These rules do not weaken the SUCCESS gate, permit retry of an unknown outcome, reuse a retired Prompt, or grant a recorded image automatic LoRA dataset eligibility.


## 16. Historical Record Immutability

Historical production records are experimental evidence and MUST be preserved in their original form. Existing Batches using a combined `PROMPT_SET.md` remain legacy and are not silently converted to the per-Task file layout. This applies to all modules and includes, but is not limited to, SESSION_CONTRACT.md, BATCH_RECORD.md, TASK_QUEUE.md, PROMPT_SET.md, EXECUTION_LOG.md, locked Prompt versions, task outcomes, and recorded result counts.

Rules:

1. Do not rewrite, overwrite, delete, or retroactively normalize a historical production record merely to make it conform to a newer rule, fix the appearance of an earlier decision, or reflect a later interpretation.
2. A locked prompt manifest and its per-Task prompt files are immutable execution history. Any future prompt revision must be saved as a new version or a new production record; do not edit the already locked prompt that was used or intended for execution.
3. New rules apply prospectively to newly designed prompts and new production tasks. They do not silently change the rules or prompts attributed to completed or previously started tasks.
4. If a factual recording error must be corrected, preserve the original record and add a separate, timestamped correction / amendment entry that identifies the affected record and field, the original recorded value when available, the corrected value, the reason, and the evidence. Do not erase the original event or make the correction appear to have existed at the original time.
5. Historical records may be read, analyzed, counted, compared, and referenced. Analysis should be stored separately or appended as a clearly identified addendum; it must not alter the underlying original production evidence.
6. Before modifying any production-record path, determine whether it is a historical Session/Batch record or an active mutable configuration/rule file. Never treat a historical record as a live rule file.

The purpose of this rule is to preserve traceability, support before/after comparisons, and allow future evaluation of whether a rule change improved production outcomes.


## 17. Full-Prompt Read and Generation-Input Mode Fields

For each generation attempt, record these fields in the Task record and/or corresponding EXECUTION_LOG event where the record format supports them:

- `FULL_PROMPT_READ_STATUS`: `CONFIRMED`, `NOT_CONFIRMED`, or `UNKNOWN`. Use `CONFIRMED` only when the Producer actually read the complete current locked Prompt from the Task's authoritative per-Task prompt file (or the documented legacy source for an existing Batch) before preparing the input.
- `GENERATION_INPUT_MODE`: `FULL_LOCKED_PROMPT`, `KNOWN_DEVIATION`, or `UNKNOWN`. For new executions, `FULL_LOCKED_PROMPT` is the only permitted mode. Use `KNOWN_DEVIATION` only to record a confirmed departure from the verbatim-input rule; it is not an authorized input mode.
- `SHORTENED_PROMPT_PRESERVATION_STATUS`: **LEGACY FIELD — deprecated for new executions.** It exists only to interpret historical records created under the former shortening rule. For new executions, set it to `NOT_APPLICABLE`; never shorten a locked Prompt and never retrofit historical records.

These fields are independent of `DELIVERY_INTEGRITY_STATUS`. They record the Producer's preparation/action and must not be used to claim hidden transport telemetry that the interface does not expose. If a fact cannot be established, use `UNKNOWN` or `NOT_VERIFIED`; do not fill it by inference. A missing field in a historical record must not be retroactively guessed.

The locked Prompt Set and the generation input must preserve the exact same complete Prompt text. No shortened or derived generation input is permitted. Prompt immutability does not authorize reuse of a consumed Prompt or a second generation call for a Task whose Prompt has already been consumed.

## 18. Current Producer No-QA and Task Output Counting Rule — Overrides Older Conflicts

The Producer MUST NOT perform post-generation QA. The Producer must not visually inspect or evaluate the image, compare it with the locked prompt, judge prompt compliance, image quality, identity, anatomy, composition, style, or dataset suitability. The Producer records observable production facts only.

Any confirmed receipt of one or more images for a Task counts as exactly ONE successfully produced Task output and increments COMPLETED_COUNT by one, provided the received result is durably recorded against that Task. This remains true when the generator returns two or more image files, or when a later independent QA process may find a visual defect. Record the actual number of returned files in the Task's ACTUAL_OUTPUT_COUNT and include every confirmed received file in batch ACTUAL_IMAGE_COUNT.

Do not use RESULT_COUNT_MISMATCH solely because ACTUAL_OUTPUT_COUNT differs from EXPECTED_OUTPUT_COUNT when an image has been received. Multiple files from one prompt are recorded as actual output facts, but do not create additional successful Task outputs. RESULT_COUNT_MISMATCH is not a reason to downgrade a confirmed image-producing Task under this rule.

Once any image is confirmed received, set PROMPT_CONSUMED = YES and retire the Prompt/version so it can never be used again. QA is a separate downstream process. QA status must not alter production success/counts, prompt-consumption state, or trigger regeneration.

This section supersedes earlier schema wording that requires the actual output count to equal the expected count for SUCCESS, classifies extra images as RESULT_COUNT_MISMATCH, or permits Producer-side visual or prompt-compliance assessment. Historical Batch records remain immutable; apply this rule to new execution and use a separately recorded correction only when correcting a verified factual recording error.

## 19. Current Task-Level Retry, Prompt State, and Completion Policy — Overrides Conflicting Older Rules
This section is the current authoritative policy for new production and resume records. It supersedes conflicting earlier wording in this schema that requires one call per locked Prompt/version or forbids all retries.

### 19.1 Completion rule
- If one or more image files are confirmed received for a Task, mark that Task SUCCESS once the receipt is durably attributed to it. COMPLETED_COUNT increases by one for that Task, regardless of the number of files received.
- Record the actual number of received files in ACTUAL_OUTPUT_COUNT and include them in ACTUAL_IMAGE_COUNT.
- Never retry a Task after image receipt. QA observations, appearance, prompt-compliance concerns, or extra returned files do not undo production success and do not trigger regeneration.

### 19.2 Retry rule
- Retry only a known failed attempt for which no image was received. Do not retry a result-bearing Task.
- The initial attempt is not a retry. After an initial confirmed no-image failure, retry the same Task using the same complete authoritative locked Prompt text. Do not edit the locked prompt or its Task mapping.
- Every attempt must have a distinct ATTEMPT_ID and GENERATION_CALL_ID where available, plus a timestamp, outcome, interruption/error class, image receipt state, and retry ordinal.
- Count retry failures separately from the initial attempt. After three retry attempts have each failed with a confirmed no-image outcome, mark the Task terminal (GENERATION_FAILED or another applicable specific terminal state), record retry exhaustion and the reason, and never start that Task again.
- If a retry produces one or more images, the Task is SUCCESS; no further retry is allowed.

### 19.3 Unknown outcomes and safety/policy blocks
- If an attempt's outcome is unknown, preserve PROMPT_CONSUMED=UNKNOWN and the applicable recovery state. Do not retry while the outcome remains unknown.
- Record policy/safety blocks and service/runtime/quota/rate-limit failures accurately. Retry must not be used to evade policy or safety restrictions. A permitted retry that fails with a confirmed no-image outcome counts toward the three failed retries.
- A Task reaching retry exhaustion is Task-local. Continue unrelated Tasks if they are independently executable and do not rely on the unresolved Task.

### 19.4 Prompt-state interpretation under retries
For new records, distinguish Task-level retry eligibility from prompt immutability:
- The locked prompt text and Task-to-prompt mapping remain immutable.
- A confirmed no-image failure with a known outcome may permit another attempt for the same Task, using the same unchanged locked prompt, until the retry limit is reached.
- After confirmed image receipt, an unknown outcome, or terminal retry exhaustion, no further attempt is allowed for that Task.
- PROMPT_CONSUMED records image receipt, not merely whether a generation call was made: YES = image received; NO = known no-image outcome; UNKNOWN = outcome unresolved.
- Update PROMPT_STATE definitions/usage so RETIRED is not set merely because a first attempt was made when a known no-image retry is allowed. Use AVAILABLE only for a retryable known-failure state within the same Task; use CONSUMED after image receipt, UNKNOWN while the outcome is unresolved, and RETIRED after retry exhaustion or another terminal no-retry condition. A prompt must never be reassigned to a different Task.

### 19.5 Required record fields and events
For each Task, persist at least:
- GENERATION_ATTEMPT_COUNT (all calls, including the initial attempt);
- RETRY_ATTEMPT_COUNT (retry calls only);
- RETRY_FAILURE_COUNT (retry attempts with confirmed no-image failures);
- LAST_ATTEMPT_ID and LAST_GENERATION_CALL_ID where available;
- PROMPT_CONSUMED, PROMPT_STATE, PROMPT_TERMINATION_REASON;
- TASK_STATUS, GENERATION_STATUS, ACTUAL_OUTPUT_COUNT, and the current error/interruption class.

For each attempt, append a separate GENERATION_STARTED and terminal result event as applicable. Use a retry-specific event such as RETRY_STARTED when a retry begins, and record RETRY_FAILED for a confirmed no-image retry failure. A confirmed image receipt must be recorded as IMAGE_RESULT_RECEIVED / GENERATION_SUCCESS and must never be followed by another attempt for that Task. When RETRY_FAILURE_COUNT=3, record RETRY_LIMIT_REACHED and the Task's terminal state. Do not overwrite previous attempt events.

### 19.6 Persistence failures
Keep generation outcome separate from GitHub persistence state. A confirmed image receipt remains a fact even if its record write/readback fails. Recover the persistence record without regenerating. Do not advance to another Task until required durable state is recovered if the current workflow requires persistence before advancing; however, do not relabel a received image as no-image and do not repeat its generation call.

This policy applies prospectively. Preserve historical records and do not rewrite old Batch execution evidence.
