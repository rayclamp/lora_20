# SESSION_CONTRACT.md

SESSION_ID: SESSION_20261008_1910_AUTO_01
BATCH_ID: BATCH_20261008_1910_HOLIDAY_01
SESSION_SCOPE: Automated Universal Wallpaper realistic desktop batch
MODULE: UNIVERSAL_WALLPAPER
PRODUCTION_TYPE: REALISTIC
CHARACTER: INARIA
IMAGE_COUNT: 12
OUTPUT_TYPE: DESKTOP_16_9
THEME / FESTIVAL_SCOPE: 休假日的生活
SCENE: 不限
SEASON: 夏天
WEATHER: 晴天、雨天
TIME: 白天、黃昏、晚上
PET_ALLOWED: NO
REFERENCE_SOURCE_TYPE: EXPLICIT_TASK_REFERENCE
REFERENCE_AUTHORITY_STATUS: RESOLVED
REFERENCE_ID: file_0000000004388207bc4f13712d9b26da
REFERENCE_PROVENANCE: Current user-uploaded image; sole visual person reference
REFERENCE_VERIFICATION_STATUS: OBSERVABLE_IN_CURRENT_CONTEXT
REFERENCE_OUTFIT_POLICY: REPLACE
REFERENCE_POSE_POLICY: IGNORE
CUSTOM_INSTRUCTIONS: 人物一率穿裙子

OUTPUT CONTRACT:
- 12 independent Tasks.
- One independent desktop wallpaper image per Task.
- EXPECTED_OUTPUT_COUNT = 1 per Task.
- No collage, contact sheet, grid, storyboard, or multi-panel output.

IDENTITY CONTRACT:
- Preserve the actual visual identity established by the supplied reference image: recognizable facial structure, facial-feature proportions, eye shape and iris appearance, hairline, natural hair color, skin tone, age appearance, body build, natural body proportions, and distinctive visual traits.
- Do not normalize the referenced person toward canonical Inaria visual/body values.
- Inaria character specification is used for contextual character semantics only because a visual reference is supplied.
- Replace the source outfit completely and independently.
- Do not copy the source pose, hand placement, framing, or composition.

PRESENTATION CONTRACT:
- Photorealistic human photography.
- Summer holiday everyday-life context.
- Every Task uses a complete skirt-based outfit; footwear must be from the Universal Wallpaper allowlist.
- PET_ALLOWED=NO means no pet or animal is intentionally included.
- Deliberate variation across hairstyle arrangement, clothing, shoes, accessories, pose/action, viewpoint, shot size, environment, weather, time, and lighting while preserving identity.
- Apply anatomy and generation-stability rules during prompt design.
- Generation Worker does not perform visual QA.

DESIGN/EXECUTION BOUNDARY:
All 12 prompts must be designed and persisted before generation. PROMPT_SET must be locked before the first generation call.
