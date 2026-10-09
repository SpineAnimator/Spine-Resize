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

function paint() {
  list.replaceChildren();
  for (const file of files) {
    const row = document.createElement("span");
    row.textContent = file.name;
    list.appendChild(row);
  }
  go.disabled = !files.length || busy;
  if (!files.length && !busy) line.textContent = "json · skel · spine";
}

function add(batch: FileList | File[]) {
  files = files.concat([...batch]);
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
  line.textContent = "…";
  try {
    const entries = await collectFiles(files);
    const result = await resizeEntries(entries, {
      target: Number(size.value) || 300,
      bake: bake.getAttribute("aria-pressed") === "true",
      center: center.getAttribute("aria-pressed") === "true",
    });
    const blob = await zipEntries(result.entries);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resized.zip";
    a.click();
    URL.revokeObjectURL(url);
    line.textContent = result.line;
  } catch (error) {
    line.textContent = error instanceof Error ? error.message : "failed";
  } finally {
    busy = false;
    paint();
  }
});
paint();
