# UNIVERSAL_WALLPAPER_CONCURRENCY_PROTOCOL.md

## Purpose

This is the canonical concurrency and task-ownership protocol for Universal Wallpaper queue mode.

It defines how multiple Workers coordinate through the canonical GitHub batch record without generating the same task concurrently.

This protocol applies only to Universal Wallpaper queue mode. ChatGPT-as-Worker single-session batch mode does not require a distributed claim.

## 1. Core model

The canonical batch record is the coordination ledger.

A task may be in one of these ownership states:

- `UNCLAIMED`
- `CLAIMED`
- `RELEASED`
- `TERMINAL`

Ownership metadata belongs to the task record.

Minimum ownership fields:

`OWNERSHIP_STATUS:` `UNCLAIMED | CLAIMED | RELEASED | TERMINAL`

`WORKER_ID:` current owner when claimed; `NONE` otherwise.

`CLAIM_ID:` unique claim identifier for the current claim.

`CLAIMED_AT:` immutable claim timestamp for the current claim.

`LEASE_EXPIRES_AT:` lease expiry timestamp for the current claim.

`STATE_VERSION:` monotonically increasing task state version.

## 2. Claim atomicity

A Worker may claim a task only by performing a compare-and-swap style update against the latest authoritative batch record version.

The Worker MUST:

1. read the latest batch record;
2. verify the task is `UNCLAIMED` or legally reclaimable;
3. capture the current GitHub file SHA;
4. prepare the claim update;
5. submit the update using the captured SHA as the expected version;
6. treat a SHA conflict/rejected update as CLAIM_LOST;
7. reread the batch before any generation.

Two Workers reading the same old SHA may both prepare claims, but only the first successful conditional update owns the task. The second MUST NOT generate.

The protocol therefore uses GitHub's file-version precondition as the persistence-layer CAS boundary. It is not a claim that GitHub provides a separate distributed-lock service.

## 3. Ownership invariant

Exactly one Worker may own a non-terminal task at a time.

If:

`OWNERSHIP_STATUS: CLAIMED`

then:

- `WORKER_ID` must identify exactly one Worker;
- `CLAIM_ID` must be present;
- the claim must not be expired;
- generation is permitted only for that owner and claim.

A Worker that does not own the current claim MUST NOT generate, release, or rewrite the task as if it owns it.

## 4. Lease

A claim has a finite lease.

A Worker may continue generation only while:

`NOW < LEASE_EXPIRES_AT`

The Worker must checkpoint ownership-sensitive state before the lease expires when possible.

Lease expiry does not automatically prove that generation failed. If the Worker cannot determine the generation result, Round 9 UNKNOWN recovery rules apply.

A different Worker may reclaim an expired claim only after:

1. reading the latest batch record;
2. verifying the old lease is expired;
3. creating a new `CLAIM_ID`;
4. recording the previous owner/claim in the event history;
5. conditionally updating the batch using the latest file SHA.

The new Worker becomes the only legal owner after the conditional update succeeds.

## 5. Fencing

A stale Worker is fenced by claim identity.

Every ownership-sensitive write MUST prove:

- current `WORKER_ID`;
- current `CLAIM_ID`;
- current task `STATE_VERSION`;
- current batch file SHA.

If any of these no longer matches the authoritative record, the write is rejected and the Worker MUST STOP.

A stale Worker must never overwrite a newer owner's state.

## 6. Release

A Worker may release a claim only if it still owns the current claim.

On release:

- preserve the task result/history;
- increment `STATE_VERSION`;
- set `OWNERSHIP_STATUS: RELEASED` or `TERMINAL` according to result;
- clear active lease metadata;
- record the release event.

A completed SUCCESS task becomes `TERMINAL` and can never be claimed again.

A retryable FAILED task may become `RELEASED` and later be claimed again under a new claim identity.

## 7. SUCCESS and duplicate prevention

After SUCCESS:

`OWNERSHIP_STATUS: TERMINAL`

The same `TASK_ID` / `IMAGE_ID` cannot be claimed again.

A Worker that sees SUCCESS MUST NOT generate another candidate.

The completed task is terminal even if another Worker still holds a stale local copy.

## 8. UNKNOWN and lease loss

If a Worker loses ownership before it can establish the generation result:

- it MUST NOT assume FAILED;
- it MUST NOT assume SUCCESS;
- it MUST record or preserve `UNKNOWN / RECOVERY_REQUIRED` when authoritative state can be safely updated;
- it MUST STOP.

Another Worker must not blindly regenerate an UNKNOWN task merely because its lease expired.

UNKNOWN resolution is governed by the Round 9 failure/recovery protocol.

## 9. Concurrent commit / CAS conflict

A conditional update failure means the Worker is operating on stale state.

The Worker MUST:

1. stop the attempted write;
2. reread the latest batch;
3. compare task state, owner, claim, and result;
4. follow the newly authoritative state;
5. never force-write over the newer state.

There is no "last writer wins" exception for task ownership or terminal results.

## 10. Worker identity

Worker identity is session-scoped operational metadata.

It must be unique among concurrently active Workers.

It is not an account number and does not determine how many images a Worker receives.

Recommended form:

`WORKER_ID = worker-<session-unique-id>`

Do not hard-code a permanent Worker ID into the module protocol.

## 11. Queue eligibility

A task is claimable only when all are true:

- parent module is ACTIVE;
- task is not terminal;
- task has a valid TASK_ID / IMAGE_ID;
- task design is valid for the module;
- task is not currently owned by an unexpired lease;
- task is not UNKNOWN / RECOVERY_REQUIRED;
- task is not ABANDONED;
- task is not blocked by repeated-failure recovery.

## 12. Claim lifecycle

Normal lifecycle:

`UNCLAIMED`
→ `CLAIMED`
→ `GENERATING`
→ `SUCCESS`
→ `TERMINAL`

Retry lifecycle:

`UNCLAIMED / RELEASED`
→ `CLAIMED`
→ `GENERATING`
→ `FAILED`
→ `RELEASED`
→ later claim

Recovery lifecycle:

`CLAIMED`
→ `UNKNOWN / RECOVERY_REQUIRED`
→ `STOP`

Abandonment:

`CLAIMED`
→ `ABANDONED`
→ `TERMINAL`

## 13. Event history

Ownership events are append-only.

Minimum vocabulary:

- `CLAIM_REQUESTED`
- `CLAIM_GRANTED`
- `CLAIM_REJECTED`
- `LEASE_EXPIRED`
- `CLAIM_RECLAIMED`
- `GENERATION_STARTED`
- `GENERATION_FAILED`
- `GENERATION_UNKNOWN`
- `GENERATION_SUCCESS`
- `CLAIM_RELEASED`
- `STALE_WRITE_REJECTED`
- `TASK_TERMINAL`

The event history must preserve enough information to reconstruct ownership transitions.

## 14. No hidden queue

The protocol does not create a second queue database.

The canonical batch/task record remains the source of truth.

If a future scheduler or external queue is introduced, it must explicitly integrate with this protocol and must not become a competing task authority.

## 15. Boundary

This protocol defines the state contract and conditional-write semantics.

It does not itself provide:

- a distributed scheduler;
- automatic lease renewal;
- automatic Worker discovery;
- automatic GitHub conflict resolution;
- image generation;
- visual QA.

Those require separate runtime implementations and verification.

## 16. Universal principle

**Claim before generate. One active owner. Conditional write before ownership change. Lease expiry never proves SUCCESS or FAILED. Stale Workers are fenced. SUCCESS is terminal. UNKNOWN stops.**
