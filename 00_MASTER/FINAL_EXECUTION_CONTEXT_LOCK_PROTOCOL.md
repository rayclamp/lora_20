# FINAL_EXECUTION_CONTEXT_LOCK_PROTOCOL.md — Final Execution Context Lock

## Purpose

The Final Prompt Execution Lock guarantees that the exact Worker-generated Prompt is executed. This protocol extends that guarantee to the generation context that can materially change provider behavior.

## Core invariant

`LOCKED_EXECUTION_CONTEXT = EXECUTED_EXECUTION_CONTEXT`

The generation adapter must receive the exact immutable execution context recorded by the Worker.

## Required context envelope

The locked context must explicitly record:

- `REFERENCE_AUTHORITY`
- `REFERENCE_IDS`
- `MODEL_ID`
- `MODEL_VERSION`
- `OUTPUT_TYPE`
- `ASPECT_RATIO`
- `GENERATION_PARAMETERS`
- `PROVIDER_PARAMETERS`

Unknown or unavailable values must be recorded as `NOT_OBSERVABLE` or `NOT_PROVIDED`; they must never be silently inferred.

## Lock lifecycle

`DESIGN → BUILD PROMPT + EXECUTION CONTEXT → VALIDATE → PROMPT LOCK + CONTEXT LOCK → PREVIEW/AUDIT → EXECUTE LOCKED ARTIFACTS → VERIFY → RECORD`

After context lock:

1. Worker MUST NOT silently mutate the locked context.
2. Adapter MUST NOT reconstruct missing context from defaults.
3. Provider transport MUST receive the locked context unchanged.
4. A context revision invalidates the previous lock and requires re-validation and re-locking.
5. Provider telemetry, when exposed, must be compared with the locked context. When unavailable, record `NOT_OBSERVABLE`.

## Integrity result

The execution record must distinguish:

- `VERIFIED` — provider telemetry proves the executed context matches the locked context.
- `MISMATCH` — observable execution context differs from the locked context.
- `NOT_OBSERVABLE` — the provider does not expose enough telemetry to compare.

An observable context mismatch is not a normal task SUCCESS.

## Boundary

This protocol verifies execution-context integrity. It does not verify whether the generated image visually follows the requested design. Visual Design Adherence remains a separate production-layer gate.
