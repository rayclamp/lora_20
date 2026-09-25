# PRODUCTION_GOAL.md — Goal-Based Production Control

## Purpose
This file defines the current production target for the Inaria age-20 LoRA dataset.

The user specifies the desired output quantity. The Master Director converts that request into a Production Goal. Generation Workers do not receive fixed per-account quotas.

## Current Goal
- Goal ID: T108_GOAL_20260925_40_CAPACITY_TEST
- Project: Age-20 Inaria LoRA
- Target Phase 1 images: 40
- Phase 1 completion event: IMAGE_CREATED
- Phase 1 completed: 8
- Phase 1 remaining: 32
- Goal status: ACTIVE
- Production mode: MANUAL
- Generation system state: ACTIVE
- QA status: PAUSED
- MAX_IMAGE_RETRIES: 3
- MAX_CONSECUTIVE_GENERATION_ERRORS: 3
- Reference: MASTER_IMAGE/INARIA_20_MASTER_v1.0.png

## Purpose of this Goal
T108 is a controlled 40-task production-capacity test.

The Master Director designs 40 executable image tasks in GitHub. Other worker accounts perform the actual generation. The current Director account is not expected to generate all 40 images itself.

The purpose is to observe how many Phase 1 `IMAGE_CREATED` events one individual worker account can complete before that account reaches its image-generation limit. The result must be recorded from actual worker behavior; this Goal does not assume a numeric daily limit in advance.

## Goal semantics
A Production Goal is a team-level target, not a per-account quota.

Workers may claim any available task. The system does not assign a fixed number of images to any account.

The only production objective is:
> Continue claiming and completing available production tasks until the Phase 1 completed count reaches 40, or until individual workers stop because of their own generation limits or another protocol-defined stop condition.

## Phase 1 completion
A task contributes exactly +1 to the Goal when it reaches:
`IMAGE_CREATED`

`IMAGE_CREATED` means the worker successfully generated the requested candidate.

The worker is released at `IMAGE_CREATED`.

Do not wait for:
- UPLOADING
- UPLOADED
- QC_PENDING
- PASS
- REPAIR
- REJECT

## Phase 2
Phase 2 begins after IMAGE_CREATED:
`IMAGE_CREATED → UPLOADING → UPLOADED → QC_PENDING → final QA`

Phase 2 is intentionally paused for T108 and must not block Phase 1 production.

## Generation retry and system-pause accounting
A `GENERATION_TOOL_ERROR` does not increment Phase 1.

The same task may consume up to 3 generation attempts by default. After the third failed generation attempt, the task becomes `DEFERRED`.

Track the Goal-level consecutive generation-error counter:
- increment on `GENERATION_TOOL_ERROR`;
- reset to 0 on `IMAGE_CREATED`;
- at 3 consecutive `GENERATION_TOOL_ERROR` events, set Generation system state to `PAUSED`.

`SAFETY_BLOCKED` is a task-level safety outcome. It must never be bypassed or retried by prompt rewriting. The blocked task is recorded and skipped for the current production run so the Worker Pool can continue with another available task. A later Master Director/operator decision may explicitly return the task to QUEUED or create a legitimate replacement.

## Goal accounting
Only one successful transition into `IMAGE_CREATED` may increment the Goal counter for a task.

Do not count:
- QUEUED
- CLAIMED
- GENERATING
- UPLOADING
- UPLOADED
- QC_PENDING
- historical candidates
- rejected historical candidates

If a candidate is later marked REPAIR, REJECT, or NEED_REGENERATE, the original IMAGE_CREATED event remains part of the production history. A replacement task must be explicitly queued if the project later requires another candidate.

## Goal authority
The Master Director owns Goal creation, target quantity, task design, and completion reporting.

Generation Workers execute the GitHub tasks and report actual completion. They do not change the target quantity.

## Worker stop rules
A worker must stop claiming new tasks when:
1. T108 reaches 40 IMAGE_CREATED; or
2. that worker reaches its own image-generation limit; or
3. the generation system is paused; or
4. a protocol-defined manual intervention is required.

If one worker reaches its limit, remaining QUEUED tasks stay available for other workers.

## Production/Upload separation safeguard
The Phase 1 Goal counter is updated immediately when a candidate reaches IMAGE_CREATED. Uploading and QA are separate operations.

GitHub upload failure, Make credit exhaustion, binary-transfer limitations, or delayed local transfer must not prevent an already-generated candidate from counting toward Phase 1.

## Historical Goal
The previous T107 20-image Goal is complete and remains historical. T108 is a new Goal and must not overwrite T107's production history.
