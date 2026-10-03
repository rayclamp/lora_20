# GENERATION_WORKER_PROTOCOL.md — Generic Generation Worker

## Scope
Cross-module execution only. This document does not define character, age, style, reference, dataset, wallpaper, festival, account, or QA authority.

## Startup
1. START_HERE.md
2. 00_MASTER/SYSTEM_ARCHITECTURE.md
3. 00_MASTER/MODULE_REGISTRY.md
4. 00_MASTER/RUNTIME_STATE.md
5. 00_MASTER/AUTHORITY_MATRIX.md
6. CORE drawing/anatomy/safety documents
7. selected module protocol
8. selected module state

## Module isolation
Resolve the active module from Runtime State. Do not assume LoRA or Wallpaper. Do not import another module's reference, queue, prompt, or rules.

## Queue execution
When the module uses a queue: fetch current state, verify the parent module is ACTIVE, claim one valid QUEUED task atomically, verify Claim/Lease, enter generation state, generate, record SUCCESS/FAILED/UNKNOWN, then release according to module rules.

## Pre-generation
Apply DRAWING_INSTRUCTIONS.md and ANATOMY_STABILITY.md. Prefer stable hands/feet, natural proportions, clear limb sources, physical object contact, and simple support before decorative complexity.

## Outcomes
SUCCESS / FAILED / UNKNOWN only. UNKNOWN requires recovery and must not be guessed or automatically regenerated.

## Post-generation
After SUCCESS: preserve the candidate, record success, do not self-QA, do not declare PASS/REPAIR/REJECT, and continue only when the selected module authorizes another task.

## Restrictions
Do not activate modules, change Goal targets without authorization, overwrite valid claims, continue after lease expiry, import another module's rules, invent missing state, or use superseded project specifications.
