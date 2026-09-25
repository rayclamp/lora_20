# Changelog

## 2026-09-09
- Consolidated global workflow, identity, drawing, style, account, and QA rules under `00_MASTER/`.
- Removed obsolete duplicate `WORKFLOW/` architecture.
- Removed obsolete `06_DIRECTOR/` workspace and its historical test/Director handoff data; ACCOUNT_06 is now explicitly `FINAL_REVIEWER / QA`.
- Removed obsolete project/runtime context files that duplicated current status and master rules.
- Removed redundant `ART_STYLE_MASTER.md`; canonical style document is now `00_MASTER/STYLE_MASTER.md`.
- Updated startup, project status, Master Specification, Production Protocol, Final README, and account states to the consolidated architecture.
- Standardized the first 20-image production queue as the resumable production state source.

## 2026-09-05
- Initialized the shared Inaria AI Studio repository structure.
- Added project, character, art-style, and generation master rules.
- Established six-account specialist workflow and versioned handoff principle.


## 2026-09-25 — Multi-account generation architecture v003

- Replaced the old active specialist-account architecture with one Master Director (ACCOUNT_06) plus a 5–7 account Generation Worker pool.
- ACCOUNT_06 now integrates Character, Clothing, Scene, Pose/Camera, Prompt, production planning, Codex QA integration, and final QA.
- ACCOUNT_01–05 and optional ACCOUNT_07–08 are generation workers.
- Added `00_MASTER/GENERATION_WORKER_PROTOCOL.md`.
- All generation workers use one identical startup command and pull work from `PRODUCTION/IMAGE_QUEUE.md`.
- Existing T101–T105 specialist outputs remain approved source assets/handoffs and are not discarded.
- This change is intended to use multiple independent image-generation quotas in parallel rather than consuming one account's quota on the entire first batch.
