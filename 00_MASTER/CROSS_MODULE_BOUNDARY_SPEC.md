# CROSS_MODULE_BOUNDARY_SPEC.md — Council Round 5 Phase 3

## Purpose

This document defines the mechanically enforced boundaries between production modules and downstream modules.

A module may consume CORE and explicitly authorized shared data, but it must not silently inherit another module's execution state, identity authority, queue, dataset policy, or downstream authority.

## Boundary model

### UNIVERSAL_WALLPAPER
May consume:
- CORE shared rules;
- Wallpaper rules;
- current user-supplied reference;
- explicitly applicable Festival Database data for festival wallpaper requests.

Must not consume:
- LoRA identity/reference authority;
- LoRA dataset/Goal/Batch/Queue/Task state;
- LoRA QA acceptance rules;
- Image Delivery execution state;
- QA decision authority.

### FESTIVAL_WALLPAPER
May consume:
- CORE shared rules;
- Wallpaper rules;
- current user-supplied reference;
- FESTIVAL_COSTUME_DATABASE and applicable festival-specific data.

Must not consume:
- LoRA identity/reference authority;
- LoRA dataset/Goal/Batch/Queue/Task state;
- LoRA QA acceptance rules;
- Image Delivery execution state;
- QA decision authority.

### LORA_PRODUCTION
May consume:
- CORE shared rules;
- its own IDENTITY, DATASET, PRODUCTION, and QA profile.

Must not consume:
- Universal Wallpaper production state;
- Festival Wallpaper workflow state;
- Festival cultural data as a substitute for its own module authority;
- Image Delivery execution state;
- QA platform execution authority.

Its identity/reference authority remains module-local.

### QA
May consume:
- CORE;
- SOURCE_MODULE rules;
- approved reference assets;
- task metadata;
- QA-specific inspection rules.

QA must not become a production module and must not silently inherit one module's acceptance profile as a universal profile.

### IMAGE_DELIVERY
May consume:
- generation-result records explicitly accepted as delivery inputs.

It must not generate images, own production task state, or perform QA decisions.

## Shared-data rule

Shared data does not imply shared execution authority.

The Festival Database is a shared repository-level data source, but Festival Wallpaper owns its use as festival design input. LoRA cannot use Festival data to replace LoRA identity/dataset authority.

## Cross-module execution rule

A module may not activate, mutate, claim, or release another module's Goal, Batch, Queue, Task, Worker, or module state.

The active module is resolved from RUNTIME_STATE and MODULE_REGISTRY.

## Downstream rule

Generation produces a generation result.

QA consumes generation results and does not rewrite production success.

Image Delivery consumes an authorized downstream input and does not become a generation or QA executor.

## Enforcement requirement

The architecture validator must verify the boundary declarations and reject deliberate cross-module boundary violations in isolated fixtures.

A boundary test must fail closed if a module's canonical protocol loses its required isolation contract.
