# TASK_QUEUE.md — 20歲依娜莉亞 LoRA 任務佇列

## 使用規則

所有帳號從本文件取得工作。

任務狀態：UNASSIGNED、ASSIGNED、IN_PROGRESS、REVIEW、DONE、NEED_REWORK、BLOCKED。

圖片生產另受 `PRODUCTION/IMAGE_QUEUE.md` 管理；圖片額度中斷時必須從佇列目前位置續作，不得重置。

## 第一階段：系統驗證

### T001 — 20歲 MASTER_IMAGE 驗證
- Status: DONE / PASS
- Account: ACCOUNT_06
- Target: 1
- Completed: 1
- Priority: P0

### T002 — 多帳號新聊天室啟動測試
- Status: DONE / PASS
- Account: ACCOUNT_01～ACCOUNT_06
- Target: 6
- Completed: 6
- Priority: P0

## 第二階段：前置設計資料

T101–T105 已完成。這些工作現在視為 ACCOUNT_06 可直接使用的 approved design assets / handoffs；不要求 generation workers 重新執行。

### T101 — CHARACTER
- Status: DONE / PASS
- Historical specialist: ACCOUNT_01
- Deliverable: `01_CHARACTER/CHARACTER_SPEC.md` v1.1

### T102 — CLOTHING
- Status: DONE / PASS
- Historical specialist: ACCOUNT_02
- Deliverable: `02_CLOTHING/T102_CLOTHING_HANDOFF_v1.0.md`

### T103 — SCENE
- Status: DONE / PASS
- Historical specialist: ACCOUNT_03
- Deliverable: `03_SCENE/T103_SCENE_HANDOFF_v1.0.md`

### T104 — POSE_CAMERA
- Status: DONE / PASS
- Historical specialist: ACCOUNT_04
- Deliverable: `04_POSE_CAMERA/T104_POSE_CAMERA_HANDOFF_v1.0.md`

### T105 — PROMPT
- Status: DONE / PASS
- Historical specialist: ACCOUNT_05
- Deliverable: `05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md`

## 第三階段：第一輪正式圖片生產

### T107 — IMAGE_PRODUCTION 第一輪 20 張圖片
- Status: READY
- Account: GENERATION_WORKER_POOL
- Project Area: `PRODUCTION`
- Goal: 使用 T105 的 20 個 Prompt Package 產生第一輪 20 張候選圖片。
- Target: 20
- Completed: 0
- GENERATED: 0
- QC_PENDING: 0
- PASS: 0
- REPAIR: 0
- REJECT: 0
- NEED_REGENERATE: 0
- NOT_STARTED: 20
- Priority: P0
- Input: `05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md`
- Queue: `PRODUCTION/IMAGE_QUEUE.md`
- Execution: Any available generation worker may claim the next unclaimed queue item.
- Worker rule: All workers use the same startup command and do not invent different creative roles.

### T106 — FINAL REVIEW 第一輪最終整合審查
- Status: UNASSIGNED / WAITING FOR T107
- Account: ACCOUNT_06
- Project Area: Final Quality Control
- Goal: 依 `00_MASTER/QUALITY_CONTROL.md` 對第一輪實際生產圖片進行 PASS / REPAIR / REJECT 判定。
- Target: 實際生產量；規劃 20 張
- Priority: P0
- Gate: T107 圖片生成完成或有實際候選圖片可供審查後執行。

## 現行帳號架構

- ACCOUNT_01 → GENERATION_WORKER
- ACCOUNT_02 → GENERATION_WORKER
- ACCOUNT_03 → GENERATION_WORKER
- ACCOUNT_04 → GENERATION_WORKER
- ACCOUNT_05 → GENERATION_WORKER
- ACCOUNT_06 → MASTER_DIRECTOR / FINAL_REVIEWER / QA
- ACCOUNT_07 → GENERATION_WORKER（optional）
- ACCOUNT_08 → GENERATION_WORKER（optional）

## 任務設計原則

ACCOUNT_06 統一管理 Character / Clothing / Scene / Pose-Camera / Prompt 的設計整合。

Generation workers 只負責按照 queue 與 Prompt Package 生圖，不需要不同帳號各自下不同創意指令。

圖片生產以 `PRODUCTION/IMAGE_QUEUE.md` 為逐張狀態來源。不得因 ChatGPT 圖片生成額度、帳號切換或等待額度恢復而重置已完成圖片。

## 任務更新規則

Worker 完成圖片後更新自己的 worker 狀態與 production record；ACCOUNT_06 負責最終 QA 與需要重工的重新分配。
