# GENERATION_WORKER_PROTOCOL.md

This document defines the execution contract between ChatGPT's production operation and the actual image-generation interface.
It does not turn GitHub into a runtime, scheduler, worker controller, retry engine, or generation controller.

## 1. Core Principle

A valid production Task is not successful merely because an image result is returned.

Minimum execution chain:

TASK_ID → PROMPT_ID → LOCKED_PROMPT → EXACT_READBACK → GENERATION_INPUT → GENERATION_CALL → RESULT_RECEIVED → RESULT_VERIFICATION → TASK_STATUS

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
3. verify that the Task has not already reached valid terminal SUCCESS;
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

### Level 1 — Prompt Binding Integrity

1. Read the task's locked prompt exactly from the authoritative PROMPT_SET.
2. Create GENERATION_INPUT from that exact readback.
3. GENERATION_INPUT MUST equal the complete locked prompt text-for-text.
4. When available, compare LOCKED_PROMPT_LENGTH, GENERATION_INPUT_LENGTH, LOCKED_PROMPT_HASH, and GENERATION_INPUT_HASH.
5. Any mismatch blocks generation.

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
A retry creates a new ATTEMPT_ID and, where supported, a new GENERATION_CALL_ID. The locked prompt does not change during retry.

## 5. Result Identity and Output Count

Receiving an image is not the same as Task success.
For every attempt, record when applicable: RESULT_ID/output reference, ACTUAL_OUTPUT_COUNT, expected output count, result-to-Task binding, and result-to-generation-call binding.
For wallpaper production, EXPECTED_OUTPUT_COUNT = 1.
If more than one image is returned for one Task, the Task MUST NOT be SUCCESS. When the actual count is known, record the failure explicitly as RESULT_COUNT_MISMATCH; do not collapse a known count mismatch into RESULT_RECEIVED_UNVERIFIED.
If a result cannot be reliably bound to the Task or generation call, the Task MUST NOT be SUCCESS.

## 6. Task Success Gate

A Task may be SUCCESS only when all applicable requirements pass:
1. Exact locked-prompt readback.
2. Level 1 Prompt Binding Integrity.
3. Generation call actually initiated for that Task.
4. If Level 2 delivery evidence is exposed by the interface, it must be recorded consistently; if it is not exposed, do not invent it and do not block success solely for its absence.
5. Result received.
6. Output count matches the Task contract.
7. Result identity/binding is available when required.
8. No execution-integrity conflict exists.

IMAGE_RESULT_RECEIVED is not TASK_SUCCESS.

## 7. False-Success Prevention

The following MUST NOT produce TASK_STATUS = SUCCESS:
- image exists but a required Level 1 prompt binding check failed;
- output count is unknown when count matters;
- multiple outputs were returned for a one-image Task (record RESULT_COUNT_MISMATCH when the count is known);
- result cannot be bound to the Task or attempt;
- required generation-call provenance that the interface actually exposes is missing;
- prompt/input mismatch;
- generation was blocked;
- the prompt was only displayed and no Generation Call was initiated.

Use explicit states such as RESULT_RECEIVED_UNVERIFIED, EXECUTION_INTEGRITY_UNVERIFIED, EXECUTION_INTEGRITY_BLOCKED, and GENERATION_FAILED.

## 8. One Task = One Independent Image

For wallpaper production, one Task equals one independent image. No collage, contact sheet, grid, storyboard, multi-panel output, or silent multi-output acceptance.

## 9. Prompt Immutability

After PROMPT_SET_LOCKED, do not redesign, summarize, translate, reorder, add, remove, or silently substitute prompt content.
Retries and resume use the same locked prompt/version.

## 10. Display Rule

The prompt shown to the user before generation MUST be the same GENERATION_INPUT that passed Level 1 Prompt Binding Integrity.
Displaying the prompt is transparency, not proof of generator delivery.

## 10.1 Pre-generation Prompt Extraction and Immediate Execution

After Level 1 Prompt Binding Integrity passes, the Producer MUST extract the complete exact `GENERATION_INPUT` that will be used for the current generation event and place that exact Prompt content into the ChatGPT conversation immediately before the Generation Call.

The displayed Prompt is the execution Prompt for that generation event. Immediately after displaying it, the Producer MUST send/use that same exact Prompt content for the image-generation interface.

The Producer MUST NOT, between Prompt extraction/display and the Generation Call:
- redesign the Prompt;
- reconstruct the Prompt from task metadata;
- summarize or shorten the Prompt;
- translate or rewrite the Prompt;
- add, remove, prepend, or append Prompt content;
- substitute another Prompt.

Required execution sequence:

`LOCKED_PROMPT → EXACT_READBACK → GENERATION_INPUT → PROMPT_BINDING_CHECK → EXTRACT EXACT PROMPT → DISPLAY EXACT PROMPT IN CHAT → IMMEDIATELY GENERATE USING THAT SAME PROMPT → RECORD RESULT`

The Chat display does not by itself prove that the generation interface received the exact Prompt. If generator-side delivery telemetry is unavailable, retain the applicable `UNVERIFIED` / `NOT_EXPOSED` evidence state.


### 10.2 Task-Scoped Prompt Display — Additive Execution Rule

For every Task and every Generation attempt, the Producer MUST independently repeat the Prompt Display step for that Task's current locked Prompt. This rule adds a per-Task execution requirement; it does not replace or restructure the existing Session/Batch/Task, Prompt Lock, Level 1, Level 2, Generation Call, Result Verification, or Task Success architecture.

After the current Task passes Level 1 Prompt Binding Integrity, the Producer MUST:
1. re-identify the current `TASK_ID` and its associated `PROMPT_ID`;
2. use that Task's exact `GENERATION_INPUT`, already verified against its `LOCKED_PROMPT`;
3. display the complete exact Prompt in the ChatGPT conversation;
4. immediately initiate that Task's Generation Call using the same Prompt, without intervening edits.

Prompt Display is Task-scoped, never satisfied by a Session-level or global flag. The following MUST NOT be used to skip the current Task's display step:
- a Prompt is already present anywhere in the conversation;
- the previous Task displayed its Prompt;
- another Task or attempt displayed the same or similar text;
- the Session previously completed a Prompt Display step.

The invariant for each Task is:

`CURRENT TASK LOCKED_PROMPT = VERIFIED GENERATION_INPUT = CURRENT TASK DISPLAYED PROMPT = PROMPT USED FOR THE IMMEDIATE GENERATION CALL`

This rule does not claim that chat display alone proves generator-side delivery. Level 2 remains an evidence layer: record `NOT_EXPOSED` / `UNVERIFIED` when delivery telemetry is unavailable, and do not fabricate delivery evidence or block a valid call solely because telemetry is absent.


## 11. Stop Conditions

Generation MUST stop for the affected Task/Batch when Level 1 binding fails, the generation interface rejects/fails the call, output count violates the contract, result provenance cannot be established after a result is returned, or execution evidence is contradictory. The absence of transport/delivery telemetry is NOT a stop condition for the current Single-Producer workflow.
The absence of a GitHub Claim/Lease API is NOT a stop condition for the current Single-Producer workflow.

## 12. Recovery

Resume uses the same SESSION_ID, BATCH_ID, and locked PROMPT_SET.
Do not redesign prompts.
Do not treat unverified results as completed Tasks.
Re-run the applicable integrity gates before a new attempt.

If a Single-Producer session is interrupted, the next authorized Producer context may continue only when the user explicitly authorizes access to the existing Session/Batch, consistent with CORE session-access rules.

## 13. Visual QA Boundary

This protocol does not perform visual QA.
Face identity, anatomy, hands/feet, composition, artistic quality, prompt visual compliance, and LoRA quality belong to the separate QA workflow.

## 14. Evidence Rule

Execution records must preserve enough evidence to answer:
- which locked prompt was intended;
- which generation attempt was made;
- what input was bound;
- what result was returned;
- how many outputs were returned;
- why the Task was or was not successful.

If evidence is insufficient, prefer UNVERIFIED/BLOCKED over false SUCCESS.

## 15. Architecture Boundary Summary

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
4. select the first Task that has not reached valid terminal SUCCESS.

If connection verification or Canonical Rule Loading fails, resume is BLOCKED and no Generation call may occur.

Resume MUST NOT create a replacement Session/Batch, reset attempt counts, or modify/redesign a locked prompt.
