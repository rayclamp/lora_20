# Runtime Verification — Phase 7 Single-Worker End-to-End

## Purpose

Phase 7 verifies the smallest complete production loop:

`USER REQUEST → SYSTEM DESIGN → PROMPT → EXECUTION AUTHORIZATION → GENERATION → RESULT → CHECKPOINT`

This is the primary proof that the Worker can create an executable Prompt from a user requirement rather than requiring the user to author the Prompt.

## Implemented

- system-owned design adapter boundary;
- user request to design/prompt transformation;
- canonical context resolution before design;
- locked executable Prompt;
- Manual mode prompt preview + explicit user confirmation;
- Automated mode execution authorization;
- exact locked-Prompt handoff to the generation adapter;
- prompt correspondence verification when provider telemetry is exposed;
- output-format verification when provider metadata is exposed;
- persisted end-to-end execution trace.

## Verification

`scripts/test_phase7_single_worker_e2e.mjs` verifies both:
- MANUAL: request → design → Prompt → preview → explicit confirmation → generation;
- AUTOMATED: request → design → Prompt → automation authorization → generation.

The test generation adapter is deterministic and does not invoke a live image provider.

## Important boundary

Phase 7 proves the Worker control path and Prompt-generation contract. It does **not** certify a live external image provider.

A live provider adapter is a later integration boundary and must receive the exact locked Prompt produced by the Worker.

## Current maturity

`LEVEL_3_SINGLE_WORKER_END_TO_END_CONTROL`

This remains below live-provider production certification.
