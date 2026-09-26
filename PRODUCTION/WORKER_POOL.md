# WORKER_POOL.md — Inaria Production Worker Pool

## Purpose

The Production Worker Pool is a group of interchangeable generation workers.

A worker is an execution slot/session, not a permanent project identity.

The project does not depend on:
- a specific ChatGPT account;
- a fixed account number;
- how much quota a worker has left;
- whether a worker has generated before;
- startup order;
- which worker produced a previous image.

## Team model

The production team owns the work.

Example:

7 available workers
5 available tasks

The system may assign tasks to any available workers. Standby workers are available for takeover.

## Work ownership

A task belongs to the Production Team.

A Worker only holds temporary execution ownership through a valid Claim ID and lease.

Therefore:

Worker leaves ≠ Task fails.

Worker quota exhaustion ≠ Task fails.

A worker replacement must be able to continue team production without redesigning or reassigning the entire workload.

## Worker identity

The repository may retain a worker/session identifier for audit purposes, but it is not a permanent account identity.

A new ChatGPT account or new session may join the Worker Pool and use the same standard Worker command.

Do not require the Worker to prove which account it is, whether it has generated before, or how much quota remains.

## Active Goal resolution — mandatory

Workers must never assume that a historical Goal is still active.

At every startup and before every new claim:

1. Read `PROJECT_STATUS.md`.
2. Read `PRODUCTION/PRODUCTION_GOAL.md` and follow its active-Goal pointer.
3. Read the pointed active Goal file.
4. Read `PRODUCTION/IMAGE_QUEUE.md` and follow its active-Queue pointer.
5. Read the pointed active Queue file.
6. Use the Goal ID and Queue path explicitly identified as active by those pointer files.

For the current final validation round, the active Goal is:
`T109_GOAL_20260926_150_LORA_CANDIDATE_PRODUCTION`

and the active Queue is:
`PRODUCTION/T109_IMAGE_QUEUE.md`

**T108 is historical. T108 completion must never be used as a stop condition for T109.**

If a Worker receives an older continuation command that names T108 or another historical Goal, the Worker must ignore that stale Goal reference and resolve the current active Goal from GitHub before claiming.

## Worker behavior

Every Worker follows the same loop:

1. Resolve the current active Goal and Queue using the mandatory pointer procedure above.
2. Check whether the active Goal still has available `QUEUED` tasks. Summary counters may be stale; inspect Task Records.
3. Fetch the latest active queue SHA.
4. Find an available task in the active Goal's queue.
5. Claim the task atomically using the latest queue SHA.
6. Verify ownership and lease.
7. Change CLAIMED → GENERATING.
8. Generate the image using the official MASTER_IMAGE.
9. If generation succeeds and returns a candidate, record GENERATING → IMAGE_CREATED immediately. Do not self-QA or regenerate the candidate.
10. If GENERATION_TOOL_ERROR occurs, follow the retry policy.
11. If the task reaches three failed generation attempts, close/defer it according to the retry policy and move on; do not return it to ordinary QUEUED processing.
12. If three GENERATION_TOOL_ERROR events occur consecutively across tasks, pause new generation claims.
13. If SAFETY_BLOCKED occurs, record SAFETY_BLOCKED, preserve the original task and Prompt Package, release the worker, do not automatically retry that same task, and continue with another available task.
14. Release the worker immediately after IMAGE_CREATED or another protocol-defined terminal generation outcome. Do not hold the task for quality review.
15. Return to the active queue if the active Goal is not complete and the generation system is not paused.

## Quota and forced-stop handling

If the platform reports that the current Worker/account has exhausted its image-generation quota:
- do not mark IMAGE_CREATED;
- do not mark FAILED;
- return the current CLAIMED/GENERATING task to QUEUED when writable;
- release the Claim/Lease;
- record the quota event if supported;
- stop this Worker session;
- another Worker may claim the returned task.

If the platform reports a system/policy forced stop for the task:
- mark the current CLAIMED/GENERATING task FAILED when writable;
- preserve the task/prompt history;
- release the Claim/Lease;
- do not requeue the same task.

## Generation error protection

The Worker Pool uses the shared policy in `PRODUCTION/GENERATION_RETRY_POLICY.md`.

Default limits:
- MAX_IMAGE_RETRIES = 3 per task.
- MAX_CONSECUTIVE_GENERATION_ERRORS = 3 across the production system.

A task that encounters three genuine generation-tool errors is DEFERRED rather than repeatedly retried. Quota exhaustion is not a generation-tool error and returns the current task to QUEUED.

A successfully generated candidate is never treated as a task failure merely because the Worker considers the result imperfect. It becomes IMAGE_CREATED and is handed to downstream QA.

Three consecutive GENERATION_TOOL_ERROR events pause new generation claims. QUEUED tasks are preserved.

A SAFETY_BLOCKED task is not automatically retried. It is recorded as SAFETY_BLOCKED, released from the current Worker, and permanently skipped for automatic Worker processing. If replacement coverage is needed, MASTER DIRECTOR creates a new legitimate Task rather than returning the blocked design to QUEUED. No prompt rewrite may be used to bypass the safety system.

A successful IMAGE_CREATED resets the consecutive generation-error counter.

## No per-worker quota

Do not assign a fixed number of images to a Worker. The target belongs to the team-level active Goal.

## Standby takeover

A standby Worker may claim work whenever a task is legitimately available in the active Goal queue.

A task may become available again only through an explicit protocol-defined recovery path, such as a pre-generation prerequisite blocker being resolved or a legitimately expired/recoverable active Claim. IMAGE_CREATED, FAILED, and SAFETY_BLOCKED tasks do not automatically become available again.

A replacement Worker must never overwrite an active valid claim.

## Quota exhaustion

The system does not track ChatGPT quota as a production state.

If a Worker can no longer continue:
- it must not falsely mark IMAGE_CREATED;
- it must not write after lease expiry;
- the task becomes recoverable only through the normal release/lease recovery mechanism;
- another Worker may take it when it is legitimately available.

## Team-level completion

The Worker Pool stops taking new tasks when the **currently active Goal** reaches its own target.

Workers do not stop because a historical Goal is complete.

Workers do not stop because another Worker has run out of quota.

Workers do not wait for Phase 2 upload or QA.

## Phase separation

Phase 1:
QUEUED → CLAIMED → GENERATING → IMAGE_CREATED

Phase 2:
IMAGE_CREATED → UPLOADING → UPLOADED → QC_PENDING → final QA

Phase 2 is downstream and non-blocking for the Worker Pool.

## Core principle

> The Team owns the active Goal. Workers execute its Tasks. GitHub owns the shared state.


## Task-level synchronization model

The Worker Pool is intentionally tolerant of stale global summaries. Task Records and exclusive Claim/Lease state control ownership.

If Worker 1 claims Task 1, all other Workers skip Task 1 and continue to the next QUEUED task. If Worker 1 reaches any terminal outcome, it releases and immediately scans for another QUEUED task. Workers do not wait for global summary counters to synchronize perfectly.

FAILED is a closed terminal outcome. It is not a reusable queue state. Sending the same FAILED design through multiple Workers is prohibited because it can create an endless failure loop. SAFETY_BLOCKED is likewise closed for automatic retry. New coverage is supplied by new Tasks created by MASTER DIRECTOR.
