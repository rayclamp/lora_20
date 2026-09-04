# PRODUCTION PROTOCOL

## 1. Purpose

This document defines the shared production protocol for the six-account LoRA dataset system. It converts the project rules into a repeatable workflow in which the Director account coordinates specialist work through the shared repository.

## 2. Authority

Decision priority:

1. Explicit user instruction for the current job
2. `00_MASTER/MASTER_SPEC.md`
3. Approved character/reference assets
4. Specialist specifications
5. Temporary implementation choices

No specialist may silently override a higher-priority rule.

## 3. Production State Machine

Every production job uses one primary state:

`QUEUED → PREFLIGHT → DESIGNING → GENERATING → REVIEWING → REPAIR → RECHECK → APPROVED → FINALIZED`

Exception states:

- `BLOCKED` — required input, dependency, or specialist output is missing.
- `REJECTED` — the asset or job cannot meet the acceptance criteria.
- `CANCELLED` — explicitly stopped by the user or Director.

A job may return from `RECHECK` to `REPAIR` if defects remain.

## 4. Job Creation

Each job receives a unique `job_id` and a manifest under `06_DIRECTOR/jobs/`.

Minimum manifest fields:

```yaml
job_id: JOB-YYYYMMDD-###
project: lora_20
identity: Inaria
age: 20
status: QUEUED
requested_count: 0
character_spec_version: current
clothing_spec_version: current
scene_spec_version: current
pose_camera_spec_version: current
prompt_spec_version: current
master_spec_version: current
generation_workflow_version: current
created_at: YYYY-MM-DDTHH:MM:SS
notes: ""
```

## 5. Preflight

Before design or generation, the Director verifies:

- target identity and age
- current reference image availability
- all five specialist specifications
- Master specification
- generation workflow/version
- requested image count
- required diversity
- known hard constraints
- output and quarantine locations

If a required dependency is missing, state becomes `BLOCKED`.

## 6. Specialist Handoff

The Director sends work to specialists conceptually through repository artifacts. Every specialist output must identify:

- `job_id`
- responsible department
- source specification version
- requested task
- completed decisions
- constraints that must be preserved
- unresolved questions, if any
- output/reference paths

A specialist must not rewrite another department's rules.

## 7. Design Phase

The five specialist responsibilities are:

- Character: identity, age, face, body proportions, hair and identity anchors.
- Clothing: garment design, materials, colors, accessories and footwear.
- Scene: environment, time, weather, atmosphere and background hierarchy.
- Pose/Camera: stable pose, gesture, camera, framing, perspective and composition.
- Prompt/Generation/Dataset: prompt assembly, generation settings, captioning, metadata and dataset organization.

The Director resolves conflicts before generation authorization.

## 8. Generation Authorization

Generation begins only after the Director has a coherent design package. The package must preserve locked identity elements and explicitly state intentional variations.

The generation stage should create enough candidates to compensate for expected rejection/repair while avoiding unnecessary duplication.

## 9. Review Gate

Every candidate is evaluated independently for:

### Hard gates
- recognizable target identity
- correct target age representation
- plausible anatomy
- exactly five fingers where visible
- exactly five toes where visible
- no extra limbs or duplicated body parts
- no severe facial deformation
- no severe clothing/body intersection
- no broken pose or impossible joints
- no unwanted text, watermark or logo
- no severe rendering failure

### Soft quality checks
- face quality and consistency
- skin texture and lighting
- hair consistency
- clothing quality
- scene coherence
- pose/camera quality
- composition
- style consistency
- visual cleanliness
- dataset usefulness

## 10. Decision Rules

`PASS`: hard gates pass and the image has sufficient dataset value.

`REPAIR`: the identity and overall composition are valuable, but a localized defect can realistically be corrected.

`REJECT`: identity failure, severe anatomy failure, major composition failure, irreparable rendering failure, or low dataset value.

A visually beautiful image is not automatically a PASS.

## 11. Repair Protocol

For `REPAIR`:

1. Preserve the original candidate.
2. Identify the smallest repair region.
3. Use local masking/inpainting whenever feasible.
4. Preserve non-targeted regions.
5. Reinspect the repaired result using the complete QA checklist.
6. Never mark an image PASS solely because the repaired region looks better.

If repair introduces a new defect, return to `REPAIR` or `REJECT`.

## 12. Diversity Gate

Before final approval, the Director checks that the dataset does not accidentally encode a single outfit, background, hairstyle, camera angle, pose, lighting condition, or composition as part of identity.

Variation must be deliberate rather than random noise.

## 13. Dataset Finalization

An image can enter `FINALIZED` only when:

- QA is PASS
- required repair history is recorded
- caption is complete
- metadata is complete
- source/reference traceability is available
- uniqueness/dataset value is acceptable
- Director approval is recorded

Rejected or quarantined candidates remain traceable and are not silently deleted.

## 14. Required Decision Record

```yaml
asset_id: ASSET-###
job_id: JOB-YYYYMMDD-###
status: PASS|REPAIR|REJECT
character: PASS|FAIL
anatomy: PASS|FAIL
clothing: PASS|FAIL
scene: PASS|FAIL
pose_camera: PASS|FAIL
quality: PASS|FAIL
caption: PASS|FAIL
diversity_value: HIGH|MEDIUM|LOW
repair_required: true|false
repair_region: ""
final_reason: ""
reviewer: DIRECTOR
```

## 15. Traceability

Every final asset should be traceable to:

`job → design package → generation workflow → candidate → QA → repair history (if any) → final asset → caption/metadata`

## 16. Repository Rules

The repository is the shared memory layer. Rules and decisions belong in Markdown/YAML/text artifacts; large binary assets should be referenced by stable paths or external storage rather than duplicated unnecessarily.

Recommended directories:

- `00_MASTER/` — project-wide rules
- `01_CHARACTER/` — character rules and references
- `02_CLOTHING/` — clothing rules
- `03_SCENE/` — scene rules
- `04_POSE_CAMERA/` — pose/camera rules
- `05_PROMPT/` — prompt/generation/dataset rules
- `06_DIRECTOR/` — jobs, QA, decisions and orchestration
- `FINAL/` — approved release metadata/assets

## 17. Change Control

Permanent rule changes require:

1. change proposal
2. reason
3. affected departments
4. Director review
5. updated version
6. downstream validation

Temporary job-specific changes belong in the job manifest and must not silently become permanent rules.

## 18. Completion Condition

A production job is complete only when all requested final assets are either `FINALIZED`, explicitly `REJECTED`, or explicitly marked `BLOCKED` with a recorded reason.
