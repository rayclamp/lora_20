# ACCOUNT_01.md — ChatGPT Generation Worker

## Account
- Account: ACCOUNT_01
- Role: GENERATION_WORKER
- Project Area: `PRODUCTION`
- Status: ACTIVE — IMG_01–IMG_02 GENERATED / QC_PENDING
- Current Task: T107 — IMG_02 completed; ready for next unclaimed queue item

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

## Last Completed
- IMG_01 — GENERATED / QC_PENDING
- Generation reference: 9bff4359-55bd-4d12-9b8f-b355256f0494
- IMG_02 — GENERATED / QC_PENDING
- Generation reference: fcdb22d8-9208-456e-9c1a-bb34e7676925

## Next Step
可繼續取得下一個未 claim 的 T107 queue item。
