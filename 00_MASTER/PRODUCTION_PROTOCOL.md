# PRODUCTION_PROTOCOL.md — Inaria Production Protocol

## 1. Purpose
GitHub is the shared project state layer.
- ACCOUNT_06 = Master Director / Final Reviewer / QA.
- ACCOUNT_01–05, ACCOUNT_07–08 = Generation Workers.
- PRODUCTION/IMAGE_QUEUE.md = authoritative per-image production state.

## 2. Production state machine
QUEUED → CLAIMED → GENERATING → IMAGE_CREATED → UPLOADING → UPLOADED → QC_PENDING → PASS / REPAIR / REJECT

Exceptions: BLOCKED / FAILED / NEED_REGENERATE.

IMAGE_CREATED means a candidate exists in the generating environment but is not yet confirmed in production storage.
UPLOADING means binary transfer is in progress.
UPLOADED means the production asset exists at the recorded path and lineage can be verified.
QC_PENDING means the asset is ready for ACCOUNT_06 review.

Do not use GENERATED as a synonym for QC-ready.

## 3. Reference-first generation
Every production image must use the current 20-year-old MASTER_IMAGE as the direct Character + Visual Style Reference.

The target is Japanese anime illustration matching that reference. Generic style labels do not replace reference matching.

Forbidden target rendering: photorealistic, photographic/live-action, 3D/CGI, semi-photorealistic, or unrelated anime/manga/game/illustration styles.

## 4. Queue ownership
FETCH → SELECT → CLAIM(CAS) → VERIFY → GENERATING → GENERATE → IMAGE_CREATED → UPLOADING → UPLOADED → QC_PENDING

The claim update must use the exact queue blob SHA fetched immediately before the claim. A failed/conflicted claim means no ownership and no generation.

## 5. Lease
- ChatGPT manual worker: 120 minutes.
- Make/OpenAI worker: 30 minutes.
- Renew before expiry when necessary.
- After expiry, re-fetch and re-claim with a new Claim ID.

## 6. Recovery
Before an image exists: record blocker, clear ownership, return to QUEUED.
After an image exists: preserve the candidate, record asset state, and do not regenerate merely because another worker becomes available.

## 7. Final review
ACCOUNT_06 uses 00_MASTER/QUALITY_CONTROL.md to review the actual production asset. Only ACCOUNT_06 may set final PASS, REPAIR, or REJECT.

## 8. Final dataset
Only assets with final PASS, complete lineage, required metadata/caption, and no unresolved blocker may enter FINAL/.