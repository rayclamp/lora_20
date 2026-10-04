# AUTOMATION_EXECUTION_CONTRACT.md — System Automation Contract

## Purpose

This is the canonical contract for the internal automated Wallpaper Production entry path.

System Automation is a first-class production capability for:
- UNIVERSAL_WALLPAPER
- FESTIVAL_WALLPAPER

It feeds the shared Production Worker Runtime. It must not create a second production execution architecture.

## Automation domain boundary

System Automation is a Wallpaper Production capability, not a universal controller for every module in the repository.

The Automation Engine may resolve and dispatch only modules explicitly declared in the Automation Scope above.

Any module, data domain, reference authority, state authority, QA flow, delivery flow, or integration not explicitly listed in the Automation Scope is outside this contract and must not be resolved, imported, or executed by the Automation Engine.

A shared Worker Runtime does not grant Automation authority over every module that happens to use that runtime.

## Reference authority boundary

Reference resolution is **module-owned and policy-driven**.

The Automation Engine must resolve the selected module's canonical Reference Policy before resolving any visual person reference.

For Wallpaper Production:
- UNIVERSAL_WALLPAPER owns `MODULES/UNIVERSAL_WALLPAPER/REFERENCE_POLICY.md`.
- FESTIVAL_WALLPAPER owns `MODULES/FESTIVAL_WALLPAPER/REFERENCE_POLICY.md`.

The selected module's Reference Policy is the only authority that may declare an allowed visual reference source.

The Inaria Character Specification at `00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md` is a character-semantic authority. It is **not** a visual reference authority.

Automation must not name, discover, or depend on a reference asset owned by an unrelated production domain.

Automation must never substitute another domain's reference because the character name is the same.

If the selected module cannot legally resolve its reference authority, execution must stop with a context/reference failure.

## Required trace identity

Every automated production invocation must carry or create:
- TRACE_RUN_ID
- AUTOMATION_RUN_ID when exposed by the runtime
- AUTOMATION_PLATFORM when applicable
- INPUT_PAYLOAD_HASH when hashing is supported
- CONTRACT_VERSION

If a runtime field is not observable, record NOT_OBSERVABLE; never invent a value.

## Production request

The automation request must preserve the fields required by the selected Wallpaper Module, including:
- MODULE
- PRODUCTION_TYPE
- CHARACTER
- IMAGE_COUNT / TARGET_COUNT
- OUTPUT_TYPE
- THEME / FESTIVAL_SCOPE
- SCENE
- SEASON
- WEATHER
- TIME
- PET_ALLOWED

Reference information must be expressed only through the selected module's Reference Policy. A request must not contain or inject a path owned by an unrelated domain.

ASPECT_RATIO and ORIENTATION are technical fields derived by the Worker from the locked OUTPUT_TYPE.

## Structured design context

When known upstream, Automation may provide:
- ACTIVITY
- LOCATION
- ACTION
- SOCIAL_CONTEXT
- ENVIRONMENTAL_CUES

When absent, the Worker must invoke the Scene Intent Resolution Protocol rather than silently guessing during prompt assembly.

## Context provenance

Design-critical fields should carry provenance:
- AUTOMATION_INPUT
- USER_INPUT
- WORKER_RESOLVED
- RULE_DEFAULT
- NOT_OBSERVABLE

Reference provenance must additionally identify the module-owned Reference Policy resolution state.

## Rule loading

The automated Worker must resolve rules through the Canonical Path Registry.

A missing canonical rule is a context-load failure and blocks execution.

The Worker must not silently fall back to an obsolete path, copied rule from another domain, or conversational memory.

## Required execution trace

The automated Wallpaper path should record these ordered events when observable:
1. AUTOMATION_REQUEST_RECEIVED
2. CONTEXT_LOADED
3. MODULE_RESOLVED
4. REFERENCE_POLICY_LOADED
5. REFERENCE_AUTHORITY_RESOLVED
6. SCENE_INTENT_RESOLVED
7. PRESENTATION_DESIGNED
8. DESIGN_VALIDATED
9. PROMPT_ASSEMBLED
10. PROMPT_PREVIEW_RECORDED
11. GENERATION_EXECUTION
12. GENERATION_RESULT
13. CHECKPOINT
14. NEXT_TASK_RESOLVED / SESSION_TERMINATED

## Prompt integrity

For automated dispatch, Prompt Preview may be satisfied by a persisted audit/event record when the selected automated contract permits non-interactive execution.

The exact locked prompt must be associated with the execution event when observable. If it is not observable, record EXECUTION_VERIFICATION_STATUS: NOT_OBSERVABLE.

## No false observability

Never invent automation run IDs, execution IDs, prompt hashes, executed prompt payloads, provider telemetry, or quota errors.

## Manual/Automated equivalence

MANUAL and AUTOMATED must converge at:

DISPATCH → SHARED WORKER RUNTIME → SELECTED WALLPAPER MODULE

Automation may change triggering and audit mechanics. It may not bypass module routing, module-owned Reference Policy, Scene Intent Resolution, design validation, format lock, prompt integrity, result semantics, checkpointing, or continuation/termination rules.

## External integration boundary

External automation services are optional integration adapters outside this contract.

They are not required for System Automation, do not define its runtime semantics, and do not own production authority.

No external provider-specific knowledge belongs in the System Automation execution path.
