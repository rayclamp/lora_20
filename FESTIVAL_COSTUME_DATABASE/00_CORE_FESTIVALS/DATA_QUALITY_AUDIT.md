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

## P0-24 Catalog coverage and tag-to-category reconciliation — 2026-11-02

This pass analyzed all **224** current candidate catalog rows and their **413** F-ID tag associations against the actual festival category scope stored in the current festival records, which matches `FESTIVAL_ITEM_LINK_MATRIX.md` as independently checked in P0-23. It is a **structural coverage** audit only: all catalog candidates remain `UNVERIFIED` and no new item/cultural source research was performed.

### Candidate-tag coverage gaps

- **No directly tagged candidate item:** `F003` (New Year's Day), `F007` (Thanksgiving), and `F044` (Andean/Latin American remembrance regional variants). These three registered festivals still have valid category-link navigation entries, but **zero** `FESTIVAL_TAGS` associations in the current ten catalogs.
- **Only one or two directly tagged candidate items:** `F005` (1), `F002` (2), `F025` (2), and `F040` (2). These are catalog-discovery coverage gaps, **not** claims that any listed item is culturally verified.
- A fixed festival ID remains registered even when no directly tagged candidate exists. Do not remove a festival, invent an item to fill a gap, borrow another region's objects, or change an item's verification state solely to improve coverage statistics.

### Candidate tag outside that festival's currently allowed category links

The current catalogs contain **17 item-to-festival tag associations across nine candidate rows** where the candidate's containing category is **not included** in that tagged festival's authoritative `CATEGORY_LINKS`. The 17 associations involve **12 festival IDs**. This is distinct from `CATEGORY_LINK_MISMATCH`: the 48 festival records and link matrix already match each other; the discrepancy is between **catalog tag associations and allowed category scopes**.

| Existing catalog candidate ITEM_ID | Catalog category | Festival IDs without that category link |
|---|---|---|
| `SOCK_XMAS_KNIT_001` | SOCKS | F001, F048 |
| `SOCK_EID_MODEST_001` | SOCKS | F014, F015, F016 |
| `SOCK_NORDIC_001` | SOCKS | F046 |
| `HEAD_EASTER_BONNET_001` | HEADWEAR | F006 |
| `HEAD_STPATRICK_FLATCAP_001` | HEADWEAR | F008 |
| `HAIR_THAI_FEST_001` | HAIRSTYLE | F029 |
| `MAKEUP_XMAS_SOFT_001` | MAKEUP | F001, F048 |
| `MAKEUP_JP_FEST_001` | MAKEUP | F023, F024, F026 |
| `BODY_EID_HENNA_001` | BODY_DECORATION | F014, F015, F016 |

**Unresolved decision boundary:** A category link must not be automatically broadened merely because an `UNVERIFIED` catalog row claims a matching festival tag. Equally, do not silently delete a historical tag or reassign a candidate to another festival. First determine from region-specific sources and the intended festival-category scope whether the catalog tag is genuinely appropriate; then make a separately traceable data correction to the appropriate record, and recheck the matrix and item status without inventing provenance.

**Read/selection behavior until resolution:** Treat these nine candidates as `UNVERIFIED` and do not promote them as verified examples for an affected festival/category outside its allowed `CATEGORY_LINKS`. Report the exact item ID, festival ID and category when the mismatch would affect a specific requested design. Other unrelated festival-category lookup paths are not automatically invalidated.

This section records observed candidate coverage and a new cross-layer consistency finding only. It modifies no candidate tags, 48 festival records, category links, original festival IDs/names, prompt/design/production commands, QA activation (`PAUSED`), or `ARCHIVE/` / `PRODUCTION_RECORDS/` historical data.

## P0-25 Culture-and-region evidence triage of 17 catalog exceptions — 2026-11-02

This audit reviewed all nine existing candidate rows responsible for 17 tag-to-category exceptions and the relevant festival-region and CATEGORY_LINKS records for all 12 affected IDs. The external references below are contextual research leads, NOT individual approved item records or proof of VERIFIED status. No candidate ID, festival tag, region, category link, source field, status or prompt is changed by this audit.

### Candidate-by-candidate review

| Candidate ID | Festival IDs | Observation and source limitation | Decision |
|---|---|---|---|
| SOCK_XMAS_KNIT_001 | F001, F048 | Generic winter knit socks do not establish a specifically Christmas-traditional item. | No automatic SOCKS category expansion; retain UNVERIFIED. |
| SOCK_EID_MODEST_001 | F014, F015, F016 | Opaque modest hosiery is broadly wearable, not a distinct Ramadan or Eid ritual garment. Ramadan is a period (F014), while the two Eids are distinct festivals (F015/F016). | Review each association separately with precise community and practice evidence. |
| SOCK_NORDIC_001 | F046 | General season-neutral Nordic hosiery is not demonstrated to be a Midsummer-specific cultural item. | Do not expand F046 SOCKS merely from geographic similarity. |
| HEAD_EASTER_BONNET_001 | F006 | Smithsonian National Museum of American History documents decorated hats and spring finery during historical US Easter Parades. This supports US Easter headwear as a scoped research lead, NOT the candidate's broad regional attribution or item verification. | Potential region-limited F006 HEADWEAR scope review after complete record and source-to-item review. |
| HEAD_STPATRICK_FLATCAP_001 | F008 | Lambton Heritage Museum links flat caps to Irish/Scottish heritage but does not establish the cap as a specifically St. Patrick's Day item or required festival tradition. | Do not convert general Irish heritage into a festival-specific verified candidate. |
| HAIR_THAI_FEST_001 | F029 | Tourism Authority of Thailand documents Songkran celebrations and traditional dress; it does not identify the unspecified candidate hairstyle as specifically traditional at Songkran. | Narrow the hairstyle claim and gather exact local evidence before HAIRSTYLE expansion. |
| MAKEUP_XMAS_SOFT_001 | F001, F048 | General soft festive makeup is a broad creative design choice, not documentation of a particular Christmas/Advent custom. | No culturally specific claim or MAKEUP expansion on this basis. |
| MAKEUP_JP_FEST_001 | F023, F024, F026 | Japan National Tourism Organization documents matsuri dress such as yukata; this does not verify that a nonspecific refined makeup style is a traditional practice of Tanabata, Gion Matsuri, or Obon. | No automatic MAKEUP link expansion or verified cultural attribution. |
| BODY_EID_HENNA_001 | F014, F015, F016 | Abu Dhabi cultural heritage resources describe women and girls applying henna during Eid al-Fitr and Eid al-Adha in the UAE. This supports a regional Eid-context research lead, NOT a universal Muslim practice, a blanket South Asian claim, or F014 Ramadan-period equivalence. | F015/F016 BODY_DECORATION warrant a source-backed region-specific scope review; the F014 tag needs separate evidence. |

### Source leads and their evidence boundaries

- Smithsonian National Museum of American History, "For your Easter bonnet: Silk ribbons" (2017), US Easter Parade attire only: https://www.americanhistory.si.edu/explore/stories/your-easter-bonnet-silk-ribbons
- Lambton Heritage Museum, "Tip your Cap: Men's Hat Styles", general Irish/Scottish flat-cap history, not St. Patrick-specific use: https://www.heritagemuseum.ca/learn/articles-stories/hats/tip-your-cap-men-s-hat-styles/
- Department of Culture and Tourism - Abu Dhabi, "Celebrating Eid", Emirati customs for both Eid festivals: https://abudhabiculture.ae/en/cultural-heritage/intangible/heritage-register/social-practices/celebrating-eid
- UNESCO Intangible Cultural Heritage, "Henna: rituals, aesthetic and social practices" (inscribed 2024), broad diverse community contexts, not an item-by-item festival certification: https://ich.unesco.org/en/RL/henna-rituals-aesthetic-and-social-practices-02116
- Japan National Tourism Organization, "Get Involved in Local Japanese Festivals", matsuri dress context, not direct festival-makeup evidence: https://www.japan.travel/en/guide/get-involved-in-local-festivals/
- Tourism Authority of Thailand, official Songkran guide, festival practices and dress context, not a specific hairstyle: https://www.thailandtravel.or.jp/thai-festival-01/

### Unresolved correction gates

1. A broad cultural association, general clothing suitability, or source for a RELATED garment does not establish the exact item, local practice, historical claim, or festival-specific tradition.
2. Region-scoped HEAD_EASTER_BONNET_001 (F006) and BODY_EID_HENNA_001 (F015/F016) are candidates for further review, not automatic VERIFIED rows or CATEGORY_LINKS expansions. Keep F014 Ramadan separate from Eid al-Fitr and Eid al-Adha.
3. Resolve distinct decisions separately: the exact item-to-festival/region assertion; source-backed full item record; authoritative festival CATEGORY_LINKS; corresponding link-matrix navigation. Any change must be independently traceable and verified without silently altering other regional traditions.
4. All 17 discrepancies involving nine candidate rows and 12 festivals remain open pending claim-specific evidence and category decisions. All 224 catalog candidates retain UNVERIFIED and SOURCE_REFERENCES: NOT_RECORDED. This audit appendix does not update catalog SOURCE_REFERENCES, create item records, or label any item VERIFIED.
5. Preserve all fixed F001-F048 registrations and existing category links, historical audit findings and production/Archive records. Do not edit design prompt or image-generation commands; QA remains PAUSED.

## P0-28 Festival-record wording cleanup — 2026-11-02

- Inspected the common `WORKER_RULE` and `CULTURAL_NOTE` descriptions in the existing F001–F048 festival record files. All **48** contained legacy wording implying that a 'verified catalog' existed even though current catalog rows are only `UNVERIFIED` candidates.
- Corrected **each of the 48 existing festival files individually**, replacing only the two repeated narrative paragraphs. Each file was committed, then read back at `main`; full-text equality and the returned Blob SHA both matched the intended update. No additional Session/Batch or production action occurred.
- The updated common `WORKER_RULE` directs canonical name/ID lookup to `CORE_FESTIVAL_INDEX.md` and uses each festival record as authority for its own region/cultural scope and `CATEGORY_LINKS`. It warns that catalog tags and category links do not constitute source validation.
- The updated common `CULTURAL_NOTE` explicitly treats catalog entries as candidate indexes rather than a 'verified catalog'; requires a complete item record and reviewed `SOURCE_REFERENCES` for any VERIFIED cultural association; and clarifies that `CULTURAL_VERIFICATION: MAINTAINED_FOR_NEW_ITEM_EXPANSION` is a maintenance note, **not** an item verification decision.
- For every updated file, the original ID, English/Chinese names, region, season, `DATABASE_STATUS`, `CATEGORY_LINKS`, and all non-target sections were preserved byte-for-byte by the exact-paragraph replacement procedure. Additional post-update sample checks of F001, F014, F038, F044 and F048 confirmed canonical names and category sets; F038 retained its `OVERLAPS_WITH: F020` thematic scope and F044 retained `REGION_SPECIFIC_ITEM_GAP` and its prohibition on borrowing Mexican F011 items.
- **No candidate item was created, edited or upgraded**: the latest observed snapshot remains 224 catalog rows with `VERIFICATION_STATUS: UNVERIFIED` and `SOURCE_REFERENCES: NOT_RECORDED`. The 17 candidate-tag/category-scope exceptions documented in P0-24/P0-25 remain unresolved pending claim-specific review.
- Existing audit history, Archive, `PRODUCTION_RECORDS`, prompt design and image-production command files remain untouched. QA remains `PAUSED`.

## P0-29 Catalog-local exception warnings — 2026-11-02

To prevent unresolved tag/category discrepancies being overlooked by readers who open `ITEM_CATALOG.md` directly, an explicit **P0-29 OPEN CATEGORY-SCOPE EXCEPTIONS** section was added near the top of each of the **five affected catalog files**, immediately before their original seven-column item tables.

| Catalog path within `CATEGORIES/` | Warning row IDs | Affected item/festival associations |
|---|---:|---:|
| `03_SOCKS/ITEM_CATALOG.md` | 3 | 6 |
| `05_HEADWEAR/ITEM_CATALOG.md` | 2 | 2 |
| `06_HAIRSTYLE/ITEM_CATALOG.md` | 1 | 1 |
| `07_MAKEUP/ITEM_CATALOG.md` | 2 | 5 |
| `08_BODY_DECORATION/ITEM_CATALOG.md` | 1 | 3 |
| **Total** | **9** | **17** |

All five files were changed independently in GitHub `main`, and each write was followed by full-text readback and new Blob SHA comparison. The pre-existing `ITEM_CATALOG.md` Markdown tables and their item rows were retained exactly; only explanatory warning paragraphs were inserted above the existing tables. Each local warning names the exact affected existing `ITEM_ID` and festival IDs, distinguishes a **catalog item-tag/category-scope discrepancy** from a `CATEGORY_LINK_MISMATCH` between festival records and link matrix, and points back to the P0-24/P0-25 audit evidence limitations.

### Cross-catalog recheck after the five writes

- Re-read **all ten** current catalogs and the canonical F001–F048 festival link matrix. All **224** original candidate rows remain present with unique `ITEM_ID`s and `VERIFICATION_STATUS: UNVERIFIED` / `SOURCE_REFERENCES: NOT_RECORDED`; no catalog item source, name, category table value or festival tag was changed.
- Recomputed **17** item-tag/category-scope exceptions, involving **nine** candidate rows and **12** distinct festival IDs. All 17 are now explicitly warned about in their catalog's new P0-29 section. Exactly the **five** implicated catalogs carry that section; the other five catalogs were not modified.
- These are **open** unresolved association/evidence questions, not newly VERIFIED items and not automatic permission to add the omitted categories to authoritative festival records. Preserve the three zero-direct-candidate festival IDs F003, F007, F044, all 48 registered festival records, and existing category links.
- No prompt-design or image-production command content, active QA state (`PAUSED`), `ARCHIVE/` or `PRODUCTION_RECORDS/` was modified.

## P0-30 Festival-specific zero-candidate coverage markers — 2026-11-02

- The prior P0-24 cross-catalog audit found **zero** direct `FESTIVAL_TAGS` candidate matches for the fixed festival IDs `F003`, `F007` and `F044` across the ten present catalog files.
- Added an explicit **dated audit snapshot** section named `CANDIDATE_COVERAGE_AUDIT_SNAPSHOT` to exactly those three existing `FESTIVALS/F###.md` records. Each section records `DIRECT_FESTIVAL_TAGGED_CANDIDATE_ROWS: 0`, points to the audit, and clarifies that a coverage gap is **not** a declaration that a holiday lacks traditions or permission to fabricate a candidate.
- Each of the three festival records was written independently to GitHub `main`, immediately read back in full, and verified by matching the committed Blob SHA. The entire original text before and after the inserted section was preserved unchanged, including canonical IDs/names, region/season, database fields, and **all original `CATEGORY_LINKS`**.
- The special F044 `REGION_SPECIFIC_ITEM_GAP` status and the rule prohibiting Mexican F011 item substitution were preserved verbatim. F003 and F007 remain registered fixed festivals with the original category sets.
- All **224** catalog candidate rows remain `UNVERIFIED` and `SOURCE_REFERENCES: NOT_RECORDED`, and the 17 candidate-tag/category-scope exceptions remain open. No candidate row, source claim, category link, historic/Archive record, production record, design prompt, image-generation command, or QA (`PAUSED`) activation was changed.

## P0-31 First source-verified item — Easter Parade bonnet (2026-11-02)

### Source-backed item correction

- `HEAD_EASTER_BONNET_001` has an actual **complete item record** at `CATEGORIES/05_HEADWEAR/ITEMS/HEAD_EASTER_BONNET_001.md`, created and read back on `main`. Required schema fields, region-limited source attribution and applicability exclusions were reviewed. The record verifies **a decorative Easter bonnet in United States Easter Parade / New York City context**; it does not verify a universal European/Christian religious costume.
- Verified supporting references: Museum of the City of New York, `https://www.mcny.org/story/easter-parade`; Library of Congress, `https://blogs.loc.gov/picturethis/2023/04/hats-on-for-easter/`; ASU FIDM Museum, `https://asufidmmuseum.asu.edu/learn/articles/put-your-easter-bonnet`. These publications specifically support Easter Parade / bonnet historical association and related US-context headwear; do not extend evidence beyond the covered cultural scope.
- In the existing `FESTIVALS/F006.md`, the category `HEADWEAR` was added to F006's authoritative `CATEGORY_LINKS`. The F006 row of `FESTIVAL_ITEM_LINK_MATRIX.md` was updated to match, with all other festival ID/name/category rows unchanged. This resolves the F006 `HEADWEAR` scope conflict for the supported candidate, but does not authorize globally verified headwear.
- In the original `05_HEADWEAR/ITEM_CATALOG.md`, only the existing `HEAD_EASTER_BONNET_001` table row was changed: `REGION` was narrowed from the unsupported `Europe/North America` to `United States (New York City Easter Parade context)`; `VERIFICATION_STATUS` changed from `UNVERIFIED` to `VERIFIED`; `SOURCE_REFERENCES` now lists all three accessible source pages. Item ID, name, F006 tag and HIGH recognizability were retained.
- The headwear catalog's P0-29 warning was updated to show the resolved F006 case separately from the still-open F008 `HEAD_STPATRICK_FLATCAP_001` mismatch. The `CATEGORIES/05_HEADWEAR/README.md` navigation now links to the source-reviewed complete item record.

### Independent post-write state measurement

| Check | New observed state |
|---|---|
| Total catalog candidates | 224 |
| Unique candidate `ITEM_ID` | 224 |
| `VERIFICATION_STATUS: VERIFIED` | **1** (`HEAD_EASTER_BONNET_001`, region-scoped) |
| `VERIFICATION_STATUS: UNVERIFIED` | **223** |
| Other catalog rows upgraded or sourced | **0** |
| Item-tag/category-scope exceptions (P0-24 baseline 17) | **16 open** |
| Distinct candidates in those exceptions | **8** (previously 9) |
| Distinct festival IDs in those exceptions | **11** (previously 12) |
| F006 HEADWEAR matrix versus festival record | Matching |

Earlier sections of this audit that reported **224 UNVERIFIED** candidates and **17** exceptions are **dated historical snapshots**, not the current state after P0-31. The current state above was computed by re-reading all ten actual item catalogs and the current F001–F048 matrix after the source/row/scope writes.

### Remaining source-evidence boundaries

- The 16 remaining catalog-tag/category-scope exceptions retain their existing warnings and unresolved status. Do not treat P0-31 as evidence for any other clothing category, region or festival. The relevant `F008` headwear exception remains open.
- The fixed F001–F048 scope, all unrelated category links, 223 unchanged UNVERIFIED rows, F044 `REGION_SPECIFIC_ITEM_GAP` and three zero-direct-candidate festivals F003/F007/F044 remain unchanged.
- This P0-31 source-record and catalog correction does not modify design prompts, production commands, Session/Batch, history, `ARCHIVE/`, `PRODUCTION_RECORDS/`, or QA (`PAUSED`).
