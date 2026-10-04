# PRODUCTION_DISPATCH_PROTOCOL.md — Shared Dispatch Boundary

## Purpose

Dispatch starts production. It does not define production rules and does not own task execution state.

## Modes

### MANUAL

`USER → CHATGPT WORKER → SHARED WORKER RUNTIME`

The user explicitly starts a Worker session. The Worker reads the current GitHub state, resolves the selected production module, claims work when required, shows the executable prompt, generates, records the result, and continues until a valid stop condition.

### AUTOMATED

`SYSTEM AUTOMATION ENGINE → PRODUCTION DISPATCH → SHARED PRODUCTION WORKER RUNTIME`

System Automation is a first-class internal execution capability for the Wallpaper Production domain.

Automated Dispatch is an additional entry point into the shared production core. It must not create a second task authority, hidden queue, or duplicate Worker protocol.

Automated Dispatch may resolve only modules declared eligible by the System Automation Contract and Module Registry.

## Dispatch must not

- activate a PAUSED module;
- invent tasks;
- bypass Claim/Lease/CAS;
- override Runtime State;
- replace canonical GitHub task state with local state;
- silently select another module;
- change a module's identity/reference rules;
- route an Automation request into an out-of-scope production domain.

## Phase compatibility

Phase 1 manual production remains valid after Automated Dispatch is added.

Automated Dispatch is an additive entry layer over the same Worker Runtime and approved production modules.

## Prompt visibility

Manual Dispatch requires interactive Prompt Preview before generation.

Automated Dispatch may use a persisted/auditable prompt-preview event when its contract does not provide an interactive user surface.

## Canonical principle

**Dispatch chooses who starts the work. The Worker Runtime defines how the work is executed. The Production Module defines what is produced. Automation Scope defines which modules Automated Dispatch is allowed to enter.**
