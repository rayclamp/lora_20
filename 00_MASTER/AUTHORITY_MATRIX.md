# AUTHORITY_MATRIX.md — Canonical Information Ownership

## Purpose

This document defines **which file owns which kind of information**.

The repository may contain historical copies, reports, handoffs, examples, or module-specific projections. Those documents must not become competing authorities.

If two documents disagree, use the authority assigned below.

## Canonical authority matrix

| Information | Canonical authority |
|---|---|
| High-level system architecture | `00_MASTER/SYSTEM_ARCHITECTURE.md` |
| Module list and module activation status | `00_MASTER/MODULE_REGISTRY.md` |
| Current platform runtime state | `00_MASTER/RUNTIME_STATE.md` |
| Information ownership / authority mapping | `00_MASTER/AUTHORITY_MATRIX.md` |
| Shared CORE rules | `00_MASTER/CORE_RULES.md` and its registered CORE documents |
| Universal drawing stability | `00_MASTER/DRAWING_INSTRUCTIONS.md` |
| Anatomy stability | `00_MASTER/ANATOMY_STABILITY.md` |
| Generation-result safety | `00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md` |
| General Wallpaper rules | `00_MASTER/WALLPAPER/*_WALLPAPER_RULES.md` |
| Festival Wallpaper rules | `00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md` plus registered Festival module documents |
| Festival cultural/reference data | `FESTIVAL_COSTUME_DATABASE/` |
| Wallpaper task integrity | `00_MASTER/WALLPAPER/WALLPAPER_TASK_INTEGRITY.md` |
| Wallpaper Worker behavior | `00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md` |
| LoRA module behavior | `00_MASTER/LORA_PRODUCTION_PROTOCOL.md` and LoRA module documents |
| LoRA Goal lifecycle | `PRODUCTION/LORA_PROJECT_STATUS.md` for module execution status + the applicable Goal file under `PRODUCTION/` for Goal-specific lifecycle |
| LoRA per-task state | The applicable LoRA queue / Task Record |
| QA module behavior | `00_MASTER/QA_MODULE.md`, `QA_PROTOCOL.md`, and registered QA documents |
| Image Delivery behavior | `00_MASTER/IMAGE_DELIVERY_MODULE.md` and its registered module documents |
| Automation contracts | The applicable automation/module contract |
| Historical events | `00_MASTER/CHANGELOG.md` and explicitly historical documents |
| Legacy project pointer | Root `PROJECT_STATUS.md` only as a compatibility/historical pointer; never an execution authority |

## Execution authority hierarchy

For execution decisions, use this order:

1. `00_MASTER/RUNTIME_STATE.md` — current platform runtime state.
2. `00_MASTER/MODULE_REGISTRY.md` — module registration and activation.
3. `00_MASTER/AUTHORITY_MATRIX.md` — information ownership.
4. The selected module protocol.
5. Module-owned Goal / Batch / Queue / Task state.

A lower layer cannot activate or override a higher layer. In particular:

- a Goal file cannot activate its parent module;
- a Queue file cannot activate its Goal;
- a Worker command cannot activate a module;
- `PROJECT_STATUS.md` cannot authorize execution;
- conversation memory cannot authorize execution.

If a lower-level document says `ACTIVE` while `RUNTIME_STATE` says the parent module is `PAUSED`, the lower-level state is preserved but non-executable.

## Intent vs constraints

The repository uses two different concepts:

### User Intent
The user decides what they want to create or accomplish, such as:

- wallpaper type;
- quantity;
- aspect ratio;
- theme;
- festival;
- scene;
- reference image;
- requested workflow.

### System Constraints
GitHub defines what is allowed and how the request is executed:

- CORE rules;
- module rules;
- safety rules;
- database constraints;
- task integrity;
- current runtime state;
- module activation state.

Therefore:

```
USER INTENT
    ↓
RULE / STATE RESOLUTION
    ├── CORE
    ├── MODULE
    ├── DATABASE
    ├── SAFETY
    └── TASK INTEGRITY
    ↓
DESIGN
    ↓
WORKER
    ↓
OUTPUT
    ↓
QA
```

A user request does not silently activate a PAUSED module. Module activation is a system-state change and must be recorded in the module registry and runtime state.

## Authority conflict rule

When a non-canonical document conflicts with a canonical document:

1. Follow the canonical authority.
2. Treat the conflicting statement as stale or historical unless explicitly marked otherwise.
3. Do not silently rewrite historical records to make them appear current.
4. If the conflict affects execution safety, stop and recover from the canonical state.

## GitHub source-of-truth principle

GitHub is the persistent source of truth for system configuration and desired operational state. Version-controlled state provides auditability and recoverability, consistent with version-controlled source-of-truth practices.

## Maintenance rule

Whenever a new system or information category is created:

1. Assign exactly one canonical authority.
2. Register it here.
3. Add the authority to `MODULE_REGISTRY.md` or the applicable module specification.
4. Mark derived, historical, or legacy documents clearly.
5. Do not create duplicate current-state authorities.
