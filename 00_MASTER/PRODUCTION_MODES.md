# PRODUCTION_MODES.md — Inaria Reference Delivery Modes

## Purpose
Define how the official age-20 MASTER_IMAGE reaches a Generation Worker.

This file defines reference delivery methods only. It does not create separate identity, visual-style, anatomy, generation, Goal, Worker Pool, or QA standards.

## Official reference
Official reference:
MASTER_IMAGE/INARIA_20_MASTER_v1.0.png

This is the single Character + Visual Style Reference for age-20 Inaria production.

## AUTO MODE

### Purpose
Automated production through the image-input bridge.

### Reference path
GitHub MASTER_IMAGE
→ Make
→ OpenAI image input
→ Generation

### Requirements
- The actual official MASTER_IMAGE must be supplied as image input.
- GitHub metadata, filename, SHA, or text description alone is insufficient.
- The worker must visually inspect the actual supplied image before generation.
- If image input is missing or unreadable, generation is blocked.
- Phase 1 ends at IMAGE_CREATED; later upload/QA is downstream.

### Current status
PAUSED_PENDING_MAKE_CREDITS_AND_OPENAI_IMAGE_BRIDGE_VALIDATION

## MANUAL MODE

### Purpose
Manual production while the automated image bridge is unavailable.

### Reference path
Operator
→ manually uploads official MASTER_IMAGE to the generation Worker conversation
→ Worker visually verifies the image
→ Generation
→ IMAGE_CREATED

### Requirements
- The operator must upload the official INARIA_20_MASTER_v1.0.png.
- The worker must visually inspect the uploaded image before generation.
- The worker must not substitute a text description, GitHub path, filename, SHA, older Inaria image, age-36 reference, or another generated image.
- If the required reference is missing, unreadable, or clearly the wrong reference/version, generation is blocked.
- Manual mode uses exactly the same identity, style, anatomy, generation, Goal, queue, Worker Pool, and QA rules as AUTO MODE.
- IMAGE_CREATED releases the Worker immediately.
- Phase 2 upload and QA do not block subsequent Phase 1 generation.

### Current status
ACTIVE_FOR_PHASE1_PRODUCTION

## Reference verification checklist

Before generation:
- Reference image supplied: YES
- Reference visually inspectable: YES
- Official age-20 reference confirmed: YES
- Alternate reference substituted: NO
- Current Prompt Package confirmed: YES
- Queue claim successful: YES

If any required reference check fails, stop before generation.

## Non-negotiable rule
The project's requirement is not "read the image from GitHub."

The requirement is:
"Use the actual official MASTER_IMAGE as the Character + Visual Style Reference."

GitHub is the authoritative storage location. AUTO and MANUAL are two valid delivery methods for getting that same official image into the generation context.
