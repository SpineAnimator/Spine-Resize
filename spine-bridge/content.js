// Runs on the Spine Resize page. Exposes window.spineBridge for app.js to call.
(function () {
  if (window.spineBridge) return;

  function sendToBackground(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
        else resolve(response);
      });
    });
  }

  window.spineBridge = {
    // Returns the path of the file currently open in Spine editor, or null.
    async getOpenFilePath() {
      const r = await sendToBackground({ type: "GET_OPEN_FILE_PATH" });
      return r?.path || null;
    },
    // Returns { path, data } for the open .spine file (Uint8Array bytes).
    async getOpenSpineFile() {
      const r = await sendToBackground({ type: "GET_OPEN_SPINE_FILE" });
      return r || null;
    },
    // Saves the given bytes to the given path (overwrites), returns ok.
    async saveFile(path, bytes) {
      const r = await sendToBackground({ type: "SAVE_FILE", path, bytes });
      return !!r?.ok;
    },
    // Returns array of { path, name } sibling image files referenced by the project.
    async getSiblingImages(projectPath) {
      const r = await sendToBackground({ type: "GET_SIBLING_IMAGES", projectPath });
      return r?.images || [];
    },
    // Read a file from disk by path, returns { path, data } or null.
    async readFileByPath(path) {
      const r = await sendToBackground({ type: "READ_FILE", path });
      return r || null;
    }
  };

  window.dispatchEvent(new CustomEvent("spine-bridge-ready"));
})();
