# GENERATION_WORKER_PROTOCOL.md — 統一生圖帳號操作規則

## 1. Purpose

本文件定義所有 Generation Worker 的共同執行方式。

Worker 不需要被分配不同創意職能。所有角色、服裝、場景、姿勢、鏡位、Prompt 與批次策略由 ACCOUNT_06 Master Director 統一決定並寫入 GitHub。

**Queue ownership 是生產開始前的必要條件。**

## 2. Supported worker accounts

- ACCOUNT_01
- ACCOUNT_02
- ACCOUNT_03
- ACCOUNT_04
- ACCOUNT_05
- ACCOUNT_07
- ACCOUNT_08

實際同時啟用 5–7 個 generation workers。

## 3. Required startup command

> 請讀取 GitHub 的 `rayclamp/lora_20` 專案。你現在是本專案的 Generation Worker。請按照 `START_HERE.md` 與 `00_MASTER/GENERATION_WORKER_PROTOCOL.md` 執行目前可用的圖片生產工作：讀取最新專案狀態與 `PRODUCTION/IMAGE_QUEUE.md`，依 Queue Lock Protocol 取得下一個尚未被其他 worker claim 的生產項目，先成功寫入 claim 再生成；讀取對應 Prompt Package，使用本聊天室由使用者直接上傳的 20 歲 Inaria MASTER_IMAGE 作為**人物 + 視覺風格的直接參考**，完成候選圖片生成，依規則保存/回報結果並更新自己的帳號狀態。不要重新設計角色、服裝、場景、姿勢或全域畫風；不得只依賴抽象的 Japanese anime 標籤自行選擇另一套動漫畫風，不要重做已完成工作；如果 claim 發生衝突就重新讀取 queue，不要生成；如果遇到圖片生成額度限制或必要條件不足，安全釋放目前尚未生成的 job，不要重置 queue。

## 4. Worker behavior

### A. Preflight
1. Identify the current account.
2. Read the latest GitHub project state.
3. Read the latest `PRODUCTION/IMAGE_QUEUE.md`.
4. Confirm MASTER_IMAGE is available in the current chat.
5. Confirm the Prompt Package exists.

### B. Claim transaction
1. Find the lowest-numbered `QUEUED` job.
2. Fetch the queue file and record its current blob SHA.
3. Create a unique Claim ID.
4. Set Status=`CLAIMED`, Worker=current account, Claim ID, Claimed At, Lease Until, Updated At, and Attempts+1.
5. Update the queue using the exact blob SHA just fetched.
6. If the update conflicts/fails, the claim did not happen. **Do not generate.** Re-fetch and retry.
7. Only after a successful update may the worker proceed.

### C. Anatomy-first generation
Before generation, verify the planned pose has exactly two hands and two legs, stable shoulder/hip connections, intended five-finger/five-toe visibility, stable center of gravity, and no high-risk false-limb structures. Simplify or remove complex props, straps, occlusions, or effects when they threaten anatomy stability. Follow `00_MASTER/ANATOMY_STABILITY.md`.

### C. Reference-first generation
1. Confirm the uploaded `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png` is visible in the current chat.
2. Use it as the direct visual reference for both character identity and illustration style.
3. Preserve its line-art language, facial rendering, eyes, hair rendering, proportions, coloring, shading, lighting language, and overall illustration finish.
4. Apply the current Prompt Package only to the explicitly requested changes: clothing, scene, pose, camera, composition, accessories, and context.
5. Do not convert the image into photorealistic, live-action, photographic, 3D, CGI, semi-photorealistic, or a different anime/game/illustration style.

### C. Generation start
Before image generation:
1. Re-fetch the queue.
2. Verify Status, Worker, Claim ID and Lease Until still belong to this worker.
3. Change Status from `CLAIMED` to `GENERATING` using the latest queue SHA.
4. Only after that update succeeds, start image generation.

### D. Completion
Before QC_PENDING, perform an anatomy self-check against `00_MASTER/ANATOMY_STABILITY.md`. Obvious extra/missing limbs or malformed hands/feet must not be submitted as clean candidates.
1. Re-fetch the queue.
2. Verify ownership and Claim ID.
3. Record the candidate in the production log.
4. Set Status=`QC_PENDING`.
5. Clear Worker / Claim ID / Claimed At / Lease Until.
6. Keep Attempts.
7. Update account status.
8. Re-fetch queue before taking another job.

## 5. Concurrency / race-condition rule

**Do not rely on worker start time or staggered startup.**

The queue file blob SHA is the concurrency guard. GitHub's file update requires the SHA of the file being replaced, and concurrent updates can conflict. citeturn0search0

If two workers read the same `QUEUED` job:
- first successful conditional update owns it;
- the stale update fails;
- the losing worker must not generate;
- it re-fetches the queue and claims another available job.

## 6. Lease rules

- ChatGPT manual worker: **120 minutes**
- Make / OpenAI worker: **30 minutes**
- Renew before expiry if needed.
- An expired worker must not write again; it must re-claim with a new Claim ID.
- A new worker may reclaim only after verifying the previous lease has expired.

## 7. Quota / blocking

If quota or a prerequisite prevents generation before a candidate exists:
- record the reason;
- clear Worker / Claim ID / Lease;
- return the job to `QUEUED`;
- allow another worker to claim it.

If a candidate already exists:
- record it;
- move to `QC_PENDING`;
- never regenerate merely because another worker has quota.

If MASTER_IMAGE is unavailable:
- do not substitute another identity source;
- release the job to `QUEUED`.

## 8. Worker restrictions

Workers must not:
- redesign Inaria identity;
- alter global style;
- skip queue ownership;
- generate before successful claim;
- overwrite another worker's job;
- regenerate completed images without explicit `NEED_REGENERATE`;
- declare their own candidate final PASS;
- use an old queue snapshot for a new claim;
- continue writing after lease expiry.

## 9. Failure recovery

If a worker stops during `CLAIMED` / `GENERATING`, the lease protects the job until expiry. After expiry, another worker may reclaim it with a new Claim ID.

If the worker never started generation and a blocking condition is known, it may release the job immediately after recording the reason.

## 10. Final gate

Only ACCOUNT_06 can finalize a candidate as PASS / REPAIR / REJECT.
