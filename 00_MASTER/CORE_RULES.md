# CORE_RULES.md — Cross-System Core Rules

CORE contains only rules shared across production modules.

1. CORE hard rules cannot be weakened by a module.
2. Modules may add stricter rules.
3. Module-specific identity, style, dataset, queue, cultural, and QA rules remain inside their module.
4. Generation success does not imply visual QA acceptance.
5. Generation Workers do not perform final QA.
6. UNKNOWN state must be recovered, not guessed.
7. Current GitHub state is authoritative.
8. User intent cannot silently activate a paused module.
9. New modules load CORE rather than copying another module's workflow.

Required shared documents:
- DRAWING_INSTRUCTIONS.md
- ANATOMY_STABILITY.md
- IMAGE_GENERATION_SAFETY_SPEC.md
- GENERATION_WORKER_PROTOCOL.md
