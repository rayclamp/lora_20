# MASTER_SPEC.md — Inaria AI Studio Modular Master Specification

- Authority: Project-wide source of truth
- Version: v008
- Last Updated: 2026-10-02
- Project: rayclamp/lora_20

## 1. Purpose

This repository is a modular image-production platform.

It provides:
- shared CORE rules used by every system;
- independent production modules;
- module-owned tasks, queues, state, references, and integrations;
- optional downstream Image Delivery and QA modules.

The repository originally served the age-20 Inaria LoRA project. That LoRA workflow is now an independent module rather than the definition of the entire platform.

## 2. Architecture principle

The highest-level rule is:

> CORE is shared. Modules are independent. Execution is module-specific.

A module must load CORE rules but must not inherit another module's workflow unless an explicit integration dependency is declared.

New systems are added as new modules.

## 3. Source-of-truth hierarchy

1. Explicit user instruction for the current task.
2. `00_MASTER/MODULE_REGISTRY.md`
3. `00_MASTER/CORE_RULES.md`
4. Applicable module protocol.
5. Applicable module task/queue/state.
6. Applicable reference assets.
7. Temporary implementation details.

Historical chat content and obsolete documents never override current rules.

## 4. CORE rules

The shared CORE layer includes:
- drawing stability;
- anatomy stability;
- generation safety;
- common Worker safety;
- state-integrity principles;
- separation of generation from downstream QA.

Primary CORE documents:
- `00_MASTER/CORE_RULES.md`
- `00_MASTER/DRAWING_INSTRUCTIONS.md`
- `00_MASTER/ANATOMY_STABILITY.md`
- `00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md`
- `00_MASTER/GENERATION_RULES.md`
- `00_MASTER/GENERATION_WORKER_PROTOCOL.md`

CORE does not define:
- a universal character;
- a universal MASTER_IMAGE;
- a specific wallpaper workflow;
- a LoRA workflow;
- an upload destination;
- QA acceptance criteria.

## 5. Module registry

`00_MASTER/MODULE_REGISTRY.md` is authoritative for module status.

Current status:
- UNIVERSAL_WALLPAPER = ACTIVE
- LORA_PRODUCTION = PAUSED
- IMAGE_DELIVERY = PAUSED
- QA = PAUSED

Only ACTIVE modules may execute.

PAUSED means preserved but not executable. Paused module data and documents must not be deleted solely because they are inactive.

## 6. Universal Wallpaper module

Protocol:

`00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md`

This module:
- is account-independent;
- routes each request to ANIME_WALLPAPER or REALISTIC_WALLPAPER;
- uses the current user-uploaded reference image as the primary visual reference for the batch;
- creates runtime Worker identity;
- owns its task workflow;
- does not depend on the LoRA module.

Wallpaper type rules:
- ANIME_WALLPAPER → 00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md
- REALISTIC_WALLPAPER → 00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md

The user's explicit wallpaper-type instruction determines which rule set is active.
The current user-supplied reference image determines the visual identity/reference for that batch.
This is the current active production system.

## 7. LoRA Production module

Protocol:

`00_MASTER/LORA_PRODUCTION_PROTOCOL.md`

This module is currently PAUSED.

It owns:
- age-20 Inaria LoRA production;
- T109 and future LoRA Goals;
- LoRA-specific queues;
- age-20 reference policy;
- character/style identity rules;
- dataset diversity and contamination controls;
- future Make/OpenAI execution.

The existing T109 Goal and queue remain preserved.

T109 is not the current platform-wide active Goal.

When activated, the LoRA executor loads CORE plus the LoRA module rules. It does not inherit Universal Wallpaper's runtime-reference policy.

## 8. Image Delivery module

Protocol:

`00_MASTER/IMAGE_DELIVERY_MODULE.md`

This module is currently PAUSED.

It owns downstream image upload, transfer, storage, or delivery operations.

It is not part of image generation and is not required for a generation module to exist.

Existing delivery implementation and historical state remain preserved.

## 9. QA module

Protocol:

`00_MASTER/QA_MODULE.md`

This module is currently PAUSED.

It owns downstream visual and dataset quality evaluation.

Production success and QA acceptance are independent facts.

Existing QA rules, adapters, reports, and historical state remain preserved.

## 10. Generation stability

Every active generation module must apply:
- `DRAWING_INSTRUCTIONS.md`
- `ANATOMY_STABILITY.md`
- `IMAGE_GENERATION_SAFETY_SPEC.md`

before generation.

The drawing rules prioritize:
1. stable hand action;
2. fingers/toes and limb-source clarity;
3. body ergonomics and support;
4. hand/object and wearable connections;
5. lower-body stability;
6. background/effect clearance;
7. decorative complexity.

FULL-BODY does not mean distant shot.

These are generation constraints, not post-generation QA.

## 11. Generation / QA boundary

Generation modules:
TASK → DESIGN → PROMPT → GENERATE → GENERATION RESULT

QA module:
GENERATION RESULT → INSPECT → module-specific QA state

A successful generation is not automatically a QA PASS.

A generation Worker must not self-QA, reject, repair, or regenerate solely because of perceived visual defects.

## 12. Reference boundary

Reference policy belongs to the module.

Examples:
- Universal Wallpaper: current user-uploaded reference.
- LoRA: approved age-20 LoRA reference.
- Future modules: their own declared reference mechanism.

No module may silently replace another module's reference policy.

## 13. Data and state ownership

Each module owns its:
- task model;
- queue;
- runtime Worker state;
- logs;
- references;
- module-specific outputs.

Shared CORE rules remain in `00_MASTER/`.

Cross-module transfer must be explicit.

## 14. Future module integration

A new module must define:
- module name and status;
- protocol;
- input contract;
- output contract;
- state model;
- executor/integration;
- dependencies;
- CORE rules used.

It must be possible to activate the new module without redesigning unrelated modules.

## 15. Change control

Permanent shared-rule changes belong in the applicable CORE document and must be recorded in `00_MASTER/CHANGELOG.md`.

Module-specific changes belong in that module's protocol or state documents.

Do not move a module-specific rule into CORE merely for convenience.

## 16. Historical project preservation

The age-20 Inaria LoRA project remains fully preserved as the `LORA_PRODUCTION` module.

Its MASTER_IMAGE, T109 Goal, queues, handoffs, dataset rules, historical production records, and existing QA/delivery architecture are not deleted by this modularization.

The change is architectural isolation, not project deletion.
