# Core Festival Database

This directory contains the canonical festival reference data for the Festival Wallpaper module.

## Retrieval flow

`CORE_FESTIVAL_INDEX → FESTIVAL RECORD → TAGS / CULTURAL ANCHORS → RELEVANT CATEGORY ITEMS`

Read only the festival records and category catalogs needed for the requested design; do not load every category automatically.

## Canonical references

- Festival list and fixed scope: `CORE_FESTIVAL_INDEX.md`
- Reusable tags: `TAGS.md`
- Cultural constraints and anchors: `FESTIVAL_CULTURAL_ANCHORS.md`
- Festival-to-item links: `FESTIVAL_ITEM_LINK_MATRIX.md`
- Festival record schema: `FESTIVAL_RECORD_SCHEMA.md`
- Item record schema: `ITEM_RECORD_SCHEMA.md`
- Category index and shared item-record rules: `CATEGORIES/README.md`

## Current data-quality boundary

The 10 `ITEM_CATALOG.md` files are candidate indexes. Their current rows are explicitly `UNVERIFIED` with `SOURCE_REFERENCES: NOT_RECORDED`; the repository tree currently contains no separate complete per-item records. Therefore, no catalog row may be treated as source-verified until a matching complete item record is created and reviewed against `ITEM_RECORD_SCHEMA.md`.

`FESTIVAL_CULTURAL_ANCHORS.md` is working generation guidance, not independent source verification. The 48 festival files and matrix are structurally present, but that does not mean all cultural claims or candidate items have been externally verified.

This README is a navigation entry, not a duplicate source of festival counts, scope rules, or item inventories.
