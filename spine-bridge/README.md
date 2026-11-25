# Spine Mask Bridge

## Desktop installation (no terminal commands)

Download and extract `Spine-Mask-Resize-Bridge.zip`, then double-click the installer for your operating system:

- **macOS:** `INSTALL.command` (Finder opens the installer; you do not type commands)
- **Windows:** `INSTALL.bat` (starts the bundled `SpineMaskInstaller.exe`)
- **Linux:** `INSTALL.sh` (run from the file manager)

The installer creates a per-user Spine Mask Bridge folder, registers the least-privilege Native Messaging host, downloads the official Google Chrome for Testing browser if needed, and opens a dedicated browser profile with the extension already loaded. It does not change the user's normal Chrome profile or install an unsigned extension into the user's everyday browser.

The first setup downloads Chrome for Testing and may take a few minutes. Keep the extracted installer folder until setup has completed. After installation, use the **Spine Mask Tool.app** shortcut on macOS, the copied `SpineMaskInstaller.exe` on Windows, or the desktop shortcut on Linux to reopen the dedicated browser.

## Headless Linux CI and coding agents

The native host can be used without Chrome or a GUI. Set the project path explicitly and, when the editor is installed outside the standard paths, set the licensed CLI executable too:

```bash
export SPINE_MASK_PROJECT_PATH=/workspace/sym_crown/sym_wild.spine
export SPINE_MASK_EDITOR_CLI=/opt/Spine/Spine.sh

# Read the project inventory and exact region texture list.
python3 spine-bridge/agent_cli.py inspect

# Extract only skeleton-referenced images into a local workspace.
python3 spine-bridge/agent_cli.py extract /workspace/job/input

# Apply a generated mask.json and save a new .spine project under
# the source project's SpineMaskResults/ directory.
python3 spine-bridge/agent_cli.py apply /workspace/job/mask.json
```

`agent_cli.py` supports `inspect`, `extract` and `apply`. The original project is not overwritten. `apply` validates the mask, writes a separate result, and imports it with the installed licensed Spine Editor. On Linux/Windows it does not launch a second GUI editor process.

`SPINE_MASK_RECENT_FILE` can override the per-user Spine recent-project settings file when a deployment uses a custom settings location. `SPINE_MASK_PROJECT_PATH` takes precedence and is the recommended deterministic input for CI agents.

## Security and platform notes

- Project files stay on the local machine when using the desktop Native Messaging bridge. The bridge reads only the active/explicit Spine project and the images referenced by its skeleton.
- The Native Messaging manifest authorizes only the exact unpacked extension ID.
- Browser extensions cannot be silently installed by an ordinary website. The dedicated Chrome for Testing profile is the supported one-click path; Chrome's security confirmation and OS installer prompts remain under the user's control.
- CI matrix tests validate Linux, Windows and macOS discovery contracts. The Windows installer is built in CI. A real licensed Spine Editor import still requires a runner with a valid Spine installation and license.
