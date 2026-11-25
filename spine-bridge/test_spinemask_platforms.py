#!/usr/bin/env python3
"""Cross-platform editor discovery contracts for local users and headless agents."""
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).with_name("spinemaskbridge.py")
spec = importlib.util.spec_from_file_location("spinemaskbridge_platforms", SCRIPT)
host = importlib.util.module_from_spec(spec)
spec.loader.exec_module(host)


class EditorDiscoveryTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.project = Path(self.tmp.name) / "sym_wild.spine"
        self.project.write_bytes(b"test spine project")

    def test_explicit_project_path_supports_headless_linux_ci(self):
        with patch.object(host.platform, "system", return_value="Linux"), \
             patch.dict(os.environ, {"SPINE_MASK_PROJECT_PATH": str(self.project)}, clear=True):
            path, found_by = host.spine_open_path()
        self.assertEqual(path, self.project.resolve())
        self.assertEqual(found_by, "environment")

    def test_explicit_project_path_supports_windows_agents(self):
        with patch.object(host.platform, "system", return_value="Windows"), \
             patch.dict(os.environ, {"SPINE_MASK_PROJECT_PATH": str(self.project)}, clear=True):
            path, found_by = host.spine_open_path()
        self.assertEqual(path, self.project.resolve())
        self.assertEqual(found_by, "environment")

    def test_invalid_explicit_project_path_fails_closed(self):
        missing = Path(self.tmp.name) / "missing.spine"
        with patch.object(host.platform, "system", return_value="Linux"), \
             patch.dict(os.environ, {"SPINE_MASK_PROJECT_PATH": str(missing)}, clear=True):
            path, found_by = host.spine_open_path()
        self.assertIsNone(path)
        self.assertEqual(found_by, "configured_project_not_found")

    def test_linux_editor_command_line_project_is_resolved(self):
        args = ["/opt/Spine/Spine.sh", str(self.project)]
        self.assertEqual(host.project_from_editor_args(args), self.project.resolve())

    def test_windows_quoted_editor_command_line_project_is_resolved(self):
        command = '"C:\\Program Files\\Spine\\Spine.exe" "' + str(self.project) + '"'
        args = host.windows_command_line_args(command)
        self.assertEqual(host.project_from_editor_args(args), self.project.resolve())

    def test_recent_project_file_can_be_configured_for_ci_and_desktop(self):
        recent = Path(self.tmp.name) / "recent-1.json"
        recent.write_text(
            'recentFiles: { projectFile: { paths: [{ path: "' +
            json.dumps(str(self.project))[1:-1] + '" }] } }',
            encoding="utf-8",
        )
        with patch.object(host.platform, "system", return_value="Linux"), \
             patch.dict(os.environ, {"SPINE_MASK_RECENT_FILE": str(recent)}, clear=True):
            self.assertEqual(host.recent_editor_project(), self.project.resolve())

    def test_portable_launcher_maps_all_desktop_platforms(self):
        launcher_path = Path(__file__).with_name("launch_spinemask_portable.py")
        spec = importlib.util.spec_from_file_location("spinemask_portable", launcher_path)
        launcher = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(launcher)
        self.assertEqual(launcher.chrome_platform_key("Darwin", "arm64"), "mac-arm64")
        self.assertEqual(launcher.chrome_platform_key("Darwin", "x86_64"), "mac-x64")
        self.assertEqual(launcher.chrome_platform_key("Windows", "AMD64"), "win64")
        self.assertEqual(launcher.chrome_platform_key("Linux", "x86_64"), "linux64")

    def test_portable_extension_id_is_stable_and_chrome_compatible(self):
        launcher_path = Path(__file__).with_name("launch_spinemask_portable.py")
        spec = importlib.util.spec_from_file_location("spinemask_portable_id", launcher_path)
        launcher = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(launcher)
        folder = Path(self.tmp.name) / "extension"
        first = launcher.extension_id(folder)
        self.assertEqual(first, launcher.extension_id(folder))
        self.assertEqual(len(first), 32)
        self.assertTrue(all("a" <= char <= "p" for char in first))

    def test_explicit_path_rejects_unsupported_file_types(self):
        unsupported = Path(self.tmp.name) / "notes.txt"
        unsupported.write_text("not a Spine project", encoding="utf-8")
        with patch.object(host.platform, "system", return_value="Linux"), \
             patch.dict(os.environ, {"SPINE_MASK_PROJECT_PATH": str(unsupported)}, clear=True):
            path, found_by = host.spine_open_path()
        self.assertIsNone(path)
        self.assertEqual(found_by, "configured_project_not_found")


if __name__ == "__main__":
    unittest.main(verbosity=2)
