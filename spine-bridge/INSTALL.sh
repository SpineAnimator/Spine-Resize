#!/usr/bin/env bash
# Fallback for Linux file managers that can run shell launchers.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
exec "$HERE/linux/SpineMaskInstaller"
