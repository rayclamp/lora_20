# CLAIM_LEASE_CAS_SPEC.md — Council Round 6 Phase 4

## Purpose
Define the authoritative concurrency contract for persistent Task execution.

## Claim
Only a QUEUED task belonging to an ACTIVE module may be claimed.
Claim acquisition atomically creates:
- CLAIM_ID
- WORKER_ID
- CLAIMED_AT
- LEASE_EXPIRES_AT
- STATE_VERSION increment

A live claim prevents another Worker from claiming the same task.

## Lease
A lease has an explicit expiry timestamp.
The owning Worker must present the current CLAIM_ID, WORKER_ID, and expected STATE_VERSION for mutations.

Expired leases cannot be silently reused.

## CAS
Every mutation requires the caller's expected STATE_VERSION.
If it differs from the authoritative version:
- reject the mutation;
- preserve authoritative state;
- require re-read/recovery;
- never assume generation happened.

## Safety invariants
1. At most one live claim per Task.
2. A stale Worker cannot mutate current state.
3. A stale Worker cannot release a newer claim.
4. Claim and lease metadata are persisted atomically.
5. Every successful mutation increments STATE_VERSION.
6. Conflict never creates a second generation candidate.
7. Claiming a task never activates its parent module.

## Failure handling
Claim conflict -> no claim, no generation.
Expired lease -> task enters recovery evaluation; ownership is not silently transferred.
CAS conflict -> stale operation rejected.
Unknown persistence result -> UNKNOWN / RECOVERY_REQUIRED; no automatic retry.

## Readiness
The contract is paired with the runtime implementation in scripts/runtime_engine.mjs and its deterministic tests.
