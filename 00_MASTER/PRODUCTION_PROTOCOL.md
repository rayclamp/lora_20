# PRODUCTION_PROTOCOL.md — 多帳號圖片生產協議

## 1. Purpose
GitHub 是共享狀態層。ACCOUNT_06 是 Master Director；ACCOUNT_01–05、ACCOUNT_07–08 是 Generation Workers。

## 2. Production state machine
`QUEUED → CLAIMED → GENERATING → GENERATED → QC_PENDING → PASS / REPAIR / REJECT`

例外：`BLOCKED / FAILED / NEED_REGENERATE`

## 3. Queue ownership
`CLAIMED` / `GENERATING` 是 exclusive worker ownership。
Ownership 不由聊天室啟動時間決定，而由 GitHub queue 的 successful conditional update 決定。

## 4. Claim transaction
固定流程：

`FETCH → SELECT → CLAIM(CAS) → VERIFY → GENERATING → GENERATE → RECORD → QC_PENDING`

- FETCH：取得最新 queue 與 blob SHA。
- SELECT：選最低編號 `QUEUED` job。
- CLAIM(CAS)：使用剛 FETCH 的 SHA 更新 queue。
- VERIFY：再次確認 Worker / Claim ID / Lease。
- GENERATING：成功寫入後才開始生圖。
- RECORD：寫入 production log / account state。
- QC_PENDING：候選進入 ACCOUNT_06 review queue。

若 CLAIM 更新失敗，視為**沒有取得 job**；不得生成，必須重新 FETCH。

## 5. Lease
- ChatGPT manual worker: 120 minutes
- Make / OpenAI worker: 30 minutes
- 超過預估時間時必須在到期前續租。
- Lease 到期後舊 worker 不得覆寫；必須重新 claim。

## 6. Parallelism
不同 workers 可以平行處理不同 jobs。
同一 job 在有效 lease 期間不得被兩個 workers 同時生成。

**不再依賴 staggered startup。**
Make 即使比 ChatGPT 快很多，也必須先經過同一個 claim transaction。

## 7. Recovery
未生成即阻塞：
- 記錄原因；
- 清除 ownership；
- job 回到 `QUEUED`。

已生成：
- 保留候選；
- 設為 `QC_PENDING`；
- 清除 ownership；
- 不得重做。

Lease expired：
- 新 worker 重新 FETCH；
- 驗證舊 lease 已過期；
- 使用新 Claim ID 重新 claim。

## 8. Final review
ACCOUNT_06 依 `00_MASTER/QUALITY_CONTROL.md` 審查實際存在的圖片。

## 9. Dataset finalization
只有通過 ACCOUNT_06 Final QA 且 metadata / lineage 完整的圖片才可進入 `FINAL/`。
