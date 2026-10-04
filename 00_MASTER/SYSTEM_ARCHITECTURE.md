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
The repository has one shared production execution core. Manual Dispatch and System Automation are entry modes into the same Worker Runtime.

The Worker Runtime owns Worker lifecycle, task selection, Claim/Lease/CAS, generation outcomes, recovery, and common result recording. Production modules do not create duplicate Worker or Dispatch systems.

System Automation is an internal Wallpaper Production capability. Its automated module scope is limited to UNIVERSAL_WALLPAPER and FESTIVAL_WALLPAPER. It must be defined and validated independently of external integrations.

External tools or services are integration adapters only and must never become the source of production authority, task semantics, Worker execution rules, or Wallpaper Automation module scope.

The shared Worker Runtime may be used by other production domains, but that does not grant System Automation authority over those domains.

`PRODUCTION_DISPATCH_PROTOCOL.md` defines who starts production. `PRODUCTION_WORKER_RUNTIME.md` defines how production work executes. `PRODUCTION_OUTPUT_PROTOCOL.md` defines artifact persistence.

## Modules
UNIVERSAL_WALLPAPER — general anime/realistic wallpaper. ACTIVE and owns persistent batch/task state under MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/.
FESTIVAL_WALLPAPER — festival anime/realistic wallpaper. ACTIVE and owns its module-level reference policy under MODULES/FESTIVAL_WALLPAPER/.
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

Every production module owns its own Reference Policy.

The selected module's Reference Policy is the sole authority for allowed visual person-reference sources for that module.

A Character Specification provides semantic/context authority unless a production module explicitly defines a different role. It does not become a visual reference merely because the same character name appears in the task.

A module may not silently substitute another module's reference.

## Current-system-only
Do not preserve alternate operational specifications inside the current tree. If a rule remains useful, encode it once under its current canonical owner.

## Recovery
START_HERE → SYSTEM_ARCHITECTURE → MODULE_REGISTRY → RUNTIME_STATE → AUTHORITY_MATRIX → SELECTED MODULE → MODULE STATE

Never reconstruct current state from previous conversations.

## Automation and scene-resolution hardening

System Automation and Automated Dispatch are governed by `00_MASTER/AUTOMATION_EXECUTION_CONTRACT.md`. Canonical production rule paths are governed by `00_MASTER/CANONICAL_PATH_REGISTRY.md`.

A Theme is not an executable Scene Intent. Before DESIGN_LOCK, production tasks must pass `00_MASTER/WALLPAPER/SCENE_INTENT_RESOLUTION_PROTOCOL.md` and record the provenance of resolved scene fields.

Before reference resolution, Automation must load the selected Wallpaper Module's canonical Reference Policy. Manual execution and System Automation converge on the same Shared Worker Runtime after module and reference-policy resolution.

Manual execution and System Automation converge on the same Shared Worker Runtime. External automation integrations are downstream adapters to System Automation and are not part of the core execution architecture. Legacy departmental automation is non-authoritative until migrated under the current contract.
