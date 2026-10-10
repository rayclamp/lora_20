# LORA_IMAGE Dataset Diversity Rules

## Goal

Build a useful, varied training set without weakening identity consistency or generation stability. Variation should be purposeful rather than random.

## Dimensions to vary where appropriate

Across a set of tasks, consider varying:

- viewpoint and camera angle;
- shot size and framing;
- subject placement and composition;
- hairstyle arrangement and hair styling;
- clothing and garment silhouette;
- accessories and shoes;
- pose and body orientation;
- main action and hand activity;
- expression and mood when requested/appropriate;
- scene and environment;
- lighting;
- weather and season when relevant;
- camera feel and depth of field.

The current uploaded reference remains the visual identity authority. Vary presentation without arbitrarily changing stable identity cues or body proportions.

## Avoid near-duplicates

- Do not repeat the same main action across nearby tasks without a meaningful reason.
- Avoid batches in which background, pose/action, outfit, and framing are effectively identical.
- Avoid producing multiple images that differ only by minor decorative details while contributing nearly the same training information.
- Avoid using one pose, one shot size, or one scene as the entire dataset when other useful variations are possible.
- Do not treat color changes alone as sufficient diversity when the underlying composition and action are duplicates.

## Balance and priority

- Identity consistency and anatomy stability are higher priorities than forced novelty.
- Do not invent extreme poses, difficult hand gestures, exaggerated perspectives, or complex props just to make images different.
- Prefer stable and natural actions that contribute a genuinely different pose, activity, angle, framing, or context.
- Reuse a useful design element only when it serves the current task; avoid accidental repetition patterns across nearby candidates.
- Diversity is a set-level goal. Every individual image does not need to vary every listed dimension.

## No inherited module styling

Do not automatically import wallpaper outfit rules, festival costume facts, or another module's props/style. Use only the active LORA_IMAGE request, its current uploaded identity reference, applicable CORE rules, and any explicitly applicable contextual character data.
