#!/bin/bash
# Install Spine Resize Bridge native messaging host for Chrome

set -e

MANIFEST_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
MANIFEST_FILE="$MANIFEST_DIR/spinebridge.json"
HOST_PATH="/Volumes/Work/SpineSkeletonResize/sr/SpineResize/Spine-Resize/spine-bridge/spinebridge.py"

echo "Installing Spine Resize Bridge native messaging host..."

# Create directory if it doesn't exist
mkdir -p "$MANIFEST_DIR"

# Update the path in the manifest
cat > "$MANIFEST_FILE" << MANIFEST_EOF
{
  "name": "spinebridge",
  "description": "Spine Resize Bridge native messaging host",
  "path": "$HOST_PATH",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://*"
  ]
}
MANIFEST_EOF

# Make the Python script executable
chmod +x "$HOST_PATH"

echo "✅ Native messaging host installed at: $MANIFEST_FILE"
echo "✅ Host executable: $HOST_PATH"
echo ""
echo "Now you need to:"
echo "1. Install the Chrome extension from spine-resize-bridge.zip"
echo "2. Go to chrome://extensions → Developer mode → Load unpacked"
echo "3. Select the spine-bridge folder"
echo "4. Restart Chrome"
echo "5. Make sure Spine is running with a project open"
