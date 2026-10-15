# SESSION_CONTRACT

SESSION_ID: LORA_20261015_1843_01
BATCH_ID: BATCH_001
SESSION_SCOPE: New LORA_IMAGE prompt-design session
MODULE: LORA_IMAGE
PRODUCTION_TYPE: CANDIDATE_DATASET_DESIGN
CHARACTER: INARIA
IMAGE_COUNT: 50
OUTPUT_TYPE: MIXED_PER_TASK
BRANCH: main

## Constraints
- Exactly 50 independent candidate prompts.
- At production time, the uploaded person-reference image is the sole visual identity authority; this design session does not claim to have inspected a reference image.
- No pets or animals.
- Each task independently selects PHONE_9_16 or DESKTOP_16_9 without a fixed quota.
- Follow current CORE anatomy stability and LORA_IMAGE dataset design rules.

## Scope
Design, persist, verify and lock prompts only. No image generation, QA, repair, or producer launch. GitHub is a reference/persistence database, not a runtime controller.
