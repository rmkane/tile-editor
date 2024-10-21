import {
  clearCanvas,
  getFile,
  getRelativeMousePosition,
  getSnappedPosition,
} from "./js/helpers.js";
import { loadImage, loadJSON } from "./js/loaders.js";
import { readFileAsImage, readFileAsJSON } from "./js/readers.js";
import {
  renderHoverToCanvas,
  renderImageToCanvas,
  renderLevelToCanvas,
  renderMetadataToCanvas,
} from "./js/renderers.js";

/** @type {HTMLFormElement} */
const loadAtlasForm = document.forms["load-atlas"];

/** @type {HTMLCanvasElement} */
const atlasCanvas = document.querySelector(".render-atlas");

/** @type {HTMLCanvasElement} */
const levelCanvas = document.querySelector(".render-level");

const atlasCtx = atlasCanvas.getContext("2d");

const levelCtx = levelCanvas.getContext("2d");

/** @type {ApplicationState} */
const state = {
  spritesheet: null,
  metadata: null,
  level: null,
  mouse: { x: 0, y: 0 },
};

atlasCtx.imageSmoothingEnabled = false;
loadAtlasForm.addEventListener("submit", updateAtlas);
levelCanvas.addEventListener("mousemove", updateMousePosition);
levelCanvas.addEventListener("mousemove", updateMousePosition);
levelCanvas.addEventListener("mouseleave", clearMouse);

function updateMousePosition(event) {
  const relativePosition = getRelativeMousePosition(event);
  const snappedPosition = getSnappedPosition(relativePosition, state);

  updateState({ mouse: snappedPosition });
}

function clearMouse(_event) {
  updateState({ mouse: null });
}

async function init() {
  await loadLevel("../app/data/levels/level_1.json");
}

async function loadLevel(path) {
  const level = await loadJSON(path);
  const { tileset } = level;
  updateState({
    level,
    spritesheet: await loadImage(`../assets/spritesheets/${tileset}.png`),
    metadata: await loadJSON(`../assets/spritesheets/${tileset}.json`),
  });
}

/**
 * @param {Event} event
 */
async function updateAtlas(event) {
  event.preventDefault(); // Prevent page navigation

  const form = event.target;

  try {
    updateState({
      level: await updateLevel(getFile(form, "level")),
      spritesheet: await updateSpritesheet(getFile(form, "spritesheet")),
      metadata: await updateMetadata(getFile(form, "metadata")),
    });
  } catch (error) {
    console.error("Error loading file:", error.message);
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

async function updateSpritesheet(file) {
  updateState({ spritesheet: await readFileAsImage(file) });
}

async function updateMetadata(file) {
  updateState({ metadata: await readFileAsJSON(file) });
}

async function updateLevel(file) {
  updateState({ level: await readFileAsJSON(file) });
}

function updateState(value) {
  Object.assign(state, value);
}

export { animate, init }