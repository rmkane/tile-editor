import { divmod } from "./helpers.js";

/**
 * @param {HTMLImageElement} image
 */
function renderImageToCanvas(ctx, image) {
  if (!image) return;
  ctx.canvas.width = image.width;
  ctx.canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {ApplicationState} state
 */
function renderMetadataToCanvas(ctx, state) {
  const { metadata } = state;

  if (!metadata) return;

  const color = "rgba(255, 0, 0, 0.5)";

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  metadata.tiles.forEach((tile, index) => {
    const { x, y, width, height } = tile;
    ctx.strokeRect(x, y, width, height);

    const cx = x + width / 2;
    const cy = y + height / 2;

    ctx.fillText(index, cx, cy);
  });
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {ApplicationState} state
 */
function renderLevelToCanvas(ctx, state) {
  if (!state.metadata || !state.level) return;

  const { tileWidth, tileHeight } = state.metadata.tilesheet;
  const { rows: sheetRows, columns: sheetCols } = state.metadata.tilesheet;
  const { rows: levelRows, columns: levelCols, layers } = state.level;

  const levelWidth = levelCols * tileWidth;
  const levelHeight = levelRows * tileHeight;

  ctx.canvas.width = levelWidth;
  ctx.canvas.height = levelHeight;

  for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
    const { data: levelData } = layers[layerIndex];
    for (let rowIndex = 0; rowIndex < levelRows; rowIndex++) {
      for (let colIndex = 0; colIndex < levelCols; colIndex++) {
        const tileIndex = levelData[colIndex][rowIndex];
        if (tileIndex < 0) continue;
        const [tileRow, tileCol] = divmod(tileIndex, sheetCols);

        const x = rowIndex * tileWidth;
        const y = colIndex * tileHeight;

        ctx.drawImage(
          state.spritesheet,
          tileCol * tileWidth,
          tileRow * tileHeight,
          tileWidth,
          tileHeight,
          x,
          y,
          tileWidth,
          tileHeight
        );
      }
    }
  }

  // TODO: Debug?
  renderGridToCanvas(ctx, {
    rows: levelRows,
    cols: levelCols,
    tileWidth,
    tileHeight,
  });
}

function renderGridToCanvas(ctx, { rows, cols, tileWidth, tileHeight }) {
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    for (let colIndex = 0; colIndex < cols; colIndex++) {
      ctx.beginPath();
      ctx.rect(
        rowIndex * tileWidth,
        colIndex * tileHeight,
        tileWidth,
        tileHeight
      );
      ctx.stroke();
    }
  }
}

function renderHoverToCanvas(ctx, state) {
  if (!state.metadata || !state.mouse) return;

  const { tileWidth, tileHeight } = state.metadata.tilesheet;
  const { x, y } = state.mouse;

  ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
  ctx.beginPath();
  ctx.rect(x, y, tileWidth, tileHeight);
  ctx.fill();
}

export {
  renderHoverToCanvas,
  renderImageToCanvas,
  renderLevelToCanvas,
  renderMetadataToCanvas,
};
