# ANIME_WALLPAPER_RULES.md

## Authority
This document defines shared anime/illustration wallpaper visual-design rules routed by `00_MASTER/WALLPAPER/WALLPAPER_COMMAND_PROTOCOL.md` for `UNIVERSAL_WALLPAPER` (`PRODUCTION_TYPE=ANIME`) and `FESTIVAL_WALLPAPER` (`WALLPAPER_TYPE=ANIME WALLPAPER`). It is not an independent production module. Each selected module retains its own reference authority, costume/footwear constraints, cultural-data boundaries and Task requirements. Universal-only subsections in this file apply only to `UNIVERSAL_WALLPAPER`.
It does not define generic anatomy or generation safety; those remain in CORE.

## 1. Activation
Use this rule set only for ANIME WALLPAPER / 動漫桌布 or an equivalent unambiguous anime/illustration wallpaper request.
If the user requests REALISTIC WALLPAPER, do not use this file.

## 2. Reference image
During `/WALLPAPER_CONSOLE`, do not require an uploaded person-reference image or claim to have inspected one. In production, an actual visual reference is authoritative only when validly resolved under the selected module's `REFERENCE_POLICY.md`; when none is resolved and the task permits it, use the module's `NO_REFERENCE` behavior and semantic character guidance without inventing image evidence. If an image is required but unavailable, follow the module's blocked-reference rule.
Use the selected module Reference Policy to determine whether a visual reference is legally available.
Do not silently replace the supplied reference with another repository asset.
LoRA Master Images and other references owned by another production module are forbidden unless the selected module's Reference Policy explicitly authorizes that exact source; character-name matching is never sufficient.
Do not force the reference image's camera angle, pose, framing, or exact composition onto every generated image.

## 2A. Inaria character authority

When the user explicitly requests Inaria / 依娜莉亞, load and apply:

`00_MASTER/CHARACTERS/INARIA_CHARACTER_SPEC.md`

The Inaria specification is the canonical character-semantic authority for Inaria. It is not a second visual person reference.

If an authorized person image is resolved for the task, that image governs the person's observable visual identity; the Inaria specification provides compatible character-semantic context but cannot replace, reconstruct, or override the image's appearance. Without a visual reference, the Inaria specification may supply fallback textual identity anchors only when the applicable module permits `NO_REFERENCE`, never as proof that an image was seen.

For an Inaria task, preserve identity according to that authority order. Design hairstyle, outfit, accessories, footwear, pose/action, and expression according to the current Task and applicable module constraints unless the user explicitly requests their preservation.

If the user does not explicitly request Inaria, do not silently apply the Inaria character specification.

## 3. Anime visual direction
When an authorized visual reference exists, preserve its observable person identity first; otherwise follow valid `NO_REFERENCE` semantic identity guidance without asserting visual comparison.
Favor clean anime/illustrated rendering, coherent line and shape treatment, natural-looking anime lighting, controlled color harmony, detailed but readable backgrounds, and expressive but stable poses appropriate to the Task and supported by any actual reference evidence.
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

## 4A. Head direction, gaze, and natural pose coherence

Looking directly at the camera is optional, not a default or mandatory requirement.

Design the main action from the scene, activity, clothing, props, and intended mood. Prioritize a natural, readable action over creating a different pose for every image.

Treat torso orientation, shoulder line, neck angle, head direction, facial orientation, and eye gaze as coordinated parts of one pose. The gaze should have a plausible target, such as the camera, the direction of movement, an object or activity, nearby scenery, or a distant focal point.

Avoid conspicuous mismatches such as a head turned right while the eyes strongly look left, or a bowed head while the eyes unnaturally look upward, unless the scene clearly motivates that action. Small natural gaze offsets and a motivated over-the-shoulder glance are allowed; exact alignment is not required in every composition.

Before prompt lock, resolve any obvious conflict between the action, head/neck position, gaze target, and scene. If a variation makes the pose awkward or the action unrelated to the background, choose a simpler scene-appropriate pose.

Batch diversity remains desirable but is secondary to natural anatomy, pose readability, gaze coherence, and scene suitability. Similar natural poses may recur when they best serve the image. Do not impose angle quotas or revise a good pose solely to make it different.

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
The final prompt must describe the applicable identity requirements, anime visual style, composition, stable pose/action, clothing/accessories, scene/weather/time, lighting/camera, and required wallpaper format. If a visual reference will be supplied in production, describe its identity-preservation role conditionally without asserting the designer inspected it. Under valid `NO_REFERENCE`, use only authorized textual identity guidance; never invent reference-derived visual characteristics.
Apply CORE anatomy and generation-stability rules before finalizing the prompt.



## 8A. Universal Wallpaper footwear authority

**Only for `MODULE=UNIVERSAL_WALLPAPER`:** when footwear is visible or intentionally designed, the prompt designer MUST use the canonical Universal Wallpaper footwear allowlist before Prompt Lock. The image Producer executes the already locked prompt without revalidating or redesigning footwear. **For `MODULE=FESTIVAL_WALLPAPER`, this entire Universal-only footwear subsection is inapplicable; follow the Festival module's own applicable footwear/category rules.**

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
- 繡花鞋

Festival Wallpaper footwear catalogs and other module-specific footwear data MUST NOT be treated as Universal Wallpaper options.

`Loafers / 樂福鞋` are not allowed for Universal Wallpaper unless the authoritative Universal allowlist is explicitly changed.

For `UNIVERSAL_WALLPAPER` only, the `SHOES` design field MUST be validated against this allowlist before Prompt Lock.

## 9. Output boundary
This rule set defines how an ANIME WALLPAPER request is designed. It does not perform QA and does not replace CORE safety/state rules.