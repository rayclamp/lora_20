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
- PROMPT_SET.md
- EXECUTION_LOG.md

All Tasks are designed before generation. The complete Prompt Set is persisted and locked before execution begins.

## 5. Task and Prompt Design

One Task = one independent image.

For wallpaper production:
EXPECTED_OUTPUT_COUNT = 1

For `LORA_IMAGE`, each Task is also one independent training-image candidate unless a current task contract explicitly states otherwise.

Each Task receives one locked Prompt/version. After the Prompt Set is locked, its prompts are not redesigned or silently altered.

## 6. Task Execution

CURRENT_TASK → CURRENT_LOCKED_PROMPT_READINESS → GENERATION_CALL → IMAGE_RECEIVED_OR_NO_IMAGE → RECORD_RESULT_OR_FAILURE → TASK_STATUS

Immediately before each generation call, reconnect to GitHub and read the current Task and current locked Prompt.

Use the current complete locked Prompt directly as the generation instruction. Do not redesign, summarize, translate, omit, add to, reorder, or substitute it.

The locked Prompt is the actual generation input, not reference text for the Producer to interpret. Submit its complete text unchanged in the image-generation interface's designated prompt/input field. Do not create a shortened, summarized, reconstructed, translated, cleaned-up, or substitute generation instruction after lock. If structured tool arguments are required, place the complete locked Prompt unchanged in the applicable input field. Missing hidden-payload telemetry does not block generation and does not authorize shortening. If a different or shortened prompt is knowingly used, record that as a known execution deviation; do not describe it only as NOT_EXPOSED.

One locked Prompt/version may produce at most one confirmed image result. A Generation Call attempt does not by itself consume the Prompt; any confirmed received image consumes the Prompt and is counted, regardless of prompt match or Task success.

After each attempt, classify and persist only the production outcome and observable execution facts before advancing:
- Confirmed image result received: immediately set `PROMPT_CONSUMED = YES`; record every received image in `ACTUAL_OUTPUT_COUNT` and batch `ACTUAL_IMAGE_COUNT`; record result reference/binding and output count; never call that Prompt/version again. If the expected output count and Task/result binding are satisfied, mark the production Task `SUCCESS`; otherwise use `RESULT_COUNT_MISMATCH` or the applicable result-recording state.
- Confirmed no image result: record the actual error/reason and applicable terminal or authorized-retry outcome; keep `PROMPT_CONSUMED = NO` when the no-image outcome is known.
- Outcome unknown: set `PROMPT_CONSUMED = UNKNOWN` and `PROMPT_STATE = UNKNOWN`, record the uncertainty, and stop that Task until resolved. Do not guess an image count.
- The Producer MUST NOT compare the submitted payload against the locked prompt after generation, judge visual prompt compliance, or classify image quality. Do not set `PROMPT_MATCH_STATUS` to `MATCH` or `MISMATCH`; leave it `NOT_ASSESSED` or unset. Image correctness and quality belong to the independent QA workflow.

After three consecutive verified Policy/Safety interruptions, set `TASK_STATUS = PROMPT_SKIPPED_POLICY_LIMIT`, record `PROMPT_TERMINATION_REASON = THREE_CONSECUTIVE_POLICY_INTERRUPTS`, and retire the Prompt from all future use even though no image was produced. Any Task that reaches another valid terminal error/stop state likewise cannot be re-queued or reuse its Prompt. Policy interruptions, service/runtime errors, quota/rate limits, and GitHub errors must remain separately classified and counted.

## 7. Result Recording

After a generation result or execution failure:
1. reconnect to GitHub;
2. read the current authoritative record state;
3. record whether an image result was received, the actual output count/result reference, or the confirmed no-image failure reason; record interruption details separately. Do not perform prompt-payload comparison or visual assessment;
4. update batch actual-image totals without filtering out mismatched or unsuccessful results;
5. read back and verify the write.

Image QA remains a separate workflow and is currently paused. Automated generation records the result and execution state; QA does not trigger regeneration.

## 8. Next Task

Before selecting the next Task, reconnect and verify the latest authoritative state.

Continue until every required Task has reached a valid terminal state. A confirmed image result that is bound to its Task and has the expected output count is a production `SUCCESS`; this does not imply QA acceptance. Record actual images even when the output count differs, using `RESULT_COUNT_MISMATCH` as applicable. A confirmed no-image failure must also be recorded with its reason and terminal or explicitly authorized retry state.

Do not require every Task to be successful. When all required Tasks are terminal and the completion record is read back successfully, close the Batch and issue no further generation calls for it.

## 9. Terminal States and Completion

A Task is terminal only when its final state is explicitly recorded as one of the valid terminal outcomes defined by PRODUCTION_RECORD_SCHEMA.md.

A Batch is BATCH_COMPLETED when:
- every required Task has reached a valid terminal state; and
- the Batch completion record has been written and verified.

Success count does not determine Batch completion. `COMPLETED_COUNT` counts SUCCESS Tasks only; `RESULT_RECORDED_COUNT` and `ACTUAL_IMAGE_COUNT` track recorded image-result Tasks and actual images separately. A completed Batch can have zero SUCCESS Tasks while still having recorded images. Completion must stop the production loop, not merely change the persisted status.

## 10. Stop / Resume

/START_AUTO starts a new automated Session.

If an interruption requires continuation, use /RESUME_AUTO. Resume must reconnect to GitHub, reload the applicable rules, recover the existing Session/Batch and locked Prompt Set, and continue only with Tasks that have not reached a valid terminal state.

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

During /RESUME_AUTO, distinguish a problem that affects one Task from a verified problem that affects the entire Batch.

1. A visual-quality or visual-prompt-compliance observation is QA evidence only. QA is currently PAUSED; do not automatically run QA, change Task execution status, or trigger regeneration because of a visual difference.
2. A problem isolated to one Task MUST NOT automatically block unrelated Tasks.
3. If a Task's state or result is unresolved, isolate it and preserve its recovery state. Do not retry, skip, or reuse its consumed/retired Prompt while its outcome remains unknown.
4. After isolating a Task, independently verify the next Task's current state, complete non-empty locked Prompt, Task binding, and applicable execution prerequisites. Continue with that Task if these checks pass and it does not depend on the unresolved Task.
5. Stop the entire Batch only for a verified Batch-wide issue that cannot safely be isolated, such as an unidentifiable Session/Batch, a globally ambiguous production contract, or a Prompt Set/Task binding conflict that makes the next Task's input or result attribution unsafe.
6. Missing nonessential transport telemetry alone is not a stop condition. Record NOT_EXPOSED/UNVERIFIED as applicable.
7. Never mark an unresolved Task as passed, completed, repaired, or skipped merely because other Tasks continue. Record the issue for later recovery.

## 13. Multi-Worker Continuity Rule

For future multi-Worker production, a Worker receiving the next assignment must independently verify that Task's authoritative record, complete locked Prompt, Task-to-Prompt binding, Prompt availability, and explicitly declared prerequisites.

- Do not rely solely on the previous Worker's narrative or completion message.
- Do not block an independent Task because a different Task has missing/incomplete reporting, unverified prompt-match evidence, or a Task-local recovery issue.
- Missing required data for the assigned Task blocks that Task only, unless a verified Batch-wide conflict makes other Tasks unsafe to identify or execute.
- Do not invent missing evidence, falsely resolve the affected Task, retry an unknown outcome, or reuse a consumed/retired Prompt.
- Task dependencies must be explicitly declared; queue order alone does not make one Task dependent on another.
- Continue independent work only after its own readiness checks pass. Keep result accounting, SUCCESS, QA, and LoRA dataset eligibility separate.
- This is a repository contract for future runtime implementation, not a claim that Make or a multi-Worker coordinator is already active.
