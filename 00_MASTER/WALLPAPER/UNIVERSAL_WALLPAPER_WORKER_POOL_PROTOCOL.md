# UNIVERSAL_WALLPAPER_WORKER_POOL_PROTOCOL.md

## Purpose

This is the canonical Worker Pool / Scheduler contract for Universal Wallpaper queue mode.

It defines how multiple interchangeable Workers obtain work without introducing a hidden queue, duplicate assignment, unfair task selection, or unsafe continuation.

This protocol builds on:

- `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_CONCURRENCY_PROTOCOL.md`
- `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_BATCH_RECORD_SPEC.md`
- `00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md`

## 1. Runtime boundary

Round 11 defines the coordination contract. It does NOT claim that an automatic production scheduler, daemon, external queue service, or Worker discovery service already exists.

A scheduler implementation may be added later, but any implementation MUST conform to this contract.

## 2. Canonical source of work

The authoritative work source remains:

`MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/<BATCH_ID>.md`

No Worker may treat:
- conversation memory;
- a local task list;
- a stale cached batch;
- a guessed filename;
- a separate hidden queue

as authoritative over the latest GitHub batch record.

## 3. Worker lifecycle

A Worker session has these runtime states:

`IDLE → SCANNING → CLAIMING → CLAIMED → GENERATING → RECORDING → IDLE`

Terminal/session-stop states:

`STOPPED`, `BLOCKED`

A Worker must stop when:
- no compatible work is available;
- claim is rejected;
- stale state is detected;
- UNKNOWN requires recovery;
- the batch is complete;
- module activation/state becomes invalid;
- an explicit stop condition is reached.

## 4. Scheduling eligibility

A task is schedulable only when all are true:

- parent module is ACTIVE;
- task belongs to the current canonical batch;
- task is not terminal;
- task is not currently owned by another valid Worker;
- task is not blocked by recovery;
- task has a valid task identity;
- task design is executable or can legally enter the design stage;
- task format/output constraints are valid.

The scheduler MUST NOT select:
- SUCCESS;
- ABANDONED;
- UNKNOWN / RECOVERY_REQUIRED;
- active CLAIMED tasks with an unexpired lease;
- contradictory/invalid records.

## 5. Selection policy

Within one batch, the default deterministic selection order is:

1. earliest eligible task by IMAGE_ID / task order;
2. among equal-order candidates, earliest task record position;
3. never prefer a task merely because it was previously attempted unless recovery explicitly marks it RETRY_READY.

This gives a stable baseline and prevents scheduler randomness from becoming hidden task state.

A future scheduler may implement weighted priorities only if the priority field is explicitly persisted and validated. It may not invent priorities at runtime.

## 6. One claim per scheduling cycle

A scheduler cycle selects at most one task for one Worker.

The Worker then performs the Claim/Lease/CAS protocol.

The scheduler MUST treat a failed claim as a normal race:

`CLAIM_REJECTED / CLAIM_LOST → reread latest state → select again`

It must not force-write, reuse stale state, or assume ownership.

## 7. Multiple Workers

For N Workers:

- each Worker has an independent Worker ID;
- each Worker scans the same authoritative state;
- each Worker may attempt one claim at a time;
- GitHub conditional writes remain the final ownership gate;
- duplicate scheduling decisions are harmless only when CAS rejects all but one owner;
- generation may begin only after ownership is confirmed.

The scheduler MUST NOT rely on timing such as “Worker A is probably first.”

## 8. Lease behavior

A claim has a finite lease.

Before generation, the Worker must verify:
- Worker ID;
- Claim ID;
- lease validity;
- state version;
- latest batch SHA.

If the lease expires:
- the Worker loses authority;
- a new Worker may reclaim through the canonical conditional protocol;
- the old Worker remains fenced.

Lease expiry MUST NOT convert UNKNOWN into retryable work.

## 9. Fairness and starvation

The baseline scheduler is FIFO-by-task-order within the eligible set.

A task that remains eligible must not be skipped indefinitely by repeatedly preferring later tasks.

Retries do not move a task to the front unless an explicit persisted recovery policy says so.

## 10. Quota / Worker stop

Workers are interchangeable capacity, not permanently assigned image quotas.

If a Worker reports quota exhaustion or session stop:
- it must not retain an unnecessary claim;
- release safely when no generation ambiguity exists;
- if generation outcome is UNKNOWN, enter recovery instead;
- another Worker may continue only from authoritative state.

The scheduler must not create duplicate IMAGE_IDs to compensate for a stopped Worker.

## 11. Batch completion

The scheduler stops dispatching when:

`COMPLETED_COUNT = TARGET_COUNT`

and every required task has terminal SUCCESS.

It must not append hidden tasks after completion.

## 12. No-work condition

If no eligible task exists:

- reread the latest batch once;
- if still no eligible task exists, stop the Worker cycle;
- if blocked tasks exist, report BLOCKED rather than inventing work;
- if the batch is complete, report COMPLETED.

A no-work result is not permission to create new tasks.

## 13. Scheduler invariants

The implementation MUST preserve:

1. one active owner per task;
2. one active claim per Worker;
3. no generation before claim success;
4. no stale-worker writes;
5. no terminal-task reclaim;
6. no UNKNOWN auto-retry;
7. no task identity duplication;
8. deterministic selection from authoritative state;
9. no hidden queue authority;
10. module activation remains outside scheduler authority.

## 14. Required scheduler events

Implementations should persist or emit:

`SCAN`
`ELIGIBLE_FOUND`
`NO_WORK`
`CLAIM_ATTEMPTED`
`CLAIM_GRANTED`
`CLAIM_REJECTED`
`CLAIM_LOST`
`WORKER_STOPPED`
`BATCH_COMPLETED`
`BLOCKED`

The existing task EVENT_HISTORY remains the canonical task-level lineage when an event belongs to a specific task.

## 15. Explicit non-goals

Round 11 does not implement:

- automatic Worker discovery;
- cloud queue infrastructure;
- cron/daemon scheduling;
- automatic lease renewal;
- automatic retry policy beyond existing recovery rules;
- platform quota APIs;
- ComfyUI dispatch;
- image QA;
- downstream delivery.

Those are separate capabilities and must not be implied by this protocol.

## 16. Core principle

**The scheduler decides which task may be attempted; the Claim/Lease/CAS protocol decides whether the Worker actually owns it.**

Scheduling is advisory. Ownership is authoritative.
