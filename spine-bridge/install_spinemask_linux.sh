#!/usr/bin/env bash
# Install the isolated Spine Mask host for Chrome or Chromium on Linux.
# The unpacked extension must already be loaded; its ID is discovered from
# browser profiles or supplied explicitly (a 32-character Chrome ID).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BROWSER="${1:-chrome}"
if [[ "$BROWSER" != chrome && "$BROWSER" != chromium ]]; then
  echo "Usage: $0 [chrome|chromium] [extension-id]" >&2; exit 2
fi
ARGS=(--browser "$BROWSER")
if [[ -n "${2:-}" ]]; then ARGS+=(--extension-id "$2"); fi
python3 "$HERE/install_spinemask_host.py" "${ARGS[@]}"
echo "Spine Mask Linux host installed for $BROWSER. Reopen the Spine Mask Tool tab."
