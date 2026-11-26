#!/usr/bin/env python3
"""Cross-platform editor discovery contracts for local users and headless agents."""
import importlib.util
import json
import os
import subprocess
import sys
from pathlib import Path
import tempfile
from types import SimpleNamespace
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

    def test_linux_editor_cli_reads_the_installed_spine_path_file(self):
        executable = Path(self.tmp.name) / "Spine.sh"
        executable.write_text("fake licensed editor executable", encoding="utf-8")
        path_file = Path(self.tmp.name) / "Spine.sh.path"
        path_file.write_text(str(executable), encoding="utf-8")
        with (
            patch.object(host.platform, "system", return_value="Linux"),
            patch.object(Path, "home", return_value=Path(self.tmp.name)),
            patch.dict(os.environ, {
                "SPINE_MASK_EDITOR_CLI_PATH_FILE": str(path_file)
            }, clear=True),
            patch.object(host.shutil, "which", return_value=None),
        ):
            self.assertEqual(host.editor_cli(), str(executable.resolve()))

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

    def test_recent_project_parser_accepts_yaml_list_and_unquoted_paths_with_spaces(self):
        recent = Path(self.tmp.name) / "recent-1.json"
        recent.write_text(
            "recentFiles:\n  projectFile:\n    paths:\n"
            "      - path: " + str(self.project) + "\n",
            encoding="utf-8",
        )
        with patch.object(host.platform, "system", return_value="Linux"), \
             patch.dict(os.environ, {"SPINE_MASK_RECENT_FILE": str(recent)}, clear=True):
            self.assertEqual(host.recent_editor_project(), self.project.resolve())

    def test_recent_project_parser_accepts_json_settings(self):
        recent = Path(self.tmp.name) / "recent-1.json"
        recent.write_text(json.dumps({
            "recentFiles": {"projectFile": {"paths": [{"path": str(self.project)}]}}
        }), encoding="utf-8")
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

    def test_agent_cli_exposes_inspect_extract_and_apply_without_browser(self):
        cli = Path(__file__).with_name("agent_cli.py")
        result = subprocess.run([sys.executable, str(cli), "--help"],
                                capture_output=True, text=True, timeout=10)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("inspect", result.stdout)
        self.assertIn("extract", result.stdout)
        self.assertIn("apply", result.stdout)

    def test_release_has_double_click_installers_for_each_desktop_os(self):
        root = Path(__file__).parent
        for name in ("INSTALL.command", "INSTALL.bat", "INSTALL.sh", "INSTALL.desktop",
                     "launch_spinemask_portable.py", "agent_cli.py", "README.md"):
            self.assertTrue((root / name).is_file(), name + " is missing from the release source")

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

    def test_headless_cli_uses_license_from_environment_without_logging(self):
        with patch.dict(os.environ, {"SPINE_LICENSE": "ci-license-secret"}, clear=True):
            self.assertEqual(host.spine_cli_license_input(), "ci-license-secret\n")
        with patch.dict(os.environ, {}, clear=True):
            self.assertIsNone(host.spine_cli_license_input())

    def test_recent_project_default_locations_match_each_spine_platform(self):
        cases = [
            ("Darwin", Path("Library/Application Support/Spine/settings/recent-1.json")),
            ("Windows", Path("Spine/settings/recent-1.json")),
            ("Linux", Path(".spine/settings/recent-1.json")),
        ]
        for system, relative in cases:
            with self.subTest(system=system):
                settings = Path(self.tmp.name) / relative
                settings.parent.mkdir(parents=True, exist_ok=True)
                settings.write_text(
                    'recentFiles: { projectFile: { paths: [{ path: "' +
                    json.dumps(str(self.project))[1:-1] + '" }] } }',
                    encoding="utf-8",
                )
                with patch.object(host.platform, "system", return_value=system), \
                     patch.object(Path, "home", return_value=Path(self.tmp.name)), \
                     patch.dict(os.environ, {}, clear=True):
                    self.assertEqual(host.recent_editor_project(), self.project.resolve())

    def test_explicit_path_rejects_unsupported_file_types(self):
        unsupported = Path(self.tmp.name) / "notes.txt"
        unsupported.write_text("not a Spine project", encoding="utf-8")
        with patch.object(host.platform, "system", return_value="Linux"), \
             patch.dict(os.environ, {"SPINE_MASK_PROJECT_PATH": str(unsupported)}, clear=True):
            path, found_by = host.spine_open_path()
        self.assertIsNone(path)
        self.assertEqual(found_by, "configured_project_not_found")


    def test_linux_existing_editor_opens_result_and_verifies_same_process(self):
        with (
            patch.object(host.platform, "system", return_value="Linux"),
            patch.object(host, "spine_editor_instance_pids", side_effect=[["4242"], ["4242"]]),
            patch.object(host, "recent_editor_project", return_value=None),
            patch.object(host, "wait_for_editor_open", return_value=True),
            patch.object(host.shutil, "which", return_value="/usr/bin/xdg-open"),
            patch.object(host.subprocess, "run", return_value=SimpleNamespace(returncode=0)) as run,
        ):
            opened, route = host.verified_open_in_spine(self.project)
        self.assertTrue(opened)
        self.assertEqual(route, "originating_instance")
        self.assertEqual(run.call_args.args[0], ["/usr/bin/xdg-open", str(self.project.resolve())])

    def test_windows_existing_editor_opens_result_and_verifies_same_process(self):
        with (
            patch.object(host.platform, "system", return_value="Windows"),
            patch.object(host, "spine_editor_instance_pids", side_effect=[["4242"], ["4242"]]),
            patch.object(host, "recent_editor_project", return_value=None),
            patch.object(host, "wait_for_editor_open", return_value=True),
            patch.object(host.os, "startfile", create=True) as startfile,
        ):
            opened, route = host.verified_open_in_spine(self.project)
        self.assertTrue(opened)
        self.assertEqual(route, "originating_instance")
        startfile.assert_called_once_with(str(self.project.resolve()))


if __name__ == "__main__":
    unittest.main(verbosity=2)
