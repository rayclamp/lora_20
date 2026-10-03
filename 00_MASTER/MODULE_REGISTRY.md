# MODULE_REGISTRY.md — Current Module Registry

| Module | Status | Scope |
|---|---|---|
| UNIVERSAL_WALLPAPER | ACTIVE | General anime/realistic wallpaper |
| FESTIVAL_WALLPAPER | ACTIVE | Festival anime/realistic wallpaper |
| LORA_PRODUCTION | PAUSED | Age-20 Inaria LoRA dataset production |
| QA | PAUSED | Cross-module downstream QA |
| IMAGE_DELIVERY | PAUSED | Downstream image delivery |

## LoRA Production
Module root: `MODULES/LORA_PRODUCTION/`
Protocol: `MODULES/LORA_PRODUCTION/MODULE.md`
Status: PAUSED.
No LoRA Goal, Batch, Queue, Task, Worker, or QA state is executable while PAUSED.

## Activation rule
Only explicitly ACTIVE modules may execute. A Goal, Queue, Task, or Worker command cannot activate its parent module.
