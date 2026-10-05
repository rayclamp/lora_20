# START_HERE.md — INARIA AI STUDIO Canonical Bootstrap

## Purpose

This is the first bootstrap document for a fresh Worker with no conversation memory.

A Worker MUST resolve the Canonical Repository before loading production rules. It MUST NOT rely on remembered repository names, previous conversations, account-specific paths, or hidden assumptions.

## Canonical Project Identity

- Project: INARIA AI STUDIO
- Canonical Repository: rayclamp/lora_20
- Default Branch: main
- Repository role: current system specification and operational state authority for active production modules

## Fresh-Worker Repository Discovery

When the repository name is not already known, the Worker MUST use the available GitHub repository-discovery capability to enumerate repositories accessible to the current GitHub connection.

For each candidate repository, inspect its root bootstrap/readme metadata and identify the repository containing this exact project identity:

- INARIA AI STUDIO
- START_HERE.md
- 00_MASTER/CANONICAL_PATH_REGISTRY.md

Selection rules:

1. Exactly one candidate must resolve to the INARIA AI STUDIO canonical bootstrap.
2. Zero matches → CANONICAL_REPOSITORY_NOT_RESOLVED → STOP → CHECKPOINT.
3. More than one match → CANONICAL_REPOSITORY_AMBIGUOUS → STOP → CHECKPOINT.
4. Do not guess from repository name, historical similarity, partial matches, or previous projects.
5. Once resolved, record the exact repository_full_name and default branch in the runtime checkpoint.
6. All subsequent canonical-path resolution MUST occur inside that resolved repository.
7. If repository discovery is available, do not ask the user for a repository URL merely because the repository name was not initially known.

## First Canonical Reads

After repository resolution, read these documents in order:

1. START_HERE.md
2. 00_MASTER/CANONICAL_PATH_REGISTRY.md
3. 00_MASTER/SYSTEM_ARCHITECTURE.md
4. 00_MASTER/AUTHORITY_MATRIX.md
5. 00_MASTER/MODULE_REGISTRY.md
6. 00_MASTER/RUNTIME_STATE.md

Then load the active production module's canonical protocol and required dependencies.

## Universal Wallpaper Bootstrap

For MODULE: UNIVERSAL_WALLPAPER, additionally resolve and load the exact paths registered in 00_MASTER/CANONICAL_PATH_REGISTRY.md.

At minimum:

- 00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md
- 00_MASTER/PRODUCTION_WORKER_RUNTIME.md
- 00_MASTER/AUTOMATION_EXECUTION_CONTRACT.md when automated
- 00_MASTER/WALLPAPER/WALLPAPER_TASK_INTEGRITY.md
- 00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_BATCH_RECORD_SPEC.md
- 00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_AUTOMATED_BATCH_EXECUTION_SPEC.md
- 00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_FAILURE_RECOVERY_PROTOCOL.md
- 00_MASTER/WALLPAPER/SCENE_INTENT_RESOLUTION_PROTOCOL.md
- selected Anime or Realistic Wallpaper rules
- MODULES/UNIVERSAL_WALLPAPER/REFERENCE_POLICY.md

Character routing occurs only after module routing.

## Bootstrap Hard Gate

Before Session / Batch creation:

- CANONICAL_REPOSITORY_STATUS = RESOLVED
- CANONICAL_PATH_STATUS = RESOLVED
- RULE_CONTEXT_STATUS = LOADED

If any required condition is not satisfied:

- do not create production prompts;
- do not generate;
- do not claim that rules were loaded;
- checkpoint the failure;
- stop.

## Fresh-Worker Invariant

A fresh Worker must be able to enter this system through repository discovery and this bootstrap document alone. No production behavior may depend on hidden conversation memory.

## Existing Startup and Safety Rules

Read the remaining startup and safety rules below only after the bootstrap resolution succeeds.

Manual / Automated Dispatch → 00_MASTER/PRODUCTION_DISPATCH_PROTOCOL.md
All production Workers → 00_MASTER/PRODUCTION_WORKER_RUNTIME.md
Universal Wallpaper → 00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md
Festival Wallpaper → 00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md
LoRA → MODULES/LORA_PRODUCTION/ + shared Production Worker Runtime
QA → 00_MASTER/QA_MODULE.md + 00_MASTER/QA_PROTOCOL.md

GitHub is the current source of truth. Conversation memory is not an execution authority.

Never generate without valid task ownership when a queue is used. Apply CORE anatomy/drawing rules before generation. Generation SUCCESS is not QA PASS. Do not self-QA. Do not guess UNKNOWN state. Stop on execution-critical conflicts.

If an ACTIVE module declares persistent state, that state must exist in its module-owned canonical directory. Do not create parallel batch/task records elsewhere.
