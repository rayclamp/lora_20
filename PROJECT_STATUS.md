# PROJECT_STATUS.md — 20歲依娜莉亞 LoRA 專案總狀態

## 專案目標

建立可由「1 個 Master Director + 5–7 個 Generation Workers」共同執行的 20 歲依娜莉亞 LoRA 圖片生產系統。

GitHub 是跨聊天室的主要專案狀態來源。

## 核心架構

- **ACCOUNT_06** → MASTER_DIRECTOR / FINAL_REVIEWER / QA
- **ACCOUNT_01–05、ACCOUNT_07–08** → GENERATION_WORKER
- 實際啟用 5–7 個 generation workers。
- 原本 T101–T105 的 specialist design 工作現在由 ACCOUNT_06 統整執行；既有 handoff 作為核准設計資產，不需重做。

## 核心原則

- 所有帳號製作同一個 20 歲依娜莉亞。
- `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png` 是主要人物身份視覺基準。
- 全域規則唯一集中於 `00_MASTER/`。
- `TASKS/TASK_QUEUE.md` 是任務來源。
- `PRODUCTION/IMAGE_QUEUE.md` 是第一輪逐張生產與斷點續作狀態來源。
- 多個 worker 可以平行生圖。
- 舊聊天室與無關歷史畫風不得污染目前專案。

## 第一輪狀態

- T001 — MASTER_IMAGE 驗證：DONE / PASS
- T002 — 多帳號新聊天室啟動測試：DONE / PASS
- T101 — CHARACTER：DONE / PASS（approved source asset）
- T102 — CLOTHING：DONE / PASS（20 approved design units）
- T103 — SCENE：DONE / PASS（20 approved design units）
- T104 — POSE_CAMERA：DONE / PASS（20 approved design units）
- T105 — PROMPT：DONE / PASS（20 approved prompt packages）
- T107 — IMAGE_PRODUCTION：READY / 20 張第一輪候選
- T106 — FINAL REVIEW：WAITING FOR PRODUCTION

## 生產策略

第一輪 20 張由 generation worker pool 平行處理。

- 最少 5 個 worker 可開始。
- 最多 7 個 worker 可同時加入。
- 每個 worker 使用同一個啟動指令。
- Worker 從 queue 自動取得未 claim 的項目。
- Worker 不需要被指定不同創意工作。
- ACCOUNT_06 統一負責設計與最終 QA。

## 額度與斷點續作

ChatGPT 圖片生成額度是每個 worker 的獨立限制：

1. Worker 完成一張後立即記錄。
2. Worker 達到額度上限就停止。
3. 其他 worker 繼續未 claim 項目。
4. 若所有 worker 都達到限制，保留 queue 狀態等待恢復。
5. 不因帳號切換而重做已完成圖片。
6. 只有 REJECT / NEED_REGENERATE 才重新生成。

## 自動化鏈路

Make / OpenAI / MCP 是獨立技術鏈路。它們不阻塞目前手動多帳號 worker 生產。

## 下一步

1. 確認 5–7 個 generation worker 帳號已可用。
2. 每個 worker 使用同一個 startup command。
3. 執行 T107。
4. Codex first-layer QA。
5. ACCOUNT_06 Final QA。
6. 合格圖片進入 FINAL。
