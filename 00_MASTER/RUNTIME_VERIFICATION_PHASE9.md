# Runtime Verification — Phase 9 Worker Pool / Concurrency Boundary

## Purpose

Phase 9 verifies that multiple independent Workers can compete for authoritative task state without double-claiming the same task.

## Verification

`scripts/test_phase9_worker_pool.mjs` uses two independent Worker Runtime instances against one GitHub Contents-style state store and verifies:
- both workers observe the same initial state SHA;
- the first successful claim becomes authoritative;
- the second worker cannot reclaim the claimed task;
- the GitHub Contents SHA remains the concurrency fence.

The existing Phase-4 GitHub CAS probe continues to verify stale-write rejection.

## Boundary

The test uses a deterministic GitHub API double. It does not mutate the production repository's task state and does not claim that a live multi-process production Worker Pool is deployed.

Phase 9 proves the concurrency boundary needed for future Worker Pool expansion.

## Current maturity

`LEVEL_3_WORKER_POOL_CONCURRENCY_CONTROL`

This remains below live-provider production automation certification.
