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
5. RECOGNIZABILITY uses LOW / MEDIUM / HIGH / VERY HIGH; use VERY HIGH only when the item is exceptionally diagnostic of a specific festival and region.
6. CULTURAL_SENSITIVITY uses LOW / MEDIUM / HIGH / VERY HIGH; use VERY HIGH for items where cultural or religious misrepresentation could be especially harmful.
7. REALISTIC and ANIME indicate whether the item is suitable for each generation system.
8. Female-only clothing remains the primary clothing scope; unisex items are allowed where appropriate.
