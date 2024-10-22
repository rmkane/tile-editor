import "./tailwind.css";
import "./style.css";

import type { ApplicationState } from "./app/types.js";

import { clearCanvas } from "./app/js/utils/canvas.js";
import { getFile, getFormByName } from "./app/js/utils/form.js";
import { getTilePosition } from "./app/js/utils/mouse.js";
import { loadImage, loadJSON } from "./app/js/loaders.js";
import { readFileAsImage, readFileAsJSON } from "./app/js/readers.js";
import {
  renderHoverToCanvas,
  renderImageToCanvas,
  renderLevelToCanvas,
  renderMetadataToCanvas,
} from "./app/js/renderers.js";
import { downloadAsJSON } from "./app/js/utils/download.js";

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
    <div class="flex flex-col justify-center items-center gap-4">
      <canvas class="render-level"></canvas>
      <button type="button" class="download-level">Download Level</button>
    </div>
  </div>
`;

const loadAtlasForm = getFormByName("load-atlas")!;

const atlasCanvas = document.querySelector<HTMLCanvasElement>(".render-atlas")!;
const levelCanvas = document.querySelector<HTMLCanvasElement>(".render-level")!;
const atlasCtx = atlasCanvas.getContext("2d")!;
const levelCtx = levelCanvas.getContext("2d")!;

const downloadBtn =
  document.querySelector<HTMLButtonElement>(".download-level")!;

const state: ApplicationState = {};

atlasCtx.imageSmoothingEnabled = false;
loadAtlasForm.addEventListener("submit", updateAtlas);

atlasCanvas.addEventListener("click", selectTile);
levelCanvas.addEventListener("click", stampTile);

downloadBtn.addEventListener("click", downloadLevel);

document.addEventListener("mouseenter", setCursor);
document.addEventListener("mouseleave", clearCursor);
document.addEventListener("mousemove", updateMousePosition);

init();
animate();

function downloadLevel(_event: MouseEvent) {
  if (!state.level) return;
  downloadAsJSON(state.level, `${state.level.name}.json`);
}

function selectTile(this: HTMLCanvasElement, event: MouseEvent) {
  if (!state.metadata) return;
  const position = getTilePosition(event, state);
  if (!position) return;
  const { columns, tileHeight, tileWidth } = state.metadata.tilesheet;
  const { x, y } = position;
  const row = Math.floor(y / tileWidth);
  const column = Math.floor(x / tileHeight);
  const tileIndex = row * columns + column;
  updateState({ selectedTileIndex: tileIndex });
}

function stampTile(this: HTMLCanvasElement, event: MouseEvent) {
  if (!state.metadata || !state.level || state.selectedTileIndex == null)
    return;
  const position = getTilePosition(event, state);
  if (!position) return;
  const { tileHeight, tileWidth } = state.metadata.tilesheet;
  const { x, y } = position;
  const row = Math.floor(y / tileWidth);
  const column = Math.floor(x / tileHeight);

  state.level.layers[0].data[row][column] = state.selectedTileIndex;
}

function setCursor(event: MouseEvent) {
  if (!(event.target instanceof HTMLCanvasElement)) return;
  const canvas: HTMLCanvasElement = event.target;
  updateState({
    cursor: {
      target: canvas,
      position: { x: 0, y: 0 },
    },
  });
}

function clearCursor(event: MouseEvent) {
  if (!(event.target instanceof HTMLCanvasElement)) return;
  updateState({ cursor: null });
}

function updateMousePosition(event: MouseEvent) {
  if (!(event.target instanceof HTMLCanvasElement)) return;
  const canvas: HTMLCanvasElement = event.target;

  updateState({
    cursor: {
      target: canvas,
      position: getTilePosition(event, state),
    },
  });
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
      level: await readFileAsJSON(getFile(form, "level")),
      spritesheet: await readFileAsImage(getFile(form, "spritesheet")),
      metadata: await readFileAsJSON(getFile(form, "metadata")),
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
  renderHoverToCanvas(atlasCtx, state);

  renderLevelToCanvas(levelCtx, state);
  renderHoverToCanvas(levelCtx, state);

  requestAnimationFrame(animate); // Continue the loop
}

function updateState<T>(value: T) {
  Object.assign(state, value);
}
