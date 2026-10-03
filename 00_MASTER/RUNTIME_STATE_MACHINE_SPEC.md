# RUNTIME_STATE_MACHINE_SPEC.md — Council Round 6 Phase 2

## Purpose

Define the executable lifecycle contract that future runtime code must implement.

This document does not activate any module and does not itself create executable state.

## Authority

Runtime state is subordinate to:
USER INTENT → RUNTIME_STATE → MODULE_REGISTRY → AUTHORITY_MATRIX.

A task state can never activate a PAUSED parent module.

## State domains

### Platform
- ACTIVE
- STOPPED
- RECOVERY_REQUIRED

### Module
- ACTIVE
- PAUSED

### Task
- QUEUED
- CLAIMED
- GENERATING
- IMAGE_CREATED
- FAILED
- UNKNOWN
- RECOVERY_REQUIRED
- BLOCKED

### QA
QA owns its own downstream states only when QA is ACTIVE:
- INSPECTING
- PASS
- REVIEW
- REPAIR
- REJECT

QA states must never replace the production generation result.

## Valid production transition

Normal path:

QUEUED → CLAIMED → GENERATING → IMAGE_CREATED

Failure path:

GENERATING → FAILED

Uncertain path:

GENERATING → UNKNOWN → RECOVERY_REQUIRED

A task in UNKNOWN must never transition directly to retry/generation.

## Claim contract

A QUEUED task may become CLAIMED only if:
1. parent module is ACTIVE;
2. task belongs to the active module/batch;
3. task is not already owned by a valid live Claim;
4. a unique Claim ID is created;
5. lease metadata is written atomically with ownership;
6. the resulting state is persisted successfully.

If any condition fails, no generation may start.

## Lease contract

A Claim must contain at minimum:
- CLAIM_ID
- TASK_ID
- WORKER_ID
- CLAIMED_AT
- LEASE_EXPIRES_AT
- STATE_VERSION / CAS VERSION

A Worker may mutate a claimed task only while its Claim and Lease are valid.

Expired ownership must not be silently reused.

## CAS / conflict contract

Every mutable task-state write must use the latest authoritative version.

On conflict:
1. reject the stale write;
2. do not assume the state change succeeded;
3. re-read authoritative state;
4. determine whether recovery is possible;
5. never generate a second candidate merely because a state write conflicted.

## Generation contract

Generation may begin only after:
- valid task identity;
- valid module activation;
- valid Claim/Lease;
- DESIGN_LOCK when applicable;
- FORMAT_LOCK when applicable;
- required task inputs resolved.

Generation result must be exactly one of:
SUCCESS, FAILED, UNKNOWN.

SUCCESS must record IMAGE_CREATED.

UNKNOWN must record RECOVERY_REQUIRED and stop the Worker.

## Idempotency

A task already in IMAGE_CREATED must not be regenerated merely because the Worker restarts.

A task with an unresolved UNKNOWN must not be regenerated automatically.

A duplicate completion event must not create a second task identity.

## Recovery

Recovery is an explicit operation.

Recovery must:
- read the latest authoritative task/event state;
- inspect generation evidence where available;
- resolve UNKNOWN into a documented terminal or retryable state;
- preserve the original event;
- never erase history.

Only after explicit recovery may a task re-enter a generation path.

## Retry

Retry is permitted only for an explicit FAILED result and only within the applicable module retry policy.

UNKNOWN is never equivalent to FAILED.

Circuit breakers must prevent new claims when the module's configured consecutive-error threshold is reached.

## Release

A Worker must release ownership after:
- IMAGE_CREATED;
- FAILED;
- explicit recovery handoff;
- session stop.

A release must be conflict-safe and must not overwrite newer state.

## Immutability

Generation events are append-only.

The following facts must not be rewritten:
- original task identity;
- Claim ID;
- generation attempt;
- original generation result;
- original timestamp;
- original error/UNKNOWN evidence.

Corrections create new events/state transitions.

## Pause / shutdown

If a parent module changes from ACTIVE to PAUSED:
- no new claims may be created;
- existing Workers must stop before starting another generation;
- in-flight generation outcome must be recorded as SUCCESS, FAILED, or UNKNOWN when determinable;
- UNKNOWN enters recovery.

## Required executable components

Future implementation must provide:
1. state-transition validator;
2. persistent task store;
3. atomic claim/lease operation;
4. CAS-protected state update;
5. event log;
6. recovery handler;
7. retry/circuit-breaker evaluator;
8. runtime smoke tests.

## Non-goals

This document does not define:
- image-generation model behavior;
- visual QA criteria;
- festival cultural data;
- LoRA identity;
- external account authority;
- Image Delivery implementation.

## Readiness evidence

Until executable components and runtime tests exist, this contract is DOCUMENTED only.
