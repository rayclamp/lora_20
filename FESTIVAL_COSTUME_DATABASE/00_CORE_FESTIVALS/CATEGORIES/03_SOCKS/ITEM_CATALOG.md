# REUSABLE SOCKS ITEM CATALOG

## DATA QUALITY STATUS

This is a reusable candidate catalog, not proof that every row has been independently culturally verified. A row may be treated as verified only when its cultural attribution is supported by an explicit source/reference and its required item-record fields have been reviewed. Do not infer verification from this file's presence or from visual similarity alone.

## P0-29 OPEN CATEGORY-SCOPE EXCEPTIONS — audit snapshot

This catalog is a **candidate index**, not a verified item database. The following existing item-to-festival associations point to a catalog category that the respective festival's authoritative `CATEGORY_LINKS` does **not** currently include. This is an **item-tag/category-scope discrepancy**, not a `CATEGORY_LINK_MISMATCH` between the festival record and link matrix. Do not treat these candidate combinations as culturally verified or silently add the missing category to a festival record. See `../../DATA_QUALITY_AUDIT.md` (P0-24/P0-25) for the original 17-association audit and evidence-review boundary.

- `SOCK_XMAS_KNIT_001`: affected `FESTIVAL_TAGS` = `F001,F048`; the containing category `SOCKS` is not in those festival records' `CATEGORY_LINKS`.
- `SOCK_EID_MODEST_001`: affected `FESTIVAL_TAGS` = `F014,F015,F016`; the containing category `SOCKS` is not in those festival records' `CATEGORY_LINKS`.
- `SOCK_NORDIC_001`: affected `FESTIVAL_TAGS` = `F046`; the containing category `SOCKS` is not in those festival records' `CATEGORY_LINKS`.

Generic winter hosiery, modest hosiery and Nordic hosiery are not independently evidenced as festival-specific traditions by their catalog labels. Keep Ramadan F014 distinct from Eid observances F015/F016.

All rows below remain unchanged, including exact `ITEM_ID`, name, `FESTIVAL_TAGS`, region, score, `VERIFICATION_STATUS: UNVERIFIED`, and `SOURCE_REFERENCES: NOT_RECORDED`. A claim of `VERIFIED` requires an exact item/region/festival source and complete matching reviewed item record under `ITEM_RECORD_SCHEMA.md`. These warnings do not authorize editing data, generating images, activating QA (`PAUSED`), or changing design/production commands.

| ITEM_ID | NAME | FESTIVAL_TAGS | REGION | RECOGNIZABILITY | VERIFICATION_STATUS | SOURCE_REFERENCES |
|---|---|---|---|---|---|---|
| SOCK_XMAS_KNIT_001 | Winter festive knit socks | F001,F048 | Global winter | LOW | UNVERIFIED | NOT_RECORDED |
| SOCK_JP_TABI_001 | Tabi socks | F022,F023,F024,F026,F027 | Japan | HIGH | UNVERIFIED | NOT_RECORDED |
| SOCK_KR_TRAD_001 | Traditional Korean-style white socks | F031,F032 | Korea | MEDIUM | UNVERIFIED | NOT_RECORDED |
| SOCK_EID_MODEST_001 | Opaque modest hosiery | F014,F015,F016 | Muslim communities | LOW | UNVERIFIED | NOT_RECORDED |
| SOCK_NORDIC_001 | Nordic winter/summer-neutral hosiery | F046 | Northern Europe | LOW | UNVERIFIED | NOT_RECORDED |