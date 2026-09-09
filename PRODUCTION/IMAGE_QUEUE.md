# IMAGE_QUEUE.md

# 20歲依娜莉亞 LoRA 第一輪圖片生產佇列

## 目的

本佇列用於管理第一輪 20 張正式 LoRA 圖片，確保圖片生成受到 ChatGPT 圖片生成額度、暫時限制、帳號切換或單張重生成影響時，仍可從最後完成的位置繼續，不重做已完成工作。

## 生產原則

1. 每張圖片都是獨立生產單元。
2. 已完成的圖片不得因額度恢復、帳號切換或流程重啟而重新生成。
3. 圖片生成額度不足時，立即停止在當前位置，保留狀態，等待額度恢復後從下一張 `NOT_STARTED` 繼續。
4. 首輪優先取得每個設計單元的候選成品，不因局部瑕疵立即大量重生成。
5. 重生成只針對明確 `REJECT` 或 `NEED_REGENERATE` 的圖片，並記錄原因。
6. T106 最終審查只能針對實際存在的圖片進行，不把預計數量視為完成數量。
7. 歷史聊天室畫風、其他專案畫風及舊生成結果不得改變本輪風格；以目前專案規則與 MASTER_IMAGE 身份基準為準。

## 狀態定義

- `NOT_STARTED`：尚未開始生成
- `GENERATED`：已產生候選圖片，尚未完成最終 QC
- `QC_PENDING`：候選圖片已整理完成，等待 ACCOUNT_06 最終審查
- `PASS`：最終品質審查通過
- `REVIEW`：需要人工確認或有限度修正
- `REJECT`：不符合品質要求，需要重做
- `NEED_REGENERATE`：已明確決定重新生成
- `BLOCKED`：因技術、額度或其他必要條件暫停

## 額度中斷規則

當前帳號達到圖片生成上限時：

- 不重做已完成圖片。
- 不為了湊滿當日數量而降低 QC 標準。
- 將當前未開始項目維持為 `NOT_STARTED`。
- 若正在生成的圖片已成功產生，先保存並標記 `GENERATED`。
- 在 `STATUS/PRODUCTION_LOG.md` 記錄本次實際完成數量與停止原因。
- 額度恢復後，從最小編號的 `NOT_STARTED` 項目繼續。

## 第一輪 20 張佇列

| ID | Character | Clothing | Scene | Pose/Camera | Prompt | Status | Final QC |
|---|---|---|---|---|---|---|---|
| IMG_01 | C01 | C01 | S01 | P01 | Prompt 01 | NOT_STARTED | - |
| IMG_02 | C01 | C02 | S02 | P02 | Prompt 02 | NOT_STARTED | - |
| IMG_03 | C01 | C03 | S03 | P03 | Prompt 03 | NOT_STARTED | - |
| IMG_04 | C01 | C04 | S04 | P04 | Prompt 04 | NOT_STARTED | - |
| IMG_05 | C01 | C05 | S05 | P05 | Prompt 05 | NOT_STARTED | - |
| IMG_06 | C01 | C06 | S06 | P06 | Prompt 06 | NOT_STARTED | - |
| IMG_07 | C01 | C07 | S07 | P07 | Prompt 07 | NOT_STARTED | - |
| IMG_08 | C01 | C08 | S08 | P08 | Prompt 08 | NOT_STARTED | - |
| IMG_09 | C01 | C09 | S09 | P09 | Prompt 09 | NOT_STARTED | - |
| IMG_10 | C01 | C10 | S10 | P10 | Prompt 10 | NOT_STARTED | - |
| IMG_11 | C01 | C11 | S11 | P11 | Prompt 11 | NOT_STARTED | - |
| IMG_12 | C01 | C12 | S12 | P12 | Prompt 12 | NOT_STARTED | - |
| IMG_13 | C01 | C13 | S13 | P13 | Prompt 13 | NOT_STARTED | - |
| IMG_14 | C01 | C14 | S14 | P14 | Prompt 14 | NOT_STARTED | - |
| IMG_15 | C01 | C15 | S15 | P15 | Prompt 15 | NOT_STARTED | - |
| IMG_16 | C01 | C16 | S16 | P16 | Prompt 16 | NOT_STARTED | - |
| IMG_17 | C01 | C17 | S17 | P17 | Prompt 17 | NOT_STARTED | - |
| IMG_18 | C01 | C18 | S18 | P18 | Prompt 18 | NOT_STARTED | - |
| IMG_19 | C01 | C19 | S19 | P19 | Prompt 19 | NOT_STARTED | - |
| IMG_20 | C01 | C20 | S20 | P20 | Prompt 20 | NOT_STARTED | - |

## 計數規則

- Target: 20
- GENERATED: 0
- QC_PENDING: 0
- PASS: 0
- REVIEW: 0
- REJECT: 0
- NEED_REGENERATE: 0
- NOT_STARTED: 20

## 續作方式

每次開始生產前先讀取本檔案。第一個可執行項目為最小編號的 `NOT_STARTED`；若存在 `NEED_REGENERATE`，依已記錄的重生成優先級處理。

完成單張後立即更新狀態，不等待整批完成才更新。任何額度中斷都不得清空或重置進度。

## 相關文件

- `05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md`
- `WORKFLOW/QUALITY_CONTROL.md`
- `WORKFLOW/GENERATION_RULES.md`
- `WORKFLOW/STYLE_MASTER.md`
- `WORKFLOW/IDENTITY_MASTER.md`
- `WORKFLOW/DRAWING_INSTRUCTIONS.md`
- `STATUS/PRODUCTION_LOG.md`
- `TASKS/TASK_QUEUE.md`
