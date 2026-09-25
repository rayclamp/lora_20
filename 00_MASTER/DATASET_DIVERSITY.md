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
