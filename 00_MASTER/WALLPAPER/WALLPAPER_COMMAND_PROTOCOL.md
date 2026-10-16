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

CORE rules remain authoritative. Read any further required dependencies referenced by these files. If a required read or GitHub operation fails, stop the affected operation and report the actual failure; do not use memory, cache, guessed rules, or ordinary text-to-image fallback. A Task-local read/write/readback failure must not automatically stop or lock unrelated Tasks. Continue only if the next Task's own authoritative records and complete locked Prompt can be read directly from current GitHub data; stop the whole Batch only for a verified Batch-wide access/integrity problem that prevents safe continuation.

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
1. Read the complete assigned locked prompt from its authoritative file.
2. If and only if the complete prompt was successfully read, immediately submit that exact, unchanged prompt to the image-generation tool. Do not insert content validation, prompt display, extra analysis, prompt transformation, or unrelated operations between the successful read and generation call.
3. Determine only whether an image result was received and record observable facts: actual returned-file count, available result references, Task/attempt attribution, confirmed no-image reason, and GitHub persistence status.
4. Do not inspect the image, compare it with the prompt, assess prompt compliance, or perform QA.

The production command does not contain or supply a reference image and does not ask the user to upload one as part of the command. If a visual reference is separately supplied in the production conversation, apply only the active module's reference policy and the locked prompt. Do not invent, search across modules for, or silently substitute a reference. If no reference is supplied, follow the module policy's valid `NO_REFERENCE` behavior unless the applicable task rules explicitly require a reference; if a required reference is missing, record the applicable blocked state rather than guessing.

### Retry and task completion

- Any confirmed image receipt completes that Task for production, counts as exactly one completed Task, and must be recorded even if a later GitHub write fails. Record the actual number of returned image files separately. Do not retry a Task after image receipt.
- Retry only a confirmed no-image failure. Reuse the same unchanged locked prompt for the same Task; never edit the prompt to bypass a policy/safety block.
- Count the initial generation call as the first attempt. After three consecutive confirmed no-image generation failures in total for the same Task, terminate that Task, record the failure-limit exhaustion and reason, and do not start it again. Do not interpret the limit as three separate Tasks failing, and do not count GitHub read/write/readback, prompt-file access, metadata, or task-status errors as generation failures.
- Do not retry an unknown outcome. Preserve it as unresolved until evidence resolves it; do not falsely mark it successful or failed.
- A Task-local failure must not automatically block unrelated Tasks. Non-generation errors must be recorded as operation/Task-local errors and must not lock the next independent Task. Continue when that next Task's own authoritative prompt and required inputs are readable. Stop the whole Batch only for a verified Batch-wide issue that prevents safe Task identification, prompt assignment, or result attribution.
- Keep generation outcome and GitHub persistence outcome distinct. Recover failed record writes without regenerating an image already received.

Do not automatically launch QA. QA is separate from production. The Batch closes only after every required Task has a valid terminal outcome and the completion record has been written and verified.

## 6. Prohibited cross-module behavior

- Universal and Festival wallpaper share these command names, but not their specialized design data.
- Festival cultural/costume data must not leak into Universal Wallpaper.
- Universal-only options must not override Festival rules.
- LoRA dataset rules, LoRA references, archived legacy LoRA production rules, and LoRA QA must not be imported into either wallpaper module.
- Historical Session/Batch records are evidence and must not be silently rewritten or migrated.
