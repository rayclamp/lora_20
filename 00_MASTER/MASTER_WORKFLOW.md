# MASTER_WORKFLOW.md — 20歲依娜莉亞 LoRA 生產總流程

## 1. 專案定位

建立可長期維護、可由多個 ChatGPT 圖片生成帳號共同執行的 20 歲依娜莉亞 LoRA 圖片資料集。

GitHub 是跨聊天室的持久化規則、任務、版本與進度來源。ACCOUNT_06 是 Master Director；其他可用帳號主要負責圖片生成。

## 2. 標準流程

```
User
  ↓
ACCOUNT_06 MASTER DIRECTOR
  ├─ Character
  ├─ Clothing
  ├─ Scene
  ├─ Pose / Camera
  ├─ Prompt
  └─ Batch / Queue planning
          ↓
PRODUCTION/IMAGE_QUEUE
          ↓
5–7 Generation Workers
          ↓
Candidate Images
          ↓
GitHub / Production Intake
          ↓
Codex first-layer QA
          ↓
ACCOUNT_06 Final QA
          ↓
PASS / REPAIR / REJECT
          ↓
FINAL
```

## 3. Master Director responsibilities

ACCOUNT_06 owns the integrated visual design and may use the approved T101–T105 specialist handoffs as source material.

It must ensure that:
- identity remains stable,
- each image has a deliberate design purpose,
- poses are generation-stable,
- hands/feet are prioritized,
- clothing and scene variation are controlled,
- prompts are complete,
- images do not become unnecessarily repetitive.

## 4. Generation workers

Each worker uses the same startup instruction and queue-driven procedure. Workers do not design independent character/style systems.

A worker generates only the queue item it has successfully claimed. Multiple workers may generate in parallel.

## 5. Production priorities

1. Character identity and age
2. Anatomy / generation stability
3. Task-specific requirements
4. Pose / camera / composition
5. Clothing / scene
6. Lighting / visual style
7. Decorative details
8. Dataset diversity / value

## 6. Quota strategy

The purpose of multiple workers is to parallelize independent image-generation quotas.

If one worker reaches its daily image limit, other available workers continue. If all available workers are limited, the queue remains paused without resetting progress.

## 7. Final QA

ACCOUNT_06 is the final quality gate. Codex may perform a first-layer automated QA, but Codex does not replace ACCOUNT_06's final decision.

## 8. Completion

A production item is complete only after its candidate exists, source/lineage is recorded, required QA is completed, and its queue status is synchronized.
