# TASK_QUEUE.md
SESSION_ID: SESSION_20261010_1949_REALISTIC_POOL
BATCH_ID: BATCH_001
EXPECTED_OUTPUT_COUNT: 1 per wallpaper Task

| ORDER | TASK_ID | PROMPT_ID | PROMPT_VERSION | PROMPT_STATUS | TASK_STATUS | GENERATION_STATUS | EXPECTED_OUTPUT_COUNT | ACTUAL_OUTPUT_COUNT | PROMPT_MATCH_STATUS | PROMPT_CONSUMED | PROMPT_STATE |
|---:|---|---|---|---|---|---|---:|---:|---|---|---|
| 1 | TASK_001 | PROMPT_001 | v1 | RETIRED | IMAGE_RESULT_RECORDED | IMAGE_RESULT_RECEIVED | 1 | 1 | UNVERIFIED | YES | RETIRED |
| 2 | TASK_002 | PROMPT_002 | v1 | RETIRED | IMAGE_RESULT_RECORDED | IMAGE_RESULT_RECEIVED | 1 | 1 | UNVERIFIED | YES | RETIRED |
| 3 | TASK_003 | PROMPT_003 | v1 | RETIRED | IMAGE_RESULT_RECORDED | IMAGE_RESULT_RECEIVED | 1 | 1 | UNVERIFIED | YES | RETIRED |

NOTE: Each Task returned one image, so each result is counted and each locked Prompt is consumed/retired. Earlier log entries asserted prompt/input mismatch but did not preserve the actual submitted payload or a verifiable diff; therefore the effective PROMPT_MATCH_STATUS is UNVERIFIED, not a proven MISMATCH. The user reports that all three images visually matched the intended prompts. That report is not an automated QA result. All three Tasks are terminal; no further generation call or prompt reuse is permitted.