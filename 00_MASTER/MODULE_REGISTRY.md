# MODULE_REGISTRY.md — System Module Registry

## 1. Architecture

The complete high-level architecture is documented in:

`00_MASTER/SYSTEM_ARCHITECTURE.md`

Cross-document consistency is validated by:

`00_MASTER/SYSTEM_CONSISTENCY_MATRIX.md`

This document is the persistent architecture map for the Inaria drawing system and should be read when recovering project context.

The repository is organized as:

CORE → MODULE → DATA / STATE

- CORE contains rules shared by every system.
- MODULE contains independent workflows.
- DATA / STATE contains module-owned tasks, queues, runtime state, logs, and outputs.

A module must not require another module to execute unless an explicit integration dependency is declared here.

## 2. Current module status

| Module | Status | Current executor / integration | Scope |
|---|---|---|---|
| UNIVERSAL_WALLPAPER | ACTIVE | ChatGPT Production Worker | General wallpaper routing and production |
| FESTIVAL_WALLPAPER | ACTIVE | ChatGPT Festival Worker / Manual + Automated | Festival-specific anime/realistic wallpaper production |
| LORA_PRODUCTION | PAUSED | Future Make/OpenAI integration | Age-20 Inaria LoRA dataset production |
| IMAGE_DELIVERY | PAUSED | Future downstream integration | Image upload / delivery |
| QA | PAUSED | Future QA Worker / Codex / final review | Visual and dataset quality control |

PAUSED means preserved but not executed. Paused modules MUST NOT be deleted merely because they are inactive.

## 3. Active Wallpaper modules

### UNIVERSAL_WALLPAPER

Protocol:

`00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md`

Scope:
- general anime wallpaper;
- general realistic wallpaper;
- manual and automated wallpaper workflows.

### FESTIVAL_WALLPAPER

Festival Wallpaper is an independent active module.

Primary documents:
- `00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md`
- `FESTIVAL_COSTUME_DATABASE/SPECIAL_FESTIVAL_WALLPAPER_MASTER.md`
- `FESTIVAL_COSTUME_DATABASE/SPECIAL_FESTIVAL_WALLPAPER_VIEW_RULES.md`

Scope:
- festival anime wallpaper;
- festival realistic wallpaper;
- manual and automated festival workflows;
- Festival Costume Database integration.

Festival Wallpaper may reuse CORE and Wallpaper Task Integrity infrastructure, but must not inherit unrelated General Wallpaper or LoRA workflow semantics.

The current active workflow is determined by `00_MASTER/RUNTIME_STATE.md`, not by this registry alone.

Wallpaper type routing:
- ANIME_WALLPAPER → 00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md
- REALISTIC_WALLPAPER → 00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md

The current user instruction selects the wallpaper type. The current user-supplied reference image is the primary visual reference for that batch.

## 4. LoRA Production

`LORA_PRODUCTION` is an independent module.

Its existing T109 Goal, queue, age-20 reference policy, character rules, dataset rules, and LoRA-specific production documents remain preserved.

T109 is NOT executable while `LORA_PRODUCTION` is PAUSED.

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

## 7. Runtime-state authority

`00_MASTER/RUNTIME_STATE.md` is the canonical source for current platform runtime state and active workflow selection.

This registry owns module registration and module activation status. Runtime state records which active workflow is currently being executed.

A module-owned Goal cannot activate its parent module. A Goal under a PAUSED module is preserved but non-executable.

If a preserved Goal exists under a PAUSED module, the Goal is not executable.

## 8. Module activation rule

Only explicitly ACTIVE modules may execute.

A module becoming PAUSED means:
- do not claim new work for that module;
- do not start its workflow;
- preserve its queues, state, and documents;
- do not delete its data.

Activation must be recorded here before workers treat the module as executable.

## 9. Shared CORE vs module-specific rules

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

## 10. Future modules

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
