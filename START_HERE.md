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
- REFERENCE_IMAGE
- CUSTOM_INSTRUCTIONS

Supported image-design modules:
- `UNIVERSAL_WALLPAPER`: general wallpaper design.
- `FESTIVAL_WALLPAPER`: festival wallpaper design using the festival reference database.
- `LORA_IMAGE`: LoRA training-image design rules only; not the archived legacy LoRA production system.

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

/START_AUTO creates a new SESSION_ID and BATCH_ID when the automated batch workflow is requested.

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
3. Immediately submit that exact, unchanged prompt to the image-generation tool. Do not perform any intervening analysis, validation, display, transformation, extra GitHub operation, or other task.
4. Determine only whether image generation produced/returned an image result.
5. Record the observable outcome under Section 7.

The design stage has already validated and locked the prompt. The Producer MUST NOT revalidate prompt correctness, format, semantics, quality, task binding, or visual intent. Do not compare the image with the prompt; that belongs to independent QA.

If the complete prompt was not successfully read, do not guess or reconstruct it; record the read failure and stop that Task. Once the complete prompt is read, proceed directly to the generation call without another gate.

Each locked prompt is used for one generation call only. Do not automatically retry, including after a no-image result.
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

Continue until every required Task has reached a valid terminal state. Any confirmed image result that is durably recorded against its Task is a production `SUCCESS`, counted once per Task regardless of how many files were returned; this does not imply QA acceptance. Record the actual number of returned files separately. A confirmed no-image failure must also be recorded with its observed reason. Do not automatically retry the same locked Prompt.

Do not require every Task to be successful. When all required Tasks are terminal and the completion record is read back successfully, close the Batch and issue no further generation calls for it.

## 9. Terminal States and Completion

A Task is terminal only when its final state is explicitly recorded as one of the valid terminal outcomes defined by PRODUCTION_RECORD_SCHEMA.md.

A Batch is BATCH_COMPLETED when:
- every required Task has reached a valid terminal state; and
- the Batch completion record has been written and verified.

Success count does not determine Batch completion. `COMPLETED_COUNT` counts each Task with a confirmed image result durably recorded against it once; `ACTUAL_IMAGE_COUNT` counts every actual image file received. `RESULT_RECORDED_COUNT` is reserved for result-bearing Tasks whose recording/attribution is not yet sufficient for SUCCESS, not for extra files or missing QA. Completion must stop the production loop, not merely change the persisted status.

## 10. Stop / Resume

/START_AUTO starts a new automated Session.

If an interruption requires continuation, use /RESUME_AUTO. Resume must reconnect to GitHub, reload the applicable rules, recover the existing Session/Batch, prompt manifest, and each eligible Task's authoritative prompt file, and continue only with Tasks that have not reached a valid terminal state. Existing combined-file Batches remain legacy and must not be silently migrated.

/STOP immediately stops new generation and persists a checkpoint when GitHub is available.

## 11. Architecture Boundary

GitHub provides reference data and durable production records.

GitHub does not independently control runtime, scheduling, Worker lifecycle, queues, retries, resume, orchestration, or image generation.

Current runtime ownership:

User → ChatGPT Producer → Generation Interface
                         ↓
                      GitHub
                 Reference + Persistence


## 12. Resume Continuation Scope — Task-Local Blocking

During /RESUME_AUTO, preserve unresolved records without adding redundant prompt-validation gates.

1. A visual-quality or visual-prompt-compliance observation belongs to QA only. Do not automatically run QA, change Task execution status, or trigger regeneration because of a visual difference.
2. A problem isolated to one Task MUST NOT automatically block unrelated Tasks.
3. If a prior generation outcome is unknown, preserve that state and do not retry or reuse the same locked Prompt.
4. After selecting an eligible Task, read its assigned locked Prompt. The only prompt-related pre-generation check is whether the complete Prompt was successfully read. If so, call the generation tool immediately; do not add content, metadata, format, semantic, or Task-binding validation.
5. If the complete Prompt cannot be read, record the read failure and stop that Task. Do not guess, reconstruct, or substitute prompt text.
6. Stop the entire Batch only for a verified Batch-wide issue that makes the Session/Batch or assigned Task impossible to identify safely. Do not use visual QA or optional transport telemetry as a production gate.
7. Record the actual outcome and preserve unresolved state. A result-recording problem must not trigger another generation call.
## 13. Multi-Worker Continuity Rule

For future multi-Worker production, a Worker receiving the next assignment must independently verify that Task's authoritative record, complete locked Prompt from its dedicated file (or the documented legacy source for an existing Batch), Task-to-Prompt binding, Prompt availability, and explicitly declared prerequisites.

- Do not rely solely on the previous Worker's narrative or completion message.
- Do not block an independent Task because a different Task has missing/incomplete reporting, unverified prompt-match evidence, or a Task-local recovery issue.
- Missing required data for the assigned Task blocks that Task only, unless a verified Batch-wide conflict makes other Tasks unsafe to identify or execute.
- Do not invent missing evidence, falsely resolve the affected Task, retry an unknown outcome, or reuse a consumed/retired Prompt.
- Task dependencies must be explicitly declared; queue order alone does not make one Task dependent on another.
- Continue independent work only after its own readiness checks pass. Keep result accounting, SUCCESS, QA, and LoRA dataset eligibility separate.
- This is a repository contract for future runtime implementation, not a claim that Make or a multi-Worker coordinator is already active.

## 3.1 Producer Must Not Perform QA — Current Rule

During production, the Producer MUST NOT inspect or evaluate generated images for prompt compliance, image quality, identity, anatomy, composition, style, or LoRA dataset suitability. Do not compare a generated image with its prompt. The Producer only confirms image receipt, records actual returned-file count and result attribution, consumes/retires the prompt, and persists the production record.

Any confirmed receipt of one or more image files counts as exactly one successful Task output. Record every actual returned file separately in ACTUAL_OUTPUT_COUNT and batch ACTUAL_IMAGE_COUNT; multiple files from one prompt still count as only one successful Task output. QA is separate, downstream, and must not change production success/counts or trigger regeneration. This current rule overrides conflicting older wording elsewhere in the production documentation.
