# Spine Mask + Resize Bridge

## Desktop installation (no terminal commands)

Download and extract **Spine-Mask-Resize-Bridge.zip**, then double-click the launcher for your operating system:

- **macOS:** **INSTALL.command** (opens the bundled macOS installer app)
- **Windows:** **INSTALL.bat** (starts the Windows installer)
- **Linux:** double-click **INSTALL.desktop** (or use **INSTALL.sh** as a fallback)

The installer is self-contained; Python and terminal commands are not required. It registers one least-privilege Native Messaging host used by both Spine Resize and Spine Mask Tool, downloads Chrome for Testing if needed, and opens a dedicated browser profile with the extension already loaded. It does not modify the user's normal Chrome profile.

The first setup downloads Chrome for Testing and may take a few minutes. Keep the extracted installer folder until setup has completed. After installation, use the **Spine Mask + Resize** desktop shortcut to reopen the dedicated browser. macOS Gatekeeper or Windows SmartScreen may show the operating system's standard confirmation because the installers are not signed with a paid publisher certificate.

## Editor project access

- The Bridge discovers the saved project currently open in Spine Editor using the editor process and recent-project settings.
- It reads the .spine file in bounded chunks and exports only skeleton-referenced image files.
- It does not read arbitrary paths, unrelated files in the user's home folder, or unsaved in-memory editor state.
- Spine Resize saves the complete resized ZIP bundle in **SpineResizeResults/**; the source project is never overwritten.

## Headless Linux CI and coding agents

The same native host can be used without Chrome or a GUI. Set the project path explicitly and, when the editor is installed outside the standard paths, set the licensed CLI executable too:

    export SPINE_MASK_PROJECT_PATH=/workspace/sym_crown/sym_wild.spine
    export SPINE_MASK_EDITOR_CLI=/opt/spine/Spine.sh
    # Inject SPINE_LICENSE from your CI secret store as a masked environment variable; never commit it.

    python3 spine-bridge/agent_cli.py inspect
    python3 spine-bridge/agent_cli.py extract /workspace/job/input
    python3 spine-bridge/agent_cli.py apply /workspace/job/mask.json

The agent CLI supports inspect, extract and apply. It saves a separate project under **SpineMaskResults/** and imports it with the installed licensed Spine Editor. SPINE_MASK_RECENT_FILE can override the per-user recent-project settings file for custom CI installations.

## Security and platform notes

- Native Messaging authorizes only the exact extension ID.
- The Resize adapter shares the same framed protocol and project-scoped file allowlist as the Mask host; the old wildcard-origin, arbitrary-path host is not installed.
- Browser extensions cannot be silently installed by an ordinary website. The dedicated Chrome for Testing profile is the supported one-click path; OS security prompts remain under the user's control.
- CI builds native installers for Linux, Windows and macOS. A real licensed Spine Editor round-trip still requires the dedicated Ubuntu runner to be online.
