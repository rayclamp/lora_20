# FESTIVAL CATEGORY INDEX

The database uses 10 fixed categories:

1. CLOTHING
2. ACCESSORIES
3. SOCKS
4. SHOES
5. HEADWEAR
6. HAIRSTYLE
7. MAKEUP
8. BODY_DECORATION
9. PROPS
10. OTHER

## RETRIEVAL MODEL — CANDIDATE LOOKUP AND EVIDENCE GATE

`CORE_FESTIVAL_INDEX.md` (canonical F001–F048 IDs/names) → matching `FESTIVALS/F###.md` (recorded region and authoritative `CATEGORY_LINKS`) → `TAGS.md` / `FESTIVAL_ITEM_LINK_MATRIX.md` (navigation) → relevant category `ITEM_CATALOG.md` candidate rows → matching complete item record + reviewed `SOURCE_REFERENCES` (when claiming cultural verification).

Workers should read **only categories listed for the selected festival and actually relevant to the intended item**. Do not load every category or silently expand a festival's `CATEGORY_LINKS`. If the matrix differs from the festival record, stop item selection for the affected festival and report `CATEGORY_LINK_MISMATCH`, without modifying any festival record automatically.

A catalog hit is a candidate-discovery result, **not** a verified cultural item. `FESTIVAL_CULTURAL_ANCHORS.md` supplies design cues but does not itself validate an item or regional claim. Do not assume that a catalog row's `FESTIVAL_TAGS` establishes permission to use that candidate from its actual category for the selected festival.

## SHARED ITEM-RECORD RULES

- An item's `ITEM_ID` must be stable and unique; no new ID or source record is invented to fill an index gap.
- The canonical item field is **`FESTIVAL_TAGS`**, with at least one specific festival ID or registered festival name as allowed by `ITEM_RECORD_SCHEMA.md`. Prefer an exact F001–F048 ID and confirm the precise region and local custom. A tag or name alone is not verified evidence.
- Record `REGION` and `CULTURAL_SCOPE` for actual item records. Do not assume similar-looking symbols or garments are interchangeable between F011 Mexican Día de los Muertos and F044 Andean/other Latin American traditions; F044 retains `REGION_SPECIFIC_ITEM_GAP`. F038 is a memorial-focused entry within F020 Qingming, not a separate holiday.
- `CULTURAL_SENSITIVITY` and `RECOGNIZABILITY` use `LOW`, `MEDIUM`, `HIGH`, `VERY HIGH`. They describe risk and diagnostic usefulness respectively, **not** cultural source verification or QA acceptance.
- Each `ITEM_CATALOG.md` row must keep `VERIFICATION_STATUS` and `SOURCE_REFERENCES`. These are candidate summaries, not complete item records. An existing row remains `UNVERIFIED` unless the **matching complete item record** has all required fields, relevant explicit source references, and reviewed festival/region/cultural attribution. `NOT_RECORDED` does not satisfy this proof requirement.
- Do not fabricate sources, assume all candidates are verified, or automatically promote `VERIFICATION_STATUS`. Use `ITEM_RECORD_SCHEMA.md` for required fields and the status change gate; preserve existing catalog data and IDs. A verified claim needs both catalog and complete-item evidence.

## CROSS-LAYER CATEGORY / FESTIVAL TAG CONSISTENCY

1. After matching an item's `FESTIVAL_TAGS` to the requested F-ID, compare the **catalog's containing category** with the **same festival record's authoritative `CATEGORY_LINKS`**. Both must be compatible before the item can even be considered for that festival-category lookup; cultural-source verification remains an additional, independent requirement.
2. If `FESTIVAL_ITEM_LINK_MATRIX.md` disagrees with the festival record itself, this is `CATEGORY_LINK_MISMATCH`: stop the affected festival's item selection and report the competing category sets. Do not alter either path silently.
3. If the matrix and festival record agree **but** a candidate's tag refers to a festival whose `CATEGORY_LINKS` omits the candidate's category, this is an **item-tag/category-scope discrepancy** (not `CATEGORY_LINK_MISMATCH`). Report the exact candidate `ITEM_ID`, F-ID and containing category; do not use that candidate as a verified festival-specific example for the unsupported category, and do not automatically expand the festival's category list or delete the original candidate tag.
4. **P0-38 current active state: zero category/tag mismatches.** The original P0-24/P0-25 audit documented 17 historical associations, later reduced to 13 by the source-backed P0-31/P0-32 corrections. The seven remaining wholly unsupported candidate rows (13 pairs) were preserved verbatim in `../RETIRED_CANDIDATE_RECORDS.md` and retired from the **active** catalogs. The earlier P0-36 exception register `../ITEM_TAG_CATEGORY_SCOPE_EXCEPTIONS.md` retains all former exact pairs with a P0-38 disposition; it is no longer an open active blocker queue. Do not treat a retired original F-ID as current item evidence or restore a row without a separate claim-specific review.
5. **P0-38 current direct-tag coverage: all 48 registered festivals have at least one directly tagged catalog candidate.** The formerly empty F003 New Year's Day and F044 Andean remembrance entries now each have one narrowly scoped VERIFIED PROPS record: `PROP_US_NEWYEAR_TIMES_SQUARE_BALL_001` for the New York December 31 / January 1 transition and `PROP_PE_TANTAWAWA_DIFUNTOS_001` for documented Peruvian Ayacucho November remembrance. These two do **not** imply global cultural coverage; F044 retains a partial `REGION_SPECIFIC_ITEM_GAP` for other areas. Previously zero-coverage findings are historical snapshots, not current counts.
6. The current ten active category catalogs contain **220 unique rows: 8 source-backed VERIFIED and 212 UNVERIFIED**. Seven retired rows exist in the separate historical preservation record and are not active catalog rows. The original festival registry and allowed category sets remain unchanged; the verified-source requirement for every item remains in force.

## SCOPE

- Female-focused.
- Unisex items may be recorded when culturally appropriate.
- Male-only clothing is not separately maintained at this stage.

The registered festival list, English/Chinese names and fixed count remain authoritative in `CORE_FESTIVAL_INDEX.md`; this category index does not duplicate or redefine that list. This is a read/navigation standard only: it does not rewrite the ten categories, the existing 48 festival records or candidate catalogs, modify any prompt/design/production command, create a Session/Batch, activate QA (`PAUSED`) or access historical/archive records.
