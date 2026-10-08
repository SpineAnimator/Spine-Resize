# Spine-Resize

Online utility that resizes Spine skeletons so the **first frame fits a target square** (default **300×300**) while keeping **bone scale = 1** everywhere.

Geometry (bone positions, lengths, attachment sizes, mesh vertices, animation translate keys) and images are scaled together. Existing non-1 scales can be **baked** into geometry — useful when a character root has `scale ≈ 0.24` and IK starts breaking under a shared root with multiple characters.

## Features

- Pure browser — files never leave your machine
- Drag-and-drop ZIP (or individual files)
- Supports: `*.json` (Spine runtime), `*.atlas`, `*.png` / image folders, nested ZIPs
- Target size configurable
- Bake non-1 scales (recommended for IK)
- Center result around origin
- Keep aspect ratio (fit inside square)
- Black UI with smooth transitions

## Usage

1. Open https://spineanimator.github.io/Spine-Resize/
2. Drop a ZIP that contains the Spine JSON export + images (and optionally `.atlas`)
3. Set target size (300 by default)
4. Click **Resize & Download**

The resulting ZIP contains the scaled JSON, resized PNGs and (if present) a scaled atlas.

## Why bake scale?

When many characters live under one root and you switch them by visibility / skin, a non-1 scale on a character bone interacts badly with IK constraints. Baking the scale into local translations, bone lengths and attachment sizes leaves every `scaleX/Y = 1`, so IK stays stable.

## Limitations

- `.spine` (editor project) and binary `.skel` are detected but not fully rewritten yet — export JSON from the Spine editor first.
- Weighted meshes and complex path constraints receive a best-effort scale; verify in the Spine editor after import.
- Bounding box is computed from the **setup pose** of the default skin. If the first animation frame differs a lot, you may need a small manual tweak.

## License

MIT · [SpineAnimator](https://github.com/SpineAnimator)
