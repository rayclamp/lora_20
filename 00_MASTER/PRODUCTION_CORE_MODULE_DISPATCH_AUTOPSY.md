# PRODUCTION_CORE_MODULE_DISPATCH_AUTOPSY.md

## Status

AUTOPSY COMPLETE — REFACTOR PROPOSED / IMPLEMENTED ON BRANCH

## Scope

Audit the boundary between:

1. shared Production Core;
2. Production Modules;
3. Manual / Automated Dispatch;
4. Worker Runtime;
5. Output / Persistence;
6. QA.

## Finding 1 — LoRA was over-isolated

Current LoRA files correctly contain LoRA-specific identity, dataset, production, batch, and QA concerns. However, `MODULES/LORA_PRODUCTION/PRODUCTION/WORKER_PROTOCOL.md` duplicated shared Worker execution responsibilities:

- resolve queue;
- claim;
- verify lease;
- generate;
- record outcomes;
- release;
- continue.

These are not uniquely LoRA behaviors.

### Decision

Keep `LORA_PRODUCTION` as a production module, but make the shared Worker Runtime authoritative for those execution mechanics.

LoRA retains only:
- age-20 identity/reference;
- dataset rules;
- LoRA composition/diversity;
- LoRA-specific task requirements;
- LoRA QA profile;
- LoRA-specific output requirement.

## Finding 2 — Festival and LoRA have the same production-layer role

Festival design data and LoRA dataset data are different domains, but both are content rules consumed by the same Worker Runtime.

The correct abstraction is:

`Production Module = WHAT`

`Worker Runtime = HOW`

Festival must not acquire a separate Worker/Dispatch system merely because its cultural data is different.

## Finding 3 — Universal Wallpaper currently owns a large Worker protocol

`00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md` contains valuable wallpaper-specific requirements, but it also contains generic Worker mechanics.

The generic mechanics should be interpreted as delegated to `PRODUCTION_WORKER_RUNTIME.md`.

The Universal protocol remains the domain adapter for:
- wallpaper type;
- reference-image handling;
- composition;
- pet permission;
- wallpaper task integrity;
- prompt-preview requirement;
- wallpaper-specific failure/recovery.

The Claim/Lease/CAS and Worker Pool contracts remain shared infrastructure and should not become Universal-only concepts.

## Finding 4 — Dispatch is currently implicit

Manual Worker execution exists, and Round 11 defines Worker Pool coordination, but the repository did not have one explicit canonical Dispatch boundary.

This caused manual execution and future Make automation to appear as separate systems.

### Decision

Add `PRODUCTION_DISPATCH_PROTOCOL.md`.

Manual and Automated Dispatch are entry modes into the same Worker Runtime.

## Finding 5 — GitHub upload was at risk of becoming a LoRA-only system

`IMAGE_DELIVERY` is currently modeled as an independent downstream module, while the planned LoRA flow requires image artifacts to be uploaded to GitHub.

These are not necessarily the same concern.

### Decision

Separate:
- canonical generation-result recording;
- image artifact persistence.

Use `PRODUCTION_OUTPUT_PROTOCOL.md` as the shared output boundary.

A GitHub artifact upload is an Output Adapter capability. LoRA may require it without owning a duplicate Worker or Dispatch stack.

## Finding 6 — QA remains downstream

QA correctly remains independent.

Production SUCCESS means generation succeeded.

QA decides PASS / REVIEW / REPAIR / REJECT later.

No refactor changes this boundary.

## Target architecture

```
INARIA PRODUCTION CORE
├── CORE RULES
├── DISPATCH
│   ├── MANUAL
│   └── AUTOMATED
├── SHARED WORKER RUNTIME
│   ├── Scheduler / selection
│   ├── Claim / Lease / CAS
│   ├── Generation
│   ├── Recording
│   └── Recovery
├── PRODUCTION MODULES
│   ├── LORA_PRODUCTION
│   ├── FESTIVAL_WALLPAPER
│   └── UNIVERSAL_WALLPAPER
├── OUTPUT / PERSISTENCE
│   ├── Result Record
│   └── Artifact Adapters
└── QA / DOWNSTREAM
```

## Invariants

1. One Worker Runtime.
2. One Claim/Lease/CAS authority.
3. One canonical task-state authority per production module.
4. Module-specific references remain isolated.
5. Manual Dispatch remains executable after automation is added.
6. Automated Dispatch cannot create a second production core.
7. GitHub image upload does not create a LoRA-specific Worker system.
8. Generation SUCCESS is not QA PASS.
9. UNKNOWN is never silently retried.
10. A module cannot activate itself through its Goal/Queue/Task.
