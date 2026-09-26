# PRODUCTION_GOAL.md — Current Production Goal Pointer

## Authority
This file is the compatibility entry point for Generation Workers that read the generic Goal path.

**The active Goal is T109. Do not continue T108.**

- Active Goal ID: `T109_GOAL_20260926_150_LORA_CANDIDATE_PRODUCTION`
- Active Goal file: `PRODUCTION/T109_PRODUCTION_GOAL.md`
- Active Queue file: `PRODUCTION/T109_IMAGE_QUEUE.md`
- Target: 150 production tasks
- Task Coverage: 0 / 150
- QUEUED: 150
- IMAGE_CREATED: 0
- QA: PAUSED
- Generation System: ACTIVE

## Worker instruction
If you arrived here from `START_HERE.md`, this file, or an older Worker continuation command:

1. Load `PRODUCTION/T109_PRODUCTION_GOAL.md` as the authoritative active Goal.
2. Load `PRODUCTION/T109_IMAGE_QUEUE.md` as the authoritative active Queue.
3. Do **not** claim any T108 task.
4. Do **not** use T108's historical completion state as the current stop condition.
5. T109 is a new Goal and its 150 tasks are currently available for Worker execution.
6. QA is PAUSED; Workers are GENERATE-ONLY and must not perform QA.

## T108 historical record
T108 remains historical and complete. Its 40-task coverage result must not be used to stop T109.

For full T109 semantics and task definitions, use the two T109 files above.
