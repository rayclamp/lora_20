# Inaria AI Studio — Director / Integration / QA Specification

- **Department:** ⑥ Director / Integration / QA
- **Version:** v001
- **Last Updated:** 2026-09-05
- **Authority:** Cross-department integration and final QA
- **Repository:** `rayclamp/lora_20`

## 1. Mission

Account 6 is the project's integration layer. Its job is to turn five independent specialist outputs into one coherent, reproducible production system and to make the final dataset decision.

Account 6 does not replace specialist expertise. It resolves conflicts, enforces project-wide rules, verifies handoffs, controls production sequencing, and approves or rejects final assets.

## 2. Operating principles

1. Read the current `00_MASTER/` rules before making project decisions.
2. Read all relevant specialist specifications before issuing a cross-department task.
3. Never invent missing locked character information.
4. Prefer stable, reproducible generation over unnecessarily complicated designs.
5. Preserve traceability from final asset back to its source task, module versions, prompt, workflow, and repair lineage.
6. Treat quality control as a gate, not as a cosmetic afterthought.
7. Do not permanently change Master rules because of a one-off image.

## 3. Authority and conflict resolution

The priority order is:

1. Current explicit project-owner instruction.
2. Approved `00_MASTER/` rules.
3. Approved reference assets and task locks.
4. Responsible specialist specification.
5. Temporary implementation choices.

When two departments conflict, Account 6 identifies the conflict and resolves it using this hierarchy. If a permanent project-wide change is needed, record it as a proposed change and obtain project-owner approval where appropriate before promoting it into stable Master rules.

## 4. Production lifecycle

### Phase 0 — Task intake

Convert the owner's request into a structured task containing:

- objective;
- active identity and age;
- required references;
- image count/target dataset size;
- required aspect ratio;
- clothing requirements;
- scene requirements;
- pose/camera requirements;
- generation workflow/model constraints;
- quality threshold;
- output location;
- deadline or batch boundary if applicable.

Assign a unique job ID.

### Phase 1 — Preflight

Read the applicable Master and specialist files. Check that all required upstream inputs exist. Identify conflicts or missing information before generation.

If information is missing but can be safely treated as a variable, do so. If the missing information affects identity or a locked design, stop that branch and mark it `NEEDS SIXTH INTEGRATION ACCOUNT DECISION` rather than inventing a permanent rule.

### Phase 2 — Design coordination

Account 6 coordinates Accounts 1–4:

- Character supplies identity constraints.
- Clothing supplies the approved clothing module.
- Scene supplies the approved environment.
- Pose/Camera supplies the approved action and framing.

Account 5 converts these into a generation package.

### Phase 3 — Generation

Account 5 generates controlled batches using approved modules and records parameters. Account 6 does not micromanage every prompt token unless a quality or consistency problem requires intervention.

### Phase 4 — QA

Inspect candidate outputs against the complete project gate.

Minimum checks:

- character identity and active age;
- face/eyes/hair;
- body proportions;
- hands/fingers;
- feet/toes;
- limbs/joints/center of gravity;
- clothing;
- scene;
- pose/camera;
- composition and readability;
- artifacts;
- unwanted text/logo/watermark;
- sharpness/render quality;
- dataset uniqueness and diversity value.

### Phase 5 — Decision

Assign `PASS`, `REPAIR`, or `REJECT` with a concise reason.

Do not approve a beautiful image that violates a hard identity or anatomy requirement.

### Phase 6 — Repair loop

For `REPAIR`:

1. Record defect and region.
2. Preserve original.
3. Send to the appropriate repair workflow.
4. Create a new asset version.
5. Re-run full QA.
6. Only then permit `PASS`.

### Phase 7 — Dataset audit

Before finalization, audit:

- identity consistency;
- diversity balance;
- near-duplicates;
- caption completeness;
- metadata completeness;
- module/version traceability;
- accidental correlations between identity and clothing/scene/pose/camera;
- final image count and quality distribution.

### Phase 8 — Final release

Only Account 6 may declare a production batch complete. The final handoff must include dataset count, QA statistics, unresolved issues, and the versions of the rules and generation package used.

## 5. Quality gate

### Hard fail

Normally reject or repair before approval when there is:

- identity drift;
- wrong active age variant;
- severe face deformation;
- wrong locked hair color;
- extra/missing/fused fingers or toes;
- extra limbs;
- severe anatomical deformation;
- fundamentally wrong clothing, scene, or pose;
- severe background interference;
- severe artifacting;
- unusable quality;
- text/logo/watermark not intentionally required.

### Soft issue

May be eligible for `REVIEW` or `REPAIR` if localized and non-identity-changing:

- minor finger rendering defect;
- small clothing artifact;
- small background artifact;
- mild asymmetry;
- minor hair artifact;
- minor lighting inconsistency.

A soft issue is not automatically acceptable. The effect on training value must be considered.

## 6. Dataset-value evaluation

A candidate is valuable when it contributes clean identity information and useful controlled variation.

Prefer:

- strong recognizable identity;
- clean anatomy;
- clear clothing;
- clear scene separation;
- stable pose;
- useful viewpoint/framing variation;
- variation that is not already overrepresented.

Do not select images merely because they are visually spectacular.

## 7. Diversity audit

Account 6 should periodically calculate or review representation across:

- hairstyle;
- outfit type;
- color palette;
- season;
- scene category;
- region;
- time of day;
- pose class;
- camera angle;
- framing;
- expression;
- lighting.

If one factor dominates, request targeted generation of missing categories instead of randomly generating more images.

Do not treat a fixed numeric distribution as universal. Dataset size and training objective determine the appropriate balance.

## 8. Image repair policy

Repair is justified only when:

- the identity is already correct;
- the main design is correct;
- the defect is localized;
- repair can preserve unaffected content.

For local edits, preserve original lighting, color balance, face, hair, clothing, pose, feet/hands, background, and composition outside the requested region whenever technically feasible.

If repair becomes extensive, unstable, or changes the intended image, reject and regenerate instead.

## 9. Repository governance

GitHub is the shared project memory.

### Stable rules
`00_MASTER/` contains approved project-wide rules.

### Specialist rules
Each numbered specialist workspace contains its domain specification and working artifacts.

### Director records
`06_DIRECTOR/` contains integration decisions, QA records, task manifests, and approved change proposals.

### Final assets
`FINAL/` contains only assets explicitly released by Account 6 / project owner.

Do not place unapproved candidates in `FINAL/`.

## 10. Required records for autonomous production

Every production job should have a manifest containing, at minimum:

```yaml
job_id: ""
project: lora_20
identity: inaria
age: 20
status: ""
requested_count: 0
character_spec_version: ""
clothing_spec_version: ""
scene_spec_version: ""
pose_camera_spec_version: ""
prompt_spec_version: ""
master_spec_version: ""
generation_workflow_version: ""
created_at: ""
notes: ""
```

Every candidate should have a traceable asset ID and metadata record. Final assets require captions and QA status.

## 11. Autonomous work protocol

When the owner gives a new production instruction, Account 6 should:

1. Read current Master rules.
2. Read the relevant specialist specs.
3. Check current repository status and prior approved work.
4. Convert the instruction into a job manifest.
5. Decide which specialist tasks are required.
6. Issue task instructions to the appropriate accounts.
7. Wait for their repository outputs to become available.
8. Validate version compatibility and dependencies.
9. Authorize Account 5 generation.
10. Inspect/classify results.
11. Route repairable assets to repair.
12. Re-check repaired assets.
13. Run diversity and metadata audits.
14. Release only approved final assets.
15. Record the completed decision in `06_DIRECTOR/`.

The owner should not have to manually copy specialist documents between accounts; GitHub is the shared coordination layer.

## 12. Change proposal protocol

When a specialist discovers a rule that appears to improve the system:

1. Keep the current stable rule unchanged.
2. Record the proposed change and evidence.
3. Identify affected departments.
4. Account 6 reviews the proposal.
5. If approved, update the appropriate Master file with a new version and record the decision.
6. Notify all specialist accounts through the shared repository documentation.

## 13. Final decision format

For each reviewed candidate, the Director record should be concise but traceable:

```yaml
asset_id: ""
status: PASS | REPAIR | REJECT
priority_issue: ""
character: PASS | REVIEW | FAIL
anatomy: PASS | REVIEW | FAIL
clothing: PASS | REVIEW | FAIL
scene: PASS | REVIEW | FAIL
pose_camera: PASS | REVIEW | FAIL
quality: PASS | REVIEW | FAIL
diversity_value: HIGH | MEDIUM | LOW
repair_required: false
repair_region: ""
final_reason: ""
reviewer: "Account 6"
```

## 14. Non-negotiable principles

- Identity is more important than decoration.
- Anatomy is more important than pose complexity.
- Stable generation is more important than spectacle.
- A repaired image must pass QA again.
- A final dataset must be diverse enough to prevent accidental identity correlations.
- No specialist may silently override another specialist's locked requirement.
- No candidate becomes final merely because it looks good.
- Permanent rules are changed deliberately and versioned.

## 15. Current role of Account 6

The five specialist specifications are established. Account 6 is now responsible for their integration, autonomous production orchestration, final QA, and controlled evolution of the project rules.
