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

Automated production accepts:
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

IMAGE_COUNT is the number of independent Tasks to execute. It is not a success target.

## 3. Session / Batch

/START_AUTO creates a new SESSION_ID and BATCH_ID.

A Batch contains:
- SESSION_CONTRACT.md
- BATCH_RECORD.md
- TASK_QUEUE.md
- PROMPT_SET.md
- EXECUTION_LOG.md

All Tasks are designed before generation. The complete Prompt Set is persisted and locked before execution begins.

## 4. Task and Prompt Design

One Task = one independent image.

For wallpaper production:
EXPECTED_OUTPUT_COUNT = 1

Each Task receives one locked Prompt/version. After the Prompt Set is locked, its prompts are not redesigned or silently altered.

## 5. Task Execution

CURRENT_TASK → CURRENT_LOCKED_PROMPT → PROMPT_NONEMPTY_AND_TASK_MATCH → GENERATION_CALL → RESULT → RESULT_VERIFICATION → TASK_STATUS

Immediately before each generation call, reconnect to GitHub and read the current Task and current locked Prompt.

Use the current complete locked Prompt directly as the generation instruction. Do not redesign, summarize, translate, omit, add to, reorder, or substitute it.

Each locked Prompt/version may have at most one actual Generation Call.

The Producer does not automatically retry or regenerate a consumed Prompt/version.

## 6. Result Recording

After a generation result or execution failure:
1. reconnect to GitHub;
2. read the current authoritative record state;
3. record the actual result, failure, interruption, and evidence;
4. read back and verify the write.

Image QA is a separate workflow. Automated generation records the result and execution state; QA does not trigger regeneration.

## 7. Next Task

Before selecting the next Task, reconnect and verify the latest authoritative state.

Continue until every required Task has reached a valid terminal state.

Do not require every Task to be successful.

## 8. Terminal States and Completion

A Task is terminal only when its final state is explicitly recorded as one of the valid terminal outcomes defined by PRODUCTION_RECORD_SCHEMA.md.

A Batch is BATCH_COMPLETED when:
- every required Task has reached a valid terminal state; and
- the Batch completion record has been written and verified.

Success count does not determine Batch completion.

## 9. Stop / Resume

/START_AUTO starts a new automated Session.

If an interruption requires continuation, use /RESUME_AUTO. Resume must reconnect to GitHub, reload the applicable rules, recover the existing Session/Batch and locked Prompt Set, and continue only with Tasks that have not reached a valid terminal state.

/STOP immediately stops new generation and persists a checkpoint when GitHub is available.

## 10. Architecture Boundary

GitHub provides reference data and durable production records.

GitHub does not independently control runtime, scheduling, Worker lifecycle, queues, retries, resume, orchestration, or image generation.

Current runtime ownership:

User → ChatGPT Producer → Generation Interface
                         ↓
                      GitHub
                 Reference + Persistence