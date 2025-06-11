import * as selectionRenderer from "../canvas/selection-renderer.js";
import * as octaveRenderer from "../canvas/octave-renderer.js";
import { pitchCodeAndNotationToPitch } from "../models/notation-utils.js";
import { blink } from "../state.js";
import { drawSyllable } from "../canvas/drawSyllable.js";

function getCSSNumber(propName) {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(propName).trim()) || 0;
}

function getCSSValue(propName) {
  return getComputedStyle(document.documentElement).getPropertyValue(propName).trim();
}

export function render(canvas, composition, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const canvasFont = getCSSValue("--canvas-font");
  const lyricFont = getCSSValue("--lyric-font");

  ctx.font = lyricFont;
  const referenceMetrics = ctx.measureText("Mg");
  const refAscent = referenceMetrics.actualBoundingBoxAscent || 15;
  const refDescent = referenceMetrics.actualBoundingBoxDescent || 5;

  const yOffset = Math.floor(canvas.height / 2 + refAscent / 2);
  const referenceTopY = yOffset - refAscent;
  const globalUpperY = referenceTopY - 5;
  const xOffset = 20;

  const dotAbove = getCSSNumber("--octave-dot-above");
  const dotBelow = getCSSNumber("--octave-dot-below");
  const mordentAbove = getCSSNumber("--mordent-above");
  const syllableBelow = getCSSNumber("--syllable-below");
  const slurVerticalGap = getCSSNumber("--slur-vertical-gap");

  const tokens = composition.lines[0].tokens;
  const { cursorIndex, selection } = composition;

  selectionRenderer.render(ctx, tokens, selection);

  let x = xOffset;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    let text = token.text || "";

    if (token.type === "note") {
      text = pitchCodeAndNotationToPitch(token.pitchCode, token.notation);
    }
    if (token.type === "unknown" || typeof text !== "string") continue;

    ctx.font = canvasFont;
    const metrics = ctx.measureText(text);
    const width = Math.ceil(metrics.width) + 0.5;
    const ascent = metrics.actualBoundingBoxAscent || refAscent;
    const descent = metrics.actualBoundingBoxDescent || refDescent;

    const isSelected = selection?.start !== null &&
      selection?.end !== null &&
      i >= Math.min(selection.start, selection.end) &&
      i < Math.max(selection.start, selection.end);

    if (isSelected) {
      const top = yOffset - ascent - 15;
      const bottom = yOffset + descent + 20;
      ctx.fillStyle = "#0033cc";
      ctx.fillRect(x - 2, top, width + 4, bottom - top);
      ctx.fillStyle = "white";
    } else {
      ctx.fillStyle = "black";
    }

    if (blink.visible && cursorIndex === i) {
      drawCursor(ctx, x, yOffset, ascent, descent);
    }

    ctx.fillText(text, x, yOffset);

    if (token.octave === 1) {
      const cx = x + width / 2;
      octaveRenderer.renderUpper(ctx, cx, referenceTopY - 1, token);
    } else if (token.octave === -1) {
      const cx = x + width / 2;
      octaveRenderer.renderLower(ctx, cx, yOffset, token);
    }

    if (token.mordent) {
      const symbol = "~";
      const w = ctx.measureText(symbol).width;
      const symbolX = x + (width - w) / 2;
      ctx.fillText(symbol, symbolX, globalUpperY - 2);
    }

    if (token.syllable) {
      const syllableY = yOffset + descent + 3 + refAscent;
      drawSyllable(ctx, x, syllableY, token.syllable, lyricFont);
    }

    token.bbox = {
      x,
      y: yOffset - ascent - 15,
      width,
      height: ascent + descent + 35
    };

    x += width;
  }

  if (blink.visible && cursorIndex === tokens.length) {
    drawCursor(ctx, x, yOffset, refAscent, refDescent);
  }

  renderSlurs(ctx, tokens, yOffset - refAscent - slurVerticalGap);
}

function drawCursor(ctx, x, yOffset, ascent, descent) {
  ctx.beginPath();
  ctx.moveTo(x - 1, yOffset - ascent - 15);
  ctx.lineTo(x - 1, yOffset + descent + 20);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function renderSlurs(ctx, tokens, arcY) {
  let slurStartX = null;
  let slurEndX = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "leftSlur" && tokens[i + 1]?.bbox) {
      slurStartX = tokens[i + 1].bbox.x;
    }
    if (token.type === "rightSlur" && tokens[i - 1]?.bbox) {
      slurEndX = tokens[i - 1].bbox.x + tokens[i - 1].bbox.width;
      if (slurStartX !== null && slurEndX !== null) {
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

