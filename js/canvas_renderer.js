import { composition } from "./state.js";

export function renderComposition(canvas, composition) {
  const ctx = canvas.getContext("2d");
  console.log("Rendering composition:", composition);
  ctx.fillStyle = "yellow";
  ctx.fillRect(0, 0, 10, 10);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px sans-serif";

  const xOffset = 10;
  const yOffset = 50;
  let x = xOffset;

  const tokens = composition.paragraphs[0].children;
  const { cursorIndex, selection } = composition;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const value = token.pitch || token.value || "";
    if (typeof value !== "string") continue;

    const width = ctx.measureText(value).width + 4;

    if (selection && selection.start !== null && selection.end !== null) {
      const selStart = Math.min(selection.start, selection.end);
      const selEnd = Math.max(selection.start, selection.end);
      if (i >= selStart && i <= selEnd) {
        ctx.fillStyle = "#d0eaff";
        ctx.fillRect(x - 2, yOffset - 16, width, 24);
      }
    }

    ctx.fillStyle = "black";
    ctx.fillText(value, x, yOffset);
    console.log("Rendering token:", token, "value=", value);

    ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
    ctx.strokeRect(x, yOffset - 15, width, 20);

    token.x = x;
    token.y = yOffset - 15;
    token.width = width;
    token.height = 20;

    if (cursorIndex === i) {
      ctx.beginPath();
      ctx.moveTo(x - 1, yOffset - 16);
      ctx.lineTo(x - 1, yOffset + 8);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    x += width;

  // Draw cursor if it's at the end of the line
  if (cursorIndex === tokens.length) {
    ctx.beginPath();
    ctx.moveTo(x - 1, yOffset - 16);
    ctx.lineTo(x - 1, yOffset + 8);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  }
}