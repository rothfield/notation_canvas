export function render(ctx, tokens, selection) {
  if (!selection || selection.start == null || selection.end == null) return;

  const start = Math.min(selection.start, selection.end);
  const end = Math.max(selection.start, selection.end);
  const selected = tokens.slice(start, end).filter(t => t.bbox);

  if (selected.length === 0) return;

  const first = selected[0];
  const last = selected[selected.length - 1];

  const xStart = first.bbox.x - 2;
  const xEnd = last.bbox.x + last.bbox.width;
  const y = first.bbox.y;
  const height = first.bbox.height;

  ctx.save();
  ctx.fillStyle = "#0033cc";
  ctx.fillRect(xStart, y, xEnd - xStart, height);
  ctx.restore(); // Restore fillStyle etc.
}

