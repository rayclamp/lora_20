# QA TEMPLATE

## Asset Review

```yaml
asset_id: ASSET-###
job_id: JOB-YYYYMMDD-###
review_stage: INITIAL|RECHECK|FINAL

character:
  identity: PASS|FAIL
  age: PASS|FAIL
  face: PASS|FAIL
  hair: PASS|FAIL
  proportions: PASS|FAIL

anatomy:
  hands: PASS|FAIL|NOT_VISIBLE
  feet: PASS|FAIL|NOT_VISIBLE
  limbs: PASS|FAIL
  joints: PASS|FAIL
  body_ergonomics: PASS|FAIL

clothing:
  design: PASS|FAIL
  fit: PASS|FAIL
  intersections: PASS|FAIL

scene:
  coherence: PASS|FAIL
  hierarchy: PASS|FAIL
  background_quality: PASS|FAIL

pose_camera:
  pose: PASS|FAIL
  gesture: PASS|FAIL
  framing: PASS|FAIL
  perspective: PASS|FAIL

quality:
  rendering: PASS|FAIL
  skin: PASS|FAIL
  lighting: PASS|FAIL
  style: PASS|FAIL
  artifacts: PASS|FAIL
  text_watermark_logo: PASS|FAIL

dataset:
  uniqueness: PASS|FAIL
  diversity_value: HIGH|MEDIUM|LOW
  caption: PASS|FAIL
  metadata: PASS|FAIL

repair:
  required: true|false
  region: ""
  method: ""

final:
  status: PASS|REPAIR|REJECT
  reason: ""
  reviewer: DIRECTOR
```

## Hard-Fail Triggers

Any of the following normally prevents PASS:

- wrong identity
- wrong target age when age is a required condition
- severe face deformation
- extra/missing/fused fingers when hands are visible
- extra/missing/fused toes when feet are visible
- extra limbs or duplicated anatomy
- impossible joints or severe body deformation
- major clothing/body intersection
- major scene/composition failure
- severe generation artifacts
- unwanted text, watermark or logo

## Repair Eligibility

Repair is preferred when the candidate has high dataset value and the defect is localized and technically recoverable.

Examples:

- one or two malformed fingers
- a small clothing artifact
- minor local texture/color inconsistency
- isolated background artifact

Do not use local repair to rescue a fundamentally wrong identity, pose, or composition.

## Recheck Rule

Every repaired image must be evaluated from the beginning of this template again. Passing the repaired region alone is insufficient.
