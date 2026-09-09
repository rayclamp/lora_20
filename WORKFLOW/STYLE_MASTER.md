# STYLE_MASTER.md

## Purpose

This is the shared visual-style master for every ACCOUNT in the `lora_20` project.

Its purpose is to keep the visual language consistent across different ChatGPT accounts and prevent historical conversations or unrelated previous image generations from changing the project's intended style.

## Master Style

- Romantic
- High-end / luxurious
- Beautiful / refined
- Dreamy
- Japanese airy aesthetic (日系空氣感)
- Delicate light and shadow
- Naturally luminous skin
- Realistic, natural visual texture
- Best quality
- Ultra-clear
- Ultra-high resolution
- 8K preference

## Clothing Color Direction

- Main color: water blue (水藍色)
- Secondary color: navy blue (藏青色)

These are preferred color directions, not a requirement that every single garment use both colors.

## Flower Direction

Frequently used flower varieties:

- Japanese blue starflower (日本藍星花)
- Blue butterfly pea flower (藍色粉蝶花)

Rules:

1. The primary flower variety for a scene should be one variety only.
2. Other flowers may be introduced when they are appropriate for the scene.
3. The two frequently used varieties should not be forced to appear together in every image.

## Composition

Supported project compositions:

- Vertical: 9:16
- Horizontal: 16:9

Choose the ratio required by the current task. Do not combine both ratios in one image.

## Style Consistency Rule

The style of the current project must be determined by this file and the designated project references.

Do not infer the current style from:

- previous chats
- previous generations
- unrelated illustration requests
- historical images generated in another style
- an ACCOUNT's personal or historical style tendency

If a historical style conflicts with this file, this file takes precedence.

## Separation of Responsibilities

- MASTER_IMAGE defines who the character is.
- STYLE_MASTER defines the shared visual language.
- DRAWING_INSTRUCTIONS stores the user's commonly used drawing prompt and detailed preferences.
- The current task defines what is being changed or generated for the specific image.

An ACCOUNT may vary the scene, clothing design, pose, action, environment, flowers, and other task-specific elements when instructed, but must not silently replace the shared visual style.
