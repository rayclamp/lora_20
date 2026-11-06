# LoRA Image Session Contract

SESSION_ID=SE-20261107-073632
BATCH_ID=BA-20261107-073632
MODULE=LORA_IMAGE
CHARACTER=INARIA
IMAGE_COUNT=15
OUTPUT_TYPE=MIXED_PER_TASK
SESSION_SCOPE=Prompt design, GitHub persistence, readback verification, and Prompt Set locking only.
CREATED_AT=2026-11-07T07:36:32+08:00
SOURCE_BRANCH=main
REFERENCE_POLICY=The user provides a person-reference image in the future producer conversation; the Console does not require or inspect it.
IDENTITY_AUTHORITY=The future production-time uploaded person image determines visible facial identity, apparent age, and reference-supported body build.
DESIGN_SCOPE=Fifteen distinct standalone English-language LoRA candidate prompts, each with a per-Task output type.
EXECUTION_BOUNDARY=No image generation, no producer startup, no image inspection, no QA.
QA_STATUS=PAUSED
BATCH_ROOT=PRODUCTION_RECORDS/LORA_IMAGE/SE-20261107-073632/BA-20261107-073632/

## Authorized scope

Create 15 Task records and 15 separate locked Prompt files; use the English-only authoring policy effective 2026-11-07. Save and read back all required files before marking the Prompt Set locked. The Prompt Set manifest is not a prompt-body store. No generation attempts or image results have occurred in this Console session.
