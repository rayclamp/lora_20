# MASTER_SPEC.md — Inaria AI Studio Modular Master Specification

- Authority: Project-wide source of truth
- Version: v008
- Last Updated: 2026-10-03
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

## 3. Source-of-truth and authority model

The system separates **USER INTENT** from **SYSTEM CONSTRAINTS**.

User intent defines what the user wants, for example:
- wallpaper type;
- quantity;
- aspect ratio;
- theme;
- festival;
- scene;
- reference image;
- requested workflow.

System constraints define what is allowed and how execution proceeds:
- CORE rules;
- module rules;
- runtime/module activation state;
- safety rules;
- database constraints;
- task integrity;
- applicable task/design/queue state.

Canonical ownership is defined by `00_MASTER/AUTHORITY_MATRIX.md`.

For current runtime state:
- `00_MASTER/RUNTIME_STATE.md` is authoritative.

For module activation:
- `00_MASTER/MODULE_REGISTRY.md` is authoritative.

For architecture:
- `00_MASTER/SYSTEM_ARCHITECTURE.md` is authoritative.

Conversation memory and historical documents never override current GitHub state.

Resolution flow:

```
USER INTENT
    ↓
RULE / STATE RESOLUTION
    ├── CORE
    ├── MODULE
    ├── DATABASE
    ├── SAFETY
    └── TASK INTEGRITY
    ↓
DESIGN
    ↓
WORKER
    ↓
OUTPUT
    ↓
QA
```

An explicit user request does not silently activate a PAUSED module.

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

`00_MASTER/MODULE_REGISTRY.md` is authoritative for module registration and module activation status.

Current module status:
- UNIVERSAL_WALLPAPER = ACTIVE
- FESTIVAL_WALLPAPER = ACTIVE
- LORA_PRODUCTION = PAUSED
- IMAGE_DELIVERY = PAUSED
- QA = PAUSED

`00_MASTER/RUNTIME_STATE.md` is authoritative for which active workflow is currently executing.

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
This module is available for execution when selected by current runtime state.

## 8. LoRA Production module

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

## 9. Image Delivery module

Protocol:

`00_MASTER/IMAGE_DELIVERY_MODULE.md`

This module is currently PAUSED.

It owns downstream image upload, transfer, storage, or delivery operations.

It is not part of image generation and is not required for a generation module to exist.

Existing delivery implementation and historical state remain preserved.

## 10. QA module

Protocol:

`00_MASTER/QA_MODULE.md`

This module is currently PAUSED.

It owns downstream visual and dataset quality evaluation.

Production success and QA acceptance are independent facts.

Existing QA rules, adapters, reports, and historical state remain preserved.

## 11. Generation stability

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

## 12. Generation / QA boundary

Generation modules:
TASK → DESIGN → PROMPT → GENERATE → GENERATION RESULT

QA module:
GENERATION RESULT → INSPECT → module-specific QA state

A successful generation is not automatically a QA PASS.

A generation Worker must not self-QA, reject, repair, or regenerate solely because of perceived visual defects.

## 13. Reference boundary

Reference policy belongs to the module.

Examples:
- Universal Wallpaper: current user-uploaded reference.
- LoRA: approved age-20 LoRA reference.
- Future modules: their own declared reference mechanism.

No module may silently replace another module's reference policy.

## 14. Data and state ownership

Each module owns its:
- task model;
- queue;
- runtime Worker state;
- logs;
- references;
- module-specific outputs.

Shared CORE rules remain in `00_MASTER/`.

Cross-module transfer must be explicit.

## 15. Future module integration

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

## 16. Change control

Permanent shared-rule changes belong in the applicable CORE document and must be recorded in `00_MASTER/CHANGELOG.md`.

Module-specific changes belong in that module's protocol or state documents.

Do not move a module-specific rule into CORE merely for convenience.

## 17. Historical project preservation

The age-20 Inaria LoRA project remains fully preserved as the `LORA_PRODUCTION` module.

Its MASTER_IMAGE, T109 Goal, queues, handoffs, dataset rules, historical production records, and existing QA/delivery architecture are not deleted by this modularization.

The change is architectural isolation, not project deletion.
