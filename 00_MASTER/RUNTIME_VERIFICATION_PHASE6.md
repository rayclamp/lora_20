# Runtime Verification Phase 6 — Canonical Context Resolver

## Status

**LEVEL_2_CANONICAL_CONTEXT_RESOLUTION**

This phase moves the runtime boundary from:

`Caller → Structured Context → Runtime Gate`

to:

`Canonical GitHub Rules → Context Resolver → Runtime Gate`

## Scope

Phase 6 verifies the executable control-plane can load and enforce canonical context rules without activating production Wallpaper Automation.

Included:
- canonical path registry routing;
- selected-module Reference Policy loading;
- reference authority resolution;
- Scene Intent protocol loading;
- explicit Scene Intent validation;
- deterministic Worker resolution interface with explicit provenance;
- blocked/missing context gates;
- trace persistence of canonical paths and provenance.

Excluded:
- real image generation;
- real image-provider integration;
- live System Automation activation;
- Make integration;
- LoRA activation;
- visual QA;
- automatic activation of any module.

## Canonical resolution order

`MODULE → CANONICAL_PATH_REGISTRY → MODULE REFERENCE POLICY + SCENE INTENT PROTOCOL → RESOLVE REFERENCE → RESOLVE SCENE INTENT → RUNTIME DESIGN GATE`

The resolver must not silently search obsolete paths or substitute another module's authority.

## Reference resolution

The resolver accepts only the states authorized by the selected module policy:
- `EXPLICIT_TASK_REFERENCE`
- `MODULE_APPROVED_REFERENCE`
- `NO_REFERENCE`
- `REFERENCE_BLOCKED`

The current repository has no active module-approved visual-reference registry, so a requested `MODULE_APPROVED_REFERENCE` is blocked as unavailable rather than fabricated.

When a reference is required but cannot be legally resolved, the resolver returns `REFERENCE_BLOCKED`.

## Scene Intent resolution

The canonical protocol requires:
- `ACTIVITY`
- `LOCATION`
- `ACTION`
- `TIME`
- `WEATHER`
- `SOCIAL_CONTEXT`
- `ENVIRONMENTAL_CUES`

Complete explicit fields resolve as `EXPLICIT`.

A deterministic resolver may be injected only when it is explicitly module-approved. Resolved values are marked `WORKER_RESOLVED`; they must never be presented as user-supplied.

Without an approved deterministic resolver, incomplete Scene Intent becomes `MISSING` and blocks design.

## Runtime integration

`ProductionWorkerRuntime` can receive `CanonicalContextResolver` through `contextResolver`.

When present, `designAndLockPrompt()` resolves canonical reference and Scene Intent context before the design gate. The persisted trace records:
- selected Reference Policy path;
- reference status/provenance/verification;
- Scene Intent protocol path;
- Scene Intent status/provenance;
- per-field provenance.

## Verification

`test_canonical_context_resolver.mjs` verifies resolver behavior in isolation.

`test_runtime_canonical_context.mjs` verifies end-to-end runtime integration:
1. canonical registry routing;
2. Universal Reference Policy resolution;
3. explicit Scene Intent resolution;
4. provenance trace persistence;
5. successful execution after canonical context validation;
6. reference blocking;
7. missing Scene Intent blocking.

## Non-claims

Phase 6 does **not** certify:
- production automation;
- live GitHub state mutation by an automation service;
- real image generation;
- visual correctness;
- automatic scene generation from arbitrary themes.

The runtime remains a verification control-plane, not a production Wallpaper Automation Engine.