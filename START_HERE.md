# START_HERE.md — 20歲依娜莉亞 LoRA 專案啟動文件

## Generation Worker startup

目前圖片生產帳號採用統一 Worker 架構。

每一個 generation worker（ACCOUNT_01–05、ACCOUNT_07–08）都使用**完全相同的啟動指令**：

> 請讀取 GitHub 的 `rayclamp/lora_20` 專案。你現在是本專案的 Generation Worker。請按照 `START_HERE.md` 與 `00_MASTER/GENERATION_WORKER_PROTOCOL.md` 執行目前可用的圖片生產工作：讀取最新專案狀態與 `PRODUCTION/IMAGE_QUEUE.md`，取得下一個尚未被其他 worker claim 的生產項目，讀取對應 Prompt Package，使用本聊天室由使用者直接上傳的 20 歲 Inaria MASTER_IMAGE 作人物身份基準，完成候選圖片生成，依規則保存/回報結果並更新自己的帳號狀態。不要重新設計角色、服裝、場景、姿勢或全域畫風，不要重做已完成工作；如果目前沒有可執行項目就回報並等待下一個指令；如果遇到圖片生成額度限制，保留進度並停止，不要重置 queue。

不需要把 ACCOUNT_XX 改成不同角色。帳號身份由 GitHub 的 `ACCOUNTS/ACCOUNT_XX.md` 自動判定。

## Master Director startup

ACCOUNT_06 使用 Master Director / Final QA 流程，不使用 Generation Worker 指令。

ACCOUNT_06 的工作包括：
- Character / identity planning
- Clothing / footwear / accessory planning
- Scene / environment / lighting planning
- Pose / camera / anatomy-stability planning
- Prompt assembly
- Production queue planning
- Dataset diversity control
- Cross-worker coordination
- Codex QA integration
- Final PASS / REPAIR / REJECT

## MASTER_IMAGE

每個負責圖片工作的全新 ChatGPT 聊天室，啟動時由使用者直接上傳 `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png`。

MASTER_IMAGE 只用於確認人物身份、臉部、髮色/外觀與辨識度；不得因此複製原圖的服裝、背景、姿勢、鏡位、構圖或單張畫面安排。

## 所有帳號啟動後必讀

1. `PROJECT_STATUS.md`
2. `00_MASTER/MASTER_SPEC.md`
3. `00_MASTER/MASTER_WORKFLOW.md`
4. `00_MASTER/ACCOUNT_WORKFLOW.md`
5. `00_MASTER/GENERATION_WORKER_PROTOCOL.md`（workers）
6. `00_MASTER/GENERATION_RULES.md`
7. `00_MASTER/STYLE_MASTER.md`
8. `00_MASTER/DRAWING_INSTRUCTIONS.md`
9. `00_MASTER/IDENTITY_MASTER.md`
10. `00_MASTER/QUALITY_CONTROL.md`
11. `00_MASTER/PRODUCTION_PROTOCOL.md`
12. `TASKS/TASK_QUEUE.md`
13. `PRODUCTION/IMAGE_QUEUE.md`
14. `ACCOUNTS/ACCOUNT_XX.md`
15. 當前 production Prompt Package

## 工作原則

- 不捏造缺失規則；先檢查 GitHub。
- 不重做 DONE / GENERATED / PASS 工作，除非明確 NEED_REGENERATE。
- 生成時以使用者上傳的 MASTER_IMAGE 鎖定人物身份。
- 具體內容以 production queue 與 Prompt Package 為準。
- 多個 workers 可以平行處理不同 queue items。
- 每張圖片完成後立即記錄狀態。
- 圖片生成額度耗盡時保留進度，不影響其他 workers。

## 完成後

Generation worker 更新自己的 `ACCOUNTS/ACCOUNT_XX.md` 與必要生產紀錄。

ACCOUNT_06 更新整合狀態、最終 QA 與必要任務狀態。
