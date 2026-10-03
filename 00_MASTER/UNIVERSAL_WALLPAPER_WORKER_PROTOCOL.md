# UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md

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

## 3. Required user input

The user provides:
1. Production quantity
2. Wallpaper type: `ANIME WALLPAPER` or `REALISTIC WALLPAPER`
3. Output format / aspect ratio
4. Wallpaper theme
5. Scene
6. Weather
7. Time
8. Whether pets are allowed
9. Current reference image

If a required input is missing, ask only for the missing input.

## 4. Reference-image rule

The current uploaded image is the primary visual reference for the current batch.

The Worker must:
- visually inspect the actual current reference;
- preserve the identity and visual characteristics represented by it;
- follow the reference rather than substituting a GitHub Master Image;
- not require a project-specific master filename;
- not force the reference image's exact camera angle, pose, or framing across the series.

If the reference is missing, unreadable, or unavailable, STOP before generation.

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

### Per-image checkpoint

After each generation attempt:
- `SUCCESS` → preserve candidate, checkpoint, then continue;
- `FAILED` → follow retry/recovery policy;
- `UNKNOWN` → record `UNKNOWN / RECOVERY_REQUIRED` and STOP.

## 13. Generation sequence

Before generation confirm:
- current reference is available;
- task ownership is valid when a queue is used;
- required inputs are present;
- wallpaper type routing is correct;
- applicable GitHub rules are loaded;
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

On resume:
1. read the latest GitHub state;
2. recover runtime Worker state if applicable;
3. verify any previous claim/lease;
4. never assume an unknown generation result;
5. if a previous result is UNKNOWN, enter recovery and stop;
6. otherwise continue with the next compatible QUEUED task.

## 19. Universal principle

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

