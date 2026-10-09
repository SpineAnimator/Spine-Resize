/** Spine editor project (.spine): raw deflate of a tagged binary.
 * Scales only fields that were checked against symbols.spine / gunslinger.json.
 * factor === 1 returns the original bytes.
 */

import { deflateRaw as pakoDeflateRaw, Inflate, inflateRaw as pakoInflateRaw } from "pako";

export interface SpineScaleStats {
  bones: number;
  regions: number;
  meshFloats: number;
  animPairs: number;
  meshSpan: { width: number; height: number; minX: number; minY: number; maxX: number; maxY: number };
}

const BONE_ANCHOR = [0x22, 0x00, 0x00, 0x00, 0x00, 0x0e];
const REGION_ANCHOR = [0x0f, 0x00, 0x0e, 0x1e, 0x01, 0xff, 0xff, 0xff, 0xff];

function getF(data: Uint8Array, o: number) {
  return new DataView(data.buffer, data.byteOffset, data.byteLength).getFloat32(o, false);
}
function setF(data: Uint8Array, o: number, v: number) {
  new DataView(data.buffer, data.byteOffset, data.byteLength).setFloat32(o, v, false);
}

function findAll(data: Uint8Array, sig: number[]): number[] {
  const out: number[] = [];
  outer: for (let i = 0; i + sig.length <= data.length; i++) {
    for (let k = 0; k < sig.length; k++) if (data[i + k] !== sig[k]) continue outer;
    out.push(i);
  }
  return out;
}

interface BoneOff {
  x: number;
  y: number;
  length: number;
  name: string;
}

function lockBoneExtras(data: Uint8Array, anchor: number, lock: (o: number) => void) {
  // scaleY sits immediately after 22 00 00 00 00 0E
  lock(anchor + 6);
  // rotation: 0C <f32> 17 00 00 00 00   before the 0A x tag
  const from = Math.max(0, anchor - 48);
  for (let p = anchor - 5; p >= from; p--) {
    if (
      data[p] === 0x17 &&
      data[p + 1] === 0x00 &&
      data[p + 2] === 0x00 &&
      data[p + 3] === 0x00 &&
      data[p + 4] === 0x00 &&
      p >= 5 &&
      data[p - 5] === 0x0c
    ) {
      lock(p - 4);
      if (p >= 10 && data[p - 10] === 0x0d) lock(p - 9);
      break;
    }
  }
}

function parseBone(data: Uint8Array, i: number): BoneOff | null {
  if (i < 5 || data[i - 5] !== 0x0a) return null;
  let j = i + 10;
  if (j + 4 > data.length || data[j] !== 0x1f || data[j + 1] !== 0x0f || data[j + 2] !== 0x01 || data[j + 3] !== 0x00) return null;
  j += 4;
  if (data[j] !== 0x09) return null;
  const lengthAt = j + 1;
  j += 5;
  if (data[j] === 0x1b && data[j + 1] === 0x15 && data[j + 2] === 0x1d && data[j + 3] === 0x00) j += 4;
  else if (data[j] === 0x1b && data[j + 1] === 0x01 && data[j + 2] === 0x01 && data[j + 3] === 0x1d && data[j + 4] === 0x00) j += 5;
  else return null;
  if (data[j] !== 0x0b) return null;
  const yAt = j + 1;
  j += 5;
  if (data[j] !== 0x01 || data[j + 1] !== 0x01) return null;
  j += 2;
  let name = "";
  while (j < data.length) {
    const b = data[j++];
    name += String.fromCharCode(b & 0x7f);
    if (b & 0x80) break;
  }
  return { x: i - 4, y: yAt, length: lengthAt, name };
}

function regionOffsets(data: Uint8Array, i: number): { x: number; y: number; w: number; h: number } | null {
  if (i < 15) return null;
  if (data[i - 15] !== 0x0c || data[i - 10] !== 0x07 || data[i - 5] !== 0x06) return null;
  const after = i + 9;
  if (after + 14 > data.length) return null;
  if (data[after] !== 0x09 || data[after + 5] !== 0x0b) return null;
  if (data[after + 10] !== 0x0d || data[after + 11] !== 0x0a || data[after + 12] !== 0x01 || data[after + 13] !== 0x01) return null;
  return { h: i - 14, y: i - 9, x: i - 4, w: after + 6 };
}

export function scaleSpineInflated(
  src: Uint8Array,
  factor: number,
  offsetX = 0,
  offsetY = 0,
): { bytes: Uint8Array; stats: SpineScaleStats } {
  const data = new Uint8Array(src);
  const used = new Set<number>();
  const locked = new Set<number>();
  const mark = (o: number) => {
    if (locked.has(o)) return;
    used.add(o);
    setF(data, o, getF(data, o) * factor);
  };
  const lock = (o: number) => {
    if (o >= 0 && o + 4 <= data.length) locked.add(o);
  };

  let bones = 0;
  let root: BoneOff | null = null;
  for (const i of findAll(data, BONE_ANCHOR)) {
    const b = parseBone(data, i);
    if (!b) continue;
    bones++;
    if (b.name === "root") root = b;
    lockBoneExtras(data, i, lock);
    mark(b.x);
    mark(b.y);
    mark(b.length);
  }

  let regions = 0;
  const regionPts: { x: number; y: number; w: number; h: number }[] = [];
  for (const i of findAll(data, REGION_ANCHOR)) {
    const r = regionOffsets(data, i);
    if (!r) continue;
    regions++;
    regionPts.push({
      x: getF(data, r.x),
      y: getF(data, r.y),
      w: getF(data, r.w),
      h: getF(data, r.h),
    });
    mark(r.x);
    mark(r.y);
    mark(r.w);
    mark(r.h);
  }

  let meshFloats = 0;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const add = (x: number, y: number) => {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  };
  const trailers = [
    [0x36, 0x01, 0x02, 0x00],
    [0x1f, 0x1e, 0x01, 0xff],
  ];
  for (let i = 0; i + 8 < data.length; i++) {
    if (data[i] !== 0x01 || data[i + 1] !== 0x11 || data[i + 2] !== 0x01) continue;
    const n = data[i + 3];
    if (n < 2 || n > 40 || n % 2 !== 0) continue;
    const end = i + 4 + n * 4;
    if (end + 4 > data.length) continue;
    let ok = false;
    for (const trailer of trailers) {
      let match = true;
      for (let k = 0; k < 4; k++) if (data[end + k] !== trailer[k]) match = false;
      if (match) ok = true;
    }
    if (!ok) continue;
    for (let k = 0; k < n; k += 2) {
      const xo = i + 4 + k * 4;
      const yo = xo + 4;
      if (locked.has(xo) || locked.has(yo)) continue;
      add(getF(data, xo), getF(data, yo));
      if (!used.has(xo)) {
        mark(xo);
        meshFloats++;
      }
      if (!used.has(yo)) {
        mark(yo);
        meshFloats++;
      }
    }
    i = end - 1;
  }

  let animPairs = 0;
  for (let j = 0; j + 15 < data.length; j++) {
    if (data[j] !== 0x01 || data[j + 1] !== 0x01 || data[j + 14] !== 0x01) continue;
    const xo = j + 6;
    const yo = j + 10;
    if (used.has(xo) || used.has(yo) || locked.has(xo) || locked.has(yo)) continue;
    const t = getF(data, j + 2);
    const x = getF(data, xo);
    const y = getF(data, yo);
    if (!Number.isFinite(t) || !Number.isFinite(x) || !Number.isFinite(y)) continue;
    if (Math.abs(t) > 1e5) continue;
    if (Math.max(Math.abs(x), Math.abs(y)) < 8) continue;
    mark(xo);
    mark(yo);
    animPairs++;
  }

  // Root local x/y is world position when the root is unrotated, which matches .skel centering.
  if (root && (offsetX || offsetY)) {
    if (offsetX) setF(data, root.x, getF(data, root.x) + offsetX);
    if (offsetY) setF(data, root.y, getF(data, root.y) + offsetY);
  }
  for (const r of regionPts) {
    add(r.x - r.w / 2, r.y - r.h / 2);
    add(r.x + r.w / 2, r.y + r.h / 2);
  }
  if (!Number.isFinite(minX)) {
    minX = 0;
    minY = 0;
    maxX = 0;
    maxY = 0;
  }
  return {
    bytes: data,
    stats: {
      bones,
      regions,
      meshFloats,
      animPairs,
      meshSpan: { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY },
    },
  };
}

const FOOTER_MAGIC = [0x02, 0x0b, 0x02, 0x0b];

/** Raw deflate, then a 20-byte editor footer. Dropping the footer is "project footer is missing". */
export function splitSpine(raw: Uint8Array): { inflated: Uint8Array; footer: Uint8Array } {
  const inflator = new Inflate({ raw: true });
  inflator.push(raw, true);
  const inflated = inflator.result;
  if (inflator.err || !(inflated instanceof Uint8Array) || inflated.length === 0) {
    return { inflated: pakoInflateRaw(raw), footer: new Uint8Array(0) };
  }
  const consumed = inflator.strm?.total_in ?? raw.length;
  const footer = consumed > 0 && consumed < raw.length ? raw.slice(consumed) : new Uint8Array(0);
  return { inflated, footer };
}

function patchFooter(footer: Uint8Array, packedLen: number): Uint8Array {
  if (footer.length < 20) return footer;
  const at = footer.length - 4;
  for (let i = 0; i < 4; i++) if (footer[at + i] !== FOOTER_MAGIC[i]) return footer;
  const out = footer.slice();
  new DataView(out.buffer, out.byteOffset, out.byteLength).setUint32(4, packedLen, false);
  return out;
}

export async function inflateRaw(raw: Uint8Array): Promise<Uint8Array> {
  return splitSpine(raw).inflated;
}

export async function deflateRaw(data: Uint8Array): Promise<Uint8Array> {
  return pakoDeflateRaw(data, { level: 6 });
}

export async function scaleSpineFile(
  raw: Uint8Array,
  factor: number,
  offsetX = 0,
  offsetY = 0,
): Promise<{ bytes: Uint8Array; stats: SpineScaleStats }> {
  const { inflated, footer } = splitSpine(raw);
  if (factor === 1 && !offsetX && !offsetY) {
    const stats = scaleSpineInflated(inflated, 1).stats;
    return { bytes: raw, stats };
  }
  const scaled = scaleSpineInflated(inflated, factor, offsetX, offsetY);
  const packed = await deflateRaw(scaled.bytes);
  const tail = patchFooter(footer, packed.length);
  const bytes = new Uint8Array(packed.length + tail.length);
  bytes.set(packed, 0);
  bytes.set(tail, packed.length);
  return { bytes, stats: scaled.stats };
}

/** Measure without scaling. Uses a copy. */
export function measureSpine(inflated: Uint8Array): SpineScaleStats {
  return scaleSpineInflated(inflated, 1).stats;
}
