# LORA_IMAGE — LoRA Training-Image Design Module

## Purpose

Define the image-design scope for producing candidate images intended for LoRA training. This is a design/reference module alongside UNIVERSAL_WALLPAPER and FESTIVAL_WALLPAPER.

## Scope

This module contains only LoRA image-design rules and the reference policies required to apply them. It is not the legacy LoRA production system and does not define Make scenarios, multi-account Worker dispatch, queues, quota management, or a separate runtime.

## Identity source

The user supplies the reference person image directly in the current ChatGPT conversation for each production request. That uploaded image is the visual identity authority for that request. No permanent GitHub-stored character reference is required.

The startup option `CHARACTER` determines whether Inaria's shared CORE character information may be used:
- `INARIA`: use shared CORE character information for contextual/semantic guidance; do not use it to override the uploaded image's visual identity.
- `NONE`: do not apply Inaria-specific character information; follow the uploaded reference and current task instructions.

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

When `CHARACTER=INARIA`, also load `00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md` for contextual/semantic guidance only, subject to the uploaded-reference authority above.

CORE hard rules cannot be weakened by this module. Do not copy shared CORE rules into LoRA files merely to duplicate them; LoRA files add only dataset-specific design constraints.

## Legacy isolation

The previous `LORA_PRODUCTION` module is preserved under `ARCHIVE/LEGACY_LORA_PRODUCTION/` for historical reference only. Do not load archived files as active LORA_IMAGE rules.

## Active LoRA design rules

The dataset design, diversity, and candidate-design requirements are maintained in the three files listed under Required design references. These files contain the applicable general rules distilled from the archived legacy dataset documents, with fixed-person/age assumptions removed.

The archived directory remains historical reference only. It must not be loaded as an active rule source.
