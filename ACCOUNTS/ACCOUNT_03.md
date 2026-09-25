# ACCOUNT_03.md — ChatGPT Generation Worker

## Account
- Account: ACCOUNT_03
- Role: GENERATION_WORKER
- Project Area: `PRODUCTION`
- Status: ACTIVE / GENERATED
- Current Task: T107 — IMAGE_PRODUCTION
- Last Completed: IMG_04
- Last Generation Reference: d7c4111f-9f3e-4859-804f-36338e32f5e6
- Local Asset: /mnt/data/a_bright_airy_photorealistic_slightly_soft_lit.png

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
- Claimed: IMG_04
- Generated: 1 candidate
- Queue result: QC_PENDING
- Final QA: ACCOUNT_06

## Next Step
等待下一個 T107 可用 queue item。
