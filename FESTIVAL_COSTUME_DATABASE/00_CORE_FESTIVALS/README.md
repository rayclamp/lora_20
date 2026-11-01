# Core Festival Database

This directory contains the canonical festival reference data for the Festival Wallpaper module.

## Retrieval flow

`CORE_FESTIVAL_INDEX.md` (fixed F001–F048 ID/name and type/region lookup) → `FESTIVALS/F###.md` (festival-specific cultural scope and authoritative `CATEGORY_LINKS`) → `TAGS.md` / `FESTIVAL_CULTURAL_ANCHORS.md` (lookup and **non-verified design cues**) → categories allowed by the festival record → candidate `ITEM_CATALOG.md` → **complete, source-backed item record if a culturally VERIFIED claim is needed**.

Load only the matching festival and needed categories. `FESTIVAL_ITEM_LINK_MATRIX.md` is a navigation mirror of the festival's actual `CATEGORY_LINKS`; if they disagree, report `CATEGORY_LINK_MISMATCH` and stop item selection for that festival, without silently rewriting either file.

A discovered candidate tag is NOT a guarantee that its category is allowed for the festival. For any relevant catalog item, compare its actual containing category with that festival record's `CATEGORY_LINKS`. If they do not match, do not use that candidate as a verified festival-specific item or automatically expand the category links; report the exact item ID, festival ID and category as a **catalog-tag/category-scope discrepancy**. Consult `DATA_QUALITY_AUDIT.md` for the current open cases.

## Canonical references

- Festival list and fixed scope: `CORE_FESTIVAL_INDEX.md`
- Reusable tags: `TAGS.md`
- Cultural constraints and anchors: `FESTIVAL_CULTURAL_ANCHORS.md`
- Festival-to-item links: `FESTIVAL_ITEM_LINK_MATRIX.md`
- Festival record schema: `FESTIVAL_RECORD_SCHEMA.md`
- Item record schema: `ITEM_RECORD_SCHEMA.md`
- Category index and shared item-record rules: `CATEGORIES/README.md`

## Current data-quality boundary — audit snapshot, not cultural certification

`DATA_QUALITY_AUDIT.md` is the **source for the detailed structural findings, item/tag exceptions, and ongoing coverage/evidence notes**. The latest P0-21–P0-25 audit re-read the 48 festival records and ten current `ITEM_CATALOG.md` files. The existing catalog snapshot comprises 224 candidate rows, all `UNVERIFIED` with `SOURCE_REFERENCES: NOT_RECORDED`. **This is an audit snapshot, not a dynamic inventory counter.** The repository currently has no complete separate per-item records supporting formal cultural verification; a candidate cannot be promoted merely because it appears in a category or has a festival tag.

Known unresolved coverage exceptions in that snapshot: F003, F007 and F044 have **zero directly tagged catalog candidates**; F002, F005, F025 and F040 have only one or two. These remain registered festivals, not reasons to delete or merge their entries. F044 also carries `REGION_SPECIFIC_ITEM_GAP`; do not substitute unrelated F011 Mexican-specific items.

**Seventeen** candidate-item-to-festival tag associations across **nine** candidate rows and **twelve** festival IDs point to catalog categories absent from those festivals' current `CATEGORY_LINKS`; P0-24 and P0-25 identify each case. All 48 festival records' category sets currently match the link matrix (P0-23), so the 17 exceptions are **not** a matrix-versus-record category mismatch. The open data problem is a distinct cross-layer candidate-tag/category scope issue, which must be reviewed with precise cultural/region evidence, not silently normalized.

`FESTIVAL_CULTURAL_ANCHORS.md` supplies working design cues, not independent source verification. Existing tags, scores, source links or broad cultural references do not by themselves validate a **specific item-festival-region assertion**. Only a matching complete item record with relevant reviewed `SOURCE_REFERENCES` and catalog `VERIFICATION_STATUS: VERIFIED` can establish verified status under `ITEM_RECORD_SCHEMA.md`.

This README is navigation guidance, not an additional authoritative record inventory or a command. It does not amend candidate rows, festival category links, registered IDs, locked prompts or historical records, invoke production, or activate QA (currently `PAUSED`). Prompt-design and image-production command changes remain deferred.
