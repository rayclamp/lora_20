# TASK_QUEUE
SESSION_ID: UW-20261010-1934
BATCH_ID: BATCH-01

| ORDER | TASK_ID | PROMPT_ID | PROMPT_VERSION | PROMPT_STATUS | TASK_STATUS | GENERATION_STATUS | EXPECTED_OUTPUT_COUNT | ACTUAL_OUTPUT_COUNT | PROMPT_CONSUMED | PROMPT_STATE | DELIVERY_INTEGRITY_STATUS | GENERATION_ATTEMPT_COUNT | RESULT_ID |
|---:|---|---|---|---|---|---|---:|---:|---|---|---|---:|---|
| 1 | T01 | P01 | V1 | CONSUMED | RESULT_RECEIVED_UNVERIFIED | IMAGE_RESULT_RECEIVED | 1 | 1 | YES | CONSUMED | NOT_EXPOSED | 1 | fbde38a2-89d6-4730-83b7-53d9f4696fc2 |
| 2 | T02 | P02 | V1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_EXPOSED | 0 | — |
| 3 | T03 | P03 | V1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_EXPOSED | 0 | — |
| 4 | T04 | P04 | V1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_EXPOSED | 0 | — |
| 5 | T05 | P05 | V1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_EXPOSED | 0 | — |
| 6 | T06 | P06 | V1 | LOCKED | PENDING | NOT_STARTED | 1 | 0 | NO | AVAILABLE | NOT_EXPOSED | 0 | — |

T01 image result was returned, so P01/V1 is consumed and must not be reused. Actual output count is 1. Delivery/payload telemetry is not exposed by the interface; result provenance is therefore UNVERIFIED, not falsely marked SUCCESS. T01 remains non-terminal pending applicable evidence/recovery handling.
