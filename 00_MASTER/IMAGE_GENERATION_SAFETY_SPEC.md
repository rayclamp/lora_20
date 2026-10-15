# IMAGE_GENERATION_SAFETY_SPEC.md — Production Worker Safety

## Purpose

This document defines operational safety for the Production Worker pipeline.

It does not perform visual QA.

Production Worker responsibility:

> Design → Prompt → Generate → confirm generation result → record state → continue.

Visual quality, anatomy quality after generation, dataset acceptance, PASS/FAIL, repair, and rejection belong to downstream QA.

## 1. Generation result

Only these states are valid:

- SUCCESS
- FAILED
- UNKNOWN

### SUCCESS

Record SUCCESS only when the image-generation operation actually returns a generated image result in the current generation context.

Then record the task as IMAGE_CREATED according to the current queue protocol.

### FAILED

Record FAILED only when the generation operation explicitly fails.

A confirmed no-image failure may be retried for the same Task using the same unchanged locked Prompt. The initial call is not a retry; after three retry attempts have each failed with a confirmed no-image outcome, terminate the Task. Never retry after image receipt or while the outcome is unknown. Do not alter the Prompt to bypass a policy or safety block.

### UNKNOWN

If the Worker cannot reliably determine whether an image was generated, record `PROMPT_CONSUMED = UNKNOWN` and `PROMPT_STATE = UNKNOWN`:

- do not guess;
- do not retry that Task while the outcome is unknown;
- do not falsely mark the Task successful or failed;
- do not delete or overwrite evidence;
- preserve the applicable recovery state until evidence resolves the outcome;
- unrelated Tasks may continue if their own records and prerequisites are independently usable.

UNKNOWN is not FAILED.

## 2. No duplicate generation

The locked Prompt text and Task-to-prompt mapping are immutable. A confirmed no-image failure may permit another attempt for the same Task using that exact Prompt, up to three failed retry attempts after the initial call. After image receipt, unknown outcome, or retry exhaustion, do not call the Prompt again for that Task. Never reassign a Prompt to another Task.

A successfully generated candidate must never be regenerated merely because the Worker thinks the image could be better.

## 3. Image preservation

Production Workers must never intentionally:

- delete a generated image;
- overwrite a generated image;
- replace a generated image;
- modify a completed generated image.

At the current Phase 1 architecture, generated image binaries are not uploaded to GitHub.

GitHub records task state, Prompt history, and production coordination state.

## 4. No self-QA

The Production Worker must not decide:

- whether anatomy is good;
- whether fingers are good;
- whether feet are good;
- whether proportions are good;
- whether composition is good;
- whether identity match is good;
- whether the image is suitable for LoRA;
- PASS / FAIL / REPAIR / REJECT.

The Worker must apply the drawing-stability rules before generation as design constraints.

Once a generation succeeds, the Worker records the generation event without judging visual quality.

## 5. Generation success vs visual quality

These are independent facts.

A generated image can be:

- generation SUCCESS;
- visually imperfect;
- later rejected by QA.

That does not make the original generation a FAILED generation.

IMAGE_CREATED means a candidate was successfully produced. It does not mean QA PASS.

## 6. Interruption

If generation is interrupted and the Worker cannot reliably determine the result:

`GENERATION_RESULT: UNKNOWN`

and:

`STATUS: RECOVERY_REQUIRED`

The Worker must stop.

It must not assume that no image exists.

## 7. Daily generation limit

Daily generation limits count generation attempts, not only successful images.

When the platform explicitly reports quota exhaustion, record the confirmed no-image outcome and quota/rate-limit reason. Apply the current Task-level retry policy; never bypass a platform restriction. If retry is not currently possible, pause or stop according to the active workflow without inventing a result. Quota exhaustion is not a visual QA failure or a generation-quality judgment.

## 8. State protection

Before changing task state:

1. fetch the latest authoritative queue state;
2. verify Claim ID and Lease;
3. update using the latest queue SHA / CAS mechanism;
4. if the write conflicts, do not continue as though the write succeeded;
5. re-fetch and recover.

Never generate without a successful task claim and generation-state transition.

## 9. Production/QA boundary

Production Worker:

`TASK → DESIGN → PROMPT → GENERATE → GENERATION RESULT → IMAGE_CREATED`

QA Worker:

`IMAGE_CREATED → INSPECT → PASS / FAIL / REPAIR / REJECT`

Production Workers do not cross into QA responsibilities.

## 10. Drawing-rule dependency

The Production Worker must read and obey:

- `00_MASTER/DRAWING_INSTRUCTIONS.md`
- `00_MASTER/ANATOMY_STABILITY.md`
- `00_MASTER/GENERATION_RULES.md`

The drawing-stability rules are mandatory during design. They are not optional Prompt suggestions.

