# GENERATION_WORKER_PROTOCOL.md

This document defines the execution contract between ChatGPT's production operation and the actual image-generation interface.
It does not turn GitHub into a runtime, scheduler, worker controller, retry engine, or generation controller.


## 1. Core Principle

The design stage validates and locks the final Prompt. The Producer does not repeat that validation.

Minimal generation path:

READ COMPLETE LOCKED PROMPT → PREPARE EFFECTIVE TASK INPUT (FULL PROMPT BY DEFAULT; NECESSARY AUTHORIZED CONDENSATION ONLY) → IMMEDIATELY CALL GENERATION TOOL → OBSERVE IMAGE / CONFIRMED NO IMAGE / UNKNOWN → PRESERVE EXACT CONDENSED INPUT AFTER FIRST CALL WHEN USED → RECORD AND READBACK-VERIFY THE OBSERVED OUTCOME

The complete assigned locked Prompt must be successfully read before generation. The Producer may prepare one faithful condensed input only if a concrete interface input limitation prevents complete submission, under Section 2B. This is part of immediate handoff, not prompt revalidation or a design stage. Do not insert prompt display, separate quality review, unrelated GitHub operations, or unnecessary planning between reading and the first generation call. After the first call, preserve and readback-verify the exact condensed text if it was used, before retry or unsafe progression.

The first actual generation call fixes the Task's execution input. A temporary pre-call inability to submit that same fixed instruction enters non-terminal PAUSED, without using an attempt or changing the instruction. An unavailable hidden transport payload is not by itself a failure or a pre-generation gate.

The Producer's only generation-result judgment is observable image receipt, confirmed no image, or UNKNOWN. Visual quality and prompt compliance belong to independent QA. Recording or persistence recovery must never trigger regeneration of a received image.

## 2. Runtime Ownership Boundary

### 2.1 Single-Producer Execution — CURRENT STANDARD

For the current single-Producer workflow, one authorized ChatGPT Producer operates within its explicitly authorized Session/Batch.

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
1. These mechanisms are NOT required by the current Single-Producer workflow.
2. Their absence from the GitHub interface MUST NOT block current Single-Producer Generation.
3. A future Claim/Lease implementation MUST NOT redefine GitHub as the runtime controller.
4. A future Multi-Worker design must explicitly define its Runtime Coordinator before making Claim/Lease a mandatory execution gate.

### 2.3 Boundary Rule

The following interpretation is forbidden:

GitHub does not provide Claim/Lease API, therefore Generation cannot start.

For the current Single-Producer workflow, this is an invalid blocking condition.

The following interpretation is correct:

Producer owns the runtime execution of its authorized Session/Batch; GitHub stores the authoritative production records and evidence.

This boundary preserves Prompt Integrity, observable Generation Result Recording, and Pause/Resume records. A known no-image failure may be retried for the same Task using the execution input fixed at its first actual call under Section 19; the canonical locked Prompt stays unchanged, and image receipt and unknown outcomes must not be retried.

## 2A. Per-Task Prompt File Layout and Authority

For every new Batch, store each Task's complete locked Prompt in its own file at `PROMPTS/<TASK_ID>.md` (for example, `PROMPTS/TASK_001.md`). `PROMPT_SET.md` is a manifest/index only: it maps each `TASK_ID` to its prompt file and records `PROMPT_ID`, `PROMPT_VERSION`, and lock/state metadata, but MUST NOT contain full prompt bodies for new Batches.

Each per-Task prompt file must contain `TASK_ID`, `PROMPT_ID`, `PROMPT_VERSION`, and `PROMPT_STATUS=LOCKED`, plus clearly delimited prompt text using `BEGIN_LOCKED_PROMPT_TEXT` and `END_LOCKED_PROMPT_TEXT`. Only the text inside those delimiters is the authoritative prompt specification; do not include file metadata or delimiters as prompt content. Use the locked text as the default intended generation input through the interface's supported method. Only the necessary authorized condensation in Section 2B is permitted as a separate execution input; never change the canonical locked text. Do not require proof that every character was accepted or transported verbatim when the interface does not expose that capability.

During batch design and locking, create and verify the per-Task prompt files and manifest mapping before production begins. This setup verification belongs to the design/locking stage.

During production, use the already assigned Task prompt file as the source and read its complete locked Prompt. Do not add a separate runtime mapping audit or revalidate prompt metadata. If the complete Prompt cannot be read, record the read failure and stop that Task; never reconstruct or substitute it.

New production flows MUST create and verify all per-Task prompt files before locking the Batch manifest and beginning execution. The manifest must list one prompt-file path for each executable Task. `PROMPT_SET.md` remains a manifest, not a prompt-body container.

Existing Batches created under the former combined-file layout are historical/legacy records. Do not silently migrate, overwrite, or rewrite their locked prompt content. Continue them only under their existing authoritative record format unless an explicit migration is authorized and separately recorded.

## 2B. Task Generation Input and Preservation Contract

1. The complete authoritative locked Prompt remains the only canonical design specification. The Producer must successfully read it and must not revalidate or modify the canonical Prompt.

2. FULL_LOCKED_PROMPT is the default generation input. Only a concrete interface input limitation that prevents submitting the complete Prompt permits one AUTHORIZED_CONDENSED_PROMPT. Missing hidden-payload telemetry alone does not prove such a limitation.

3. Condensation must preserve the Task's essential drawing requirements, restrictions, exceptions, priorities, identifiers, output format, reference requirements, and intended meaning. Do not redesign the Task, invent requirements, omit defining drawing instructions, bypass safety policy, or use only a reference image or generic instruction in place of Task-specific drawing directions.

4. The Producer prepares the intended generation instruction as part of immediate handoff. Do not insert unrelated GitHub reads/writes, prompt displays, design review, semantic revalidation, or visual QA between successfully reading the full Prompt and the initial generation call.

5. The instruction submitted for the first actual generation call becomes the Task's fixed execution input, whether FULL_LOCKED_PROMPT or AUTHORIZED_CONDENSED_PROMPT. All eligible confirmed-no-image retries must use that exact fixed instruction and the same canonical Prompt reference. Never re-condense, translate, redesign, change input mode, or replace it.

6. If AUTHORIZED_CONDENSED_PROMPT was used, preserve the exact condensed text **after the first actual generation call** in the Task's single dedicated file: `EXECUTION_INPUTS/<TASK_ID>.md`. Record the original Prompt identity and version, Task identity, condensation reason, and first attempt reference. Do not edit the canonical `PROMPTS/<TASK_ID>.md`.

7. Write and read back the condensed file before any retry. At most one such file may exist per Task; after successful preservation and verification it must not be overwritten or replaced. `EXECUTION_LOG.md` records the execution-input path and related attempt/events, not the complete condensed text.

8. If the condensed-file persistence fails, isolate the Task and attempt persistence recovery without repeating generation. A complete safe recovery checkpoint may preserve the exact frozen input, original Prompt ID/version, Task and Batch identity, known attempts, observable results, prompt state, remaining attempt budget, result attribution, and persistence state. A checkpoint containing only a path, hash, or narrative does not substitute for the exact text. Only a successfully written and readback-verified checkpoint qualifies for safe continuation of independent Tasks.

9. When the exact fixed input temporarily cannot be submitted **before a new generation call begins**, set `TASK_STATUS=PAUSED` and preserve all existing attempts and retry eligibility. No new generation attempt or confirmed-no-image failure is counted. Resume only with that same input. PAUSED is non-terminal and prevents Batch completion. PAUSED is not permitted for image receipt, UNKNOWN generation result, retry exhaustion, or evasion of safety/policy restrictions.

10. A Task-local failure does not automatically stop other independent Tasks. Continue only after the affected Task's known outcome, attribution, fixed input when applicable, and recovery evidence are safely preserved and readback-verified, or an explicit equivalent safe-recovery checkpoint is verified; also require the next Task's independent authoritative inputs to be directly readable. Otherwise pause progression until safe preservation is restored.

11. The Producer records only observable facts, does not perform visual QA, and does not claim that its recorded execution-input text proves the hidden payload was delivered byte-for-byte. Image receipt and UNKNOWN outcomes prohibit generation retry.


## 3. Minimal Prompt-to-Generation Execution

1. Select the eligible Task from current authoritative Session/Batch records and complete applicable module reference-input checks before the Prompt handoff.
2. Read the complete assigned authoritative locked Prompt from the recorded source. Confirm read success only, without revalidating its content, semantics, formatting, Task mapping, or artistic quality.
3. Prepare the effective Task-specific generation instruction under Section 2B. Use FULL_LOCKED_PROMPT by default. Condense only when a concrete interface input limitation prevents full submission; do not substitute a reference image or generic direction for the Task's drawing instructions.
4. Immediately invoke the image-generation interface using this prepared instruction and the module's applicable reference input. Do not insert prompt display, unrelated GitHub operations, extra planning, redesign, visual QA, or an input-quality validation gate.
5. The first actual call fixes the instruction for that Task. Observe only image received, confirmed no image, or UNKNOWN and preserve the available result/attribution evidence.
6. If authorized condensation was used, save its exact fixed text in the dedicated execution-input file after that first call, then read it back before retry or unsafe progression. If persistence fails, use the Task-local safe-recovery procedure under Section 2B. Never regenerate a confirmed received image to repair records.
7. On a temporary pre-call inability to submit the fixed input, record PAUSED without creating a new generation attempt or consuming the retry budget. Resume only with the same input.
8. If the complete source Prompt cannot be read, record the read failure and stop the affected Task; never reconstruct or substitute it.
9. Hidden transport telemetry or byte-for-byte payload identity is not required when the interface does not expose it. Never claim evidence not provided.

### Locked Prompt as the Authoritative Specification

The complete text inside the locked Prompt delimiters remains the canonical immutable design specification. FULL_LOCKED_PROMPT is the preferred intended generation instruction; necessary authorized condensation is a separate fixed operational derivative under Section 2B, not a revision of the Prompt. Do not redesign or replace the canonical specification. Use only the interface's supported input method and record observed limitations honestly.

The interface may impose input or transport limits or hide its exact payload. Missing optional telemetry alone is not proof of failed handoff, not a reason to repeat generation, and not a production-success or visual QA gate.

## 4. Generation Call Identity

Record available identifiers for the actual call, such as SESSION_ID, BATCH_ID, TASK_ID, PROMPT_ID, PROMPT_VERSION, ATTEMPT_ID, and GENERATION_CALL_ID. Also record GENERATION_INPUT_MODE, EXECUTION_INPUT_PATH when applicable, the condensed-record readback status, and the PAUSED/RESUMED evidence where applicable. These are evidence/record fields, not new content-validation gates.

A Task may be retried only after a confirmed no-image failure, using the exact execution input fixed at its first actual call, with the canonical locked Prompt unchanged. Terminate after three consecutive confirmed no-image generation failures in total, initial call included, under Section 19. A temporary pre-call failure to submit the fixed input enters PAUSED without another attempt. Never retry after image receipt or while the outcome is UNKNOWN.

After the call, determine only the observable generation outcome:
- Image result received: record that an image was received, the actual returned-file count, and available result references.
- No image result received: record the confirmed failure or interruption reason, if available.
- Outcome cannot be determined: record it as UNKNOWN; do not guess or retry that Task while the outcome remains unresolved.

Do not compare the submitted payload against the locked Prompt. Do not assess visual compliance or image quality.
## 5. Result Identity and Output Count

Record observable facts after the generation call: whether an image result was received, the actual number of returned image files, available result references, and any known attribution or recording limitation.

Any confirmed image receipt must be recorded as received. If Task/result attribution is incomplete, record that limitation separately; do not erase the receipt fact or relabel the generation call as unsuccessful. Multiple returned files are recorded in the actual image count but do not create multiple successful Task outputs.

The Producer MUST NOT inspect the image, compare it with the Prompt, or make prompt-match or quality judgments. Leave `PROMPT_MATCH_STATUS` as `NOT_ASSESSED` or unset.
## 6. Task Success Gate

An observable receipt of one or more images establishes **IMAGE_RECEIVED=YES as a generation outcome**, not immediate formal `TASK_STATUS=SUCCESS`. Immediately preserve that observed receipt, actual file count, and available references even if persistence is pending or fails. Formal `TASK_STATUS=SUCCESS` and one `COMPLETED_COUNT` increment are permitted only after the result is correctly attributed to the Task and the required result event and Task state are durably saved to GitHub **and read back successfully**. While required receipt evidence, attribution, or persistence is unresolved, use the Schema's applicable result-bearing non-terminal recovery state; do not declare verified SUCCESS and **never regenerate a confirmed received image**. Image receipt and Task SUCCESS are independent of visual quality and QA PASS.

If no image result was received and the outcome is confirmed, record the reason and apply Section 19: retry the same Task using the exact execution input fixed at its first actual call, until three consecutive confirmed no-image generation failures in total for that Task, counting the initial call, under Section 19.
## 7. Outcome Recording

Do not claim that an image was received when none was received, and do not claim failure when an image was actually received. Keep these facts separate:
- generation outcome: confirmed image received / confirmed no image / UNKNOWN, based on observable facts;
- Task/result attribution: verified against the correct Task / unresolved, recorded separately from the receipt fact;
- record persistence and readback: written and verified / pending / failed / unknown;
- formal Task disposition: SUCCESS only after verified receipt, correct Task attribution, and required durable write/readback; otherwise the appropriate unresolved or terminal state;
- optional delivery-integrity telemetry: observed / unavailable / unverified, which is not alone a SUCCESS downgrade or QA judgment.

A GitHub write failure must not erase a confirmed image receipt or trigger another generation call. Missing optional delivery telemetry and visual prompt compliance are not generation-success gates.
## 8. One Task = One Independent Image

For wallpaper production, **one Task plans one independent image** (`EXPECTED_OUTPUT_COUNT=1`); the design-stage Prompt must not intentionally request a collage, contact sheet, grid, storyboard, or multi-panel composition. This is a **design target**, not permission to erase observed generator results or demand output-count equality as a production-success gate.

If the generation tool actually returns two or more distinct image files, **record the actual returned-file count and available result references for all received files**, preserve the observed receipt, and do not silently discard, mislabel, regenerate, or treat extra files as new Tasks. After correct Task attribution and durable event/Task-state write/readback, a result-bearing Task counts **once** in `COMPLETED_COUNT` regardless of file count; `ACTUAL_IMAGE_COUNT` counts the individual files according to verified evidence. Do not assign a new `RESULT_COUNT_MISMATCH` status merely because the observed count differs. The Producer must not perform visual QA or transform a collage into an acceptable standalone output; visual compliance belongs to independent QA.


## 9. Prompt Immutability and Task-Level Retry

After lock, the canonical Prompt source text and Task-to-file mapping remain immutable. The Producer must fully read the assigned locked Prompt and use FULL_LOCKED_PROMPT by default, with only necessary authorized condensation under Section 2B. This operational derivative never replaces the canonical Prompt.

The first actual generation call fixes the execution instruction for that Task. A confirmed no-image result may be retried only with the same exact fixed instruction, not a newly condensed, translated, rewritten, or switched input mode. The limit remains three consecutive confirmed no-image generation failures in total for the same Task, initial call included. Never retry after image receipt or UNKNOWN outcome. A future revision to the canonical Prompt belongs to formal design/lock as a separate version.

## 10. Stop Conditions

If the complete locked Prompt cannot be read, do not generate from a guess or substitute; record the read failure and isolate the Task.

After successful full Prompt reading, immediately prepare and submit the effective Task-specific instruction under Section 2B. No unrelated analysis, extra GitHub operation, redesign, or content/format/quality validation is allowed in the handoff.

If the exact fixed input temporarily cannot be submitted before a new generation call begins, set `TASK_STATUS=PAUSED`, preserve the instruction and all existing attempts and remaining retry eligibility, and do not increment generation attempts or confirmed-no-image failures. Resume with the exact same fixed instruction. PAUSED is non-terminal and prevents Batch completion; never use it to circumvent safety/policy rules.

After a call, record only actual image receipt, confirmed no image, or UNKNOWN, and applicable attribution/persistence evidence. Retry only a confirmed no-image failure under Section 19. Never retry after image receipt or UNKNOWN outcome. Optional delivery telemetry, visual QA, and prompt-image compliance are not generation gates.

## 11. Recovery

Resume must use the existing authorized SESSION_ID, BATCH_ID, canonical locked Prompt, and Task's fixed execution-input evidence. Do not redesign or replace a locked Prompt or reconstruct missing condensed text from memory. Read back the one saved `EXECUTION_INPUTS/<TASK_ID>.md` when applicable, or a complete verified recovery checkpoint, before an eligible retry.

A temporary pre-call inability to submit the exact input preserves PAUSED and the remaining attempt budget. Safe independent Task progression requires verified preservation of the paused Task's known result/attribution and exact execution input or verified complete checkpoint under Section 2B; continuing other Tasks does not resolve the paused Task.

A confirmed image receipt, UNKNOWN outcome, or retry exhaustion prohibits further generation until the applicable evidence-resolution rule allows an action (image receipt permanently prohibits it). For confirmed no-image results, retry only if eligible using the fixed instruction under Section 19. Restore GitHub persistence without re-running generation for a received image.

A new authorized context must follow existing CORE session-access rules.

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

## 14A. Production Entry Gate — Canonical Rule Loading

Every production operation MUST load the applicable current GitHub Canonical Rules before any image-generation call.

For wallpaper production:
- `/WALLPAPER_CONSOLE` loads the applicable shared and selected-module rules before creating a new Session/Batch and designing prompts.
- `/WALLPAPER_PRODUCE` first requires the user-specified `MODULE`, `SESSION_ID`, and `BATCH_ID`; it verifies the exact existing Batch identity before selecting a Task or loading its module-specific rules.
- Missing or mismatched identifiers, or failure to read required current rules/records, block the affected operation. Do not use memory, cache, guesses, or generic image-generation fallback.
- Continuation uses the same `MODULE`, `SESSION_ID`, and `BATCH_ID`; it must not create a replacement Session/Batch or redesign locked prompts.

For other modules, apply their current module-specific entry contract. This gate belongs to the Producer Runtime; it does not make GitHub a runtime controller and does not require a GitHub-side execution lock, Claim API, or Lease API.

## 14B. Continuation Entry Gate

Before continuing an existing Batch, the Producer MUST:
1. reconnect to GitHub and verify access to the current authoritative records;
2. reload and verify the applicable current Canonical Rules;
3. recover the existing Session/Batch, Task Queue, checkpoint, prompt manifest, and the assigned Task's authoritative prompt file;
4. select a Task that has not reached a valid terminal state.

If connection verification or Canonical Rule Loading fails, no Generation call may occur. Continuation MUST NOT create a replacement Session/Batch, reset attempt counts, or modify/redesign a locked prompt.

## 15. Continuation Recovery Scope — Isolate Before Escalating

1. Continuation must use the existing Session/Batch and select a Task that has not reached a valid terminal state.
2. If the prior generation outcome for a Task is unknown, preserve UNKNOWN and do not call that Prompt again.
3. For an eligible Task, read its assigned complete locked Prompt. Apply only the effective Task-input preparation in Section 2B; do not add separate content, metadata, or binding validation.
4. Once the complete Prompt is successfully read, immediately prepare and submit its effective Task-specific instruction under Section 2B, with full text preferred. Do not add content, format, semantic, metadata, Task-binding, or visual-intent validation.
5. If the complete Prompt cannot be read, record the read failure and isolate that Task. Never reconstruct or substitute the Prompt.
6. A Task-local problem does not automatically block other independent Tasks, but **do not advance** on an unpersisted image receipt or a prior Worker's narrative. Before selecting the next Task, verify that the previous attempt's known result and attribution are durably preserved/readback-verified, or that an explicit safe-recovery checkpoint for its persistence failure was durably recorded and verified. If safe preservation is unavailable, pause progression to recover it; never regenerate a received image. Continue only if the next Task's own authoritative records and complete locked Prompt remain directly readable. Stop the entire Batch only for a verified non-isolatable shared access, identity/contract, prompt-mapping, result-attribution, or persistence-safety failure.
7. Missing optional delivery telemetry and visual differences are not generation gates. QA remains separate.
8. Record generation outcomes and any record-write failure separately; persistence recovery must not repeat generation. An isolated PAUSED Task can be resumed only with its exact fixed input and preserved remaining attempts. If authorized condensed input persistence failed, independent Task continuation requires a readback-verified complete recovery checkpoint containing that exact input and known state.

## 16. Multi-Worker Handoff — Independent Task Readiness

This section defines record-level handoff behavior for a future Runtime Coordinator and multiple Workers. It does not claim that a multi-worker coordinator or Claim/Lease runtime has already been implemented.

1. **Read authoritative state first.** A receiving Worker MUST reconnect to GitHub and read the current Session/Batch, Task Queue, prompt manifest, and the complete prompt text from `PROMPTS/<TASK_ID>.md` for the Task it is assigned (or the documented legacy source for an existing Batch). A prior Worker's narrative is supplemental evidence, not the sole authority.
2. **Keep task selection separate from prompt execution.** Select an eligible Task from the existing Session/Batch records before reading its Prompt. The design/lock stage owns Task-to-Prompt mapping and metadata consistency. Once the complete locked Prompt is read, do not recheck binding, metadata, eligibility, or dependencies; prepare and immediately submit the effective Task-specific input under Section 2B.
3. **Do not inherit unrelated failures, but preserve known results first.** A prior Worker's missing report, unavailable optional telemetry, or Task-local recovery state MUST NOT automatically block an independent Task. However, progression requires durable preservation/readback of the prior observed result and attribution, or a durably verified explicit safe-recovery checkpoint for its persistence problem; otherwise pause to recover evidence. The independent Task's own current authoritative inputs must also be verifiably readable. A narrative alone is not a safe recovery record. If the prior Task used an authorized condensed input, the receiving Worker must read back its exact fixed input or a verified complete checkpoint without re-condensing or switching modes. A PAUSED Task remains outstanding and non-terminal.
4. **Isolate read failures.** If the complete assigned Prompt cannot be read, record the read failure and isolate that Task. Do not fabricate, reconstruct, or substitute prompt text. Do not add other runtime prompt-validation gates.
5. **No false resolution.** Continuing other Tasks does not resolve the isolated Task. Do not mark it SUCCESS, silently skip it, retry an unknown generation outcome, or reuse a consumed/retired Prompt.
6. **Explicit dependency only.** A downstream Task may wait on an upstream Task only when the Session/Batch contract declares a real dependency and identifies the exact upstream output/state required. Mere queue order, worker identity, or the existence of an earlier Task does not create a dependency.
7. **Batch-wide stop is exceptional.** Stop independent work only for a verified Batch-wide conflict that prevents safe Task identification, locked-Prompt binding, contract interpretation, or result attribution. Do not escalate a Task-local reporting defect into a Batch-wide stop.
8. **Completion remains evidence-based.** Each Task must eventually receive its own valid terminal outcome; the Batch closes only after all required Tasks are terminal and the completion record is written and verified. Throughput continuity never means false SUCCESS or automatic LoRA dataset acceptance.

## 17. Current Producer No-QA Rule — Overrides Older Conflicting Wording

The Producer MUST NOT perform post-generation QA of any kind. Do not visually inspect or evaluate the generated image, compare it with the locked prompt, judge prompt compliance, assess quality or dataset suitability, or use any visual impression to alter execution status. Do not perform QA before selecting the next Task.

After generation, the Producer records only observable production facts: whether images were received, the actual number of returned image files, available references, Task/generation-call attribution, prompt consumption/retirement, and durable write/readback status. **A confirmed image receipt consumes the Prompt and prohibits any regeneration, but is not yet formal Task SUCCESS.** Only when the receipt is correctly attributed to the Task and the result event and Task state have been durably written **and readback-verified** may `TASK_STATUS=SUCCESS` be recorded and `COMPLETED_COUNT` incremented once for that Task. Pending attribution/persistence stays result-bearing and unresolved. Multiple files returned from one Prompt increment actual received-file counts, not the number of successful Tasks.

Any confirmed image receipt consumes and permanently retires that locked Prompt/version for further generation. Visual compliance and quality belong to an independent downstream QA process. QA must not change production success/counts, block the next independent Task, or trigger regeneration.

This section overrides older statements in this protocol that make production SUCCESS depend on output-count equality or that could be interpreted as authorizing the Producer to inspect, compare, or judge generated images. Preserve actual output counts and result evidence even when multiple images are returned.


## 18. LORA_IMAGE Per-Task Output Format

For `MODULE=LORA_IMAGE`, the design/lock stage selects `TASK_OUTPUT_TYPE` (`PHONE_9_16` or `DESKTOP_16_9`) and ensures the locked prompt reflects that choice before production begins. During production, do not re-read or compare format metadata against the locked Prompt. Read the complete assigned locked Prompt, prepare the effective generation input under Section 2B, and immediately invoke generation without changing the Task's existing `TASK_OUTPUT_TYPE`. All permitted retries use the same fixed input and original Task format. Other modules retain their existing Batch-level `OUTPUT_TYPE` behavior.

This is a prompt-design and record-integrity rule, not a claim that the generation interface can enforce exact pixel dimensions from prompt text. Use an explicit format control only if the current interface actually exposes one; otherwise record the requested format without claiming verified dimensions.

## 19. Current Task-Level Retry Policy — Overrides Conflicting Older Rules
This section is the current authoritative retry policy for new execution and resume. It supersedes any earlier statement in this document that a locked Prompt/version may receive only one call or that no generation retry is allowed.

1. A Task's image-generation outcome is **received** when one or more images are observably delivered. This consumes the Prompt and **immediately forbids any further generation** for that Task. Formal `TASK_STATUS=SUCCESS` and one `COMPLETED_COUNT` increment follow **only after** correct Task/result attribution and the required event plus Task state have been written to GitHub and successfully read back. Until then preserve the receipt as result-bearing/unverified; do not label it a no-image failure or regenerate it. Record every actually returned image file separately from the successful Task count.
2. A retry is permitted only after a known failed actual generation call for which no image result was received. Reuse the exact execution instruction fixed by the first actual call, whether FULL_LOCKED_PROMPT or AUTHORIZED_CONDENSED_PROMPT, with the same immutable canonical locked Prompt. Never switch modes, re-condense, translate, rewrite, or replace that instruction. Every actual call is a distinct attempt with its own ATTEMPT_ID and GENERATION_CALL_ID where available.
3. Count the initial call as the first generation attempt. Terminate the Task after three consecutive confirmed no-image generation failures in total for that same Task (initial call included); do not interpret the limit as three failed Tasks. Persist attempt history and terminal reason. Non-generation errors do not count toward this limit.
4. Do not retry an unknown outcome. If it cannot be determined whether an image was produced/received, preserve the unknown/recovery state and do not call the image tool again for that Task until the outcome is resolved. This prevents duplicate generation after a potentially successful call.
5. A policy/safety block, service/runtime failure, quota/rate-limit error, or other failure observed during an actual generation attempt must be recorded with its observed class and counts as a generation failure only when the outcome is confirmed to be no image received. A retry must never attempt to bypass safety policy or alter the prompt to evade a block. Stop after three consecutive confirmed no-image generation failures for this Task, including the initial call. Errors in GitHub reads/writes/readbacks, prompt-file access, metadata, task status, or other non-generation operations are not generation attempts and must not increment the generation-failure count.
6. Reaching the three-confirmed-no-image-failures limit terminates only the affected Task; non-generation and Task-local errors remain local and must never consume generation retry counts or automatically lock unrelated Tasks. **Before any next Task**, durably preserve/readback-verify the preceding attempt's known outcome and Task/result attribution, or durably record/readback-verify an explicit safe-recovery checkpoint for an isolated persistence defect. If a known image receipt cannot be safely preserved, **pause progression** and recover persistence without regeneration. Only then may an independent Task proceed, provided its own current authoritative inputs and complete locked Prompt are readable and Batch identity/mapping remain trustworthy. Stop the whole Batch only for a verified non-isolatable Batch-wide access, integrity, mapping, attribution, or persistence-safety issue. Batch completion still requires every required Task terminal, reconciled counters, and completion record write/readback.
7. Prompt reading and generation remain adjacent: read the complete assigned locked Prompt; if successful, immediately prepare and submit the effective Task-specific instruction under Section 2B. Use the full text by default, with necessary faithful condensation only for a concrete interface input limitation. Do not insert content validation, prompt display, unrelated GitHub operations, or redesign between reading and the first call. If condensed, preserve its exact fixed text after the first call and read it back before retry. A temporary pre-call inability to submit the fixed instruction enters PAUSED without counting a new generation attempt.
8. Keep PROMPT_CONSUMED as the factual indicator of image receipt: NOT_ATTEMPTED before any actual generation call, YES when an image is confirmed received, NO following a confirmed no-image result from an actual call, and UNKNOWN when the outcome of a call is unresolved. PROMPT_STATE must preserve Task-level retry eligibility: AVAILABLE for a not-yet-attempted eligible Task or a confirmed no-image result with remaining attempts, CONSUMED after image receipt, UNKNOWN for an unresolved actual call outcome, and RETIRED after terminal retry exhaustion or another terminal no-retry rule. PAUSED preserves the applicable existing consumption/prompt state and remaining attempts, but is non-terminal. Never reassign a Task's Prompt to another Task.

9. PAUSED is a non-terminal Task state for a temporary pre-call inability to submit an already prepared/fixed execution instruction, or Task-local fixed-input persistence recovery that prevents a permitted retry. Preserve GENERATION_ATTEMPT_COUNT, RETRY_ATTEMPT_COUNT, CONFIRMED_NO_IMAGE_FAILURE_COUNT, remaining attempt budget, PROMPT_CONSUMED, PROMPT_STATE, and the original execution-input path/text. PAUSED does not produce GENERATION_STARTED, ATTEMPT_ID, or a confirmed-no-image failure unless an actual generation call separately occurred. Resume only with the same input, never after image receipt, UNKNOWN, exhausted retries, or by evading safety/policy restrictions. A required PAUSED Task prevents Batch completion.

Every retry must be represented in the Task record and execution log. This is a Task-level retry policy, not permission for a runtime to repeat a call whose outcome is unknown.


## 20. Evidence-Gated Execution, Persistence, and Resume — Mandatory

This section applies to every new generation attempt, record update, and resume. It supplements and overrides any conflicting wording that could permit the Worker to treat workflow completion, expectation, or a self-authored success label as proof of image receipt.

1. **Observe, do not infer.** A generation-tool call is evidence only that a call was attempted. Set IMAGE_RECEIVED=YES only when an image result/file is actually observable as received; set NO only for a confirmed no-image outcome; otherwise set UNKNOWN. Never invent output counts, result references, error reasons, IDs, or timestamps. Use UNKNOWN / NOT_EXPOSED / NOT_AVAILABLE where applicable.
2. **Append an attempt event.** Each generation call must have its own attempt/event record, including Task ID, attempt ID and generation-call ID when available, timestamp, prompt path/version, observable result, actual received-file count, result references when available, no-image reason when confirmed, and GitHub persistence status. Do not overwrite or erase earlier attempt outcomes.
3. **Gate status transitions on evidence.** A Task may become SUCCESS only after a received-image event is attributed to that Task and the event plus Task state are durably saved and read back. A tool call, expected result, Producer narrative, or current status field alone is insufficient. A confirmed image receipt whose persistence is incomplete remains result-bearing but unresolved; never regenerate it.
4. **Persist and verify before progression.** After the generation call, record the observed outcome, update the relevant Task state and execution log, write them to GitHub, then read the saved records back and verify that attempt count, image receipt, actual output count, prompt-consumption state, Task status, and Batch counters agree. Do not select the next Task until this has succeeded or the persistence failure has been explicitly handled under the safe-continuation rule below.
5. **Persistence failure is not generation failure.** If image receipt is confirmed but GitHub write/readback fails, preserve that receipt as the known execution outcome, retry only the persistence/reconciliation operation, and never repeat the image-generation call. If the outcome itself is unknown, do not retry generation. A persistence failure must not be converted into NO image received.
6. **Safe continuation after a write failure.** A Task-local write/readback error is not a generation failure and does not automatically make unrelated Tasks terminal or Batch-wide blocked. However, if the known result cannot be durably preserved and verified, pause progression until persistence is recovered or a safe, explicit recovery checkpoint is durably recorded. Continue to an independent Task only when the current outcome is preserved without ambiguity and that Task's authoritative inputs can be read directly from GitHub. Never rely on an unpersisted narrative or stale in-memory state as the sole recovery record.
7. **Reconcile before resume.** On resume, compare Task status, each attempt event, prompt-consumption state, result attribution, and Batch summary. If status and event evidence conflict or an expected event/result reference is missing, mark the affected Task unresolved and reconcile before deciding whether to generate. Do not trust the status field alone and do not retroactively invent evidence. If historical evidence cannot resolve what happened, keep the state unresolved and report the limitation.
8. **Derive counters.** COMPLETED_COUNT, ACTUAL_IMAGE_COUNT, ATTEMPT_COUNT, and all Task-state counts must be recalculated from verified per-Task/per-attempt records. Do not copy or manually estimate counters from a previous Batch summary. One Task counts at most once toward COMPLETED_COUNT; each actually received image file counts separately toward ACTUAL_IMAGE_COUNT.
9. **Traceable correction.** If a previously saved record is proven wrong, append a RECORD_CORRECTED event that identifies the affected event/attempt and field, the previous value, corrected value, evidence basis, and correction time. Preserve the original event; do not silently rewrite history. If there is no evidence to establish the correct value, mark it unresolved instead of choosing a likely answer.
10. **Completion gate.** Do not mark a Batch BATCH_COMPLETED until every required Task has a valid terminal outcome, current Task records reconcile with the attempt history, counters have been recalculated from those records, and the final Batch record has been read back and verified.

11. **Fixed execution-input evidence.** For each actual generation attempt, record GENERATION_INPUT_MODE and the authoritative EXECUTION_INPUT_PATH when applicable. If authorized condensation was used, preserve the exact fixed text in the Task's single `EXECUTION_INPUTS/<TASK_ID>.md` after the first generation call. Read it back before retry. If saving fails, record the persistence problem when possible, isolate the Task, and preserve the full exact text with Task/attempt/outcome evidence in a complete verified safe-recovery checkpoint. A path, hash, or Producer narrative alone does not recover the actual instruction. No duplicate or replacement condensed version is permitted.

12. **PAUSED and RESUMED events.** Record the actual pause/resume reason, available timestamp, frozen input source, Task state and remaining retry eligibility separately from generation attempt events. A pre-call pause must not be counted as GENERATION_STARTED or as a no-image failure. Independent eligible Tasks may proceed only after the affected known state/input and result attribution are durably preserved/readback-verified or a complete safe-recovery checkpoint is readback-verified. PAUSED is not terminal and cannot satisfy Batch completion.

GitHub is a persistence store, not an independent observer of generation. A value is not proven merely because the Worker wrote it. The Worker must report only directly observable facts and the limits of available evidence. Keep the required handoff minimal: select the Task, read the complete locked Prompt, prepare the full or necessarily condensed effective input under Section 2B, and immediately call the generation interface. If authorized condensation was used, preserve and read back the exact fixed instruction after the first call before retry or unsafe progression; evidence and persistence gates remain mandatory. Never claim hidden transport fidelity that the interface does not expose.
