# ACCOUNT_05.md — ChatGPT Generation Worker

## Account
- Account: ACCOUNT_05
- Role: GENERATION_WORKER
- Project Area: `PRODUCTION`
- Status: BLOCKED — IMG_06 awaiting current-chat MASTER_IMAGE
- Current Task: T107 — IMG_06 claimed, generation blocked before image creation

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

## Production Session 2026-09-25
- Claimed: IMG_06
- Prompt Package: PP06 — C06 / S14 / P09
- Generation: 0 candidates
- Status: BLOCKED
- Reason: The required user-uploaded 20-year-old Inaria MASTER_IMAGE is not surfaced as an image input in this current chat session. Generation was not attempted and no substitute identity source was used.
- Queue was preserved; no completed work was redone.

## Next Step
Wait for the current-chat MASTER_IMAGE to be provided, then resume IMG_06 without resetting the queue.
