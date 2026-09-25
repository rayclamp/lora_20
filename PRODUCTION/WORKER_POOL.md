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

The system may assign:

- Worker A → Task 001
- Worker B → Task 002
- Worker C → Task 003
- Worker D → Task 004
- Worker E → Task 005
- Worker F → standby
- Worker G → standby

The two standby workers are available for takeover.

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

Do not require the Worker to prove:
- which account it is;
- whether it has generated before;
- how much quota remains.

The Worker only needs valid access to the project, the required reference image, and the current queue.

## Worker behavior

Every Worker follows the same loop:

1. Read the latest GitHub rules.
2. Read the active Production Goal.
3. Check whether the Goal still needs Phase 1 output.
4. Fetch the latest queue.
5. Find an available task.
6. Claim the task atomically using the latest queue SHA.
7. Verify ownership and lease.
8. Change CLAIMED → GENERATING.
9. Generate the image using the official MASTER_IMAGE.
10. If generation succeeds, record GENERATING → IMAGE_CREATED.
11. If GENERATION_TOOL_ERROR occurs, follow the retry policy.
12. If the task reaches three failed generation attempts, set it to DEFERRED and move on.
13. If three GENERATION_TOOL_ERROR events occur consecutively across tasks, pause new generation claims.
14. If SAFETY_BLOCKED occurs, record SAFETY_BLOCKED, preserve the original task and Prompt Package, release the worker, do not automatically retry that same task, and continue with another available task.
15. Release the worker after the task reaches a terminal worker outcome.
16. Return to the queue if the Goal is not complete and the generation system is not paused.

## Generation error protection

The Worker Pool uses the shared policy in PRODUCTION/GENERATION_RETRY_POLICY.md.

Default limits:
- MAX_IMAGE_RETRIES = 3 per task.
- MAX_CONSECUTIVE_GENERATION_ERRORS = 3 across the production system.

A task that fails three times is DEFERRED rather than repeatedly retried.

Three consecutive GENERATION_TOOL_ERROR events pause new generation claims. QUEUED tasks are preserved.

A SAFETY_BLOCKED task is not automatically retried. It is recorded as SAFETY_BLOCKED, released from the current Worker, and skipped so the Worker Pool can continue with another available task. Director/operator review may later return the task to QUEUED if appropriate. No prompt rewrite may be used to bypass the safety system.

A successful IMAGE_CREATED resets the consecutive generation-error counter.

## No per-worker quota

Do not assign:

"Worker A must make 4 images."

Instead:

"Production Team must complete 20 Phase 1 images."

The number of images produced by each Worker is an implementation detail.

## Standby takeover

A standby Worker may claim work whenever a task is legitimately available.

A task may become available again when:
- a Worker explicitly releases it before generation;
- a pre-generation blocker safely returns it to QUEUED;
- the Worker lease expires;
- the task is explicitly returned to the queue by the Production Protocol.

A replacement Worker must never overwrite an active valid claim.

If a Worker disappears after claiming a task, another Worker waits until the lease is safely recoverable according to the current lease protocol.

## Quota exhaustion

The system does not track ChatGPT quota as a production state.

If a Worker can no longer continue:
- it must not falsely mark IMAGE_CREATED;
- it must not write after lease expiry;
- the task becomes recoverable only through the normal release/lease recovery mechanism;
- another Worker may take it when it is legitimately available.

This keeps production independent of account-specific quota information.

## Team-level completion

The Worker Pool stops taking new tasks when the active Production Goal reaches its target.

Workers do not stop because another Worker has run out of quota.

Workers do not wait for Phase 2 upload or QA.

## Phase separation

Phase 1:
QUEUED → CLAIMED → GENERATING → IMAGE_CREATED

Phase 2:
IMAGE_CREATED → UPLOADING → UPLOADED → QC_PENDING → final QA

Phase 2 is downstream and non-blocking for the Worker Pool.

## Core principle

> The Team owns the Goal. Workers execute Tasks. GitHub owns the shared state.
