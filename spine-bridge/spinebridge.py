#!/usr/bin/env python3
"""Native messaging host for Spine Resize Bridge.

Fully automatic: no config file needed. When the website asks for the open
Spine project, this host:

  1. Tries to ask the running Spine editor (via AppleScript on macOS) for the
     path of its front document.
  2. Falls back to scanning standard folders (Documents, Desktop, Downloads,
     recent folders) for the most recently modified .spine / .skel / .json
     project file.
  3. Returns the file bytes plus all sibling images in the same directory.

It can also write the resized bytes back over the original file.
"""
import json, os, sys, subprocess, struct, time, glob

SEARCH_DIRS = [
    os.path.expanduser("~/Documents"),
    os.path.expanduser("~/Desktop"),
    os.path.expanduser("~/Downloads"),
    os.path.expanduser("~"),
]

PROJECT_EXTS = (".spine", ".skel", ".bytes", ".json")
IMAGE_EXTS = (".png", ".jpg", ".jpeg", ".webp", ".gif")


def read_json(fd):
    raw = b""
    while True:
        ch = fd.read(1)
        if not ch:
            return None
        raw += ch
        try:
            return json.loads(raw.decode("utf-8"))
        except Exception:
            continue


def write_msg(obj):
    data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
    sys.stdout.buffer.write(struct.pack("<I", len(data)) + data)
    sys.stdout.buffer.flush()


def applescript_front_document_path():
    """Ask Spine (macOS) for the path of its front document. Returns path or None."""
    script = (
        'tell application "Spine"\n'
        '  if (count of documents) > 0 then\n'
        '    set d to front document\n'
        '    try\n'
        '      return path of d\n'
        '    end try\n'
        '  end if\n'
        'end tell'
    )
    try:
        out = subprocess.run(
            ["osascript", "-e", script],
            capture_output=True, text=True, timeout=5
        )
        if out.returncode == 0 and out.stdout.strip():
            return out.stdout.strip()
    except Exception:
        pass
    return None


def is_spine_running():
    try:
        out = subprocess.run(
            ["pgrep", "-x", "Spine"],
            capture_output=True, text=True, timeout=3
        )
        return out.returncode == 0 and bool(out.stdout.strip())
    except Exception:
        return False


def find_recent_project(max_age_seconds=600):
    """Find the most recently modified project file in standard folders."""
    best = None
    best_mtime = 0
    seen_dirs = set()
    for d in SEARCH_DIRS:
        if not os.path.isdir(d):
            continue
        seen_dirs.add(os.path.realpath(d))
        # Walk one level deep for common project folders
        for root, dirs, files in os.walk(d):
            # Limit depth
            depth = root[len(d):].count(os.sep)
            if depth > 2:
                dirs[:] = []
                continue
            for name in files:
                ext = os.path.splitext(name)[1].lower()
                if ext not in PROJECT_EXTS:
                    continue
                full = os.path.join(root, name)
                try:
                    st = os.stat(full)
                except Exception:
                    continue
                if st.st_mtime > best_mtime:
                    best_mtime = st.st_mtime
                    best = full
            # prune common noise dirs
            dirs[:] = [x for x in dirs if not x.startswith(".") and x not in ("node_modules",)]
    if best and (time.time() - best_mtime) < max_age_seconds:
        return best
    return None


def get_open_file_path():
    # 1. Ask Spine directly
    path = applescript_front_document_path()
    if path and os.path.exists(path):
        return path
    # 2. Fallback: recent project file
    return find_recent_project()


def sibling_dir(project_path):
    return os.path.dirname(os.path.abspath(project_path))


def get_sibling_images(project_path):
    d = sibling_dir(project_path)
    out = []
    if not os.path.isdir(d):
        return out
    for name in sorted(os.listdir(d)):
        full = os.path.join(d, name)
        if not os.path.isfile(full):
            continue
        ext = os.path.splitext(name)[1].lower()
        if ext in IMAGE_EXTS:
            out.append({"path": full, "name": name})
    return out


def read_file(path):
    if not os.path.exists(path):
        return None
    with open(path, "rb") as f:
        data = f.read()
    return {"path": path, "data": list(data)}


def save_file(path, bytes_list):
    try:
        os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
        with open(path, "wb") as f:
            f.write(bytes(bytes_list))
        return True
    except Exception as e:
        sys.stderr.write(str(e) + "\n")
        return False


def get_open_spine_file():
    p = get_open_file_path()
    if not p:
        return None
    return read_file(p)


METHODS = {
    "get_open_file_path": lambda p: get_open_file_path(),
    "get_open_spine_file": lambda p: get_open_spine_file(),
    "get_sibling_images": lambda p: get_sibling_images(p.get("projectPath")),
    "read_file": lambda p: read_file(p.get("path")),
    "save_file": lambda p: save_file(p.get("path"), p.get("bytes", [])),
}


def main():
    try:
        first = read_json(sys.stdin)
    except Exception:
        first = None
    while True:
        try:
            msg = read_json(sys.stdin)
        except Exception:
            break
        if msg is None:
            break
        method = msg.get("method")
        params = msg.get("params") or {}
        fn = METHODS.get(method)
        try:
            if not fn:
                raise ValueError("unknown method: " + str(method))
            result = fn(params)
            write_msg({"id": msg.get("id"), "result": result})
        except Exception as e:
            write_msg({"id": msg.get("id"), "error": str(e)})


if __name__ == "__main__":
    main()
