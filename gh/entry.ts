import { collectFiles, resizeEntries, zipEntries } from "../src/lib/spine/resizeProject";

const drop = document.getElementById("drop") as HTMLButtonElement;
const input = document.getElementById("file") as HTMLInputElement;
const list = document.getElementById("list") as HTMLElement;
const go = document.getElementById("go") as HTMLButtonElement;
const line = document.getElementById("line") as HTMLElement;
const size = document.getElementById("size") as HTMLInputElement;
const bake = document.getElementById("bake") as HTMLButtonElement;
const center = document.getElementById("center") as HTMLButtonElement;

let files: File[] = [];
let busy = false;
let zipUrl = "";

function revokeZip() {
  if (!zipUrl) return;
  URL.revokeObjectURL(zipUrl);
  zipUrl = "";
}

function paint() {
  list.replaceChildren();
  for (const file of files) {
    const row = document.createElement("span");
    row.textContent = file.name;
    list.appendChild(row);
  }
  go.disabled = !files.length || busy;
  if (!files.length && !busy) line.textContent = ".json Import Data · .spine Open";
}

function fileKey(file: File) {
  return file.name + "\0" + file.size + "\0" + file.lastModified;
}

function add(batch: FileList | File[]) {
  const seen = new Set(files.map(fileKey));
  let added = 0;
  for (const file of batch) {
    const key = fileKey(file);
    if (seen.has(key)) continue;
    seen.add(key);
    files.push(file);
    added++;
  }
  if (!added) return;
  revokeZip();
  line.textContent = `${files.length} files`;
  paint();
}

drop.addEventListener("click", () => input.click());
drop.addEventListener("dragover", (event) => {
  event.preventDefault();
  drop.classList.add("hot");
});
drop.addEventListener("dragleave", () => drop.classList.remove("hot"));
drop.addEventListener("drop", (event) => {
  event.preventDefault();
  drop.classList.remove("hot");
  if (event.dataTransfer?.files?.length) add(event.dataTransfer.files);
});
input.addEventListener("change", () => {
  if (input.files?.length) add(input.files);
  input.value = "";
});
for (const button of [bake, center]) {
  button.addEventListener("click", () => {
    const on = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", on ? "true" : "false");
  });
}
go.addEventListener("click", async () => {
  if (!files.length || busy) return;
  busy = true;
  paint();
  revokeZip();
  line.textContent = "…";
  try {
    const entries = await collectFiles(files);
    const result = await resizeEntries(entries, {
      target: Number(size.value) || 300,
      bake: bake.getAttribute("aria-pressed") === "true",
      center: center.getAttribute("aria-pressed") === "true",
    });
    const blob = await zipEntries(result.entries);
    revokeZip();
    const url = URL.createObjectURL(blob);
    zipUrl = url;
    const a = document.createElement("a");
    a.href = url;
    a.download = "resized.zip";
    a.textContent = "resized.zip";
    line.replaceChildren(document.createTextNode(result.line + "  "), a);
    a.click();
  } catch (error) {
    line.textContent = error instanceof Error ? error.message : "failed";
  } finally {
    busy = false;
    paint();
  }
});
paint();
