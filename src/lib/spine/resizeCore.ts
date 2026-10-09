import {
  bakeSkelScales,
  floatOf,
  mulFloat,
  readSkel,
  scaleSkel,
  skelSummary,
  skelWorldAABB,
  slotBoneIndex,
  writeSkel,
  type Aabb,
  type SkelIR,
} from "./spineSkel";
import { inflateRaw, measureSpine, scaleSpineFile, type SpineScaleStats } from "./spineProject";

export type { Aabb };

export function fitFactor(box: Aabb, target: number) {
  const m = Math.max(box.width, box.height);
  if (!Number.isFinite(m) || m < 1) return 1;
  return target / m;
}

export function centerOffset(box: Aabb, factor: number) {
  const cx = (box.minX + box.maxX) / 2;
  const cy = (box.minY + box.maxY) / 2;
  return { x: -cx * factor, y: -cy * factor };
}

type Bone = {
  name: string;
  parent?: string;
  x?: number;
  y?: number;
  length?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  shearX?: number;
  shearY?: number;
  inherit?: string;
};
type Att = Record<string, unknown> & {
  type?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  vertices?: number[];
  uvs?: number[];
  lengths?: number[];
};
type Skin = { attachments?: Record<string, Record<string, Att | null>> };
type Slot = { name: string; bone?: string };
type Curve = number[] | string;
type Key = {
  time?: number;
  x?: number;
  y?: number;
  value?: number;
  softness?: number;
  curve?: Curve;
  vertices?: number[];
  offset?: number;
};
type Anim = {
  bones?: Record<string, {
    translate?: Key[];
    scale?: Key[];
    translatex?: Key[];
    translatey?: Key[];
    shear?: Key[];
    shearx?: Key[];
    sheary?: Key[];
  }>;
  slots?: Record<string, Record<string, Key[]>>;
  ik?: Record<string, Key[]>;
  transform?: Record<string, Key[]>;
  path?: Record<string, Record<string, Key[]>>;
  physics?: Record<string, Record<string, Key[]>>;
  deform?: unknown;
  attachments?: Record<string, Record<string, { deform?: Key[] } | Key[]>>;
  drawOrder?: unknown;
  events?: unknown;
};
export type SpineJson = {
  skeleton?: Record<string, unknown>;
  bones: Bone[];
  slots?: Slot[];
  skins?: Skin[];
  animations?: Record<string, Anim>;
  constraints?: Record<string, unknown>[];
  ik?: Record<string, unknown>[];
  transform?: { x?: number; y?: number }[];
  path?: { position?: number; spacing?: number; positionMode?: string; spacingMode?: string }[];
};

function num(v: unknown, d = 0) {
  return typeof v === "number" ? v : d;
}

function weightedInfluences(verts: number[]) {
  const out: { bone: number; xi: number; yi: number }[] = [];
  let i = 0;
  while (i < verts.length) {
    const bc = verts[i];
    if (!Number.isInteger(bc) || bc < 1 || bc > 32) return null;
    i++;
    if (i + bc * 4 > verts.length) return null;
    for (let k = 0; k < bc; k++) {
      const bone = verts[i];
      if (!Number.isInteger(bone) || bone < 0) return null;
      out.push({ bone, xi: i + 1, yi: i + 2 });
      i += 4;
    }
  }
  return out;
}

function scaleCurve(curve: Curve | undefined, sx: number, sy: number) {
  if (!curve || typeof curve === "string" || curve.length < 4) return;
  const dims = Math.floor(curve.length / 4);
  for (let d = 0; d < dims; d++) {
    const m = d === 0 ? sx : sy;
    curve[d * 4 + 1] *= m;
    curve[d * 4 + 3] *= m;
  }
}

function eachAtt(data: SpineJson, fn: (slot: string, att: Att) => void) {
  for (const skin of data.skins ?? []) {
    for (const [slot, atts] of Object.entries(skin.attachments ?? {})) {
      for (const att of Object.values(atts)) if (att) fn(slot, att);
    }
  }
}

/** Parent scale goes to children and attachments. A bone's own scale does not move its x/y. */
export function bakeJsonScales(data: SpineJson) {
  const bones = data.bones ?? [];
  const indexOf = new Map(bones.map((b, i) => [b.name, i]));
  const kids = new Map<string, Bone[]>();
  for (const b of bones) {
    if (!b.parent) continue;
    const list = kids.get(b.parent) ?? [];
    list.push(b);
    kids.set(b.parent, list);
  }
  const slotBone = new Map((data.slots ?? []).map((s) => [s.name, s.bone || "root"]));
  const orig = new Map(bones.map((b) => [b.name, { sx: b.scaleX ?? 1, sy: b.scaleY ?? 1 }]));

  const order: Bone[] = [];
  const seen = new Set<string>();
  const walk = (b: Bone) => {
    if (seen.has(b.name)) return;
    seen.add(b.name);
    if (b.parent) {
      const p = bones.find((x) => x.name === b.parent);
      if (p) walk(p);
    }
    order.push(b);
  };
  for (const b of bones) walk(b);

  const touchVerts = (att: Att, boneName: string, bi: number, sx: number, sy: number, onSlot: boolean) => {
    const verts = att.vertices;
    if (!verts) return;
    const weighted = att.uvs ? verts.length !== att.uvs.length : att.type === "mesh" ? false : null;
    if (weighted === false || (weighted == null && !weightedInfluences(verts))) {
      if (!onSlot) return;
      for (let i = 0; i + 1 < verts.length; i += 2) {
        verts[i] *= sx;
        verts[i + 1] *= sy;
      }
      return;
    }
    const inf = weightedInfluences(verts);
    if (!inf) {
      if (!onSlot) return;
      for (let i = 0; i + 1 < verts.length; i += 2) {
        verts[i] *= sx;
        verts[i + 1] *= sy;
      }
      return;
    }
    for (const p of inf) {
      if (p.bone !== bi) continue;
      verts[p.xi] *= sx;
      verts[p.yi] *= sy;
    }
    void boneName;
  };

  for (const b of order) {
    const sx = b.scaleX ?? 1;
    const sy = b.scaleY ?? 1;
    if (b.length != null) b.length *= sx;
    const bi = indexOf.get(b.name) ?? -1;
    eachAtt(data, (slot, att) => {
      const onSlot = slotBone.get(slot) === b.name;
      if (onSlot && (att.type == null || att.type === "region" || att.type === "point")) {
        if (att.x != null) att.x *= sx;
        if (att.y != null) att.y *= sy;
        if (att.width != null) att.width *= sx;
        if (att.height != null) att.height *= sy;
      }
      touchVerts(att, b.name, bi, sx, sy, onSlot);
    });
    for (const c of kids.get(b.name) ?? []) {
      if ((c.inherit ?? "normal") !== "normal") continue;
      if (c.x != null) c.x *= sx;
      if (c.y != null) c.y *= sy;
      c.scaleX = (c.scaleX ?? 1) * sx;
      c.scaleY = (c.scaleY ?? 1) * sy;
      if (sx !== 1 || sy !== 1) {
        for (const anim of Object.values(data.animations ?? {})) {
          const tl = anim.bones?.[c.name];
          if (!tl) continue;
          for (const k of tl.translate ?? []) {
            if (k.x != null) k.x *= sx;
            if (k.y != null) k.y *= sy;
            scaleCurve(k.curve, sx, sy);
          }
          for (const k of tl.translatex ?? []) if (k.x != null) k.x *= sx;
          for (const k of tl.translatey ?? []) if (k.y != null) k.y *= sy;
        }
      }
    }
    const o = orig.get(b.name)!;
    if (o.sx !== 1 || o.sy !== 1) {
      for (const anim of Object.values(data.animations ?? {})) {
        const tl = anim.bones?.[b.name];
        for (const k of tl?.scale ?? []) {
          if (k.x != null) k.x /= o.sx;
          if (k.y != null) k.y /= o.sy;
          scaleCurve(k.curve, 1 / o.sx, 1 / o.sy);
        }
      }
    }
    b.scaleX = 1;
    b.scaleY = 1;
  }
}

type World = { x: number; y: number; a: number; b: number; c: number; d: number };

function jsonWorld(bones: Bone[]) {
  const byName = new Map(bones.map((b) => [b.name, b]));
  const world = new Map<string, World>();
  const resolve = (name: string): World => {
    const hit = world.get(name);
    if (hit) return hit;
    const b = byName.get(name);
    const parent = b?.parent ? resolve(b.parent) : { x: 0, y: 0, a: 1, b: 0, c: 0, d: 1 };
    if (!b) {
      world.set(name, parent);
      return parent;
    }
    const rot = (num(b.rotation) * Math.PI) / 180;
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    const lsx = b.scaleX ?? 1;
    const lsy = b.scaleY ?? 1;
    const la = cos * lsx;
    const lb = sin * lsx;
    const lc = -sin * lsy;
    const ld = cos * lsy;
    const w: World = {
      x: parent.x + parent.a * num(b.x) + parent.b * num(b.y),
      y: parent.y + parent.c * num(b.x) + parent.d * num(b.y),
      a: parent.a * la + parent.b * lc,
      b: parent.a * lb + parent.b * ld,
      c: parent.c * la + parent.d * lc,
      d: parent.c * lb + parent.d * ld,
    };
    world.set(name, w);
    return w;
  };
  for (const b of bones) resolve(b.name);
  return world;
}

export function jsonAABB(data: SpineJson): Aabb {
  const world = jsonWorld(data.bones ?? []);
  const slotBone = new Map((data.slots ?? []).map((s) => [s.name, s.bone || "root"]));
  const index = new Map((data.bones ?? []).map((b, i) => [i, b.name]));
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const add = (x: number, y: number) => {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  };
  const xform = (wt: World, x: number, y: number) => add(wt.x + wt.a * x + wt.b * y, wt.y + wt.c * x + wt.d * y);
  eachAtt(data, (slot, att) => {
    const wt = world.get(slotBone.get(slot) || "root") ?? { x: 0, y: 0, a: 1, b: 0, c: 0, d: 1 };
    if (att.width != null && att.height != null && att.type !== "mesh") {
      const w = att.width * (att.scaleX ?? 1);
      const h = att.height * (att.scaleY ?? 1);
      const rot = (num(att.rotation) * Math.PI) / 180;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const hw = w / 2;
      const hh = h / 2;
      for (const [cx, cy] of [
        [-hw, -hh],
        [hw, -hh],
        [hw, hh],
        [-hw, hh],
      ] as const) {
        xform(wt, cx * cos - cy * sin + num(att.x), cx * sin + cy * cos + num(att.y));
      }
    }
    const verts = att.vertices;
    if (!verts) return;
    const inf = att.uvs && verts.length !== att.uvs.length ? weightedInfluences(verts) : null;
    if (inf) {
      // group back into vertices: influences share a running bone-count parse
      let i = 0;
      while (i < verts.length) {
        const bc = verts[i++];
        let wx = 0;
        let wy = 0;
        for (let k = 0; k < bc; k++) {
          const bone = verts[i++];
          const x = verts[i++];
          const y = verts[i++];
          const w = verts[i++];
          const bw = world.get(index.get(bone) || "") ?? wt;
          wx += (bw.x + bw.a * x + bw.b * y) * w;
          wy += (bw.y + bw.c * x + bw.d * y) * w;
        }
        add(wx, wy);
      }
    } else {
      for (let i = 0; i + 1 < verts.length; i += 2) xform(wt, verts[i], verts[i + 1]);
    }
  });
  if (!Number.isFinite(minX)) {
    for (const w of world.values()) add(w.x, w.y);
  }
  if (!Number.isFinite(minX)) return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

function scaleDeformTree(node: unknown, s: number) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const key of node) {
      if (!key || typeof key !== "object") continue;
      const rec = key as Key;
      if (Array.isArray(rec.vertices)) for (let i = 0; i < rec.vertices.length; i++) rec.vertices[i] *= s;
      // offset — индекс первой вершины, не координата. Масштаб сдвигает ключ и Spine его пропускает.
    }
    return;
  }
  for (const value of Object.values(node as Record<string, unknown>)) scaleDeformTree(value, s);
}

function mulNum(obj: Record<string, unknown>, key: string, s: number) {
  if (typeof obj[key] === "number") obj[key] = (obj[key] as number) * s;
}

/** Distances Spine's JSON loader multiplies by skeleton scale. Mix, angles and 0–1 weights stay. */
function scaleTransformBody(c: Record<string, unknown>, s: number) {
  mulNum(c, "x", s);
  mulNum(c, "y", s);
  const props = c.properties;
  if (!props || typeof props !== "object" || Array.isArray(props)) return;
  for (const [fromName, fromVal] of Object.entries(props as Record<string, unknown>)) {
    if (!fromVal || typeof fromVal !== "object" || Array.isArray(fromVal)) continue;
    const from = fromVal as Record<string, unknown>;
    const fromS = fromName === "x" || fromName === "y" ? s : 1;
    if (fromS !== 1) mulNum(from, "offset", fromS);
    const to = from.to;
    if (!to || typeof to !== "object" || Array.isArray(to)) continue;
    for (const [toName, toVal] of Object.entries(to as Record<string, unknown>)) {
      if (!toVal || typeof toVal !== "object" || Array.isArray(toVal)) continue;
      const rec = toVal as Record<string, unknown>;
      const toS = toName === "x" || toName === "y" ? s : 1;
      if (toS !== 1) {
        mulNum(rec, "offset", toS);
        mulNum(rec, "max", toS);
      }
      const ratio = fromS === 0 ? 1 : toS / fromS;
      if (ratio !== 1 && typeof rec.scale === "number") rec.scale = (rec.scale as number) * ratio;
    }
  }
}

function scalePhysicsBody(c: Record<string, unknown>, s: number) {
  // x/y are how much translation is affected (0–1), not positions. limit is a distance.
  // wind/gravity are world forces; keys below already scale, setup has to follow.
  mulNum(c, "limit", s);
  mulNum(c, "wind", s);
  mulNum(c, "gravity", s);
}

function scaleSliderBody(c: Record<string, unknown>, s: number) {
  if (c.property !== "x" && c.property !== "y") return;
  mulNum(c, "from", s);
  if (typeof c.scale === "number" && s !== 0) c.scale = (c.scale as number) / s;
}

function scaleConstraintSetup(data: SpineJson, s: number) {
  for (const raw of data.constraints ?? []) {
    const c = raw as Record<string, unknown>;
    if (typeof c.softness === "number") c.softness = (c.softness as number) * s;
    if (c.type === "transform") scaleTransformBody(c, s);
    else if (c.type === "physics") scalePhysicsBody(c, s);
    else if (c.type === "slider") scaleSliderBody(c, s);
    else if (c.type === "path" || c.type == null) {
      const positionMode = c.positionMode;
      const spacingMode = c.spacingMode;
      if (typeof c.position === "number" && positionMode === "fixed") c.position = (c.position as number) * s;
      if (typeof c.spacing === "number" && (spacingMode === "length" || spacingMode === "fixed" || spacingMode == null) && c.type === "path") {
        c.spacing = (c.spacing as number) * s;
      }
    }
  }
  for (const c of data.ik ?? []) {
    if (typeof c.softness === "number") c.softness *= s;
  }
  const legacy = data as SpineJson & { physics?: Record<string, unknown>[] };
  for (const c of legacy.physics ?? []) scalePhysicsBody(c, s);
}

export function scaleJson(data: SpineJson, factor: number, offsetX = 0, offsetY = 0) {
  const s = factor;
  const animNames = Object.keys(data.animations ?? {});
  for (const b of data.bones ?? []) {
    if (b.x != null) b.x *= s;
    if (b.y != null) b.y *= s;
    if (b.length != null) b.length *= s;
  }
  const root = (data.bones ?? []).find((b) => !b.parent) ?? data.bones?.[0];
  if (root && (offsetX || offsetY)) {
    root.x = num(root.x) + offsetX;
    root.y = num(root.y) + offsetY;
  }
  eachAtt(data, (_slot, att) => {
    if (att.x != null) att.x *= s;
    if (att.y != null) att.y *= s;
    if (att.width != null) att.width *= s;
    if (att.height != null) att.height *= s;
    const verts = att.vertices;
    if (verts) {
      const inf = att.uvs && verts.length !== att.uvs.length ? weightedInfluences(verts) : null;
      if (inf) {
        for (const p of inf) {
          verts[p.xi] *= s;
          verts[p.yi] *= s;
        }
      } else {
        for (let i = 0; i < verts.length; i++) verts[i] *= s;
      }
    }
    if (att.lengths) for (let i = 0; i < att.lengths.length; i++) att.lengths[i] *= s;
  });
  for (const anim of Object.values(data.animations ?? {})) {
    for (const tl of Object.values(anim.bones ?? {})) {
      for (const k of tl.translate ?? []) {
        if (k.x != null) k.x *= s;
        if (k.y != null) k.y *= s;
        scaleCurve(k.curve, s, s);
      }
      for (const k of tl.translatex ?? []) {
        if (k.x != null) k.x *= s;
        else if (k.value != null) k.value *= s;
        scaleCurve(k.curve, s, s);
      }
      for (const k of tl.translatey ?? []) {
        if (k.y != null) k.y *= s;
        else if (k.value != null) k.value *= s;
        scaleCurve(k.curve, s, s);
      }
    }
    const attachments = anim.attachments ?? {};
    for (const slot of Object.values(attachments)) {
      if (!slot || typeof slot !== "object") continue;
      for (const tl of Object.values(slot)) {
        if (Array.isArray(tl)) {
          for (const k of tl) if (k?.vertices) for (let i = 0; i < k.vertices.length; i++) k.vertices[i] *= s;
        } else if (tl && Array.isArray(tl.deform)) {
          for (const k of tl.deform) if (k.vertices) for (let i = 0; i < k.vertices.length; i++) k.vertices[i] *= s;
        }
      }
    }
    scaleDeformTree(anim.deform, s);
    for (const keys of Object.values(anim.ik ?? {})) {
      if (!Array.isArray(keys)) continue;
      for (const k of keys) if (typeof k.softness === "number") k.softness *= s;
    }
    const pathMode = new Map<string, { position: string; spacing: string }>();
    const rememberPath = (c: Record<string, unknown>) => {
      if (typeof c.name !== "string") return;
      pathMode.set(c.name, {
        position: typeof c.positionMode === "string" ? c.positionMode : "percent",
        spacing: typeof c.spacingMode === "string" ? c.spacingMode : "length",
      });
    };
    for (const c of data.constraints ?? []) {
      if (c.type === "path") rememberPath(c as Record<string, unknown>);
    }
    for (const c of data.path ?? []) rememberPath(c as Record<string, unknown>);
    for (const [name, constraint] of Object.entries(anim.path ?? {})) {
      if (!constraint || typeof constraint !== "object" || Array.isArray(constraint)) continue;
      const mode = pathMode.get(name);
      if (mode?.position === "fixed") {
        for (const k of constraint.position ?? []) if (typeof k.value === "number") k.value *= s;
      }
      if (mode?.spacing === "length" || mode?.spacing === "fixed") {
        for (const k of constraint.spacing ?? []) if (typeof k.value === "number") k.value *= s;
      }
    }
    for (const constraint of Object.values(anim.physics ?? {})) {
      if (!constraint || typeof constraint !== "object") continue;
      // x/y are influence, not distances. wind/gravity match the setup scale above.
      for (const name of ["wind", "gravity"] as const) {
        const keys = constraint[name];
        if (!Array.isArray(keys)) continue;
        for (const k of keys) if (typeof k.value === "number") k.value *= s;
      }
    }
  }
  scaleConstraintSetup(data, s);
  for (const c of data.transform ?? []) {
    if (c.x != null) c.x *= s;
    if (c.y != null) c.y *= s;
  }
  for (const c of data.path ?? []) {
    if (c.position != null && c.positionMode === "fixed") c.position *= s;
    if (c.spacing != null && (c.spacingMode === "length" || c.spacingMode === "fixed" || c.spacingMode == null)) c.spacing *= s;
  }
  const sk = data.skeleton;
  if (sk) {
    delete sk.hash;
    for (const key of ["x", "y", "width", "height"] as const) {
      if (typeof sk[key] === "number") sk[key] = (sk[key] as number) * s;
    }
  }
  const now = data.animations ?? {};
  if (animNames.length && animNames.some((name) => !now[name] || typeof now[name] !== "object")) {
    throw new Error("animations were dropped");
  }
}

export function scaleAtlas(text: string, factor: number) {
  if (!text || factor === 1) return text;
  return text
    .split(/\r?\n/)
    .map((line) => {
      // Region keys are indented. Spine 4 uses bounds/offsets (4 ints); older files use xy/size/orig/offset.
      const m = line.match(/^(\s*)(bounds|offsets|split|pad|offset|orig|size|xy):(\s*)(.*)$/i);
      if (!m) return line;
      const key = m[2].toLowerCase();
      const nums = m[4].split(",").map((x) => x.trim());
      const count = key === "bounds" || key === "offsets" || key === "split" || key === "pad" ? 4 : 2;
      if (nums.length < count) return line;
      for (let i = 0; i < count; i++) if (nums[i] === "" || Number.isNaN(+nums[i])) return line;
      const scaled = nums.slice(0, count).map((n) => String(Math.round(+n * factor)));
      const tail = nums.slice(count);
      return m[1] + m[2] + ":" + m[3] + scaled.join(",") + (tail.length ? "," + tail.join(",") : "");
    })
    .join("\n");
}

export function resizeSkelBytes(bytes: Uint8Array, opts: { bake: boolean; center: boolean; target: number; factor?: number }) {
  const sk = readSkel(bytes);
  if (opts.bake) bakeSkelScales(sk);
  const box = skelWorldAABB(sk);
  const factor = opts.factor ?? fitFactor(box, opts.target);
  const off = opts.center ? centerOffset(box, factor) : { x: 0, y: 0 };
  scaleSkel(sk, factor, off.x, off.y);
  const out = writeSkel(sk, 1);
  readSkel(out);
  return { bytes: out, factor, box, summary: skelSummary(sk) };
}

export async function resizeSpineBytes(raw: Uint8Array, factor: number) {
  return scaleSpineFile(raw, factor);
}

export async function spineBox(raw: Uint8Array): Promise<Aabb> {
  const inf = await inflateRaw(raw);
  const s = measureSpine(inf).meshSpan;
  return { minX: s.minX, minY: s.minY, maxX: s.maxX, maxY: s.maxY, width: s.width, height: s.height };
}

export function assertScalesOne(sk: SkelIR) {
  for (const b of sk.bones) {
    if (Math.abs(floatOf(b.scaleX) - 1) > 1e-4 || Math.abs(floatOf(b.scaleY) - 1) > 1e-4) return false;
  }
  return true;
}

export { slotBoneIndex };
export type { SpineScaleStats };
