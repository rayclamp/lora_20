# WALLPAPER_COMPOSITION.md — Inaria Character-Dominant Wallpaper Composition Rules

## Purpose

This document defines the composition system for Inaria wallpaper design.

The goal is to prevent wallpaper generation from drifting toward a single default pattern such as:

**FULL-BODY + MEDIUM/FAR SHOT + SMALL CHARACTER + LARGE ENVIRONMENT**

A high-quality wallpaper may instead be a character-dominant portrait in which Inaria occupies most of the frame.

The rules apply to both **9:16 vertical** and **16:9 horizontal** wallpapers.

---

## Core principle

**Wallpaper aspect ratio does not determine character size.**

9:16 and 16:9 define the canvas shape, not whether the character should be small or large.

A wallpaper may be:

- environmental and distant;
- balanced between character and environment;
- a large character-dominant composition;
- a close portrait;
- a bust / half-body portrait;
- a 1/3-body portrait;
- a character-dominant full-body composition.

Do not require a complete full-body view for a wallpaper to be considered complete.

---

## Independent composition variables

The following variables must be controlled independently:

### FRAMING

Defines how much of the body is visible:

- CLOSE-UP / FACE
- HEAD-AND-SHOULDERS
- BUST
- 1/3-BODY
- HALF-BODY
- MEDIUM-BODY
- FULL-BODY

### CHARACTER_OCCUPANCY

Defines how much of the frame the character visually occupies:

- 25–40%
- 40–55%
- 55–70%
- 70–85%
- 85–95%

### SHOT_DISTANCE

Defines camera distance:

- EXTREME CLOSE
- CLOSE
- CLOSE-MEDIUM
- MEDIUM
- MEDIUM-FAR
- FAR

### CHARACTER_POSITION

Defines placement:

- CENTER
- LEFT
- RIGHT
- LEFT-CENTER
- RIGHT-CENTER
- SLIGHTLY HIGH
- SLIGHTLY LOW

### VISUAL_FOCUS

Defines what the viewer should notice first:

- FACE
- EYES
- EXPRESSION
- HAIRSTYLE
- FACE_AND_HAIR
- ACCESSORIES
- FACE_AND_ACCESSORIES
- UPPER_OUTFIT
- HAND_ACTION
- BODY_POSE
- FULL_CHARACTER
- ENVIRONMENT
- CHARACTER_AND_ENVIRONMENT

**FRAMING and CHARACTER_OCCUPANCY are not the same variable.**

Valid examples include:

- HALF-BODY + 45%
- HALF-BODY + 70%
- HALF-BODY + 85%
- 1/3-BODY + 70–85%
- FULL-BODY + 35%
- FULL-BODY + 60%
- FULL-BODY + 80%

Do not automatically shrink a half-body composition or automatically push a full-body composition into a distant shot.

---

## Character-dominant compositions

Character-dominant composition means the character occupies approximately **65–90%** of the frame and the environment serves primarily as supporting atmosphere.

These compositions are fully valid wallpaper designs.

They are especially useful for showing:

- facial features;
- face shape;
- eyes and iris color;
- hairstyle;
- hair strands;
- expression;
- earrings;
- necklaces;
- hair accessories;
- upper-body clothing;
- fabric and decorative details;
- character mood and personality.

The purpose is not merely to create a LoRA training image. Character-dominant composition is also a legitimate aesthetic wallpaper composition.

---

## Close-range composition

Close-range composition must be **actively considered**, not merely permitted.

During series planning, MASTER DIRECTOR should explicitly ask:

- Which images should emphasize the face?
- Which should emphasize the hairstyle?
- Which should emphasize accessories?
- Which should emphasize expression?
- Which should emphasize the upper outfit?
- Which should use a large half-body or 1/3-body composition?
- Which should remain full-body or environmental?

Do not wait for the user to explicitly request a close-up before creating one.

---

## 9:16 vertical wallpapers

For 9:16 wallpapers, the following are important character-dominant compositions:

- CLOSE-UP + 70–90%
- HEAD-AND-SHOULDERS + 70–90%
- BUST + 65–85%
- 1/3-BODY + 70–85%
- HALF-BODY + 65–85%
- MEDIUM-BODY + 55–80%
- FULL-BODY + 65–85%

In particular:

**BUST / 1/3-BODY / HALF-BODY + 70–85%**

should be treated as core composition options, not rare exceptions.

These compositions allow the face, hairstyle, expression, accessories, and upper clothing to dominate while retaining enough background for atmosphere.

---

## 16:9 horizontal wallpapers

16:9 wallpapers may also use very large character-dominant compositions.

Valid examples include:

- CLOSE-UP + 75–95%
- HEAD-AND-SHOULDERS + 70–90%
- BUST + 65–85%
- 1/3-BODY + 65–85%
- HALF-BODY + 65–85%
- MEDIUM-BODY + 55–80%
- CHARACTER-DOMINANT FULL-BODY + 65–85%
- ENVIRONMENTAL FULL-BODY + 25–50%

A horizontal wallpaper may therefore be a large close portrait of Inaria with only a small portion of the beach, pool, city, flowers, architecture, sky, or other environment visible.

Do not interpret horizontal format as a requirement to make the character small.

---

## Full-body is not the default

FULL-BODY is one valid framing category among several.

It must not become the automatic choice simply because the image is a wallpaper.

The series planner should intentionally balance:

- CLOSE-UP;
- HEAD-AND-SHOULDERS;
- BUST;
- 1/3-BODY;
- HALF-BODY;
- MEDIUM-BODY;
- FULL-BODY;
- ENVIRONMENTAL compositions.

Exact ratios are not mandatory. Meaningful visual variation is the requirement.

---

## Character-dominant versus environmental

Every wallpaper series should contain deliberate variation between:

### CHARACTER-DOMINANT

Character occupies approximately 65–90%.

Primary value:
- face;
- hair;
- expression;
- accessories;
- outfit;
- character atmosphere.

### BALANCED

Character occupies approximately 45–65%.

Character and environment share visual priority.

### ENVIRONMENTAL

Character occupies approximately 25–45%.

Primary value:
- location;
- architecture;
- weather;
- landscape;
- lighting;
- atmosphere.

Do not let an entire series collapse into only one of these categories.

---

## Visual-focus principle

Before designing each image, identify:

**What should the viewer notice first?**

A close portrait should not exist merely because a close-up slot needs to be filled.

For example:

- FACE → use a composition that clearly presents facial features and expression.
- HAIR → use lighting and framing that make hairstyle and hair flow readable.
- ACCESSORIES → ensure accessories are visible without risky hand interaction.
- OUTFIT → show enough upper clothing for material and design to read.
- ENVIRONMENT → allow sufficient negative space and environmental information.

---

## Wallpaper beauty versus LoRA coverage

Wallpaper design and LoRA dataset coverage may overlap, but they are not identical objectives.

A wallpaper must first be a beautiful finished visual work.

Do not sacrifice composition quality merely to expose more anatomy.

Do not force hands or feet into a close portrait.

Do not enlarge the environment merely to prove the location.

Do not force a full-body view merely to make the image feel complete.

A natural photographic-style crop can be more visually complete than an awkward full-body composition.

---

## Series planning requirement

Before generating a wallpaper series, create a composition plan containing:

- ACTION_LIST
- FRAMING_LIST
- CHARACTER_OCCUPANCY_LIST
- SHOT_DISTANCE_LIST
- VIEW_LIST
- CHARACTER_POSITION_LIST
- VISUAL_FOCUS_LIST

Then check:

1. Is there enough close-range work?
2. Are BUST / 1/3-BODY / HALF-BODY represented?
3. Are some characters intentionally large?
4. Are some images environmental?
5. Are 16:9 and 9:16 treated according to their own compositional strengths?
6. Are framing and character occupancy genuinely varied?
7. Are repeated compositions being removed?
8. Is the series still visually coherent?

---

## Final rule

**Do not define a good wallpaper as “a complete person placed inside a complete environment.”**

A good wallpaper can instead be:

**a beautiful, large, close view of Inaria in which the face, hairstyle, expression, accessories, clothing, lighting, and atmosphere form the primary visual experience.**

Both vertical and horizontal wallpapers may use this approach.
