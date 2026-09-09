# START_HERE.md — 20歲依娜莉亞 LoRA 專案啟動文件

## 新聊天室啟動

請先確認自己負責的帳號：`ACCOUNT_XX`。

建議啟動指令：

> 請讀取 GitHub 的 `rayclamp/lora_20` 專案。本聊天室負責 `ACCOUNT_XX`。請按照 `START_HERE.md` 開始，讀取目前專案狀態、`00_MASTER/` 核心規則、任務佇列，以及本帳號進度。我另外上傳了 20 歲依娜莉亞 MASTER_IMAGE，請將它視為人物身份視覺基準。確認目前可執行的工作後直接繼續，不要重做已完成工作。除非需要我操作、需要等待，或工作階段完成，否則不必回報中間過程。

## MASTER_IMAGE

由於 GitHub repository 的 PNG 不一定能被 ChatGPT 直接解析為可視覺理解的圖片，本專案規定：負責圖片/人物工作的全新 ChatGPT 聊天室，啟動時由使用者直接上傳 `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`。

MASTER_IMAGE 只用於確認人物身份、臉部、髮色/外觀與辨識度；不得因此複製原圖的服裝、背景、姿勢、鏡位、構圖或單張畫面安排。

## 啟動後必讀

1. `PROJECT_STATUS.md`
2. `00_MASTER/MASTER_SPEC.md`
3. `00_MASTER/MASTER_WORKFLOW.md`
4. `00_MASTER/ACCOUNT_WORKFLOW.md`
5. `00_MASTER/GENERATION_RULES.md`
6. `00_MASTER/STYLE_MASTER.md`
7. `00_MASTER/DRAWING_INSTRUCTIONS.md`
8. `00_MASTER/IDENTITY_MASTER.md`
9. `00_MASTER/QUALITY_CONTROL.md`
10. `00_MASTER/PRODUCTION_PROTOCOL.md`
11. `TASKS/TASK_QUEUE.md`
12. `ACCOUNTS/ACCOUNT_XX.md`
13. 當前工作需要的 specialist specification / handoff

## 風格重置

每個新聊天室都視為風格重置。舊聊天室、其他專案、過去生成圖片或帳號歷史畫風不得影響本專案。若衝突，以當前使用者指令與 `00_MASTER/` 規則為準。

## 工作原則

- 不捏造缺失規則；先檢查 GitHub。
- 不重做 DONE 任務。
- 生成時以使用者上傳的 MASTER_IMAGE 鎖定人物身份。
- 具體內容以當前 TASK / Prompt Package 為準。
- 每張圖片完成後依 `PRODUCTION/IMAGE_QUEUE.md` 更新狀態。
- 圖片生成額度耗盡時保留進度，額度恢復後從下一張未完成圖片繼續。

## 完成後

更新自己的 `ACCOUNTS/ACCOUNT_XX.md`、相關 TASK 狀態與必要生產紀錄，讓下一個帳號或工作階段能直接接續。