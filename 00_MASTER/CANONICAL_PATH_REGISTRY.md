# Reference Paths

## Core
- Character: 00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md
- Anatomy: 00_MASTER/ANATOMY_STABILITY.md
- Drawing: 00_MASTER/DRAWING_INSTRUCTIONS.md
- Generation safety: 00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md
- Core rules: 00_MASTER/CORE_RULES.md
- Generation rules: 00_MASTER/GENERATION_RULES.md
- Generation worker protocol: 00_MASTER/GENERATION_WORKER_PROTOCOL.md
- Production record schema: 00_MASTER/PRODUCTION_RECORD_SCHEMA.md

## Production Records
- Root: PRODUCTION_RECORDS/
- Canonical automated batch path: PRODUCTION_RECORDS/<MODULE>/<SESSION_ID>/<BATCH_ID>/
- The storage directory is determined by MODULE, not PRODUCTION_TYPE.
- REALISTIC and ANIME are PRODUCTION_TYPE values and must never create separate production-record roots.
- Standard records: SESSION_CONTRACT.md, BATCH_RECORD.md, TASK_QUEUE.md, PROMPT_SET.md, EXECUTION_LOG.md

## Wallpaper
- Anime: 00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md
- Realistic: 00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md
- Festival design: 00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md
- Universal reference policy: MODULES/UNIVERSAL_WALLPAPER/REFERENCE_POLICY.md
- Festival reference policy: MODULES/FESTIVAL_WALLPAPER/REFERENCE_POLICY.md

## Festival
- Index: FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/CORE_FESTIVAL_INDEX.md
- Database: FESTIVAL_COSTUME_DATABASE/

## LoRA Image Design
- Module: MODULES/LORA_IMAGE/MODULE.md
- Uploaded-reference policy: MODULES/LORA_IMAGE/REFERENCE_POLICY.md
- Archived legacy production rules: ARCHIVE/LEGACY_LORA_PRODUCTION/

## Independent Image QA
- QA governance: 00_MASTER/QA_MODULE.md, 00_MASTER/QA_PROTOCOL.md
- QA system: IMAGE_QA/MODULE.md
- LoRA image acceptance profile: IMAGE_QA/LORA_IMAGE_QA_SPEC.md
- LoRA image inspection checklist: IMAGE_QA/LORA_IMAGE_QA_CHECKLIST.md
- Archived original LoRA QA files: ARCHIVE/LEGACY_LORA_PRODUCTION/QA/

## QA Tools
- Codex checklist: 00_MASTER/CODEX_QA_CHECKLIST.md
