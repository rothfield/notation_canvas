import { withSavedContext } from "./utils.js";

export function drawSyllable(ctx, x, y, text, lyricFont) {
  let width = 0;
  withSavedContext(ctx, () => {
    ctx.font = lyricFont;
    const metrics = ctx.measureText(text);
    width = metrics.width;
    ctx.fillText(text, x, y);
  });
  return width;
}

