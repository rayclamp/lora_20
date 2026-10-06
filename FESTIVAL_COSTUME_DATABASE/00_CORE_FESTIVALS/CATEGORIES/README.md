# FESTIVAL CATEGORY INDEX

The database uses 10 fixed categories:

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

## RETRIEVAL MODEL

Festival → Tags → Category Items

Workers should not load every category automatically. Read only the categories needed for the requested image.

## SHARED ITEM-RECORD RULES

- Every item must have a stable `ITEM_ID`.
- Every reusable item must include at least one specific `FESTIVAL` tag.
- Record `REGION` and `CULTURAL_SCOPE`.
- Record `CULTURAL_SENSITIVITY` when relevant.
- Record `RECOGNIZABILITY` as `HIGH`, `MEDIUM`, or `LOW`.
- Do not treat visual similarity as proof of cultural association.

## SCOPE

- Female-focused.
- Unisex items may be recorded when culturally appropriate.
- Male-only clothing is not separately maintained at this stage.

The current festival list and fixed festival count are authoritative in `CORE_FESTIVAL_INDEX.md`; this category index does not duplicate that list.
