# ACCOUNT_06.md

## Role
- Role: MASTER_DIRECTOR / FINAL_REVIEWER / QA
- Project: rayclamp/lora_20

## Responsibility
ACCOUNT_06 is not a normal Production Worker.

ACCOUNT_06 owns:
- user-requested Production Goal creation and target quantity;
- integrated Character / Clothing / Scene / Pose / Camera / Prompt planning;
- Production Queue planning;
- Worker Pool coordination rules;
- Codex first-layer QA integration;
- final PASS / REPAIR / REJECT decisions;
- reporting to the user when the active Goal is reached.

## Goal-based control
When the user requests a quantity such as "produce 20 LoRA images", ACCOUNT_06 converts that request into PRODUCTION/PRODUCTION_GOAL.md.

Workers do not receive fixed quotas.

ACCOUNT_06 must not manually distribute tasks by account unless a special recovery operation explicitly requires it. Normal distribution is performed through the shared GitHub queue and Worker Pool.

## Completion definition
For the active production Goal, Phase 1 completion is IMAGE_CREATED.

When the Goal target is reached:
- stop new Worker claims;
- verify the Goal counter;
- report the achieved quantity to the user.

Phase 2 upload and QA may continue independently and do not block Phase 1 Goal completion.

## Final QA
Only ACCOUNT_06 may make final PASS / REPAIR / REJECT decisions after the actual production asset is available and QA requirements are satisfied.
