# RESULT_EVENT_PERSISTENCE_SPEC.md — Council Round 6 Phase 7

## Event model
Every state-changing runtime operation emits an append-only event.

Minimum event fields:
- EVENT_ID
- EVENT_TYPE
- TASK_ID
- MODULE_ID
- STATE_VERSION_BEFORE
- STATE_VERSION_AFTER
- TIMESTAMP
- WORKER_ID
- CLAIM_ID
- ATTEMPT_ID
- RESULT
- ERROR_CODE when applicable

## Immutable facts
Events are never rewritten or deleted to repair state.
Corrections append a new event.

## Persistence order
1. validate current state;
2. apply transition;
3. persist task state;
4. persist corresponding event;
5. expose the new authoritative version.

If persistence cannot establish which result was committed, the operation is UNKNOWN and requires recovery.

## Idempotency
EVENT_ID and IDEMPOTENCY_KEY prevent duplicate completion.
Duplicate event submission must be harmless and must not increment task state twice.

## Scope
This event store records runtime facts only. QA and Delivery decisions remain downstream.
