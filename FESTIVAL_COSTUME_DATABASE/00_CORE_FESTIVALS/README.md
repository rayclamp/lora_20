# Core Festival Database

This directory contains the canonical festival reference data for the Festival Wallpaper module.

## Retrieval flow

`CORE_FESTIVAL_INDEX.md` (fixed F001–F048 ID/name and type/region lookup) → `FESTIVALS/F###.md` (festival-specific cultural scope and authoritative `CATEGORY_LINKS`) → `TAGS.md` / `FESTIVAL_CULTURAL_ANCHORS.md` (lookup and **non-verified design cues**) → categories allowed by the festival record → candidate `ITEM_CATALOG.md` → **complete, source-backed item record if a culturally VERIFIED claim is needed**.

Load only the matching festival and needed categories. `FESTIVAL_ITEM_LINK_MATRIX.md` is a navigation mirror of the festival's actual `CATEGORY_LINKS`; if they disagree, report `CATEGORY_LINK_MISMATCH` and stop item selection for that festival, without silently rewriting either file.

A discovered candidate tag is NOT a guarantee that its category is allowed for the festival. For any relevant catalog item, compare its actual containing category with that festival record's `CATEGORY_LINKS`. If they do not match, do not use that candidate as a verified festival-specific item or automatically expand the category links; report the exact item ID, festival ID and category as a **catalog-tag/category-scope discrepancy**. Consult `ITEM_TAG_CATEGORY_SCOPE_EXCEPTIONS.md` for the historical P0-36 cases and their P0-38 closed disposition.

## Canonical references

- Festival list and fixed scope: `CORE_FESTIVAL_INDEX.md`
- Reusable tags: `TAGS.md`
- Cultural constraints and anchors: `FESTIVAL_CULTURAL_ANCHORS.md`
- Festival-to-item links: `FESTIVAL_ITEM_LINK_MATRIX.md`
- Festival record schema: `FESTIVAL_RECORD_SCHEMA.md`
- Item record schema: `ITEM_RECORD_SCHEMA.md`
- Historical item-tag/category-scope exception dispositions (P0-36/P0-38): `ITEM_TAG_CATEGORY_SCOPE_EXCEPTIONS.md`
- Retired legacy rows, preserved verbatim and excluded from active candidate lookup: `RETIRED_CANDIDATE_RECORDS.md`
- Category index and shared item-record rules: `CATEGORIES/README.md`

## Current data-quality boundary — P0-38 readback (2026-11-02)

**Current live active catalog:** 220 unique candidate rows across the same ten categories; **8 source-reviewed VERIFIED** and **212 UNVERIFIED** with no recorded supporting sources. This is a dated structural inventory, **not** proof that the other 212 candidate cultural claims are accurate. Each VERIFIED entry has a matching complete item record and documented region-limited source references.

The eight VERIFIED items are `HEAD_EASTER_BONNET_001` (US F006 Easter Parade); `BODY_EID_HENNA_001` (Emirati F015/F016 Eid); `PROP_US_THANKSGIVING_ROAST_TURKEY_001` (US F007 Thanksgiving); `PROP_GION_FLOAT_001` (Kyoto F024 Gion Matsuri); `PROP_TANZAKU_001` (Japanese F023 Tanabata); `PROP_HALLOWEEN_PUMPKIN_001` (US F002 Halloween); `PROP_US_NEWYEAR_TIMES_SQUARE_BALL_001` (New York midnight into F003 New Year's Day); and `PROP_PE_TANTAWAWA_DIFUNTOS_001` (F044 Peru Ayacucho traditional remembrance bread). Every entry's geographic and cultural restrictions must be honored.

**Zero active candidate tag/category-scope mismatches.** Under P0-38, seven unsupported candidate rows responsible for the last 13 earlier mismatches were retired from active selection only **after preserving their exact original source rows in** `RETIRED_CANDIDATE_RECORDS.md`. The P0-36 `ITEM_TAG_CATEGORY_SCOPE_EXCEPTIONS.md` now documents those former 13 pairs as **historical and resolved by retirement**, not current open candidates. None was marked VERIFIED or REJECTED or restored as a sourced tradition. Older audit totals (224/225 candidates; 13/17 exceptions) remain only as dated historical measurements.

**All F001–F048 festival IDs have at least one directly tagged active candidate.** F003 and F044 now each have one narrowly scoped region-backed item; F044's `REGION_SPECIFIC_ITEM_GAP` remains a **partial ongoing geographic evidence gap** outside the supported Peruvian subregion. F002, F003, F005, F007, F025, F040 and F044 still have only one or two direct candidates (coverage depth is not equivalent to source verification).

Neither presence in the candidate pool nor a broad cultural anchor validates specific costume, ritual or religious claims. Consult `DATA_QUALITY_AUDIT.md`, `ITEM_RECORD_SCHEMA.md` and the matching complete item record. The 48 festival record/index names and their category links remain authoritative and unchanged by P0-38.

`FESTIVAL_CULTURAL_ANCHORS.md` supplies working design cues, not independent source verification. Existing tags, scores, source links or broad cultural references do not by themselves validate a **specific item-festival-region assertion**. Only a matching complete item record with relevant reviewed `SOURCE_REFERENCES` and catalog `VERIFICATION_STATUS: VERIFIED` can establish verified status under `ITEM_RECORD_SCHEMA.md`.

This README is navigation guidance, not an additional authoritative record inventory or a command. It does not amend candidate rows, festival category links, registered IDs, locked prompts or historical records, invoke production, or activate QA (currently `PAUSED`). Prompt-design and image-production command changes remain deferred.
