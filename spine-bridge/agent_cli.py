#!/usr/bin/env python3
"""Headless agent interface for the local Spine Mask native host.

Examples:
  SPINE_MASK_PROJECT_PATH=/work/sym_crown/sym_wild.spine python3 agent_cli.py inspect
  SPINE_MASK_PROJECT_PATH=/work/sym_crown/sym_wild.spine python3 agent_cli.py apply mask.json
"""
import argparse
import base64
import json
import os
from pathlib import Path
import sys

import spinemaskbridge as bridge


def emit(value):
    print(json.dumps(value, ensure_ascii=False, separators=(",", ":")))


def inspect_project():
    result = bridge.open_project({})
    if not result.get("open") or not result.get("session"):
        raise RuntimeError("SPINE_PROJECT_NOT_AVAILABLE: " + str(result.get("reason", "open_project_failed")))
    emit({
        "ok": True,
        "protocol": "spinemask/1",
        "source": result.get("source"),
        "sourceType": result.get("sourceType"),
        "foundBy": result.get("foundBy"),
        "session": result.get("session"),
        "files": result.get("files", []),
    })


def extract_project(output_dir):
    project = bridge.open_project({})
    if not project.get("open") or not project.get("session"):
        raise RuntimeError("SPINE_PROJECT_NOT_AVAILABLE: " + str(project.get("reason", "open_project_failed")))
    root = Path(output_dir).expanduser().resolve()
    root.mkdir(parents=True, exist_ok=True)
    written = []
    for item in project.get("files", []):
        key = str(item.get("key", "")).replace("\\", "/")
        parts = key.split("/")
        if not key or key.startswith("/") or any(part in ("", ".", "..") for part in parts):
            raise RuntimeError("UNSAFE_PROJECT_FILE_KEY")
        destination = root.joinpath(*parts)
        destination.parent.mkdir(parents=True, exist_ok=True)
        offset = 0
        with destination.open("wb") as output:
            while offset < int(item["size"]):
                packet = bridge.read_chunk({
                    "session": project["session"],
                    "key": key,
                    "offset": offset,
                })
                if packet.get("offset") != offset or packet.get("total") != int(item["size"]):
                    raise RuntimeError("PROJECT_READ_CHUNK_MISMATCH")
                chunk = base64.b64decode(packet.get("base64", ""), validate=True)
                if not chunk or offset + len(chunk) > int(item["size"]):
                    raise RuntimeError("PROJECT_READ_CHUNK_INVALID")
                output.write(chunk)
                offset += len(chunk)
        written.append({"path": "/".join(parts), "size": destination.stat().st_size})
    emit({"ok": True, "source": project.get("source"), "output": str(root), "files": written})


def apply_mask(mask_path, open_editor=False):
    project = bridge.open_project({})
    if not project.get("open") or not project.get("session"):
        raise RuntimeError("SPINE_PROJECT_NOT_AVAILABLE: " + str(project.get("reason", "open_project_failed")))
    raw = Path(mask_path).expanduser().read_bytes()
    if not raw or len(raw) > bridge.MAX_OUTPUT:
        raise RuntimeError("MASK_JSON_SIZE_INVALID")
    started = bridge.begin_result({
        "session": project["session"],
        "files": [{"name": "mask.json", "size": len(raw)}],
    })
    stage = started.get("stage")
    if not stage:
        raise RuntimeError("MASK_OUTPUT_STAGE_NOT_CREATED")
    for offset in range(0, len(raw), bridge.CHUNK):
        part = raw[offset:offset + bridge.CHUNK]
        written = bridge.write_chunk({
            "stage": stage,
            "name": "mask.json",
            "offset": offset,
            "base64": base64.b64encode(part).decode("ascii"),
        })
        if written.get("written") != offset + len(part):
            raise RuntimeError("MASK_OUTPUT_CHUNK_NOT_VERIFIED")
    result = bridge.commit_result({
        "session": project["session"],
        "stage": stage,
        "openEditor": bool(open_editor),
    })
    emit({
        "ok": bool(result.get("saved")),
        "source": project.get("source"),
        "result": result,
    })
    if not result.get("saved") or not result.get("imported"):
        raise RuntimeError("SPINE_NATIVE_IMPORT_FAILED")


def main():
    parser = argparse.ArgumentParser(description="Spine Mask local agent bridge")
    parser.add_argument("--project", help="Explicit local .spine or exported .json path")
    parser.add_argument("--spine-cli", help="Explicit licensed Spine Editor CLI executable")
    parser.add_argument("--recent-file", help="Override Spine recent project settings file")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("inspect", help="Return the selected project's skeleton and image inventory")
    extract = sub.add_parser("extract", help="Extract only skeleton-referenced images into a local workspace")
    extract.add_argument("output_dir")
    apply = sub.add_parser("apply", help="Validate and import a mask.json as a new .spine project")
    apply.add_argument("mask_json")
    apply.add_argument("--open-editor", action="store_true",
                       help="Open the generated project in the existing editor where supported")
    args = parser.parse_args()

    if args.project:
        os.environ["SPINE_MASK_PROJECT_PATH"] = str(Path(args.project).expanduser().resolve())
    if args.spine_cli:
        os.environ["SPINE_MASK_EDITOR_CLI"] = str(Path(args.spine_cli).expanduser().resolve())
    if args.recent_file:
        os.environ["SPINE_MASK_RECENT_FILE"] = str(Path(args.recent_file).expanduser().resolve())

    try:
        if args.command == "inspect":
            inspect_project()
        elif args.command == "extract":
            extract_project(args.output_dir)
        else:
            apply_mask(args.mask_json, args.open_editor)
    except Exception as error:
        emit({"ok": False, "error": str(error)[:240]})
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
