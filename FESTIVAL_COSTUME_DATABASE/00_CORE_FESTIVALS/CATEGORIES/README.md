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

## RETRIEVAL MODEL — INDEX TO VERIFIED ITEM

`CORE_FESTIVAL_INDEX.md` (canonical F001–F048 IDs/names) → matching `FESTIVALS/F###.md` (recorded region and authoritative `CATEGORY_LINKS`) → `TAGS.md` / `FESTIVAL_ITEM_LINK_MATRIX.md` (navigation) → relevant category `ITEM_CATALOG.md` candidate rows → matching complete item record + reviewed `SOURCE_REFERENCES` (when claiming cultural verification).

Workers should read **only categories listed for the selected festival and actually relevant to the intended item**. Do not load every category or silently expand a festival's `CATEGORY_LINKS`. If the matrix differs from the festival record, stop item selection for the affected festival and report `CATEGORY_LINK_MISMATCH`, without modifying any festival record automatically.

A catalog hit is a candidate-discovery result, not a verified cultural item. `FESTIVAL_CULTURAL_ANCHORS.md` supplies design cues but does not itself validate an item or regional claim.

## SHARED ITEM-RECORD RULES

- An item's `ITEM_ID` must be stable and unique; no new ID or source record is invented to fill an index gap.
- The canonical item field is **`FESTIVAL_TAGS`**, with at least one specific festival ID or registered festival name as allowed by `ITEM_RECORD_SCHEMA.md`. Prefer an exact F001–F048 ID and confirm the precise region and local custom. A tag or name alone is not verified evidence.
- Record `REGION` and `CULTURAL_SCOPE` for actual item records. Do not assume similar-looking symbols or garments are interchangeable between F011 Mexican Día de los Muertos and F044 Andean/other Latin American traditions; F044 retains `REGION_SPECIFIC_ITEM_GAP`. F038 is a memorial-focused entry within F020 Qingming, not a separate holiday.
- `CULTURAL_SENSITIVITY` and `RECOGNIZABILITY` use `LOW`, `MEDIUM`, `HIGH`, `VERY HIGH`. They describe risk and diagnostic usefulness respectively, **not** cultural source verification or QA acceptance.
- Each `ITEM_CATALOG.md` row must keep `VERIFICATION_STATUS` and `SOURCE_REFERENCES`. These are candidate summaries, not complete item records. An existing row remains `UNVERIFIED` unless the **matching complete item record** has all required fields, relevant explicit source references, and reviewed festival/region/cultural attribution. `NOT_RECORDED` does not satisfy this proof requirement.
- Do not fabricate sources, assume all candidates are verified, or automatically promote `VERIFICATION_STATUS`. Use `ITEM_RECORD_SCHEMA.md` for required fields and the status change gate; preserve existing catalog data and IDs. A verified claim needs both catalog and complete-item evidence.

## SCOPE

- Female-focused.
- Unisex items may be recorded when culturally appropriate.
- Male-only clothing is not separately maintained at this stage.

The registered festival list, English/Chinese names and fixed count remain authoritative in `CORE_FESTIVAL_INDEX.md`; this category index does not duplicate or redefine that list. This is a read/navigation standard only: it does not rewrite the ten categories, the existing 48 festival records or candidate catalogs, modify any prompt/design/production command, create a Session/Batch, activate QA (`PAUSED`) or access historical/archive records.
