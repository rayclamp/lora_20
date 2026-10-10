# SESSION_CONTRACT.md

SESSION_ID: SESSION_20261010_2030_POOL_REALISTIC_A7C2
BATCH_ID: BATCH_20261010_SUMMER_WATER_3IMG
SESSION_SCOPE: New automated production session; three independent realistic desktop wallpapers.
MODULE: UNIVERSAL_WALLPAPER
PRODUCTION_TYPE: REALISTIC
CHARACTER: INARIA
IMAGE_COUNT: 3
OUTPUT_TYPE: DESKTOP_16_9
THEME / FESTIVAL_SCOPE: 夏日玩水
SCENE: 游泳池、水上樂園
SEASON: 夏天
WEATHER: 晴天
TIME: 白天
PET_ALLOWED: NO
REFERENCE_IMAGE: Explicit task reference supplied in current conversation; uploaded image is the sole visual person reference.
CUSTOM_INSTRUCTIONS: NONE

REFERENCE_SOURCE_TYPE: EXPLICIT_TASK_REFERENCE
REFERENCE_AUTHORITY_STATUS: RESOLVED
REFERENCE_PROVENANCE: Current user-uploaded image in this conversation.
REFERENCE_VERIFICATION_STATUS: VISUALLY_AVAILABLE_IN_CURRENT_REQUEST

SESSION RULES:
- One Task equals one independent image; expected output count per Task is exactly 1.
- Design all prompts before generation and lock the complete Prompt Set before any generation call.
- Preserve the reference person's recognizable facial identity, hairline/natural hair color, skin tone, body build, and natural body proportions.
- Replace the source outfit completely; ignore the source pose and independently design each pose/action.
- Realistic photographic appearance; adult woman; tasteful, non-explicit summer swimwear suitable for a public pool/water park.
- No pets.
- Target landscape desktop wallpaper aspect ratio 16:9.
- Apply CORE, Drawing Instructions, Anatomy Stability, Generation Rules, Realistic Wallpaper Rules, Universal Wallpaper Reference Policy, footwear allowlist where applicable, and Image Generation Safety Spec.
- QA is not activated by this session; generation is not a QA pass.
- Do not claim hidden payload telemetry. If not exposed, record DELIVERY_INTEGRITY_STATUS as NOT_EXPOSED or UNVERIFIED.
