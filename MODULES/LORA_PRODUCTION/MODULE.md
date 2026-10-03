# LORA_PRODUCTION — Module Specification

## Status
PAUSED.

This module is not executable until explicitly activated in both MODULE_REGISTRY.md and RUNTIME_STATE.md.

## Purpose
Build a high-quality age-20 Inaria LoRA training dataset.

## Module-owned rules
LoRA owns:
- age-20 identity and reference;
- LoRA style/reference baseline;
- dataset composition and diversity;
- candidate rules;
- Goal/Batch/Queue/Task state;
- retry/recovery;
- LoRA QA acceptance.

## Required read order when activated
CORE → this file → IDENTITY → DATASET → PRODUCTION → QA → current Batch/Queue/Task state

## Reference policy
An approved age-20 reference asset must be explicitly registered inside this module before activation.

Do not silently use a Wallpaper reference.

## Current state
No Goal is active.
No Batch is active.
No Queue is executable.
No Task is executable.

## Isolation
Do not import Wallpaper workflow, Festival cultural rules, account-specific authority, or superseded project specifications.
