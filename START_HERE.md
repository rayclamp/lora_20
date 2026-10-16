# START_HERE.md

Simple image-production reference and persistence database.

GitHub is the authoritative reference and persistence database. ChatGPT is the Producer and runtime operator.

## 1. GitHub Entry

Before automated production, actively connect to the current GitHub repository and load the authoritative rules and current records required for the stage.

When current GitHub data is required:
1. reconnect;
2. read the current authoritative data;
3. verify that the read succeeded and is usable.

When durable production state is created:
1. write it to GitHub;
2. read it back;
3. verify the write.

If GitHub access, required reads, required writes, or write verification fails, STOP. Do not continue from memory, cache, stale state, or guesses.

## 2. Production Request

Production accepts:
- MODULE
- PRODUCTION_TYPE
- CHARACTER
- IMAGE_COUNT
- OUTPUT_TYPE
- THEME / FESTIVAL_SCOPE
- SCENE
- SEASON
- WEATHER
- TIME
- PET_ALLOWED
- REFERENCE_IMAGE (LORA_IMAGE only; not a wallpaper-design command parameter)
- CUSTOM_INSTRUCTIONS

Supported image-design modules:
- `UNIVERSAL_WALLPAPER`: general/ordinary wallpaper design; `PRODUCTION_TYPE=ANIME` or `REALISTIC`.
- `FESTIVAL_WALLPAPER`: festival wallpaper design using the festival reference database; `PRODUCTION_TYPE=FESTIVAL`. The Festival-specific `WALLPAPER_TYPE` selects `ANIME WALLPAPER` or `REALISTIC WALLPAPER` rendering rules.
- `LORA_IMAGE`: LoRA training-image design rules only; not the archived legacy LoRA production system.

For both wallpaper modules, use the unified commands defined in `00_MASTER/WALLPAPER/WALLPAPER_COMMAND_PROTOCOL.md`:
- `/WALLPAPER_CONSOLE`: design, persist, read back, and lock all requested prompts; never generate images.
- `/WALLPAPER_PRODUCE`: execute an explicitly identified existing Session/Batch from its locked prompts; never redesign or perform QA.
The command names do not vary by wallpaper module. `MODULE` selects the applicable rules and record path. The wallpaper design command does not request or accept a `REFERENCE_IMAGE` input. If a reference image is separately supplied in a production conversation, apply only the active wallpaper module's reference policy. Neither wallpaper command loads LoRA-specific rules.

For `MODULE=LORA_IMAGE`, set the Batch-level `OUTPUT_TYPE=MIXED_PER_TASK`. Each Task independently selects and records `TASK_OUTPUT_TYPE=PHONE_9_16` or `TASK_OUTPUT_TYPE=DESKTOP_16_9`; a Batch may mix portrait 9:16 and landscape 16:9 with no fixed quota or required split. The Task's locked prompt must be designed for its recorded format. This exception applies only to LORA_IMAGE; other modules retain their existing `OUTPUT_TYPE` behavior.

When `MODULE=LORA_IMAGE`:
- Upload the reference person image directly in the current ChatGPT conversation when starting the request. That upload is the visual identity authority for this run; do not search for or require a GitHub-stored character reference.
- `CHARACTER=INARIA`: use the canonical Inaria character information in CORE for contextual/semantic guidance, while the uploaded image remains the visual identity authority.
- `CHARACTER=NONE`: do not apply Inaria-specific character information; follow the uploaded reference image and current task instructions.
- If the required reference image is not attached or cannot be identified, request it before designing or generating.
- Load `MODULES/LORA_IMAGE/` and all applicable shared CORE rules/documents: `CORE_RULES.md`, `DRAWING_INSTRUCTIONS.md`, `ANATOMY_STABILITY.md`, `GENERATION_RULES.md`, `IMAGE_GENERATION_SAFETY_SPEC.md`, and `GENERATION_WORKER_PROTOCOL.md`. Do not load `ARCHIVE/LEGACY_LORA_PRODUCTION/` as active production rules.
- Apply the LoRA-specific dataset design rules in `MODULES/LORA_IMAGE/DATASET_DESIGN_SPEC.md`, `DATASET_DIVERSITY.md`, and `CANDIDATE_DESIGN_RULES.md`.
- When `CHARACTER=INARIA`, load `00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md` only for contextual/semantic guidance; the uploaded image remains the visual identity authority.
- Do not assume a fixed target age, fixed character, or fixed reference image for this module.

For other modules, retain their existing module-specific interpretation of the request fields.

IMAGE_COUNT is the number of independent image Tasks when the selected workflow uses task batches. It is not a success target.

## 3. Independent Image QA

Image inspection is a separate system, not a production module:
- QA system: `IMAGE_QA/`
- Current LoRA acceptance profile: `IMAGE_QA/LORA_IMAGE_QA_SPEC.md`
- Checklist: `IMAGE_QA/LORA_IMAGE_QA_CHECKLIST.md`

QA is currently `PAUSED`. Do not automatically start QA after generation, and do not treat generation success as QA PASS. QA inspects existing candidates and reports a decision; it does not generate, rewrite prompts, or trigger regeneration. FESTIVAL_WALLPAPER outputs are excluded from QA intake.

## 4. Session / Batch

/WALLPAPER_CONSOLE creates a new SESSION_ID and BATCH_ID for wallpaper design and prompt locking. /WALLPAPER_PRODUCE never creates a Session or Batch; the user must specify the existing MODULE, SESSION_ID, and BATCH_ID.

A Batch contains:
- SESSION_CONTRACT.md
- BATCH_RECORD.md
- TASK_QUEUE.md
- PROMPT_SET.md (manifest/index only for new Batches)
- PROMPTS/TASK_001.md, PROMPTS/TASK_002.md, etc. (one authoritative prompt file per Task)
- EXECUTION_LOG.md

All Task prompts are designed before generation. For every new Batch, each Task's complete prompt is saved to its own `PROMPTS/<TASK_ID>.md` file. `PROMPT_SET.md` contains only the Task-to-file manifest and prompt metadata, never full prompt bodies. Verify every file and the one-to-one mapping, then lock the manifest and prompt files before execution begins. Existing combined-file Batches remain legacy and must not be silently migrated.

## 5. Task and Prompt Design

One Task = one independent image.

For wallpaper production:
EXPECTED_OUTPUT_COUNT = 1

For `LORA_IMAGE`, each Task is also one independent training-image candidate unless a current task contract explicitly states otherwise.

For `LORA_IMAGE`, each Task's `TASK_OUTPUT_TYPE` must also be recorded in its Task metadata, prompt-file metadata, and manifest metadata, and must agree with the locked prompt's intended composition. Do not add separate `ASPECT_RATIO` or `ORIENTATION` controls.

Each Task receives one dedicated locked prompt file and one prompt version. Each file must include `TASK_ID`, `PROMPT_ID`, `PROMPT_VERSION`, `PROMPT_STATUS=LOCKED`, and explicit `BEGIN_LOCKED_PROMPT_TEXT` / `END_LOCKED_PROMPT_TEXT` delimiters around the exact prompt body. After locking, neither the prompt text nor its file mapping may be silently altered.

## 6. Task Execution

The Producer's generation path has only one pre-generation check and one generation-result check:

1. Read the assigned Task's authoritative locked prompt from its recorded prompt file.
2. Confirm only that the complete prompt was successfully read.
3. Immediately invoke the image-generation interface using the locked prompt as the authoritative specification and intended input. Do not perform any intervening analysis, validation, display, transformation, extra GitHub operation, or other task. Do not deliberately redesign or casually rewrite the prompt, but do not require proof that the interface accepted or transported every character verbatim; interface limitations are not a production-success gate.
4. Determine only whether image generation produced/returned an image result.
5. Record the observable outcome under Section 7.

The design stage has already validated and locked the prompt. The Producer MUST NOT revalidate prompt correctness, format, semantics, quality, task binding, or visual intent. The locked prompt remains the authoritative specification, but the generation interface may limit input length or hide its exact received payload. Do not require byte-for-byte transport proof or stop solely because exact transport cannot be verified. Do not compare the image with the prompt; that belongs to independent QA.

If the complete prompt was not successfully read, do not guess or reconstruct it; record the read failure and stop that Task. Once the complete prompt is read, proceed directly to the generation call without another gate.

Use the current Task-level retry policy in Section 14: retry only confirmed no-image failures, using the same unchanged locked prompt for the same Task; after three consecutive confirmed no-image generation failures in total for that Task, counting the initial call, terminate that Task. Non-generation errors do not count toward this limit. Never retry after image receipt or while the outcome is unknown.
## 7. Result Recording

After the generation call, record only observable execution facts:

- whether an image result was received;
- the actual number of image files received and available result references;
- the associated Task/generation event when available;
- the confirmed no-image error or interruption reason, if applicable;
- the status of the GitHub record write.

Do not compare the generation input with the locked prompt or inspect/evaluate the image. Do not add post-generation QA or a prompt-compliance gate.

A confirmed image receipt must be recorded as received even if a later GitHub write fails. A record-write failure must not erase or relabel the generation outcome and must never trigger another generation call. Keep generation outcome and persistence outcome distinct; handle record-write recovery without re-generating the image.
## 8. Next Task

Before selecting the next Task, reconnect and verify the latest authoritative state.

Continue until every required Task has reached a valid terminal state. Any confirmed image result that is durably recorded against its Task is a production `SUCCESS`, counted once per Task regardless of how many files were returned; this does not imply QA acceptance. Record the actual number of returned files separately. A confirmed no-image failure must be recorded with its observed reason and handled under the current Task-level retry policy in Section 14.

Do not require every Task to be successful. When all required Tasks are terminal and the completion record is read back successfully, close the Batch and issue no further generation calls for it.

## 9. Terminal States and Completion

A Task is terminal only when its final state is explicitly recorded as one of the valid terminal outcomes defined by PRODUCTION_RECORD_SCHEMA.md.

A Batch is BATCH_COMPLETED when:
- every required Task has reached a valid terminal state; and
- the Batch completion record has been written and verified.

Success count does not determine Batch completion. `COMPLETED_COUNT` counts each Task with a confirmed image result durably recorded against it once; `ACTUAL_IMAGE_COUNT` counts every actual image file received. `RESULT_RECORDED_COUNT` is reserved for result-bearing Tasks whose recording/attribution is not yet sufficient for SUCCESS, not for extra files or missing QA. Completion must stop the production loop, not merely change the persisted status.

## 10. Production Continuation

To continue an interrupted wallpaper Batch, invoke `/WALLPAPER_PRODUCE` again with the same explicit `MODULE`, `SESSION_ID`, and `BATCH_ID`. Reconnect to GitHub and recover the existing authoritative records. Continue only with Tasks that have not reached a valid terminal state. Never create a replacement Session/Batch, reset attempt counts, redesign a locked prompt, or silently migrate a legacy Batch.

If production is stopped, do not start new generation calls. Persist an accurate checkpoint when GitHub is available; if persistence fails, report that failure rather than claiming the checkpoint was saved.

## 11. Architecture Boundary

GitHub provides reference data and durable production records.

GitHub does not independently control runtime, scheduling, Worker lifecycle, queues, retries, resume, orchestration, or image generation.

Current runtime ownership:

User → ChatGPT Producer → Generation Interface
                         ↓
                      GitHub
                 Reference + Persistence


## 12. Resume Continuation Scope — Task-Local Blocking

During continuation of an existing Batch, preserve unresolved records without adding redundant prompt-validation gates.

1. A visual-quality or visual-prompt-compliance observation belongs to QA only. Do not automatically run QA, change Task execution status, or trigger regeneration because of a visual difference.
2. A problem isolated to one Task MUST NOT automatically block unrelated Tasks. GitHub read/write/readback failures, prompt-file access failures, metadata/status errors, and other non-generation errors must not increment the generation-failure count or lock the next independent Task. Continue when the next Task's own authoritative prompt and required inputs remain readable; pause only for a verified Batch-wide access/integrity problem.
3. If a prior generation outcome is unknown, preserve that state and do not retry or reuse the same locked Prompt.
4. After selecting an eligible Task, read its assigned locked Prompt. The only prompt-related pre-generation check is whether the complete Prompt was successfully read. If so, call the generation tool immediately; do not add content, metadata, format, semantic, or Task-binding validation.
5. If the complete Prompt cannot be read, record the read failure and stop that Task. Do not guess, reconstruct, or substitute prompt text.
6. Stop the entire Batch only for a verified Batch-wide issue that makes the Session/Batch or assigned Task impossible to identify safely. Do not use visual QA or optional transport telemetry as a production gate.
7. Record the actual outcome and preserve unresolved state. A result-recording problem must not trigger another generation call. Exact hidden-payload or byte-for-byte prompt transport is not required to mark a Task successful; confirmed image receipt is the production outcome, while prompt/image compliance belongs to independent QA.
## 13. Multi-Worker Continuity Rule

For future multi-Worker production, select the assigned Task from the existing authoritative records before reading its Prompt. The design/lock stage owns Task-to-Prompt mapping and prerequisite validation. Once the complete assigned locked Prompt is successfully read, call the generation tool immediately without additional checks.

- Do not rely solely on the previous Worker's narrative or completion message.
- Do not block an independent Task because a different Task has missing/incomplete reporting, unverified prompt-match evidence, or a Task-local recovery issue.
- If the complete assigned Prompt cannot be read, stop that Task only, unless a verified Batch-wide issue prevents safe Task selection. Do not add runtime prompt-validation gates.
- Do not invent missing evidence, falsely resolve the affected Task, retry an unknown outcome, or reuse a consumed/retired Prompt.
- Task dependencies must be explicitly declared; queue order alone does not make one Task dependent on another.
- For an independent Task, select it from the existing records before reading its Prompt; after a successful complete-prompt read, call the generation tool immediately. Keep result accounting, SUCCESS, QA, and LoRA dataset eligibility separate.
- This is a repository contract for future runtime implementation, not a claim that Make or a multi-Worker coordinator is already active.

## 3.1 Producer Must Not Perform QA — Current Rule

During production, the Producer MUST NOT inspect or evaluate generated images for prompt compliance, image quality, identity, anatomy, composition, style, or LoRA dataset suitability. Do not compare a generated image with its prompt. The Producer only confirms image receipt, records actual returned-file count and result attribution, consumes/retires the prompt, and persists the production record.

Any confirmed receipt of one or more image files counts as exactly one successful Task output. Record every actual returned file separately in ACTUAL_OUTPUT_COUNT and batch ACTUAL_IMAGE_COUNT; multiple files from one prompt still count as only one successful Task output. QA is separate, downstream, and must not change production success/counts or trigger regeneration. This current rule overrides conflicting older wording elsewhere in the production documentation.

## 14. Current Task Retry and Completion Policy — Overrides Conflicting Older Rules
This section is the current authoritative policy for new execution and resume operations. If any earlier sentence in this file says that a locked Prompt/version can receive only one generation call, that every failed call permanently ends the Task, or that no retry is permitted, this section supersedes that wording.

1. **Image receipt completes the Task.** If one or more image files are confirmed received for a Task, that Task is production-complete and counts as one completed Task. Record the actual number of files separately. Do not retry because of image count, appearance, or prompt-compliance concerns.
2. **Retry only a confirmed no-image failure.** If an attempt is known to have failed and no image was received, the same Task may be retried using its same authoritative locked Prompt. Each retry is a separate attempt with its own ATTEMPT_ID / GENERATION_CALL_ID where available, timestamp, outcome, and error reason. Do not rewrite the locked Prompt or silently change its file mapping.
3. **Three confirmed generation failures terminate the Task.** Count three consecutive confirmed no-image outcomes from actual image-generation attempts for the same Task, including the initial call. When this total reaches three, mark the Task terminal as GENERATION_FAILED (or the applicable more specific terminal state) and do not start it again. This means three failed generation attempts for one Task, not three different Tasks. GitHub read/write/readback failures, prompt-file access failures, metadata/status errors, and other non-generation errors are not generation attempts and do not increment this count.
4. **Unknown outcome is not a confirmed failure.** If it is unknown whether an image was produced or received, do not retry that Task, because doing so could duplicate a successful generation. Preserve the unresolved state for recovery. Independent Tasks may continue if they do not depend on the unresolved Task.
5. **Task-local isolation.** A Task that reaches its three-generation-failure limit or has another Task-local/non-generation error must not automatically block unrelated Tasks. Continue independent Tasks when their own authoritative prompts and required inputs are readable. Stop the whole Batch only for a verified Batch-wide issue that prevents safe identification or execution of all remaining Tasks.
6. **Record facts separately.** Keep generation outcome, generation-failure count, image-receipt state, and GitHub persistence state distinct. A GitHub write failure must never erase a confirmed image receipt or trigger regeneration. Recover the record separately; a Task-local write failure alone does not lock the next independent Task if its authoritative inputs remain readable. If GitHub is unavailable so the next Task's required inputs cannot be read, pause rather than guessing or using cached prompts.
7. **Immediate call path remains.** For each attempt, read the complete assigned locked Prompt and, once the read succeeds, immediately call the image-generation tool with that unchanged text. Do not insert prompt review, display, transformation, or unrelated operations between the successful read and generation call.

This policy supersedes older single-call-per-Prompt and no-retry wording for new execution. Historical production records remain immutable.
