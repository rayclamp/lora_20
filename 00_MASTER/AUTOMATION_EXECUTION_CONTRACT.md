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

Reference resolution is module-owned.

Automation must not name, discover, or depend on a reference asset owned by an unrelated production domain.

For Wallpaper Production, the selected Wallpaper Module owns the applicable Character / Reference Authority. A reference may be:
- explicitly supplied by the user;
- resolved from the selected Wallpaper Module's canonical reference policy;
- resolved by an approved module-specific rule.

If the selected module cannot legally resolve its reference authority, execution must stop with a context/reference failure.

Automation must never substitute another domain's reference because the character name is the same.

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

Reference information must be expressed through the selected module's reference policy. It must not contain or imply a LoRA-specific reference path.

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

## Rule loading

The automated Worker must resolve rules through the Canonical Path Registry.

A missing canonical rule is a context-load failure and blocks execution.

The Worker must not silently fall back to an obsolete path, copied rule from another domain, or conversational memory.

## Required execution trace

The automated Wallpaper path should record these ordered events when observable:
1. AUTOMATION_REQUEST_RECEIVED
2. CONTEXT_LOADED
3. MODULE_RESOLVED
4. REFERENCE_AUTHORITY_RESOLVED
5. SCENE_INTENT_RESOLVED
6. PRESENTATION_DESIGNED
7. DESIGN_VALIDATED
8. PROMPT_ASSEMBLED
9. PROMPT_PREVIEW_RECORDED
10. GENERATION_EXECUTION
11. GENERATION_RESULT
12. CHECKPOINT
13. NEXT_TASK_RESOLVED / SESSION_TERMINATED

## Prompt integrity

For automated dispatch, Prompt Preview may be satisfied by a persisted audit/event record when the selected automated contract permits non-interactive execution.

The exact locked prompt must be associated with the execution event when observable. If it is not observable, record EXECUTION_VERIFICATION_STATUS: NOT_OBSERVABLE.

## No false observability

Never invent automation run IDs, execution IDs, prompt hashes, executed prompt payloads, provider telemetry, or quota errors.

## Manual/Automated equivalence

MANUAL and AUTOMATED must converge at:

DISPATCH → SHARED WORKER RUNTIME → SELECTED WALLPAPER MODULE

Automation may change triggering and audit mechanics. It may not bypass module routing, module-owned reference authority, Scene Intent Resolution, design validation, format lock, prompt integrity, result semantics, checkpointing, or continuation/termination rules.

## External integration boundary

External automation services are optional integration adapters outside this contract.

They are not required for System Automation, do not define its runtime semantics, and do not own production authority.

No external provider-specific knowledge belongs in the System Automation execution path.
