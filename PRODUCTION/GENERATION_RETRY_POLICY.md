# GENERATION_RETRY_POLICY.md — Generation Error and Retry Policy

## 1. Purpose

This policy prevents a single difficult image or a temporary ChatGPT image-generation outage from consuming the entire production run.

The policy distinguishes task-specific generation difficulty, image-generation tool/system failure, platform safety blocking, ordinary prerequisite blocking, and successful generation.

The Production Worker must never rewrite prompts merely to evade a safety block or repeatedly consume the queue while the generation system is failing.

## 2. Default limits

- MAX_IMAGE_RETRIES: 3
- MAX_CONSECUTIVE_GENERATION_ERRORS: 3

These are Goal-level operational defaults and may be changed by the Master Director before a production run.

## 3. Error classes

### GENERATION_TOOL_ERROR

Use when the image-generation system does not successfully execute the requested generation.

Examples:
- the image-generation tool does not appear;
- ChatGPT responds with a generic "Please try again" / retry message without producing an image;
- the image-generation tool reports an internal generation error;
- the generation request cannot be started or completed because the generation service is malfunctioning.

Do not treat this as a Prompt Package failure by default.

### SAFETY_BLOCKED

Use when ChatGPT explicitly reports that the generation was blocked by a safety policy.

The worker must not repeatedly rewrite the task or Prompt Package to bypass the safety system.

The ChatGPT user interface may not expose whether the block occurred during input checking or output checking. Record the stage as UNKNOWN unless the platform explicitly provides it.

### BLOCKED

Use for a missing prerequisite such as an unavailable or unreadable MASTER_IMAGE.

### FAILED

Use only for a technical failure that does not fit the more specific categories above.

## 4. Per-image retry rule

A GENERATION_TOOL_ERROR increments the task's attempt counter.

Default behavior:

Attempt 1 → retry is allowed.
Attempt 2 → retry is allowed.
Attempt 3 → stop retrying the task.

After the third failed generation attempt:

GENERATION_TOOL_ERROR × 3
→ DEFERRED

DEFERRED means:
- this task is temporarily set aside;
- it does not count as IMAGE_CREATED;
- it is not a final QA REJECT;
- the Worker releases the task;
- the Worker continues with another QUEUED task when the generation system is still considered healthy;
- the Master Director may later return the task to QUEUED for another controlled attempt.

Do not perform a fourth automatic attempt.

## 5. Consecutive system-error circuit breaker

Track a Goal-level consecutive_generation_errors counter.

Increment it only for GENERATION_TOOL_ERROR.

Reset it to 0 after any successful IMAGE_CREATED.

Default:

3 consecutive GENERATION_TOOL_ERROR events
→ GENERATION SYSTEM PAUSED

When the circuit breaker trips:
1. stop claiming new generation tasks;
2. preserve all QUEUED tasks;
3. release any task that is safely recoverable;
4. do not mass-mark queued tasks as failed;
5. do not modify Prompt Packages merely to force generation;
6. record the system-pause event;
7. wait for Master Director/operator review and an explicit resume decision.

The purpose is to prevent a platform-wide generation outage from turning the entire Goal into a series of failed attempts.

## 6. Safety-block handling

SAFETY_BLOCKED is not equivalent to GENERATION_TOOL_ERROR and does not consume the normal three-attempt generation retry budget.

When safety blocking is explicitly reported:
1. stop the current task;
2. record SAFETY_BLOCKED;
3. preserve the original task definition and Prompt Package unchanged;
4. release the current Worker;
5. do not automatically retry the same task;
6. do not rewrite the Prompt Package to bypass or circumvent the safety system;
7. immediately return to the queue and claim another available task if the Goal remains active and the generation system is not paused.

A SAFETY_BLOCKED task is skipped for the current production run. The Master Director/operator may later review it and explicitly create a legitimate revised task or return the task to QUEUED. A safety block does not by itself increment the consecutive GENERATION_TOOL_ERROR circuit breaker.

## 7. Prerequisite blocking

If a required reference or other prerequisite is unavailable before generation:

GENERATING not entered
→ BLOCKED
→ resolve prerequisite
→ QUEUED

A prerequisite block does not consume a generation retry.

## 8. Successful generation

A successful image-generation event:
- GENERATION_TOOL_ERROR counter → reset to 0
- task state → IMAGE_CREATED
- Goal Phase 1 count → +1

IMAGE_CREATED is the only successful Phase 1 completion event.

## 9. Worker behavior summary

1. Claim task.
2. Verify reference and task.
3. Start generation.
4. If image is created: record IMAGE_CREATED and continue.
5. If GENERATION_TOOL_ERROR: increment attempts, check the per-image limit, and check the consecutive-error circuit breaker.
6. If SAFETY_BLOCKED: record the block, release the current Worker, skip that task, and continue with another available task; never modify the prompt to bypass the safety system.
7. If BLOCKED: return to QUEUED after the prerequisite is resolved.
8. If the circuit breaker trips: stop all new generation.

## 10. Principle

> Give a difficult image a limited number of chances. Protect the entire production run when the generation system itself is failing.
