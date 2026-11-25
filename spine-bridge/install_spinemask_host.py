#!/usr/bin/env python3
"""Install the least-privilege Spine Mask Native Messaging host.

The extension ID is read from Chrome Preferences (or --extension-id) and
allowed_origins contains *only* that exact ID. No wildcard extension origins,
no project search while the editor is closed, no privileged installation.
"""
import argparse
import json
import os
from pathlib import Path
import platform
import shutil
import stat
import sys

NAME = "spinemaskbridge"
EXTENSION_NAME = "Spine Resize Bridge"


def chrome_data():
    system = platform.system()
    if system == "Darwin":
        return Path.home() / "Library/Application Support/Google/Chrome"
    if system == "Windows":
        return Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData/Local")) / "Google/Chrome/User Data"
    return Path.home() / ".config/google-chrome"


def find_extension_ids(data):
    ids = set()
    if not data.exists():
        return ids
    profiles = [data]
    profiles += [p for p in data.iterdir() if p.is_dir() and (p.name == "Default" or p.name.startswith("Profile "))]
    for profile in profiles:
        for prefname in ("Preferences", "Secure Preferences"):
            file = profile / prefname
            if not file.is_file():
                continue
            try:
                settings = json.loads(file.read_text(encoding="utf-8")).get("extensions", {}).get("settings", {})
            except (OSError, ValueError):
                continue
            for key, entry in settings.items():
                manifest = entry.get("manifest") or {}
                if manifest.get("name") != EXTENSION_NAME:
                    continue
                if len(key) == 32 and all("a" <= c <= "p" for c in key):
                    ids.add(key)
    return ids


def install(ids, data=None):
    data = data or chrome_data()
    system = platform.system()
    folder = data / "NativeMessagingHosts"
    folder.mkdir(parents=True, exist_ok=True)
    source = Path(__file__).resolve().parent
    if system == "Darwin":
        runtime_dir = Path.home() / "Library/Application Support/SpineMaskBridge"
    elif system == "Windows":
        runtime_dir = Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData/Local")) / "SpineMaskBridge"
    else:
        runtime_dir = Path.home() / ".local/share/spinemaskbridge"
    runtime_dir.mkdir(mode=0o700, parents=True, exist_ok=True)
    if system == "Windows":
        original = source / "spinemaskbridge.exe"
        if not original.is_file():
            raise RuntimeError("Windows host executable is missing: use the packaged Windows ZIP")
    else:
        binary = source / "spinemaskbridge"
        script = source / "spinemaskbridge.py"
        original = binary if binary.is_file() else script
        if not original.is_file():
            raise FileNotFoundError("Native host executable or Python source is missing beside installer")
    # Install an independent copy. Moving or cleaning a downloaded ZIP must
    # not silently break the registered browser host.
    host = runtime_dir / original.name
    temporary = runtime_dir / (original.name + ".tmp")
    shutil.copy2(original, temporary)
    if system != "Windows":
        temporary.chmod(0o700)
    os.replace(temporary, host)
    payload = {
        "name": NAME,
        "description": "Spine Mask Tool - verified local editor bridge",
        "path": str(host),
        "type": "stdio",
        "allowed_origins": [
            f"chrome-extension://{identifier}/" for identifier in sorted(ids)
        ],
    }
    destination = folder / (NAME + ".json")
    tmp = destination.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    os.replace(tmp, destination)
    if system == "Windows":
        import winreg
        with winreg.CreateKey(winreg.HKEY_CURRENT_USER,
            r"Software\Google\Chrome\NativeMessagingHosts\spinemaskbridge") as key:
            winreg.SetValueEx(key, "", 0, winreg.REG_SZ, str(destination))
    print("Spine Mask Native Messaging host registered:", destination)
    print("Local host installed:", host)
    print("Authorized extension IDs:", ", ".join(sorted(ids)))
    return destination


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--extension-id", action="append", default=[])
    parser.add_argument("--browser", choices=("chrome", "chromium"), default="chrome",
                        help="Linux browser: Chrome or Chromium")
    parser.add_argument("--chrome-data", type=Path, default=None,
                        help="Chrome data directory for isolated bridge testing")
    args = parser.parse_args()
    directory = args.chrome_data or (
        Path.home() / ".config/chromium"
        if platform.system() == "Linux" and args.browser == "chromium"
        else chrome_data())
    ids = set(args.extension_id) | find_extension_ids(directory)
    ids = {x for x in ids if len(x)==32 and all("a"<=c<="p" for c in x)}
    if not ids:
        raise SystemExit("Chrome Spine Resize Bridge extension not found in local Chrome profiles. Install/activate the extension first.")
    install(ids, directory)


if __name__=="__main__":
    main()
