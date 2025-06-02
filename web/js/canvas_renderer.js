import { getCanvasFontFromCSS } from "./utils/getCanvasFontFromCSS.js";
import { renderToken } from "./renderToken.js";
import { blink } from "./state.js";

export function renderComposition(canvas, composition) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = getCanvasFontFromCSS();

  const sampleMetrics = ctx.measureText("M");
  const ascent = sampleMetrics.actualBoundingBoxAscent || 15;
  const descent = sampleMetrics.actualBoundingBoxDescent || 5;

  const xOffset = 20;
  const yOffset = Math.floor(canvas.height / 2 + ascent / 2);
  let x = xOffset;

  const tokens = composition.paragraphs[0].children;
  const { cursorIndex, selection } = composition;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const text = token.text || "";
    if (token.type === "unknown") {
      console.log("render , discarding token", token);
      continue;
    }
    if (typeof text !== "string") continue;

    const metrics = ctx.measureText(text);
    const width = Math.ceil(metrics.width) + 0.5;
    const tokenAscent = metrics.actualBoundingBoxAscent || ascent;
    const tokenDescent = metrics.actualBoundingBoxDescent || descent;
    const height = tokenAscent + tokenDescent;

    const isSelected = selection?.start !== null &&
                       selection?.end !== null &&
                       i >= Math.min(selection.start, selection.end) &&
                       i < Math.max(selection.start, selection.end);

    // Highlight selection with white text on blue background
    if (isSelected) {
      ctx.fillStyle = "#0033cc"; // background
      ctx.fillRect(x - 2, yOffset - tokenAscent, width, height);
      ctx.fillStyle = "white";   // text
    } else {
      ctx.fillStyle = "black";   // text
    }

    // Cursor before token (if index matches)
    if (blink.visible && cursorIndex === i) {
      ctx.beginPath();
      ctx.moveTo(x - 1, yOffset - ascent);
      ctx.lineTo(x - 1, yOffset + descent);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.fillText(text, x, yOffset);

    const pitchWidth = width;

    if (token.octave === 1) {
      const dot = "•";
      const dotWidth = ctx.measureText(dot).width;
      const dotX = x + (pitchWidth - dotWidth) / 2;
      ctx.fillText(dot, dotX, yOffset - tokenAscent - 4);
    }

    if (token.octave === -1) {
      const dot = "•";
      const dotWidth = ctx.measureText(dot).width;
      const dotX = x + (pitchWidth - dotWidth) / 2;
      ctx.fillText(dot, dotX, yOffset + tokenDescent + 10);
    }

    if (token.mordent) {
      const symbol = "~";
      const symbolWidth = ctx.measureText(symbol).width;
      const symbolX = x + (pitchWidth - symbolWidth) / 2;
      ctx.fillText(symbol, symbolX, yOffset - tokenAscent - 18);
    }

    if (token.syllable) {
      const text = token.syllable;
      const textWidth = ctx.measureText(text).width;
      const textX = x + (pitchWidth - textWidth) / 2;
      ctx.fillText(text, textX, yOffset + tokenDescent + 24);
    }

    token.bbox = {
      x,
      y: yOffset - tokenAscent,
      width,
      height,
    };

    x += width;
  }

  // Cursor at end of line
  if (blink.visible && cursorIndex === tokens.length) {
    ctx.beginPath();
    ctx.moveTo(x - 1, yOffset - ascent);
    ctx.lineTo(x - 1, yOffset + descent);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // --- Draw slur arcs ---
  let slurStartX = null;
  let slurEndX = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === "leftSlur") {
      const next = tokens[i + 1];
      if (next?.bbox) {
        slurStartX = next.bbox.x;
      }
    }

    if (token.type === "rightSlur") {
      const prev = tokens[i - 1];
      if (prev?.bbox) {
        slurEndX = prev.bbox.x + prev.bbox.width;
      }

      if (slurStartX !== null && slurEndX !== null) {
        const arcY = yOffset - ascent - 16;
        const midX = (slurStartX + slurEndX) / 2;

        ctx.beginPath();
        ctx.moveTo(slurStartX, arcY);
        ctx.quadraticCurveTo(midX, arcY - 10, slurEndX, arcY);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      slurStartX = null;
      slurEndX = null;
    }
  }
}

