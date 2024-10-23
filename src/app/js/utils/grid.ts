import { Vector2 } from "../../types";
import { divmod } from "./math";

function getBounds(points: Vector2[]): [Vector2, Vector2] {
  const xValues = points.map((p) => p.x);
  const yValues = points.map((p) => p.y);
  return [
    { x: Math.min(...xValues), y: Math.min(...yValues) },
    { x: Math.max(...xValues), y: Math.max(...yValues) },
  ];
}

function gridPositionToIndex(
  rowIndex: number,
  columnIndex: number,
  columns: number
) {
  return rowIndex * columns + columnIndex;
}

function gridIndexToPosition(index: number, columns: number) {
  const [row, column] = divmod(index, columns);
  return { row, column };
}

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
  return {
    x: clampValue(x, 0, (cols - 1) * tileWidth),
    y: clampValue(y, 0, (rows - 1) * tileHeight),
  };
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
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

export { getBounds, gridIndexToPosition, gridPositionToIndex, snapToGrid };
