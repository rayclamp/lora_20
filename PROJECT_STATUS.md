# PROJECT_STATUS.md

# 20歲依娜莉亞 LoRA 專案總狀態

## 專案目標

建立一套可由多個 ChatGPT 帳號共同執行的 20 歲依娜莉亞 LoRA 圖片生產系統。

GitHub 是跨聊天室、跨帳號的主要專案狀態來源。

---

## 核心原則

- 所有帳號製作同一個 20 歲依娜莉亞。
- MASTER_IMAGE 是人物身份唯一主要基準。
- STYLE_MASTER 是統一視覺風格基準。
- DRAWING_INSTRUCTIONS 是使用者長期繪圖規則。
- QUALITY_CONTROL 是統一品質驗收標準。
- TASK_QUEUE 是工作分配來源。
- ACCOUNT_XX 是各帳號自己的進度記錄。
- 舊聊天室與無關歷史畫風不得污染目前專案。

---

## Repository

`rayclamp/lora_20`

主要工作 branch：`main`

---

## 目前文件架構

### 已建立／核心文件

- `START_HERE.md`
- `PROJECT_STATUS.md`
- `WORKFLOW/MASTER_WORKFLOW.md`
- `WORKFLOW/ACCOUNT_WORKFLOW.md`
- `WORKFLOW/GENERATION_RULES.md`
- `WORKFLOW/STYLE_MASTER.md`
- `WORKFLOW/DRAWING_INSTRUCTIONS.md`
- `WORKFLOW/IDENTITY_MASTER.md`
- `WORKFLOW/QUALITY_CONTROL.md`

### 待建立或確認

- `TASKS/TASK_QUEUE.md`
- `ACCOUNTS/ACCOUNT_01.md` 及其他實際使用帳號檔案
- `STATUS/PRODUCTION_LOG.md`
- `MASTER/20歲 MASTER_IMAGE.png` 是否已正式放入本 repository

---

## 工作分工模型

每個 ChatGPT 帳號是一個生產工作站。

例如：

- ACCOUNT_01 → 一組場景／動作資料
- ACCOUNT_02 → 另一組場景／動作資料
- ACCOUNT_03 → 另一組場景／動作資料

實際分配以 TASK_QUEUE.md 為準。

帳號不得建立自己的長期畫風。

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
- [x] 20 歲 MASTER_IMAGE 身份概念
- [x] 統一風格規則
- [x] 長期繪圖規則
- [x] 人物身份規則
- [x] 多帳號工作規則
- [x] 品質驗收規則
- [x] 新聊天室啟動規則
- [ ] 任務佇列正式建立
- [ ] 各帳號狀態檔正式建立
- [ ] 生產紀錄正式建立

### 自動化

Make / OpenAI / MCP 的檔案傳遞與圖片自動化為另一條技術鏈路。

Google Drive → Make binary → ReturnData file object → MCP 已能取得 PNG 本體；MCP → ChatGPT 原生圖片附件的最終驗證仍屬獨立技術問題，不應阻塞 GitHub 多帳號工作架構的建立。

---

## 目前下一步

1. 建立 TASK_QUEUE.md。
2. 建立第一批 ACCOUNT_XX 狀態檔。
3. 建立 PRODUCTION_LOG.md。
4. 確認 MASTER_IMAGE 的 repository 狀態。
5. 完成新帳號啟動測試。
6. 開始實際分批生產 LoRA 圖片。

---

## 狀態更新規則

任何帳號完成工作後，只更新自己負責的 ACCOUNT 檔案，以及任務佇列中與自己直接相關的任務狀態。

全域狀態只有在確實發生全域變化時才更新。

不要把聊天室中的暫時討論當成專案永久規則；永久規則必須寫入 GitHub。
