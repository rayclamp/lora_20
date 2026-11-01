# FESTIVAL RECORD SCHEMA

This schema defines the existing festival-level record contract for the fixed **F001–F048** scope. It does not grant cultural verification to every statement in a festival record, and it does not authorize changes to registered festival IDs, names, or detailed records.

**Authority split:** `CORE_FESTIVAL_INDEX.md` is canonical for the 48 registered IDs, English/Chinese display names and index classification; each `FESTIVALS/F###.md` record is canonical for its own recorded cultural/region scope, season, festival-specific details and `CATEGORY_LINKS`. The `FESTIVAL_ITEM_LINK_MATRIX.md` is a category-navigation mirror, not an authority that can change a festival record. Report discrepancies with the exact ID and fields rather than silently overwriting either source.

## REQUIRED FIELDS

- FESTIVAL_ID
- NAME_EN
- NAME_ZH
- REGION / CULTURAL_SCOPE
- SEASON
- CATEGORY_LINKS

## PLANNED DETAIL FIELDS

- CULTURAL_CONTEXT
- CLOTHING
- ACCESSORIES
- SOCKS
- SHOES
- HEADWEAR
- HAIRSTYLE
- MAKEUP
- BODY_DECORATION
- PROPS
- OTHER
- SCENE
- LOCATION
- ACTIVITY
- DECORATION
- FOOD
- SYMBOLS
- HAND_INTERACTION
- CULTURAL_SENSITIVITY (LOW / MEDIUM / HIGH / VERY HIGH)
- RECOGNIZABILITY (LOW / MEDIUM / HIGH / VERY HIGH)

## REQUIRED VS PLANNED FIELD CONTRACT

- `REQUIRED FIELDS` lists the minimum expected structural keys for an individual festival record. A stored key is not proof that every value, attribution or cultural claim has been independently verified. If a required field is missing or conflicts with the canonical index, report the exact record/field and preserve the evidence; do not invent a value or silently edit another file.
- `PLANNED DETAIL FIELDS` is a vocabulary for possible future expansion, **not a claim that any field has been populated**, not permission to fabricate facts, and not a mandatory requirement to fill all of them for F001–F048. A missing optional detail must remain missing or explicitly unresolved until supported data exists.
- Festival-level `CULTURAL_SENSITIVITY` and `RECOGNIZABILITY`, where present, are contextual/risk and recognizability annotations, **not independent source evidence**. Do not convert a rating into a claim that an associated clothing item, ritual, or regional custom is verified.
- An existing value such as `CULTURAL_VERIFICATION: MAINTAINED_FOR_NEW_ITEM_EXPANSION` is a workflow/database note, **not** a `VERIFICATION_STATUS: VERIFIED` award to any item. Verify claims at the applicable festival/item/region level.

## DATA AUTHORITY AND CATEGORY-LINK CONSISTENCY

1. Identify the existing festival by its `FESTIVAL_ID` and use `CORE_FESTIVAL_INDEX.md` for canonical English/Chinese names and index class/region tags. Classification or related-ID lookup is not proof that region-specific traditions are interchangeable.
2. Read the matching festival record for recorded `REGION / CULTURAL_SCOPE`, `SEASON`, `CATEGORY_LINKS`, and any actual present detail/coverage warnings. The festival record's `CATEGORY_LINKS` takes precedence over the summary in `FESTIVAL_ITEM_LINK_MATRIX.md`. Do not add, remove, or normalize category links automatically.
3. If a record/index name, region attribution, or required field differs from its canonical authority, report the affected ID, source paths and exact values for review instead of overwriting. For a category-list discrepancy specifically, stop **item selection for that festival**, report `CATEGORY_LINK_MISMATCH`, and resolve under a separately authorized data correction. Other unrelated festival records are not automatically blocked.
4. Category catalog rows are candidate summaries; their inclusion is not source verification. Treat an item as `VERIFIED` only when its catalog row **and** matching complete item record document explicit `SOURCE_REFERENCES`, compatible festival/region/cultural scope, and reviewed required fields under `ITEM_RECORD_SCHEMA.md`. If evidence is missing or unresolved, keep the item `UNVERIFIED`, explain the gap and do not invent cultural claims or citations.
5. `FESTIVAL_CULTURAL_ANCHORS.md` supplies **design cues**, not individually source-verified historical/ritual/costume facts. The actual cultural source, regional applicability, and item-level verification status must be checked before presenting a suggestion as an established tradition.

## KNOWN FESTIVAL OVERLAP AND REGIONAL SAFETY

- `F020` / `F038`: `F038` is an existing **memorial/tomb-sweeping thematic focus within the Qingming observance** indexed at `F020`; it is not a second independent holiday. Preserve both registered IDs and distinct stored category sets; do not silently merge, delete, renumber, or rewrite them.
- `F011` / `F044`: `F011` is the Mexican Día de los Muertos context; `F044` groups separately indexed Andean/other Latin American variants. `F044` explicitly carries `REGION_SPECIFIC_ITEM_GAP`. Do not substitute Mexican-specific F011 costume, altar, makeup or ritual items as proof of an Andean/other regional tradition. Source-verified records must support the precise requested region or the missing data must be reported.
- Other regional and cross-cultural collection overlaps (such as `F018` / `F028` / `F033` / `F039`) must likewise retain their own IDs and cultural contexts. Shared seasonal motifs, scene cues or tags do not make regional rites and costumes equivalent.

## WORKER RULE — EVIDENCE BOUNDARY

Festival-level records establish the **recorded scope and lookup boundary**, not automatic verification of cultural accuracy. Category item records can provide reusable generation components only to the extent supported by valid item evidence and matching tags/region. Workers may design composition, camera, pose, action and visual storytelling independently within the approved brief, but must not present an `UNVERIFIED` catalog candidate or an uncited anchor as verified cultural tradition.

This schema clarification modifies no individual festival record, no catalog candidate status, no category set, and no locked prompt. It does not start image generation, activate QA (which remains `PAUSED`), create Session/Batch, or alter archived/historical production records.
