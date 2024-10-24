import { ApplicationState } from "../../types";
import { gridPositionToIndex } from "./grid";
import { measureSelection } from "./math";

function getSelectedTileIndices(state: ApplicationState) {
  if (!state.selectedCells || !state.metadata) return [];
  const { columns: sourceColumns } = state.metadata.tilesheet;
  const { rows, columns } = measureSelection(state.selectedCells);
  const indexMatrix: number[][] = [];
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    indexMatrix.push([]);
    for (let colIndex = 0; colIndex < columns; colIndex++) {
      const i = gridPositionToIndex(rowIndex, colIndex, columns);
      const { row, column } = state.selectedCells[i];
      const tileIndex = gridPositionToIndex(row, column, sourceColumns);
      indexMatrix[rowIndex].push(tileIndex);
    }
  }
  return indexMatrix;
}

export { getSelectedTileIndices };
