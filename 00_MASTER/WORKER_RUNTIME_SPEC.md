# WORKER_RUNTIME_SPEC.md — Council Round 6 Phase 5

## Purpose
Define the generic execution Worker above the persistent runtime engine.

## Worker lifecycle
RESOLVE MODULE → LOAD TASK → CLAIM → VALIDATE → GENERATE → RECORD RESULT → RELEASE → NEXT TASK

The Worker must resolve the active module from RUNTIME_STATE before claiming work.

## Boundaries
The Worker may not:
- activate a module;
- create authority for Goal/Batch;
- import another module's workflow;
- perform final QA;
- bypass Claim/Lease/CAS;
- regenerate UNKNOWN automatically.

## Generation adapter
The Worker receives a generation adapter with one operation:
generate(task) -> SUCCESS | FAILED | UNKNOWN

The adapter is isolated from task persistence.

## Stop conditions
Stop on:
- paused parent module;
- invalid task;
- claim conflict;
- lease loss;
- CAS conflict;
- UNKNOWN;
- circuit breaker;
- persistence ambiguity.

## Output
SUCCESS creates IMAGE_CREATED.
FAILED creates FAILED subject to retry policy.
UNKNOWN creates UNKNOWN and RECOVERY_REQUIRED.
