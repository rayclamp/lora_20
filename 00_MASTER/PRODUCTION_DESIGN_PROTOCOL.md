# PRODUCTION_DESIGN_PROTOCOL.md — Shared Production Design Boundary

## Purpose

This is the shared contract for the design stage of the Image Production System.

The user supplies the image requirement. The Image Production System designs the image and writes the executable Prompt according to CORE and the selected production module's rules.

The user is not required to write the Prompt for either Manual or Automated Image Production.

This protocol defines the boundary between USER REQUEST → DESIGN → PROMPT → EXECUTION DECISION.

## 1. Image Production System

The Image Production System contains:
- GENERAL image production;
- FESTIVAL image production;
- ANIME presentation;
- REALISTIC presentation.

Execution control has two modes:
- MANUAL;
- AUTOMATED.

Manual and Automated modes use the same design rules and shared Worker Runtime. They differ only in who authorizes the transition from completed design/prompt to image generation.

## 2. User Request

The user supplies the desired image outcome, not necessarily an executable prompt.

A user request may contain subject/character, image count, production type, anime/realistic, output type, aspect ratio, theme/festival scope, scene, season, weather, time, pet permission, reference, and other explicit creative requirements.

Missing optional design fields are resolved from the selected production module's canonical rules when safely resolvable.

The Worker must not silently invent required context that cannot be resolved safely.

## 3. System-owned Design

After receiving the user request, the Image Production System is responsible for designing scene intent, character presentation, outfit, hairstyle, accessories, action, pose, hand action, leg position, camera, shot distance, framing, character position, visual focus, lighting, background, wallpaper value, and other module-required presentation fields.

The exact design variables are owned by the selected production module.

## 4. System-owned Prompt Construction

The Image Production System constructs the complete executable Prompt from USER INTENT + CORE RULES + SELECTED MODULE RULES + RESOLVED CONTEXT + DESIGN RECORD.

The final Prompt is not supplied by the user unless a separate future user-authored-prompt mode is explicitly defined. That mode is not part of the current architecture.\n\nUser-authored Prompt is not required.

The Worker must validate the Prompt against CORE hard constraints, selected module rules, output-format lock, design lock, reference authority, resolved Scene Intent where applicable, and prompt-integrity requirements. After validation, this Prompt becomes the canonical `FINAL_EXECUTABLE_PROMPT` only after `PROMPT_LOCK`. The generation Worker must execute this exact artifact and must not reconstruct a second Prompt from the Design Record.

## 5. MANUAL mode

Manual Image Production means:

USER REQUEST → SYSTEM DESIGN → SYSTEM PROMPT → USER PREVIEW/CONFIRMATION → GENERATION

The system must:
1. receive the user's image requirement;
2. design the image;
3. construct and validate the complete executable Prompt;
4. lock the validated Prompt as the canonical `FINAL_EXECUTABLE_PROMPT`;
5. show the complete locked design/Prompt to the user;
6. stop at the USER_GENERATION_CONFIRMATION gate;
7. generate only after the user explicitly confirms generation, using the unchanged locked Prompt;
8. record the generation result and checkpoint;

A Prompt supplied by the user is not required for Manual mode.

A normal design turn ending after Prompt Preview is not a generation failure and must not be interpreted as quota exhaustion, completion, or UNKNOWN.

## 6. AUTOMATED mode

Automated Image Production means:

AUTOMATION REQUEST → SYSTEM DESIGN → SYSTEM PROMPT → AUTOMATION AUDIT/PREVIEW → GENERATION

The system still designs the image and constructs the Prompt. Automation changes only the authorization/execution path.

Automated execution must not bypass module routing, module-owned Reference Policy, Scene Intent Resolution, design validation, output-format lock, final Prompt execution lock, prompt integrity, generation-result semantics, checkpointing, or continuation/termination rules.

## 7. Confirmation boundary

Manual mode has an explicit design state: DESIGN_READY_FOR_USER_CONFIRMATION.

After Prompt Preview, the system must not generate merely because a valid Prompt exists.

Valid next states are:
- USER_CONFIRMED_GENERATION → proceed to GENERATE;
- USER_REQUESTED_REVISION → return to DESIGN;
- USER_DECLINED_GENERATION → terminate/return without generation.

The system must preserve the latest design/prompt state when confirmation is pending.

## 8. Non-goals

This protocol does not perform image generation itself; define Anime or Realistic content rules; define Festival cultural data; define LoRA production; define QA; define Make orchestration; or define Codex QA execution.

It is a shared design/authorization boundary for the Image Production System.

## Final Prompt + Execution Context Lock

The canonical executable artifact is now a pair:
1. FINAL_EXECUTABLE_PROMPT
2. FINAL_EXECUTION_CONTEXT

Both are validated and locked before generation.

The execution context binds the Prompt to the concrete reference authority, model identity/version, output type, aspect ratio, generation parameters, and provider parameters. Any revision to either artifact invalidates the previous execution lock and requires re-validation, re-locking, and a new preview/audit event.

The generation Worker must execute the locked pair exactly. It must not reconstruct either artifact from the Design Record or provider defaults.
