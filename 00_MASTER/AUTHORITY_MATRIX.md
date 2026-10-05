# AUTHORITY_MATRIX.md — Canonical Information Ownership

| Information | Authority |
|---|---|
| Platform architecture | 00_MASTER/SYSTEM_ARCHITECTURE.md |
| Production Dispatch | 00_MASTER/PRODUCTION_DISPATCH_PROTOCOL.md |
| Shared Production Worker Runtime | 00_MASTER/PRODUCTION_WORKER_RUNTIME.md |
| Production Output / Persistence | 00_MASTER/PRODUCTION_OUTPUT_PROTOCOL.md |
| Module registration/activation | 00_MASTER/MODULE_REGISTRY.md |
| Current runtime state | 00_MASTER/RUNTIME_STATE.md |
| Information ownership | 00_MASTER/AUTHORITY_MATRIX.md |
| Inaria character identity/specification | 00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md |
| Shared drawing/anatomy | 00_MASTER/DRAWING_INSTRUCTIONS.md + 00_MASTER/ANATOMY_STABILITY.md |
| Generation-result safety | 00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md |
| Wallpaper rules | 00_MASTER/WALLPAPER/ |
| Universal Wallpaper persistent batch/task records | MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/ + 00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_BATCH_RECORD_SPEC.md |
| Universal Wallpaper automated multi-image execution | 00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_AUTOMATED_BATCH_EXECUTION_SPEC.md |
| Festival cultural data | FESTIVAL_COSTUME_DATABASE/ |
| Festival Wallpaper execution protocol | 00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md |
| LoRA behavior | MODULES/LORA_PRODUCTION/MODULE.md |
| LoRA identity/reference | MODULES/LORA_PRODUCTION/IDENTITY/ |
| LoRA dataset rules | MODULES/LORA_PRODUCTION/DATASET/ |
| LoRA production rules | MODULES/LORA_PRODUCTION/PRODUCTION/ |
| LoRA production state | MODULES/LORA_PRODUCTION/BATCHES/ |
| LoRA batch state | MODULES/LORA_PRODUCTION/BATCHES/ |
| LoRA QA profile | MODULES/LORA_PRODUCTION/QA/ |
| QA platform behavior | 00_MASTER/QA_MODULE.md + 00_MASTER/QA_PROTOCOL.md |
| Image Delivery / downstream delivery | 00_MASTER/IMAGE_DELIVERY_MODULE.md |
| Cross-module boundaries | 00_MASTER/CROSS_MODULE_BOUNDARY_SPEC.md |

## Execution hierarchy
USER INTENT → RUNTIME_STATE → MODULE_REGISTRY → AUTHORITY_MATRIX → DISPATCH → SHARED WORKER RUNTIME → ACTIVE PRODUCTION MODULE → MODULE-OWNED STATE → RESULT / OUTPUT → QA

Lower layers cannot activate or override higher layers.

## Current-system-only
The current repository contains one operational specification set. Workers must not search for alternate project versions or superseded rules.

## Canonical ownership invariant
Every ACTIVE module must have an actual module-owned canonical state location when its protocol declares persistent state. Authority documents must never point to a path that does not exist.
