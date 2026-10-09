# Spine-Resize

Online utility that resizes Spine skeletons so the **first frame fits a target square** (default **300×300**) while keeping **bone scale = 1** everywhere.

Geometry (bone positions, lengths, attachment sizes, mesh vertices, animation translate keys) and images are scaled together. Existing non-1 scales can be **baked** into geometry — useful when a character root has `scale ≈ 0.24` and IK starts breaking under a shared root with multiple characters.

## Features

- Pure browser — files never leave your machine
- Drag-and-drop ZIP (or individual files)
- Supports: `*.json`, `*.skel`, `*.spine`, `*.atlas`, images, nested ZIPs
- Target size configurable
- Bake non-1 scales (recommended for IK)
- Center result around origin
- Keep aspect ratio (fit inside square)
- Black UI with smooth transitions

## Usage

1. Open https://spineanimator.github.io/Spine-Resize/
2. Drop a ZIP that contains the Spine JSON export + images (and optionally `.atlas`)
3. Set target size (300 by default)
4. Click **Resize**

The resulting ZIP contains the scaled JSON, resized PNGs and (if present) a scaled atlas.

## Why bake scale?

When many characters live under one root and you switch them by visibility / skin, a non-1 scale on a character bone interacts badly with IK constraints. Baking the scale into local translations, bone lengths and attachment sizes leaves every `scaleX/Y = 1`, so IK stays stable.

## Limitations

- `.json`, binary `.skel` (Spine 4.2/4.3) and editor `.spine` are rewritten in the browser.
- `.skel` roundtrip at factor 1 is byte-identical. Bake pushes a bone's scale into children and attachments, then sets that bone's scale to 1. A bone's own scale does not move its x/y.
- `.spine` is raw deflate. Bone x/y/length, region size and mesh vertices scale. The parent index inside `.spine` is still unknown, so non-uniform scale is not baked there. Drop a `.skel` or `.json` with it and they share one factor.
- Weighted deform keys in `.skel` animations are still copied through, not scaled.
- The box is the setup pose. A later animation frame can stick out of the square.

## License

MIT · [SpineAnimator](https://github.com/SpineAnimator)
