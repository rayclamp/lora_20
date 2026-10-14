# SESSION_CONTRACT.md

SESSION_ID: SESSION_20261014_UW_INARIA_BIKINI_01
BATCH_ID: BATCH_20261014_UW_INARIA_BIKINI_01
SESSION_SCOPE: New automated realistic Universal Wallpaper production
MODULE: UNIVERSAL_WALLPAPER
PRODUCTION_TYPE: REALISTIC
CHARACTER: INARIA
IMAGE_COUNT: 20
OUTPUT_TYPE: DESKTOP_16_9
THEME: Summer swimwear model photography, bikinis as the primary outfit
SCENE: Indoor and outdoor
SEASON: Summer
WEATHER: Sunny
TIME: Daytime
PET_ALLOWED: NO
REFERENCE_SOURCE_TYPE: EXPLICIT_TASK_REFERENCE
REFERENCE_AUTHORITY_STATUS: RESOLVED
REFERENCE_PROVENANCE: User-uploaded image attached to the current request; sole visual identity reference
REFERENCE_OUTFIT_POLICY: REPLACE
REFERENCE_POSE_POLICY: IGNORE
EXPECTED_OUTPUT_COUNT_PER_TASK: 1

## Constraints
- Each Task is one independent landscape 16:9 image.
- Use the uploaded image as the sole visual person reference; do not substitute another visual reference.
- Design all 20 prompts before generation and store each in its own PROMPTS/<TASK_ID>.md file.
- Prompt Set is a manifest only and must not contain prompt bodies.
- No pets or animals.
- Generation Worker records observable generation facts only; visual QA is separate and currently paused.
- A prompt version may not be used again after a confirmed image result. Hidden payload telemetry, if unavailable, must be marked NOT_EXPOSED/UNVERIFIED rather than invented.
