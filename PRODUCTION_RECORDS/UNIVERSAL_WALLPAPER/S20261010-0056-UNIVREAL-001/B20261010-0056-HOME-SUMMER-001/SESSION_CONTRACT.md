# SESSION_CONTRACT.md

SESSION_ID: S20261010-0056-UNIVREAL-001
BATCH_ID: B20261010-0056-HOME-SUMMER-001
SESSION_SCOPE: New /START_AUTO session; six independent realistic desktop wallpaper Tasks.
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
REFERENCE_IMAGE: EXPLICIT_TASK_REFERENCE; uploaded image is the sole visual identity reference for this task/batch.
CUSTOM_INSTRUCTIONS: 人物每張圖都穿裙子

REFERENCE_OUTFIT_POLICY: REPLACE
REFERENCE_POSE_POLICY: IGNORE
EXPECTED_OUTPUT_COUNT_PER_TASK: 1
PROMPT_SET_STATUS: PENDING
PROMPT_SET_LOCKED: NO

Design/execution boundary:
- GitHub is the authoritative reference and persistence database; ChatGPT is the Producer/runtime operator.
- One Task equals one independent image.
- All six prompts must be designed and persisted before any generation call.
- The uploaded image establishes visual identity only. Its outfit, pose, framing and composition are not inherited.
- Every generated image must depict the character wearing a skirt.
- No pets or other people.
- Generation success is distinct from visual QA; this session does not perform visual QA.
