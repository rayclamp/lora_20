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

## Shared dependencies

Load applicable shared CORE rules and the documents in this module. Do not copy shared CORE rules into this module merely to duplicate them.

## Legacy isolation

The previous `LORA_PRODUCTION` module is preserved under `ARCHIVE/LEGACY_LORA_PRODUCTION/` for historical reference only. Do not load archived files as active LORA_IMAGE rules.

## Data status

This is the initial module scaffold. Detailed LoRA dataset/design rules will be reviewed and organized in a later step; do not infer missing detailed rules from the archived module.
