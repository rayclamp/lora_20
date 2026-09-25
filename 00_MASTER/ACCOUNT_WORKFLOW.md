# ACCOUNT_WORKFLOW.md — 多帳號工作規則

## 1. 共用原則

本專案採用「單一 Master Director + 多個 Generation Workers」架構。

- **ACCOUNT_06** 是 Master Director / Final Reviewer / QA。
- **ACCOUNT_01–05、ACCOUNT_07–08** 是可用的圖片生成工作帳號。
- 可依實際可用帳號數量啟用 5–7 個 generation workers。
- 所有帳號製作同一個 20 歲依娜莉亞。
- GitHub 是所有帳號共同的持久化狀態來源。

## 2. Master Director

ACCOUNT_06 負責原本 CHARACTER、CLOTHING、SCENE、POSE_CAMERA、PROMPT 五類工作的整合與執行，包括：

- Character identity / consistency planning
- Clothing / footwear / accessory planning
- Scene / environment / season / lighting planning
- Pose / action / anatomy-stability / camera planning
- Prompt assembly
- Dataset diversity planning
- Production queue planning
- Cross-worker conflict resolution
- Final QA
- Repair / reject decisions
- Dataset finalization

ACCOUNT_06 不要求其他 generation worker 自己重新設計上述內容。

## 3. Generation worker pool

Worker accounts:

- ACCOUNT_01
- ACCOUNT_02
- ACCOUNT_03
- ACCOUNT_04
- ACCOUNT_05
- ACCOUNT_07 (optional)
- ACCOUNT_08 (optional)

所有 worker 使用同一份啟動指令，不需要依帳號下不同創意指令。

Worker 的唯一核心職責：

1. 讀取 GitHub 最新 queue。
2. 找到自己可以安全取得的下一個 `NOT_STARTED` 項目。
3. 取得該項目的完整 Prompt Package / production instruction。
4. 在聊天室使用使用者直接上傳的 MASTER_IMAGE 作身份基準。
5. 生成候選圖片。
6. 將候選圖片依 production protocol 保存/回報。
7. 更新 queue 與自己的 account status。
8. 遇到額度限制就停止，不重做已完成圖片，等待下一個可執行項目。

Worker 不得自行修改 Character、Clothing、Scene、Pose/Camera 或全域風格規則。

## 4. 啟動後讀取順序

所有 generation workers：

1. `START_HERE.md`
2. `PROJECT_STATUS.md`
3. `00_MASTER/MASTER_SPEC.md`
4. `00_MASTER/MASTER_WORKFLOW.md`
5. `00_MASTER/ACCOUNT_WORKFLOW.md`
6. `00_MASTER/GENERATION_WORKER_PROTOCOL.md`
7. `00_MASTER/GENERATION_RULES.md`
8. `00_MASTER/STYLE_MASTER.md`
9. `00_MASTER/DRAWING_INSTRUCTIONS.md`
10. `00_MASTER/IDENTITY_MASTER.md`
11. `00_MASTER/QUALITY_CONTROL.md`
12. `TASKS/TASK_QUEUE.md`
13. `PRODUCTION/IMAGE_QUEUE.md`
14. `05_PROMPT/T105_PROMPT_PACKAGE_v1.0.md` or the current production prompt package
15. 使用者直接上傳的 `MASTER_IMAGE`

ACCOUNT_06 不使用 worker 流程；它依 Master Director / Final QA 流程工作。

## 5. Queue ownership

A worker must claim an unclaimed queue item before generating it. Claiming is a coordination state, not a final QA result.

Recommended queue states:

`NOT_STARTED → CLAIMED → GENERATED → QC_PENDING → PASS / REPAIR / REJECT`

If the worker cannot finish after claiming an item, it must leave a clear `BLOCKED` or `NOT_STARTED` recovery state so another worker can continue without ambiguity.

## 6. Quota handling

Image-generation quota is a worker-local limitation, not project failure.

- Never redo completed items because another account has quota available.
- Available workers may continue unclaimed items.
- When one worker hits quota, other workers continue.
- If all workers hit quota, production pauses without resetting queue state.
- Later production resumes from remaining unclaimed/incomplete items.

## 7. Final QA

ACCOUNT_06 performs the final PASS / REPAIR / REJECT decision using `00_MASTER/QUALITY_CONTROL.md`.

Generation workers do not declare their own image as final PASS.

## 8. Completion

A worker's session is complete when it has either:
- produced and recorded its assigned candidate image(s),
- safely recorded a BLOCKED/quota state, or
- found no available production item.

No worker should redo DONE work unless the queue explicitly marks NEED_REGENERATE or NEED_REWORK.
