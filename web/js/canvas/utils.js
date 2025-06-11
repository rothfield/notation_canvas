export function withSavedContext(ctx, fn) {
  ctx.save();
  try {
    fn();
  } finally {
    ctx.restore();
  }
}

export function drawBravuraSymbol(ctx, glyph, x, y) {
  ctx.save();
  ctx.font = "20px Bravura";
  ctx.fillText(glyph, x, y);
  ctx.restore();
}
