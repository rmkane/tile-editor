import type { ApplicationState, Vector2 } from "../../types";
import { snapToGrid } from "./grid";

function getTilePositionFromClick(event: MouseEvent, state: ApplicationState) {
  const relativePosition = getRelativeMousePosition(event);
  return getSnappedPosition(relativePosition, state);
}

function getGridPositionFromClick(event: MouseEvent, state: ApplicationState) {
  const tilePosition = getTilePositionFromClick(event, state);
  return tilePosition && getGridPositionFromTilePosition(tilePosition, state);
}

function getGridPositionFromTilePosition(
  position: Vector2,
  state: ApplicationState
) {
  if (!position || !state.metadata) return;
  const { tileHeight, tileWidth } = state.metadata.tilesheet;
  const { x, y } = position;
  return {
    row: Math.floor(y / tileWidth),
    column: Math.floor(x / tileHeight),
  };
}

function getSnappedPosition(mousePosition: Vector2, state: ApplicationState) {
  if (!state.metadata || !state.level) return;

  const { tileWidth, tileHeight } = state.metadata.tilesheet;
  const { rows: levelRows, columns: levelCols } = state.level;

  // Ensure the snap stays within the grid bounds
  return snapToGrid(
    mousePosition.x,
    mousePosition.y,
    tileWidth,
    tileHeight,
    levelRows,
    levelCols
  );
}

function getRelativeMousePosition({ target, clientX, clientY }: MouseEvent) {
  if (!target) return { x: 0, y: 0 };
  const element = target as HTMLElement;
  const { left, top } = element.getBoundingClientRect();
  return { x: clientX - left, y: clientY - top };
}

export {
  getGridPositionFromClick,
  getRelativeMousePosition,
  getSnappedPosition,
  getTilePositionFromClick,
};
