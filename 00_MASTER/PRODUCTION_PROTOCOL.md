# PRODUCTION_PROTOCOL.md — 多帳號圖片生產協議

## 1. Purpose

將專案規則轉為可重複執行的多帳號圖片生產流程。

GitHub 是共享記憶與狀態層。ACCOUNT_06 是 Master Director；ACCOUNT_01–05、ACCOUNT_07–08 是可用的 Generation Workers。

## 2. Authority

1. 當前使用者指令
2. `00_MASTER/MASTER_SPEC.md`
3. MASTER_IMAGE 與其他核准參考資產
4. 已核准的 specialist handoff / Prompt Package
5. 暫時實作選擇

## 3. Production state machine

`NOT_STARTED → CLAIMED → GENERATING → GENERATED → QC_PENDING → PASS / REPAIR / REJECT`

例外：`BLOCKED / NEED_REGENERATE / CANCELLED`。

## 4. Preflight

Generation worker 開始前確認：

- 自己是 generation worker
- GitHub queue 是最新狀態
- 當前 item 尚未被其他 worker claim
- MASTER_IMAGE 已由使用者上傳到聊天室
- 當前 item 的完整 Prompt Package 可取得
- 輸出與回報規則已明確

## 5. Single shared worker command

所有 generation workers 使用同一個指令：

> 請讀取 GitHub 的 `rayclamp/lora_20` 專案。你現在是本專案的 Generation Worker。請按照 `START_HERE.md` 與 `00_MASTER/GENERATION_WORKER_PROTOCOL.md` 執行目前可用的圖片生產工作：讀取最新專案狀態與 `PRODUCTION/IMAGE_QUEUE.md`，取得下一個尚未被其他 worker claim 的生產項目，讀取對應 Prompt Package，使用本聊天室由使用者直接上傳的 20 歲 Inaria MASTER_IMAGE 作人物身份基準，完成候選圖片生成，依規則保存/回報結果並更新自己的帳號狀態。不要重新設計角色、服裝、場景、姿勢或全域畫風，不要重做已完成工作；如果目前沒有可執行項目就回報並等待下一個指令；如果遇到圖片生成額度限制，保留進度並停止，不要重置 queue。

Worker 不需要知道自己的固定創意職能；所有創意內容由 ACCOUNT_06 Master Director 與 GitHub queue 提供。

## 6. Generation

Worker 只執行已 claim 的 queue item。成功產生後立即記錄為 GENERATED / QC_PENDING 所需資訊。

## 7. Parallelism

不同 workers 可以同時處理不同 queue items。

同一 queue item 不得被兩個 workers 同時生成，除非它被明確標記 NEED_REGENERATE 並重新分配。

## 8. Final review

ACCOUNT_06 依 `00_MASTER/QUALITY_CONTROL.md` 審查實際存在的圖片。

## 9. Repair / regeneration

- 局部缺陷且可安全修復 → REPAIR。
- 嚴重失敗或資料集價值不足 → REJECT。
- 只有明確 NEED_REGENERATE / NEED_REWORK 才消耗新的生成額度。

## 10. Dataset finalization

只有通過 ACCOUNT_06 Final QA 且 metadata / lineage 完整的圖片才可進入 `FINAL/`.

## 11. Quota interruption

單一 worker 額度耗盡不會阻塞其他 workers。

若所有 workers 都無法生成，保留 queue 狀態並等待可用帳號恢復。

## 12. Repository rules

全域規則只放在 `00_MASTER/`。不要重新建立 `WORKFLOW/` 或 `06_DIRECTOR/`。

## 13. Completion

工作單元只有在圖片輸出、狀態、必要紀錄與 metadata 都完成後才算完成。
