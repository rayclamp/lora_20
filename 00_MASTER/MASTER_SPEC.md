# MASTER_SPEC.md — Inaria AI Studio Master Specification

- Authority: Project-wide source of truth
- Version: v005
- Last Updated: 2026-09-25
- Project: rayclamp/lora_20
- Active target: Age-20 Inaria identity LoRA dataset

## 1. Purpose
This repository defines one controlled production system for an age-20 Inaria LoRA dataset. It separates project rules, approved design references, production queue state, generation workers, first-layer QA, final QA, and reference-image delivery modes.

## 2. Source-of-truth hierarchy
1. Explicit user instruction for the current task.
2. Applicable documents in 00_MASTER.
3. MASTER_IMAGE/INARIA_20_MASTER_v1.0.png.
4. Approved T101–T105 design handoffs.
5. Current task and prompt package.
6. Temporary implementation details.

Historical chat content, old generated images, and obsolete documents never override current rules.

## 3. Current architecture
ACCOUNT_06 = MASTER_DIRECTOR / FINAL_REVIEWER / QA.

ACCOUNT_01–05, ACCOUNT_07, ACCOUNT_08 = Generation Workers.

Workers generate only successfully claimed queue jobs. Workers do not redesign project-wide identity or visual style.

## 4. Official reference and reference delivery modes
MASTER_IMAGE/INARIA_20_MASTER_v1.0.png is the single official Character + Visual Style Reference for all age-20 production.

The official reference may reach a Generation Worker through either:
- AUTO MODE: an automated image-input bridge such as Make → OpenAI API supplies the actual image input.
- MANUAL MODE: the operator manually uploads the official MASTER_IMAGE into the worker conversation before generation.

AUTO and MANUAL are delivery modes only. They do not create different character, style, anatomy, generation, or QA standards.

A worker must use the actual supplied image as the Character + Visual Style Reference. Textual descriptions, GitHub metadata, filenames, SHA values, or generic "Japanese anime" wording are never substitutes for the actual image.

## 5. Reference verification gate
Before generation, the worker must verify:
- the required reference image is actually available in the current generation context;
- the image is visually inspectable;
- the reference is the official age-20 MASTER_IMAGE;
- no other identity reference has been substituted.

If the required reference image is missing, unreadable, unavailable, or clearly the wrong reference/version, the worker must not generate.

For MANUAL MODE, the operator-supplied image must be the official INARIA_20_MASTER_v1.0.png. If this cannot be verified, stop before generation.

## 6. Character and visual reference
Preserve the official reference's line-art language, facial rendering, eye rendering, hair rendering, proportions, coloring, shading, lighting language, and overall illustration finish.

The current task may intentionally change clothing, scene, pose, camera, composition, accessories, and context. Do not reinterpret the reference into another style.

## 7. Mandatory style
The target is Japanese anime illustration matching the official MASTER_IMAGE visual language.

Forbidden target rendering:
- photorealistic
- live-action
- photographic
- 3D / CGI
- semi-photorealistic
- another anime, manga, game, or illustration style

The generic label Japanese anime is not sufficient by itself. Reference matching is required.

## 8. Generation-stability priority
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

## 9. QA
ACCOUNT_06 is the final gate. Codex may perform first-layer QA but does not replace ACCOUNT_06 final judgment.

Final states: PASS, REPAIR, REJECT.

## 10. Production state
PRODUCTION/IMAGE_QUEUE.md is the authoritative per-image state.

State machine:
QUEUED → CLAIMED → GENERATING → IMAGE_CREATED → UPLOADING → UPLOADED → QC_PENDING → PASS / REPAIR / REJECT

Exceptions: BLOCKED / FAILED / NEED_REGENERATE.

A candidate is not QC-ready merely because it appeared in a ChatGPT output area. A real production asset and lineage record are required.

## 11. Repository roles
- 00_MASTER/ — authoritative rules and protocols
- 01_CHARACTER/ — approved T101 character handoff
- 02_CLOTHING/ — approved T102 clothing handoff
- 03_SCENE/ — approved T103 scene handoff
- 04_POSE_CAMERA/ — approved T104 pose/camera handoff
- 05_PROMPT/ — approved T105 prompt package
- ACCOUNTS/ — account roles/status
- TASKS/ — task-level state
- PRODUCTION/ — per-image production queue
- STATUS/ — production history
- MASTER_IMAGE/ — canonical visual reference
- FINAL/ — only final approved dataset assets

The numbered design folders are reference assets, not active worker roles.

## 12. Change control
Permanent rule changes belong in the applicable 00_MASTER document and must be recorded in 00_MASTER/CHANGELOG.md. Do not restore deleted legacy architecture unless explicitly requested.
