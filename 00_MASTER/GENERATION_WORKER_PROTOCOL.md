# GENERATION_WORKER_PROTOCOL.md — 統一生圖帳號操作規則

## 1. Purpose

本文件讓所有圖片生成帳號使用完全相同的啟動指令與工作流程。

Worker 不需要被分配不同的創意職能。所有角色、服裝、場景、姿勢、鏡位、Prompt 與批次策略由 ACCOUNT_06 Master Director 統一決定並寫入 GitHub。

## 2. Supported worker accounts

- ACCOUNT_01
- ACCOUNT_02
- ACCOUNT_03
- ACCOUNT_04
- ACCOUNT_05
- ACCOUNT_07
- ACCOUNT_08

實際同時啟用 5–7 個 generation workers，由使用者依可用帳號數量決定。

## 3. Required startup command

每個 generation worker 都只需要收到同一個指令：

> 請讀取 GitHub 的 `rayclamp/lora_20` 專案。你現在是本專案的 Generation Worker。請按照 `START_HERE.md` 與 `00_MASTER/GENERATION_WORKER_PROTOCOL.md` 執行目前可用的圖片生產工作：讀取最新專案狀態與 `PRODUCTION/IMAGE_QUEUE.md`，取得下一個尚未被其他 worker claim 的生產項目，讀取對應 Prompt Package，使用本聊天室由使用者直接上傳的 20 歲 Inaria MASTER_IMAGE 作人物身份基準，完成候選圖片生成，依規則保存/回報結果並更新自己的帳號狀態。不要重新設計角色、服裝、場景、姿勢或全域畫風，不要重做已完成工作；如果目前沒有可執行項目就回報並等待下一個指令；如果遇到圖片生成額度限制，保留進度並停止，不要重置 queue。

## 4. Worker behavior

1. Identify the current account.
2. Read the latest GitHub state.
3. Find the lowest-numbered unclaimed production item.
4. Claim it before generation.
5. Read its complete prompt package.
6. Use the uploaded MASTER_IMAGE only as identity reference.
7. Generate the candidate.
8. Record the output and status.
9. Continue to the next available item if the current session/account still has generation capacity.
10. Stop on quota or other blocking condition without resetting progress.

## 5. Worker restrictions

Workers must not:
- redesign Inaria identity,
- alter global style,
- invent a different prompt architecture,
- skip queue ownership,
- overwrite another worker's item,
- regenerate completed images without explicit NEED_REGENERATE,
- declare their own candidate as final PASS.

## 6. Human interaction

The user should not need to provide different creative instructions to different worker accounts.

The same command is intentionally sufficient for every worker. Account-specific state is discovered from GitHub.

## 7. Master Director relationship

ACCOUNT_06 is the only account responsible for integrated design and final QA. Workers execute; they do not direct the project.

## 8. Quota strategy

Parallel workers exist primarily to use multiple independent image-generation quotas. One worker reaching quota does not stop other workers.

## 9. Failure recovery

If a worker claims an item but cannot finish it, it must leave a recoverable queue state and reason. Another worker may resume only after the item is safely released or explicitly reassigned.

## 10. Final gate

Only ACCOUNT_06 can finalize a candidate as PASS / REPAIR / REJECT at the project level.
