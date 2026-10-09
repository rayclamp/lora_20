# GENERATION_WORKER_PROTOCOL.md

This document defines the execution contract between ChatGPT's production operation and the actual image-generation interface.
It does not turn GitHub into a runtime, scheduler, worker controller, retry engine, or generation controller.

## 1. Core Principle

A valid production Task is not successful merely because an image result is returned.

Minimum execution chain:

TASK_ID → PROMPT_ID → CURRENT_LOCKED_PROMPT → PROMPT_NONEMPTY_AND_TASK_MATCH → GENERATION_CALL → RESULT_RECEIVED → RESULT_VERIFICATION → TASK_STATUS

These are distinct states: prompt preparation/binding, actual generation-call delivery, image-result receipt, and Task success.

## 2. Runtime Ownership Boundary

### 2.1 Single-Producer Execution — CURRENT STANDARD

For the current /START_AUTO workflow, one authorized ChatGPT Producer operates its own Session/Batch.

A Single Producer MUST NOT require any GitHub-side:
- Task Claim API
- Lease API
- Lock Token
- Worker Claim
- Runtime Claim
- GitHub execution lock

as a prerequisite for starting a Generation.

Task ownership during Single-Producer execution is a Producer Runtime responsibility.

The Producer MUST:
1. operate only within its authorized/current Session and Batch;
2. select the next applicable Task from the persisted Task Queue;
3. verify that the Task has not already reached a valid terminal state;
4. execute the applicable Prompt Integrity and Generation rules;
5. persist the resulting state and evidence to GitHub.

GitHub records ownership/state/evidence; GitHub does not grant runtime permission to execute the Task.

### 2.2 Multi-Worker Coordination — FUTURE RUNTIME LAYER

If the project later introduces Make, multiple Workers, or another external Runtime Coordinator, a Claim/Lease mechanism MAY be introduced to prevent concurrent execution of the same Task.

Such Claim/Lease mechanisms belong to the Multi-Worker Runtime Coordination layer, not to GitHub's repository role.

A future Runtime Coordinator MAY use concepts such as:

WORKER_ID
CLAIM_ID
LEASE_ID
LEASE_EXPIRY
LOCK_STATE

and MAY persist their resulting records to GitHub.

However:
1. These mechanisms are NOT required by the current Single-Producer /START_AUTO workflow.
2. Their absence from the GitHub interface MUST NOT block current Single-Producer Generation.
3. A future Claim/Lease implementation MUST NOT redefine GitHub as the runtime controller.
4. A future Multi-Worker design must explicitly define its Runtime Coordinator before making Claim/Lease a mandatory execution gate.

### 2.3 Boundary Rule

The following interpretation is forbidden:

GitHub does not provide Claim/Lease API, therefore Generation cannot start.

For the current Single-Producer workflow, this is an invalid blocking condition.

The following interpretation is correct:

Producer owns the runtime execution of its authorized Session/Batch; GitHub stores the authoritative production records and evidence.

This boundary does NOT weaken Prompt Integrity, Generation Delivery Integrity, Result Integrity, Retry, Pause/Resume, or Task Success requirements defined below.

## 3. Prompt Execution Integrity

### Level 1 — Prompt Readiness

1. Read the current complete locked prompt from the authoritative PROMPT_SET.
2. Confirm the prompt is non-empty and associated with the current Task.
3. Use that current locked prompt directly as the generation instruction.
4. Do not redesign, summarize, translate, omit, replace, or silently alter the prompt before generation.
5. This readiness check does not require hidden transport evidence.

Passing Level 1 proves only that ChatGPT prepared the correct input.

### Level 2 — Generator Delivery Evidence

Level 2 is an evidence layer, not a mandatory pre-generation gate.
1. If the image-generation interface exposes verifiable request/input information, record GENERATION_CALL_ID and the available delivered-input identity.
2. If the interface does not expose transport/request evidence, record `DELIVERY_INTEGRITY_STATUS = NOT_EXPOSED` (or an equivalent `UNVERIFIED` evidence state).
3. Lack of Level 2 telemetry MUST NOT prevent a valid Generation Call after Level 1 passes.
4. Level 2 evidence may strengthen execution provenance, but it must not be fabricated.
5. Level 2 absence must not be represented as `EXECUTION_INTEGRITY_BLOCKED` when the generation call itself was validly initiated.

## 4. Generation Call Identity

Every actual generation attempt is a distinct execution event.
Record when available: SESSION_ID, BATCH_ID, TASK_ID, PROMPT_ID, PROMPT_VERSION, ATTEMPT_ID, GENERATION_CALL_ID, start/end timestamps, and delivery-integrity state.
For the current Single-Producer /START_AUTO workflow, one locked Prompt/version may produce at most one successful image result. Initiating a Generation Call does NOT by itself consume the Prompt. After each attempt, classify the outcome:
- Confirmed image result received: set `PROMPT_CONSUMED = YES`; never call that Prompt/version again.
- Verified Policy/Safety interruption with confirmed no image result: keep `PROMPT_CONSUMED = NO`; only an explicitly authorized continuation may retry the exact same locked Prompt/version for the same Task. Do not modify or replace the prompt.
- Confirmed generation failure with confirmed no image result: keep `PROMPT_CONSUMED = NO`; apply the separate error-specific retry/terminal rule, retaining the same Task and locked Prompt.
- Unknown outcome: enter recovery and stop. Do not retry, skip, or advance until resolved.

Every actual call has a distinct `ATTEMPT_ID` and execution event. Prompt reuse is governed by both prompt state and Task state: a Prompt that was not consumed by an image may still be permanently retired when its Task reaches a terminal state. After three consecutive verified Policy/Safety interruptions, set `TASK_STATUS = PROMPT_SKIPPED_POLICY_LIMIT`, `PROMPT_TERMINATION_REASON = THREE_CONSECUTIVE_POLICY_INTERRUPTS`, and retire the Prompt permanently. Policy interruptions, generation-service errors, quota/rate limits, GitHub errors, runtime errors, and unknown outcomes must not be merged into one counter.

## 5. Result Identity and Output Count

Receiving an image is not the same as Task success.
For every attempt, record when applicable: RESULT_ID/output reference, ACTUAL_OUTPUT_COUNT, expected output count, result-to-Task binding, and result-to-generation-call binding.
For wallpaper production, EXPECTED_OUTPUT_COUNT = 1.
If more than one image is returned for one Task, the Task MUST NOT be SUCCESS. When the actual count is known, record the failure explicitly as RESULT_COUNT_MISMATCH; do not collapse a known count mismatch into RESULT_RECEIVED_UNVERIFIED.
If a result cannot be reliably bound to the Task or generation call, the Task MUST NOT be SUCCESS.

## 6. Task Success Gate

A Task may be SUCCESS only when all applicable requirements pass:
1. Current locked-prompt readback.
2. Prompt is non-empty and associated with the current Task.
3. Generation call actually initiated for that Task.
4. If Level 2 delivery evidence is exposed by the interface, it must be recorded consistently; if it is not exposed, do not invent it and do not block success solely for its absence.
5. Result received.
6. Output count matches the Task contract.
7. Result identity/binding is available when required.
8. No execution-integrity conflict exists.

IMAGE_RESULT_RECEIVED is not TASK_SUCCESS.

## 7. False-Success Prevention

The following MUST NOT produce TASK_STATUS = SUCCESS:
- image exists but the current locked prompt was missing, empty, or associated with the wrong Task;
- output count is unknown when count matters;
- multiple outputs were returned for a one-image Task (record RESULT_COUNT_MISMATCH when the count is known);
- result cannot be bound to the Task or attempt;
- required generation-call provenance that the interface actually exposes is missing;
- generation was blocked;
- the generation call was not initiated.

Use explicit states such as RESULT_RECEIVED_UNVERIFIED, EXECUTION_INTEGRITY_UNVERIFIED, EXECUTION_INTEGRITY_BLOCKED, and GENERATION_FAILED.

## 8. One Task = One Independent Image

For wallpaper production, one Task equals one independent image. No collage, contact sheet, grid, storyboard, multi-panel output, or silent multi-output acceptance.

## 9. Prompt Immutability

After PROMPT_SET_LOCKED, do not redesign, summarize, translate, reorder, add, remove, or silently substitute prompt content.
The current /START_AUTO workflow does not automatically retry without authorization. An explicitly authorized continuation may recover the existing Session/Batch and locked Prompt Set. It may retry the same locked Prompt/version only when the previous attempt is confirmed to have produced no image and the applicable retry rule allows it. A consumed Prompt/version MUST NOT be called again. A retired Prompt MUST NOT be reused even when `PROMPT_CONSUMED = NO`.

## 10. Stop Conditions

Generation MUST stop for the affected Task/Batch when the current locked prompt is missing, empty, or associated with the wrong Task, the generation interface rejects/fails the call, output count violates the contract, result provenance cannot be established after a result is returned, or execution evidence is contradictory. The absence of transport/delivery telemetry is NOT a stop condition for the current Single-Producer workflow.
The absence of a GitHub Claim/Lease API is NOT a stop condition for the current Single-Producer workflow.

## 11. Recovery

Resume uses the same SESSION_ID, BATCH_ID, and locked PROMPT_SET.
Do not redesign prompts.
Do not treat unverified results as terminal Tasks.
Re-run the applicable state/integrity gates before continuing. Continue only if the Task is non-terminal, the Prompt is not consumed or retired, and the prior attempt outcome is known. A retry uses a new `ATTEMPT_ID` but the same `TASK_ID`, `PROMPT_ID`, `PROMPT_VERSION`, and exact locked Prompt content. Never retry an UNKNOWN outcome.

If a Single-Producer session is interrupted, the next authorized Producer context may continue only when the user explicitly authorizes access to the existing Session/Batch, consistent with CORE session-access rules.

## 12. Visual QA Boundary

This protocol does not perform visual QA.
Face identity, anatomy, hands/feet, composition, artistic quality, prompt visual compliance, and LoRA quality belong to the separate QA workflow.

## 13. Evidence Rule

Execution records must preserve enough evidence to answer:
- which locked prompt was intended;
- which generation attempt was made;
- what input was bound;
- what result was returned;
- how many outputs were returned;
- why the Task was or was not successful.

If evidence is insufficient, prefer UNVERIFIED/BLOCKED over false SUCCESS.

## 14. Architecture Boundary Summary

CURRENT:

User → ChatGPT Producer Runtime → Generation Interface
                    ↓
                 GitHub
          Reference + Persistence

GitHub is the authoritative repository for reference data and persisted production records, but it is not the runtime authority that grants permission to generate.

FUTURE MULTI-WORKER:

User → Runtime Coordinator → Workers → Generation Interface
             ↓
          GitHub
     Reference + Persistence

A future Runtime Coordinator may implement Claim/Lease coordination. Until that layer is explicitly implemented and defined, Claim/Lease is not a generation prerequisite.

## 3.0 Production Entry Gate — Canonical Rule Loading

The /START_AUTO workflow MUST pass the Canonical Rule Loading Gate before any image-generation call.

### Required sequence
`/START_AUTO → CANONICAL_RULE_LOADING → ENTRY_GATE → Session/Batch → Prompt Design → Prompt Lock → Generation`

### Gate requirements
1. Load the applicable current GitHub Canonical Rules.
2. Load the applicable module and production-type rules required for the requested production.
3. Verify that the required rules were successfully retrieved and are usable.
4. Record or report `GITHUB_RULES_LOADED = YES` only when the required rules were actually loaded.
5. Only after the gate passes may automated production proceed.

### Gate failure
If required Canonical Rules cannot be loaded, are inaccessible, or cannot be verified:
- `ENTRY_GATE = BLOCKED`
- `REASON = CANONICAL_RULE_LOADING_FAILED` (or a more specific failure reason)
- `GENERATION_ALLOWED = NO`
- no image-generation call may be made;
- the Producer MUST NOT fall back to ordinary image-generation behavior;
- the Producer MUST NOT reinterpret the Production Request as a normal image-generation request.

### Hard invariant
`CANONICAL_RULE_LOADING = PASS` is a mandatory prerequisite for /START_AUTO Generation.

The gate belongs to the Producer Runtime. It does not make GitHub a runtime controller and does not require a GitHub-side execution lock, Claim API, Lease API, or generation permission API.

### Rationale
GitHub Canonical Rules define the semantics of automated production, including Task decomposition, output-count semantics, Prompt Lock, and applicable generation constraints. Without those rules, the Producer cannot safely assume that a request such as `IMAGE_COUNT = 12` means twelve independent Tasks. Therefore absence of verified Canonical Rules is a hard pre-generation block.


## 12.1 RESUME ENTRY GATE

Before a /RESUME_AUTO Generation attempt, the Producer MUST:

1. re-verify the current GitHub database connection;
2. reload and verify the applicable current Canonical Rules;
3. recover the existing Session/Batch, Task Queue, Checkpoint, and locked Prompt Set;
4. select the first Task that has not reached a valid terminal state.

If connection verification or Canonical Rule Loading fails, resume is BLOCKED and no Generation call may occur.

Resume MUST NOT create a replacement Session/Batch, reset attempt counts, or modify/redesign a locked prompt.
