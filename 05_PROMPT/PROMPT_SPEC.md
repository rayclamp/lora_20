# Inaria AI Studio — Generation / Dataset Department Specification

- **Department:** ⑤ Prompt / AI Generation — Generation / Dataset
- **Version:** v001
- **Last Updated:** 2026-09-05
- **Purpose:** Define the reproducible workflow for converting approved upstream character, clothing, scene, and pose/camera designs into generated images and a clean LoRA training dataset. This document governs generation, validation, repair, rejection, metadata, naming, and final dataset assembly. It does not redefine character identity or other departments' core settings.

---

## 1. Scope and authority

This department converts approved upstream specifications into practical generation packages for workflows such as ComfyUI, SDXL, Qwen, LoRA, ControlNet, and IP-Adapter.

### 1.1 Source-of-truth hierarchy

1. `00_MASTER/` stable project rules
2. Approved upstream design outputs for the current production task
3. This department specification
4. Generation-specific implementation choices

Generation implementation must never silently override a higher-level rule.

### 1.2 Non-modification rule

This department must not independently change:

- locked character identity
- approved age/reference identity
- approved body proportions
- approved clothing design
- approved scene design
- approved pose/camera design
- stable MASTER rules

If two approved sources conflict, mark the item **NEEDS SIXTH INTEGRATION ACCOUNT DECISION** and do not silently choose a winner.

---

## 2. Complete image-generation workflow

### Phase A — Intake

Before generation, collect and freeze the approved inputs:

- Character specification
- Character reference image(s)
- Clothing specification
- Scene specification
- Pose/camera specification
- Required aspect ratio
- Required generation model/workflow, if already specified
- Approved upstream version identifiers

Create a generation job ID before producing images.

### Phase B — Prompt assembly

Build the prompt from independent modules rather than writing an uncontrolled free-form prompt. Keep identity information separate from temporary clothing, scene, and pose information.

Recommended order:

1. Trigger / identity anchor
2. Character module
3. Clothing module
4. Scene module
5. Pose module
6. Camera / composition module
7. Lighting / visual-style module
8. Quality/stability constraints

### Phase C — Reference conditioning

When references are approved for the task, apply them according to their intended role:

- **Identity reference:** preserves facial identity, hair/appearance identity, and other locked character traits.
- **Pose reference / ControlNet:** controls approved body pose or composition without redefining identity.
- **Style/reference image / IP-Adapter:** use only when its role has been explicitly approved.
- **Clothing or scene reference:** use only to reproduce approved design information.

Do not allow a reference intended for one module to silently redefine another module.

### Phase D — Controlled generation

Generate in controlled batches. Keep model, LoRA, conditioning, seed, sampler, resolution, and major workflow parameters recorded for every candidate.

Use stable poses and compositions whenever equivalent approved alternatives exist. Do not add unnecessary finger complexity, visual effects around hands/feet, or background elements that interfere with anatomy.

### Phase E — Candidate inspection

Every candidate is inspected before entering the dataset. Inspect at minimum:

- identity consistency
- face and eyes
- hair
- body proportions
- hands/fingers
- feet/toes
- limb/joint plausibility
- clothing integrity
- scene correctness
- unwanted objects/limbs
- artifacts, text, logos, and watermarks
- overall sharpness and rendering quality

### Phase F — Classification

Assign one of:

- **PASS** — dataset-eligible
- **REPAIR** — potentially useful but contains a localized correctable defect
- **REJECT** — unsuitable for dataset use

Record the reason and defect location.

### Phase G — Repair

Only repair localized defects when the underlying identity, pose, clothing, and composition remain valid. Prefer localized editing/inpainting over regenerating the entire image when technically feasible.

After repair, run the full inspection again. A repaired image is not automatically a PASS.

### Phase H — Dataset assembly

For every final PASS:

1. assign final filename
2. preserve the final image
3. create/update its caption
4. attach metadata
5. verify uniqueness and variation balance
6. run final dataset QA
7. move/copy only approved final assets into the training set

---

## 3. Prompt composition architecture

Prompts must be modular and reproducible.

### 3.1 Character module

Contains only approved identity information required for the current task, such as:

- trigger word
- approved age/reference identity
- locked facial identity traits
- approved hair/appearance traits
- approved body-proportion information when needed

Do not add new character traits merely to make the prompt more descriptive.

### 3.2 Clothing module

Contains only the approved clothing specification:

- garment type
- material/fabric when approved
- color
- silhouette
- details
- accessories
- footwear

Clothing must remain independent from identity conditioning so that the dataset does not accidentally bind identity to one outfit.

### 3.3 Scene module

Contains:

- location/environment
- season/time/weather when approved
- major environmental objects
- background structure
- atmosphere

Avoid unnecessary background detail that competes with anatomy or creates repeated dataset artifacts.

### 3.4 Pose module

Contains:

- body position
- arm/hand placement
- leg/foot placement
- facial expression if approved as part of the pose design
- interaction with props

Prefer anatomically simple and generation-stable actions.

### 3.5 Camera/composition module

Contains:

- shot size
- viewpoint
- camera angle
- framing
- subject placement
- orientation
- aspect ratio
- depth-of-field instructions when approved

### 3.6 Lighting/style module

Use the approved project art direction. Current MASTER direction emphasizes a romantic, refined, dreamy Japanese-inspired atmosphere, delicate light/shadow, natural-looking translucent skin texture, clean detailed rendering, and believable anatomy. fileciteturn4file0L2-L2

Do not convert this into an unapproved character redesign or force a palette when a task specifies another palette.

### 3.7 Prompt implementation

The same conceptual modules may be implemented differently for SDXL, Qwen, ComfyUI, or other systems. Implementation syntax may change; approved design meaning must not.

---

## 4. Negative Prompt architecture

Negative prompts are organized into independent groups so they can be enabled or disabled according to the model/workflow.

### Group A — Anatomy

- extra fingers
- missing fingers
- fused fingers
- duplicated fingers
- malformed hands
- extra arms
- extra legs
- duplicated limbs
- missing limbs
- malformed feet
- missing toes
- fused toes
- duplicated toes
- anatomically impossible joints
- unnatural limb deformation

### Group B — Face / identity quality

- facial deformation
- asymmetrical or malformed eyes
- distorted facial features
- identity drift
- inconsistent facial structure

Do not use negative terms that suppress an approved identity trait.

### Group C — Image quality

- low quality
- blur
- excessive smoothing
- noisy or broken rendering
- severe artifacts
- plastic-looking skin
- over-processed AI appearance

### Group D — Unwanted content

- text
- watermark
- logo
- unintended signage when not part of the approved scene
- unrelated people
- unwanted objects

### Group E — Generation stability

Add model-specific failure terms only when they have been observed in the selected workflow. Do not create a large generic negative list that unnecessarily suppresses valid outputs.

The core exclusions above are consistent with the project art-style and generation rules. fileciteturn4file0L2-L2 fileciteturn5file0L2-L2

---

## 5. Four-module combination system

Each image is treated as:

`CHARACTER + CLOTHING + SCENE + POSE/CAMERA`

with lighting/style and generation controls layered around the four primary modules.

### Combination rule

- Character is the identity anchor.
- Clothing is a variable appearance module.
- Scene is an environmental variable.
- Pose/camera is an action/composition variable.

The same character should be capable of appearing across multiple clothing, scene, and pose combinations without identity being dependent on any one combination.

### Dataset balancing rule

Do not repeatedly pair the same character appearance with the same clothing, scene, pose, camera angle, or background. Variation should be deliberate and traceable to approved upstream designs.

If upstream specifications do not provide enough variation, do not invent new locked character details. Request additional approved design input.

---

## 6. Image naming convention

Use a deterministic, sortable filename:

`INR20_<SET>_<IMG>_<CHAR>_<CLOTH>_<SCENE>_<POSE>_<STATUS>_v###.<ext>`

Example:

`INR20_S01_001_C01_CL03_SC02_P04_PASS_v001.png`

### Field definitions

- `INR20` — project/identity dataset prefix
- `SET` — generation batch or dataset set
- `IMG` — zero-padded image sequence
- `CHAR` — character module ID
- `CLOTH` — clothing module ID
- `SCENE` — scene module ID
- `POSE` — pose/camera module ID
- `STATUS` — `PASS`, `REPAIR`, or `REJECT`
- `v###` — asset version

Do not encode unapproved assumptions into filenames.

If a field is not applicable, use the project's documented neutral token rather than inventing a new meaning.

---

## 7. Dataset folder structure

Recommended repository/workspace structure:

```text
05_PROMPT/
├── PROMPT_SPEC.md
├── README.md
├── packages/
│   └── <job_or_set>/
│       ├── prompts/
│       ├── workflows/
│       ├── references/
│       ├── metadata/
│       └── handoff/
└── dataset/
    └── INR20/
        ├── 00_INTAKE/
        ├── 01_GENERATED/
        │   ├── PASS/
        │   ├── REPAIR/
        │   └── REJECT/
        ├── 02_REPAIRED/
        ├── 03_FINAL/
        ├── 04_CAPTIONS/
        ├── 05_METADATA/
        └── 06_QA/
```

Actual large image binaries should remain in the project's approved storage location if repository policy does not permit storing generated image assets directly in Git. This specification does not override repository storage policy.

---

## 8. Image quality grading

### Grade A — Dataset Ready

- Identity clearly consistent
- Face and hair correct
- Body proportions believable
- Hands and feet anatomically acceptable
- Clothing correct
- Scene correct
- Pose/camera correct
- No significant artifacts
- No unwanted text/watermark/logo
- Sufficient visual quality for training

**Eligible for final dataset after QA.**

### Grade B — Repairable

- Identity is still valid
- Main design is valid
- Defect is localized and technically repairable
- Repair is unlikely to change the identity or intended design

**Not directly eligible; send to Repair.**

### Grade C — Reject

Any major failure, including:

- identity drift
- severe facial deformation
- major body/proportion failure
- severe hand/foot anatomy failure
- extra or missing limbs
- clothing fundamentally wrong
- scene fundamentally wrong
- pose/composition fundamentally wrong
- extensive artifacts
- unusable resolution/quality
- repeated failure that cannot be localized safely

**Never place in the final LoRA dataset.**

---

## 9. PASS / REPAIR / REJECT decision rules

### PASS

Pass only when all locked requirements are satisfied and no major defect remains.

### REPAIR

Repair when:

1. the intended image is otherwise valid;
2. the problem is localized;
3. the repair target can be isolated;
4. repair can preserve identity, clothing, scene, and composition.

Typical repair targets:

- individual fingers
- small hand/foot defects
- minor clothing artifact
- small background artifact
- localized object artifact

The project generation rules explicitly require local edits to change only the requested region whenever technically feasible. fileciteturn5file0L2-L2

### REJECT

Reject rather than repair when the defect is systemic, widespread, or likely to require redesign/regeneration.

Examples:

- wrong face/identity
- wrong body structure
- multiple malformed limbs
- fundamentally incorrect pose
- fundamentally incorrect outfit
- fundamentally incorrect scene
- extensive visual corruption

---

## 10. Image repair workflow

1. Preserve the original candidate unchanged.
2. Record the defect and bounding region in metadata.
3. Determine whether local repair is appropriate.
4. Use an approved editing/inpainting workflow.
5. Lock unaffected areas whenever technically feasible.
6. Repair only the target region.
7. Re-run anatomy and identity inspection.
8. Compare repaired image against the original and approved design.
9. Assign a new asset version.
10. Mark `REPAIR -> PASS` only after complete QA.

For hand/foot repairs, preserve the original palm/wrist/arm or leg/ankle structure when those regions are not part of the defect. Avoid introducing new background or clothing changes during a local anatomy repair.

---

## 11. Final LoRA Dataset整理流程

### Step 1 — Candidate collection

Collect all generated candidates with immutable job IDs.

### Step 2 — Automated/basic screening

Remove obvious failures such as corrupted files, unusable resolution, blank outputs, severe artifacts, or known forbidden elements.

### Step 3 — Human/visual QA

Perform identity, anatomy, clothing, scene, pose, and quality checks.

### Step 4 — Repair pass

Repair only localized defects classified as REPAIR.

### Step 5 — Reclassification

Every repaired image is evaluated again as if it were a new candidate.

### Step 6 — Deduplication

Remove near-duplicates that provide little additional identity or variation information.

### Step 7 — Variation audit

Check whether the final set overrepresents one:

- hairstyle
- outfit
- color
- scene
- pose
- camera angle
- expression
- framing
- lighting condition

If variation is insufficient, report the gap upstream rather than inventing new character settings.

### Step 8 — Caption audit

Ensure every final image has a caption tied to the correct image and module IDs. Captions must describe actual visible variation and use the approved trigger convention when specified by the project.

### Step 9 — Metadata audit

Verify model, workflow, seed, references, LoRA/ControlNet/IP-Adapter settings, prompt versions, and QA status are recorded.

### Step 10 — Final integrity check

Confirm:

- every final image has one corresponding caption;
- every final image has metadata;
- filenames are unique;
- no REPAIR/REJECT asset is accidentally included;
- source images remain traceable;
- approved upstream versions are recorded.

### Step 11 — Director handoff

Deliver a versioned handoff containing:

- final dataset count
- PASS/REPAIR/REJECT statistics
- unresolved issues
- variation audit
- prompt package version
- workflow version
- metadata completeness
- items requiring Director / sixth-account decision

---

## 12. Per-image metadata

Each generated or repaired image should have a metadata record containing, at minimum:

```yaml
asset_id: INR20_S01_001
filename: INr20_S01_001_C01_CL03_SC02_P04_PASS_v001.png
project: lora_20
identity: inaria
identity_age: 20
character_module: C01
clothing_module: CL03
scene_module: SC02
pose_camera_module: P04
status: PASS
grade: A
source_reference_ids: []
prompt_package_version: v001
positive_prompt_version: v001
negative_prompt_version: v001
model_family: ""
model_version: ""
vae: ""
loras: []
controlnet: []
ip_adapter: []
workflow_id: ""
workflow_version: ""
seed: null
sampler: ""
steps: null
cfg: null
width: null
height: null
repair_parent_asset_id: null
repair_region: null
qa_notes: ""
qa_reviewer: ""
created_at: ""
```

The exact fields may be extended for a specific workflow, but existing project identifiers and approved upstream information must remain traceable.

**Filename spelling note:** the canonical prefix is `INR20`; metadata examples must use the same canonical spelling. Any conflicting legacy filename convention requires review rather than silent normalization.

---

## 13. Model/workflow implementation guidance

### SDXL

Use modular positive/negative prompt blocks and record all generation parameters. Identity references should be handled through the approved LoRA/reference-conditioning strategy rather than adding uncontrolled descriptive identity text.

### Qwen

Use the same conceptual modules but adapt wording to the selected Qwen image workflow. Do not assume SDXL prompt weighting syntax is valid for Qwen.

### LoRA

Keep the identity LoRA's trigger and strength separate from temporary design variables. Dataset images should contain enough variation that identity is not inseparably tied to one outfit, background, or pose.

### ControlNet

Use ControlNet for approved structural constraints such as pose or composition when appropriate. Control strength must be recorded. Excessive control that damages identity or appearance should be flagged during QA.

### IP-Adapter

Use only for an approved reference-conditioning purpose. Record reference image identity, adapter type, weight, and relevant preprocessing settings.

### ComfyUI

Save the reproducible workflow or workflow identifier whenever possible. Record model, nodes/conditioning relevant to identity, seeds, and major sampler settings in metadata.

---

## 14. Stability rules for hands and feet

The project prioritizes generation stability over unnecessarily complex gestures. Hands and feet must be planned with model reliability in mind. Important background objects should not overlap hands when avoidable, and busy effects should not be placed around fingers or toes. fileciteturn3file0L2-L2 fileciteturn4file0L2-L2

Generation order should conceptually prioritize:

1. identity correctness
2. anatomy/stability
3. approved body/pose structure
4. clothing
5. scene and effects

This follows the project's priority order rather than optimizing for visual spectacle. fileciteturn5file0L2-L2

---

## 15. Conflict handling

When specifications disagree, use the following status:

> **NEEDS SIXTH INTEGRATION ACCOUNT DECISION**

Record:

- conflicting source documents/design versions
- exact conflicting requirements
- affected generation module
- practical generation impact
- recommendation, if useful, clearly labeled as a recommendation rather than a decision

Do not resolve a cross-department conflict by silently changing a MASTER rule or upstream design.

---

## 16. Required generation package contents

A completed generation package should contain:

```text
<job_or_set>/
├── prompts/
│   ├── positive_v001.txt
│   ├── negative_v001.txt
│   └── prompt_manifest_v001.md
├── workflows/
│   └── workflow_v001.json_or_equivalent
├── references/
│   └── reference_manifest_v001.md
├── metadata/
│   └── metadata_v001.json_or_equivalent
└── handoff/
    └── HANDOFF_v001.md
```

The exact workflow file format depends on the generation platform.

---

## 17. Handoff requirements to Director / QA

The final handoff must state:

- generation package version
- dataset version
- number of candidates
- PASS count
- REPAIR count
- REJECT count
- final dataset count
- model/workflow used
- LoRA/reference-conditioning configuration
- known weaknesses
- unresolved conflicts
- items needing sixth-account integration

No unresolved conflict may be hidden inside a prompt.

---

## 18. Current project-state note

At the time of this specification's creation, `PROJECT_MASTER.md` reports that no active production task has been registered and the Character, Clothing, Scene, Pose/Camera, Prompt/Generation, and Director/QA stages are marked `NOT STARTED`. fileciteturn2file0L2-L2

Therefore, this document defines the **generation/Dataset operating standard**, not a completed production prompt set or a final dataset assignment.

---

## 19. Change control

This file is a department specification and must not be used to modify stable character or project rules. Permanent project-rule changes belong to the Director and, when approved, may be promoted into `00_MASTER/` by the project owner/director. fileciteturn2file0L2-L2

Department revisions must use versioned releases (`v002`, `v003`, etc.) and must preserve traceability to the previous version.
