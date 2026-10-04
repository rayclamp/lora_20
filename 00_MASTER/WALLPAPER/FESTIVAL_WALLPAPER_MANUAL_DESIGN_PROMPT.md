### OUTPUT FORMAT MODEL

`OUTPUT_TYPE` is the user-facing wallpaper format selection.

Valid `OUTPUT_TYPE` values:
- `DESKTOP_WALLPAPER`
- `PHONE_WALLPAPER`

`ASPECT_RATIO` and `ORIENTATION` are technical lock fields derived from `OUTPUT_TYPE`; they are not independent user-facing inputs.

Derivation:
- `DESKTOP_WALLPAPER` → `ASPECT_RATIO: 16:9` → `ORIENTATION: LANDSCAPE`
- `PHONE_WALLPAPER` → `ASPECT_RATIO: 9:16` → `ORIENTATION: PORTRAIT`

The system must derive and hard-lock these technical fields before image design and generation. The user does not independently select a conflicting aspect ratio.

