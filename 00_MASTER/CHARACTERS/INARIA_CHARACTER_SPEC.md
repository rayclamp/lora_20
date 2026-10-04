# INARIA_CHARACTER_SPEC.md — Canonical Character Specification

## Authority

This document is the canonical character specification for Inaria / 依娜莉亞.

It defines character identity, stable identity anchors, personality, preferences, default world setting, and the retained original/reference outfit specification.

IMPORTANT: The retained original/reference outfit is character-reference data only. It is NOT a wallpaper outfit template, wallpaper default, presentation baseline, or clothing inheritance source.

It does not override a user-supplied visual person reference for a specific wallpaper task.

For Universal Wallpaper:
- A user-supplied image is the sole visual person reference when one is provided.
- This character specification is the character-semantic specification when the user explicitly requests Inaria / 依娜莉亞.
- When a user-supplied person reference exists, the character specification is split by authority: contextual character data may inform scene and lifestyle design, while visual/body specification data must not be used to reconstruct or replace the referenced person's appearance.
- The character specification must not be treated as a second visual person reference.
- Task-specific explicit user instructions override optional/default presentation settings in this document.
- Stable identity characteristics remain applicable unless the user explicitly requests a different character.

## 1. Basic Information

- Chinese name: 依娜莉亞
- English name: Inaria
- Gender: Female
- Ethnicity: Taiwanese Asian woman
- Default world setting: modern Taiwan, 2026
- Birthday: 1990-04-03
- Blood type: B
- Occupation: manager at a foreign company
- Languages: Chinese, English, Japanese

## 2. Body Specification

**Reference-image contextual-use rule:** When a user-supplied person reference exists for an Inaria wallpaper task, the numeric body data in this section is documentation of Inaria's canonical character profile, but is NOT a prompt-design input for reconstructing the referenced person's body. Preserve the referenced person's actual visual body identity instead. If no person reference is supplied, this section may be used as the default Inaria body baseline.

- Height: 158 cm
- Weight: 48 kg
- BMI: approximately 19–20
- Measurements: 85-58-86
- Body build: slim, balanced, natural

The body specification is an identity constraint for Inaria. Do not silently convert the character into taller, longer-limbed, heavier, more muscular, or exaggerated fashion-model proportions.

## 3. Visual Identity

- Taiwanese Asian woman
- Fairer-than-average Asian skin tone
- Slim, balanced natural build
- Small oval face
- Large, gentle eyes
- Blue irises
- Long, straight dark blue-black hair
- Neat bangs covering the forehead
- Overall impression: fresh, gentle, soothing/healing, romantic

### Stable identity anchors

When no task-specific person reference overrides them, these are the default Inaria identity anchors.

When a user-supplied person reference exists, do NOT use these anchors to redraw or replace the referenced person's actual facial/body appearance. The reference image remains the visual identity authority.

When Inaria is explicitly requested without an overriding person reference, preserve:
- recognizable facial structure and facial proportions;
- small oval face structure;
- large gentle eye shape;
- blue irises;
- natural hair color: dark blue-black;
- hairline;
- fair Asian skin tone;
- slim balanced natural body build;
- natural body proportions;
- overall gentle, approachable, romantic/healing impression.

### Presentation variables

The following may change per task:
- hairstyle arrangement;
- hair tying method;
- clothing;
- accessories;
- shoes;
- makeup;
- pose;
- action;
- facial expression;
- viewpoint;
- shot size;
- composition;
- scene;
- weather;
- time;
- lighting;
- camera/lens;
- editorial/cinematic styling.

The default hairstyle is long, straight dark blue-black hair with neat bangs, but this does not mean every image must use the same hairstyle arrangement.

## 4. Personality

- Gentle
- Considerate and understanding
- Easy to approach
- Strongly romantic
- Careful and attentive
- Patient
- Rarely loses emotional control
- When angry, becomes serious and firm rather than shouting

## 5. Voice

- Soft mid-to-high female register
- Gentle and airy
- Relatively quiet volume
- Slightly slow speaking pace
- Natural and elegant intonation
- Sweet, soothing feminine quality
- Overall voice impression is similar in style to 黑嘉嘉, but softer

### Emotional voice behavior

- Happy: soft laughter
- Shy: quieter voice
- Angry: firm tone
- Affectionate/playful: soft and cute tone

## 6. Interests

- Baking
- Cooking
- Drawing

## 7. Likes

### Animals
- Dogs
- Cats
- Small animals in general

### Environment
- Quiet environments

### Food
- Chocolate
- Eggs

### Flowers
- Japanese blue star flower

### Colors
- Primary: aqua / light blue
- Secondary: blue and navy

## 8. Dislikes

- Lying
- Insects
- Horror/scary things
- Spicy food
- Lack of sleep

## 9. Pet

- Russian Blue cat
- Name: Blueberry / 藍莓

Pet inclusion is not automatic in wallpaper generation.

Pet inclusion follows the task's PET_ALLOWED parameter and any stricter applicable wallpaper rule.

## 10. Default Everyday World

Default setting:
- Modern Taiwan in 2026

Default environment:
- Ordinary urban life
- Warm subtropical climate
- Approximately 15–35°C
- No snow

These are defaults, not mandatory scene locks. A user-requested destination, season, weather, or special event may override them.

## 11. Original / Reference Outfit Specification

This section records the original outfit supplied as part of Inaria's basic character setting.

**This outfit is NOT a wallpaper design template.** It exists only as character-reference data and may be retained for character documentation, historical reference, or explicit user requests.

Unless the user explicitly requests this outfit, a Wallpaper Worker MUST NOT:
- automatically select it for a wallpaper;
- use it as the default wallpaper outfit;
- use it as the base layer for a new outfit;
- reuse its top, skirt, belt, shoes, accessories, colors, decorative motifs, or garment structure merely because the character is Inaria;
- derive a new outfit by keeping parts of this outfit and adding/removing outer layers.

For wallpaper production, this outfit has **NO DEFAULT INHERITANCE**.

### Original outfit components


### Top

- White or very pale blue base
- Sleeveless design
- Delicate ruffled shoulder/sleeve edge
- Lace and aqua-blue floral pattern around the neckline
- Small aqua-blue bow at the chest
- Central vertical decorative detail that naturally guides the visual line downward

### Skirt

- Aqua-blue high-waisted pleated short skirt

### Waist

- Thin navy leather belt
- Silver metal buckle

### Shoes

- Aqua-blue low-heeled floral sandals

### Accessories

- Aqua-blue gemstone flower-cross necklace
- Aqua-blue gemstone drop earrings
- Flower-shaped aqua gemstone bracelet

## 12. Wallpaper Outfit Isolation Rule

For every Universal Wallpaper task, the wallpaper outfit must be designed independently from this original/reference outfit unless the user explicitly requests reuse or preservation.

The phrase "依娜莉亞的日常" / "Inaria's everyday life" does NOT by itself authorize reuse of the original/reference outfit. It authorizes an everyday-life context; the Worker must still design an appropriate outfit for that specific scene.

The default wallpaper behavior is:
- `CHARACTER_REFERENCE_OUTFIT_POLICY: DO_NOT_INHERIT`
- `WALLPAPER_OUTFIT_MODE: INDEPENDENT_REDESIGN`

A wallpaper outfit must be a complete design appropriate to the requested activity, destination, season, weather, time, and social context.

Do not preserve individual garment pieces, accessory sets, decorative motifs, or color combinations from the original/reference outfit merely because they are associated with Inaria.

The original/reference outfit may be reused only when the user explicitly says to preserve, reuse, restore, or dress Inaria in that specific outfit.

For a task with a supplied reference image, this rule is independent of `REFERENCE_OUTFIT_POLICY`: the uploaded source outfit remains non-authoritative and must be replaced unless the user explicitly requests preservation.

## 13. Reference-Image Relationship

When the user supplies an image and explicitly identifies it as the realistic Inaria person:

REFERENCE IMAGE
- sole visual person reference;
- establishes who the visual person is for the current task;
- may establish facial/body visual evidence.

INARIA CHARACTER SPEC
- establishes that the requested character is Inaria;
- supplies contextual character data for design: occupation, work context, default world/location, lifestyle, habits, interests, likes, dislikes, personality, preferred environments, and relevant pet/lifestyle context;
- supplies canonical visual/body specifications only as fallback identity data when no task-specific person reference is supplied;
- does not override the referenced person's actual appearance;
- is not a second visual identity image.

### Contextual Character Data vs. Visual Identity Data

When a task contains a person reference, use the Inaria specification primarily for contextual design.

**USE FOR CONTEXT**
- occupation / work context;
- default world and location context;
- lifestyle and everyday environment;
- interests and hobbies;
- likes and dislikes;
- personality and behavioral tendencies;
- preferred environments;
- food, flower, and color preferences when relevant to the scene;
- pet/lifestyle context only when the task's PET_ALLOWED setting permits intentional inclusion.

**DO NOT USE TO RECONSTRUCT THE REFERENCED PERSON**
- height;
- weight;
- BMI;
- measurements;
- canonical face shape;
- canonical eye shape or iris color;
- canonical hair color or length;
- canonical bangs;
- canonical body build;
- canonical skin tone;
- original/reference outfit;
- any other visual identity value that would cause the referenced person's appearance to be replaced or normalized toward the GitHub profile.

These visual/body values remain available as fallback character identity data only when no task-specific person reference exists.

TASK INTENT
- decides the requested scene, activity, expression, presentation, and wallpaper output.

The Worker must never resolve this relationship by simply copying the reference image's outfit, hairstyle, pose, or composition.

## 14. Canonical Design Sequence for Inaria Wallpaper

When the user requests an Inaria wallpaper with a supplied reference image, resolve the task in this order:

1. REFERENCE PERSON — use the uploaded image as the sole visual person reference and preserve the actual referenced person's visual identity.
2. INARIA CHARACTER PROFILE — load this specification because the user explicitly requested Inaria.
3. CHARACTER CONTEXT — use occupation, world, lifestyle, habits, interests, likes, dislikes, personality, and relevant preferences to enrich the design; do not use canonical body/face/appearance values to replace the reference person.
4. PRESENTATION REDESIGN — design hairstyle, complete outfit, accessories, and shoes.
4. SCENE — design the requested environment and context.
5. POSE / ACTION — independently design the body pose and action.
6. EXPRESSION — independently design the facial expression appropriate to the scene/action.
7. WALLPAPER OUTPUT — resolve desktop vs phone and apply the technical format lock.

## 15. Priority and Conflict Resolution

For an Inaria wallpaper task, use this precedence:

1. Explicit user instruction for the current task
2. User-supplied visual person reference for visual identity evidence
3. This Inaria Character Specification for contextual character semantics when a visual reference exists; canonical visual/body specifications are fallback identity data only when no task-specific visual person reference exists
4. Applicable Universal Wallpaper rules
5. Selected Anime or Realistic Wallpaper rules
6. Optional presentation preferences in this file, excluding the original/reference outfit

A default presentation detail must never override an explicit user request.

A user-supplied image's clothing, pose, hairstyle arrangement, or composition does not override the task redesign rules unless the user explicitly requests preservation.

## 16. Scope Boundary

This document is a character authority, not:
- a Universal Wallpaper execution protocol;
- a Worker runtime;
- a batch/task state store;
- a QA acceptance system;
- a LoRA production protocol;
- a festival cultural database.

Those responsibilities remain with their canonical owners.
