import "./tailwind.css";
import "./style.css";

import { ApplicationState } from "./app/types.js";

import {
  clearCanvas,
  getFile,
  getFormByName,
  getRelativeMousePosition,
  getSnappedPosition,
} from "./app/js/helpers.js";
import { loadImage, loadJSON } from "./app/js/loaders.js";
import { readFileAsImage, readFileAsJSON } from "./app/js/readers.js";
import {
  renderHoverToCanvas,
  renderImageToCanvas,
  renderLevelToCanvas,
  renderMetadataToCanvas,
} from "./app/js/renderers.js";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>Tile Editor</h1>
  <div class="flex flex-row gap-4">
    <div class="flex flex-col gap-4">
      <form class="grid-form" name="load-atlas">
        <label for="atlas-spritesheet">Spritesheet</label>
        <input
          type="file"
          id="atlas-spritesheet"
          name="spritesheet"
          accept=".png,.gif,.bmp,.tif,.tiff|image/*"
          required
        />
        <label for="atlas-metadata">Metadata</label>
        <input
          type="file"
          name="metadata"
          accept="application/json"
          required
        />
        <label for="level-metadata">Level</label>
        <input type="file" name="level" accept="application/json" required />
        <button type="submit">Update</button>
      </form>
      <canvas class="render-atlas"></canvas>
    </div>
    <div class="flex flex-col">
      <canvas class="render-level"></canvas>
    </div>
  </div>
`;

const loadAtlasForm = getFormByName("load-atlas")!;

const atlasCanvas = document.querySelector<HTMLCanvasElement>(".render-atlas")!;
const levelCanvas = document.querySelector<HTMLCanvasElement>(".render-level")!;
const atlasCtx = atlasCanvas.getContext("2d")!;
const levelCtx = levelCanvas.getContext("2d")!;

const state: ApplicationState = {
  mouse: { x: 0, y: 0 },
};

atlasCtx.imageSmoothingEnabled = false;
loadAtlasForm.addEventListener("submit", updateAtlas);
levelCanvas.addEventListener("mousemove", updateMousePosition);
levelCanvas.addEventListener("mousemove", updateMousePosition);
levelCanvas.addEventListener("mouseleave", clearMouse);

init();
animate();

function updateMousePosition(event: MouseEvent) {
  const relativePosition = getRelativeMousePosition(event);
  const snappedPosition = getSnappedPosition(relativePosition, state);

  updateState({ mouse: snappedPosition });
}

function clearMouse(_event: MouseEvent) {
  updateState({ mouse: null });
}

async function init() {
  await loadLevel("/data/levels/level_1.json");
}

async function loadLevel(path: string) {
  const level = await loadJSON(path);
  const { tileset } = level;
  updateState({
    level,
    spritesheet: await loadImage(`${tileset}.png`),
    metadata: await loadJSON(`${tileset}.json`),
  });
}

function updateAtlas(event: SubmitEvent) {
  event.preventDefault(); // Prevent page navigation

  const form = event.target as HTMLFormElement; // Access the form

  performUpdate(form);
}

async function performUpdate(form: HTMLFormElement) {
  try {
    updateState({
      level: await updateLevel(getFile(form, "level")),
      spritesheet: await updateSpritesheet(getFile(form, "spritesheet")),
      metadata: await updateMetadata(getFile(form, "metadata")),
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error loading file:", error.message);
    } else {
      console.error("An unknown error occurred.");
    }
  }
}

function animate() {
  clearCanvas(atlasCtx);

  renderImageToCanvas(atlasCtx, state.spritesheet);
  renderMetadataToCanvas(atlasCtx, state);
  renderLevelToCanvas(levelCtx, state);
  renderHoverToCanvas(levelCtx, state);

  requestAnimationFrame(animate); // Continue the loop
}

async function updateSpritesheet(file: File) {
  updateState({ spritesheet: await readFileAsImage(file) });
}

async function updateMetadata(file: File) {
  updateState({ metadata: await readFileAsJSON(file) });
}

async function updateLevel(file: File) {
  updateState({ level: await readFileAsJSON(file) });
}

function updateState<T>(value: T) {
  Object.assign(state, value);
}
