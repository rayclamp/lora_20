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

## Reference-first generation

每次圖片生成均採用以下順序：

`MASTER_IMAGE → Character + Visual Style Reference → current Prompt Package → controlled changes → generation`

MASTER_IMAGE 必須同時作為人物與畫風參考。當前 Prompt Package 只負責指定本張圖片需要改變的服裝、場景、姿勢、鏡位、構圖、配件與情境。

Worker 不得把 MASTER_IMAGE 只當成臉部身份提示，也不得用抽象的「Japanese anime」重新選擇另一套動漫風格。

## Prompt construction
Prompt outputs should clearly separate character, clothing, scene, pose/camera, lighting/style, and negative constraints. Do not introduce unapproved character changes merely to make a prompt sound more detailed.
