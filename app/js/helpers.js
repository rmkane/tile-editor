/**
 * Returns the quotient and remainder as a tuple.
 *
 * @param {number} n
 * @param {number} m
 * @returns {number[]}
 */
function divmod(n, m) {
  return [Math.floor(n / m), n % m];
}

function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function getFile(form, name) {
  return form.elements[name].files[0];
}

function getSnappedPosition(mousePosition, state) {
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

function getRelativeMousePosition({ target, clientX, clientY }) {
  const { left, top } = event.target.getBoundingClientRect();
  return { x: clientX - left, y: clientY - top };
}

export {
  clearCanvas,
  divmod,
  getFile,
  getRelativeMousePosition,
  getSnappedPosition,
};
