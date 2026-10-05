# FINAL_PROMPT_EXECUTION_LOCK_PROTOCOL.md

## Purpose

The system-generated final executable Prompt is an immutable execution artifact.

## Core invariant

`FINAL_EXECUTION_PROMPT = LOCKED_EXECUTION_PROMPT = EXECUTED_PROMPT`

After `PROMPT_LOCK`, a Worker MUST execute that locked Prompt and MUST NOT reconstruct or mutate it.

## Lifecycle

`DESIGN → BUILD FINAL_EXECUTION_PROMPT → VALIDATE → PROMPT_LOCK → PREVIEW/AUDIT → EXECUTE LOCKED PROMPT → VERIFY → RECORD`

Any Prompt revision after lock invalidates the old lock and requires a new validation, lock, and preview/audit cycle.

## Generation gate

Generation is forbidden unless the final Prompt is validated, `PROMPT_LOCK_STATUS: LOCKED`, and the generation call receives that locked Prompt artifact.

A generation adapter may wrap the Prompt in a structured request, but must not rewrite the Prompt payload.

## Execution integrity

When execution telemetry is available, compare the executed Prompt with the locked Prompt: `VERIFIED`, `MISMATCH`, or `UNKNOWN`.

If the platform does not expose the executed Prompt payload, record `NOT_OBSERVABLE`; never fabricate proof.

An observable mismatch MUST NOT be recorded as normal task SUCCESS.

## Separation

This protocol verifies that the intended Prompt was executed. It does not determine whether the image model visually obeyed the Prompt. Visual adherence is a separate post-generation control.

## Universal rule

**The final Prompt is an execution artifact, not a suggestion.**
