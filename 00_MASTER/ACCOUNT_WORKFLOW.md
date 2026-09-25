# ACCOUNT_WORKFLOW.md — 多帳號工作規則

## 1. 共用原則

本專案採用「單一 Master Director + 多個 Generation Workers + shared queue lock」架構。

- ACCOUNT_06 = Master Director / Final Reviewer / QA
- ACCOUNT_01–05、ACCOUNT_07–08 = Generation Workers
- GitHub = 跨聊天室持久化狀態來源

## 2. Generation worker 核心職責

1. 讀取最新 queue。
2. 找到最低編號的 `QUEUED` job。
3. 使用最新 queue blob SHA 成功 conditional-update 後才取得 ownership。
4. 驗證 Worker / Claim ID / Lease。
5. 開始生成。
6. 完成後立即記錄候選與 queue 狀態。
7. 重新 fetch queue，再取得下一張。
8. quota / prerequisite 阻塞且尚未生成時，釋放 job 回 `QUEUED`。

## 3. Queue Lock

### Claim transaction

`FETCH queue + SHA → SELECT → CLAIM with exact SHA → VERIFY → GENERATE`

只有 claim update 成功才算取得工作。

如果 update conflict：
- 不得生成；
- 不得假設自己擁有該 job；
- 必須重新 FETCH。

### Lease

- ChatGPT manual worker: 120 minutes
- Make / OpenAI worker: 30 minutes

Lease 到期後舊 worker ownership 失效；新 worker 必須用新的 Claim ID 重新 claim。

## 4. 不再使用啟動時間分工

錯開帳號啟動時間只可降低碰撞機率，不是 ownership 機制。

真正的 ownership 由 queue lock 決定。因此 ChatGPT 生圖慢、Make 生圖快，都不會改變 queue 的正確性。

## 5. 啟動後讀取順序

1. `START_HERE.md`
2. `PROJECT_STATUS.md`
3. `00_MASTER/MASTER_SPEC.md`
4. `00_MASTER/MASTER_WORKFLOW.md`
5. `00_MASTER/ACCOUNT_WORKFLOW.md`
6. `00_MASTER/GENERATION_WORKER_PROTOCOL.md`
7. `00_MASTER/GENERATION_RULES.md`
8. `00_MASTER/STYLE_MASTER.md`
9. `00_MASTER/DRAWING_INSTRUCTIONS.md`
10. `00_MASTER/IDENTITY_MASTER.md`
11. `00_MASTER/QUALITY_CONTROL.md`
12. `00_MASTER/PRODUCTION_PROTOCOL.md`
13. `TASKS/TASK_QUEUE.md`
14. `PRODUCTION/IMAGE_QUEUE.md`
15. current Prompt Package
16. user-uploaded MASTER_IMAGE

## 6. Quota handling

- 未生成 job：清除 ownership，回 `QUEUED`。
- 已生成 candidate：`QC_PENDING`，不得重做。
- 其他 workers 可繼續 claim。
- 所有 workers 都無法生成時，保留 queue 等待恢復。

## 7. Final QA

只有 ACCOUNT_06 可以判定最終 PASS / REPAIR / REJECT。

## 8. Completion

Worker session 完成於：
- 已產生並記錄 candidate；
- 已安全釋放 blocked job；
- 已記錄 failed attempt；或
- 已無可用 queue item。

不得重做 completed work，除非 queue 明確標記 `NEED_REGENERATE`。
