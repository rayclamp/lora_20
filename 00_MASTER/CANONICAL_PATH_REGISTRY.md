# CANONICAL_PATH_REGISTRY.md — Canonical Rule Paths

## Purpose
This is the canonical routing table for production-critical rule documents.
Workers and automation must resolve these paths exactly. A missing file is a context-load failure; do not guess an alternate path.

## Bootstrap
- Repository bootstrap: START_HERE.md
- Fresh-Worker repository discovery and canonical startup: START_HERE.md
- Repository discovery method: enumerate the complete accessible repository set first; keyword/name repository search is supplemental only and cannot establish canonical identity
- Bootstrap identity verification: exact root START_HERE.md + INARIA AI STUDIO identity + 00_MASTER/CANONICAL_PATH_REGISTRY.md + requested-module routing verification

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
- Automated multi-image execution: 00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_AUTOMATED_BATCH_EXECUTION_SPEC.md
- Failure recovery: 00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_FAILURE_RECOVERY_PROTOCOL.md
- Scene intent: 00_MASTER/WALLPAPER/SCENE_INTENT_RESOLUTION_PROTOCOL.md
- Realistic rules: 00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md
- Anime rules: 00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md
- Reference policy: MODULES/UNIVERSAL_WALLPAPER/REFERENCE_POLICY.md

## Festival Wallpaper
- Module reference policy: MODULES/FESTIVAL_WALLPAPER/REFERENCE_POLICY.md
- Execution profile: 00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md
- Cultural data: FESTIVAL_COSTUME_DATABASE/
- Cultural data index: FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/CORE_FESTIVAL_INDEX.md

## Character
- Inaria semantic character authority: 00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md

## Path resolution rule
A Worker must load the exact canonical path listed here.
If the path is unavailable, renamed, or contradictory: CONTEXT_LOAD_FAILURE → STOP → CHECKPOINT.
The Worker must not silently search obsolete paths and continue.

## Reference authority rule

A Character Specification is semantic/context authority unless the selected production module explicitly designates it otherwise. It is not a visual reference asset.

Visual reference authority must be resolved through the selected production module's canonical Reference Policy.

Automation must load the selected module's Reference Policy before resolving REFERENCE_AUTHORITY_RESOLVED.

## Legacy references
Historical references to alternate paths are non-authoritative. They must be migrated or explicitly marked LEGACY before an automated production path is reactivated.
