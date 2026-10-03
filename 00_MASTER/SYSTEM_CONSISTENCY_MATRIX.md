# SYSTEM_CONSISTENCY_MATRIX.md — Canonical Architecture Consistency Rules

## Purpose

This file is the permanent cross-document consistency contract for the INARIA AI STUDIO platform.

It exists to prevent the architecture from drifting back into a LoRA-centric or duplicate-authority design.

It is a validation document, not a runtime state store.

## 1. Authority hierarchy

```
USER INTENT
    ↓
RUNTIME_STATE
    ↓
MODULE_REGISTRY
    ↓
AUTHORITY_MATRIX
    ↓
SELECTED MODULE PROTOCOL
    ↓
MODULE-OWNED GOAL / BATCH / QUEUE / TASK STATE
    ↓
WORKER EXECUTION
    ↓
RESULT
    ↓
QA / DOWNSTREAM
```

No lower layer may activate, override, or reinterpret a higher layer.

## 2. Canonical ownership

| Concern | Authority | Forbidden substitute |
|---|---|---|
| Current platform runtime | `00_MASTER/RUNTIME_STATE.md` | PROJECT_STATUS, Goal files, conversation memory |
| Module activation | `00_MASTER/MODULE_REGISTRY.md` + runtime state | Goal file, Worker command |
| Information ownership | `00_MASTER/AUTHORITY_MATRIX.md` | historical documents |
| Architecture | `00_MASTER/SYSTEM_ARCHITECTURE.md` | MASTER_DIRECTOR_CONTEXT alone |
| Module workflow | module protocol | another module's protocol |
| LoRA module status | `PRODUCTION/LORA_PROJECT_STATUS.md` | PRODUCTION_GOAL alone |
| LoRA Goal | applicable Goal file + LoRA module status | platform runtime |
| LoRA Queue | applicable Queue file | summary counters |
| Task ownership | current Task/Claim/Lease state | account identity |
| QA status | QA module state | generation SUCCESS |

## 3. Legacy boundary

`PROJECT_STATUS.md` is a legacy compatibility pointer.

It may be read for navigation/history, but it cannot:
- activate a module;
- activate a Goal;
- authorize a Claim;
- override Runtime State;
- define current Worker state.

Any operational document that requires `PROJECT_STATUS.md` as an authority is architecturally non-compliant.

## 4. Generic Worker command rule

Worker startup commands must not hard-code:
- a Goal ID;
- a Queue ID/path for one historical batch;
- a permanent account number;
- a fixed module unless the command explicitly declares itself module-specific.

The generic startup path is:

`START_HERE → SYSTEM_ARCHITECTURE → MODULE_REGISTRY → RUNTIME_STATE → AUTHORITY_MATRIX → ACTIVE MODULE`

## 5. Goal/Queue activation rule

A Goal or Queue is never self-activating.

For LoRA:

`RUNTIME_STATE`
→ `LORA_PRODUCTION = ACTIVE`
→ `LORA_PROJECT_STATUS = executable`
→ applicable Goal
→ applicable Queue

If LoRA is PAUSED, T109 may remain fully preserved but must remain non-executable.

## 6. Historical-state rule

Historical counters may be preserved for auditability.

Historical counters must be labeled as historical/module-state information and must not be presented as current platform runtime.

A summary mismatch does not authorize a Worker to guess.

## 7. Conflict rule

If two documents disagree about an execution-critical fact:

1. Resolve using the authority hierarchy.
2. Stop the affected execution path if safe state cannot be determined.
3. Update the authoritative documents.
4. Preserve historical records rather than rewriting them.
5. Re-validate all dependent pointers before resuming.

## 8. Required pointer invariant for an active LoRA workflow

When LoRA is ACTIVE, these must agree:

`RUNTIME_STATE`
→ LoRA ACTIVE

`LORA_PROJECT_STATUS`
→ executable Goal

`PRODUCTION_GOAL`
→ same active Goal

`IMAGE_QUEUE`
→ same active Goal / Queue

The old root `PROJECT_STATUS.md` is not part of this invariant.

## 9. Current repository validation state

As of 2026-10-03:

- Platform: ACTIVE
- Active workflow: FESTIVAL_WALLPAPER / MANUAL_DESIGN
- UNIVERSAL_WALLPAPER: ACTIVE
- FESTIVAL_WALLPAPER: ACTIVE
- LORA_PRODUCTION: PAUSED
- QA: PAUSED
- IMAGE_DELIVERY: PAUSED
- T109: PRESERVED / SUSPENDED / NOT EXECUTABLE
- No platform-wide Goal is active.

## 10. Maintenance rule

Whenever a new module or state layer is added:

1. Assign one canonical authority.
2. Register it in the Authority Matrix.
3. Register module activation in Module Registry and Runtime State.
4. Define its Goal/Batch/Queue/Task ownership.
5. Define recovery and QA handoff.
6. Add the relationship to this consistency matrix.
7. Never create a second current-state authority.

## Final invariant

> GitHub remembers the system, Runtime State selects what is executable, Modules own their workflows, Goals/Queues belong to their modules, Workers execute only legitimately claimed work, and historical documents never activate current execution.
