# Generation Rules

## Priority order
1. Preserve locked character identity and proportions.
2. Preserve explicitly locked pose/composition elements.
3. Ensure anatomy and generation stability.
4. Achieve the requested clothing, scene, lighting, and mood.
5. Add visual richness only after the above are stable.

## Hands and feet
- Design actions that are easy for image models to render correctly.
- Prefer natural hand placement and partially occluded fingers when appropriate.
- Do not place busy effects directly around fingers.
- Avoid poses that unnecessarily expose difficult finger/toe configurations.

## Editing rule
When the task is a local edit, change only the requested region whenever technically feasible. Preserve the original lighting, color balance, composition, face, hair, clothing, hands, feet, and background unless the request explicitly says otherwise.

## AI-generation practicality
Designs should not only look attractive; they must be realistically achievable with the user's ComfyUI workflow and selected models. When there is a conflict between a spectacular but unstable pose and a simpler stable pose, prefer the stable pose.

## Prompt construction
Prompt outputs should clearly separate character, clothing, scene, pose/camera, lighting/style, and negative constraints. Do not introduce unapproved character changes merely to make a prompt sound more detailed.
