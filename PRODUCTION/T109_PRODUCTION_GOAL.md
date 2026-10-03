# T109 — Production Goal

## Goal ID
T109_GOAL_20260926_150_LORA_CANDIDATE_PRODUCTION

## Project
Age-20 Inaria LoRA

## Target semantics
**150 Production Task Coverage**.

The user request "produce 150 LoRA images" is interpreted as:
> MASTER DIRECTOR must design and queue 150 executable image-production tasks for the Worker pool.

It does **not** mean the current Director account should generate 150 images, and it does **not** require 150 IMAGE_CREATED or 150 QA-approved images.

Each task is counted as covered after the assigned Worker has attempted the design and recorded a terminal production outcome. IMAGE_CREATED, FAILED, GENERATION_TOOL_ERROR, and SAFETY_BLOCKED remain distinct outcomes.

## Current state
- Status: SUSPENDED
- Parent module: LORA_PRODUCTION (PAUSED)
- Execution: NOT ALLOWED until LORA_PRODUCTION is explicitly activated in MODULE_REGISTRY and RUNTIME_STATE
- Production mode: MANUAL
- Task target: 150
- Task Coverage: 11 / 150
- QUEUED: 135
- IMAGE_CREATED: 11
- QA: PAUSED
- Generation system: SUSPENDED
- Official reference: MASTER_IMAGE/INARIA_20_MASTER_v1.0.png

## Design requirements
Every task contains:
- Character / Identity
- Action
- Pose
- Viewpoint
- Hairstyle
- Clothing
- Scene
- Camera
- Hand configuration
- Complete executable Prompt
- Negative Prompt / stability limits

The batch deliberately varies clothing, hairstyle, action, pose, scene, viewpoint, and camera while keeping Inaria identity and reference-matched visual style stable.

The original MASTER_IMAGE outfit is not used as the default outfit for this batch.

## Replacement principle
If a task fails, is safety-blocked, generates a duplicate, or is otherwise unusable, do not repeatedly force the original task to succeed. MASTER DIRECTOR may design a new replacement task in a later batch.

## QA
QA is explicitly PAUSED for T109. Production Workers must not perform QA.

## Completion
T109 task coverage is complete when all 150 queued designs have been processed once. Final candidate quality and the number of QA-approved LoRA training images are separate downstream metrics.

## T109 animal exclusion

T109 is an age-20 Inaria character dataset production batch. Animals and pets are **not valid intentional design elements** in this batch.

All remaining T109 tasks must exclude:
- cats / kittens;
- dogs / puppies;
- other pets;
- prominent wildlife;
- animal companions.

This is a task-design constraint. It does not retroactively rewrite completed Task Records or their original Prompt history. If an already generated candidate unexpectedly contains an animal, its generation event remains historical and downstream QA/data curation decides whether it is usable.

For all still-QUEUED T109 tasks, MASTER DIRECTOR must ensure the task Prompt and Negative Prompt explicitly exclude animals and pets.


## Runtime status note

T109 is preserved as a module-owned Goal. Its task queue and production records are not deleted.

The current platform runtime does not execute T109 because `LORA_PRODUCTION` is PAUSED. A Goal's existence or queued tasks do not activate its parent module.

When LoRA production is intentionally resumed, update `00_MASTER/MODULE_REGISTRY.md`, `00_MASTER/RUNTIME_STATE.md`, and this Goal status in the same controlled state transition.
