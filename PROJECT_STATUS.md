# PROJECT_STATUS.md — 20歲依娜莉亞 LoRA 專案總狀態

## 專案目標

建立可由六個 ChatGPT 帳號共同執行的 20 歲依娜莉亞 LoRA 圖片生產系統。GitHub 是跨聊天室的主要專案狀態來源。

## 核心原則

- 所有帳號製作同一個 20 歲依娜莉亞。
- `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png` 是主要人物身份視覺基準。
- 全域規則唯一集中於 `00_MASTER/`。
- `TASKS/TASK_QUEUE.md` 是任務來源。
- `PRODUCTION/IMAGE_QUEUE.md` 是第一輪逐張生產與斷點續作狀態來源。
- 舊聊天室與無關歷史畫風不得污染目前專案。

## Repository

`rayclamp/lora_20` / branch `main`

## 六帳號分工

- ACCOUNT_01 → `01_CHARACTER` → CHARACTER
- ACCOUNT_02 → `02_CLOTHING` → CLOTHING
- ACCOUNT_03 → `03_SCENE` → SCENE
- ACCOUNT_04 → `04_POSE_CAMERA` → POSE_CAMERA
- ACCOUNT_05 → `05_PROMPT` → PROMPT / GENERATION / DATASET
- ACCOUNT_06 → FINAL_REVIEWER → 最終 QA

## 現行核心文件

- `START_HERE.md`
- `PROJECT_STATUS.md`
- `00_MASTER/MASTER_SPEC.md`
- `00_MASTER/MASTER_WORKFLOW.md`
- `00_MASTER/ACCOUNT_WORKFLOW.md`
- `00_MASTER/GENERATION_RULES.md`
- `00_MASTER/STYLE_MASTER.md`
- `00_MASTER/DRAWING_INSTRUCTIONS.md`
- `00_MASTER/IDENTITY_MASTER.md`
- `00_MASTER/QUALITY_CONTROL.md`
- `00_MASTER/PRODUCTION_PROTOCOL.md`
- `00_MASTER/CHANGELOG.md`
- `TASKS/TASK_QUEUE.md`
- `PRODUCTION/IMAGE_QUEUE.md`
- `STATUS/PRODUCTION_LOG.md`

舊 `WORKFLOW/` 與 `06_DIRECTOR/` 已從現行架構移除，不得重新建立。

## MASTER_IMAGE

- Path: `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`
- Version: v1.0
- Status: 已正式存在於 repository

## 任務狀態

- T001 — MASTER_IMAGE 驗證：DONE / PASS
- T002 — 六帳號新聊天室啟動測試：DONE / PASS / 6 of 6
- T101 — CHARACTER：DONE / PASS
- T102 — CLOTHING：DONE / PASS / 20 of 20
- T103 — SCENE：DONE / PASS / 20 of 20
- T104 — POSE_CAMERA：DONE / PASS / 20 of 20
- T105 — PROMPT：DONE / PASS / 20 of 20
- T107 — IMAGE_PRODUCTION：待開始 / 20 張第一輪候選
- T106 — FINAL REVIEW：待 T107 完成後執行

## 第一輪圖片生產

目標 20 張。Prompt Package 使用 C01–C20、S01–S20、P01–P20 各一次組合；Character / Clothing / Scene / Pose-Camera / Lighting-Style / Negative 模組分離。

## 圖片額度與斷點續作

ChatGPT 圖片生成額度可能在生產中達到上限。這不是失敗：

1. 從 `PRODUCTION/IMAGE_QUEUE.md` 最小編號未完成項目開始。
2. 成功產生一張就保存並更新狀態。
3. 額度耗盡時停止，不重做已完成圖片。
4. 額度恢復後從下一張未完成項目繼續。
5. 只有 REJECT / NEED_REGENERATE 才重新生成。
6. 20 張完成後才進入 ACCOUNT_06 最終 QA。

## 自動化鏈路

Make / OpenAI / MCP 的檔案傳遞是獨立技術鏈路，不阻塞目前 GitHub 多帳號圖片生產架構。

## 下一步

1. 執行 T107。
2. 依 `PRODUCTION/IMAGE_QUEUE.md` 逐張生成與記錄。
3. 全部 20 張完成後執行 T106。
4. 最終合格圖片進入 `FINAL/`。
