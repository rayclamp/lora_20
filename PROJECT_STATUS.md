# PROJECT_STATUS.md — 20歲依娜莉亞 LoRA 專案總狀態

## 核心架構
- ACCOUNT_06 = MASTER_DIRECTOR / FINAL_REVIEWER / QA
- ACCOUNT_01–05、ACCOUNT_07–08 = GENERATION_WORKER
- GitHub = 跨聊天室主要狀態來源
- PRODUCTION/IMAGE_QUEUE.md = 第一輪逐張生產與 queue lock 狀態來源

## 第一輪 T107
- Status: IN_PROGRESS
- Target: 20
- Candidates recorded: 5
- QC_PENDING: 5
- Active claims: 0
- Generating: 0
- Queued: 15
- Blocked: 0
- Final PASS: 0

## Queue Lock
不再依賴 worker 啟動時間。

固定流程：
FETCH -> SELECT -> CLAIM -> VERIFY -> GENERATING -> GENERATE -> QC_PENDING

Claim 必須使用剛 fetch 的 queue blob SHA 做 conditional update。更新成功才算取得 job；若衝突則不得生成，必須重新 fetch。

Lease：
- ChatGPT manual: 120 minutes
- Make / OpenAI: 30 minutes

Lease 到期後舊 worker 不得繼續寫入，必須重新 claim。

## 生產策略
- 多 workers 可以平行處理不同 jobs。
- 同一 job 在有效 lease 期間只能由一個 worker 生成。
- 每完成一張後重新讀 queue。
- Make 未來接手時使用相同 queue claim 規則。
- 不需要再錯開帳號啟動時間。

## 下一步
從 IMG_06 開始繼續 T107，使用新版 Queue Lock startup command。
