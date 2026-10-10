// Background service worker: talks to native messaging host "spinebridge".
let nativePort = null;
let nextId = 1;
const pending = new Map();

function ensurePort() {
  if (nativePort) return nativePort;
  try {
    nativePort = chrome.runtime.connectNative("spinebridge");
    nativePort.onMessage.addListener((msg) => {
      const p = pending.get(msg.id);
      if (p) {
        pending.delete(msg.id);
        if (msg.error) p.reject(new Error(msg.error));
        else p.resolve(msg.result);
      }
    });
    nativePort.onDisconnect.addListener(() => {
      nativePort = null;
      for (const p of pending.values()) p.reject(new Error("native host disconnected"));
      pending.clear();
    });
  } catch (e) {
    nativePort = null;
  }
  return nativePort;
}

async function callNative(method, params) {
  const port = ensurePort();
  if (!port) throw new Error("native host not available");
  const id = nextId++;
  const p = new Promise((resolve, reject) => { pending.set(id, { resolve, reject }); });
  port.postMessage({ id, method, params });
  return Promise.race([
    p,
    new Promise((_, reject) => setTimeout(() => reject(new Error("native timeout")), 5000))
  ]);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      let result;
      switch (msg.type) {
        case "GET_OPEN_FILE_PATH":
          result = await callNative("get_open_file_path", {});
          break;
        case "GET_OPEN_SPINE_FILE":
          result = await callNative("get_open_spine_file", {});
          break;
        case "GET_SIBLING_IMAGES":
          result = await callNative("get_sibling_images", { projectPath: msg.projectPath });
          break;
        case "READ_FILE":
          result = await callNative("read_file", { path: msg.path });
          break;
        case "SAVE_FILE":
          result = await callNative("save_file", { path: msg.path, bytes: Array.from(msg.bytes) });
          break;
        default:
          throw new Error("unknown method " + msg.type);
      }
      sendResponse({ ok: true, result });
    } catch (e) {
      sendResponse({ ok: false, error: String(e && e.message ? e.message : e) });
    }
  })();
  return true;
});
