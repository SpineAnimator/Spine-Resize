#!/usr/bin/env python3
"""Install and open an isolated Chrome for Testing with the Spine Mask Bridge.

Uses a stable unpacked extension ID and registers only that exact origin.
Does not modify the user's ordinary Chrome profile or the open Spine project.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import plistlib
import shlex
import shutil
import stat
import subprocess
import sys

FILES = (
    "manifest.json", "background.js", "content.js", "mask-content.js",
    "popup.html", "popup.js", "icon_16.png", "icon_48.png", "icon_128.png"
)
URL = "https://spineanimator.github.io/Spine-Mask-Tool/"


def base_dir():
    return Path.home() / "Library/Application Support/SpineMaskBridge"


def extension_id(folder):
    digest = hashlib.sha256(str(folder.resolve()).encode("utf-8")).digest()[:16]
    return "".join(chr(ord("a") + (b >> 4)) + chr(ord("a") + (b & 15)) for b in digest)


def install_bundle():
    home = base_dir()
    source = Path(__file__).resolve().parent
    extension = home / "extension"
    extension.mkdir(mode=0o700, parents=True, exist_ok=True)
    for name in FILES:
        original = source / name
        destination = extension / name
        if original.is_file():
            if original.resolve() != destination.resolve():
                temp = destination.with_name(destination.name + ".tmp")
                shutil.copyfile(original, temp)
                temp.chmod(0o600)
                os.replace(temp, destination)
        elif not destination.is_file():
            raise FileNotFoundError("Missing required Chrome extension component: " + name)
    for name in ("spinemaskbridge.py", "install_spinemask_host.py",
                 "launch_spinemask_mac.py"):
        original = source / name
        dest = home / name
        if original.is_file() and original.resolve() != dest.resolve():
            temp = dest.with_name(dest.name + ".tmp")
            shutil.copyfile(original, temp)
            temp.chmod(0o700)
            os.replace(temp, dest)
        elif not dest.is_file():
            raise FileNotFoundError("Missing native installer component: " + name)
    data = json.loads((extension / "manifest.json").read_text(encoding="utf-8"))
    if data.get("manifest_version") != 3 or "nativeMessaging" not in data.get("permissions", []):
        raise ValueError("Unexpected or unsafe Chrome extension manifest")
    ident = extension_id(extension)
    for profile in (
        home / "browser-profile",
        Path.home() / "Library/Application Support/Google/Chrome",
        Path.home() / "Library/Application Support/Google/ChromeForTesting",
    ):
        subprocess.run(
            [sys.executable, str(home / "install_spinemask_host.py"),
             "--extension-id", ident, "--chrome-data", str(profile)],
            stdout=subprocess.DEVNULL, check=True, timeout=25
        )
    make_shortcut(home)
    return home, extension, ident


def make_shortcut(home):
    # A local app shortcut avoids unsupported silent changes to Chrome extensions.
    app = Path.home() / "Applications/Spine Mask Tool.app"
    macos = app / "Contents/MacOS"
    macos.mkdir(parents=True, exist_ok=True)
    binary = macos / "SpineMaskTool"
    launcher = home / "launch_spinemask_mac.py"
    binary.write_text(
        "#!/bin/sh\nexec " + shlex.quote(sys.executable) + " " +
        shlex.quote(str(launcher)) + " --launch \"$@\"\n",
        encoding="utf-8"
    )
    binary.chmod(0o755)
    info = {
        "CFBundleExecutable": "SpineMaskTool",
        "CFBundleIdentifier": "dev.spineanimator.spinemasktool",
        "CFBundleName": "Spine Mask Tool",
        "CFBundlePackageType": "APPL",
        "CFBundleShortVersionString": "1.2",
        "CFBundleVersion": "1.2",
        "LSMinimumSystemVersion": "12.0",
    }
    (app / "Contents/Info.plist").write_bytes(plistlib.dumps(info))


def browser_binary():
    env = os.environ.get("SPINEMASK_CHROME_BIN")
    candidates = [Path(env)] if env else []
    candidates.extend([
        Path("/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"),
        Path.home() / "Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
    ])
    candidates.extend(sorted(
        (Path.home() / ".cache/puppeteer/chrome").glob(
            "mac-*/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"),
        reverse=True,
    ))
    return next((p for p in candidates if p.is_file() and os.access(p, os.X_OK)), None)


def main():
    if sys.platform != "darwin":
        raise SystemExit("This launcher is for macOS; use the Windows host package on Windows.")
    parser = argparse.ArgumentParser()
    parser.add_argument("--launch", action="store_true", help="Launch dedicated bridge browser")
    args = parser.parse_args()
    home, extension, ident = install_bundle()
    chrome = browser_binary()
    print("SPINE_MASK_HOST_INSTALLED", home)
    print("SPINE_MASK_EXTENSION_ID", ident)
    print("SPINE_MASK_APP", Path.home() / "Applications/Spine Mask Tool.app")
    if not chrome:
        raise SystemExit("Chrome for Testing is required for automatic loading of this unpacked extension.")
    if args.launch:
        profile = home / "browser-profile"
        subprocess.Popen([
            str(chrome),
            "--user-data-dir=" + str(profile),
            "--disable-extensions-except=" + str(extension),
            "--load-extension=" + str(extension),
            "--no-first-run", "--no-default-browser-check",
            "--new-window", URL
        ], stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
           stderr=subprocess.DEVNULL, start_new_session=True)
        print("SPINE_MASK_LAUNCHED", URL)
    else:
        print("SPINE_MASK_READY: use --launch or open the app shortcut.")


if __name__ == "__main__":
    main()
