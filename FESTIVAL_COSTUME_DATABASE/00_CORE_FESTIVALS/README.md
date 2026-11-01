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

`DATA_QUALITY_AUDIT.md` is the **source for detailed structural findings, source-validation decisions and unresolved item/tag exceptions**. In the latest **P0-32** readback snapshot, the ten catalogs still contain **224 rows**: **2 source-reviewed VERIFIED items** (`HEAD_EASTER_BONNET_001`, documented United States Easter Parade context; `BODY_EID_HENNA_001`, Emirati Eid al-Fitr and Eid al-Adha context) and **222 UNVERIFIED** candidates whose `SOURCE_REFERENCES` remain `NOT_RECORDED`. The two complete source-reviewed item records exist at `CATEGORIES/05_HEADWEAR/ITEMS/HEAD_EASTER_BONNET_001.md` and `CATEGORIES/08_BODY_DECORATION/ITEMS/BODY_EID_HENNA_001.md`; no other candidate is promoted solely through appearance, category, or festival association. These numbers are a dated audit result, not an automatically updating inventory counter.

Known unresolved coverage exceptions in that snapshot: F003, F007 and F044 have **zero directly tagged catalog candidates**; F002, F005, F025 and F040 have only one or two. These remain registered festivals, not reasons to delete or merge their entries. F044 also carries `REGION_SPECIFIC_ITEM_GAP`; do not substitute unrelated F011 Mexican-specific items.

**Thirteen** candidate-to-festival tag associations across **seven** candidate rows and **eleven** festival IDs remain outside their corresponding festival's current `CATEGORY_LINKS` (P0-32 readback). P0-31 resolved the F006 HEADWEAR case; P0-32 resolved the three former F014/F015/F016 BODY_DECORATION associations by removing the unsupported Ramadan tag and sourcing the restricted Emirati F015/F016 practice. F014's own `CATEGORY_LINKS` were not changed. Earlier P0-24/P0-25 (**17**), and P0-31 (**16**) exception figures remain historical snapshots in `DATA_QUALITY_AUDIT.md`. The F001–F048 festival-record category sets and current link matrix match; remaining problems are **catalog-tag/category-scope** discrepancies, not `CATEGORY_LINK_MISMATCH`.

`FESTIVAL_CULTURAL_ANCHORS.md` supplies working design cues, not independent source verification. Existing tags, scores, source links or broad cultural references do not by themselves validate a **specific item-festival-region assertion**. Only a matching complete item record with relevant reviewed `SOURCE_REFERENCES` and catalog `VERIFICATION_STATUS: VERIFIED` can establish verified status under `ITEM_RECORD_SCHEMA.md`.

This README is navigation guidance, not an additional authoritative record inventory or a command. It does not amend candidate rows, festival category links, registered IDs, locked prompts or historical records, invoke production, or activate QA (currently `PAUSED`). Prompt-design and image-production command changes remain deferred.
