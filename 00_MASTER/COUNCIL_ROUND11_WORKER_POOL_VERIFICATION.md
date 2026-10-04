# COUNCIL_ROUND11_WORKER_POOL_VERIFICATION.md

## Status

**PASS — verified on main**

Branch:

`main` (Round 11 changes merged via PR #3; subsequently preserved and revalidated through PR #4)

Latest verified main baseline:

`c1f64aab70d4dac181328c1ce6875ad5904e5cf6`

## Objective

Verify the runtime coordination layer above Round 10 concurrency:

`BATCH → SCHEDULER → WORKER POOL → CLAIM/LEASE/CAS → GENERATION`

Round 11 must establish that scheduling decisions are deterministic and advisory, while ownership remains authoritative through the Round 10 Claim/Lease/CAS protocol.

## Implemented

- `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_WORKER_POOL_PROTOCOL.md`
- `scripts/test_universal_worker_pool.mjs`
- Universal Wallpaper Worker Protocol routing to the Worker Pool contract
- Architecture validator enforcement for the Worker Pool contract
- CI execution of the Worker Pool self-test

## Required invariants

1. Canonical work source is the latest GitHub batch record.
2. Only eligible tasks may enter scheduling.
3. Selection is deterministic FIFO-by-task-order by default.
4. A scheduler cycle selects at most one task for one Worker.
5. Scheduler selection does not grant ownership.
6. Claim/Lease/CAS remains the final ownership gate.
7. A claim race is handled as normal rejection, not as a force-write condition.
8. SUCCESS, ABANDONED, and UNKNOWN/RECOVERY_REQUIRED tasks are not schedulable.
9. An active unexpired claim is not schedulable by another Worker.
10. Worker quota exhaustion does not create duplicate task identities.
11. No-work does not authorize creation of new tasks.
12. Batch completion stops dispatch.
13. Scheduling does not activate a paused module.
14. UNKNOWN is never auto-retried by lease expiry.

## Self-test coverage

The deterministic self-test covers:

- FIFO selection;
- terminal-task exclusion;
- active-claim exclusion;
- UNKNOWN/recovery exclusion;
- inactive-module exclusion;
- invalid-record exclusion;
- concurrent claim race semantics;
- UNKNOWN non-retry behavior;
- terminal SUCCESS non-reclaimability.

## Explicit boundary

Round 11 does **not** claim that an automatic distributed scheduler, Worker discovery daemon, cloud queue, automatic lease renewal, platform quota API, or ComfyUI dispatcher has been implemented.

It verifies the contract required for a future scheduler implementation.

## CI verification

Verified through the final main validation after the Production Core refactor.

Required CI steps:

- architecture validation;
- architecture validator self-test;
- Universal Wallpaper batch validator;
- batch validator self-test;
- concurrency self-test;
- Worker Pool scheduler self-test.

## Finalization rule

This document may be promoted to **PASS** only after the exact Round 11 branch/main commit and corresponding CI run are verified successful.

A later architecture-changing commit must trigger another verification; no stale SHA may be recorded as current verification.

## Verified CI

- GitHub Actions workflow: `Architecture Validation`
- Main run: `37206039281` (final main revalidation)
- Main commit: `c1f64aab70d4dac181328c1ce6875ad5904e5cf6`
- Conclusion: `success`
- Verified steps included architecture validation, validator self-test, batch validation, batch validator self-test, concurrency self-test, and Worker Pool self-test.
