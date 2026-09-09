# PROJECT_STATUS.md

# 20歲依娜莉亞 LoRA 專案總狀態

## 專案目標

建立一套可由多個 ChatGPT 帳號共同執行的 20 歲依娜莉亞 LoRA 圖片生產系統。

GitHub 是跨聊天室、跨帳號的主要專案狀態來源。

---

## 核心原則

- 所有帳號製作同一個 20 歲依娜莉亞。
- `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png` 是人物身份唯一主要基準。
- `STYLE_MASTER` 是統一視覺風格基準。
- `DRAWING_INSTRUCTIONS` 是使用者長期繪圖規則。
- `QUALITY_CONTROL` 是統一品質驗收標準。
- `TASK_QUEUE` 是工作分配來源。
- `ACCOUNT_XX` 是各帳號自己的進度記錄。
- 舊聊天室與無關歷史畫風不得污染目前專案。
- `PRODUCTION/IMAGE_QUEUE.md` 是第一輪圖片逐張生產與斷點續作狀態來源。

---

## Repository

`rayclamp/lora_20`

主要工作 branch：`main`

---

## MASTER_IMAGE

- Path: `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`
- Version: v1.0
- Status: 已正式存在於 repository
- 用途：六個帳號共同使用的 20 歲依娜莉亞人物身份基準

---

## 六帳號正式分工

- ACCOUNT_01 → `01_CHARACTER` → CHARACTER
- ACCOUNT_02 → `02_CLOTHING` → CLOTHING
- ACCOUNT_03 → `03_SCENE` → SCENE
- ACCOUNT_04 → `04_POSE_CAMERA` → POSE_CAMERA
- ACCOUNT_05 → `05_PROMPT` → PROMPT
- ACCOUNT_06 → Final Reviewer → 最終審查員

ACCOUNT_06 不負責建立獨立畫風或取代前五個帳號的專業分工，而是作為最終品質閘門。

---

## 目前文件架構

### 核心文件

- `START_HERE.md`
- `PROJECT_STATUS.md`
- `WORKFLOW/MASTER_WORKFLOW.md`
- `WORKFLOW/ACCOUNT_WORKFLOW.md`
- `WORKFLOW/GENERATION_RULES.md` — workflow-facing alias；權威規則仍為 `00_MASTER/GENERATION_RULES.md`
- `WORKFLOW/STYLE_MASTER.md`
- `WORKFLOW/DRAWING_INSTRUCTIONS.md`
- `WORKFLOW/IDENTITY_MASTER.md`
- `WORKFLOW/QUALITY_CONTROL.md`
- `TASKS/TASK_QUEUE.md`
- `STATUS/PRODUCTION_LOG.md`
- `PRODUCTION/IMAGE_QUEUE.md` — 第一輪 20 張圖片逐張生產佇列與斷點續作控制

### 帳號狀態檔

- `ACCOUNTS/ACCOUNT_01.md` — CHARACTER
- `ACCOUNTS/ACCOUNT_02.md` — CLOTHING
- `ACCOUNTS/ACCOUNT_03.md` — SCENE
- `ACCOUNTS/ACCOUNT_04.md` — POSE_CAMERA
- `ACCOUNTS/ACCOUNT_05.md` — PROMPT
- `ACCOUNTS/ACCOUNT_06.md` — FINAL_REVIEWER
- `ACCOUNTS/ACCOUNT_TEMPLATE.md` — 狀態檔模板

---

## 任務狀態

### 系統驗證

- T001 — MASTER_IMAGE 驗證：DONE / PASS
- T002 — 六帳號新聊天室啟動測試：DONE / PASS / 6 of 6

### 第一輪生產前置資料

- T101 — CHARACTER：DONE / PASS → `01_CHARACTER/CHARACTER_SPEC.md` v1.1
- T102 — CLOTHING：DONE / PASS → `02_CLOTHING/T102_CLOTHING_HANDOFF_v1.0.md`（20 個設計單元）
- T103 — SCENE：DONE / PASS → `03_SCENE/T103_SCENE_HANDOFF_v1.0.md`（20 個設計單元）
- T104 — POSE_CAMERA：DONE / PASS → `04_POSE_CAMERA/T104_POSE_CAMERA_HANDOFF_v1.0.md`（20 個設計單元）
- T105 — PROMPT：DONE / PASS → `05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md`（20 個 Prompt Package）

### 第一輪圖片生產

- T107 — IMAGE_PRODUCTION：UNASSIGNED → 20 張第一輪候選圖片
- T106 — FINAL REVIEW：UNASSIGNED → 第一輪實際生成圖片的最終品質閘門

---

## 第一輪生產規模

第一輪正式圖片目標：20 張。

前置專業資料以可組合設計單元建立：
- Character：1 份正式身份 Specification / Handoff
- Clothing：20 單元
- Scene：20 單元
- Pose/Camera：20 單元
- Prompt：20 Package

圖片生產逐張由 `PRODUCTION/IMAGE_QUEUE.md` 管理。圖片生成額度不足、帳號切換或暫時等待都不得造成已完成圖片被重做。

---

## 圖片驗收

每張圖片必須經過：

`WORKFLOW/QUALITY_CONTROL.md`

判定為：

- PASS
- REVIEW
- REJECT

LoRA 資料集優先考慮人物身份穩定、人體正確、風格一致，以及資料多樣性與訓練價值。

---

## 目前進度

### 架構設計

- [x] GitHub 作為跨帳號專案記憶中心
- [x] 20 歲 MASTER_IMAGE 身份基準正式放入 repository
- [x] 統一風格規則
- [x] 長期繪圖規則
- [x] 人物身份規則
- [x] 多帳號工作規則
- [x] 品質驗收規則
- [x] 新聊天室啟動規則
- [x] 任務佇列正式建立
- [x] 六個帳號角色正式建立
- [x] 生產紀錄正式建立
- [x] 六帳號新聊天室啟動驗證
- [x] 第一輪生產 Target 定義
- [x] `WORKFLOW/GENERATION_RULES.md` 路徑對齊
- [x] 第一輪圖片斷點續作佇列建立

### 尚未完成

- [ ] T107 第一輪 20 張圖片生產
- [ ] T106 ACCOUNT_06 第一輪最終審查

### 第一輪 Prompt

- [x] T105 20 個 Prompt Package 完成並完成結構化 handoff
- [x] C01–C20、S01–S20、P01–P20 各完成一次組合
- [x] Character / Clothing / Scene / Pose-Camera / Lighting-Style / Negative 模組分離
- [x] 身份與人體穩定性規則納入 Prompt Package

---

## 圖片額度與斷點續作

ChatGPT 圖片生成額度視帳號與方案而定，可能在生產過程中暫時達到上限。專案不得假設一次可以完成全部 20 張。

正式執行方式：

1. 從 `PRODUCTION/IMAGE_QUEUE.md` 最小編號的 `NOT_STARTED` 開始。
2. 每成功產生一張立即保存並更新狀態。
3. 達到圖片生成上限時停止，不重做已完成圖片。
4. 額度恢復後從下一個未完成項目繼續。
5. 只有明確 REJECT / NEED_REGENERATE 的圖片才進入重生成。
6. 全部 20 張實際完成後才進入 T106。

---

## 自動化

Make / OpenAI / MCP 的檔案傳遞與圖片自動化為另一條技術鏈路。

Google Drive → Make binary → ReturnData file object → MCP 已能取得 PNG 本體；MCP → ChatGPT 原生圖片附件的最終驗證仍屬獨立技術問題，不應阻塞 GitHub 多帳號工作架構。

---

## 下一步

1. 指定執行 T107 的圖片生產帳號／聊天室。
2. 使用 T105 的 20 個 Prompt Package，依 `PRODUCTION/IMAGE_QUEUE.md` 逐張生成。
3. 每張圖片完成後保存並更新 queue 與 `STATUS/PRODUCTION_LOG.md`。
4. 若達圖片生成上限，保留狀態並等待額度恢復後續作。
5. 20 張全部完成後，由 ACCOUNT_06 執行 T106 最終 PASS / REVIEW / REJECT。

---

## 狀態更新規則

任何帳號完成工作後，只更新自己負責的 ACCOUNT 檔案，以及任務佇列中與自己直接相關的任務狀態。

全域狀態只有在確實發生全域變化時才更新。

不要把聊天室中的暫時討論當成專案永久規則；永久規則必須寫入 GitHub。
