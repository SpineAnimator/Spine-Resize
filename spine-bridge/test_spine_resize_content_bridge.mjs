import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("./content.js", import.meta.url), "utf8");
const origin = "https://spineanimator.github.io";

function makeWindow() {
  const listeners = new Map();
  const sent = [];
  const window = {
    spineBridge: undefined,
    addEventListener(type, callback) {
      const list = listeners.get(type) || [];
      list.push(callback);
      listeners.set(type, list);
    },
    postMessage(data) { sent.push(data); },
    dispatchMessage(data) {
      for (const callback of listeners.get("message") || []) {
        callback({ source: window, origin, data });
      }
    }
  };
  return { window, sent };
}

test("page-world API uses postMessage and unwraps extension responses", async () => {
  const { window, sent } = makeWindow();
  const context = {
    window, location: { origin }, console,
    setTimeout, clearTimeout, Map, Uint8Array, Array, Date, Promise,
    atob, btoa
  };
  vm.runInNewContext(source, context, { filename: "content.js" });
  assert.equal(typeof window.spineBridge.getOpenFilePath, "function");
  window.dispatchMessage({ channel: "spine-resize-native-v1", type: "ready", version: 1 });

  const pending = window.spineBridge.getOpenFilePath();
  await Promise.resolve();
  const request = sent.findLast(message => message.type === "request");
  assert.ok(request);
  assert.equal(request.method, "get_open_file_path");
  window.dispatchMessage({
    channel: "spine-resize-native-v1", type: "response",
    id: request.id, ok: true, result: { path: "/project/scene.spine" }
  });
  assert.equal(await pending, "/project/scene.spine");
});

test("isolated-world adapter forwards only allowlisted methods to the extension background", () => {
  const { window, sent } = makeWindow();
  const calls = [];
  const chrome = {
    runtime: {
      sendMessage(message, callback) {
        calls.push(message);
        callback({ ok: true, result: { path: "/project/scene.spine" } });
      }
    }
  };
  const context = { window, location: { origin }, chrome, console };
  vm.runInNewContext(source, context, { filename: "content.js" });

  window.dispatchMessage({ channel: "spine-resize-native-v1", type: "hello" });
  assert.equal(sent.at(-1).type, "ready");

  window.dispatchMessage({
    channel: "spine-resize-native-v1", type: "request",
    id: "resize_1", method: "get_open_file_path", params: {}
  });
  assert.equal(JSON.stringify(calls), JSON.stringify([{ type: "GET_OPEN_FILE_PATH" }]));
  assert.equal(JSON.stringify(sent.at(-1)), JSON.stringify({
    channel: "spine-resize-native-v1", type: "response",
    id: "resize_1", ok: true, result: { path: "/project/scene.spine" }, error: null
  }));

  window.dispatchMessage({
    channel: "spine-resize-native-v1", type: "request",
    id: "resize_2", method: "read_arbitrary_file", params: { path: "/etc/passwd" }
  });
  assert.equal(calls.length, 1, "unlisted methods must never reach the native host");
});
