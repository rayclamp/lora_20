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

Optional production-time evidence files within the same Batch directory:
- `EXECUTION_INPUTS/<TASK_ID>.md`: one immutable, exact authorized condensed execution input per Task, created **after its first actual generation call** if condensation was used.
- `RECOVERY_CHECKPOINTS/<TASK_ID>.md`: a complete, durably verified fallback for Task-local persistence failure, including the exact fixed input and known Task/attempt/result state.

Neither file is a design/lock prerequisite, replaces `PROMPTS/<TASK_ID>.md`, or changes the five standard Batch records. Each Task has at most one authoritative execution-input source at any given time.

## 3. SESSION_CONTRACT.md
Typical fields: SESSION_ID, BATCH_ID, SESSION_SCOPE, MODULE, PRODUCTION_TYPE, CHARACTER, IMAGE_COUNT, OUTPUT_TYPE, user constraints, and design/execution boundary.
OUTPUT_TYPE is the combined output contract that identifies the target class and exact aspect ratio. Canonical values are `DESKTOP_16_9` and `PHONE_9_16`. Do not add a separate ASPECT_RATIO or ORIENTATION control when OUTPUT_TYPE already expresses the complete output format.

**LORA_IMAGE exception:** the Batch-level `OUTPUT_TYPE` may be `MIXED_PER_TASK` to indicate that each Task independently selects its own format. This value is valid only for `MODULE=LORA_IMAGE`; other modules retain the existing two canonical values and their current Batch-level interpretation. For every LORA_IMAGE Task, record `TASK_OUTPUT_TYPE` as exactly one of `DESKTOP_16_9` or `PHONE_9_16`. This is the only per-Task format control; do not add `ASPECT_RATIO` or `ORIENTATION`. The Task's locked prompt must be designed consistently with its recorded value.

## 4. BATCH_RECORD.md
Record: SESSION_ID, BATCH_ID, MODULE, PRODUCTION_TYPE, IMAGE_COUNT, BATCH_STATUS, COMPLETED_COUNT, RESULT_RECORDED_COUNT, ACTUAL_IMAGE_COUNT, UNVERIFIED_COUNT, FAILED_COUNT, DEFERRED_COUNT, BLOCKED_COUNT, PAUSED_COUNT, PENDING_COUNT, ATTEMPT_COUNT, CURRENT_TASK, NEXT_TASK, CHECKPOINT, and termination/completion information. These state counts must remain separate; do not combine failed, deferred, blocked, and unverified Tasks into one ambiguous counter. `COMPLETED_COUNT` counts Tasks with at least one confirmed image result durably recorded against the Task, once per Task. `RESULT_RECORDED_COUNT` is reserved for terminal image-result records that cannot be attributed/recorded sufficiently to count as successful Task outputs; do not use it merely because multiple files were returned or QA has not occurred. `ACTUAL_IMAGE_COUNT` is the total number of individual image files actually received across all Tasks.
A Batch MUST NOT be complete while any required Task is unfinished, PAUSED, or has not reached a valid terminal state. It MUST close once every required Task has reached a valid terminal outcome and the completion record is written and verified; unsuccessful terminal outcomes do not keep the Batch open. `PAUSED_COUNT` counts current PAUSED Tasks separately from `PENDING_COUNT`, BLOCKED, DEFERRED, FAILED, and UNVERIFIED. A Task must not be double-counted in current Task-status categories. `ATTEMPT_COUNT` includes actual generation calls only; a pre-call PAUSED event never increases it.

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
- GENERATION_INPUT_MODE (`FULL_LOCKED_PROMPT`, `AUTHORIZED_CONDENSED_PROMPT`, `KNOWN_DEVIATION`, `UNKNOWN`)
- EXECUTION_INPUT_PATH (the one authoritative fixed-instruction source, when established)
- EXECUTION_INPUT_RECORD_STATUS (`NOT_REQUIRED`, `PENDING`, `READBACK_VERIFIED`, `WRITE_FAILED`, `CONFLICT`)
- FIRST_ATTEMPT_ID (when the first actual generation call occurred)
- PAUSE_REASON / PAUSED_AT / RESUMED_AT (when applicable)
- REMAINING_GENERATION_ATTEMPTS (derived from real attempted calls and applicable retry/policy constraints; never reset on pause)

Task status semantics (the Task's recorded outcome is separate from the generation observation, evidence fields, prompt state, QA, and Batch counters):
- GENERATION_STARTED = actual generation attempt initiated; non-terminal. A pre-call pause is not GENERATION_STARTED.
- PAUSED = a non-terminal Task state for temporary inability to submit the exact prepared/fixed Task input before a new generation call, or Task-local condensed-input persistence recovery preventing an otherwise permitted retry. Preserve the exact fixed input, prior attempts, confirmed no-image failures, and remaining retry eligibility. PAUSED does not consume an attempt, is not a policy-bypass route, and never applies to confirmed image receipt, UNKNOWN actual-call outcomes, or exhausted retries. A PAUSED Task prevents Batch completion.
- IMAGE_RESULT_RECEIVED = an image result has arrived; event/evidence state, not necessarily a terminal Task status.
- IMAGE_RESULT_RECORDED = an image receipt and actual returned-file count have been durably recorded and readback-verified, but the result has been formally classified as non-SUCCESS because its Task/result binding cannot be established. Preserve the reason and supporting evidence. This is a terminal recorded-result disposition, not QA PASS. Do not use it for a merely pending write/readback or a still-recoverable, unresolved binding.
- RESULT_RECEIVED_UNVERIFIED = at least one image was observably received, but required evidence, Task attribution, record write, or readback is still incomplete or unresolved. This is non-terminal; preserve the image-received fact, prohibit regeneration, and do not increment verified COMPLETED_COUNT before reconciliation.
- EXECUTION_INTEGRITY_UNVERIFIED = an evidence/integrity field is unavailable or not exposed; this is an independent evidence classification, not an automatic Task terminal status or reason to downgrade SUCCESS. If received-image attribution and required persistence are verified, the Task may be SUCCESS while this evidence field remains UNVERIFIED; if required evidence or attribution is unresolved, use the applicable non-terminal recovery state.
- EXECUTION_INTEGRITY_BLOCKED = a Task could not proceed because the complete assigned locked Prompt could not be read. Do not use this status for separate content, metadata, format, Task-binding, visual judgments, or hidden-payload comparisons.
- GENERATION_FAILED = terminal generation failure only after three consecutive confirmed no-image outcomes from actual image-generation attempts for the same Task, counting the initial call, with separate attempt evidence preserved. A first or second confirmed no-image outcome remains retry-eligible when policy permits. GitHub/prompt-read/metadata errors, UNKNOWN results, or a policy block before a generation call do not qualify for GENERATION_FAILED.
- RESULT_COUNT_MISMATCH = historical/legacy status for interpreting existing records only. Never assign it to a new Task or new execution event, including when actual returned-file count differs from the expected count. Preserve historical labels without retroactive migration.
- SUCCESS = at least one image was confirmed received, correctly attributed to the Task, and its required result event and Task state were durably written and read back successfully. Each Task then counts once in COMPLETED_COUNT regardless of file count or visual compliance. A merely observed image receipt is not yet a formally recorded SUCCESS; QA PASS remains independent.

For wallpaper production, EXPECTED_OUTPUT_COUNT = 1 as the planned output per Task. If one or more images are confirmed received and the result is durably recorded against the Task, use `SUCCESS` and count the Task once. Record every received image file in ACTUAL_OUTPUT_COUNT and ACTUAL_IMAGE_COUNT. If multiple files are returned, do not use `RESULT_COUNT_MISMATCH` solely for that reason. `PROMPT_MATCH_STATUS` must remain `NOT_ASSESSED` or unset. Visual compliance and image quality belong to separate QA; production SUCCESS is not QA PASS.

State and field priority for new execution: (1) actual generator observation determines IMAGE_RECEIVED / generation result (YES, confirmed NO, or UNKNOWN); a pre-call interruption is NOT_ATTEMPTED rather than a false NO; (2) PROMPT_CONSUMED and PROMPT_STATE reflect receipt and retry eligibility; (3) independent evidence/integrity fields describe known or unavailable proof without silently changing Task disposition; (4) TASK_STATUS is derived from observed facts, Task/result attribution, required durable recording and readback, and allowed terminal conditions; (5) Batch counters are derived from verified Task and attempt history, never used to infer an outcome; (6) QA remains separately PAUSED and never changes production status/counts or triggers regeneration. No status label or GitHub entry alone proves an image was received. These classifications must not be merged into one field.

## 6. PROMPT_SET.md
For every new Batch, each Task's prompt is stored in its own file at `PROMPTS/<TASK_ID>.md` (for example, `PROMPTS/TASK_001.md`). `PROMPT_SET.md` is a manifest/index only: it maps each Task to exactly one prompt file and records prompt metadata, but MUST NOT contain full prompt bodies. Design all prompts before execution, persist and verify every per-Task file, then lock the manifest and prompt files before generation. Resume does not silently redesign a locked prompt. Revisions require a new prompt version.

The Prompt Set lock metadata is authoritative and must be internally consistent: when PROMPT_SET_STATUS = LOCKED, PROMPT_SET_LOCKED MUST = YES. A persisted locked Prompt Set with PROMPT_SET_LOCKED = NO is invalid record state and must be corrected before execution/resume.

For `MODULE=LORA_IMAGE`, include `TASK_OUTPUT_TYPE` in each Task's queue entry, prompt-file metadata, and manifest metadata. The Batch contract uses `OUTPUT_TYPE=MIXED_PER_TASK`; the per-Task field selects the requested format. Do not infer a Task's format from another Task or from a global wallpaper-style Batch format.

Each executable Task in a new Batch has one authoritative prompt file `PROMPTS/<TASK_ID>.md`, created and verified during design/lock. The file contains the locked prompt text between `BEGIN_LOCKED_PROMPT_TEXT` and `END_LOCKED_PROMPT_TEXT`; `PROMPT_SET.md` is a manifest/index and does not duplicate prompt bodies. During production, read the complete locked Prompt, then prepare and immediately submit an effective Task-specific instruction under the shared Generation Worker Protocol. The full locked Prompt is the default; a concrete interface input limitation may require a faithful, separately recorded authorized condensed input. No extra Task-binding, metadata, format, semantic, content, or visual QA checks are allowed. If the complete Prompt cannot be read, record the read failure and stop that Task; never reconstruct or substitute it. The canonical source remains immutable. Existing combined-file Batches remain legacy records and must not be silently migrated.

Record `FULL_PROMPT_READ_STATUS` and `GENERATION_INPUT_MODE` as defined in Section 17. Reading the full Prompt does not, by itself, prove that the generation interface received the exact text. For new executions, the permitted input modes are `FULL_LOCKED_PROMPT` and `AUTHORIZED_CONDENSED_PROMPT` under Section 17; an unauthorized alteration is `KNOWN_DEVIATION` and must be recorded honestly. Authorized condensed text is preserved after the first actual call in its own immutable execution-input record, not in `PROMPT_SET.md` or the original locked Prompt. If the interface does not expose independent payload telemetry, record DELIVERY_INTEGRITY_STATUS = NOT_EXPOSED or UNVERIFIED as applicable; do not claim transport verification that is unavailable. Missing telemetry alone does not prohibit generation.

## 7. EXECUTION_LOG.md
Typical events: DESIGN_COMPLETE, PROMPT_SET_LOCKED, EXECUTION_INPUT_RECORDED, EXECUTION_INPUT_PERSISTENCE_FAILED, SAFE_RECOVERY_CHECKPOINT_RECORDED, TASK_PAUSED, TASK_RESUMED, GENERATION_STARTED, IMAGE_RESULT_RECEIVED, IMAGE_RESULT_RECORDED, RESULT_VERIFIED, GENERATION_SUCCESS, GENERATION_FAILED, EXECUTION_INTEGRITY_UNVERIFIED, EXECUTION_INTEGRITY_BLOCKED, RESULT_COUNT_MISMATCH (historical events only), RESULT_BINDING_FAILED, POLICY_BLOCKED, SAFETY_BLOCKED, INTERRUPTION_CLASSIFIED, PROMPT_SKIPPED_POLICY_LIMIT, STOPPED, RESUMED, UNKNOWN, DEFERRED, RECORD_CORRECTED, COMPLETED. RETRY events must identify permitted retry attempts for the same Task and exact fixed execution input, with the same immutable locked Prompt reference; do not duplicate or overwrite prior attempt events.
Each event should include timestamp with timezone, EVENT_ID, event type, SESSION_ID, BATCH_ID, TASK_ID when applicable, PROMPT_ID, PROMPT_VERSION, ATTEMPT_ID, GENERATION_CALL_ID, result/error information, output count, interruption class/counter when applicable, prompt-consumed state, and checkpoint reference and `GENERATION_INPUT_MODE`, `EXECUTION_INPUT_PATH`, `EXECUTION_INPUT_RECORD_STATUS`, pause/resume reason/timestamp when applicable. `EXECUTION_LOG.md` stores only input paths and event facts, never the entire authorized condensed instruction. `EXECUTION_INPUT_RECORDED` requires a successful write and readback; `TASK_PAUSED` and `TASK_RESUMED` are not generation calls.

## 8. Persistence and Recovery
Records must preserve enough information to determine which Session/Batch, contract, locked prompt, generation attempts, results, verification states, Task states, checkpoint, and historical events apply. All five standard batch records must be present before a Batch can resume: SESSION_CONTRACT.md, BATCH_RECORD.md, TASK_QUEUE.md, PROMPT_SET.md (manifest/index), and EXECUTION_LOG.md. For new-format Batches, every executable Task must also have its own readable `PROMPTS/<TASK_ID>.md` file and a valid one-to-one manifest mapping. If a required record or Task prompt file is missing, or a locked prompt cannot be read back, mark the affected Task or Batch BLOCKED as appropriate for record-integrity recovery; do not invent missing Task state or reconstruct a supposedly locked prompt from memory.
An unverified image result MUST NOT be silently counted as a completed Task during resume.

Optional execution-input and recovery evidence:
- When authorized condensation was actually used, save the **exact fixed condensed text after the first actual generation call** to `EXECUTION_INPUTS/<TASK_ID>.md` and read back and verify it before any retry.
- A Task has at most one such condensed execution-input file. Once successfully created and verified, it is immutable; do not overwrite it, create a second condensed version, or rebuild it from memory.
- On a write/readback failure, isolate the Task; a fallback `RECOVERY_CHECKPOINTS/<TASK_ID>.md` must preserve the complete exact fixed text, source Prompt ID/version, Task/Batch identity, all known generation calls and outcomes, prompt-consumption state, remaining attempt budget, Task/result attribution, and persistence evidence. A hash, path, or narrative alone is insufficient.
- A checkpoint is usable only once written and readback-verified. Only one execution-input path is authoritative for the Task at a time. Do not falsely claim that an unsaved file exists. Other independent Tasks may continue only after the affected Task's known state/input/results are safely preserved or verified by a complete checkpoint and their own authoritative inputs are readable.
- These optional records do not remove the requirement for the five standard Batch records or replace the immutable canonical locked Prompt.

## 9. Terminal States and Completion
A Task is terminal only when its final state is explicitly recorded as one of the following valid terminal outcomes:

- SUCCESS
- IMAGE_RESULT_RECORDED
- GENERATION_FAILED
- EXECUTION_INTEGRITY_BLOCKED
- BLOCKED
- DEFERRED
- PROMPT_SKIPPED_POLICY_LIMIT
- STOPPED

PAUSED, RESULT_RECEIVED_UNVERIFIED, EXECUTION_INTEGRITY_UNVERIFIED, GENERATION_STARTED, and other in-progress/evidence states are not terminal. PAUSED is never a valid terminal outcome and does not count as BLOCKED or DEFERRED. Historical RESULT_COUNT_MISMATCH entries remain readable as historical terminal outcomes only; they are not valid terminal outcomes to assign in new execution. IMAGE_RESULT_RECORDED is terminal only when its non-SUCCESS disposition and required receipt/count evidence are durably recorded and readback-verified, not when recovery is merely pending.

Completion means every required Task has reached a valid terminal state and PAUSED_COUNT is zero. A Batch MUST then be recorded as BATCH_COMPLETED and the Producer MUST stop issuing new generation calls for that Batch. A confirmed image result that is durably recorded against its Task is production SUCCESS, regardless of how many image files the generator returned. If result attribution cannot be established, preserve the image count and use the applicable result-recording/recovery state until attribution is resolved. Prompt-payload integrity and visual compliance are not Producer acceptance judgments and do not keep a result-bearing Task open.

Batch completion does not require every Task to be SUCCESS, and IMAGE_COUNT is the planned number of independent Tasks, not a success target. ACTUAL_IMAGE_COUNT counts all confirmed received images irrespective of whether they match their locked prompts.

## 10. Execution Integrity Reference
Detailed execution requirements are defined in 00_MASTER/GENERATION_WORKER_PROTOCOL.md.
Minimum chain: TASK_SELECTION → COMPLETE_LOCKED_PROMPT_READ → EFFECTIVE_TASK_INPUT_PREPARATION (FULL BY DEFAULT; AUTHORIZED_CONDENSATION ONLY WHEN NECESSARY) → IMMEDIATE_GENERATION_CALL → IMAGE_RECEIVED_OR_CONFIRMED_NO_IMAGE_OR_UNKNOWN → OPTIONAL_CONDENSED_INPUT_PRESERVATION → RECORD_RESULT_OR_FAILURE → READBACK_AND_TASK_STATUS.

The design/lock stage owns Task mapping, metadata, and Prompt validity. In production read the complete locked Prompt from its assigned source. If successful, immediately use the complete text by default or prepare one faithful condensed input only for a concrete interface limitation; then invoke generation with effective Task-specific instructions without unrelated operations or content validation. If condensed input was used, preserve its exact fixed text after the first actual generation call and read it back before retry or unsafe progression. A temporary pre-call inability to submit that fixed input enters PAUSED without a generation call. If the canonical Prompt cannot be read, record that failure and stop the affected Task. Missing hidden payload telemetry is NOT_EXPOSED/UNVERIFIED, not an inferred failed handoff. Producer visual QA and payload equality audits remain forbidden.

## 11. Non-Goals
This schema does not define a GitHub scheduler, task lock, worker manager, retry engine, Session manager, or execution controller. Those remain internal ChatGPT production mechanisms.

## 12. Prompt Consumption and Task-Level Retry Records

The locked Prompt text and Task-to-prompt mapping are immutable. A known no-image failure may be retried for the same Task using the exact generation input fixed at its first actual call and the same canonical Prompt reference under Section 19. A confirmed image receipt, an unknown outcome, or retry exhaustion prohibits further attempts for that Task. `PROMPT_CONSUMED` records image receipt, not merely whether a generation call was made.

Persist at Task level, as applicable:
- `GENERATION_ATTEMPT_COUNT`
- `POLICY_INTERRUPTION_COUNT`
- `INTERRUPTION_CLASS`
- `INTERRUPTION_HISTORY`
- `PROMPT_CONSUMED` (`NOT_ATTEMPTED`, `YES`, `NO`, `UNKNOWN`)
- `PROMPT_STATE` (`AVAILABLE`, `CONSUMED`, `RETIRED`, `UNKNOWN`)
- `PROMPT_TERMINATION_REASON`

### 12.1 Outcome and prompt-state rules

0. Before a Task's first actual image-generation call, use `PROMPT_CONSUMED=NOT_ATTEMPTED` and, if the Task remains eligible, `PROMPT_STATE=AVAILABLE`. A pre-call submission interruption and PAUSED event do not constitute a confirmed no-image attempt.
1. Set `PROMPT_CONSUMED = YES` only when an image result is confirmed received. Such receipt permanently ends further generation attempts for that Task. Formal TASK_STATUS=SUCCESS and COMPLETED_COUNT require verified Task attribution and durable write/readback of the result; until then preserve the received-but-unverified recovery state.
2. For a confirmed no-image outcome, set `PROMPT_CONSUMED = NO`. If the retry budget remains, set `PROMPT_STATE = AVAILABLE` for another attempt of the same Task only, using the exact execution input fixed at the Task's first actual call.
3. If the outcome is unknown, set `PROMPT_CONSUMED = UNKNOWN`, `PROMPT_STATE = UNKNOWN`, and the applicable recovery-required state. Do not retry that Task while the outcome remains unresolved.
4. `PROMPT_STATE = CONSUMED` indicates a confirmed image receipt; `UNKNOWN` indicates an unresolved outcome; `AVAILABLE` permits an eligible Task's first actual generation call, or only a same-Task retry after a confirmed no-image failure within Section 19's limit; `RETIRED` means no further attempts are allowed because retry exhaustion or another terminal no-retry condition has been reached.
5. A Prompt must never be edited or reassigned to another Task. Keep every attempt and result as a separate append-only record.
6. PAUSED preserves `PROMPT_CONSUMED=NOT_ATTEMPTED` if no actual call was made, or `PROMPT_CONSUMED=NO` after a confirmed no-image call. It must never convert a known image receipt or UNKNOWN outcome into a retryable state.

### 12.2 Policy/Safety interruption limit

Only verified Policy/Safety interruptions increment `POLICY_INTERRUPTION_COUNT`. Other error classes have separate handling and must not increment this counter.

After a generation attempt, record the observed result and interruption class. A confirmed no-image failure may be retried under Section 19; do not retry a Task after image receipt or while the outcome is unknown. Policy/safety restrictions must never be bypassed, and QA is never a regeneration trigger.

## 13. Persistence Requirement

Automated production records must be durably written and readback-verified before declaring formal Task SUCCESS or Batch completion. A Task-local write/readback error is isolated, not a generation failure; it does not by itself make independent Tasks terminal. Before progressing, safely preserve/reconcile the previous attempt's observed result and Task attribution under Sections 19.6 and 20.4, then independently read the next Task's current authoritative inputs. If the known result cannot be safely preserved, pause progression to recover persistence. Never use memory, cache, stale context, or guesses as substitute evidence.

When current GitHub data is required, connection/read verification must occur at that stage. When durable state is produced, it must be written and read back for verification.

If a required record write/readback fails, stop the affected persistence operation, preserve observed generation facts and classify its unresolved Task-local state. Never repeat image generation to repair a record, and never assume a pending write has succeeded. An unrelated Task may proceed only after the affected Task's known outcome, available attempt/result evidence, attribution, required state, and exact fixed execution input where applicable have been durably recorded and readback-verified, or a complete safe-recovery checkpoint preserving those known facts and exact fixed input where applicable has been written and readback-verified; the next Task's own current authoritative records and complete locked Prompt must also be directly readable from GitHub. Otherwise pause progression and recover persistence. Stop the whole Batch only for a verified non-isolatable shared access, identity/contract, prompt-mapping, result-attribution, or persistence-safety failure. This is not a generation failure. If failure itself cannot be persisted, report GITHUB_RECORDING_FAILED.


## 14. Resume Recovery Scope and Task-Local Blocking

Recovery failures must be classified by scope instead of automatically escalating every discrepancy to Batch-level BLOCKED.

- RECORD_READBACK_PENDING: a required current value has not yet been successfully read back. Retry the read/recovery procedure as appropriate; do not treat this label alone as proof of an integrity violation.
- TASK_LOCAL_RECOVERY_REQUIRED: a discrepancy or unresolved outcome affects one Task. Preserve the authoritative evidence and isolate that Task from execution until its own recovery rule is satisfied.
- BATCH_LEVEL_RECOVERY_REQUIRED: use only when a verified problem affects Batch-wide access, identity, contract, global Prompt Set integrity, safe result attribution, or persistence-safety and cannot be isolated to one Task.

Rules:

1. A Task-local conflict MUST NOT automatically set the entire Batch to BLOCKED.
2. Before reading a later Task's Prompt, select that Task from the existing authoritative Session/Batch records. Once its complete locked Prompt is read, immediately prepare and submit the effective Task-specific input under Section 17 without further prompt-quality, metadata, binding, or format checks.
3. Continuing an independent Task does not resolve, pass, skip, or repair the isolated Task. Preserve it for later recovery.
4. UNKNOWN generation outcome remains non-terminal for the affected Task. Never retry or reuse its Prompt while outcome remains unknown, nor falsely count it as completed. Independent Tasks may proceed only after the affected Task's known UNKNOWN state, available attempt/result evidence, attribution, and exact fixed execution input where applicable have been durably preserved and readback-verified, or a complete safe-recovery checkpoint preserving those known facts and exact fixed input where applicable has been written and readback-verified; the next Task's own current authoritative records and complete locked Prompt must also be independently readable, with its readiness conditions satisfied. Otherwise, pause progression for evidence/persistence recovery; a mere narrative is insufficient.
5. Visual QA observations, including partial visual deviation from a Prompt, anatomy defects, composition issues, or aesthetic concerns, MUST NOT by themselves be classified as EXECUTION_INTEGRITY_BLOCKED. They belong to the separate QA workflow and do not trigger regeneration.
6. `EXECUTION_INTEGRITY_BLOCKED` is used when the complete assigned Prompt cannot be read. The Producer MUST NOT add a separate missing/empty-content, metadata, Task-binding, or format validation gate after reading. The Producer MUST NOT assess whether the submitted payload exactly matched the locked Prompt after generation. Lack of hidden transport telemetry or visual discrepancy alone is insufficient.
7. Missing required Batch records or an unreadable current locked Prompt must be recorded accurately. If a specific Task's Prompt cannot be read back, block that Task; escalate to Batch-level recovery only if the missing/conflicting record prevents safe identification or verification of all eligible next Tasks.
8. The Batch remains incomplete until every required Task reaches a valid terminal state and the completion record is written and verified. A PAUSED Task is non-terminal.
9. For a Task-local authorized condensed-input persistence failure, other independent Tasks may continue only after the complete exact fixed input and the known Task/attempt/result state are recorded in the normal record or a full readback-verified safe recovery checkpoint. PAUSED preserves the attempt budget and fixed input and is not a Batch terminal result. Task-local isolation does not mean the Batch is complete.

## 15. Multi-Worker Handoff and Dependency Semantics

The records support future multi-Worker handoff but do not themselves implement a runtime scheduler or Worker controller.

1. Task selection uses the existing Session/Batch records before prompt reading. During production, the canonical locked Prompt must be read completely; preparing the effective full or necessarily condensed input under Section 17 is part of immediate handoff, not an additional content/metadata validation gate.
2. A prior Worker's report is not a substitute for authoritative state, and absence of that report is not a global gate when the next Task can independently be verified.
3. A prompt read failure affects that Task. For an independent later Task, select it from the existing records, read its complete locked Prompt, and immediately submit the effective Task-specific instruction under Section 17 if the read succeeds.
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

For every applicable Task and generation attempt, record these fields in the current Task record and/or its EXECUTION_LOG event where the format supports them:

- `FULL_PROMPT_READ_STATUS`: `CONFIRMED`, `NOT_CONFIRMED`, or `UNKNOWN`. `CONFIRMED` requires the Producer to have read the complete authoritative locked Prompt before preparing the generation input.
- `GENERATION_INPUT_MODE`: `FULL_LOCKED_PROMPT`, `AUTHORIZED_CONDENSED_PROMPT`, `KNOWN_DEVIATION`, or `UNKNOWN`.
- `EXECUTION_INPUT_PATH`: the single authoritative source of the exact fixed execution text. `FULL_LOCKED_PROMPT` uses `PROMPTS/<TASK_ID>.md` (or documented legacy authoritative source); `AUTHORIZED_CONDENSED_PROMPT` uses `EXECUTION_INPUTS/<TASK_ID>.md` once verified, or the sole validated `RECOVERY_CHECKPOINTS/<TASK_ID>.md` fallback where ordinary persistence failed. Before the first call, a not-yet-written condensed record must not be falsely described as existing.
- `EXECUTION_INPUT_RECORD_STATUS`: `NOT_REQUIRED`, `PENDING`, `READBACK_VERIFIED`, `WRITE_FAILED`, or `CONFLICT`, reflecting the actual current evidence. `NOT_REQUIRED` applies to a Task using the full authoritative Prompt without a separate condensed record.
- `FIRST_ATTEMPT_ID`: the first actual generation attempt referencing the fixed input, when known. Never invent an ID for a pre-call pause.
- `PAUSE_REASON`, `PAUSED_AT`, `RESUMED_AT`: optional factual pause/resume information, recorded only when applicable and observed.
- `REMAINING_GENERATION_ATTEMPTS`: derived eligible remaining actual generation calls, never incremented or reset by PAUSED. A known no-image attempt uses one attempt from the three-total limit. Image receipt, UNKNOWN outcome, terminal retry exhaustion, or policy restrictions cannot authorize another call.

`FULL_LOCKED_PROMPT` means the complete locked source text was the Producer's intended execution instruction. This records the Producer's action, not hidden byte-for-byte delivery proof.

`AUTHORIZED_CONDENSED_PROMPT` means the Producer encountered a concrete interface input limitation preventing full submission and prepared a faithful Task-specific operational derivative under the shared Generation Worker Protocol. Preserve the Task's essential drawing requirements, restrictions, exceptions, priorities, identifiers, output format, reference requirements, and intended meaning. Never modify the canonical locked Prompt, add unrelated design content, or substitute reference-only generation.

The first actual generation call fixes the execution instruction for that Task. If authorized condensation was used, preserve the **exact text after the first call** in one `EXECUTION_INPUTS/<TASK_ID>.md` record and read it back before any retry. Do not overwrite a verified record, create a second condensed version, switch modes, re-condense, or reconstruct it from memory. The log stores the path and event, not the full condensed text. An isolated write failure may use the complete readback-verified recovery checkpoint described in Section 8.

`KNOWN_DEVIATION` is a confirmed unauthorized rewrite, omission, replacement, translation, or otherwise altered generation instruction; it is not an authorized execution mode. `UNKNOWN` applies when the Producer's own preparation/action cannot be established.

`SHORTENED_PROMPT_PRESERVATION_STATUS` remains a **LEGACY FIELD** only. For new execution, set it to `NOT_APPLICABLE`; use the separate immutable execution-input record for authorized condensation.

`DELIVERY_INTEGRITY_STATUS` remains independent. Missing hidden transport telemetry alone is not a generation gate and is not evidence of failed handoff. The Producer must never assert unobserved exact tool payload identity. Historical records must not be retroactively invented or changed.

## 18. Current Producer No-QA and Task Output Counting Rule — Overrides Older Conflicts

The Producer MUST NOT perform post-generation QA. The Producer must not visually inspect or evaluate the image, compare it with the locked prompt, judge prompt compliance, image quality, identity, anatomy, composition, style, or dataset suitability. The Producer records observable production facts only.

Any confirmed receipt of one or more images for a Task counts as exactly ONE successfully produced Task output and increments COMPLETED_COUNT by one, provided the received result is durably recorded against that Task. This remains true when the generator returns two or more image files, or when a later independent QA process may find a visual defect. Record the actual number of returned files in the Task's ACTUAL_OUTPUT_COUNT and include every confirmed received file in batch ACTUAL_IMAGE_COUNT.

Do not use RESULT_COUNT_MISMATCH solely because ACTUAL_OUTPUT_COUNT differs from EXPECTED_OUTPUT_COUNT when an image has been received. Multiple files from one prompt are recorded as actual output facts, but do not create additional successful Task outputs. RESULT_COUNT_MISMATCH is not a reason to downgrade a confirmed image-producing Task under this rule.

Once any image is confirmed received, set PROMPT_CONSUMED = YES and set the Prompt state to CONSUMED so it cannot be used again for that Task. QA is a separate downstream process. QA status must not alter production success/counts, prompt-consumption state, or trigger regeneration.

This section supersedes earlier schema wording that requires the actual output count to equal the expected count for SUCCESS, classifies extra images as RESULT_COUNT_MISMATCH, or permits Producer-side visual or prompt-compliance assessment. Historical Batch records remain immutable; apply this rule to new execution and use a separately recorded correction only when correcting a verified factual recording error.

## 19. Current Task-Level Retry, Prompt State, and Completion Policy — Overrides Conflicting Older Rules
This section is the current authoritative policy for new production and resume records. It supersedes conflicting earlier wording in this schema that requires one call per locked Prompt/version or forbids all retries.

### 19.1 Completion rule
- If one or more images are confirmed received, prohibit further generation for that Task. Mark it SUCCESS and increment COMPLETED_COUNT once only after receipt, Task attribution, event and Task state are durably recorded and readback-verified; otherwise preserve a result-bearing unresolved state. Actual received-file count is recorded separately.
- Record the actual number of received files in ACTUAL_OUTPUT_COUNT and include them in ACTUAL_IMAGE_COUNT.
- Never retry a Task after image receipt. QA observations, appearance, prompt-compliance concerns, or extra returned files do not undo production success and do not trigger regeneration.

### 19.2 Retry rule
- Retry only a known failed attempt for which no image was received. Do not retry a result-bearing Task.
- The initial attempt is not a retry. After an initial confirmed no-image failure, retry the same Task using the exact execution instruction fixed on the first actual generation call and the same authoritative locked Prompt identity. Do not edit the locked Prompt, switch modes, recreate or overwrite the fixed condensed input, or change the Task mapping.
- Every attempt must have a distinct ATTEMPT_ID and GENERATION_CALL_ID where available, plus a timestamp, outcome, interruption/error class, image receipt state, and retry ordinal.
- Count all confirmed no-image generation failures for the same Task, including the initial call. After three consecutive confirmed no-image generation failures in total, mark the Task terminal (GENERATION_FAILED or another applicable specific terminal state), record failure-limit exhaustion and the reason, and never start that Task again. Keep `GENERATION_ATTEMPT_COUNT` and `RETRY_ATTEMPT_COUNT` distinct; the stop threshold is three failed generation attempts total, not three failed Tasks and not three additional retries after the initial call.
- If a retry produces one or more images, the Task is SUCCESS; no further retry is allowed.

### 19.3 Unknown outcomes and safety/policy blocks
- If an attempt's outcome is unknown, preserve PROMPT_CONSUMED=UNKNOWN and the applicable recovery state. Do not retry while the outcome remains unknown.
- Record policy/safety blocks and service/runtime/quota/rate-limit failures accurately. Retry must not be used to evade policy or safety restrictions. A confirmed no-image outcome from an actual generation attempt counts toward the three-failure limit for that same Task. GitHub read/write/readback failures, prompt-file read failures, metadata/status errors, and other non-generation errors do not count as generation failures and do not increment the generation-failure counter.
- A Task reaching the three-generation-failure limit is Task-local. Continue unrelated Tasks if their own authoritative prompts and required inputs are readable. A non-generation error must remain scoped to the affected Task/operation and must not by itself lock or prevent the next independent Task.

### 19.4 Prompt-state interpretation under retries
For new records, distinguish Task-level retry eligibility from prompt immutability:
- The locked prompt text and Task-to-prompt mapping remain immutable.
- A confirmed no-image failure with a known outcome may permit another attempt for the same Task, using the same exact fixed generation instruction and canonical locked Prompt reference, until the retry limit is reached.
- After confirmed image receipt, an unknown outcome, or terminal retry exhaustion, no further attempt is allowed for that Task.
- PROMPT_CONSUMED records image receipt, not merely whether a generation call was made: NOT_ATTEMPTED = no actual generation call yet; YES = image received; NO = confirmed no-image outcome from an actual call; UNKNOWN = unresolved outcome from an actual call. A pre-call PAUSED event is NOT_ATTEMPTED if it precedes the first call, or retains NO after a prior confirmed-no-image attempt.
- Update PROMPT_STATE definitions/usage so RETIRED is not set merely because a first attempt was made when a known no-image retry is allowed. Use AVAILABLE for a not-yet-attempted eligible Task or for a retryable known-failure state within the same Task; use CONSUMED after image receipt, UNKNOWN while the outcome is unresolved, and RETIRED after retry exhaustion or another terminal no-retry condition. A prompt must never be reassigned to a different Task.

### 19.5 Required record fields and events
For each Task, persist at least:
- GENERATION_ATTEMPT_COUNT (all calls, including the initial attempt);
- RETRY_ATTEMPT_COUNT (retry calls only);
- RETRY_FAILURE_COUNT (retry attempts with confirmed no-image failures);
- CONFIRMED_NO_IMAGE_FAILURE_COUNT (consecutive confirmed no-image outcomes from actual generation attempts for this Task, including the initial call; terminate after this reaches 3; non-generation errors do not increment it);
- LAST_ATTEMPT_ID and LAST_GENERATION_CALL_ID where available;
- PROMPT_CONSUMED, PROMPT_STATE, PROMPT_TERMINATION_REASON;
- TASK_STATUS, GENERATION_STATUS, ACTUAL_OUTPUT_COUNT, and the current error/interruption class;
- GENERATION_INPUT_MODE, EXECUTION_INPUT_PATH, EXECUTION_INPUT_RECORD_STATUS, FIRST_ATTEMPT_ID (when available);
- PAUSE_REASON, PAUSED_AT, RESUMED_AT, and REMAINING_GENERATION_ATTEMPTS when applicable.

For each attempt, append a separate GENERATION_STARTED and terminal result event as applicable. Use a retry-specific event such as RETRY_STARTED when a retry begins, and record RETRY_FAILED for a confirmed no-image retry failure. A confirmed image receipt must be recorded as IMAGE_RESULT_RECEIVED / GENERATION_SUCCESS and must never be followed by another attempt for that Task. When CONFIRMED_NO_IMAGE_FAILURE_COUNT=3, record RETRY_LIMIT_REACHED and the Task's terminal state. Do not overwrite previous attempt events. A pre-call TASK_PAUSED or TASK_RESUMED event is not a generation attempt and must not increase GENERATION_ATTEMPT_COUNT. For authorized condensation, append EXECUTION_INPUT_RECORDED only after successful text-file write/readback, and EXECUTION_INPUT_PERSISTENCE_FAILED when recording fails and that fact can be durably saved. Checkpoints require their own verified recovery event.

### 19.6 Persistence and other non-generation failures
Keep generation outcome, Task/result attribution, and GitHub persistence outcome separate. A confirmed image receipt remains a fact even when a record write/readback fails; never relabel it as no-image or regenerate it to repair persistence. Treat a Task-local persistence/status error as a non-generation error, preserve its unresolved state and recover the write/readback. Before advancing, ensure the affected Task's known outcome, available attempt/result evidence, attribution, required state, and exact fixed execution input where applicable are durably recorded and readback-verified, or a complete safe-recovery checkpoint preserving those known facts and exact fixed input where applicable has been written and readback-verified. If not, pause progression rather than relying on memory or narrative. After that safety gate, an independent next Task may proceed only if its own current authoritative records and complete locked Prompt are readable and Batch identity/mapping/attribution remain trustworthy. Stop the whole Batch only for a verified non-isolatable Batch-wide access, identity/contract, prompt-mapping, result-attribution, or persistence-safety problem. A Task-local error alone does not mark other Tasks terminal.

For authorized condensed execution inputs, the actual first call precedes saving the separate record. Save and read back the exact fixed text before retrying. If normal input persistence fails, do not regenerate or create a different instruction; isolate the affected Task, and preserve the exact text plus known Task/attempt/outcome evidence through a complete, readback-verified recovery checkpoint where possible. A checkpoint with only a path, hash, or narrative is insufficient.

A temporary pre-call inability to submit the same fixed instruction, or a recoverable input-persistence problem preventing a permitted retry, enters non-terminal PAUSED. Preserve prior attempt counts, confirmed-no-image counts, PROMPT_CONSUMED/PROMPT_STATE, and the remaining attempt budget. Do not use PAUSED for an already received image, an UNKNOWN generation result, exhausted retries, or safety/policy evasion. Other independent Tasks can continue only after known results/input/attribution are safely recorded and verified or a complete verified checkpoint exists. PAUSED never authorizes Batch completion.

This policy applies prospectively. Preserve historical records and do not rewrite old Batch execution evidence.


## 20. Evidence-Gated State Changes and Reconciliation — Current Mandatory Rule

This section governs all new production events and resume operations and supersedes any conflicting wording that allows a Producer to infer success, failure, consumption, or counts from the expected workflow, a narrative assertion, a tool-call attempt, or a previously written summary.

### 20.1 Facts are not inferred from workflow progress
- Calling the generation interface proves only that a call was attempted. It does not prove that an image was returned or received.
- Reading a Prompt, completing a step, expecting an image, or writing a success label does not prove image receipt.
- Set image-receipt state to YES only when one or more image files/results are actually observable as received in the current execution. Set it to NO only when a confirmed no-image outcome is observed. If neither can be established after a generation call, use UNKNOWN and preserve an unresolved state. Before any actual generation call, `PROMPT_CONSUMED=NOT_ATTEMPTED`; do not represent a pre-call PAUSED event as a confirmed no-image result.
- Never fabricate a result reference, image count, timestamp, error reason, call ID, or other evidence. If a field is unavailable, record UNKNOWN / NOT_EXPOSED / NOT_AVAILABLE as appropriate instead of guessing.
- A status field, Batch summary, or Producer narrative is not independent evidence for the event that it describes.

### 20.2 Evidence-gated state transitions
- A Task may transition to SUCCESS only when a confirmed image receipt is attributed to that Task and the receipt event is durably recorded and read back successfully.
- A confirmed image receipt that cannot yet be durably recorded must remain result-bearing but unresolved (for example, RESULT_RECEIVED_UNVERIFIED); it must not be regenerated, falsely marked as no-image, or silently counted as verified SUCCESS.
- A Task may transition to GENERATION_FAILED only after the required confirmed no-image failure limit has been reached, with the individual failed attempts recorded. An unknown outcome is not a failure.
- PROMPT_CONSUMED=NOT_ATTEMPTED means no actual generation call has been initiated; YES requires confirmed image receipt; NO requires a confirmed no-image outcome from an actual generation call; UNKNOWN is mandatory when the outcome of an actual call is unresolved. PAUSED is non-terminal and cannot override a received-image or UNKNOWN outcome.
- PAUSED does not consume a generation attempt or confirmed-no-image failure and retains the remaining budget. PAUSED_COUNT must be tracked separately from PENDING_COUNT; PAUSED required Tasks prevent BATCH_COMPLETED.
- Batch completion, COMPLETED_COUNT, ACTUAL_IMAGE_COUNT, ATTEMPT_COUNT, and other summary values must be derived from the underlying Task/attempt events and verified Task records, not independently estimated or copied from an earlier summary.

### 20.3 Append-only event history and corrections
- Preserve one distinct record per generation attempt and append new outcome/correction events rather than silently overwriting or deleting prior execution history.
- A correction must identify the affected prior EVENT_ID / ATTEMPT_ID when available, state which field was incorrect, provide the corrected value, explain the evidence basis, and record the correction time. Preserve the original event as historical evidence.
- Do not retroactively invent missing evidence. If historical evidence is insufficient to determine what happened, mark the affected result/Task as unresolved and report the limitation.
- Current-state files such as TASK_QUEUE.md and BATCH_RECORD.md are projections of verified events and Task records. They must be reconciled against those records before completion or resume.

### 20.4 Mandatory readback and progression gate
- After recording an attempt outcome, write the relevant Task state and execution event to GitHub, then read back the saved files and verify that the event, Task state, output count, prompt-consumption state, attempt count, and persistence result agree.
- Do not select or generate the next Task until the affected Task's known outcome, available attempt/result evidence, attribution, required state, and exact fixed execution input where applicable have been durably written and readback-verified, or a complete safe-recovery checkpoint preserving those known facts and exact fixed input where applicable has been durably written and readback-verified under Section 19.6. If its known result cannot be safely preserved, pause progression to recover persistence rather than advancing from memory. Do not regenerate a confirmed received image; do not retry a Task with UNKNOWN outcome. A Task-local error is not an automatic Batch-wide failure.
- Before resuming a Batch, reconcile non-terminal or suspicious Tasks against per-attempt events, actual image-receipt evidence, Task attribution, exact fixed execution-input source when applicable, PAUSED history and remaining retry budget, prompt state, and write/readback status. Isolate unresolved differences to their smallest scope, use traceable correction events, and preserve historical evidence. The next independent Task needs its own current authoritative records and complete locked Prompt; do not infer success from a status field or claim Batch completion while required recovery remains open.
- A Batch may be marked BATCH_COMPLETED only after every required Task has a valid terminal outcome, PAUSED_COUNT=0, summary counts have been recalculated from verified records, and the final Batch record has been read back and verified.

### 20.5 Limits of evidence
GitHub is the durable record store, not an independent observer of image generation. A record written by the Producer is not automatically proof that the described event occurred. The Producer must ground every event in directly observable execution results and state honestly when the interface does not expose independent evidence. This schema does not claim that GitHub itself can authenticate image receipt or automatically enforce these rules.
