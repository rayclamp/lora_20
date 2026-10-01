# MODULE_REGISTRY.md — System Module Registry

## 1. Architecture

The repository is organized as:

CORE → MODULE → DATA / STATE

- CORE contains rules shared by every system.
- MODULE contains independent workflows.
- DATA / STATE contains module-owned tasks, queues, runtime state, logs, and outputs.

A module must not require another module to execute unless an explicit integration dependency is declared here.

## 2. Current module status

| Module | Status | Current executor / integration | Scope |
|---|---|---|---|
| UNIVERSAL_WALLPAPER | ACTIVE | ChatGPT Production Worker | Wallpaper routing and production |
| LORA_PRODUCTION | PAUSED | Future Make/OpenAI integration | Age-20 Inaria LoRA dataset production |
| IMAGE_DELIVERY | PAUSED | Future downstream integration | Image upload / delivery |
| QA | PAUSED | Future QA Worker / Codex / final review | Visual and dataset quality control |

PAUSED means preserved but not executed. Paused modules MUST NOT be deleted merely because they are inactive.

## 3. Active module

Current default production module:

`UNIVERSAL_WALLPAPER`

Its protocol is:

`00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md`

The Universal Wallpaper module is currently the only active production workflow.

Wallpaper type routing:
- ANIME_WALLPAPER → 00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md
- REALISTIC_WALLPAPER → 00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md

The current user instruction selects the wallpaper type. The current user-supplied reference image is the primary visual reference for that batch.

## 4. LoRA Production

`LORA_PRODUCTION` is an independent module.

Its existing T109 Goal, queue, age-20 reference policy, character rules, dataset rules, and LoRA-specific production documents remain preserved.

T109 is NOT the current active production Goal while UNIVERSAL_WALLPAPER is active.

Future Make/OpenAI automation should activate the LoRA module directly rather than routing through Universal Wallpaper.

The LoRA module must continue to load CORE rules, but its workflow, references, dataset semantics, and automation are independent.

## 5. Image Delivery

`IMAGE_DELIVERY` is preserved as a downstream module.

It is currently PAUSED.

Its existing implementation and historical state must not be deleted solely because the module is paused.

When activated, it must declare its input/output contract and operate independently from the generation module.

## 6. QA

`QA` is preserved as an independent downstream module.

It is currently PAUSED.

Primary future executor:
- Codex-assisted QA / future QA Worker.

QA does not generate images and does not replace Production Worker responsibilities.

Core QA documents:
- `00_MASTER/QA_MODULE.md` — module boundary, ownership, status, result semantics.
- `00_MASTER/QA_PROTOCOL.md` — execution protocol and Codex inspection behavior.
- `00_MASTER/CODEX_QA_CHECKLIST.md` — practical visual inspection checklist.

QA may consume successful generation outputs from one or more production modules.

QA result:
- PASS
- REVIEW
- REPAIR
- REJECT

A QA result never changes the historical generation result. A generation SUCCESS remains SUCCESS even when QA later rejects the candidate.

When activated, QA must use its own state model and the source module's applicable acceptance profile. It must not import unrelated module requirements.

## 7. Module activation rule

Only explicitly ACTIVE modules may execute.

A module becoming PAUSED means:
- do not claim new work for that module;
- do not start its workflow;
- preserve its queues, state, and documents;
- do not delete its data.

Activation must be recorded here before workers treat the module as executable.

## 8. Shared CORE vs module-specific rules

CORE:
- anatomy stability
- drawing stability
- generation safety
- common Worker safety
- common state integrity principles

Module-specific:
- character identity
- reference image policy
- wallpaper parameters
- LoRA dataset design
- festival-specific workflow
- task/queue semantics where specialized
- image delivery behavior
- QA acceptance criteria
- Make/OpenAI integration

## 9. Future modules

A new module should be added without restructuring existing modules.

Minimum registration:

`MODULE_NAME`
- STATUS
- PROTOCOL
- EXECUTOR / INTEGRATION
- INPUT CONTRACT
- OUTPUT CONTRACT
- DEPENDENCIES
- CORE RULES USED

The new module must not modify another module's workflow merely to become operational.
