export function handleDown(event, context) {
  if (event.button !== 0) return; // Only left click

  const { canvas, composition, selection, updateAndRender } = context;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;

  const tokens = composition.lines[0].tokens;
  const index = findIndexForX(tokens, x);

  context.dragStartX = x;
  context.dragStartIndex = index;
  context.isDragging = true;

  composition.cursorIndex = index;
  selection.start = index;
  selection.end = index;

  updateAndRender();
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

