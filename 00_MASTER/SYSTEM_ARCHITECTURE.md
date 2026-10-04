# SYSTEM_ARCHITECTURE.md — INARIA AI STUDIO

## Architecture
CORE → MODULE → MODULE-OWNED DATA / STATE → GENERATION → QA / DOWNSTREAM

GitHub is the current system specification. Superseded project specifications are not part of the current architecture.

## Authority hierarchy
USER INTENT
→ RUNTIME_STATE
→ MODULE_REGISTRY
→ AUTHORITY_MATRIX
→ SELECTED MODULE PROTOCOL
→ MODULE-OWNED GOAL / BATCH / QUEUE / TASK
→ WORKER
→ GENERATION RESULT
→ QA / DOWNSTREAM

A lower layer cannot activate or override a higher layer.

## CORE boundary
CORE contains only cross-system rules:
- anatomy stability;
- drawing stability;
- generation-result safety;
- common Worker safety;
- common state-integrity principles.

CORE must not define a universal character age, universal Master Image, LoRA dataset policy, festival cultural data, wallpaper-specific workflow, or account-specific authority.

## Modules
UNIVERSAL_WALLPAPER — general anime/realistic wallpaper. ACTIVE and owns persistent batch/task state under MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/.
FESTIVAL_WALLPAPER — festival anime/realistic wallpaper. ACTIVE and uses the canonical execution protocol under 00_MASTER/WALLPAPER/.
LORA_PRODUCTION — independent age-20 Inaria LoRA dataset production. PAUSED.
QA — independent downstream inspection. PAUSED.
IMAGE_DELIVERY — independent downstream delivery. PAUSED.

## Module-state ownership
Universal Wallpaper persistent production state belongs only to:
MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/

LoRA persistent batch state belongs only to:
MODULES/LORA_PRODUCTION/BATCHES/

A module protocol may reference shared CORE rules and approved cultural/reference data, but it may not silently create a second operational state authority elsewhere.

## LoRA boundary
All LoRA-specific identity, reference, dataset, diversity, production, batch, queue, retry, and QA rules live under MODULES/LORA_PRODUCTION/.

LoRA must never route through Wallpaper production state.

## Reference isolation
Every module owns its own reference policy. A module may not silently substitute another module's reference.

## Current-system-only
Do not preserve alternate operational specifications inside the current tree. If a rule remains useful, encode it once under its current canonical owner.

## Recovery
START_HERE → SYSTEM_ARCHITECTURE → MODULE_REGISTRY → RUNTIME_STATE → AUTHORITY_MATRIX → SELECTED MODULE → MODULE STATE

Never reconstruct current state from previous conversations.
