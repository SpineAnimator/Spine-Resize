#!/usr/bin/env python3
"""Cross-platform installer for Spine Resize Bridge native messaging host + extension guide."""

import os
import sys
import subprocess
import json
import platform
import webbrowser

def install_native_host():
    """Install the native messaging host manifest for Chrome."""
    host_path = os.path.join(os.path.dirname(__file__), "spinebridge.py")
    
    if platform.system() == "Darwin":  # macOS
        manifest_dir = os.path.expanduser("~/Library/Application Support/Google/Chrome/NativeMessagingHosts")
    elif platform.system() == "Windows":
        manifest_dir = os.path.join(os.environ.get("LOCALAPPDATA", ""), "Google", "Chrome", "User Data", "NativeMessagingHosts")
    else:  # Linux
        manifest_dir = os.path.expanduser("~/.config/google-chrome/NativeMessagingHosts")
    
    os.makedirs(manifest_dir, exist_ok=True)
    manifest_path = os.path.join(manifest_dir, "spinebridge.json")
    
    manifest = {
        "name": "spinebridge",
        "description": "Spine Resize Bridge native messaging host",
        "path": host_path,
        "type": "stdio",
        "allowed_origins": ["chrome-extension://*"]
    }
    
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
    
    os.chmod(host_path, 0o755)
    print(f"✅ Native host manifest installed: {manifest_path}")
    print(f"✅ Host executable: {host_path}")
    return True

def open_chrome_extensions():
    """Open Chrome extensions page."""
    webbrowser.open("chrome://extensions")
    print("🌐 Opened chrome://extensions")

def main():
    print("╔══════════════════════════════════════════════════════════════╗")
    print("║     Spine Resize Bridge - Automatic Installer               ║")
    print("╚══════════════════════════════════════════════════════════════╝")
    print()
    
    # Install native host
    print("📦 Step 1: Installing native messaging host...")
    install_native_host()
    print()
    
    # Open Chrome extensions
    print("🌐 Step 2: Opening Chrome extensions page...")
    print("   Please do the following:")
    print("   1. Enable 'Developer mode' (top right toggle)")
    print("   2. Click 'Load unpacked'")
    print("   3. Select this folder:", os.path.dirname(__file__))
    print("   4. Click 'Select' / 'Select Folder'")
    print()
    
    open_chrome_extensions()
    
    # Wait for user
    print("⏳ Waiting for you to complete extension installation...")
    input("   Press ENTER after you've clicked 'Load unpacked' and selected the folder...")
    print()
    
    # Restart Chrome
    print("🔄 Step 3: Restarting Chrome...")
    if platform.system() == "Darwin":
        subprocess.run(["osascript", "-e", 'tell application "Google Chrome" to quit'])
    elif platform.system() == "Windows":
        subprocess.run(["taskkill", "/f", "/im", "chrome.exe"], capture_output=True)
    else:
        subprocess.run(["pkill", "chrome"], capture_output=True)
    
    import time
    time.sleep(2)
    
    # Open the website
    webbrowser.open("https://spineanimator.github.io/Spine-Resize/")
    
    print()
    print("✅ Installation complete!")
    print()
    print("Now:")
    print("  1. Open Spine with your project")
    print("  2. Click 'with Spine' button on the website")
    print("  3. It will automatically load your project!")
    print()
    input("Press ENTER to close...")

if __name__ == "__main__":
    main()
