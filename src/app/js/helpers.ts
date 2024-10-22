import { ApplicationState, NumberPair, Vector2 } from "../types";

/**
 * Returns the quotient and remainder as a tuple.
 */
function divmod(n: number, m: number): NumberPair {
  return [Math.floor(n / m), n % m];
}

function getFormByName(name: string): HTMLFormElement | undefined {
  const forms = document.forms as unknown as { [key: string]: HTMLFormElement };
  return forms[name] || undefined;
}

function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function getFile(form: HTMLFormElement, name: string) {
  const fileInput = form.elements.namedItem(name) as HTMLInputElement;
  const { files } = fileInput;
  if (!files) {
    throw new Error(`File is not selected for "${name}" input`);
  }
  return files[0];
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

export {
  clearCanvas,
  divmod,
  getFile,
  getFormByName,
  getRelativeMousePosition,
  getSnappedPosition,
};
