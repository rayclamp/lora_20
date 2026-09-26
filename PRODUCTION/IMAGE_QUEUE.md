# IMAGE_QUEUE.md — Current Production Queue Pointer

## Authority
This file is the compatibility entry point for Generation Workers that read the generic Queue path.

**The active Queue is T109. Do not continue T108.**

- Active Goal ID: `T109_GOAL_20260926_150_LORA_CANDIDATE_PRODUCTION`
- Active Queue: `PRODUCTION/T109_IMAGE_QUEUE.md`
- Target: 150 production tasks
- Task Coverage: 0 / 150
- QUEUED: 150
- IMAGE_CREATED: 0
- QA: PAUSED
- Generation System: ACTIVE

## Worker instruction
1. Read `PRODUCTION/T109_PRODUCTION_GOAL.md` before claiming.
2. Read `PRODUCTION/T109_IMAGE_QUEUE.md` as the authoritative active queue.
3. Do **not** claim T108 tasks.
4. Do **not** stop because T108 is complete; T108 is historical.
5. Claim only T109 tasks whose current status is `QUEUED` and whose claim/lease succeeds under the Worker Protocol.
6. Workers are GENERATE-ONLY. Do not perform QA or regenerate a successful candidate because it looks imperfect.
7. QA is PAUSED for T109.

## T108 historical record
The previous T108 queue remains historical. It is not the current production queue.
