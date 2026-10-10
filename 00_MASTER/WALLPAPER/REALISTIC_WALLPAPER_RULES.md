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

## 2A. Inaria character authority

When the user explicitly requests Inaria / 依娜莉亞, load and apply:

`00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md`

The Inaria specification is the canonical character-semantic authority for Inaria. It does not become a second visual person reference.

If a user-supplied person image exists, that image remains the sole visual person reference for the current task. The Inaria specification supplies stable character constraints and defaults, while the uploaded image supplies visual person evidence.

For an Inaria task with a supplied person reference, preserve the actual visual identity established by that reference while using the Inaria specification primarily for contextual character design. Independently redesign presentation according to the current task. If no person reference exists, the canonical Inaria identity anchors may be used as the fallback visual baseline.

If the user does not explicitly request Inaria, do not silently apply the Inaria character specification.

### Context-first rule for referenced realistic Inaria

When the user says the supplied image is the realistic Inaria person and asks to design according to Inaria's basic information:

- Use the supplied image as the sole visual identity authority.
- Use the Inaria specification's contextual character data to inform the design: occupation, work context, default world/location, lifestyle, habits, interests, likes, dislikes, personality, preferred environments, and relevant pet/lifestyle context.
- Do NOT use Inaria's canonical height, weight, BMI, measurements, canonical face/eye/hair/skin/body descriptions, or original outfit to reconstruct the person in the reference image.
- Those visual/body fields are fallback identity data only when no task-specific person reference is supplied.
- Do not silently normalize the reference person toward the GitHub Inaria baseline merely because the task is labeled Inaria.


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

## 5. Real human appearance — photographic reality standard
REALISTIC means the person must read as a **real human being photographed by a real camera**, not as a rendered character, digital illustration, AI beauty portrait, or artificially perfected face.

The reference person's actual identity and natural appearance are more important than conventional beauty.

### Human identity preservation
- Preserve the person's real face shape, bone structure, facial-feature proportions, eye shape and expression character, eyebrows, nose, lips, jawline, chin, hairline, natural hair color, skin color, and natural age appearance.
- Preserve subtle natural facial asymmetry and individual characteristics.
- Do not "improve" the face by making it more symmetrical, sharper, younger, prettier, or more conventionally attractive.
- Do not replace the person with an influencer face, model face, celebrity-like face, AI-beauty face, doll face, or generic standardized attractive face.
- Do not redesign the person into another character.
- Do not use beauty enhancement as a reason to change recognizable facial geometry.

### Real skin
Skin must look like actual human skin captured by a camera:
- natural pores when appropriate to the shot;
- fine skin texture;
- subtle tonal variation;
- slight natural unevenness;
- natural redness and small color variations;
- realistic highlights and shadows;
- believable facial micro-detail.

Do NOT make skin:
- perfectly uniform;
- excessively smooth;
- plastic;
- wax-like;
- porcelain-like;
- artificially white;
- digitally airbrushed.

Do not force exaggerated pores or skin detail when the camera distance, lens, depth of field, lighting, or resolution would naturally soften them.

### Real hair
Hair must behave like real human hair:
- natural fiber structure;
- realistic density;
- natural distribution;
- believable strand grouping;
- subtle irregularity and slight natural disorder.

Do not make every strand unnaturally sharp, individually outlined, perfectly arranged, or digitally sculpted.

### Real body
Preserve the person's actual body proportions and physical build:
- skeletal proportions;
- torso length;
- shoulder width;
- waist and hip relationship;
- limb lengths;
- natural leg proportions;
- natural body silhouette;
- natural posture.

Do not deliberately increase height, narrow the waist, lengthen the legs or arms, enlarge body parts, or create a fashion-model body that is not supported by the reference.

### Real clothing and material
Clothing must behave like physical material:
- believable fabric thickness;
- realistic weight;
- natural folds and compression;
- real seams and garment construction;
- plausible contact with the body;
- physically believable shadowing and occlusion;
- consistent response to the same light source.

### Real photographic capture
The image should feel as though it was captured by a high-quality full-frame camera rather than rendered.

Use realistic photographic behavior:
- natural optical depth of field;
- plausible focus falloff;
- believable background blur;
- realistic exposure;
- natural light falloff;
- subtle shadow variation;
- coherent lens perspective;
- realistic environmental depth.

Avoid excessive sharpness, excessive HDR appearance, artificial clarity, hyper-clean edges, or overprocessed detail.

### One physical light environment
The person and environment must belong to the same photographic space.

Skin, hair, clothing, background, shadows, and highlights must respond consistently to the same lighting system. Avoid a cut-out, pasted-on, composited, or separately rendered appearance.

### Overall photographic restraint
The target is:
**natural, credible, human, camera-captured, refined but not over-perfect.**

High-end photography, cinematic photography, editorial photography, bridal photography, elegant styling, and refined color grading are allowed. However, beauty, luxury, cinematic treatment, or artistic polish must never override human realism.

The desired result is a believable real photograph of a real person — not an AI-generated person made to look photographic.

## 6. Realistic visual direction
The visual direction must prioritize **photographic realism over artificial perfection**.

Preferred characteristics:
- authentic human facial structure;
- real skin texture and tonal variation;
- natural hair behavior;
- physically plausible clothing and materials;
- coherent lighting;
- believable shadows and reflections;
- natural depth and perspective;
- restrained professional photographic finishing.

Avoid:
- anime or illustration facial proportions;
- doll-like facial geometry;
- generic AI-beauty faces;
- excessive skin smoothing;
- porcelain or plastic skin;
- hyper-symmetrical facial features;
- exaggerated eye size;
- unnaturally sharp facial edges;
- excessive HDR;
- overprocessed micro-detail;
- fashion-model body distortion;
- intentionally elongated limbs.

Professional styling is allowed only when it remains subordinate to identity and photographic realism.

**The system should not chase "perfect image quality" at the expense of believable human appearance.**

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

Choose the base hairstyle and footwear type according to the specific image theme, scene, activity, clothing, weather, and overall visual intent. Do not force every available type into a batch or use an unsuitable type merely to satisfy a variety quota.

After choosing a suitable base type, the Worker may make restrained, theme-appropriate styling variations without changing the underlying type. For example, long straight hair may include a small side braid or a different parting while remaining long straight hair; Mary Jane shoes may vary in color, material, strap details, or small decorations while remaining Mary Jane shoes. Such variations are optional design choices, not mandatory per-image requirements.

Batch diversity is a visual goal, not a requirement to exhaust a catalog or invent a new base type for every image. Avoid unnecessary repetition when a suitable alternative or a meaningful styling variation naturally fits, but prioritize scene suitability and coherent design over forced difference.

Identity anchors that remain fixed include facial structure, natural hair color/hairline, skin tone, recognizable body build, and natural proportions.

## 10B. Head direction and gaze diversity

For every REALISTIC WALLPAPER prompt, looking directly at the camera is an optional choice, NOT a default or mandatory requirement. Do not add camera-directed gaze merely because it is a portrait or wallpaper.

During multi-image batch design, deliberately consider these as related but distinct presentation variables:
- body / torso orientation;
- head direction and tilt;
- eye-gaze direction.

They may align naturally or differ naturally according to the scene and action. Suitable choices may include looking toward the camera, looking off-camera, looking at an object or activity, looking into the distance, looking upward or downward, or a natural side/profile view. These are examples, not a quota or a mandatory checklist.

Before Prompt Lock, review the batch for unintentional repetition of substantially similar head direction and gaze. If several prompts default to the same camera-facing head pose without a scene-specific reason, revise the future prompts at design time to create natural, meaningful variation. Do not force a particular angle into every image, enforce fixed angle percentages, or sacrifice identity, anatomy, scene coherence, or naturalness for diversity.

This rule changes future prompt design only. It does not authorize rewriting, unlocking, replacing, or retroactively correcting any previously locked Prompt Set or historical production record.

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



## 13A. Universal Wallpaper footwear authority

When footwear is visible or intentionally designed, the Producer MUST use the canonical Universal Wallpaper footwear allowlist at `00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_SHOES.md`.

Allowed types are: 高跟鞋、娃娃鞋、側面雙扣短靴、短靴、厚底靴、涼鞋、運動鞋、瑪莉珍鞋、拖鞋。

Festival Wallpaper footwear catalogs and other module-specific footwear data MUST NOT be treated as Universal Wallpaper options. `Loafers / 樂福鞋` are not allowed for Universal Wallpaper unless the authoritative Universal allowlist is explicitly changed.

The `SHOES` design field MUST be validated against this allowlist before Prompt Lock.

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
