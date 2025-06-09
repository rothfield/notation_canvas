import { blink } from "../state.js";
import * as selectionRenderer from "./selection-renderer.js";
import * as octaveRenderer from "./octave-renderer.js";
// canvas/composition.js

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
  ctx.font = lyricFont;
  const lyricMetrics = ctx.measureText("Mg");
  const lyricAscent = lyricMetrics.actualBoundingBoxAscent || 12;
  const lyricDescent = lyricMetrics.actualBoundingBoxDescent || 4;
  const lyricHeight = lyricAscent + lyricDescent;

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


selectionRenderer.render(ctx, tokens, selection);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const text = token.text || "";
    if (token.type === "unknown") continue;
    if (typeof text !== "string") continue;

    ctx.font = canvasFont;
  ctx.font = lyricFont;
  const lyricMetrics = ctx.measureText("Mg");
  const lyricAscent = lyricMetrics.actualBoundingBoxAscent || 12;
  const lyricDescent = lyricMetrics.actualBoundingBoxDescent || 4;
  const lyricHeight = lyricAscent + lyricDescent;

    const metrics = ctx.measureText(text);
    const width = Math.ceil(metrics.width) + 0.5;
    const tokenAscent = metrics.actualBoundingBoxAscent || ascent;
    const tokenDescent = metrics.actualBoundingBoxDescent || descent;
    const height = tokenAscent + tokenDescent;
    let highlightTop = yOffset - tokenAscent;
    let highlightBottom = yOffset + tokenDescent;
    highlightTop -= 15;
    highlightBottom += 20;

    const isSelected = selection?.start !== null &&
      selection?.end !== null &&
      i >= Math.min(selection.start, selection.end) &&
      i < Math.max(selection.start, selection.end);

    if (isSelected) {
      ctx.fillStyle = "#0033cc";
      ctx.fillRect(x - 2, highlightTop, width + 4, highlightBottom - highlightTop);
      ctx.fillStyle = "white";
    } else {
      ctx.fillStyle = "black";
    }

    if (blink.visible && cursorIndex === i) {
      const cursorTop = yOffset - tokenAscent - 15;
      const cursorBottom = yOffset + tokenDescent + 20;
      ctx.beginPath();
      ctx.moveTo(x - 1, cursorTop);
      ctx.lineTo(x - 1, cursorBottom);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.fillText(text, x, yOffset);
    const pitchWidth = width;

    if (token.octave === 1) {
      const centerX = x + ctx.measureText(token.text).width / 2;
      octaveRenderer.renderUpper(ctx, centerX, yOffset,token);
    }

    if (token.octave === -1) {
       const centerX = x + ctx.measureText(token.text).width / 2;
      octaveRenderer.renderLower(ctx, centerX, yOffset, token);
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
      const textX = x;
      const syllableY = yOffset + descent + 3 + lyricAscent;
      ctx.fillText(syll, textX, syllableY);
    }

    const fullTop = yOffset - tokenAscent - 15;
    const fullBottom = yOffset + tokenDescent + 20;
    token.bbox = {
      x,
      y: fullTop,
      width,
      height: fullBottom - fullTop,
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
