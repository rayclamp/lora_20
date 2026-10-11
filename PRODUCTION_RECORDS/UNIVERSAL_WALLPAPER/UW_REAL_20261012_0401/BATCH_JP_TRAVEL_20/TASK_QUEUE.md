# TASK_QUEUE.md
SESSION_ID: UW_REAL_20261012_0401
BATCH_ID: BATCH_JP_TRAVEL_20

| ORDER | TASK_ID | PROMPT_ID | PROMPT_VERSION | PROMPT_STATUS | TASK_STATUS | GENERATION_STATUS | EXPECTED_OUTPUT_COUNT | ACTUAL_OUTPUT_COUNT | PROMPT_CONSUMED | PROMPT_STATE | PROMPT_MATCH_STATUS |
|---:|---|---|---|---|---|---|---:|---:|---|---|---|
| 1 | T001 | P_T001 | v1 | RETIRED | IMAGE_RESULT_RECORDED | IMAGE_RESULT_RECEIVED | 1 | 1 | YES | RETIRED | NOT_ASSESSED |
| 2 | T002 | P_T002 | v1 | RETIRED | IMAGE_RESULT_RECORDED | IMAGE_RESULT_RECEIVED | 1 | 1 | YES | RETIRED | NOT_ASSESSED |
| 3 | T003 | P_T003 | v1 | RETIRED | SUCCESS | SUCCESS | 1 | 1 | YES | RETIRED | NOT_ASSESSED |
| 4 | T004 | P_T004 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 5 | T005 | P_T005 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 6 | T006 | P_T006 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 7 | T007 | P_T007 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 8 | T008 | P_T008 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 9 | T009 | P_T009 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 10 | T010 | P_T010 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 11 | T011 | P_T011 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 12 | T012 | P_T012 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 13 | T013 | P_T013 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 14 | T014 | P_T014 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 15 | T015 | P_T015 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 16 | T016 | P_T016 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 17 | T017 | P_T017 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 18 | T018 | P_T018 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 19 | T019 | P_T019 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |
| 20 | T020 | P_T020 | v1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_ASSESSED |


## T001 execution evidence
- DELIVERY_INTEGRITY_STATUS: KNOWN_EXECUTION_DEVIATION
- RESULT_ID: image generation gen_id 408c9740-6c33-4764-808a-d4f0cf0da58b; generated file /mnt/data/a_bright_airy_springtime_outdoor_scene_a_photore.png
- ACTUAL_OUTPUT_COUNT: 1
- PROMPT_CONSUMED: YES
- PROMPT_STATE: RETIRED
- NOTE: The generation interface call used a rewritten scene description rather than the complete locked prompt. This known deviation is recorded honestly; the received image is counted and the locked prompt must not be reused.


## T002 execution evidence
- DELIVERY_INTEGRITY_STATUS: KNOWN_EXECUTION_DEVIATION
- RESULT_ID: image generation gen_id 4dc2a1c8-f2b7-4a11-8191-6d2efd90119f; generated file /mnt/data/a_wide_cinematic_photorealistic_street_scene_por.png
- ACTUAL_OUTPUT_COUNT: 1
- PROMPT_CONSUMED: YES
- PROMPT_STATE: RETIRED
- NOTE: The generation interface call used a rewritten scene description rather than the complete locked prompt. This known deviation is recorded honestly; do not reuse P_T002.


## T003 execution evidence
- RESULT_STATUS: SUCCESS
- GENERATION_CALL_ID: 7c6d2304-456c-439c-86bb-844e56ded48e
- RESULT_ID: /mnt/data/a_wide_cinematic_photorealistic_cg_like_image_of.png
- ACTUAL_OUTPUT_COUNT: 1
- PROMPT_CONSUMED: YES
- PROMPT_STATE: RETIRED
- PROMPT_MATCH_STATUS: NOT_ASSESSED
- QA_STATUS: PAUSED
