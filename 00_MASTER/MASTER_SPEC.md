# Inaria AI Studio — Master Specification

- **Authority:** Project-wide source of truth
- **Version:** v001
- **Last Updated:** 2026-09-05
- **Maintainer:** Sixth Account / Director (with project-owner approval for permanent changes)
- **Project:** `rayclamp/lora_20`
- **Active target:** Inaria age-20 identity LoRA dataset

## 1. Purpose

This document integrates the five specialist specifications into one project-wide operating standard. It defines authority, priorities, cross-department boundaries, dataset principles, quality gates, and the rules that all six accounts must follow.

It does not replace specialist specifications. Specialist files remain the detailed implementation standards for their own domains.

## 2. Source-of-truth hierarchy

When information conflicts, use this order:

1. Explicit user instruction for the current task.
2. This `MASTER_SPEC.md` and other approved stable files in `00_MASTER/`.
3. Approved project/reference assets for the current task.
4. The responsible specialist specification.
5. Temporary implementation choices.

A lower-level document must not silently override a higher-level rule.

## 3. Six-account architecture

### Account 1 — Character
Owner of identity, age variant, facial consistency, hair/appearance identity, and character-specific dataset criteria.

### Account 2 — Clothing
Owner of garments, footwear, accessories, seasonal styling, and clothing diversity.

### Account 3 — Scene
Owner of location, environment, season, weather, time, lighting, atmosphere, and background readability.

### Account 4 — Pose / Camera
Owner of body action, hands, feet, joints, balance, camera, framing, and pose/camera diversity.

### Account 5 — Prompt / Generation / Dataset
Owner of prompt assembly, generation packages, workflow implementation, candidate collection, metadata, repair workflow, deduplication, and dataset assembly.

### Account 6 — Director / Integration / QA
Owner of cross-department integration, conflict resolution, quality gates, production sequencing, final dataset approval, and promotion of permanent project-wide rules.

## 4. Core character rule

The dataset must teach **Inaria as a person**, not a fixed outfit, pose, scene, hairstyle, or composition.

For the active age-20 project:

- Use the designated age-20 standard portrait as the primary identity reference.
- Preserve recognizable facial identity, face structure, established hair color, and intended body proportions.
- Do not invent unspecified numeric facial/body measurements.
- Age-specific presentation may change only within the approved age-20 identity target.

## 5. Core generation priorities

All departments follow this priority order unless the user explicitly changes it:

1. Locked character identity and proportions.
2. Explicitly locked task requirements.
3. Anatomical correctness and generation stability.
4. Approved pose/camera and composition.
5. Clothing and scene correctness.
6. Lighting, atmosphere, and visual style.
7. Decorative richness.

When two attractive options compete and one is materially more stable, choose the stable option.

## 6. Anatomy hard gate

For final dataset approval:

- Each visible hand must have a plausible five-finger structure.
- Each visible bare foot must have a plausible five-toe structure.
- No extra limbs, duplicated body parts, fused digits, missing digits, impossible joints, or severe deformation.
- Body balance and center of gravity must remain believable.

If an image has a localized correctable defect, it may enter REPAIR. It must not enter FINAL until it passes the full QA gate again.

## 7. Visual style direction

The current project direction is:

- romantic, refined, dreamy Japanese-inspired atmosphere;
- delicate light and shadow;
- natural, translucent-looking skin texture;
- clean, detailed rendering;
- believable anatomy;
- avoid plastic or excessively artificial AI appearance.

Water blue and navy are preferred project accents, not mandatory character colors.

The active task may override palette or aspect ratio when explicitly specified.

## 8. Dataset diversity principle

Variation must be intentional and traceable. Across a useful dataset, vary external conditions such as:

- hairstyle;
- clothing;
- scene;
- pose;
- camera/framing;
- expression;
- lighting;
- composition.

Do not allow one outfit, hairstyle, scene, pose, camera angle, or color scheme to dominate so strongly that it becomes an accidental identity signal.

Do not change every variable simultaneously in every sample; controlled variation is preferred.

## 9. Image decision gates

Every candidate must receive exactly one current status:

### PASS
Identity, anatomy, clothing, scene, pose/camera, and rendering quality satisfy the task. No major defect remains.

### REPAIR
The underlying image is valid and the defect is localized and safely correctable without changing the intended identity/design.

### REJECT
The failure is systemic, severe, identity-changing, or requires extensive reconstruction/regeneration.

A repaired image is always re-inspected from the beginning. `REPAIR` never automatically becomes `PASS`.

## 10. Final dataset gate

An asset may enter `03_FINAL` only when all are true:

- correct active identity/age;
- acceptable face and hair identity;
- anatomically acceptable hands/feet/body;
- approved clothing;
- coherent scene;
- approved pose/camera;
- no significant unwanted artifact, text, watermark, or logo;
- sufficient image quality;
- not an unnecessary near-duplicate;
- contributes useful variation;
- caption exists and matches the visible image;
- metadata exists and is traceable;
- source and module versions are recorded;
- Director/QA approval is complete.

## 11. Repair policy

Preserve the original candidate unchanged.

Repair only the requested/localized region when technically feasible. Preserve unaffected identity, lighting, color balance, composition, clothing, pose, hands, feet, and background wherever possible.

After repair, run complete QA again.

## 12. Cross-department handoff

Every production asset should carry, where applicable:

- job/set ID;
- character module/version;
- clothing module/version;
- scene module/version;
- pose/camera module/version;
- prompt package/version;
- model/workflow information;
- status and grade;
- repair lineage if repaired.

A department must clearly mark what is **locked**, **preferred**, and **adjustable**.

## 13. Conflict protocol

If two departments disagree:

1. Do not silently choose a winner.
2. Identify the exact conflicting requirements.
3. Check this Master Specification and stable `00_MASTER/` rules.
4. Preserve the higher-priority requirement.
5. If still unresolved, mark `NEEDS SIXTH INTEGRATION ACCOUNT DECISION`.
6. Account 6 decides and records the decision.

## 14. Change control

Specialist accounts may improve their own specifications but must not silently alter project-wide rules.

Permanent project-wide changes require Account 6 review and project-owner approval where required.

Stable Master files should use semantic versioning or the project's documented version convention. Keep meaningful Git history; do not erase previous decisions merely to make the current file shorter.

## 15. GitHub operating rule

GitHub is the shared project memory.

Before work, each account should read:

- relevant `00_MASTER/` files;
- its own department specification;
- approved upstream inputs for the current task.

After work, it should write its outputs to its assigned workspace and report the exact path/version.

Do not silently overwrite another department's files. Prefer new versioned artifacts for substantial revisions.

## 16. Current production state

The five specialist specifications have been established. Account 6 is now establishing the integrated Master and Director/QA operating rules.

No production batch is authorized by this document alone. A production task must be explicitly assigned by the project owner or Account 6.

## 17. Related specifications

- `00_MASTER/PROJECT_MASTER.md`
- `00_MASTER/CHARACTER_MASTER.md`
- `00_MASTER/GENERATION_RULES.md`
- `00_MASTER/ART_STYLE_MASTER.md`
- `01_CHARACTER/CHARACTER_SPEC.md`
- `02_CLOTHING/CLOTHING_SPEC.md`
- `03_SCENE/SCENE_SPEC.md`
- `04_POSE_CAMERA/POSE_CAMERA_SPEC.md`
- `05_PROMPT/PROMPT_SPEC.md`
- `06_DIRECTOR/DIRECTOR_SPEC.md`
