# UNIVERSAL_WALLPAPER_FAILURE_RECOVERY_PROTOCOL.md

## Purpose

This is the canonical failure/recovery policy for Universal Wallpaper ChatGPT-as-Worker production.

It closes the Round 8 gap where `FAILED` existed as a result state but had no explicit retry, abandonment, or repeated-failure decision rule.

This protocol applies to Universal Wallpaper only. It does not activate paused modules and does not create a distributed runtime engine.

## 1. Core invariants

1. A failed generation does not increase `COMPLETED_COUNT`.
2. An UNKNOWN generation result is never silently retried.
3. A successful task is terminal and must not be regenerated under the same `IMAGE_ID`.
4. A retry of an explicitly FAILED task reuses the same `TASK_ID` and `IMAGE_ID`; it never creates a duplicate ID.
5. A replacement for an abandoned task requires a new legitimate task/design identity.
6. Every failure/recovery decision must be checkpointed in the canonical batch record before the Worker continues or stops.
7. Failure history must not be erased or rewritten to make a task appear successful.

## 2. Generation attempt fields

For every task that reaches generation, the task record must contain:

`GENERATION_ATTEMPT_COUNT:` non-negative integer

`CONSECUTIVE_FAILURE_COUNT:` non-negative integer

`RECOVERY_STATUS:` one of `NONE`, `RETRY_READY`, `RECOVERY_REQUIRED`, `ABANDONED`, `TERMINAL_SUCCESS`

`LAST_FAILURE_REASON:` `NONE` when no failure has occurred; otherwise a concise factual reason.

`EVENT_HISTORY:` append-only generation/recovery events for that task.

The event history records the event type, attempt number, result, and recovery decision. It must not be deleted when a later attempt succeeds.

## 3. FAILED result

When generation explicitly fails:

- set `GENERATION_RESULT: FAILED`;
- do not increment `COMPLETED_COUNT`;
- preserve the task's locked design and `IMAGE_ID`;
- increment `GENERATION_ATTEMPT_COUNT`;
- increment `CONSECUTIVE_FAILURE_COUNT`;
- set `RECOVERY_STATUS: RETRY_READY` unless the repeated-failure stop rule is reached;
- checkpoint the failure before another generation attempt.

A retry is a new generation attempt of the same task, not a new task. It reuses the same TASK_ID and IMAGE_ID.

A retry must reuse the authoritative design and executable prompt unless an explicit design update is committed before the retry.

## 4. Repeated-failure stop rule

If the same task reaches **3 consecutive FAILED generation attempts**:

- do not start a fourth attempt automatically;
- set `RECOVERY_STATUS: RECOVERY_REQUIRED`;
- set the session to `STOPPED`;
- use `STOP_REASON: REPEATED_FAILURE`;
- checkpoint the state;
- require explicit recovery/retry direction before another attempt.

A successful attempt resets `CONSECUTIVE_FAILURE_COUNT` to `0`.

The count is consecutive failures for the same task, not total failures across unrelated tasks.

## 5. UNKNOWN result

When the Worker cannot reliably determine whether generation produced a candidate:

- set `GENERATION_RESULT: UNKNOWN`;
- set `TASK_STATUS: UNKNOWN / RECOVERY_REQUIRED`;
- set `RECOVERY_STATUS: RECOVERY_REQUIRED`;
- set session `SESSION_STATUS: RECOVERY_REQUIRED`;
- set `STOP_REASON: UNKNOWN_RECOVERY_REQUIRED`;
- checkpoint immediately;
- STOP.

The Worker must not regenerate the task until the UNKNOWN event has been explicitly resolved.

If the existence of a candidate cannot be safely determined, the system must prefer possible duplication risk over silent regeneration.

## 6. Abandonment

A task may be abandoned only by an explicit user/operator decision or an explicit recovery decision permitted by this protocol.

When abandoned:

- set `TASK_STATUS: ABANDONED`;
- set `RECOVERY_STATUS: ABANDONED`;
- preserve the original `TASK_ID` / `IMAGE_ID`;
- do not count it as completed;
- do not silently reuse the abandoned identity for a different design;
- record the abandonment event and reason.

An abandoned task is terminal for that task identity.

If the batch still requires an image, a replacement must receive a new `TASK_ID` and `IMAGE_ID`, and the lineage must record which abandoned task it replaces.

## 7. SUCCESS is terminal

When a generation attempt explicitly returns one candidate:

- set `GENERATION_RESULT: SUCCESS`;
- set `TASK_STATUS: SUCCESS`;
- set `RECOVERY_STATUS: TERMINAL_SUCCESS`;
- set `CONSECUTIVE_FAILURE_COUNT: 0`;
- preserve the candidate;
- increment `COMPLETED_COUNT) exactly once;
- never regenerate the same completed task merely to improve quality.

A later command targeting the same completed `IMAGE_ID` must resolve to the existing successful task rather than creating another generation event.

## 8. Resume decision table

On resume, resolve the authoritative task state:

| State | Resume action |
|---|---|
| `NOT_STARTED` | continue design/execution |
| `DESIGN_READY` / `DESIGN_LOCKED` | continue authoritative task |
| `FAILED + RETRY_READY` | retry same task identity |
| `FAILED + RECOVERY_REQUIRED` | STOP until explicit recovery direction |
| `UNKNOWN / RECOVERY_REQUIRED` | STOP; resolve UNKNOWN first |
| `ABANDONED` | do not reuse; create legitimate replacement if batch still needs coverage |
| `SUCCESS` | do not regenerate; advance to next valid task |
| `OUTPUT_COUNT_MISMATCH` | STOP/review |
| `INVALID_IMAGE_ID` | STOP |

## 9. No silent history rewrite

Recovery must append an event rather than replacing the historical record.

Minimum event vocabulary:

- `GENERATION_FAILED`
- `RETRY_AUTHORIZED`
- `GENERATION_UNKNOWN`
- `RECOVERY_REQUIRED`
- `TASK_ABANDONED`
- `GENERATION_SUCCESS`
- `REPLACEMENT_TASK_CREATED`

## 10. Boundary

This protocol does not provide:

- automatic retries;
- distributed locking;
- Claim/Lease/CAS;
- automatic scheduler;
- quota discovery;
- ComfyUI execution;
- visual QA.

Those remain separate future capabilities.

## 11. Universal principle

**FAILED may retry under explicit rules. UNKNOWN must stop. Three consecutive failures require recovery. ABANDONED identities are never silently reused. SUCCESS is terminal.**
