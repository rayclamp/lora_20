# REUSABLE MAKEUP ITEM CATALOG

## DATA QUALITY STATUS

This is a reusable candidate catalog, not proof that every row has been independently culturally verified. A row may be treated as verified only when its cultural attribution is supported by an explicit source/reference and its required item-record fields have been reviewed. Do not infer verification from this file's presence or from visual similarity alone.

## P0-29 OPEN CATEGORY-SCOPE EXCEPTIONS — audit snapshot

This catalog is a **candidate index**, not a verified item database. The following existing item-to-festival associations point to a catalog category that the respective festival's authoritative `CATEGORY_LINKS` does **not** currently include. This is an **item-tag/category-scope discrepancy**, not a `CATEGORY_LINK_MISMATCH` between the festival record and link matrix. Do not treat these candidate combinations as culturally verified or silently add the missing category to a festival record. See `../../DATA_QUALITY_AUDIT.md` (P0-24/P0-25) for the original 17-association audit and evidence-review boundary.

- `MAKEUP_XMAS_SOFT_001`: affected `FESTIVAL_TAGS` = `F001,F048`; the containing category `MAKEUP` is not in those festival records' `CATEGORY_LINKS`.
- `MAKEUP_JP_FEST_001`: affected `FESTIVAL_TAGS` = `F023,F024,F026`; the containing category `MAKEUP` is not in those festival records' `CATEGORY_LINKS`.

Broad festive makeup styling and a generic Japanese matsuri makeup description are not by themselves evidence of culturally specific Christmas, Tanabata, Gion Matsuri or Obon rituals.

All rows below remain unchanged, including exact `ITEM_ID`, name, `FESTIVAL_TAGS`, region, score, `VERIFICATION_STATUS: UNVERIFIED`, and `SOURCE_REFERENCES: NOT_RECORDED`. A claim of `VERIFIED` requires an exact item/region/festival source and complete matching reviewed item record under `ITEM_RECORD_SCHEMA.md`. These warnings do not authorize editing data, generating images, activating QA (`PAUSED`), or changing design/production commands.

| ITEM_ID | NAME | FESTIVAL_TAGS | REGION | RECOGNIZABILITY | VERIFICATION_STATUS | SOURCE_REFERENCES |
|---|---|---|---|---|---|---|
| MAKEUP_XMAS_SOFT_001 | Soft festive makeup | F001,F048 | Global | LOW | UNVERIFIED | NOT_RECORDED |
| MAKEUP_DIWALI_FEST_001 | Formal Indian festive makeup | F012 | South Asia | HIGH | UNVERIFIED | NOT_RECORDED |
| MAKEUP_HOLI_NATURAL_001 | Natural makeup suitable for color-powder environment | F013 | India/Nepal | LOW | UNVERIFIED | NOT_RECORDED |
| MAKEUP_EID_SOFT_001 | Modest polished festive makeup | F015,F016 | Muslim communities | LOW | UNVERIFIED | NOT_RECORDED |
| MAKEUP_JP_FEST_001 | Refined Japanese summer-festival makeup | F023,F024,F026 | Japan | MEDIUM | UNVERIFIED | NOT_RECORDED |