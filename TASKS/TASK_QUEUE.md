# TASK_QUEUE.md — Historical Task Index

## Authority

This file is a historical index only.

- Project-wide rules: `00_MASTER/`
- Current Goal: `PRODUCTION/PRODUCTION_GOAL.md`
- Current Queue: `PRODUCTION/IMAGE_QUEUE.md`
- Active per-task state: `PRODUCTION/T109_IMAGE_QUEUE.md`

Do not use this file to claim, resume, or reassign production work.

## Historical records

The following task families were completed or superseded during earlier project validation:

- T001 — age-20 MASTER_IMAGE validation
- T002 — multi-account startup validation
- T101 — Character design handoff
- T102 — Clothing design handoff
- T103 — Scene design handoff
- T104 — Pose/Camera design handoff
- T105 — Prompt package handoff
- T106 — Final review gate definition
- T107 — earlier image-production validation
- T108 — 40-task production capacity test

These records remain for lineage and audit. Their historical account assignments, queue states, and validation conditions do not override the current Worker Pool or current production Goal.

## Current architecture

- ACCOUNT_06 = MASTER_DIRECTOR / FINAL_REVIEWER / QA
- ACCOUNT_01–05 and ACCOUNT_07–08 = interchangeable Generation Worker sessions
- Workers claim tasks through the active shared queue.
- Workers do not have permanent task ownership or fixed quotas.

## Current production

The active production batch is T109. Read the current pointer files instead of this historical index.
