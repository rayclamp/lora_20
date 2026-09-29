# GENERATION_RULES.md — Inaria Generation Rules

## Priority order
1. MASTER_IMAGE identity + visual reference match.
2. Anatomy and generation stability.
3. Explicit task requirements.
4. Pose / camera / composition.
5. Clothing / scene.
6. Lighting and decorative detail.
7. Dataset diversity and clothing distribution.

## Reference-first generation
Every image follows:
Official MASTER_IMAGE → Character + Visual Style Reference → current Prompt Package → controlled changes → generation

The official MASTER_IMAGE must be supplied as an actual image input, either through AUTO MODE or MANUAL MODE.

Preserve line-art language, face/eye rendering, hair rendering, proportions, coloring, shading, lighting language, and overall illustration finish.

Do not use a generic Japanese anime label as a substitute for reference matching.

## Reference verification
Before generation:
- confirm the actual reference image is available and visually inspectable;
- confirm it is the official age-20 INARIA_20_MASTER_v1.0.png;
- confirm no alternate identity reference has been substituted.

If any check fails, stop and do not generate.

## Mandatory style
Target: Japanese anime illustration matching the MASTER_IMAGE.

Do not generate photorealistic, photographic/live-action, 3D/CGI, semi-photorealistic, or another anime/manga/game/illustration style.

## Anatomy hard rules
Full authority: 00_MASTER/ANATOMY_STABILITY.md.

At minimum:
- exactly two hands and two legs;
- every visible hand exactly five fingers;
- every visible bare foot exactly five toes;
- correct left/right anatomy;
- traceable shoulder/arm/wrist/palm and hip/leg/ankle/foot connections;
- plausible center of gravity and support;
- no false limbs from clothing, props, straps, furniture, or background.

## Pose design
Choose stable, ordinary actions before decorative complexity.
- single-hand single-task;
- broad, natural object contact;
- avoid difficult fingertip grips when unnecessary;
- keep effects away from hands;
- keep important objects from overlapping hands;
- simplify props, bags, occlusions, and effects when they threaten anatomy.

## Hand/object and wearable rules
- Hand must visibly contact a held object.
- Handles must connect to the object and be naturally held.
- Bags/straps must connect to the bag and naturally contact the body.
- No floating, broken, disappearing, or body-penetrating straps.
- If a prop or wearable is nonessential and unstable, remove it.

## Local editing
For a local edit, change only the requested region when feasible. Preserve identity, style, lighting, color balance, composition, clothing, and background outside the target area unless explicitly instructed otherwise.

## Practical generation rule
A stable, simpler image is preferred over a visually elaborate but structurally unreliable image.


## Dataset diversity and clothing distribution

Follow the full rules in `00_MASTER/DATASET_DIVERSITY.md`.

Character identity and the official MASTER_IMAGE style remain stable, while clothing, hairstyle, action, pose, viewpoint, scene, and camera should vary deliberately across the production queue.

Do not make the original MASTER_IMAGE outfit the default outfit for most tasks. The reference outfit is a controlled identity baseline, not the required clothing for every generated image.

When creating batches, MASTER DIRECTOR should explicitly design clothing diversity and cross-variable variation while preserving anatomy and generation stability.

Production coverage must be tracked separately from final dataset quality. A processed/failed/safety-blocked task can complete Task Coverage without producing an IMAGE_CREATED candidate, and an IMAGE_CREATED candidate is not automatically a QA PASS.

## Age-20 animal and pet exclusion

The age-20 Inaria LoRA dataset is a **character-focused dataset**. Animals and pets are not part of Inaria's identity specification.

Unless a future task explicitly receives a new project-level exception from the MASTER DIRECTOR, generation tasks must exclude:
- cats / kittens;
- dogs / puppies;
- other pets;
- wildlife or prominently visible animals;
- animal companions positioned as a recurring character element.

This rule applies even when an animal is not requested in the task. Scene selection must therefore avoid animal-heavy environments when they materially increase the chance of an animal appearing beside Inaria.

The Worker must not intentionally add an animal because it makes the scene more decorative or natural.

For negative prompts, use explicit exclusion terms such as:
**cat, kitten, dog, puppy, pet, animal, wildlife, animal companion**.

If an animal nevertheless appears in a generated candidate, the Worker does not self-QA or regenerate solely because of that result; record the generation outcome normally and let downstream QA exclude it. Future replacement tasks must not repeat the animal-containing design.


## Hand topology and handedness

Do not reduce hand correctness to a five-finger count. Trace shoulder → upper arm → forearm → wrist → palm → fingers, verify the anatomical left/right side, and then verify finger structure. For BACK/BACK_3/4, never infer left/right from screen position. If the side cannot be established, the task/candidate requires REVIEW. A malformed wrist or palm is a hand failure even when five fingers are visible.


## LoRA framing and close-up generation

LoRA dataset production must not default to full-body composition.

When designing LoRA candidates, MASTER DIRECTOR must deliberately distribute framing across:
- CLOSE-UP: face / head-and-shoulders portrait;
- BUST / HALF-BODY;
- MEDIUM SHOT: waist-up, thigh-up, knee-up, or comparable medium framing;
- FULL-BODY.

CLOSE-UP and BUST/HALF-BODY are required dataset categories, not merely optional possibilities. A task that does not explicitly require full-body should not automatically become a full-body composition.

For close-up tasks, the prompt package should explicitly specify:
- SHOT_DISTANCE;
- FRAMING;
- VIEW;
- CHARACTER_SCALE;
- VISIBLE_BODY_AREA;
- CROP.

Example close-up specification:
- SHOT_DISTANCE: CLOSE;
- FRAMING: HEAD-AND-SHOULDERS or FACE CLOSE-UP;
- CHARACTER_SCALE: character occupies a large portion of the frame;
- VISIBLE_BODY_AREA: head, hair, shoulders, neck, and/or upper chest as specified;
- CROP: natural close portrait crop.

Close-up tasks should also explicitly exclude unintended distant/full-body composition when necessary, such as: do not use a full-body composition; do not place the character far from the camera; do not shrink the character to a small portion of the frame.

Hands and feet do not need to be visible in close-up or naturally cropped compositions. Anatomy QA applies to body parts actually visible in the image; natural cropping or reasonable occlusion of a non-visible body part is not itself an anatomy failure.

The purpose of framing diversity is to teach character identity at multiple visual scales, not to maximize the number of fully visible limbs.


## Full-body does not mean distant shot

FULL-BODY is a framing category, not a requirement for a distant camera.

A full-body image may use a close-to-medium camera distance and a large character scale while keeping the entire body visible. MASTER DIRECTOR should distinguish between:

- FULL-BODY + CHARACTER-DOMINANT: the entire body remains visible, while Inaria occupies approximately 70–85% of the frame; the background is secondary and supports the character presentation.
- FULL-BODY + ENVIRONMENTAL: the entire body remains visible but the character occupies a smaller portion of the frame so that the surrounding environment is a major visual element.

For character-focused wallpaper tasks, especially festival, seasonal, formalwear, kimono, costume, or accessory showcases, FULL-BODY + CHARACTER-DOMINANT is explicitly allowed and encouraged when it improves presentation of the complete outfit and visible anatomy.

Such tasks should specify, when relevant:
- SHOT_DISTANCE: CLOSE-MEDIUM or MEDIUM;
- FRAMING: FULL_BODY;
- CHARACTER_SCALE: LARGE or DOMINANT;
- CHARACTER_OCCUPANCY: approximately 70–85% of the frame;
- BACKGROUND_PRIORITY: secondary / atmospheric.

Do not interpret FULL_BODY as automatically meaning a distant environmental shot. Conversely, do not force a large-character full-body composition when the task is intentionally environmental or when a close-up/half-body framing is required for dataset diversity.


## Character-dominant wallpaper composition

Wallpaper composition must follow `00_MASTER/WALLPAPER_COMPOSITION.md`.

Do not interpret wallpaper format as requiring a small character or a full-body environmental shot. Both 9:16 and 16:9 may use large character-dominant close compositions.

Treat these as independent controls:
- FRAMING;
- CHARACTER_OCCUPANCY;
- SHOT_DISTANCE;
- CHARACTER_POSITION;
- VISUAL_FOCUS.

MASTER DIRECTOR should actively create close-up, head-and-shoulders, bust, 1/3-body, and half-body compositions when appropriate. In particular, BUST / 1/3-BODY / HALF-BODY with approximately 65–85% character occupancy are valid core wallpaper compositions.

Close-range images should be used to present facial features, face shape, eyes, hairstyle, expression, accessories, and upper clothing clearly. This is a wallpaper-aesthetic objective as well as a useful character-reference objective.

16:9 horizontal wallpapers may also use very large close portraits or half-body/1/3-body compositions. Horizontal format does not imply distant framing.

FULL-BODY remains valid but is not the automatic wallpaper default. FULL-BODY + CHARACTER-DOMINANT and FULL-BODY + ENVIRONMENTAL should be treated as distinct compositions.

The series planner must actively consider what the viewer should notice first rather than only how much of the body is visible.
