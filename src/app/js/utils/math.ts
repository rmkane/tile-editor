import { Cell, NumberPair } from "../../types";

/**
 * Returns the quotient and remainder as a tuple.
 */
function divmod(n: number, m: number): NumberPair {
  return [Math.floor(n / m), n % m];
}

function measureSelection(selection: Cell[]) {
  return {
    rows: computeMinMaxDelta(selection.map((cell) => cell.row)) + 1,
    columns: computeMinMaxDelta(selection.map((cell) => cell.column)) + 1,
  };
}

function computeMinMaxDelta(values: number[]) {
  return Math.max(...values) - Math.min(...values);
}

export { divmod, measureSelection };
