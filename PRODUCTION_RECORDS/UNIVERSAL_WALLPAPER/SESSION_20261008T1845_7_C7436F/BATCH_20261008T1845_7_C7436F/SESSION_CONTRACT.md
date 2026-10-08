# SESSION_CONTRACT.md

SESSION_ID: SESSION_20261008T1845_7_C7436F
BATCH_ID: BATCH_20261008T1845_7_C7436F
SESSION_SCOPE: New /START_AUTO automated production session
MODULE: UNIVERSAL_WALLPAPER
PRODUCTION_TYPE: REALISTIC
CHARACTER: INARIA
IMAGE_COUNT: 7
OUTPUT_TYPE: DESKTOP_16_9
THEME: 休假日的生活
SCENE: UNLIMITED
SEASON: SUMMER
WEATHER: SUNNY, RAINY
TIME: DAYTIME, GOLDEN_HOUR, NIGHT
PET_ALLOWED: NO
REFERENCE_SOURCE_TYPE: EXPLICIT_TASK_REFERENCE
REFERENCE_AUTHORITY_STATUS: RESOLVED
REFERENCE_ID: file_0000000043f082118c8885a8052f7126
REFERENCE_PROVENANCE: User-uploaded image in current conversation; sole visual person reference
REFERENCE_VERIFICATION_STATUS: OBSERVABLE_IN_CURRENT_CONTEXT
CUSTOM_INSTRUCTIONS: 人物一率穿裙子

ENTRY_GATE:
- GITHUB_DATABASE_CONNECTION: VERIFIED
- CANONICAL_RULE_LOADING: PASS
- GITHUB_RULES_LOADED: YES
- GENERATION_ALLOWED: YES

DESIGN / EXECUTION BOUNDARY:
- IMAGE_COUNT means 7 independent Tasks.
- Wallpaper EXPECTED_OUTPUT_COUNT = 1 per Task.
- All seven Locked Prompts are designed and persisted before any generation call.
- Locked Prompts are immutable during execution.
- Each Locked Prompt/version may receive at most one actual generation call.
- Generation Worker does not perform visual QA.
- PET_ALLOWED=NO is mandatory.
- Every Task outfit must be a complete independently designed skirt outfit; source outfit is replaced.
- Source pose is ignored; every Task uses an independently designed stable pose/action.
- Universal Wallpaper footwear must use only the canonical allowlist.
