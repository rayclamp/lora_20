# MASTER_SPEC.md — Inaria AI Studio Master Specification

- Authority: Project-wide source of truth
- Version: v006
- Last Updated: 2026-09-25
- Project: rayclamp/lora_20
- Active target: Age-20 Inaria identity LoRA dataset

## 1. Purpose
This repository defines one controlled production system for an age-20 Inaria LoRA dataset. It separates project rules, approved design references, goal-based production control, interchangeable generation workers, per-image queue state, first-layer QA, final QA, and reference-image delivery modes.

## 2. Source-of-truth hierarchy
1. Explicit user instruction for the current task.
2. Applicable documents in 00_MASTER.
3. PRODUCTION/PRODUCTION_GOAL.md and PRODUCTION/WORKER_POOL.md for active production coordination.
4. MASTER_IMAGE/INARIA_20_MASTER_v1.0.png.
5. Approved T101–T105 design handoffs.
6. Current task and prompt package.
7. Temporary implementation details.

Historical chat content, old generated images, and obsolete documents never override current rules.

## 3. Current architecture
ACCOUNT_06 = MASTER_DIRECTOR / FINAL_REVIEWER / QA.

All other generation accounts/sessions form one interchangeable Production Worker Pool. A worker is an execution slot/session, not a permanent account identity.

The Production Team owns the Goal. Workers temporarily claim and execute individual tasks.

## 4. Goal-based production
The user specifies a desired output quantity. The Master Director creates or updates the active Production Goal.

Workers do not receive fixed per-account quotas.

The active Goal counts Phase 1 completions at IMAGE_CREATED. When the target is reached, no new task may be claimed for that Goal.

## 5. Official reference and reference delivery modes
MASTER_IMAGE/INARIA_20_MASTER_v1.0.png is the single official Character + Visual Style Reference for all age-20 production.

The official reference may reach a Generation Worker through either:
- AUTO MODE: an automated image-input bridge such as Make → OpenAI API supplies the actual image input.
- MANUAL MODE: the operator manually uploads the official MASTER_IMAGE into the worker conversation before generation.

AUTO and MANUAL are delivery modes only. They do not create different character, style, anatomy, generation, or QA standards.

A worker must use the actual supplied image as the Character + Visual Style Reference. Textual descriptions, GitHub metadata, filenames, SHA values, or generic "Japanese anime" wording are never substitutes for the actual image.

## 6. Reference verification gate
Before generation, the worker must verify:
- the required reference image is actually available in the current generation context;
- the image is visually inspectable;
- the reference is the official age-20 MASTER_IMAGE;
- no other identity reference has been substituted.

If the required reference image is missing, unreadable, unavailable, or clearly the wrong reference/version, the worker must not generate.

## 7. Character and visual reference
Preserve the official reference's line-art language, facial rendering, eye rendering, hair rendering, proportions, coloring, shading, lighting language, and overall illustration finish.

The current task may intentionally change clothing, scene, pose, camera, composition, accessories, and context. Do not reinterpret the reference into another style.

## 8. Mandatory style
The target is Japanese anime illustration matching the official MASTER_IMAGE visual language.

Forbidden target rendering:
- photorealistic
- live-action
- photographic
- 3D / CGI
- semi-photorealistic
- another anime, manga, game, or illustration style

The generic label Japanese anime is not sufficient by itself. Reference matching is required.

## 9. Generation-stability priority
00_MASTER/ANATOMY_STABILITY.md is the hard anatomy and pose-stability standard.

Priority:
1. identity/reference match
2. anatomy and generation stability
3. explicit task requirements
4. pose/camera/composition
5. clothing/scene
6. lighting and decorative detail
7. dataset diversity

When complexity conflicts with stability, simplify the action, prop, occlusion, or effect.

## 10. QA
ACCOUNT_06 is the final gate. Codex may perform first-layer QA but does not replace ACCOUNT_06 final judgment.

Final states: PASS, REPAIR, REJECT.

## 11. Production phases
Phase 1:
QUEUED → CLAIMED → GENERATING → IMAGE_CREATED

IMAGE_CREATED is the Worker completion point. The Worker is released immediately.

Phase 2:
IMAGE_CREATED → UPLOADING → UPLOADED → QC_PENDING → PASS / REPAIR / REJECT

Phase 2 is downstream and non-blocking for Phase 1 Worker production.

Exceptions: BLOCKED / FAILED / NEED_REGENERATE.

## 12. Queue ownership
PRODUCTION/IMAGE_QUEUE.md is the authoritative per-image state.

Claim flow:
FETCH → SELECT → CLAIM(CAS) → VERIFY → GENERATING → GENERATE → IMAGE_CREATED

The claim update must use the exact queue blob SHA fetched immediately before the claim. A failed/conflicted claim means no ownership and no generation.

## 13. Worker pool
See PRODUCTION/WORKER_POOL.md.

Do not bind production correctness to a fixed account number, account quota, or worker startup order.

## 14. Repository roles
- 00_MASTER/ — authoritative rules and protocols
- 01_CHARACTER/ — approved T101 character handoff
- 02_CLOTHING/ — approved T102 clothing handoff
- 03_SCENE/ — approved T103 scene handoff
- 04_POSE_CAMERA/ — approved T104 pose/camera handoff
- 05_PROMPT/ — approved T105 prompt package
- ACCOUNTS/ — optional operator/session profiles; they do not define permanent worker ownership
- PRODUCTION/ — Goal, Worker Pool, and per-image production state
- STATUS/ — production history
- MASTER_IMAGE/ — canonical visual reference
- FINAL/ — only final approved dataset assets

## 15. Change control
Permanent rule changes belong in the applicable 00_MASTER document and must be recorded in 00_MASTER/CHANGELOG.md. Do not restore deleted legacy architecture unless explicitly requested.
