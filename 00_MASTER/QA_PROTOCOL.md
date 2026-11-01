# QA_PROTOCOL.md — Independent Visual QA Protocol

## Status

**PAUSED**

This protocol defines future QA inputs, decisions, evidence, and persistence. It does not activate QA or prove that a compatible execution runner exists.

## 1. Scope gate

The initial eligible profile is `LORA_IMAGE_QA`. Scope eligibility, non-overridable CORE/safety rules, and QA activation are mandatory gates, not preferences that a Task can override. Other source modules require separate explicit scope approval and a corresponding acceptance profile; an individual Task or metadata field does not grant scope.

`FESTIVAL_WALLPAPER` is excluded. If `SOURCE_MODULE=FESTIVAL_WALLPAPER`, stop with `QA_SOURCE_MODULE_OUT_OF_SCOPE`; do not inspect, classify, repair, or route the image into the LoRA dataset pipeline. Preserve the original result.

## 2. Required inputs and authority

### Candidate-level input

A candidate review must identify:
- `QA_REVIEW_ID`
- `TASK_ID`, authoritative `CANDIDATE_ID` / `IMAGE_REFERENCE` or result identifier, and verifiable candidate-to-Task/result association;
- the candidate image actually available for inspection (not merely a claimed file or status);
- authoritative `SOURCE_MODULE` and the corresponding approved QA scope/profile;
- observed `GENERATION_RESULT`, the original applicable Task contract and explicit requirements, and their source/version where available;
- the correct `APPLICABLE_REFERENCE_IMAGE` for the same production request and verified candidate-to-reference mapping, when required;
- selected character option and the applicable CORE, safety, source-module, and QA rules;
- locked prompt/design metadata and expected output format, when available, treated as applicable Task evidence rather than permission to override CORE or to infer visual compliance;
- QA profile/protocol version and expected report location.

Missing or unreadable required input, candidate-to-Task binding, or reference mapping → `QA_INPUT_INCOMPLETE` for the affected review. Genuine contradictory authoritative requirements that cannot be reconciled within their proper scope → `QA_DATA_CONFLICT`. Evidence sufficient to start an otherwise authorized review but insufficient for a particular visual judgment → `REVIEW` for the candidate, or `REVIEW` / `NOT_ASSESSED` for the affected dataset evaluation as applicable. Do not use a QA judgment to conceal absent prerequisites, and do not guess or invent missing data.

### Authority and applicability — layered rules, not a single interchangeable ranking

1. **Mandatory gates:** applicable CORE/safety rules, QA's `PAUSED` activation status, approved source-module scope, and preservation boundaries are not overridden by a Task, candidate metadata, or reference image.
2. **Source-module requirements:** identify the candidate's verified `SOURCE_MODULE`, load only the authorized module's rules and its corresponding QA acceptance profile; no unrelated module, festival asset, or LoRA requirement may be imported into another module.
3. **Task-specific contract:** the correctly matched original Task and its authoritative requirements define intended output format, subject, permitted changes, clothes, pose, scene, and other explicit Task constraints within the mandatory gates and applicable module rules. Non-authoritative summaries or later guesses cannot silently replace the locked Task contract.
4. **Visual identity authority:** when the source module and Task require a person-reference, the correct image supplied for that production request and explicitly mapped to the candidate governs the person's observable visual identity. CORE character text and generic appearance metadata are semantic context only; they do not override this visual reference.
5. **QA acceptance/inspection:** the authorized candidate-level or dataset-level QA profile defines how the correctly identified candidate or dataset is assessed; it does not rewrite production rules, replace the Task, override reference identity, or convert a generation result into QA PASS.
6. **Supplementary information:** optional metadata, prior chat recollections, and unsupported descriptions are not substitutes for verified requirements or evidence and cannot resolve a conflict by assertion.

Apply authority **by purpose**: gates decide whether review is permitted, the original Task defines required variation, the correctly mapped image defines reference identity, and the applicable QA profile defines the inspection/decision method. If genuinely contradictory authoritative requirements remain after this separation, record `QA_DATA_CONFLICT` and stop or isolate the affected review; do not silently pick whichever document appears first.

### Reference identity policy

Use **only the correct visual-reference image supplied for that production request and reliably mapped to the candidate**. Do not substitute a GitHub-stored canonical reference, an earlier conversation's image, an unrelated candidate's image, or a guessed permanent person/age. For `CHARACTER=INARIA`, shared CORE character text is contextual/semantic guidance and must not override the uploaded reference's visually supported identity. For `CHARACTER=NONE`, do not apply Inaria-specific identity data.

The Task's authorized hairstyle arrangements, clothing, pose, framing, scene, and accessories need not duplicate the reference image unless the Task explicitly says so; judge identity against visible, relevant anchors without treating all reference presentation details as mandatory. When the required image or candidate-to-reference mapping is missing, inaccessible, or ambiguous, mark `QA_INPUT_INCOMPLETE` and do not improvise a substitute. When the correct reference and mapping exist but an individual feature cannot be reliably compared due to occlusion, angle, crop, or lighting, record `REVIEW` or dataset-level `NOT_ASSESSED` for that uncertainty instead of guessing.

## 3. Candidate-level inspection sequence

### A. Image validity and task binding
Confirm that the image exists and is readable, and verify its correct SOURCE_MODULE, CANDIDATE_ID / result identifier, original Task association, and applicable reference mapping against authoritative, directly available evidence. Then compare its depicted subject and task requirements. A claimed SUCCESS label, prior Worker narrative, memory, or file-name resemblance alone does not establish Task/candidate binding. If the required image or binding is unavailable, use the input gate rather than inspecting an assumed image.

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

A clearly visible hard failure cannot PASS. A missing required image/Task/reference is `QA_INPUT_INCOMPLETE`, not a visual REJECT; contradictory applicable authoritative requirements are `QA_DATA_CONFLICT`, not a discretionary quality grade. When required inputs exist but visibility leaves an inspection judgment uncertain, use REVIEW with the specific evidentiary limitation. Do not fail naturally hidden anatomy or claim that an unseen region passed.

Example reason codes and intake-gate disposition:
- **Input gate, no visual QA result:** `QA_INPUT_INCOMPLETE` when any required image, reference/mapping, Task binding or Task metadata is missing or unreadable. Use `REFERENCE_MISSING` or `TASK_METADATA_MISSING` only as supporting intake reasons where accurate, **not** as `REVIEW` reason codes. Missing optional metadata alone is not an input failure.
- **Authority gate, no visual QA result:** `QA_DATA_CONFLICT` for irreconcilable contradictory authoritative requirements; do not classify it as a discretionary image-quality outcome.
- REVIEW (required inputs available, visual evidence uncertain): `OCCLUSION_AMBIGUITY`, `HANDEDNESS_AMBIGUITY`, `IDENTITY_COMPARISON_UNCERTAIN`, `BODY_SHAPE_COMPARISON_UNCERTAIN`, `BACKGROUND_FUSION_UNCERTAIN`.
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

Do not assume all candidates share the same reference if their original Task contracts say otherwise. Verify dataset scope/snapshot, candidate IDs, source-module eligibility, and each candidate-to-reference mapping before cross-image judgment. If required mapping or comparison inputs are missing, identify the affected comparisons as unresolved with `QA_INPUT_INCOMPLETE` for required intake failures or dataset-level `NOT_ASSESSED` when meaningful comparison cannot be performed; do not transfer candidate-level PASS to the dataset or invent a shared identity.

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

QA identifies and reports defects. A separately authorized repair/rework process performs any repair; QA neither edits original images nor triggers generation. A repaired result is a new candidate/version and requires a new inspection. Candidate-level results and separately requested dataset-level assessment remain independent records, and neither may overwrite original production evidence. All these procedures remain inoperative while QA is PAUSED.

Production:
`TASK → DESIGN → PROMPT → GENERATE → IMAGE_RESULT_RECORDED / SUCCESS`

Candidate QA:
`EXISTING CANDIDATE → INSPECT → PASS / REVIEW / REPAIR / REJECT`

Dataset QA:
`DEFINED CANDIDATE SET → CROSS-IMAGE REVIEW → DATASET_RESULT`

QA outcomes do not retroactively change production generation status and do not trigger regeneration.

## 10. Stop conditions and activation boundary

Stop or mark only the affected review/scope unresolved when the source module is out of scope, the candidate image, required reference, original Task contract, Task/candidate mapping, or authoritative rule is missing or contradictory:
- `QA_SOURCE_MODULE_OUT_OF_SCOPE`: source module is excluded; in particular, FESTIVAL_WALLPAPER must never be admitted to the LoRA QA or dataset pipeline.
- `QA_INPUT_INCOMPLETE`: a required candidate/Task/reference input is missing, unreadable, or cannot be reliably mapped.
- `QA_DATA_CONFLICT`: two applicable authoritative requirements genuinely conflict after respecting mandatory gates and the distinct purposes of Task, reference, and QA profile.
- `REVIEW`: eligible candidate inputs exist, but visible evidence is ambiguous or insufficient for a particular quality decision.
- dataset-level `NOT_ASSESSED` or `REVIEW`: essential comparison set/mapping is unavailable or the supported cross-image evidence is inconclusive, respectively.
Do not equate unverified data with a visible defect, mark missing inputs as PASS/REJECT, imply that an unseen region passed, or claim that an inspection was performed when its evidence was unavailable.

Before activation, verify:
- candidate and dataset input contracts;
- reference access and candidate-to-reference mapping;
- applicable source-module scope and acceptance profile;
- candidate and dataset result contracts;
- durable report storage and read-back;
- audit and preservation behavior;
- actual execution capability for the requested review type.

This protocol defines a contract, not proof of executable capability. QA remains **PAUSED** until the required capabilities are verified and activation is explicitly authorized.
