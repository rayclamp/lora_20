# CHANGELOG.md

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