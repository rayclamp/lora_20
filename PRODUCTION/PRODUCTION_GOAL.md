# PRODUCTION_GOAL.md — Goal-Based Production Control

## Purpose

This file defines the current production target for the Inaria age-20 LoRA dataset.

The user specifies the desired output quantity. The Master Director converts that request into a Production Goal. Generation Workers do not need to know how many images they personally must produce.

## Current Goal

- Goal ID: T107_GOAL_20260925_20
- Project: Age-20 Inaria LoRA
- Target Phase 1 images: 20
- Phase 1 completion event: IMAGE_CREATED
- Phase 1 completed: 1
- Phase 1 remaining: 19
- Goal status: ACTIVE
- Production mode: MANUAL
- Generation system state: ACTIVE
- MAX_IMAGE_RETRIES: 3
- MAX_CONSECUTIVE_GENERATION_ERRORS: 3
- Reference: MASTER_IMAGE/INARIA_20_MASTER_v1.0.png

## Goal semantics

A Production Goal is a team-level target, not a per-account quota.

Workers do not receive fixed image counts.

The only production objective is:

> Continue claiming and completing available production tasks until the Phase 1 completed count reaches the target.

When:

Phase 1 completed >= Target

the Production Goal is complete and Workers must stop claiming new tasks for this goal.

## Phase 1 completion

A task contributes exactly +1 to the Goal when it reaches:

IMAGE_CREATED

IMAGE_CREATED means the worker successfully generated the requested candidate.

The worker is released at IMAGE_CREATED.

Do not wait for:
- UPLOADING
- UPLOADED
- QC_PENDING
- PASS
- REPAIR
- REJECT

Phase 2 is asynchronous and must not block Phase 1 production.

## Phase 2

Phase 2 begins after IMAGE_CREATED:

IMAGE_CREATED → UPLOADING → UPLOADED → QC_PENDING → final QA

Phase 2 completion is not required for the Goal counter.

A Phase 2 delay, Make credit exhaustion, upload failure, or QC delay must not stop Workers from continuing Phase 1.

## Generation retry and system-pause accounting

A GENERATION_TOOL_ERROR does not increment the Phase 1 completion count.

The same task may consume up to 3 generation attempts by default. After the third failed generation attempt, the task becomes DEFERRED and the Worker may continue with another task if the generation system remains healthy.

Track the Goal-level consecutive generation-error counter:
- increment on GENERATION_TOOL_ERROR;
- reset to 0 on IMAGE_CREATED;
- at 3 consecutive GENERATION_TOOL_ERROR events, set Generation system state to PAUSED and stop new generation claims.

SAFETY_BLOCKED does not automatically consume three retries. It is sent to Director Review.

DEFERRED does not count toward the Goal. A later explicit requeue creates another opportunity to produce IMAGE_CREATED.

## Goal accounting

Only one successful transition into IMAGE_CREATED may increment the Goal counter for a task.

Do not count:
- QUEUED
- CLAIMED
- GENERATING
- UPLOADING
- UPLOADED
- QC_PENDING
- historical candidates
- rejected historical candidates

If a candidate is later marked REPAIR, REJECT, or NEED_REGENERATE, that does not retroactively remove the original IMAGE_CREATED event from the production history. A replacement task must be created/queued explicitly if the project goal requires another usable candidate.

## Goal authority

The Master Director owns Goal creation, target quantity, and goal completion reporting.

Generation Workers execute tasks. They do not change the target quantity.

If the user requests a new quantity, the Master Director creates or updates the active Production Goal before production begins.

## Stop rule

Workers must stop claiming new tasks when:

Phase 1 completed >= Target

Workers may finish a task they have already successfully claimed only if that task is already in active execution and the protocol permits completion. No new claim may be made after the Goal is reached.

## Current operational principle

The user should only need to specify:

"Produce N LoRA images."

The system determines the required task count and lets the Worker Pool distribute work until the Goal is reached.
