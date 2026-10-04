# LORA_ACTIVATION_READINESS.md

## Status

**HOLD — LoRA Production remains PAUSED**

This document is the activation gate for `LORA_PRODUCTION`.

The LoRA module may be structurally ready for future execution, but it must **not** be activated until the Make automation phase is completed and verified.

## Current state

- `MODULES/LORA_PRODUCTION/` exists as an isolated Production Module.
- Shared Production Worker Runtime is available.
- Shared Dispatch boundary supports Manual and Automated modes.
- LoRA does not own a duplicate Worker, Dispatch, Claim/Lease/CAS, or scheduler.
- LoRA canonical batch state is module-owned.
- LoRA-specific identity, dataset, production, and QA rules are isolated.
- GitHub image-artifact persistence is treated as shared Output/Persistence behavior.
- `LORA_PRODUCTION` remains `PAUSED` in both `MODULE_REGISTRY.md` and `RUNTIME_STATE.md`.

## Activation gates

All gates below must be satisfied before activation.

### Gate 1 — Core architecture

**PASS**

The shared Production Core is architecture-locked:

`DISPATCH → SHARED WORKER RUNTIME → PRODUCTION MODULE → MODULE-OWNED STATE → RESULT / OUTPUT → QA`

LoRA must continue using the existing shared runtime.

### Gate 2 — LoRA module isolation

**PASS**

LoRA owns:
- age-20 identity/reference;
- LoRA style/reference baseline;
- dataset composition and diversity;
- candidate rules;
- production requirements;
- LoRA batch state;
- LoRA QA profile.

LoRA must not create a second Worker/Dispatch architecture.

### Gate 3 — Age-20 reference registration

**BLOCKED**

`MODULES/LORA_PRODUCTION/IDENTITY/CHARACTER_REFERENCE.md` currently requires an approved age-20 reference asset but does not yet contain a registered repository path/version.

Before activation, the exact approved age-20 reference asset must be registered.

### Gate 4 — Production Goal / Batch

**BLOCKED BY ACTIVATION STATE**

No executable LoRA Goal, Queue, or Batch exists while the module is PAUSED.

After the activation decision is made, a current Goal and Batch must be created under:

`MODULES/LORA_PRODUCTION/BATCHES/`

A Goal/Queue/Task must never activate the parent module.

### Gate 5 — Make Automated Dispatch

**BLOCKED — REQUIRED USER GATE**

The Make automation must be completed before LoRA activation.

Required outcome:

`USER → MAKE → OPENAI WORKER → SHARED WORKER RUNTIME`

The automation must use the same canonical production state and ownership contracts as Manual Dispatch.

It must not create:
- a second Worker protocol;
- a hidden queue;
- a second task authority;
- a separate Claim/Lease/CAS system;
- a second production core.

### Gate 6 — GitHub image-artifact output

**BLOCKED UNTIL MAKE INTEGRATION IS VERIFIED**

The LoRA workflow requires generated image artifacts to be persisted to GitHub.

The implementation must use the shared Output/Persistence contract:

`GENERATION SUCCESS → IMAGE ARTIFACT → GITHUB`

The artifact upload must be verified for:
- source artifact;
- destination path;
- naming;
- idempotency;
- success/failure handling;
- retry/recovery;
- authorization;
- artifact record ownership.

### Gate 7 — QA boundary

**PASS — ACTIVATION STILL BLOCKED**

LoRA QA remains an independent downstream acceptance profile.

Generation `SUCCESS` is not `QA PASS`.

Global QA remains `PAUSED` until separately activated.

## Activation decision rule

LoRA may move from `PAUSED` to `ACTIVE` only when:

1. Make automation is completed;
2. Make/OpenAI execution is verified against the shared Production Core;
3. GitHub image-artifact upload is verified;
4. the approved age-20 reference is registered;
5. a current LoRA Goal/Batch is ready;
6. `MODULE_REGISTRY.md` and `RUNTIME_STATE.md` are changed together;
7. architecture validation and LoRA readiness self-test pass.

Until all conditions are satisfied:

**DO NOT ACTIVATE `LORA_PRODUCTION`.**

## Important boundary

This readiness audit does **not** authorize LoRA production.

It is a pre-activation gate only.

Manual Dispatch remains architecturally valid, but the user has explicitly selected Make completion as a prerequisite for LoRA activation.

**Current decision: HOLD.**