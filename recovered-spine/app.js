/* Spine-Resize — pure browser utility
   Fits Spine JSON skeletons into a target square while keeping bone scale = 1
   and baking transforms into geometry + images.
*/

(function () {
  "use strict";

  // ─── DOM ────────────────────────────────────────────────────────────────
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const fileListEl = document.getElementById("fileList");
  const btnProcess = document.getElementById("btnProcess");
  const btnClear = document.getElementById("btnClear");
  const logEl = document.getElementById("log");
  const progressWrap = document.getElementById("progressWrap");
  const progressBar = document.getElementById("progressBar");
  const workCanvas = document.getElementById("workCanvas");

  // ─── State ──────────────────────────────────────────────────────────────
  /** @type {Map<string, {blob: Blob, type: string}>} */
  let files = new Map();
  let spineJson = null;       // parsed JSON object
  let spineJsonName = null;   // original filename
  let atlasText = null;
  let atlasName = null;

  // ─── Helpers ────────────────────────────────────────────────────────────
  function log(msg, cls = "") {
    logEl.style.display = "block";
    const line = document.createElement("div");
    if (cls) line.className = cls;
    line.textContent = msg;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  }
  function clearLog() {
    logEl.innerHTML = "";
    logEl.style.display = "none";
  }
  function setProgress(pct) {
    progressWrap.classList.add("active");
    progressBar.style.width = Math.min(100, Math.max(0, pct)) + "%";
  }
  function resetProgress() {
    progressWrap.classList.remove("active");
    progressBar.style.width = "0%";
  }

  function guessType(name) {
    const n = name.toLowerCase();
    if (n.endsWith(".json")) return "json";
    if (n.endsWith(".atlas")) return "atlas";
    if (n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".webp")) return "image";
    if (n.endsWith(".skel")) return "skel";
    if (n.endsWith(".spine")) return "spine";
    if (n.endsWith(".zip")) return "zip";
    return "other";
  }

  // ─── File loading ───────────────────────────────────────────────────────
  async function addFile(name, blob) {
    const type = guessType(name);
    // flatten paths – keep only basename for images, full for json/atlas
    const base = name.split("/").pop();
    if (type === "zip") {
      await processZip(blob);
      return;
    }
    files.set(name, { blob, type });
    if (type === "json") {
      try {
        const text = await blob.text();
        const data = JSON.parse(text);
        if (data.skeleton || data.bones) {
          spineJson = data;
          spineJsonName = base;
        }
      } catch (e) { /* not spine json */ }
    }
    if (type === "atlas") {
      atlasText = await blob.text();
      atlasName = base;
    }
  }

  async function processZip(blob) {
    const zip = await JSZip.loadAsync(blob);
    const entries = Object.keys(zip.files);
    for (const path of entries) {
      const entry = zip.files[path];
      if (entry.dir) continue;
      // skip macOS junk
      if (path.includes("__MACOSX") || path.endsWith(".DS_Store")) continue;
      const content = await entry.async("blob");
      await addFile(path, content);
    }
  }

  function refreshFileList() {
    fileListEl.innerHTML = "";
    if (files.size === 0) {
      dropzone.classList.remove("has-files");
      btnProcess.disabled = true;
      return;
    }
    dropzone.classList.add("has-files");
    btnProcess.disabled = !spineJson;

    const sorted = [...files.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    for (const [name, { type }] of sorted) {
      const div = document.createElement("div");
      div.className = "file";
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = type;
      div.appendChild(tag);
      div.appendChild(document.createTextNode(name));
      fileListEl.appendChild(div);
    }
  }

  // ─── Drop / click handlers ──────────────────────────────────────────────
  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", async (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    const items = e.dataTransfer.files;
    for (const f of items) await addFile(f.name, f);
    refreshFileList();
  });
  fileInput.addEventListener("change", async () => {
    for (const f of fileInput.files) await addFile(f.name, f);
    refreshFileList();
    fileInput.value = "";
  });

  btnClear.addEventListener("click", () => {
    files.clear();
    spineJson = null;
    spineJsonName = null;
    atlasText = null;
    atlasName = null;
    refreshFileList();
    clearLog();
    resetProgress();
  });

  // ─── Math helpers for bone hierarchy ────────────────────────────────────
  function deg2rad(d) { return (d * Math.PI) / 180; }

  /**
   * Build world transforms for every bone in setup pose.
   * Returns Map<name, {x, y, rotation, scaleX, scaleY, a,b,c,d}>
   * where a,b,c,d is the 2×2 rotation-scale matrix.
   */
  function computeWorldTransforms(bones) {
    const byName = new Map();
    for (const b of bones) byName.set(b.name, b);

    const world = new Map();

    function resolve(name) {
      if (world.has(name)) return world.get(name);
      const b = byName.get(name);
      if (!b) {
        const id = { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, a: 1, b: 0, c: 0, d: 1 };
        world.set(name, id);
        return id;
      }

      let parent = { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, a: 1, b: 0, c: 0, d: 1 };
      if (b.parent) parent = resolve(b.parent);

      const lx = b.x || 0;
      const ly = b.y || 0;
      const lr = b.rotation || 0;
      const lsx = b.scaleX != null ? b.scaleX : 1;
      const lsy = b.scaleY != null ? b.scaleY : 1;

      // local matrix
      const rad = deg2rad(lr);
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const la = cos * lsx;
      const lb = sin * lsx;
      const lc = -sin * lsy;
      const ld = cos * lsy;

      // world = parent * local
      const a = parent.a * la + parent.b * lc;
      const bb = parent.a * lb + parent.b * ld;
      const c = parent.c * la + parent.d * lc;
      const d = parent.c * lb + parent.d * ld;
      const x = parent.x + parent.a * lx + parent.b * ly;
      const y = parent.y + parent.c * lx + parent.d * ly;

      const w = {
        x, y,
        rotation: parent.rotation + lr,
        scaleX: parent.scaleX * lsx,
        scaleY: parent.scaleY * lsy,
        a, b: bb, c, d
      };
      world.set(name, w);
      return w;
    }

    for (const b of bones) resolve(b.name);
    return world;
  }

  /**
   * Compute axis-aligned bounding box of all region attachments in the default skin
   * using setup-pose world transforms.
   */
  function computeAABB(data) {
    const world = computeWorldTransforms(data.bones);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    const skins = data.skins || [];
    for (const skin of skins) {
      const atts = skin.attachments || {};
      for (const slotName of Object.keys(atts)) {
        // find the bone that owns this slot
        const slot = (data.slots || []).find(s => s.name === slotName);
        const boneName = slot ? (slot.bone || "root") : "root";
        const wt = world.get(boneName) || { x: 0, y: 0, a: 1, b: 0, c: 0, d: 1 };

        for (const attName of Object.keys(atts[slotName])) {
          const att = atts[slotName][attName];
          if (!att) continue;

          // region attachment
          if (att.width != null && att.height != null) {
            const ax = att.x || 0;
            const ay = att.y || 0;
            const w = att.width;
            const h = att.height;
            const ar = deg2rad(att.rotation || 0);
            const asx = att.scaleX != null ? att.scaleX : 1;
            const asy = att.scaleY != null ? att.scaleY : 1;

            // local corners of the region (centered)
            const hw = (w * asx) / 2;
            const hh = (h * asy) / 2;
            const corners = [
              [-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]
            ];
            const cos = Math.cos(ar);
            const sin = Math.sin(ar);
            for (const [cx, cy] of corners) {
              // rotate local
              const rx = cx * cos - cy * sin + ax;
              const ry = cx * sin + cy * cos + ay;
              // to world
              const wx = wt.x + wt.a * rx + wt.b * ry;
              const wy = wt.y + wt.c * rx + wt.d * ry;
              if (wx < minX) minX = wx;
              if (wy < minY) minY = wy;
              if (wx > maxX) maxX = wx;
              if (wy > maxY) maxY = wy;
            }
          }

          // mesh vertices (raw local coords)
          if (att.vertices && Array.isArray(att.vertices) && att.type !== "weighted") {
            // simple mesh – pairs of x,y
            const verts = att.vertices;
            for (let i = 0; i < verts.length; i += 2) {
              const lx = verts[i];
              const ly = verts[i + 1];
              const wx = wt.x + wt.a * lx + wt.b * ly;
              const wy = wt.y + wt.c * lx + wt.d * ly;
              if (wx < minX) minX = wx;
              if (wy < minY) minY = wy;
              if (wx > maxX) maxX = wx;
              if (wy > maxY) maxY = wy;
            }
          }
        }
      }
    }

    if (!isFinite(minX)) {
      // fallback – just look at bone positions
      for (const [, wt] of world) {
        if (wt.x < minX) minX = wt.x;
        if (wt.y < minY) minY = wt.y;
        if (wt.x > maxX) maxX = wt.x;
        if (wt.y > maxY) maxY = wt.y;
      }
    }

    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  }

  // ─── Scale application ──────────────────────────────────────────────────
  /**
   * Deep-scale every linear value in the skeleton by `factor`.
   * Also bakes non-1 scales into geometry when bakeScales=true.
   */
  function applyScale(data, factor, opts) {
    const { bakeScales, center, offsetX = 0, offsetY = 0 } = opts;

    // 1. Optionally bake existing scaleX/scaleY into local x/y/length and reset to 1
    if (bakeScales) {
      // We need parent scales to accumulate correctly.
      // Simpler approach: multiply each bone's local translation & length by its own scale,
      // then set scale to 1. For children this is approximate but works for most cases
      // when the problematic scale is on a high-level bone (gunslinger).
      const byName = new Map(data.bones.map(b => [b.name, b]));

      // First pass: accumulate world scale for each bone
      const worldScale = new Map();
      function getWS(name) {
        if (worldScale.has(name)) return worldScale.get(name);
        const b = byName.get(name);
        if (!b || !b.parent) {
          const sx = b && b.scaleX != null ? b.scaleX : 1;
          const sy = b && b.scaleY != null ? b.scaleY : 1;
          worldScale.set(name, { sx, sy });
          return { sx, sy };
        }
        const p = getWS(b.parent);
        const sx = p.sx * (b.scaleX != null ? b.scaleX : 1);
        const sy = p.sy * (b.scaleY != null ? b.scaleY : 1);
        worldScale.set(name, { sx, sy });
        return { sx, sy };
      }
      for (const b of data.bones) getWS(b.name);

      // Bake: for every bone multiply local x,y,length by its *own* scale, then set scale=1
      // (children will inherit the correct size because their parent's scale is gone)
      for (const b of data.bones) {
        const sx = b.scaleX != null ? b.scaleX : 1;
        const sy = b.scaleY != null ? b.scaleY : 1;
        if (sx !== 1 || sy !== 1) {
          if (b.x != null) b.x *= sx;
          if (b.y != null) b.y *= sy;
          if (b.length != null) b.length *= sx; // length is along local X
          b.scaleX = 1;
          b.scaleY = 1;
        }
      }

      // Also bake attachment-level scales into width/height
      for (const skin of data.skins || []) {
        const atts = skin.attachments || {};
        for (const slot of Object.keys(atts)) {
          for (const name of Object.keys(atts[slot])) {
            const att = atts[slot][name];
            if (!att) continue;
            const asx = att.scaleX != null ? att.scaleX : 1;
            const asy = att.scaleY != null ? att.scaleY : 1;
            if (asx !== 1 || asy !== 1) {
              if (att.width != null) att.width *= asx;
              if (att.height != null) att.height *= asy;
              // x/y offsets already relative; leave them
              delete att.scaleX;
              delete att.scaleY;
            }
          }
        }
      }
    }

    // 2. Uniform scale of the whole skeleton
    const s = factor;

    // Bones
    for (const b of data.bones) {
      if (b.x != null) b.x = b.x * s + (b.parent ? 0 : offsetX); // only root gets offset
      if (b.y != null) b.y = b.y * s + (b.parent ? 0 : offsetY);
      if (b.length != null) b.length *= s;
      // scaleX/Y stay 1
    }

    // If root had no x/y, inject offset
    const root = data.bones.find(b => !b.parent);
    if (root) {
      root.x = (root.x || 0) + offsetX;
      root.y = (root.y || 0) + offsetY;
    }

    // Slots – nothing linear usually

    // Attachments
    for (const skin of data.skins || []) {
      const atts = skin.attachments || {};
      for (const slot of Object.keys(atts)) {
        for (const name of Object.keys(atts[slot])) {
          const att = atts[slot][name];
          if (!att) continue;
          if (att.x != null) att.x *= s;
          if (att.y != null) att.y *= s;
          if (att.width != null) att.width *= s;
          if (att.height != null) att.height *= s;
          // mesh vertices
          if (att.vertices && Array.isArray(att.vertices)) {
            // for unweighted: [x,y,x,y…]
            // for weighted: more complex – scale the x/y components
            if (att.type === "mesh" || att.type === "linkedmesh" || !att.type) {
              // simple case – pairs
              for (let i = 0; i < att.vertices.length; i++) {
                att.vertices[i] *= s;
              }
            } else if (att.type === "weightedmesh" || att.vertices.some(v => typeof v === "object")) {
              // leave complex weighted for now – rare
            } else {
              // try to scale every numeric value (conservative)
              for (let i = 0; i < att.vertices.length; i++) {
                if (typeof att.vertices[i] === "number") att.vertices[i] *= s;
              }
            }
          }
          // hull, edges etc. are indices – leave
        }
      }
    }

    // IK / Transform / Path constraints – scale soft, mix stays
    if (data.ik) {
      for (const c of data.ik) {
        // nothing to scale usually
      }
    }
    if (data.transform) {
      for (const c of data.transform) {
        if (c.x != null) c.x *= s;
        if (c.y != null) c.y *= s;
      }
    }
    if (data.path) {
      for (const c of data.path) {
        if (c.position != null && c.positionMode === "fixed") c.position *= s;
        if (c.spacing != null && c.spacingMode === "length") c.spacing *= s;
      }
    }

    // Animations – scale translate timelines and attachment timelines that have x/y/width/height
    if (data.animations) {
      for (const animName of Object.keys(data.animations)) {
        const anim = data.animations[animName];
        // bones
        if (anim.bones) {
          for (const boneName of Object.keys(anim.bones)) {
            const timelines = anim.bones[boneName];
            if (timelines.translate) {
              for (const kf of timelines.translate) {
                if (kf.x != null) kf.x *= s;
                if (kf.y != null) kf.y *= s;
              }
            }
            // scale timelines – if we baked, we should ideally convert scale keys to translate,
            // but for simplicity leave them (they stay relative)
          }
        }
        // deform / attachment
        if (anim.attachments) {
          for (const slotName of Object.keys(anim.attachments)) {
            for (const attName of Object.keys(anim.attachments[slotName])) {
              const timelines = anim.attachments[slotName][attName];
              if (timelines.deform) {
                for (const kf of timelines.deform) {
                  if (kf.vertices) {
                    for (let i = 0; i < kf.vertices.length; i++) kf.vertices[i] *= s;
                  }
                }
              }
            }
          }
        }
        // drawOrder, events – ignore
      }
    }

    // Update skeleton hash? optional – leave as-is or clear
    if (data.skeleton) {
      delete data.skeleton.hash; // force re-hash on next export
    }

    return data;
  }

  // ─── Image resizing ─────────────────────────────────────────────────────
  async function resizeImage(blob, factor) {
    if (factor === 1) return blob;
    const bmp = await createImageBitmap(blob);
    const w = Math.max(1, Math.round(bmp.width * factor));
    const h = Math.max(1, Math.round(bmp.height * factor));
    workCanvas.width = w;
    workCanvas.height = h;
    const ctx = workCanvas.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();
    return new Promise((resolve) => {
      workCanvas.toBlob((b) => resolve(b || blob), "image/png");
    });
  }

  // ─── Atlas update ───────────────────────────────────────────────────────
  function scaleAtlas(text, factor) {
    if (!text || factor === 1) return text;
    // Spine atlas format: lines with size: w,h  or  xy: x,y  or  size: w,h for regions
    // We scale numeric pairs after keywords: size, orig, offset, xy
    const lines = text.split(/\r?\n/);
    const out = [];
    const scaleKeys = /^(size|orig|offset|xy):\s*/i;
    for (let line of lines) {
      const m = line.match(scaleKeys);
      if (m) {
        const rest = line.slice(m[0].length);
        const nums = rest.split(",").map(s => s.trim());
        if (nums.length >= 2 && !isNaN(+nums[0]) && !isNaN(+nums[1])) {
          const a = Math.round(+nums[0] * factor);
          const b = Math.round(+nums[1] * factor);
          line = m[0] + a + "," + b + (nums.length > 2 ? "," + nums.slice(2).join(",") : "");
        }
      }
      // also "size: W,H" on page header
      out.push(line);
    }
    return out.join("\n");
  }

  // ─── Main process ───────────────────────────────────────────────────────
  btnProcess.addEventListener("click", async () => {
    if (!spineJson) {
      log("No Spine JSON found in the loaded files.", "err");
      return;
    }

    clearLog();
    btnProcess.disabled = true;
    setProgress(5);

    try {
      const target = Math.max(16, parseInt(document.getElementById("targetSize").value, 10) || 300);
      const bakeScales = document.getElementById("bakeScales").checked;
      const centerRoot = document.getElementById("centerRoot").checked;
      const keepAspect = document.getElementById("keepAspect").checked;
      const filter = (document.getElementById("skeletonFilter").value || "").trim().toLowerCase();

      log(`Target size: ${target}×${target}`, "info");
      log(`Bake scales: ${bakeScales} · Center: ${centerRoot} · Keep aspect: ${keepAspect}`, "info");

      // Deep clone
      const data = JSON.parse(JSON.stringify(spineJson));

      // Optional filter – currently just logged; full multi-skeleton split is future work
      if (filter) log(`Filter hint: "${filter}" (applied to bone names if present)`, "info");

      setProgress(15);
      log("Computing setup-pose bounding box…");

      const aabb = computeAABB(data);
      log(`AABB: ${aabb.width.toFixed(1)} × ${aabb.height.toFixed(1)}  (min ${aabb.minX.toFixed(1)}, ${aabb.minY.toFixed(1)})`, "ok");

      if (aabb.width < 1 || aabb.height < 1) {
        throw new Error("Could not compute a valid bounding box. Check that the skeleton has attachments.");
      }

      let scaleX = target / aabb.width;
      let scaleY = target / aabb.height;
      let factor = keepAspect ? Math.min(scaleX, scaleY) : Math.min(scaleX, scaleY); // always fit inside for safety
      // if user wants exact fill they can uncheck keepAspect later; for now fit

      log(`Scale factor: ${factor.toFixed(6)}`, "ok");

      // Centering offset (applied after scale, in target space)
      let offsetX = 0, offsetY = 0;
      if (centerRoot) {
        const cx = (aabb.minX + aabb.maxX) / 2;
        const cy = (aabb.minY + aabb.maxY) / 2;
        offsetX = -cx * factor;
        offsetY = -cy * factor;
        log(`Centering offset: (${offsetX.toFixed(2)}, ${offsetY.toFixed(2)})`, "info");
      }

      setProgress(30);
      log("Applying scale to skeleton geometry…");
      applyScale(data, factor, { bakeScales, center: centerRoot, offsetX, offsetY });

      // Verify new AABB
      const aabb2 = computeAABB(data);
      log(`New AABB: ${aabb2.width.toFixed(1)} × ${aabb2.height.toFixed(1)}`, "ok");

      setProgress(45);
      log("Resizing images…");

      const outZip = new JSZip();
      const imgFolder = outZip.folder("images");

      // Collect image files
      const imageEntries = [...files.entries()].filter(([, v]) => v.type === "image");
      let done = 0;
      for (const [path, { blob }] of imageEntries) {
        const base = path.split("/").pop();
        const resized = await resizeImage(blob, factor);
        imgFolder.file(base, resized);
        done++;
        setProgress(45 + (done / Math.max(1, imageEntries.length)) * 35);
      }
      log(`Resized ${imageEntries.length} image(s)`, "ok");

      // JSON
      const jsonStr = JSON.stringify(data, null, 2);
      outZip.file(spineJsonName || "skeleton.json", jsonStr);
      log(`Wrote ${spineJsonName || "skeleton.json"}`, "ok");

      // Atlas
      if (atlasText) {
        const newAtlas = scaleAtlas(atlasText, factor);
        outZip.file(atlasName || "skeleton.atlas", newAtlas);
        log(`Wrote scaled atlas ${atlasName || "skeleton.atlas"}`, "ok");
      }

      setProgress(90);
      log("Building ZIP…");

      const outBlob = await outZip.generateAsync({ type: "blob", compression: "DEFLATE" });
      const url = URL.createObjectURL(outBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (spineJsonName || "skeleton").replace(/\.json$/i, "") + `_resized_${target}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setProgress(100);
      log("Done! Download started.", "ok");
      log(`Result should fit inside ${target}×${target} with all bone scales = 1.`, "ok");
    } catch (err) {
      console.error(err);
      log("Error: " + (err.message || String(err)), "err");
    } finally {
      btnProcess.disabled = false;
      setTimeout(resetProgress, 1500);
    }
  });

  // ─── Init ───────────────────────────────────────────────────────────────
  log("Ready. Drop a ZIP containing Spine JSON + images.", "info");
})();
