# START_HERE.md — INARIA AI STUDIO

## Canonical startup
CORE → MODULE → MODULE-OWNED DATA / STATE

Read:
1. 00_MASTER/SYSTEM_ARCHITECTURE.md
2. 00_MASTER/MODULE_REGISTRY.md
3. 00_MASTER/RUNTIME_STATE.md
4. 00_MASTER/AUTHORITY_MATRIX.md
5. 00_MASTER/CORE_RULES.md
6. 00_MASTER/DRAWING_INSTRUCTIONS.md
7. 00_MASTER/ANATOMY_STABILITY.md
8. 00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md
9. selected module protocol
10. selected module state

GitHub is the current source of truth. Conversation memory is not an execution authority.

## Architecture enforcement
Run `scripts/validate_architecture.mjs` after architecture or authority changes. A passing result is required before treating the repository as structurally consistent.

## Current state
UNIVERSAL_WALLPAPER = ACTIVE
FESTIVAL_WALLPAPER = ACTIVE
LORA_PRODUCTION = PAUSED
QA = PAUSED
IMAGE_DELIVERY = PAUSED

A PAUSED module is not executable.

## Current-system-only rule
This repository intentionally contains only the current operational specification. Do not search for old project versions, old queues, old prompts, old account profiles, or superseded LoRA rules.

If a useful lesson has become a current rule, use the current rule only. If a required rule is missing, update its current canonical owner before execution.

## Module routing
Universal Wallpaper → 00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md + 00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_PRODUCTION_SESSION.md
Festival Wallpaper → 00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md + FESTIVAL_COSTUME_DATABASE/
LoRA → MODULES/LORA_PRODUCTION/
QA → 00_MASTER/QA_MODULE.md + 00_MASTER/QA_PROTOCOL.md

## Worker safety
Never generate without valid task ownership when a queue is used. Apply CORE anatomy/drawing rules before generation. Generation SUCCESS is not QA PASS. Do not self-QA. Do not guess UNKNOWN state. Stop on execution-critical conflicts.
