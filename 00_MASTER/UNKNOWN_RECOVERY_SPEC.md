# UNKNOWN_RECOVERY_SPEC.md — Council Round 6 Phase 8

## Principle
UNKNOWN means the runtime cannot prove whether generation completed.

UNKNOWN is not FAILED and is not permission to retry.

## Recovery sequence
1. freeze automatic generation for the Task;
2. read latest Task state;
3. read append-only events;
4. inspect generation evidence/result reference if available;
5. reconcile the authoritative state;
6. append a recovery event;
7. only then permit an explicit retry or terminal resolution.

## Forbidden
- automatic regeneration;
- deleting UNKNOWN history;
- changing UNKNOWN to SUCCESS without evidence;
- changing UNKNOWN to FAILED merely to trigger retry;
- creating a second Task ID for an uncertain output.

## Recovery outcomes
RECOVERED_SUCCESS → IMAGE_CREATED
RECOVERED_FAILURE → FAILED
RETRY_AUTHORIZED → QUEUED
BLOCKED → BLOCKED

Every outcome must reference the original UNKNOWN event.
