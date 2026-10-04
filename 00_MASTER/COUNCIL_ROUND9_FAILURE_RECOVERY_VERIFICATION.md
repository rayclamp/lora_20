# COUNCIL_ROUND9_FAILURE_RECOVERY_VERIFICATION.md

## Status

**PASS — Council Round 9 Failure / Recovery / Abandonment Verification**

This is an isolated Council verification record. It does not activate production and does not change module runtime status.

## Scope

Verified the Universal Wallpaper ChatGPT-as-Worker failure/recovery path for:

1. explicit FAILED result;
2. retry without duplicate TASK_ID / IMAGE_ID;
3. three consecutive FAILED attempts;
4. repeated-failure forced stop;
5. UNKNOWN / RECOVERY_REQUIRED hard stop;
6. explicit ABANDONED terminal state;
7. replacement identity requirement;
8. SUCCESS terminality;
9. failure history preservation;
10. checkpoint-before-continuation invariant.

## Canonical recovery contract

`00_MASTER/WALLPAPER/UNIVERSAL_WALLPAPER_FAILURE_RECOVERY_PROTOCOL.md`

The contract now defines:

- `GENERATION_ATTEMPT_COUNT`;
- `CONSECUTIVE_FAILURE_COUNT`;
- `RECOVERY_STATUS`;
- `LAST_FAILURE_REASON`;
- append-only `EVENT_HISTORY`;
- FAILED retry semantics;
- three-consecutive-failure stop rule;
- UNKNOWN hard stop;
- ABANDONED identity immutability;
- SUCCESS terminality.

## Persisted runtime fixture

Isolated test batch:

`MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/ROUND9_FAILURE_RECOVERY_TEST.md`

The fixture contained multiple simultaneous persisted states and was validated by the real repository validator.

## Automated verification

Branch:

`council-round9-failure-recovery`

Verified test commit:

`ecb1768029519291ca5286352afd847b9e2e4195`

GitHub Actions run:

`37198922374`

Result:

**SUCCESS**

All substantive CI steps passed:

- Architecture validation — PASS
- Architecture validator self-test — PASS
- Universal Wallpaper batch validation — PASS
- Universal Wallpaper batch validator self-test — PASS

## Round 9 findings

Round 9 identified and corrected two real validator/contract boundary defects during testing:

1. The architecture assertion initially required wording that did not exactly match the canonical recovery protocol.
2. The batch validator initially rejected an explicitly ABANDONED task whose last generation result was FAILED.

Both were corrected and the full CI suite was rerun successfully.

## Production status

Round 9 does not change the module registry.

Current module status remains:

- UNIVERSAL_WALLPAPER = ACTIVE
- FESTIVAL_WALLPAPER = ACTIVE
- LORA_PRODUCTION = PAUSED
- QA = PAUSED
- IMAGE_DELIVERY = PAUSED

## Boundary

This round verifies persisted failure/recovery semantics for ChatGPT-as-Worker.

It does **not** verify:

- distributed Claim/Lease/CAS;
- automatic retry engines;
- automatic scheduler;
- ComfyUI runtime integration;
- automatic quota discovery;
- visual QA.

Those remain separate future verification scopes.

## Final principle

**FAILED may retry under explicit rules. UNKNOWN must stop. Three consecutive failures require recovery. ABANDONED identities are never silently reused. SUCCESS is terminal.**
