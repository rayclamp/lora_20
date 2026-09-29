# DATASET_DIVERSITY.md — Inaria LoRA Dataset Diversity Rules

## Purpose

This document defines how MASTER DIRECTOR should design production tasks for the Inaria age-20 LoRA dataset.

The goal is not to make every generated image succeed. The goal is to create a large pool of diverse candidate images from which downstream QA can select a balanced, high-quality training dataset.

## Core principle

**Identity should remain stable; non-identity attributes should deliberately vary.**

Keep stable:
- Inaria character identity and recognizability.
- Official MASTER_IMAGE visual style.
- Core facial/eye/hair identity characteristics.
- Anatomical and generation-stability standards.

Deliberately vary:
- clothing;
- hairstyle;
- action;
- pose;
- viewpoint;
- scene;
- camera/composition;
- appropriate accessories;
- everyday context.

## Clothing diversity rule

Clothing is a major dataset variable and must not accidentally become a dominant identity feature.

Do not design a large majority of the production queue using the exact original MASTER_IMAGE outfit.

The original/reference outfit remains useful as a character baseline, but it should be a controlled minority of the eventual training dataset unless a later experiment explicitly requires otherwise.

When designing a batch, MASTER DIRECTOR should actively distribute clothing across clearly different categories, such as:
- original/reference outfit;
- casual daily wear;
- seasonal wear;
- work/formal wear;
- homewear;
- date/social outfits;
- other simple, identity-safe outfits.

Exact ratios are not mandatory. The distribution should be balanced enough that the LoRA can learn **Inaria as the character**, rather than learning a particular outfit as an inseparable identity feature.

## Cross-variable variation

Do not merely change clothing while keeping the same pose, hairstyle, camera, and scene.

Where generation stability permits, combine clothing variation with controlled variation in:
- hairstyle;
- action;
- pose;
- viewpoint;
- environment.

Avoid accidental duplication where several tasks differ only cosmetically.

## Stability overrides diversity

Diversity must never override anatomy or generation stability.

If a clothing concept, accessory, pose, or scene creates excessive hand/foot/limb/occlusion risk:
1. simplify it;
2. replace the risky element with a safer variant; or
3. remove it.

The project prefers a stable, clearly readable candidate over a complicated but unreliable design.

## Production coverage versus dataset acceptance

A production task being processed does not mean its image is suitable for LoRA training.

Track these concepts separately:

- **Task Coverage:** the production account has attempted the assigned design task and the task has reached a terminal production outcome.
- **Generation Attempt:** an actual image-generation invocation/result was made for a task.
- **IMAGE_CREATED:** a generation candidate was returned successfully under the Worker protocol.
- **Unique Candidate:** a candidate that adds a non-duplicate image to the candidate pool.
- **QA PASS:** downstream QA determines the candidate is suitable for the dataset.

A failed or safety-blocked design still counts as processed Task Coverage for that production round. It does not count as an IMAGE_CREATED or QA PASS.

A duplicate candidate may count as an IMAGE_CREATED generation event if generation succeeded, but it should not be counted as a new Unique Candidate.

## Batch replacement principle

If a design is:
- generation-tool failed;
- safety-blocked;
- otherwise unusable; or
- produces a duplicate candidate,

do not become permanently attached to that original task.

MASTER DIRECTOR should normally create a new legitimate replacement design in a later batch rather than repeatedly forcing the same failed design.

The production pipeline should move forward:

**design → attempt → record outcome → replace weak/blocked/duplicate coverage with new design → continue**

## Recommended dataset direction

For a first serious Inaria age-20 LoRA dataset, the project should aim for a final QA-approved dataset with meaningful variation rather than a fixed number of visually similar images.

A practical initial target may be approximately **60–80 QA-approved images**, while maintaining a larger candidate pool upstream. This is a planning guideline, not a hard training requirement.

The final dataset size and distribution should be adjusted after the first LoRA training/test cycle based on observed strengths and missing coverage.

## Secondary-character and animal exclusion

Dataset diversity must vary **Inaria's non-identity attributes**, not introduce recurring secondary characters.

For the age-20 Inaria LoRA dataset, do not intentionally include:
- cats / kittens;
- dogs / puppies;
- other pets;
- prominent wildlife;
- recurring animal companions.

Animals can create an unintended association between the Inaria concept and a secondary visual concept. They can also introduce extra anatomy, occlusion, hand/object interaction, and scene noise.

Therefore animal-free scenes are the default. A future exception requires an explicit MASTER DIRECTOR project-level decision rather than an individual Worker adding an animal for decoration.


## Current anatomy-diversity requirement
Hand diversity must not be created by increasing structural complexity. Prefer different stable hand configurations while preserving clear left/right identity, palm/wrist topology, finger readability, and background separation. BACK/BACK_3/4 viewpoints are valid dataset diversity; they require stricter handedness verification, not automatic exclusion.


## Framing-distance diversity requirement

Framing is a first-class LoRA dataset variable. The production queue must contain meaningful variation in visual scale and framing distance rather than drifting toward full-body images.

MASTER DIRECTOR must actively design a mixture of:
- CLOSE-UP / FACE;
- HEAD-AND-SHOULDERS;
- BUST / HALF-BODY;
- MEDIUM SHOT;
- FULL-BODY.

Do not treat framing diversity as satisfied merely because some tasks are technically half-body. True close-up portrait tasks must be deliberately created.

For each close-up task, define explicit framing controls such as SHOT_DISTANCE, FRAMING, CHARACTER_SCALE, VISIBLE_BODY_AREA, and CROP. When needed, add negative constraints against distant, small-in-frame, or full-body composition.

Full-body images remain valuable, but they are not the default representation of an Inaria LoRA candidate. Hand/foot inspection requirements must never force every task toward full-body framing.

A close-up candidate can be valid and valuable even when hands and feet are outside the frame. QA should judge only visible anatomy and should not penalize natural framing crops or reasonable occlusion of body parts that are not visible.


## Full-body scale diversity

FULL-BODY does not automatically mean a distant or environment-dominant composition.

MASTER DIRECTOR should distinguish between:
- **FULL-BODY + CHARACTER-DOMINANT:** entire body visible, character occupies approximately 70–85% of the frame, background remains secondary;
- **FULL-BODY + ENVIRONMENTAL:** entire body visible, but the character occupies a smaller portion of the frame and the environment is a major visual element.

Both are valid dataset compositions. Character-dominant full-body framing is especially useful when clothing, complete outfit construction, accessories, posture, or visible anatomy are important.

When appropriate, tasks may explicitly define:
- SHOT_DISTANCE: CLOSE-MEDIUM / MEDIUM;
- FRAMING: FULL_BODY;
- CHARACTER_SCALE: LARGE / DOMINANT;
- CHARACTER_OCCUPANCY: approximately 70–85%;
- BACKGROUND_PRIORITY: secondary / atmospheric.

This rule prevents the framing-diversity requirement from accidentally eliminating the large-character full-body composition that is useful for character-focused images and wallpapers.


## Character-dominant composition coverage

Composition diversity must include more than full-body versus close-up. FRAMING and CHARACTER_OCCUPANCY are independent variables.

The production pool should deliberately include valid combinations such as:
- BUST + 65–85%;
- 1/3-BODY + 70–85%;
- HALF-BODY + 65–85%;
- FULL-BODY + 65–85% character-dominant;
- FULL-BODY + smaller environmental scale.

Large-character compositions are valuable because they expose facial identity, face shape, eyes, hairstyle, expression, accessories, and upper clothing at a useful visual scale. Do not let anatomy inspection requirements force every candidate toward full-body framing.

For wallpaper-oriented candidates, both 9:16 and 16:9 should be allowed to contain large character-dominant portraits. Horizontal format must not be treated as an automatic distant/environmental composition.

The diversity goal is not equal numeric distribution. The goal is meaningful variation in how Inaria is visually presented. A batch that contains many full-body environmental images but almost no large half-body/1/3-body/close compositions should be treated as compositionally incomplete even if the clothing and scenes are diverse.

See 00_MASTER/WALLPAPER_COMPOSITION.md for the full character-dominant wallpaper composition system.
