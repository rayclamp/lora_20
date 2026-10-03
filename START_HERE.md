# START_HERE.md — Modular Production System Startup

## 0. System Architecture

This repository uses a modular architecture:

CORE → MODULE → MODULE-OWNED DATA / STATE

Read first:
1. `00_MASTER/SYSTEM_ARCHITECTURE.md`
2. `00_MASTER/MODULE_REGISTRY.md`
3. `00_MASTER/RUNTIME_STATE.md`
4. `00_MASTER/AUTHORITY_MATRIX.md`
5. `00_MASTER/CORE_RULES.md`
6. `00_MASTER/MASTER_SPEC.md`

Currently active modules:
- `UNIVERSAL_WALLPAPER`
- `FESTIVAL_WALLPAPER`

Currently paused modules:
- `LORA_PRODUCTION`
- `IMAGE_DELIVERY`
- `QA`

The currently executing workflow is selected by `00_MASTER/RUNTIME_STATE.md`.

PAUSED modules are not deleted and must not be executed until explicitly activated.

## 1. Module selection rule

A Worker must determine the active module from `00_MASTER/MODULE_REGISTRY.md`.

Do not assume that this repository is always running LoRA production.

A module loads:
- CORE rules;
- its own module protocol;
- its own task/queue/state;
- its own reference policy;
- its own external integrations.

One module's workflow must not be silently inherited by another module.

## 2. Shared CORE rules

All modules use the applicable rules in `00_MASTER/`, especially:
- `CORE_RULES.md`
- `DRAWING_INSTRUCTIONS.md`
- `ANATOMY_STABILITY.md`
- `IMAGE_GENERATION_SAFETY_SPEC.md`
- `GENERATION_RULES.md`
- `GENERATION_WORKER_PROTOCOL.md`

These define cross-system constraints.

They do NOT define a universal character, universal reference image, LoRA workflow, wallpaper workflow, upload destination, or QA acceptance result.

## 3. Active module — Universal Wallpaper

When `UNIVERSAL_WALLPAPER` is ACTIVE, use:

`00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md`

The user provides only:
- quantity;
- wallpaper type;
- output format;
- theme;
- scene;
- weather;
- time;
- pet permission;
- current reference image.

The current uploaded image is the primary visual reference for that batch.

The user instruction selects the wallpaper type:
- ANIME WALLPAPER → 00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md
- REALISTIC WALLPAPER → 00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md

Do not substitute the current uploaded reference with the LoRA MASTER_IMAGE unless explicitly requested.

The Worker creates a runtime identity, claims compatible work, generates, records the generation result, and continues.

Universal Wallpaper does not require T109.

## 4. Active module — Festival Wallpaper

When `FESTIVAL_WALLPAPER` is ACTIVE and selected by runtime state, use:

- `00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md`
- `FESTIVAL_COSTUME_DATABASE/SPECIAL_FESTIVAL_WALLPAPER_MASTER.md`
- `FESTIVAL_COSTUME_DATABASE/SPECIAL_FESTIVAL_WALLPAPER_VIEW_RULES.md`

Festival Wallpaper supports both anime and realistic festival wallpapers, with manual and automated workflows. It uses the Festival Costume Database for cultural data and may reuse shared CORE and Wallpaper Task Integrity infrastructure.

It must not inherit unrelated LoRA workflow semantics.

## 5. Paused module — LoRA Production

When `LORA_PRODUCTION` is PAUSED, do not claim or generate T109 work.

Use the preserved module protocol:

`00_MASTER/LORA_PRODUCTION_PROTOCOL.md`

The existing T109 Goal, queue, age-20 reference, dataset rules, and historical production state remain preserved.

T109 is not the current active production Goal.

When LoRA is later activated, its executor must load CORE plus the LoRA module rules. Future Make/OpenAI automation should execute this module directly.

## 6. Paused module — Image Delivery

`IMAGE_DELIVERY` is currently PAUSED.

Use:

`00_MASTER/IMAGE_DELIVERY_MODULE.md`

Do not delete its existing implementation or historical state.

It is a downstream module and is independent from image generation.

## 7. Paused module — QA

`QA` is currently PAUSED.

Use:

`00_MASTER/QA_MODULE.md`

Do not delete existing QA rules, adapters, reports, or historical state.

QA is downstream from generation and is independent from the generation Worker.

## 8. Worker safety

Regardless of module:
- load CORE before execution;
- never generate without valid task ownership when the module uses a queue;
- apply drawing/anatomy rules before generation;
- distinguish generation success from visual QA;
- do not self-QA;
- do not regenerate an UNKNOWN generation result;
- preserve generated candidates;
- respect module-specific retry and recovery rules;
- stop on state/claim conflicts rather than guessing.

## 9. Future module rule

A new system should be added as a new module.

It should:
1. register itself in `MODULE_REGISTRY.md`;
2. define its own protocol;
3. declare its input/output contract;
4. load CORE;
5. own its own workflow and state.

It should not modify or depend on another module merely to become operational.

## 10. Historical LoRA project information

The repository originated as the age-20 Inaria LoRA project. That historical purpose remains preserved inside the `LORA_PRODUCTION` module.

It is no longer the definition of the entire platform.

The platform-level architecture is now modular.
