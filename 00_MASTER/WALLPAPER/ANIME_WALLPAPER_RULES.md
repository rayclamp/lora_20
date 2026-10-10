# ANIME_WALLPAPER_RULES.md

## Authority
This document defines the visual and production rules used when the user explicitly requests ANIME WALLPAPER.
It is a child rule set of the active UNIVERSAL_WALLPAPER module.
It does not define generic anatomy or generation safety; those remain in CORE.

## 1. Activation
Use this rule set only for ANIME WALLPAPER / 動漫桌布 or an equivalent unambiguous anime/illustration wallpaper request.
If the user requests REALISTIC WALLPAPER, do not use this file.

## 2. Reference image
The reference image supplied in the current request is the primary visual reference for the current task when an explicit task reference exists.
Use the selected module Reference Policy to determine whether a visual reference is legally available.
Do not silently replace the supplied reference with another repository asset.
LoRA Master Images and other references owned by another production module are forbidden unless the selected module's Reference Policy explicitly authorizes that exact source; character-name matching is never sufficient.
Do not force the reference image's camera angle, pose, framing, or exact composition onto every generated image.

## 2A. Inaria character authority

When the user explicitly requests Inaria / 依娜莉亞, load and apply:

`00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md`

The Inaria specification is the canonical character-semantic authority for Inaria. It is not a second visual person reference.

If a user-supplied person image exists, that image remains the sole visual person reference for the current task. The Inaria specification supplies stable character constraints and defaults, while the uploaded image supplies visual person evidence.

For an Inaria task, preserve the character identity anchors defined by the Inaria specification while independently redesigning hairstyle, complete outfit, accessories, shoes, pose/action, and expression unless the user explicitly requests preservation.

If the user does not explicitly request Inaria, do not silently apply the Inaria character specification.

## 3. Anime visual direction
Preserve the supplied reference image's visual identity first.
Favor clean anime/illustrated rendering, coherent line and shape treatment, natural-looking anime lighting, controlled color harmony, detailed but readable backgrounds, and expressive but stable poses when supported by the reference.
Do not mix realistic-photographic rendering into an anime request unless explicitly requested.

## 4. Composition
Use deliberate variation: CLOSE-UP, BUST / HALF-BODY, MEDIUM SHOT, CHARACTER-DOMINANT FULL-BODY, ENVIRONMENTAL FULL-BODY.
FULL-BODY ≠ DISTANT SHOT.
Vary viewpoint, shot size, character position, pose, action, hairstyle, outfit, accessories, scene details, and lighting.
Do not create repetitive mannequin-like images.

### Theme-led hairstyle and footwear styling
Choose the base hairstyle and footwear type according to the image theme, scene, activity, outfit, weather, and overall visual intent. Do not force every available type into a batch or use an unsuitable type merely to satisfy a variety quota.

After choosing a suitable base type, optional restrained styling variations may be used without changing the underlying type. For example, long straight hair may include a small side braid or a different parting while remaining long straight hair; Mary Jane shoes may vary in color, material, strap details, or small decorations while remaining Mary Jane shoes. These are optional design choices, not mandatory per-image requirements.

Batch diversity is a visual goal, not a requirement to exhaust a catalog or invent a new base type for every image. Avoid unnecessary repetition when a suitable alternative or meaningful styling variation naturally fits, while prioritizing scene suitability and coherent design over forced difference.

## 4A. Head direction and gaze diversity

Looking directly at the camera is an optional composition choice, NOT a default or mandatory requirement. Do not add camera-directed gaze to every image simply because the image is a character portrait or wallpaper.

When designing a multi-image batch, consider body / torso orientation, head direction and tilt, and eye-gaze direction as related but distinct variables. Let them align or differ naturally according to the scene, action, expression, and composition. Choices may include looking toward the camera, off-camera, toward an object or activity, into the distance, upward or downward, or a natural side/profile view. These are examples, not a quota or checklist.

Before Prompt Lock, check the batch for unintentional repetition of substantially similar head direction and gaze. If multiple prompts use the same camera-facing head pose without a scene-specific reason, revise the future prompts to create natural and meaningful variation. Do not force angle quotas or unnatural poses, and do not compromise character identity or scene coherence for diversity.

This rule applies to future prompt design only. It does not authorize rewriting, unlocking, replacing, or retroactively correcting a previously locked Prompt Set or historical production record.

## 5. Character consistency
The supplied reference identity remains the visual anchor throughout the batch.
Variation is allowed when compatible with the task, but do not turn the reference person/character into a different character.

## 6. Anime-specific constraints
- Hats and glasses are allowed.
- Avoid hand actions that touch, adjust, remove, or hold hats/glasses when this creates unnecessary hand risk.
- Bags/backpacks/crossbody bags are allowed only when straps connect naturally and do not create false limbs.
- Avoid unnecessary mirror/reflection compositions that create duplicate readable character instances.
- Festival-specific anime wallpaper rules may add stricter constraints; the stricter applicable rule controls.

## 7. Pet rule
The current user PET_ALLOWED parameter controls intentional pet/animal inclusion unless a stricter applicable wallpaper rule says otherwise.

## 8. Prompt construction
The final prompt must describe reference identity, anime visual characteristics derived from the supplied reference, composition, stable pose/action, clothing/accessories, scene/weather/time, lighting/camera, and required wallpaper format.
Apply CORE anatomy and generation-stability rules before finalizing the prompt.



## 8A. Universal Wallpaper footwear authority

When footwear is visible or intentionally designed, the Producer MUST use the canonical Universal Wallpaper footwear allowlist:

`00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_SHOES.md`

Allowed types are:
- 高跟鞋
- 娃娃鞋
- 側面雙扣短靴
- 短靴
- 厚底靴
- 涼鞋
- 運動鞋
- 瑪莉珍鞋
- 拖鞋

Festival Wallpaper footwear catalogs and other module-specific footwear data MUST NOT be treated as Universal Wallpaper options.

`Loafers / 樂福鞋` are not allowed for Universal Wallpaper unless the authoritative Universal allowlist is explicitly changed.

The `SHOES` design field MUST be validated against this allowlist before Prompt Lock.

## 9. Output boundary
This rule set defines how an ANIME WALLPAPER request is designed. It does not perform QA and does not replace CORE safety/state rules.