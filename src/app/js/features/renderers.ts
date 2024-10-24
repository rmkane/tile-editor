import { ApplicationState } from "../../types.js";
import { gridPositionToIndex } from "../utils/grid.js";
import { cellToHighlight } from "../utils/mapper.js";
import { divmod, measureSelection } from "../utils/math.js";

function renderImageToCanvas(
  ctx: CanvasRenderingContext2D,
  image?: HTMLImageElement
) {
  if (!image) return;
  ctx.canvas.width = image.width;
  ctx.canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
}

function renderMetadataToCanvas(
  ctx: CanvasRenderingContext2D,
  state: ApplicationState
) {
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

    ctx.fillText(String(index), cx, cy);
  });
}

function renderHighlightsToCanvas(
  ctx: CanvasRenderingContext2D,
  state: ApplicationState
) {
  if (!state.selectedCells) return;

  const opacity = state.dragStartPosition ? 0.2 : 0.4;
  const color = `rgba(0, 0, 255, ${opacity})`;

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  state.selectedCells.forEach((cell) => {
    const { x, y, width, height } = cellToHighlight(cell, state);
    ctx.fillRect(x, y, width, height);
  });
}

function renderLevelToCanvas(
  ctx: CanvasRenderingContext2D,
  state: ApplicationState
) {
  if (!state.metadata || !state.level || !state.spritesheet) return;

  const { tileWidth, tileHeight } = state.metadata.tilesheet;
  const { rows: _sheetRows, columns: sheetCols } = state.metadata.tilesheet;
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

type GridProps = {
  rows: number;
  cols: number;
  tileWidth: number;
  tileHeight: number;
};

function renderGridToCanvas(
  ctx: CanvasRenderingContext2D,
  { rows, cols, tileWidth, tileHeight }: GridProps
) {
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

function renderGhostToCanvas(
  ctx: CanvasRenderingContext2D,
  state: ApplicationState
) {
  if (
    !state.selectedCells ||
    !state.spritesheet ||
    !state.metadata ||
    !state.cursor?.position ||
    state.cursor?.target !== ctx.canvas
  )
    return;

  ctx.save();
  ctx.globalAlpha = 0.5;

  const { tileWidth, tileHeight } = state.metadata.tilesheet;
  const { rows, columns } = measureSelection(state.selectedCells);
  const { x, y } = state.cursor.position;

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    for (let colIndex = 0; colIndex < columns; colIndex++) {
      const i = gridPositionToIndex(rowIndex, colIndex, columns);
      const { row, column } = state.selectedCells[i];

      ctx.drawImage(
        state.spritesheet,
        column * tileWidth,
        row * tileHeight,
        tileWidth,
        tileHeight,
        x + colIndex * tileWidth,
        y + rowIndex * tileHeight,
        tileWidth,
        tileHeight
      );
    }
  }

  ctx.restore();

  ctx.strokeStyle = "rgba(255, 255, 0, 1.0)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, tileWidth * columns, tileHeight * rows);
}

function renderHoverToCanvas(
  ctx: CanvasRenderingContext2D,
  state: ApplicationState
) {
  if (state.selectedCells?.length) return;
  if (!state.metadata || !state.cursor?.position) return;
  if (state.cursor.target !== ctx.canvas) return;

  const { tileWidth, tileHeight } = state.metadata.tilesheet;
  const { x, y } = state.cursor.position;

  ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
  ctx.beginPath();
  ctx.rect(x, y, tileWidth, tileHeight);
  ctx.fill();
}

export {
  renderGhostToCanvas,
  renderHighlightsToCanvas,
  renderHoverToCanvas,
  renderImageToCanvas,
  renderLevelToCanvas,
  renderMetadataToCanvas,
};
