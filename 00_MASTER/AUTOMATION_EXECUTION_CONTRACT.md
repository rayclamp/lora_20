# AUTOMATION_EXECUTION_CONTRACT.md — Automated Dispatch Contract

## Purpose
This is the canonical contract for external automation layers such as Make.
Automated Dispatch is an entry mode into the shared Production Worker Runtime. It must not create a second production execution architecture.

## Required trace identity
Every automated production invocation must carry or create:
- TRACE_RUN_ID
- AUTOMATION_RUN_ID when the automation platform exposes one
- AUTOMATION_PLATFORM
- INPUT_PAYLOAD_HASH when hashing is supported
- CONTRACT_VERSION
If an automation platform does not expose a field, record NOT_OBSERVABLE; never invent a value.

## Production request
The automation request must preserve MODULE, PRODUCTION_TYPE, CHARACTER, IMAGE_COUNT / TARGET_COUNT, OUTPUT_TYPE, THEME / FESTIVAL_SCOPE, SCENE, SEASON, WEATHER, TIME, PET_ALLOWED, and REFERENCE_IMAGE.
ASPECT_RATIO and ORIENTATION are technical fields derived by the Worker.

## Structured design context
When known upstream, Automation should provide ACTIVITY, LOCATION, ACTION, SOCIAL_CONTEXT, and ENVIRONMENTAL_CUES.
When absent, the Worker must invoke the Scene Intent Resolution Protocol rather than silently guessing during prompt assembly.

## Context provenance
Design-critical fields should carry provenance: AUTOMATION_INPUT, USER_INPUT, WORKER_RESOLVED, RULE_DEFAULT, or NOT_OBSERVABLE.

## Rule loading
The automated Worker must resolve rules through the Canonical Path Registry. A missing canonical rule is a context-load failure and blocks execution.
The Worker must not silently fall back to an obsolete path, copied rule, or conversational memory.

## Required execution trace
The automated path should record these ordered events when observable:
1. AUTOMATION_REQUEST_RECEIVED
2. CONTEXT_LOADED
3. REFERENCE_RESOLVED
4. SCENE_INTENT_RESOLVED
5. PRESENTATION_DESIGNED
6. DESIGN_VALIDATED
7. PROMPT_ASSEMBLED
8. PROMPT_PREVIEW_RECORDED
9. GENERATION_EXECUTION
10. GENERATION_RESULT
11. CHECKPOINT
12. NEXT_TASK_RESOLVED / SESSION_TERMINATED

## Prompt integrity
For automated dispatch, Prompt Preview may be satisfied by a persisted audit/event record when the selected automated contract permits non-interactive execution.
The exact locked prompt must be associated with the execution event when the platform exposes it. If it does not, record EXECUTION_VERIFICATION_STATUS: NOT_OBSERVABLE.

## No false observability
Never invent automation run IDs, execution IDs, prompt hashes, platform quota errors, or executed prompt payloads.

## Manual/Automated equivalence
MANUAL and AUTOMATED must converge at DISPATCH → SHARED WORKER RUNTIME → MODULE.
Automation may change triggering and audit mechanics. It may not bypass module routing, reference authority, Scene Intent Resolution, design validation, format lock, prompt integrity, result semantics, checkpointing, or continuation/termination rules.
