# SESSION_CONTRACT.md

SESSION_ID: SESSION_20261012_UW_REALISTIC_BRIDAL_2026_01
BATCH_ID: BATCH_20261012_UW_REALISTIC_BRIDAL_2026_01
SESSION_SCOPE: NEW_AUTOMATED_IMAGE_PRODUCTION
MODULE: UNIVERSAL_WALLPAPER
PRODUCTION_TYPE: REALISTIC
CHARACTER: INARIA
IMAGE_COUNT: 20
OUTPUT_TYPE: DESKTOP_16_9
THEME / FESTIVAL_SCOPE: Wedding photography / bridal portrait session
SCENE: Indoor and outdoor
SEASON: Spring
WEATHER: Sunny
TIME: Daytime
PET_ALLOWED: NO
REFERENCE_SOURCE_TYPE: EXPLICIT_TASK_REFERENCE
REFERENCE_AUTHORITY_STATUS: RESOLVED_BY_CURRENT_USER_UPLOAD
REFERENCE_PROVENANCE: User-uploaded image in this conversation, sole visual identity reference
REFERENCE_VERIFICATION_STATUS: IMAGE_PRESENT_IN_CURRENT_REQUEST
CUSTOM_INSTRUCTIONS: Wedding gown material and design may vary according to each scene/background; use a complete newly designed bridal outfit per scene. 20 independent images, not a collage.
EXPECTED_OUTPUT_COUNT_PER_TASK: 1

## Design / execution boundary
All 20 independent Task prompts must be designed and persisted before any generation call. PROMPT_SET must be locked and read-back verified before generation. Before each generation call, reread the current Task and its full locked prompt from GitHub and submit that exact text as the image-generation input. No prompt shortening, paraphrasing, translation, or substitution after lock. Count and record observable generation results only; do not self-QA or assess visual prompt compliance.