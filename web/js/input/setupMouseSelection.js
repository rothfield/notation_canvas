export function setupMouseSelection(canvas, composition, cursorRef, selection, updateAndRender) {
  let isDragging = false;
  let dragStartX = null;
  let dragStartIndex = null;

  canvas.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;

    // Locate drag start index
    const tokens = composition.lines[0].tokens;
    dragStartIndex = findIndexForX(tokens, x);
    dragStartX = x;
    isDragging = true;

    composition.cursorIndex = dragStartIndex;
    composition.selection.start = dragStartIndex;
    composition.selection.end = dragStartIndex;
    updateAndRender();
  });

  canvas.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;

    const tokens = composition.lines[0].tokens;
    const dragEndIndex = findIndexForX(tokens, x);

    composition.selection.start = dragStartIndex;
    composition.selection.end = dragEndIndex;
    updateAndRender();
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

function findIndexForX(tokens, xClick) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const bbox = token.bbox;
    if (!bbox) continue;

    const left = bbox.x;
    const right = bbox.x + bbox.width;
    const mid = (left + right) / 2;

    if (xClick >= left && xClick <= right) {
      return xClick < mid ? i : i + 1;
    }

    if (xClick < left) {
      return i;
    }
  }

  return tokens.length;
}

