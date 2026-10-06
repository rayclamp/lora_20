# QA_MODULE.md — Independent Quality Assurance Module

## Status

**PAUSED**

Preserved for future activation. QA is not currently executed by Production Workers.

## Purpose

QA is the downstream visual and dataset quality-control layer. Its future primary executor is Codex-assisted image inspection.

Production answers: was an image successfully generated?
QA answers: does the generated image satisfy the applicable requirements?

A generation SUCCESS is never retroactively changed because QA later rejects the image.

## Architecture

Production Module → GENERATION SUCCESS / IMAGE_CREATED → QA → INSPECT → PASS / REVIEW / REPAIR / REJECT

QA may consume outputs from UNIVERSAL_WALLPAPER and LORA_PRODUCTION only when the applicable QA workflow is activated. FESTIVAL_WALLPAPER outputs are explicitly excluded from QA intake and must never enter the LoRA dataset pipeline. A future production module is not QA-eligible by default; it requires an explicit scope decision and approved source-module contract.

## CORE dependency

QA loads CORE plus:
1. applicable source-module rules;
2. approved reference/identity assets;
3. task metadata;
4. QA-specific inspection rules.

DRAWING_INSTRUCTIONS.md is primarily a generation-time document. QA may use it as supporting evidence, but decisions are based on the generated image and applicable acceptance criteria.

## Ownership

When activated, QA owns:
- visual inspection;
- result classification;
- issue/evidence reporting;
- repair/rework recommendation;
- QA state transitions;
- audit trail.

Production Workers do not own QA decisions.

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

## Module-specific acceptance

QA must select criteria from SOURCE_MODULE. It must not use one universal acceptance profile.

Universal Wallpaper may require wallpaper type, reference identity, composition, scene, format, and pet permission. FESTIVAL_WALLPAPER is a separate module and its outputs are excluded from QA; do not import Festival Wallpaper outputs or cultural-design batches into QA or LoRA dataset intake.

LoRA Production may require the age-20 reference, dataset diversity, identity consistency, and LoRA-specific dataset rules.

Do not import requirements from another module.

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

Until then, QA remains PAUSED.
