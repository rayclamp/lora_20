# LORA_PRODUCTION_PROTOCOL.md — Independent LoRA Module

## Status

**PAUSED**

This module is preserved for future activation. It is independent from Universal Wallpaper Production.

## Purpose

Own the age-20 Inaria LoRA dataset production workflow, including its Goal, task queue, approved identity/style references, dataset diversity, and LoRA-specific production rules.

## Execution model

Current preserved execution architecture:
- Goal-based production
- interchangeable generation workers
- T109 as the preserved current LoRA Goal
- age-20 MASTER_IMAGE reference policy
- LoRA-specific dataset constraints

Future execution target:
- Make/OpenAI automation may activate and execute this module.
- Universal Wallpaper workflow is not a dependency.

## Required rule layers

When activated, the LoRA executor loads:
1. CORE rules from `00_MASTER/CORE_RULES.md`
2. This module protocol
3. LoRA-specific identity/style/reference rules
4. LoRA-specific Goal and queue state
5. Applicable Prompt and dataset rules

## Reference boundary

The LoRA module uses its own approved reference policy. It must not inherit the runtime-uploaded-reference rule of Universal Wallpaper.

The current age-20 reference remains the preserved LoRA reference for the existing project. Future Make/OpenAI automation loads the Make integration contract and runtime context from `00_MASTER/LORA_PRODUCTION/MAKE_INTEGRATION/`. The approved age-20 binary reference is module-owned and must not be treated as a Universal Wallpaper reference.

## State boundary

LoRA tasks, Goals, queues, and worker state belong to the LoRA module.

A Universal Wallpaper task must never be interpreted as a LoRA task, and a LoRA task must never be claimed by a Universal Wallpaper Worker unless an explicit future integration says so.

## Activation

To activate this module:
- change its status in `00_MASTER/MODULE_REGISTRY.md`;
- define the active LoRA Goal/Queue;
- verify the required LoRA reference;
- start the LoRA executor;
- keep Universal Wallpaper state independent.

No LoRA data, Goal, or protocol should be deleted while this module is paused.
