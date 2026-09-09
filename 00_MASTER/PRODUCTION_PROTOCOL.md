# PRODUCTION_PROTOCOL.md — 六帳號 LoRA 生產協議

## 1. Purpose

將專案規則轉為可重複執行的生產流程。GitHub 是共享記憶層；不再使用獨立 Director Workspace。

## 2. Authority

1. 當前使用者指令
2. `00_MASTER/MASTER_SPEC.md`
3. MASTER_IMAGE 與其他核准參考資產
4. 專業規格與 handoff
5. 暫時實作選擇

## 3. Production state machine

`QUEUED → PREFLIGHT → DESIGNING → GENERATING → REVIEWING → REPAIR → RECHECK → APPROVED → FINALIZED`

例外：`BLOCKED / REJECTED / CANCELLED`。

第一輪實際圖片以 `PRODUCTION/IMAGE_QUEUE.md` 作為逐張狀態來源。

## 4. Preflight

開始前確認：身份/年齡、聊天室中的 MASTER_IMAGE、五個專業輸入、Master 規則、Prompt Package、輸出位置、任務數量、已知硬限制與目前 queue 狀態。

## 5. Specialist handoff

每份 handoff 應標示任務 ID、部門、版本、完成決策、鎖定條件、可變條件、未解問題與輸出路徑。

## 6. Generation

ACCOUNT_05 組裝與執行生成內容；候選圖產生後立即依 queue 保存與標記。不得因額度不足而重做已完成圖片。

## 7. Final review

ACCOUNT_06 依 `00_MASTER/QUALITY_CONTROL.md` 審查每張圖片。檢查身份、人體、手腳、任務、服裝、場景、Pose/Camera、畫質、風格、完整性與資料集價值。

## 8. Decision rules

- `PASS`：全部硬性條件通過且具足夠資料集價值。
- `REPAIR`：身份/設計有效，缺陷局部且可安全修復。
- `REJECT`：嚴重或系統性失敗，或資料集價值不足。

修復後必須完整重新檢查。

## 9. Dataset finalization

只有 PASS、caption/metadata 完整、來源與版本可追溯、無不必要近似、且已通過 ACCOUNT_06 最終閘門的圖片才可進入 `FINAL/`。

## 10. Quota interruption

ChatGPT 圖片生成額度不是專案狀態。額度耗盡時，將目前項目保留為未完成/等待狀態，下一次從最小編號未完成項目繼續。只有明確 REJECT 或 NEED_REGENERATE 才重新消耗生成額度。

## 11. Repository rules

全域規則只放在 `00_MASTER/`。不要重新建立 `WORKFLOW/` 或 `06_DIRECTOR/`。專業輸出放在 `01_CHARACTER`–`05_PROMPT`，帳號狀態放 `ACCOUNTS/`，任務放 `TASKS/`，生產佇列放 `PRODUCTION/`，紀錄放 `STATUS/`，最終資料放 `FINAL/`。

## 12. Completion

工作單元只有在輸出、QA、狀態、紀錄與必要 metadata 都完成後才算完成。