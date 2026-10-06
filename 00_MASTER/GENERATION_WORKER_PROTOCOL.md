# GENERATION_WORKER_PROTOCOL.md

This document defines the execution contract between ChatGPT's production operation and the actual image-generation interface.
It does not turn GitHub into a runtime, scheduler, worker controller, retry engine, or generation controller.

## 1. Core Principle

A valid production Task is not successful merely because an image result is returned.

Minimum execution chain:
TASK_ID → PROMPT_ID → LOCKED_PROMPT → EXACT_READBACK → GENERATION_INPUT → GENERATION_CALL → RESULT_RECEIVED → RESULT_VERIFICATION → TASK_STATUS

These are distinct states: prompt preparation/binding, actual generation-call delivery, image-result receipt, and Task success.

## 2. Prompt Execution Integrity

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

## 3. Generation Call Identity

Every actual generation attempt is a distinct execution event.
Record when available: SESSION_ID, BATCH_ID, TASK_ID, PROMPT_ID, PROMPT_VERSION, ATTEMPT_ID, GENERATION_CALL_ID, start/end timestamps, and delivery-integrity state.
A retry creates a new ATTEMPT_ID and, where supported, a new GENERATION_CALL_ID. The locked prompt does not change during retry.

## 4. Result Identity and Output Count

Receiving an image is not the same as Task success.
For every attempt, record when applicable: RESULT_ID/output reference, ACTUAL_OUTPUT_COUNT, expected output count, result-to-Task binding, and result-to-generation-call binding.
For wallpaper production, EXPECTED_OUTPUT_COUNT = 1.
If more than one image is returned for one Task, the Task MUST NOT be SUCCESS.
If a result cannot be reliably bound to the Task or generation call, the Task MUST NOT be SUCCESS.

## 5. Task Success Gate

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

## 6. False-Success Prevention

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

## 7. One Task = One Independent Image

For wallpaper production, one Task equals one independent image. No collage, contact sheet, grid, storyboard, multi-panel output, or silent multi-output acceptance.

## 8. Prompt Immutability

After PROMPT_SET_LOCKED, do not redesign, summarize, translate, reorder, add, remove, or silently substitute prompt content.
Retries and resume use the same locked prompt/version.

## 9. Display Rule

The prompt shown to the user before generation MUST be the same GENERATION_INPUT that passed Level 1 Prompt Binding Integrity.
Displaying the prompt is transparency, not proof of generator delivery.

## 10. Stop Conditions

Generation MUST stop for the affected Task/Batch when Level 1 binding fails, required delivery evidence is unavailable, output count violates the contract, result provenance cannot be established, or execution evidence is contradictory.

## 11. Recovery

Resume uses the same SESSION_ID, BATCH_ID, and locked PROMPT_SET. Do not redesign prompts. Do not treat unverified results as completed Tasks. Re-run the applicable integrity gates before a new attempt.

## 12. Visual QA Boundary

This protocol does not perform visual QA. Face identity, anatomy, hands/feet, composition, artistic quality, prompt visual compliance, and LoRA quality belong to the separate QA workflow.

## 13. Evidence Rule

Execution records must preserve enough evidence to answer: which locked prompt was intended, which generation attempt was made, what input was bound, what result was returned, how many outputs were returned, and why the Task was or was not successful.
If evidence is insufficient, prefer UNVERIFIED/BLOCKED over false SUCCESS.