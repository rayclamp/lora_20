# MODULE_REGISTRY.md — Current Module Registry

| Module | Status | Scope |
|---|---|---|
| UNIVERSAL_WALLPAPER | ACTIVE | General anime/realistic wallpaper |
| FESTIVAL_WALLPAPER | ACTIVE | Festival anime/realistic wallpaper |
| LORA_PRODUCTION | PAUSED | Age-20 Inaria LoRA dataset production |
| QA | PAUSED | Cross-module downstream QA |
| IMAGE_DELIVERY | PAUSED | Downstream image delivery |

## Universal Wallpaper
Module root: `MODULES/UNIVERSAL_WALLPAPER/`
Protocol: `00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md`
Reference Policy: `MODULES/UNIVERSAL_WALLPAPER/REFERENCE_POLICY.md`
Persistent batch/task state: `MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/`
Status: ACTIVE.
Every persistent Universal Wallpaper batch must have its canonical record in the module-owned BATCHES directory.
The Reference Policy is the sole module authority for allowed visual person-reference sources.

## Festival Wallpaper
Module root: `MODULES/FESTIVAL_WALLPAPER/`
Execution profile: `00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md`
Execution runtime: shared `00_MASTER/PRODUCTION_WORKER_RUNTIME.md`
Reference Policy: `MODULES/FESTIVAL_WALLPAPER/REFERENCE_POLICY.md`
Cultural data: `FESTIVAL_COSTUME_DATABASE/`
Status: ACTIVE.
The cultural database is data authority; it is not a second execution master.
The Reference Policy is the sole module authority for allowed visual person-reference sources.

## LoRA Production
Module root: `MODULES/LORA_PRODUCTION/`
Protocol: `MODULES/LORA_PRODUCTION/MODULE.md`
Execution: shared `00_MASTER/PRODUCTION_WORKER_RUNTIME.md`
Batch state: `MODULES/LORA_PRODUCTION/BATCHES/`
Status: PAUSED.
No LoRA Goal, Batch, Queue, Task, Worker, or QA state is executable while PAUSED.
LoRA identity/reference assets and LoRA-specific production state are owned exclusively by the LoRA module.

## Activation rule
Only explicitly ACTIVE modules may execute. A Goal, Queue, Task, or Worker command cannot activate its parent module.

## Automation scope

System Automation is a dedicated automated entry mode for the Wallpaper Production domain.

Automated requests may resolve only:
- UNIVERSAL_WALLPAPER
- FESTIVAL_WALLPAPER

For either module, Automation must load that module's canonical Reference Policy before reference resolution.

The existence of a shared Worker Runtime does not make other modules automatically eligible for System Automation.

## Canonical routing

All production-critical rule paths are resolved through `00_MASTER/CANONICAL_PATH_REGISTRY.md`. Missing or contradictory canonical paths are context-load failures and block execution.
