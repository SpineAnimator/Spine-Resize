#!/bin/bash
# Spine Resize Bridge - One-Click Installer for macOS

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
EXTENSION_DIR="$SCRIPT_DIR"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     Spine Resize Bridge - Automatic Installer               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# 1. Install native messaging host
echo "📦 Step 1: Installing native messaging host..."
"$SCRIPT_DIR/install_native_host.sh"
echo ""

# 2. Open Chrome extensions page
echo "🌐 Step 2: Opening Chrome extensions page..."
echo "   Please do the following in the Chrome window that opens:"
echo "   1. Enable 'Developer mode' (top right toggle)"
echo "   2. Click 'Load unpacked'"
echo "   3. Select this folder: $EXTENSION_DIR"
echo "   4. Click 'Select'"
echo ""

# Open chrome://extensions
open -a "Google Chrome" "chrome://extensions"

# Wait for user
echo "⏳ Waiting for you to complete extension installation..."
echo "   Press ENTER after you've clicked 'Load unpacked' and selected the folder..."
read -r

# 3. Restart Chrome
echo ""
echo "🔄 Step 3: Restarting Chrome to activate native messaging..."
osascript -e 'tell application "Google Chrome" to quit'
sleep 2
open -a "Google Chrome" "https://spineanimator.github.io/Spine-Resize/"

echo ""
echo "✅ Installation complete!"
echo ""
echo "Now:"
echo "  1. Open Spine with your project"
echo "  2. Click 'with Spine' button on the website"
echo "  3. It will automatically load your project!"
echo ""
read -p "Press ENTER to close..."
