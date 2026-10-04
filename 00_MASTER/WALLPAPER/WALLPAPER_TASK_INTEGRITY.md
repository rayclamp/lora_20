# WALLPAPER_TASK_INTEGRITY.md

## Purpose

This document defines the task-integrity rules for the Universal Wallpaper module.

The goal is to prevent a wallpaper task from being redesigned, duplicated, mis-numbered, or generated in the wrong output format during automated or semi-automated production.

GitHub is the persistent source of truth for task identity and task design.

## 1. One-task-at-a-time design model

For Universal Wallpaper production, the preferred production flow is:

`TASK → DESIGN → SAVE DESIGN RECORD → GENERATE → RECORD RESULT → NEXT TASK`

When a batch requests multiple wallpapers, Workers should design and execute one wallpaper task at a time whenever the active automation supports this model.

A Worker must not rely on conversational memory of a large batch when an authoritative GitHub task/design record exists.

The purpose is to reduce cross-image design contamination and loss of previously specified scene details.

## 2. Design Record

Before generation, each wallpaper task must have a persistent design record containing, as applicable:

- IMAGE_ID / TASK_ID
- wallpaper type
- output type
- aspect ratio
- orientation
- festival/theme
- reference identity
- viewpoint
- shot size
- character position
- pose
- main action
- hand action
- leg position
- hairstyle
- clothing
- accessories
- hairstyle arrangement
- reference outfit policy
- reference pose policy
- clothing
- accessories
- shoes
- makeup, when applicable
- scene
- weather
- time
- lighting
- camera/lens
- stability constraints
- final executable prompt
- negative/stability prompt
- task status

The generation Worker executes the current task record. It must not silently replace the design with a newly invented scene.

## 3. DESIGN LOCK

Once a task's design record is approved/committed for generation, the task becomes DESIGN-LOCKED.

For a DESIGN-LOCKED task, the Worker must not:

- invent a different festival/theme;
- replace the planned outfit;
- replace the planned hairstyle;
- replace the planned action;
- replace the planned pose;
- change the planned viewpoint/shot without an explicit task update;
- substitute another wallpaper type;
- silently convert the task into a different composition.

If the task record is incomplete or contradictory, stop and report the state conflict rather than guessing.

## 4. IMAGE_ID LOCK

An IMAGE_ID identifies one specific designed wallpaper task.

If the current batch contains IMAGE 01 through IMAGE 09, then only those IDs exist.

If a Worker is asked to generate IMAGE 06, it must load the existing IMAGE 06 design record.

It must NOT redesign IMAGE 06 from memory.

If an IMAGE_ID does not exist in the current authoritative batch/design records:

- report `INVALID_IMAGE_ID`;
- list the valid IDs when they are safely available;
- do not invent a new wallpaper;
- do not assign the requested ID to a newly invented design;
- do not silently extend the batch.

Example:

`IMAGE 10` requested when only IMAGE 01–09 exist → `INVALID_IMAGE_ID` → STOP.

## 5. FORMAT LOCK

Every wallpaper task must explicitly declare its output format.

Minimum fields:

- `OUTPUT_TYPE`
- `ASPECT_RATIO`
- `ORIENTATION`

Examples:

`OUTPUT_TYPE: DESKTOP_WALLPAPER`
`ASPECT_RATIO: 16:9`
`ORIENTATION: LANDSCAPE`

or:

`OUTPUT_TYPE: PHONE_WALLPAPER`
`ASPECT_RATIO: 9:16`
`ORIENTATION: PORTRAIT`

The Worker must preserve the task's declared format.

A request for a desktop 16:9 wallpaper must never be silently converted to a phone 9:16 wallpaper.

The final executable prompt should repeat the format lock explicitly.

## 6. OUTPUT COUNT LOCK

The default Universal Wallpaper production rule is:

**ONE TASK = ONE FINAL IMAGE CANDIDATE**

Each task should declare:

`EXPECTED_OUTPUT_COUNT: 1`

The instruction must be reinforced at the generation layer, but actual output count must also be checked by the automation layer when technically possible.

If a single task returns more than one image candidate:

- record `OUTPUT_COUNT_MISMATCH`;
- do not automatically treat the extra images as additional IMAGE_IDs;
- do not rename them into IMAGE 07, IMAGE 08, etc.;
- do not silently count them as additional completed tasks;
- route the task to the module's defined recovery/review state.

If one image is returned, the task may continue through the normal generation-result flow.

If generation status or output count cannot be reliably determined, use the module's UNKNOWN / RECOVERY_REQUIRED handling rather than guessing.

## 7. Extra output is not a new task

If IMAGE 06 unexpectedly returns three candidates, all three belong to the IMAGE 06 generation event.

They do not automatically become:

- IMAGE 06
- IMAGE 07
- IMAGE 08

A new IMAGE_ID requires a new legitimate task/design created by the authorized task designer.

This prevents output-count anomalies from corrupting task coverage and batch numbering.

## 8. Task-count integrity

Task coverage is based on authoritative task records, not on the number of files or images returned by a generation operation.

Do not mark three tasks complete because one task returned three images.

Do not mark a nonexistent task complete because an extra image was returned.

Generation success and task coverage remain separate from downstream QA acceptance.

## 8A. Batch diversity integrity

For multi-image wallpaper batches, diversity is an explicit design requirement, not an optional suggestion.

When the user requests a series intended to provide varied wallpapers, the design set MUST deliberately vary presentation variables across the batch. At minimum, the design pass must track and intentionally vary, where applicable:
- clothing;
- hairstyle arrangement;
- shoes;
- accessories;
- pose/action;
- viewpoint/shot size;
- scene/environment;
- weather/time/lighting.

Identity anchors remain fixed. Natural hair color and hairline remain identity anchors; hairstyle arrangement is a presentation variable.

A Worker MUST NOT satisfy a multi-image batch merely by changing the background and pose while keeping clothing, hairstyle, shoes, and accessories effectively unchanged across the series.

Before DESIGN_LOCK, the Worker must perform a batch diversity check. If the requested quantity is large, use a deliberate rotation/coverage plan rather than random repetition.

For realistic person-reference tasks, the design record must also explicitly contain:
- `REFERENCE_OUTFIT_POLICY`
- `REFERENCE_POSE_POLICY`

These fields must be resolved before DESIGN_LOCK.

The design record must contain an explicit `SHOES` field for wallpaper tasks where footwear is visible. Footwear must not be hidden inside the CLOTHING field when shoe variation is a requested series requirement.

### 9. Generation boundary

The Worker should use the following sequence:

`READ TASK → VERIFY ID → VERIFY DESIGN → VERIFY DESIGN DIVERSITY → VERIFY DESIGN LOCK → VERIFY FORMAT LOCK → VERIFY OUTPUT COUNT → SHOW PROMPT → GENERATE → VERIFY RESULT COUNT → VERIFY ACTUAL FORMAT → RECORD RESULT → CHECKPOINT → NEXT TASK`

A Worker must not start generation if the task identity, design, diversity, reference-decoupling policy, or required format cannot be safely resolved.

## 10. Prompt preview and session checkpoint

Universal Wallpaper ChatGPT-as-Worker production uses `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_PRODUCTION_SESSION.md` and persists resumable batch state using `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_BATCH_RECORD_SPEC.md`.

Before generation, the complete executable prompt for the current task must be shown to the user.

After each generation attempt, the result must be checkpointed before moving to another task.

Minimum logical result states: `NOT_STARTED`, `SUCCESS`, `FAILED`, `UNKNOWN`.

`UNKNOWN` requires recovery and must never be treated as success or silently regenerated.

The repository must not claim knowledge of an exact remaining ChatGPT quota unless that information is explicitly available from the platform.

A Worker must not claim QUOTA_LIMITED, RATE_LIMITED, or GENERATION_UNAVAILABLE without explicit platform evidence. If the Worker cannot verify the availability state, use UNKNOWN / RECOVERY_REQUIRED rather than inventing a quota or availability stop.

## 11. Automation requirement

Prompt instructions alone are not sufficient task-integrity controls.

The automation should enforce, when technically possible:

1. valid Task/Image ID;
2. one active owner per task;
3. DESIGN_LOCK;
4. FORMAT_LOCK;
5. EXPECTED_OUTPUT_COUNT = 1;
6. output-count validation;
7. terminal task-state recording.

Prompt-level instructions and automation-level validation should reinforce each other.

## 12. Recovery principle

When a task-integrity violation occurs, preserve the original task record and event history.

Do not silently rewrite history to make the result appear valid.

Examples:

- wrong IMAGE_ID → `INVALID_IMAGE_ID`
- wrong aspect ratio → record the actual result and let downstream task-compliance QA classify it
- multiple outputs → `OUTPUT_COUNT_MISMATCH`
- unknown generation state → `UNKNOWN / RECOVERY_REQUIRED`

A legitimate replacement task must receive a new task identity/design record.

\n## 13. Failure/recovery integrity\n\nFailure and recovery are governed by `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_FAILURE_RECOVERY_PROTOCOL.md`.\n\nAutomation must preserve failure history and enforce: FAILED retry without duplicate IMAGE_ID; three-consecutive-failure stop; UNKNOWN hard stop; ABANDONED identity immutability; and SUCCESS terminality.\n
## 14. Universal principle

**GitHub remembers the design. Workers execute the design. Automation validates the execution.**

Conversation memory is not the authoritative record for an existing wallpaper task.
