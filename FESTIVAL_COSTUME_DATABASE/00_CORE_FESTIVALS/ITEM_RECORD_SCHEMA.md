# FESTIVAL ITEM RECORD SCHEMA

Every reusable festival item must follow this structure.

## REQUIRED FIELDS

- ITEM_ID
- CATEGORY
- NAME_EN
- NAME_ZH
- FESTIVAL_TAGS
- REGION
- CULTURAL_SCOPE
- RECOGNIZABILITY
- CULTURAL_SENSITIVITY
- VERIFICATION_STATUS (UNVERIFIED / VERIFIED / REJECTED)
- SOURCE_REFERENCES (required before VERIFIED)
- REALISTIC
- ANIME
- DESCRIPTION

## OPTIONAL GENERATION FIELDS

- COLOR
- MATERIAL
- PATTERN
- SILHOUETTE
- HAND_INTERACTION
- WEARABLE
- SEASON
- USAGE_CONTEXT
- COMPATIBLE_FESTIVALS
- EXCLUSIONS
- NOTES

## CONTROL RULES

1. ITEM_ID must be unique.
2. FESTIVAL_TAGS must contain at least one specific festival ID or festival name.
3. Do not create an item only because it visually resembles a festival item.
4. If cultural attribution is uncertain, do not mark the item as verified.
5. VERIFICATION_STATUS may be VERIFIED only after checking explicit source references and the required record fields. Catalog inclusion alone is not verification.
6. SOURCE_REFERENCES must identify the evidence used to verify festival association, region, and cultural context.
7. RECOGNIZABILITY uses LOW / MEDIUM / HIGH / VERY HIGH; use VERY HIGH only when the item is exceptionally diagnostic of a specific festival and region.
8. CULTURAL_SENSITIVITY uses LOW / MEDIUM / HIGH / VERY HIGH; use VERY HIGH for items where cultural or religious misrepresentation could be especially harmful.
9. REALISTIC and ANIME indicate whether the item is suitable for each generation system.
10. Female-only clothing remains the primary clothing scope; unisex items are allowed where appropriate.
11. The `ITEM_CATALOG.md` tables are compact candidate indexes, not complete item records; they do not contain every required field in this schema.
12. Every catalog row must carry `VERIFICATION_STATUS` and `SOURCE_REFERENCES`. Until an item has a complete record with all required fields and reviewed source evidence, its status must remain `UNVERIFIED` and its source field must remain `NOT_RECORDED` when no evidence is recorded.
13. A catalog row may be changed to `VERIFIED` only when its matching complete item record exists, its source references are explicit, and all required fields have been reviewed. Never infer verification from a catalog summary.
