# PRODUCTION_DISPATCH_PROTOCOL.md — Shared Dispatch Boundary

## Purpose

Dispatch selects the execution-control entry path. It does not define production content rules and does not own task execution state.

For the Image Production System, both MANUAL and AUTOMATED entry paths receive a user/image requirement and converge on system-owned image design and Prompt construction. The distinction is whether generation waits for explicit user confirmation or proceeds through the approved automated execution path.

## Modes

### MANUAL

`USER → CHATGPT WORKER → SHARED WORKER RUNTIME`

The user explicitly starts an Image Production session. The Worker reads the current GitHub state, resolves the selected production module, claims work when required, designs the image, constructs and validates the executable Prompt, shows the design/Prompt, and waits for explicit user generation confirmation. Only after confirmation does it generate, record the result, and continue until a valid stop condition.

### AUTOMATED

`SYSTEM AUTOMATION ENGINE → PRODUCTION DISPATCH → SHARED PRODUCTION WORKER RUNTIME`

System Automation is a first-class internal execution capability for the Wallpaper Production domain.

Automated Dispatch is an additional entry point into the shared production core. It must not create a second task authority, hidden queue, or duplicate Worker protocol.

Automated Dispatch may resolve only modules declared eligible by the System Automation Contract and Module Registry.

Before reference resolution, Automated Dispatch must ensure the selected Wallpaper Module's canonical Reference Policy has been loaded. Dispatch must never resolve a visual reference itself or substitute a reference from another module.

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

Manual Dispatch requires interactive Prompt Preview before generation and explicit user generation confirmation after the system has designed and validated the Prompt.

A user-provided image requirement is sufficient; a user-authored Prompt is not required.

Automated Dispatch may use a persisted/auditable prompt-preview event when its contract does not provide an interactive user surface. It still must use system-owned design and Prompt construction.

## Canonical principle

**Dispatch chooses who starts the work. The Worker Runtime defines how the work is executed. The Production Module defines what is produced. Automation Scope defines which modules Automated Dispatch is allowed to enter.**
