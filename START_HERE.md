# START_HERE.md — Modular Production System Startup

## 0. System Architecture

This repository uses a modular architecture:

CORE → MODULE → MODULE-OWNED DATA / STATE

Read first:
1. `00_MASTER/MODULE_REGISTRY.md`
2. `00_MASTER/CORE_RULES.md`
3. `00_MASTER/MASTER_SPEC.md`

The current active module is:

**UNIVERSAL_WALLPAPER**

The following modules are preserved but currently PAUSED:
- LORA_PRODUCTION
- IMAGE_DELIVERY
- QA

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

## 3. Current active module — Universal Wallpaper

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

The current uploaded image is the ONLY visual reference for that batch.

Do not substitute the LoRA MASTER_IMAGE.

The Worker creates a runtime identity, claims compatible work, generates, records the generation result, and continues.

Universal Wallpaper does not require T109.

## 4. Paused module — LoRA Production

When `LORA_PRODUCTION` is PAUSED, do not claim or generate T109 work.

Use the preserved module protocol:

`00_MASTER/LORA_PRODUCTION_PROTOCOL.md`

The existing T109 Goal, queue, age-20 reference, dataset rules, and historical production state remain preserved.

T109 is not the current active production Goal.

When LoRA is later activated, its executor must load CORE plus the LoRA module rules. Future Make/OpenAI automation should execute this module directly.

## 5. Paused module — Image Delivery

`IMAGE_DELIVERY` is currently PAUSED.

Use:

`00_MASTER/IMAGE_DELIVERY_MODULE.md`

Do not delete its existing implementation or historical state.

It is a downstream module and is independent from image generation.

## 6. Paused module — QA

`QA` is currently PAUSED.

Use:

`00_MASTER/QA_MODULE.md`

Do not delete existing QA rules, adapters, reports, or historical state.

QA is downstream from generation and is independent from the generation Worker.

## 7. Worker safety

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

## 8. Future module rule

A new system should be added as a new module.

It should:
1. register itself in `MODULE_REGISTRY.md`;
2. define its own protocol;
3. declare its input/output contract;
4. load CORE;
5. own its own workflow and state.

It should not modify or depend on another module merely to become operational.

## 9. Historical LoRA project information

The repository originated as the age-20 Inaria LoRA project. That historical purpose remains preserved inside the `LORA_PRODUCTION` module.

It is no longer the definition of the entire platform.

The platform-level architecture is now modular.
