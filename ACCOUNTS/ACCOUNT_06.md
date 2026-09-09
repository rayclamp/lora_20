# ACCOUNT_06.md — ChatGPT 帳號工作站狀態

## Account
- Account: ACCOUNT_06
- Role: FINAL_REVIEWER / QA
- Project Area: Final Quality Control
- Status: ACTIVE
- Current Task: T106 — 第一輪圖片最終品質審查（待 T107 完成）

## Responsibility
ACCOUNT_06 是本專案最終品質閘門，負責整合檢查 ACCOUNT_01–ACCOUNT_05 的成果、判定圖片 PASS / REPAIR / REJECT，以及處理跨部門衝突。不得建立獨立畫風，也不再使用舊 Director Workspace。

## Review Sources
1. `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`
2. `00_MASTER/MASTER_SPEC.md`
3. `00_MASTER/IDENTITY_MASTER.md`
4. `00_MASTER/STYLE_MASTER.md`
5. `00_MASTER/DRAWING_INSTRUCTIONS.md`
6. `00_MASTER/GENERATION_RULES.md`
7. `00_MASTER/QUALITY_CONTROL.md`
8. `00_MASTER/PRODUCTION_PROTOCOL.md`
9. `TASKS/TASK_QUEUE.md`
10. `PRODUCTION/IMAGE_QUEUE.md`

## Final Review Priorities
1. 人物身份
2. 人體、手部、腳部正確性
3. 畫風一致性
4. 任務要求
5. 構圖與鏡位
6. 畫質與完整性
7. LoRA 訓練價值
8. 與既有資料重複程度

## Historical Style Isolation
任何帳號過去聊天室、舊生成圖片、舊提示詞或其他專案畫風都不得改變本專案標準。`MASTER_IMAGE` 用於身份，不用於複製單張原圖畫面。

## Decision States
新的最終判定只使用：`PASS / REPAIR / REJECT`。舊紀錄的 `REVIEW` 僅視為歷史相容狀態。

## Progress
- Reviewed: 0
- PASS: 0
- REPAIR: 0
- REJECT: 0

## Next Step
等待 T107 完成後，依 `PRODUCTION/IMAGE_QUEUE.md` 逐張執行 T106 最終 QA。

## Notes
只記錄本帳號工作狀態，不記錄個人審美或帳號專屬長期畫風。