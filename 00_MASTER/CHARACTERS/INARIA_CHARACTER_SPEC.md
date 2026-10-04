# INARIA_CHARACTER_SPEC.md — Canonical Character Specification

## Authority

This document is the canonical character specification for Inaria / 依娜莉亞.

It defines character identity, stable identity anchors, personality, preferences, default world setting, and default everyday visual presentation.

It does not override a user-supplied visual person reference for a specific wallpaper task.

For Universal Wallpaper:
- A user-supplied image is the sole visual person reference when one is provided.
- This character specification is the character-semantic specification when the user explicitly requests Inaria / 依娜莉亞.
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

When Inaria is explicitly requested, preserve:
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

## 11. Default Everyday Outfit

This is Inaria's main default everyday-outing design, not a permanent clothing lock.

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

## 12. Everyday Outfit Usage Rule

The default everyday outfit is a reusable character styling reference, not a mandatory outfit for every Inaria wallpaper.

When the user asks for:
- "依娜莉亞的日常" / "Inaria's everyday life" without specifying a different outfit, this outfit may be used as the canonical default starting point.
- a specific activity, destination, season, weather, or social context, design a complete outfit appropriate to that context while preserving Inaria's identity and overall color/style language where appropriate.
- a new outfit, redesign the complete outfit rather than merely adding an outer layer to an existing source outfit.

For a task with a supplied reference image:
- the uploaded source outfit remains non-authoritative by default;
- REFERENCE_OUTFIT_POLICY is REPLACE;
- the default Inaria outfit may be used only when it is appropriate to the task; it must not be confused with or copied from the uploaded source outfit.

## 13. Reference-Image Relationship

When the user supplies an image and explicitly requests Inaria:

REFERENCE IMAGE
- sole visual person reference;
- establishes who the visual person is for the current task;
- may establish facial/body visual evidence.

INARIA CHARACTER SPEC
- establishes that the requested character is Inaria;
- supplies stable character semantics and identity constraints;
- supplies default world/personality/preferences and default everyday styling;
- is not a second visual identity image.

TASK INTENT
- decides the requested scene, activity, expression, presentation, and wallpaper output.

The Worker must never resolve this relationship by simply copying the reference image's outfit, hairstyle, pose, or composition.

## 14. Canonical Design Sequence for Inaria Wallpaper

When the user requests an Inaria wallpaper with a supplied reference image, resolve the task in this order:

1. REFERENCE PERSON — use the uploaded image as the sole visual person reference.
2. INARIA CHARACTER PROFILE — load this specification because the user explicitly requested Inaria.
3. PRESENTATION REDESIGN — design hairstyle, complete outfit, accessories, and shoes.
4. SCENE — design the requested environment and context.
5. POSE / ACTION — independently design the body pose and action.
6. EXPRESSION — independently design the facial expression appropriate to the scene/action.
7. WALLPAPER OUTPUT — resolve desktop vs phone and apply the technical format lock.

## 15. Priority and Conflict Resolution

For an Inaria wallpaper task, use this precedence:

1. Explicit user instruction for the current task
2. User-supplied visual person reference for visual identity evidence
3. This Inaria Character Specification for stable character semantics
4. Applicable Universal Wallpaper rules
5. Selected Anime or Realistic Wallpaper rules
6. Default presentation preferences in this file

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
