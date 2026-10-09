import { collectFiles, resizeEntries, zipEntries } from "../src/lib/spine/resizeProject";

const drop = document.getElementById("drop") as HTMLButtonElement;
const input = document.getElementById("file") as HTMLInputElement;
const list = document.getElementById("list") as HTMLElement;
const go = document.getElementById("go") as HTMLButtonElement;
const line = document.getElementById("line") as HTMLElement;
const size = document.getElementById("size") as HTMLInputElement;
const times = document.getElementById("times") as HTMLInputElement;
const percent = document.getElementById("percent") as HTMLInputElement;
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

let dragDepth = 0;
let ignoreClick = false;

drop.addEventListener("click", () => {
  // A drop on this button is followed by a click, which would open the picker.
  if (ignoreClick) return;
  input.click();
});
drop.addEventListener("dragenter", (event) => {
  event.preventDefault();
  dragDepth++;
  drop.classList.add("hot");
});
drop.addEventListener("dragover", (event) => {
  event.preventDefault();
  drop.classList.add("hot");
});
drop.addEventListener("dragleave", () => {
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) drop.classList.remove("hot");
});
drop.addEventListener("drop", (event) => {
  event.preventDefault();
  dragDepth = 0;
  drop.classList.remove("hot");
  ignoreClick = true;
  setTimeout(() => {
    ignoreClick = false;
  }, 400);
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
for (const field of [size, times, percent]) {
  field.addEventListener("focus", () => {
    const radio = field.parentElement?.querySelector<HTMLInputElement>('input[type="radio"]');
    if (radio) radio.checked = true;
  });
}
function scaleMode(): "side" | "times" | "percent" {
  const picked = document.querySelector<HTMLInputElement>('input[name="scale-mode"]:checked');
  if (picked?.value === "times" || picked?.value === "percent") return picked.value;
  return "side";
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
      times: Number(times.value),
      percent: Number(percent.value),
      mode: scaleMode(),
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
