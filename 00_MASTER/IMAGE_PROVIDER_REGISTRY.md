# IMAGE_PROVIDER_REGISTRY.md — Image Provider Registry

## Purpose

This registry is the canonical control-plane boundary for selecting a real image-generation provider.

The Worker Runtime must never infer or silently substitute a provider from:
- module name;
- character name;
- environment defaults;
- ComfyUI availability;
- Make availability;
- a legacy integration.

## Provider States

- UNREGISTERED — no provider has been selected.
- REGISTERED — identity and adapter contract are declared, but live transport is not verified.
- AUTHORIZED — provider connection/credential path is explicitly authorized.
- VERIFIED — a controlled real generation test succeeded with verifiable result metadata.
- BLOCKED — provider exists but cannot currently be used.

Only VERIFIED is eligible for production image-generation execution.

## Required Registration Fields

- PROVIDER_ID
- PROVIDER_NAME
- ADAPTER_MODULE
- STATUS
- TRANSPORT_TYPE
- AUTHORITY_SOURCE
- CREDENTIAL_SOURCE
- SUPPORTED_OUTPUT_TYPES
- RESULT_VERIFICATION_POLICY
- IDEMPOTENCY_SUPPORT
- REGISTRATION_VERSION

Credentials/secrets must never be stored in this registry or committed to GitHub.

## Selection Rules

1. Explicit provider selection is required before live generation.
2. UNREGISTERED, REGISTERED, and BLOCKED providers must stop live execution.
3. A test/mock adapter is valid only inside deterministic verification harnesses.
4. Production Runtime must not fall back from a selected provider to another provider.
5. Provider-specific request construction belongs behind ImageProviderAdapter.
6. The Worker-owned locked Prompt remains authoritative; providers must receive that exact Prompt.
7. Provider result metadata must be mapped without fabricating unavailable telemetry.
8. Production providers must support the Worker Runtime required-key idempotency contract.

## Current State

PROVIDER_STATUS: UNREGISTERED

No real provider is selected by this repository state.

Therefore the Runtime Verification system is intentionally blocked from claiming live image generation.

## Next Activation Gate

Before changing PROVIDER_STATUS to AUTHORIZED or VERIFIED, define:
- concrete provider/API;
- authorized credential path;
- transport implementation;
- output/result verification;
- required-key generation idempotency support;
- artifact persistence/output adapter contract;
- one controlled real-image E2E test.

No production image generation is activated by registering a provider alone.
