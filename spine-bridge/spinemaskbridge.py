#!/usr/bin/env python3
"""Constrained Chrome Native Messaging host for Spine Mask Tool.

No arbitrary file-system reads or writes, command execution, shell strings, or
network calls are accepted. All output goes to a new SpineMaskResults folder.
Native Messaging frames are unsigned 32-bit little-endian length + UTF-8 JSON.
"""
import base64
import hashlib
import json
import os
from pathlib import Path
import platform
import re
import shutil
import struct
import subprocess
import sys
import tempfile
import time
import uuid

MAX_FRAME = 900_000
CHUNK = 96_000
MAX_PROJECT = 32 * 1024 * 1024
MAX_OUTPUT = 32 * 1024 * 1024
MAX_FILES = 80
KINDS = {".json", ".spine", ".skel"}
IMAGES = {".png", ".jpg", ".jpeg", ".webp"}
session = None
stage = None
binary_import = None


def recv():
    head = sys.stdin.buffer.read(4)
    if not head:
        return None
    if len(head) != 4:
        raise ValueError("short native message")
    length = struct.unpack("<I", head)[0]
    if length <= 0 or length > MAX_FRAME:
        raise ValueError("invalid native frame length")
    buf = sys.stdin.buffer.read(length)
    if len(buf) != length:
        raise ValueError("truncated native message")
    return json.loads(buf)


def reply(message):
    buf = json.dumps(message, separators=(",", ":")).encode("utf-8")
    if len(buf) > 950_000:
        raise ValueError("native response too large")
    sys.stdout.buffer.write(struct.pack("<I", len(buf)))
    sys.stdout.buffer.write(buf)
    sys.stdout.buffer.flush()


def editor_cli():
    candidates = []
    override = os.environ.get("SPINE_MASK_EDITOR_CLI")
    if override:
        candidates.append(Path(override))
    if platform.system() == "Darwin":
        candidates += [Path("/Applications/Spine.app/Contents/MacOS/Spine"),
                       Path.home() / "Applications/Spine.app/Contents/MacOS/Spine"]
    elif platform.system() == "Windows":
        candidates += [Path(os.environ.get("ProgramFiles", "C:/Program Files")) / "Spine/Spine.com",
                       Path(os.environ.get("ProgramFiles", "C:/Program Files")) / "Spine/Spine.exe"]
    else:
        candidates += [Path.home() / "Spine/Spine.sh", Path("/opt/Spine/Spine.sh")]
    for name in ("Spine", "spine", "Spine.sh", "Spine.com"):
        exe = shutil.which(name)
        if exe:
            candidates.append(Path(exe))
    return next((str(c.resolve()) for c in candidates if c.is_file()), None)


def spine_open_path():
    # macOS direct query is advisory; not all Spine editions expose documents.
    if platform.system() == "Darwin":
        command = ('tell application "Spine"\n'
                   ' if (count of documents) > 0 then\n'
                   '  try\n'
                   '   return path of front document\n'
                   '  end try\n'
                   ' end if\n'
                   'end tell')
        try:
            result = subprocess.run(["osascript", "-e", command], stdout=subprocess.PIPE,
                                    stderr=subprocess.DEVNULL, text=True, timeout=5)
            p = Path(result.stdout.strip()).expanduser()
            if result.returncode == 0 and p.is_file() and p.suffix.lower() in KINDS:
                return p.resolve(), "editor"
        except (OSError, subprocess.TimeoutExpired):
            pass
    # Unlike a general Downloads scanner, only a unique recently modified
    # Spine project while Spine is running qualifies. No unrelated file picked.
    try:
        if platform.system() != "Windows":
            running = subprocess.run(["pgrep", "-f", "(Spine.app|Spine.sh|Spine.exe)"],
                                     stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                                     timeout=3).returncode == 0
        else:
            running = subprocess.run(["tasklist", "/FI", "IMAGENAME eq Spine.exe"],
                                     capture_output=True, text=True, timeout=3).stdout.lower().count("spine.exe") > 0
    except (OSError, subprocess.TimeoutExpired):
        running = False
    if not running:
        return None, "editor_not_detected"
    # On macOS/Linux an editor may keep its project file descriptor open.
    # Prefer that explicit process handle over guessing by file modification.
    if platform.system() != "Windows" and shutil.which("lsof"):
        try:
            pids = subprocess.run(["pgrep", "-f", "(Spine.app|Spine.sh|Spine.exe)"],
                                  capture_output=True, text=True, timeout=3).stdout.split()
            active = set()
            for pid in pids[:8]:
                if not pid.isdigit():
                    continue
                handles = subprocess.run(["lsof", "-Fn", "-p", pid], capture_output=True,
                                         text=True, timeout=3)
                for row in handles.stdout.splitlines():
                    if not row.startswith("n/"):
                        continue
                    candidate = Path(row[1:])
                    if candidate.suffix.lower() in KINDS and candidate.is_file():
                        active.add(candidate.resolve())
            if len(active) == 1:
                return active.pop(), "editor_handle"
            if len(active) > 1:
                return None, "ambiguous_editor_handles"
        except (OSError, subprocess.TimeoutExpired):
            pass
    # macOS Spine can be launched with a specific .spine path even when its
    # AppleScript dictionary/Automation permission is unavailable. Only use a
    # unique live editor launch argument; never scan Documents/Downloads and
    # never claim this identifies a later manually switched document.
    if platform.system() == "Darwin":
        try:
            pids = subprocess.run(
                ["pgrep", "-f", "^/Applications/Spine\.app/Contents/MacOS/Spine( |$)"],
                capture_output=True, text=True, timeout=3
            ).stdout.split()
            launched = set()
            for pid in pids[:16]:
                if not pid.isdigit():
                    continue
                result = subprocess.run(["ps", "-p", pid, "-o", "command="],
                    capture_output=True, text=True, timeout=3)
                command = result.stdout.strip()
                prefix = "/Applications/Spine.app/Contents/MacOS/Spine"
                if not command.startswith(prefix):
                    continue
                tail = command[len(prefix):].strip()
                # Exclude CLI jobs; arguments after --update can contain spaces
                # in an OS path and are not shell-escaped by ps.
                if tail.startswith("--update "):
                    version, separator, tail = tail[len("--update "):].partition(" ")
                    if not separator or not re.fullmatch(r"4\.3\.\d+", version):
                        continue
                    tail = tail.strip()
                if not tail.startswith("/") or not tail.lower().endswith(".spine"):
                    continue
                if any(option in tail for option in
                       (" --input ", " --output ", " --export ", " --import ")):
                    continue
                candidate = Path(tail)
                if candidate.is_file() and candidate.stat().st_size <= MAX_PROJECT:
                    launched.add(candidate.resolve())
            if len(launched) == 1:
                return launched.pop(), "editor_launch_argument"
            if len(launched) > 1:
                return None, "multiple_editor_launch_projects"
        except (OSError, subprocess.TimeoutExpired, ValueError):
            pass
    # Fail closed rather than guessing a project by mtime or another app.
    return None, "choose_project_required"


def export_json(project, folder):
    """Export a native Spine project using an actual .export.json profile."""
    if project.suffix.lower() == ".json":
        return project
    if project.suffix.lower() != ".spine":
        raise ValueError("BINARY_SKEL_REQUIRES_SPINE_PROJECT_OR_EXPORTED_JSON")
    cli = editor_cli()
    if not cli:
        raise ValueError("LICENSED_SPINE_CLI_UNAVAILABLE: no installed editor for native export")
    folder.mkdir(parents=True, exist_ok=True)
    # Keep the export profile outside the output folder so it cannot be
    # mistaken for a generated skeleton JSON.
    profile_dir = folder / "_config"
    profile_dir.mkdir(mode=0o700)
    profile = profile_dir / "spinemask.export.json"
    settings = {
        "class": "export-json",
        "extension": ".json",
        "format": "JSON",
        "prettyPrint": False,
        "nonessential": True,
        "cleanUp": False,
        "packAtlas": None,
        "packSource": "attachments",
        "packTarget": "single",
        "warnings": True,
        "version": None,
        "all": True,
        "output": str(folder),
        "id": -1,
        "input": "",
        "open": False,
    }
    profile.write_text(json.dumps(settings), encoding="utf-8")
    command = [cli, "--update", "4.3.26", "--input", str(project),
               "--output", str(folder), "--export", str(profile)]
    try:
        result = subprocess.run(command, capture_output=True, text=True, timeout=150)
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise ValueError("LICENSED_SPINE_EXPORT_TIMEOUT_OR_LAUNCH_FAILED") from exc
    if result.returncode:
        # Do not disclose user's license data or absolute paths from CLI logs.
        raise ValueError("LICENSED_SPINE_EXPORT_FAILED")
    files = [item for item in folder.glob("*.json") if item != profile]
    if len(files) != 1:
        raise ValueError("LICENSED_SPINE_EXPORT_AMBIGUOUS")
    try:
        exported = json.loads(files[0].read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        raise ValueError("LICENSED_SPINE_EXPORTED_JSON_INVALID") from exc
    if not exported.get("skins") or not isinstance(exported.get("slots"), list):
        raise ValueError("LICENSED_SPINE_EXPORTED_JSON_INVALID")
    if not str(exported.get("skeleton", {}).get("spine", "")).startswith("4.3."):
        raise ValueError("LICENSED_SPINE_EXPORTED_VERSION_MISMATCH")
    return files[0]


def pick_native_project():
    """Ask the OS for a local file; never accept arbitrary paths from web JS."""
    system = platform.system()
    if system == "Darwin":
        script = ('POSIX path of (choose file with prompt "Choose the Spine project to mask" '
                  'of type {"spine", "json", "skel"})')
        cmd = ["osascript", "-e", script]
    elif system == "Windows":
        script = (
            'Add-Type -AssemblyName System.Windows.Forms; '
            '$dialog=New-Object System.Windows.Forms.OpenFileDialog; '
            '$dialog.Filter="Spine Project (*.spine;*.json;*.skel)|*.spine;*.json;*.skel"; '
            'if($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK)'
            '{$dialog.FileName}'
        )
        cmd = ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", script]
    else:
        raise ValueError("NATIVE_PICKER_UNSUPPORTED_ON_THIS_OS")
    try:
        chosen = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise ValueError("NATIVE_PROJECT_PICKER_FAILED") from exc
    if chosen.returncode or not chosen.stdout.strip():
        raise ValueError("NATIVE_PROJECT_PICKER_CANCELLED_OR_UNAVAILABLE")
    path = Path(chosen.stdout.strip()).expanduser()
    if path.suffix.lower() not in KINDS or not path.is_file():
        raise ValueError("SELECTED_FILE_IS_NOT_A_SPINE_PROJECT")
    return path.resolve()


def choose_project(_params):
    return _load_project(pick_native_project(), "user_picker")


def open_project(_params):
    path, method = spine_open_path()
    if not path:
        return {"connected": True, "open": False, "reason": method}
    return _load_project(path, method)


def _load_project(path, method):
    global session, stage
    if path.stat().st_size > MAX_PROJECT:
        raise ValueError("PROJECT_TOO_LARGE")
    staging = Path(tempfile.mkdtemp(prefix="spinemask-export-"))
    try:
        json_path = export_json(path, staging)
        base_dir = path.parent
        skeleton = json.loads(json_path.read_text(encoding="utf-8"))
        skins = skeleton.get("skins") or []
        if isinstance(skins, dict):
            skins = [{"attachments": v} for v in skins.values()]
        wanted = set()
        for skin in skins:
            for attachments in skin.get("attachments", {}).values():
                for name, attachment in attachments.items():
                    if not isinstance(attachment, dict):
                        continue
                    if attachment.get("type", "region") != "region":
                        continue
                    referenced = str(attachment.get("path") or name).replace("\\", "/")
                    wanted.add(Path(referenced).stem.casefold())
        if not wanted:
            raise ValueError("NO_REGION_ATTACHMENTS_IN_OPEN_PROJECT")
        # Read only textures actually referenced by the Spine skeleton.
        # Unrelated NDA artwork in the same folder is never imported.
        candidates = []
        seen = set()
        roots = [base_dir / "images", base_dir]
        for root in roots:
            if not root.is_dir():
                continue
            for current, subdirs, filenames in os.walk(root):
                depth = len(Path(current).relative_to(root).parts)
                if depth > 2:
                    subdirs[:] = []
                    continue
                subdirs[:] = [x for x in subdirs if not x.startswith(".")
                             and x not in ("SpineMaskResults", "node_modules")]
                for filename in sorted(filenames):
                    candidate = Path(current) / filename
                    if candidate.suffix.lower() not in IMAGES:
                        continue
                    if candidate.stem.casefold() not in wanted:
                        continue
                    try:
                        if not candidate.is_file() or candidate.stat().st_size > MAX_PROJECT:
                            continue
                        real = candidate.resolve()
                        if real in seen or not real.is_relative_to(base_dir.resolve()):
                            continue
                    except OSError:
                        continue
                    seen.add(real)
                    relative = candidate.relative_to(root).as_posix()
                    if any(part in ("..", ".") for part in Path(relative).parts):
                        continue
                    candidates.append(("images/" + relative, candidate))
        files = {"skeleton.json": json_path}
        distinct = set()
        for key, candidate in candidates:
            if candidate.name.casefold() in distinct:
                # Distinct attachments sharing the same basename cannot be
                # safely disambiguated by the current browser file picker.
                continue
            distinct.add(candidate.name.casefold())
            files[key] = candidate
        if len(files) <= 1:
            raise ValueError("NO_MATCHING_REGION_IMAGE_FOUND")
        if len(files) > MAX_FILES or sum(p.stat().st_size for p in files.values()) > 64 * 1024 * 1024:
            raise ValueError("SPINE_PROJECT_RESOURCE_LIMIT")
        if stage and stage.get("temp"):
            shutil.rmtree(stage["temp"], ignore_errors=True)
        if session and session.get("export"):
            shutil.rmtree(session["export"], ignore_errors=True)
        snap = hashlib.sha256(path.read_bytes()).hexdigest()
        session = {"id": uuid.uuid4().hex, "source": path, "sha256": snap, "files": files,
                   "export": staging, "method": method, "created": time.time()}
        stage = None
        return {"connected": True, "open": True, "session": session["id"],
                "source": path.name, "sourceType": path.suffix.lower(), "foundBy": method,
                "files": [{"key": key, "name": Path(key).name, "size": p.stat().st_size}
                          for key, p in files.items()]}
    except Exception:
        shutil.rmtree(staging, ignore_errors=True)
        raise


def checked_session(payload):
    if not session or payload.get("session") != session["id"]:
        raise ValueError("MISSING_OR_EXPIRED_PROJECT_SESSION")
    if time.time() - session["created"] > 600:
        raise ValueError("PROJECT_SESSION_EXPIRED")
    return session


def read_chunk(payload):
    active = checked_session(payload)
    key = payload.get("key")
    if key not in active["files"]:
        raise ValueError("FILE_NOT_IN_CURRENT_PROJECT")
    offset = payload.get("offset", 0)
    if not isinstance(offset, int) or offset < 0:
        raise ValueError("INVALID_OFFSET")
    path = active["files"][key]
    total = path.stat().st_size
    if total > MAX_PROJECT:
        raise ValueError("FILE_TOO_LARGE")
    with path.open("rb") as f:
        f.seek(offset)
        chunk = f.read(CHUNK)
    return {"key": key, "offset": offset, "total": total,
            "base64": base64.b64encode(chunk).decode("ascii"), "done": offset + len(chunk) >= total}


def begin_result(payload):
    global stage
    active = checked_session(payload)
    if hashlib.sha256(active["source"].read_bytes()).hexdigest() != active["sha256"]:
        raise ValueError("SOURCE_CHANGED_RESTART_IMPORT")
    entries = payload.get("files")
    if not isinstance(entries, list) or len(entries) != 1:
        raise ValueError("EXPECTED_ONLY_MASK_JSON")
    expected_names = {"mask.json"}
    if {e.get("name") for e in entries} != expected_names:
        raise ValueError("INVALID_OUTPUT_ENTRY_NAMES")
    if any(not isinstance(e.get("size"), int) or e["size"] < 30 or e["size"] > MAX_OUTPUT for e in entries):
        raise ValueError("INVALID_OUTPUT_SIZES")
    if stage and stage.get("temp"):
        shutil.rmtree(stage["temp"], ignore_errors=True)
    directory = Path(tempfile.mkdtemp(prefix="spinemask-write-"))
    stage = {"id": uuid.uuid4().hex, "temp": directory,
             "lengths": {e["name"]: e["size"] for e in entries},
             "written": {e["name"]: 0 for e in entries}, "created": time.time()}
    for name in expected_names:
        (directory / name).touch(mode=0o600)
    return {"stage": stage["id"], "status": "receiving"}


def write_chunk(payload):
    if not stage or payload.get("stage") != stage["id"]:
        raise ValueError("INVALID_OUTPUT_STAGE")
    name, offset = payload.get("name"), payload.get("offset")
    if name not in stage["lengths"] or offset != stage["written"][name]:
        raise ValueError("OUTPUT_ORDER_MISMATCH")
    raw = base64.b64decode(payload.get("base64", ""), validate=True)
    if not raw or len(raw) > CHUNK or offset + len(raw) > stage["lengths"][name]:
        raise ValueError("INVALID_OUTPUT_CHUNK")
    with (stage["temp"] / name).open("ab") as f:
        f.write(raw)
    stage["written"][name] += len(raw)
    return {"name": name, "written": stage["written"][name]}


def copy_local_project_assets(project, dest):
    """Keep unreferenced animator images locally, not on the website."""
    source = project.parent / "images"
    if not source.exists():
        return 0
    if source.is_symlink() or not source.is_dir():
        raise ValueError("UNSAFE_PROJECT_IMAGE_DIRECTORY")
    root = source.resolve()
    total = 0
    count = 0
    for folder, dirs, files in os.walk(source, followlinks=False):
        directory = Path(folder)
        dirs[:] = sorted(d for d in dirs if not (directory / d).is_symlink()
                         and not d.startswith("."))
        for name in sorted(files):
            item = directory / name
            if item.suffix.lower() not in IMAGES or item.is_symlink() or not item.is_file():
                continue
            real = item.resolve()
            if not real.is_relative_to(root):
                raise ValueError("UNSAFE_PROJECT_IMAGE_PATH")
            relative = item.relative_to(source)
            length = item.stat().st_size
            count += 1
            total += length
            if count > 4000 or total > 2 * 1024 * 1024 * 1024:
                raise ValueError("PROJECT_IMAGE_RESOURCE_LIMIT")
            target = dest / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, target)
            if target.stat().st_size != length:
                raise ValueError("INCOMPLETE_PROJECT_ASSET_COPY")
    return count


def recent_editor_project():
    """The actual path Spine has recorded after loading a project (macOS).

    The Spine 4.3 recent-file list uses its own settings syntax rather than
    strict JSON. Reading only its first projectFile entry avoids selecting
    unrelated desktop or recent files. No paths are sent to a website.
    """
    settings = Path.home() / "Library/Application Support/Spine/settings/recent-1.json"
    try:
        content = settings.read_text(encoding="utf-8")
        section = content.split("recentFiles:", 1)[1]
        section = section.split("projectFile:", 1)[1][:20000]
        match = re.search(
            r'paths\s*:\s*\[\s*\{\s*path\s*:\s*"((?:\\.|[^"\\])*)"',
            section
        )
        if not match:
            return None
        path = Path(json.loads('"' + match.group(1) + '"')).expanduser()
        return path.resolve() if path.is_file() else None
    except (OSError, ValueError, IndexError, json.JSONDecodeError):
        return None


def wait_for_editor_open(project, seconds=12):
    project = Path(project).resolve()
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        if recent_editor_project() == project:
            return True
        time.sleep(0.4)
    return False


def verified_open_in_spine(project, editor_cli_path=None):
    """Return (verified_opened, route) rather than assuming Popen means success.

    The existing editor is tried first. On macOS the application may silently
    ignore an Apple open-file event, so create exactly one independent editor
    instance with the officially supported CLI project argument as a fallback.
    The source instance is never closed or modified.
    """
    project = Path(project).resolve()
    if platform.system() != "Darwin":
        try:
            if platform.system() == "Windows":
                os.startfile(str(project))
            else:
                subprocess.Popen([editor_cli_path or "Spine", str(project)],
                                 stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return False, "open_requested_not_verified"
        except (OSError, AttributeError):
            return False, "editor_open_failed"
    if recent_editor_project() == project:
        return True, "already_open"
    try:
        existing = subprocess.run(
            ["open", "-a", "/Applications/Spine.app", str(project)],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=10)
        if existing.returncode == 0 and wait_for_editor_open(project, seconds=8):
            return True, "existing_instance"
    except (OSError, subprocess.TimeoutExpired):
        pass
    # Avoid accumulating runaway GUI processes on machines with several
    # different Spine installations / many already-open Editor windows.
    try:
        instances = subprocess.run(
            ["pgrep", "-f", "^/Applications/Spine.app/Contents/MacOS/Spine"],
            capture_output=True, text=True, timeout=4)
        if len([pid for pid in instances.stdout.splitlines() if pid.isdigit()]) >= 3:
            return False, "multiple_editors_manual_selection_required"
    except (OSError, subprocess.TimeoutExpired):
        return False, "editor_instance_count_unavailable"
    try:
        fresh = subprocess.run(
            ["open", "-n", "-a", "/Applications/Spine.app", "--args",
             "--update", "4.3.26", str(project)],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=10)
        if fresh.returncode != 0:
            return False, "editor_launch_failed"
        if wait_for_editor_open(project, seconds=25):
            return True, "new_instance_verified"
        return False, "editor_loading_not_confirmed"
    except (OSError, subprocess.TimeoutExpired):
        return False, "editor_launch_failed"


def commit_result(payload):
    global stage
    active = checked_session(payload)
    if not stage or stage["id"] != payload.get("stage"):
        raise ValueError("INVALID_OUTPUT_STAGE")
    if any(stage["written"][name] != length for name, length in stage["lengths"].items()):
        raise ValueError("INCOMPLETE_OUTPUT")
    updated = json.loads((stage["temp"] / "mask.json").read_text(encoding="utf-8"))
    if not isinstance(updated.get("slots"), list) or not updated.get("skins"):
        raise ValueError("INVALID_SPINE_JSON")
    clips = []
    skins = updated["skins"] if isinstance(updated["skins"], list) else [{"attachments": a} for a in updated["skins"].values()]
    for skin in skins:
        for names in skin.get("attachments", {}).values():
            clips += [a for a in names.values() if a.get("type") == "clipping"]
    if len(clips) != 1:
        raise ValueError("EXPECTED_EXACTLY_ONE_CLIPPING_ATTACHMENT")
    clip = clips[0]
    names = [slot.get("name") for slot in updated["slots"]]
    if (not clip.get("end") in names or
            any(name.startswith("auto_mask_overlay") for name in names)):
        raise ValueError("CLIPPING_MUST_TARGET_ORIGINAL_IMAGE_NO_OVERLAY")
    mask_slots = [i for i, name in enumerate(names) if name.startswith("auto_mask_")]
    if len(mask_slots) != 1 or mask_slots[0] >= len(names) - 1:
        raise ValueError("INVALID_CLIPPING_SLOT_POSITION")
    if names[mask_slots[0] + 1] != clip["end"]:
        raise ValueError("CLIPPING_NOT_ADJACENT_TO_ORIGINAL_TARGET")
    if any(a.get("path") == "mask-overlay" for skin in skins
           for values in skin.get("attachments", {}).values()
           for a in values.values()):
        raise ValueError("REPLACEMENT_TEXTURE_NOT_ALLOWED")
    if hashlib.sha256(active["source"].read_bytes()).hexdigest() != active["sha256"]:
        raise ValueError("SOURCE_CHANGED_RESTART_IMPORT")
    base = active["source"].parent / "SpineMaskResults"
    base.mkdir(mode=0o700, exist_ok=True)
    folder = base / (active["source"].stem[:48] + "-" + str(int(time.time())) + "-" + uuid.uuid4().hex[:6])
    folder.mkdir(mode=0o700)
    dest = folder / "images"
    dest.mkdir(mode=0o700)
    try:
        # Copy the entire original LOCAL images tree. The browser receives
        # only skeleton-referenced images, but result assets must include
        # future animation effects such as hotspot.png.
        retained = copy_local_project_assets(active["source"], dest)
        for key, source in active["files"].items():
            if key.startswith("images/"):
                relative = Path(key).relative_to("images")
                target = dest / relative
                target.parent.mkdir(parents=True, exist_ok=True)
                if not target.exists():
                    shutil.copy2(source, target)
        json_out = folder / (active["source"].stem + "-mask.json")
        json_out.write_text(json.dumps(updated, separators=(",", ":")), encoding="utf-8")
        cli = editor_cli()
        output = folder / (active["source"].stem + "-mask.spine")
        imported = False
        if cli:
            command = [cli, "--update", "4.3.26", "--input", str(json_out),
                       "--output", str(output), "--import"]
            try:
                proc = subprocess.run(command, input="\n", capture_output=True, text=True, timeout=180)
                imported = proc.returncode == 0 and output.is_file() and output.stat().st_size > 0
            except (subprocess.TimeoutExpired, OSError):
                imported = False
        opened = False
        open_route = "not_requested"
        if imported and payload.get("openEditor", True):
            opened, open_route = verified_open_in_spine(output, cli)
        return {"saved": True, "imported": imported, "opened": opened,
                "openVerification": open_route,
                "project": output.name if imported else None,
                "json": json_out.name, "location": str(folder),
                "note": "Original project remains untouched"}
    finally:
        shutil.rmtree(stage["temp"], ignore_errors=True)
        stage = None


def begin_import(payload):
    """Only a user-provided .spine File: no arbitrary paths or executable input."""
    global binary_import
    name, size, digest = payload.get("name"), payload.get("size"), payload.get("sha256")
    if (not isinstance(name, str) or Path(name).name != name
            or Path(name).suffix.lower() != ".spine"
            or not isinstance(size, int) or not 0 < size <= MAX_PROJECT
            or not isinstance(digest, str) or len(digest) != 64
            or any(ch not in "0123456789abcdef" for ch in digest.lower())):
        raise ValueError("INVALID_EXPLICIT_SPINE_IMPORT")
    if binary_import:
        shutil.rmtree(binary_import["temp"], ignore_errors=True)
    directory = Path(tempfile.mkdtemp(prefix="spinemask-import-"))
    source = directory / "source.spine"
    source.touch(mode=0o600)
    binary_import = {
        "id": uuid.uuid4().hex, "temp": directory, "file": source,
        "size": size, "sha256": digest.lower(), "written": 0,
        "created": time.time(), "exported": None
    }
    return {"session": binary_import["id"], "maxChunk": CHUNK}


def checked_import(payload):
    active = binary_import
    if not active or active["id"] != payload.get("session"):
        raise ValueError("UNKNOWN_SPINE_IMPORT_SESSION")
    if time.time() - active["created"] > 600:
        raise ValueError("SPINE_IMPORT_SESSION_EXPIRED")
    return active


def import_chunk(payload):
    active = checked_import(payload)
    offset = payload.get("offset")
    if active["exported"] or not isinstance(offset, int) or offset != active["written"]:
        raise ValueError("INVALID_SPINE_IMPORT_OFFSET")
    raw = base64.b64decode(payload.get("base64", ""), validate=True)
    if not raw or len(raw) > CHUNK or offset + len(raw) > active["size"]:
        raise ValueError("INVALID_SPINE_IMPORT_CHUNK")
    with active["file"].open("ab") as dest:
        dest.write(raw)
    active["written"] += len(raw)
    return {"written": active["written"]}


def finish_import(payload):
    active = checked_import(payload)
    if active["written"] != active["size"]:
        raise ValueError("SPINE_IMPORT_BYTES_INCOMPLETE")
    if hashlib.sha256(active["file"].read_bytes()).hexdigest() != active["sha256"]:
        raise ValueError("SPINE_IMPORT_SHA256_MISMATCH")
    exported = export_json(active["file"], active["temp"] / "export")
    if exported.stat().st_size > MAX_PROJECT:
        raise ValueError("SPINE_EXPORTED_JSON_TOO_LARGE")
    active["exported"] = exported
    return {"session": active["id"], "name": exported.name, "size": exported.stat().st_size}


def read_import_chunk(payload):
    global binary_import
    active = checked_import(payload)
    source = active.get("exported")
    if not source or not source.is_file():
        raise ValueError("SPINE_IMPORT_NOT_YET_EXPORTED")
    offset = payload.get("offset")
    if not isinstance(offset, int) or offset < 0 or offset >= source.stat().st_size:
        raise ValueError("INVALID_EXPORTED_SPINE_OFFSET")
    with source.open("rb") as handle:
        handle.seek(offset)
        raw = handle.read(CHUNK)
    done = offset + len(raw) >= source.stat().st_size
    packet = {"session": active["id"], "offset": offset,
              "total": source.stat().st_size,
              "base64": base64.b64encode(raw).decode("ascii"), "done": done}
    if done:
        shutil.rmtree(active["temp"], ignore_errors=True)
        binary_import = None
    return packet


HANDLERS = {
    "ping": lambda _: {"connected": True, "protocol": "spinemask/1"},
    "open_project": open_project,
    "choose_project": choose_project,
    "begin_import": begin_import,
    "import_chunk": import_chunk,
    "finish_import": finish_import,
    "read_import_chunk": read_import_chunk,
    "read_chunk": read_chunk,
    "begin_result": begin_result,
    "write_chunk": write_chunk,
    "commit_result": commit_result,
}


def main():
    while True:
        try:
            item = recv()
            if item is None:
                break
            fn = HANDLERS.get(item.get("method"))
            if not fn:
                raise ValueError("UNSUPPORTED_NATIVE_METHOD")
            result = fn(item.get("params") or {})
            reply({"id": item.get("id"), "result": result})
        except (ValueError, KeyError, TypeError, OSError, json.JSONDecodeError) as exc:
            reply({"id": (item or {}).get("id") if "item" in locals() and isinstance(item, dict) else None,
                   "error": str(exc)[:180]})
        except Exception:
            reply({"id": (item or {}).get("id") if "item" in locals() and isinstance(item, dict) else None,
                   "error": "NATIVE_HOST_INTERNAL_ERROR"})


if __name__ == "__main__":
    main()
