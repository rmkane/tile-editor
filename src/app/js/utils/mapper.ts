import { ApplicationState, Cell, Entity, Vector2 } from "../../types";

function vectorToCell({ x, y }: Vector2): Cell {
  return { row: y, column: x };
}

function cellToVector({ row, column }: Cell): Vector2 {
  return { x: column, y: row };
}

function cellToHighlight(
  { row, column }: Cell,
  state: ApplicationState
): Entity {
  if (!state.metadata) throw Error("Metadata is not set");
  const { tileWidth, tileHeight } = state.metadata.tilesheet;
  return {
    x: column * tileWidth,
    y: row * tileHeight,
    width: tileWidth,
    height: tileHeight,
  };
}

export { cellToHighlight, cellToVector, vectorToCell };
