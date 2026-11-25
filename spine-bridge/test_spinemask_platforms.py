#!/usr/bin/env python3
"""Cross-platform editor discovery contracts for local users and headless agents."""
import importlib.util
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
