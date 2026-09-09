# Inaria AI Studio — Master Specification

- **Authority:** Project-wide source of truth
- **Version:** v002
- **Last Updated:** 2026-09-09
- **Project:** `rayclamp/lora_20`
- **Active target:** Inaria age-20 identity LoRA dataset

## 1. Purpose

This document defines project-wide authority, six-account architecture, production priorities, identity, anatomy, style, diversity, QA, handoff, and change-control rules. Detailed shared procedures live in the other approved files in `00_MASTER/`.

## 2. Source-of-truth hierarchy

1. Explicit user instruction for the current task.
2. Approved stable files in `00_MASTER/`.
3. Approved project/reference assets for the current task.
4. Responsible specialist specification.
5. Temporary implementation choices.

Historical chat content and unrelated previous generation styles never override the hierarchy.

## 3. Six-account architecture

- **ACCOUNT_01 — CHARACTER:** identity, age, face, hair/appearance anchors, character consistency.
- **ACCOUNT_02 — CLOTHING:** garments, footwear, accessories, seasonal styling and clothing diversity.
- **ACCOUNT_03 — SCENE:** location, environment, season, weather, time, atmosphere and background.
- **ACCOUNT_04 — POSE_CAMERA:** pose, action, hands, feet, joints, balance, camera and framing.
- **ACCOUNT_05 — PROMPT / GENERATION / DATASET:** prompt assembly, generation implementation, candidate collection, caption, metadata and dataset organization.
- **ACCOUNT_06 — FINAL_REVIEWER / QA:** final image inspection, cross-department conflict resolution and final quality gate.

There is no active Director Workspace or `06_DIRECTOR/` directory in the current architecture.

## 4. Identity

The primary visual identity reference is `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`. It identifies the person and does not lock the source image's background, clothing, pose, camera, composition or single-image style.

## 5. Generation priorities

1. Locked character identity and age.
2. Explicit task requirements.
3. Anatomy and generation stability.
4. Pose/camera and composition.
5. Clothing and scene.
6. Lighting and visual style.
7. Decorative richness.
8. Dataset diversity/value.

## 6. Anatomy hard gate

Every visible hand must have a plausible five-finger structure; every visible bare foot a plausible five-toe structure. No extra/missing/fused/duplicated digits, extra limbs, impossible joints, severe deformation or implausible balance.

## 7. Visual style

Current direction: realistic human appearance; romantic, refined, dreamy Japanese-inspired atmosphere; delicate light/shadow; natural translucent-looking skin; clean detailed rendering; avoid plastic or excessively artificial AI appearance. Water blue and navy are preferred project accents, not mandatory identity colors.

## 8. Dataset diversity

Vary hairstyle, clothing, scene, pose, camera/framing, expression, lighting and composition intentionally. Avoid allowing one external feature to become an accidental identity signal. Controlled variation is preferred over random variation.

## 9. QA states

`PASS` = approved; `REPAIR` = localized correctable defect; `REJECT` = systemic/severe failure or insufficient value. Old `REVIEW` labels may remain in historical records but are not a new final state.

## 10. Final dataset gate

An image enters final data only after identity, anatomy, task, clothing, scene, pose/camera, rendering quality, dataset value, caption/metadata and traceability requirements pass the unified QA standard.

## 11. Repository architecture

```text
lora_20/
├─ START_HERE.md
├─ PROJECT_STATUS.md
├─ MASTER_IMAGE/
├─ 00_MASTER/
│  ├─ MASTER_SPEC.md
│  ├─ MASTER_WORKFLOW.md
│  ├─ ACCOUNT_WORKFLOW.md
│  ├─ GENERATION_RULES.md
│  ├─ STYLE_MASTER.md
│  ├─ DRAWING_INSTRUCTIONS.md
│  ├─ IDENTITY_MASTER.md
│  ├─ QUALITY_CONTROL.md
│  ├─ PRODUCTION_PROTOCOL.md
│  └─ CHANGELOG.md
├─ 01_CHARACTER/
├─ 02_CLOTHING/
├─ 03_SCENE/
├─ 04_POSE_CAMERA/
├─ 05_PROMPT/
├─ ACCOUNTS/
├─ TASKS/
├─ PRODUCTION/
├─ STATUS/
└─ FINAL/
```

`00_MASTER/` is the single home for global workflow/rule documents. Specialist specifications remain in their numbered workspaces. Obsolete duplicate workflow/runtime/director structures must not be recreated.

## 12. Image production continuity

The first production batch contains 20 images. `PRODUCTION/IMAGE_QUEUE.md` is the authoritative per-image progress tracker. If a ChatGPT image-generation quota is reached, stop at the current item and resume later from the next incomplete item; never redo completed images solely because of quota interruption.

## 13. Change control

Permanent project-wide changes require explicit review and should be recorded in `CHANGELOG.md`. Substantial revisions use versioned artifacts. Do not silently restore deleted legacy architecture.
