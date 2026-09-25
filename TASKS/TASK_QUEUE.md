# TASK_QUEUE.md — 20歲依娜莉亞 LoRA 任務佇列

## 使用規則

所有帳號從本文件取得工作。

圖片生產逐張狀態由 PRODUCTION/IMAGE_QUEUE.md 管理。
圖片 queue 使用：
QUEUED、CLAIMED、GENERATING、GENERATED、QC_PENDING、PASS、REPAIR、REJECT、NEED_REGENERATE、BLOCKED、FAILED。

## T001 — 20歲 MASTER_IMAGE 驗證
- Status: DONE / PASS
- Account: ACCOUNT_06
- Target: 1
- Completed: 1
- Priority: P0

## T002 — 多帳號新聊天室啟動測試
- Status: DONE / PASS
- Account: ACCOUNT_01～ACCOUNT_06
- Target: 6
- Completed: 6
- Priority: P0

## T101–T105 — 前置設計資料
- Status: DONE / PASS
- These are approved design assets / handoffs.
- Generation workers do not redesign them.

## T107 — IMAGE_PRODUCTION 第一輪 20 張圖片
- Status: IN_PROGRESS
- Account: GENERATION_WORKER_POOL
- Project Area: PRODUCTION
- Target: 20
- Completed candidates: 5
- QC_PENDING: 5
- PASS: 0
- REPAIR: 0
- REJECT: 0
- NEED_REGENERATE: 0
- ACTIVE CLAIMS: 0
- GENERATING: 0
- QUEUED: 15
- BLOCKED: 0
- Priority: P0
- Input: 05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md
- Queue: PRODUCTION/IMAGE_QUEUE.md
- Execution: Any available generation worker may claim the next QUEUED job through the Queue Lock Protocol.
- Concurrency: A worker must successfully conditional-update the queue using its current blob SHA before generation.
- Worker rule: All workers use the same startup command.

## T106 — FINAL REVIEW 第一輪最終整合審查
- Status: WAITING FOR T107
- Account: ACCOUNT_06
- Project Area: Final Quality Control
- Target: 實際生產量；規劃 20 張
- Priority: P0
- Gate: 有實際候選圖片可供審查後執行。

## 現行帳號架構
- ACCOUNT_01–05 → GENERATION_WORKER
- ACCOUNT_06 → MASTER_DIRECTOR / FINAL_REVIEWER / QA
- ACCOUNT_07–08 → GENERATION_WORKER（optional）

## 任務設計原則
ACCOUNT_06 統一管理 Character / Clothing / Scene / Pose-Camera / Prompt。
Generation workers 只負責按照 queue 與 Prompt Package 生圖。

不得因 ChatGPT 圖片生成額度、帳號切換或等待額度恢復而重置已完成圖片。

## Queue Lock 原則
- 不依帳號啟動時間分工。
- 每次 claim 前重新 fetch。
- 使用最新 queue blob SHA conditional-update。
- claim update 成功才可生成。
- claim conflict 必須停止生成並重新 fetch。
- ChatGPT lease: 120 minutes。
- Make/OpenAI lease: 30 minutes。
- lease 到期後舊 worker 不得覆寫。
