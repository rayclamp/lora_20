# UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md

## 1. Purpose

This is the universal Production Worker protocol for wallpaper generation.

It is intentionally NOT bound to:
- a specific character;
- a specific person;
- a specific MASTER_IMAGE;
- a fixed account number;
- a fixed Worker ID;
- a fixed wallpaper theme;
- a fixed wallpaper orientation.

The image uploaded by the user in the current generation request is the ONLY visual reference for the current production run.

GitHub is the sole source of persistent production rules and coordination state. The user does not need to repeat the drawing, anatomy, safety, prompt, or worker rules in chat.

## 2. Minimal user input

The user only needs to provide:
1. Production quantity
2. Wallpaper type: ANIME WALLPAPER or REALISTIC WALLPAPER
3. Output format
4. Wallpaper theme
5. Scene
6. Weather
7. Time
8. Whether pets are allowed

The wallpaper type is an explicit routing command, not a suggestion. The Worker must not reinterpret it.

The user also uploads the reference image.

If a required input is missing, the Worker asks only for the missing input. It must not invent a missing required parameter.

## 3. Reference-image rule

The uploaded image in the current generation context is the ONLY reference image.

The Worker must:
- visually inspect the actual uploaded image;
- use it as the direct character/person/visual-style reference;
- preserve the identity and visual characteristics represented by that image;
- follow the reference rather than substituting a GitHub MASTER_IMAGE;
- never require a specific character filename or project-specific master image.

GitHub text descriptions, filenames, previous images, old chat images, or generic style labels are not substitutes for the current uploaded reference.

If the reference image is missing, unreadable, or unavailable to the generation context, STOP before generation.

## 4. GitHub authority

Before designing or generating anything, read the latest applicable GitHub rules.

At minimum read:
1. START_HERE.md
2. 00_MASTER/MODULE_REGISTRY.md
3. 00_MASTER/MASTER_SPEC.md
4. 00_MASTER/DRAWING_INSTRUCTIONS.md
5. 00_MASTER/ANATOMY_STABILITY.md
6. 00_MASTER/GENERATION_RULES.md
7. 00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md
8. 00_MASTER/GENERATION_WORKER_PROTOCOL.md
9. 00_MASTER/PRODUCTION_PROTOCOL.md
10. 00_MASTER/PRODUCTION_MODES.md
11. PRODUCTION/WORKER_POOL.md
12. PRODUCTION/GENERATION_RETRY_POLICY.md
13. The applicable wallpaper rule file:
   - ANIME WALLPAPER → 00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md
   - REALISTIC WALLPAPER → 00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md
14. Any festival-specific database/rule file applicable to the requested wallpaper type

The Worker must not rely on historical chat instructions when a current GitHub rule exists.

## 5. Worker identity: user does NOT assign it

The user does not need to provide an account number or Worker ID.

A Worker is an interchangeable execution session.

At startup, the Worker creates a unique runtime Worker ID for coordination, for example:
W-20261002-0417-UNIQUE

The Worker ID is operational metadata only. It does not represent a permanent account identity.

If worker state needs to be stored, use:
PRODUCTION/WORKERS/<RUNTIME_WORKER_ID>/STATE.md

The Worker creates/uses its own runtime state folder as required by the Worker Pool rules.

## 6. Task ownership: the Worker finds the task

The user does NOT need to tell the Worker which task folder to use.

The Worker follows this order:
1. Read the active universal wallpaper production state.
2. If the current user request has not yet been registered, create one production Batch/Goal from the eight user inputs plus the current reference-image runtime context.
3. Create the required task records for the requested quantity.
4. Scan the authoritative queue for a QUEUED task.
5. Claim exactly one task using the queue Claim/Lease/CAS rules.
6. Generate only after the claim succeeds.
7. Record IMAGE_CREATED after a successful generation result.
8. Release the task and claim another QUEUED task if the requested quantity has not been reached.

The Worker never guesses a task folder and never relies on an account-specific directory.

## 7. No account binding

Do not use:
- ACCOUNT_01;
- ACCOUNT_02;
- ACCOUNT_06;
- a hard-coded account number;
- a previous chat's Worker ID;
- a previous account's task folder

as a requirement for deciding what to generate.

Any available Production Worker can execute any unclaimed compatible task.

## 8. Task design

First resolve the wallpaper type:
- ANIME WALLPAPER → load ANIME_WALLPAPER_RULES.md
- REALISTIC WALLPAPER → load REALISTIC_WALLPAPER_RULES.md
- Any other wallpaper type → STOP and ask for an explicit supported wallpaper type.

For each image, the Worker derives the visual design from:
A. Current user inputs
B. The uploaded reference image
C. Current GitHub CORE rules
D. The selected wallpaper-type rules
E. Any applicable wallpaper/festival database
F. Dataset/diversity rules when applicable

The Worker may vary:
- camera/view;
- shot size;
- composition;
- pose;
- stable hand action;
- hairstyle variation when allowed;
- clothing/accessories when allowed;
- local scene details;
- lighting;
- environmental details.

The Worker must NOT vary the reference identity into another person/character.

The Worker must not mix Anime and Realistic rule sets in the same task unless the user explicitly requests a hybrid mode and a corresponding GitHub rule exists.

## 9. Drawing-stability rules are mandatory

Before every generation, apply the complete owner-confirmed rules in:
00_MASTER/DRAWING_INSTRUCTIONS.md
and
00_MASTER/ANATOMY_STABILITY.md

These are generation-design constraints.

The Worker must prioritize:
1. stable hand action;
2. fingers/toes and limb-source clarity;
3. body ergonomics and support;
4. hand/object and wearable connections;
5. lower-body stability;
6. background/effect clearance;
7. decorative complexity.

Conceptual planning order:
fingers/toes → body → clothing/accessories → background/effects

The Worker must simplify unstable designs BEFORE generation.

Do not design a difficult action first and hope the model fixes it.

## 10. Composition rule

FULL-BODY ≠ DISTANT SHOT.

The Worker must deliberately select an appropriate shot:
- CLOSE-UP
- BUST / HALF-BODY
- MEDIUM SHOT
- CHARACTER-DOMINANT FULL-BODY
- ENVIRONMENTAL FULL-BODY

Do not produce every image as a distant full-body shot.

## 11. Pet rule

The user's Pets parameter is authoritative for this production batch.

If Pets = No:
- do not intentionally design pets or animals into the image.

If Pets = Yes:
- pets may be intentionally included;
- the pet must not replace or obscure the main reference identity;
- apply all anatomy, occlusion, and composition stability rules.

A wallpaper-type-specific GitHub rule may impose stricter restrictions. If so, the stricter applicable rule controls.

## 12. Generation sequence

For each task:

DESIGN
→ APPLY GITHUB DRAWING RULES
→ STABILITY CHECK
→ FINAL PROMPT
→ GENERATE
→ CONFIRM GENERATION RESULT
→ RECORD RESULT
→ NEXT TASK

Before generation:
- confirm the current uploaded reference is available;
- confirm task ownership;
- confirm all required user parameters;
- confirm the prompt follows the applicable GitHub rules;
- simplify unstable actions before generation.

## 13. Production Worker is not QA

The Worker must not:
- perform final visual QA;
- decide PASS / REPAIR / REJECT;
- reject a candidate because it looks imperfect;
- regenerate merely because it dislikes the result;
- delete a generated candidate;
- overwrite a generated candidate;
- replace a completed candidate with another attempt.

The Worker only confirms whether the generation operation actually returned a candidate.

Visual quality is handled by the downstream QA workflow.

## 14. Generation-result safety

Only three generation results are valid.

SUCCESS:
The generation operation explicitly returned a generated image candidate.
Record GENERATION_RESULT: SUCCESS and then IMAGE_CREATED.

FAILED:
The generation operation explicitly failed.
Record the appropriate failure state and follow the GitHub retry policy.

UNKNOWN:
The Worker cannot reliably determine whether generation succeeded.
Record GENERATION_RESULT: UNKNOWN and STATUS: RECOVERY_REQUIRED.
STOP.

Never regenerate an UNKNOWN result merely because its status is uncertain.

UNKNOWN is not FAILED.

## 15. Image preservation

After SUCCESS:
- preserve the generated candidate;
- never delete it;
- never overwrite it;
- never replace it;
- never regenerate solely to improve perceived quality.

The current workflow does not require the Worker to upload image binaries to GitHub.

GitHub stores rules, task state, prompts, lineage, and coordination data.

## 16. Quantity and daily limits

The requested quantity is a team-level production target for the current batch.

Do not divide the quantity by account.

Do not assign a fixed number of images to a Worker.

Generation-attempt limits count generation attempts, not only successful images.

If the current account/session explicitly reports quota exhaustion:
- safely release the current task if no generation result was produced;
- stop that Worker session;
- another Worker may continue the same batch.

## 17. Resume behavior

If the same Worker session continues later:
1. Read the latest GitHub state.
2. Recover its runtime Worker state.
3. Check whether its previous task has a valid active claim/lease.
4. Never assume the previous generation result.
5. If the previous generation result is UNKNOWN, enter RECOVERY_REQUIRED and stop.
6. Otherwise claim the next available QUEUED task.

A new chat/session does not automatically inherit an old Worker ID unless the runtime state explicitly identifies the same session.

## 18. What the user should NOT have to provide

The user should not need to provide:
- Worker ID
- Account number
- Task ID
- Task folder
- Prompt template
- anatomy rules
- hand rules
- pose rules
- QA rules
- generation safety rules
- GitHub file paths
- character specification
- style specification
- retry rules
- queue rules

All of these belong in GitHub.

## 19. Universal operating principle

The user's job is to specify WHAT to produce.

GitHub defines HOW the production system operates.

The uploaded reference image defines WHO/WHAT the current visual reference is.

The Production Worker:
- reads the rules;
- creates/claims the work;
- designs within the rules;
- generates;
- records the generation result;
- moves to the next task.

No account-specific knowledge should be required from the user.
