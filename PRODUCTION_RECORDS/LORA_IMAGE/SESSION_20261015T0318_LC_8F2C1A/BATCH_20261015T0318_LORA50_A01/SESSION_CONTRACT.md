# SESSION_CONTRACT.md

SESSION_ID: SESSION_20261015T0318_LC_8F2C1A
BATCH_ID: BATCH_20261015T0318_LORA50_A01
SESSION_SCOPE: LORA_IMAGE prompt design and locked prompt persistence only
MODULE: LORA_IMAGE
PRODUCTION_TYPE: NOT_SPECIFIED
CHARACTER: INARIA
IMAGE_COUNT: 50
OUTPUT_TYPE: MIXED_PER_TASK
REFERENCE_IMAGE: NOT_REQUIRED_FOR_PROMPT_DESIGN; supplied by user in the producer conversation before generation
USER_CONSTRAINTS:
- Design exactly 50 independent candidate prompts for a LoRA training dataset.
- Do not impose a rendering style not specified by the active task; if none is specified, align with the uploaded reference medium.
- No pets or animals.
- Do not inherit wallpaper or festival rules, outfits, props, or style templates.
- Do not use a fixed age-20 reference image or claim to have inspected a not-yet-supplied reference image.
- During production, the uploaded image is the sole visual identity authority; change presentation without copying its outfit, pose, framing, or scene unless explicitly requested.
- Vary framing, pose, viewpoint, clothing, hair arrangement, accessories, scene, lighting, and composition meaningfully.
- Each Task independently records TASK_OUTPUT_TYPE as PHONE_9_16 or DESKTOP_16_9; no separate ASPECT_RATIO or ORIENTATION field.
DESIGN_BOUNDARY: Prompt design, Task queue/index, GitHub writes/readback verification, and prompt locking only. No image generation, QA, retouching, or producer launch.
PROMPT_SET_STATUS: LOCKED
PROMPT_SET_LOCKED: YES
RENDERING_STYLE: NOT_SPECIFIED; follow explicit production request, otherwise align with uploaded reference medium
CREATED_AT: 2026-10-15T03:18:00+08:00
