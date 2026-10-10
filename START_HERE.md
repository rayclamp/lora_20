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

CURRENT_TASK → CURRENT_LOCKED_PROMPT → PROMPT_NONEMPTY_AND_TASK_MATCH → GENERATION_CALL → RESULT → RESULT_VERIFICATION → TASK_STATUS

Immediately before each generation call, reconnect to GitHub and read the current Task and current locked Prompt.

Use the current complete locked Prompt directly as the generation instruction. Do not redesign, summarize, translate, omit, add to, reorder, or substitute it.

One locked Prompt/version may produce at most one successful image result. A Generation Call attempt does not by itself consume the Prompt.

After each attempt, classify the outcome before advancing:
- Confirmed image result received: set `PROMPT_CONSUMED = YES`; do not call that Prompt/version again.
- Verified Policy/Safety interruption with confirmed no image result: keep `PROMPT_CONSUMED = NO`; an explicitly authorized continuation may retry the exact same locked Prompt/version, without changing its content or Task binding.
- Confirmed generation failure with confirmed no image result: keep `PROMPT_CONSUMED = NO`; follow the applicable error-specific retry/terminal rule without changing the locked Prompt.
- Outcome unknown: set `PROMPT_CONSUMED = UNKNOWN` and `PROMPT_STATE = UNKNOWN`, enter the applicable recovery state, and stop. Do not retry or skip until the outcome is resolved.

After three consecutive verified Policy/Safety interruptions, set `TASK_STATUS = PROMPT_SKIPPED_POLICY_LIMIT`, record `PROMPT_TERMINATION_REASON = THREE_CONSECUTIVE_POLICY_INTERRUPTS`, and retire the Prompt from all future use even though no image was produced. Any Task that reaches another valid terminal error/stop state likewise cannot be re-queued or reuse its Prompt. Policy interruptions, service/runtime errors, quota/rate limits, and GitHub errors must remain separately classified and counted.

## 7. Result Recording

After a generation result or execution failure:
1. reconnect to GitHub;
2. read the current authoritative record state;
3. record the actual result, failure, interruption, and evidence;
4. read back and verify the write.

Image QA remains a separate workflow and is currently paused. Automated generation records the result and execution state; QA does not trigger regeneration.

## 8. Next Task

Before selecting the next Task, reconnect and verify the latest authoritative state.

Continue until every required Task has reached a valid terminal state.

Do not require every Task to be successful.

## 9. Terminal States and Completion

A Task is terminal only when its final state is explicitly recorded as one of the valid terminal outcomes defined by PRODUCTION_RECORD_SCHEMA.md.

A Batch is BATCH_COMPLETED when:
- every required Task has reached a valid terminal state; and
- the Batch completion record has been written and verified.

Success count does not determine Batch completion.

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
