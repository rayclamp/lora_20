# REUSABLE BODY DECORATION ITEM CATALOG

## DATA QUALITY STATUS

This is a reusable candidate catalog, not proof that every row has been independently culturally verified. A row may be treated as verified only when its cultural attribution is supported by an explicit source/reference and its required item-record fields have been reviewed. Do not infer verification from this file's presence or from visual similarity alone.

## P0-29 OPEN CATEGORY-SCOPE EXCEPTIONS — audit snapshot

This catalog is a **candidate index**, not a verified item database. The following existing item-to-festival associations point to a catalog category that the respective festival's authoritative `CATEGORY_LINKS` does **not** currently include. This is an **item-tag/category-scope discrepancy**, not a `CATEGORY_LINK_MISMATCH` between the festival record and link matrix. Do not treat these candidate combinations as culturally verified or silently add the missing category to a festival record. See `../../DATA_QUALITY_AUDIT.md` (P0-24/P0-25) for the original 17-association audit and evidence-review boundary.

- `BODY_EID_HENNA_001`: affected `FESTIVAL_TAGS` = `F014,F015,F016`; the containing category `BODY_DECORATION` is not in those festival records' `CATEGORY_LINKS`.

Henna has documented community-specific Eid customs, but an exact item/region claim must be evidenced. Ramadan F014 is a period, separate from F015 Eid al-Fitr and F016 Eid al-Adha; never extend one festival's evidence to every Muslim community or to Ramadan automatically.

All rows below remain unchanged, including exact `ITEM_ID`, name, `FESTIVAL_TAGS`, region, score, `VERIFICATION_STATUS: UNVERIFIED`, and `SOURCE_REFERENCES: NOT_RECORDED`. A claim of `VERIFIED` requires an exact item/region/festival source and complete matching reviewed item record under `ITEM_RECORD_SCHEMA.md`. These warnings do not authorize editing data, generating images, activating QA (`PAUSED`), or changing design/production commands.

| ITEM_ID | NAME | FESTIVAL_TAGS | REGION | RECOGNIZABILITY | VERIFICATION_STATUS | SOURCE_REFERENCES |
|---|---|---|---|---|---|---|
| BODY_HOLI_COLOR_001 | Holi color powder on skin/clothing | F013 | India/Nepal | HIGH | UNVERIFIED | NOT_RECORDED |
| BODY_DIWALI_HENNA_001 | Henna/Mehndi decoration | F012 | South Asia | HIGH | UNVERIFIED | NOT_RECORDED |
| BODY_DAYDEAD_FACE_001 | Stylized Mexican Día de los Muertos face makeup/paint | F011 | Mexico | VERY HIGH | UNVERIFIED | NOT_RECORDED |
| BODY_EID_HENNA_001 | Henna where culturally appropriate | F014,F015,F016 | Muslim/South Asian contexts | HIGH | UNVERIFIED | NOT_RECORDED |