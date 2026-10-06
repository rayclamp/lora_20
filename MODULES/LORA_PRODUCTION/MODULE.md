# LORA_PRODUCTION — Module Specification

## Status
PAUSED.

This module is not executable while its status is PAUSED. Activation requires an explicit User command handled by ChatGPT; GitHub records the resulting module/production state but does not activate the module itself.

## Production role

LoRA Production is a **production module**, not an independent runtime, Worker, scheduler, dispatch, or controller. It defines WHAT the LoRA dataset production should create. ChatGPT's internal production mechanisms determine HOW authorized tasks execute. Durable production records are stored under `PRODUCTION_RECORDS/LORA_PRODUCTION/<SESSION_ID>/<BATCH_ID>/`.

## Purpose
Build a high-quality age-20 Inaria LoRA training dataset.

## Module-owned rules
LoRA owns:
- age-20 identity and reference;
- LoRA style/reference baseline;
- dataset composition and diversity;
- candidate rules;
- LoRA-specific Goal/Batch/Task production data and constraints;
- LoRA-specific retry/recovery requirements to be interpreted by ChatGPT's internal production mechanisms;
- LoRA QA acceptance.

## Required read order when activated
CORE → this file → IDENTITY → DATASET → PRODUCTION → QA → current Batch/Queue/Task state

## Reference policy
An approved age-20 reference asset must be explicitly registered inside this module before activation.

Do not silently use a Wallpaper reference.

## Current state
No Goal is active.
No Batch is active.
No Queue is executable.
No Task is executable.

## Isolation
Do not import Wallpaper workflow, Festival cultural rules, account-specific authority, or superseded project specifications.
