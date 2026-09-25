# DIVERSITY_INDEX.md — Inaria Creative Asset Index

## Purpose
Compact state index used by ACCOUNT_06 and future prompt-design workflows. This is the first-layer memory for diversity; full historical image review is not required for routine batch design.

## Core Principle
NEW material is preferred first. Once a category has no useful NEW material remaining, reuse is allowed. Reuse should create new combinations rather than repeating the previous visual structure.

## Priority
1. Pose diversity
2. Viewpoint / body-orientation diversity
3. Action diversity
4. Hand-configuration diversity
5. Hairstyle diversity
6. Clothing diversity
7. Scene diversity
8. Camera/composition diversity

## Current Pool State
All seed entries are NEW at initialization. No historical usage is inferred from prior images.

- Action: 40 NEW
- Pose: 20 NEW
- Viewpoint: 14 NEW
- Hairstyle: 10 NEW
- Clothing: 15 NEW
- Scene: 20 NEW
- Camera: 12 NEW
- Hand action: 12 NEW

## Batch Design Rules
- Do not create consecutive images with the same core action when avoidable.
- Do not disguise repeated actions by changing only clothing, hairstyle, or background.
- Near-equivalent actions count as one action family unless body configuration materially differs.
- A repeated scene is acceptable when pose/action/viewpoint are materially different.
- A repeated hairstyle or clothing item is acceptable when the overall visual structure is substantially different.
- Rear and rear 3/4 views are valid for LoRA production.
- LoRA dataset diversity rules override older wallpaper-specific restrictions when the task is explicitly LoRA production.
- All generation still follows MASTER_IMAGE identity/style rules and ANATOMY_STABILITY.

## Usage State Updates
After an asset is actually assigned to a generated image, move its state:
NEW → USED_ONCE → USED_FEW → OVERUSED / REUSE_ALLOWED as appropriate.

Do not mark an asset as USED merely because it was considered during brainstorming.

## Cross-Project Use
These pools are shared design resources. They may be referenced when creating:
- LoRA dataset tasks
- ComfyUI prompts
- Qwen Image prompts
- general Inaria illustration designs

Project-specific rules remain authoritative over generic pool entries.
