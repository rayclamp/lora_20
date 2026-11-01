# FESTIVAL ITEM RECORD SCHEMA

This schema defines **complete reusable festival item records**, not catalog-only candidate summaries. A catalog row, festival association tag, region label, recognizability score or design cue is not independent proof of cultural validity. Preserve existing item IDs, field names, verification statuses and unverified catalog data unless a separately evidenced, reviewable correction is authorized. P0-38 retired seven former catalog-only candidates to a verbatim historical record without renaming or reusing their IDs.

## REQUIRED FIELDS

- ITEM_ID
- CATEGORY
- NAME_EN
- NAME_ZH
- FESTIVAL_TAGS
- REGION
- CULTURAL_SCOPE
- RECOGNIZABILITY
- CULTURAL_SENSITIVITY
- VERIFICATION_STATUS (UNVERIFIED / VERIFIED / REJECTED)
- SOURCE_REFERENCES (required before VERIFIED)
- REALISTIC
- ANIME
- DESCRIPTION

## OPTIONAL GENERATION FIELDS

- COLOR
- MATERIAL
- PATTERN
- SILHOUETTE
- HAND_INTERACTION
- WEARABLE
- SEASON
- USAGE_CONTEXT
- COMPATIBLE_FESTIVALS
- EXCLUSIONS
- NOTES

## CONTROL RULES

1. `ITEM_ID` must be stable and unique in the reusable item database. Do not create a new ID or overwrite an existing record merely to make a catalog or category index look complete.
2. `FESTIVAL_TAGS` must contain at least one specific registered festival ID or name, as currently permitted by the schema. Prefer F001–F048 ID references; when only a name exists, resolve it unambiguously against `CORE_FESTIVAL_INDEX.md` before asserting an association. Do not silently rewrite legacy tags.
3. Do not create or select an item merely because it visually resembles a festival symbol, garment or prop. Tags are lookup associations, not substitutes for evidence.
4. If the exact festival association, region, culture, religious or ritual meaning is uncertain, do not mark the item `VERIFIED`; state what is missing without inventing supporting sources.
5. `VERIFICATION_STATUS` uses the existing values `UNVERIFIED`, `VERIFIED`, `REJECTED` only. `VERIFIED` is allowed only after a **matching complete item record** exists, all required fields have been reviewed and the actual cited sources support the specific item-festival-region-cultural attribution. A catalog inclusion, unreviewed summary or source link without relevant supporting information does not qualify.
6. `SOURCE_REFERENCES` must identify traceable evidence for the claimed item, its associated festival, precise region and cultural context. The reviewer must be able to determine which source supports which claim. Do not fabricate citations, assume a reference exists, or use a broad festival article as proof of a narrower unsupported local practice.
7. `RECOGNIZABILITY` uses `LOW` / `MEDIUM` / `HIGH` / `VERY HIGH`; VERY HIGH is reserved for an unusually diagnostic **item in the specified festival and region**. This is an identification/design property, NOT verified cultural provenance.
8. `CULTURAL_SENSITIVITY` uses `LOW` / `MEDIUM` / `HIGH` / `VERY HIGH`; VERY HIGH highlights the greater consequence of inaccurate religious, ritual, ancestor-related or local representation. This is a caution flag, NOT an evidence grade. LOW does not prove a claim correct.
9. `REALISTIC` and `ANIME` express suitability for particular generation systems; they do not validate tradition, authorize generation or provide image QA results.
10. Female-focused clothing is the primary clothing scope; culturally appropriate unisex items remain allowed. Do not silently expand this into an unsupported gender-specific clothing inventory.
11. Every `ITEM_CATALOG.md` is a compact **candidate index**, not a complete item record. Catalog rows cannot be treated as complete merely because required fields are named in this schema.
12. Every catalog row must retain `VERIFICATION_STATUS` and `SOURCE_REFERENCES`. Where no supporting evidence is recorded, keep `VERIFICATION_STATUS: UNVERIFIED` and `SOURCE_REFERENCES: NOT_RECORDED`; avoid guessing records, paths, source URLs or verification outcomes.
13. A catalog row may be promoted to `VERIFIED` **only when its matching complete item record exists** and source evidence, required fields and festival/region scope have been reviewed. Update corresponding records only in an explicitly authorized, traceable data correction. If catalog and item-record statuses disagree, report the exact `ITEM_ID` and fields and do not use the candidate as verified until reconciled.
14. The 48 festival ID/name scope is controlled by `CORE_FESTIVAL_INDEX.md`, while the selected festival record controls its own `CATEGORY_LINKS` and recorded regional scope. A category link, tag, broad cross-cultural collection or cultural-anchor design cue never automatically verifies an item.
15. For regional overlap, keep F011 Mexican Día de los Muertos item evidence separate from F044 Andean/other Latin American variants; F044 retains `REGION_SPECIFIC_ITEM_GAP`. F038 is a Qingming memorial focus overlapping F020, not independent evidence of a second holiday. Do not transplant region-specific practices across entries without directly relevant evidence.
16. If an **active** item is unsupported, leave it unverified or reject it only on substantiated grounds under the existing status definitions. Do not quietly convert a missing source to `VERIFIED` or falsely equate `REJECTED` with an absent field. Preserve any already reviewed evidence and correction history rather than silently overwriting it.

## VERIFICATION WORKFLOW BOUNDARY

- **Candidate discovery:** read the selected festival's matching category and existing catalog row. Record the item ID, claimed festival/region context and its actual verification status. Candidate discovery alone does not approve the item.
- **Evidence review:** locate the matching complete item record and explicit references. Check that the evidence actually supports the item association, claimed usage, region and any ritual or religious meaning. Compare the required fields with this schema and the selected festival record; record unresolved omissions or conflicts rather than creating fictional support.
- **Status decision:** treat a candidate as culturally verified **only when** its matching complete record and active catalog row both meet the VERIFIED source gate. P0-31–P0-37 individually verified six narrowly regional items. P0-38 added two source-backed items: F003 New York Times Square New Year's Eve-to-New Year's Day ball (`PROP_US_NEWYEAR_TIMES_SQUARE_BALL_001`) and F044 Peruvian Andean Tanta Wawa bread (`PROP_PE_TANTAWAWA_DIFUNTOS_001`). The **P0-38 dated recheck** found **220 active catalog items: 8 VERIFIED with complete matching source-reviewed item records and 212 UNVERIFIED**. The **current P0-39 recheck** retains the same 220 active rows and promotes only three individually source-backed existing candidates, yielding **11 VERIFIED and 209 UNVERIFIED**, each VERIFIED item having a matching complete source-reviewed record. P0-38 also retired seven unsupported UNVERIFIED catalog-only rows after preserving their exact historic text in `RETIRED_CANDIDATE_RECORDS.md`; this is a non-active archival disposition, not `VERIFICATION_STATUS: REJECTED` or a new status enum. Earlier P0-22 through P0-37 counts and exception listings remain dated historical snapshots. **Do not auto-promote** any remaining candidate by analogy or visual resemblance.
- **Execution boundary:** this Schema changes no candidate data, festival record, category link, source document or locked Prompt. It does not activate QA (`PAUSED`), create a Session/Batch, control a runtime or authorize image generation. Historic/archive records are unchanged.
