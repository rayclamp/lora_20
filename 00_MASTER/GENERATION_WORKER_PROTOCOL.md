# GENERATION_WORKER_PROTOCOL.md — Generic Generation Worker

## Scope
Cross-module production execution only. This is the shared Worker contract for every production module. This document does not define character, age, style, reference, dataset, wallpaper, festival, account, or QA authority.

## Shared runtime authority

This Worker delegates generic execution to `00_MASTER/PRODUCTION_WORKER_RUNTIME.md`. Module-specific protocols define only domain behavior. No production module may create a duplicate Worker or Dispatch implementation.

## Startup
1. START_HERE.md
2. 00_MASTER/SYSTEM_ARCHITECTURE.md
3. 00_MASTER/MODULE_REGISTRY.md
4. 00_MASTER/RUNTIME_STATE.md
5. 00_MASTER/AUTHORITY_MATRIX.md
6. CORE drawing/anatomy/safety documents
7. selected module protocol
8. selected module state

## Module isolation
Resolve the active module from Runtime State. Do not assume LoRA or Wallpaper. Do not import another module's reference, queue, prompt, or rules.

## Queue execution
When the module uses a queue: fetch current state, verify the parent module is ACTIVE, claim one valid QUEUED task atomically using the selected module's canonical Claim/Lease/Concurrency protocol, verify ownership, enter generation state, generate, record SUCCESS/FAILED/UNKNOWN, then release according to module rules.

## Pre-generation
Apply DRAWING_INSTRUCTIONS.md and ANATOMY_STABILITY.md. Prefer stable hands/feet, natural proportions, clear limb sources, physical object contact, and simple support before decorative complexity. Verify `PROMPT_LOCK_STATUS: LOCKED` and execute the task's `FINAL_EXECUTABLE_PROMPT` exactly. Do not reconstruct or mutate the Prompt from the design record after lock.

## Prompt execution integrity
When execution telemetry is available, compare the executed Prompt with the locked Prompt and record `VERIFIED` or `MISMATCH`. If the platform does not expose the executed Prompt payload, record `NOT_OBSERVABLE`. An observable mismatch is an execution-integrity failure and must not be normal task SUCCESS.

## Outcomes
SUCCESS / FAILED / UNKNOWN only. UNKNOWN requires recovery and must not be guessed or automatically regenerated.

## Post-generation
After SUCCESS: preserve the candidate, record success, do not self-QA, do not declare PASS/REPAIR/REJECT, and continue only when the selected module authorizes another task.

## Restrictions
Do not activate modules, change Goal targets without authorization, overwrite valid claims, continue after lease expiry, bypass a module's Claim/Lease/Concurrency protocol, import another module's rules, invent missing state, or use superseded project specifications.

### Cross-module isolation
A generic Worker is module-neutral. It must not import another module's reference, queue, prompt, rules, Goal, Batch, Task, Worker state, identity authority, dataset authority, or QA authority.
Do not import another module's rules, state, identity authority, dataset authority, or QA authority. It may only load the protocol and state belonging to the currently resolved active module.

## Final Execution Context Requirement

Before generation, the Worker must have both:
- PROMPT_LOCK_STATUS: LOCKED;
- a valid locked execution context with a matching execution-context hash.

The execution context includes reference authority/IDs, model identity/version, output type, aspect ratio, generation parameters, and provider parameters.

The provider adapter must receive the exact locked Prompt and exact locked execution context. It must not infer missing values or silently substitute provider defaults.

When execution-context telemetry is available, the runtime must compare it against the locked context. MISMATCH is not normal task SUCCESS. When telemetry is unavailable, record NOT_OBSERVABLE.
