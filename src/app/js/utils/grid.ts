function getGridCoordinates(
  x: number,
  y: number,
  tileWidth: number,
  tileHeight: number
) {
  return {
    column: Math.floor(x / tileWidth),
    row: Math.floor(y / tileHeight),
  };
}

function gridTopLeftPosition(
  row: number,
  column: number,
  tileWidth: number,
  tileHeight: number
) {
  return {
    x: column * tileWidth,
    y: row * tileHeight,
  };
}

function clampPosition(
  x: number,
  y: number,
  tileWidth: number,
  tileHeight: number,
  rows: number,
  cols: number
) {
  const maxX = (cols - 1) * tileWidth;
  const maxY = (rows - 1) * tileHeight;
  return {
    x: Math.min(x, maxX),
    y: Math.min(y, maxY),
  };
}

function snapToGrid(
  x: number,
  y: number,
  tileWidth: number,
  tileHeight: number,
  rows: number,
  cols: number
) {
  const { row, column } = getGridCoordinates(x, y, tileWidth, tileHeight);
  const { x: snappedX, y: snappedY } = gridTopLeftPosition(
    row,
    column,
    tileWidth,
    tileHeight
  );
  return clampPosition(snappedX, snappedY, tileWidth, tileHeight, rows, cols);
}

export { snapToGrid };
