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
