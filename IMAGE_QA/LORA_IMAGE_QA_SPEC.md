# LORA_IMAGE_QA — Image Acceptance Specification

## Status and role

This is the LoRA-specific acceptance profile for the independent IMAGE_QA system. It defines how to assess existing candidates and, when explicitly requested and adequately supplied, a defined dataset. It does not activate QA.

QA is not production. It does not generate images, rewrite locked prompts, silently edit/delete candidates, repair images, or trigger regeneration. Generation SUCCESS and QA acceptance are separate states.

## Required context and reference policy

For candidate-level QA, use the reference image supplied for the same production request, the current task contract, and applicable `MODULES/LORA_IMAGE/` rules.

- Respect the selected `CHARACTER` option.
- For `CHARACTER=INARIA`, shared CORE data may provide context but must not override the uploaded image's visual identity.
- For `CHARACTER=NONE`, do not apply Inaria-specific identity data.
- Do not assume age 20, a fixed identity, or a permanent GitHub-stored reference.
- Do not impose a fixed camera gaze, face angle, pose, or framing unless explicitly required by the task.
- If the reference, task contract, or candidate binding is missing or ambiguous, do not guess.

## Candidate-level inspection criteria

Assess only what can be supported by visible evidence:

1. image validity, subject/task binding, and requested output;
2. limb count and topology;
3. hands, fingers, wrists, palms, handedness, and required object contact;
4. legs, feet, toes, and support;
5. identity anchors, face, hair, and apparent age when specified;
6. reference-supported body-shape fidelity;
7. object contact and complete wearable connections;
8. clothing/accessory/task requirements and accidental animals/pets;
9. composition, framing, and rendering style;
10. severe artifacts, false limbs, duplicated-body errors, and anatomy/background fusion.

### Body-shape fidelity is not generic anatomy plausibility

Do not equate “anatomically plausible,” “natural proportions,” or “within normal human proportions” with “consistent with the reference person.”

Where visible and supported by the correct reference, compare overall build and the relative shape/width of shoulders, upper arms/forearms, torso/waist, pelvis/hips, thighs/calves, ankles, and wrists. Look for unexplained thickening/thinning, changed fullness or muscularity, altered body-region ratios, or material silhouette drift.

Before judging a difference, consider pose, perspective, foreshortening, framing, clothing, lighting, and occlusion. Do not demand identical silhouettes across different poses, infer unseen anatomy, or invent numeric tolerances.

- `PASS`: visible body shape is consistent with supported reference evidence and natural pose-dependent differences are allowed.
- `REVIEW`: visibility or comparison context prevents a reliable judgment.
- `REPAIR` / `REJECT`: use only when evidence supports a material defect and the applicable decision criteria support that outcome.

A plausible single image may still have unexplained body-shape drift relative to the intended person or dataset.

## Candidate-level result

Use exactly one primary result:
- `PASS`
- `REVIEW`
- `REPAIR`
- `REJECT`

Use `QA_INPUT_INCOMPLETE` for missing required inputs and `QA_DATA_CONFLICT` for conflicting authoritative requirements. Natural occlusion is not automatically failure; uncertainty must not be reported as PASS.

## Dataset-level review

Dataset-level QA is separate from candidate-level QA. It must receive a defined dataset scope/version or snapshot, the exact candidate/image IDs and links, applicable reference image(s), candidate-to-reference mapping, candidate-level QA results where available, dataset purpose, and applicable stable-trait/allowed-variation rules.

Review cross-image consistency of identity, apparent age when specified, body build, limb thickness, body-region ratios, and rendering style. Also inspect near-duplicates, superficial-only variation, and useful framing/viewpoint/pose coverage. Distinguish real drift from expected pose, perspective, clothing, lighting, and occlusion effects.

Record a separate `DATASET_RESULT`:
- `PASS`: coherent stable traits and useful non-redundant variation, with no material unexplained drift.
- `REVIEW`: evidence is ambiguous or incomplete.
- `REPAIR`: a separately authorized curation/rework action may address identified issues.
- `REJECT`: the set or identified candidates are materially unsuitable for the stated purpose.
- `NOT_ASSESSED`: essential comparison images, reference mapping, candidate set, or other required evidence is unavailable.

Never infer dataset PASS from individual candidate PASS. Candidate and dataset outcomes must be persisted separately. Dataset-level results must identify the exact candidate set/snapshot and must not overwrite prior results.

## Evidence and preservation

Record concrete observations, applicable rules, affected regions/candidate IDs, reason codes, severity, comparison limitations, timestamp, reviewer/system provenance, and profile/protocol version as applicable. Do not infer unseen anatomy.

Original images, generation events, candidate-level results, and earlier dataset reviews must be preserved. Corrections are timestamped amendments. Any separately authorized repair creates a new candidate/version and requires a new inspection.

See `00_MASTER/QA_PROTOCOL.md` for the full input, decision, persistence, and activation contract.
