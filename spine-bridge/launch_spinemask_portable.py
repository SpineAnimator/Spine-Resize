#!/usr/bin/env python3
"""One-click, per-user Spine Mask Bridge installer and dedicated browser launcher.

The website cannot silently install browser extensions. This installer instead
sets up an isolated Chrome for Testing profile with the signed-off MV3 bridge
preloaded, and registers a least-privilege Native Messaging host for that exact
extension ID. It never edits the user's normal browser profile.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import platform
import shutil
import shlex
import subprocess
import sys
import tempfile
import urllib.request
import zipfile

import install_spinemask_host

URL = "https://spineanimator.github.io/Spine-Mask-Tool/"
METADATA_URL = "https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json"
EXTENSION_FILES = (
    "manifest.json", "background.js", "content.js", "mask-content.js",
    "popup.html", "popup.js", "icon_16.png", "icon_48.png", "icon_128.png"
)


def chrome_platform_key(system=None, machine=None):
    system = system or platform.system()
    machine = (machine or platform.machine()).lower()
    if system == "Darwin":
        return "mac-arm64" if machine in ("arm64", "aarch64") else "mac-x64"
    if system == "Windows":
        return "win64" if machine in ("amd64", "x86_64", "arm64") else "win32"
    if system == "Linux":
        return "linux64"
    raise RuntimeError("Spine Mask Bridge installer does not support " + system)


def extension_id(folder):
    digest = hashlib.sha256(str(Path(folder).resolve()).encode("utf-8")).digest()[:16]
    return "".join(chr(ord("a") + (byte >> 4)) + chr(ord("a") + (byte & 15)) for byte in digest)


def support_dir():
    system = platform.system()
    if system == "Darwin":
        return Path.home() / "Library/Application Support/SpineMaskBridge"
    if system == "Windows":
        return Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData/Local")) / "SpineMaskBridge"
    return Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local/share")) / "spinemaskbridge"


def resource_dir():
    return Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))


def notify(title, message, error=False):
    if platform.system() == "Windows":
        try:
            import tkinter
            from tkinter import messagebox
            root = tkinter.Tk()
            root.withdraw()
            (messagebox.showerror if error else messagebox.showinfo)(title, message)
            root.destroy()
            return
        except Exception:
            pass
    stream = sys.stderr if error else sys.stdout
    if stream:
        print(title + ": " + message, file=stream)


def copy_file(source, destination, executable=False):
    destination.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    temporary = destination.with_name(destination.name + ".tmp")
    shutil.copy2(source, temporary)
    if executable and platform.system() != "Windows":
        temporary.chmod(0o700)
    os.replace(temporary, destination)


def install_bundle():
    home = support_dir()
    home.mkdir(mode=0o700, parents=True, exist_ok=True)
    resources = resource_dir()
    asset_root = resources / "assets" if (resources / "assets" / "manifest.json").is_file() else resources
    extension = home / "extension"
    extension.mkdir(mode=0o700, parents=True, exist_ok=True)

    for name in EXTENSION_FILES:
        original = asset_root / name
        installed = extension / name
        if original.is_file():
            if original.resolve() != installed.resolve():
                copy_file(original, installed)
        elif not installed.is_file():
            raise FileNotFoundError("Installer package is missing " + name)

    system = platform.system()
    if system == "Windows":
        host_name = "spinemaskbridge.exe"
    else:
        host_name = "spinemaskbridge" if (resources / "spinemaskbridge").is_file() else "spinemaskbridge.py"
    host_source = resources / host_name
    if not host_source.is_file():
        host_source = home / host_name
    if not host_source.is_file():
        raise FileNotFoundError("Installer package is missing " + host_name)
    copy_file(host_source, home / host_name, executable=True)

    if system != "Windows":
        for name in ("install_spinemask_host.py", "launch_spinemask_portable.py"):
            source = resources / name
            if source.is_file() and source.resolve() != (home / name).resolve():
                copy_file(source, home / name, executable=name == "launch_spinemask_portable.py")
    if getattr(sys, "frozen", False) and Path(sys.executable).is_file():
        if system == "Windows":
            copy_file(Path(sys.executable), home / "SpineMaskInstaller.exe")
        elif system == "Linux":
            copy_file(Path(sys.executable), home / "SpineMaskInstaller", executable=True)

    manifest = json.loads((extension / "manifest.json").read_text(encoding="utf-8"))
    if manifest.get("manifest_version") != 3 or "nativeMessaging" not in manifest.get("permissions", []):
        raise RuntimeError("Unexpected Chrome extension manifest; installation stopped.")
    identifier = extension_id(extension)
    profile = home / "browser-profile"
    profile.mkdir(mode=0o700, parents=True, exist_ok=True)

    if system == "Windows":
        install_spinemask_host.install({identifier}, profile)
    else:
        # Chrome Native Messaging uses the OS-standard host registry location.
        # Also register against the dedicated user-data directory for CFT builds
        # that resolve native host manifests relative to their isolated profile.
        install_spinemask_host.install({identifier}, install_spinemask_host.chrome_data())
        install_spinemask_host.install({identifier}, profile)

    return home, extension, profile, identifier


def browser_path(home, key):
    root = home / "chrome-for-testing"
    if key.startswith("mac-"):
        return root / ("chrome-" + key) / "Google Chrome for Testing.app" / "Contents/MacOS/Google Chrome for Testing"
    if key.startswith("win"):
        return root / ("chrome-" + key) / "chrome.exe"
    return root / "chrome-linux64" / "chrome"


def safe_extract(archive, destination):
    root = destination.resolve()
    with zipfile.ZipFile(archive) as package:
        for item in package.infolist():
            target = (root / item.filename).resolve()
            if not target.is_relative_to(root):
                raise RuntimeError("Chrome archive contains an unsafe path.")
        package.extractall(root)


def ensure_browser(home):
    key = chrome_platform_key()
    binary = browser_path(home, key)
    if binary.is_file():
        if platform.system() != "Windows":
            binary.chmod(binary.stat().st_mode | 0o100)
        return binary

    notify("Spine Mask Tool", "Downloading the isolated Chrome for Testing browser. This is a one-time setup.")
    with urllib.request.urlopen(METADATA_URL, timeout=25) as response:
        metadata = json.loads(response.read().decode("utf-8"))
    stable = metadata.get("channels", {}).get("Stable", {})
    downloads = stable.get("downloads", {}).get("chrome", [])
    entry = next((item for item in downloads if item.get("platform") == key), None)
    if not entry:
        raise RuntimeError("Google Chrome for Testing has no stable build for " + key)
    url = entry.get("url", "")
    if not url.startswith("https://storage.googleapis.com/chrome-for-testing-public/"):
        raise RuntimeError("Unexpected Chrome for Testing download origin.")

    root = home / "chrome-for-testing"
    root.mkdir(mode=0o700, parents=True, exist_ok=True)
    archive = home / "chrome-for-testing.zip"
    temporary = archive.with_suffix(".zip.part")
    request = urllib.request.Request(url, headers={"User-Agent": "SpineMaskBridgeInstaller/1.0"})
    with urllib.request.urlopen(request, timeout=60) as response, temporary.open("wb") as output:
        shutil.copyfileobj(response, output)
    if temporary.stat().st_size < 20 * 1024 * 1024 or temporary.stat().st_size > 700 * 1024 * 1024:
        temporary.unlink(missing_ok=True)
        raise RuntimeError("Chrome for Testing archive size is outside the expected range.")
    os.replace(temporary, archive)
    safe_extract(archive, root)
    archive.unlink(missing_ok=True)
    if not binary.is_file():
        raise RuntimeError("Chrome for Testing download did not contain its browser executable.")
    if platform.system() != "Windows":
        binary.chmod(binary.stat().st_mode | 0o100)
    return binary


def create_shortcut(home):
    system = platform.system()
    if system == "Darwin":
        app = Path.home() / "Applications/Spine Mask Tool.app"
        if getattr(sys, "frozen", False):
            source_app = Path(sys.executable).resolve().parents[2]
            if source_app.suffix == ".app" and source_app.is_dir():
                if app.exists():
                    shutil.rmtree(app)
                app.parent.mkdir(parents=True, exist_ok=True)
                shutil.copytree(source_app, app)
                return app
        executable = app / "Contents/MacOS/SpineMaskTool"
        executable.parent.mkdir(parents=True, exist_ok=True)
        script = home / "launch_spinemask_portable.py"
        executable.write_text(
            "#!/bin/sh\nexec " + shlex.quote(sys.executable) + " " + shlex.quote(str(script)) + " --launch\n",
            encoding="utf-8"
        )
        executable.chmod(0o755)
        import plistlib
        info = {
            "CFBundleExecutable": "SpineMaskTool",
            "CFBundleIdentifier": "dev.spineanimator.spinemasktool",
            "CFBundleName": "Spine Mask Tool",
            "CFBundlePackageType": "APPL",
            "CFBundleShortVersionString": "1.0",
            "CFBundleVersion": "1.0",
            "LSMinimumSystemVersion": "12.0",
        }
        (app / "Contents/Info.plist").write_bytes(plistlib.dumps(info))
        return app
    if system == "Linux":
        desktop = Path.home() / "Desktop/Spine Mask Tool.desktop"
        desktop.parent.mkdir(parents=True, exist_ok=True)
        if getattr(sys, "frozen", False):
            target = home / "SpineMaskInstaller"
            command = "Exec=\"" + str(target) + "\"\\nTerminal=false\\n"
        else:
            script = home / "launch_spinemask_portable.py"
            command = "Exec=python3 \"" + str(script) + "\" --launch\\nTerminal=true\\n"
        desktop.write_text(
            "[Desktop Entry]\\nType=Application\\nName=Spine Mask Tool\\n" + command,
            encoding="utf-8"
        )
        desktop.chmod(0o700)
        return desktop
    if system == "Windows":
        desktop = Path.home() / "Desktop/Spine Mask Tool.lnk"
        desktop.parent.mkdir(parents=True, exist_ok=True)
        target = home / "SpineMaskInstaller.exe"
        quote = lambda value: "'" + str(value).replace("'", "''") + "'"
        command = (
            "$shell = New-Object -ComObject WScript.Shell; "
            "$shortcut = $shell.CreateShortcut(" + quote(desktop) + "); "
            "$shortcut.TargetPath = " + quote(target) + "; "
            "$shortcut.WorkingDirectory = " + quote(home) + "; "
            "$shortcut.Save()"
        )
        try:
            subprocess.run(["powershell", "-NoProfile", "-Command", command],
                           check=True, capture_output=True, timeout=10)
        except (OSError, subprocess.SubprocessError):
            return target
        return desktop if desktop.is_file() else target
    return home / "SpineMaskInstaller.exe"


def launch_browser(binary, profile, extension):
    args = [
        str(binary),
        "--user-data-dir=" + str(profile),
        "--disable-extensions-except=" + str(extension),
        "--load-extension=" + str(extension),
        "--no-first-run",
        "--no-default-browser-check",
        "--new-window",
        URL,
    ]
    options = {
        "stdin": subprocess.DEVNULL,
        "stdout": subprocess.DEVNULL,
        "stderr": subprocess.DEVNULL,
    }
    if platform.system() != "Windows":
        options["start_new_session"] = True
    subprocess.Popen(args, **options)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--launch", action="store_true", help="Launch the dedicated browser after installation")
    args = parser.parse_args()
    try:
        home, extension, profile, identifier = install_bundle()
        binary = ensure_browser(home)
        shortcut = create_shortcut(home)
        launch_browser(binary, profile, extension)
        notify("Spine Mask Tool", "Bridge installed and ready.\nExtension ID: " + identifier +
               "\nShortcut: " + str(shortcut) + "\nThe dedicated browser is opening.")
    except Exception as error:
        notify("Spine Mask Tool installation failed", str(error), error=True)
        raise


if __name__ == "__main__":
    main()
