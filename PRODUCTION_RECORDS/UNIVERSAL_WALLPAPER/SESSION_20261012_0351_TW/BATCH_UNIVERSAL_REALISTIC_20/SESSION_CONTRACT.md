# SESSION_CONTRACT.md

SESSION_ID: SESSION_20261012_0351_TW
BATCH_ID: BATCH_UNIVERSAL_REALISTIC_20
MODULE: UNIVERSAL_WALLPAPER
PRODUCTION_TYPE: REALISTIC
CHARACTER: INARIA
IMAGE_COUNT: 20
OUTPUT_TYPE: DESKTOP_16_9
THEME: 依娜莉亞的休假生活
SCENE_SCOPE: 家中、室內、室外、百貨公司、商店、書店、路邊攤
SEASON: 春天、夏天
WEATHER: 晴天、雨天
TIME: 白天、黃昏、晚上
PET_ALLOWED: NO
CUSTOM_INSTRUCTIONS: 所有圖片一律採用裙裝，可以是長裙也可以是短裙。
REFERENCE_SOURCE_TYPE: EXPLICIT_TASK_REFERENCE
REFERENCE_AUTHORITY_STATUS: RESOLVED_BY_CURRENT_REQUEST
REFERENCE_ID: file_00000000917c8209811f7981b8ea464a
REFERENCE_PROVENANCE: User-uploaded image in the current request; sole visual identity reference for all 20 tasks.
REFERENCE_VERIFICATION_STATUS: Current-turn attachment identified; visual identity source available.
REFERENCE_OUTFIT_POLICY: REPLACE
REFERENCE_POSE_POLICY: IGNORE
EXPECTED_OUTPUT_COUNT_PER_TASK: 1
BATCH_STATUS: ACTIVE

## Execution contract
- One Task produces one independent 16:9 image.
- All 20 prompts are designed before generation and locked in PROMPT_SET.md.
- Use each complete locked prompt unchanged as the generation input.
- Do not use pets, copy the source outfit/pose, distort body proportions, or add text/logos/watermarks.
- Persist results and read back all records after each Task.