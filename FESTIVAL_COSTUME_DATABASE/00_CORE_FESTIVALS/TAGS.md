# FESTIVAL DATABASE TAGS

## Tagging principles

1. Every reusable festival item **must** have at least one specific `FESTIVAL_TAGS` association as required by `ITEM_RECORD_SCHEMA.md`. Prefer a registered `F001`–`F048` ID for stable joins; an explicitly recorded festival name remains permitted by the current item schema, but it must resolve to an unambiguous registered entry before a cultural claim is made. Do not invent festival IDs or rewrite legacy tags automatically.
2. A registered festival may reference multiple items across its declared `CATEGORY_LINKS` categories; a category link does **not** certify a particular item.
3. One item may reference multiple festival IDs **only** where separately supported cultural/region associations exist. Sharing an appearance or a general season is not sufficient.
4. Festival association may not be inferred from visual appearance, an index class, a scene idea, or a `FESTIVAL_CULTURAL_ANCHORS.md` design cue alone.
5. Use `CORE_FESTIVAL_INDEX.md` for canonical registered IDs and names, the selected `FESTIVALS/F###.md` for its own region and `CATEGORY_LINKS`, and `FESTIVAL_ITEM_LINK_MATRIX.md` only for category navigation. A `CATEGORY_LINK_MISMATCH` must be reported, not silently resolved by changing a tag.
6. `FESTIVAL_TAGS`, `REGION`, and `CULTURAL_SCOPE` describe an **asserted** item association and intended lookup scope, not the source verification state. For regional variants, check the precise festival, community, practice and applicable evidence.
7. Similar-looking items must remain separate whenever their documented meaning, ritual role or local tradition differs. In particular, F011 Mexican Día de los Muertos is not interchangeable with F044 Andean/Latin American variants; F044 retains `REGION_SPECIFIC_ITEM_GAP`. F038 is a Qingming thematic focus overlapping F020, not a distinct additional holiday.
8. A generic `FESTIVE` label is not a substitute for a specific `FESTIVAL_TAGS` association. Do not promote a seasonal, visual or cross-cultural umbrella link into an unsupported regional attribution.
9. Item-level `CULTURAL_SENSITIVITY` accepts `LOW`, `MEDIUM`, `HIGH`, `VERY HIGH` and is a **risk/caution flag**, not an evidence or authenticity grade. VERY HIGH calls for especially careful religious, ritual, ancestral or regional representation.
10. Item-level `RECOGNIZABILITY` accepts `LOW`, `MEDIUM`, `HIGH`, `VERY HIGH`; VERY HIGH is reserved for an unusually diagnostic **item in the specified festival/region context**. Recognizability is not evidence that an item is culturally correct or historically verified, and is distinct from the redundant festival-level `Recognition cues` column removed in P0-10.
11. `REALISTIC` and `ANIME` represent item suitability for each rendering system, not cultural verification, approved prompt text, or authorization to generate an image.

## Categories

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

## Recommended common fields (navigation summary only)

The following is a quick reference for tagging. It is **not** a replacement for the full mandatory/optional field definitions in `ITEM_RECORD_SCHEMA.md`. In particular, `VERIFICATION_STATUS` and `SOURCE_REFERENCES` are mandatory for catalog rows and complete item records under the item schema.

- ITEM_ID
- CATEGORY
- ITEM_TYPE (where applicable)
- NAME_EN / NAME_ZH (required in complete item records)
- FESTIVAL_TAGS
- REGION
- CULTURAL_SCOPE
- HAND_INTERACTION (optional item field)
- CULTURAL_SENSITIVITY
- RECOGNIZABILITY
- VERIFICATION_STATUS
- SOURCE_REFERENCES
- REALISTIC
- ANIME
- DESCRIPTION (required in complete item records)

## Verification, evidence and status boundary

- `VERIFICATION_STATUS` is defined by `ITEM_RECORD_SCHEMA.md`: `UNVERIFIED`, `VERIFIED`, `REJECTED`. A festival tag, a sensitivity score, recognizability, category membership or visual suitability **never** changes that status on its own.
- `SOURCE_REFERENCES` for a `VERIFIED` item must support the **specific item-festival association, region and cultural context**, not merely discuss the broad holiday or provide an unsourced example. Verify the complete matching item record, required fields and catalog status before asserting that a candidate is verified.
- Catalog-only entries are candidate summaries. The current `DATA_QUALITY_AUDIT.md` recorded 224 catalog candidates as `UNVERIFIED` with `SOURCE_REFERENCES: NOT_RECORDED`; treat that figure as an audit snapshot, not a live auto-recalculated value. Do not invent missing full records, sources, or changes to existing candidate status.
- When a tag names a broader cross-cultural collection or another region, do not silently infer or transplant a local ritual/costume item. Identify the uncertain festival/region and report its evidence gap rather than mislabel the item.
- This tagging guide neither alters the 48 registered festival IDs or ten category names nor enables QA, starts a Session/Batch, modifies locked prompts, invokes image generation, or accesses archived production history. QA stays `PAUSED`.
