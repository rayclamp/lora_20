# MAKE_RUNTIME_CONTEXT.md — LoRA Production Make Agent Runtime Context

## Purpose

Compact runtime context for future Make/OpenAI automation that executes the LORA_PRODUCTION module.

## Module

- Module: LORA_PRODUCTION
- Status: PAUSED
- Target: Inaria age-20 identity LoRA dataset
- Executor: Future Make/OpenAI automation

## Authority

1. Explicit current user instruction
2. CORE rules
3. LORA_PRODUCTION protocol
4. Approved LoRA reference assets
5. LoRA Goal / queue / state
6. LoRA-specific prompt and dataset rules
7. Temporary implementation details

## Identity reference

The future Make workflow uses the approved age-20 Inaria reference asset:

`00_MASTER/LORA_PRODUCTION/MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`

The reference establishes the age-20 Inaria identity and visual baseline for LoRA production. It is NOT a Universal Wallpaper runtime reference.

## Generation priorities

1. Identity and proportions
2. Explicit task locks
3. Anatomy and generation stability
4. Pose / camera / composition
5. Clothing / scene
6. Lighting / style
7. Decorative detail

## Anatomy hard constraints

- Two arms and two legs
- Five fingers per visible hand
- Five toes per visible bare foot
- No extra, missing, fused, duplicated digits or limbs
- Natural joints and support
- Natural hand/object and wearable connections
- Natural body proportions
- Slim does not mean elongated legs

## Dataset production

The Make workflow generates candidates according to the active LoRA Goal and task queue.

It must preserve intentional dataset diversity across:
- hairstyle
- clothing
- scene
- pose
- camera / framing
- expression
- lighting
- composition

Do not introduce accidental identity signals.

## Worker boundary

Generation and downstream QA are separate.

Make generation automation must:
- execute only owned/valid LoRA tasks;
- generate according to the active task;
- record generation result and required metadata;
- preserve generated candidates;
- stop on UNKNOWN generation status or state conflict.

Make generation automation must NOT independently declare visual QA PASS / REPAIR / REJECT unless a future explicit integration assigns that responsibility.

## Module boundary

This runtime context must not be loaded by:
- UNIVERSAL_WALLPAPER
- CORE-only workers
- unrelated future modules

## Activation

This context becomes executable only after LORA_PRODUCTION is explicitly activated in MODULE_REGISTRY.
