# LORA_IMAGE — LoRA Training-Image Design Module

## Purpose

Define the image-design scope for producing candidate images intended for LoRA training. This is a design/reference module alongside UNIVERSAL_WALLPAPER and FESTIVAL_WALLPAPER.

## Scope

This module contains only LoRA image-design rules and the reference policies required to apply them. It is not the legacy LoRA production system and does not define Make scenarios, multi-account Worker dispatch, queues, quota management, or a separate runtime.

## V5.0 prompt-only Session design — current authority

For NEW `/LORA_CONSOLE` requests, follow the complete canonical command `00_MASTER/LORA/LORA_CONSOLE_COMMAND.md` V5.0. Immediately begin after valid `IMAGE_COUNT`; no extra approval or reference image is needed. A new actual Taiwan-time `SE-YYYYMMDD-HHMMSS` Session contains `INDEX.md` and exactly `IMAGE_COUNT` independent English-only `TASK_NNN.txt` prompt bodies under `PROMPTS/LORA_IMAGE/<SESSION_ID>/`. Each Task independently randomly selects portrait 9:16 or landscape 16:9, without a fixed ratio; `TASK_OUTPUT_TYPE`, topic and filename belong in `INDEX.md`, not in Task text. Task files contain complete standalone natural-language instructions only, with no headers, metadata, delimiters, lock markers or production fields. Plan genuine LoRA variation, preserve conditional reference-image identity, forbid all animals/pets, follow CORE anatomy and safety, compare all full file text after GitHub readback, and show all complete prompts to the user. No Batch, producer, handoff, generation, lock, execution log, queue or QA. The user later copies prompts manually and supplies the identity image in the generation chat.

Existing historical LoRA Batches, locked prompts, producer rules and records remain unchanged. `/LORA_PRODUCE` is for those expressly authorized historical Batches only and cannot consume V5.0 archives. Wallpaper module workflows are unaffected.

## English-only authoring — effective 2026-11-07

1. Author newly designed LoRA Task prompt bodies in English from the outset, faithfully reflecting Chinese user requests. Newly added topic names, descriptive INDEX text, and Git commit messages also use English. Chat conversation language need not change, but delivered prompt body text must match the stored English verbatim.
2. For new V5.0 Session archives, `INDEX.md` and the dedicated plain-text `TASK_NNN.txt` files are the only required files. Do not create `SESSION_CONTRACT.md`, `BATCH_RECORD.md`, `TASK_QUEUE.md`, `PROMPT_SET.md`, `EXECUTION_LOG.md`, lock markers, IDs/versions/statuses, execution evidence, or any Batch state.
3. Preserve all historical schemas and canonical identifiers for existing legacy Batches; do not rewrite, translate, delete, move or unlock older records, prompts or execution evidence. Any new textual event/recovery note appended to a historical LoRA Batch remains English.
4. For V5.0, verify English content and every complete prompt/INDEX mapping before saving and after full GitHub readback. This is archive verification, not locking. Preserve `MIXED_PER_TASK`, exact per-Task format enums and canonical timestamp/Task naming. No extra `ASPECT_RATIO` or `ORIENTATION` user settings.
5. This content policy does not guarantee exact generated pixels, generation submission fidelity or image acceptance. Independent QA remains separate and not automatically activated.

## Producer roles and reference-image timing

LORA_IMAGE has two distinct stages. Do not transfer requirements from one stage to the other.

- **Prompt designer / `/LORA_CONSOLE V5.0`:** designs and archives complete plain-text prompts with one INDEX; it does not lock, create Batches, generate or require a person-reference image.
- **User-managed V5.0 generation:** the user independently copies a Task prompt into a separate generation chat and supplies the reference person image there; GitHub does not operate that generator.
- **Legacy `/LORA_PRODUCE` only:** executes expressly authorized pre-existing locked Session/Batches, never new V5.0 archives; the user supplies a person image in that legacy producer chat.

The prompt designer may write identity-preservation instructions that refer generically to the reference image that will be supplied at production time. The designer must not block prompt design because that image has not yet been uploaded.

## Identity source

The user supplies the reference person image directly in the current producer ChatGPT conversation for each production run. That uploaded image is the visual identity authority for that run. No permanent GitHub-stored character reference is required.

The startup option `CHARACTER` determines whether Inaria's shared CORE character information may be used:
- `INARIA`: use shared CORE character information for contextual/semantic guidance; do not use it to override the uploaded image's visual identity.
- `NONE`: do not apply Inaria-specific character information; the production-time uploaded image is the visual identity authority.

This module has no fixed target person or target age. The requested person may change between runs.

## Required design references

Load and apply:
- `00_MASTER/CORE_RULES.md`;
- `00_MASTER/DRAWING_INSTRUCTIONS.md`;
- `00_MASTER/ANATOMY_STABILITY.md`;
- `00_MASTER/GENERATION_RULES.md`;
- `00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md`;
- `MODULES/LORA_IMAGE/REFERENCE_POLICY.md`;
- `MODULES/LORA_IMAGE/DATASET_DESIGN_SPEC.md`;
- `MODULES/LORA_IMAGE/DATASET_DIVERSITY.md`;
- `MODULES/LORA_IMAGE/CANDIDATE_DESIGN_RULES.md`.

When `CHARACTER=INARIA`, also load `00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md` for contextual/semantic guidance only, subject to the production-time uploaded-reference authority above.

CORE hard rules cannot be weakened by this module. Do not copy shared CORE rules into LoRA files merely to duplicate them; LoRA files add only dataset-specific design constraints.

## Legacy isolation

The previous `LORA_PRODUCTION` module is preserved under `ARCHIVE/LEGACY_LORA_PRODUCTION/` for historical reference only. Do not load archived files as active LORA_IMAGE rules.

The archived directory remains historical reference only. It must not be loaded as an active rule source.

## Per-Task output format

For new V5.0 LORA_IMAGE Sessions, randomly select `PHONE_9_16` or `DESKTOP_16_9` independently per Task without fixed quota, record `TASK_OUTPUT_TYPE` in `INDEX.md` only, and naturally describe the intended aspect and composition in the corresponding `TASK_NNN.txt`. The Batch schema in `00_MASTER/PRODUCTION_RECORD_SCHEMA.md` remains applicable only to historical Batches. Do not add separate `ASPECT_RATIO` or `ORIENTATION` controls.
