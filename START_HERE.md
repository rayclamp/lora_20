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

If GitHub access, a required read, write, or write/readback verification fails, STOP **the affected operation** and report or preserve the actual failure; never proceed with that operation using memory, cache, stale state, or guesses. Scope a failure to the smallest affected unit (evidence field, Task, or Batch). A Task-local failure does not automatically stop unrelated Tasks. Continue independent work only after known generation results and their attribution are safely preserved/reconciled, and the next Task's authoritative records and complete locked Prompt remain independently readable from GitHub. Stop the entire Batch only for a verified, non-isolatable Batch-wide failure affecting required access, identity/contract, prompt mapping, result attribution, or safe persistence.

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
- REFERENCE_IMAGE (required at `/LORA_PRODUCE` for `LORA_IMAGE` image production only; not required at `/LORA_CONSOLE` prompt design, and not a wallpaper-design command parameter)
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
- `/LORA_CONSOLE` (prompt design): a person-reference image is not required. Do not request an upload, pause, or block design because no image is attached. Design all requested prompts, persist and read back the records, and lock the Prompt Set under the applicable design rules. The designer must not claim to have inspected an image it has not received.
- `/LORA_PRODUCE` (image production): before the first image-generation call, the user must supply a person-reference image in the current producer ChatGPT conversation. That image is the sole visual identity authority for the current production run.
- `CHARACTER=INARIA`: use the canonical Inaria character information in CORE for contextual/semantic guidance, while the production-time uploaded image remains the visual identity authority.
- `CHARACTER=NONE`: do not apply Inaria-specific character information; follow the production-time uploaded reference image and current task instructions.
- If the production-time image is missing, inaccessible, or ambiguous, stop before generation and request that the user upload or identify it. Do not substitute images from GitHub, another module, or an earlier conversation. This production-stage block does not invalidate, unlock, or otherwise alter prompts already designed and locked.
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

Optional production-time evidence, created only when applicable:
- EXECUTION_INPUTS/<TASK_ID>.md: the one immutable exact authorized condensed execution input, saved after the Task's first actual generation call.
- RECOVERY_CHECKPOINTS/<TASK_ID>.md: a complete Task-local safe-recovery fallback when normal fixed-input or required persistence cannot be safely completed. When relevant, it preserves the full exact fixed instruction and all known Task/attempt/result state.

These optional files are not required Console design/lock outputs. EXECUTION_LOG.md records input paths and event facts, not the full condensed instruction. Neither optional path replaces or modifies the canonical locked Prompt.

All Task prompts are designed before generation. For every new Batch, each Task's complete prompt is saved to its own `PROMPTS/<TASK_ID>.md` file. `PROMPT_SET.md` contains only the Task-to-file manifest and prompt metadata, never full prompt bodies. Verify every file and the one-to-one mapping, then lock the manifest and prompt files before execution begins. Existing combined-file Batches remain legacy and must not be silently migrated.

## 5. Task and Prompt Design

One Task = one independent image.

For wallpaper production:
EXPECTED_OUTPUT_COUNT = 1

For `LORA_IMAGE`, each Task is also one independent training-image candidate unless a current task contract explicitly states otherwise.

For `LORA_IMAGE`, each Task's `TASK_OUTPUT_TYPE` must also be recorded in its Task metadata, prompt-file metadata, and manifest metadata, and must agree with the locked prompt's intended composition. Do not add separate `ASPECT_RATIO` or `ORIENTATION` controls.

Each Task receives one dedicated locked prompt file and one prompt version. Each file must include `TASK_ID`, `PROMPT_ID`, `PROMPT_VERSION`, `PROMPT_STATUS=LOCKED`, and explicit `BEGIN_LOCKED_PROMPT_TEXT` / `END_LOCKED_PROMPT_TEXT` delimiters around the exact prompt body. After locking, neither the prompt text nor its file mapping may be silently altered.

For wallpaper prompt design, **full-body framing is optional, not a universal requirement**. The designer must deliberately choose the shot size for each Task based on its scene and purpose. Do not automatically add “full-length framing,” “show the entire body,” “head and feet fully visible,” “no cropping,” or similar language to every prompt. Require full-body or footwear visibility only when the task specifically benefits from it. If fitting the entire person would compromise the reference-supported body silhouette, natural limb width, stable pose, or plausible camera perspective, prefer a natural crop or closer character-dominant framing. Body-shape preservation outranks full-body coverage, footwear visibility, background coverage, and negative space. Do not change or unlock existing locked prompts; this rule applies to future prompt design.


## 6. Task Execution

The canonical locked Prompt is the immutable authoritative design specification. The design/lock stage owns Task mapping, metadata, and Prompt validity.

For each eligible Task:

1. Read the complete assigned locked Prompt from its authoritative recorded source. If it cannot be read completely, record the read failure and stop that Task; never guess or reconstruct it.
2. `FULL_LOCKED_PROMPT` is the default generation input. Only when a concrete interface input limitation prevents submission of the complete Prompt may the Producer prepare one `AUTHORIZED_CONDENSED_PROMPT` under `00_MASTER/GENERATION_WORKER_PROTOCOL.md`. The condensed instruction must faithfully preserve the Task's essential drawing requirements, restrictions, exceptions, priorities, identifiers, reference requirements, composition, style, scene, output format, and intended meaning. It must not redesign the Task or modify the canonical locked Prompt.
3. Immediately invoke the image-generation interface using the effective Task-specific instruction and the reference inputs permitted by the active module. Do not insert content/quality validation, prompt display, design review, unrelated analysis, extra GitHub operations, or other tasks between reading the complete Prompt, necessary faithful input preparation, and the initial generation call.
4. The instruction submitted for the first actual generation call fixes that Task's execution input. All eligible confirmed-no-image retries must use that exact fixed instruction and the same canonical locked Prompt reference. Never overwrite, re-condense, translate, redesign, replace, or switch input modes.
5. If `AUTHORIZED_CONDENSED_PROMPT` was used, save the **exact fixed condensed text after the first actual generation call** to the Task's single `EXECUTION_INPUTS/<TASK_ID>.md` file and read it back to verify. Do not save the condensed body in `EXECUTION_LOG.md` or modify the original `PROMPTS/<TASK_ID>.md`.
6. If the exact prepared/fixed instruction temporarily cannot be submitted before a new generation call, or a Task-local condensed-input persistence problem prevents an otherwise permitted retry, record `TASK_STATUS=PAUSED`. Preserve the exact instruction, all previous actual attempts and outcomes, `PROMPT_CONSUMED`/`PROMPT_STATE`, and remaining retry eligibility. PAUSED creates no generation call and consumes no attempt. Resume only with the same instruction.
7. Determine only observable generation outcomes: image received, confirmed no image, or UNKNOWN. The Producer MUST NOT revalidate Prompt correctness, format, semantics, quality, task binding, or visual intent, and MUST NOT inspect or compare generated images. QA remains independent.
8. Hidden transport telemetry or byte-for-byte payload proof is not required. If the interface does not expose such telemetry, record the applicable `NOT_EXPOSED` or `UNVERIFIED` evidence honestly; do not infer a failed handoff or stop solely for missing telemetry.

If authorized condensed-input persistence fails after the first actual call, isolate the affected Task and preserve the actual generation outcome. A `RECOVERY_CHECKPOINTS/<TASK_ID>.md` fallback must contain the **complete exact fixed text**, original Prompt identity, Task/Batch identity, known actual attempts and outcomes, prompt-consumption state, remaining retry eligibility, result attribution, and persistence evidence. It is authoritative only after successful write and readback verification. Never regenerate a received image or reconstruct a different instruction from memory.

Use the current Task-level retry policy in Section 14. Never retry after image receipt, while the outcome is UNKNOWN, after retry exhaustion, or to bypass a safety/policy restriction.


## 7. Result Recording

After every actual generation call, record only observable execution facts:

- whether an image result was received;
- the actual number of image files received and available result references;
- the associated Task/generation event and attempt attribution when available;
- the confirmed no-image error or interruption reason, if applicable;
- the status of the GitHub record write/readback;
- `GENERATION_INPUT_MODE`, `EXECUTION_INPUT_PATH`, `EXECUTION_INPUT_RECORD_STATUS`, and `FIRST_ATTEMPT_ID` when applicable;
- `PAUSE_REASON`, `PAUSED_AT`, `RESUMED_AT`, and `REMAINING_GENERATION_ATTEMPTS` when applicable.

Use `PROMPT_CONSUMED=NOT_ATTEMPTED` before any actual generation call; `YES` only after confirmed image receipt; `NO` only after a confirmed no-image outcome from an actual call; and `UNKNOWN` when an actual call's outcome cannot be established. A pre-call PAUSED event is not a confirmed no-image result and must not create a generation attempt.

When authorized condensation was used, save the exact fixed text after the first actual generation call in `EXECUTION_INPUTS/<TASK_ID>.md` and read it back. Record `EXECUTION_INPUT_RECORDED` only after successful write/readback; record `EXECUTION_INPUT_PERSISTENCE_FAILED` when persistence fails and that fact can be saved. A verified recovery fallback is recorded as `SAFE_RECOVERY_CHECKPOINT_RECORDED`. `EXECUTION_LOG.md` contains the path and event facts, never the full condensed text.

Record `TASK_PAUSED` and `TASK_RESUMED` separately from generation events. They do not create `GENERATION_STARTED`, `ATTEMPT_ID`, or confirmed-no-image failures and do not increase attempt counts.

Do not compare the generation input with the locked Prompt or inspect/evaluate the image. Do not add post-generation QA or a prompt-compliance gate.

A confirmed image receipt must remain an observed received-image fact even if a later GitHub write/readback fails. Record or explicitly report the persistence failure separately; never erase/relabel the receipt, regenerate the image, or mark the Task as formally SUCCESS solely because the image was observed. Formal SUCCESS requires correct Task attribution and durable write/readback verification under `PRODUCTION_RECORD_SCHEMA.md`. Preserve the applicable unresolved/recovery state until that requirement is met.


## 8. Next Task

Before selecting the next Task, reconnect to GitHub and verify the latest authoritative Task/Batch state. The previous Task's known generation outcome, result attribution, and required exact fixed-input evidence must be durably recorded and readback-verified, or a complete safe recovery checkpoint containing the exact fixed input and all known Task/attempt/result state must be written and readback-verified. A path, hash, or narrative alone is insufficient.

A Task-local failure does not automatically block unrelated Tasks. Independent Tasks may continue only after the affected Task's known result/attribution and exact fixed instruction, where applicable, are safely preserved and verified, and the next Task's own authoritative records and complete locked Prompt are independently readable. If these preservation conditions cannot be verified, pause progression for persistence recovery; do not advance based on an unpersisted narrative, cache, memory, or guess.

Continue until every required Task has reached a valid terminal state. A PAUSED Task remains non-terminal and outstanding even if independent Tasks continue. A confirmed image result that is durably recorded against its Task is a production `SUCCESS`, counted once per Task regardless of how many files were returned; this does not imply QA acceptance. Record the actual number of returned files separately. A confirmed no-image failure must be recorded with its observed reason and handled under the current Task-level retry policy in Section 14.

Do not require every Task to be successful. When all required Tasks are terminal, `PAUSED_COUNT=0`, and the completion record is read back successfully, close the Batch and issue no further generation calls for it.


## 9. Terminal States and Completion

A Task is terminal only when its final state is explicitly recorded as one of the valid terminal outcomes defined by `PRODUCTION_RECORD_SCHEMA.md`. `TASK_STATUS=PAUSED` is non-terminal.

A Batch is `BATCH_COMPLETED` only when:
- every required Task has reached a valid terminal state;
- `PAUSED_COUNT=0`; and
- the Batch completion record has been written and readback-verified.

Success count does not determine Batch completion. `COMPLETED_COUNT` counts each Task with a confirmed image result durably recorded against it once; `ACTUAL_IMAGE_COUNT` counts every actual image file received. `RESULT_RECORDED_COUNT` is reserved for result-bearing Tasks whose recording/attribution is not yet sufficient for SUCCESS, not for extra files or missing QA. `PAUSED_COUNT` is separate from `PENDING_COUNT`, BLOCKED, DEFERRED, FAILED, and UNVERIFIED counts. A Task must not be double-counted in current Task-status categories. `ATTEMPT_COUNT` counts actual generation calls only; pre-call PAUSED/RESUMED events do not consume attempts. Completion must stop the production loop, not merely change the persisted status.


## 10. Production Continuation

To continue an interrupted Batch, invoke the applicable Producer command again with the same explicit `MODULE`, `SESSION_ID`, and `BATCH_ID`. Reconnect to GitHub and recover the existing authoritative records. Continue only with Tasks that have not reached a valid terminal state. Never create a replacement Session/Batch, reset attempt counts, redesign a locked Prompt, or silently migrate a legacy Batch.

For a Task that used authorized condensation, recover its exact fixed instruction from the verified `EXECUTION_INPUTS/<TASK_ID>.md` record or the sole complete readback-verified `RECOVERY_CHECKPOINTS/<TASK_ID>.md` fallback. Never re-condense, translate, replace, or reconstruct missing fixed text from memory. Resume an eligible Task only with the same fixed instruction and its original canonical Prompt reference.

A PAUSED Task preserves its previous actual attempts, confirmed-no-image failures, Prompt-consumption state, and remaining retry eligibility. A pre-call pause does not create a generation call. PAUSED remains non-terminal and must eventually reach a valid terminal outcome before Batch completion.

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
2. A problem isolated to one Task MUST NOT automatically block unrelated Tasks. GitHub read/write/readback failures, prompt-file access failures, metadata/status errors, fixed-input persistence failures, and other non-generation errors must not increment generation-failure counts. Preserve the affected Task's known result, attribution, and exact fixed input where applicable; if normal persistence fails, use a complete readback-verified safe recovery checkpoint. Independent Tasks may continue only after those safeguards and their own current authoritative records/complete locked Prompts are verified.
3. If a prior generation outcome is UNKNOWN, preserve that state and do not retry or reuse the same locked Prompt.
4. After selecting an eligible Task, read its assigned complete locked Prompt. The only prompt-related pre-generation check is whether it was read completely. If so, use the full text by default or prepare one faithful authorized condensed instruction only for a concrete interface input limitation, then call the generation tool immediately. Do not add content, metadata, format, semantic, or Task-binding validation.
5. If the complete Prompt cannot be read, record the read failure and stop that Task. Do not guess, reconstruct, or substitute prompt text.
6. Stop the entire Batch only for a verified, non-isolatable Batch-wide issue affecting Session/Batch identity or contract, global prompt-manifest or Task-to-prompt mapping, required GitHub access, safe result attribution, or persistence integrity. A failure involving only one Task must be isolated. Do not use visual QA or optional transport telemetry as a production gate.
7. Record the actual observed generation outcome separately from GitHub persistence and preserve unresolved state. A result-recording problem must never trigger another image-generation call. Confirmed image receipt is the observable generation result and consumes the Prompt; formal Task SUCCESS/COMPLETED_COUNT additionally requires correct Task attribution and durable result-record write/readback verification.
8. The first actual generation call fixes the Task's execution instruction. If authorized condensation was used, preserve its exact fixed text after that call in `EXECUTION_INPUTS/<TASK_ID>.md` and read it back before retry or unsafe progression. If that persistence fails, isolate the Task and use a complete verified checkpoint containing the exact text and known state. Do not overwrite, re-condense, or switch modes.
9. A temporary pre-call inability to submit the exact prepared/fixed instruction, or a Task-local condensed-input persistence recovery preventing an otherwise permitted retry, enters non-terminal `TASK_STATUS=PAUSED`. Preserve all prior attempts, `PROMPT_CONSUMED`/`PROMPT_STATE`, and remaining retry eligibility. A pause/resume event is not a generation attempt. Resume only with the same instruction. PAUSED is not permitted after image receipt, UNKNOWN outcome, retry exhaustion, or to bypass safety/policy restrictions.
10. Other independent Tasks may continue while a Task is PAUSED only after its known results, attribution, and exact fixed input or complete recovery checkpoint have been durably preserved and readback-verified. Continuing other Tasks does not resolve or terminalize the PAUSED Task.


## 13. Multi-Worker Continuity Rule

For future multi-Worker production, select the assigned Task from existing authoritative records before reading its Prompt. The design/lock stage owns Task-to-Prompt mapping and prerequisite validation. Once the complete assigned locked Prompt is successfully read, use the full text by default or prepare one faithful authorized condensed input only for a concrete interface input limitation, then immediately call the generation tool. No content validation, redesign, prompt display, or unrelated operation may intervene.

- Do not rely solely on the previous Worker's narrative or completion message.
- Do not block an independent Task because a different Task has missing/incomplete reporting, unverified prompt-match evidence, or a Task-local recovery issue.
- If the complete assigned Prompt cannot be read, stop that Task only, unless a verified Batch-wide issue prevents safe Task selection. Do not add runtime prompt-validation gates.
- Do not invent missing evidence, falsely resolve the affected Task, retry an unknown outcome, or reuse a consumed/retired Prompt.
- The first actual call fixes the execution input. If authorized condensation was used, preserve the exact fixed text after the first call and read it back before retry; never re-condense, replace, or switch modes.
- Task dependencies must be explicitly declared; queue order alone does not make one Task dependent on another.
- A PAUSED Task retains its prior attempts and remaining retry eligibility and remains non-terminal. Other independent Tasks may proceed only after the paused Task's known state and exact fixed input/result attribution are safely preserved and verified, or a complete verified recovery checkpoint exists.
- For an independent Task, select it from existing records before reading its Prompt; after a successful complete-Prompt read and any necessary faithful condensation, call the generation tool immediately. Keep result accounting, SUCCESS, QA, and LoRA dataset eligibility separate.
- This is a repository contract for future runtime implementation, not a claim that Make or a multi-Worker coordinator is already active.

## 13A. Producer Must Not Perform QA — Current Rule

During production, the Producer MUST NOT inspect or evaluate generated images for prompt compliance, image quality, identity, anatomy, composition, style, or LoRA dataset suitability. Do not compare a generated image with its prompt. The Producer only confirms image receipt, records actual returned-file count and result attribution, consumes/retires the prompt, and persists the production record.

Any confirmed receipt of one or more image files establishes an observed result and irrevocably prevents further generation for that Task. The Task counts as exactly ONE formally successful Task output in COMPLETED_COUNT only after that received result is correctly attributed, durably recorded, and readback-verified; until then keep receipt and persistence status separate and unresolved. Record every actual returned file separately in ACTUAL_OUTPUT_COUNT and batch ACTUAL_IMAGE_COUNT, subject to verified evidence; extra files do not create additional successful Tasks. QA is separate, downstream, and must not change production success/counts or trigger regeneration. This current rule overrides conflicting older wording elsewhere in the production documentation.


## 14. Current Task Retry and Completion Policy — Overrides Conflicting Older Rules

This section is the current authoritative policy for new execution and resume operations. If any earlier sentence in this file says that a locked Prompt/version can receive only one generation call, that every failed call permanently ends the Task, or that no retry is permitted, this section supersedes that wording.

1. **Image receipt stops further generation; durable recording completes the Task.** If one or more image files are confirmed received, preserve that fact and set `PROMPT_CONSUMED=YES` and `PROMPT_STATE=CONSUMED`. Count the Task once in formal `COMPLETED_COUNT` only after the received result is accurately attributed to the Task, durably written to GitHub, and readback-verified. Until then retain the appropriate received-but-unverified/recovery state; do not falsely report formal SUCCESS. Record the actual returned-file count separately, and never retry because of file count, appearance, prompt compliance, or failed GitHub persistence.
2. **Fix the first actual generation input.** Use `FULL_LOCKED_PROMPT` by default. A concrete interface input limitation may authorize one faithful `AUTHORIZED_CONDENSED_PROMPT`. The instruction used for the first actual generation call fixes the Task's execution input and all later eligible retries. Keep the same canonical locked Prompt identity. Never rewrite the canonical Prompt, re-condense, translate, redesign, replace the fixed instruction, or switch input modes.
3. **Preserve an authorized condensed input.** If condensation was used, save the exact fixed text after the first actual call to the Task's one immutable `EXECUTION_INPUTS/<TASK_ID>.md` record and read it back before retry or unsafe progression. If normal persistence fails, isolate the Task; a `RECOVERY_CHECKPOINTS/<TASK_ID>.md` fallback must contain the complete exact fixed text, original Prompt identity, known Task/attempt/result state, remaining retry eligibility, result attribution, and persistence evidence, and must be readback-verified. A path, hash, or narrative alone is insufficient.
4. **Retry only a confirmed no-image failure.** A retry is permitted only after a known failed actual generation call for which no image result was received. Reuse the exact execution instruction fixed by the first actual call, whether full or condensed, with the same immutable canonical locked Prompt. Each actual retry is a separate attempt with its own `ATTEMPT_ID` / `GENERATION_CALL_ID` where available, timestamp, outcome, and error reason.
5. **Three confirmed generation failures terminate the Task.** Count three consecutive confirmed no-image outcomes from actual image-generation attempts for the same Task, including the initial call. When this total reaches three, mark the Task terminal as `GENERATION_FAILED` (or the applicable more specific terminal state) and do not start it again. GitHub read/write/readback failures, prompt-file access failures, metadata/status errors, and pre-call PAUSED events are not generation attempts and do not increment this count.
6. **PAUSED preserves the Task without consuming an attempt.** A temporary pre-call inability to submit the same prepared/fixed instruction, or a Task-local condensed-input persistence recovery that prevents an otherwise permitted retry, enters non-terminal `TASK_STATUS=PAUSED`. Preserve previous actual attempts, confirmed-no-image failures, `PROMPT_CONSUMED`/`PROMPT_STATE`, and `REMAINING_GENERATION_ATTEMPTS`. A pre-call pause uses `PROMPT_CONSUMED=NOT_ATTEMPTED` if no actual call occurred, or retains `NO` after a confirmed no-image call. `TASK_PAUSED`/`TASK_RESUMED` do not create generation attempts. Resume only with the same exact instruction. Never use PAUSED after image receipt, UNKNOWN outcome, retry exhaustion, or to bypass safety/policy restrictions.
7. **Unknown outcome is not a confirmed failure.** If it is unknown whether an image was produced or received, preserve `PROMPT_CONSUMED=UNKNOWN` and the applicable recovery state. Do not retry that Task, because doing so could duplicate a successful generation.
8. **Task-local isolation and safe continuation.** A Task that reaches its three-generation-failure limit or has another Task-local/non-generation error must not automatically block unrelated Tasks. Safely preserve/readback-verify its known results, attribution, and exact fixed input where applicable, or write/readback-verify a complete safe recovery checkpoint, before advancing. The next Task's own authoritative records and complete locked Prompt must be independently readable. Stop the whole Batch only for a verified non-isolatable Batch-wide access, identity/contract, prompt-mapping, result-attribution, or persistence-safety failure.
9. **Separate facts and counters.** Keep generation outcome, generation-failure count, image-receipt state, formal SUCCESS status, and GitHub persistence state distinct. `ATTEMPT_COUNT` counts actual generation calls only. `PAUSED_COUNT` counts required Tasks currently in non-terminal PAUSED state separately from PENDING, BLOCKED, DEFERRED, FAILED, and UNVERIFIED. A required PAUSED Task prevents Batch completion. Derive all counters from verified Task and attempt records.
10. **Completion.** A Batch may be `BATCH_COMPLETED` only after every required Task has a valid terminal outcome, `PAUSED_COUNT=0`, all state/counters are reconciled, and the final Batch completion record is written and readback-verified. Historical production records remain immutable.


## 15. Evidence-Gated Production Records — Mandatory for All Entry Commands

For every production entry command, including `/WALLPAPER_PRODUCE` and any active module-specific producer:

1. Load the current canonical rules and exact current Session/Batch/Task/prompt records directly from GitHub before acting. Never use a prior chat summary, memory, cache, or an earlier status report as a substitute for current records.
2. Treat task status as a conclusion, not as proof. A generation call does not prove image receipt. Only a directly observed image result can establish `IMAGE_RECEIVED=YES`; confirmed no-image is NO; uncertainty must remain UNKNOWN.
3. For every actual generation attempt, preserve a distinct event with observable result facts, actual received-file count, available result references, attempt attribution, and persistence status. Do not invent evidence or silently overwrite prior history. Record PAUSED/RESUMED as separate non-generation events.
4. After the attempt, persist the event and current Task state to GitHub and read them back. Verify the event, Task status, prompt-consumption state, attempt count, output count, execution-input record when applicable, and derived summary counts before retry, unsafe progression, or closing the Batch.
5. On resume, reconcile Task status with attempt history and result evidence. If they conflict or evidence is missing, mark the affected state unresolved and reconcile; do not trust the status field alone, guess the likely outcome, retry an unknown result, or rewrite historical events without a traceable correction.
6. Derive Batch counters from verified Task and attempt records. Do not copy, estimate, or manually assert counts from expectations or prior summaries. Batch completion requires valid terminal outcomes for all required Tasks, `PAUSED_COUNT=0`, and successful final-record readback.
7. If a known result cannot be durably recorded, do not regenerate it. Recover persistence; pause progression when the result cannot be safely preserved. If an authorized condensed input cannot be normally saved, isolate the Task and use only a complete readback-verified recovery checkpoint containing its exact fixed text and known state. Task-local errors must not be misclassified as generation failures.
8. These requirements do not add a pre-generation content-validation step: after the complete assigned locked Prompt is successfully read, immediately use the full text by default or prepare and submit one faithful authorized condensed input only for a concrete interface input limitation. The evidence and persistence gates apply after the first generation call and before retry, unsafe Task progression, or completion.

GitHub is a durable record store, not an independent witness to generation. All production entry commands must follow the current evidence-gated rules in `00_MASTER/PRODUCTION_RECORD_SCHEMA.md`, `00_MASTER/GENERATION_WORKER_PROTOCOL.md`, and the applicable command contract. Do not claim that a saved field is true solely because it was written.
