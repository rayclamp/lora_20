# CANONICAL_PATH_REGISTRY.md — Canonical Rule Paths

## Purpose
This is the canonical routing table for production-critical rule documents.
Workers and automation must resolve these paths exactly. A missing file is a context-load failure; do not guess an alternate path.

## Core
- System architecture: 00_MASTER/SYSTEM_ARCHITECTURE.md
- Dispatch: 00_MASTER/PRODUCTION_DISPATCH_PROTOCOL.md
- Shared runtime: 00_MASTER/PRODUCTION_WORKER_RUNTIME.md
- Output persistence: 00_MASTER/PRODUCTION_OUTPUT_PROTOCOL.md
- Module registry: 00_MASTER/MODULE_REGISTRY.md
- Runtime state: 00_MASTER/RUNTIME_STATE.md
- Authority matrix: 00_MASTER/AUTHORITY_MATRIX.md
- Automation execution contract: 00_MASTER/AUTOMATION_EXECUTION_CONTRACT.md

## Universal Wallpaper
- Worker protocol: 00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md
- Session contract: 00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_PRODUCTION_SESSION.md
- Task integrity: 00_MASTER/WALLPAPER/WALLPAPER_TASK_INTEGRITY.md
- Batch record spec: 00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_BATCH_RECORD_SPEC.md
- Failure recovery: 00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_FAILURE_RECOVERY_PROTOCOL.md
- Scene intent: 00_MASTER/WALLPAPER/SCENE_INTENT_RESOLUTION_PROTOCOL.md
- Realistic rules: 00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md
- Anime rules: 00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md

## Character
- Inaria: 00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md

## Path resolution rule
A Worker must load the exact canonical path listed here.
If the path is unavailable, renamed, or contradictory: CONTEXT_LOAD_FAILURE → STOP → CHECKPOINT.
The Worker must not silently search obsolete paths and continue.

## Legacy references
Historical references to alternate paths are non-authoritative. They must be migrated or explicitly marked LEGACY before an automated production path is reactivated.
