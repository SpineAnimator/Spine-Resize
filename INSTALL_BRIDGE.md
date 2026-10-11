# Spine Resize Bridge Installation Guide

## The Problem
The "with Spine" button requires a native messaging host (`spinebridge.py`) to be installed and registered with Chrome. This allows the extension to communicate with the Spine editor to automatically find and load your project.

## Quick Install (macOS)

### Option 1: Automated Script
```bash
cd /Volumes/Work/SpineSkeletonResize/sr/SpineResize/Spine-Resize/spine-bridge
./install_native_host.sh
```

### Option 2: Manual Install
1. Create the native messaging host directory:
   ```bash
   mkdir -p ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts
   ```

2. Copy the manifest (update the path to your actual spinebridge.py location):
   ```json
   {
     "name": "spinebridge",
     "description": "Spine Resize Bridge native messaging host",
     "path": "/Volumes/Work/SpineSkeletonResize/sr/SpineResize/Spine-Resize/spine-bridge/spinebridge.py",
     "type": "stdio",
     "allowed_origins": ["chrome-extension://*"]
   }
   ```
   Save as: `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/spinebridge.json`

3. Make the Python script executable:
   ```bash
   chmod +x /Volumes/Work/SpineSkeletonResize/sr/SpineResize/Spine-Resize/spine-bridge/spinebridge.py
   ```

## Quick Install (Windows)

Run as Administrator:
```cmd
cd spine-bridge
install_native_host.bat
```

Or manually:
1. Create manifest at: `%LOCALAPPDATA%\Google\Chrome\User Data\NativeMessagingHosts\spinebridge.json`
2. Point `path` to your `spinebridge.py`

## Install Chrome Extension

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `spine-bridge` folder (or drag the `spine-resize-bridge.zip` to the page)
5. The "Spine Resize Bridge" extension should appear

## Verify Installation

1. **Restart Chrome completely** (quit and reopen)
2. Open the Spine Skeleton Resize website
3. Open Spine editor with your project
4. Click "with Spine" button
5. It should automatically load your project

## How It Works (Automatic)

Once installed, the bridge:
1. **Detects running Spine** via AppleScript (macOS) or process check
2. **Gets the front document path** from Spine directly
3. **Falls back** to scanning Documents/Desktop/Downloads for recent `.spine`, `.skel`, `.json` files
4. **Loads the project + all sibling images** automatically
5. **Shows the bone tree** immediately for selection
6. **Saves resized files back** to the original location via the bridge

## Troubleshooting

**"Specified native messaging host not found"**
- The manifest isn't in the right location
- Restart Chrome after installing manifest

**"native host not available"**
- Check Python is installed: `python3 --version`
- Check script is executable: `chmod +x spinebridge.py`
- Check manifest `path` is absolute and correct

**"Spine bridge not found"**
- Extension not installed or not loaded
- Check `chrome://extensions` - "Spine Resize Bridge" should be enabled

**No project found**
- Make sure Spine is running with a project open
- Or have a recent `.spine`/`.json` file in Documents/Desktop/Downloads
