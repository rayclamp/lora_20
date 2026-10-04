# SCENE_INTENT_RESOLUTION_PROTOCOL.md — Universal Scene Intent Resolution

## Purpose
This is the canonical resolution contract between a user-facing Theme/Scene input and an executable production scene.
A Theme is a semantic category. It is not, by itself, an executable scene.

## Core invariant
THEME ≠ SCENE INTENT
Before DESIGN_LOCK, every production task must resolve a structured Scene Intent containing:
- ACTIVITY
- LOCATION
- ACTION
- TIME
- WEATHER
- SOCIAL_CONTEXT
- ENVIRONMENTAL_CUES

## Resolution sources
Scene Intent may come from explicit user/automation input, a module-approved structured scene specification, or deterministic Worker resolution from a Theme when the module allows Worker resolution.
The source of each resolved field must be recorded.
A Worker must never represent a Worker-resolved value as if it came from the user or Automation payload.

## Resolution states
- EXPLICIT — supplied directly by the request/payload.
- RESOLVED — deterministically derived by the Worker from an approved Theme/rule set.
- MISSING — required information cannot be resolved safely.
- CONFLICT — supplied values conflict with authoritative rules.
- BLOCKED — design cannot proceed.
MISSING, CONFLICT, or BLOCKED prevents DESIGN_LOCK and generation.

## Worker resolution rule
When a broad Theme is supplied without a complete Scene Intent, the Worker may resolve a concrete intent only if the applicable module rules provide a safe deterministic design path.

Example:
THEME: EVERYDAY_LIFE
SCENE_INTENT_RESOLUTION:
- ACTIVITY: BAKING
- LOCATION: HOME KITCHEN
- ACTION: PREPARING DOUGH
- TIME: MORNING
- WEATHER: SUNNY
- SOCIAL_CONTEXT: ALONE
- ENVIRONMENTAL_CUES: WARM RESIDENTIAL KITCHEN, NATURAL WINDOW LIGHT
The record must explicitly state that these values were Worker-resolved.

## Design gate
THEME / SCENE INPUT → SCENE INTENT RESOLUTION → PRESENTATION DESIGN → DESIGN VALIDATION → PROMPT
A Theme alone must never be passed directly into prompt assembly as though it were a complete scene.

## Automation invariant
Automated requests should provide Scene Intent directly whenever upstream automation already knows the intended activity/location/action. If only a Theme is available, the Worker must execute the resolution stage and record the resolved intent before prompt assembly.

## Trace requirement
The trace must preserve input Theme/Scene, resolved Scene Intent, source of every resolved field, resolution status, design result, and final prompt reference.
