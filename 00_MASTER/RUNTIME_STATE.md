# RUNTIME_STATE.md — Canonical Runtime State

## Authority

This file is the **only canonical current runtime-state document** for the INARIA AI STUDIO platform.

It answers one question:

> What is the system's current execution state?

It does not define drawing rules, module behavior, cultural data, or task semantics. Those remain owned by their canonical documents.

If another document contains a conflicting *current status* statement, this file takes precedence for runtime state.

## Current platform state

```yaml
SYSTEM_STATUS: ACTIVE

ACTIVE_WORKFLOW:
  MODULE: FESTIVAL_WALLPAPER
  MODE: MANUAL_DESIGN

CURRENT_GOAL:
  ID: NONE
  STATUS: NONE

CURRENT_BATCH:
  ID: NONE
  STATUS: NONE

LAST_STATE_UPDATE: 2026-10-03
```

## Module runtime status

| Module | Status | Execution allowed |
|---|---|---|
| UNIVERSAL_WALLPAPER | ACTIVE | YES |
| FESTIVAL_WALLPAPER | ACTIVE | YES |
| LORA_PRODUCTION | PAUSED | NO |
| QA | PAUSED | NO |
| IMAGE_DELIVERY | PAUSED | NO |

## Status semantics

### ACTIVE
The module may execute its declared workflow.

### PAUSED
The module is preserved but must not claim or execute new work.

### SUSPENDED
A Goal or batch may be preserved while its parent module is paused. It is not executable until the parent module is activated.

### HISTORICAL
Information describes past execution and must not be interpreted as current runtime state.

## Current workflow interpretation

The current platform is actively using the Festival Wallpaper workflow.

Festival Wallpaper is an independent module. It may reuse shared CORE rules and shared Wallpaper Task Integrity infrastructure, but it does not inherit unrelated General Wallpaper or LoRA workflow semantics.

## Current Goal / Batch

No platform-wide Goal or Batch is currently active in this runtime-state record.

Module-owned Goals remain in their own module documents and are not automatically activated by their existence.

For example:

```
MODULE STATUS = PAUSED
GOAL STATUS = SUSPENDED
```

means the Goal is preserved but cannot execute.

## Recovery rule

On startup or recovery, read in this order:

```
START_HERE
↓
SYSTEM_ARCHITECTURE
↓
MODULE_REGISTRY
↓
RUNTIME_STATE
↓
AUTHORITY_MATRIX
↓
SELECTED MODULE PROTOCOL
↓
MODULE TASK / DESIGN / QUEUE STATE
```

Never reconstruct current runtime state from conversation memory or historical documents.

## Update rule

Any activation, pause, suspension, resume, or change of active workflow must update this file in the same change set that changes the authoritative module state.

Do not create a second runtime-state file.
