# PRODUCTION_GOAL.md — LoRA Module Goal Pointer

## Authority

This file is a **LoRA-module-owned compatibility pointer**.

It is NOT the platform runtime authority and it must never be interpreted as proof that LoRA Production is currently executable.

Platform execution authority is resolved in this order:

1. `00_MASTER/RUNTIME_STATE.md`
2. `00_MASTER/MODULE_REGISTRY.md`
3. `PRODUCTION/LORA_PROJECT_STATUS.md`
4. the applicable LoRA Goal / Queue files

If `LORA_PRODUCTION` is `PAUSED`, the Goal below is preserved but **NOT EXECUTABLE**.

## Preserved LoRA Goal

- Goal ID: `T109_GOAL_20260926_150_LORA_CANDIDATE_PRODUCTION`
- Goal file: `PRODUCTION/T109_PRODUCTION_GOAL.md`
- Queue file: `PRODUCTION/T109_IMAGE_QUEUE.md`
- Target: 150 production tasks
- Last synchronized historical coverage: 11 / 150
- Last synchronized historical queue summary: 135 QUEUED, 4 GENERATING, 11 IMAGE_CREATED
- Module status: `PAUSED`
- Goal status: `SUSPENDED`
- Execution allowed: `NO`
- QA status: `PAUSED`

These counters are preserved historical/module-state information. They are not current platform runtime claims.

## Worker rule

Workers must NOT activate or execute this Goal merely because this pointer exists.

Before claiming any LoRA task, a Worker MUST first verify:

`00_MASTER/RUNTIME_STATE.md`
→ `LORA_PRODUCTION = ACTIVE`
→ applicable LoRA Goal status permits execution
→ applicable Queue state is readable and claimable

If the parent module is PAUSED, STOP LoRA execution and do not claim T109.

## Historical T108

T108 remains historical and complete. Its completion state must not be used as the current stop condition for T109.

## Reactivation

When LoRA is intentionally reactivated, the MASTER DIRECTOR/operator must update the platform/module state first. Only after the state transition is recorded may this Goal pointer be treated as executable.

The generic Worker command must never hard-code T109.
