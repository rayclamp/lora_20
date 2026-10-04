# REALISTIC_WALLPAPER_RULES.md

## Authority
This document defines the visual and production rules used when the user explicitly requests REALISTIC WALLPAPER.
It is a child rule set of the active UNIVERSAL_WALLPAPER module.
It does not define generic anatomy or generation safety; those remain in CORE.

## 1. Activation
Use this rule set only for REALISTIC WALLPAPER / 寫實人物桌布 or an equivalent unambiguous realistic-person wallpaper request.
If the user requests ANIME WALLPAPER, do not use this file.

## 2. Reference image and identity authority
The reference image supplied in the current request is the primary visual reference for the current batch.
Use it to establish person identity, face, apparent age, hair, body proportions, skin appearance, and realistic visual characteristics.

A declared task reference is the identity authority for that task. Do not silently replace it with another person, another character master, or an unrelated reference.
A GitHub character master may be used only when the user explicitly requests it or the current task declares it as an additional reference.
Do not interpret "primary identity reference" as a requirement to preserve every visual property of the reference image; camera angle, pose, framing, clothing, scene, lighting, and composition may change.

### Identity priority
Identity preservation is the highest visual priority and takes precedence over clothing, pose, scene, lighting, camera styling, and aesthetic beautification.

Preserve, as applicable:
- recognizable facial structure and bone structure
- facial-feature size, position, and relative proportions
- eye shape and expression characteristics
- eyebrow shape
- nose shape
- lip shape
- jawline and chin structure
- hairline, hair color, and characteristic hairstyle features
- natural skin tone and age appearance
- recognizable body build and natural body proportions
- distinctive visual traits of the reference person

Do not:
- replace the person with another identity
- apply a standardized influencer / celebrity-template face
- create an AI-doll face, anime-like face, or generic standardized beauty face
- arbitrarily enlarge, shrink, reposition, or reshape facial features
- change facial geometry merely to make the person conventionally more beautiful
- use beautification as a reason to override recognizable identity

The reference image's particular face direction must not create a fixed left-facing/right-facing bias.

## 3. Body proportion preservation
Preserve the reference person's natural body proportions, body silhouette, limb proportions, and physical build.

Do not artificially:
- increase apparent height
- narrow the waist
- lengthen the arms or legs
- enlarge or reduce body parts for idealized beauty
- convert a natural slim build into fashion-model proportions

Operational principle:
- slim does not mean elongated
- elegant does not mean exaggerated model proportions
- camera perspective must not be used to justify implausible body proportions

Body-proportion preservation remains separate from pose design: pose may change, but the underlying person must remain physically consistent.

## 4. Realistic skin and human appearance
The result must read as a realistic human photograph / photorealistic scene unless the user explicitly requests another realistic rendering style.

Preserve natural skin color and believable skin-tone variation.
Skin may appear clean and luminous, but must not be artificially whitened or excessively beautified.

Prefer:
- visible but natural pores
- fine skin texture
- subtle natural lines and age-related detail where present
- realistic facial micro-detail
- natural hair texture
- believable human surface variation

Avoid:
- plastic or wax-like skin
- excessive beauty-filter smoothing
- synthetic porcelain skin
- unnaturally uniform skin tone
- loss of all natural facial texture

## 5. Realistic visual direction
Prioritize natural human facial structure, realistic skin texture, natural hair, physically plausible clothing and fabric, realistic lighting and shadows, believable environmental depth, and natural body proportions.
Avoid anime facial proportions, illustration line-art treatment, excessive beauty-filter smoothing, exaggerated fashion-model proportions, and intentionally elongated limbs.

## 6. Photography and perspective
Select a camera setup appropriate to the composition, including when useful: camera distance, focal length/lens character, perspective, depth of field, camera height, and viewpoint.
Avoid extreme wide-angle perspective when it causes unnatural enlargement of nearby hands, feet, face, or other body parts.
Do not use camera perspective as an excuse for anatomically implausible proportions.

## 7. Human pose
Prioritize natural human posture and believable physical support.
Check shoulder/torso alignment, spinal curve, pelvis orientation, knee direction, foot placement, center of gravity, and contact with support surfaces.
A visually elegant pose must not override realistic body mechanics.

## 8. Clothing and wearable realism
Clothing must behave as physical material: natural folds, believable drape, correct body contact, plausible seams/openings, connected sleeves, connected straps, and physically supported bags.
Avoid floating fabric, broken straps, clothing penetrating the body, or unsupported accessories.

## 9. Identity consistency across variation
The same person must remain recognizable while the following may deliberately vary:
- viewpoint and camera angle
- shot size and framing
- pose and action
- clothing and accessories
- hairstyle variation
- scene and environment
- weather and time
- lighting
- camera/lens setup

Variation must never be achieved by changing the person's identity, facial geometry, body proportions, or distinctive traits.

## 10. Realistic composition
Use deliberate variation: CLOSE-UP, BUST / HALF-BODY, MEDIUM SHOT, CHARACTER-DOMINANT FULL-BODY, ENVIRONMENTAL FULL-BODY.
FULL-BODY ≠ DISTANT SHOT.
Character-dominant framing is allowed and encouraged when facial identity, clothing, or physical detail is important.

## 11. Pet rule
The current user PET_ALLOWED parameter controls intentional pet/animal inclusion unless a stricter applicable wallpaper rule says otherwise.

## 12. Prompt construction
The final prompt must describe:
1. supplied reference identity and identity-preservation requirements
2. realistic human appearance derived from the supplied reference
3. pose/action
4. camera/lens/perspective
5. clothing/accessories
6. scene/weather/time
7. lighting
8. required wallpaper format

When useful, task-level style directions such as editorial, cinematic, bridal, or magazine aesthetics may be added after identity and realism constraints. Such styles must never override identity or body-proportion preservation.

Apply CORE anatomy and generation-stability rules before finalizing the prompt.

## 13. Priority order
For conflicts within a realistic-person prompt, use this priority order:

P0 — IDENTITY PRESERVATION
P1 — FACIAL STRUCTURE / RECOGNIZABILITY
P2 — BODY PROPORTION PRESERVATION
P3 — NATURAL HUMAN / SKIN REALISM
P4 — ANATOMICAL STABILITY
P5 — POSE / ACTION
P6 — CLOTHING / HAIRSTYLE / ACCESSORIES
P7 — CAMERA / LENS / COMPOSITION
P8 — LIGHTING / ENVIRONMENT
P9 — CINEMATIC / EDITORIAL STYLE

A lower-priority aesthetic request must not override a higher-priority identity or realism rule.

## 14. Output boundary
This rule set defines how a REALISTIC WALLPAPER request is designed. It does not perform QA and does not replace CORE safety/state rules.
