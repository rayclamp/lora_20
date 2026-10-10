# QA_MODULE.md — Independent Quality Assurance Module

## Status

**PAUSED**

This document defines governance and scope only. Updating QA specifications does not activate a QA run, executable automation, production workers, repair, or regeneration.

## Purpose and ownership

QA is independent of image production.

- Production determines whether an image result was received and durably recorded.
- Candidate-level QA determines whether one existing image meets its applicable acceptance criteria.
- Dataset-level QA determines whether a defined collection of candidates has coherent stable traits and useful, non-redundant coverage for its stated dataset purpose.

Generation SUCCESS is never retroactively changed by a later QA result. QA does not generate images, rewrite locked prompts, automatically repair candidates, or trigger regeneration.

## Architecture

Production → GENERATION SUCCESS / IMAGE_CREATED → Candidate-level QA

A separate, optional dataset-level review compares a defined candidate set and records its own result. Dataset-level QA supplements candidate-level inspection; it does not replace or overwrite individual results.

## Scope

The initial QA profile is `LORA_IMAGE_QA`, defined by:
- `IMAGE_QA/MODULE.md`
- `IMAGE_QA/LORA_IMAGE_QA_SPEC.md`
- `IMAGE_QA/LORA_IMAGE_QA_CHECKLIST.md`
- `00_MASTER/QA_PROTOCOL.md`

`FESTIVAL_WALLPAPER` is explicitly out of scope for this QA pipeline and must never be routed into the LoRA dataset pipeline. Other production modules are not QA-eligible by default; a separate scope decision and acceptance profile are required.

## Core dependencies

When activated, QA loads CORE, the applicable source-module rules, the task contract and metadata, the correct reference image for the relevant task, and the applicable QA profile. Load only relevant rules; do not import unrelated module requirements.

The reference image supplied for the current production request is the visual authority for that request. Do not substitute a GitHub-stored canonical image or assume a permanent person, identity, age, or age-20 baseline. For `CHARACTER=INARIA`, shared CORE information may provide context but must not override the uploaded image's visual identity. For `CHARACTER=NONE`, do not apply Inaria-specific identity data.

## Candidate-level result semantics

Use exactly one primary candidate result:
- `PASS`: applicable criteria are met and no material unresolved issue remains.
- `REVIEW`: evidence is ambiguous or insufficient for a reliable judgment.
- `REPAIR`: a localized defect may be addressed through a separately authorized rework process.
- `REJECT`: the candidate is materially unsuitable or outside the authorized repair path.

Missing required input must be reported as `QA_INPUT_INCOMPLETE`; conflicting authoritative requirements as `QA_DATA_CONFLICT`. Do not turn missing evidence into PASS.

## Dataset-level result semantics

Record a separate `DATASET_RESULT`:
- `PASS`: the reviewed set has sufficiently coherent stable traits and useful variation, with no material unexplained drift.
- `REVIEW`: comparison evidence is ambiguous or incomplete.
- `REPAIR`: a separately authorized curation/rework action may address identified issues.
- `REJECT`: the reviewed set or identified candidates are materially unsuitable for the stated dataset purpose.
- `NOT_ASSESSED`: the required comparison set, reference mapping, or other essential evidence is unavailable.

A dataset-level result must never overwrite, replace, or be inferred from candidate-level results. Candidate-level PASS does not imply dataset-level PASS.

## Reference-supported body-shape fidelity

Anatomical plausibility and consistency with the reference person are separate checks. Where visible and supported by the reference, assess overall build and relative shape/width of shoulders, arms, torso/waist, pelvis/hips, thighs/calves, ankles, and wrists. Look for unexplained thickening, thinning, muscularity/fullness changes, body-region ratio shifts, or silhouette drift.

Consider pose, perspective, foreshortening, framing, clothing, lighting, and occlusion before deciding that a difference is a genuine mismatch. Do not demand identical silhouettes across different poses, infer unseen anatomy, or invent numeric tolerances. If evidence is not reliable, use REVIEW or NOT_ASSESSED as applicable.

## Inspection priority

1. image validity and subject/task binding;
2. limb count and topology;
3. hands, fingers, wrists, palms, and handedness;
4. legs, feet, toes, and support;
5. body-shape fidelity and body-region relationships;
6. object contact and wearable connections;
7. false limbs and anatomy/background fusion;
8. identity and reference consistency;
9. clothing, accessories, and task requirements;
10. composition, framing, and rendering style;
11. dataset consistency, redundancy, and coverage when a dataset review is requested.

## Evidence, preservation, and repair boundary

Every non-PASS candidate result must record concrete evidence, result/reason code, severity, affected region, applicable rule, and recommended next action. Dataset-level reports must identify the reviewed candidate set, references and mappings, evidence, unresolved areas, and dataset result.

QA must not silently overwrite, delete, crop away, or regenerate an original candidate. A repair must create a new candidate/version and receive a new inspection. Preserve original generation events and prior QA results; corrections must be timestamped amendments rather than silent replacement.

## Activation requirements

Before activation, confirm the input contract, source-module metadata, reference access and mapping, candidate-level protocol, dataset-level comparison contract when needed, result/state contract, durable report storage, audit trail, and actual execution capability.

The written contract does not prove that an executable runner can compare image sets or write the required records. Until these conditions are explicitly verified and activation is authorized, QA remains **PAUSED**.
