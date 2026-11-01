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
- Standard batch records: SESSION_CONTRACT.md, BATCH_RECORD.md, TASK_QUEUE.md, PROMPT_SET.md (manifest/index only), EXECUTION_LOG.md.
- Authoritative per-Task prompt files for new Batches: `PROMPTS/TASK_001.md`, `PROMPTS/TASK_002.md`, etc. Each Task has exactly one dedicated prompt file; `PROMPT_SET.md` MUST NOT contain full prompt bodies for new Batches.

## Wallpaper
- Unified design/production command contract: 00_MASTER/WALLPAPER/WALLPAPER_COMMAND_PROTOCOL.md
- Anime: 00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md
- Realistic: 00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md
- Festival design: 00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md
- Universal reference policy: MODULES/UNIVERSAL_WALLPAPER/REFERENCE_POLICY.md
- Festival reference policy: MODULES/FESTIVAL_WALLPAPER/REFERENCE_POLICY.md

## Festival
- Index (registered F001–F048 IDs/names and type/region navigation; not cultural verification): FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/CORE_FESTIVAL_INDEX.md
- Cultural anchors (working design cues only; individual regional/ritual claims are NOT source-verified by this file): FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/FESTIVAL_CULTURAL_ANCHORS.md
- Database: FESTIVAL_COSTUME_DATABASE/
- Current festival item-tag/category-scope exceptions (dated audit snapshot, not an execution rule or source certification): FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/ITEM_TAG_CATEGORY_SCOPE_EXCEPTIONS.md

## LoRA Image Design
- Current LoRA image production command reference (`/LORA_PRODUCE`): 00_MASTER/LORA/LORA_PRODUCE_COMMAND.md
- Module: MODULES/LORA_IMAGE/MODULE.md
- Uploaded-reference policy: MODULES/LORA_IMAGE/REFERENCE_POLICY.md
- Dataset design specification: MODULES/LORA_IMAGE/DATASET_DESIGN_SPEC.md
- Dataset diversity rules: MODULES/LORA_IMAGE/DATASET_DIVERSITY.md
- Candidate design rules: MODULES/LORA_IMAGE/CANDIDATE_DESIGN_RULES.md
- Archived legacy production rules (historical only; never active production dependencies): ARCHIVE/LEGACY_LORA_PRODUCTION/

## Independent Image QA
- QA governance: 00_MASTER/QA_MODULE.md, 00_MASTER/QA_PROTOCOL.md
- QA system: IMAGE_QA/MODULE.md
- LoRA image acceptance profile: IMAGE_QA/LORA_IMAGE_QA_SPEC.md
- LoRA image inspection checklist: IMAGE_QA/LORA_IMAGE_QA_CHECKLIST.md
- Archived original LoRA QA files (historical only; never active QA dependencies): ARCHIVE/LEGACY_LORA_PRODUCTION/QA/

## QA Tools
- Codex checklist: 00_MASTER/CODEX_QA_CHECKLIST.md

## Stage Routing and Registry Authority (P0-15)
- This file is a **path locator**, not an executable command, stage handoff, permission grant, scheduler, production controller, or proof that a referenced item was culturally verified.
- Stage/role architecture: 00_MASTER/SYSTEM_ARCHITECTURE.md. Consult `00_MASTER/CORE_RULES.md` and the relevant module contract for mandatory execution rules. Adding a path here does not alter those contracts.
- Wallpaper **design/lock** uses `/WALLPAPER_CONSOLE` and stops before generation. Wallpaper **production/continuation** uses `/WALLPAPER_PRODUCE` against an authorized existing locked Session/Batch. Both commands are defined in the existing `00_MASTER/WALLPAPER/WALLPAPER_COMMAND_PROTOCOL.md`; do not infer separate missing command files.
- LoRA **design/lock** uses `/LORA_CONSOLE`, and LoRA **production/continuation** uses `/LORA_PRODUCE`. The confirmed producer document is indexed above; **no separate `/LORA_CONSOLE` document path is asserted by this registry**. The design phase does not require an uploaded person-reference image; the LoRA producer stage requires a reference image supplied in its current production conversation, under the active reference policy.
- References to any `ARCHIVE/` directory above are **historical pointers only**. Do not load archived legacy production/QA rules as active instructions, import them as overrides, or edit/migrate historical files merely because a path is listed.
- GitHub remains the authoritative reference and **persistence database**, not a Runtime Controller; only the user-authorized ChatGPT operator executes commands. This registry does not create or modify a Session/Batch, generate images, mark Task SUCCESS, enable Claim/Lease, or activate any QA workflow. **QA is currently `PAUSED`** and remains separate until independently authorized.
- A registered festival ID and a cultural-anchor design cue are not the same as evidence for a specific tradition. Source-backed festival/item-level data must support cultural verification claims; do not fabricate citations or use unsupported anchors as factual authority.

