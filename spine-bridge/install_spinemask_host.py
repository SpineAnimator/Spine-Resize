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


def install(ids):
    data = chrome_data()
    system = platform.system()
    if system == "Darwin":
        folder = data / "NativeMessagingHosts"
    elif system == "Windows":
        folder = data / "NativeMessagingHosts"
    else:
        folder = data / "NativeMessagingHosts"
    folder.mkdir(parents=True, exist_ok=True)
    host = (Path(__file__).resolve().parent / "spinemaskbridge.py")
    if not host.is_file():
        raise FileNotFoundError("Native host missing beside installer")
    if system != "Windows":
        host.chmod(host.stat().st_mode | stat.S_IXUSR)
        executable = host
    else:
        # Chrome Native Messaging on Windows requires an executable. A .py
        # script cannot be used directly as the manifest host path.
        # An explicit .cmd bootstrap is supported by Chrome on most systems,
        # but Chrome's native pipe protocol is safest with a .exe wrapper.
        executable = host.with_suffix(".exe")
        if not executable.is_file():
            raise RuntimeError("Windows requires packaged spinemaskbridge.exe native host")
    payload = {
        "name": NAME,
        "description": "Spine Mask Tool - verified open-project bridge",
        "path": str(executable),
        "type": "stdio",
        "allowed_origins": [f"chrome-extension://{identifier}/" for identifier in sorted(ids)]
    }
    file = folder / (NAME + ".json")
    tmp = file.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(payload,indent=2)+"\n",encoding="utf-8")
    os.replace(tmp,file)
    if system == "Windows":
        import winreg
        with winreg.CreateKey(winreg.HKEY_CURRENT_USER,
            r"Software\Google\Chrome\NativeMessagingHosts\spinemaskbridge") as key:
            winreg.SetValueEx(key, "", 0, winreg.REG_SZ, str(file))
    print("Native host registered:",file)
    print("Authorized Chrome extension IDs:",", ".join(sorted(ids)))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--extension-id",action="append",default=[])
    args = parser.parse_args()
    ids = set(args.extension_id) | find_extension_ids(chrome_data())
    ids = {x for x in ids if len(x)==32 and all("a"<=c<="p" for c in x)}
    if not ids:
        raise SystemExit("Chrome Spine Resize Bridge extension not found in local Chrome profiles. Install/activate the extension first.")
    install(ids)


if __name__=="__main__":
    main()
