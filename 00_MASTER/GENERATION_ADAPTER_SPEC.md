# GENERATION_ADAPTER_SPEC.md — Council Round 6 Phase 6

## Purpose
Define the boundary between runtime orchestration and an external image generator.

## Contract
generate(task) returns exactly:
- SUCCESS with result reference and output count;
- FAILED with explicit error;
- UNKNOWN when execution outcome cannot be established.

The adapter must not decide QA acceptance.

## Input
The adapter receives only the authorized task payload and execution metadata required by the active module.

## Output-count rule
Expected output count is read from the task record.
Actual output count is recorded independently.

Mismatch is recorded as OUTPUT_COUNT_MISMATCH; it does not create new Task IDs.

## Idempotency
The adapter must accept a stable IDEMPOTENCY_KEY.
A runtime restart must not cause automatic duplicate generation for IMAGE_CREATED.

## Current repository
The deterministic runtime harness uses a mock adapter for verification.
ComfyUI integration remains an external adapter implementation and is not claimed as runtime-verified until connected to this contract.
