# IMAGE_QUEUE.md

# 20歲依娜莉亞 LoRA 第一輪圖片生產佇列

## 目的

本佇列用於管理第一輪 20 張正式 LoRA 圖片。它支援 5–7 個 ChatGPT generation workers 平行生產，避免單一帳號圖片額度成為瓶頸。

## 生產原則

1. 每張圖片都是獨立生產單元。
2. 每個 queue item 必須先被一個 worker claim 才能生成。
3. 同一時間不得有兩個 workers 同時 claim 同一 item。
4. 已完成的圖片不得因額度恢復、帳號切換或流程重啟而重新生成。
5. 單一 worker 額度不足時，其他 workers 可繼續未 claim 項目。
6. 首輪優先取得每個設計單元的候選成品，不因局部瑕疵立即大量重生成。
7. 重生成只針對明確 NEED_REGENERATE / NEED_REWORK 的圖片。
8. ACCOUNT_06 Final QA 只針對實際存在的圖片進行。

## 狀態定義

- `NOT_STARTED`：尚未被 worker 取得。
- `CLAIMED`：已由指定 worker 取得，其他 worker 不得執行。
- `GENERATED`：已產生候選圖片。
- `QC_PENDING`：候選圖片已整理，等待 ACCOUNT_06 最終審查。
- `PASS`：ACCOUNT_06 最終通過。
- `REPAIR`：需要局部修復。
- `REJECT`：不符合品質要求，需要排除或重做。
- `NEED_REGENERATE`：已明確決定重新生成。
- `BLOCKED`：因額度、技術或其他必要條件暫停。

## 額度中斷規則

當前 worker 達到圖片生成上限：

- 不重做已完成圖片。
- 將未開始的其他項目留給其他 workers。
- 若目前 item 尚未生成，標記為可重新取得的狀態並記錄原因。
- 若圖片已成功產生，先保存並標記 GENERATED。
- 在 `STATUS/PRODUCTION_LOG.md` 記錄本次實際完成數量與停止原因。
- 其他 worker 可繼續下一個可用 item。

## 第一輪 20 張佇列

| ID | Character | Clothing | Scene | Pose/Camera | Prompt | Worker | Status | Final QC |
|---|---|---|---|---|---|---|---|---|
| IMG_01 | C01 | C01 | S01 | P01 | Prompt 01 | ACCOUNT_01 | QC_PENDING | - |
| IMG_02 | C01 | C02 | S02 | P02 | Prompt 02 | ACCOUNT_01 | QC_PENDING | - |
| IMG_03 | C01 | C03 | S03 | P03 | Prompt 03 | ACCOUNT_01 | QC_PENDING | - |
| IMG_04 | C01 | C04 | S04 | P04 | Prompt 04 | ACCOUNT_03 | CLAIMED | - |
| IMG_05 | C01 | C05 | S05 | P05 | Prompt 05 | - | NOT_STARTED | - |
| IMG_06 | C01 | C06 | S06 | P06 | Prompt 06 | - | NOT_STARTED | - |
| IMG_07 | C01 | C07 | S07 | P07 | Prompt 07 | - | NOT_STARTED | - |
| IMG_08 | C01 | C08 | S08 | P08 | Prompt 08 | - | NOT_STARTED | - |
| IMG_09 | C01 | C09 | S09 | P09 | Prompt 09 | - | NOT_STARTED | - |
| IMG_10 | C01 | C10 | S10 | P10 | Prompt 10 | - | NOT_STARTED | - |
| IMG_11 | C01 | C11 | S11 | P11 | Prompt 11 | - | NOT_STARTED | - |
| IMG_12 | C01 | C12 | S12 | P12 | Prompt 12 | - | NOT_STARTED | - |
| IMG_13 | C01 | C13 | S13 | P13 | Prompt 13 | - | NOT_STARTED | - |
| IMG_14 | C01 | C14 | S14 | P14 | Prompt 14 | - | NOT_STARTED | - |
| IMG_15 | C01 | C15 | S15 | P15 | Prompt 15 | - | NOT_STARTED | - |
| IMG_16 | C01 | C16 | S16 | P16 | Prompt 16 | - | NOT_STARTED | - |
| IMG_17 | C01 | C17 | S17 | P17 | Prompt 17 | - | NOT_STARTED | - |
| IMG_18 | C01 | C18 | S18 | P18 | Prompt 18 | - | NOT_STARTED | - |
| IMG_19 | C01 | C19 | S19 | P19 | Prompt 19 | - | NOT_STARTED | - |
| IMG_20 | C01 | C20 | S20 | P20 | Prompt 20 | - | NOT_STARTED | - |

## 計數規則

- Target: 20
- GENERATED: 3
- QC_PENDING: 3
- PASS: 0
- REPAIR: 0
- REJECT: 0
- NEED_REGENERATE: 0
- NOT_STARTED: 16
- CLAIMED: 1

## 續作方式

Worker 每次開始生產前先讀取本檔案。取得最小編號的未 claim 項目後，先 claim，再生成。

完成單張後立即更新狀態與 Worker 欄位，不等待整批完成。

## 相關文件

- `05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md`
- `00_MASTER/GENERATION_WORKER_PROTOCOL.md`
- `00_MASTER/QUALITY_CONTROL.md`
- `STATUS/PRODUCTION_LOG.md`
- `TASKS/TASK_QUEUE.md`
