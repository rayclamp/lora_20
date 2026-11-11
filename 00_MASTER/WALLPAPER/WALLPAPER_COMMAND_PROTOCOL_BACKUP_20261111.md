# WALLPAPER_COMMAND_PROTOCOL.md — Unified Wallpaper Design and Production Commands

## 1. Purpose and scope

This document defines the shared command contract for both wallpaper modules:

- `UNIVERSAL_WALLPAPER`: ordinary/general wallpaper.
- `FESTIVAL_WALLPAPER`: festival wallpaper.

The user-facing command names are unified across both modules:

- `/WALLPAPER_CONSOLE`: design and lock prompts; do not generate images.
- `/WALLPAPER_PRODUCE`: execute the existing locked prompts; do not redesign prompts or perform QA.

The selected `MODULE` determines the canonical module rules, reference policy, data sources, and production-record root. Do not create separate command names for ordinary and festival wallpaper.

This document is not a LoRA specification. General and festival wallpaper workflows MUST NOT read or apply `MODULES/LORA_IMAGE/` or `ARCHIVE/LEGACY_LORA_PRODUCTION/` as active rules.

## 2. Shared authoritative repository

Repository: `rayclamp/lora_20`  
Branch: `main`

Before design or production, connect to GitHub and read the current applicable canonical files, including:

- `START_HERE.md`
- `00_MASTER/CORE_RULES.md`
- `00_MASTER/DRAWING_INSTRUCTIONS.md`
- `00_MASTER/ANATOMY_STABILITY.md`
- `00_MASTER/GENERATION_RULES.md`
- `00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md`
- `00_MASTER/GENERATION_WORKER_PROTOCOL.md`
- `00_MASTER/PRODUCTION_RECORD_SCHEMA.md`
- `00_MASTER/CANONICAL_PATH_REGISTRY.md`
- `00_MASTER/MODULE_REGISTRY.md`
- `00_MASTER/SYSTEM_ARCHITECTURE.md`

CORE rules remain authoritative. Read any further required dependencies referenced by these files. If a required read or GitHub operation fails, stop the affected operation and report the actual failure; do not use memory, cache, guessed rules, or ordinary text-to-image fallback. A Task-local read/write/readback failure must not automatically stop or lock unrelated Tasks. Independent Tasks may continue only after the affected Task's known outcome, attribution, and exact fixed input where applicable are safely written and readback-verified, or preserved in a complete readback-verified safe recovery checkpoint, and the next Task's own authoritative records and complete locked Prompt can be read directly from current GitHub data. Otherwise pause progression to recover persistence. Stop the whole Batch only for a verified non-isolatable Batch-wide access, identity/contract, mapping, attribution, or persistence-safety problem that prevents safe continuation.

## 3. Module-specific design dependencies

### MODULE=UNIVERSAL_WALLPAPER

For this module, `PRODUCTION_TYPE` is `ANIME` or `REALISTIC`. Read the applicable files:

- `MODULES/UNIVERSAL_WALLPAPER/REFERENCE_POLICY.md`
- For `PRODUCTION_TYPE=ANIME`: `00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md`
- For `PRODUCTION_TYPE=REALISTIC`: `00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md`
- `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_SHOES.md` when footwear rules are relevant.
- `00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md` when `CHARACTER=INARIA`, for character-semantic guidance only.

Do not load festival costume catalogs as Universal options. Do not load LoRA rules or assets.

### MODULE=FESTIVAL_WALLPAPER

For this module, set `PRODUCTION_TYPE=FESTIVAL`. The Festival design rules use the separate module-specific `WALLPAPER_TYPE` value (`ANIME WALLPAPER` or `REALISTIC WALLPAPER`) to select the visual-rendering rule set. Read the applicable files:

- `MODULES/FESTIVAL_WALLPAPER/REFERENCE_POLICY.md`
- `00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md`
- `FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/CORE_FESTIVAL_INDEX.md`
- The selected festival's canonical record(s), cultural anchors, item-link matrix, schemas, and relevant category catalogs required by the festival design rules.
- For Festival `WALLPAPER_TYPE=ANIME WALLPAPER`: `00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md`
- For Festival `WALLPAPER_TYPE=REALISTIC WALLPAPER`: `00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md`

Resolve `WALLPAPER_TYPE` from the user's explicit request or configured custom instructions. If it remains missing or ambiguous and the Festival design rules require it, stop and report the missing value rather than guessing.
- `00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md` when `CHARACTER=INARIA`, for character-semantic guidance only.

Do not import Universal-only footwear/options where the festival rules specify their own catalog. Do not load LoRA rules or assets.

## 4. Design command contract — /WALLPAPER_CONSOLE

The design command creates a new Session and Batch, plans the entire requested set, writes every complete prompt to its own authoritative file, verifies the saved data by reading it back, and locks the complete Prompt Set before reporting completion.

The command must not:
- call the image-generation tool;
- perform image QA or image editing;
- request or require an uploaded reference image;
- include `REFERENCE_IMAGE` as a wallpaper-design input parameter;
- claim to have seen a reference image that was not provided;
- read or apply LoRA-specific rules.

The wallpaper design request uses the applicable fields defined by `START_HERE.md`, such as `MODULE`, `PRODUCTION_TYPE`, `CHARACTER`, `IMAGE_COUNT`, `OUTPUT_TYPE`, `THEME` / `FESTIVAL_SCOPE`, `SCENE`, `SEASON`, `WEATHER`, `TIME`, `PET_ALLOWED`, and `CUSTOM_INSTRUCTIONS`. For `FESTIVAL_WALLPAPER`, also resolve the Festival-specific `WALLPAPER_TYPE` (`ANIME WALLPAPER` or `REALISTIC WALLPAPER`) from the explicit request/configuration. Use only fields applicable to the selected module and current canonical schema. Do not add a reference-image field to the wallpaper design request.

A designer may write a prompt that explains how an image explicitly supplied later in the production conversation should be used, according to the active module's reference policy. The designer must not assume that such an image exists or describe its unseen contents.

For every new Batch, use the canonical path:
`PRODUCTION_RECORDS/<MODULE>/<SESSION_ID>/<BATCH_ID>/`

Create the standard records:
- `SESSION_CONTRACT.md`
- `BATCH_RECORD.md`
- `TASK_QUEUE.md`
- `PROMPT_SET.md` (manifest/index only; never store all prompt bodies here)
- `EXECUTION_LOG.md`
- `PROMPTS/TASK_001.md`, `PROMPTS/TASK_002.md`, etc., one complete prompt per Task.

Design all requested Tasks before locking. Verify the exact Task count, one-to-one Task-to-prompt-file mapping, non-empty full prompt bodies, required metadata, and required records by reading the saved files back from GitHub. Lock only after all required data has been successfully written and verified.

On completion, explicitly post `MODULE`, `SESSION_ID`, `BATCH_ID`, `IMAGE_COUNT`, actual Task/prompt-file counts, `PROMPT_SET_STATUS`, the Batch path, and write/readback verification status in the chat. Then stop; do not generate images.

## 5. Production command contract — /WALLPAPER_PRODUCE

The production command MUST receive all three user-specified fields before it selects any module-specific rules or reads a production Batch:

- `MODULE=UNIVERSAL_WALLPAPER` or `MODULE=FESTIVAL_WALLPAPER`
- `SESSION_ID=<existing Session ID>`
- `BATCH_ID=<existing Batch ID>`

These values are mandatory and must not be inferred from memory, earlier chats, default values, or a neighboring record. Validate that all three are present and supported. Then use `MODULE` to load only the corresponding module-specific rules, reconnect to GitHub, and read the exact `PRODUCTION_RECORDS/<MODULE>/<SESSION_ID>/<BATCH_ID>/` records. Confirm that the stored module, Session ID, and Batch ID match all three user-specified values before executing any Task.

If a field is missing/invalid, a required read fails, or the stored identity does not match, stop and report the exact problem. Do not choose a substitute module, Session, or Batch; do not create a replacement; do not fall back to generic image generation.

Use the manifest and per-Task prompt files required by the current schema. Do not redesign or rewrite locked prompts.


For each eligible Task:
1. Read the complete assigned locked Prompt from its authoritative file and treat it as the immutable canonical design specification.
2. Use `FULL_LOCKED_PROMPT` by default. Only when a concrete observable interface input limitation prevents full submission may the Producer prepare one `AUTHORIZED_CONDENSED_PROMPT` under `00_MASTER/GENERATION_WORKER_PROTOCOL.md`. Preserve the Task's essential drawing requirements, restrictions, exceptions, priorities, identifiers, composition, style, scene, output format, reference rules, and intended meaning; do not redesign or modify the canonical Prompt.
3. Immediately invoke image generation using the effective Task-specific instruction and any reference inputs permitted by the active wallpaper module. No content/quality validation, prompt display, unrelated GitHub operations, or extra planning may intervene between full-Prompt reading, authorized input preparation, and the initial call. Missing hidden transport telemetry or byte-for-byte payload proof is not a separate success/failure gate.
4. The first actual generation call fixes the Task's execution instruction. If authorized condensation was used, **after the first actual call** save the exact fixed condensed text to the Task's single `EXECUTION_INPUTS/<TASK_ID>.md` file, then read it back and verify it before retry or unsafe progression. Do not overwrite a successfully verified input file, re-condense, translate, replace the input, or switch modes. Preserve the original locked Prompt unchanged.
5. Determine only observable results: confirmed image receipt, confirmed no image, or UNKNOWN. Record actual returned-file count, available result references, Task/attempt attribution, confirmed no-image reason when known, and independent GitHub persistence status. Do not inspect the image, assess prompt compliance, or perform visual QA.
6. If the same prepared/fixed input cannot temporarily be submitted **before a new actual generation call begins**, record `TASK_STATUS=PAUSED` and the reason, preserve the same input and remaining attempt budget, and do not count a new attempt. Resume only with that identical instruction. PAUSED is non-terminal and is never a means to bypass safety/policy restrictions.
7. If authorized condensed-input persistence fails after the first actual call, isolate the affected Task, preserve its actual generation outcome, and recover the exact fixed text. A complete `RECOVERY_CHECKPOINTS/<TASK_ID>.md` may be used if successfully written and readback-verified; it must preserve the exact fixed input and known Task/attempt/result state. Do not regenerate a received image or reconstruct a different condensed instruction from memory.

The production command does not contain or supply a reference image and does not ask the user to upload one as part of the command. If a visual reference is separately supplied in the production conversation, apply only the active module's reference policy and the locked prompt. Do not invent, search across modules for, or silently substitute a reference. If no reference is supplied, follow the module policy's valid `NO_REFERENCE` behavior unless the applicable task rules explicitly require a reference; if a required reference is missing, record the applicable blocked state rather than guessing.


### Retry and task completion

- Image receipt is an observable generation fact and permanently prohibits further generation for that Task, even when GitHub writes fail. Formal Task SUCCESS and one increment to `COMPLETED_COUNT` require that the received image be attributed to the correct Task and its result durably written and readback-verified. Until then preserve the receipt as unresolved, not formally completed. Record the actual returned-file count separately; never regenerate to repair persistence.
- Retry only a confirmed no-image result from an **actual generation call**, using the same exact generation instruction fixed at the first actual call and the unchanged canonical locked Prompt reference. Do not switch between `FULL_LOCKED_PROMPT` and `AUTHORIZED_CONDENSED_PROMPT`, rewrite the instruction, or redesign it to bypass a safety/policy block. Missing hidden transport telemetry is not a generation-success gate.
- Count the initial actual generation call as the first attempt. After three consecutive confirmed no-image generation failures in total for the same Task (initial call included), terminate that Task, record failure-limit exhaustion and reason, and do not start it again. GitHub read/write/readback, prompt-file access, metadata/status failures, and **pre-call PAUSED events** never consume this generation retry limit.
- A temporary pre-call inability to submit the exact fixed instruction sets non-terminal `TASK_STATUS=PAUSED`. Preserve all previous generation attempts, confirmed no-image failures, `PROMPT_CONSUMED`, `PROMPT_STATE`, input source, and `REMAINING_GENERATION_ATTEMPTS`. A pause/resume event is not a generation call. Resume only with the same fixed instruction. Required PAUSED Tasks prevent `BATCH_COMPLETED`.
- Do not retry after confirmed image receipt, UNKNOWN generation outcome, or exhausted retry eligibility. Do not use PAUSED to circumvent policy, safety, quota, or other restrictions.
- Task-local failures do not automatically block unrelated Tasks or consume generation retries. Continue with another independent Task only after the preceding known result/attribution and exact fixed input when applicable are durably preserved/readback-verified, or a complete explicit recovery checkpoint is written and readback-verified. The next Task's own authoritative records and complete locked Prompt must be independently readable. If safe preservation is unavailable, pause progression. Stop the Batch only for a verified non-isolatable Batch-wide access, identity/contract, prompt assignment, result-attribution, or persistence-safety failure.
- Keep generation outcomes and GitHub persistence outcomes distinct. Recover failed record writes without regenerating an image already received.

Do not automatically launch QA. QA is separate from production. The Batch closes only after every required Task has a valid terminal outcome, `PAUSED_COUNT=0`, and the final completion record is written and readback-verified.

## 6. Prohibited cross-module behavior

- Universal and Festival wallpaper share these command names, but not their specialized design data.
- Festival cultural/costume data must not leak into Universal Wallpaper.
- Universal-only options must not override Festival rules.
- LoRA dataset rules, LoRA references, archived legacy LoRA production rules, and LoRA QA must not be imported into either wallpaper module.
- Historical Session/Batch records are evidence and must not be silently rewritten or migrated.


## 7. Evidence-Gated Production and Resume — Mandatory Override

This section is mandatory for every invocation of /WALLPAPER_PRODUCE and supersedes any conflicting wording elsewhere in this command contract that could permit state changes based on assumptions rather than observable outcomes.


### 7.1 Before generation
- Connect to current GitHub `main` and read current canonical rules plus the exact user-specified Session/Batch records, Task queue, manifest, and assigned Task's complete locked Prompt. Select the Task from current authoritative records; do not rely on prior narratives or cached state.
- Once the complete locked Prompt has been read, immediately prepare and submit the effective Task-specific instruction under the shared Worker Protocol: full Prompt by default, necessary faithful condensation only for a concrete interface input limitation. Do not insert content validation, design review, extra metadata checks, prompt display, or unrelated GitHub operations.
- Use only module-permitted reference input or its legal `NO_REFERENCE` behavior. Do not silently substitute a missing required reference.
- The instruction used for the first actual generation call is fixed for all later eligible retries. If the prepared/fixed instruction cannot temporarily be submitted before a new generation call, enter non-terminal PAUSED and preserve the same input and remaining attempt budget without inventing a generation call.


### 7.2 After every generation call
- Record only observable facts: actual image received / confirmed no image / UNKNOWN, returned-file count, available references, Task/attempt attribution, confirmed no-image reason if known, and GitHub persistence state. A call or expected result alone is not receipt evidence.
- Use `IMAGE_RECEIVED=YES` only for confirmed image receipt, NO only for confirmed no-image outcome after an actual generation call, and UNKNOWN when the call outcome cannot be established. Before any actual call, `PROMPT_CONSUMED=NOT_ATTEMPTED`; a pre-call PAUSED event is not a confirmed no-image outcome.
- If `AUTHORIZED_CONDENSED_PROMPT` was used for the Task's first actual call, preserve the same exact fixed text **after that call** in `EXECUTION_INPUTS/<TASK_ID>.md` and read back to verify it. Record `GENERATION_INPUT_MODE`, `EXECUTION_INPUT_PATH`, `EXECUTION_INPUT_RECORD_STATUS`, and `FIRST_ATTEMPT_ID` where available. An existing verified input is immutable; do not overwrite, recreate, or switch modes.
- If this persistence fails, record `EXECUTION_INPUT_PERSISTENCE_FAILED` when possible, isolate the affected Task, and safely recover exact text without regenerating. A `RECOVERY_CHECKPOINTS/<TASK_ID>.md` fallback must contain the **full exact fixed input**, canonical Prompt identity, all known attempts/results, prompt-consumption state, remaining retry eligibility, result attribution, and persistence evidence, and must be readback-verified.
- Append distinct attempt/result events without overwriting earlier attempt history; append `RECORD_CORRECTED` for corrections. `EXECUTION_INPUT_RECORDED` is recorded only after verified input preservation. `TASK_PAUSED` and `TASK_RESUMED` are non-generation events and must not increase generation attempt or confirmed-no-image failure counts.
- Update the Task's current state and relevant Batch counts from verified Task/attempt evidence, not expected workflow or older summaries.
- Write observed results, Task state, prompt-consumption state and applicable counts to GitHub. Read back and verify attempt count, receipt, actual-file count, Task attribution, execution-input record when applicable, prompt state, Task status, and summary counts. Preserve confirmed receipt even when required persistence is unresolved; do not declare formal SUCCESS or regenerate a received image to repair recording.


### 7.3 Mandatory gate before the next Task
Do not select or generate an independent next Task until the affected Task's observed outcome, result attribution, and required fixed execution-input evidence have been durably preserved and readback-verified, or a complete safe recovery checkpoint for the Task-local persistence problem has been written and readback-verified. A known received image must not be regenerated, and an UNKNOWN generation result must not be retried. A path, hash, or previous Producer narrative alone cannot recover missing exact condensed text.

A Task-local persistence failure or non-terminal PAUSED state does not make unrelated Tasks terminal or automatically stop the Batch. Independent work may continue only after all known facts and exact fixed input where required are safely preserved and verified, and the next Task's own authoritative records and complete locked Prompt are directly readable. Otherwise pause progression until the evidence is safely recovered. Stop the Batch only for verified non-isolatable Batch-wide problems.


### 7.4 Resume reconciliation
On every continuation, read current authoritative records and compare Task status, `PROMPT_CONSUMED`/`PROMPT_STATE`, actual attempt history, result references/counts, `GENERATION_INPUT_MODE`, `EXECUTION_INPUT_PATH`, input-record readback status, and persistence evidence. For any PAUSED Task, verify the same prepared/fixed instruction can be recovered exactly, and preserve the prior attempted-call count and remaining retry eligibility. If a Task used authorized condensation, read back its original verified input file or complete verified recovery checkpoint; never re-condense or switch modes.

If a discrepancy is Task-local, isolate it for evidence-based recovery; do not automatically block independent Tasks. No status label or prior Producer report alone proves receipt. Never fabricate, overwrite history, retry a received/UNKNOWN outcome, or promote an unresolved Task to SUCCESS. Escalate only a verified non-isolatable Batch-wide defect; satisfy Section 7.3 before progressing.


### 7.5 Completion and counters
- `COMPLETED_COUNT` counts a Task once only when image receipt and correct Task attribution are confirmed and the required SUCCESS event/Task result are durably written and readback-verified. Keep received-but-unverified results separate.
- `ACTUAL_IMAGE_COUNT` counts actual individual image files according to verified evidence, not IMAGE_COUNT or successful Tasks. Do not invent a verified total.
- `ATTEMPT_COUNT` counts only actual generation calls evidenced by distinct attempt events, including permitted retries. Pre-call PAUSED or TASK_RESUMED events, GitHub read/write attempts, and other non-generation operations are excluded.
- `PAUSED_COUNT` counts required Tasks currently in non-terminal PAUSED state; it is separate from `PENDING_COUNT`, BLOCKED, DEFERRED, FAILED, UNVERIFIED and SUCCESS counts. No Task may be counted twice in current Task-status categories. Derive state counts from verified Task/attempt records, not narrative or older Batch summaries.
- `REMAINING_GENERATION_ATTEMPTS` is derived from actual generation calls and permitted retry/policy constraints. A pre-call PAUSED event neither consumes nor resets the budget. Never use it to permit retry after receipt, UNKNOWN, exhausted failures, or safety restrictions.
- `BATCH_COMPLETED` requires all required Tasks to have valid terminal outcomes, `PAUSED_COUNT=0`, reconciled state/events/counters, and final Batch completion record written and readback-verified. UNKNOWN, received-but-unverified results, and unresolved required persistence prevent completion.

GitHub is the persistence database, not an independent observer of generation. A value does not become proven merely because the Producer writes it. The Producer must base records on directly observable execution facts and explicitly preserve unknowns. Historical records must not be silently rewritten; correct verified errors only through traceable correction events.
