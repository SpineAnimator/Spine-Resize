#!/usr/bin/env bash
# Double-click from the file manager or run this installer from Downloads.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"
if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is required. Install it once, then double-click INSTALL.sh again." >&2
  exit 1
fi
python3 "$HERE/launch_spinemask_portable.py"
