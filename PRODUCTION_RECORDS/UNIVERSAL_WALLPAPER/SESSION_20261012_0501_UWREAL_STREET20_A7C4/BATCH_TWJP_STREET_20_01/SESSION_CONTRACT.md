# SESSION_CONTRACT.md

SESSION_ID: SESSION_20261012_0501_UWREAL_STREET20_A7C4
BATCH_ID: BATCH_TWJP_STREET_20_01
SESSION_SCOPE: NEW_AUTOMATED_BATCH
MODULE: UNIVERSAL_WALLPAPER
PRODUCTION_TYPE: REALISTIC
CHARACTER: INARIA
IMAGE_COUNT: 20
OUTPUT_TYPE: DESKTOP_16_9
THEME / FESTIVAL_SCOPE: 街道拍攝
SCENE: 台灣、日本
SEASON: 夏天、秋天
WEATHER: 晴天
TIME: 白天
PET_ALLOWED: NO
REFERENCE_SOURCE_TYPE: EXPLICIT_TASK_REFERENCE
REFERENCE_AUTHORITY_STATUS: RESOLVED
REFERENCE_ID: USER_UPLOADED_IMAGE_IN_CURRENT_REQUEST
REFERENCE_PROVENANCE: Image attached to the /START_AUTO request in this conversation
REFERENCE_VERIFICATION_STATUS: OBSERVED_IN_CURRENT_CONTEXT

## Constraints
- Twenty independent images, one image per Task, landscape desktop wallpaper 16:9.
- Unique street scene per image; Taiwan and Japan settings; summer/autumn; sunny daytime.
- No pets or animals.
- The uploaded image is the sole visual person reference. Preserve recognizable identity and natural proportions; source outfit must be replaced completely; source pose must not be copied.
- Apply current Universal Wallpaper rules, realistic photography rules, anatomy stability, and the Universal Wallpaper footwear allowlist.
- All prompts must be designed, persisted, locked, and read-back verified before any generation call.
- Do not run QA automatically. Production success is not QA acceptance.
- Generation result state and record writes must reflect observable evidence only.

DESIGN_EXECUTION_BOUNDARY: Prompt Set locked before generation; no prompt edits after lock. Each Task is one independent image.