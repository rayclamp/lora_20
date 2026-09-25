# ACCOUNT_08.md — ChatGPT Generation Worker

## Account
- Account: ACCOUNT_08
- Role: GENERATION_WORKER
- Project Area: `PRODUCTION`
- Status: READY
- Current Task: T107 — IMAGE_PRODUCTION

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
