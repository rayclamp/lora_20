# Core Festival Database — Data Quality Audit

## Audit scope

This report records the structural and consistency audit of `FESTIVAL_COSTUME_DATABASE/00_CORE_FESTIVALS/`. It distinguishes file completeness from cultural-source verification.

## Structural checks completed

- The canonical festival index contains exactly 48 IDs, F001–F048, with no duplicate IDs or missing index IDs.
- The repository tree contains exactly 48 matching festival record files, F001.md–F048.md, with no missing or extra numbered festival records.
- The 10 category catalogs are present.
- The 10 category catalogs contain 224 candidate rows in total.
- Candidate rows now explicitly carry `VERIFICATION_STATUS` and `SOURCE_REFERENCES`.
- All 224 candidate rows currently have `VERIFICATION_STATUS: UNVERIFIED` and `SOURCE_REFERENCES: NOT_RECORDED`; no candidate has been upgraded to VERIFIED by this audit.
- Catalog festival tags were checked for valid F001–F048 syntax; no invalid or missing tags were found in the catalog rows inspected.
- Festival record `CATEGORY_LINKS` were compared with the link matrix. Three mismatches were found and corrected for F006, F007, and F008. The matrix now explicitly defers to each festival record and defines `CATEGORY_LINK_MISMATCH` as a stop condition.
- F011 Mexican Día de los Muertos item tags are kept separate from F044 regional variants.
- F038 is explicitly identified as a memorial-focused scope overlapping F020, not as a separate holiday.
- F044 remains flagged as `REGION_SPECIFIC_ITEM_GAP`; workers must not relabel Mexican-specific F011 items as Andean/other Latin American variants.
- The cultural-anchor file is now correctly labeled working generation guidance, not independently source-verified evidence.

## Remaining data-quality work

1. **Per-item source verification is not complete.** The repository tree currently contains no separate complete per-item records. The 224 catalog entries are compact candidate summaries and do not satisfy every field in `ITEM_RECORD_SCHEMA.md`.
2. Each candidate that is to become VERIFIED needs a complete item record, explicit source references supporting festival association, region, and cultural context, review of all required fields, and matching status in the catalog.
3. High-sensitivity cultural and religious items should be reviewed first. Unsupported items must remain UNVERIFIED or be rejected; do not fill source references with guesses.
4. This audit confirms structural consistency for the checks listed above; it does not certify every cultural claim, every festival description, or every visual suggestion as historically accurate.

## Production safety rule

A catalog entry marked UNVERIFIED is a discovery candidate only. It must not be represented as a culturally verified item. When a requested design depends on a specific item that has no verified record, report the data gap instead of inventing cultural authority.
