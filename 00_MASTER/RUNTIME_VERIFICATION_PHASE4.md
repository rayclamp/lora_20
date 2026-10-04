# Runtime Verification — Phase 4 GitHub CAS Boundary

## Purpose

Phase 4 verifies the persistence boundary required for multiple independent workers to share authoritative task state without relying on local filesystem ownership.

## Implemented

- `GitHubContentsStateStore` abstraction using GitHub Contents-style blob SHA compare-and-swap;
- write operations require the previously observed content SHA;
- stale writers are rejected rather than silently overwriting newer state;
- Worker Runtime claim mutations use the store mutation boundary;
- deterministic concurrency probe verifies first-writer ownership and second-worker rejection;
- CI executes the CAS probe.

## What this proves

The control runtime now has an explicit path for authoritative GitHub-backed persistence with optimistic concurrency control semantics.

The test proves:

1. two workers can observe the same state version;
2. one worker can commit a state transition against that version;
3. a stale second write is rejected;
4. the persisted ownership state prevents a second worker from claiming the already-claimed task.

## What this does not prove

This phase does **not** claim:

- a live production GitHub repository was mutated by the test;
- distributed locking beyond GitHub Contents SHA CAS;
- lease expiration or worker heartbeat;
- real GitHub webhook ingress;
- real image generation;
- visual output validation;
- full production Automation Engine deployment.

The probe uses a deterministic GitHub Contents API double. No remote repository state is changed by the test.

## Architectural boundary

The GitHub persistence adapter is a persistence mechanism, not a replacement for:

- `RUNTIME_STATE.md`;
- `MODULE_REGISTRY.md`;
- module Reference Policies;
- Scene Intent Resolution;
- the shared Worker Runtime contract.

No production module is activated by this verification.

## Verification

Run:

```text
node scripts/test_production_runtime.mjs
node scripts/test_runtime_github_cas.mjs
```

Expected:

```text
Production Runtime Level-2 control-plane probe: PASS
Production Runtime Phase-4 CAS probe: PASS
```

## Current maturity

`LEVEL_2_CONTROL_RUNTIME + LEVEL_2_CAS_BOUNDARY`

This remains below `PRODUCTION_AUTOMATION_VERIFIED`.
