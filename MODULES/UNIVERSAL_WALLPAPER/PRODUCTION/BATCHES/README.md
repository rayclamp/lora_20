# Universal Wallpaper — Canonical Batch State

This directory is the sole canonical persistent storage location for Universal Wallpaper production batches.

## Authority
- Module: UNIVERSAL_WALLPAPER
- Status: ACTIVE
- Protocol: 00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md
- Batch schema: 00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_BATCH_RECORD_SPEC.md

## Rules
1. Persistent Universal Wallpaper batch records belong here.
2. A batch record is named `<BATCH_ID>.md`.
3. Do not create parallel operational batch records under 00_MASTER, FESTIVAL_COSTUME_DATABASE, or another module.
4. A worker must read the canonical batch record before executing a task.
5. Completed or abandoned batches remain historical records unless an explicit retention policy is later introduced.
6. This directory marker is part of the architecture contract even when no batch is currently active.
