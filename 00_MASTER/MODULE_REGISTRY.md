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
Persistent batch/task state: `MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/`
Status: ACTIVE.
Every persistent Universal Wallpaper batch must have its canonical record in the module-owned BATCHES directory.

## Festival Wallpaper
Execution protocol: `00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md`
Cultural data: `FESTIVAL_COSTUME_DATABASE/`
Status: ACTIVE.
The cultural database is data authority; it is not a second execution master.

## LoRA Production
Module root: `MODULES/LORA_PRODUCTION/`
Protocol: `MODULES/LORA_PRODUCTION/MODULE.md`
Batch state: `MODULES/LORA_PRODUCTION/BATCHES/`
Status: PAUSED.
No LoRA Goal, Batch, Queue, Task, Worker, or QA state is executable while PAUSED.

## Activation rule
Only explicitly ACTIVE modules may execute. A Goal, Queue, Task, or Worker command cannot activate its parent module.
