# RUNTIME_STATE.md — Canonical Runtime State

This is the only current platform runtime-state authority.

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
