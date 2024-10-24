import "./tailwind.css";
import "./style.css";

import type {
  ApplicationState,
  Cell,
  Level,
  SpriteAtlas,
  Vector2,
} from "./app/types.js";

import { clearCanvas } from "./app/js/utils/canvas.js";
import { downloadAsJSON } from "./app/js/utils/download.js";
import { getFile, getFormByName } from "./app/js/utils/form.js";
import { loadImage, loadJSON } from "./app/js/utils/load.js";
import {
  getGridPositionFromClick,
  getTilePositionFromClick,
} from "./app/js/utils/mouse.js";
import { readFileAsImage, readFileAsJSON } from "./app/js/utils/reader.js";
import {
  renderGhostToCanvas,
  renderHighlightsToCanvas,
  renderHoverToCanvas,
  renderImageToCanvas,
  renderLevelToCanvas,
  renderMetadataToCanvas,
} from "./app/js/features/renderers.js";
import { getBounds } from "./app/js/utils/grid.js";
import { cellToVector } from "./app/js/utils/mapper.js";
import { getSelectedTileIndices } from "./app/js/utils/tile.js";

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
levelCtx.imageSmoothingEnabled = false;

loadAtlasForm.addEventListener("submit", updateAtlas);

atlasCanvas.addEventListener("mousedown", onDragStart);
atlasCanvas.addEventListener("mouseup", onDragEnd);
atlasCanvas.addEventListener("mousemove", onDrag);
atlasCanvas.addEventListener("mouseenter", setCursor);
atlasCanvas.addEventListener("mouseleave", clearCursor);

levelCanvas.addEventListener("click", stampTile);
levelCanvas.addEventListener("mouseenter", setCursor);
levelCanvas.addEventListener("mouseleave", clearCursor);
levelCanvas.addEventListener("mousemove", updateMousePosition);

downloadBtn.addEventListener("click", downloadLevel);

function onDragStart(event: MouseEvent) {
  state.dragStartPosition = getGridPositionFromClick(event, state);
}

function cellsEqual(left?: Cell, right?: Cell) {
  if (!left && !right) return true;
  if (!left || !right) return false;
  return left.column === right.column && left.row === right.row;
}

function isAlreadySelected() {
  return (
    state.selectedCells?.length === 1 &&
    cellsEqual(state.selectedCells[0], state.dragStartPosition) &&
    cellsEqual(state.dragStartPosition, state.dragEndPosition)
  );
}

function onDragEnd(event: MouseEvent) {
  if (!state.metadata) return;

  state.dragEndPosition = getGridPositionFromClick(event, state);

  if (isAlreadySelected()) {
    state.selectedCells = [];
  } else {
    updateSelection();
  }

  state.dragStartPosition = undefined; // clear
  state.dragEndPosition = undefined; // clear
}

function onDrag(event: MouseEvent) {
  updateState({
    cursor: {
      target: event.target as HTMLCanvasElement,
      position: getTilePositionFromClick(event, state)!,
    },
  });

  state.dragEndPosition = getGridPositionFromClick(event, state);
  updateSelection();
}

function updateSelection() {
  if (!state.dragStartPosition || !state.dragEndPosition) return;
  const bounds = getBounds([
    cellToVector(state.dragStartPosition),
    cellToVector(state.dragEndPosition),
  ]);

  state.selectedCells = computeSelection(bounds);
}

function computeSelection([tl, br]: Vector2[]) {
  if (!state.metadata) return;
  const selectedCells: Cell[] = [];
  for (let row = tl.y; row <= br.y; row++) {
    for (let column = tl.x; column <= br.x; column++) {
      selectedCells.push({ row, column });
    }
  }
  return selectedCells;
}

init();
animate();

function downloadLevel(_event: MouseEvent) {
  if (!state.level) return;
  downloadAsJSON(state.level, `${state.level.name}.json`);
}

// TODO: Convert selection to a matrix of indices and stamp those
function stampTile(this: HTMLCanvasElement, event: MouseEvent) {
  if (!state.metadata || !state.level || !state.selectedCells?.length) return;
  const gridPosition = getGridPositionFromClick(event, state);
  if (!gridPosition) return;
  const { row, column } = gridPosition;
  const matrix = getSelectedTileIndices(state);
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
    for (let colIndex = 0; colIndex < matrix[rowIndex].length; colIndex++) {
      const dRow = row + rowIndex;
      const dCol = column + colIndex;
      state.level.layers[0].data[dRow][dCol] = matrix[rowIndex][colIndex];
    }
  }
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
  updateState({ cursor: undefined });
}

function updateMousePosition(event: MouseEvent) {
  if (!(event.target instanceof HTMLCanvasElement)) return;
  const canvas: HTMLCanvasElement = event.target;

  updateState({
    cursor: {
      target: canvas,
      position: getTilePositionFromClick(event, state)!,
    },
  });
}

async function init() {
  await loadLevel("/data/levels/level_1.json");
}

async function loadLevel(path: string) {
  const level = await loadJSON<Level>(path);
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
      level: await readFileAsJSON<Level>(getFile(form, "level")),
      spritesheet: await readFileAsImage(getFile(form, "spritesheet")),
      metadata: await readFileAsJSON<SpriteAtlas>(getFile(form, "metadata")),
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
  renderHighlightsToCanvas(atlasCtx, state);
  renderHoverToCanvas(atlasCtx, state);

  renderLevelToCanvas(levelCtx, state);
  renderGhostToCanvas(levelCtx, state);
  renderHoverToCanvas(levelCtx, state);

  requestAnimationFrame(animate); // Continue the loop
}

function updateState(updatedState: ApplicationState) {
  Object.assign(state, updatedState);
}
