# LORA_IMAGE Reference Policy

## Required current reference

For each LORA_IMAGE request, the user should attach the reference person image directly in the current ChatGPT conversation at startup. Use that image as the sole visual identity authority for the current run.

Do not search for, require, or silently substitute a person-reference image stored in GitHub. A reference from an earlier run is not automatically the reference for the current run.

If the image is missing, inaccessible, or ambiguous, ask the user to provide or identify it before designing or generating.

## CHARACTER selection

- `CHARACTER=INARIA`: shared CORE Inaria information may inform context, personality, lifestyle, or scene design when relevant. It must not replace, reconstruct, or override the visual identity shown in the uploaded image.
- `CHARACTER=NONE`: do not apply Inaria-specific data. Derive the visual identity from the uploaded image and follow current task instructions.

## No fixed identity lock

LORA_IMAGE does not permanently bind training to Inaria, age 20, or any other fixed person/age. The current uploaded image and explicit current instructions determine the subject for each run.

## Related active design rules

This reference policy is used together with:
- `MODULES/LORA_IMAGE/DATASET_DESIGN_SPEC.md`;
- `MODULES/LORA_IMAGE/DATASET_DIVERSITY.md`;
- `MODULES/LORA_IMAGE/CANDIDATE_DESIGN_RULES.md`;
- the applicable shared CORE drawing and anatomy rules.

The uploaded image is the visual identity authority; the dataset rules govern useful presentation variation without overriding that identity.
