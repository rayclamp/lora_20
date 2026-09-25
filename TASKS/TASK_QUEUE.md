# TASK_QUEUE.md — Age-20 Inaria LoRA Tasks

## Rules
Project-wide rules live in 00_MASTER. Per-image production state lives only in PRODUCTION/IMAGE_QUEUE.md.

## T001 — Age-20 MASTER_IMAGE validation
- Status: DONE
- Account: ACCOUNT_06
- Target: 1
- Completed: 1
- Priority: P0

## T002 — Multi-account startup validation
- Status: DONE
- Accounts: ACCOUNT_01–ACCOUNT_06
- Priority: P0

## T101–T105 — Approved design inputs
- Status: DONE
- These remain approved source handoffs for integrated design.
- They are not active worker roles.

## T107 — IMAGE_PRODUCTION first 20 images
- Status: PAUSED_FOR_VALIDATION
- Account: Generation Worker Pool
- Target: 20
- Valid production candidates: 0
- Historical candidates: 5
- NEED_REGENERATE: 5
- QUEUED: 15
- Final PASS: 0
- Priority: P0
- Input: 05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md
- Queue: PRODUCTION/IMAGE_QUEUE.md

## T106 — FINAL REVIEW
- Status: WAITING_FOR_T107
- Account: ACCOUNT_06
- Gate: actual uploaded candidates must exist before final review.

## Current account architecture
- ACCOUNT_01–05 = GENERATION_WORKER
- ACCOUNT_06 = MASTER_DIRECTOR / FINAL_REVIEWER / QA
- ACCOUNT_07–08 = optional GENERATION_WORKER

## Production rule
Workers use the shared queue lock. Startup timing never assigns ownership.

A worker must successfully claim a job before generation. A candidate is not QC_PENDING until its production asset and lineage are recorded.

## Validation requirement
Before T107 resumes, one controlled test must pass:
- MASTER_IMAGE reference style match;
- Japanese anime target style;
- anatomy stability;
- hand/foot/object contact;
- asset transfer and lineage.

Only ACCOUNT_06 may resume T107 after validation.