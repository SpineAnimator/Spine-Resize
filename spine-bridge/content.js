// Dual-world bridge: the isolated extension world forwards Native Messaging;
// the page world exposes the window.spineBridge API to the Resize application.
(function () {
  const CHANNEL = "spine-resize-native-v1";
  const MESSAGE_TYPES = {
    ping: "PING",
    get_open_file_path: "GET_OPEN_FILE_PATH",
    get_open_spine_file: "GET_OPEN_SPINE_FILE",
    read_project_chunk: "READ_PROJECT_CHUNK",
    get_sibling_images: "GET_SIBLING_IMAGES",
    read_file_chunk: "READ_FILE_CHUNK",
    begin_resize_save: "BEGIN_SAVE",
    write_resize_save_chunk: "WRITE_SAVE_CHUNK",
    finish_resize_save: "FINISH_SAVE"
  };
  const ALLOWED = new Set(Object.keys(MESSAGE_TYPES));

  // Chrome extension isolated world.
  if (typeof chrome !== "undefined" && chrome.runtime &&
      typeof chrome.runtime.sendMessage === "function") {
    window.addEventListener("message", (event) => {
      if (event.source !== window || event.origin !== location.origin) return;
      const message = event.data;
      if (!message || message.channel !== CHANNEL) return;
      if (message.type === "hello") {
        window.postMessage({ channel: CHANNEL, type: "ready", version: 1 }, location.origin);
        return;
      }
      if (message.type !== "request" || !ALLOWED.has(message.method)) return;
      if (typeof message.id !== "string" || !/^[-a-zA-Z0-9_]{1,90}$/.test(message.id)) return;
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPES[message.method],
        ...(message.params || {})
      }, (answer) => {
        const runtimeError = chrome.runtime.lastError?.message;
        const ok = !runtimeError && answer?.ok === true;
        window.postMessage({
          channel: CHANNEL,
          type: "response",
          id: message.id,
          ok,
          result: answer?.result,
          error: ok ? null : (runtimeError || answer?.error || "Spine native bridge request failed")
        }, location.origin);
      });
    });
    return;
  }

  // Page world. It cannot access chrome.runtime directly; all requests are
  // correlated through postMessage and handled by the isolated content script.
  if (window.spineBridge) return;
  let nextId = 1;
  let extensionReady = false;
  const pending = new Map();
  const readyWaiters = [];
  const imageSizes = new Map();
  let projectSession = null;
  let imageSession = null;
  const CHUNK = 96_000;

  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== location.origin) return;
    const message = event.data;
    if (!message || message.channel !== CHANNEL) return;
    if (message.type === "ready") {
      extensionReady = true;
      while (readyWaiters.length) readyWaiters.shift().resolve();
      return;
    }
    if (message.type !== "response" || typeof message.id !== "string") return;
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    clearTimeout(request.timer);
    if (message.ok) request.resolve(message.result);
    else request.reject(new Error(message.error || "Spine native bridge request failed"));
  });

  function ensureReady() {
    if (extensionReady) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const waiter = { resolve, reject };
      readyWaiters.push(waiter);
      window.postMessage({ channel: CHANNEL, type: "hello" }, location.origin);
      setTimeout(() => {
        const index = readyWaiters.indexOf(waiter);
        if (index >= 0) readyWaiters.splice(index, 1);
        if (!extensionReady) reject(new Error("Spine Resize extension is not installed in this browser"));
      }, 1500);
    });
  }

  async function send(method, params = {}) {
    if (!ALLOWED.has(method)) throw new Error("Unsupported Spine bridge method");
    await ensureReady();
    return new Promise((resolve, reject) => {
      const id = "resize_" + Date.now() + "_" + nextId++;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error("Spine native bridge request timed out"));
      }, 60_000);
      pending.set(id, { resolve, reject, timer });
      window.postMessage({ channel: CHANNEL, type: "request", id, method, params }, location.origin);
    });
  }

  function decodeBase64(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  async function readChunks(method, params, size) {
    if (!Number.isSafeInteger(size) || size <= 0 || size > 32 * 1024 * 1024) {
      throw new Error("Spine bridge file size limit");
    }
    const output = new Uint8Array(size);
    let offset = 0;
    while (offset < size) {
      const part = await send(method, { ...params, offset });
      if (!part || part.offset !== offset || part.total !== size || typeof part.base64 !== "string") {
        throw new Error("Invalid chunk response from Spine native bridge");
      }
      const chunk = decodeBase64(part.base64);
      if (!chunk.length || offset + chunk.length > size) {
        throw new Error("Invalid chunk length from Spine native bridge");
      }
      output.set(chunk, offset);
      offset += chunk.length;
      if (part.done && offset !== size) throw new Error("Truncated file returned by Spine native bridge");
    }
    return Array.from(output);
  }

  window.spineBridge = {
    async getOpenFilePath() {
      const result = await send("get_open_file_path");
      return result?.path || null;
    },

    async getOpenSpineFile() {
      const meta = await send("get_open_spine_file");
      if (!meta?.session || !meta.path || !Number.isSafeInteger(meta.size)) return null;
      projectSession = meta.session;
      const data = await readChunks("read_project_chunk", { session: projectSession }, meta.size);
      return { path: meta.path, data };
    },

    async getSiblingImages(projectPath) {
      if (!projectSession) throw new Error("Open the Spine project before reading its images");
      const result = await send("get_sibling_images", { projectPath, session: projectSession });
      imageSession = result?.session || projectSession;
      imageSizes.clear();
      const images = Array.isArray(result?.images) ? result.images : [];
      for (const item of images) {
        if (item?.path && Number.isSafeInteger(item.size) && item.size > 0) {
          imageSizes.set(item.path, item.size);
        }
      }
      return images.map(({ path, name, size }) => ({ path, name, size }));
    },

    async readFileByPath(path) {
      const size = imageSizes.get(path);
      if (!imageSession || !size) return null;
      const data = await readChunks("read_file_chunk", { session: imageSession, path }, size);
      return { path, data };
    },

    async saveFile(path, bytes) {
      if (!projectSession) throw new Error("No active Spine project session");
      const input = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
      if (!input.length || input.length > 32 * 1024 * 1024) throw new Error("Spine Resize output size limit");
      const stage = await send("begin_resize_save", {
        session: projectSession, path, size: input.length
      });
      if (!stage?.stage || !stage.path) throw new Error("Could not start safe Spine Resize save");
      for (let offset = 0; offset < input.length; offset += CHUNK) {
        const chunk = input.subarray(offset, Math.min(input.length, offset + CHUNK));
        let binary = "";
        for (let i = 0; i < chunk.length; i++) binary += String.fromCharCode(chunk[i]);
        await send("write_resize_save_chunk", {
          stage: stage.stage, offset, base64: btoa(binary)
        });
      }
      return send("finish_resize_save", { stage: stage.stage });
    }
  };

  // Handshake after the page API is ready; this also works when the extension
  // content script was injected before this file was loaded by the page.
  window.postMessage({ channel: CHANNEL, type: "hello" }, location.origin);
})();
