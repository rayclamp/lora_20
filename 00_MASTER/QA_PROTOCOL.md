# QA_PROTOCOL.md — Codex-Assisted Visual QA Protocol

## Status

**PAUSED**

Defines future QA execution. It does not activate QA.

## 1. Required input

A QA task should contain:
- TASK_ID
- SOURCE_MODULE
- IMAGE_REFERENCE
- GENERATION_RESULT
- CURRENT_TASK_REQUIREMENTS
- APPLICABLE_REFERENCE_IMAGE when required
- PROMPT_OR_DESIGN_METADATA when available
- EXPECTED_OUTPUT_FORMAT when applicable

Missing required input → QA_INPUT_INCOMPLETE.

## 2. Authority order

**Source-module scope gate:** `FESTIVAL_WALLPAPER` is excluded from this QA pipeline. Do not inspect, classify, repair, or route Festival Wallpaper outputs through this protocol, and never send them into the LoRA dataset pipeline. If a task identifies `SOURCE_MODULE=FESTIVAL_WALLPAPER`, stop with `QA_SOURCE_MODULE_OUT_OF_SCOPE` and preserve the original candidate unchanged.

1. explicit current task requirements;
2. CORE rules;
3. source-module protocol/rules;
4. approved reference assets;
5. task metadata;
6. QA inspection guidance;
7. non-authoritative metadata.

Conflict between authoritative sources → QA_DATA_CONFLICT.

## 3. Inspection sequence

### A. Image validity
Confirm the image exists, is readable, and contains the expected subject.

### B. Limb topology
Check two arms/hands and two legs/feet where applicable; no extra/missing limbs; traceable shoulder-to-hand and hip-to-foot paths; no false limbs.

### C. Hands and fingers
For every sufficiently visible hand:
- correct anatomical left/right side;
- natural shoulder → arm → wrist → palm connection;
- natural wrist/palm;
- five fingers when fully visible;
- no fused, duplicated, or missing fingers;
- natural attachment/orientation;
- correct hand-object contact when required.

Natural occlusion that prevents reliable counting → REVIEW.

### D. Legs, feet, toes
Check hip → thigh → knee → calf → ankle → foot continuity, natural support, no severe twisting/entanglement, and five toes when a bare foot is sufficiently visible.

Covered toes and fully enclosed shoes are NOT automatic failures.

### E. Body proportions
Check natural proportions, no stretched thighs/calves, no vertically stretched body, and no conversion of slimness into exaggerated long legs.

### F. Objects and wearables
Check real hand-object contact, coherent handles/containers, complete straps, natural strap-to-body contact, and no floating or body-penetrating wearables.

### G. Anatomy readability
Check whether hands and feet remain visually separable from branches, wires, rails, foliage, dense textures, particles, straps, props, or background edges.

Ambiguous evidence → REVIEW.
Clearly malformed structure → failure classification.

### H. Identity/reference
When a reference is required, compare identity, face, apparent age when specified, hair, body proportions, and required identity characteristics.

Do not require identical camera angle, pose, or framing unless the task explicitly requires it.

For realistic references, do not infer a fixed face-angle requirement from the reference.

### I. Clothing/accessories
Check required clothing, coherent structure, physical attachment, and absence of accidental identity-changing elements.

### J. Composition
Apply the source module's composition requirements. For wallpaper tasks, verify format, framing, subject placement, and FULL-BODY does not imply unnecessarily distant framing.

### K. Module-specific rules
Apply only the rules registered for SOURCE_MODULE. Examples include Anime vs Realistic rendering, festival restrictions, pet permission, and LoRA dataset requirements.

## 4. Result classification

Use exactly one primary result:
- PASS
- REVIEW
- REPAIR
- REJECT

REVIEW reasons may include:
- OCCLUSION_AMBIGUITY
- HANDEDNESS_AMBIGUITY
- IDENTITY_COMPARISON_UNCERTAIN
- BACKGROUND_FUSION_UNCERTAIN
- REFERENCE_MISSING
- TASK_METADATA_MISSING

REPAIR reasons may include:
- HAND_LOCAL_DEFECT
- FINGER_LOCAL_DEFECT
- FOOT_LOCAL_DEFECT
- OBJECT_CONTACT_DEFECT
- WEARABLE_CONNECTION_DEFECT
- LOCAL_BACKGROUND_FUSION

REJECT reasons may include:
- EXTRA_LIMB
- MISSING_LIMB
- SEVERE_HAND_FAILURE
- SEVERE_FOOT_FAILURE
- WRONG_HAND_TOPOLOGY
- FALSE_LIMB
- SEVERE_PROPORTION_FAILURE
- MAJOR_IDENTITY_MISMATCH
- MAJOR_MODULE_RULE_VIOLATION
- DATASET_UNSUITABLE

## 5. Hard gates

A clearly visible image cannot PASS when it has:
- extra/missing limb;
- duplicated/fused/missing visible fingers;
- duplicated/fused/missing visible toes;
- impossible limb topology;
- obvious false limb;
- unsupported floating limb;
- severe hand/palm/wrist deformation;
- severe leg/foot deformation;
- impossible required hand-object contact;
- broken/body-penetrating wearable structure;
- major identity mismatch;
- major source-module violation.

Do not fail naturally hidden anatomy.

## 6. Codex behavior

Codex should:
1. inspect the whole image first;
2. identify SOURCE_MODULE;
3. load only applicable requirements;
4. inspect anatomy before cosmetic details;
5. examine ambiguous regions carefully;
6. distinguish visible failure from uncertain evidence;
7. record concrete evidence;
8. assign one primary result;
9. record the affected region;
10. never invent unseen anatomy;
11. never silently edit the image.

## 7. Evidence

Every non-PASS result records:
- RESULT
- REASON_CODE
- SEVERITY
- REGION
- OBSERVATION
- APPLICABLE_RULE
- RECOMMENDED_NEXT_ACTION

## 8. Repair boundary

QA identifies the problem. A separate repair/rework process performs the repair.

QA must not overwrite, silently regenerate, crop away a defect, or declare a repaired image PASS without a new inspection.

Repair flow:
Original Candidate → Repair → New Candidate → New QA Inspection.

## 9. Audit

The original generation event remains immutable.

Example:
Generation SUCCESS → IMAGE_CREATED
QA REPAIR
Repair creates NEW_CANDIDATE
QA PASS

The original generation was still a successful generation.

## 10. Stop conditions

Stop when the image, required reference, or required metadata is unavailable, or authoritative requirements conflict.

Use QA_INPUT_INCOMPLETE, QA_DATA_CONFLICT, or REVIEW as applicable.

## 11. Production boundary

Production:
TASK → DESIGN → PROMPT → GENERATE → SUCCESS → IMAGE_CREATED

QA:
IMAGE_CREATED → INSPECT → PASS / REVIEW / REPAIR / REJECT

Production Workers do not cross into QA.

## 12. Codex runtime

When activated, Codex loads CORE, this protocol, the source-module rules, applicable references, and task metadata.

It must not load unrelated module rules.


## 17. Separate Candidate-Level and Dataset-Level QA

These are two different assessments with different inputs and separately persisted outcomes. A candidate-level result MUST NOT be silently reused as a dataset-level result.

### 17.1 Candidate-level assessment

Candidate-level QA evaluates one existing image against that Task's requirements, the correct reference for the same production request, and the applicable acceptance profile.

Required identifiers and evidence:
- `QA_REVIEW_ID`
- `TASK_ID` and `CANDIDATE_ID` (or the authoritative existing image/result identifier)
- `SOURCE_MODULE`
- `IMAGE_REFERENCE`
- the current task's uploaded `APPLICABLE_REFERENCE_IMAGE`, when required
- applicable task requirements and QA profile/version
- inspection result, evidence, reason codes, affected regions, and reviewer/system provenance

Candidate-level output uses the existing primary result contract: `PASS`, `REVIEW`, `REPAIR`, or `REJECT`. If required evidence is missing, do not invent a PASS; use the applicable incomplete-input or uncertainty state.

### 17.2 Dataset-level assessment

Dataset-level QA evaluates a defined set of candidates intended to represent the same person or character. It supplements, and does not replace, candidate-level inspections.

Required input:
- `DATASET_ID` and a stable dataset scope/version or snapshot identifier;
- the selected character option and dataset purpose;
- the correct reference image supplied for the relevant production request(s), plus provenance identifying which reference applies to which candidates;
- the complete set of in-scope `CANDIDATE_ID` / `TASK_ID` / image references being compared;
- existing candidate-level QA results and their versions, where available;
- applicable LoRA design/acceptance rules and the expected stable traits versus allowed variation;
- the requested review scope, such as identity, apparent age, body build, limb thickness, body-region ratios, rendering style, near-duplicates, and coverage.

Do not assume every candidate shares one reference if its recorded task contract says otherwise. If candidate-to-reference mapping is missing or ambiguous, record the affected comparison as unresolved.

### 17.3 Dataset-level decision

Record a distinct `DATASET_RESULT` using one of:
- `PASS`: the reviewed set has sufficiently coherent stable traits and useful, non-redundant variation for the stated dataset purpose; no material unexplained drift remains.
- `REVIEW`: evidence is ambiguous, incomplete, or insufficient for a reliable set-level decision.
- `REPAIR`: a separately authorized dataset curation/rework action may address the identified issue; this does not authorize editing or regenerating images within QA itself.
- `REJECT`: the reviewed set or identified candidates are materially unsuitable for the stated dataset purpose.
- `NOT_ASSESSED`: the comparison set, applicable reference, candidate mapping, or other required input is unavailable.

Use `NOT_ASSESSED` when a dataset-level comparison cannot actually be performed. Do not substitute a candidate-level PASS, a prompt statement, or a general impression for cross-image evidence.

The dataset-level review must distinguish genuine drift from expected differences caused by pose, perspective, framing, clothing, lighting, or occlusion. It must not require identical silhouettes across different poses. A plausible individual image can still be inconsistent with the same-person dataset; conversely, a visible difference is not by itself proof of drift.

### 17.4 Separate durable dataset QA record

Persist each completed dataset-level review as its own immutable record, separate from production records and individual candidate QA results. Recommended location:

`IMAGE_QA_RECORDS/LORA_IMAGE/<DATASET_ID>/DATASET_QA_RECORD_<QA_REVIEW_ID>.md`

Each record must include:
- `QA_REVIEW_ID`, `DATASET_ID`, dataset scope/version or snapshot, review timestamp with timezone;
- `DATASET_RESULT` and concise rationale;
- reviewer/system identity and the applicable protocol/profile versions;
- reference image identifiers and candidate-to-reference mapping;
- the exact reviewed candidate/image IDs and links;
- candidate-level QA result references, including any missing results;
- assessed dimensions, concrete observations/evidence, affected candidate IDs, and severity;
- unresolved or unassessed dimensions and why they could not be judged;
- near-duplicate findings and dataset coverage observations, where in scope;
- recommended next action, without silently executing it.

Do not overwrite an earlier dataset review when the candidate set changes or a new review is run. Create a new review record and identify the snapshot/version it assessed. A correction to a record must be a separately timestamped amendment that preserves the original.

### 17.5 Missing evidence and activation boundary

If any required input prevents a reliable dataset-level judgment, preserve the individual candidate outcomes and set the dataset-level result to `NOT_ASSESSED` or `REVIEW`, as appropriate; name the missing evidence explicitly. Do not mark uninspected candidates as PASS.

These definitions specify a future input/output and persistence contract only. They do not prove that an executable runner currently supports set-level comparison or record writing. QA remains **PAUSED** until the independent QA system is explicitly activated under the existing activation requirements. Do not start a QA run as part of this documentation update.
