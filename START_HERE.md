# START_HERE.md — 20歲依娜莉亞 LoRA 專案啟動文件

## Generation Worker startup

所有 generation worker（ACCOUNT_01–05、ACCOUNT_07–08）使用完全相同的啟動指令：

> 請讀取 GitHub 的 `rayclamp/lora_20` 專案。你現在是本專案的 Generation Worker。請按照 `START_HERE.md` 與 `00_MASTER/GENERATION_WORKER_PROTOCOL.md` 執行目前可用的圖片生產工作：讀取最新專案狀態與 `PRODUCTION/IMAGE_QUEUE.md`，依 Queue Lock Protocol 取得下一個尚未被其他 worker claim 的生產項目，先成功寫入 claim 再生成；讀取對應 Prompt Package，使用本聊天室由使用者直接上傳的 20 歲 Inaria MASTER_IMAGE 作人物身份基準，完成候選圖片生成，依規則保存/回報結果並更新自己的帳號狀態。不要重新設計角色、服裝、場景、姿勢或全域畫風，不要重做已完成工作；如果 claim 發生衝突就重新讀取 queue，不要生成；如果遇到圖片生成額度限制或必要條件不足，安全釋放目前尚未生成的 job，不要重置 queue。

## Master Director startup

ACCOUNT_06 使用 Master Director / Final QA 流程，不使用 Generation Worker 指令。

## MASTER_IMAGE

每個負責圖片工作的全新 ChatGPT 聊天室，啟動時由使用者直接上傳 `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`。
MASTER_IMAGE 只用於人物身份，不複製原圖服裝、背景、姿勢、鏡位或構圖。

## Queue Lock 核心規則

- 不依帳號啟動時間分配工作。
- 每次 claim 前重新讀取 queue。
- 使用最新 file blob SHA 做 conditional update。
- update 成功才代表 claim 成功。
- update conflict = 沒有 claim 成功，不得生成。
- 生成開始前再次確認 Worker / Claim ID / Lease。
- 每完成一張後重新讀取 queue。
- 未生成但被 quota / prerequisite 阻塞時，釋放回 `QUEUED`。
- lease 到期後不得使用舊 ownership 繼續寫入。

## 所有帳號啟動後必讀

1. `PROJECT_STATUS.md`
2. `00_MASTER/MASTER_SPEC.md`
3. `00_MASTER/MASTER_WORKFLOW.md`
4. `00_MASTER/ACCOUNT_WORKFLOW.md`
5. `00_MASTER/GENERATION_WORKER_PROTOCOL.md`
6. `00_MASTER/GENERATION_RULES.md`
7. `00_MASTER/STYLE_MASTER.md`
8. `00_MASTER/DRAWING_INSTRUCTIONS.md`
9. `00_MASTER/IDENTITY_MASTER.md`
10. `00_MASTER/QUALITY_CONTROL.md`
11. `00_MASTER/PRODUCTION_PROTOCOL.md`
12. `TASKS/TASK_QUEUE.md`
13. `PRODUCTION/IMAGE_QUEUE.md`
14. `ACCOUNTS/ACCOUNT_XX.md`
15. 當前 production Prompt Package

## 工作原則

- 不捏造缺失規則。
- 不重做已完成圖片，除非明確 NEED_REGENERATE。
- 具體內容以 queue 與 Prompt Package 為準。
- 多 workers 可以平行，但必須使用 queue lock。
- 每張圖片完成後立即記錄。
- quota / prerequisite 阻塞未生成 job 時，釋放回 queue。

## 完成後

Generation worker 更新自己的 account status 與必要 production record。
ACCOUNT_06 更新整合狀態、最終 QA 與必要任務狀態。
