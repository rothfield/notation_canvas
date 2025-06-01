
export let tokenBoxes = [];

export function drawComposition(ctx, tokens, cursorIndex, selectionStartIndex, selectionEndIndex) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = '20px sans-serif';
  ctx.textBaseline = 'top';

  tokenBoxes.length = 0;

  const lineHeight = 28;
  const margin = 10;
  let x = margin;
  let y = margin;
  let index = 0;

  while (index < tokens.length) {
    const lineStart = index;
    const lineY = y;

    while (index < tokens.length) {
      const token = tokens[index];
      const text = token.pitch || token.value || '?';
      const width = ctx.measureText(text).width + 4;

      // Wrap line if needed
      if (x + width > ctx.canvas.width - margin) {
        break;
      }

      // Selection highlight
      if (
        selectionStartIndex !== null &&
        selectionEndIndex !== null &&
        index >= Math.min(selectionStartIndex, selectionEndIndex) &&
        index <= Math.max(selectionStartIndex, selectionEndIndex)
      ) {
        ctx.fillStyle = 'rgba(180, 200, 255, 0.6)';
        ctx.fillRect(x - 1, y - 2, width + 2, lineHeight);
      }

      // Draw token
      ctx.fillStyle = 'black';
      ctx.fillText(text, x, y);

      tokenBoxes.push({ index, x1: x, x2: x + width, y1: y, y2: y + lineHeight });

      x += width;
      index++;
    }

    y += lineHeight;
    x = margin;
  }

  // Draw cursor
  if (cursorIndex <= tokens.length) {
    const cursorToken = tokenBoxes.find(b => b.index === cursorIndex);
    if (cursorToken) {
      ctx.fillStyle = 'black';
      ctx.fillRect(cursorToken.x1 - 1, cursorToken.y1 - 2, 2, 24);
    }
  }
}

export function getTokenIndexAt(x, y) {
  for (const box of tokenBoxes) {
    if (
      x >= box.x1 &&
      x <= box.x2 &&
      y >= box.y1 &&
      y <= box.y2
    ) {
      return box.index;
    }
  }
  return null;
}
