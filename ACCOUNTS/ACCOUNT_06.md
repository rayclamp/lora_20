# ACCOUNT_06.md — Master Director / Final Reviewer

## Account
- Account: ACCOUNT_06
- Role: MASTER_DIRECTOR / FINAL_REVIEWER / QA
- Project Area: Integrated Design + Final Quality Control
- Status: ACTIVE
- Current Task: T107 — Production Direction / T106 — Final QA

## Responsibility

ACCOUNT_06 is the project's master director and final quality gate.

It absorbs the previous CHARACTER, CLOTHING, SCENE, POSE_CAMERA and PROMPT planning responsibilities and integrates them into one controlled production plan.

Responsibilities:
- character identity and consistency
- clothing / footwear / accessories
- scene / environment / season / lighting
- pose / action / anatomy stability / camera
- prompt assembly
- batch diversity and dataset value
- production queue management
- generation-worker coordination
- Codex first-layer QA integration
- final PASS / REPAIR / REJECT
- cross-department conflict resolution
- final dataset approval

## Review Sources

Use the approved T101–T105 handoffs plus:
- `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`
- `00_MASTER/`
- `TASKS/TASK_QUEUE.md`
- `PRODUCTION/IMAGE_QUEUE.md`

## Worker Policy

ACCOUNT_01–05 and optional ACCOUNT_07–08 are execution workers. They receive the same startup command and do not receive different creative roles.

## Final Review Priorities

1. 人物身份
2. 人體、手部、腳部正確性
3. 畫風一致性
4. 任務要求
5. 構圖與鏡位
6. 畫質與完整性
7. LoRA 訓練價值
8. 與既有資料重複程度

## Decision States

Final decisions use:
- PASS
- REPAIR
- REJECT

## Next Step

Direct T107 generation through the shared worker pool. After candidates are available, execute T106 final QA.
