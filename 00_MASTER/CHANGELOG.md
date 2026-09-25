# CHANGELOG.md

## 2026-09-25 — Goal-based Production Team and two-phase Worker architecture

- Replaced fixed-account production ownership with an interchangeable Production Worker Pool.
- Added PRODUCTION/PRODUCTION_GOAL.md for team-level output targets.
- Added PRODUCTION/WORKER_POOL.md for interchangeable workers, standby takeover, lease recovery, and quota-independent operation.
- Added PRODUCTION/WORKER_START_COMMAND.md as the universal command for any generation account/session.
- Defined Phase 1 as QUEUED → CLAIMED → GENERATING → IMAGE_CREATED.
- Defined IMAGE_CREATED as the Worker completion point and Goal counting event.
- Decoupled Phase 2 delivery/QA: IMAGE_CREATED → UPLOADING → UPLOADED → QC_PENDING → final QA.
- Phase 2 is non-blocking for Phase 1 production.
- Removed the concept of fixed per-account production quotas.
- A Worker may be replaced by another account/session without changing the team Goal.
- Re-queued IMG_01–IMG_05 as regeneration tasks while preserving their historical attempt counts.
- Activated the 20-image MANUAL Phase 1 Goal T107_GOAL_20260925_20.
- Updated account profiles so ACCOUNTS/ files are optional session profiles rather than permanent task ownership.
- Updated ACCOUNT_06 to own Goal creation, completion reporting, and final QA.

## 2026-09-25 — Added AUTO and MANUAL reference delivery modes

- Added 00_MASTER/PRODUCTION_MODES.md.
- Defined MASTER_IMAGE/INARIA_20_MASTER_v1.0.png as the single official age-20 Character + Visual Style Reference.
- Added AUTO MODE for Make/OpenAI image-input delivery.
- Added MANUAL MODE for operator-uploaded MASTER_IMAGE delivery to ChatGPT generation accounts.
- Kept identity, visual-style, anatomy, generation, queue, and QA rules identical across both modes.
- Added a hard reference verification gate: missing, unreadable, or wrong-version reference blocks generation.
- Updated worker startup rules and account files so workers no longer depend on directly reading GitHub image binary.
- GitHub remains the authoritative storage/reference authority; reference delivery is now explicitly separated from reference authority.

## 2026-09-25 — Repository consolidation and production reset

- Corrected MASTER_SPEC from the obsolete realistic-human direction to the required age-20 Japanese anime reference-matching direction.
- Promoted ANATOMY_STABILITY.md to the authoritative hard standard for hands, feet, limbs, pose stability, object contact, wearables, containers, false-limb prevention, and local repair.
- Consolidated worker, generation, drawing, QA, identity, and production rules around the current 20-year-old MASTER_IMAGE.
- Added explicit IMAGE_CREATED → UPLOADING → UPLOADED asset states so a ChatGPT output-area image is not mistaken for a production asset.
- Marked IMG_01–IMG_05 as NEED_REGENERATE because they were produced before the current reference-style/anatomy/asset gates were fully enforced.
- Paused T107 until one controlled validation generation passes style, anatomy, object-contact, and asset-transfer checks.
- Simplified account status files so no worker incorrectly reports old QC_PENDING work as current.
- Converted INARIA_CHARACTER_SPEC.md and INARIA_QA_SPEC.md into Codex QA adapters that point to 00_MASTER rather than creating duplicate authorities.
- Removed redundant 00_MASTER/ACCOUNT_WORKFLOW.md.
- Removed redundant 00_MASTER/MASTER_WORKFLOW.md.
- Removed redundant 00_MASTER/CHARACTER_MASTER.md.
- Kept T101–T105 as approved design handoffs because they remain useful inputs to ACCOUNT_06.
- Kept historical production logs for traceability; historical candidates are not treated as final dataset assets.

## 2026-09-25 — Multi-account generation architecture v003

- Replaced the old active specialist-account architecture with one Master Director (ACCOUNT_06) plus a 5–7 account Generation Worker pool.
- ACCOUNT_06 integrates Character, Clothing, Scene, Pose/Camera, Prompt, production planning, Codex QA integration, and final QA.
- ACCOUNT_01–05 and optional ACCOUNT_07–08 are generation workers.
- All generation workers use one identical startup command and pull work from PRODUCTION/IMAGE_QUEUE.md.

## 2026-09-09
- Consolidated global workflow, identity, drawing, style, account, and QA rules under 00_MASTER.
- Removed obsolete legacy workflow/director architecture and redundant style master.

## 2026-09-05
- Initialized the shared Inaria AI Studio repository structure.
- Added project, character, art-style, and generation master rules.
