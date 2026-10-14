# GENERATION_WORKER_PROTOCOL.md

This document defines the execution contract between ChatGPT's production operation and the actual image-generation interface.
It does not turn GitHub into a runtime, scheduler, worker controller, retry engine, or generation controller.

## 1. Core Principle

The design stage validates and locks the final Prompt. The Producer does not repeat that validation.

Minimal generation path:

READ COMPLETE LOCKED PROMPT → IMMEDIATELY CALL GENERATION TOOL → DETERMINE WHETHER AN IMAGE RESULT WAS RECEIVED → RECORD THE OBSERVED OUTCOME

The only pre-generation check is whether the complete assigned locked Prompt was successfully read. After that read succeeds, no additional analysis, validation, prompt display, transformation, or unrelated operation may occur before the generation call.

The only generation-result judgment is whether an image result was produced/received. Visual quality and prompt compliance belong to independent QA. Recording the outcome is required, but recording operations must not trigger another generation call.
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

During batch design and locking, create and verify the per-Task prompt files and manifest mapping before production begins. This setup verification belongs to the design/locking stage.

During production, use the already assigned Task prompt file as the source and read its complete locked Prompt. Do not add a separate runtime mapping audit or revalidate prompt metadata. If the complete Prompt cannot be read, record the read failure and stop that Task; never reconstruct or substitute it.

New production flows MUST create and verify all per-Task prompt files before locking the Batch manifest and beginning execution. The manifest must list one prompt-file path for each executable Task. `PROMPT_SET.md` remains a manifest, not a prompt-body container.

Existing Batches created under the former combined-file layout are historical/legacy records. Do not silently migrate, overwrite, or rewrite their locked prompt content. Continue them only under their existing authoritative record format unless an explicit migration is authorized and separately recorded.

## 3. Minimal Prompt-to-Generation Execution

1. Read the assigned Task's authoritative locked Prompt from its recorded prompt file.
2. Confirm only that the complete Prompt was successfully read. This is a read-success check, not a review of the Prompt's contents.
3. Immediately pass the complete Prompt, unchanged and verbatim, to the image-generation tool.
4. Do not insert any intermediate action, including prompt-content validation, format or semantic checks, repeated Task-binding review, displaying the prompt in chat, payload auditing, prompt rewriting, extra planning, or unrelated GitHub reads/writes.
5. If the complete Prompt was not successfully read, do not invent or reconstruct it; record the read failure and stop that Task.
6. Missing hidden transport telemetry is not a pre-generation gate. Do not claim telemetry that the interface does not expose.

The Prompt was validated before it was locked. The Producer MUST NOT revalidate it. The Producer MUST NOT inspect the generated image or compare it with the Prompt; independent QA owns those judgments.

### Exact Prompt Input

Use the complete text read from the authoritative locked Prompt as the generation input. Do not shorten, summarize, paraphrase, translate, reorder, rewrite, omit, add to, polish, or otherwise transform it.

No additional action may be inserted between successful full-prompt read and the generation call.
## 4. Generation Call Identity

Record available identifiers for the actual call, such as SESSION_ID, BATCH_ID, TASK_ID, PROMPT_ID, PROMPT_VERSION, ATTEMPT_ID, and GENERATION_CALL_ID. These are record fields, not extra pre-generation validation gates.

Each locked Prompt is used for one generation call only. Do not automatically retry or call the same Prompt/version again, regardless of the outcome.

After the call, determine only the observable generation outcome:
- Image result received: record that an image was received, the actual returned-file count, and available result references.
- No image result received: record the confirmed failure or interruption reason, if available.
- Outcome cannot be determined: record it as UNKNOWN; do not guess and do not call the Prompt again.

Do not compare the submitted payload against the locked Prompt. Do not assess visual compliance or image quality.
## 5. Result Identity and Output Count

Record observable facts after the generation call: whether an image result was received, the actual number of returned image files, available result references, and any known attribution or recording limitation.

Any confirmed image receipt must be recorded as received. If Task/result attribution is incomplete, record that limitation separately; do not erase the receipt fact or relabel the generation call as unsuccessful. Multiple returned files are recorded in the actual image count but do not create multiple successful Task outputs.

The Producer MUST NOT inspect the image, compare it with the Prompt, or make prompt-match or quality judgments. Leave `PROMPT_MATCH_STATUS` as `NOT_ASSESSED` or unset.
## 6. Task Success Gate

For the generation outcome, success means an image result was actually received. Record that fact immediately and distinctly from the status of GitHub persistence or optional attribution metadata. A successful image receipt does not imply QA PASS.

If no image result was received, record the observed no-image outcome and its confirmed reason when available. Do not retry the Prompt.
## 7. Outcome Recording

Do not claim that an image was received when none was received, and do not claim failure when an image was actually received. Keep these facts separate:
- generation outcome: image received / no image received / unknown;
- record persistence outcome: written / write failed / unknown;
- optional result attribution or delivery evidence: observed / unavailable / unverified.

A GitHub write failure must not erase a confirmed image receipt or trigger another generation call. Missing optional delivery telemetry and visual prompt compliance are not generation-success gates.
## 8. One Task = One Independent Image

For wallpaper production, one Task equals one independent image. No collage, contact sheet, grid, storyboard, multi-panel output, or silent multi-output acceptance.

## 9. Prompt Immutability and Single Call

After the Prompt is locked, its text must not be changed. The Producer reads the complete locked Prompt and passes that same text unchanged to the image-generation tool.

The Producer must not repeat design-stage validation, insert actions between successful reading and generation, or automatically retry. Each locked Prompt/version receives one generation call only. Any future prompt revision belongs to the formal design stage as a new version; it must not alter the locked version already assigned to production.
## 10. Stop Conditions

If the complete locked Prompt cannot be read, do not generate from a guess or substitute; record the read failure and stop that Task.

Once the complete Prompt has been read, call the generation tool immediately. Do not add intermediate gates.

After the call, record whether an image result was received or a no-image outcome occurred. Do not call the same Prompt again. Missing delivery telemetry, visual QA, or prompt-compliance evidence is not a reason to block or repeat generation.
## 11. Recovery

Resume must use the existing SESSION_ID, BATCH_ID, and locked Prompt records; do not redesign or replace locked prompts.

A Prompt that has already received its one generation call must not be called again. If the prior generation outcome is unknown, record and preserve UNKNOWN; do not guess and do not retry. Recovery of GitHub record persistence must not re-run generation.

A new authorized context must follow the existing CORE session-access rules.
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
