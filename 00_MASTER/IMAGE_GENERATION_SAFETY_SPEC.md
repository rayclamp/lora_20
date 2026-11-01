# IMAGE_GENERATION_SAFETY_SPEC.md — Production Worker Safety

## Purpose

This document defines operational safety for the Production Worker pipeline.

It does not perform visual QA.

Production Worker responsibility:

> Design → Prompt → Generate → confirm generation result → record state → continue.

Visual quality, anatomy quality after generation, dataset acceptance, and PASS / REVIEW / REPAIR / REJECT decisions belong exclusively to downstream QA. The QA protocol remains PAUSED until separately authorized; this production specification does not activate QA.

## 1. Generation result

Only these states are valid:

- SUCCESS
- FAILED
- UNKNOWN

### SUCCESS

A generation outcome is confirmed as image-received only when the image-generation operation actually returns at least one generated image result in the current execution context. Record the actual returned image-file count and available attribution evidence. This is an observed generation fact, independently of GitHub persistence.

Do not claim that a Task is durably recorded as `SUCCESS` merely because an image was returned. Mark Task-level `SUCCESS` and count the Task once in `COMPLETED_COUNT` only after the received result has been reliably attributed to that Task, persisted, and read back as required by `PRODUCTION_RECORD_SCHEMA.md`. If the image was received but the write or readback fails, preserve the image-received fact, record the persistence failure separately (or report `GITHUB_RECORDING_FAILED` if it cannot be persisted), and keep the Task's recorded result unresolved until verified. Never regenerate the received image as a record-recovery method.

`IMAGE_CREATED` describes a produced candidate, not QA approval. One Task counts at most once toward production completion even if the generator returned multiple files; record the actual file count separately.

### FAILED

Record a generation failure only when an actual image-generation attempt is confirmed to have produced no image. A GitHub read/write/readback failure, prompt-read failure, status/metadata problem, or other non-generation error is not a generation failure and does not increment its counter.

Retry only a confirmed no-image outcome for the same Task using its unchanged locked Prompt, subject to platform policy, safety restrictions, and the active retry limit. The maximum is **three consecutive confirmed no-image generation attempts in total for the same Task, including the initial call**: initial attempt (1), first retry (2), second retry (3). After the third confirmed no-image failure, terminate that Task under the applicable terminal no-image state. Record generation-attempt and retry counts separately. Never retry after image receipt, while the outcome is unknown, or to circumvent policy or safety restrictions.

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

The locked Prompt text and Task-to-prompt mapping are immutable. Retry the same Task only after a confirmed no-image attempt, subject to a maximum of three consecutive confirmed no-image generation failures **including the initial attempt**; therefore at most two retries follow the initial failed call. After image receipt, unknown outcome, terminal safety/policy restriction, or retry exhaustion, do not call the Prompt again for that Task. Never reassign a Prompt to another Task. Non-generation failures do not consume this three-attempt limit.

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
- PASS / REVIEW / REPAIR / REJECT.

Drawing-stability requirements are enforced when designing and locking prompts; the Producer must use the already locked Prompt, not revalidate or redesign its anatomy or appearance after the complete Prompt has been read. Once that read succeeds, immediately call the generation interface without inserting another validation or QA gate.

Once an image is received, the Producer records the observable result without judging visual quality or prompt compliance. QA is a separate downstream activity and is currently PAUSED; this file must not silently activate it.

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

The affected Task must stop further generation and retain its unresolved recovery state. Never assume that no image exists or retry that Task while its result is unknown. Do not automatically stop or block unrelated Tasks: they may proceed only if their current authoritative GitHub records and complete locked Prompts are independently readable, their results can be safely attributed, and applicable persistence/recovery requirements can be met. Escalate to a Batch-wide stop only for a verified Batch-wide identity, contract, prompt mapping, access, or result-attribution failure that cannot safely be isolated.

## 7. Daily generation limit

Daily generation limits count generation attempts, not only successful images.

When the platform explicitly reports quota exhaustion, record the confirmed no-image outcome and quota/rate-limit reason only if a generation attempt actually occurred and its no-image outcome is confirmed. Such an attempt counts toward the Task's three-attempt limit. If a platform restriction blocks a call before it occurs, record the restriction as a non-generation block, not a failed generation attempt. Never bypass a quota, rate limit, or platform policy to retry. If retry is prohibited or not currently possible, pause or stop the affected Task/operation according to the active workflow without inventing a result. Quota exhaustion is not a visual QA failure or a generation-quality judgment.

## 8. State protection

**Current Single-Producer standard:** GitHub is the authoritative reference and persistence database, not a Runtime Controller, Task Claim API, Lease API, or generation lock service. A GitHub-side Claim ID, Lease, or claim-state transition is **not** required to start generation.

1. Before reading a Task's locked Prompt, identify the eligible Task from the current authoritative Session/Batch and Task records. Do not infer Task identity or state from memory, a previous Worker summary, or guessed data.
2. Read the complete assigned locked Prompt from its current authoritative source. Once that read succeeds, call the generation interface immediately; do not add Claim/Lease checks, metadata revalidation, another GitHub operation, or unrelated work between successful read and the call.
3. After observing the generation result, record the actual image receipt/no-image/UNKNOWN facts and the associated Task evidence, using current GitHub state and appropriate concurrency safeguards for record updates. Write and read back to verify persistence. A conflicting write must be recovered, not treated as success or used to justify another generation call.
4. Isolate a Task-local record/persistence failure and preserve any confirmed image receipt. Another independent Task may continue only if its own authoritative inputs are readable and its identity, result attribution, and persistence safeguards are reliable. Stop the Batch only for a verified non-isolatable Batch-wide integrity/access failure.

**Future Multi-Worker coordination:** A separately defined Runtime Coordinator may introduce Claim/Lease ownership to prevent duplicate execution. Such a future mechanism does not change GitHub into a Worker controller and is not a prerequisite for the current Single-Producer workflow.

## 9. Production/QA boundary

Production Worker:

`TASK → DESIGN → PROMPT → GENERATE → GENERATION RESULT → IMAGE_CREATED`

QA Worker (only after separate activation; currently PAUSED):

`IMAGE_CREATED → INSPECT → PASS / REVIEW / REPAIR / REJECT`

Production Workers do not cross into QA responsibilities. QA findings never retroactively turn an observed image receipt into a no-image failure, alter production counts, or authorize regeneration.

## 10. Drawing-rule dependency

The Production Worker must read and obey:

- `00_MASTER/DRAWING_INSTRUCTIONS.md`
- `00_MASTER/ANATOMY_STABILITY.md`
- `00_MASTER/GENERATION_RULES.md`

The drawing-stability rules are mandatory during design. They are not optional Prompt suggestions.

