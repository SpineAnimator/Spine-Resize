// Secure Spine Resize adapter over the same least-privilege Native Messaging host.
(function () {
  if (window.spineBridge) return;

  let projectSession = null;
  let imageSession = null;
  const imageSizes = new Map();
  const CHUNK = 96_000;

  function sendToBackground(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (!response || response.ok !== true) {
          reject(new Error(response?.error || "Spine native bridge request failed"));
          return;
        }
        resolve(response.result);
      });
    });
  }

  function decodeBase64(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  async function readChunks(type, params, size) {
    if (!Number.isSafeInteger(size) || size <= 0 || size > 32 * 1024 * 1024) {
      throw new Error("Spine bridge file size limit");
    }
    const output = new Uint8Array(size);
    let offset = 0;
    while (offset < size) {
      const part = await sendToBackground({ type, ...params, offset });
      if (!part || part.offset !== offset || part.total !== size || typeof part.base64 !== "string") {
        throw new Error("Invalid chunk response from Spine native bridge");
      }
      const chunk = decodeBase64(part.base64);
      if (!chunk.length || offset + chunk.length > size) {
        throw new Error("Invalid chunk length from Spine native bridge");
      }
      output.set(chunk, offset);
      offset += chunk.length;
      if (part.done && offset !== size) {
        throw new Error("Truncated file returned by Spine native bridge");
      }
    }
    return Array.from(output);
  }

  window.spineBridge = {
    async getOpenFilePath() {
      const result = await sendToBackground({ type: "GET_OPEN_FILE_PATH" });
      return result?.path || null;
    },

    async getOpenSpineFile() {
      const meta = await sendToBackground({ type: "GET_OPEN_SPINE_FILE" });
      if (!meta?.session || !meta.path || !Number.isSafeInteger(meta.size)) return null;
      projectSession = meta.session;
      const data = await readChunks("READ_PROJECT_CHUNK", { session: projectSession }, meta.size);
      return { path: meta.path, data };
    },

    async getSiblingImages(projectPath) {
      if (!projectSession) throw new Error("Open the Spine project before reading its images");
      const result = await sendToBackground({
        type: "GET_SIBLING_IMAGES",
        projectPath,
        session: projectSession
      });
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
      const data = await readChunks("READ_FILE_CHUNK", { session: imageSession, path }, size);
      return { path, data };
    },

    async saveFile(path, bytes) {
      if (!projectSession) throw new Error("No active Spine project session");
      const input = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
      if (!input.length || input.length > 32 * 1024 * 1024) {
        throw new Error("Spine Resize output size limit");
      }
      const stage = await sendToBackground({
        type: "BEGIN_SAVE", session: projectSession, path, size: input.length
      });
      if (!stage?.stage || !stage.path) throw new Error("Could not start safe Spine Resize save");
      for (let offset = 0; offset < input.length; offset += CHUNK) {
        const chunk = input.subarray(offset, Math.min(input.length, offset + CHUNK));
        let binary = "";
        for (let i = 0; i < chunk.length; i++) binary += String.fromCharCode(chunk[i]);
        await sendToBackground({
          type: "WRITE_SAVE_CHUNK",
          stage: stage.stage,
          offset,
          base64: btoa(binary)
        });
      }
      return sendToBackground({ type: "FINISH_SAVE", stage: stage.stage });
    }
  };

  window.dispatchEvent(new CustomEvent("spine-bridge-ready"));
})();
