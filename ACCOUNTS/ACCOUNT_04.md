# ACCOUNT_04.md — ChatGPT Generation Worker

## Account
- Account: ACCOUNT_04
- Role: GENERATION_WORKER
- Project Area: `PRODUCTION`
- Status: BLOCKED — IMG_05 awaiting MASTER_IMAGE availability
- Current Task: T107 — IMG_05 completed (BLOCKED)

## Responsibility
本帳號是共享 Generation Worker。只負責依 GitHub production queue 與 ACCOUNT_06 Master Director 已核准的 Prompt Package 生成圖片。

不得自行設計 Character、Clothing、Scene、Pose/Camera、全域 Style 或 Prompt 架構。

## Startup
使用 `START_HERE.md` 的統一 Generation Worker 指令，不需要帳號專屬創意指令。

## Current Production Rule
- 讀取最新 `PRODUCTION/IMAGE_QUEUE.md`
- 取得未被其他 worker claim 的最小編號項目
- Claim 後再生成
- 生成完成立即記錄
- 遇到額度限制停止，不重做已完成圖片
- 不把自己的圖片直接判定為最終 PASS

## Next Step
等待並執行 T107 可用 queue item。


## Blocked Reason — 2026-09-25
- IMG_05 was already claimed by ACCOUNT_04.
- PP05 is available and verified.
- Candidate generation is blocked because the 20-year-old Inaria MASTER_IMAGE is not surfaced as an image attachment in this current chat session, so the required identity reference cannot be applied without inventing or substituting an identity source.
- Queue was not reset and no completed work was redone.
