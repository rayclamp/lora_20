# Inaria AI Studio — Master Specification

- **Authority:** Project-wide source of truth
- **Version:** v003
- **Last Updated:** 2026-09-25
- **Project:** `rayclamp/lora_20`
- **Active target:** Inaria age-20 identity LoRA dataset

## 1. Purpose

This document defines project-wide authority, the generation-worker architecture, production priorities, identity, anatomy, style, diversity, QA, handoff, and change-control rules.

The project has been redesigned so that specialist design work is centralized in the current master/director workspace, while multiple ChatGPT accounts are reserved for parallel image generation. This avoids wasting image-generation quotas on duplicated planning work and allows several accounts to generate the first-round dataset in parallel.

## 2. Source-of-truth hierarchy

1. Explicit user instruction for the current task.
2. Approved stable files in `00_MASTER/`.
3. Approved project/reference assets for the current task.
4. Approved specialist specifications and handoffs.
5. Temporary implementation choices.

Historical chat content and unrelated previous generation styles never override the hierarchy.

## 3. Current account architecture

### Master / Director

- **ACCOUNT_06 — MASTER_DIRECTOR / FINAL_REVIEWER / QA**
- Responsible for all cross-domain visual design, task planning, prompt assembly, production scheduling, integration, final review, and conflict resolution.
- ACCOUNT_06 now performs the work previously distributed across CHARACTER, CLOTHING, SCENE, POSE_CAMERA, and PROMPT design roles.
- Existing specialist handoffs remain valid source material; their original account assignments are historical and do not require those accounts to remain specialist workers.

### Generation worker pool

The production pool supports **5–7 parallel ChatGPT image-generation accounts**.

Default worker slots:

- **ACCOUNT_01 — GENERATION_WORKER**
- **ACCOUNT_02 — GENERATION_WORKER**
- **ACCOUNT_03 — GENERATION_WORKER**
- **ACCOUNT_04 — GENERATION_WORKER**
- **ACCOUNT_05 — GENERATION_WORKER**
- **ACCOUNT_07 — GENERATION_WORKER** (optional)
- **ACCOUNT_08 — GENERATION_WORKER** (optional)

ACCOUNT_06 assigns work through the shared production queue. All generation workers follow the same startup instruction and the same queue-driven procedure. A worker does not invent its own character, clothing, scene, pose, or prompt system.

## 4. Identity

The primary visual identity reference is `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`. It identifies the person and does not lock the source image's background, clothing, pose, camera, composition, or single-image arrangement.

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

Every visible hand must have a plausible five-finger structure; every visible bare foot a plausible five-toe structure. No extra/missing/fused/duplicated digits, extra limbs, impossible joints, severe deformation, or implausible balance.

## 7. Visual style

Current direction: realistic human appearance; romantic, refined, dreamy Japanese-inspired atmosphere; delicate light/shadow; natural translucent-looking skin; clean detailed rendering; avoid plastic or excessively artificial AI appearance. Water blue and navy are preferred project accents, not mandatory identity colors.

## 8. Dataset diversity

Vary hairstyle, clothing, scene, pose, camera/framing, expression, lighting, and composition intentionally. Controlled variation is preferred over random variation. ACCOUNT_06 owns diversity planning across the whole batch.

## 9. QA states

Final decisions use:
- `PASS` = approved.
- `REPAIR` = localized correctable defect.
- `REJECT` = systemic/severe failure or insufficient dataset value.

Historical `REVIEW` labels may remain in old records but are not a new final decision.

## 10. Final dataset gate

An image enters final data only after identity, anatomy, task, clothing, scene, pose/camera, rendering quality, dataset value, caption/metadata, and traceability requirements pass the unified QA standard.

## 11. Repository architecture

```
lora_20/
├─ START_HERE.md
├─ PROJECT_STATUS.md
├─ MASTER_IMAGE/
├─ 00_MASTER/
├─ 01_CHARACTER/          # approved specialist design assets / historical handoffs
├─ 02_CLOTHING/           # approved specialist design assets / historical handoffs
├─ 03_SCENE/              # approved specialist design assets / historical handoffs
├─ 04_POSE_CAMERA/        # approved specialist design assets / historical handoffs
├─ 05_PROMPT/             # approved prompt packages / historical handoffs
├─ ACCOUNTS/
├─ TASKS/
├─ PRODUCTION/
├─ STATUS/
└─ FINAL/
```

The numbered specialist directories remain as approved design assets and handoffs. They are not separate active ChatGPT worker roles in the new architecture.

## 12. Image production continuity

The first production batch contains 20 images. `PRODUCTION/IMAGE_QUEUE.md` is the authoritative per-image progress tracker.

Multiple generation workers may process different NOT_STARTED items in parallel. A worker must claim or lock an item before generating it so two workers never intentionally generate the same queue item.

If a worker reaches its image-generation quota, it stops and another available worker may continue with other unclaimed items. Completed images are never regenerated solely because of quota interruption.

## 13. Standard worker command

Every generation worker uses the same startup command defined in `START_HERE.md` and `00_MASTER/GENERATION_WORKER_PROTOCOL.md`. The command identifies the account as a generation worker; the worker reads the shared queue and takes the next available production item. No account-specific creative command is required.

## 14. Change control

Permanent project-wide changes require explicit review and should be recorded in `CHANGELOG.md`. Substantial revisions use versioned artifacts. Do not silently restore deleted legacy architecture.
