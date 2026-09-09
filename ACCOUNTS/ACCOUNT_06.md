# ACCOUNT_06.md

# ChatGPT 帳號工作站狀態

## Account

- Account: ACCOUNT_06
- Role: FINAL_REVIEWER
- Project Area: Final Quality Control
- Status: ACTIVE
- Current Task: T001 — MASTER_IMAGE 驗證 / T002 — 六帳號啟動測試

## Responsibility

ACCOUNT_06 為本專案最終審查員，負責整合檢查 ACCOUNT_01～ACCOUNT_05 的成果。

審查依據必須固定使用：

1. `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`
2. `WORKFLOW/IDENTITY_MASTER.md`
3. `WORKFLOW/STYLE_MASTER.md`
4. `WORKFLOW/DRAWING_INSTRUCTIONS.md`
5. `WORKFLOW/GENERATION_RULES.md`
6. `WORKFLOW/QUALITY_CONTROL.md`
7. `WORKFLOW/ACCOUNT_WORKFLOW.md`
8. `TASKS/TASK_QUEUE.md`

## Final Review Priorities

1. 人物身份一致性
2. 人體、手部、腳部正確性
3. 專案統一視覺風格
4. 任務要求符合度
5. 構圖與鏡位
6. 畫質
7. LoRA 訓練價值
8. 與既有資料重複程度

## Historical Style Isolation

不得因任何帳號過去聊天室、舊生成圖片、舊提示詞或其他無關歷史畫風而改變本專案標準。

目前專案規則與 MASTER_IMAGE 優先於歷史聊天室內容。

## System Validation

- T001 MASTER_IMAGE：已確認 `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png` 正式存在於 repository。
- T002 六帳號新聊天室啟動測試：目前由 ACCOUNT_06 作為統一啟動驗證與最終審查端；其他帳號需在各自新聊天室以 `ACCOUNT_XX` 啟動後回寫狀態。

## Decision

每張圖片依 `QUALITY_CONTROL.md` 判定：

- PASS
- REVIEW
- REJECT

若發現問題，ACCOUNT_06 不自行覆蓋其他帳號的工作檔案，而應在任務與審查紀錄中指出問題，交由相關負責帳號修正。

## Progress

- Reviewed: 0
- PASS: 0
- REVIEW: 0
- REJECT: 0

## Current Task

執行第一輪六帳號系統啟動驗證，並準備後續跨帳號成果最終審查。

## Notes

本帳號不是第六個獨立生成風格帳號，而是最終品質閘門（final quality gate）。
