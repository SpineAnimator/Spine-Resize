#!/bin/bash
# Double-click in Finder; the bundled .app performs the complete setup.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
open "$HERE/macos/SpineMaskInstaller.app"
