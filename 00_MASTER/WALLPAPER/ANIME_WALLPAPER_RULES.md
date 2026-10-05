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
LoRA Master Images are forbidden. Other references owned by another production module are forbidden unless the selected module's Reference Policy explicitly authorizes that exact source; character-name matching is never sufficient.
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

## 9. Output boundary
This rule set defines how an ANIME WALLPAPER request is designed. It does not perform QA and does not replace CORE safety/state rules.