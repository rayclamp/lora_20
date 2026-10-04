# PRODUCTION_DISPATCH_PROTOCOL.md — Shared Dispatch Boundary

## Purpose

Dispatch starts production. It does not define production rules and does not own task execution state.

## Modes

### MANUAL

`USER → CHATGPT WORKER → SHARED WORKER RUNTIME`

The user explicitly starts a Worker session. The Worker reads the current GitHub state, resolves the selected production module, claims work when required, shows the executable prompt, generates, records the result, and continues until a valid stop condition.

### AUTOMATED

`USER → AUTOMATION / MAKE → OPENAI WORKER → SHARED WORKER RUNTIME`

Automated Dispatch starts or coordinates Workers using the same production batch, task, Claim/Lease/CAS, generation, and recording contracts.

Automated Dispatch is an additional entry point. It must not create a second task authority, hidden queue, or duplicate Worker protocol.

## Dispatch must not

- activate a PAUSED module;
- invent tasks;
- bypass Claim/Lease/CAS;
- override Runtime State;
- replace canonical GitHub task state with local state;
- silently select another module;
- change a module's identity/reference rules.

## Phase compatibility

Phase 1 manual production remains valid after Automated Dispatch is added.

Phase 2 automation is an additive integration layer over the same Worker Runtime and production modules.

## Prompt visibility

Manual Dispatch requires interactive Prompt Preview before generation.

Automated Dispatch may use a persisted/auditable prompt-preview event when its contract does not provide an interactive user surface.

## Canonical principle

**Dispatch chooses who starts the work. The Worker Runtime defines how the work is executed. The Production Module defines what is produced.**
