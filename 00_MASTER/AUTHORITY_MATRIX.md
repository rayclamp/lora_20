# AUTHORITY_MATRIX.md — Canonical Information Ownership

| Information | Authority |
|---|---|
| Platform architecture | 00_MASTER/SYSTEM_ARCHITECTURE.md |
| Module registration/activation | 00_MASTER/MODULE_REGISTRY.md |
| Current runtime state | 00_MASTER/RUNTIME_STATE.md |
| Information ownership | 00_MASTER/AUTHORITY_MATRIX.md |
| Shared drawing/anatomy | 00_MASTER/DRAWING_INSTRUCTIONS.md + 00_MASTER/ANATOMY_STABILITY.md |
| Generation-result safety | 00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md |
| Wallpaper rules | 00_MASTER/WALLPAPER/ |\n| Universal Wallpaper persistent batch/task records | MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/ + 00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_BATCH_RECORD_SPEC.md |
| Festival cultural data | FESTIVAL_COSTUME_DATABASE/ |
| LoRA behavior | MODULES/LORA_PRODUCTION/MODULE.md |
| LoRA identity/reference | MODULES/LORA_PRODUCTION/IDENTITY/ |
| LoRA dataset rules | MODULES/LORA_PRODUCTION/DATASET/ |
| LoRA production state | MODULES/LORA_PRODUCTION/PRODUCTION/ |
| LoRA QA profile | MODULES/LORA_PRODUCTION/QA/ |
| QA platform behavior | 00_MASTER/QA_MODULE.md + 00_MASTER/QA_PROTOCOL.md |
| Image Delivery | 00_MASTER/IMAGE_DELIVERY_MODULE.md |
| Cross-module boundaries | 00_MASTER/CROSS_MODULE_BOUNDARY_SPEC.md |

## Execution hierarchy
USER INTENT → RUNTIME_STATE → MODULE_REGISTRY → AUTHORITY_MATRIX → ACTIVE MODULE PROTOCOL → MODULE-OWNED STATE → WORKER

Lower layers cannot activate or override higher layers.

## Current-system-only
The current repository contains one operational specification set. Workers must not search for alternate project versions or superseded rules.
