# LORA_IMAGE Reference Policy

## Reference-image requirement by stage

Reference-image handling differs between prompt design and image production. This distinction is mandatory.

### Prompt design — `/LORA_CONSOLE`

- The prompt designer does **not** require a person-reference image.
- Do not ask the user to upload a reference image during console startup.
- Do not pause, fail, or defer prompt design because no image is attached.
- Design and lock the requested prompts using the active LORA_IMAGE rules and, when selected, the shared CORE character information.
- Prompts may refer generically to the person-reference image that will be supplied later during production. Do not claim that the designer has inspected an image it has not received.

### Image production — `/LORA_PRODUCE`

- Before the first generation call, the user must attach the person-reference image in the current producer ChatGPT conversation.
- Use that current uploaded image as the sole visual identity authority for the production run.
- If the image is missing, inaccessible, or ambiguous, stop before generation and ask the user to provide or identify it. Do not silently substitute a GitHub-stored image or an image from an earlier conversation/run.
- Apply the reference image together with the locked Task prompt. The image anchors the person's visual identity; it does not automatically lock clothing, pose, composition, accessories, hairstyle arrangement, or scene.

## CHARACTER selection

- `CHARACTER=INARIA`: shared CORE Inaria information may inform context, personality, lifestyle, or scene design when relevant. It must not replace, reconstruct, or override the visual identity shown in the production-time uploaded image.
- `CHARACTER=NONE`: do not apply Inaria-specific data. During production, derive the visual identity from the uploaded image and follow the locked Task prompt.

## No fixed identity lock

LORA_IMAGE does not permanently bind training to Inaria, age 20, or any other fixed person/age. The current production-time uploaded image and explicit current instructions determine the subject for each run.

## Locked prompt integrity

The producer must execute the authoritative locked prompt for each Task without rewriting its design. The reference image is an input to image generation, not a reason to redesign or silently alter the prompt. If the reference image and a task instruction appear to conflict, preserve the image's identity while following the task's explicitly requested presentation changes; do not infer that the reference's original outfit, pose, accessories, or background must be copied.

## Related active design rules

This reference policy is used together with:
- `MODULES/LORA_IMAGE/MODULE.md`;
- `MODULES/LORA_IMAGE/DATASET_DESIGN_SPEC.md`;
- `MODULES/LORA_IMAGE/DATASET_DIVERSITY.md`;
- `MODULES/LORA_IMAGE/CANDIDATE_DESIGN_RULES.md`;
- the applicable shared CORE drawing and anatomy rules.

The uploaded image is the visual identity authority during production; dataset rules govern useful presentation variation without overriding that identity.
