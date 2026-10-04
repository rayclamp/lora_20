# SYSTEM_ARCHITECTURE.md — INARIA AI STUDIO

## Architecture
CORE → DISPATCH → SHARED WORKER RUNTIME → PRODUCTION MODULE → MODULE-OWNED DATA / STATE → OUTPUT / GENERATION → QA / DOWNSTREAM

GitHub is the current system specification. Superseded project specifications are not part of the current architecture.

## Authority hierarchy
USER INTENT
→ RUNTIME_STATE
→ MODULE_REGISTRY
→ AUTHORITY_MATRIX
→ DISPATCH
→ SHARED WORKER RUNTIME
→ SELECTED PRODUCTION MODULE
→ MODULE-OWNED GOAL / BATCH / QUEUE / TASK
→ GENERATION RESULT
→ OUTPUT / QA / DOWNSTREAM

A lower layer cannot activate or override a higher layer.

## CORE boundary
CORE contains only cross-system rules:
- anatomy stability;
- drawing stability;
- generation-result safety;
- common Worker safety;
- common state-integrity principles.

CORE must not define a universal character age, universal Master Image, LoRA dataset policy, festival cultural data, wallpaper-specific workflow, or account-specific authority.

## Production Core
The repository has one shared production execution core. Manual and Automated Dispatch are entry modes into the same Worker Runtime.

The Worker Runtime owns Worker lifecycle, task selection, Claim/Lease/CAS, generation outcomes, recovery, and common result recording. Production modules do not create duplicate Worker or Dispatch systems.

`PRODUCTION_DISPATCH_PROTOCOL.md` defines who starts production. `PRODUCTION_WORKER_RUNTIME.md` defines how production work executes. `PRODUCTION_OUTPUT_PROTOCOL.md` defines artifact persistence.

## Modules
UNIVERSAL_WALLPAPER — general anime/realistic wallpaper. ACTIVE and owns persistent batch/task state under MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/.
FESTIVAL_WALLPAPER — festival anime/realistic wallpaper. ACTIVE and uses the canonical execution protocol under 00_MASTER/WALLPAPER/.
LORA_PRODUCTION — age-20 Inaria LoRA dataset production profile. PAUSED. It owns LoRA-specific identity, dataset, diversity, QA, and output requirements; it uses the shared Production Worker Runtime.
QA — independent downstream inspection. PAUSED.
IMAGE_DELIVERY — independent downstream delivery. PAUSED.

## Module-state ownership
Universal Wallpaper persistent production state belongs only to:
MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/

LoRA persistent batch state belongs only to:
MODULES/LORA_PRODUCTION/BATCHES/

A module protocol may reference shared CORE rules and approved cultural/reference data, but it may not silently create a second operational state authority elsewhere.

## LoRA boundary
All LoRA-specific identity, reference, dataset, diversity, production requirements, batch state, and QA profile live under MODULES/LORA_PRODUCTION/. Generic Worker execution, Dispatch, Claim/Lease/CAS, and artifact-persistence mechanics are shared core capabilities.

LoRA must never route through Wallpaper production state.

## Reference isolation
Every module owns its own reference policy. A module may not silently substitute another module's reference.

## Current-system-only
Do not preserve alternate operational specifications inside the current tree. If a rule remains useful, encode it once under its current canonical owner.

## Recovery
START_HERE → SYSTEM_ARCHITECTURE → MODULE_REGISTRY → RUNTIME_STATE → AUTHORITY_MATRIX → SELECTED MODULE → MODULE STATE

Never reconstruct current state from previous conversations.


## Automation and scene-resolution hardening

Automated Dispatch is governed by 00_MASTER/AUTOMATION_EXECUTION_CONTRACT.md. Canonical production rule paths are governed by 00_MASTER/CANONICAL_PATH_REGISTRY.md.

A Theme is not an executable Scene Intent. Before DESIGN_LOCK, production tasks must pass 00_MASTER/WALLPAPER/SCENE_INTENT_RESOLUTION_PROTOCOL.md and record the provenance of resolved scene fields.

Automation, manual execution, and future integrations converge on the same Shared Worker Runtime. Legacy departmental automation is non-authoritative until migrated under the current contract.
