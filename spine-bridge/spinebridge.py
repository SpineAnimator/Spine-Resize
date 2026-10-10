#!/usr/bin/env python3
"""Native messaging host for Spine Resize Bridge.

Talks to the Chrome extension. Finds the Spine project currently open in the
Spine editor, reads it plus referenced images, and can write the resized file
back over the original.

Configuration: a JSON file at ~/.spine-bridge/config.json with key "project"
holding the path to the currently open .spine/.json/.skel project. Update it
manually (or via the Spine menu) whenever you open a project in Spine.

On macOS it also tries AppleScript to ask Spine for its front document path.
"""
import json, os, sys, subprocess, struct, glob

CONFIG_DIR = os.path.expanduser("~/.spine-bridge")
CONFIG_FILE = os.path.join(CONFIG_DIR, "config.json")


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


def load_config():
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def save_config(cfg):
    os.makedirs(CONFIG_DIR, exist_ok=True)
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)


def applescript_find_spine():
    """Ask Spine (macOS) for the path of its frontmost document."""
    script = 'tell application "Spine" to get name of front document'
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


def get_open_file_path():
    cfg = load_config()
    p = cfg.get("project")
    if p and os.path.exists(p):
        return p
    ascript = applescript_find_spine()
    if ascript:
        candidates = [
            os.path.expanduser("~/Documents/" + ascript),
            os.path.expanduser("~/Documents/Spine/" + ascript),
            ascript,
        ]
        for c in candidates:
            if os.path.exists(c):
                save_config({"project": c})
                return c
    return None


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
        if ext in (".png", ".jpg", ".jpeg", ".webp", ".gif"):
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
