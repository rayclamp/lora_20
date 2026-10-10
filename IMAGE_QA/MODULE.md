# IMAGE_QA — Independent Image Inspection System

## Status

**PAUSED**

IMAGE_QA is a separate inspection and quality-control system. This file defines scope and governance; it does not activate an inspection run or prove that an executable runner is available.

## Scope

The initial approved profile is:
- `LORA_IMAGE_QA`: candidate-level inspection of images intended for LoRA training using the reference image for the same production request and the applicable LoRA acceptance criteria.
- Dataset-level review may be performed only when explicitly requested and when a defined candidate set, applicable reference image(s), and candidate-to-reference mapping are available. It is a separate assessment with its own durable result.

Other production modules are not included automatically. Any additional profile requires explicit scope approval and its own acceptance rules.

## Separation from production

- `MODULES/LORA_IMAGE/` defines how LoRA training images should be designed.
- `IMAGE_QA/` defines how existing candidate images are inspected and classified.
- Candidate-level QA decides whether one image meets its criteria.
- Dataset-level QA decides whether a defined set has coherent stable traits and useful, non-redundant coverage.
- Generation success and QA acceptance are separate. A generation SUCCESS is not automatically a QA PASS.
- QA does not generate images, rewrite locked prompts, automatically repair candidates, or trigger regeneration.

## Reference and identity policy

Use the reference image supplied for the relevant production request. Do not substitute a GitHub-stored canonical character reference or assume a fixed person, identity, or age.

For `CHARACTER=INARIA`, shared CORE information may provide context but the uploaded image remains the visual identity authority. For `CHARACTER=NONE`, do not apply Inaria-specific identity data.

If a reference, task contract, candidate binding, or dataset mapping is missing or ambiguous, do not guess. Report incomplete input or uncertainty as defined by `00_MASTER/QA_PROTOCOL.md`.

## Body-shape fidelity and dataset consistency

Anatomical plausibility is not sufficient evidence of reference fidelity. When visible, compare the candidate's overall build and relative body-region shape/width with the correct reference, including shoulders, arms, torso/waist, pelvis/hips, thighs/calves, ankles, and wrists. Account for pose, perspective, framing, clothing, lighting, and occlusion; do not infer unseen anatomy or require identical silhouettes across different poses.

Dataset-level review must be separate from candidate-level decisions. A candidate may pass individually yet still be inconsistent with the intended set. If the required comparison set or reference mapping is unavailable, record dataset-level `NOT_ASSESSED` or `REVIEW`, not PASS.

## Result and preservation rules

Candidate-level result: `PASS`, `REVIEW`, `REPAIR`, or `REJECT`.

Dataset-level result: `PASS`, `REVIEW`, `REPAIR`, `REJECT`, or `NOT_ASSESSED`.

Persist dataset reviews separately from individual candidate results and production records. Identify the exact candidate set/snapshot and preserve reference mappings, evidence, and unresolved items. Do not overwrite original images or earlier review records. A separately authorized repair creates a new candidate/version and requires new inspection.

## Governing documents

- `00_MASTER/QA_MODULE.md`: shared governance, scope, and activation requirements.
- `00_MASTER/QA_PROTOCOL.md`: full input, inspection, decision, persistence, and audit contract.
- `LORA_IMAGE_QA_SPEC.md`: LoRA-specific acceptance profile.
- `LORA_IMAGE_QA_CHECKLIST.md`: operational checklist.

The written rules do not prove that automated cross-image comparison or durable report writing is implemented. Verify execution capability before activation. QA remains **PAUSED** until activation is explicitly authorized.
