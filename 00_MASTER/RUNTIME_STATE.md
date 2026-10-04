# RUNTIME_STATE.md — Canonical Runtime State

This is the only current platform runtime-state authority.

SYSTEM_STATUS: ACTIVE

SYSTEM_DEFAULT_WORKFLOW:
  MODULE: FESTIVAL_WALLPAPER
  MODE: MANUAL_DESIGN

ACTIVE_PRODUCTION_SESSION:
  MODULE: NONE
  MODE: NONE
  STATUS: NONE

CURRENT_GOAL:
  ID: NONE
  STATUS: NONE

CURRENT_BATCH:
  ID: NONE
  STATUS: NONE

LAST_STATE_UPDATE: 2026-10-05

| Module | Status | Execution allowed |
|---|---|---|
| UNIVERSAL_WALLPAPER | ACTIVE | YES |
| FESTIVAL_WALLPAPER | ACTIVE | YES |
| LORA_PRODUCTION | PAUSED | NO |
| QA | PAUSED | NO |
| IMAGE_DELIVERY | PAUSED | NO |

ACTIVE may execute its declared workflow. PAUSED may not claim or execute work.

A Goal or Queue cannot activate its parent module.

Recovery:
START_HERE → SYSTEM_ARCHITECTURE → MODULE_REGISTRY → RUNTIME_STATE → AUTHORITY_MATRIX → SELECTED MODULE → MODULE STATE


## Workflow-state semantics

SYSTEM_DEFAULT_WORKFLOW describes the currently selected/default workflow context. It does not imply that a production session is active.

ACTIVE_PRODUCTION_SESSION is the authoritative indicator of an actually executing production session. A module may be ACTIVE in MODULE_REGISTRY while ACTIVE_PRODUCTION_SESSION is NONE.

Automated requests must route from their explicit MODULE through Dispatch and must not inherit SYSTEM_DEFAULT_WORKFLOW merely because it is present in runtime state.
