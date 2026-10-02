# INARIA DRAWING SYSTEM — SYSTEM ARCHITECTURE

## 1. Purpose

This document is the persistent high-level architecture map for the entire Inaria image-production system in `rayclamp/lora_20`.

It exists so that any future ChatGPT, Codex, Worker, automation process, or new collaborator can understand the system structure without relying on conversation memory.

**GitHub is the source of truth.**

If conversation memory conflicts with this document or with a referenced module specification, GitHub rules take precedence.

---

## 2. Architecture Model

The complete system is organized into four layers:

```
CORE RULES
    ↓
PRODUCTION MODULES
    ↓
SHARED INFRASTRUCTURE / DATA
    ↓
QA
```

The major production systems are:

```
0. Universal Basic Rules
1. General Wallpaper System
2. Festival Wallpaper System
3. LoRA Automated Production System
4. QA Image Inspection System
```

Supporting infrastructure:

```
5. Wallpaper Worker / Task Integrity
6. Festival Costume Database
7. Automation / Make Integration
8. GitHub Source-of-Truth / State
```

---

# 3. SYSTEM 0 — UNIVERSAL BASIC RULES

These rules apply to all applicable image-production systems.

Core areas include:

- Anatomy stability
- Hand and finger stability
- Foot and toe stability
- Body proportion
- Pose stability
- Drawing stability
- Image-generation safety
- Common Worker safety
- Rule precedence
- Common state integrity principles

Typical core documents:

```
00_MASTER/CORE_RULES.md
00_MASTER/MASTER_SPEC.md
00_MASTER/DRAWING_INSTRUCTIONS.md
00_MASTER/ANATOMY_STABILITY.md
00_MASTER/IMAGE_GENERATION_SAFETY_SPEC.md
```

No production module may intentionally bypass applicable CORE rules.

---

# 4. SYSTEM 1 — GENERAL WALLPAPER

General Wallpaper supports both anime and realistic Inaria wallpapers.

```
GENERAL WALLPAPER
├── ANIME
│   ├── Manual Design
│   └── Automated Design + Production
│
└── REALISTIC
    ├── Manual Design
    └── Automated Design + Production
```

## 4.1 Anime Wallpaper

Primary rule:

```
00_MASTER/WALLPAPER/ANIME_WALLPAPER_RULES.md
```

Uses the designated anime Inaria reference and anime-specific visual rules.

## 4.2 Realistic Wallpaper

Primary rule:

```
00_MASTER/WALLPAPER/REALISTIC_WALLPAPER_RULES.md
```

Uses the designated realistic Inaria reference and realistic-specific visual/camera rules.

The realistic identity baseline is the 36-year Inaria reference.

## 4.3 Design Modes

### Manual Design

ChatGPT designs the wallpaper and returns the design/prompt for human review or downstream execution.

### Automated Design + Production

The Worker can perform:

```
USER PARAMETERS
→ READ GITHUB RULES
→ DESIGN IMAGE
→ DESIGN RECORD
→ DESIGN LOCK
→ GENERATE
→ RECORD RESULT
```

The user does not need to perform a separate Manual Design step.

---

# 5. SYSTEM 2 — FESTIVAL WALLPAPER

Festival Wallpaper is a specialized Wallpaper module.

It supports:

```
FESTIVAL WALLPAPER
├── ANIME
│   ├── Manual Design
│   └── Automated Design + Production
│
└── REALISTIC
    ├── Manual Design
    └── Automated Design + Production
```

Festival production must use the Festival Costume Database rather than inventing cultural costume data.

## 5.1 Manual Festival Design

Workflow:

```
USER PARAMETERS
→ FESTIVAL SELECTION
→ FESTIVAL DATA
→ ACTION LIST
→ COMPOSITION PLAN
→ IMAGE DESIGN
→ PROMPT
```

Used when the user wants to inspect or control the design before production.

## 5.2 Automated Festival Design + Production

Workflow:

```
USER BASIC PARAMETERS
→ READ GITHUB RULES
→ READ FESTIVAL DATABASE
→ SELECT FESTIVAL
→ DESIGN IMAGE
→ CREATE DESIGN RECORD
→ DESIGN LOCK
→ GENERATE ONE IMAGE
→ RECORD RESULT
→ NEXT IMAGE
```

The user only needs to provide the required basic parameters.

## 5.3 Festival Recognition

A Festival image should normally use:

```
1 MAIN FESTIVAL IDENTITY
+
1–3 SUPPORTING FESTIVAL ELEMENTS
```

The goal is recognizability without excessive cultural-element stacking.

---

# 6. SYSTEM 3 — LORA AUTOMATED PRODUCTION

The LoRA production system is independent from the Wallpaper production system.

Its planned automation architecture is:

```
GitHub Task / Dataset Rules
        ↓
Make Automation
        ↓
OpenAI API
        ↓
Worker / Task Pool
        ↓
Image Production
        ↓
Dataset Inbox
        ↓
Review / Final
        ↓
QA
```

Primary scope:

- Age-20 Inaria LoRA dataset production
- Task queue
- Worker pool
- Task locks
- Production state
- Failure state
- Retry / recovery
- Make automation
- OpenAI API integration
- Dataset management
- Candidate selection
- QA handoff

The LoRA system must remain independent from Universal Wallpaper semantics.

---

# 7. SYSTEM 4 — QA IMAGE INSPECTION

QA is an independent downstream quality-control system.

It may inspect outputs from:

```
General Wallpaper
Festival Wallpaper
LoRA Production
```

QA does not generate images.

QA does not redesign images.

QA does not replace the Production Worker.

Typical QA areas:

- Character identity
- Face
- Hair
- Body proportion
- Hands
- Fingers
- Feet
- Toes
- Pose
- Clothing
- Accessories
- Background
- Composition
- Format
- Festival accuracy
- Dataset value

Current/future QA result states:

```
PASS
REVIEW
REPAIR
REJECT
```

A QA result must not rewrite the historical generation result.

For example:

```
Generation = SUCCESS
QA = REJECT
```

means the generation succeeded technically, but the image failed later quality inspection.

Primary QA documents are registered in:

```
00_MASTER/QA_MODULE.md
00_MASTER/QA_PROTOCOL.md
00_MASTER/CODEX_QA_CHECKLIST.md
```

---

# 7.5. DOWNSTREAM IMAGE DELIVERY

Image Delivery is a downstream integration layer preserved in the repository for future use.

It does not generate or redesign images. It consumes approved outputs from production / QA according to its own input-output contract.

Current module registration:

`IMAGE_DELIVERY` in `00_MASTER/MODULE_REGISTRY.md`

If activated, Image Delivery must remain independent from image-generation logic.

---

# 8. SYSTEM 5 — WALLPAPER WORKER / TASK INTEGRITY

This is shared infrastructure for Wallpaper production.

Primary documents:

```
00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md
00_MASTER/WALLPAPER/WALLPAPER_TASK_INTEGRITY.md
```

It protects the production process from task drift and memory loss.

Core controls:

```
IMAGE_ID_LOCK
DESIGN_LOCK
FORMAT_LOCK
OUTPUT_COUNT_LOCK
TASK STATE
RESULT STATE
RECOVERY
RESUME
```

Core principle:

```
ONE IMAGE_ID = ONE TASK = ONE IMAGE
```

The system must prevent:

- forgetting the locked design
- inventing nonexistent IMAGE_IDs
- changing 16:9 into 9:16
- generating multiple outputs for one task
- assigning extra outputs to another task
- restarting completed tasks unnecessarily
- guessing UNKNOWN states

The Worker executes the design.

The Worker does not replace QA.

---

# 9. SYSTEM 6 — FESTIVAL COSTUME DATABASE

The Festival Costume Database is the cultural-data layer used by Festival Wallpaper.

Primary location:

```
FESTIVAL_COSTUME_DATABASE/
```

Core index:

```
FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/CORE_FESTIVAL_INDEX.md
```

Recommended read order:

```
CORE_FESTIVAL_INDEX
→ FESTIVAL
→ TAGS
→ RELEVANT CATEGORY ITEMS
```

Current category structure:

```
CLOTHING
ACCESSORIES
SOCKS
SHOES
HEADWEAR
HAIRSTYLE
MAKEUP
BODY_DECORATION
PROPS
OTHER
```

The database is a source of cultural/reference data.

It is not itself an image-production Worker.

Workers must not invent missing cultural data.

If required data is missing or contradictory:

```
GITHUB_DATA_MISSING
or
DATA_CONFLICT
```

and follow the applicable recovery/stop rule.

---

# 10. SYSTEM 7 — AUTOMATION / MAKE INTEGRATION

Automation is an infrastructure layer rather than a single visual-design module.

Current architecture:

```
ChatGPT
= Visual Design / Prompt Design

GitHub
= Source of Truth

Make
= Automation / Orchestration

OpenAI API
= Automated AI Processing

ComfyUI / Image Generator
= Image Generation

QA
= Quality Gate
```

Make may be used for:

- scheduled production
- task dispatch
- worker coordination
- OpenAI API calls
- production-state updates
- retry/recovery flows
- future automation expansion

Make/OpenAI automation for LoRA remains an application of this infrastructure.

---

# 11. SYSTEM 8 — GITHUB SOURCE OF TRUTH / STATE

GitHub is the persistent memory and control plane of the entire system.

GitHub stores:

```
RULES
DESIGN RECORDS
TASKS
QUEUES
LOCKS
PRODUCTION STATE
FAILURE STATE
RECOVERY STATE
QA REPORTS
DATASET STATE
FESTIVAL DATA
AUTOMATION CONTRACTS
```

The system must not depend on conversation memory as the authoritative production state.

When restarting after:

- quota exhaustion
- worker interruption
- account switching
- ChatGPT conversation restart
- ComfyUI interruption
- automation interruption

the Worker must read GitHub state first.

---

# 12. DESIGN RECORD PRINCIPLE

A Design Record is the persistent memory of an individual image.

Typical flow:

```
DESIGN
↓
DESIGN RECORD
↓
DESIGN LOCK
↓
GENERATION
↓
RESULT RECORD
↓
QA
```

Once locked, the Design Record is immutable during normal production.

If the design itself must change:

```
DESIGN_REVISION_REQUIRED
```

The system must return to the Design stage rather than silently modifying the production design.

---

# 13. STANDARD PRODUCTION LIFECYCLE

The common lifecycle is:

```
USER
↓
BASIC PARAMETERS
↓
GITHUB RULES
↓
MODULE ROUTING
↓
DATA / REFERENCE
↓
DESIGN
↓
DESIGN RECORD
↓
DESIGN LOCK
↓
TASK INTEGRITY CHECK
↓
GENERATE
↓
RESULT RECORD
↓
QA
↓
FINAL DATASET / WALLPAPER
```

Manual systems may stop before generation.

Automated systems continue through generation.

QA remains a separate quality gate.

---

# 14. MODULE DEPENDENCY PRINCIPLE

The intended dependency direction is:

```
CORE
 ↓
MODULE
 ↓
DATA / STATE
 ↓
GENERATION
 ↓
QA
```

A module must not silently rewrite another module's rules.

Examples:

- Festival Wallpaper uses Festival Database data.
- Festival Database does not control QA.
- QA does not redesign Festival Wallpaper.
- LoRA Production does not route through Wallpaper tasks.
- Wallpaper Worker does not become the LoRA Worker.
- Make orchestrates automation but does not replace GitHub as the source of truth.

---

# 15. RECOVERY PRINCIPLE

Every production system must support interruption and continuation.

General rule:

```
READ GITHUB STATE
→ FIND FIRST VALID INCOMPLETE TASK
→ RESUME
```

Never:

```
RESTART FROM MEMORY
RE-DESIGN LOCKED IMAGES
GUESS UNKNOWN RESULTS
INVENT MISSING TASKS
```

---

# 16. SYSTEM COMMAND STRUCTURE

The project uses separate command types for different stages.

### General Wallpaper

```
START
RESUME
```

### Festival Wallpaper

```
START
RESUME
```

Both may operate in:

```
MANUAL DESIGN
AUTOMATED DESIGN + PRODUCTION
```

### LoRA

```
AUTOMATED PRODUCTION
RECOVERY / RESUME
```

### QA

```
QA START
QA RESUME
```

Commands are interfaces to the underlying GitHub systems. They are not the source of truth themselves.

---

# 17. SOURCE-OF-TRUTH PRIORITY

When information conflicts, use this priority:

```
1. Current GitHub CORE rules
2. Current module specification
3. Current task / Design Record
4. Current Festival Database data
5. Current production state
6. User-provided parameters
7. Conversation memory
```

User parameters remain authoritative for explicit task choices unless they conflict with higher-level safety or system constraints.

Conversation memory must never override current GitHub state.

---

# 18. QUICK SYSTEM MAP

```
INARIA DRAWING SYSTEM
│
├── 0. UNIVERSAL BASIC RULES
│
├── 1. GENERAL WALLPAPER
│   ├── Anime
│   │   ├── Manual
│   │   └── Automated
│   └── Realistic
│       ├── Manual
│       └── Automated
│
├── 2. FESTIVAL WALLPAPER
│   ├── Anime
│   │   ├── Manual
│   │   └── Automated
│   └── Realistic
│       ├── Manual
│       └── Automated
│
├── 3. LORA AUTOMATED PRODUCTION
│   └── Make + OpenAI API + Workers
│
├── 4. QA
│   └── Cross-module image inspection
│
├── DOWNSTREAM IMAGE DELIVERY
│   └── Future output / delivery integration
│
├── 5. WALLPAPER TASK INTEGRITY
│   └── Lock / State / Recovery / Resume
│
├── 6. FESTIVAL COSTUME DATABASE
│   └── Cultural / costume data
│
├── 7. AUTOMATION LAYER
│   └── Make / OpenAI / orchestration
│
└── 8. GITHUB SOURCE OF TRUTH
    └── Rules / Tasks / Designs / State / Reports
```

---

# 19. FUTURE CHANGE RULE

When a new drawing system is created:

1. Add it to this architecture document.
2. Register it in `00_MASTER/MODULE_REGISTRY.md`.
3. Define its protocol.
4. Define its input/output contract.
5. Define dependencies.
6. Define its state and recovery behavior.
7. Define QA handoff.
8. Do not silently modify another module's workflow.

This document must be updated whenever the high-level architecture changes.

---

# 20. CORE PRINCIPLE

**ChatGPT designs and interprets user intent.**

**GitHub remembers the system.**

**Modules define workflows.**

**Design Records remember individual images.**

**Workers execute locked designs.**

**Automation coordinates repetitive work.**

**ComfyUI / image generators generate images.**

**QA inspects generated results.**

**No single conversation is the authoritative memory of the project.**
