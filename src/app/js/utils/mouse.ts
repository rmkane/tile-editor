import type { ApplicationState, Vector2 } from "../../types";

function getTilePosition(event: MouseEvent, state: ApplicationState) {
  const relativePosition = getRelativeMousePosition(event);
  return getSnappedPosition(relativePosition, state);
}

function getSnappedPosition(mousePosition: Vector2, state: ApplicationState) {
  if (!state.metadata || !state.level) return;

  const { tileWidth, tileHeight } = state.metadata.tilesheet;
  const { rows: levelRows, columns: levelCols } = state.level;

  let col = Math.floor(mousePosition.x / tileWidth); // Find the column
  let row = Math.floor(mousePosition.y / tileHeight); // Find the row

  // Calculate the top-left corner of the snapped cell
  let snappedX = col * tileWidth;
  let snappedY = row * tileHeight;

  // Ensure the snap stays within the grid bounds
  return {
    x: Math.min(snappedX, (levelCols - 1) * tileWidth),
    y: Math.min(snappedY, (levelRows - 1) * tileHeight),
  };
}

function getRelativeMousePosition({ target, clientX, clientY }: MouseEvent) {
  if (!target) return { x: 0, y: 0 };
  const element = target as HTMLElement;
  const { left, top } = element.getBoundingClientRect();
  return { x: clientX - left, y: clientY - top };
}
export { getRelativeMousePosition, getSnappedPosition, getTilePosition };
