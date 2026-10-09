import JSZip from "jszip";
import {
  bakeJsonScales,
  centerOffset,
  fitFactor,
  jsonAABB,
  scaleAtlas,
  scaleJson,
  type SpineJson,
} from "./resizeCore";
import { inflateRaw, measureSpine, scaleSpineFile } from "./spineProject";
import { bakeSkelScales, readSkel, scaleSkel, skelWorldAABB, writeSkel, type Aabb } from "./spineSkel";

export type SpineEntry = { path: string; data: Uint8Array };

export type ResizeOptions = {
  target: number;
  bake: boolean;
  center: boolean;
};

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function baseName(path: string) {
  const parts = path.split("/");
  return parts[parts.length - 1] || path;
}

function isAtlas(path: string) {
  const name = baseName(path).toLowerCase();
  return name.endsWith(".atlas") || name.endsWith(".atlas.txt");
}

function extOf(path: string) {
  const name = baseName(path).toLowerCase();
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot) : "";
}

function junkPath(path: string) {
  if (path.includes("__MACOSX")) return true;
  const base = baseName(path);
  return base === ".DS_Store" || base.startsWith("._");
}

function isZip(data: Uint8Array) {
  return data.length > 3 && data[0] === 0x50 && data[1] === 0x4b;
}

function decodeText(data: Uint8Array) {
  return new TextDecoder().decode(data);
}

function encodeText(text: string) {
  return new TextEncoder().encode(text);
}

async function walkZip(data: Uint8Array, prefix: string, out: SpineEntry[]) {
  const zip = await JSZip.loadAsync(data);
  for (const [path, entry] of Object.entries(zip.files)) {
    if (entry.dir || junkPath(path)) continue;
    const buf = new Uint8Array(await entry.async("uint8array"));
    const full = prefix + path;
    if (extOf(full) === ".zip" || isZip(buf)) {
      const folder = full.replace(/\.zip$/i, "");
      await walkZip(buf, folder + "/", out);
    } else {
      out.push({ path: full, data: buf });
    }
  }
}

export async function collectFiles(list: File[]): Promise<SpineEntry[]> {
  const out: SpineEntry[] = [];
  for (const file of list) {
    const data = new Uint8Array(await file.arrayBuffer());
    if (extOf(file.name) === ".zip" || isZip(data)) await walkZip(data, "", out);
    else out.push({ path: file.name, data });
  }
  return out;
}

export async function zipEntries(entries: SpineEntry[]): Promise<Blob> {
  const zip = new JSZip();
  for (const entry of entries) zip.file(entry.path, entry.data);
  return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
}

function parseJson(data: Uint8Array): SpineJson | null {
  try {
    const value = JSON.parse(decodeText(data)) as SpineJson;
    if (!value || typeof value !== "object") return null;
    const hasBones = Array.isArray(value.bones);
    const hasAnims = !!value.animations && typeof value.animations === "object" && !Array.isArray(value.animations);
    if (!hasBones && !hasAnims) return null;
    if (!hasBones) value.bones = [];
    return value;
  } catch {
    return null;
  }
}

function emptyBox(): Aabb {
  return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
}

function larger(a: Aabb, b: Aabb) {
  return Math.max(a.width, a.height) >= Math.max(b.width, b.height) ? a : b;
}

async function resizeRaster(data: Uint8Array, path: string, factor: number) {
  try {
    if (!Number.isFinite(factor) || Math.abs(factor - 1) < 1e-8) return data;
    if (typeof createImageBitmap !== "function" || typeof document === "undefined") return data;
    const ext = extOf(path);
    const mime = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : ext === ".webp" ? "image/webp" : "image/png";
    const bitmap = await createImageBitmap(new Blob([data.slice()]));
    const width = Math.max(1, Math.round(bitmap.width * factor));
    const height = Math.max(1, Math.round(bitmap.height * factor));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return data;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, 0.92));
    if (!blob) return data;
    return new Uint8Array(await blob.arrayBuffer());
  } catch {
    return data;
  }
}

export async function resizeEntries(entries: SpineEntry[], opts: ResizeOptions) {
  const target = Math.max(16, Math.min(8192, Math.round(opts.target) || 300));
  type JsonJob = { path: string; data: SpineJson; box: Aabb };
  type SkelJob = { path: string; sk: ReturnType<typeof readSkel>; box: Aabb };
  const jsons: JsonJob[] = [];
  const skels: SkelJob[] = [];
  const spines: SpineEntry[] = [];
  const atlases: SpineEntry[] = [];
  const images: SpineEntry[] = [];
  const rest: SpineEntry[] = [];

  for (const entry of entries) {
    const ext = extOf(entry.path);
    if (ext === ".json") {
      const data = parseJson(entry.data);
      if (!data) {
        rest.push(entry);
        continue;
      }
      if (opts.bake) bakeJsonScales(data);
      jsons.push({ path: entry.path, data, box: jsonAABB(data) });
    } else if (ext === ".skel") {
      const sk = readSkel(entry.data);
      if (opts.bake) bakeSkelScales(sk);
      skels.push({ path: entry.path, sk, box: skelWorldAABB(sk) });
    } else if (ext === ".spine") spines.push(entry);
    else if (isAtlas(entry.path)) atlases.push(entry);
    else if (IMAGE_EXT.has(ext)) images.push(entry);
    else rest.push(entry);
  }

  let box = emptyBox();
  for (const job of skels) box = larger(box, job.box);
  for (const job of jsons) box = larger(box, job.box);
  let approx = false;
  if (box.width < 1 && box.height < 1 && spines.length) {
    approx = true;
    for (const entry of spines) {
      const inflated = await inflateRaw(entry.data);
      const span = measureSpine(inflated).meshSpan;
      box = larger(box, {
        minX: span.minX,
        minY: span.minY,
        maxX: span.maxX,
        maxY: span.maxY,
        width: span.width,
        height: span.height,
      });
    }
  }
  if (box.width < 1 && box.height < 1 && !jsons.length && !skels.length && !spines.length) {
    throw new Error("No .json, .skel or .spine");
  }
  const factor = fitFactor(box, target);
  const out: SpineEntry[] = [];

  for (const job of jsons) {
    const off = opts.center ? centerOffset(job.box, factor) : { x: 0, y: 0 };
    scaleJson(job.data, factor, off.x, off.y);
    out.push({ path: job.path, data: encodeText(JSON.stringify(job.data)) });
  }
  for (const job of skels) {
    const off = opts.center ? centerOffset(job.box, factor) : { x: 0, y: 0 };
    scaleSkel(job.sk, factor, off.x, off.y);
    const bytes = writeSkel(job.sk, 1);
    readSkel(bytes);
    out.push({ path: job.path, data: bytes });
  }
  const shared = opts.center ? centerOffset(box, factor) : { x: 0, y: 0 };
  let spineBones = 0;
  let spineKeys = 0;
  for (const entry of spines) {
    const scaled = await scaleSpineFile(entry.data, factor, shared.x, shared.y);
    spineBones = Math.max(spineBones, scaled.stats.bones);
    spineKeys += scaled.stats.animPairs;
    out.push({ path: entry.path, data: scaled.bytes });
  }
  for (const entry of atlases) {
    out.push({ path: entry.path, data: encodeText(scaleAtlas(decodeText(entry.data), factor)) });
  }
  for (const entry of images) {
    out.push({ path: entry.path, data: await resizeRaster(entry.data, entry.path, factor) });
  }
  out.push(...rest);

  const w = Math.round(box.width);
  const h = Math.round(box.height);
  const kinds: string[] = [];
  if (jsons.length) kinds.push("json");
  if (skels.length) kinds.push("skel");
  if (spines.length) kinds.push("spine");
  const kind = kinds.join("+") || "spine";
  const bones = skels[0]?.sk.bones.length ?? jsons[0]?.data.bones.length ?? spineBones;
  const jsonAnims = jsons.reduce((n, job) => n + Object.keys(job.data.animations ?? {}).length, 0);
  const skelAnims = skels.reduce((n, job) => n + (job.sk.animations?.length ?? 0), 0);
  const animBits: string[] = [];
  if (jsons.length && !skels.length) animBits.push(`${jsonAnims} anim`);
  else if (skels.length && !jsons.length) animBits.push(`${skelAnims} anim`);
  else {
    if (jsons.length) animBits.push(`${jsonAnims} json`);
    if (skels.length) animBits.push(`${skelAnims} skel`);
  }
  if (spines.length) animBits.push(`${spineKeys} translate`);
  const animText = animBits.join("  ") || "0 anim";
  const line = `${kind}  ${w}×${h}${approx ? "~" : ""}  ×${factor.toFixed(3)}  ${bones} bones  ${animText}  ${target}`;
  return { entries: out, factor, line };
}
