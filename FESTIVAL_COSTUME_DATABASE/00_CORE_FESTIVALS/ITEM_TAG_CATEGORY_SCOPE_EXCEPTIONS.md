# Item Tag / Festival Category-Scope Exceptions — P0-36

**Audit snapshot:** 2026-11-02, `main` after P0-35. **Status:** 13 OPEN item–festival associations spanning 7 existing catalog items and 11 festival IDs. This is a diagnostic exception register and **not** an additional catalog, verification authority, item schema, festival record, or executable production instruction. The numbers are a dated snapshot, not an automatically updated counter.

## Exact problem definition and source of truth

- `CORE_FESTIVAL_INDEX.md` controls registered festival IDs and names. `FESTIVALS/F###.md` controls its own `CATEGORY_LINKS` and cultural/region scope. `FESTIVAL_ITEM_LINK_MATRIX.md` is a mirror. The catalog file's containing category is determined by its actual `CATEGORIES/NN_*/ITEM_CATALOG.md` location.
- **ITEM_TAG_CATEGORY_SCOPE_EXCEPTION:** a catalog candidate's `FESTIVAL_TAGS` includes F###, but that F### record's `CATEGORY_LINKS` does not contain the candidate's actual catalog category. This is different from `CATEGORY_LINK_MISMATCH` (festival record versus matrix), of which the P0-35 check found none.
- Every row here is still an `UNVERIFIED` catalog candidate with `SOURCE_REFERENCES: NOT_RECORDED`. `OPEN` below is the **exception-workflow state only**; it is **not** a fourth permitted `VERIFICATION_STATUS` enum value, a `REJECTED` item status, or proof that an item can never be used in creative styling.
- For any requested festival, an OPEN pair is **not eligible as a culturally VERIFIED festival-specific database item**. Do not override the festival's category boundary, convert a common garment into a traditional festival costume, or silently remove its original tags. Generic creative styling may still be handled under separately applicable design guidance; it must not be misrepresented as a sourced tradition.

## Exact unresolved pairs (13)

| Item ID (current catalog) | Category | Tagged F-ID not allowing category | Workflow state | Missing source-backed justification |
|---|---|---|---|---|
| `SOCK_XMAS_KNIT_001` | SOCKS | F001 | OPEN | Ordinary wearable winter knit socks are not established as an F001-specific tradition |
| `SOCK_XMAS_KNIT_001` | SOCKS | F048 | OPEN | Ordinary wearable winter knit socks are not established as F048 Christmas Eve/Advent tradition |
| `SOCK_EID_MODEST_001` | SOCKS | F014 | OPEN | General modest hosiery is not specifically sourced as a Ramadan-period item |
| `SOCK_EID_MODEST_001` | SOCKS | F015 | OPEN | General modest hosiery is not specifically sourced as an Eid al-Fitr custom for a named region |
| `SOCK_EID_MODEST_001` | SOCKS | F016 | OPEN | General modest hosiery is not specifically sourced as an Eid al-Adha custom for a named region |
| `SOCK_NORDIC_001` | SOCKS | F046 | OPEN | Nordic/general-season hosiery does not establish a Midsummer-specific item |
| `HEAD_STPATRICK_FLATCAP_001` | HEADWEAR | F008 | OPEN | Irish-style flat-cap heritage is not alone proof of a specific St Patrick's Day custom |
| `HAIR_THAI_FEST_001` | HAIRSTYLE | F029 | OPEN | A generic formal Thai hairstyle is not independently sourced as a specific Songkran practice |
| `MAKEUP_XMAS_SOFT_001` | MAKEUP | F001 | OPEN | Generic soft festive makeup is not evidenced as a Christmas-specific cultural practice |
| `MAKEUP_XMAS_SOFT_001` | MAKEUP | F048 | OPEN | Generic soft festive makeup is not evidenced as an Advent/Christmas Eve-specific practice |
| `MAKEUP_JP_FEST_001` | MAKEUP | F023 | OPEN | General Japanese summer-matsuri makeup is not evidenced as Tanabata-specific |
| `MAKEUP_JP_FEST_001` | MAKEUP | F024 | OPEN | General Japanese summer-matsuri makeup is not evidenced as Gion Matsuri-specific |
| `MAKEUP_JP_FEST_001` | MAKEUP | F026 | OPEN | General Japanese summer-matsuri makeup is not evidenced as Obon-specific |

## Evidence triage and category decisions

1. **Socks (6 pairs):** distinguish wearable socks from a decorative Christmas stocking placed for presents. For F014 Ramadan, F015 Eid al-Fitr and F016 Eid al-Adha, keep their distinct calendar/observance contexts; generic modest hosiery is not a verified special ritual garment. Seek actual region-specific sources before modifying a tag or `CATEGORY_LINKS`.
2. **F008 headwear (1 pair):** Ireland's official tourism guidance describes wearing green for St Patrick's Day, but it does **not** establish the specific wool flat-cap candidate as a mandated or characteristic festival custom. Preserve the candidate's original status until direct evidence. Context lead (NOT item verification): `https://www.ireland.com/en-gb/magazine/christian-heritage/st-patricks-day-facts/`.
3. **F029 hairstyle (1 pair):** Thailand tourism references describe Songkran activities and Thai festivals, not a uniquely defined hairstyle for Songkran. Context lead (NOT item verification): `https://www.tourismthailand.org/Experiences/Details/festivals/29`.
4. **F001/F048 makeup (2 pairs):** aesthetic suitability is not a religious/cultural-source claim. Preserve free creative makeup styling separately from claims of an established Christmas / Advent makeup tradition.
5. **F023/F024/F026 makeup (3 pairs):** Japan tourism descriptions of matsuri clothing and events do not validate one generic makeup style as a specific cultural custom in all three distinct observances. Context leads (NOT item verification): `https://www.japan.travel/en/guide/get-involved-in-local-festivals/`; `https://www.japan.travel/en/spot/83/`.
6. The Smithsonian's discussion of knitted Christmas **gift stockings** is background for a different item concept, **not** source evidence that `SOCK_XMAS_KNIT_001` wearable winter socks are an F001/F048 customary garment. Context lead: `https://www.si.edu/stories/these-cozy-stamps-began-real-knitting`.

## Resolution gate (one pair at a time)

1. Read the unchanged source catalog row and the exact F### record. Verify that the category mismatch still exists and that this register's row is still current.
2. Check dated, traceable evidence for **this exact item–festival–region usage**. Distinguish tradition, contemporary event styling, general wardrobe suitability, and unrelated cultural analogy. An unsuccessful source search is not evidence that a tradition is impossible.
3. If sufficiently supported, propose a **minimal traceable correction**: a complete item record and status/source review under `ITEM_RECORD_SCHEMA.md`; justified festival `CATEGORY_LINKS` and matching matrix update where genuinely necessary; or a justified narrowing/correction of the candidate's F-tags/region. Preserve all other entries and historic snapshots.
4. If not supported, leave the pair OPEN and its candidate UNVERIFIED. Do not add missing categories, guess references, erase tags, change F-ID/name, or use `REJECTED` just to reduce the exception count.
5. After an authorized correction, re-read affected files and independently recompute the number of mismatches across **all ten catalogs** and **all 48 festival category sets**. Update this register's dated snapshot, applicable catalog-local warnings and the current `DATA_QUALITY_AUDIT.md` section together; do not rewrite previous historical findings as if they had never occurred.

## Unchanged boundaries

The registered F001–F048 festivals, related/overlapping festival distinctions (especially F011/F044 and F020/F038), original candidate IDs and statuses, production records, `ARCHIVE/`, locked prompts, design/production command files, and QA (`PAUSED`) are not altered by this diagnostic register. The separate F003 and F044 zero-direct-candidate coverage gaps remain open.
