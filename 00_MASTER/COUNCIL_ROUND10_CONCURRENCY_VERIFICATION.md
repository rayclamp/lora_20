# COUNCIL_ROUND10_CONCURRENCY_VERIFICATION.md

## Status

**PASS — Council Round 10 Concurrency / Multi-Worker Verification**

This round verifies the coordination contract required before Universal Wallpaper can safely operate in queue mode with multiple Workers.

## Scope

Verified:
1. canonical Claim ownership contract;
2. finite Lease contract;
3. Worker identity and claim identity;
4. one active owner per non-terminal task;
5. stale Worker fencing;
6. terminal SUCCESS non-reclaimability;
7. UNKNOWN recovery blocking;
8. conditional-write / CAS behavior;
9. deterministic concurrency state-machine behavior;
10. architecture and batch-validator integration.

## Major finding

Before Round 10, the repository mentioned Claim/Lease in the generic Worker protocol but did not contain a canonical Claim/Lease/Concurrency specification.

This was treated as a real architecture gap rather than assuming the mechanism existed.

## Canonical contract

`00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_CONCURRENCY_PROTOCOL.md`

The contract defines:
- `OWNERSHIP_STATUS`;
- `WORKER_ID`;
- `CLAIM_ID`;
- `CLAIMED_AT`;
- `LEASE_EXPIRES_AT`;
- `STATE_VERSION`;
- conditional update/CAS boundary;
- stale-write rejection;
- lease-expiry reclaim;
- fencing;
- terminal SUCCESS;
- UNKNOWN blocking.

## Real GitHub CAS race test

An isolated persisted batch was created on the verification branch.

Worker A and Worker B both attempted to claim the same TASK-01 using the same original GitHub file SHA.

Result:
- Worker A conditional update: **SUCCESS**
- Worker B conditional update using the same stale SHA: **HTTP 409 CONFLICT**
- Worker B therefore could not acquire ownership.

This is a real persistence-layer concurrency test, not a simulated assertion.

The temporary race fixture was removed before merge.

## Automated verification

Branch: `council-round10-concurrency`
Verified commit: `3eeae0f44e871a352a98eb4410307536394faef7`
GitHub Actions run: `37199613350`

Result:
**SUCCESS**

All substantive steps passed:
- Architecture validation — PASS
- Architecture validator self-test — PASS
- Universal Wallpaper batch validation — PASS
- Universal Wallpaper batch validator self-test — PASS
- Universal Wallpaper concurrency self-test — PASS

## State-machine coverage

The deterministic concurrency self-test verifies:
- first Worker can claim;
- second Worker cannot claim an unexpired task;
- current owner can write;
- stale/non-owner write is fenced;
- another Worker can reclaim after lease expiry;
- old Worker remains fenced after reclaim;
- terminal SUCCESS cannot be reclaimed;
- UNKNOWN transitions to recovery rather than blind retry.

## Production boundary

This verifies the protocol and GitHub persistence semantics required for queue-mode concurrency.

It does not yet provide:
- an automatic distributed scheduler;
- automatic Worker discovery;
- automatic lease renewal;
- an external queue service;
- automatic conflict resolution;
- ComfyUI generation orchestration.

Those remain implementation/runtime concerns.

## Module status

- UNIVERSAL_WALLPAPER = ACTIVE
- FESTIVAL_WALLPAPER = ACTIVE
- LORA_PRODUCTION = PAUSED
- QA = PAUSED
- IMAGE_DELIVERY = PAUSED

Round 10 does not activate any paused module.

## Final principle

**Claim before generate. One active owner. CAS before ownership change. Lease expiry enables controlled reclaim but never proves generation outcome. Stale Workers are fenced. SUCCESS is terminal. UNKNOWN requires recovery.**