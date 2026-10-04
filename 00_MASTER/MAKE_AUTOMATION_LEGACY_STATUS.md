# MAKE_AUTOMATION_LEGACY_STATUS.md — Legacy Automation Boundary

## Status
The currently discovered Make Lora20 departmental scenarios are LEGACY / PAUSED / NON-AUTHORITATIVE until migrated to the current shared Worker Runtime contract.

Known legacy pattern:
DIRECTOR → CHARACTER / CLOTHING / SCENE / POSE_CAMERA / PROMPT departmental workers

This pattern must not be treated as the current production architecture.

## Current architecture
SYSTEM AUTOMATION → PRODUCTION_DISPATCH → SHARED PRODUCTION WORKER RUNTIME → PRODUCTION MODULE

System Automation is an internal system capability and must be completed and validated independently before any external automation provider is introduced.

## Make boundary
MAKE ≠ SYSTEM AUTOMATION.

Make is a future external integration/provider layer. It is not part of the current production core, not required for current Automation testing, and must remain PAUSED / NON-AUTHORITATIVE until a separate integration design and migration are approved.

No current System Automation test may require Make execution, Make telemetry, Make scenario activation, or Make-specific runtime state.

## Reactivation rule
A legacy Make scenario must not be reactivated for production until it satisfies the current Automation Execution Contract, Canonical Path Registry, Scene Intent Resolution Protocol, reference authority rules, design-validation gate, prompt integrity gate, output/result semantics, checkpoint and continuation rules, and terminal/recovery rules.

## No silent dual architecture
Legacy scenarios may remain useful for development or testing, but must be explicitly labeled LEGACY and must not write authoritative production state unless they pass the current dispatch/runtime contract.
