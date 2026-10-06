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

### Level 2 — Prompt Delivery Integrity

The system must distinguish internal prompt preparation from confirmation that the actual image-generation interface received the same prompt.
If the interface exposes verifiable request/input information, record GENERATION_CALL_ID and the delivered input identity when available.
If the interface does not expose enough information to verify actual delivery, the state is EXECUTION_INTEGRITY_UNVERIFIED.
It MUST NOT be reported as EXECUTION_INTEGRITY_PASS merely because ChatGPT displayed or prepared the prompt.

## 4. Generation Call Identity

Every actual generation attempt is a distinct execution event.
Record when available: SESSION_ID, BATCH_ID, TASK_ID, PROMPT_ID, PROMPT_VERSION, ATTEMPT_ID, GENERATION_CALL_ID, start/end timestamps, and delivery-integrity state.
A retry creates a new ATTEMPT_ID and, where supported, a new GENERATION_CALL_ID. The locked prompt does not change during retry.

## 5. Result Identity and Output Count

Receiving an image is not the same as Task success.
For every attempt, record when applicable: RESULT_ID/output reference, ACTUAL_OUTPUT_COUNT, expected output count, result-to-Task binding, and result-to-generation-call binding.
For wallpaper production, EXPECTED_OUTPUT_COUNT = 1.
If more than one image is returned for one Task, the Task MUST NOT be SUCCESS.
If a result cannot be reliably bound to the Task or generation call, the Task MUST NOT be SUCCESS.

## 6. Task Success Gate

A Task may be SUCCESS only when all applicable requirements pass:
1. Exact locked-prompt readback.
2. Level 1 Prompt Binding Integrity.
3. Generation call actually initiated for that Task.
4. Required delivery-integrity evidence is available; otherwise use UNVERIFIED, not SUCCESS.
5. Result received.
6. Output count matches the Task contract.
7. Result identity/binding is available when required.
8. No execution-integrity conflict exists.

IMAGE_RESULT_RECEIVED is not TASK_SUCCESS.

## 7. False-Success Prevention

The following MUST NOT produce TASK_STATUS = SUCCESS:
- image exists but prompt delivery is unverified;
- output count is unknown when count matters;
- multiple outputs were returned for a one-image Task;
- result cannot be bound to the Task or attempt;
- required generation-call provenance is missing;
- prompt/input mismatch;
- generation was blocked;
- the prompt was only displayed and actual delivery cannot be established.

Use explicit states such as RESULT_RECEIVED_UNVERIFIED, EXECUTION_INTEGRITY_UNVERIFIED, EXECUTION_INTEGRITY_BLOCKED, and GENERATION_FAILED.

## 8. One Task = One Independent Image

For wallpaper production, one Task equals one independent image. No collage, contact sheet, grid, storyboard, multi-panel output, or silent multi-output acceptance.

## 9. Prompt Immutability

After PROMPT_SET_LOCKED, do not redesign, summarize, translate, reorder, add, remove, or silently substitute prompt content.
Retries and resume use the same locked prompt/version.

## 10. Display Rule

The prompt shown to the user before generation MUST be the same GENERATION_INPUT that passed Level 1 Prompt Binding Integrity.
Displaying the prompt is transparency, not proof of generator delivery.

## 11. Stop Conditions

Generation MUST stop for the affected Task/Batch when Level 1 binding fails, required delivery evidence is unavailable, output count violates the contract, result provenance cannot be established, or execution evidence is contradictory.
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
