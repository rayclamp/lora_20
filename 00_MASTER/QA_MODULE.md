# QA_MODULE.md — Independent Quality Assurance Module

## Status

**PAUSED**

The independent QA system is preserved for future activation. Creating or updating QA specifications does not activate an inspection run, QA automation, or production workers.

## Purpose

QA is a separate visual-inspection and quality-control system, not part of image generation or production design.

Production answers: was an image successfully generated?
QA answers: does the existing image satisfy the applicable acceptance criteria?

A generation SUCCESS is never retroactively changed because QA later rejects the image.

## Architecture

Production Module → GENERATION SUCCESS / IMAGE_CREATED → Independent IMAGE_QA → INSPECT → PASS / REVIEW / REPAIR / REJECT

The independent QA system and its module-specific acceptance profiles are catalogued separately from production modules. The initial LoRA profile is maintained at:
- `IMAGE_QA/MODULE.md`
- `IMAGE_QA/LORA_IMAGE_QA_SPEC.md`
- `IMAGE_QA/LORA_IMAGE_QA_CHECKLIST.md`

QA does not generate images, rewrite prompts, or trigger regeneration. Any repair must be a separate authorized process that preserves the original candidate and audit history.

FESTIVAL_WALLPAPER outputs are explicitly excluded from QA intake and must never enter the LoRA dataset pipeline. No other production module is QA-eligible by default; it requires an explicit scope decision and approved acceptance profile.

## CORE dependency

QA loads CORE plus:
1. applicable source-module rules;
2. the correct reference image and identity context for the same task;
3. task metadata;
4. the applicable independent QA acceptance profile.

DRAWING_INSTRUCTIONS.md is primarily a generation-time document. QA may use it as supporting evidence, but decisions are based on the generated image and applicable acceptance criteria.

## Ownership

When activated, QA owns:
- visual inspection;
- result classification;
- issue/evidence reporting;
- repair/rework recommendation;
- QA state transitions;
- audit trail.

Production processes do not own QA decisions.

## Result semantics

### PASS
All applicable hard gates pass and no material unresolved issue remains.

### REVIEW
Evidence is insufficient for a reliable decision. Examples include natural occlusion preventing reliable digit counting, uncertain handedness, ambiguous background fusion, or missing comparison evidence.

REVIEW is neither PASS nor failure.

### REPAIR
A localized defect is potentially correctable without replacing the whole candidate. QA identifies the defect; a separate rework process performs the repair.

### REJECT
The candidate is materially unsuitable or the defect is too broad/high-risk for the authorized repair path.

## Hard-gate principle

A clearly visible hard failure cannot PASS.

Natural occlusion is not automatically a failure. If anatomy cannot be determined reliably from visible evidence, use REVIEW rather than guessing.

## Inspection priority

1. limb count and topology;
2. hands, fingers, wrists, palms, handedness;
3. legs, feet, toes;
4. body proportions and support;
5. object/wearable contact;
6. false limbs and anatomy-background fusion;
7. identity/reference consistency;
8. clothing/accessories;
9. composition;
10. style/rendering;
11. module-specific requirements;
12. dataset suitability.

## Missing/conflicting data

Missing required input: QA_INPUT_INCOMPLETE.
Conflicting authoritative requirements: QA_DATA_CONFLICT.

Do not invent missing criteria or silently choose between conflicting rules.

## Image preservation

QA never silently overwrites or deletes the original candidate. Repair creates a new candidate/version and preserves the original audit record.

## Activation

Before activation, QA must have:
- image input contract;
- source-module metadata;
- applicable reference assets;
- inspection protocol;
- result/state contract;
- repair ownership;
- report storage;
- audit trail.

Until these are confirmed, QA remains PAUSED.
