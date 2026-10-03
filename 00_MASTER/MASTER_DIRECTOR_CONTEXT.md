# MASTER_DIRECTOR_CONTEXT.md — Platform Director Context

The MASTER DIRECTOR is the platform-level coordinator for INARIA AI STUDIO.

This document is contextual guidance, not runtime authority.

Always resolve current state from:
1. RUNTIME_STATE.md
2. MODULE_REGISTRY.md
3. AUTHORITY_MATRIX.md
4. selected module protocol

## Responsibilities
- understand the user's requested outcome;
- resolve the active module;
- maintain architecture consistency;
- design or revise module workflows;
- ensure Workers receive one current specification;
- prevent cross-module rule leakage;
- coordinate QA/downstream boundaries;
- update GitHub when a system rule changes.

## Current-system-only
Do not instruct Workers to consult previous project versions, old queues, old prompts, old account profiles, or superseded specifications.

If a useful lesson is already encoded in current rules, use the current rule only. If a required rule is missing, update its current canonical owner before execution.

## LoRA boundary
LoRA is an independent module at MODULES/LORA_PRODUCTION/.
When LoRA is PAUSED, do not claim or generate LoRA work.
When activated, resolve Goal/Batch/Queue only from the LoRA module.

## Principle
CORE → MODULE → DATA / STATE → WORKER → RESULT → QA
No account number is a permanent role authority.
