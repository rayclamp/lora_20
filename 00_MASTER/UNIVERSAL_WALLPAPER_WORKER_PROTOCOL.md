# UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md

## Shared runtime relationship

Universal Wallpaper is a production module. Generic Worker execution is authoritative in `00_MASTER/PRODUCTION_WORKER_RUNTIME.md`; this document is the Universal Wallpaper domain adapter. Claim/Lease/CAS and Worker Pool behavior are shared execution contracts, not Universal-only architecture.

## 1. Purpose

This is the Production Worker protocol for the active Universal Wallpaper module.

It is intentionally NOT bound to:
- a specific character;
- a specific person;
- a specific MASTER_IMAGE;
- a fixed account number;
- a fixed Worker ID;
- a fixed wallpaper theme;
- a fixed aspect ratio.

The current user-supplied reference image is the primary visual reference for the current production batch.

## 2. Module boundary

This protocol belongs only to `UNIVERSAL_WALLPAPER`.

It uses:
- CORE rules;
- Universal Wallpaper rules;
- the selected Anime or Realistic Wallpaper rule set;
- applicable festival data/rules when the request is a festival wallpaper.

It does not inherit:
- LoRA production goals;
- LoRA Master Image rules;
- LoRA dataset exclusions;
- LoRA queue/state;
- QA acceptance rules;
- Image Delivery workflow.

## 3. Production Session Contract

The user starts a production session by providing a Session Contract. The Session Contract is the authoritative user-defined input for that production session.

Required session fields:
1. `MODULE`: `UNIVERSAL_WALLPAPER` or `FESTIVAL_WALLPAPER`
2. `PRODUCTION_TYPE`: `ANIME WALLPAPER` or `REALISTIC WALLPAPER`
3. `CHARACTER`: explicit character identity such as `INARIA`, or `NONE`
4. `IMAGE_COUNT`: target number of images
5. `OUTPUT_TYPE`: `DESKTOP_WALLPAPER` or `PHONE_WALLPAPER`
6. `THEME / FESTIVAL_SCOPE`
7. `SCENE`
8. `SEASON`
9. `WEATHER`
10. `TIME`
11. `PET_ALLOWED`: `YES` or `NO`
12. `REFERENCE_IMAGE`: the current uploaded person/visual identity reference, when used

If a Session field is explicitly provided, preserve it as the session constraint. If an optional design field is not specified, resolve it from the applicable GitHub rules; do not ask the user to repeat a value that can be safely resolved from the rules.

`OUTPUT_TYPE` is the user-facing output requirement. `ASPECT_RATIO` and `ORIENTATION` are technical task fields derived from and locked to the selected `OUTPUT_TYPE`; they are not additional user-facing session choices.

The Session Contract must be persisted in the authoritative batch record before image execution begins. RESUME and STOP operate on this persisted contract rather than reconstructing it from conversation memory.

## 4. Reference-image and character-identity rule

The current uploaded image is the primary and sole visual person reference for the current batch when `REFERENCE_IMAGE` is supplied.

`CHARACTER` is an explicit routing field. The Worker MUST NOT infer Inaria merely because a reference image resembles Inaria.

When `CHARACTER: INARIA`, load `00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md`. When a reference image is supplied, that image remains the sole visual identity authority; the Inaria Character Specification supplies contextual character data and canonical visual/body fields only as fallback when no task-specific person reference exists.

For realistic Inaria with a supplied reference image:
- use the reference image for actual facial/body/age/skin/hair visual evidence;
- use Inaria Character Specification for occupation, work context, world/location, lifestyle, habits, interests, likes/dislikes, personality, preferred environments, and relevant pet/lifestyle context;
- do NOT reconstruct or normalize the referenced person toward Inaria's canonical height, weight, BMI, measurements, face/eye/hair/skin/body specifications;
- do NOT inherit Inaria's original/reference outfit;
- independently redesign wallpaper outfit, hairstyle arrangement, accessories, shoes, pose, action, scene, and presentation unless the user explicitly requests preservation.

The current uploaded image is the primary visual reference for the current batch.

The Worker must:
- visually inspect the actual current reference;
- preserve the identity and visual characteristics represented by it;
- follow the reference rather than substituting a GitHub Master Image;
- not require a project-specific master filename;
- not force the reference image's exact camera angle, pose, or framing across the series.

If a person reference is required by the Session Contract but is missing, unreadable, or unavailable, STOP before generation. A character declaration does not create a substitute visual reference image.

## 5. GitHub authority and routing

Before designing or generating, read the latest applicable:
1. `START_HERE.md`
2. `00_MASTER/MODULE_REGISTRY.md`
3. `00_MASTER/CORE_RULES.md`
4. `00_MASTER/SYSTEM_ARCHITECTURE.md`
5. `00_MASTER/DRAWING_INSTRUCTIONS.md`
6. `00_MASTER/ANATOMY_STABILITY.md`
7. `00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md`
8. `00_MASTER/GENERATION_WORKER_PROTOCOL.md`
9. the selected wallpaper rule file

Character routing:
- If the user explicitly requests Inaria / 依娜莉亞, load `00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md`.
- If no character is explicitly requested, do not infer Inaria from the reference image.
- The character specification is semantic character authority, not a second visual person reference.
- When a person reference is supplied, use the Inaria specification primarily for contextual character data: occupation, world, lifestyle, habits, interests, likes, dislikes, personality, and relevant preferences.
- When a person reference is supplied, canonical visual/body fields in the Inaria specification are fallback identity data only and MUST NOT be used to reconstruct, normalize, or replace the referenced person's appearance.
- The original/reference outfit inside the character specification is character-reference data only and has no automatic inheritance into wallpaper clothing design.
- For Inaria wallpaper tasks, default `CHARACTER_REFERENCE_OUTFIT_POLICY` is `DO_NOT_INHERIT` and default `WALLPAPER_OUTFIT_MODE` is `INDEPENDENT_REDESIGN`.
- Only an explicit user request may authorize reuse/preservation of the original Inaria outfit.

Routing:
- `ANIME WALLPAPER` → `00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md`
- `REALISTIC WALLPAPER` → `00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md`
- unsupported/unknown type → STOP and ask.

If the request is a festival wallpaper, additionally read the applicable Festival Database/index and any module-approved festival-specific rules.

Do not load LoRA-specific reference or production rules.

## 6. Worker identity

A Worker is an interchangeable execution session.

The user does not need to provide an account number or permanent Worker ID.

If runtime worker state is required, use the current Worker Pool/runtime-state mechanism. Worker identity is operational metadata only.

## 7. Task ownership

### 7A. ChatGPT-as-Worker batch mode

When Universal Wallpaper is executed directly by ChatGPT without a queue, the canonical task source is the batch record defined by `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_BATCH_RECORD_SPEC.md` at `MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/<BATCH_ID>.md`.

In this mode:
1. Read the active batch record.
2. Resolve exactly one authoritative IMAGE_ID / TASK_ID.
3. If the task is not yet designed, create its design record according to the current rules.
4. Lock the design before generation.
5. Show the exact executable prompt.
6. Generate one image.
7. Record the result and checkpoint before moving on.

Do not require Claim/Lease/CAS merely because the generic Worker protocol mentions queue mode.


### Queue-mode concurrency gate

Queue-mode Workers MUST follow `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_CONCURRENCY_PROTOCOL.md`.

Before generation, the Worker must hold the current claim, claim ID, lease, state version, and authoritative batch SHA. A failed conditional update is a stale-state conflict, not permission to force-write.

A Worker that loses ownership MUST NOT generate, release, or overwrite the task. SUCCESS is terminal and cannot be claimed again. UNKNOWN is never resolved by lease expiry alone.

### 7A.5 Worker Pool routing

Queue-mode scheduling uses the canonical Worker Pool contract:
`00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_WORKER_POOL_PROTOCOL.md`

The Worker Pool selects eligible work; Claim/Lease/CAS remains the ownership authority.

## 7B. Queue mode

When Universal Wallpaper uses a queue, the Worker Pool / Scheduler contract is defined by `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_WORKER_POOL_PROTOCOL.md`.

The scheduler selects eligible work; it does not grant ownership. Ownership remains authoritative only after the Claim/Lease/CAS protocol succeeds.

When Universal Wallpaper uses a queue:
1. Read the active Universal Wallpaper batch/goal.
2. Create the required task records for the requested quantity if the batch has not already been registered.
3. Scan for a compatible QUEUED task.
4. Claim exactly one task using the authoritative Claim/Lease/CAS rules.
5. Generate only after the claim succeeds.
6. Record the generation result.
7. Release the task and continue only if the batch still requires more images.

Never guess a task folder or account-specific directory.

## 8. Wallpaper type

The wallpaper type is an explicit routing command.

### ANIME WALLPAPER
Use the Anime Wallpaper rules. Preserve anime/illustration visual language.

### REALISTIC WALLPAPER
Use the Realistic Wallpaper rules. Preserve realistic human/photographic visual language.

Do not mix the two rule sets unless an explicit hybrid mode exists in GitHub and the user requests it.


## 8A. Wallpaper Task Integrity

Universal Wallpaper Workers MUST also follow:

`00_MASTER/WALLPAPER/WALLPAPER_TASK_INTEGRITY.md`

The preferred execution model is one task at a time:

`TASK → DESIGN → SAVE DESIGN RECORD → GENERATE → RECORD RESULT → NEXT TASK`

For every existing IMAGE_ID / TASK_ID:

- load the authoritative GitHub design record before generation;
- do not redesign an existing task from conversational memory;
- respect DESIGN_LOCK;
- respect IMAGE_ID_LOCK;
- respect FORMAT_LOCK;
- respect EXPECTED_OUTPUT_COUNT.

### IMAGE_ID

An IMAGE_ID refers to one existing designed task.

If the requested IMAGE_ID does not exist in the authoritative current batch:

`INVALID_IMAGE_ID`

STOP. Do not invent a new wallpaper and do not silently extend the batch.

### Format

Every task must explicitly preserve:

- OUTPUT_TYPE
- ASPECT_RATIO
- ORIENTATION

`OUTPUT_TYPE` is the user-facing session requirement. The Worker derives the technical `ASPECT_RATIO` and `ORIENTATION` from that value according to the canonical wallpaper format rules. The user is not required to provide a separate aspect-ratio field unless an explicit higher-level rule defines a supported override.

A desktop 16:9 task must remain landscape 16:9. It must not silently become a portrait 9:16 phone wallpaper.

The final executable prompt should explicitly repeat the format lock.

### Output count

Default:

`ONE TASK = ONE FINAL IMAGE CANDIDATE`

`EXPECTED_OUTPUT_COUNT: 1`

If one task unexpectedly returns multiple image candidates:

- record `OUTPUT_COUNT_MISMATCH`;
- do not convert extra outputs into new IMAGE_IDs;
- do not count the extra outputs as additional completed tasks;
- preserve the event and follow the module recovery/review path.

A new IMAGE_ID requires a new legitimate task/design record.

### Task coverage

Task coverage is determined by authoritative task records, not by raw image/file count.

Generation success, task coverage, unique candidate count, and downstream QA acceptance remain separate concepts.

### Integrity sequence

Before generation:

`READ TASK → VERIFY ID → VERIFY DESIGN → VERIFY FORMAT → VERIFY OUTPUT COUNT → GENERATE`

After generation:

`VERIFY RESULT COUNT → RECORD RESULT → RELEASE → NEXT TASK`

If task identity, design, format, or generation result cannot be reliably determined, do not guess. Use the applicable recovery/error state.

## 9. Composition

Apply the selected Wallpaper rule set.

In particular:
- `FULL-BODY ≠ DISTANT SHOT`;
- use CLOSE-UP, BUST/HALF-BODY, MEDIUM SHOT, CHARACTER-DOMINANT FULL-BODY, and ENVIRONMENTAL FULL-BODY deliberately;
- do not make every image a distant full-body shot;
- vary viewpoint, framing, character occupancy, position, and visual focus when appropriate.

## 10. Pet rule

The user's pet permission is authoritative for this batch, subject to any stricter applicable module rule.

If pets are not allowed:
- do not intentionally design pets or animals.

If pets are allowed:
- animals may be intentionally included;
- they must not replace or obscure the main reference identity;
- apply anatomy, occlusion, and composition stability rules.

Do not import LoRA-specific animal exclusions into Universal Wallpaper.

## 11. Drawing stability

Before every generation, apply:
- `00_MASTER/DRAWING_INSTRUCTIONS.md`
- `00_MASTER/ANATOMY_STABILITY.md`

Prioritize:
1. stable hand action;
2. finger/toe and limb-source clarity;
3. body ergonomics and support;
4. hand/object and wearable connections;
5. lower-body stability;
6. background/effect clearance;
7. decorative complexity.

Simplify unstable designs before generation.

## 12. Single-image production loop

`DESIGN → APPLY RULES → STABILITY CHECK → FINAL PROMPT → SHOW PROMPT → GENERATE → CONFIRM RESULT → RECORD → CHECKPOINT → NEXT TASK`

Detailed session contract: `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_PRODUCTION_SESSION.md`

### Prompt Preview Gate

Before every generation, the Worker MUST show the complete executable prompt for the current task to the user. The Worker must not silently generate first and disclose the prompt afterward. The shown prompt must be the prompt actually used.

`PROMPT_PREVIEW_STATUS: SHOWN` may only be written after the preview action actually occurred. It is not a self-attestation that permits generation.

If the prompt changes after preview, the Worker MUST show the complete changed prompt again before generation.

### Per-image checkpoint

After each generation attempt:
- `SUCCESS` → preserve candidate, validate required output format, checkpoint, then continue;
- `FAILED` → follow retry/recovery policy;
- `UNKNOWN` → record `UNKNOWN / RECOVERY_REQUIRED` and STOP.

### Continuation Gate

After a confirmed SUCCESS, the Worker MUST immediately resolve the next authoritative task when:

`SESSION_STATUS = ACTIVE` AND `COMPLETED_COUNT < TARGET_COUNT` AND no stop/recovery condition exists.

The Worker MUST NOT end the session merely because the current image succeeded and MUST NOT wait for another user command.

Only these conditions permit normal session termination:
- `COMPLETED_COUNT = TARGET_COUNT`;
- explicit user/system stop;
- quota/platform availability stop;
- generation unavailable;
- UNKNOWN / RECOVERY_REQUIRED;
- execution-critical state conflict.

### Output Format Gate

For every generated candidate, the Worker/output adapter must verify the actual output format when dimensions or equivalent metadata are available.

A task declared `DESKTOP_WALLPAPER / 16:9 / LANDSCAPE` is not considered format-compliant merely because the prompt says 16:9.

Actual mismatch must be recorded as a task-compliance failure and must not be silently recorded as a compliant SUCCESS. If actual dimensions cannot be determined reliably, use the applicable UNKNOWN/recovery state rather than guessing.

\n### Failure / Recovery Gate\n\nWorkers MUST follow `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_FAILURE_RECOVERY_PROTOCOL.md`.\n\nFor an explicit `FAILED` result, retry only while `RECOVERY_STATUS: RETRY_READY`; reuse the same TASK_ID / IMAGE_ID and increment the generation-attempt counters. Three consecutive failures require `RECOVERY_REQUIRED` and stop.\n\nFor `UNKNOWN`, stop immediately and never silently regenerate. For `ABANDONED`, never reuse the task identity; a replacement requires a new legitimate TASK_ID / IMAGE_ID. A confirmed `SUCCESS` is terminal and cannot be regenerated under the same task identity.\n
## 13. Generation sequence

Before generation confirm:
- current reference is available;
- task ownership is valid when a queue is used;
- required inputs are present;
- wallpaper type routing is correct;
- applicable GitHub rules are loaded;
- character authority is resolved when a character is explicitly specified;
- Inaria original/reference outfit is confirmed isolated from wallpaper presentation unless explicitly requested;
- when a person reference exists, contextual Inaria data is separated from canonical visual/body identity data before prompt construction;
- unstable actions have been simplified;
- the executable prompt has been shown to the user.

After generation, confirm the result, record it, checkpoint when applicable, and continue only when the next task is safely resolvable.

## 14. Production Worker is not QA

The Worker must not:
- perform final visual QA;
- decide PASS / REPAIR / REJECT;
- regenerate merely because it dislikes the result;
- delete or overwrite generated candidates;
- replace a completed candidate with another attempt.

The Worker only confirms whether the generation operation returned a candidate.

## 15. Generation-result safety

### SUCCESS
The generation operation explicitly returned a candidate.
Record success and preserve the candidate.

### FAILED
The operation explicitly failed.
Follow the applicable retry/recovery policy.

### UNKNOWN
The Worker cannot reliably determine whether generation succeeded.
Record UNKNOWN / RECOVERY_REQUIRED and STOP.

Never regenerate an UNKNOWN result merely because its status is uncertain.

## 16. Image preservation

After SUCCESS:
- preserve the generated candidate;
- do not delete or overwrite it;
- do not regenerate solely to improve perceived quality.

The current workflow does not require image binaries to be stored in GitHub. GitHub stores rules, prompts, task state, lineage, and coordination data.

## 17. Quantity and quota

The requested quantity is a batch-level target.

Do not divide the target by account or permanently assign image counts to Workers.

Generation-attempt limits count attempts according to the applicable platform/module rules.

If the current session reports quota exhaustion:
- safely release the current uncompleted task when possible;
- stop that Worker session;
- allow another Worker to continue the batch.

## 18. Resume behavior

### Session Contract restoration

RESUME MUST restore the persisted Production Session Contract from the authoritative batch record before resolving the next task.

Restore at minimum:
- MODULE
- PRODUCTION_TYPE
- CHARACTER
- TARGET_COUNT / IMAGE_COUNT
- OUTPUT_TYPE
- resolved ASPECT_RATIO
- resolved ORIENTATION
- THEME / FESTIVAL_SCOPE
- SCENE
- SEASON
- WEATHER
- TIME
- PET_ALLOWED
- REFERENCE_IMAGE authority/status
- character/reference authority routing
- applicable presentation-isolation policies

RESUME MUST NOT invent, silently change, or re-infer these values from conversation memory.

### ChatGPT-as-Worker batch mode
1. read the latest GitHub batch record;
2. restore and validate the Session Contract;
3. resolve the current task and last recorded result;
3. never assume an unknown generation result;
4. if the previous result is UNKNOWN, enter recovery and stop;
5. otherwise continue with the next authoritative task.

### Queue mode
1. read the latest GitHub state;
2. recover runtime Worker state if applicable;
3. verify any previous claim/lease;
4. never assume an unknown generation result;
5. if a previous result is UNKNOWN, enter recovery and stop;
6. otherwise continue with the next compatible QUEUED task.

## 19. Stop persistence

STOP MUST checkpoint the current Session Contract together with the current task state and result state.

At minimum, preserve:
- the full Session Contract;
- current task identity;
- design state and DESIGN_LOCK;
- generation result;
- completed count;
- checkpoint;
- stop reason and evidence when applicable;
- reference-image authority;
- character authority/routing.

STOP does not delete tasks, redesign locked tasks, or convert UNKNOWN into SUCCESS.

## 20. Universal principle

The user specifies WHAT to produce.

The current reference defines WHO/WHAT the visual reference is.

GitHub defines HOW the Universal Wallpaper module operates.

The Worker:
- reads the rules;
- claims work;
- designs within the rules;
- generates;
- records the result;
- continues only when safe.

