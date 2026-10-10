# IMAGE_QA — Independent Image Inspection System

## Purpose

IMAGE_QA is a separate image-inspection and quality-control system. It is not part of image generation or production design. Its job begins after an image exists and is available for inspection.

## Current scope

The initial inspection profile is:
- `LORA_IMAGE_QA`: inspect candidate images intended for LoRA training using the current uploaded reference image and the applicable LoRA-image acceptance criteria.

Other image-design modules are not automatically included. Any additional QA profile must be explicitly defined and approved before use.

## Separation from production

- `MODULES/LORA_IMAGE/` defines how LoRA training images should be designed.
- `IMAGE_QA/` defines how generated candidate images are inspected and classified.
- Production success and QA acceptance are separate states. A generation success is not automatically a QA PASS.
- QA does not generate images, rewrite prompts, automatically repair candidates, or trigger regeneration.
- The original image and its audit history must be preserved.

## Reference and identity

For `LORA_IMAGE_QA`, use the reference image supplied for the same production request. Do not require or substitute a GitHub-stored character reference. Do not assume a fixed person or age.

If the correct reference, task contract, or required evidence is missing or ambiguous, report an incomplete input or REVIEW as appropriate; do not guess.

## Shared QA governance

This system follows `00_MASTER/QA_MODULE.md` and `00_MASTER/QA_PROTOCOL.md`. Its activation status is governed by the shared QA module. Creating these files does not activate an inspection run or automation.

## Files

- `LORA_IMAGE_QA_SPEC.md`: LoRA-specific acceptance profile.
- `LORA_IMAGE_QA_CHECKLIST.md`: operational visual-inspection checklist.
