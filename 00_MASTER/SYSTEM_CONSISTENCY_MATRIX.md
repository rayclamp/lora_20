# SYSTEM_CONSISTENCY_MATRIX.md — Current Architecture Contract

## Required invariants
- Runtime State is the canonical current state.
- Module Registry matches Runtime State.
- No platform-wide Goal is required.
- User intent cannot activate a paused module.
- Universal Wallpaper does not depend on LoRA.
- Festival Wallpaper does not inherit LoRA rules.
- LoRA owns identity, dataset, production, and QA rules.
- QA is downstream and independent.

## Current-system-only invariant
The current tree must contain no old T109/T108 task state, account-number Worker authority, root-level legacy LoRA production engine, old handoff pipeline, deprecated Master Image authority, or duplicate LoRA rules in CORE.

## LoRA activation invariant
When LoRA is ACTIVE:
RUNTIME_STATE → MODULE_REGISTRY → MODULE.md → PRODUCTION/GOAL.md → current Batch/Queue/Task.

When LoRA is PAUSED:
no LoRA task is executable.

## Architecture enforcement invariant
Cross-file execution contracts are mechanically validated by `scripts/validate_architecture.mjs`. Registry, Runtime, Authority Matrix, module contracts, activation guards, QA boundaries, Worker safeguards, and legacy exclusions must remain validator-clean.

## Current state
UNIVERSAL_WALLPAPER = ACTIVE
FESTIVAL_WALLPAPER = ACTIVE
LORA_PRODUCTION = PAUSED
QA = PAUSED
IMAGE_DELIVERY = PAUSED
Active workflow = FESTIVAL_WALLPAPER / MANUAL_DESIGN
Current platform Goal = NONE

## Single-rule principle
If a rule remains useful, encode it once under its current canonical owner. Do not solve conflicts by preserving multiple versions.
