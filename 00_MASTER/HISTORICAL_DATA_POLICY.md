# HISTORICAL_DATA_POLICY.md — Historical vs Current Information

## Purpose

This repository contains a large amount of historical production material. Historical records are valuable for audit and recovery, but they must never be mistaken for current runtime state.

## Core rule

> HISTORICAL ≠ CURRENT

A historical document answers:

> What happened at that time?

A current canonical document answers:

> What is true now?

## Current-state authorities

For current system state, use:

1. `00_MASTER/SYSTEM_ARCHITECTURE.md`
2. `00_MASTER/MODULE_REGISTRY.md`
3. `00_MASTER/RUNTIME_STATE.md`
4. `00_MASTER/AUTHORITY_MATRIX.md`
5. The selected module's current protocol and state documents.

## Historical sources

Examples include:

- old production goals;
- old worker handoffs;
- old queue snapshots;
- old account states;
- old production logs;
- CHANGELOG entries;
- archived task records;
- legacy project-status documents.

Historical sources remain immutable unless a correction is explicitly required for historical accuracy. They must not be edited merely to make them resemble current state.

## Status language rule

A historical document may contain statements such as:

```
Generation System: ACTIVE
Goal: ACTIVE
Worker: GENERATING
```

Those statements describe the state at the time of that record.

They do not override:

```
00_MASTER/RUNTIME_STATE.md
00_MASTER/MODULE_REGISTRY.md
```

## Current-status wording

Documents intended to be current should use explicit labels such as:

- CURRENT
- ACTIVE
- PAUSED
- SUSPENDED
- HISTORICAL

Avoid ambiguous phrases such as:

- "current active production"
- "the project is currently producing"
- "the active goal"

unless the statement is owned by the current-state authority.

## Recovery rule

Workers must never recover current state by searching historical documents for the newest-looking status sentence.

Recovery must start from the canonical state chain:

```
START_HERE
→ SYSTEM_ARCHITECTURE
→ MODULE_REGISTRY
→ RUNTIME_STATE
→ AUTHORITY_MATRIX
→ MODULE STATE
```

## Goal / module distinction

A preserved Goal may be:

```
MODULE = PAUSED
GOAL = SUSPENDED
TASKS = PRESERVED
```

This is a valid state.

The existence of queued tasks does not mean their parent module is active.

## Changelog rule

`00_MASTER/CHANGELOG.md` records what changed over time. It is not a runtime state database.

Do not use a CHANGELOG entry as proof that a module or Goal is currently active.
