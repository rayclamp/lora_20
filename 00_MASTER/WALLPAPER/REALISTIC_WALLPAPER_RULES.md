# REALISTIC_WALLPAPER_RULES.md

## Authority
This document defines the visual and production rules used when the user explicitly requests REALISTIC WALLPAPER.
It is a child rule set of the active UNIVERSAL_WALLPAPER module.
It does not define generic anatomy or generation safety; those remain in CORE.

## 1. Activation
Use this rule set only for REALISTIC WALLPAPER / 寫實人物桌布 or an equivalent unambiguous realistic-person wallpaper request.
If the user requests ANIME WALLPAPER, do not use this file.

## 2. Reference image
The reference image supplied in the current request is the primary visual reference for the current batch.
Use it to establish person identity, face, apparent age, hair, body proportions, skin appearance, clothing/style cues, and realistic visual characteristics.
Do not silently replace the supplied reference with a GitHub MASTER_IMAGE.
A GitHub character master may only be used when the user explicitly requests it or the current task declares it as an additional reference.
Do not force the reference image's camera angle, pose, framing, or exact composition onto every generated image.

## 3. Realistic visual direction
The result must read as a realistic human photograph / photorealistic scene unless the user explicitly requests another realistic rendering style.
Prioritize natural human facial structure, realistic skin texture, natural hair, physically plausible clothing and fabric, realistic lighting and shadows, believable environmental depth, and natural body proportions.
Avoid anime facial proportions, illustration line-art treatment, plastic skin, excessive beauty-filter smoothing, exaggerated fashion-model proportions, and intentionally elongated limbs.

## 4. Photography and perspective
Select a camera setup appropriate to the composition, including when useful: camera distance, focal length/lens character, perspective, depth of field, camera height, and viewpoint.
Avoid extreme wide-angle perspective when it causes unnatural enlargement of nearby hands, feet, face, or other body parts.
Do not use camera perspective as an excuse for anatomically implausible proportions.

## 5. Human pose
Prioritize natural human posture and believable physical support.
Check shoulder/torso alignment, spinal curve, pelvis orientation, knee direction, foot placement, center of gravity, and contact with support surfaces.
A visually elegant pose must not override realistic body mechanics.

## 6. Clothing and wearable realism
Clothing must behave as physical material: natural folds, believable drape, correct body contact, plausible seams/openings, connected sleeves, connected straps, and physically supported bags.
Avoid floating fabric, broken straps, clothing penetrating the body, or unsupported accessories.

## 7. Identity consistency
The supplied reference remains the identity anchor.
Preserve recognizable facial structure, hairstyle characteristics, apparent age, body build, and distinctive visual traits.
Camera angle may change. The reference image's particular face direction must not create a fixed left-facing/right-facing bias.
Do not substitute another person's identity.

## 8. Realistic composition
Use deliberate variation: CLOSE-UP, BUST / HALF-BODY, MEDIUM SHOT, CHARACTER-DOMINANT FULL-BODY, ENVIRONMENTAL FULL-BODY.
FULL-BODY ≠ DISTANT SHOT.
Vary viewpoint, shot size, pose, action, clothing, hairstyle, scene, lighting, and camera setup while preserving identity.

## 9. Pet rule
The current user PET_ALLOWED parameter controls intentional pet/animal inclusion unless a stricter applicable wallpaper rule says otherwise.

## 10. Prompt construction
The final prompt must describe supplied reference identity, realistic human appearance derived from the supplied reference, pose/action, camera/lens/perspective, clothing/accessories, scene/weather/time, lighting, and required wallpaper format.
Apply CORE anatomy and generation-stability rules before finalizing the prompt.

## 11. Output boundary
This rule set defines how a REALISTIC WALLPAPER request is designed. It does not perform QA and does not replace CORE safety/state rules.