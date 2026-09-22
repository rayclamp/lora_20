# Inaria LoRA Character Specification

## Purpose

This document defines the formal character specification for future Codex QA of the Age-20 Inaria LoRA dataset. It is an evaluation reference only and does not authorize modification, renaming, moving, deletion, or regeneration of dataset images.

## Project Character

| Field | Specification |
| --- | --- |
| Character name | Inaria / 依娜莉亞 |
| Dataset target | Age-20 Inaria LoRA |
| Primary reference | `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png` |
| Reference authority | `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png` is the designated primary visual reference for age-20 Inaria character identity and visual appearance. |

## Core Appearance

- Female.
- Taiwanese / Asian appearance.
- Fair Asian skin.
- Slim, balanced body proportions.
- Small oval face.
- Large, soft eyes.
- Blue irises.
- Dark blue-black long hair.
- Neat bangs covering the forehead.
- Gentle, fresh, healing overall impression.

## Character Identity Priority

When evaluating whether an image matches Inaria, evaluate the following characteristics in priority order:

1. Face identity and overall facial structure.
2. Hair color and hairstyle.
3. Eye color.
4. Overall body proportions.
5. Skin appearance.
6. General visual impression.

Do not reject an image solely because its clothing, pose, background, hairstyle variation, or accessories differ. Treat those differences as acceptable unless the specific dataset job requires them to remain consistent.

## Anatomy Rules

The image must show natural, coherent human anatomy:

- Exactly two arms.
- Exactly two legs.
- Exactly two hands when both hands are visible.
- Five fingers per visible hand.
- Five toes per visible foot.
- No extra fingers.
- No missing fingers.
- No fused fingers.
- No extra limbs.
- No missing limbs.
- Natural wrist, palm, arm, and leg connections.
- Natural body balance and posture.

## Wearable Object Rules

When a backpack, shoulder bag, handbag, or similar wearable object is present:

- Its straps must clearly connect to the object.
- Its straps must naturally contact the body.
- Its straps must not pass through the body.
- Its straps must not float.
- Its straps must not disappear or break unnaturally.
- The object must have believable physical support.

If a complex wearable object causes repeated anatomy or occlusion problems, simplify or remove the object instead of introducing unstable anatomy.

## QA Interpretation

Use these labels for every applicable requirement:

| Label | Meaning |
| --- | --- |
| `PASS` | Clearly satisfies the requirement. |
| `REVIEW` | Visual evidence is insufficient or the judgment is uncertain. |
| `FAIL` | Clearly violates the requirement. |

Never invent information that cannot be observed from the image. If resolution or occlusion prevents reliable judgment, use `REVIEW` rather than guessing.
