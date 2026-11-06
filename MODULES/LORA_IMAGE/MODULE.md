# LORA_IMAGE — LoRA Training-Image Design Module

## Purpose

Define the image-design scope for producing candidate images intended for LoRA training. This is a design/reference module alongside UNIVERSAL_WALLPAPER and FESTIVAL_WALLPAPER.

## Scope

This module contains only LoRA image-design rules and the reference policies required to apply them. It is not the legacy LoRA production system and does not define Make scenarios, multi-account Worker dispatch, queues, quota management, or a separate runtime.

## English-only future content policy — effective 2026-11-07

This policy applies only to the active `LORA_IMAGE` workflow and only to content newly authored or appended on or after 2026-11-07 (Taiwan time).

1. **Design prompts in English from the outset.** Every new LoRA Task's complete locked prompt, section titles, scene and outfit descriptions, negative constraints, output instructions, and human-readable prompt metadata must be written in English. Translate Chinese-language user requirements faithfully into English **during prompt design**, before persistence and locking; do not create a Chinese canonical prompt and then plan to translate it during production.
2. **Write all new GitHub production-record text in English.** This covers new `SESSION_CONTRACT.md`, `BATCH_RECORD.md`, `TASK_QUEUE.md`, `PROMPT_SET.md`, `EXECUTION_LOG.md`, `PROMPTS/TASK_###.md`, and any subsequently created `EXECUTION_INPUTS/` and `RECOVERY_CHECKPOINTS/` files. All free-text fields, notes, checkpoint descriptions, topics, events, reasons, audit narratives, and newly appended text in existing records must be in English. Git commit messages for these writes should also be in English.
3. **Do not change schema identifiers.** Preserve canonical paths, filenames, field keys, enum values, prompt markers, IDs, timestamps, and required formats. The language requirement concerns human-readable text, not machine-readable identifiers or the language of ChatGPT's conversation with the user. Proper names are rendered in their established English forms.
4. **Enforce before locking a new Prompt Set.** The Console must verify that the new Batch's full prompt bodies, human-readable metadata, descriptive record fields, and initial event entries are in English, then persist and read back the files before locking. This design-time language check does not authorize producer-side prompt inspection or QA.
5. **Protect existing records and locked prompts.** Never retroactively translate or rewrite historical records, existing Session/Batch identities, or locked prompt bodies. When continuing an older Batch with Chinese-language prompts, follow its existing locked prompt and the current Producer handoff contract exactly; do not translate it, create replacement prompts, or switch its execution-input mode merely because of this policy. Any **new** event, error narrative, or recovery note appended to an older Batch must nevertheless be in English.
6. **Do not alter execution semantics.** Keep one Task per generation call, the existing FULL_LOCKED_PROMPT-first rule, the narrowly authorized condensation exception, reference-image requirements, evidence preservation, GitHub write/readback verification, and independent paused QA intact. English-only authoring does not claim guaranteed image generation or exact prompt delivery.

## Producer roles and reference-image timing

LORA_IMAGE has two distinct stages. Do not transfer requirements from one stage to the other.

- **Prompt designer / `/LORA_CONSOLE`:** designs and locks the Batch prompts and writes the required GitHub records. It does not generate images and does not need, request, or wait for a person-reference image. Its only required user input is the requested image count, unless the active launch instruction explicitly defines otherwise.
- **Image producer / `/LORA_PRODUCE`:** executes the already-locked prompts for the explicitly specified Module, Session, and Batch. The user must provide the person-reference image in the producer's current ChatGPT conversation before generation begins. The producer applies that image as the visual identity reference when calling the image-generation tool.

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
- `00_MASTER/GENERATION_WORKER_PROTOCOL.md`;
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

For `LORA_IMAGE`, output format is randomly selected independently for each Task: `PHONE_9_16` (portrait 9:16) or `DESKTOP_16_9` (landscape 16:9). A Batch may mix both formats; no fixed quota or 50/50 split is required. Record the choice as `TASK_OUTPUT_TYPE` and ensure the locked prompt is designed for the same format. The module-specific Batch contract exception and record fields are defined in `00_MASTER/PRODUCTION_RECORD_SCHEMA.md`. Do not add separate `ASPECT_RATIO` or `ORIENTATION` controls.
