# CORE_RULES.md — Cross-System Core Rules

## Purpose

This document defines the rules shared by every production system in this repository.

The CORE is system-independent. It does not define how a particular module produces, uploads, reviews, or trains anything.

Every active module MUST load the applicable CORE rules before executing its own workflow.

## Shared rule domains

The following documents are CORE rules and are reusable across modules:

- `00_MASTER/DRAWING_INSTRUCTIONS.md` — generation-time drawing and stability constraints.
- `00_MASTER/ANATOMY_STABILITY.md` — hard anatomy, limb-source, handedness, pose, and readability constraints.
- `00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md` — generation-result safety, preservation, interruption, duplicate prevention, state protection, and Production/QA boundary.
- `00_MASTER/GENERATION_RULES.md` — shared generation constraints where applicable.
- `00_MASTER/GENERATION_WORKER_PROTOCOL.md` — shared Worker execution principles where applicable.

## Universal principles

1. CORE rules apply to every module unless a module explicitly declares a stricter rule.
2. A module may add constraints, but must not silently weaken a CORE hard rule.
3. Module-specific workflow rules do not become CORE rules merely because one module uses them.
4. Character identity, visual reference, dataset policy, task schema, queue semantics, upload destination, QA criteria, and external automation behavior are module-specific unless explicitly promoted to CORE.
5. Production generation and downstream visual QA remain separate responsibilities.
6. A generated image result must never be treated as QA-approved merely because generation succeeded.
7. When a CORE rule conflicts with a module-specific convenience, the CORE rule controls.
8. New systems should integrate by loading CORE + their own module protocol rather than copying another module's workflow.

## Reference independence

CORE does not define a universal character or MASTER_IMAGE.

Each module declares its own reference policy:
- Universal Wallpaper uses the current user-uploaded reference for that batch.
- LoRA Production uses its module-defined approved training/reference assets.
- Future modules may define different reference mechanisms.

## Extensibility

To add a new system:

1. Register the module in `00_MASTER/MODULE_REGISTRY.md`.
2. Define its own module protocol.
3. Declare its inputs, outputs, state model, task model, and external integrations.
4. Load CORE rules.
5. Do not inherit another module's workflow unless explicitly required.

This separation is intentional and is the architectural boundary for future expansion.
