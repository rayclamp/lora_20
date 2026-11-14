# Reference Paths

## Current LoRA V5.0 standalone prompt archive (new Sessions only)
- Canonical design command: `00_MASTER/LORA/LORA_CONSOLE_COMMAND.md`.
- Canonical root: `PROMPTS/LORA_IMAGE/<SESSION_ID>/` where `SESSION_ID=SE-YYYYMMDD-HHMMSS` uses the **actual** creation time in Asia/Taipei UTC+8, with a collision/nonexistence check.
- One `INDEX.md` with Session settings, every Task number/title/filename and per-Task `TASK_OUTPUT_TYPE`; it contains no full prompt bodies.
- Exactly `IMAGE_COUNT` English standalone `TASK_NNN.txt` files with **only** complete prompt bodies, no metadata or lock markers. Verify every file by complete readback and equality comparison.
- No Batch, `PRODUCTION_RECORDS/`, producer, locks, queue, execution records, automated generation or QA. The user copies prompts manually. Old Batch paths below remain valid solely for existing historical LoRA Batch work and wallpaper workflows, without migration.


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

- Authorized condensed execution-input records:
  `PRODUCTION_RECORDS/<MODULE>/<SESSION_ID>/<BATCH_ID>/EXECUTION_INPUTS/<TASK_ID>.md`
- `EXECUTION_INPUTS` is optional and is created only when a Task actually uses `AUTHORIZED_CONDENSED_PROMPT`. The exact condensed execution text is preserved **after the first actual generation call**. Each Task may have at most one immutable condensed execution-input file; it does not replace, modify, or reversion the authoritative `PROMPTS/<TASK_ID>.md`.

- Optional Task-local safe recovery checkpoints:
  `PRODUCTION_RECORDS/<MODULE>/<SESSION_ID>/<BATCH_ID>/RECOVERY_CHECKPOINTS/<TASK_ID>.md`
- `RECOVERY_CHECKPOINTS` is optional and is used only when normal execution-input or required Task-local persistence cannot be safely completed. When recovering a condensed input, its checkpoint must preserve the **complete exact fixed execution text**, original Prompt identity, known actual generation attempts and observed outcomes, remaining retry eligibility, Task/result attribution, and persistence state. A path, hash, or narrative alone cannot substitute for the text.
- A recovery checkpoint must be successfully written to GitHub and readback-verified before it can serve as an authoritative recovery source. Only one execution-input source may be authoritative for a Task at a time.

- `EXECUTION_INPUTS` and `RECOVERY_CHECKPOINTS` are production-time evidence locations, not required Console design/lock outputs.
- `EXECUTION_LOG.md` records execution-input paths and related events, **not** full condensed execution text.
- Registering these paths does not authorize generation, change Task status, permit retries, modify historical records, or grant GitHub runtime-controller authority. Usage and recovery conditions are defined by `00_MASTER/CORE_RULES.md`, `00_MASTER/GENERATION_WORKER_PROTOCOL.md`, and `00_MASTER/PRODUCTION_RECORD_SCHEMA.md`.


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
- Historical P0-36 festival tag/category exceptions and their P0-38 resolution (not an active blocker queue): FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/ITEM_TAG_CATEGORY_SCOPE_EXCEPTIONS.md
- Preserved verbatim retired festival candidate rows (historical only, never active festival lookup): FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/RETIRED_CANDIDATE_RECORDS.md
- Festival item evidence/structural audit (dated snapshots, consult latest section): FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/DATA_QUALITY_AUDIT.md

## LoRA Image Design
- Current LoRA V5.0 prompt-design and archive command (`/LORA_CONSOLE`): 00_MASTER/LORA/LORA_CONSOLE_COMMAND.md
- Historical locked-Batch-only LoRA Producer command (`/LORA_PRODUCE`): 00_MASTER/LORA/LORA_PRODUCE_COMMAND.md
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
- New LoRA **design-and-archive only** uses `/LORA_CONSOLE V5.0`; the user copies each independent `TASK_NNN.txt` manually and supplies a reference image in the later generation chat. `/LORA_PRODUCE` remains applicable only to authorized historical locked Batches; no new V5.0 Session may be converted into one.
- References to any `ARCHIVE/` directory above are **historical pointers only**. Do not load archived legacy production/QA rules as active instructions, import them as overrides, or edit/migrate historical files merely because a path is listed.
- GitHub remains the authoritative reference and **persistence database**, not a Runtime Controller; only the user-authorized ChatGPT operator executes commands. This registry does not create or modify a Session/Batch, generate images, mark Task SUCCESS, enable Claim/Lease, or activate any QA workflow. **QA is currently `PAUSED`** and remains separate until independently authorized.
- A registered festival ID and a cultural-anchor design cue are not the same as evidence for a specific tradition. Source-backed festival/item-level data must support cultural verification claims; do not fabricate citations or use unsupported anchors as factual authority.

