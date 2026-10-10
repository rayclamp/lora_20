# LORA_IMAGE_QA — Image Acceptance Specification

## Purpose

This is the LoRA-specific acceptance profile used by the independent IMAGE_QA system. It evaluates whether an existing candidate image is suitable for the intended LoRA dataset.

## Required comparison context

- Use the reference person image supplied for the same production request.
- Follow the current task contract and applicable `MODULES/LORA_IMAGE/` rules.
- Respect the selected `CHARACTER` option. `INARIA` may use shared CORE information as contextual guidance, but the uploaded image remains the visual identity authority. `NONE` must not apply Inaria-specific identity data.
- Do not assume age 20, a fixed identity, or a permanent reference image.

## Inspection criteria

Check:
- identity consistency against the current uploaded reference;
- face, hair, and other visible identity anchors;
- natural body proportions;
- hand and finger stability;
- foot and toe stability;
- natural object contact and complete wearable connections;
- task framing and requested composition;
- useful dataset diversity and non-redundancy;
- severe artifacts, false limbs, duplicated-body errors, or anatomy/background fusion;
- accidental animals or pets unless explicitly allowed by the current task contract.

## Evidence and uncertainty

Use visible evidence only. Natural occlusion is not automatically a failure. If occlusion or image quality prevents reliable judgment, mark REVIEW rather than guessing.

A clearly visible hard failure cannot PASS.


## Body-shape fidelity and cross-image consistency

Do not equate “anatomically plausible” or “within normal human proportions” with “consistent with the reference person.” Evaluate these as separate criteria.

### Candidate-level shape fidelity
When the body region is visible enough to judge, compare the candidate with the current uploaded reference and any reliable, authorized comparison images. Inspect overall build and relative shape/width of shoulders, arms, torso, waist, pelvis/hips, thighs, calves, ankles, and wrists. Look for unexplained thickening/thinning, added muscularity/fullness, altered body-region ratios, or a changed silhouette that is not reasonably explained by pose, perspective, clothing, lighting, or occlusion.

- PASS: visible body shape is consistent with the supported reference evidence, allowing natural pose-dependent differences.
- REVIEW: visibility, crop, clothing, perspective, or pose prevents a reliable judgment.
- REPAIR or REJECT: use only when the visible deviation is material and the applicable QA decision criteria support that outcome. Do not reject solely because two different poses have non-identical silhouettes.

### Cross-image / dataset-level review
When a same-person candidate set and its reference are available, inspect consistency across the set, not only one image at a time. Look for recurring or isolated unexplained drift in facial identity, apparent age, body build, limb thickness, body-region ratios, and rendering style. Also inspect near-duplicates, useful variation, framing coverage, and whether the set repeatedly omits views needed to assess important features.

Keep the two decisions separate:
1. Candidate-level QA: Is this image individually acceptable and consistent with its available evidence?
2. Dataset-level QA: Does this image fit the intended same-person dataset, and does the set as a whole have coherent stable traits and useful non-redundant coverage?

If the comparison set, reference, or required views are unavailable, record the dataset-level check as NOT_ASSESSED / pending rather than claiming that cross-image consistency has passed. Do not infer unseen body regions from a crop. Preserve individual candidate decisions and the dataset-level assessment as distinct records.

### Dataset suitability boundary
A candidate that passes basic anatomy checks may still be unsuitable for the same-person dataset if it has a material, unexplained shape or identity drift. A candidate should not be marked unsuitable merely because normal pose, perspective, clothing, or occlusion changes its apparent contour. Use visible evidence and REVIEW when evidence is insufficient.

## Result classification

- `PASS`: applicable criteria pass and no material unresolved issue remains.
- `REVIEW`: evidence is insufficient for a reliable decision.
- `REPAIR`: a localized defect may be correctable through a separately authorized rework process.
- `REJECT`: the candidate is materially unsuitable or outside the authorized repair path.

Generation SUCCESS is not QA PASS. QA results do not retroactively change generation status.

## Preservation and action boundary

Inspect and report; do not silently overwrite or delete the original candidate. Do not generate a replacement, modify the locked prompt, or trigger regeneration as a consequence of QA. Any repair must create a new candidate/version and preserve the original audit trail.
