# LORA_IMAGE Dataset Diversity Rules

## Goal

Build a useful, varied training set without weakening identity consistency or generation stability. Variation should be purposeful rather than random. Optimize for meaningful coverage across the whole dataset, not novelty in every single image.

## Core variation dimensions

Across a set of tasks and, when available, across previous batches, consider varying the following dimensions:

1. **Pose and body mechanics:** standing, sitting, walking, turning, leaning, crouching, kneeling, reclining, reaching, and other natural actions.
2. **Viewpoint and orientation:** front, front three-quarter, side profiles, rear three-quarter, full back views, head direction, torso direction, and camera height.
3. **Shot size and framing:** face close-up, head-and-shoulders/bust, half-body, medium/three-quarter, character-dominant full-body, and environmental full-body.
4. **Expression and gaze:** neutral, smiling, focused, thoughtful, other appropriate expressions, and different gaze directions.
5. **Action and interaction:** hand activity, held objects, furniture interaction, and natural engagement with the environment.
6. **Clothing and silhouette:** garment type, cut, layers, material, shape, seasonal style, and appropriate cultural/traditional clothing.
7. **Hair and accessories:** hairstyle arrangement, parting, tied/worn-down styles, hats, eyewear, bags, shoes, and other accessories as relevant.
8. **Scene and environment:** indoor/outdoor locations, different settings, subject placement, foreground/background relationships, and environmental interaction.
9. **Lighting and conditions:** time of day, light direction and softness, weather, season, indoor illumination, and background depth.
10. **Camera and composition:** camera height, perspective, subject scale/placement, depth of field, and composition.

The current uploaded reference remains the sole visual identity authority. Vary presentation without arbitrarily changing stable identity cues, apparent age, or body proportions.

## Framing balance: close-ups matter

- The dataset must not consist entirely of full-body images.
- Close-up portraits, busts, half-body views, medium views, and full-body views each provide different information and should all be considered.
- Close views contribute facial identity and feature detail; bust/half-body views contribute hair, neck/shoulder, upper clothing, and hand-action information; medium/full-body views contribute posture, silhouette, limbs, outfit structure, and footwear.
- Full-body does not mean distant: keep the subject large and readable when the purpose is to show the subject.
- Do not manufacture close-up variety by merely cropping or duplicating a full-body image. Plan a composition that suits the intended shot size.
- Do not impose fixed percentages for shot sizes without inspecting the actual dataset and having a grounded reason.

## Back views and angle coverage

- Back views, rear three-quarter views, side profiles, and front views are all valid candidates.
- Do not impose a blanket requirement that the subject always face the camera.
- Back views may contribute useful information about hair, garment construction, shoulder/back silhouette, and rear-view appearance; they are complementary to, not replacements for, facial views.
- Vary head direction and torso direction independently when natural and useful.

## Avoid superficial variation and near-duplicates

- Do not repeat the same main action across nearby tasks without a meaningful reason.
- Avoid batches in which background, pose/action, outfit, viewpoint, and framing are effectively identical.
- Avoid producing multiple images that differ only by minor decorative details while contributing nearly the same training information.
- Color changes alone are not sufficient diversity when the underlying composition, action, and outfit silhouette remain duplicates.
- Do not count a different crop of the same image as a fully new composition.
- Scene changes should add useful context or interaction rather than simply replace the background.
- Do not use extreme poses, difficult hand gestures, exaggerated perspective, or complex props merely to make images look different.

## Dataset-level coverage and adaptive planning

- Diversity is a set-level and cumulative goal, not a requirement that every image vary every dimension.
- If existing records or images are available, review their coverage before planning more candidates.
- When front-facing full-body standing images dominate, prioritize missing views such as close portraits, busts, half-body, side profiles, rear three-quarter/back views, seated or moving poses, and distinct clothing or environments.
- When close portraits dominate, prioritize medium/full-body images and varied posture, limbs, clothing, and footwear.
- When one outfit, hairstyle, scene, lighting condition, or action dominates, prioritize meaningful alternatives.
- Use these as adaptive planning examples, not rigid sequencing rules or quotas.
- If existing dataset records are unavailable, design a varied set from the current request rather than claiming to know its coverage.
- Do not create redundant images simply to satisfy a category checklist. Prefer images that add distinct, useful training information.


## Stable traits must remain stable while presentation varies

Diversity is not permission to redesign the subject. Across the dataset, preserve the same reference-supported identity, apparent age, overall build, and relative body-region shapes while varying pose, viewpoint, framing, clothing, hairstyle arrangement, scene, and lighting as appropriate.

When reviewing the set:
- look for unexplained drift in face shape, facial feature relationships, apparent age, shoulder/arm width, torso/waist width, hip silhouette, thigh/calf thickness, ankle/wrist thickness, and overall build;
- distinguish genuine body-shape drift from reasonable pose-dependent changes, foreshortening, perspective, occlusion, and clothing effects;
- do not use a generic idealized, athletic, curvy, or fashion-model body as the normalization target;
- do not force identical silhouettes across different poses or require every image to expose every body region;
- prioritize additional candidates that fill useful coverage gaps without amplifying an already-observed identity or body-shape inconsistency.

Dataset-level diversity and consistency are complementary constraints: maximize useful presentation variety only while keeping the subject's stable traits coherent.

## Priority order

1. Preserve the reference subject's identity and apparent age unless explicitly requested otherwise.
2. Preserve natural anatomy, body proportions, believable pose mechanics, and object contact.
3. Expand useful variation across framing, viewpoint, pose, clothing, action, scene, and visual conditions.
4. Reduce near-duplicates and balance the set based on observed gaps.
5. Add visual complexity only when it contributes useful information.

## No inherited module styling

Do not automatically import wallpaper outfit rules, festival costume facts, or another module's props/style. Use only the active LORA_IMAGE request, its current uploaded identity reference, applicable CORE rules, and any explicitly applicable contextual character data.
