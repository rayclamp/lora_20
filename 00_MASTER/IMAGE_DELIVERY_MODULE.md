# IMAGE_DELIVERY_MODULE.md — Independent Image Delivery Module

## Status
PAUSED.

## Purpose
Own downstream transfer/delivery capabilities after a production module creates a candidate.

Production artifact persistence is defined by `00_MASTER/PRODUCTION_OUTPUT_PROTOCOL.md`. A module may persist its generated artifact to GitHub without activating this downstream Delivery module when the active production contract explicitly requires that output adapter.

## Boundary
Image generation is not performed here.

A generation module records its generation result first. Delivery consumes that result only when this module is activated.

## Activation requirements
When activated, define:
- accepted input state;
- destination;
- transfer method;
- success/failure states;
- retry/recovery;
- idempotency and ownership.

This module has no historical execution state in the current repository.

## CORE dependency
Use CORE safety and state-integrity rules. Do not inherit Wallpaper or LoRA workflow rules.
