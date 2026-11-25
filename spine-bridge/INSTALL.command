#!/bin/bash
# Double-click this file in Finder. No Terminal commands are required.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"
if ! command -v python3 >/dev/null 2>&1; then
  osascript -e 'display alert "Python 3 is required" message "Install Python 3 from python.org, then double-click INSTALL.command again."'
  exit 1
fi
python3 "$HERE/launch_spinemask_portable.py"
