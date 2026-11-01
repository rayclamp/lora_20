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

## P0-21/P0-22 Re-audit — 2026-11-02 (current `main` snapshot)

The following checks were performed against the existing individual festival files and all **ten** current category `ITEM_CATALOG.md` files, without creating, editing, promoting, or rejecting any candidate item. Earlier audit statements above are preserved as historical findings; this section records a fresh structural observation, not independent cultural verification.

### Festival records and names

- The `FESTIVALS/` directory contains exactly **48** numbered files, `F001.md` through `F048.md`.
- All 48 festival files were read individually and their recorded `FESTIVAL_ID`, `NAME_EN`, and `NAME_ZH` were compared with the fixed `CORE_FESTIVAL_INDEX.md` lookup. Every `FESTIVAL_ID` and Chinese name matched. The sole English name discrepancy was F038; P0-21 corrected only its heading and `NAME_EN` to match the canonical index, leaving its category set, scope, `OVERLAPS_WITH: F020` and original record identity intact.
- All 48 records contain the existing `CULTURAL_VERIFICATION: MAINTAINED_FOR_NEW_ITEM_EXPANSION` note. As clarified in `FESTIVAL_RECORD_SCHEMA.md`, this is **not a verified-item/source-evidence status**. Do not treat a record's existence or this text as a certification of its cultural details.

### Category-catalog evidence inventory

| Fixed category | Candidate rows |
|---|---:|
| CLOTHING | 17 |
| ACCESSORIES | 57 |
| SOCKS | 5 |
| SHOES | 38 |
| HEADWEAR | 36 |
| HAIRSTYLE | 6 |
| MAKEUP | 5 |
| BODY_DECORATION | 4 |
| PROPS | 36 |
| OTHER | 20 |
| **TOTAL** | **224** |

- All 224 rows were read as seven-column catalog entries with `ITEM_ID`, `NAME`, `FESTIVAL_TAGS`, `REGION`, `RECOGNIZABILITY`, `VERIFICATION_STATUS`, and `SOURCE_REFERENCES`; no missing values in those catalog columns were found in this audit.
- Cross-catalog duplicate `ITEM_ID` values found: **0**. Unrecognized/out-of-range `FESTIVAL_TAGS` identifiers found: **0**; all catalog tags were checked against the `F001`–`F048` ID format/range.
- **224 of 224** candidate rows retain `VERIFICATION_STATUS: UNVERIFIED` and `SOURCE_REFERENCES: NOT_RECORDED`. **0 VERIFIED**, **0 REJECTED**. These counts reflect the currently observed catalog entries, not proof of cultural accuracy.
- **F044 has zero directly tagged catalog candidate rows** in the ten current catalogs. This is a more precise catalog-coverage observation that reinforces the existing `REGION_SPECIFIC_ITEM_GAP`; it does **not** authorize borrowing Mexican F011 items, inventing a local item, or marking the F044 category links invalid. A category link denotes a possible lookup domain, not actual catalog-item coverage.
- These checks establish table-field, ID, tag and status **structural** consistency only. No underlying cultural sources were independently researched, and no separate complete item-record evidence was produced or verified by this re-audit.

### Remaining action and boundary

1. Do **not** promote any candidate to `VERIFIED` without a complete matching item record, explicit traceable `SOURCE_REFERENCES`, and evidence relevant to its particular festival/region/ritual attribution. The actual candidate record and source evidence must be reviewed before a status change.
2. Prioritize high/very-high cultural-sensitivity cases and the uncovered F044 regional scope when conducting separate, source-grounded research. Treat any new item or source addition as a separately traceable data change, not a silent correction to the catalog or an inference from visual similarity.
3. Preserve F001–F048 registrations, existing category links, all 224 original catalog rows and their current verification states. This audit does not edit prompt design or image-production commands, activate QA (`PAUSED`), create a Session/Batch, or access `ARCHIVE/` or `PRODUCTION_RECORDS/`.

## P0-23 Matrix and category README verification — 2026-11-02

- Re-read all **48** current festival `CATEGORY_LINKS` sections and compared each festival's exact **set of category names** against the corresponding F001–F048 row in `FESTIVAL_ITEM_LINK_MATRIX.md`. All **48/48 matched**; there are **0 current `CATEGORY_LINK_MISMATCH` findings** in this check. Category order was not treated as a substantive difference.
- Read all ten category-scoped `CATEGORIES/<number>_<category>/README.md` files. They define category scope, refer inventory details to the adjacent `ITEM_CATALOG.md`, and defer shared validation guidance to the parent category index; none required a corrective content edit during this pass.
- No `CATEGORY_LINKS`, candidate item, individual category README, status, verification evidence, festival ID or festival matrix content was changed during this check.
- A structurally consistent link does **not** establish that the catalog contains a matching item or that any item's claimed local custom has been verified. In particular, F044 still has no directly tagged catalog candidate in the 224-row inventory at the recorded snapshot.
