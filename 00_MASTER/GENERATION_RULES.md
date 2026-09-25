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
