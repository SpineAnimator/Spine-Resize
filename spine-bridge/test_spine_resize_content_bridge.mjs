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
  await new Promise(resolve => setTimeout(resolve, 0));
  const request = sent.findLast(message => message.type === "request");
  assert.ok(request);
  assert.equal(request.method, "get_open_file_path");
  window.dispatchMessage({
    channel: "spine-resize-native-v1", type: "response",
    id: request.id, ok: true, result: { path: "/project/scene.spine" }
  });
  assert.equal(await pending, "/project/scene.spine");
});

test("page-world API streams the project, referenced images and safe ZIP save", async () => {
  const { window, sent } = makeWindow();
  const context = {
    window, location: { origin }, console,
    setTimeout, clearTimeout, Map, Uint8Array, Array, Date, Promise,
    atob, btoa
  };
  vm.runInNewContext(source, context, { filename: "content.js" });
  window.dispatchMessage({ channel: "spine-resize-native-v1", type: "ready", version: 1 });

  const flush = () => new Promise(resolve => setTimeout(resolve, 0));
  const answer = async (method, result) => {
    await flush();
    const request = sent.findLast(message => message.type === "request" && message.method === method);
    assert.ok(request, "missing request " + method);
    window.dispatchMessage({
      channel: "spine-resize-native-v1", type: "response",
      id: request.id, ok: true, result
    });
  };

  const projectPromise = window.spineBridge.getOpenSpineFile();
  await answer("get_open_spine_file", {
    path: "/project/scene.spine", session: "session-1", size: 3
  });
  await answer("read_project_chunk", {
    offset: 0, total: 3, base64: "AQID", done: true
  });
  const project = await projectPromise;
  assert.equal(JSON.stringify(project.data), JSON.stringify([1, 2, 3]));

  const imagesPromise = window.spineBridge.getSiblingImages(project.path);
  await answer("get_sibling_images", {
    session: "session-1",
    images: [{ path: "/project/images/face.png", name: "face.png", size: 2 }]
  });
  const images = await imagesPromise;
  assert.equal(images.length, 1);

  const imagePromise = window.spineBridge.readFileByPath(images[0].path);
  await answer("read_file_chunk", {
    path: images[0].path, offset: 0, total: 2, base64: "BAU=", done: true
  });
  const image = await imagePromise;
  assert.equal(JSON.stringify(image.data), JSON.stringify([4, 5]));

  const savePromise = window.spineBridge.saveFile(
    project.path, new Uint8Array([7, 8, 9]), "scene.resized.zip"
  );
  await answer("begin_resize_save", {
    stage: "save-1", path: "/project/SpineResizeResults/scene.resized.zip"
  });
  await answer("write_resize_save_chunk", { written: 3, expected: 3 });
  await answer("finish_resize_save", {
    ok: true, path: "/project/SpineResizeResults/scene.resized.zip"
  });
  const saved = await savePromise;
  assert.equal(saved.ok, true);
  assert.match(saved.path, /SpineResizeResults/);
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
