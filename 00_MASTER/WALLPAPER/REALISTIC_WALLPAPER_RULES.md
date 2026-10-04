# REALISTIC_WALLPAPER_RULES.md

## Authority
This document defines the visual and production rules used when the user explicitly requests REALISTIC WALLPAPER.
It operates under the active UNIVERSAL_WALLPAPER module registered in `00_MASTER/MODULE_REGISTRY.md`.
Shared wallpaper production/session contracts are defined by the current documents under `00_MASTER/WALLPAPER/`.
It does not define generic anatomy or generation safety; those remain in CORE.

## 1. Activation
Use this rule set only for REALISTIC WALLPAPER / 寫實人物桌布 or an equivalent unambiguous realistic-person wallpaper request.
If the user requests ANIME WALLPAPER, do not use this file.

## 2. Reference image and identity authority
The reference image supplied in the current request is the primary visual reference for the current task/batch when one is explicitly supplied.
A declared task reference is the identity authority for that task. Do not silently replace it with another person, another character master, or an unrelated reference.

For realistic Inaria tasks:
- If the task explicitly supplies a person reference, that task reference is the identity authority.
- If the task does not supply a different person reference, use the approved 36-year-old realistic Inaria identity baseline as the default identity reference.
- The age-20 anime Inaria master is not a substitute for the realistic Inaria identity baseline.
- A different GitHub character/reference asset may be used only when the current task explicitly declares it as the applicable reference.

Do not interpret an identity reference as a requirement to preserve every visual property of the source image; camera angle, pose, framing, clothing, scene, lighting, and composition may change.

For REALISTIC WALLPAPER production, the supplied reference image is an identity/body-reference image, NOT an outfit or pose template unless the task explicitly says otherwise.

Hard reference-decoupling rules:
- SOURCE OUTFIT MUST NOT be reused as the wallpaper outfit.
- SOURCE OUTFIT MUST NOT be treated as a default base layer with only an added jacket, coat, cardigan, or accessory.
- The Worker must design a complete new outfit appropriate to the destination, season, weather, activity, and realistic social context.
- SOURCE POSE MUST NOT be copied or treated as the default pose.
- The Worker must design a new pose/action independently from the reference image.
- Source clothing and source pose may be visually present in the reference only for identity/context extraction; they have no authority over the generated presentation.

### Realistic Inaria visual identity baseline
When no task-specific realistic person reference overrides it, the realistic Inaria baseline is:

- Asian Taiwanese woman
- 158 cm height
- 48 kg body weight
- slim, balanced natural build
- approximately 85-58-86 body proportions
- fairer-than-average Asian skin tone
- small oval face
- large, gentle eyes
- blue irises
- dark blue-black long straight hair
- neat bangs covering the forehead
- fresh, gentle, healing overall visual impression

These are identity/background characteristics, not a requirement to reproduce one fixed pose, camera angle, hairstyle arrangement, expression, or outfit in every image.

## 3. Identity anchors vs. presentation variables
Identity must remain stable while presentation may vary.

### Identity anchors — preserve
Unless the task explicitly establishes a different identity reference, preserve:
- recognizable facial structure and bone structure
- facial-feature size, position, and relative proportions
- eye shape and characteristic expression
- eyebrow shape
- nose shape
- lip shape
- jawline and chin structure
- hairline
- natural hair color
- natural skin tone and age appearance
- recognizable body build and natural body proportions
- distinctive visual traits

### Presentation variables — may vary
The following may deliberately change when compatible with the task:
- hairstyle arrangement and styling
- hair tying method
- clothing and accessories
- makeup
- pose and action
- viewpoint and camera angle
- shot size and framing
- scene and environment
- weather and time
- lighting
- camera/lens setup
- editorial, cinematic, bridal, or magazine styling

**Hair identity is not the same as hairstyle lock.**
Hairline and natural hair color are identity anchors; hairstyle arrangement may vary.

Do not:
- replace the person with another identity
- apply a standardized influencer / celebrity-template face
- create an AI-doll face, anime-like face, or generic standardized beauty face
- arbitrarily enlarge, shrink, reposition, or reshape facial features
- change facial geometry merely to make the person conventionally more beautiful
- use beautification as a reason to override recognizable identity

The reference image's particular face direction must not create a fixed left-facing/right-facing bias.

## 3A. Reference decoupling validation

Before DESIGN_LOCK for a realistic wallpaper task, explicitly verify:

`REFERENCE_OUTFIT_POLICY: REPLACE`
`REFERENCE_POSE_POLICY: IGNORE`

The planned outfit must be a complete outfit, including the primary clothing pieces and footwear when visible. Adding only outerwear or shoes to the source outfit fails this gate.

The planned pose/action must be independently designed and must not reproduce the reference image's body arrangement, limb placement, or hand position unless the task explicitly requests pose preservation.

A task that still says "same outfit + jacket" or otherwise derives the generated clothing directly from the source outfit is NOT DESIGN_READY.

## 4. Body proportion preservation
Preserve the reference person's natural body proportions, body silhouette, limb proportions, and physical build.

Body silhouette is an identity constraint, not a style suggestion. The generated person must not become visibly heavier, especially through widened thighs or calves, merely because the pose, clothing, camera angle, or scene changed.

When the reference establishes a slim natural build:
- preserve the relative thigh and calf circumference;
- preserve the apparent waist-to-hip relationship;
- do not add muscular or padded leg volume;
- do not widen both legs symmetrically unless the reference itself has that build;
- do not use clothing folds or perspective as a reason to change the underlying leg anatomy.

The Worker must treat body-proportion preservation as a pre-generation design check, not something to be corrected after generation.

For the default realistic Inaria baseline, do not silently convert the established 158 cm / 48 kg slim balanced build into a taller, longer-limbed, narrower-waisted, or fashion-model body.

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

## 5. Realistic skin and human appearance
The result must read as a realistic human photograph / photorealistic scene unless the user explicitly requests another realistic rendering style.

Preserve natural skin color and believable skin-tone variation.
Skin may appear clean, luminous, and professionally photographed, but must not be artificially whitened or excessively beautified.

Preserve natural skin texture appropriate to the shot:
- fine skin texture
- natural pores when visible at the given camera distance and resolution
- subtle natural lines and age-related detail where present
- realistic facial micro-detail
- natural hair texture
- believable human surface variation

Do not force visible pores in close detail when the selected lens, distance, depth of field, lighting, or image scale would naturally soften them.

Avoid:
- plastic or wax-like skin
- excessive beauty-filter smoothing
- synthetic porcelain skin
- unnaturally uniform skin tone
- loss of all natural facial texture

## 6. Realistic visual direction
REALISTIC does not mean raw documentary photography or the absence of professional styling.
Professional makeup, controlled lighting, cinematic lighting, editorial photography, bridal photography, magazine aesthetics, and refined color grading are allowed when requested.

Prioritize:
- natural human facial structure
- realistic skin texture
- natural hair
- physically plausible clothing and fabric
- realistic lighting and shadows
- believable environmental depth
- natural body proportions

Avoid anime facial proportions, illustration line-art treatment, excessive beauty-filter smoothing, exaggerated fashion-model proportions, and intentionally elongated limbs.

Professional styling may improve presentation, but it must not alter identity anchors or body proportions.

## 7. Photography and perspective
Select a camera setup appropriate to the composition, including when useful: camera distance, focal length/lens character, perspective, depth of field, camera height, and viewpoint.
Avoid extreme wide-angle perspective when it causes unnatural enlargement of nearby hands, feet, face, or other body parts.
Do not use camera perspective as an excuse for anatomically implausible proportions.

## 7A. Pose independence from reference

The reference image's pose is non-authoritative.

Before finalizing the prompt, explicitly design:
- a new torso orientation;
- new arm/hand placement;
- new leg placement and weight distribution;
- a new action appropriate to the scene.

Do not reuse the reference pose simply because the reference is the easiest stable composition.

Pose variation must still preserve the same underlying body proportions and center of gravity.

## 7B. Facial expression

Facial expression is a first-class presentation variable. Design the expression explicitly for the scene and action; do not automatically inherit the reference expression.

## 8. Human pose
Prioritize natural human posture and believable physical support.
Check shoulder/torso alignment, spinal curve, pelvis orientation, knee direction, foot placement, center of gravity, and contact with support surfaces.
A visually elegant pose must not override realistic body mechanics.

Apply the CORE anatomy and generation-stability rules rather than duplicating CORE anatomy rules inside this module.

## 9. Clothing and wearable realism
Clothing must behave as physical material: natural folds, believable drape, correct body contact, plausible seams/openings, connected sleeves, connected straps, and physically supported bags.
Avoid floating fabric, broken straps, clothing penetrating the body, or unsupported accessories.

## 10. Identity consistency across variation
The same person must remain recognizable while presentation may deliberately vary.

Allowed variation includes:
- viewpoint and camera angle
- shot size and framing
- pose and action
- clothing and accessories
- hairstyle arrangement
- makeup
- scene and environment
- weather and time
- lighting
- camera/lens setup
- professional photographic styling

Variation must never be achieved by changing identity anchors, facial geometry, body proportions, natural hair color, or distinctive traits.

## 10A. Multi-image presentation diversity

For a multi-image REALISTIC WALLPAPER batch, presentation variation is mandatory.

The same identity must remain recognizable, but the batch must not reuse one default presentation across all images.

The design stage MUST deliberately vary, as appropriate:
- hairstyle arrangement;
- clothing;
- shoes;
- accessories;
- makeup;
- pose/action;
- viewpoint;
- shot size/framing;
- scene/environment;
- weather/time/lighting.

Changing only the background and pose is insufficient when the requested batch is intended to provide varied wallpapers.

For a 12-image travel batch, the Worker should use a deliberate coverage plan so that clothing, hairstyle, footwear, and accessory choices are visibly diversified rather than repeated with minor wording changes.

Identity anchors that remain fixed include facial structure, natural hair color/hairline, skin tone, recognizable body build, and natural proportions.

## 11. Realistic composition
Use deliberate variation: CLOSE-UP, BUST / HALF-BODY, MEDIUM SHOT, CHARACTER-DOMINANT FULL-BODY, ENVIRONMENTAL FULL-BODY.
FULL-BODY ≠ DISTANT SHOT.
Character-dominant framing is allowed and encouraged when facial identity, clothing, or physical detail is important.

## 12. Pet rule
The current user PET_ALLOWED parameter controls intentional pet/animal inclusion unless a stricter applicable wallpaper rule says otherwise.

## 13. Prompt construction
The final prompt must describe:
1. applicable identity reference and identity-preservation requirements
2. explicit reference-decoupling instructions: replace source outfit; ignore source pose
3. realistic human appearance
3. pose/action
4. camera/lens/perspective
5. clothing/accessories
6. scene/weather/time
7. lighting
8. required wallpaper format

When useful, task-level style directions such as editorial, cinematic, bridal, or magazine aesthetics may be added after identity and realism constraints. Such styles must never override identity anchors or body-proportion preservation.

Apply CORE anatomy and generation-stability rules before finalizing the prompt.

## 14. Priority order
For conflicts within a realistic-person prompt, use this priority order:

P0 — IDENTITY ANCHORS
P1 — FACIAL STRUCTURE / RECOGNIZABILITY
P2 — BODY PROPORTION PRESERVATION
P3 — NATURAL HUMAN / SKIN REALISM
P4 — ANATOMICAL STABILITY
P5 — POSE / ACTION
P6 — REFERENCE-DECOUPLING COMPLIANCE
P7 — PRESENTATION: HAIRSTYLE / MAKEUP / CLOTHING / ACCESSORIES
P8 — CAMERA / LENS / COMPOSITION
P9 — LIGHTING / ENVIRONMENT
P10 — CINEMATIC / EDITORIAL STYLE

A lower-priority presentation or aesthetic request must not override a higher-priority identity anchor or body-proportion rule.

Task-level changes may alter presentation variables, but may not silently redefine the identity anchors.

## 15. Output boundary
This rule set defines how a REALISTIC WALLPAPER request is designed. It does not perform QA and does not replace CORE safety/state rules.
