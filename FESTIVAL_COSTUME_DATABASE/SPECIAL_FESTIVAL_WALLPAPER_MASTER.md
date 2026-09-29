# SPECIAL FESTIVAL WALLPAPER — MASTER INSTRUCTION

## Purpose

This is the dedicated master instruction for the Special Festival Wallpaper system.

It is separate from:
- the age-20 Inaria LoRA production system;
- the general wallpaper system;
- the age-20 MASTER_IMAGE identity lock.

## Character reference

The character reference is a task parameter.

- Use the explicitly supplied/approved character reference for the current task.
- Do not assume age 20 unless the task specifies the age-20 Inaria reference.
- Do not replace the supplied character reference with `MASTER_IMAGE/INARIA_20_MASTER_v1.0.png` unless the task explicitly requests it.
- Preserve the active reference's identity and visual characteristics.

## Festival lookup

Before designing an image:

1. Read `00_CORE_FESTIVALS/CORE_FESTIVAL_INDEX.md`.
2. Identify the requested FESTIVAL_ID.
3. Read the festival record.
4. Read relevant tags.
5. Read only the category catalogs needed for the design.
6. Use `FESTIVAL_ITEM_LINK_MATRIX.md` to identify relevant categories.
7. Prefer documented traditional items; modern items are supplemental.
8. Do not invent cultural data that is absent or unsupported.

Retrieval model:

**Festival → Tags → Category Items**

## Fixed festival scope

Group 00 currently contains 48 core festivals.

Do not add or remove festivals unless the user explicitly requests a scope revision.

## Category scope

The database uses 10 categories:

1. CLOTHING
2. ACCESSORIES
3. SOCKS
4. SHOES
5. HEADWEAR
6. HAIRSTYLE
7. MAKEUP
8. BODY_DECORATION
9. PROPS
10. OTHER

Female-focused clothing is the current scope. Unisex items may be used when culturally appropriate. Male-only clothing is not separately maintained.

## Cultural correctness

A festival name alone is not sufficient.

Every selected item must be compatible with:
- festival;
- region/cultural scope;
- historical/contextual setting;
- cultural sensitivity;
- recognizable festival cues.

Do not mix culturally distinct regional traditions merely because their appearance is similar.

## Anatomy and action

All human-anatomy rules come from:

`00_MASTER/ANATOMY_STABILITY.md`

This includes:
- hand topology;
- left/right handedness;
- BACK/BACK_3/4 handedness risk;
- finger/toe stability;
- hand-object contact;
- wearable/strap stability;
- anatomy–background separation.

Do not invent a separate festival-specific anatomy standard.

## View rule

Special Festival Wallpaper allows:

- FRONT
- FRONT_3/4_LEFT
- FRONT_3/4_RIGHT
- SIDE_LEFT
- SIDE_RIGHT

Special Festival Wallpaper prohibits:

- BACK
- BACK_3/4

This restriction exists because the system is intended to clearly present festival clothing, accessories, hairstyle, makeup, body decoration, and props.

## Design priorities

1. Active character reference / identity
2. Verified festival and cultural data
3. Cultural correctness
4. Festival recognizability
5. Clothing and accessory presentation
6. Anatomy stability
7. Natural action and pose
8. Scene and atmosphere
9. Wallpaper composition
10. Visual diversity and creativity

## Worker output

For each image, record at minimum:

- IMAGE_ID
- FESTIVAL_ID
- REGION / CULTURAL_SCOPE
- OUTFIT_ARCHETYPE
- selected category items
- SCENE
- ACTIVITY
- POSE
- HAND_ACTION
- LEG_POSITION
- VIEW
- SHOT
- CAMERA / LENS
- CHARACTER_POSITION
- COMPOSITION
- LIGHTING
- WEATHER
- SEASON
- FESTIVAL_RECOGNITION
- CULTURAL_REASON
- FULL_PROMPT
- NEGATIVE_PROMPT

Workers may decide creative composition within the verified cultural boundaries. The database defines what is culturally appropriate; it does not force every image to use every available category.

## Boundary with LoRA production

This system is a cultural-reference and wallpaper-design system.

It must not be used to:
- change the age-20 LoRA MASTER_IMAGE;
- add festival-specific identity traits to the LoRA identity specification;
- treat festival clothing as permanent Inaria identity;
- import Special Festival Wallpaper's no-back-view rule into general LoRA production.

