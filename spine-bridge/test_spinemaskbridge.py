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

    def test_no_unbounded_discovery(self):
        host.session=None
        with patch.object(host,"spine_open_path",return_value=(None,"ambiguous_open_project")):
            result=host.open_project({})
        self.assertFalse(result["open"])
        self.assertEqual(result["reason"],"ambiguous_open_project")


if __name__=="__main__":
    unittest.main(verbosity=2)
