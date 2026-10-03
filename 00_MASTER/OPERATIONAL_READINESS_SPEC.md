# OPERATIONAL_READINESS_SPEC.md — Council Round 6

## Purpose

Council Round 6 verifies whether the repository architecture can be executed safely in a real runtime, rather than only described and structurally validated.

Round 5 proved architectural consistency and boundary enforcement.

Round 6 verifies the next layer:

USER INTENT → RUNTIME STATE → MODULE EXECUTION → TASK STATE → WORKER → GENERATION RESULT → DOWNSTREAM

## Readiness levels

### LEVEL 0 — SPECIFICATION READY
Required: canonical architecture, authority hierarchy, module boundaries, and current runtime state.
Round 5 established this level.

### LEVEL 1 — MANUAL OPERATION READY
Required: an ACTIVE workflow has a defined human/Director entry point; required inputs and routing are explicit; the workflow can produce a deterministic design artifact without superseded memory; execution boundaries are explicit.

The current Festival Wallpaper MANUAL_DESIGN workflow can satisfy this level for design work.

### LEVEL 2 — AUTOMATION READY
Required: persistent task records; explicit Goal/Batch/Queue state where applicable; executable Worker entry point; atomic Claim/Lease/CAS or equivalent ownership control; terminal state recording; UNKNOWN recovery; output-count validation; retry/circuit-breaker enforcement; executable generation-runtime integration; deterministic runtime smoke tests.

Documentation that says an automation layer should enforce a rule is not equivalent to the automation existing.

### LEVEL 3 — END-TO-END OPERATION READY
Required: generation runtime integration; production task execution; generation-result persistence; QA execution when QA is ACTIVE; delivery execution when Image Delivery is ACTIVE; recovery/replay behavior; end-to-end smoke test; evidence that the complete active pipeline executes without manual state reconstruction.

## Hard operational invariants

1. A PAUSED module cannot execute.
2. An ACTIVE workflow must resolve to an ACTIVE module.
3. A Worker must not generate without valid task ownership when a queue is required.
4. Claim ownership must be atomic or otherwise conflict-safe.
5. UNKNOWN must enter recovery and must not become an automatic retry.
6. SUCCESS must produce an immutable generation event/candidate record.
7. QA must not rewrite production SUCCESS.
8. A new candidate/task identity must not be invented from extra outputs.
9. Runtime state must be recovered from canonical state, not conversation memory.
10. Module boundaries must remain enforced during execution, not only during document validation.

## Evidence rule

Round 6 must distinguish:
- DOCUMENTED: the rule exists in GitHub;
- STRUCTURALLY VALIDATED: the architecture validator checks the rule;
- EXECUTABLE: a runtime mechanism exists;
- RUNTIME-VERIFIED: an actual execution test demonstrated the behavior.

These labels must never be conflated.

## Current repository limitation

The current repository contains architecture specifications and two architecture-validation scripts, but no dedicated executable queue/claim/lease runtime, generation adapter, QA executor, delivery executor, or end-to-end runtime smoke-test harness.

Therefore Round 6 must not declare full automation or end-to-end operational readiness from Round 5 evidence alone.

## Required future implementation order

1. Runtime state machine contract.
2. Persistent task/batch/queue schema.
3. Claim/Lease/CAS mechanism.
4. Worker runtime adapter.
5. Generation adapter.
6. Result/event persistence.
7. UNKNOWN recovery mechanism.
8. Retry/circuit-breaker enforcement.
9. QA runtime when QA is activated.
10. Delivery runtime when Image Delivery is activated.
11. Deterministic operational smoke tests.
12. End-to-end execution test.

## Safety rule

Do not activate a module merely because its documentation has been written.

A module becomes operationally executable only when its required runtime mechanism and state contract are implemented and verified.
