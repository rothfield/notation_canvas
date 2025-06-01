
import { selectionRef } from "./state.js";

export function drawComposition(ctx, tokens, cursorIndex, xOffset = 10, yOffset = 50) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = "20px sans-serif";

  let x = xOffset;

  for (let i = 0; i < tokens.length; i++) {
    const { value } = tokens[i];
    const width = ctx.measureText(value).width + 4;

    // Highlight if selected
    if (selectionRef.start !== null && selectionRef.end !== null) {
      const selStart = Math.min(selectionRef.start, selectionRef.end);
      const selEnd = Math.max(selectionRef.start, selectionRef.end);
      if (i >= selStart && i <= selEnd) {
        ctx.fillStyle = "#d0eaff";
        ctx.fillRect(x - 2, yOffset - 16, width, 24);
      }
    }

    // Draw note/dash/etc
    ctx.fillStyle = "black";
    ctx.fillText(value, x, yOffset);

    // Draw cursor
    if (i === cursorIndex) {
      ctx.beginPath();
      ctx.moveTo(x - 1, yOffset - 16);
      ctx.lineTo(x - 1, yOffset + 8);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    x += width;
  }
}

function drawSelection(ctx, index, x, width, yOffset) {
  if (selectionRef.start === null || selectionRef.end === null) return;

  const selStart = Math.min(selectionRef.start, selectionRef.end);
  const selEnd = Math.max(selectionRef.start, selectionRef.end);

  if (index >= selStart && index <= selEnd) {
    ctx.fillStyle = "#d0eaff";
    ctx.fillRect(x - 2, yOffset - 16, width, 24);
  }
}
