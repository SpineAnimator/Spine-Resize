#!/usr/bin/env python3
"""No NDA data: synthetic Spine JSON and PNG, full native-host API regression."""
import base64
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import struct
import subprocess
import sys
import tempfile
import time
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
    return {"skeleton":{"spine":"4.3.26","width":12,"height":12,
                        "images":"/original/machine/sym_crown/images/"},
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


def multi_clip_json():
    return {
        "skeleton":{"spine":"4.3.26","width":124,"height":64,"images":"./images/"},
        "bones":[{"name":"root"},{"name":"left","parent":"root","x":-30},
                 {"name":"right","parent":"root","x":30}],
        "slots":[
            {"name":"auto_mask_multi","bone":"root","attachment":"clip"},
            {"name":"image_a","bone":"left","attachment":"partA"},
            {"name":"image_b","bone":"right","attachment":"partB"},
            {"name":"hotspot","bone":"root","attachment":"hotspot"}
        ],
        "skins":[{"name":"default","attachments":{
            "auto_mask_multi":{"clip":{"type":"clipping","end":"image_b","vertexCount":4,
                "vertices":[1,1,-24,-24,1, 1,1,24,-24,1, 1,2,24,24,1, 1,2,-24,24,1]}},
            "image_a":{"partA":{"type":"region","path":"part-a","width":48,"height":48}},
            "image_b":{"partB":{"type":"region","path":"part-b","width":48,"height":48}},
            "hotspot":{"hotspot":{"type":"region","path":"hotspot","width":8,"height":8}}
        }}],
        "animations":{"idle":{"bones":{
            "left":{"rotate":[{"time":0,"angle":0},{"time":1,"angle":25}]},
            "right":{"rotate":[{"time":0,"angle":0},{"time":1,"angle":-25}]}
        }}}
    }


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
        (images/"part-a.png").write_bytes(PNG)
        (images/"part-b.png").write_bytes(PNG)
        (images/"hotspot.png").write_bytes(PNG + b"unbound-artist-effect")
        (images/"nested").mkdir()
        (images/"nested"/"future-glow.webp").write_bytes(PNG + b"another-unbound-effect")
        host.session=host.stage=None
        self.mock=patch.object(host,"spine_open_path",return_value=(self.project,"editor"))
        self.mock.start()
        self.addCleanup(self.mock.stop)

    def test_linux_project_picker_and_headless_guard(self):
        with patch.object(host.platform,"system",return_value="Linux"), \
             patch.dict(host.os.environ,{"DISPLAY":":99"},clear=True), \
             patch.object(host.shutil,"which",side_effect=lambda exe: "/usr/bin/zenity" if exe=="zenity" else None), \
             patch.object(host.subprocess,"run") as proc:
            proc.return_value=subprocess.CompletedProcess([],0,str(self.project),"")
            chosen=host.pick_native_project()
            self.assertEqual(chosen,self.project.resolve())
            self.assertEqual(proc.call_args.args[0][0],"zenity")
        with patch.object(host.platform,"system",return_value="Linux"), \
             patch.dict(host.os.environ,{},clear=True):
            with self.assertRaisesRegex(ValueError,"LINUX_PICKER_REQUIRES_DESKTOP"):
                host.pick_native_project()

    def test_linux_extension_host_registration(self):
        script=Path(__file__).with_name("install_spinemask_host.py")
        spec=importlib.util.spec_from_file_location("install_spinemask_host",script)
        installer=importlib.util.module_from_spec(spec)
        spec.loader.exec_module(installer)
        extension_id="abcdefghijklmnopabcdefghijklmnop"
        profile=self.root/".config"/"google-chrome"
        with patch.object(installer.platform,"system",return_value="Linux"), \
             patch.object(installer.Path,"home",return_value=self.root):
            manifest=installer.install({extension_id},profile)
        body=json.loads(manifest.read_text(encoding="utf-8"))
        self.assertEqual(body["name"],"spinemaskbridge")
        self.assertEqual(body["type"],"stdio")
        self.assertEqual(body["allowed_origins"],["chrome-extension://"+extension_id+"/"])
        self.assertTrue(Path(body["path"]).is_file())

    def test_linux_chromium_installer_discovers_extension_and_installed_host_pings(self):
        script=Path(__file__).with_name("install_spinemask_host.py")
        extension_id="abcdefghijklmnopabcdefghijklmnop"
        unrelated_id="ponmlkjihgfedcbaponmlkjihgfedcba"
        home=self.root/"chromium-home"
        profile=home/".config"/"chromium"/"Default"
        profile.mkdir(parents=True)
        preferences={"extensions":{"settings":{
            extension_id:{"manifest":{"name":"Spine Resize Bridge"}},
            unrelated_id:{"manifest":{"name":"Unrelated extension"}}
        }}}
        (profile/"Preferences").write_text(json.dumps(preferences),encoding="utf-8")
        env=os.environ.copy()
        env["HOME"]=str(home)
        installed=subprocess.run(
            [sys.executable,str(script),"--browser","chromium"],
            env=env,capture_output=True,text=True,timeout=10)
        self.assertEqual(installed.returncode,0,installed.stderr)
        manifest=home/".config"/"chromium"/"NativeMessagingHosts"/"spinemaskbridge.json"
        self.assertTrue(manifest.is_file())
        body=json.loads(manifest.read_text(encoding="utf-8"))
        self.assertEqual(body["name"],"spinemaskbridge")
        self.assertEqual(body["allowed_origins"],["chrome-extension://"+extension_id+"/"])
        host_path=Path(body["path"])
        self.assertTrue(host_path.is_file())
        self.assertTrue(host_path.stat().st_mode & 0o111,"installed native host must be executable")
        request=json.dumps({"id":19,"method":"ping","params":{}}).encode()
        proc=subprocess.run(
            [str(host_path)],input=struct.pack("<I",len(request))+request,
            stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=10)
        self.assertEqual(proc.returncode,0,proc.stderr.decode(errors="replace"))
        self.assertGreaterEqual(len(proc.stdout),4)
        length=struct.unpack("<I",proc.stdout[:4])[0]
        reply=json.loads(proc.stdout[4:4+length])
        self.assertEqual(reply["id"],19)
        self.assertEqual(reply["result"]["protocol"],"spinemask/1")
        self.assertIn("multi-slot-clipping",reply["result"]["capabilities"])
        self.assertIn("weighted-clipping",reply["result"]["capabilities"])

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
        self.assertEqual(exported["skeleton"]["images"], "./images/",
                         "native output must not retain the source machine's absolute texture path")
        self.assertEqual(len(exported["slots"]),2)
        self.assertEqual(exported["slots"][1]["name"],"original")
        self.assertEqual(exported["skins"][0]["attachments"]["auto_mask_original"]["clip"]["end"],"original")
        self.assertIn("idle",exported["animations"])

    def test_ping_capabilities_are_platform_aware(self):
        with patch.object(host.platform,"system",return_value="Darwin"):
            mac=host.HANDLERS["ping"]({})
        self.assertEqual(mac["platform"],"Darwin")
        self.assertIn("multi-slot-clipping",mac["capabilities"])
        self.assertIn("weighted-clipping",mac["capabilities"])
        self.assertIn("verified-editor-open",mac["capabilities"])
        self.assertIn("originating-editor-open",mac["capabilities"])
        with patch.object(host.platform,"system",return_value="Linux"):
            linux=host.HANDLERS["ping"]({})
        self.assertEqual(linux["platform"],"Linux")
        self.assertIn("multi-slot-clipping",linux["capabilities"])
        self.assertIn("weighted-clipping",linux["capabilities"])
        self.assertNotIn("verified-editor-open",linux["capabilities"])
        self.assertNotIn("originating-editor-open",linux["capabilities"])
        with patch.object(host.platform,"system",return_value="Windows"):
            windows=host.HANDLERS["ping"]({})
        self.assertEqual(windows["platform"],"Windows")
        self.assertNotIn("originating-editor-open",windows["capabilities"])

    def test_weighted_clipping_vertex_validation(self):
        project=multi_clip_json()
        clip=project["skins"][0]["attachments"]["auto_mask_multi"]["clip"]
        info=host.validate_clipping_vertices(project,clip)
        self.assertTrue(info["weighted"])
        self.assertEqual(info["boneIndices"],[1,2])
        invalid=json.loads(json.dumps(project))
        invalid["skins"][0]["attachments"]["auto_mask_multi"]["clip"]["vertices"][1]=9
        with self.assertRaisesRegex(ValueError,"WEIGHTED_CLIPPING_BONE_INDEX_INVALID"):
            host.validate_clipping_vertices(invalid,invalid["skins"][0]["attachments"]["auto_mask_multi"]["clip"])
        invalid=json.loads(json.dumps(project))
        invalid["skins"][0]["attachments"]["auto_mask_multi"]["clip"]["vertices"][4]=0.5
        with self.assertRaisesRegex(ValueError,"WEIGHTED_CLIPPING_WEIGHTS_NOT_NORMALIZED"):
            host.validate_clipping_vertices(invalid,invalid["skins"][0]["attachments"]["auto_mask_multi"]["clip"])

    def test_weighted_clipping_bones_must_descend_from_mask_slot_bone(self):
        project=multi_clip_json()
        clip=project["skins"][0]["attachments"]["auto_mask_multi"]["clip"]
        info=host.validate_clipping_vertices(project,clip)
        host.validate_weighted_clip_bone_ancestry(project,project["slots"][0],info)
        invalid=json.loads(json.dumps(project))
        invalid["bones"][1]["parent"]="missing_parent"
        invalid_info=host.validate_clipping_vertices(invalid,clip)
        with self.assertRaisesRegex(ValueError,"WEIGHTED_CLIPPING_BONE_OUTSIDE_CLIP_HIERARCHY"):
            host.validate_weighted_clip_bone_ancestry(invalid,invalid["slots"][0],invalid_info)

    def test_multi_slot_weighted_mask_commit_opens_originating_editor(self):
        original=self.project.read_bytes()
        opened=host.open_project({})
        output=json.dumps(multi_clip_json()).encode("utf-8")
        staged=host.begin_result({"session":opened["session"],"files":[
            {"name":"mask.json","size":len(output)}
        ]})
        host.write_chunk({"stage":staged["stage"],"name":"mask.json","offset":0,
                          "base64":base64.b64encode(output).decode("ascii")})
        def fake_run(command,**kwargs):
            if "--import" in command:
                native=Path(command[command.index("--output")+1])
                native.write_bytes(b"FAKE_SPINE_NATIVE_BINARY"*10)
                return subprocess.CompletedProcess(command,0,"","")
            raise AssertionError("unexpected subprocess call")
        with patch.object(host,"editor_cli",return_value="/fake/Spine"), \
             patch.object(host.subprocess,"run",side_effect=fake_run), \
             patch.object(host,"verified_open_in_spine",return_value=(True,"existing_instance")) as verify:
            done=host.commit_result({"session":opened["session"],"stage":staged["stage"],"openEditor":True})
        self.assertTrue(done["saved"])
        self.assertTrue(done["imported"])
        self.assertTrue(done["opened"])
        self.assertEqual(done["openVerification"],"existing_instance")
        self.assertEqual(done["project"],"scene-mask.spine")
        verify.assert_called_once()
        self.assertEqual(Path(verify.call_args.args[0]).name,"scene-mask.spine")
        self.assertEqual(self.project.read_bytes(),original,"the original Spine source must not be overwritten")
        folder=Path(done["location"])
        self.assertTrue((folder/"scene-mask.spine").is_file())
        self.assertTrue((folder/"images"/"part-a.png").is_file())
        self.assertTrue((folder/"images"/"part-b.png").is_file())
        self.assertTrue((folder/"images"/"hotspot.png").is_file())
        saved=json.loads((folder/"scene-mask.json").read_text(encoding="utf-8"))
        self.assertEqual([slot["name"] for slot in saved["slots"]],
                         ["auto_mask_multi","image_a","image_b","hotspot"])
        self.assertEqual(saved["skins"][0]["attachments"]["auto_mask_multi"]["clip"]["end"],"image_b")
        self.assertEqual(host.validate_clipping_vertices(saved,
            saved["skins"][0]["attachments"]["auto_mask_multi"]["clip"])["boneIndices"],[1,2])

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

    def test_spine_editor_instance_pid_matcher_supports_user_installed_app_paths(self):
        from subprocess import CompletedProcess
        def fake_run(argv,**kwargs):
            self.assertEqual(argv[0],"pgrep")
            self.assertEqual(argv[1],"-f")
            self.assertEqual(argv[2],r"/Spine\.app/Contents/MacOS/Spine( |$)")
            return CompletedProcess(argv,0,"99800\nnot-a-pid\n99801\n","")
        with patch.object(host.subprocess,"run",side_effect=fake_run):
            self.assertEqual(host.spine_editor_instance_pids(),["99800","99801"])

    def test_editor_open_targets_only_the_originating_instance(self):
        with patch.object(host.platform,"system",return_value="Darwin"):
            with patch.object(host,"spine_editor_instance_pids",return_value=["99800"]), \
                 patch.object(host,"recent_editor_project",return_value=self.project.resolve()), \
                 patch.object(host.subprocess,"run") as proc:
                opened,route=host.verified_open_in_spine(self.project)
                self.assertTrue(opened)
                self.assertEqual(route,"already_open_in_originating_instance")
                proc.assert_not_called()

            def fake_run(argv,**kwargs):
                from subprocess import CompletedProcess
                if argv[0]=="open":
                    self.assertNotIn("-n",argv,"the handoff must never launch a second Spine process")
                    return CompletedProcess(argv,0,"","")
                raise AssertionError("unexpected subprocess call: "+str(argv))

            with patch.object(host,"spine_editor_instance_pids",side_effect=[["99800"],["99800"]]), \
                 patch.object(host,"recent_editor_project",return_value=None), \
                 patch.object(host,"wait_for_editor_open",return_value=True) as wait, \
                 patch.object(host.subprocess,"run",side_effect=fake_run) as calls:
                opened,route=host.verified_open_in_spine(self.project)
                self.assertTrue(opened)
                self.assertEqual(route,"originating_instance")
                wait.assert_called_once_with(self.project.resolve(),seconds=12)
                self.assertEqual(calls.call_count,1)
                self.assertEqual(calls.call_args.args[0][:3],["open","-a","/Applications/Spine.app"])

            # If the open event is ignored, do not fall back to open -n.
            with patch.object(host,"spine_editor_instance_pids",return_value=["99800"]), \
                 patch.object(host,"recent_editor_project",return_value=None), \
                 patch.object(host,"wait_for_editor_open",return_value=False), \
                 patch.object(host.subprocess,"run",side_effect=fake_run) as calls:
                opened,route=host.verified_open_in_spine(self.project)
                self.assertFalse(opened)
                self.assertEqual(route,"existing_instance_open_not_confirmed")
                self.assertEqual(calls.call_count,1)
                self.assertNotIn("-n",calls.call_args.args[0])

            # A changed GUI PID means a different editor was launched.
            with patch.object(host,"spine_editor_instance_pids",side_effect=[["99800"],["99801"]]), \
                 patch.object(host,"recent_editor_project",return_value=None), \
                 patch.object(host,"wait_for_editor_open",return_value=True), \
                 patch.object(host.subprocess,"run",side_effect=fake_run):
                opened,route=host.verified_open_in_spine(self.project)
                self.assertFalse(opened)
                self.assertEqual(route,"different_editor_instance_detected")

            with patch.object(host,"spine_editor_instance_pids",return_value=["99800","99801"]), \
                 patch.object(host.subprocess,"run") as proc:
                opened,route=host.verified_open_in_spine(self.project)
                self.assertFalse(opened)
                self.assertEqual(route,"multiple_editors_manual_selection_required")
                proc.assert_not_called()

    def test_other_platforms_do_not_launch_a_second_spine_instance(self):
        for system in ("Linux","Windows"):
            with patch.object(host.platform,"system",return_value=system), \
                 patch.object(host.subprocess,"Popen") as popen:
                opened,route=host.verified_open_in_spine(self.project)
                self.assertFalse(opened)
                self.assertEqual(route,"same_editor_open_not_supported_on_platform")
                popen.assert_not_called()

    def test_no_unbounded_discovery(self):
        host.session=None
        with patch.object(host,"spine_open_path",return_value=(None,"ambiguous_open_project")):
            result=host.open_project({})
        self.assertFalse(result["open"])
        self.assertEqual(result["reason"],"ambiguous_open_project")

    def test_macos_live_editor_launch_argv_without_apple_events(self):
        """Unique explicit live launch project is safe; no mtime guessing."""
        self.mock.stop()  # Test the real detector, not setUp's import fixture
        example = self.root / "Source Scene.spine"
        example.write_bytes(b"project file for launch-argument test")
        command = ("/Applications/Spine.app/Contents/MacOS/Spine "
                   "--update 4.3.26 " + str(example))
        def fake_run(args, **kwargs):
            if args[0] == "osascript":
                return subprocess.CompletedProcess(args, 1, "", "not authorized")
            if args[0] == "pgrep":
                return subprocess.CompletedProcess(args, 0, "321\n99800\n", "")
            if args[0] == "ps":
                text = command if args[2] == "321" else (
                    "/Applications/Spine.app/Contents/MacOS/Spine")
                return subprocess.CompletedProcess(args, 0, text + "\n", "")
            raise AssertionError("unexpected system query")
        with (patch.object(host.platform, "system", return_value="Darwin"),
              patch.object(host.shutil, "which", return_value=None),
              patch.object(host.subprocess, "run", side_effect=fake_run),
              patch.object(host, "recent_editor_project", return_value=example.resolve())):
            path, method = host.spine_open_path()
        self.assertEqual(path, example.resolve())
        self.assertEqual(method, "editor_launch_argument")

        other = self.root / "Different open project.spine"
        other.write_bytes(b"unrelated project")
        with (patch.object(host.platform, "system", return_value="Darwin"),
              patch.object(host.shutil, "which", return_value=None),
              patch.object(host.subprocess, "run", side_effect=fake_run),
              patch.object(host, "recent_editor_project", return_value=other.resolve())):
            path, method = host.spine_open_path()
        self.assertIsNone(path)
        self.assertEqual(method, "editor_project_changed_choose_file")

    def test_macos_never_selects_batch_import_or_export(self):
        self.mock.stop()  # Test the real detector, not setUp's import fixture
        example = self.root / "Source Scene.spine"
        example.write_bytes(b"project file")
        def fake_run(args, **kwargs):
            if args[0] == "osascript":
                return subprocess.CompletedProcess(args, 1, "", "not authorized")
            if args[0] == "pgrep":
                return subprocess.CompletedProcess(args, 0, "321\n", "")
            if args[0] == "ps":
                command = (
                    "/Applications/Spine.app/Contents/MacOS/Spine "
                    "--update 4.3.26 --input " + str(example) +
                    " --output /tmp/any --export /tmp/profile.export.json")
                return subprocess.CompletedProcess(args, 0, command + "\n", "")
            raise AssertionError("unexpected system query")
        with (patch.object(host.platform, "system", return_value="Darwin"),
              patch.object(host.shutil, "which", return_value=None),
              patch.object(host.subprocess, "run", side_effect=fake_run)):
            path, method = host.spine_open_path()
        self.assertIsNone(path)
        self.assertEqual(method, "choose_project_required")


class SpineResizeAdapterTests(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.dir.cleanup)
        self.root = Path(self.dir.name)
        self.project = self.root / "scene.json"
        self.project.write_text(json.dumps(build_json()), encoding="utf-8")
        self.images = self.root / "images"
        self.images.mkdir()
        self.face = self.images / "face.png"
        self.part = self.images / "part-a.png"
        self.unreferenced = self.images / "hotspot.png"
        self.face.write_bytes(PNG)
        self.part.write_bytes(PNG + b"part")
        self.unreferenced.write_bytes(PNG + b"unreferenced")
        skeleton_export = self.root / "skeleton.json"
        skeleton_export.write_text(json.dumps(build_json()), encoding="utf-8")
        files = {
            "skeleton.json": skeleton_export,
            "images/face.png": self.face,
            "images/part-a.png": self.part,
        }
        source_stat = self.project.stat()
        host.session = {
            "id": "resize-session-test",
            "created": time.time(),
            "source": self.project.resolve(),
            "sha256": hashlib.sha256(self.project.read_bytes()).hexdigest(),
            "source_size": source_stat.st_size,
            "source_mtime_ns": source_stat.st_mtime_ns,
            "files": files,
            "file_snapshots": {
                key: {"size": candidate.stat().st_size, "mtime_ns": candidate.stat().st_mtime_ns}
                for key, candidate in files.items()
            },
        }
        host.resize_save_stage = None

    def tearDown(self):
        host.session = None
        host.resize_save_stage = None

    def test_project_and_referenced_images_are_streamed_from_active_session(self):
        with patch.object(host, "open_project",
                          return_value={"open": True, "session": "resize-session-test"}):
            meta = host.get_open_spine_file({})
        self.assertEqual(meta["path"], str(self.project.resolve()))
        self.assertEqual(meta["size"], self.project.stat().st_size)

        project_chunk = host.read_project_chunk({
            "session": meta["session"], "offset": 0
        })
        self.assertEqual(base64.b64decode(project_chunk["base64"]), self.project.read_bytes())
        self.assertTrue(project_chunk["done"])

        images = host.get_sibling_images({
            "session": meta["session"], "projectPath": str(self.project)
        })
        self.assertEqual({item["name"] for item in images["images"]}, {"face.png", "part-a.png"})
        self.assertNotIn(str(self.unreferenced.resolve()), {item["path"] for item in images["images"]})

        face_chunk = host.read_file_chunk({
            "session": images["session"], "path": str(self.face), "offset": 0
        })
        self.assertEqual(base64.b64decode(face_chunk["base64"]), self.face.read_bytes())
        self.assertTrue(face_chunk["done"])

    def test_image_reads_reject_unreferenced_and_outside_project_paths(self):
        with self.assertRaisesRegex(ValueError, "FILE_NOT_REFERENCED_BY_ACTIVE_PROJECT"):
            host.read_file_chunk({
                "session": "resize-session-test", "path": str(self.unreferenced), "offset": 0
            })
        outside = self.root.parent / "unrelated.png"
        outside.write_bytes(PNG)
        self.addCleanup(lambda: outside.unlink(missing_ok=True))
        with self.assertRaisesRegex(ValueError, "FILE_OUTSIDE_ACTIVE_PROJECT"):
            host.read_file_chunk({
                "session": "resize-session-test", "path": str(outside), "offset": 0
            })

    def test_resize_save_rejects_path_traversal_and_non_zip_names(self):
        for filename in ("../outside.zip", "scene.resized.spine", ""):
            with self.subTest(filename=filename):
                with self.assertRaises(ValueError):
                    host.begin_resize_save({
                        "session": "resize-session-test", "path": str(self.project),
                        "size": 4, "filename": filename
                    })

    def test_resize_save_writes_a_new_copy_and_never_overwrites_source(self):
        original = self.project.read_bytes()
        resized = b"new resized project bytes"
        stage = host.begin_resize_save({
            "session": "resize-session-test", "path": str(self.project), "size": len(resized),
            "filename": "scene.resized.zip"
        })
        chunk = base64.b64encode(resized).decode("ascii")
        host.write_resize_save_chunk({
            "stage": stage["stage"], "offset": 0, "base64": chunk
        })
        result = host.finish_resize_save({"stage": stage["stage"]})
        output = Path(result["path"])
        self.assertTrue(result["ok"])
        self.assertEqual(output.parent.name, "SpineResizeResults")
        self.assertEqual(output.name, "scene.resized.zip")
        self.assertEqual(output.read_bytes(), resized)
        self.assertEqual(self.project.read_bytes(), original)
        self.assertNotEqual(output, self.project)



if __name__=="__main__":
    unittest.main(verbosity=2)
