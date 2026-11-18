#!/usr/bin/env python3
"""No NDA data: synthetic Spine JSON and PNG, full native-host API regression."""
import base64
import hashlib
import importlib.util
import json
from pathlib import Path
import struct
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).with_name("spinemaskbridge.py")
spec = importlib.util.spec_from_file_location("spinemaskbridge", SCRIPT)
host = importlib.util.module_from_spec(spec)
spec.loader.exec_module(host)

# Tiny 1x1 RGBA PNG, not a user's image.
PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL9RAAAAABJRU5ErkJggg=="
)


def build_json():
    return {"skeleton":{"spine":"4.3.26","width":12,"height":12},
            "bones":[{"name":"root"}],
            "slots":[{"name":"original","bone":"root","attachment":"face"}],
            "skins":[{"name":"default","attachments":{
                "original":{"face":{"type":"region","path":"face","width":12,"height":12}}
            }}],
            "animations":{"idle":{}}}


def clip_json():
    j=build_json()
    j["slots"].insert(0, {"name":"auto_mask_original","bone":"root","attachment":"clip"})
    a=j["skins"][0]["attachments"]
    a["auto_mask_original"]={"clip":{"type":"clipping","end":"original",
                                     "vertexCount":4,"vertices":[-5,-5,5,-5,5,5,-5,5]}}
    return j


class NativeBridgeTests(unittest.TestCase):
    def setUp(self):
        self.dir=tempfile.TemporaryDirectory()
        self.addCleanup(self.dir.cleanup)
        self.root=Path(self.dir.name)
        self.project=self.root/"scene.json"
        self.project.write_text(json.dumps(build_json()),encoding="utf-8")
        images=self.root/"images"
        images.mkdir()
        (images/"face.png").write_bytes(PNG)
        (images/"hotspot.png").write_bytes(PNG + b"unbound-artist-effect")
        (images/"nested").mkdir()
        (images/"nested"/"future-glow.webp").write_bytes(PNG + b"another-unbound-effect")
        host.session=host.stage=None
        self.mock=patch.object(host,"spine_open_path",return_value=(self.project,"editor"))
        self.mock.start()
        self.addCleanup(self.mock.stop)

    def test_native_framing_ping(self):
        request=json.dumps({"id":7,"method":"ping","params":{}}).encode()
        proc=subprocess.run([sys.executable,str(SCRIPT)],
            input=struct.pack("<I",len(request))+request,stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,timeout=10)
        self.assertEqual(proc.returncode,0,proc.stderr.decode(errors="replace"))
        self.assertGreaterEqual(len(proc.stdout),4)
        length=struct.unpack("<I",proc.stdout[:4])[0]
        reply=json.loads(proc.stdout[4:4+length])
        self.assertEqual(reply["id"],7)
        self.assertEqual(reply["result"]["protocol"],"spinemask/1")

    def test_import_then_return_new_project_no_overwrite(self):
        original=self.project.read_bytes()
        opened=host.open_project({})
        self.assertTrue(opened["open"])
        self.assertEqual(opened["sourceType"],".json")
        self.assertTrue({"skeleton.json","images/face.png"} <= {x["key"] for x in opened["files"]})
        self.assertFalse(any("hotspot" in x["key"] for x in opened["files"]),
                         "Unbound NDA images must never be sent through Chrome")
        files={}
        for item in opened["files"]:
            offset=0;parts=[]
            while offset<item["size"]:
                p=host.read_chunk({"session":opened["session"],"key":item["key"],"offset":offset})
                chunk=base64.b64decode(p["base64"])
                self.assertEqual(offset,p["offset"])
                parts.append(chunk)
                offset+=len(chunk)
            files[item["key"]]=b"".join(parts)
        self.assertEqual(json.loads(files["skeleton.json"]),build_json())
        self.assertEqual(files["images/face.png"],PNG)
        output=json.dumps(clip_json()).encode()
        staged=host.begin_result({"session":opened["session"],"files":[
            {"name":"mask.json","size":len(output)}
        ]})
        for name,bytes_data in (("mask.json",output),):
            offset=0
            for i in range(0,len(bytes_data),1024):
                block=bytes_data[i:i+1024]
                result=host.write_chunk({"stage":staged["stage"],"name":name,
                                         "offset":offset,"base64":base64.b64encode(block).decode()})
                offset+=len(block)
                self.assertEqual(result["written"],offset)
        with patch.object(host,"editor_cli",return_value=None):
            done=host.commit_result({"session":opened["session"],"stage":staged["stage"],
                                     "openEditor":True})
        self.assertTrue(done["saved"])
        self.assertFalse(done["imported"])
        self.assertEqual(self.project.read_bytes(),original,"source was overwritten")
        folder=Path(done["location"])
        self.assertFalse((folder/"images"/"mask-overlay.png").exists())
        self.assertTrue((folder/"images"/"face.png").is_file())
        self.assertEqual((folder/"images"/"hotspot.png").read_bytes(),
                         (self.root/"images"/"hotspot.png").read_bytes())
        self.assertEqual((folder/"images"/"nested"/"future-glow.webp").read_bytes(),
                         (self.root/"images"/"nested"/"future-glow.webp").read_bytes())
        exported=json.loads((folder/"scene-mask.json").read_text())
        self.assertEqual(len(exported["slots"]),2)
        self.assertEqual(exported["slots"][1]["name"],"original")
        self.assertEqual(exported["skins"][0]["attachments"]["auto_mask_original"]["clip"]["end"],"original")
        self.assertIn("idle",exported["animations"])

    def test_reject_arbitrary_disk_read_and_corrupted_write(self):
        opened=host.open_project({})
        with self.assertRaises(ValueError):
            host.read_chunk({"session":opened["session"],"key":"/etc/passwd","offset":0})
        with self.assertRaises(ValueError):
            host.begin_result({"session":opened["session"],"files":[
                {"name":"../escape.json","size":70},{"name":"mask-overlay.png","size":70}]})
        with self.assertRaises(ValueError):
            host.read_chunk({"session":"guessed","key":"skeleton.json","offset":0})
        self.project.write_text("modified")
        with self.assertRaises(ValueError):
            host.begin_result({"session":opened["session"],"files":[
                {"name":"mask.json","size":90},{"name":"mask-overlay.png","size":70}]})

    def test_editor_open_is_verified_not_assumed(self):
        # A submitted open command alone is not proof of a loaded project.
        with patch.object(host.platform,"system",return_value="Darwin"):
            with patch.object(host,"recent_editor_project",return_value=self.project), \
                 patch.object(host.subprocess,"run") as proc:
                opened,route=host.verified_open_in_spine(self.project)
                self.assertTrue(opened)
                self.assertEqual(route,"already_open")
                proc.assert_not_called()

            def fake_run(argv,**kwargs):
                from subprocess import CompletedProcess
                if argv[0]=="pgrep":
                    return CompletedProcess(argv,0,stdout="99800\\n",stderr="")
                return CompletedProcess(argv,0,stdout="",stderr="")

            with patch.object(host,"recent_editor_project",return_value=None), \
                 patch.object(host,"wait_for_editor_open",side_effect=[False,True]) as wait, \
                 patch.object(host.subprocess,"run",side_effect=fake_run) as calls:
                opened,route=host.verified_open_in_spine(self.project)
                self.assertTrue(opened)
                self.assertEqual(route,"new_instance_verified")
                self.assertTrue(any("open"==c.args[0][0] and "-n" in c.args[0] for c in calls.call_args_list))
                self.assertEqual(wait.call_count,2)

            with patch.object(host,"recent_editor_project",return_value=None), \
                 patch.object(host,"wait_for_editor_open",side_effect=[False,False]), \
                 patch.object(host.subprocess,"run",side_effect=fake_run):
                opened,route=host.verified_open_in_spine(self.project)
                self.assertFalse(opened)
                self.assertEqual(route,"editor_loading_not_confirmed")

    def test_no_unbounded_discovery(self):
        host.session=None
        with patch.object(host,"spine_open_path",return_value=(None,"ambiguous_open_project")):
            result=host.open_project({})
        self.assertFalse(result["open"])
        self.assertEqual(result["reason"],"ambiguous_open_project")

    def test_macos_live_editor_launch_argv_without_apple_events(self):
        """Unique explicit live launch project is safe; no mtime guessing."""
        example = self.root / "Source Scene.spine"
        example.write_bytes(b"project file for launch-argument test")
        command = ("/Applications/Spine.app/Contents/MacOS/Spine "
                   "--update 4.3.26 " + str(example))
        def fake_run(args, **kwargs):
            if args[0] == "osascript":
                return subprocess.CompletedProcess(args, 1, "", "not authorized")
            if args[0] == "pgrep":
                return subprocess.CompletedProcess(args, 0, "321\\n99800\\n", "")
            if args[0] == "ps":
                text = command if args[2] == "321" else (
                    "/Applications/Spine.app/Contents/MacOS/Spine")
                return subprocess.CompletedProcess(args, 0, text + "\\n", "")
            raise AssertionError("unexpected system query")
        with patch.object(host.platform, "system", return_value="Darwin"), \\
             patch.object(host.shutil, "which", return_value=None), \\
             patch.object(host.subprocess, "run", side_effect=fake_run):
            path, method = host.spine_open_path()
        self.assertEqual(path, example.resolve())
        self.assertEqual(method, "editor_launch_argument")

    def test_macos_never_selects_batch_import_or_export(self):
        example = self.root / "Source Scene.spine"
        example.write_bytes(b"project file")
        def fake_run(args, **kwargs):
            if args[0] == "osascript":
                return subprocess.CompletedProcess(args, 1, "", "not authorized")
            if args[0] == "pgrep":
                return subprocess.CompletedProcess(args, 0, "321\\n", "")
            if args[0] == "ps":
                command = (
                    "/Applications/Spine.app/Contents/MacOS/Spine "
                    "--update 4.3.26 --input " + str(example) +
                    " --output /tmp/any --export /tmp/profile.export.json")
                return subprocess.CompletedProcess(args, 0, command + "\\n", "")
            raise AssertionError("unexpected system query")
        with patch.object(host.platform, "system", return_value="Darwin"), \\
             patch.object(host.shutil, "which", return_value=None), \\
             patch.object(host.subprocess, "run", side_effect=fake_run):
            path, method = host.spine_open_path()
        self.assertIsNone(path)
        self.assertEqual(method, "choose_project_required")


if __name__=="__main__":
    unittest.main(verbosity=2)
