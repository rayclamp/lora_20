# SESSION_CONTRACT.md
SESSION_ID: UA_20261010T011100+0800
BATCH_ID: UB_20261010_HOME_SUMMER_06
SESSION_SCOPE: New automated production session
MODULE: UNIVERSAL_WALLPAPER
PRODUCTION_TYPE: REALISTIC
CHARACTER: INARIA
IMAGE_COUNT: 6
OUTPUT_TYPE: DESKTOP_16_9
THEME / FESTIVAL_SCOPE: 放假日常
SCENE: 家中
SEASON: 夏天
WEATHER: 晴天、雨天
TIME: 白天、黃昏、晚上
PET_ALLOWED: NO
REFERENCE_IMAGE: EXPLICIT_TASK_REFERENCE — current user-uploaded image, sole visual person reference
REFERENCE_OUTFIT_POLICY: REPLACE
REFERENCE_POSE_POLICY: IGNORE
CUSTOM_INSTRUCTIONS: 人物每張圖都穿短裙
EXPECTED_OUTPUT_COUNT_PER_TASK: 1
DESIGN_BOUNDARY: Complete all six prompts, persist and lock the full Prompt Set, and verify readback before any generation call. Use the current uploaded image only for visual identity/body reference; independently design outfit, pose, action, framing, and environment.
EXECUTION_BOUNDARY: One Task per independent image. Read back the current Task and matching complete locked Prompt before each generation call. Record actual result and evidence; no visual QA or unsupported success claims.
CANONICAL_RULE_LOADING: VERIFIED on main branch
