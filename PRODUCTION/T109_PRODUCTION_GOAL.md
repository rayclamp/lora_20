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
- Status: ACTIVE
- Production mode: MANUAL
- Task target: 150
- Task Coverage: 1 / 150
- QUEUED: 149
- IMAGE_CREATED: 1
- QA: PAUSED
- Generation system: ACTIVE
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
