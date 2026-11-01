# REUSABLE HAIRSTYLE ITEM CATALOG

## DATA QUALITY STATUS

**P0-36 current pair-level block list:** `../../ITEM_TAG_CATEGORY_SCOPE_EXCEPTIONS.md` enumerates each remaining affected item/F-ID/category combination. Its `OPEN` status is diagnostic only, not a candidate's `VERIFICATION_STATUS`; follow the festival record's actual `CATEGORY_LINKS` and the item-source evidence gate.

This is a reusable candidate catalog, not proof that every row has been independently culturally verified. A row may be treated as verified only when its cultural attribution is supported by an explicit source/reference and its required item-record fields have been reviewed. Do not infer verification from this file's presence or from visual similarity alone.

## P0-29 OPEN CATEGORY-SCOPE EXCEPTIONS — audit snapshot

This catalog is a **candidate index**, not a verified item database. The following existing item-to-festival associations point to a catalog category that the respective festival's authoritative `CATEGORY_LINKS` does **not** currently include. This is an **item-tag/category-scope discrepancy**, not a `CATEGORY_LINK_MISMATCH` between the festival record and link matrix. Do not treat these candidate combinations as culturally verified or silently add the missing category to a festival record. See `../../DATA_QUALITY_AUDIT.md` (P0-24/P0-25) for the original 17-association audit and evidence-review boundary.

- `HAIR_THAI_FEST_001`: affected `FESTIVAL_TAGS` = `F029`; the containing category `HAIRSTYLE` is not in those festival records' `CATEGORY_LINKS`.

A generic Thai formal festival hairstyle has not been established as a specific Songkran tradition in the complete item evidence; regional/style applicability needs separate review.

All rows below remain unchanged, including exact `ITEM_ID`, name, `FESTIVAL_TAGS`, region, score, `VERIFICATION_STATUS: UNVERIFIED`, and `SOURCE_REFERENCES: NOT_RECORDED`. A claim of `VERIFIED` requires an exact item/region/festival source and complete matching reviewed item record under `ITEM_RECORD_SCHEMA.md`. These warnings do not authorize editing data, generating images, activating QA (`PAUSED`), or changing design/production commands.

| ITEM_ID | NAME | FESTIVAL_TAGS | REGION | RECOGNIZABILITY | VERIFICATION_STATUS | SOURCE_REFERENCES |
|---|---|---|---|---|---|---|
| HAIR_JP_FEST_UPDO_001 | Japanese festival updo compatible with yukata | F023,F024,F026 | Japan | HIGH | UNVERIFIED | NOT_RECORDED |
| HAIR_JP_NEWYEAR_001 | Formal Japanese festive updo | F022 | Japan | HIGH | UNVERIFIED | NOT_RECORDED |
| HAIR_KR_TRAD_001 | Korean formal traditional updo | F031,F032 | Korea | HIGH | UNVERIFIED | NOT_RECORDED |
| HAIR_INDIAN_FEST_001 | Formal Indian festive styling | F012 | South Asia | MEDIUM | UNVERIFIED | NOT_RECORDED |
| HAIR_THAI_FEST_001 | Thai formal festival styling | F029 | Thailand | MEDIUM | UNVERIFIED | NOT_RECORDED |
| HAIR_NORDIC_FLOWER_001 | Loose summer hair with flower crown compatibility | F046 | Nordic sphere | MEDIUM | UNVERIFIED | NOT_RECORDED |