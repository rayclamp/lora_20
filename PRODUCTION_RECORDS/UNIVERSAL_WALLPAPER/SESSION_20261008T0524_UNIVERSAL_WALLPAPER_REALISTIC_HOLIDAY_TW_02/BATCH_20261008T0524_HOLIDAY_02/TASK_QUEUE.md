# TASK_QUEUE.md

SESSION_ID: SESSION_20261008T0524_UNIVERSAL_WALLPAPER_REALISTIC_HOLIDAY_TW_02
BATCH_ID: BATCH_20261008T0524_HOLIDAY_02

| ORDER | TASK_ID | PROMPT_ID | PROMPT_VERSION | PROMPT_STATUS | TASK_STATUS | GENERATION_STATUS | EXPECTED_OUTPUT_COUNT | POLICY_INTERRUPTION_COUNT | PROMPT_CONSUMED |
|---|---|---|---|---|---|---|---:|---:|---|
| 1 | TASK_01 | PROMPT_01 | v1 | LOCKED | EXECUTION_INTEGRITY_BLOCKED | RESULT_RECEIVED_INTEGRITY_BLOCKED | 1 | 0 | YES |
| 2 | TASK_02 | PROMPT_02 | v1 | LOCKED | EXECUTION_INTEGRITY_BLOCKED | RESULT_RECEIVED_INTEGRITY_BLOCKED | 1 | 0 | YES |
| 3 | TASK_03 | PROMPT_03 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO |
| 4 | TASK_04 | PROMPT_04 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO |
| 5 | TASK_05 | PROMPT_05 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO |
| 6 | TASK_06 | PROMPT_06 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO |

TASK_01 — 晴天／早上：台灣河岸文化區悠閒散步
TASK_02 — 雨天／早上：台南老宅書店咖啡館與大型城市地圖
TASK_03 — 晴天／黃昏：台灣山城咖啡露台欣賞山景
TASK_04 — 雨天／黃昏：台灣歷史街區透明傘散步
TASK_05 — 晴天／晚上：台灣城市屋頂花園藍調時刻休閒
TASK_06 — 雨天／晚上：台灣住家窗邊閱讀

DIVERSITY_PLAN:
- Weather coverage: 3 sunny, 3 rainy.
- Time coverage: 2 morning, 2 dusk/early-evening, 2 night.
- Presentation variation: loose hair, half-up, loose waves, low bun, polished low ponytail, loose hair behind ear.
- Footwear coverage uses only the Universal Wallpaper allowlist: sneakers, Mary Jane shoes, sandals, side-double-buckle ankle boots, high heels, slippers.
- Shot variation: character-dominant full-body, medium/half-body, medium-long full-body, character-dominant full-body, bust-to-medium, medium seated.
- No pet or animal in any Task.
- Each Task is one independent single-image desktop 16:9 output.
- No collage, grid, storyboard, contact sheet, split-screen, multi-panel output.

CURRENT_TASK: TASK_01
NEXT_TASK: TASK_03
