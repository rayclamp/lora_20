# GENERATION_WORKER_PROTOCOL.md

This document defines the execution contract between ChatGPT's production operation and the actual image-generation interface.
It does not turn GitHub into a runtime, scheduler, worker controller, retry engine, or generation controller.

## 1. Core Principle

A valid production Task is not successful merely because an image result is returned.

Minimum execution chain:

TASK_ID → PROMPT_SET_MANIFEST_LOOKUP → PROMPTS/<TASK_ID>.md → CURRENT_LOCKED_PROMPT_READINESS → GENERATION_CALL → RESULT_RECEIVED → RESULT_VERIFICATION → TASK_STATUS

These are distinct states: prompt preparation/binding, actual generation-call delivery, image-result receipt, and Task success.

## 2. Runtime Ownership Boundary

### 2.1 Single-Producer Execution — CURRENT STANDARD

For the current /START_AUTO workflow, one authorized ChatGPT Producer operates its own Session/Batch.

A Single Producer MUST NOT require any GitHub-side:
- Task Claim API
- Lease API
- Lock Token
- Worker Claim
- Runtime Claim
- GitHub execution lock

as a prerequisite for starting a Generation.

Task ownership during Single-Producer execution is a Producer Runtime responsibility.

The Producer MUST:
1. operate only within its authorized/current Session and Batch;
2. select the next applicable Task from the persisted Task Queue;
3. verify that the Task has not already reached a valid terminal state;
4. execute the applicable Prompt Integrity and Generation rules;
5. persist the resulting state and evidence to GitHub.

GitHub records ownership/state/evidence; GitHub does not grant runtime permission to execute the Task.

### 2.2 Multi-Worker Coordination — FUTURE RUNTIME LAYER

If the project later introduces Make, multiple Workers, or another external Runtime Coordinator, a Claim/Lease mechanism MAY be introduced to prevent concurrent execution of the same Task.

Such Claim/Lease mechanisms belong to the Multi-Worker Runtime Coordination layer, not to GitHub's repository role.

A future Runtime Coordinator MAY use concepts such as:

WORKER_ID
CLAIM_ID
LEASE_ID
LEASE_EXPIRY
LOCK_STATE

and MAY persist their resulting records to GitHub.

However:
1. These mechanisms are NOT required by the current Single-Producer /START_AUTO workflow.
2. Their absence from the GitHub interface MUST NOT block current Single-Producer Generation.
3. A future Claim/Lease implementation MUST NOT redefine GitHub as the runtime controller.
4. A future Multi-Worker design must explicitly define its Runtime Coordinator before making Claim/Lease a mandatory execution gate.

### 2.3 Boundary Rule

The following interpretation is forbidden:

GitHub does not provide Claim/Lease API, therefore Generation cannot start.

For the current Single-Producer workflow, this is an invalid blocking condition.

The following interpretation is correct:

Producer owns the runtime execution of its authorized Session/Batch; GitHub stores the authoritative production records and evidence.

This boundary does NOT weaken Prompt Integrity, Generation Delivery Integrity, Result Integrity, Retry, Pause/Resume, or Task Success requirements defined below.

## 2A. Per-Task Prompt File Layout and Authority

For every new Batch, store each Task's complete locked Prompt in its own file at `PROMPTS/<TASK_ID>.md` (for example, `PROMPTS/TASK_001.md`). `PROMPT_SET.md` is a manifest/index only: it maps each `TASK_ID` to its prompt file and records `PROMPT_ID`, `PROMPT_VERSION`, and lock/state metadata, but MUST NOT contain full prompt bodies for new Batches.

Each per-Task prompt file must contain `TASK_ID`, `PROMPT_ID`, `PROMPT_VERSION`, and `PROMPT_STATUS=LOCKED`, plus clearly delimited prompt text using `BEGIN_LOCKED_PROMPT_TEXT` and `END_LOCKED_PROMPT_TEXT`. Only the text inside those delimiters is the generation input. The text inside them must be passed verbatim, without including the file's metadata or delimiters.

Before generation, resolve the current Task through the manifest and open only its mapped `PROMPTS/<TASK_ID>.md` file. Never select prompt text by position in a combined document, copy it from another Task, or infer it from the manifest. If the file is missing, unreadable, mismatched, or the delimiters are ambiguous, block/isolate that Task rather than reconstructing the prompt.

New production flows MUST create and verify all per-Task prompt files before locking the Batch manifest and beginning execution. The manifest must list one and only one prompt-file path for every executable Task; each file must map to exactly one Task. `PROMPT_SET.md` remains a required manifest, not a prompt-body container.

Existing Batches created under the former combined-file layout are historical/legacy records. Do not silently migrate, overwrite, or rewrite their locked prompt content. Continue them only under their existing authoritative record format unless an explicit migration is authorized and separately recorded.

## 3. Prompt Execution Integrity

### Level 1 — Prompt Readiness

1. Read the current Task's complete locked Prompt from its authoritative `PROMPTS/<TASK_ID>.md` file, located through the `PROMPT_SET.md` manifest.
2. Confirm it is non-empty and bound to the current Task.
3. Submit the complete locked Prompt verbatim as the generation input for the current Task.
4. Do not shorten, summarize, paraphrase, translate, reorder, rewrite, omit, add to, polish, or otherwise alter any part of the locked Prompt. No derived or replacement input is permitted.
5. This readiness check does not require hidden transport evidence.

Passing Level 1 proves only that ChatGPT prepared the correct input.

### Generation Input Rule — Complete Locked Prompt Must Be Passed Verbatim

For every generation call, the Producer MUST read the complete current locked Prompt directly from the authoritative per-Task file `PROMPTS/<TASK_ID>.md`, using `PROMPT_SET.md` only to locate and verify the Task-to-file mapping, confirm it is non-empty and bound to the current Task, and submit that entire text verbatim as the generation input.

1. **Full read is mandatory.** Do not generate if the complete Prompt cannot be read back or its Task binding is unclear.
2. **Exact-text rule.** The generation input MUST be the complete locked Prompt exactly as stored. Do not shorten, summarize, paraphrase, translate, reorder, rewrite, omit, add to, polish, or otherwise transform any part of it.
3. **No substitute or reconstruction.** Never replace the locked Prompt with content inferred from the Session theme, a previous Task, memory, assumptions, a generic template, or a model-generated restatement.
4. **Failure behavior.** If the Prompt cannot be read completely, bound to the current Task, or supplied unchanged, do not generate that Task. Isolate/block it and record the specific failure; do not improvise.
5. **Record the actual mode.** Record `GENERATION_INPUT_MODE = FULL_LOCKED_PROMPT` only when that exact full-text input was prepared for the call. If a known deviation occurred, record it honestly; if the interface does not expose transport evidence, record the evidence limitation and do not claim independent transport verification. Missing telemetry alone is not a generation gate.

This rule forbids transformation of the generation input; it does not prohibit designing or revising a prompt before it is formally locked. Once locked, changes require an explicitly created new prompt version and must never overwrite the locked version used or intended for execution.

### Level 2 — Generator Delivery Evidence

Level 2 is an evidence layer, not a mandatory pre-generation gate.
1. If the image-generation interface exposes verifiable request/input information, record GENERATION_CALL_ID and the available delivered-input identity.
2. If the interface does not expose transport/request evidence, record `DELIVERY_INTEGRITY_STATUS = NOT_EXPOSED` (or an equivalent `UNVERIFIED` evidence state).
3. Lack of Level 2 telemetry MUST NOT prevent a valid Generation Call after Level 1 passes.
4. Level 2 evidence may strengthen execution provenance, but it must not be fabricated.
5. Level 2 absence must not be represented as `EXECUTION_INTEGRITY_BLOCKED` when the generation call itself was validly initiated.

## 4. Generation Call Identity

Every actual generation attempt is a distinct execution event.
Record when available: SESSION_ID, BATCH_ID, TASK_ID, PROMPT_ID, PROMPT_VERSION, ATTEMPT_ID, GENERATION_CALL_ID, start/end timestamps, and delivery-integrity state.
For the current Single-Producer /START_AUTO workflow, one locked Prompt/version may be used for at most one generation attempt that returns an image result. Initiating a Generation Call does NOT by itself consume the Prompt. After each attempt, classify the outcome:
- Confirmed image result received: immediately set `PROMPT_CONSUMED = YES`, record the actual output count and result reference/binding, retire the Prompt when the Task reaches its terminal outcome, and never call that Prompt/version again. The Producer MUST NOT compare the actual submitted payload with the locked Prompt or assess visual compliance; leave `PROMPT_MATCH_STATUS` as `NOT_ASSESSED` or unset.
- Verified Policy/Safety interruption with confirmed no image result: keep `PROMPT_CONSUMED = NO`; only an explicitly authorized continuation may retry the exact same locked Prompt/version for the same Task. Do not modify or replace the prompt.
- Confirmed generation failure with confirmed no image result: keep `PROMPT_CONSUMED = NO`; apply the separate error-specific retry/terminal rule, retaining the same Task and locked Prompt.
- Unknown outcome: set `PROMPT_CONSUMED = UNKNOWN` and `PROMPT_STATE = UNKNOWN`, enter recovery, and stop. Do not retry or skip until resolved.
- Once the attempt's result or no-result failure is known and durably recorded, the Task must reach an applicable terminal outcome. Do not keep the Batch open solely because an image failed to match the locked prompt or delivery telemetry is unavailable.

Every actual call has a distinct `ATTEMPT_ID` and execution event. Prompt reuse is governed by both prompt state and Task state: a Prompt that was not consumed by an image may still be permanently retired when its Task reaches a terminal state. After three consecutive verified Policy/Safety interruptions, set `TASK_STATUS = PROMPT_SKIPPED_POLICY_LIMIT`, `PROMPT_TERMINATION_REASON = THREE_CONSECUTIVE_POLICY_INTERRUPTS`, and retire the Prompt permanently. Policy interruptions, generation-service errors, quota/rate limits, GitHub errors, runtime errors, and unknown outcomes must not be merged into one counter.

## 5. Result Identity and Output Count

Receiving one or more images for a Task counts as one successful Task output once the result is durably recorded against that Task. For every attempt, record whether a result was received, RESULT_ID/output reference(s), ACTUAL_OUTPUT_COUNT, expected/planned count, result-to-Task and result-to-generation-call binding when available, and the actual no-image failure reason. `PROMPT_MATCH_STATUS` is not a Producer judgment field; leave it `NOT_ASSESSED` or unset. The Producer must not inspect the image or infer prompt transmission integrity from its appearance. For wallpaper production, the planned output remains one independent image. Count each Task at most once in successful Task output totals, while ACTUAL_IMAGE_COUNT includes every confirmed image file received. Multiple returned files do not cause RESULT_COUNT_MISMATCH or downgrade production SUCCESS. Do not compare prompt payloads or make prompt-match judgments as part of Producer execution.
If a result cannot be reliably bound to the Task or generation call, the Task MUST NOT be SUCCESS; still count a confirmed received image in `ACTUAL_IMAGE_COUNT` and record the binding limitation.

## 6. Task Success Gate

A production Task is `SUCCESS` when at least one image is confirmed received and that result is durably recorded against the Task. The complete locked Prompt must have been read and bound before generation, and a generation call must have been initiated. Actual returned-file count need not equal the planned count for the Task to count as one successful Task output. Record the exact actual count separately and preserve all returned files. Hidden payload telemetry and visual prompt compliance are not Producer acceptance gates. `SUCCESS` does not mean QA PASS. If no image is received, record the confirmed failure reason and applicable no-image terminal state.

## 7. False-Success Prevention

The following MUST NOT produce TASK_STATUS = SUCCESS: no image was received; the result was not durably recorded against the Task; or the Task's prompt was missing/empty/wrongly bound before generation. Multiple returned files do not prevent SUCCESS and must be recorded as the actual output count. Missing optional delivery telemetry or visual prompt compliance does not prevent SUCCESS. Use RESULT_RECEIVED_UNVERIFIED while recording is incomplete, SUCCESS when an image receipt is durably recorded against the Task, EXECUTION_INTEGRITY_BLOCKED for an actual pre-generation readiness failure, and GENERATION_FAILED for a confirmed no-image outcome. Do not use RESULT_COUNT_MISMATCH solely because multiple files were returned. `PROMPT_MATCH_STATUS` MUST NOT be assessed by the Producer.

## 8. One Task = One Independent Image

For wallpaper production, one Task equals one independent image. No collage, contact sheet, grid, storyboard, multi-panel output, or silent multi-output acceptance.

## 9. Prompt Immutability

After PROMPT_SET_LOCKED, neither the locked Prompt Set nor the generation input may be edited or silently rewritten. The Producer MUST pass the complete locked Prompt verbatim to the generation interface. No shortening, summarization, paraphrasing, translation, reordering, omission, addition, polishing, or other transformation is permitted. Record `GENERATION_INPUT_MODE = FULL_LOCKED_PROMPT` when the exact full-text input is prepared. Any desired prompt revision must be designed as a new version through the formal prompt-design process; never overwrite or alter the locked version used or intended for execution.
The current /START_AUTO workflow does not automatically retry without authorization. An explicitly authorized continuation may recover the existing Session/Batch and locked Prompt Set. It may retry the same locked Prompt/version only when the previous attempt is confirmed to have produced no image and the applicable retry rule allows it. A consumed Prompt/version MUST NOT be called again. A retired Prompt MUST NOT be reused even when `PROMPT_CONSUMED = NO`.

## 10. Stop Conditions

Do not issue a second Generation Call for a Task after a result is confirmed. A missing/empty/wrong-Task prompt may block generation before a result exists. After an image result is received, record the result, actual output count, and Task binding; once the received result is durably recorded against the Task, mark production SUCCESS and count that Task once. Do not downgrade it or assign RESULT_COUNT_MISMATCH solely because multiple files were returned. If no image is received, record the confirmed reason and applicable terminal state. The Producer MUST NOT assess payload-vs-lock equality or visual compliance. Once every required Task has a terminal outcome and the Batch completion record is written and verified, stop the Batch. The absence of transport/delivery telemetry is NOT a stop condition for the current Single-Producer workflow.
The absence of a GitHub Claim/Lease API is NOT a stop condition for the current Single-Producer workflow.

## 11. Recovery

Resume uses the same SESSION_ID, BATCH_ID, and locked PROMPT_SET.
Do not redesign prompts.
Do not leave a received image in a non-terminal evidence state after its result and actual count have been durably recorded. Use SUCCESS once the received result is durably recorded against the Task; use IMAGE_RESULT_RECORDED or a recovery state only when result recording or attribution remains incomplete. Retain unverified provenance as a separate evidence value.
Re-run the applicable state/integrity gates before continuing. Continue only if the Task is non-terminal, the Prompt is not consumed or retired, and the prior attempt outcome is known. A retry uses a new `ATTEMPT_ID` but the same `TASK_ID`, `PROMPT_ID`, `PROMPT_VERSION`, and exact locked Prompt content. Never retry an UNKNOWN outcome.

If a Single-Producer session is interrupted, the next authorized Producer context may continue only when the user explicitly authorizes access to the existing Session/Batch, consistent with CORE session-access rules.

## 12. Visual QA Boundary

This protocol does not perform visual QA.
Face identity, anatomy, hands/feet, composition, artistic quality, prompt visual compliance, and LoRA quality belong to the separate QA workflow.

## 13. Evidence Rule

Execution records must preserve enough evidence to answer:
- which locked prompt was assigned to the Task;
- which generation attempt was made;
- whether an image result was received;
- what result was returned and how many outputs were returned;
- whether the result is bound to the Task;
- the confirmed reason if no image was received.
They do not require the Producer to audit the exact hidden payload or judge the image's visual compliance.

If evidence is insufficient, record the specific evidence as UNVERIFIED whenever the operation's required prerequisites are otherwise satisfied. Use BLOCKED only when a necessary prerequisite for that specific Task or operation is actually missing, invalid, or unverifiable; do not use BLOCKED merely to avoid uncertainty or to propagate another Task's reporting defect.

## 14. Architecture Boundary Summary

CURRENT:

User → ChatGPT Producer Runtime → Generation Interface
                    ↓
                 GitHub
          Reference + Persistence

GitHub is the authoritative repository for reference data and persisted production records, but it is not the runtime authority that grants permission to generate.

FUTURE MULTI-WORKER:

User → Runtime Coordinator → Workers → Generation Interface
             ↓
          GitHub
     Reference + Persistence

A future Runtime Coordinator may implement Claim/Lease coordination. Until that layer is explicitly implemented and defined, Claim/Lease is not a generation prerequisite.

## 3.0 Production Entry Gate — Canonical Rule Loading

The /START_AUTO workflow MUST pass the Canonical Rule Loading Gate before any image-generation call.

### Required sequence
`/START_AUTO → CANONICAL_RULE_LOADING → ENTRY_GATE → Session/Batch → Prompt Design → Prompt Lock → Generation`

### Gate requirements
1. Load the applicable current GitHub Canonical Rules.
2. Load the applicable module and production-type rules required for the requested production.
3. Verify that the required rules were successfully retrieved and are usable.
4. Record or report `GITHUB_RULES_LOADED = YES` only when the required rules were actually loaded.
5. Only after the gate passes may automated production proceed.

### Gate failure
If required Canonical Rules cannot be loaded, are inaccessible, or cannot be verified:
- `ENTRY_GATE = BLOCKED`
- `REASON = CANONICAL_RULE_LOADING_FAILED` (or a more specific failure reason)
- `GENERATION_ALLOWED = NO`
- no image-generation call may be made;
- the Producer MUST NOT fall back to ordinary image-generation behavior;
- the Producer MUST NOT reinterpret the Production Request as a normal image-generation request.

### Hard invariant
`CANONICAL_RULE_LOADING = PASS` is a mandatory prerequisite for /START_AUTO Generation.

The gate belongs to the Producer Runtime. It does not make GitHub a runtime controller and does not require a GitHub-side execution lock, Claim API, Lease API, or generation permission API.

### Rationale
GitHub Canonical Rules define the semantics of automated production, including Task decomposition, output-count semantics, Prompt Lock, and applicable generation constraints. Without those rules, the Producer cannot safely assume that a request such as `IMAGE_COUNT = 12` means twelve independent Tasks. Therefore absence of verified Canonical Rules is a hard pre-generation block.


## 12.1 RESUME ENTRY GATE

Before a /RESUME_AUTO Generation attempt, the Producer MUST:

1. re-verify the current GitHub database connection;
2. reload and verify the applicable current Canonical Rules;
3. recover the existing Session/Batch, Task Queue, Checkpoint, prompt manifest, and the assigned Task's authoritative prompt file;
4. select the first Task that has not reached a valid terminal state.

If connection verification or Canonical Rule Loading fails, resume is BLOCKED and no Generation call may occur.

Resume MUST NOT create a replacement Session/Batch, reset attempt counts, or modify/redesign a locked prompt.


## 15. Resume Recovery Scope — Isolate Before Escalating

The stop conditions in this protocol apply to the affected Task unless the evidence establishes a Batch-wide dependency.

1. If the current Task's locked Prompt is missing, empty, or bound to the wrong Task, do not generate that Task. Record the specific failure and isolate it.
2. If an attempt outcome is unknown, do not retry that Task, reuse its Prompt, or mark it complete. Preserve its recovery state. This unresolved outcome does not automatically prohibit an independent later Task.
3. Before continuing to a later Task, independently read back its current complete locked Prompt and verify that it is non-empty, bound to that Task, non-consumed, non-retired, and otherwise eligible. Do not infer readiness from another Task's state.
4. Escalate to Batch-level stop only when a verified conflict affects Batch identity/contract, the global Prompt Set, or result attribution in a way that makes execution of other Tasks unsafe.
5. Visual QA is a separate downstream responsibility. The Producer MUST NOT inspect image quality or judge visual compliance as part of production status. Do not set EXECUTION_INTEGRITY_BLOCKED or stop later Tasks based on an image's visual appearance; record receipt facts and leave visual acceptance to QA.
6. Lack of transport telemetry remains NOT_EXPOSED or UNVERIFIED and is not a pre-generation stop condition.
7. Every isolated Task must remain explicitly recorded for later recovery; continuing other Tasks must never silently convert it to SUCCESS, terminal completion, or a skipped Task.

## 15. Multi-Worker Handoff — Independent Task Readiness

This section defines record-level handoff behavior for a future Runtime Coordinator and multiple Workers. It does not claim that a multi-worker coordinator or Claim/Lease runtime has already been implemented.

1. **Read authoritative state first.** A receiving Worker MUST reconnect to GitHub and read the current Session/Batch, Task Queue, prompt manifest, and the complete prompt text from `PROMPTS/<TASK_ID>.md` for the Task it is assigned (or the documented legacy source for an existing Batch). A prior Worker's narrative is supplemental evidence, not the sole authority.
2. **Gate only on the assigned Task's prerequisites.** Verify that the assigned Task is eligible, non-terminal, correctly bound to its own complete non-empty locked Prompt, and that the Prompt is neither consumed nor retired. Verify any explicitly declared dependency that this Task actually requires.
3. **Do not inherit unrelated failures.** A prior Worker's missing report, incomplete optional telemetry, or Task-local recovery state MUST NOT block an independent Task whose own prerequisites can be verified.
4. **Isolate record defects.** If the assigned Task's required state or Prompt cannot be verified, record/isolate that Task and state the exact missing or conflicting prerequisite. Do not fabricate a value. Then the coordinator/Producer may consider another independent Task after independently verifying its readiness.
5. **No false resolution.** Continuing other Tasks does not resolve the isolated Task. Do not mark it SUCCESS, silently skip it, retry an unknown generation outcome, or reuse a consumed/retired Prompt.
6. **Explicit dependency only.** A downstream Task may wait on an upstream Task only when the Session/Batch contract declares a real dependency and identifies the exact upstream output/state required. Mere queue order, worker identity, or the existence of an earlier Task does not create a dependency.
7. **Batch-wide stop is exceptional.** Stop independent work only for a verified Batch-wide conflict that prevents safe Task identification, locked-Prompt binding, contract interpretation, or result attribution. Do not escalate a Task-local reporting defect into a Batch-wide stop.
8. **Completion remains evidence-based.** Each Task must eventually receive its own valid terminal outcome; the Batch closes only after all required Tasks are terminal and the completion record is written and verified. Throughput continuity never means false SUCCESS or automatic LoRA dataset acceptance.

## 15. Current Producer No-QA Rule — Overrides Older Conflicting Wording

The Producer MUST NOT perform post-generation QA of any kind. Do not visually inspect or evaluate the generated image, compare it with the locked prompt, judge prompt compliance, assess quality or dataset suitability, or use any visual impression to alter execution status. Do not perform QA before selecting the next Task.

After generation, the Producer records only observable production facts: whether an image result was received, the actual number of returned image files, available result references, Task/generation-call binding, prompt consumption/retirement, and durable record status. A confirmed receipt of one or more images counts as exactly one successful Task output. The number of actual files returned is recorded separately; two or more files from one prompt do not increase the Task output count beyond one.

Any confirmed image receipt consumes and permanently retires that locked Prompt/version for further generation. Visual compliance and quality belong to an independent downstream QA process. QA must not change production success/counts, block the next independent Task, or trigger regeneration.

This section overrides older statements in this protocol that make production SUCCESS depend on output-count equality or that could be interpreted as authorizing the Producer to inspect, compare, or judge generated images. Preserve actual output counts and result evidence even when multiple images are returned.


## LORA_IMAGE Per-Task Output Format

For `MODULE=LORA_IMAGE`, the Batch may declare `OUTPUT_TYPE=MIXED_PER_TASK`. Before executing each Task, read that Task's `TASK_OUTPUT_TYPE` from its authoritative Task record and prompt-file metadata; the value must be exactly `PHONE_9_16` or `DESKTOP_16_9`. Ensure the locked prompt is designed for the same portrait 9:16 or landscape 16:9 composition. Do not inherit the preceding Task's format or apply one global format to every Task in this module. If the Task metadata and locked prompt conflict, isolate that Task and record the specific inconsistency rather than silently rewriting a locked prompt. Other modules retain their existing Batch-level `OUTPUT_TYPE` behavior.

This is a prompt-design and record-integrity rule, not a claim that the generation interface can enforce exact pixel dimensions from prompt text. Use an explicit format control only if the current interface actually exposes one; otherwise record the requested format without claiming verified dimensions.
