# SESSION_CONTRACT.md

SESSION_ID: SESSION_20261011T0040_VAMPIRE_QUEEN_01
BATCH_ID: BATCH_001
SESSION_SCOPE: 新的 /START_AUTO 自動化圖片生產工作階段
MODULE: UNIVERSAL_WALLPAPER
PRODUCTION_TYPE: REALISTIC
CHARACTER: INARIA
IMAGE_COUNT: 5
OUTPUT_TYPE: DESKTOP_16_9
THEME / FESTIVAL_SCOPE: 吸血鬼女王角色扮演
SCENE: 中古世紀的歐洲城堡
SEASON: 夏天
WEATHER: 晴天
TIME: 夜晚
PET_ALLOWED: NO
REFERENCE_IMAGE: 本次對話中使用者上傳的照片；唯一視覺身份參考
REFERENCE_SOURCE_TYPE: EXPLICIT_TASK_REFERENCE
REFERENCE_AUTHORITY_STATUS: RESOLVED
REFERENCE_ID: file_0000000000d88209b81d05a5751f76db
REFERENCE_PROVENANCE: current user-uploaded reference image
REFERENCE_VERIFICATION_STATUS: OBSERVABLE_IN_CURRENT_CONVERSATION
REFERENCE_OUTFIT_POLICY: REPLACE
REFERENCE_POSE_POLICY: IGNORE

CUSTOM_INSTRUCTIONS:
- 吸血鬼僅為角色扮演主題，不加入尖牙、翅膀、利爪等吸血鬼身體特徵。
- 女性貴族服裝採短裙設計並帶有吸血鬼／哥德式元素。
- 不要高領、披風、披肩。
- 服裝主色藏青，搭配淺藍色與白色。
- 主要光源盡量使用藍色月光。
- 不加入寵物或其他人物。
- 來源服裝必須替換，來源姿勢必須忽略。
- 五張圖片必須是五個獨立 Task，並有合理的寫實桌布呈現變化。

DESIGN / EXECUTION BOUNDARY:
- GitHub is authoritative reference and persistence database.
- Complete locked prompts are the actual generation inputs.
- Producer does not perform visual QA after generation.
- Each wallpaper Task has EXPECTED_OUTPUT_COUNT=1.
