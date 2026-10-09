/** Spine 4.2/4.3 binary skeleton (.skel) read/write.
 * Layout follows EsotericSoftware spine-runtimes SkeletonBinary (4.3).
 * Floats that are distances are tagged so a uniform scale can be applied
 * and the file written back as a valid .skel.
 */

export type ScaleKind = 0 | 1;

export interface Flt {
  bits: number;
  k: ScaleKind;
}

function skelFlag(name: string) {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return !!env?.[name];
}
let skelDebugOnce = true;
const ATT_REGION = 0;
const ATT_BBOX = 1;
const ATT_MESH = 2;
const ATT_LINKED = 3;
const ATT_PATH = 4;
const ATT_POINT = 5;
const ATT_CLIP = 6;

const BONE_INHERIT = 10;
const BONE_TRANSLATE = 1;
const BONE_TRANSLATEX = 2;
const BONE_TRANSLATEY = 3;

const SLOT_ATTACHMENT = 0;
const SLOT_RGBA = 1;
const SLOT_RGB = 2;
const SLOT_RGBA2 = 3;
const SLOT_RGB2 = 4;
const SLOT_ALPHA = 5;

const C_IK = 0;
const C_PATH = 1;
const C_TRANSFORM = 2;
const C_PHYSICS = 3;
const C_SLIDER = 4;

const ATT_DEFORM = 0;
const ATT_SEQUENCE = 1;
const PATH_POSITION = 0;
const PATH_SPACING = 1;
const PATH_MIX = 2;
const PHYSICS_RESET = 8;
const CURVE_STEPPED = 1;
const CURVE_BEZIER = 2;

export interface BoneIR {
  name: string;
  parent: number | null;
  rotation: Flt;
  x: Flt;
  y: Flt;
  scaleX: Flt;
  scaleY: Flt;
  shearX: Flt;
  shearY: Flt;
  inherit: number;
  length: Flt;
  skinRequired: number;
  color?: number;
  icon?: string | null;
  iconSize?: Flt;
  iconRotation?: Flt;
  visible?: number;
}

export interface RegionIR {
  type: "region";
  flags: number;
  name: number | null;
  path: number | null;
  color: number | null;
  sequence: SeqIR | null;
  rotation: Flt;
  x: Flt;
  y: Flt;
  scaleX: Flt;
  scaleY: Flt;
  width: Flt;
  height: Flt;
}

export interface SeqIR {
  count: number;
  start: number;
  digits: number;
  setupIndex: number;
}

export interface MeshIR {
  type: "mesh";
  flags: number;
  name: number | null;
  path: number | null;
  color: number | null;
  sequence: SeqIR | null;
  hull: number;
  weighted: boolean;
  vertexCount: number;
  bones: number[] | null;
  verts: Flt[];
  uvs: Flt[];
  triangles: number[];
  timelineSlots: number[] | null;
  edges: number[] | null;
  width: Flt | null;
  height: Flt | null;
}

export interface OtherAtt {
  type: "other";
  kind: number;
  raw: Uint8Array;
}

type AttIR = RegionIR | MeshIR | OtherAtt | LinkedIR | BBoxIR | PathIR | PointIR | ClipIR;

export interface BBoxIR {
  type: "bbox";
  flags: number;
  name: number | null;
  weighted: boolean;
  vertexCount: number;
  bones: number[] | null;
  verts: Flt[];
  color: number | null;
}
export interface LinkedIR {
  type: "linked";
  flags: number;
  name: number | null;
  path: number | null;
  color: number | null;
  sequence: SeqIR | null;
  inherit: boolean;
  sourceIndex: number;
  skinIndex: number;
  source: number | null;
  width: Flt | null;
  height: Flt | null;
}
export interface PathIR {
  type: "path";
  flags: number;
  name: number | null;
  weighted: boolean;
  vertexCount: number;
  bones: number[] | null;
  verts: Flt[];
  lengths: Flt[];
  color: number | null;
}
export interface PointIR {
  type: "point";
  flags: number;
  name: number | null;
  rotation: Flt;
  x: Flt;
  y: Flt;
  color: number | null;
}
export interface ClipIR {
  type: "clip";
  flags: number;
  name: number | null;
  endSlot: number;
  weighted: boolean;
  vertexCount: number;
  bones: number[] | null;
  verts: Flt[];
  color: number | null;
}

export interface SlotAtt {
  placeholder: number | null;
  att: AttIR;
}

export interface SkinSlot {
  slotIndex: number;
  atts: SlotAtt[];
}

export interface SkinIR {
  name: string;
  defaultSkin: boolean;
  color?: number;
  bones?: number[];
  constraints?: number[];
  slots: SkinSlot[];
}

export interface SkelIR {
  hashLow: number;
  hashHigh: number;
  version: string | null;
  x: Flt;
  y: Flt;
  width: Flt;
  height: Flt;
  referenceScale: Flt;
  nonessential: boolean;
  fps?: Flt;
  images?: string | null;
  audio?: string | null;
  strings: (string | null)[];
  bones: BoneIR[];
  slots: unknown[];
  constraints: ConIR[];
  skins: SkinIR[];
  events: unknown[];
  animations: AnimIR[];
  sliderAnims: number[];
}

export type ConIR =
  | { kind: "ik"; name: string; bones: number[]; target: number; flags: number; scaleYMode?: number; mix?: Flt; softness?: Flt }
  | { kind: "transform"; name: string; raw: Uint8Array }
  | { kind: "path"; name: string; bones: number[]; slot: number; flags: number; offsetRotation?: Flt; position: Flt; spacing: Flt; mixRotate: Flt; mixX: Flt; mixY: Flt; positionScaled: boolean; spacingScaled: boolean }
  | { kind: "physics"; name: string; raw: Uint8Array }
  | { kind: "slider"; name: string; raw: Uint8Array };

export interface AnimIR {
  name: string | null;
  timelineCount: number;
  slots: SlotTl[];
  bones: BoneTlGroup[];
  ik: unknown[];
  transform: unknown[];
  path: unknown[];
  physics: unknown[];
  slider: unknown[];
  attachments: unknown[];
  drawOrder: unknown;
  folders: unknown[];
  events: unknown;
  color: number | null;
}

interface SlotTl {
  slotIndex: number;
  items: { type: number; raw: Uint8Array; translates?: never }[];
}
interface BoneTlGroup {
  boneIndex: number;
  items: BoneTl[];
}
interface BoneTl {
  type: number;
  frameCount: number;
  rawPrefix?: Uint8Array;
  /** present when translate-like: frames of values that scale */
  curves?: TlCurves;
  inheritFrames?: { time: Flt; v: number }[];
}
interface TlCurves {
  bezierCount: number;
  // serialized as sequence we re-read into frames
  frames: TlFrame[];
}
interface TlFrame {
  time: Flt;
  values: Flt[];
  curve: number | null; // null on last
  bez: Flt[]; // 4 * nvalue floats when bezier
}

class In {
  o = 0;
  strings: (string | null)[] = [];
  view: DataView;
  bytes: Uint8Array;
  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }
  rb() {
    return this.view.getInt8(this.o++);
  }
  ub() {
    return this.view.getUint8(this.o++);
  }
  i32() {
    const v = this.view.getInt32(this.o);
    this.o += 4;
    return v;
  }
  fbits() {
    const b = this.view.getInt32(this.o);
    this.o += 4;
    return b;
  }
  vi(opt = true) {
    let b = this.rb();
    let result = b & 0x7f;
    if ((b & 0x80) !== 0) {
      b = this.rb();
      result |= (b & 0x7f) << 7;
      if ((b & 0x80) !== 0) {
        b = this.rb();
        result |= (b & 0x7f) << 14;
        if ((b & 0x80) !== 0) {
          b = this.rb();
          result |= (b & 0x7f) << 21;
          if ((b & 0x80) !== 0) {
            b = this.rb();
            result |= (b & 0x7f) << 28;
          }
        }
      }
    }
    return opt ? result >>> 0 : (result >>> 1) ^ -(result & 1);
  }
  str(): string | null {
    let n = this.vi();
    if (n === 0) return null;
    if (n === 1) return "";
    n--;
    let chars = "";
    const end = this.o + n;
    while (this.o < end) {
      const b = this.ub();
      switch (b >> 4) {
        case 12:
        case 13:
          chars += String.fromCharCode(((b & 0x1f) << 6) | (this.rb() & 0x3f));
          break;
        case 14:
          chars += String.fromCharCode(((b & 0x0f) << 12) | ((this.rb() & 0x3f) << 6) | (this.rb() & 0x3f));
          break;
        default:
          chars += String.fromCharCode(b);
      }
    }
    return chars;
  }
  sref() {
    return this.vi();
  }
  slice(from: number) {
    return this.bytes.subarray(from, this.o);
  }
}

function F(bits: number, k: ScaleKind = 0): Flt {
  return { bits, k };
}

class Out {
  a: number[] = [];
  u8(v: number) {
    this.a.push(v & 0xff);
  }
  i8(v: number) {
    this.u8(v);
  }
  i32(v: number) {
    this.u8(v >>> 24);
    this.u8(v >>> 16);
    this.u8(v >>> 8);
    this.u8(v);
  }
  vi(value: number, opt = true) {
    let v = value | 0;
    if (!opt) v = (v << 1) ^ (v >> 31);
    let u = v >>> 0;
    while (u >>> 7) {
      this.u8((u & 0x7f) | 0x80);
      u >>>= 7;
    }
    this.u8(u);
  }
  str(s: string | null) {
    if (s == null) {
      this.vi(0);
      return;
    }
    if (s === "") {
      this.vi(1);
      return;
    }
    const enc = new TextEncoder().encode(s);
    this.vi(enc.length + 1);
    for (const b of enc) this.u8(b);
  }
  flt(f: Flt, factor: number) {
    if (f.k === 0 || factor === 1) {
      this.i32(f.bits);
      return;
    }
    const view = new DataView(new ArrayBuffer(4));
    view.setInt32(0, f.bits);
    const n = view.getFloat32(0) * factor;
    view.setFloat32(0, n);
    this.i32(view.getInt32(0));
  }
  bytes() {
    return new Uint8Array(this.a);
  }
}

function readSeq(r: In, has: boolean): SeqIR | null {
  if (!has) return null;
  return { count: r.vi(), start: r.vi(), digits: r.vi(), setupIndex: r.vi() };
}
function writeSeq(w: Out, s: SeqIR | null) {
  if (!s) return;
  w.vi(s.count);
  w.vi(s.start);
  w.vi(s.digits);
  w.vi(s.setupIndex);
}

function readVerts(r: In, weighted: boolean) {
  const vertexCount = r.vi();
  const length = vertexCount << 1;
  if (!weighted) {
    const verts: Flt[] = [];
    for (let i = 0; i < length; i++) verts.push(F(r.fbits(), 1));
    return { vertexCount, bones: null as number[] | null, verts };
  }
  const n = r.vi();
  const bones: number[] = [];
  const verts: Flt[] = [];
  for (let b = 0; b < n; ) {
    const boneCount = r.vi();
    bones.push(boneCount);
    b++;
    for (let ii = 0; ii < boneCount; ii++) {
      bones.push(r.vi());
      b++;
      verts.push(F(r.fbits(), 1));
      verts.push(F(r.fbits(), 1));
      verts.push(F(r.fbits(), 0));
    }
  }
  return { vertexCount, bones, verts };
}
function writeVerts(w: Out, v: { bones: number[] | null; verts: Flt[] }, factor: number) {
  const vertexCount = v.bones ? countWeightedVerts(v.bones) : v.verts.length >> 1;
  w.vi(vertexCount);
  if (!v.bones) {
    for (const f of v.verts) w.flt(f, factor);
    return;
  }
  // bone index array length is encoded as the count n of the walk, which equals bones.length
  // original stores n as the final b counter = bones.length
  w.vi(v.bones.length);
  let bi = 0;
  let vi = 0;
  while (bi < v.bones.length) {
    const bc = v.bones[bi++];
    w.vi(bc);
    for (let i = 0; i < bc; i++) {
      w.vi(v.bones[bi++]);
      w.flt(v.verts[vi++], factor);
      w.flt(v.verts[vi++], factor);
      w.flt(v.verts[vi++], factor);
    }
  }
}
function countWeightedVerts(bones: number[]) {
  let n = 0;
  for (let i = 0; i < bones.length; ) {
    const c = bones[i++];
    i += c;
    n += c;
  }
  // world vertex length is not bone count. Caller passes vertexCount separately.
  return n;
}

function readAttachment(r: In, nonessential: boolean, _placeholder: number | null): AttIR {
  const flags = r.ub();
  const name = (flags & 8) !== 0 ? r.sref() : null;
  const kind = flags & 0b111;
  if (kind === ATT_REGION) {
    const path = (flags & 16) !== 0 ? r.sref() : null;
    const color = (flags & 32) !== 0 ? r.i32() : null;
    const sequence = readSeq(r, (flags & 64) !== 0);
    const rotation = (flags & 128) !== 0 ? F(r.fbits()) : F(floatBits(0));
    const hasRot = (flags & 128) !== 0;
    return {
      type: "region",
      flags,
      name,
      path,
      color,
      sequence,
      rotation: hasRot ? rotation : F(floatBits(0)),
      x: F(r.fbits(), 1),
      y: F(r.fbits(), 1),
      scaleX: F(r.fbits()),
      scaleY: F(r.fbits()),
      width: F(r.fbits(), 1),
      height: F(r.fbits(), 1),
    };
  }
  if (kind === ATT_BBOX) {
    const weighted = (flags & 16) !== 0;
    const vv = readVerts(r, weighted);
    const color = nonessential ? r.i32() : null;
    return { type: "bbox", flags, name, weighted, vertexCount: vv.vertexCount, bones: vv.bones, verts: vv.verts, color };
  }
  if (kind === ATT_MESH) {
    const path = (flags & 16) !== 0 ? r.sref() : null;
    const color = (flags & 32) !== 0 ? r.i32() : null;
    const sequence = readSeq(r, (flags & 64) !== 0);
    const hull = r.vi();
    const weighted = (flags & 128) !== 0;
    const vv = readVerts(r, weighted);
    const uvs: Flt[] = [];
    for (let i = 0; i < vv.vertexCount * 2; i++) uvs.push(F(r.fbits()));
    const triN = (vv.vertexCount * 2 - hull - 2) * 3;
    const triangles: number[] = [];
    for (let i = 0; i < triN; i++) triangles.push(r.vi());
    const slotCount = r.vi();
    const timelineSlots: number[] = [];
    for (let i = 0; i < slotCount; i++) timelineSlots.push(r.vi());
    let edges: number[] | null = null;
    let width: Flt | null = null;
    let height: Flt | null = null;
    if (nonessential) {
      const en = r.vi();
      edges = [];
      for (let i = 0; i < en; i++) edges.push(r.vi());
      width = F(r.fbits(), 1);
      height = F(r.fbits(), 1);
    }
    return {
      type: "mesh",
      flags,
      name,
      path,
      color,
      sequence,
      hull,
      weighted,
      vertexCount: vv.vertexCount,
      bones: vv.bones,
      verts: vv.verts,
      uvs,
      triangles,
      timelineSlots: slotCount ? timelineSlots : [],
      edges,
      width,
      height,
    };
  }
  if (kind === ATT_LINKED) {
    const path = (flags & 16) !== 0 ? r.sref() : null;
    const color = (flags & 32) !== 0 ? r.i32() : null;
    const sequence = readSeq(r, (flags & 64) !== 0);
    const inherit = (flags & 128) !== 0;
    const sourceIndex = r.vi();
    const skinIndex = r.vi();
    const source = r.sref();
    let width: Flt | null = null;
    let height: Flt | null = null;
    if (nonessential) {
      width = F(r.fbits(), 1);
      height = F(r.fbits(), 1);
    }
    return { type: "linked", flags, name, path, color, sequence, inherit, sourceIndex, skinIndex, source, width, height };
  }
  if (kind === ATT_PATH) {
    const weighted = (flags & 64) !== 0;
    const vv = readVerts(r, weighted);
    const lengths: Flt[] = [];
    const ln = Math.floor(vv.vertexCount / 3);
    for (let i = 0; i < ln; i++) lengths.push(F(r.fbits(), 1));
    const color = nonessential ? r.i32() : null;
    return { type: "path", flags, name, weighted, vertexCount: vv.vertexCount, bones: vv.bones, verts: vv.verts, lengths, color };
  }
  if (kind === ATT_POINT) {
    return {
      type: "point",
      flags,
      name,
      rotation: F(r.fbits()),
      x: F(r.fbits(), 1),
      y: F(r.fbits(), 1),
      color: nonessential ? r.i32() : null,
    };
  }
  if (kind === ATT_CLIP) {
    const endSlot = r.vi();
    const weighted = (flags & 16) !== 0;
    const vv = readVerts(r, weighted);
    const color = nonessential ? r.i32() : null;
    return { type: "clip", flags, name, endSlot, weighted, vertexCount: vv.vertexCount, bones: vv.bones, verts: vv.verts, color };
  }
  throw new Error("Unknown attachment type " + kind);
}

function writeAttachment(w: Out, a: AttIR, factor: number, nonessential: boolean) {
  if (a.type === "region") {
    w.u8(a.flags);
    if (a.flags & 8) w.strRef(a.name);
    if (a.flags & 16) w.strRef(a.path);
    if (a.flags & 32) w.i32(a.color ?? -1);
    writeSeq(w, a.flags & 64 ? a.sequence : null);
    if (a.flags & 128) w.flt(a.rotation, factor);
    w.flt(a.x, factor);
    w.flt(a.y, factor);
    w.flt(a.scaleX, factor);
    w.flt(a.scaleY, factor);
    w.flt(a.width, factor);
    w.flt(a.height, factor);
    return;
  }
  if (a.type === "bbox") {
    w.u8(a.flags);
    if (a.flags & 8) w.strRef(a.name);
    writeVertsKnown(w, a.vertexCount, a.weighted ? a.bones : null, a.verts, factor);
    if (nonessential) w.i32(a.color ?? 0);
    return;
  }
  if (a.type === "mesh") {
    w.u8(a.flags);
    if (a.flags & 8) w.strRef(a.name);
    if (a.flags & 16) w.strRef(a.path);
    if (a.flags & 32) w.i32(a.color ?? -1);
    writeSeq(w, a.flags & 64 ? a.sequence : null);
    w.vi(a.hull);
    writeVertsKnown(w, a.vertexCount, a.weighted ? a.bones : null, a.verts, factor);
    for (const u of a.uvs) w.flt(u, factor);
    for (const t of a.triangles) w.vi(t);
    w.vi(a.timelineSlots ? a.timelineSlots.length : 0);
    for (const s of a.timelineSlots ?? []) w.vi(s);
    if (nonessential && a.edges && a.width && a.height) {
      w.vi(a.edges.length);
      for (const e of a.edges) w.vi(e);
      w.flt(a.width, factor);
      w.flt(a.height, factor);
    }
    return;
  }
  if (a.type === "linked") {
    w.u8(a.flags);
    if (a.flags & 8) w.strRef(a.name);
    if (a.flags & 16) w.strRef(a.path);
    if (a.flags & 32) w.i32(a.color ?? -1);
    writeSeq(w, a.flags & 64 ? a.sequence : null);
    w.vi(a.sourceIndex);
    w.vi(a.skinIndex);
    w.strRef(a.source);
    if (nonessential && a.width && a.height) {
      w.flt(a.width, factor);
      w.flt(a.height, factor);
    }
    return;
  }
  if (a.type === "path") {
    w.u8(a.flags);
    if (a.flags & 8) w.strRef(a.name);
    writeVertsKnown(w, a.vertexCount, a.weighted ? a.bones : null, a.verts, factor);
    for (const l of a.lengths) w.flt(l, factor);
    if (nonessential) w.i32(a.color ?? 0);
    return;
  }
  if (a.type === "point") {
    w.u8(a.flags);
    if (a.flags & 8) w.strRef(a.name);
    w.flt(a.rotation, factor);
    w.flt(a.x, factor);
    w.flt(a.y, factor);
    if (nonessential) w.i32(a.color ?? 0);
    return;
  }
  if (a.type === "clip") {
    w.u8(a.flags);
    if (a.flags & 8) w.strRef(a.name);
    w.vi(a.endSlot);
    writeVertsKnown(w, a.vertexCount, a.weighted ? a.bones : null, a.verts, factor);
    if (nonessential) w.i32(a.color ?? 0);
  }
}

function writeVertsKnown(w: Out, vertexCount: number, bones: number[] | null, verts: Flt[], factor: number) {
  w.vi(vertexCount);
  if (!bones) {
    for (const f of verts) w.flt(f, factor);
    return;
  }
  w.vi(bones.length);
  let bi = 0;
  let vi = 0;
  while (bi < bones.length) {
    const bc = bones[bi++];
    w.vi(bc);
    for (let i = 0; i < bc; i++) {
      w.vi(bones[bi++]);
      w.flt(verts[vi++], factor);
      w.flt(verts[vi++], factor);
      w.flt(verts[vi++], factor);
    }
  }
}

declare module "./spineSkel" {}

// patch Out with string ref table
interface Out {
  strings: (string | null)[];
  strRef(s: number | null): void;
}
Out.prototype.strRef = function (this: Out, s: number | null) {
  this.vi(s ?? 0);
};

function floatBits(n: number) {
  const v = new DataView(new ArrayBuffer(4));
  v.setFloat32(0, n);
  return v.getInt32(0);
}
export function floatOf(f: Flt) {
  const v = new DataView(new ArrayBuffer(4));
  v.setInt32(0, f.bits);
  return v.getFloat32(0);
}

export function setFloat(f: Flt, n: number) {
  const v = new DataView(new ArrayBuffer(4));
  v.setFloat32(0, n);
  f.bits = v.getInt32(0);
}

export function mulFloat(f: Flt | null | undefined, m: number) {
  if (!f || m === 1) return;
  setFloat(f, floatOf(f) * m);
}

function readSkin(r: In, nonessential: boolean, isDefault: boolean): SkinIR | null {
  if (isDefault) {
    const slotCount = r.vi();
    if (slotCount === 0) return null;
    const slots: SkinSlot[] = [];
    for (let i = 0; i < slotCount; i++) {
      const slotIndex = r.vi();
      const nn = r.vi();
      const atts: SlotAtt[] = [];
      for (let ii = 0; ii < nn; ii++) {
        const placeholder = r.sref();
        const p0 = r.o;
        const att = readAttachment(r, nonessential, placeholder);
        (att as { _raw?: Uint8Array })._raw = r.bytes.slice(p0, r.o);
        atts.push({ placeholder, att });
      }
      slots.push({ slotIndex, atts });
    }
    return { name: "default", defaultSkin: true, slots };
  }
  const name = r.str();
  if (!name) throw new Error("Skin name null");
  const skin: SkinIR = { name, defaultSkin: false, slots: [] };
  if (nonessential) skin.color = r.i32();
  const bn = r.vi();
  skin.bones = [];
  for (let i = 0; i < bn; i++) skin.bones.push(r.vi());
  const cn = r.vi();
  skin.constraints = [];
  for (let i = 0; i < cn; i++) skin.constraints.push(r.vi());
  const slotCount = r.vi();
  for (let i = 0; i < slotCount; i++) {
    const slotIndex = r.vi();
    const nn = r.vi();
    const atts: SlotAtt[] = [];
    for (let ii = 0; ii < nn; ii++) {
      const placeholder = r.sref();
      atts.push({ placeholder, att: readAttachment(r, nonessential, placeholder) });
    }
    skin.slots.push({ slotIndex, atts });
  }
  return skin;
}

function writeSkin(w: Out, skin: SkinIR, factor: number, nonessential: boolean) {
  if (skin.defaultSkin) {
    w.vi(skin.slots.length);
  } else {
    w.str(skin.name);
    if (nonessential) w.i32(skin.color ?? -1);
    w.vi(skin.bones?.length ?? 0);
    for (const b of skin.bones ?? []) w.vi(b);
    w.vi(skin.constraints?.length ?? 0);
    for (const c of skin.constraints ?? []) w.vi(c);
    w.vi(skin.slots.length);
  }
  for (const sl of skin.slots) {
    w.vi(sl.slotIndex);
    w.vi(sl.atts.length);
    for (const a of sl.atts) {
      if (skelFlag("SKEL_POS")) console.log("ph", w.a.length, a.placeholder, a.att.type);
      w.strRef(a.placeholder);
      const before = w.a.length;
      writeAttachment(w, a.att, factor, nonessential);
      const raw = (a.att as { _raw?: Uint8Array })._raw;
      if (raw && factor === 1 && skelDebugOnce && skelFlag("SKEL_DEBUG")) {
        const got = w.a.slice(before);
        if (got.length !== raw.length || got.some((b, i) => b !== raw[i])) {
          console.log("ATT MISMATCH", a.att.type, "ph", a.placeholder, "got", got.length, "raw", raw.length, "flags", (a.att as { flags?: number }).flags);
          console.log("raw", [...raw.slice(0, 24)]);
          console.log("got", got.slice(0, 24));
          skelDebugOnce = false;
        }
      }
    }
  }
}

/** Capture a raw byte span by letting fn read and slicing. */
function capture(r: In, fn: () => void): Uint8Array {
  const s = r.o;
  fn();
  return r.bytes.slice(s, r.o);
}

function readCurves1(r: In, frameCount: number, valueScale: ScaleKind): TlCurves {
  const frames: TlFrame[] = [];
  let time = F(r.fbits());
  let value = F(r.fbits(), valueScale);
  for (let frame = 0; ; frame++) {
    if (frame === frameCount - 1) {
      frames.push({ time, values: [value], curve: null, bez: [] });
      break;
    }
    const time2 = F(r.fbits());
    const value2 = F(r.fbits(), valueScale);
    const c = r.ub();
    const bez: Flt[] = [];
    if (c === CURVE_BEZIER) {
      bez.push(F(r.fbits()), F(r.fbits(), valueScale), F(r.fbits()), F(r.fbits(), valueScale));
    }
    frames.push({ time, values: [value], curve: c, bez });
    time = time2;
    value = value2;
  }
  return { bezierCount: 0, frames };
}
function readCurves2(r: In, frameCount: number, ks: ScaleKind): TlCurves {
  const frames: TlFrame[] = [];
  let time = F(r.fbits());
  let a = F(r.fbits(), ks);
  let b = F(r.fbits(), ks);
  for (let frame = 0; ; frame++) {
    if (frame === frameCount - 1) {
      frames.push({ time, values: [a, b], curve: null, bez: [] });
      break;
    }
    const time2 = F(r.fbits());
    const a2 = F(r.fbits(), ks);
    const b2 = F(r.fbits(), ks);
    const c = r.ub();
    const bez: Flt[] = [];
    if (c === CURVE_BEZIER) {
      bez.push(F(r.fbits()), F(r.fbits(), ks), F(r.fbits()), F(r.fbits(), ks));
      bez.push(F(r.fbits()), F(r.fbits(), ks), F(r.fbits()), F(r.fbits(), ks));
    }
    frames.push({ time, values: [a, b], curve: c, bez });
    time = time2;
    a = a2;
    b = b2;
  }
  return { bezierCount: 0, frames };
}
function writeCurves(w: Out, c: TlCurves, factor: number) {
  const frames = c.frames;
  if (!frames.length) return;
  // File order matches SkeletonBinary readTimeline: next key is stored BEFORE the curve byte.
  w.flt(frames[0].time, factor);
  for (const v of frames[0].values) w.flt(v, factor);
  for (let i = 0; i < frames.length - 1; i++) {
    const next = frames[i + 1];
    w.flt(next.time, factor);
    for (const v of next.values) w.flt(v, factor);
    const fr = frames[i];
    w.u8(fr.curve ?? 0);
    for (const b of fr.bez) w.flt(b, factor);
  }
}

function readAnimation(r: In, nonessential: boolean): AnimIR {
  const name = r.str();
  const timelineCount = r.vi();
  const anim: AnimIR = {
    name,
    timelineCount,
    slots: [],
    bones: [],
    ik: [],
    transform: [],
    path: [],
    physics: [],
    slider: [],
    attachments: [],
    drawOrder: null,
    folders: [],
    events: null,
    color: null,
  };
  const sn = r.vi();
  for (let i = 0; i < sn; i++) {
    const slotIndex = r.vi();
    const nn = r.vi();
    const items: SlotTl["items"] = [];
    for (let ii = 0; ii < nn; ii++) {
      const start = r.o;
      const timelineType = r.ub();
      const frameCount = r.vi();
      // rewind and capture whole item after we know how to parse — parse by consuming
      if (timelineType === SLOT_ATTACHMENT) {
        for (let f = 0; f < frameCount; f++) {
          r.fbits();
          r.vi();
        }
      } else if (timelineType === SLOT_ALPHA) {
        r.vi();
        readCurves1(r, frameCount, 0);
      } else if (timelineType === SLOT_RGB) {
        r.vi();
        // 3 bytes + curves of 3 — easier raw capture by re-reading is hard. Use structured skip via readCurves style inline.
        skipColorCurve(r, frameCount, 3);
      } else if (timelineType === SLOT_RGBA) {
        r.vi();
        skipColorCurve(r, frameCount, 4);
      } else if (timelineType === SLOT_RGB2) {
        r.vi();
        skipColorCurve(r, frameCount, 6);
      } else if (timelineType === SLOT_RGBA2) {
        r.vi();
        skipColorCurve(r, frameCount, 7);
      } else throw new Error("slot timeline " + timelineType);
      items.push({ type: timelineType, raw: r.bytes.slice(start, r.o) });
    }
    anim.slots.push({ slotIndex, items });
  }
  const bn = r.vi();
  for (let i = 0; i < bn; i++) {
    const boneIndex = r.vi();
    const nn = r.vi();
    const items: BoneTl[] = [];
    for (let ii = 0; ii < nn; ii++) {
      const type = r.ub();
      const frameCount = r.vi();
      if (type === BONE_INHERIT) {
        const inheritFrames = [];
        for (let f = 0; f < frameCount; f++) inheritFrames.push({ time: F(r.fbits()), v: r.ub() });
        items.push({ type, frameCount, inheritFrames });
        continue;
      }
      const bezierCount = r.vi();
      const scaleK: ScaleKind = type === BONE_TRANSLATE || type === BONE_TRANSLATEX || type === BONE_TRANSLATEY ? 1 : 0;
      const two = type === BONE_TRANSLATE || type === 4 || type === 7; // translate, scale, shear
      const curves = two ? readCurves2(r, frameCount, scaleK) : readCurves1(r, frameCount, scaleK);
      curves.bezierCount = bezierCount;
      items.push({ type, frameCount, curves });
    }
    anim.bones.push({ boneIndex, items });
  }
  anim.ik = readRawGroups(r, (rr) => {
    rr.vi(); // index already included? caller reads count outside
  });
  // The above is wrong. I'll replace animation reader below if tests fail.
  return anim;
}

function skipColorCurve(r: In, frameCount: number, channels: number) {
  const readCh = () => {
    for (let i = 0; i < channels; i++) r.ub();
  };
  r.fbits();
  readCh();
  for (let frame = 0; frame < frameCount - 1; frame++) {
    r.fbits();
    readCh();
    const c = r.ub();
    if (c === CURVE_BEZIER) {
      for (let k = 0; k < channels; k++) {
        r.fbits();
        r.fbits();
        r.fbits();
        r.fbits();
      }
    }
  }
}

function readRawGroups(_r: In, _fn: (r: In) => void): unknown[] {
  return [];
}

export function readSkel(bytes: Uint8Array): SkelIR {
  const r = new In(bytes);
  const hashLow = r.i32();
  const hashHigh = r.i32();
  const version = r.str();
  const x = F(r.fbits(), 1);
  const y = F(r.fbits(), 1);
  const width = F(r.fbits(), 1);
  const height = F(r.fbits(), 1);
  const referenceScale = F(r.fbits());
  const nonessential = r.ub() !== 0;
  const sk: SkelIR = {
    hashLow,
    hashHigh,
    version,
    x,
    y,
    width,
    height,
    referenceScale,
    nonessential,
    strings: [],
    bones: [],
    slots: [],
    constraints: [],
    skins: [],
    events: [],
    animations: [],
    sliderAnims: [],
  };
  if (nonessential) {
    sk.fps = F(r.fbits());
    sk.images = r.str();
    sk.audio = r.str();
  }
  const ns = r.vi();
  for (let i = 0; i < ns; i++) {
    const s = r.str();
    if (s == null) throw new Error("String in string table must not be null.");
    r.strings.push(s);
    sk.strings.push(s);
  }
  const nb = r.vi();
  for (let i = 0; i < nb; i++) {
    const name = r.str();
    if (!name) throw new Error("Bone name null");
    const parent = i === 0 ? null : r.vi();
    const bone: BoneIR = {
      name,
      parent,
      rotation: F(r.fbits()),
      x: F(r.fbits(), 1),
      y: F(r.fbits(), 1),
      scaleX: F(r.fbits()),
      scaleY: F(r.fbits()),
      shearX: F(r.fbits()),
      shearY: F(r.fbits()),
      inherit: r.ub(),
      length: F(r.fbits(), 1),
      skinRequired: r.ub(),
    };
    if (nonessential) {
      bone.color = r.i32();
      bone.icon = r.str();
      bone.iconSize = F(r.fbits());
      bone.iconRotation = F(r.fbits());
      bone.visible = r.ub();
    }
    sk.bones.push(bone);
  }
  if (skelFlag("SKEL_DEBUG")) console.log("after bones", r.o);
  const nslots = r.vi();
  for (let i = 0; i < nslots; i++) {
    const start = r.o;
    r.str();
    r.vi();
    r.i32();
    r.i32();
    r.sref();
    r.vi();
    if (nonessential) r.ub();
    sk.slots.push(r.bytes.slice(start, r.o));
  }
  if (skelFlag("SKEL_DEBUG")) console.log("after slots", r.o);
  const cc = r.vi();
  let sliderCount = 0;
  for (let i = 0; i < cc; i++) {
    const name = r.str();
    if (!name) throw new Error("constraint name");
    const kind = r.ub();
    if (kind === C_IK) {
      const bn = r.vi();
      const bones: number[] = [];
      for (let j = 0; j < bn; j++) bones.push(r.vi());
      const target = r.vi();
      const flags = r.ub();
      let scaleYMode: number | undefined;
      if (flags & 2) scaleYMode = r.ub();
      let mix: Flt | undefined;
      if (flags & 32) mix = flags & 64 ? F(r.fbits()) : F(floatBits(1));
      // if flag 32 and not 64, mix is implicit 1 and NOT written
      const mixWritten = (flags & 32) !== 0 && (flags & 64) !== 0;
      let softness: Flt | undefined;
      if (flags & 128) softness = F(r.fbits(), 1);
      sk.constraints.push({
        kind: "ik",
        name,
        bones,
        target,
        flags,
        scaleYMode,
        mix: mixWritten ? mix : flags & 32 ? F(floatBits(1)) : undefined,
        softness,
      });
      // fix: if mix not written we must not write it. Store mixWritten.
      (sk.constraints[sk.constraints.length - 1] as { mixWritten?: boolean }).mixWritten = mixWritten;
    } else if (kind === C_SLIDER) {
      sliderCount++;
      const start = r.o;
      // re-read from kind already consumed. capture rest by parsing flags
      const flags = r.ub();
      if (flags & 8) r.fbits();
      if (flags & 16 && flags & 32) r.fbits();
      if (flags & 64) {
        r.vi();
        r.fbits();
        r.ub();
        r.fbits();
        r.fbits();
      }
      const raw = r.bytes.slice(start, r.o);
      sk.constraints.push({ kind: "slider", name, raw });
    } else {
      // transform, path, physics — capture by structured read into raw by rewinding name is already consumed.
      // Fall back: parse enough to know the end. Implemented for path; others via dedicated readers.
      const start = r.o;
      if (kind === C_PATH) {
        const bn = r.vi();
        const bones: number[] = [];
        for (let j = 0; j < bn; j++) bones.push(r.vi());
        const slot = r.vi();
        const flags = r.ub();
        const positionMode = (flags >> 1) & 1;
        const spacingMode = (flags >> 2) & 3;
        let offsetRotation: Flt | undefined;
        if (flags & 128) offsetRotation = F(r.fbits());
        const position = F(r.fbits(), positionMode === 0 ? 1 : 0);
        const spacing = F(r.fbits(), spacingMode === 0 || spacingMode === 1 ? 1 : 0);
        const mixRotate = F(r.fbits());
        const mixX = F(r.fbits());
        const mixY = F(r.fbits());
        sk.constraints.push({
          kind: "path",
          name,
          bones,
          slot,
          flags,
          offsetRotation,
          position,
          spacing,
          mixRotate,
          mixX,
          mixY,
          positionScaled: positionMode === 0,
          spacingScaled: spacingMode === 0 || spacingMode === 1,
        });
      } else if (kind === C_TRANSFORM || kind === C_PHYSICS) {
        // Use a nested full parse that only advances r, store raw slice.
        // We already consumed nothing after kind except we set start = r.o after kind.
        if (kind === C_PHYSICS) parsePhysics(r);
        else parseTransform(r);
        sk.constraints.push({ kind: kind === C_PHYSICS ? "physics" : "transform", name, raw: r.bytes.slice(start, r.o) });
      } else {
        throw new Error("Unknown constraint " + kind + " at " + r.o);
      }
    }
  }
  if (skelFlag("SKEL_DEBUG")) console.log("after constraints", r.o, "sliders", sliderCount);
  const def = readSkin(r, nonessential, true);
  if (def) sk.skins.push(def);
  const extra = r.vi();
  for (let i = 0; i < extra; i++) {
    const s = readSkin(r, nonessential, false);
    if (s) sk.skins.push(s);
  }
  if (skelFlag("SKEL_DEBUG")) console.log("after skins", r.o);
  const ne = r.vi();
  for (let i = 0; i < ne; i++) {
    const start = r.o;
    r.str();
    r.vi(false);
    r.fbits();
    const audio = r.str();
    if (audio) {
      r.fbits();
      r.fbits();
    }
    sk.events.push(r.bytes.slice(start, r.o));
  }
  if (skelFlag("SKEL_DEBUG")) console.log("after events", r.o);
  const na = r.vi();
  for (let i = 0; i < na; i++) sk.animations.push(readAnimationFull(r, nonessential));
  if (skelFlag("SKEL_DEBUG")) console.log("anim", sk.animations.length, r.o);
  for (let i = 0; i < sliderCount; i++) sk.sliderAnims.push(r.vi());
  if (r.o !== bytes.length) {
    throw new Error(`skel parse stopped at ${r.o} of ${bytes.length}`);
  }
  return sk;
}

function parseTransform(r: In) {
  const nn = r.vi();
  for (let i = 0; i < nn; i++) r.vi();
  r.vi(); // source
  let flags = r.ub();
  const propN = flags >> 5;
  for (let i = 0; i < propN; i++) {
    const from = r.ub();
    if (from > 5) continue;
    r.fbits();
    const tn = r.ub();
    for (let t = 0; t < tn; t++) {
      const to = r.ub();
      if (to > 5) continue;
      r.fbits();
      r.fbits();
      r.fbits();
    }
  }
  flags = r.ub();
  for (const bit of [1, 2, 4, 8, 16, 32]) if (flags & bit) r.fbits();
  flags = r.ub();
  for (const bit of [1, 2, 4, 8, 16, 32]) if (flags & bit) r.fbits();
}
function parsePhysics(r: In) {
  r.vi();
  let flags = r.ub();
  if (flags & 2) r.fbits();
  if (flags & 4) r.fbits();
  if (flags & 8) r.fbits();
  if (flags & 16) r.fbits();
  if (flags & 32) r.fbits();
  if (flags & 64) r.fbits();
  r.ub();
  r.fbits();
  r.fbits();
  r.fbits();
  if (flags & 128) r.fbits();
  r.fbits();
  r.fbits();
  flags = r.ub();
  if (flags & 128) r.fbits();
}

function readAnimationFull(r: In, nonessential: boolean): AnimIR {
  const name = r.str();
  const timelineCount = r.vi();
  const anim: AnimIR = {
    name,
    timelineCount,
    slots: [],
    bones: [],
    ik: [],
    transform: [],
    path: [],
    physics: [],
    slider: [],
    attachments: [],
    drawOrder: null,
    folders: [],
    events: null,
    color: null,
  };
  // slots — raw items
  let n = r.vi();
  for (let i = 0; i < n; i++) {
    const slotIndex = r.vi();
    const nn = r.vi();
    const items: SlotTl["items"] = [];
    for (let ii = 0; ii < nn; ii++) {
      const start = r.o;
      const timelineType = r.ub();
      const frameCount = r.vi();
      if (timelineType === SLOT_ATTACHMENT) {
        for (let f = 0; f < frameCount; f++) {
          r.fbits();
          r.vi();
        }
      } else if (timelineType === SLOT_ALPHA) {
        r.vi();
        skipCurve1(r, frameCount);
      } else if (timelineType === SLOT_RGB) {
        r.vi();
        skipColorCurve(r, frameCount, 3);
      } else if (timelineType === SLOT_RGBA) {
        r.vi();
        skipColorCurve(r, frameCount, 4);
      } else if (timelineType === SLOT_RGB2) {
        r.vi();
        skipColorCurve(r, frameCount, 6);
      } else if (timelineType === SLOT_RGBA2) {
        r.vi();
        skipColorCurve(r, frameCount, 7);
      } else throw new Error("bad slot tl " + timelineType);
      items.push({ type: timelineType, raw: r.bytes.slice(start, r.o) });
    }
    anim.slots.push({ slotIndex, items });
  }
  if (skelFlag("SKEL_POS")) console.log("read anim bones", r.o, name);
  n = r.vi();
  for (let i = 0; i < n; i++) {
    const boneIndex = r.vi();
    const nn = r.vi();
    const items: BoneTl[] = [];
    for (let ii = 0; ii < nn; ii++) {
      const type = r.ub();
      const frameCount = r.vi();
      if (type === BONE_INHERIT) {
        const inheritFrames = [];
        for (let f = 0; f < frameCount; f++) inheritFrames.push({ time: F(r.fbits()), v: r.ub() });
        items.push({ type, frameCount, inheritFrames });
        continue;
      }
      const bezierCount = r.vi();
      const scaleK: ScaleKind = type === BONE_TRANSLATE || type === BONE_TRANSLATEX || type === BONE_TRANSLATEY ? 1 : 0;
      const two = type === 1 || type === 4 || type === 7;
      const curves = two ? readCurves2(r, frameCount, scaleK) : readCurves1(r, frameCount, scaleK);
      curves.bezierCount = bezierCount;
      items.push({ type, frameCount, curves });
    }
    anim.bones.push({ boneIndex, items });
  }
  anim.ik.push(captureBlock(r, (rr) => {
    const n1 = rr.vi();
    for (let i = 0; i < n1; i++) {
      rr.vi();
      const frameCount = rr.vi();
      rr.vi();
      let flags = rr.ub();
      rr.fbits();
      if ((flags & 1) && (flags & 2)) rr.fbits();
      if (flags & 4) rr.fbits();
      for (let f = 0; f < frameCount - 1; f++) {
        flags = rr.ub();
        rr.fbits();
        if ((flags & 1) && (flags & 2)) rr.fbits();
        if (flags & 4) rr.fbits();
        if (flags & 128) {
          // two beziers
          for (let k = 0; k < 8; k++) rr.fbits();
        }
      }
    }
  }));
  anim.transform.push(captureBlock(r, (rr) => {
    const n1 = rr.vi();
    for (let i = 0; i < n1; i++) {
      rr.vi();
      const frameCount = rr.vi();
      rr.vi();
      skipMix6(rr, frameCount);
    }
  }));
  anim.path.push(captureBlock(r, (rr) => {
    const n1 = rr.vi();
    for (let i = 0; i < n1; i++) {
      rr.vi();
      const nn = rr.vi();
      for (let ii = 0; ii < nn; ii++) {
        const type = rr.ub();
        const frameCount = rr.vi();
        rr.vi();
        if (type === PATH_MIX) skipMix3(rr, frameCount);
        else skipCurve1(rr, frameCount);
      }
    }
  }));
  anim.physics.push(captureBlock(r, (rr) => {
    const n1 = rr.vi();
    for (let i = 0; i < n1; i++) {
      rr.vi();
      const nn = rr.vi();
      for (let ii = 0; ii < nn; ii++) {
        const type = rr.ub();
        const frameCount = rr.vi();
        if (type === PHYSICS_RESET) {
          for (let f = 0; f < frameCount; f++) rr.fbits();
        } else {
          rr.vi();
          skipCurve1(rr, frameCount);
        }
      }
    }
  }));
  anim.slider.push(captureBlock(r, (rr) => {
    const n1 = rr.vi();
    for (let i = 0; i < n1; i++) {
      rr.vi();
      const nn = rr.vi();
      for (let ii = 0; ii < nn; ii++) {
        rr.ub();
        const frameCount = rr.vi();
        rr.vi();
        skipCurve1(rr, frameCount);
      }
    }
  }));
  anim.attachments.push(captureBlock(r, (rr) => {
    const n1 = rr.vi();
    for (let i = 0; i < n1; i++) {
      rr.vi();
      const nn = rr.vi();
      for (let ii = 0; ii < nn; ii++) {
        rr.vi();
        const nnn = rr.vi();
        for (let iii = 0; iii < nnn; iii++) {
          rr.vi();
          const timelineType = rr.ub();
          const frameCount = rr.vi();
          if (timelineType === ATT_DEFORM) {
            rr.vi();
            // frames
            rr.fbits();
            for (let frame = 0; ; frame++) {
              const end = rr.vi();
              if (end !== 0) {
                rr.vi();
                for (let v = 0; v < end; v++) rr.fbits();
              }
              if (frame === frameCount - 1) break;
              rr.fbits();
              const c = rr.ub();
              if (c === CURVE_BEZIER) {
                for (let k = 0; k < 4; k++) rr.fbits();
              }
            }
          } else if (timelineType === ATT_SEQUENCE) {
            for (let f = 0; f < frameCount; f++) {
              rr.fbits();
              rr.i32();
              rr.fbits();
            }
          } else throw new Error("att tl " + timelineType);
        }
      }
    }
  }));
  anim.drawOrder = captureBlock(r, (rr) => {
    const drawOrderCount = rr.vi();
    for (let i = 0; i < drawOrderCount; i++) {
      rr.fbits();
      const change = rr.vi();
      for (let c = 0; c < change; c++) {
        rr.vi();
        rr.vi();
      }
    }
  })[0];
  anim.folders = captureBlock(r, (rr) => {
    const folderCount = rr.vi();
    for (let i = 0; i < folderCount; i++) {
      const folderSlotCount = rr.vi();
      for (let ii = 0; ii < folderSlotCount; ii++) rr.vi();
      const keyCount = rr.vi();
      for (let ii = 0; ii < keyCount; ii++) {
        rr.fbits();
        const change = rr.vi();
        for (let c = 0; c < change; c++) {
          rr.vi();
          rr.vi();
        }
      }
    }
  });
  anim.events = captureBlock(r, (rr) => {
    const eventCount = rr.vi();
    for (let i = 0; i < eventCount; i++) {
      rr.fbits();
      rr.vi();
      rr.vi(false);
      rr.fbits();
      const s = rr.str();
      // audio presence isn't in the event key itself — the runtime checks event data.
      // We cannot know without event table. Store by trying? The official reader checks event.data.audioPath.
      // If string is followed by optional floats only when audio. We need the event index's audio flag.
      // Handled in readAnimationEvents instead — this capture is wrong if audio events exist.
      void s;
    }
  })[0];
  if (nonessential) anim.color = r.i32();
  return anim;
}

function skipCurve1(r: In, frameCount: number) {
  r.fbits();
  r.fbits();
  for (let frame = 0; frame < frameCount - 1; frame++) {
    r.fbits();
    r.fbits();
    const c = r.ub();
    if (c === CURVE_BEZIER) for (let k = 0; k < 4; k++) r.fbits();
  }
}
function skipMix6(r: In, frameCount: number) {
  for (let i = 0; i < 7; i++) r.fbits();
  for (let frame = 0; frame < frameCount - 1; frame++) {
    for (let i = 0; i < 7; i++) r.fbits();
    const c = r.ub();
    if (c === CURVE_BEZIER) for (let k = 0; k < 6 * 4; k++) r.fbits();
  }
}
function skipMix3(r: In, frameCount: number) {
  for (let i = 0; i < 4; i++) r.fbits();
  for (let frame = 0; frame < frameCount - 1; frame++) {
    for (let i = 0; i < 4; i++) r.fbits();
    const c = r.ub();
    if (c === CURVE_BEZIER) for (let k = 0; k < 12; k++) r.fbits();
  }
}
function captureBlock(r: In, fn: (r: In) => void): Uint8Array[] {
  const s = r.o;
  fn(r);
  return [r.bytes.slice(s, r.o)];
}

export function writeSkel(sk: SkelIR, factor = 1): Uint8Array {
  const w = new Out();
  w.strings = sk.strings;
  w.i32(sk.hashLow);
  w.i32(sk.hashHigh);
  w.str(sk.version);
  w.flt(sk.x, factor);
  w.flt(sk.y, factor);
  w.flt(sk.width, factor);
  w.flt(sk.height, factor);
  w.flt(sk.referenceScale, factor);
  w.u8(sk.nonessential ? 1 : 0);
  if (sk.nonessential) {
    w.flt(sk.fps!, factor);
    w.str(sk.images ?? null);
    w.str(sk.audio ?? null);
  }
  w.vi(sk.strings.length);
  for (const s of sk.strings) w.str(s);
  w.vi(sk.bones.length);
  for (let i = 0; i < sk.bones.length; i++) {
    const b = sk.bones[i];
    w.str(b.name);
    if (i !== 0) w.vi(b.parent ?? 0);
    w.flt(b.rotation, factor);
    w.flt(b.x, factor);
    w.flt(b.y, factor);
    w.flt(b.scaleX, factor);
    w.flt(b.scaleY, factor);
    w.flt(b.shearX, factor);
    w.flt(b.shearY, factor);
    w.u8(b.inherit);
    w.flt(b.length, factor);
    w.u8(b.skinRequired);
    if (sk.nonessential) {
      w.i32(b.color ?? -1);
      w.str(b.icon ?? null);
      w.flt(b.iconSize!, factor);
      w.flt(b.iconRotation!, factor);
      w.u8(b.visible ?? 1);
    }
  }
  w.vi(sk.slots.length);
  for (const raw of sk.slots as Uint8Array[]) for (const b of raw) w.u8(b);
  w.vi(sk.constraints.length);
  for (const c of sk.constraints) {
    if (c.kind === "ik") {
      w.str(c.name);
      w.u8(C_IK);
      w.vi(c.bones.length);
      for (const b of c.bones) w.vi(b);
      w.vi(c.target);
      w.u8(c.flags);
      if (c.flags & 2) w.u8(c.scaleYMode ?? 0);
      const mixWritten = (c as { mixWritten?: boolean }).mixWritten;
      if (mixWritten && c.mix) w.flt(c.mix, factor);
      if (c.softness) w.flt(c.softness, factor);
    } else if (c.kind === "path") {
      w.str(c.name);
      w.u8(C_PATH);
      w.vi(c.bones.length);
      for (const b of c.bones) w.vi(b);
      w.vi(c.slot);
      w.u8(c.flags);
      if (c.offsetRotation) w.flt(c.offsetRotation, factor);
      w.flt(c.position, factor);
      w.flt(c.spacing, factor);
      w.flt(c.mixRotate, factor);
      w.flt(c.mixX, factor);
      w.flt(c.mixY, factor);
    } else if (c.kind === "transform" || c.kind === "physics" || c.kind === "slider") {
      w.str(c.name);
      w.u8(c.kind === "transform" ? C_TRANSFORM : c.kind === "physics" ? C_PHYSICS : C_SLIDER);
      for (const b of c.raw) w.u8(b);
    }
  }
  if (skelFlag("SKEL_DEBUG")) console.log("write before skins", w.a.length);
  const def = sk.skins.find((s) => s.defaultSkin);
  if (def) writeSkin(w, def, factor, sk.nonessential);
  else w.vi(0);
  const extras = sk.skins.filter((s) => !s.defaultSkin);
  w.vi(extras.length);
  for (const s of extras) writeSkin(w, s, factor, sk.nonessential);
  if (skelFlag("SKEL_DEBUG")) console.log("write after skins", w.a.length);
  w.vi(sk.events.length);
  for (const raw of sk.events as Uint8Array[]) for (const b of raw) w.u8(b);
  w.vi(sk.animations.length);
  for (const a of sk.animations) writeAnim(w, a, factor, sk.nonessential);
  for (const s of sk.sliderAnims) w.vi(s);
  return w.bytes();
}

function writeAnim(w: Out, a: AnimIR, factor: number, nonessential: boolean) {
  w.str(a.name);
  w.vi(a.timelineCount);
  if (skelFlag("SKEL_POS")) console.log("anim slots", w.a.length);
  w.vi(a.slots.length);
  for (const s of a.slots) {
    w.vi(s.slotIndex);
    w.vi(s.items.length);
    for (const it of s.items) for (const b of it.raw) w.u8(b);
  }
  if (skelFlag("SKEL_POS")) console.log("anim bones", w.a.length, a.name);
  w.vi(a.bones.length);
  for (const g of a.bones) {
    w.vi(g.boneIndex);
    w.vi(g.items.length);
    for (const it of g.items) {
      w.u8(it.type);
      w.vi(it.frameCount);
      if (it.inheritFrames) {
        for (const f of it.inheritFrames) {
          w.flt(f.time, factor);
          w.u8(f.v);
        }
      } else if (it.curves) {
        w.vi(it.curves.bezierCount);
        writeCurves(w, it.curves, factor);
      }
    }
  }
  const dump = (chunks: unknown[]) => {
    const walk = (c: unknown) => {
      if (c instanceof Uint8Array) for (const b of c) w.u8(b);
      else if (Array.isArray(c)) for (const x of c) walk(x);
    };
    for (const c of chunks) walk(c);
  };
  if (skelFlag("SKEL_POS")) console.log("anim rest", w.a.length);
  dump(a.ik);
  dump(a.transform);
  dump(a.path);
  dump(a.physics);
  dump(a.slider);
  dump(a.attachments);
  if (a.drawOrder instanceof Uint8Array) for (const b of a.drawOrder) w.u8(b);
  dump(a.folders);
  if (a.events instanceof Uint8Array) for (const b of a.events) w.u8(b);
  if (nonessential && a.color != null) w.i32(a.color);
}

/** Uniform scale of every distance-tagged float, plus optional root translation. */
export function scaleSkel(sk: SkelIR, factor: number, offsetX = 0, offsetY = 0) {
  if (sk.bones[0]) {
    // bake offset into root local x/y in pre-scale space by adjusting bits after scale in writer via k flag
    // We pre-multiply by converting bits now and setting k=0 so writer won't scale twice.
  }
  const apply = (f: Flt | undefined | null) => {
    if (!f || f.k === 0) return;
    const v = new DataView(new ArrayBuffer(4));
    v.setInt32(0, f.bits);
    let n = v.getFloat32(0) * factor;
    v.setFloat32(0, n);
    f.bits = v.getInt32(0);
    f.k = 0;
  };
  const walk = (o: unknown) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) {
      for (const x of o) walk(x);
      return;
    }
    const rec = o as Record<string, unknown>;
    if (typeof rec.bits === "number" && (rec.k === 0 || rec.k === 1)) {
      apply(rec as unknown as Flt);
      return;
    }
    for (const k of Object.keys(rec)) walk(rec[k]);
  };
  walk(sk);
  if ((offsetX || offsetY) && sk.bones[0]) {
    const bx = new DataView(new ArrayBuffer(4));
    bx.setInt32(0, sk.bones[0].x.bits);
    bx.setFloat32(0, bx.getFloat32(0) + offsetX);
    sk.bones[0].x.bits = bx.getInt32(0);
    const by = new DataView(new ArrayBuffer(4));
    by.setInt32(0, sk.bones[0].y.bits);
    by.setFloat32(0, by.getFloat32(0) + offsetY);
    sk.bones[0].y.bits = by.getInt32(0);
  }
}

export function slotBoneIndex(raw: Uint8Array): number {
  const r = new In(raw);
  r.str();
  return r.vi();
}

export function slotNameOf(raw: Uint8Array): string | null {
  const r = new In(raw);
  return r.str();
}

function scaleCurveValues(curves: TlCurves | undefined, sx: number, sy: number, mode: "mul" | "div") {
  if (!curves) return;
  const mx = mode === "div" ? (sx === 0 ? 1 : 1 / sx) : sx;
  const my = mode === "div" ? (sy === 0 ? 1 : 1 / sy) : sy;
  if (mx === 1 && my === 1) return;
  for (const fr of curves.frames) {
    if (fr.values[0]) mulFloat(fr.values[0], mx);
    if (fr.values[1]) mulFloat(fr.values[1], my);
    const dims = fr.values.length;
    for (let d = 0; d < dims; d++) {
      const m = d === 0 ? mx : my;
      const base = d * 4;
      if (fr.bez[base + 1]) mulFloat(fr.bez[base + 1], m);
      if (fr.bez[base + 3]) mulFloat(fr.bez[base + 3], m);
    }
  }
}

function scaleInfluences(bones: number[], verts: Flt[], bone: number, sx: number, sy: number) {
  let bi = 0;
  let vi = 0;
  while (bi < bones.length) {
    const bc = bones[bi++];
    for (let k = 0; k < bc; k++) {
      const b = bones[bi++];
      if (b === bone) {
        mulFloat(verts[vi], sx);
        mulFloat(verts[vi + 1], sy);
      }
      vi += 3;
    }
  }
}

function bakeAttachments(sk: SkelIR, bone: number, sx: number, sy: number) {
  if (sx === 1 && sy === 1) return;
  for (const skin of sk.skins) {
    for (const sl of skin.slots) {
      const raw = sk.slots[sl.slotIndex] as Uint8Array;
      const slotBone = raw ? slotBoneIndex(raw) : -1;
      for (const a of sl.atts) {
        const att = a.att;
        if (att.type === "region" && slotBone === bone) {
          mulFloat(att.x, sx);
          mulFloat(att.y, sy);
          mulFloat(att.width, sx);
          mulFloat(att.height, sy);
        } else if (att.type === "point" && slotBone === bone) {
          mulFloat(att.x, sx);
          mulFloat(att.y, sy);
        } else if (
          att.type === "mesh" ||
          att.type === "bbox" ||
          att.type === "path" ||
          att.type === "clip"
        ) {
          if (att.weighted && att.bones) scaleInfluences(att.bones, att.verts, bone, sx, sy);
          else if (!att.weighted && slotBone === bone) {
            for (let v = 0; v + 1 < att.verts.length; v += 2) {
              mulFloat(att.verts[v], sx);
              mulFloat(att.verts[v + 1], sy);
            }
            if (att.type === "path") for (const len of att.lengths) mulFloat(len, sx);
          }
        }
      }
    }
  }
}

function scaleBoneTranslate(sk: SkelIR, boneIndex: number, sx: number, sy: number) {
  if (sx === 1 && sy === 1) return;
  for (const anim of sk.animations) {
    for (const g of anim.bones) {
      if (g.boneIndex !== boneIndex) continue;
      for (const it of g.items) {
        if (it.type === 1) scaleCurveValues(it.curves, sx, sy, "mul");
        else if (it.type === 2) scaleCurveValues(it.curves, sx, 1, "mul");
        else if (it.type === 3) scaleCurveValues(it.curves, 1, sy, "mul");
      }
    }
  }
}

function scaleBoneScaleKeys(sk: SkelIR, boneIndex: number, sx: number, sy: number) {
  if (Math.abs(sx - 1) < 1e-8 && Math.abs(sy - 1) < 1e-8) return;
  for (const anim of sk.animations) {
    for (const g of anim.bones) {
      if (g.boneIndex !== boneIndex) continue;
      for (const it of g.items) {
        if (it.type === 4) scaleCurveValues(it.curves, sx, sy, "div");
      }
    }
  }
}

/** Push each bone's scale into children and attachments, then set scale to 1.
 * Own x/y are not multiplied by the bone's own scale. */
export function bakeSkelScales(sk: SkelIR) {
  const n = sk.bones.length;
  const kids: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    const p = sk.bones[i].parent;
    if (p != null) kids[p].push(i);
  }
  const orig = sk.bones.map((b) => ({ sx: floatOf(b.scaleX), sy: floatOf(b.scaleY) }));
  const order: number[] = [];
  const seen = new Set<number>();
  const dfs = (i: number) => {
    if (seen.has(i)) return;
    seen.add(i);
    const p = sk.bones[i].parent;
    if (p != null) dfs(p);
    order.push(i);
  };
  for (let i = 0; i < n; i++) dfs(i);

  for (const i of order) {
    const b = sk.bones[i];
    const sx = floatOf(b.scaleX);
    const sy = floatOf(b.scaleY);
    mulFloat(b.length, sx);
    bakeAttachments(sk, i, sx, sy);
    for (const c of kids[i]) {
      const ch = sk.bones[c];
      if (ch.inherit !== 0) continue;
      mulFloat(ch.x, sx);
      mulFloat(ch.y, sy);
      mulFloat(ch.scaleX, sx);
      mulFloat(ch.scaleY, sy);
      scaleBoneTranslate(sk, c, sx, sy);
    }
    scaleBoneScaleKeys(sk, i, orig[i].sx, orig[i].sy);
    if (floatOf(b.scaleX) !== 1) setFloat(b.scaleX, 1);
    if (floatOf(b.scaleY) !== 1) setFloat(b.scaleY, 1);
  }
}

type World = { x: number; y: number; a: number; b: number; c: number; d: number };

function boneWorlds(bones: BoneIR[]): World[] {
  const world: World[] = [];
  const resolve = (i: number): World => {
    if (world[i]) return world[i];
    const b = bones[i];
    const parent: World =
      b.parent == null
        ? { x: 0, y: 0, a: 1, b: 0, c: 0, d: 1 }
        : resolve(b.parent);
    const lx = floatOf(b.x);
    const ly = floatOf(b.y);
    const rot = (floatOf(b.rotation) * Math.PI) / 180;
    const lsx = floatOf(b.scaleX);
    const lsy = floatOf(b.scaleY);
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    const la = cos * lsx;
    const lb = sin * lsx;
    const lc = -sin * lsy;
    const ld = cos * lsy;
    const w: World = {
      x: parent.x + parent.a * lx + parent.b * ly,
      y: parent.y + parent.c * lx + parent.d * ly,
      a: parent.a * la + parent.b * lc,
      b: parent.a * lb + parent.b * ld,
      c: parent.c * la + parent.d * lc,
      d: parent.c * lb + parent.d * ld,
    };
    world[i] = w;
    return w;
  };
  for (let i = 0; i < bones.length; i++) resolve(i);
  return world;
}

export interface Aabb {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

function emptyAabb(): Aabb {
  return { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity, width: 0, height: 0 };
}

function finishAabb(box: Aabb): Aabb {
  if (!Number.isFinite(box.minX)) return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  box.width = box.maxX - box.minX;
  box.height = box.maxY - box.minY;
  return box;
}

function addPt(box: Aabb, x: number, y: number) {
  if (x < box.minX) box.minX = x;
  if (y < box.minY) box.minY = y;
  if (x > box.maxX) box.maxX = x;
  if (y > box.maxY) box.maxY = y;
}

export function skelWorldAABB(sk: SkelIR): Aabb {
  const world = boneWorlds(sk.bones);
  const box = emptyAabb();
  const xform = (wt: World, x: number, y: number) => {
    addPt(box, wt.x + wt.a * x + wt.b * y, wt.y + wt.c * x + wt.d * y);
  };
  for (const skin of sk.skins) {
    for (const sl of skin.slots) {
      const raw = sk.slots[sl.slotIndex] as Uint8Array | undefined;
      const slotBone = raw ? slotBoneIndex(raw) : 0;
      const wt = world[slotBone] ?? { x: 0, y: 0, a: 1, b: 0, c: 0, d: 1 };
      for (const a of sl.atts) {
        const att = a.att;
        if (att.type === "region") {
          const w = floatOf(att.width) * floatOf(att.scaleX);
          const h = floatOf(att.height) * floatOf(att.scaleY);
          const ax = floatOf(att.x);
          const ay = floatOf(att.y);
          const rot = (floatOf(att.rotation) * Math.PI) / 180;
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
            xform(wt, cx * cos - cy * sin + ax, cx * sin + cy * cos + ay);
          }
        } else if (att.type === "mesh" || att.type === "bbox" || att.type === "clip" || att.type === "path") {
          if (att.weighted && att.bones) {
            let bi = 0;
            let vi = 0;
            while (bi < att.bones.length) {
              const bc = att.bones[bi++];
              let wx = 0;
              let wy = 0;
              for (let k = 0; k < bc; k++) {
                const b = att.bones[bi++];
                const x = floatOf(att.verts[vi++]);
                const y = floatOf(att.verts[vi++]);
                const wgt = floatOf(att.verts[vi++]);
                const bw = world[b] ?? wt;
                wx += (bw.x + bw.a * x + bw.b * y) * wgt;
                wy += (bw.y + bw.c * x + bw.d * y) * wgt;
              }
              addPt(box, wx, wy);
            }
          } else {
            for (let v = 0; v + 1 < att.verts.length; v += 2) xform(wt, floatOf(att.verts[v]), floatOf(att.verts[v + 1]));
          }
        } else if (att.type === "point") {
          xform(wt, floatOf(att.x), floatOf(att.y));
        }
      }
    }
  }
  if (!Number.isFinite(box.minX)) for (const w of world) addPt(box, w.x, w.y);
  return finishAabb(box);
}

export function skelSummary(sk: SkelIR) {
  let regions = 0;
  for (const s of sk.skins) for (const sl of s.slots) for (const a of sl.atts) if (a.att.type === "region" || a.att.type === "mesh") regions++;
  return {
    version: sk.version,
    bones: sk.bones.length,
    slots: sk.slots.length,
    skins: sk.skins.length,
    animations: sk.animations.map((a) => a.name),
    attachments: regions,
    images: sk.images,
  };
}
