# LORA_IMAGE Dataset Design Specification

## Purpose and scope

Define the LoRA-specific image-design requirements for candidate training images. These rules apply to any subject selected for a current LORA_IMAGE request; they do not assume Inaria, a fixed age, a permanent identity, or a fixed rendering style.

This file supplements the shared CORE rules. It does not replace their full anatomy protocol, perform post-generation QA, or define a runtime/dispatch system.

## Subject and identity consistency

- Use the reference image uploaded for the current request as the sole visual identity authority.
- Keep the subject recognizably consistent with that reference across the requested set, including stable facial identity cues and natural body-proportion characteristics supported by the reference.
- Preserve apparent age unless the user explicitly requests an age change. Do not assume a fixed target age.
- Do not use diversity as a reason to redesign the person's identity, exaggerate facial/body features, or normalize the person toward unrelated character data.
- Unless the task explicitly requires otherwise, design one primary subject instance per image. Do not add a second independently readable version of the same subject merely for decoration.
- The current task defines the requested rendering style. Do not automatically import anime, realistic-photography, wallpaper, or festival styling from another module.
- The reference image establishes identity, not automatic permission to copy its pose, composition, clothing, accessories, or scene. Follow the current task and dataset variation requirements when designing those elements.

## Anatomy and generation stability

- All shared CORE drawing, anatomy, object-contact, and generation-stability rules are mandatory during prompt design.
- Stable anatomy and believable body mechanics take priority over complex action, decorative effects, or forced novelty.
- Design hands, feet, limb paths, clothing connections, and held-object contact with the shared CORE rules before adding background detail.
- Keep important anatomy visually readable against the background. Do not add effects or high-detail edges around fingers/toes when they reduce clarity.
- Maintain natural human proportions. Slimness or elegance must not become exaggerated leg length, stretched torso/limbs, or fashion-model proportions.
- Natural occlusion is acceptable. Do not contort a pose just to expose every digit; use simple, stable actions when a complex pose creates avoidable risk.
- Do not add animals or pets unless the current task explicitly permits them.
- Mirror/reflection compositions must obey the shared CORE mirror/reflection hard rule. Prefer a single readable subject instance.

## Composition and framing variety

The dataset must not consist entirely of full-body images. Close and medium framing are important training views, not optional exceptions. Use a purposeful range as appropriate to the subject, task, and overall dataset:

- FACE CLOSE-UP: face and facial features clearly visible.
- HEAD-AND-SHOULDERS / BUST: head, shoulders, neck, and upper clothing.
- HALF-BODY: upper body, often including waist and hand activity.
- MEDIUM / THREE-QUARTER: an intermediate crop such as thighs or knees upward.
- CHARACTER-DOMINANT FULL-BODY: the complete subject is visible and remains large and readable.
- ENVIRONMENTAL FULL-BODY: the complete subject appears in a wider setting when the environment adds useful context.
- DETAIL VIEWS may be used when they meaningfully document an identity-relevant or training-relevant feature, but must not replace a balanced range of views.

FULL-BODY does not mean distant framing. Do not make the subject a tiny figure in every full-body image. Conversely, do not make every image a close-up: full-body views still contribute posture, silhouette, limb, clothing, and footwear information.

- Include close-ups, busts, half-body, medium views, and full-body views across the dataset.
- Do not impose one universal numeric percentage for each framing category without evidence from the actual dataset.
- Do not fake close-up diversity by merely cropping or duplicating an existing full-body image. Design the shot for its intended framing and useful detail.
- Change framing together with other dimensions where useful; the dataset should not simply repeat the same pose and outfit at different crop sizes.
- Composition should be deliberate and subject-readable. Avoid a dataset made entirely of static, catalog-like standing poses.

## Viewpoint, pose, and body orientation

Across the dataset, deliberately explore useful viewpoint and pose diversity, including:

- front, front three-quarter, both side profiles, rear three-quarter, and full back views;
- head direction and torso direction that match or differ naturally;
- camera heights and viewpoints such as eye-level, modest high-angle, and modest low-angle;
- standing, sitting, walking, turning, leaning, crouching, kneeling, reclining, reaching, and other natural task-relevant poses;
- different weight distribution, arm positions, leg positions, and body orientation;
- natural interactions with furniture, objects, and the surrounding space.

Back views are valid and useful dataset candidates. Do not apply a blanket rule that the subject must always face the camera. Back views can contribute hair-back, garment-back, shoulder/back silhouette, and rear-view appearance information, even though they provide less direct facial information than front views.

Do not force every possible pose or angle into every batch. Diversity is a set-level goal, and stability and natural body mechanics remain mandatory.

## Expression, gaze, and action

- Where appropriate, vary expression and mood: neutral, smiling, focused, thoughtful, surprised, and other task-relevant expressions.
- Vary gaze direction, such as toward the camera, off-camera, upward, or downward, without changing identity.
- Vary head direction independently from body orientation where natural.
- Include varied meaningful activities and hand use, such as reading, writing, holding or using an object, using a phone, opening a door, or interacting with furniture.
- Not every image must prominently show both hands or feet. Natural occlusion is acceptable, but avoid a dataset that repeatedly uses only one simple hand/arm arrangement.
- Prefer clear, believable object contact and stable anatomy over complicated interactions added only for novelty.

## Clothing, hair, and accessories

- Vary actual garment type, cut, silhouette, layers, sleeve/neckline shape, material, and styling, not merely garment color.
- Across the dataset, consider casual, workwear, formalwear, dresses, sportswear, outerwear, seasonal clothing, and traditional or culturally specific clothing when suitable to the request.
- Vary hairstyles and arrangements where appropriate, including worn-down hair, tied hair, buns/updos, bangs, partings, and other styles compatible with the subject's identity.
- Accessories, eyewear, hats, bags, shoes, and other wearable items may vary; do not make any one accessory mandatory in every image.
- Do not automatically copy the reference image's clothes, hairstyle arrangement, pose, accessories, shoes, or background.
- Clothing and accessory variation must not be used as a reason to alter core identity cues or create implausible wear/contact.

## Scene, environment, lighting, and visual conditions

- Vary settings where useful: indoor and outdoor locations, homes, offices, shops, streets, parks, travel locations, and other scenes relevant to the task.
- Consider time of day, weather, season, light direction/softness, indoor lighting, background depth, and depth of field where appropriate.
- Vary the subject's position in the scene and interaction with nearby objects, furniture, and the environment.
- Scene changes should contribute useful context, not merely swap a background behind an otherwise duplicated image.
- Do not let one lighting setup, background type, color cast, or camera look dominate the whole dataset when other useful conditions are available.
- Do not import wallpaper or festival scene requirements unless explicitly requested by the current LORA_IMAGE task.

## Dataset-level diversity and coverage

Evaluate diversity across the complete set and, when prior outputs are available, across previous batches—not just one image at a time.

- Consider pose, viewpoint, framing, body orientation, expression/gaze, action, outfit, hairstyle, accessories, scene, lighting, weather/season, and composition together.
- Avoid repeating the same combination of pose/action, viewpoint, framing, outfit, and scene in nearby candidates without a meaningful reason.
- Color-only changes or minor decorative edits do not count as sufficient diversity when the underlying image contributes essentially the same training information.
- If the existing set already contains many front-facing full-body standing images, prioritize useful missing views such as close portraits, busts, half-body views, profiles, rear three-quarter/back views, seated or moving poses, and different outfits or environments.
- When the set has many close portraits but lacks posture or clothing information, prioritize medium and full-body views instead.
- Treat these examples as adaptive priorities, not a fixed production order or a rigid quota.
- Do not set universal fixed percentages for each view or variation dimension without inspecting the actual dataset and establishing a reason for those targets.
- Do not create unnecessary near-duplicates merely to fill a category. Prefer candidates that add distinct, useful information.
- Dataset diversity is cumulative: not every image needs to change every dimension, but the set should not become trapped in a small number of repeated visual patterns.


## Stable character traits versus allowed variation

A useful LoRA dataset must preserve the same subject while varying presentation. Do not confuse anatomical plausibility with character-shape fidelity.

### Traits to preserve when supported by the reference
- recognizable facial identity and apparent age;
- overall body build and the relative shape/width of shoulders, arms, torso, waist, pelvis/hips, thighs, calves, ankles, and wrists;
- natural relationships among body regions, including limb-to-torso and thigh-to-calf relationships;
- the current task's coherent rendering style and level of realism.

### Traits that may vary with the task
- pose, weight distribution, body orientation, camera viewpoint, and framing;
- clothing, accessories, footwear, hairstyle arrangement, and scene;
- expression, gaze, lighting, and environmental conditions.

Allowed variation must not become an excuse for unexplained changes to stable traits. Pose and perspective can alter visible contours; assess the underlying build in context rather than demanding pixel-identical silhouettes.

### Candidate-level versus dataset-level suitability
A candidate can be anatomically plausible and individually attractive but still be unsuitable for a same-person training set if it materially departs from the reference-supported build or core identity. Conversely, a different apparent contour caused by a clearly different pose, perspective, or occlusion is not automatically a failure.

Use the independent IMAGE_QA rules for acceptance. Generation workers must not self-QA, reject, repair, or regenerate completed candidates.

## Candidate-design intent and QA separation

Design each candidate to contribute useful training information: clear identity evidence, understandable anatomy, deliberate framing, meaningful presentation, or a distinct but coherent variation. Prefer a simpler stable composition when extra visual complexity does not materially improve dataset coverage.

These are design-time requirements. Final image acceptance, PASS/REVIEW/REPAIR/REJECT classification, and any repair decision belong to the separate IMAGE_QA system when it is explicitly activated.
