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
