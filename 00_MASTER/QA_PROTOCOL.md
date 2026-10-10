# QA_PROTOCOL.md — Independent Visual QA Protocol

## Status

**PAUSED**

This protocol defines future QA inputs, decisions, evidence, and persistence. It does not activate QA or prove that a compatible execution runner exists.

## 1. Scope gate

The initial eligible profile is `LORA_IMAGE_QA`. Other source modules require explicit scope approval and a corresponding acceptance profile.

`FESTIVAL_WALLPAPER` is excluded. If `SOURCE_MODULE=FESTIVAL_WALLPAPER`, stop with `QA_SOURCE_MODULE_OUT_OF_SCOPE`; do not inspect, classify, repair, or route the image into the LoRA dataset pipeline. Preserve the original result.

## 2. Required inputs and authority

### Candidate-level input

A candidate review must identify:
- `QA_REVIEW_ID`
- `TASK_ID` and the authoritative `CANDIDATE_ID` / `IMAGE_REFERENCE` or result identifier
- `SOURCE_MODULE`
- `GENERATION_RESULT` and current task requirements
- the correct `APPLICABLE_REFERENCE_IMAGE`, when required
- selected character option and applicable module rules
- prompt/design metadata and expected output format, when available
- QA profile/protocol version and expected report location

Missing required input → `QA_INPUT_INCOMPLETE`. Conflicting authoritative requirements → `QA_DATA_CONFLICT`. Do not guess or invent missing data.

### Authority order

1. explicit current task requirements;
2. CORE rules;
3. applicable source-module protocol/rules;
4. approved reference assets for the relevant task;
5. task metadata;
6. QA acceptance profile and inspection guidance;
7. non-authoritative metadata.

A conflict between authoritative sources must be reported as `QA_DATA_CONFLICT`.

### Reference identity policy

Use the reference image supplied for the same production request. Do not substitute a GitHub-stored canonical reference or assume a permanent identity, person, or age. For `CHARACTER=INARIA`, shared CORE data may provide context but must not override the uploaded image's visual identity. For `CHARACTER=NONE`, do not apply Inaria-specific identity data.

If a candidate-to-reference mapping is missing or ambiguous, do not silently choose a reference. Record the missing evidence and use the appropriate incomplete-input or uncertain result.

## 3. Candidate-level inspection sequence

### A. Image validity and task binding
Confirm that the image exists, is readable, depicts the expected subject, and can be reliably associated with the intended Task/candidate.

### B. Limb topology
Check for extra/missing limbs, false limbs, and traceable shoulder-to-hand and hip-to-foot paths where visible.

### C. Hands and fingers
For each sufficiently visible hand, inspect left/right consistency, shoulder-arm-wrist-palm continuity, natural wrist and palm structure, finger separation/count, orientation, and required hand-object contact. Five fingers are expected only when the hand is sufficiently visible to assess them. Natural occlusion that prevents reliable judgment is uncertainty, not automatic failure.

### D. Legs, feet, toes, and support
Inspect hip-thigh-knee-calf-ankle-foot continuity, natural support, severe twisting or entanglement, and toes only when sufficiently visible. Covered toes and fully enclosed shoes are not automatic failures.

### E. Reference-supported body-shape fidelity
Anatomical plausibility is not the same as consistency with the reference person. When supported by visible evidence, compare overall build and relative shape/width of shoulders, upper arms/forearms, torso/waist, pelvis/hips, thighs/calves, ankles, and wrists. Look for unexplained thickening/thinning, changed fullness or muscularity, altered body-region ratios, or material silhouette drift.

Before deciding that a difference is genuine, account for pose, viewpoint/perspective, foreshortening, crop, clothing, lighting, and occlusion. Do not require identical silhouettes across different poses, infer hidden anatomy, or invent numeric tolerances. If comparison is unreliable, use `REVIEW`.

### F. Objects and wearables
Check plausible hand-object contact, coherent object structure, complete straps/attachments, natural strap-to-body contact, and absence of floating or body-penetrating wearables.

### G. Anatomy readability and background fusion
Check whether visible hands/feet and limb origins can be distinguished from branches, wires, rails, foliage, dense textures, particles, straps, props, or background edges. Ambiguous evidence → `REVIEW`; clearly malformed structure → classify according to severity.

### H. Identity and reference consistency
Compare identity anchors, face, hair, apparent age when specified, body build, and other required characteristics against the correct reference. Do not impose a fixed face angle, camera gaze, pose, camera angle, or framing unless the task explicitly requires it.

### I. Clothing, accessories, and task requirements
Check required items, coherent construction, physical attachment, absence of accidental identity-changing elements, and current task-specific constraints. Apply only requirements registered for the identified source module.

### J. Composition and rendering
Check requested output format, framing, subject placement, composition, and applicable rendering style. A FULL-BODY requirement does not mean the subject must be unnecessarily distant.

## 4. Candidate-level result

Assign exactly one primary result:
- `PASS`: all applicable criteria pass and no material unresolved issue remains.
- `REVIEW`: evidence is insufficient or ambiguous for a reliable judgment.
- `REPAIR`: a localized defect may be addressed through a separately authorized rework process.
- `REJECT`: the candidate is materially unsuitable or outside the authorized repair path.

A clearly visible hard failure cannot PASS. Do not fail naturally hidden anatomy or claim that an unseen region passed.

Example reason codes:
- REVIEW: `OCCLUSION_AMBIGUITY`, `HANDEDNESS_AMBIGUITY`, `IDENTITY_COMPARISON_UNCERTAIN`, `BODY_SHAPE_COMPARISON_UNCERTAIN`, `BACKGROUND_FUSION_UNCERTAIN`, `REFERENCE_MISSING`, `TASK_METADATA_MISSING`.
- REPAIR: `HAND_LOCAL_DEFECT`, `FINGER_LOCAL_DEFECT`, `FOOT_LOCAL_DEFECT`, `OBJECT_CONTACT_DEFECT`, `WEARABLE_CONNECTION_DEFECT`, `LOCAL_BACKGROUND_FUSION`.
- REJECT: `EXTRA_LIMB`, `MISSING_LIMB`, `SEVERE_HAND_FAILURE`, `SEVERE_FOOT_FAILURE`, `WRONG_HAND_TOPOLOGY`, `FALSE_LIMB`, `SEVERE_PROPORTION_FAILURE`, `MATERIAL_BODY_SHAPE_DRIFT`, `MAJOR_IDENTITY_MISMATCH`, `MAJOR_MODULE_RULE_VIOLATION`, `DATASET_UNSUITABLE`.

## 5. Hard gates

A clearly visible image cannot PASS when it has:
- extra/missing limbs or impossible limb topology;
- duplicated, fused, or missing visible fingers/toes when the relevant digits are sufficiently visible;
- obvious false limbs or unsupported floating limbs;
- severe hand, palm, wrist, leg, or foot deformation;
- impossible required hand-object contact;
- broken or body-penetrating wearable structure;
- major identity mismatch;
- a material, unexplained body-shape deviation against reliable reference evidence;
- a major source-module violation.

Do not fail natural occlusion or use a single-image anatomy judgment as a substitute for cross-image consistency.

## 6. Candidate-level evidence and report

Every candidate-level result must record:
- `QA_REVIEW_ID`, `TASK_ID`, candidate/image reference, and `SOURCE_MODULE`;
- primary result and reason code(s);
- severity and affected region;
- concrete visual observation and applicable rule;
- reference used and comparison limitations;
- reviewer/system provenance, timestamp with timezone, and protocol/profile version;
- recommended next action.

Every non-PASS result must contain concrete evidence. If a criterion cannot be assessed, explicitly identify it rather than implying it passed.

## 7. Separate dataset-level assessment

Dataset-level QA is a distinct review of a defined set of candidates intended for the same dataset purpose. It supplements candidate-level results; it never replaces them.

### Required dataset input

- `QA_REVIEW_ID` and `DATASET_ID`;
- dataset scope/version or immutable snapshot identifier;
- dataset purpose and selected character option;
- complete in-scope candidate/task/image IDs and links;
- correct reference image(s) and explicit candidate-to-reference mapping;
- candidate-level QA result references and versions, where available;
- applicable LoRA design/acceptance rules and expected stable traits versus allowed variation;
- requested review dimensions, such as identity, apparent age, body build, limb thickness, body-region ratios, rendering style, near-duplicates, and coverage.

Do not assume all candidates share the same reference if their task contracts say otherwise. If mapping or comparison inputs are missing, identify the affected comparisons as unresolved.

### Dataset-level inspection

Assess coherence of stable traits (identity, age impression where specified, overall body build, relative body-region shape, and rendering style) while allowing intended variation in pose, orientation, crop, clothing, hairstyle arrangement, accessories, scene, expression/gaze, and lighting.

Look for isolated or recurring unexplained drift, near-duplicates, superficial-only variation, and missing useful coverage. Distinguish true drift from pose, perspective, framing, clothing, lighting, and occlusion effects. Do not demand identical silhouettes or rigid quotas across different poses.

A candidate may pass individually but still be a poor fit for the dataset. Conversely, a difference alone is not proof of drift.

### Dataset-level result

Record a separate `DATASET_RESULT`:
- `PASS`: the reviewed set has coherent stable traits and useful, non-redundant variation for its stated purpose, with no material unexplained drift.
- `REVIEW`: evidence is ambiguous or incomplete.
- `REPAIR`: a separately authorized dataset curation/rework action may address the issue; QA itself does not perform it.
- `REJECT`: the set or identified candidates are materially unsuitable for the stated purpose.
- `NOT_ASSESSED`: required comparison images, reference mapping, candidate set, or other essential evidence is unavailable.

Never infer dataset-level PASS from candidate-level PASS, prompt wording, or a general impression. Preserve all individual candidate outcomes.

## 8. Dataset-level record and immutability

Persist each dataset review as a separate, immutable record, separate from production records and individual candidate QA results. Recommended path:

`IMAGE_QA_RECORDS/LORA_IMAGE/<DATASET_ID>/DATASET_QA_RECORD_<QA_REVIEW_ID>.md`

Record at minimum:
- review ID, dataset ID, scope/version or snapshot, timestamp with timezone;
- dataset result and rationale;
- reviewer/system provenance and protocol/profile versions;
- reference identifiers and candidate-to-reference mapping;
- exact candidate/image IDs and links reviewed;
- candidate-level result references, including missing results;
- assessed dimensions, concrete evidence, affected candidate IDs, and severity;
- unassessed dimensions and reasons;
- near-duplicate and coverage findings when in scope;
- recommended next action.

When the dataset changes or a new review is run, create a new record and identify the assessed snapshot; do not overwrite the previous review. Correct a record only through a separately timestamped amendment that preserves the original.

## 9. QA execution behavior and repair boundary

When activated, QA must:
1. inspect the whole image before local details;
2. identify the source module and load only applicable rules;
3. inspect anatomy before cosmetic details;
4. examine ambiguous regions carefully;
5. distinguish visible failure from uncertain evidence;
6. record concrete observations and applicable rules;
7. assign the correct candidate-level or dataset-level result;
8. preserve the original image and audit history;
9. never invent unseen anatomy or silently edit an image.

QA identifies and reports defects. A separately authorized repair/rework process performs any repair. A repaired result is a new candidate/version and requires a new inspection.

Production:
`TASK → DESIGN → PROMPT → GENERATE → IMAGE_RESULT_RECORDED / SUCCESS`

Candidate QA:
`EXISTING CANDIDATE → INSPECT → PASS / REVIEW / REPAIR / REJECT`

Dataset QA:
`DEFINED CANDIDATE SET → CROSS-IMAGE REVIEW → DATASET_RESULT`

QA outcomes do not retroactively change production generation status and do not trigger regeneration.

## 10. Stop conditions and activation boundary

Stop or mark the affected scope unresolved when the image, required reference, task metadata, candidate mapping, or authoritative rule is missing or conflicting. Use `QA_INPUT_INCOMPLETE`, `QA_DATA_CONFLICT`, `REVIEW`, or dataset-level `NOT_ASSESSED` as appropriate. Do not claim a check was performed when its evidence was unavailable.

Before activation, verify:
- candidate and dataset input contracts;
- reference access and candidate-to-reference mapping;
- applicable source-module scope and acceptance profile;
- candidate and dataset result contracts;
- durable report storage and read-back;
- audit and preservation behavior;
- actual execution capability for the requested review type.

This protocol defines a contract, not proof of executable capability. QA remains **PAUSED** until the required capabilities are verified and activation is explicitly authorized.
