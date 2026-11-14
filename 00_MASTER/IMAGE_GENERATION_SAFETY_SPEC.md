# IMAGE_GENERATION_SAFETY_SPEC.md — Production Worker Safety

**V5.0 design-only applicability:** Apply this document's drawing-stability and pre-generation safety constraints while designing new `LORA_IMAGE` prompts. Producer, locked-Prompt, retry, Task state and Batch-result procedures below apply only to historical Batch-based and wallpaper production. `LORA_CONSOLE V5.0` must never start generation, producer, QA, Batch, prompt locks or production records; it only writes and full-readback-verifies `PROMPTS/LORA_IMAGE/<SESSION_ID>/INDEX.md` plus complete English `TASK_NNN.txt` prompts. User-managed image generation occurs separately.


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

Retry only a confirmed no-image outcome for the same Task using the exact execution instruction fixed by its first actual generation call, whether `FULL_LOCKED_PROMPT` or `AUTHORIZED_CONDENSED_PROMPT`, while keeping the canonical locked Prompt unchanged and never re-condensing, translating, rewriting, replacing, or switching input modes; all retries remain subject to platform policy, safety restrictions, and the active retry limit. The maximum is **three consecutive confirmed no-image generation attempts in total for the same Task, including the initial call**: initial attempt (1), first retry (2), second retry (3). After the third confirmed no-image failure, terminate that Task under the applicable terminal no-image state. Record generation-attempt and retry counts separately. Never retry after image receipt, while the outcome is unknown, or to circumvent policy or safety restrictions.

### UNKNOWN

If the Worker cannot reliably determine whether an image was generated, record `PROMPT_CONSUMED = UNKNOWN` and `PROMPT_STATE = UNKNOWN`:

- do not guess;
- do not retry that Task while the outcome is unknown;
- do not falsely mark the Task successful or failed;
- do not delete or overwrite evidence;
- preserve the applicable recovery state until evidence resolves the outcome;
- unrelated Tasks may continue only after the affected Task's known UNKNOWN state, available attempt/result evidence, attribution, and exact fixed execution input where applicable have been durably preserved and readback-verified, or a complete safe-recovery checkpoint has been written and verified; the next Task's own current authoritative records and complete locked Prompt must also be independently readable. Otherwise, pause progression for persistence recovery.

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

Drawing-stability requirements are enforced when designing and locking prompts; the Producer must use the already locked Prompt without revalidating or redesigning its content.

After successfully reading the complete Prompt, immediately prepare and submit the effective Task-specific generation instruction:

- FULL_LOCKED_PROMPT is the default.
- Only a concrete interface input limitation that prevents full submission permits one faithful AUTHORIZED_CONDENSED_PROMPT under GENERATION_WORKER_PROTOCOL.md Section 2B.

This preparation is part of the immediate handoff, not prompt revalidation or redesign.

Immediately invoke the generation interface after preparing the effective instruction. Do not insert additional content, metadata, Task-binding validation, prompt display, unrelated operations, or visual QA.

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

The affected Task must stop further generation and retain its unresolved recovery state. Never assume that no image exists or retry that Task while its result is unknown. Do not automatically stop or block unrelated Tasks: before advancing to another independent Task, durably preserve and readback-verify the affected Task's known UNKNOWN outcome classification, available attempt/result evidence, known Task/result attribution, and exact fixed execution input where applicable, or write and readback-verify a complete safe recovery checkpoint preserving those known facts and the exact input when applicable; proceed only if the next Task's current authoritative GitHub records and complete locked Prompt are independently readable and result-attribution/persistence safeguards remain reliable, and otherwise pause progression for evidence/persistence recovery rather than automatically escalating the Task-local issue to a Batch-wide stop. Escalate to a Batch-wide stop only for a verified non-isolatable Batch-wide access, identity/contract, prompt-mapping, result-attribution, or persistence-safety failure.

## 7. Daily generation limit

Daily generation limits count generation attempts, not only successful images.

When the platform explicitly reports quota exhaustion, record the confirmed no-image outcome and quota/rate-limit reason only if a generation attempt actually occurred and its no-image outcome is confirmed. Such an attempt counts toward the Task's three-attempt limit. Never bypass a quota, rate limit, or platform policy to retry. If a platform restriction blocks a call before it occurs, record the applicable policy interruption as a non-generation block. Do not count it as a generation attempt or confirmed no-image failure.

Use the existing Schema dispositions:
- PROMPT_SKIPPED_POLICY_LIMIT for applicable quota or policy-limit skips.
- STOPPED when execution is prohibited and the Task must terminate.

Record POLICY_BLOCKED or SAFETY_BLOCKED events as applicable.

PAUSED must not be used for quota exhaustion, rate limits, or safety/policy prohibitions.

Reserve PAUSED for:
1. Temporary pre-call inability to submit the exact prepared/fixed execution input, when the interruption is not a safety/policy prohibition.
2. Task-local fixed-input persistence recovery that prevents an otherwise permitted retry.

If an actual generation call occurs, record its observed outcome. A confirmed no-image result follows the existing retry policy, but retries must never bypass safety, quota, rate-limit, or platform restrictions.

Quota exhaustion is not a visual QA failure or a generation-quality judgment.

## 8. State protection

**Current Single-Producer standard:** GitHub is the authoritative reference and persistence database, not a Runtime Controller, Task Claim API, Lease API, or generation lock service. A GitHub-side Claim ID, Lease, or claim-state transition is **not** required to start generation.

1. Before reading a Task's locked Prompt, identify the eligible Task from the current authoritative Session/Batch and Task records. Do not infer Task identity or state from memory, a previous Worker summary, or guessed data.
2. Read the complete assigned locked Prompt from its current authoritative source.

   After successful reading, immediately prepare and submit the effective Task-specific generation instruction under Section 4 and GENERATION_WORKER_PROTOCOL.md Section 2B.

   FULL_LOCKED_PROMPT is the default. Authorized condensation is permitted only when a concrete interface input limitation prevents full submission.

   Immediately invoke the generation interface after preparation.

   Do not add Claim/Lease checks, metadata revalidation, content validation, Task-binding validation, another GitHub operation, or unrelated work between successful Prompt reading and generation.
3. After observing the generation result, record the actual image receipt/no-image/UNKNOWN facts and the associated Task evidence, using current GitHub state and appropriate concurrency safeguards for record updates. Write and read back to verify persistence. A conflicting write must be recovered, not treated as success or used to justify another generation call.
4. Isolate a Task-local record/persistence failure and preserve any confirmed image receipt. Another independent Task may continue only after the affected Task's known generation outcome, available result evidence and Task/result attribution, required attempt/prompt state, and exact fixed execution input where applicable have been durably saved and readback-verified, or a complete safe-recovery checkpoint preserving those known facts and exact fixed input where applicable has been written and readback-verified; the next Task's own current authoritative records and complete locked Prompt must also be independently readable with reliable identity, result-attribution, and persistence safeguards, and if the affected Task's required evidence cannot be safely preserved, progression must pause for persistence recovery rather than proceed from memory or narrative. Stop the Batch only for a verified non-isolatable Batch-wide access, identity/contract, prompt-mapping, result-attribution, or persistence-safety failure.

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

