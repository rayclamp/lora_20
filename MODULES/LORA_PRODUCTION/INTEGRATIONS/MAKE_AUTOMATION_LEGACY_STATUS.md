# MAKE_AUTOMATION_LEGACY_STATUS.md — LoRA Integration Boundary

## Scope

This document belongs to the LoRA Production domain.

It describes historical/external automation information for the LoRA system only. It is not part of Wallpaper System Automation.

## Status

The discovered departmental automation scenarios for LoRA Production are LEGACY / PAUSED / NON-AUTHORITATIVE.

Known legacy pattern:

DIRECTOR → CHARACTER / CLOTHING / SCENE / POSE_CAMERA / PROMPT departmental workers

This pattern is not the current shared production architecture.

## LoRA integration boundary

The external automation provider used by the LoRA domain is an integration concern of LoRA Production.

It is not a dependency of:
- Universal Wallpaper
- Festival Wallpaper
- Wallpaper System Automation
- Production Dispatch
- Shared Wallpaper Worker Runtime

Wallpaper Automation must not load this document, use its state, or depend on its provider-specific information.

## Reactivation rule

A legacy LoRA automation scenario must not be reactivated for production until it satisfies the current LoRA-specific integration and shared Worker Runtime contracts.

## No cross-domain authority

LoRA integration state must not write authoritative Wallpaper production state.

Wallpaper System Automation must not invoke, inspect, or inherit LoRA integration state.
