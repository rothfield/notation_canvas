import { blink } from "../state.js";

function drawUpperOctaveDot(ctx, centerX, yOffset, token) {
  const dot = "•";
  const dotWidth = ctx.measureText(dot).width;
  const metrics = ctx.measureText(token.text);
  const ascent = metrics.actualBoundingBoxAscent || 0;
  const dotX = centerX - dotWidth / 2;
  const dotY = yOffset - ascent - 1;  // dot sits just above the top of the character
  ctx.fillText(dot, dotX, dotY);
}

function zzdrawLowerOctaveDot(ctx, centerX, yOffset, token) {
  const dot = "•";
  const dotWidth = ctx.measureText(dot).width;
  const metrics = ctx.measureText(token.text);
  const ascent = metrics.actualBoundingBoxAscent || 0;
  const dotX = centerX - dotWidth / 2;
  const dotY = yOffset + ascent + 1 - dotWidth;  // dot sits just above the top of the character
  ctx.fillText(dot, dotX, dotY);
}


function drawLowerOctaveDot(ctx, centerX, yOffset, token) {
  const dot = "•";
  const dotWidth = ctx.measureText(dot).width;

  const metrics = ctx.measureText(token.text);
  const ascent = metrics.actualBoundingBoxAscent || 0;
  const descent = metrics.actualBoundingBoxDescent || 0;

  const dotX = centerX - dotWidth / 2;
  const dotY = yOffset + descent + 1 + dotWidth;  // dot sits just below the bounding box

  ctx.fillText(dot, dotX, dotY);
}



// Utility to read CSS variable as string or number
function getCSSValue(propName) {
  return getComputedStyle(document.documentElement).getPropertyValue(propName).trim();
}
function getCSSNumber(propName) {
  return parseFloat(getCSSValue(propName)) || 0;
}

export function render(canvas, composition) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //  const canvasFont = getCSSValue("--canvas-font");
  const lyricFont = getCSSValue("--lyric-font");
  const titleFont = getCSSValue("--title-font");
  const composerFont = getCSSValue("--composer-font");
  const canvasFont = getComputedStyle(document.documentElement)
  .getPropertyValue("--canvas-font")
  .trim();

  ctx.font = canvasFont;

  const sampleMetrics = ctx.measureText("M");
  const ascent = sampleMetrics.actualBoundingBoxAscent || 15;
  const descent = sampleMetrics.actualBoundingBoxDescent || 5;

  const xOffset = 20;
  const yOffset = Math.floor(canvas.height / 2 + ascent / 2);
  let x = xOffset;

  const tokens = composition.lines[0].tokens;
  const { cursorIndex, selection } = composition;

  const dotAbove = getCSSNumber("--octave-dot-above");
  const dotBelow = getCSSNumber("--octave-dot-below");
  const mordentAbove = getCSSNumber("--mordent-above");
  const syllableBelow = getCSSNumber("--syllable-below");
  const slurVerticalGap = getCSSNumber("--slur-vertical-gap");

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const text = token.text || "";
    if (token.type === "unknown") continue;
    if (typeof text !== "string") continue;

    ctx.font = canvasFont;

    const metrics = ctx.measureText(text);
    const width = Math.ceil(metrics.width) + 0.5;
    const tokenAscent = metrics.actualBoundingBoxAscent || ascent;
    const tokenDescent = metrics.actualBoundingBoxDescent || descent;
    const height = tokenAscent + tokenDescent;

    const isSelected = selection?.start !== null &&
      selection?.end !== null &&
      i >= Math.min(selection.start, selection.end) &&
      i < Math.max(selection.start, selection.end);

    ctx.fillStyle = isSelected ? "white" : "black";
    if (isSelected) {
      ctx.fillStyle = "#0033cc";
      ctx.fillRect(x - 2, yOffset - tokenAscent, width, height);
      ctx.fillStyle = "white";
    }

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
      const centerX = x + ctx.measureText(token.text).width / 2;
      drawUpperOctaveDot(ctx, centerX, yOffset,token);
    }

    if (token.octave === -1) {
       const centerX = x + ctx.measureText(token.text).width / 2;
      drawLowerOctaveDot(ctx, centerX, yOffset, token);
    }

    if (token.mordent) {
      const symbol = "~";
      const symbolWidth = ctx.measureText(symbol).width;
      const symbolX = x + (pitchWidth - symbolWidth) / 2;
      ctx.fillText(symbol, symbolX, yOffset - tokenAscent * mordentAbove);
    }

    if (token.syllable) {
      ctx.font = lyricFont;
      const syll = token.syllable;
      const textWidth = ctx.measureText(syll).width;
      const textX = x + (pitchWidth - textWidth) / 2;
      ctx.fillText(syll, textX, yOffset + tokenDescent * syllableBelow);
    }

    token.bbox = {
      x,
      y: yOffset - tokenAscent,
      width,
      height,
    };

    x += width;
  }

  if (blink.visible && cursorIndex === tokens.length) {
    ctx.beginPath();
    ctx.moveTo(x - 1, yOffset - ascent);
    ctx.lineTo(x - 1, yOffset + descent);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  let slurStartX = null;
  let slurEndX = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "leftSlur") {
      const next = tokens[i + 1];
      if (next?.bbox) slurStartX = next.bbox.x;
    }
    if (token.type === "rightSlur") {
      const prev = tokens[i - 1];
      if (prev?.bbox) slurEndX = prev.bbox.x + prev.bbox.width;

      if (slurStartX !== null && slurEndX !== null) {
        const arcY = yOffset - ascent - slurVerticalGap;
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
