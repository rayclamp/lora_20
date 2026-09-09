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
- `WORKFLOW/GENERATION_RULES.md`
- `WORKFLOW/STYLE_MASTER.md`
- `WORKFLOW/DRAWING_INSTRUCTIONS.md`
- `WORKFLOW/IDENTITY_MASTER.md`
- `WORKFLOW/QUALITY_CONTROL.md`
- `TASKS/TASK_QUEUE.md`
- `STATUS/PRODUCTION_LOG.md`

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

- T001 — MASTER_IMAGE 驗證：ASSIGNED → ACCOUNT_06
- T002 — 六帳號新聊天室啟動測試：UNASSIGNED

### 生產任務

- T101 — CHARACTER：UNASSIGNED → ACCOUNT_01
- T102 — CLOTHING：UNASSIGNED → ACCOUNT_02
- T103 — SCENE：UNASSIGNED → ACCOUNT_03
- T104 — POSE_CAMERA：UNASSIGNED → ACCOUNT_04
- T105 — PROMPT：UNASSIGNED → ACCOUNT_05
- T106 — FINAL REVIEW：UNASSIGNED → ACCOUNT_06

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

### 尚未完成

- [ ] 六帳號新聊天室啟動測試
- [ ] 第一批角色資料任務執行
- [ ] 第一批圖片生產
- [ ] ACCOUNT_06 第一輪最終審查

---

## 自動化

Make / OpenAI / MCP 的檔案傳遞與圖片自動化為另一條技術鏈路。

Google Drive → Make binary → ReturnData file object → MCP 已能取得 PNG 本體；MCP → ChatGPT 原生圖片附件的最終驗證仍屬獨立技術問題，不應阻塞 GitHub 多帳號工作架構。

---

## 下一步

1. 執行 T001 MASTER_IMAGE repository 狀態確認。
2. 執行 T002 六帳號新聊天室啟動測試。
3. 五個專業帳號依角色取得 T101～T105。
4. 各角色成果進入 ACCOUNT_06 最終審查。
5. 通過後建立正式 LoRA 生產批次與紀錄。

---

## 狀態更新規則

任何帳號完成工作後，只更新自己負責的 ACCOUNT 檔案，以及任務佇列中與自己直接相關的任務狀態。

全域狀態只有在確實發生全域變化時才更新。

不要把聊天室中的暫時討論當成專案永久規則；永久規則必須寫入 GitHub。
