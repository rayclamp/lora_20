# IMAGE_QUEUE.md

# 20歲依娜莉亞 LoRA 第一輪圖片生產佇列

## 目的

本佇列是第一輪 20 張正式 LoRA 圖片的**共享工作佇列與唯一逐張生產狀態來源**。

它同時服務：
- ChatGPT Generation Workers
- 未來 Make / OpenAI 自動化 workers
- ACCOUNT_06 Master Director / Final QA

核心原則不是「錯開時間」，而是**先取得不可重複的 queue lock，再開始生成**。

## 生產原則

1. 每張圖片都是獨立 production job。
2. 只有 `QUEUED`、且沒有有效 lease 的 job 可以被 worker claim。
3. Claim 必須先成功寫回 GitHub queue，才可以開始生成。
4. Claim 使用 GitHub file blob SHA 作為 optimistic concurrency / compare-and-swap guard：worker 更新 queue 時必須帶入它剛剛讀到的 SHA；若 GitHub 已被其他 worker 更新，寫入衝突，該 worker **不得生成**，必須重新讀取 queue。
5. Claim 成功後，job 進入 `CLAIMED`，再進入 `GENERATING`。
6. 同一 job 在有效 lease 期間只有指定 worker 可以生成或更新。
7. Worker 生成時間很長也不會讓後面的 worker 依賴舊 queue 狀態；每次 claim 前都必須重新讀取最新 queue。
8. Worker 若中途停止、斷線或無法完成，lease 到期後 job 才可被其他 worker reclaim。
9. 已經產生候選圖片的 job 不得因 worker 重啟、額度恢復或 queue refresh 而重新生成。
10. 只有 `NEED_REGENERATE` / `REPAIR` 等明確決策才允許消耗新的生成額度。
11. ACCOUNT_06 是唯一最終 PASS / REPAIR / REJECT gate。
12. BLOCKED job 不代表永久失敗；必要條件恢復後必須重新放回 `QUEUED`，而不是保留過期 ownership。

## 狀態定義

- `QUEUED`：可被 worker 取得；沒有有效 ownership。
- `CLAIMED`：worker 已成功取得 exclusive lease，尚未開始生成。
- `GENERATING`：worker 已開始生成；lease 持續有效。
- `GENERATED`：候選圖片已成功產生，ownership 任務已完成。
- `QC_PENDING`：候選圖片已整理，等待 ACCOUNT_06 最終審查。
- `PASS`：ACCOUNT_06 最終通過。
- `REPAIR`：需要局部修復。
- `REJECT`：候選不採用。
- `NEED_REGENERATE`：ACCOUNT_06 明確要求重新生成。
- `BLOCKED`：必要條件暫時不存在；不得由 worker 長期佔有 queue。
- `FAILED`：生產流程發生明確技術失敗，需要 recovery。

## Queue lock / lease 欄位

每個 job 的 coordination 欄位為：

- **Worker**：目前 owner；只有 `CLAIMED` / `GENERATING` 才填 worker。
- **Claim ID**：本次 claim 的唯一識別字串；同一 job 每次重新 claim 必須換新值。
- **Claimed At**：claim 成功時間。
- **Lease Until**：ownership 到期時間。
- **Updated At**：最後一次 queue 狀態更新時間。
- **Attempts**：本 job 已被 claim 的次數。
- **Notes**：阻塞、恢復、失敗或特殊情況。

### Lease 預設值

- ChatGPT manual worker：**120 分鐘**
- Make / API worker：**30 分鐘**
- 若預估生成時間超過 lease，worker 必須在 lease 到期前更新 lease。
- 不允許在 lease 已經到期後直接覆寫；必須重新 claim。

## 正確 Claim 流程

Worker 必須嚴格執行：

1. Fetch 最新 `PRODUCTION/IMAGE_QUEUE.md)，取得目前 file blob SHA。
2. 找到最低編號的 `QUEUED` job。
3. 產生自己的 `Claim ID`。
4. 只修改該 job 的 Worker / Claim ID / Claimed At / Lease Until / Updated At / Attempts / Status。
5. 使用**剛才 Fetch 得到的原始 blob SHA** 呼叫 GitHub update。
6. 若 update 成功 → claim 成功，可以開始生成。
7. 若 update 發生 SHA conflict / 失敗 → **視為 claim 失敗，不得生成**；重新 Fetch queue，改取當前可用 job。
8. Claim 成功後才可讀 Prompt Package 並開始圖片生成。
9. 開始真正生成前，將狀態由 `CLAIMED` 更新為 `GENERATING`。
10. 生成完成後立即更新為 `GENERATED` / `QC_PENDING` 並清除 lease ownership。

### 重要

**「我讀到它是空的」不等於「我已經取得它」。**

真正取得 job 的唯一條件是：
> GitHub queue 的 conditional update 成功。

因此，即使兩個 worker 在同一秒讀到同一個 `QUEUED` job，也只有第一個成功寫入的人取得 ownership；另一個 worker 的舊 SHA 寫入會失敗，必須重新排隊。

## Recovery

### Worker 在 CLAIMED / GENERATING 時停止

- 若候選尚未產生：保持該 job ownership 到 lease 到期。
- lease 到期後，其他 worker 可以重新 claim。
- 新 worker 必須增加 `Attempts` 並產生新的 Claim ID。
- 舊 worker 不得在 lease 到期後繼續寫入。

### Worker 遇到 quota

- 若尚未生成：不要把 job 永久鎖死。
- 將 job 安全釋放回 `QUEUED`；或在 lease 到期後自動 reclaim。
- 已生成候選：立即記錄 `GENERATED` / `QC_PENDING`，不得重做。

### BLOCKED

BLOCKED 必須記錄原因，但**不能作為長期 ownership**。

必要條件恢復後，將 job 重新設為 `QUEUED`，清除 Worker / Claim ID / Lease 欄位，再由下一個具備條件的 worker claim。

## 第一輪 20 張佇列

| ID | Character | Clothing | Scene | Pose/Camera | Prompt | Worker | Status | Claim ID | Lease Until | Attempts | Final QC |
|---|---|---|---|---|---|---|---|---|---|---:|---|
| IMG_01 | C01 | C01 | S01 | P01 | Prompt 01 | ACCOUNT_01 | QC_PENDING | - | - | 1 | - |
| IMG_02 | C01 | C02 | S02 | P02 | Prompt 02 | ACCOUNT_01 | QC_PENDING | - | - | 1 | - |
| IMG_03 | C01 | C03 | S03 | P03 | Prompt 03 | ACCOUNT_01 | QC_PENDING | - | - | 1 | - |
| IMG_04 | C01 | C04 | S04 | P04 | Prompt 04 | ACCOUNT_03 | QC_PENDING | - | - | 1 | - |
| IMG_05 | C01 | C05 | S05 | P05 | Prompt 05 | ACCOUNT_04 | QC_PENDING | - | - | 1 | - |
| IMG_06 | C01 | C06 | S06 | P06 | Prompt 06 | - | QUEUED | - | - | 1 | - |
| IMG_07 | C01 | C07 | S07 | P07 | Prompt 07 | - | QUEUED | - | - | 0 | - |
| IMG_08 | C01 | C08 | S08 | P08 | Prompt 08 | - | QUEUED | - | - | 0 | - |
| IMG_09 | C01 | C09 | S09 | P09 | Prompt 09 | - | QUEUED | - | - | 0 | - |
| IMG_10 | C01 | C10 | S10 | P10 | Prompt 10 | - | QUEUED | - | - | 0 | - |
| IMG_11 | C01 | C11 | S11 | P11 | Prompt 11 | - | QUEUED | - | - | 0 | - |
| IMG_12 | C01 | C12 | S12 | P12 | Prompt 12 | - | QUEUED | - | - | 0 | - |
| IMG_13 | C01 | C13 | S13 | P13 | Prompt 13 | - | QUEUED | - | - | 0 | - |
| IMG_14 | C01 | C14 | S14 | P14 | Prompt 14 | - | QUEUED | - | - | 0 | - |
| IMG_15 | C01 | C15 | S15 | P15 | Prompt 15 | - | QUEUED | - | - | 0 | - |
| IMG_16 | C01 | C16 | S16 | P16 | Prompt 16 | - | QUEUED | - | - | 0 | - |
| IMG_17 | C01 | C17 | S17 | P17 | Prompt 17 | - | QUEUED | - | - | 0 | - |
| IMG_18 | C01 | C18 | S18 | P18 | Prompt 18 | - | QUEUED | - | - | 0 | - |
| IMG_19 | C01 | C19 | S19 | P19 | Prompt 19 | - | QUEUED | - | - | 0 | - |
| IMG_20 | C01 | C20 | S20 | P20 | Prompt 20 | - | QUEUED | - | - | 0 | - |

## Current reconciled count

- Target: 20
- GENERATED / QC_PENDING: 5
- PASS: 0
- REPAIR: 0
- REJECT: 0
- NEED_REGENERATE: 0
- CLAIMED: 0
- GENERATING: 0
- QUEUED: 15
- BLOCKED: 0
- FAILED: 0

## Current reconciliation

- IMG_01–IMG_05 each have one recorded candidate and remain under ACCOUNT_06 final QA.
- IMG_03 duplicate attempt by ACCOUNT_02 does **not** create a second queue job and does not change IMG_03 ownership.
- IMG_05's earlier BLOCKED record is historical; the later successful candidate is the authoritative current production result.
- IMG_06 had no candidate and is therefore released back to `QUEUED`.
- IMG_04 is reconciled to ACCOUNT_03's recorded successful candidate.
- No worker currently owns an active lease.

## Worker continuation rule

Worker 每完成或放棄一個 job 後，必須重新 Fetch 最新 queue。

**禁止：**
- 使用上一次讀到的 queue snapshot 連續 claim 多張。
- 先生成再補寫 claim。
- 依帳號啟動時間推算誰拿哪張。
- 看到舊的 `QUEUED` 就直接開始生圖。
- 在沒有成功 conditional update 的情況下聲稱自己已取得 job。

## 相關文件

- `05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md`
- `00_MASTER/GENERATION_WORKER_PROTOCOL.md`
- `00_MASTER/PRODUCTION_PROTOCOL.md`
- `00_MASTER/QUALITY_CONTROL.md`
- `STATUS/PRODUCTION_LOG.md`
- `TASKS/TASK_QUEUE.md`
