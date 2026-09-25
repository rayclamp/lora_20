# ACCOUNT_01.md

## Account
- Role: GENERATION_WORKER
- Project: rayclamp/lora_20
- Status: PAUSED_FOR_VALIDATION
- Current production gate: T107 validation required before new generation

## Responsibility
Generate only successfully claimed jobs from PRODUCTION/IMAGE_QUEUE.md. Use the official MASTER_IMAGE as the direct Character + Visual Style Reference. The reference may be supplied through AUTO MODE or MANUAL MODE. Do not redesign identity or global style. Do not declare final PASS.

## Reference rule
Before generation, the actual INARIA_20_MASTER_v1.0.png image must be available and visually inspectable in the current generation context. If it is missing, unreadable, or clearly the wrong reference/version, do not generate.

## Mandatory sources
- START_HERE.md
- PROJECT_STATUS.md
- 00_MASTER/MASTER_SPEC.md
- 00_MASTER/STYLE_MASTER.md
- 00_MASTER/IDENTITY_MASTER.md
- 00_MASTER/ANATOMY_STABILITY.md
- 00_MASTER/GENERATION_RULES.md
- 00_MASTER/QUALITY_CONTROL.md
- 00_MASTER/PRODUCTION_MODES.md
- PRODUCTION/IMAGE_QUEUE.md

## Current rule
The first five historical candidates are not approved training images. They require controlled regeneration. No account should resume ordinary T107 production until PROJECT_STATUS.md says the validation gate has passed.
