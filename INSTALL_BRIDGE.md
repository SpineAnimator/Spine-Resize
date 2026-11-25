# Spine Bridge — one-click installation

The same Native Messaging host powers both **Spine Resize** and **Spine Mask Tool**. It automatically discovers the saved project currently open in Spine Editor and reads only the images referenced by that project's skeleton.

## Install

1. Download the [Spine Mask + Resize Bridge ZIP](https://github.com/SpineAnimator/Spine-Resize/releases/download/spine-mask-bridge-v1/Spine-Mask-Resize-Bridge.zip).
2. Extract the ZIP.
3. Double-click the launcher for your operating system:
   - macOS: **INSTALL.command**
   - Windows: **INSTALL.bat**
   - Linux: **INSTALL.desktop**
4. Keep an internet connection during first setup. The installer downloads Chrome for Testing, registers the Native Messaging host, loads the extension into a dedicated browser profile and opens the site.

No Python installation, terminal commands, extension developer mode or manual manifest editing is required. The installer does not modify the user's normal Chrome profile.

## Use with Spine

1. Open the project in Spine Editor.
2. Save the project so the latest changes are on disk.
3. Open the site in the dedicated **Spine Mask + Resize** browser window.
4. Click **with Spine** (Resize) or **Import open project** (Mask).

The bridge reads the saved .spine project and only the image files referenced by its skeleton. It cannot read unsaved in-memory editor changes; save in Spine before importing.

Spine Resize writes a self-contained resized ZIP bundle under **SpineResizeResults/** beside the original project. The original file is not overwritten.

## Security

- The Native Messaging manifest authorizes only the exact extension ID.
- File reads are limited to the active project and its referenced image files.
- Resize output is written to a new file inside **SpineResizeResults/**; arbitrary paths and overwriting the source project are rejected.
- The browser uses an isolated Chrome for Testing profile. It does not silently install an unsigned extension into the user's everyday browser.

macOS Gatekeeper or Windows SmartScreen may show the operating system's standard confirmation because the installer is not signed with a paid publisher certificate.
