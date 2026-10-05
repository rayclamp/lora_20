# SYSTEM_ARCHITECTURE.md

The repository is the project's **image-production reference and persistence database**, not an execution engine.

## Core Architecture

`User Production Command → Worker → GitHub References → Prompt Design → Image Generation`

GitHub stores reusable reference material.

For automated production, GitHub may also store durable production records and checkpoints so interrupted work can be recovered. These records are storage/persistence only; GitHub does not execute, schedule, resume, retry, or orchestrate the Worker.

## Manual Production

`User Command → Worker → Read References → Design Prompt(s) → Return Prompt(s)`

Manual production does not require production-state persistence unless explicitly requested.

## Automated Production

`User Command → Worker → Read References → Design Prompt(s) → Image Generation → Persist Production Record / Checkpoint`

If production is interrupted, the Worker/runtime reads the persisted production information and continues the remaining work.

## Strict Boundary

GitHub does **not** control:
- Worker lifecycle
- repository discovery when the repository is explicitly supplied
- prompt execution gates
- queues
- scheduling
- retries
- orchestration

GitHub **does** provide:
- canonical image-design references
- automated-production persistence/checkpoint data needed for recovery

Manual and automated production share the same design process; automation adds image execution and durable production recording.
