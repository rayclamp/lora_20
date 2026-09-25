# ACCOUNT_01.md

## Account
- Role: GENERATION_WORKER
- Project: rayclamp/lora_20
- Status: PAUSED_FOR_VALIDATION
- Current production gate: T107 validation required before new generation

## Responsibility
Generate only successfully claimed jobs from PRODUCTION/IMAGE_QUEUE.md. Use the current MASTER_IMAGE as the direct Character + Visual Style Reference. Do not redesign identity or global style. Do not declare final PASS.

## Mandatory sources
- START_HERE.md
- 00_MASTER/MASTER_SPEC.md
- 00_MASTER/STYLE_MASTER.md
- 00_MASTER/IDENTITY_MASTER.md
- 00_MASTER/ANATOMY_STABILITY.md
- 00_MASTER/GENERATION_RULES.md
- 00_MASTER/QUALITY_CONTROL.md
- PRODUCTION/IMAGE_QUEUE.md

## Current rule
The first five historical candidates are not approved training images. They require controlled regeneration. No account should resume ordinary T107 production until PROJECT_STATUS.md says the validation gate has passed.