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

Follow the existing retry policy. Do not rewrite the Prompt merely because a generation attempt failed.

### UNKNOWN

If the Worker cannot reliably determine whether an image was generated:

- do not guess;
- do not regenerate;
- do not skip;
- do not delete;
- do not overwrite;
- enter RECOVERY_REQUIRED / the applicable recovery state;
- stop until the result is explicitly resolved.

UNKNOWN is not FAILED.

## 2. No duplicate generation

A generation whose outcome is UNKNOWN must never be automatically generated again.

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

When the platform explicitly reports quota exhaustion:

- do not mark the task IMAGE_CREATED;
- return CLAIMED/GENERATING to QUEUED when the queue is safely writable;
- release the Claim/Lease;
- record the quota event when supported;
- stop this Worker session.

Quota exhaustion is not a visual QA failure and not a generation-quality failure.

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

